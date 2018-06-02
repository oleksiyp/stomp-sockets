import {StreamingClient} from "./api/StreamingClient";
import {MultiplexStreamingClient} from "./impl/MultiplexStreamingClient";
import {OneByOneReconnectionPolicy} from "./impl/reconnect/OneByOneReconnectionPolicy";
import {StompCodecs} from "./stomp/StompCodecs";

export class Clients {
    static multiplexStompForUrl(url: string): StreamingClient {
        return new MultiplexStreamingClient(
            () => [url],
            (url) => StompCodecs.over(new WebSocket(url)),
            (connections) => new OneByOneReconnectionPolicy(connections)
        )
    }
}


