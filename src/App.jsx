import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./routes.jsx";

const router = createBrowserRouter( routes );

function App() {
    return (
        <React.StrictMode>
            <RouterProvider router={router} />
        </React.StrictMode>
    )
}

export default App;
