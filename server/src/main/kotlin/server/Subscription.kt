package server

interface Subscription {
    val destination: String

    fun cancel()

    fun send(
        destination: String,
        content: String,
        headers: Map<String, String> = mapOf(),
        contentType: String = "text/plain"
    )

    val isOffline: Boolean
    fun onOfflineChanged(notifier: (newValue: Boolean) -> Unit): Subscription;
    fun addOfflineNotifier(notifier: OfflineNotifier): Subscription;
    fun removeOfflineNotifier(notifier: OfflineNotifier): Subscription;
}