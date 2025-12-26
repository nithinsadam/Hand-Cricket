import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import '../styles/login.scss'

export default function LogIn(){

    const [state,setState] = useState({
        username : "" , 
        password : "" , 
        error : undefined
    });
    async function handleSubmit(e){
        e.preventDefault()
        if(!state.username.length || !state.password.length) {
            setState(
                {
                    ...state , 
                    error : "username and password must not be empty"
                }
            )
            return
        } 
        try {
            const response = await axios.post(
                import.meta.env.VITE_BE_URL + "/login" , 
                {
                    username : state.username, 
                    password : state.password
                }
            )
            if(response.status == 200) window.location.reload()
            else { 
                setState({
                    username : "" , 
                    password : "",
                    error : response.data.message
                })
            }
        } catch(err){
            let errorMessage
                if(err.response === undefined) errorMessage = "Something Went Wrong..! Can't reach server :("
                else errorMessage = err.response.data.message
                setState(
                    {
                        username : "",
                        password : "",
                        confirmPassword : "",
                        error : errorMessage
                    }
                )
        }
    }
    return (
        <div id = "login-component">
            <div className="error">{state.error}</div>
            <div id = "login">
                <form onSubmit={handleSubmit}>
                    <label>Username</label>
                    <input type = "text" name = "username" value={state.username} onChange = {(e)=>{setState({...state , username : e.target.value})}}></input>
                    <label>Password</label>
                    <input type = "password" id = "password" name = "password" value={state.password}
                    onChange = {(e)=>{setState({...state , password : e.target.value})}}></input>
                    <button type = "submit">Submit</button>
                </form>
                <Link to = "create_account">
                    Create Account Instead
                </Link>
            </div>
        </div>
    )
}