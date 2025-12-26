import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Game from "./Game";
import Waiting from "./Waiting";
import { io } from "socket.io-client";
import axios from "axios";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true

function getSessionToken(){
    return document.cookie.match(/(?<=sessionToken=)\w+/g)[0];
}


export default function Room(){
    const [socket , setSocket] = useState()
    const [loading , setLoading] = useState(true)
    const [gameData , setGameData] = useState()
    const {roomCode} = useParams()
    const navigate = useNavigate()

    function sendBall(value){
        socket.emit(
            'ball' ,
            {
                value , 
                team : gameData.team
            }
        )
    }

    function emitStart(){
        if(gameData.count == 1) alert('Atleast 2 players should be in room')
        else socket.emit('start')
    }

    useEffect(
        function() {
            const temp_socket = io(import.meta.env.VITE_BE_URL + "/")
            function establishSocket(username){
                temp_socket.emit(
                    'init' , 
                    {
                        roomCode ,
                        sessionToken : getSessionToken()
                    } , 
                    (gameData) => {
                        setGameData({
                            ...gameData,
                            username
                        })
                        setLoading(false)
                    }
                )
                temp_socket.on(
                    'play' , 
                    (gameData) => {
                        setGameData(
                            (gd) => {
                                return {
                                    ...gd , 
                                    ...gameData
                                }
                            }
                        )
                        setTimeout(
                            () => setGameData(
                                (data) => {
                                    return (
                                        {
                                            ...data , 
                                            ballA : 0,
                                            ballB : 0
                                        }
                                    )
                                }
                            ) , 
                            2000
                        )
                    }
                )
                
                temp_socket.on('start' , 
                    (data) => {
                        setGameData((gd) => {
                            return {
                                ...gd,
                                ...data
                            }
                        })
                    }
                )

                temp_socket.on('join' , (players)=>{
                    setGameData( (gd)=>{
                        return {
                            ...gd,
                            players,
                            count : players.length
                        }
                    }
                    )
                })

                temp_socket.on('over'
                    ,
                    (res)=>{
                        alert(res + " won")
                        setGameData(
                            (gd) =>{
                                return ({
                                    ...gd , 
                                    gameInProgress : false
                                })
                            }
                        )
                    }
                )
                setSocket(temp_socket)
            }
            async function auth(){
                try{
                    // see if user can join the room
                    const res = await axios.post(
                        import.meta.env.VITE_BE_URL+"/room_auth" , 
                        {
                            roomCode
                        }
                    )
                    //user is authrized
                    if(res.status == 200){
                        establishSocket(res.data.username)
                    } else {
                        alert(res.data.message)
                        navigate("/")
                    }
                } catch (err) {
                    alert(err.response.data.message)
                    navigate("/")
                }
            }

            auth()

            return () => temp_socket.disconnect()
        } ,
        []
    )

    return (
        <>
            {
                (loading && <h1>Loadinggg.....</h1>)
                ||
                (
                    <>
                        {
                            (gameData.gameInProgress) ? <Game {...gameData} sendBall={sendBall}/> 
                                : <Waiting players = {gameData.players} roomCode = {roomCode} emitStart={emitStart}/>
                        }
                    </>
                )
            }
        </>
    )
}