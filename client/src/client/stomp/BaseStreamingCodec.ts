import {StreamingCodec} from "../api/StreamingCodec";
import {ConnectionStateNotifier} from "../api/ConnectionStateNotifier";
import {ConnectionState} from "../api/ConnectionState";
import {DataFrame} from "../api/DataFrame";

export abstract class BaseStreamingCodec implements StreamingCodec {
    protected _connectionStateNotifier: ConnectionStateNotifier<StreamingCodec>;
    protected _connectionState: ConnectionState;
    protected readonly _receiveCallbacks: ((frame: DataFrame) => void)[] = [];

    abstract send(frame: DataFrame): void

    protected notifyReceiveCallbacks(frame: DataFrame) {
        for (const cb of this._receiveCallbacks) {
            cb(frame)
        }
    }

    onReceive(receiveCb: (frame: DataFrame) => void): void {
        this._receiveCallbacks.push(receiveCb);
    }

    get connectionState(): ConnectionState {
        return this._connectionState;
    }

    get connectionStateNotifier(): ConnectionStateNotifier<StreamingCodec> {
        return this._connectionStateNotifier;
    }

    set connectionStateNotifier(value: ConnectionStateNotifier<StreamingCodec>) {
        if (this._connectionStateNotifier === value) return;
        this._connectionStateNotifier = value;
        if (this._connectionStateNotifier) {
            this._connectionStateNotifier.notifyState(this._connectionState, this);
        }
    }

    notifyConnectionState(state: ConnectionState) {
        if (this._connectionState === state) return;
        this._connectionState = state;
        if (this._connectionStateNotifier) {
            this._connectionStateNotifier.notifyState(this._connectionState, this);
        }
    }

    abstract close(): void
}