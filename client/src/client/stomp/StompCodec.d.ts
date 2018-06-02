import { DataFrame } from "../api/DataFrame";
import { BaseStreamingCodec } from "./BaseStreamingCodec";
export declare abstract class StompCodec extends BaseStreamingCodec {
    static LF: string;
    static NULL: string;
    static SPLIT_FRAMES_REGEXP: RegExp;
    static HEADER_CONTENT_DIVIDER_REGEXP: RegExp;
    static TRIM_REGEXP: RegExp;
    partialContent: string;
    private static escape(str);
    private static unescape(str);
    private static parseFrame(data);
    protected decode(data: string): DataFrame[];
    protected encode(frame: DataFrame): any;
    private static sizeOfUTF8(content);
}
