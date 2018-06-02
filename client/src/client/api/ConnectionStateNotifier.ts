import {ConnectionState} from "./ConnectionState";

export interface ConnectionStateNotifier<T> {
    notifyState(state: ConnectionState, associatedObject: T): void
}