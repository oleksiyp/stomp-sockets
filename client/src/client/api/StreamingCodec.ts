import {DataFrame} from "./DataFrame";
import {ConnectionStateNotifier} from "./ConnectionStateNotifier";
import {ConnectionState} from "./ConnectionState";

export interface StreamingCodec {
    connectionState: ConnectionState

    connectionStateNotifier: ConnectionStateNotifier<StreamingCodec>

    send(frame: DataFrame): void

    onReceive(receiveCb: (frame: DataFrame) => void): void

    close(): void
}