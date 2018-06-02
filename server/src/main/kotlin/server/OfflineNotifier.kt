package server

interface OfflineNotifier {
    fun offlineChanged(newValue: Boolean)
}