import {Subscription} from "../api/Subscription";
import {DataFrame} from "../api/DataFrame";
import {FrameLedger} from "./FrameLedger";
import {StompDataFrames} from "../stomp/StompDataFrames";
import {OfflineNotifier} from "../api/OfflineNotifier";

export class StreamingSubscription implements Subscription {
    private readonly _frameCallback: (frame: DataFrame) => void;
    private _frameLedger: FrameLedger;
    private _offlineNotifiers: OfflineNotifier[];

    constructor(frameCallback: (frame: DataFrame) => void,
                frameLedger: FrameLedger) {
        this._frameCallback = frameCallback;
        this._frameLedger = frameLedger;
        this._offlineNotifiers = [];
    }

    get destination(): string {
        return this._frameLedger._destination;
    }

    receive(frame: DataFrame): void {
        this._frameCallback(frame)
    }

    send(destination: string,
         content: string,
         headers: { [key: string]: string } = {},
         contentType: string = "text/plain"
    ): void {
        this._frameLedger.send(
            StompDataFrames.send(
                destination,
                content,
                headers,
                contentType
            )
        );
    }

    cancel() {
        this._frameLedger.removeSubscription(this);
    }

    notifyOfflineChange() {
        for (const notifier of this._offlineNotifiers) {
            notifier.offlineChanged(this.isOffline);
        }
    }

    public onOfflineChanged(notifier: (newValue: boolean) => void): Subscription {
        this.addOfflineNotifier({ offlineChanged: notifier });
        return this;
    }

    public addOfflineNotifier(notifier: OfflineNotifier): Subscription {
        this._offlineNotifiers.push(notifier);
        return this;
    }

    public removeOfflineNotifier(notifier: OfflineNotifier): Subscription {
        this._offlineNotifiers = this._offlineNotifiers.filter(item => item != notifier);
        return this;
    }

    public get isOffline() {
        return this._frameLedger._offline;
    }
}