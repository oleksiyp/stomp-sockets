import { StreamingConnection } from "./StreamingConnection";
import { StreamingSubscription } from "./StreamingSubscription";
import { FrameLedger } from "./FrameLedger";
import { DataFrame } from "../api/DataFrame";
import { MultiplexStreamingClient } from "./MultiplexStreamingClient";
import { Connection } from "../api/Connection";
import { Service } from "../api/Service";
export declare class StreamingService implements Service {
    private _serviceName;
    _subscribeHeaders: {
        [name: string]: string;
    };
    private _ledgers;
    private _client;
    private _reconnectionPolicy;
    _attachedConnection: StreamingConnection;
    private _offline;
    private _disconnectReceipt;
    constructor(serviceName: string, client: MultiplexStreamingClient, connections: Connection[]);
    connectionOpened(connection: StreamingConnection): void;
    connectionClosed(): void;
    reconnect(): void;
    readonly serviceName: string;
    subscribeHeader(name: string, value: string): StreamingService;
    subscribe(destination: string, frameCallback: (frame: DataFrame) => void): StreamingSubscription;
    receive(frame: DataFrame): void;
    private serviceConnected();
    serviceDisconnected(): void;
    close(): void;
    private getOrCreateLedger(destination);
    removeLedger(ledger: FrameLedger): void;
}
