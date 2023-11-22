import { createPool, createConnection } from "mysql2/promise";
import { readFile } from "fs/promises";

//Credenciales de la base de datos de mysql
export const pool = createPool({
    host: 'localhost',
    port: 3306,
    user: 'root', //Como no esta configutado un usuario por defecto es 'root'
    password: 'root', //Como no hay contraseña se pone un string vacio
    database: 'euforia' //Nombre de la base de datos
})

async function initDatabase(){
    const con = await createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root', //Como no esta configutado un usuario por defecto es 'root'
        password: 'root', //Como no hay contraseña se pone un string vacio
    });
    const [database] = await con.query("SELECT SCHEMA_NAME FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = 'euforia';");
    if(database.length == 0){
        const [creation] = await con.query("CREATE DATABASE IF NOT EXISTS euforia");
        await con.query("USE euforia");
        let ddl = await readFile('./database/DDLsis.sql', 'utf8')
        let queries = ddl.split(';');
        for(let query of queries) {
            if(query.trim() != ''){
                await con.query(query);
            }
        }
        let dml = await readFile('./database/DML_sis.sql', 'utf8');
        queries = dml.split(';');
        for(let query of queries) {
            if(query.trim() != ''){
                await con.query(query);
            }
        }
        console.log('BD creeada');
    }
    
}

initDatabase()