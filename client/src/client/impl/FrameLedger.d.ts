import { StreamingSubscription } from "./StreamingSubscription";
import { DataFrame } from "../api/DataFrame";
import { StreamingService } from "./StreamingService";
export declare class FrameLedger {
    private _id;
    _destination: string;
    private _subscriptions;
    _service: StreamingService;
    _offline: boolean;
    private _sendQ;
    constructor(destination: string, service: StreamingService);
    addSubscription(frameCallback: (frame: DataFrame) => void): StreamingSubscription;
    removeSubscription(subcription: StreamingSubscription): void;
    private noSubscriptions();
    serviceConnected(): void;
    serviceDisconnected(): void;
    serviceClosed(): void;
    receive(frame: DataFrame): void;
    send(frame: DataFrame): void;
    private notifyOfflineChange();
}
