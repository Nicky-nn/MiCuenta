"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_connection_1 = __importDefault(require("../classes/db-connection"));
const connection = db_connection_1.default.instance;
class Cuenta extends sequelize_1.Model {
}
exports.default = Cuenta;
Cuenta.init({
    idCuenta: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    Nombre: sequelize_1.DataTypes.STRING,
    Tipo: sequelize_1.DataTypes.STRING,
    Debe: sequelize_1.DataTypes.DECIMAL,
    Haber: sequelize_1.DataTypes.DECIMAL,
    idAsientoContables: sequelize_1.DataTypes.INTEGER.UNSIGNED,
}, { sequelize: connection.sequelize, modelName: "cuenta" });
