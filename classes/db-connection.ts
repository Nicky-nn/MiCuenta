import { Sequelize } from "sequelize";

export default class DbConnection {
    public sequelize: Sequelize;
    private static _instance: DbConnection;
    private constructor() {
        this.sequelize = new Sequelize("mysql://root@127.0.0.1:3306/micuenta"); // Example for sqlite
    }
    public static get instance() {
        if (!DbConnection._instance) {
            DbConnection._instance = new DbConnection();
        }
        return DbConnection._instance;
    }
}
