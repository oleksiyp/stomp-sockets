import {DataFrame} from "../api/DataFrame";

export class PongDataFrame implements DataFrame {
    command: string = "PONG";
    content: string = "";
    headers: { [p: string]: string } = {};
}