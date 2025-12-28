import os from 'os';

export let localIP;

export default function getIP(){
    const interfaces = os.networkInterfaces();

    for (let type in interfaces){

        for (let i of interfaces[type]){

            if (i.family === "IPv4" && !i.internal){
                localIP = i.address;
                return i.address;
            }
        }
    }
}