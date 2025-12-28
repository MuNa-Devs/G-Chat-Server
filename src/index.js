import express from 'express';
import cors from 'cors';
import http from 'http';
import path from 'path';
import getIP from './get_my_ip.js';

import router from './endpoints/Routes.js';
import socketSetup from './sockets/global_chat.js';

const ip = getIP();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/g-chat", router);
app.use("/files", express.static(path.join(process.cwd(), "files")));

const server = http.createServer(app);

socketSetup(server);

server.listen(5500, "0.0.0.0", () => {
    console.log("Backend running on LAN");
    console.log("Running locally - http://localhost:5500");
    console.log(`Running on LAN - http://${ip}:5500`);
});