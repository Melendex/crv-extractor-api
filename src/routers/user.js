const express = require("express");
const sql = require('mssql');
const router = new express.Router();
const connectionSQL = require("./../db/connSQL");
const User = require('./../model/user');
const Pais = require('./../model/pais');
const Catalogo = require('./../model/catalogos');
const auth = require('./../middleware/auth');

let pool;
const createPool = async() => {
    pool = await connectionSQL();
};
createPool();

router.get("/users", async(req, res) => {
    try {
        const users = await pool.request().query("SELECT * FROM Users");

        res.send(users.recordset);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.post("/users", async(req, res) => {
    const { name, lastname } = req.body;

    try {
        if (!name || !lastname) throw new Error('Missing data!');

        const newUSer = await pool.request()
            .input('name', sql.VarChar, name)
            .input('lastname', sql.VarChar, lastname)
            .query("INSERT INTO Users (name,lastName) VALUES (@name, @lastname)");
        console.log(newUSer);

        res.status(201).send('Usuario Creado');
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.patch("/users/:id", async(req, res) => {
    const { name, lastname } = req.body;
    const { id } = req.params;
    try {
        if (!name || !lastname || !id) throw new Error('Missing data!');

        await pool.request()
            .input('id', sql.Int, id)
            .input('name', sql.VarChar, name)
            .input('lastname', sql.VarChar, lastname)
            .query("UPDATE Users SET name = @name, lastname = @lastname WHERE id = @id");

        res.status(200).send("Actualizado 😎");
    } catch (err) {
        res.status(400).send(err);
    }
});

router.delete("/users/:id", async(req, res) => {
    const { id } = req.params;

    try {
        await pool.request()
            .input('id', sql.Int, id)
            .query("DELETE FROM Users WHERE id = @id");

        res.send("Eliminado 🗑️");
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post("/users/signup", async(req, res) => {
    try {
        const { name, lastname, email, password } = req.body;
        const signup = new User({
            name: name,
            lastname: lastname,
            email: email,
            password: password
        });
        await signup.save();
        res.status(201).send({
            signup: {
                name: signup.name,
                lastname: signup.lastname,
                email: signup.email,
            },
        });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post("/users/logout", auth, async(req, res) => {
    // Enviar peticion de Logout, elimina el token actual

    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.currentToken;
        });

        await req.user.save();
        res.send();
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});

router.post("/users/logoutall", auth, async(req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send();
    }
});

router.post("/users/login", async(req, res) => {
    try {
        const user = await User.findUserByCredentials(
            req.body.email,
            req.body.password
        );

        const token = await user.generateAuthToken();

        res.send({ user: user, token });
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});

router.get("/users/procedure/:lastname", auth, async(req, res) => {
    try {
        const { lastname } = req.params;


        const result = await pool.request()
            .input('lastname', sql.VarChar, lastname)
            .execute('getUsersLike');

        res.send(result.recordset);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.patch("/users/procedure/:id", auth, async(req, res) => {
    try {
        const { id } = req.params;
        const { name, lastname } = req.body;


        const result = await pool.request()
            .input('id', sql.Int, parseInt(id))
            .input('name', sql.VarChar, name)
            .input('lastname', sql.VarChar, lastname)
            .execute('updateUser');

        res.send(result.recordset);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.get('/users/test', auth, async(req, res) => {
    try {
        const result = await pool.request()
            .output('pais')
            .execute('[ADMI_getAllUsuario]');

        // const paises = result.recordset;

        // const catalogo = new Catalogo({
        //     name: 'paises',
        //     data: paises
        // });

        // const pais = new Pais({
        //     etiqueta: item.etiqueta,
        //     codigo: item.codigo,
        //     abreviatura: item.abreviatura,
        //     eliminar: item.eliminar,
        //     creado_por: item.creado_por,
        //     fecha_registro: item.fecha_registro,
        //     modificado_por: item.modificado_por,
        //     fecha_revision: item.fecha_revision,
        //     codigo_inegi: item.codigo_inegi,
        //     paraiso_fiscal: item.paraiso_fiscal
        // });

        // await catalogo.save();

        res.status(200).send(result.output);
    } catch (err) {
        res.status(400).send(err.message);
    }
})

module.exports = router;