import {Connection} from "./Connection";

export interface ResettableConnection extends Connection{
    reset(): void
}