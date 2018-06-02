package proxy

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import server.SimpleStreamingServer

@Configuration
class ProxyConfig {
    @Value("\${proxy.port:3080}")
    var httpPort = 0

    @Bean
    fun proxy() = SimpleStreamingServer(httpPort)
}