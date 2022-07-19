import "./Login.css"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
// import axios from "axios"
import apiClient from "../../services/apiClient"

export default function Login({setUser, user}){
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [form, setForm] = useState({
      email: "",
      password: "",
    })
  
    const handleOnInputChange = (event) => {
      if (event.target.name === "email") {
        if (event.target.value.indexOf("@") === -1) {
          setErrors((e) => ({ ...e, email: "Please enter a valid email." }))
        } else {
          setErrors((e) => ({ ...e, email: null }))
        }
      }
  
      setForm((f) => ({ ...f, [event.target.name]: event.target.value }))
    }
  
    const handleOnSubmit = async (e) => {
      e.preventDefault()
      //setIsLoading(true)
      setErrors((e) => ({ ...e, form: null }))

      const { data, error } = await apiClient.loginUser({ email: form.email, password: form.password })
      if (data?.user) {
        setUser(data.user);
        apiClient.setToken(data.token);
      }

      if (data) {
        // setUser(data.user)
        apiClient.setToken(data.token)
      }
      if (error) {
        setErrors((e) => ({ ...e, form: error }))
      }
  

      
      //setIsLoading(false)
    

  
      // try {
      //   const res = await axios.post(`http://localhost:3001/auth/login`, form)
      //   if (res?.data) {
      //     //setAppState(res.data)
      //     setIsLoading(false)
      //     navigate("/activity")
      //   } else {
      //     setErrors((e) => ({ ...e, form: "Invalid username/password combination" }))
      //     setIsLoading(false)
      //   }
      // } catch (err) {
      //   console.log(err)
      //   const message = err?.response?.data?.error?.message
      //   setErrors((e) => ({ ...e, form: message ? String(message) : String(err) }))
      //   setIsLoading(false)
      // }
    }

    useEffect(() => {
      if (user?.email) {
          navigate("/activity")
      }
  }, [user,navigate])

  
    
    return(
        <div className="Login">
            <div className="card">
                    <h2>Login </h2><br/>
                <div className="form">
                    <div className="input-field">
                        <label for="email">Email</label>
                        <input type="email" name="email" placeholder="user@gmail.com" value={form.email} onChange={handleOnInputChange}/>
                    </div>
                    <div className="input-field">
                        <label for="password">Password</label>
                        <input type="password" name="password" placeholder="password" value={form.password} onChange={handleOnInputChange}/>
                    </div>

                    <button className="btn" disabled={isLoading} onClick={handleOnSubmit}>{isLoading ? "Loading..." : "Login"}</button>
                </div>
                <div className="footer">
                    <p>Don't have an account? Sign up</p>
                    <a href="/register"></a>
                </div>
            </div>
        </div>
    )
}