package server

interface StreamingServer {
    val serviceName: String

    fun subscribe(
        destination: String,
        frameCallback: (DataFrame) -> Unit
    ): Subscription
}

