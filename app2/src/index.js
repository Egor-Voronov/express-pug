const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(bodyParser.urlencoded({extended: true}));

const users = [];

app.get('/', (req, res) => {
    res.render('home', {activeRoute: req.originalUrl});
});

app.get('/promo', (req, res) => {
    res.render('promo', {activeRoute: req.originalUrl});
});

app.get('/catalog', (req, res) => {
    res.render('catalog', {activeRoute: req.originalUrl});
});

app.get('/login', (req, res) => {
    res.render('login', {activeRoute: req.originalUrl});
});

app.post('/login', (req, res) => {
    const {username, password} = req.body;
    const user = users.find((user) => user.username === username);

    if (!user) {
        res.status(401).render('login', {
            error: 'Invalid username or password',
            activeRoute: req.originalUrl,
        });
        return;
    }

    bcrypt.compare(password, user.password, (err, result) => {
        if (err || !result) {
            res.status(401).render('login', {
                error: 'Invalid username or password',
                activeRoute: req.originalUrl,
            });
            return;
        }

        req.session.user = user;

        res.redirect('/');
    });
});

app.get('/registration', (req, res) => {
    res.render('registration', {activeRoute: req.originalUrl});
});

app.post('/registration', (req, res) => {
    const {login, email, username, password, confirm} = req.body;

    if (users.find((user) => user.username === username)) {
        res.status(409).render('registration', {
            error: 'User with this username already exists',
            activeRoute: req.originalUrl,
        });
        return;
    }

    if (password !== confirm) {
        res.status(400).render('registration', {
            error: 'Passwords do not match',
            activeRoute: req.originalUrl,
        });
        return;
    }

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        users.push({login, email, username, password: hash});

        res.redirect('/login');
    });
});

const port = 8080;

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});