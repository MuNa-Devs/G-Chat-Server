import {Pool} from "pg";

const pool = new Pool({
    user: "postgres",
    host: "172.20.138.7",
    database:"G-CONNECT",
    password:"naidu@2005",
    port:5432,
});

export default pool;