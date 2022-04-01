"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = 3000;
        this.httpServer = new http_1.default.Server(this.app);
        this.app.use(express_1.default.json());
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new Server();
        }
        return this._instance;
    }
    start(callback) {
        this.httpServer.listen(this.port, callback);
    }
}
exports.default = Server;
