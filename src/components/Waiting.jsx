import React from "react";
import '../styles/room.scss';

export default function Waiting({players , roomCode , emitStart}){
    return (
        <div id = "waiting-component">
            <div id = "waiting">
                <h2>RoomCode : {roomCode}</h2>
                <div id = "players">
                    {
                        players.map(
                            (p , i) => <div className = {`player ${(i%2) ? 'odd' : ' '}`} key={p.username}>
                                            {p.username}
                                    </div>
                        )
                    }
                </div>
                <button onClick = {emitStart}>Lets Go..!!</button>
            </div>
        </div>
    )
}