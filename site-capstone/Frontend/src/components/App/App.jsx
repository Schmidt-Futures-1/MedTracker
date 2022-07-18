import * as React from "react"
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import NavBar from "../Navbar/Navbar"
import Landing from "../Landing/Landing"


export default function App() {
    return (
      <div className="app">
        <React.Fragment>{
          <BrowserRouter>
            <NavBar> </NavBar>
              <Routes>
                <Route path="/" element={<Landing />}/>
              </Routes>
          </BrowserRouter>
        }</React.Fragment>
       
      </div>
    )
  }
  