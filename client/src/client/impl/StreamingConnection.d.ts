import { Connection } from "../api/Connection";
import { StompCodec } from "../stomp/StompCodec";
import { MultiplexStreamingClient } from "./MultiplexStreamingClient";
import { StreamingService } from "./StreamingService";
import { ConnectionStateNotifier } from "../api/ConnectionStateNotifier";
import { ConnectionState } from "../api/ConnectionState";
export declare class StreamingConnection implements Connection, ConnectionStateNotifier<StompCodec> {
    private _url;
    private _client;
    _codec: StompCodec;
    private _attachedServices;
    constructor(url: string, client: MultiplexStreamingClient);
    readonly url: string;
    attach(service: StreamingService): void;
    detach(service: StreamingService): void;
    private isCodecState(state);
    notifyState(state: ConnectionState, associatedObject: StompCodec): void;
}
