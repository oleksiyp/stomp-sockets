import {OfflineNotifier} from "./OfflineNotifier";

export interface Subscription {
    destination: string;

    cancel(): void;

    send(destination: string,
         content: string,
         headers: { [key: string]: string },
         contentType: string
    ): void


    isOffline: boolean;

    onOfflineChanged(notifier: (newValue: boolean) => void): Subscription;

    addOfflineNotifier(notifier: OfflineNotifier): Subscription;

    removeOfflineNotifier(notifier: OfflineNotifier): Subscription;
}