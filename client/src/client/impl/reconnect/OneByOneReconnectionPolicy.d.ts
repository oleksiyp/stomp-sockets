import { ReconnectionPolicy } from "./ReconnectionPolicy";
import { StreamingConnection } from "../StreamingConnection";
export declare class OneByOneReconnectionPolicy implements ReconnectionPolicy {
    private _connections;
    private _idx;
    private _first;
    constructor(connections: StreamingConnection[]);
    nextConnection(): Promise<StreamingConnection>;
}
