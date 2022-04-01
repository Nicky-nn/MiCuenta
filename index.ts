import express from "express";
import DbConnection from "./classes/db-connection";
import Server from "./classes/server";
import AsientoContable from "./model/asientoContable";
import Cuenta from "./model/cuenta";
import LibroMayor from "./model/libroMayor";

async function probarConexion(connection: DbConnection) {
    try {
        await connection.sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
}

const connection = DbConnection.instance;
probarConexion(connection);

const server = Server.instance;
server.start(() => {
    console.log(
        `Server in port ${server.port}! || http://localhost:${server.port}`
    );
});

server.app.get("/", (req, res) => {
    res.send("Hello World!");
});

AsientoContable.hasMany(LibroMayor, { foreignKey: "idAsientoContables" });
LibroMayor.belongsTo(AsientoContable, { foreignKey: "idAsientoContables" });

AsientoContable.hasMany(Cuenta, { foreignKey: "idAsientoContables" });
Cuenta.belongsTo(AsientoContable, { foreignKey: "idAsientoContables" });

//
server.app.post("/asientoContable", async (req, res) => {
    await connection.sequelize.sync();
    try {
        const asientoContable = await AsientoContable.create(req.body);
        res.send(asientoContable);
        res.statusMessage = "Asiento Contable created successfully";
        console.log("Asiento Contable created successfully");
    } catch (error) {
        res.send(error);
        res.statusMessage = "Error creating Asiento Contable";
    }
});

// create Cuenta
server.app.post("/cuenta", async (req, res) => {
    await connection.sequelize.sync();
    const cuenta = await Cuenta.create(req.body);
    try {
        await cuenta.save();
        res.json(cuenta.toJSON());
        res.send("Cuenta creada");
    } catch (error) {
        console.log(error);
    }
});

// create LibroMayor
server.app.post("/libroMayor", async (req, res) => {
    await connection.sequelize.sync();
    const libroMayor = await LibroMayor.create(req.body);
    try {
        res.json(libroMayor.toJSON());
        res.send("Libro Mayor created successfully");
    } catch (error) {
        console.log(error);
    }
});

// read asientoContable
server.app.get("/asientoContable", async (req, res) => {
    await connection.sequelize.sync();
    const asientoContable = await AsientoContable.findAll();
    const cuenta = await Cuenta.findAll({});
    res.json({ asientoContable });
});

// read for id asientoContable
server.app.get("/asientoContable/:id", async (req, res) => {
    await connection.sequelize.sync();
    const asientoContable = await AsientoContable.findAll({
        where: { idAsientoContables: req.params.id },
    });

    let idDeAsiento = 0;
    for (const libro of asientoContable) {
        idDeAsiento = libro.idAsientoContables;
    }
    const cuenta = await Cuenta.findAll({
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
    } else {
        res.status(404).send("No existe el asiento Contable");
    }
});

// read all cuenta
server.app.get("/cuenta", async (req, res) => {
    await connection.sequelize.sync();
    const cuenta = await Cuenta.findAll({ include: [AsientoContable] });
    if (cuenta.length > 0) {
        res.json(cuenta);
    } else {
        res.status(404).send("No existe la cuenta");
    }
});

// read for id cuenta
server.app.get("/cuenta/:id", async (req, res) => {
    await connection.sequelize.sync();
    const cuenta = await Cuenta.findAll({
        where: {
            idCuenta: req.params.id,
        },
        include: [AsientoContable],
    });
    if (cuenta.length > 0) {
        res.json(cuenta);
    } else {
        res.status(404).send("No existe la cuenta");
    }
});

server.app.get("/libroMayor/", async (req, res) => {
    await connection.sequelize.sync();
    const libroMayor = await LibroMayor.findAll({
        include: [AsientoContable],
    });
    const cuenta = await Cuenta.findAll({});

    if (libroMayor.length > 0) {
        res.json({ libroMayor, cuenta });
    } else {
        res.status(404).send("No existe el libro mayor");
    }
});

server.app.get("/libroMayor/:id", async (req, res) => {
    await connection.sequelize.sync();
    const libroMayor = await LibroMayor.findAll({
        where: {
            idLibroMayors: req.params.id,
        },
        include: [AsientoContable],
    });
    let idDeAsiento = 0;
    for (const libro of libroMayor) {
        idDeAsiento = libro.idAsientoContables;
    }
    const cuenta = await Cuenta.findAll({
        where: {
            idAsientoContables: idDeAsiento,
        },
    });

    if (libroMayor.length > 0) {
        res.json({ libroMayor, cuenta });
    } else {
        res.status(404).send("No existe el libro mayor");
    }
});

// update asientoContable
server.app.put("/asientoContable/editar/:id", async (req, res) => {
    await connection.sequelize.sync();
    try {
        const asiento = await AsientoContable.findByPk(req.params.id);
        if (asiento) {
            await asiento.update(req.body);
            res.send(asiento);
            res.statusMessage = "Asiento Contable updated successfully";
        } else {
            res.send("Cuenta no encontrada");
        }
    } catch (error) {
        res.send(error);
        res.statusMessage = "Error updating Asiento Contable";
    }
});

// update cuenta
server.app.put("/cuenta/editar/:id", async (req, res) => {
    try {
        await connection.sequelize.sync();
        const cuenta = await Cuenta.findByPk(req.params.id);
        if (cuenta) {
            await cuenta.update(req.body);
            res.send(cuenta).status(200);
            res.statusMessage = "Cuenta updated successfully";
        } else {
            res.send("Cuenta no encontrada").status(404);
        }
    } catch (error) {
        res.send(error);
        res.statusMessage = "Error updating Cuenta";
    }
});

// update libroMayor
server.app.put("/libroMayor/editar/:id", async (req, res) => {
    try {
        await connection.sequelize.sync();
        const libroMayor = await LibroMayor.findByPk(req.params.id);
        if (libroMayor) {
            await libroMayor.update(req.body);
            res.send(libroMayor).status(200);
            res.statusMessage = "Libro Mayor updated successfully";
        } else {
            res.send("Libro Mayor no encontrada").status(404);
        }
    } catch (error) {
        res.send(error);
        res.statusMessage = "Error updating Libro Mayor";
    }
});

// delete asientoContable
server.app.delete("/asientoContable/eliminar/:id", async (req, res) => {
    await connection.sequelize.sync();
    const asiento = await AsientoContable.findByPk(req.params.id);
    if (asiento) {
        await asiento.destroy();
        res.send(asiento).status(200);
        res.statusMessage = "Asiento Contable deleted successfully";
    } else {
        res.send("Asiento Contable no encontrada").status(404);
    }
});

// delete cuenta
server.app.delete("/cuenta/eliminar/:id", async (req, res) => {
    const cuenta = await Cuenta.findByPk(req.params.id);
    if (cuenta) {
        await cuenta.destroy();
        res.send("Cuenta eliminada");
    } else {
        res.send("Cuenta no encontrada");
    }
});

// delete libroMayor
server.app.delete("/libroMayor/eliminar/:id", async (req, res) => {
    await connection.sequelize.sync();
    const libroMayor = await LibroMayor.findByPk(req.params.id);
    if (libroMayor) {
        await libroMayor.destroy();
        res.send("Libro Mayor eliminado");
    } else {
        res.send("Libro Mayor no encontrado");
    }
});
