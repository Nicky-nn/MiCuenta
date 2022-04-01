import { DataTypes, Model, Sequelize } from "sequelize";
import DbConnection from "../classes/db-connection";

const connection = DbConnection.instance;
export default class Cuenta extends Model {
    Nombre: any;
    Debe: any;
    Haber: any;
    idAsientoContables: any;
}
Cuenta.init(
    {
        idCuenta: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        Nombre: DataTypes.STRING,
        Tipo: DataTypes.STRING,
        Debe: DataTypes.DECIMAL,
        Haber: DataTypes.DECIMAL,
        idAsientoContables: DataTypes.INTEGER.UNSIGNED,
    },
    { sequelize: connection.sequelize, modelName: "cuenta" }
);
