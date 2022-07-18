import './App.css'
import * as React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Landing from '../Landing/Landing'
import NavBar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import Register from '../Register/Register'
import Login from '../Login/Login'

function App() {

    return (
        <div className="app">
          <React.Fragment>{
            <BrowserRouter>
              <NavBar></NavBar>
              
                <Routes>
                    <Route path="/" element={<Landing />}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                </Routes>
                <Footer></Footer>
            </BrowserRouter>
          }</React.Fragment>
         
        </div>
    )
}

export default App
