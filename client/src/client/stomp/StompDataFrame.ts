import {DataFrame} from "../api/DataFrame";

export class StompDataFrame implements DataFrame {
    command: string;
    content: string;
    headers: { [key: string]: string };

    constructor(
        command: string,
        content: string,
        headers: { [key: string]: string }
    ) {
        this.command = command;
        this.content = content;
        this.headers = headers;
    }
}