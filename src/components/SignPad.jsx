import React from "react";
import Sign from "./Sign";

export default function SignPad({cb , active}){
    const possibleBalls = [1,2,3,4,5,6];
    return (
        <div id = "sign-pad">
            {
                possibleBalls.map(
                    (b) => <Sign value = {b} cb = {cb} key = {b} active = {active}/>
                )
            }
        </div>
    );
}