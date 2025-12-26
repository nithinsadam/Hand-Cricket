import React from "react";

export default function Panel({ball,team}){
    return (
        <div className="panel" id = {"panel-"+team}>
            {ball}
        </div>
    );
}