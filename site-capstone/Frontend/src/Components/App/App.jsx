import * as React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Landing from '../Landing/Landing'
import NavBar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import Register from '../Register/Register'
import Login from '../Login/Login'
import CreateMedication from '../CreateMedicationPage/CreateMedicationPage'
import Interaction from '../Interaction/Interaction'
import Medicine from '../MedicationPage/MedicinePage'
import { useState, useEffect } from "react"
import apiClient from '../../services/apiClient'


function App() {
  const[user, setUser] = useState({})
  const[error,setError] = useState(null)
  const[medications, addMedications] = useState({})

  useEffect(() => {
    const fetchUser = async () => {
      const {data} = await apiClient.fetchUserFromToken()
      if(data){
        setUser(data.user)
      }
    }
    const token = localStorage.getItem("medication_tracker_token")
    if(token){
      apiClient.setToken(token)
      fetchUser()
    }
  }, [])

    return (
        <div className="app">
          <React.Fragment>{
            <BrowserRouter>
              <NavBar user={user} setUser={setUser}> </NavBar>
              
                <Routes>
                    <Route path="/" element={<Landing user={user} setUser={setUser} />}/>
                    <Route path="/login" element={<Login user={user} setUser={setUser} />}/>
                    <Route path="/register" element={<Register user={user} setUser={setUser} />} />
                    <Route path="/create" element={<CreateMedication user={user} setUser={setUser} addMedications={addMedications} />}/>
                    <Route path="/interaction" element={<Interaction/>}/>
                    <Route path="/cabinet" element={<Medicine user={user} setUser={setUser} />}/>


                </Routes>
                <Footer></Footer>
            </BrowserRouter>
          }</React.Fragment>
        </div>
    )
}

export default App
