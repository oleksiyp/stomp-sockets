import { StreamingService } from "./StreamingService";
import { StreamingConnection } from "./StreamingConnection";
import { Service } from "../api/Service";
import { StompCodec } from "../stomp/StompCodec";
import { ReconnectionPolicy } from "./reconnect/ReconnectionPolicy";
import { Connection } from "../api/Connection";
export declare class MultiplexStreamingClient implements MultiplexStreamingClient {
    private _connections;
    private _hostUrls;
    readonly _services: {
        [serviceName: string]: StreamingService;
    };
    readonly _connectHeaders: {
        [name: string]: string;
    };
    readonly _reconnectionPolicyFactory: (connections: Connection[]) => ReconnectionPolicy;
    readonly _codecFactory: (url: string) => StompCodec;
    constructor(hostUrls: (host: string) => string[], stompFactory: (url: string) => StompCodec, reconnectionPolicyFactory: (connections: StreamingConnection[]) => ReconnectionPolicy);
    connectHeader(name: string, value: string): MultiplexStreamingClient;
    connect(serviceName: string): Service;
    private getOrCreateService(serviceName);
    private getOrCreateConnection(url);
}
