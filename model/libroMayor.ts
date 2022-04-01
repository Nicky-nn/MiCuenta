import { DataTypes, Model } from "sequelize";
import DbConnection from "../classes/db-connection";

const connection = DbConnection.instance;
export default class LibroMayor extends Model {
    Detalle: any;
    SumaDebe: any;
    SumaHaber: any;
    idAsientoContables: any;
}
LibroMayor.init(
    {
        idLibroMayors: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        Detalle: DataTypes.STRING,
        SumaDebe: DataTypes.DECIMAL,
        SumaHaber: DataTypes.DECIMAL,
        idAsientoContables: DataTypes.INTEGER.UNSIGNED,
    },
    { sequelize: connection.sequelize, modelName: "libroMayor" }
);