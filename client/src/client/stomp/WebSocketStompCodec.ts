import {ConnectionState} from "../api/ConnectionState";
import {PongDataFrame} from "./PongDataFrame";
import {DataFrame} from "../api/DataFrame";
import {StompCodec} from "./StompCodec";

export class WebSocketStompCodec extends StompCodec {
    private ws: WebSocket;

    constructor(ws: WebSocket) {
        super();

        const self = this;

        this.ws = ws;
        this.notifyConnectionState(ConnectionState.OPENING);

        ws.binaryType = "arraybuffer";
        ws.onopen = (ev: any) => {
            this.notifyConnectionState(ConnectionState.OPENED);
        };
        ws.onmessage = (ev: MessageEvent) => {
            const data = this.convertBinaryFrame(ev.data);

            if (data == WebSocketStompCodec.LF) {
                this.notifyReceiveCallbacks(new PongDataFrame());
                return
            }

            const frames = self.decode(data)

            for (const frame of frames) {
                this.notifyReceiveCallbacks(frame);
            }
        };
        ws.onerror = (ev: ErrorEvent) => {
        };
        ws.onclose = (ev: CloseEvent) => {
            this.notifyConnectionState(ConnectionState.CLOSED);
        };
    }

    private convertBinaryFrame(data: any): string {
        if (typeof(ArrayBuffer) != 'undefined' && data instanceof ArrayBuffer) {
            const arr = new Uint8Array(data);
            const chars: string[] = [];
            arr.forEach((c) => chars.push(String.fromCharCode(c)));
            return chars.join("");
        } else {
            return data
        }
    }

    send(frame: DataFrame): void {
        let data = this.encode(frame);
        this.ws.send(data);
    }

    close() {
        if (this._connectionState == ConnectionState.CLOSED ||
            this._connectionState == ConnectionState.CLOSING) {
            return;
        }

        this.notifyConnectionState(ConnectionState.CLOSING);
        this.ws.close()
    }
}