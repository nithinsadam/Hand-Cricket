import React from "react";

export default function Team({players , player, team , battingA, username}){
    let myTeam = false
    const reqPlayers = players.filter(
        (p)=>{
            if(p.team == team) {
                if(p.username == username) myTeam = true
                return true
            }
            else return false
        }
    )
    return (
        <div className="team" id = {((myTeam) ? 'my' : 'other')+"-team"}>
            <h2>Team : {team} </h2>
            <h3>
                {
                    (
                        ()=>{
                            if(team == 'A' && battingA || (team=='B'&&!battingA)) return "Batting"  
                            else return "Bowling"
                        }
                    )()
                }
            </h3>
            {
                reqPlayers.map(
                    (p , i) => {
                        if(p.team == team)
                            return (<div key = {p.username} className={`player ${(i%2)?'odd':' '}`}> {p.username + ((p.username==player)?'*':'')} </div>)
                    }
                )
            }
        </div>
    )
}