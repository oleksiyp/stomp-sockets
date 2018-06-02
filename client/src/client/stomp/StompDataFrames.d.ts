import { DataFrame } from "../api/DataFrame";
export declare class StompDataFrames {
    static connect(host: string, headers?: {
        [key: string]: string;
    }, acceptVersions?: string[], outgoingHeartbeats?: number, incomingHeartbeats?: number): DataFrame;
    static subscribe(destination: string, id: string, headers?: {
        [key: string]: string;
    }, ack?: string): DataFrame;
    static send(destination: string, content: string, headers?: {
        [key: string]: string;
    }, contentType?: string): DataFrame;
    static disconnect(receipt?: string, headers?: {
        [key: string]: string;
    }): DataFrame;
    static unsubscribe(id: string, headers?: {
        [key: string]: string;
    }): DataFrame;
}
