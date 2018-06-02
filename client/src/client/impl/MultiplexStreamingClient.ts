import {StreamingService} from "./StreamingService";
import {StreamingConnection} from "./StreamingConnection";
import {Service} from "../api/Service";
import {StompCodec} from "../stomp/StompCodec";
import {ReconnectionPolicy} from "./reconnect/ReconnectionPolicy";
import {Connection} from "../api/Connection";

export class MultiplexStreamingClient implements MultiplexStreamingClient {
    private _connections: { [url: string]: StreamingConnection } = {};
    private _hostUrls: (host: string) => string[];
    public readonly _services: { [serviceName: string]: StreamingService } = {};
    public readonly _connectHeaders: { [name: string]: string } = {};
    public readonly _reconnectionPolicyFactory: (connections: Connection[]) => ReconnectionPolicy;
    public readonly _codecFactory: (url: string) => StompCodec;

    constructor(
        hostUrls: (host: string) => string[],
        stompFactory: (url: string) => StompCodec,
        reconnectionPolicyFactory: (connections: StreamingConnection[]) => ReconnectionPolicy
    ) {
        this._hostUrls = hostUrls;
        this._codecFactory = stompFactory;
        this._reconnectionPolicyFactory = reconnectionPolicyFactory;
    }

    public connectHeader(name: string, value: string): MultiplexStreamingClient {
        if (value !== undefined) {
            this._connectHeaders[name] = value
        } else {
            delete this._connectHeaders[name]
        }
        return this;
    }

    connect(serviceName: string): Service {
        return this.getOrCreateService(serviceName);
    }

    private getOrCreateService(serviceName: string) {
        let service = this._services[serviceName];
        if (service) return service;

        const urls = this._hostUrls(serviceName);
        const connections = urls.map(
            (url) => this.getOrCreateConnection(url)
        );

        service = new StreamingService(serviceName, this, connections);

        this._services[serviceName] = service;

        return service;
    }

    private getOrCreateConnection(url: string): StreamingConnection {
        let connection = this._connections[url];
        if (connection) return connection;

        connection = new StreamingConnection(url, this);

        this._connections[url] = connection;

        return connection;
    }
}

