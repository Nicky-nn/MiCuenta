"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_connection_1 = __importDefault(require("../classes/db-connection"));
const connection = db_connection_1.default.instance;
class LibroMayor extends sequelize_1.Model {
}
exports.default = LibroMayor;
LibroMayor.init({
    idLibroMayors: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    Detalle: sequelize_1.DataTypes.STRING,
    SumaDebe: sequelize_1.DataTypes.DECIMAL,
    SumaHaber: sequelize_1.DataTypes.DECIMAL,
    idAsientoContables: sequelize_1.DataTypes.INTEGER.UNSIGNED,
}, { sequelize: connection.sequelize, modelName: "libroMayor" });
