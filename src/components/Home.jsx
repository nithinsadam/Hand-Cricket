import React from "react";
import RoomCodeForm from "./RoomCodeForm.jsx";
import { useEffect } from "react";
import { useState } from "react";
import LogIn from "./LogIn.jsx";
import axios from "axios";

axios.defaults.withCredentials = true

export default function Home(){
    const [isAuth , setIsAuth] = useState(false);
    useEffect(
        () => {
            axios.get(import.meta.env.VITE_BE_URL+"/auth" , 
                {
                    headers : {
                        "Access-Control-Allow-Origin": "*"
                    }
                }
            )
            .then(
                (res)=>{
                    console.log(res)
                    if(res.status == 200) setIsAuth(true)
                    else setIsAuth(false)
                }
            )    
            .catch(
                (err) =>{
                    setIsAuth(false)
                    console.log(err.response.data.message)
                }
            )
        }
        , []
    )
    return(
        (isAuth && <RoomCodeForm />)
        ||
        (<LogIn />)
    )
}