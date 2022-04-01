"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class DbConnection {
    constructor() {
        this.sequelize = new sequelize_1.Sequelize("mysql://root@127.0.0.1:3306/micuenta"); // Example for sqlite
    }
    static get instance() {
        if (!DbConnection._instance) {
            DbConnection._instance = new DbConnection();
        }
        return DbConnection._instance;
    }
}
exports.default = DbConnection;
