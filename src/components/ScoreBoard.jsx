import React from "react";

export default function ScoreBoard({roomCode,scoreA , wicketsA, scoreB , wicketsB}){
    return (
        <div id = "score-board">
            <h2>Room Code : {roomCode}</h2>
            <div className="score">
                <h3>Team A </h3>
                <div>{scoreA} / {wicketsA} </div>
            </div>
            <div className="score">
                <h3>Team B </h3>
                <div>{scoreB} / {wicketsB} </div>
            </div>
        </div>
    );
}