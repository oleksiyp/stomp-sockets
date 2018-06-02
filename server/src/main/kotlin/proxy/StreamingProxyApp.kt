package proxy

import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication

@SpringBootApplication
class StreamingProxyApp

fun main(args: Array<String>) {
    SpringApplication.run(StreamingProxyApp::class.java, *args)
}
