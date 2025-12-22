import {Pool} from "pg";

const pool = new Pool({
    user: "postgres",
    host: "172.20.128.53",
    database:"Git-A-Thon_Database",
    password:"bvjs@2005",
    port:5400,
});

export default pool;