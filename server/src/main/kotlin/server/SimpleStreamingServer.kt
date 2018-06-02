package server

import io.netty.bootstrap.ServerBootstrap
import io.netty.buffer.ByteBuf
import io.netty.buffer.ByteBufUtil
import io.netty.channel.*
import io.netty.channel.ChannelHandlerContext
import io.netty.channel.nio.NioEventLoopGroup
import io.netty.channel.socket.nio.NioServerSocketChannel
import io.netty.handler.codec.http.*
import io.netty.handler.codec.http.websocketx.WebSocketServerProtocolHandler
import io.netty.handler.codec.stomp.*
import io.netty.handler.logging.LogLevel
import io.netty.handler.logging.LoggingHandler
import proxy.WebSocketContentCodec


class SimpleStreamingServer(
    private val httpPort: Int,
    override val serviceName: String
) : StreamingServer {
    init {
        val bootstrap = ServerBootstrap()
            .group(NioEventLoopGroup(1), NioEventLoopGroup())
            .channel(NioServerSocketChannel::class.java)
            .childHandler(ProxyChannelInitializer({ StompProxyHandler() }))

        bootstrap.bind(httpPort)
            .sync()
            .channel()
            .closeFuture()
            .sync()
    }

    override fun subscribe(destination: String, frameCallback: (DataFrame) -> Unit): Subscription {
        return StreamingSubscripton(destination, frameCallback)
    }

    inner class StompProxyHandler() : SimpleChannelInboundHandler<StompFrame>() {
        override fun channelRead0(ctx: ChannelHandlerContext, msg: StompFrame) {
            when (msg.command()) {
                StompCommand.CONNECT -> {
                    val reply = DefaultStompFrame(StompCommand.CONNECTED)
                    val host = msg.headers().getAsString("host")
                    reply.headers().set("host", host)
                    ctx.writeAndFlush(reply)
                }
                StompCommand.SUBSCRIBE -> {

                }
                else -> throw RuntimeException("unknown command")
            }
        }
    }
}

class StreamingSubscripton(
    override val destination: String,
    frameCallback: (DataFrame) -> Unit
) : Subscription {
    override var isOffline: Boolean = true

    override fun cancel() {

    }

    override fun send(
        destination: String,
        content: String,
        headers: Map<String, String>,
        contentType: String
    ) {

    }

    override fun onOfflineChanged(notifier: (newValue: Boolean) -> Unit): Subscription {
        return addOfflineNotifier(object : OfflineNotifier {
            override fun offlineChanged(newValue: Boolean) {
                notifier(newValue);
            }
        })
    }

    override fun addOfflineNotifier(notifier: OfflineNotifier): Subscription {
    }

    override fun removeOfflineNotifier(notifier: OfflineNotifier): Subscription {
    }

}


class ProxyChannelInitializer(
    private val finalHandlerFactory: () -> ChannelHandler
) : ChannelInitializer<Channel>() {
    override fun initChannel(ch: Channel) {
        val pipeline = ch.pipeline()
        pipeline.addLast("httpServerCodec", HttpServerCodec())
        pipeline.addLast("httpAggregator", HttpObjectAggregator(50 * 1024))
//        pipeline.addLast("wsCompressor", WebSocketServerCompressionHandler())
        pipeline.addLast("logHandler", LoggingHandler(LogLevel.INFO))
        pipeline.addLast(
            "wsProtocolHandler",
            WebSocketServerProtocolHandler(
                "/ws",
                null,
                true
            )
        )
        pipeline.addLast("stompOutStreamer", WebSocketContentCodec())
        pipeline.addLast("stompDecoder", StompSubframeDecoder())
        pipeline.addLast("stompEncoder", StompSubframeEncoder())
        pipeline.addLast("stompAggregator", StompSubframeAggregator(50 * 1024));
        pipeline.addLast("proxyHandler", finalHandlerFactory())
    }
}
