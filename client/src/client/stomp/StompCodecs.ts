import {WebSocketStompCodec} from "./WebSocketStompCodec";
import {StompCodec} from "./StompCodec";

export class StompCodecs {
    static over(ws: WebSocket): StompCodec {
        return new WebSocketStompCodec(ws)
    }
}