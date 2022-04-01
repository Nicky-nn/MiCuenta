"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_connection_1 = __importDefault(require("../classes/db-connection"));
const connection = db_connection_1.default.instance;
class AsientoContable extends sequelize_1.Model {
}
exports.default = AsientoContable;
AsientoContable.init({
    idAsientoContables: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    Fecha: sequelize_1.DataTypes.DATE,
    Descripcion: sequelize_1.DataTypes.STRING,
}, { sequelize: connection.sequelize, modelName: "asientoContable" });
