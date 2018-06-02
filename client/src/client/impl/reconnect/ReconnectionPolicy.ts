import {StreamingConnection} from "../StreamingConnection";

export interface ReconnectionPolicy {
    nextConnection(): Promise<StreamingConnection>
}

