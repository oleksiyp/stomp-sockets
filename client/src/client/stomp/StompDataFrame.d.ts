import { DataFrame } from "../api/DataFrame";
export declare class StompDataFrame implements DataFrame {
    command: string;
    content: string;
    headers: {
        [key: string]: string;
    };
    constructor(command: string, content: string, headers: {
        [key: string]: string;
    });
}
