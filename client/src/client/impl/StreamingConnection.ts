import {Connection} from "../api/Connection";
import {StompCodec} from "../stomp/StompCodec";
import {DataFrame} from "../api/DataFrame";
import {MultiplexStreamingClient} from "./MultiplexStreamingClient";
import {StreamingService} from "./StreamingService";
import {ConnectionStateNotifier} from "../api/ConnectionStateNotifier";
import {ConnectionState} from "../api/ConnectionState";

export class StreamingConnection implements Connection, ConnectionStateNotifier<StompCodec> {
    private _url: string;
    private _client: MultiplexStreamingClient;
    public _codec: StompCodec;
    private _attachedServices: StreamingService[] = [];

    constructor(
        url: string,
        client: MultiplexStreamingClient
    ) {
        this._url = url;
        this._client = client;
    }


    get url(): string {
        return this._url;
    }

    attach(service: StreamingService) {
        if (this._codec == null) {
            this._codec = this._client._codecFactory(this._url);
            this._codec.connectionStateNotifier = this;
            this._codec.onReceive((frame: DataFrame) => {
                let host = frame.headers['host'];

                let service = this._client._services[host];

                if (service && this._attachedServices.indexOf(service) != -1) {
                    service.receive(frame)
                }
            })
        }

        this._attachedServices.push(service);

        if (this._codec.connectionState == ConnectionState.OPENED) {
            service.connectionOpened(this);
        }
    }


    detach(service: StreamingService) {
        this._attachedServices = this._attachedServices.filter(item => item != service);
        if (this._attachedServices.length == 0) {
            if (this._codec != null) {
                this._codec.close();
                this._codec = null;
            }
        }
    }

    private isCodecState(state: ConnectionState) {
        return this._codec != null && this._codec.connectionState == state;
    }

    notifyState(state: ConnectionState, associatedObject: StompCodec): void {
        if (state == ConnectionState.OPENED) {
            for (const service of this._attachedServices) {
                service.connectionOpened(this);
            }
        } else if (state == ConnectionState.CLOSED) {
            let services = [];
            for (const service of this._attachedServices) {
                services.push(service);
            }
            this._codec = null;
            this._attachedServices = [];
            for (const service of services) {
                service.connectionClosed();
            }
        }
    }
}