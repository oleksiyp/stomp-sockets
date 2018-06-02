import {Clients} from "./client/Clients";

function test() {
    const client = Clients.multiplexStompForUrl("ws://localhost:3080/ws");
    const service = client.connect("eg1");
    service.subscribe("/dest1", (frame) => console.log(frame));
    setTimeout(() => service.close(), 1000)
}

const init = test();
