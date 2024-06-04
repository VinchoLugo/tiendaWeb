const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const MySQLStore = require('express-mysql-session')(session);
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const conexion = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: "3306"
});

const sessionStore = new MySQLStore({}, conexion);

app.use(session({
  key: 'session_cookie_name',
  secret: '1234',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://127.0.0.1:5500',
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['X-Requested-With', 'Content-Type'],
  credentials: true
}));

app.use(express.static(path.join(__dirname, '..', 'frontend')));

const pageRouter = require("./routes/pagesRoutes");
const steamRoutes = require('./routes/steamRoutes');


app.use('/', pageRouter);
app.use('/steam', steamRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
