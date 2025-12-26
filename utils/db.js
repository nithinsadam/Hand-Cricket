import sqlite3 from 'sqlite3'
import {open} from 'sqlite'

async function openDB(){
    const db = await open(
        {
            filename : './tmp/database.db' , 
            driver : sqlite3.Database
        }
    );
    return db;
}

async function init(){
    try{
        this.db = await openDB();
        console.log('DB connected');
        const temp = await this.db.get(
            " Select name from sqlite_master where type = 'table' and name = 'user' "
        );
        if(!temp){
            await this.db.exec(
                "Create table user (username text primary key, pwd_hash text, session_token text, session_expiry_time time)"
            )
        }   
    } catch(err){
        console.log(err);
    }
}

async function logall(){
    const res = await this.db.all(
        'select * from user;'
    )
    console.log(res);
}

async function insert(username , password_hash){
        await this.db.run(
            "insert into user(username,pwd_hash) values(?,?)"
            , username , password_hash
        )
}

async function insertToken(username,token,expiry_time) {
    await this.db.run(
        "update user set (session_token,session_expiry_time) = (?,?) where username = ?" , 
        token , expiry_time , username
    )
}

async function getByToken(session_token){
    const res = await this.db.get(
        "Select * from user where session_token = ?;"
        , session_token
    );
    return res;
}

async function getByUsername(username){
    const res = await this.db.get(
        "Select * from user where username = ?;"
        , username
    );
    return res;
}

export default {
    init , 
    logall , 
    insert , 
    getByToken ,
    getByUsername,
    insertToken
};  