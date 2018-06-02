package proxy

import io.netty.buffer.ByteBuf
import io.netty.channel.ChannelHandlerContext
import io.netty.handler.codec.MessageToMessageCodec
import io.netty.handler.codec.http.websocketx.BinaryWebSocketFrame
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame
import io.netty.handler.codec.http.websocketx.WebSocketFrame

class WebSocketContentCodec : MessageToMessageCodec<WebSocketFrame, ByteBuf>() {
    override fun decode(ctx: ChannelHandlerContext, msg: WebSocketFrame, out: MutableList<Any>) {
        val buf = msg.content()
        buf.retain()
        out.add(buf)
    }

    override fun encode(ctx: ChannelHandlerContext, msg: ByteBuf, out: MutableList<Any>) {
        msg.retain()
        out.add(TextWebSocketFrame(msg))
    }
}
