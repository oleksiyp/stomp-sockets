import {StreamingConnection} from "./StreamingConnection";
import {StreamingSubscription} from "./StreamingSubscription";
import {FrameLedger} from "./FrameLedger";
import {DataFrame} from "../api/DataFrame";
import {ReconnectionPolicy} from "./reconnect/ReconnectionPolicy";
import {MultiplexStreamingClient} from "./MultiplexStreamingClient";
import {Connection} from "../api/Connection";
import {Service} from "../api/Service";
import {StompDataFrames} from "../stomp/StompDataFrames";
import {makeid} from "../Utils";


export class StreamingService implements Service {
    private _serviceName: string;
    public _subscribeHeaders: { [name: string]: string } = {};
    private _ledgers: { [destination: string]: FrameLedger } = {};
    private _client: MultiplexStreamingClient;
    private _reconnectionPolicy: ReconnectionPolicy;
    public _attachedConnection: StreamingConnection;
    private _offline: boolean = true
    private _disconnectReceipt: string = null;

    constructor(
        serviceName: string,
        client: MultiplexStreamingClient,
        connections: Connection[]
    ) {
        this._serviceName = serviceName;
        this._client = client;
        this._reconnectionPolicy = client._reconnectionPolicyFactory(connections);

        this.reconnect()
    }

    connectionOpened(connection: StreamingConnection) {
        this._attachedConnection = connection;
        connection._codec.send(
            StompDataFrames.connect(this.serviceName, this._client._connectHeaders)
        )
    }

    connectionClosed() {
        this._attachedConnection = null;
        this.serviceDisconnected();
        this.reconnect()
    }

    reconnect() {
        this._reconnectionPolicy.nextConnection()
            .then(connection => connection.attach(this));
    }

    get serviceName(): string {
        return this._serviceName;
    }

    public subscribeHeader(name: string, value: string): StreamingService {
        if (value !== undefined) {
            this._subscribeHeaders[name] = value
        } else {
            delete this._subscribeHeaders[name]
        }
        return this;
    }

    public subscribe(
        destination: string,
        frameCallback: (frame: DataFrame) => void
    ): StreamingSubscription {
        const ledger = this.getOrCreateLedger(destination);
        return ledger.addSubscription(frameCallback);
    }

    public receive(frame: DataFrame): void {
        switch (frame.command) {
            case "CONNECTED": this.serviceConnected(); break;
            case "RECEIPT":
                if (this._disconnectReceipt == frame.headers['receipt-id']) {
                    this._disconnectReceipt = null;
                    this.serviceDisconnected();
                }
                break;
        }
    }

    private serviceConnected() {
        if (!this._offline) return;
        this._offline = false;
        for (const destination of Object.keys(this._ledgers)) {
            let ledger = this._ledgers[destination] as FrameLedger;
            ledger.serviceConnected();
        }
    }

    public serviceDisconnected(): void {
        if (this._offline) return;
        this._offline = true;
        for (const destination of Object.keys(this._ledgers)) {
            let ledger = this._ledgers[destination] as FrameLedger;
            ledger.serviceDisconnected();
        }
        if (Object.keys(this._ledgers).length == 0) {
            const connection = this._attachedConnection;
            if (connection != null) {
                connection.detach(this);
            }
        }
    }

    public close(): void {
        if (this._disconnectReceipt != null) {
            return;
        }
        if (this._attachedConnection == null) {
            return;
        }

        for (const destination of Object.keys(this._ledgers)) {
            let ledger = this._ledgers[destination] as FrameLedger;
            ledger.serviceClosed();
        }

        this._disconnectReceipt = makeid();
        this._attachedConnection._codec.send(
            StompDataFrames.disconnect(
                this._disconnectReceipt
            )
        )
    }


    private getOrCreateLedger(destination: string): FrameLedger {
        let ledger = this._ledgers[destination];
        if (ledger != null) return ledger;

        ledger = new FrameLedger(destination, this);
        if (!this._offline) {
            ledger.serviceConnected()
        }

        this._ledgers[destination] = ledger;

        return ledger
    }

    removeLedger(ledger: FrameLedger) {
        delete this._ledgers[ledger._destination];
        if (Object.keys(this._ledgers).length == 0) {
            this.close()
        }
    }
}