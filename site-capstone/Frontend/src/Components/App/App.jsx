import './App.css'
import * as React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Landing from '../Landing/Landing'
import NavBar from '../Navbar/Navbar'

function App() {

    return (
        <div className="app">
          <React.Fragment>{
            <BrowserRouter>
              <NavBar></NavBar>
                <Routes>
                  <Route path="/" element={<Landing />}/>
                </Routes>
            </BrowserRouter>
          }</React.Fragment>
         
        </div>
    )
}

export default App
