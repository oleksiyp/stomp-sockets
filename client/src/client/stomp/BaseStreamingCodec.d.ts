import { StreamingCodec } from "../api/StreamingCodec";
import { ConnectionStateNotifier } from "../api/ConnectionStateNotifier";
import { ConnectionState } from "../api/ConnectionState";
import { DataFrame } from "../api/DataFrame";
export declare abstract class BaseStreamingCodec implements StreamingCodec {
    protected _connectionStateNotifier: ConnectionStateNotifier<StreamingCodec>;
    protected _connectionState: ConnectionState;
    protected readonly _receiveCallbacks: ((frame: DataFrame) => void)[];
    abstract send(frame: DataFrame): void;
    protected notifyReceiveCallbacks(frame: DataFrame): void;
    onReceive(receiveCb: (frame: DataFrame) => void): void;
    readonly connectionState: ConnectionState;
    connectionStateNotifier: ConnectionStateNotifier<StreamingCodec>;
    notifyConnectionState(state: ConnectionState): void;
    abstract close(): void;
}
