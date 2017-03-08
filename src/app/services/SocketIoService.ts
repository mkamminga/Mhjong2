import * as io from "socket.io-client";

export class SocketIoService {
    public create (url:string): SocketIOClient.Socket {
        return io(url);
    }
}