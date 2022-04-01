import { DataTypes, Model } from "sequelize";
import DbConnection from "../classes/db-connection";

const connection = DbConnection.instance;
export default class AsientoContable extends Model {
    idAsientoContables: any;
    Fecha: any;
    Descripcion: any;
    idLibroMayors: any;
}
AsientoContable.init(
    {
        idAsientoContables: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        Fecha: DataTypes.DATE,
        Descripcion: DataTypes.STRING,
    },
    { sequelize: connection.sequelize, modelName: "asientoContable" }
);
