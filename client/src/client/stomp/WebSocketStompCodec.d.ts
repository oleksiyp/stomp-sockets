import { DataFrame } from "../api/DataFrame";
import { StompCodec } from "./StompCodec";
export declare class WebSocketStompCodec extends StompCodec {
    private ws;
    constructor(ws: WebSocket);
    private convertBinaryFrame(data);
    send(frame: DataFrame): void;
    close(): void;
}
