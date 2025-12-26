import React from "react";
import Home from "./components/Home.jsx"
import CreateAccount from "./components/CreateAccount.jsx";
import Room from "./components/Room.jsx";

const routes = [
    {
      path: "/",
      element: < Home />,
    },
    {
      path: "/game/:roomCode",
      element: <Room />,
    },
    {
      path : "/create_account" , 
      element : <CreateAccount />
    }
];

export default routes;