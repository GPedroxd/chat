require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);

server.listen(process.env.PORT || 3000);

app.use(express.static(path.join(__dirname, 'public')));