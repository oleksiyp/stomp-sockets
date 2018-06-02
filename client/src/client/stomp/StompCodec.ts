import {DataFrame} from "../api/DataFrame";
import {StompDataFrame} from "./StompDataFrame";
import {BaseStreamingCodec} from "./BaseStreamingCodec";

export abstract class StompCodec extends BaseStreamingCodec {
    static LF = "\x0A";
    static NULL = "\x00";

    static SPLIT_FRAMES_REGEXP = RegExp(StompCodec.NULL + StompCodec.LF + "*");
    static HEADER_CONTENT_DIVIDER_REGEXP = RegExp(StompCodec.LF + StompCodec.LF);
    static TRIM_REGEXP = /^\s+|\s+$/g

    partialContent = "";

    private static escape(str: string): string {
        return ("" + str)
            .replace(/\\/g, "\\\\")
            .replace(/\r/g, "\\r")
            .replace(/\n/g, "\\n")
            .replace(/:/g, "\\c")
    }

    private static unescape(str: string): string {
        return ("" + str)
            .replace(/\\r/g, "\r")
            .replace(/\\n/g, "\n")
            .replace(/\\c/g, ":")
            .replace(/\\\\/g, "\\")
    }

    private static parseFrame(data: string): DataFrame {
        const divider = data.search(StompCodec.HEADER_CONTENT_DIVIDER_REGEXP);
        const headerLines = data.substring(0, divider).split(StompCodec.LF);
        const command = headerLines.shift();
        const headers: { [key: string]: string } = {};

        function trim(str: string): string {
            return str.replace(StompCodec.TRIM_REGEXP, '')
        }

        const doUnescaping = !(command === "CONNECT" || command === "CONNECTED");

        for (const line of headerLines.reverse()) {
            const idx = line.indexOf(":");

            let key = line.substring(0, idx);
            let value = line.substring(idx + 1);

            if (doUnescaping) {
                key = StompCodec.unescape(key);
                value = StompCodec.unescape(value);
            }

            key = trim(key);
            value = trim(value);

            headers[key] = value;
        }

        let body = "";
        const start = divider + 2;

        if (headers['content-length']) {
            const len = parseInt(headers['content-length']);
            body = ('' + data).substring(start, start + len);
        } else {
            for (let i = start; i < data.length; i++) {
                const chr = data.charAt(i);
                if (chr === StompCodec.NULL[0]) {
                    break;
                }
                body += chr
            }
        }

        return new StompDataFrame(command, body, headers);
    }


    protected decode(data: string): DataFrame[] {
        data = this.partialContent + data;

        const frameStrs = data.split(StompCodec.SPLIT_FRAMES_REGEXP);

        const frames = frameStrs
            .slice(0, -1)
            .map((str) =>
                StompCodec.parseFrame(str)
            );

        const lastFrameStr = frameStrs[frameStrs.length - 1];

        if (lastFrameStr == StompCodec.LF || lastFrameStr.search(StompCodec.SPLIT_FRAMES_REGEXP) != -1) {
            frames.push(StompCodec.parseFrame(lastFrameStr));
            this.partialContent = "";
        } else {
            this.partialContent = lastFrameStr
        }

        return frames;
    }

    protected encode(frame: DataFrame): any {
        const lines = [frame.command];

        const skipContentLength = (frame.headers['content-length'] == 'skip');

        const doEscaping = !(frame.command === "CONNECT" || frame.command === "CONNECTED");

        Object.keys(frame.headers).forEach(key => {
            if (key == 'content-length' && skipContentLength) {
                return
            }

            let value = frame.headers[key];

            if (doEscaping) {
                key = StompCodec.escape(key);
                value = StompCodec.escape(value);
            }

            lines.push(key + ":" + value)
        });


        if (frame.content && !skipContentLength) {
            lines.push("content-length:" + StompCodec.sizeOfUTF8(frame.content));
        }

        lines.push(StompCodec.LF + frame.content);

        return lines.join(StompCodec.LF) + StompCodec.NULL
    }

    private static sizeOfUTF8(content: string) {
        if (content) {
            return encodeURI(content).match(/%..|./g).length
        } else {
            return 0
        }
    }

}
