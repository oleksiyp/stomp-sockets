import {Service} from "./Service";

export interface StreamingClient {
    connectHeader(name: string, value: string): StreamingClient

    connect(serviceName: string): Service
}