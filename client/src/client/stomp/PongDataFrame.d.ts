import { DataFrame } from "../api/DataFrame";
export declare class PongDataFrame implements DataFrame {
    command: string;
    content: string;
    headers: {
        [p: string]: string;
    };
}
