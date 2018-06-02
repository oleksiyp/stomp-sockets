
export function cloneObj(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
}

export function makeid(len: number = 8) {
    let id = "";
    const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < len; i++) {
        let pos = Math.floor(Math.random() * abc.length);
        id += abc.charAt(pos);
    }

    return id;
}