var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const connection = require('../config/config');

router.get("/API/getUsers", (req, resp) => {
    connection.query("select * from users", (err, result) => {
        if (err) {
            console.log('result not found');
        }
        else {
            resp.send(result);
        }
    })
});

router.get("/API/FetchUsers", (req, resp) => {
    connection.query("select * from users", (err, result) => {
        if (err) {
            console.log('result not found');
        }
        else {
            resp.send(result);
        }
    })
});

router.post("/API/AddUsers", (req, resp) => {
    let users = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password = bcrypt.hashSync(req.body.password, 10),
        cell: req.body.cell,
        fax: req.body.fax,
        gender: req.body.gender,
        date: req.body.date,
        zipcode: req.body.zipcode,
    }
    console.log(users);
    connection.query('INsert INTO users SET ?', users, (error, result, fields) => {
        let lastInsertId;
        if (error) {
            resp.send("failed to insert id an other table");
        }
        else {
            resp.send(result);
            lastInsertId = result.insertId;
            console.log('lastInsertId', lastInsertId);
        }
        let data = {
            houseNo: req.body.location[0].houseNo,
            city: req.body.location[0].city,
            state: req.body.location[0].state,
            country: req.body.location[0].country,
            userid: lastInsertId
        };
        console.log(data);
        connection.query(`INsert INTO userlocation SET ?`, data, (errors, results, fields) => {
            if (errors) {
                resp.send("failed to insert data userlocation table");
            } else {
                resp.send(results);
            }
        })
    })
});

router.put("/API/UpdateUser/:id", (req, resp) => {
    const data = [req.body.name, req.body.email, req.body.password, req.body.cell, req.body.address, req.params.id];
    connection.query("UPDATE users SET name = ?, email = ?, password = ?, cell = ?, address = ? where id = ?", data, (error, result, fields) => {
        if (error) error;
        resp.send(result);
    });
})

router.delete("/API/DeleteUser/:id", (req, resp) => {
    connection.query("DELETE FROM users WHERE id =" + req.params.id, (error, result, fields) => {
        if (error) error;
        resp.send(result);
    });
})

router.put("/API/UpdateMultipal", (req, resp) => {
    const data = [req.body.name, req.body.cell];
    idsArray = [42, 44];
    connection.query(`UPDATE users SET name = ?, cell = ? where id IN (${[idsArray]})`, data, (error, result, fields) => {
        console.log(error, result);
        if (error) error;
        resp.send(result);
    });
})

router.post('/API/LoginUser', async (req, resp) => {
    var email = req.body.email;
    var password = req.body.password;
    connection.query('SELECT * FROM users WHERE email = ?', [email], async function (error, results, fields) {
        if (error) error;
        else {
            if (results.length > 0) {
                const comparision = await bcrypt.compare(password, results[0].password);
                if (comparision) {
                    resp.send(results[0]);
                }
                else if (resp.status(400)) {
                    resp.send('Incorrect email and/or Password!');
                }
                resp.end();
            }
            else {
                resp.status(401).send('Invalid email or password.');
                resp.end();
            }
        }
    });
})

module.exports = router;