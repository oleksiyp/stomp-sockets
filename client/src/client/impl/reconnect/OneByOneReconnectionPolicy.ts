import {ReconnectionPolicy} from "./ReconnectionPolicy";
import {StreamingConnection} from "../StreamingConnection";

export class OneByOneReconnectionPolicy implements ReconnectionPolicy {
    private _connections: StreamingConnection[];
    private _idx: number = 0;
    private _first = true;

    constructor(connections: StreamingConnection[]) {
        this._connections = connections;
    }

    nextConnection(): Promise<StreamingConnection> {
        let conn = this._connections[this._idx++ % this._connections.length];

        if (this._first) {
            this._first = false;
            return Promise.resolve(conn);
        } else {
            return new Promise<StreamingConnection>((resolve, reject) => {
                setTimeout(() => resolve(conn), 500)
            })
        }
    }
}