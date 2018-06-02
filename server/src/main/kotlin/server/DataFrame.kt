package server

interface DataFrame {
    val command: String
    val headers: Map<String, String>
    val content: String
}