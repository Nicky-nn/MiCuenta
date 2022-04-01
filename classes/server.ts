import express from "express";
import http from "http";

export default class Server {
    public app: express.Application;
    public port: number;
    private static _instance: Server;
    private httpServer: http.Server;

    private constructor() {
        this.app = express();
        this.port = 3000;
        this.httpServer = new http.Server(this.app);
        this.app.use(express.json());
    }

    public static get instance() {
        if (!this._instance) {
            this._instance = new Server();
        }
        return this._instance;
    }

    start(callback: () => void) {
        this.httpServer.listen(this.port, callback);
    }
}
