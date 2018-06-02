import { Subscription } from "../api/Subscription";
import { DataFrame } from "../api/DataFrame";
import { FrameLedger } from "./FrameLedger";
import { OfflineNotifier } from "../api/OfflineNotifier";
export declare class StreamingSubscription implements Subscription {
    private readonly _frameCallback;
    private _frameLedger;
    private _offlineNotifiers;
    constructor(frameCallback: (frame: DataFrame) => void, frameLedger: FrameLedger);
    readonly destination: string;
    receive(frame: DataFrame): void;
    send(destination: string, content: string, headers?: {
        [key: string]: string;
    }, contentType?: string): void;
    cancel(): void;
    notifyOfflineChange(): void;
    onOfflineChanged(notifier: (newValue: boolean) => void): Subscription;
    addOfflineNotifier(notifier: OfflineNotifier): Subscription;
    removeOfflineNotifier(notifier: OfflineNotifier): Subscription;
    readonly isOffline: boolean;
}
