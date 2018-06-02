import {DataFrame} from "../api/DataFrame";
import {StompDataFrame} from "./StompDataFrame";
import {cloneObj} from "../Utils";

export class StompDataFrames {
    static connect(
        host: string,
        headers: { [key: string]: string } = {},
        acceptVersions: string[] = ["1.2"],
        outgoingHeartbeats: number = 0,
        incomingHeartbeats: number = 0
    ): DataFrame {
        const headersCopy = cloneObj(headers);

        headersCopy["host"] = host;
        headersCopy["accept-version"] = acceptVersions.join(",");

        incomingHeartbeats = Math.round(incomingHeartbeats);
        outgoingHeartbeats = Math.round(outgoingHeartbeats);

        if (incomingHeartbeats != 0 || outgoingHeartbeats != 0) {
            headersCopy["heart-beat"] = outgoingHeartbeats + "," + incomingHeartbeats;
        }

        return new StompDataFrame("CONNECT", "", headersCopy)
    }

    static subscribe(
        destination: string,
        id: string,
        headers: { [key: string]: string } = {},
        ack: string = undefined
    ): DataFrame {
        const headersCopy = cloneObj(headers);

        headersCopy["destination"] = destination;
        headersCopy["id"] = id;

        if (ack != null) {
            headersCopy["ack"] = ack;
        }

        return new StompDataFrame("SUBSCRIBE", "", headersCopy)
    }

    static send(
        destination: string,
        content: string,
        headers: { [key: string]: string } = {},
        contentType: string = "text/plain"
    ): DataFrame {
        const headersCopy = cloneObj(headers);

        headersCopy['content-type'] = contentType;

        return new StompDataFrame("SEND", content, headersCopy);
    }

    static disconnect(
        receipt: string = null,
        headers: { [key: string]: string } = {}
    ): DataFrame {
        const headersCopy = cloneObj(headers);

        if (receipt != null) {
            headersCopy['receipt'] = receipt;
        }

        return new StompDataFrame("DISCONNECT", "", headersCopy);
    }

    static unsubscribe(
        id: string,
        headers: { [key: string]: string } = {}
    ): DataFrame {
        const headersCopy = cloneObj(headers);

        headersCopy['id'] = id;

        return new StompDataFrame("UNSUBSCRIBE", "", headersCopy);
    }
}