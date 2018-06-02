import {Subscription} from "./Subscription";
import {DataFrame} from "./DataFrame"

export interface Service {
    serviceName: string

    subscribe(
        destination: string,
        frameCallback: (frame: DataFrame) => void
    ): Subscription

    close(): void
}