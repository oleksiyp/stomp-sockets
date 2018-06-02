import {StreamingSubscription} from "./StreamingSubscription";
import {DataFrame} from "../api/DataFrame";
import {StompDataFrames} from "../stomp/StompDataFrames";
import {StreamingService} from "./StreamingService";
import {makeid} from "../Utils";

export class FrameLedger {
    private _id: string = makeid();
    public _destination: string;
    private _subscriptions: StreamingSubscription[] = [];
    public _service: StreamingService;
    _offline: boolean = true;
    private _sendQ: DataFrame[];

    constructor(destination: string, service: StreamingService) {
        this._destination = destination;
        this._service = service;
        this._sendQ = [];
    }

    public addSubscription(frameCallback: (frame: DataFrame) => void): StreamingSubscription {
        let subscription = new StreamingSubscription(frameCallback, this);
        this._subscriptions.push(subscription);
        return subscription;
    }

    public removeSubscription(subcription: StreamingSubscription) {
        this._subscriptions = this._subscriptions.filter((item) => item != subcription)
        if (this._subscriptions.length == 0) {
            this.noSubscriptions()
        }
    }

    private noSubscriptions() {
        if (!this._offline) {
            let connection = this._service._attachedConnection;

            connection._codec.send(
                StompDataFrames.unsubscribe(this._id)
            )
        }

        this._service.removeLedger(this)
    }

    serviceConnected() {
        if (!this._offline) return;
        let connection = this._service._attachedConnection;

        connection._codec.send(
            StompDataFrames.subscribe(
                this._destination,
                this._id,
                this._service._subscribeHeaders
            )
        );

        for (const frame of this._sendQ) {
            connection._codec.send(frame)
        }
        this._sendQ = [];
        this._offline = false;
        this.notifyOfflineChange()
    }

    serviceDisconnected() {
        if (this._offline) return;
        this._offline = true;
        this.notifyOfflineChange();
    }

    serviceClosed() {
        this.serviceDisconnected();
        this._subscriptions = [];
        this._sendQ = [];
    }

    receive(frame: DataFrame): void {
        if (frame.command === "MESSAGE") {
            for (const subscription of this._subscriptions) {
                subscription.receive(frame);
            }
        }
    }

    send(frame: DataFrame): void {
        if (this._offline) {
            this._sendQ.push(frame)
        } else {
            this._service._attachedConnection._codec.send(frame)
        }
    }

    private notifyOfflineChange() {
        for (const subscription of this._subscriptions) {
            subscription.notifyOfflineChange()
        }
    }

}