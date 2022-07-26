import * as React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Landing from '../Landing/Landing'
import NavBar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import Register from '../Register/Register'
import Login from '../Login/Login'
import CreateMedication from '../CreateMedicationPage/CreateMedicationPage'
import Interaction from '../Interaction/Interaction'
import MedicinePage from '../MedicationPage/MedicinePage'
import Dashboard from "../Dashboard/Dashboard"
import { useState, useEffect } from "react"
import apiClient from '../../services/apiClient'
import MedicationDetails from '../MedicationDetails/MedicationDetails'
import NotFound from "../Error Pages/NotFound"
import AccessForbidden from "../Error Pages/AccessForbidden"
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute"
import UpdateMedication from "../UpdateMedicationPage/UpdateMedicationPage"


function App() {
  const[user, setUser] = useState({})
  const[error,setError] = useState(null)
  const[medications, addMedications] = useState({})
  const[notifications, addNotifications] = useState({})

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

                    <Route path="/create" element={<ProtectedRoute element={<CreateMedication user={user} setUser={setUser} addMedications={addMedications} medications={medications} addNotifications={addNotifications} />} user={user} setUser={setUser}/>}/>

                    <Route path="/interaction" element={<ProtectedRoute element={<Interaction/>} user={user} setUser={setUser}/>}/>

                    <Route path="/cabinet" element={<ProtectedRoute element={<MedicinePage user={user} setUser={setUser} />} user={user} setUser={setUser}/>}/>

                    <Route path="/cabinet/:medicationId" element={<ProtectedRoute element={<MedicationDetails user={user} setUser={setUser} />} user={user} setUser={setUser}/>}/>

                    <Route path="/cabinet/edit/:medicationId" element={<ProtectedRoute element={<UpdateMedication user={user} setUser={setUser} />} user={user} setUser={setUser}/>}/>

                    <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard user={user} setUser={setUser} />} user={user} setUser={setUser}/>}/>

                    <Route path="/*" element={<NotFound />} />
                </Routes>
                <Footer></Footer>
            </BrowserRouter>
          }</React.Fragment>
        </div>
    )
}

export default App
