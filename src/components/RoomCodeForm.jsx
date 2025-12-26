import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/roomCode.scss";

axios.defaults.withCredentials = true;

export default function RoomCodeForm(){

    const [roomCode, setRoomCode] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e){
        e.preventDefault();

        if (roomCode.length === 0){
            try{
                const response = await axios.post(
                    import.meta.env.VITE_BE_URL + "/init",
                    {}   // IMPORTANT — send empty body
                );
                navigate("/game/" + response.data.roomCode);
            } catch(err){
                alert(err.response?.data?.message || "Error creating room");
            }
        } else {
            navigate("/game/" + roomCode);
        }
    }

    return (
        <div id="roomcode-component">
            <div id="roomcode">
                <form onSubmit={handleSubmit}>
                    <label>Enter a Room code if you have..!! or else just hit Go.</label>
                    <input
                        type="text"
                        name="room_code"
                        onChange={(e) => setRoomCode(e.target.value)}
                    />
                    <button type="submit">Go..!</button>
                </form>
            </div>
        </div>
    );
}
