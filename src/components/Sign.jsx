import React from "react";

export default function Sign({value , cb , active}){
    return (
        <button className = "sign" onClick={()=>cb(value)} disabled = {!active}>  {value} </button>
    );
}