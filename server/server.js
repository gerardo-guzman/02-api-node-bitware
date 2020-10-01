const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const util = require('util');
const { User } = require('../models/users.model');

const app = express();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'DBNode',
    port: 3306
});

const query = util.promisify(connection.query).bind(connection);

connection.connect(err => {
    if (err) throw err;
    console.log('conexion exitosa de bd');
});

//midlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/nutriNET/clientes', (req, res) => {

    const queryGet = 'SELECT * FROM users';
    const {name, lastanme} = req.body;
    console.log(req.body)
    console.log(name);
    connection.query(queryGet, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.status(200).json({
                clients: result,
                name,
                lastanme
            });
        } else {
            res.status(204).json({
                cveError: 0,
                cveMessage: 'No hay ningun usuario'
            })
        }
        return;
    });  

});

app.get('/nutriNET/clientes/:id', (req, res) => {
    const id = req.params.id;
    const queryGet = `SELECT * from users WHERE clientId = ${id}`;
    connection.query(queryGet, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.status(200).json({
                cveError: 0,
                cveMessage: 'usuario encontrado',
                client: result
            });
        } else {
            res.status(204).json({
                cveError: 0,
                cveMessage: 'No existe el usuario consultado'
            });
        }
    }); 

});

app.post('/nutriNET/new', async (req, res) => {

    const querySet = 'INSERT INTO users SET ?';
    const {
        username,
        password ,
        name,
        lastname,
        email,
        age,
        height = 0,
        weight = 0,
        imc = 0,
        geb = 0,
        eta = 0,
        creationDate = new Date().toLocaleDateString(),
        updateDate = new Date().toLocaleDateString(),
    } = req.body;
    if (!username || !password || !name || !lastname || !email || !age) {
        res.status(400).json({
            cveError: -1,
            cveMessage: 'bad Request: username, password, name, lastname, email and age are required'
        });
        return;
    }
    const queryGet = `SELECT * FROM users where username = '${username}'`;
    const firstcheck = (await query(queryGet/*, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.json({
                mssg: 'Ya existe un usuario con este username'
            });
        }
    }*/))[0];
    if (firstcheck) {
        res.status(406).json({
            cveError: -1,
            cveMessage: `the user '${username}' already exists`
        });
        return;
    }

    const newUser = {
        username,
        password,
        name,
        lastname,
        email,
        age,
        height,
        weight,
        imc,
        geb,
        eta,
        creationDate,
        updateDate
    };
    connection.query(querySet, newUser, err => {
        if (err) {
            throw err;
        }
        res.status(201).json({
            cveMessage: 'Usuario creado correctamente',
            newUser,
            cveError: 0,
        });
    }); 
});

app.put('/nutriNET/cliente/:id', function (req, res) {
    const id = req.params.id;
    const {
        username = '',
        password = '',
        name = '',
        lastname = '',
        email = '',
        age = -1,
        height = -1,
        weight = -1,
        imc = -1,
        geb = -1,
        eta = -1,
    } = req.body;
    if (username === '') {
        res.status(400).json({
            cveError: -1,
            cveMessage: 'bad Request: username is required'
        });
        return;
    }
    const userQ = (username==='')?'':`username = '${username}' `;
    const pwdQ = (password==='')?'':`, password = '${password}' `;
    const nameQ = (username==='')?'':`, name = '${name}' `;
    const lastnameQ = (lastname==='')?'':`, lastname = '${lastname}' `;
    const emailQ = (email==='')?'':`, email = '${email}' `;
    const ageQ = (age===-1)?'':`, age = '${age}' `;
    const heightQ = (height===-1)?'':`, height = '${height}' `;
    const weightrQ = (weight==='')?'':`, weight = '${weight}' `;
    const imcQ = (imc==='')?'':`, imc = '${imc}' `;
    const gebQ = (geb==='')?'':`, geb = '${geb}' `;
    const etaQ = (eta==='')?'':`, eta = '${eta}' `;
    const updateQ = `, updateDate = '${new Date().toLocaleDateString()}' `;
    const queryPut = `UPDATE users SET `+userQ+pwdQ+nameQ+lastnameQ+emailQ+ageQ+heightQ+weightrQ+imcQ+gebQ+etaQ+updateQ+` WHERE clientId = ${id}`;
    console.log(queryPut);
    connection.query(queryPut, err => {
        if (err) throw err;
        res.status(200).json({
            cveError: 0,
            cveMessage: `Usuario id: ${id} actualizado`
        });
    })
});

app.delete('/nutriNET/cliente/:id', function (req, res) {
    const id = req.params.id;
    const queryDel = `DELETE FROM users WHERE clientId = ${id}`;
    connection.query(queryPut, err => {
        if (err) throw err;
        res.status(200).json({
            cveError: 0,
            cveMessage: `Usuario id: ${id} Eliminado`
        });
    });
});
 
//GETClients


app.listen(3000, () => {
    console.log('Escuchando puerto 3000');
});

