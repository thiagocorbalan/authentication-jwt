import express from 'express';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';

const app = express();

const SECRET_TOKEN = 'S#wHP47ICo!0!2cZ';

app.use(bodyParser.json());

const verifyJWT = (req, res, next) => {
    const token = req.headers['x-access-token'];
    const index = invalidTokens.findIndex(item => item === token);

    if(index !== -1) return res.status(401).end();

    jwt.verify(token, SECRET_TOKEN, (err, decoded) => {
        if(err) return res.status(401).end();

        req.userId = decoded.userId;
        next();
    })
}

app.get('/', (req, res) => {
    res.send({ message: 'Hello World'});
});

app.get('/clientes', verifyJWT, (req, res) => {
    res.send({ message: 'Lista de clientes'});
});

app.post('/login', (req, res) => {
    const { user, password } = req.body;

    if (user === 'thiago' && password === '123456') {
        //JWT create token
        const token = jwt.sign(
            { userId: 1},
            SECRET_TOKEN,
            { expiresIn: 120 }
        );

        return res.send({ auth: true, token, message: 'Login com sucesso'});
    }
    res.status(401).end();
});

const invalidTokens = [];

app.post('/logout', (req, res) => {
    invalidTokens.push(req.headers['x-access-token']);
    res.send({ message: 'Logout com sucesso'});
});

app.listen(3000, () => {
    console.log('App listening on port 3000');
});