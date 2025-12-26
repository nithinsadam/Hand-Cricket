import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import db from "./utils/db.js"
import bcrypt from "bcrypt";
import uniqid from "uniqid"
import authenticator from "./utils/auth.js";
import gamesHandler from "./utils/game.js"

dotenv.config(); // for process.env
await db.init();
const auth = new authenticator(db)

const app = express();
const port = 4000;

app.use(cors(
    {
        origin : process.env.REACT_URL , 
        credentials : true
    }
));
app.use(bodyParser.json());
app.use(cookieParser());


const io = new Server(
        app.listen(
            port , 
            () => console.log('server started')
        ) , 
        {
            cors : {
                origin : process.env.REACT_URL , 
                methods : ["GET","POST"]
            }
        }
);

app.post( "/init" , 
    (req,res)=>{
        // NO room code is given. so new room is created.
        console.log("new game is being created");
        const game = gamesHandler.createGame();
        res.status(200).send(
            {
                roomCode  : game.roomCode
            }
        );
    }
)

app.post("/room_auth" ,auth.sessionAuth, (req,res) => {
    if(req.isAuth) {
        console.log(req.body)
        const roomCode = req.body.roomCode
        if(gamesHandler.userCanJoin(req.username,roomCode)) {
            res.status(200).send(
                {
                    username : req.username,
                }
            )
        } else {
            res.status(401).send(
                {
                    message : "you cannot join this room"
                }
            )
        }
    } else {
        res.status(401).send(
            {
                message : "you must log in before playing"
            }
        )
    }
})

app.get("/auth", auth.sessionAuth , async (req,res) => {
    if(req.isAuth) {
        res.sendStatus(200)
    } else {
        res.status(401).send(
            {
                message : "user not authenticated"
            }
        )
    }
})

app.post("/login" , async (req,res)=>{
    const {username ,password} = req.body
    const user = await db.getByUsername(username)
    console.log(user)
    if(user && await bcrypt.compare(password,user.pwd_hash)){
        console.log("access granted")
        const session_token = uniqid.process()
        res.cookie("sessionToken",session_token)
        res.sendStatus(200)
        let d = new Date()
        d.setDate(d.getDate()+1)
        await db.insertToken(username,session_token,d.toISOString())
    } else {
        res.status(401).send(
            {
                message : "invalid credentials"
            }
        )
    }
})

app.post( "/create_account" , async (req,res)=>{
    console.log(req.body)
    const {username , password} = req.body;
    const hash = await bcrypt.hash(password,0)
    console.log(hash)
    try {
        await db.insert(username,hash)
        res.sendStatus(200)
    } catch(err){
        console.log(err)
        console.log("catch blockk")
        res.status(409).send(
            {
                message : "username already exists"
            }
        )
    }
})

io.on( 'connect' ,
    (socket)=>{
        console.log("connect ayyaadu");
        socket.on(
            "init" , 
            async (data , cb) =>{
                const sessionToken = data.sessionToken
                const user = await db.getByToken(sessionToken)

                if(!user) return
                if(!gamesHandler.userCanJoin(user.username,data.roomCode)) return

                socket.roomCode = data.roomCode
                socket.username = user.username
                socket.join(data.roomCode)
                console.log("joined the client to room "+ data.roomCode);
                let room = gamesHandler.getGame(data.roomCode);
                if(room){
                    gamesHandler.joinGame(data.roomCode , user.username)
                    socket.to(data.roomCode).emit('join' , room.players)
                    cb(
                        {
                            ...room,
                            ballA : 0,
                            ballB : 0
                        }
                    )
                }
            }
        )

        socket.on('start' , () => {
            console.log('starting the game ' + socket.roomCode)
            io.to(socket.roomCode).emit('start' , gamesHandler.startGame(socket.roomCode))
        })

        socket.on(
            "ball" , 
            ({value}) => {
                gamesHandler.playBall(socket.roomCode,socket.username,value,
                    () => {
                        io.to(socket.roomCode).emit(
                            'play' , 
                            gamesHandler.getGame(socket.roomCode)
                        )
                    } ,
                    (result) => {
                        console.log('game is over'+ result)
                        io.to(socket.roomCode).emit('over',result)
                    }
                )
            }
        )

        socket.on(
            "disconnect" ,
            ()=>{
                gamesHandler.removePlayer(socket.roomCode,socket.username)
                socket.to(socket.roomCode).emit('join',gamesHandler.getGame(socket.roomCode)?.players)
                console.log('disconnected');
            }
        )
    }
);