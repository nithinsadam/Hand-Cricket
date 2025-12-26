import React from "react";
import Panel from "./Panel";
import SignPad from "./SignPad";
import Team from "./Team";
import ScoreBoard from "./ScoreBoard";
import '../styles/game.scss'

export default function Game ({roomCode , ballA , ballB , scoreA , scoreB , battingA,username ,wicketsA,wicketsB, sendBall, players , playerA , playerB}){

    return (
        <div id="game-component">
            <ScoreBoard roomCode={roomCode} scoreA={scoreA} scoreB={scoreB} wicketsA={wicketsA} wicketsB={wicketsB}/>
            <Panel ball = {ballA} team = 'A'/>
            <Panel ball = {ballB} team = 'B'/>
            <SignPad cb = {sendBall} active={(username == playerA || username == playerB)}/>
            <Team team = 'A' username = {username} players={players} player={playerA} score = {scoreA} battingA = {battingA}/>
            <Team team = 'B' username = {username} players={players} player={playerB} score = {scoreB} battingA = {battingA}/>
        </div>
    );
};