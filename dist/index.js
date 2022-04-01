"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_connection_1 = __importDefault(require("./classes/db-connection"));
const server_1 = __importDefault(require("./classes/server"));
const asientoContable_1 = __importDefault(require("./model/asientoContable"));
const cuenta_1 = __importDefault(require("./model/cuenta"));
const libroMayor_1 = __importDefault(require("./model/libroMayor"));
function probarConexion(connection) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield connection.sequelize.authenticate();
            console.log("Connection has been established successfully.");
        }
        catch (error) {
            console.error("Unable to connect to the database:", error);
        }
    });
}
const connection = db_connection_1.default.instance;
probarConexion(connection);
const server = server_1.default.instance;
server.start(() => {
    console.log(`Server in port ${server.port}! || http://localhost:${server.port}`);
});
server.app.get("/", (req, res) => {
    res.send("Hello World!");
});
asientoContable_1.default.hasMany(libroMayor_1.default, { foreignKey: "idAsientoContables" });
libroMayor_1.default.belongsTo(asientoContable_1.default, { foreignKey: "idAsientoContables" });
asientoContable_1.default.hasMany(cuenta_1.default, { foreignKey: "idAsientoContables" });
cuenta_1.default.belongsTo(asientoContable_1.default, { foreignKey: "idAsientoContables" });
//
server.app.post("/asientoContable", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield connection.sequelize.sync();
    try {
        const asientoContable = yield asientoContable_1.default.create(req.body);
        res.send(asientoContable);
        res.statusMessage = "Asiento Contable created successfully";
        console.log("Asiento Contable created successfully");
    }
    catch (error) {
        res.send(error);
        res.statusMessage = "Error creating Asiento Contable";
    }
}));
// create Cuenta
server.app.post("/cuenta", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield connection.sequelize.sync();
    const cuenta = yield cuenta_1.default.create(req.body);
    try {
        yield cuenta.save();
        res.json(cuenta.toJSON());
        res.send("Cuenta creada");
    }
    catch (error) {
        console.log(error);
    }
}));
// create LibroMayor
server.app.post("/libroMayor", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield connection.sequelize.sync();
    const libroMayor = yield libroMayor_1.default.create(req.body);
    try {
        res.json(libroMayor.toJSON());
        res.send("Libro Mayor created successfully");
    }
    catch (error) {
        console.log(error);
    }
}));
// read asientoContable
server.app.get("/asientoContable", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield connection.sequelize.sync();
    const asientoContable = yield asientoContable_1.default.findAll();
    const cuenta = yield cuenta_1.default.findAll({});
    res.json({ asientoContable });
}));
// read for id asientoContable
server.app.get("/asientoContable/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield connection.sequelize.sync();
    const asientoContable = yield asientoContable_1.default.findAll({
        where: { idAsientoContables: req.params.id },
    });
    let idDeAsiento = 0;
    for (const libro of asientoContable) {
        idDeAsiento = libro.idAsientoContables;
    }
    const cuenta = yield cuenta_1.default.findAll({
        where: {
            idAsientoContables: idDeAsiento,
        },
    });
    // Sumar los Debe y Haber
    let sumaDebe = 0;
    let sumaHaber = 0;
    for (const cuent of cuenta) {
        sumaDebe += parseFloat(cuent.Debe);
        sumaHaber += parseFloat(cuent.Haber);
    }
    const total = {
        sumaDebe,
        sumaHaber,
    };
    if (asientoContable.length > 0) {
        res.json({ asientoContable, cuenta, total });
    }
    else {
        res.status(404).send("No existe el asiento Contable");
    }
}));
// read all cuenta
server.app.get("/cuenta", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield connection.sequelize.sync();
    const cuenta = yield cuenta_1.default.findAll({ include: [asientoContable_1.default] });
    if (cuenta.length > 0) {
        res.json(cuenta);
    }
    else {
        res.status(404).send("No existe la cuenta");
    }
}));
// read for id cuenta
server.app.get("/cuenta/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield connection.sequelize.sync();
    const cuenta = yield cuenta_1.default.findAll({
        where: {
            idCuenta: req.params.id,
        },
        include: [asientoContable_1.default],
    });
    if (cuenta.length > 0) {
        res.json(cuenta);
    }
    else {
        res.status(404).send("No existe la cuenta");
    }
}));
server.app.get("/libroMayor/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield connection.sequelize.sync();
    const libroMayor = yield libroMayor_1.default.findAll({
        include: [asientoContable_1.default],
    });
    const cuenta = yield cuenta_1.default.findAll({});
    if (libroMayor.length > 0) {
        res.json({ libroMayor, cuenta });
    }
    else {
        res.status(404).send("No existe el libro mayor");
    }
}));
server.app.get("/libroMayor/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield connection.sequelize.sync();
    const libroMayor = yield libroMayor_1.default.findAll({
        where: {
            idLibroMayors: req.params.id,
        },
        include: [asientoContable_1.default],
    });
    let idDeAsiento = 0;
    for (const libro of libroMayor) {
        idDeAsiento = libro.idAsientoContables;
    }
    const cuenta = yield cuenta_1.default.findAll({
        where: {
            idAsientoContables: idDeAsiento,
        },
    });
    if (libroMayor.length > 0) {
        res.json({ libroMayor, cuenta });
    }
    else {
        res.status(404).send("No existe el libro mayor");
    }
}));
// update asientoContable
server.app.put("/asientoContable/editar/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield connection.sequelize.sync();
    try {
        const asiento = yield asientoContable_1.default.findByPk(req.params.id);
        if (asiento) {
            yield asiento.update(req.body);
            res.send(asiento);
            res.statusMessage = "Asiento Contable updated successfully";
        }
        else {
            res.send("Cuenta no encontrada");
        }
    }
    catch (error) {
        res.send(error);
        res.statusMessage = "Error updating Asiento Contable";
    }
}));
// update cuenta
server.app.put("/cuenta/editar/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connection.sequelize.sync();
        const cuenta = yield cuenta_1.default.findByPk(req.params.id);
        if (cuenta) {
            yield cuenta.update(req.body);
            res.send(cuenta).status(200);
            res.statusMessage = "Cuenta updated successfully";
        }
        else {
            res.send("Cuenta no encontrada").status(404);
        }
    }
    catch (error) {
        res.send(error);
        res.statusMessage = "Error updating Cuenta";
    }
}));
// update libroMayor
server.app.put("/libroMayor/editar/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connection.sequelize.sync();
        const libroMayor = yield libroMayor_1.default.findByPk(req.params.id);
        if (libroMayor) {
            yield libroMayor.update(req.body);
            res.send(libroMayor).status(200);
            res.statusMessage = "Libro Mayor updated successfully";
        }
        else {
            res.send("Libro Mayor no encontrada").status(404);
        }
    }
    catch (error) {
        res.send(error);
        res.statusMessage = "Error updating Libro Mayor";
    }
}));
// delete asientoContable
server.app.delete("/asientoContable/eliminar/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield connection.sequelize.sync();
    const asiento = yield asientoContable_1.default.findByPk(req.params.id);
    if (asiento) {
        yield asiento.destroy();
        res.send(asiento).status(200);
        res.statusMessage = "Asiento Contable deleted successfully";
    }
    else {
        res.send("Asiento Contable no encontrada").status(404);
    }
}));
// delete cuenta
server.app.delete("/cuenta/eliminar/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cuenta = yield cuenta_1.default.findByPk(req.params.id);
    if (cuenta) {
        yield cuenta.destroy();
        res.send("Cuenta eliminada");
    }
    else {
        res.send("Cuenta no encontrada");
    }
}));
// delete libroMayor
server.app.delete("/libroMayor/eliminar/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield connection.sequelize.sync();
    const libroMayor = yield libroMayor_1.default.findByPk(req.params.id);
    if (libroMayor) {
        yield libroMayor.destroy();
        res.send("Libro Mayor eliminado");
    }
    else {
        res.send("Libro Mayor no encontrado");
    }
}));
