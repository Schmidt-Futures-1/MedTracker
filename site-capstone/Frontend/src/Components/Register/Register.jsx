import "./Resister.css"
import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import apiClient from "../../services/apiClient"

export default function Register({setUser, user}){
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState({})
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    date: "",
    password: "",
    passwordConfirm: "",
    location: "Local Clinic",
    agreeToTerms: false,
  })

  const handleOnInputChange = (event) =>{
    if (event.target.name === "password") {
      if (form.passwordConfirm && form.passwordConfirm !== event.target.value) {
        set((e) => ({ ...e, passwordConfirm: "Password's do not match" }))
      } else {
        setError((e) => ({ ...e, passwordConfirm: null }))
      }
    }
    if (event.target.name === "passwordConfirm") {
      if (form.password && form.password !== event.target.value) {
        setError((e) => ({ ...e, passwordConfirm: "Password's do not match" }))
      } else {
        setError((e) => ({ ...e, passwordConfirm: null }))
      }
    }
    if (event.target.name === "email") {
      if (event.target.value.indexOf("@") === -1) {
        setError((e) => ({ ...e, email: "Please enter a valid email." }))
      } else {
        setError((e) => ({ ...e, email: null }))
      }
    }

    setForm((f) => ({ ...f, [event.target.name]: event.target.value }))

  }

  const handleOnSubmit = async () => {
   
    setError((e) => ({ ...e, form: null }))

    if (form.passwordConfirm !== form.password) {
      setError((e) => ({ ...e, passwordConfirm: "Passwords do not match." }))
      console.log(error)
      
      return
    } else {
      setError((e) => ({ ...e, passwordConfirm: null }))
    }

    const { data, error } = await apiClient.signup({
      email: form.email,
      firstName: form.firstName,
      lastName: form.lastName,
      password: form.password,
      username: form.username,
    })

    if (data?.user) {
      setUser(data.user);
      apiClient.setToken(data.token);
    }

    if (data) {
    
      apiClient.setToken(data.token)
    }
    if (error) {
      setError((e) => ({ ...e, form: error }))
    }
    
    
  }

  useEffect(() => {
    if (user?.email) {
        navigate("/")
    }
}, [user,navigate])

  return(
    <form>
      <div className="container">
      <div className="col-5 mx-auto">
  {/* <!-- 2 column grid layout with text inputs for the first and last names --> */}
  <div className="row mb-4">
  <h2 className="fw-bold mb-5">Create Account</h2>

    <div className="col">
      <div className="form-outline">
        <label className="form-label">First name</label>
        <input type="text" className="form-control" name="firstName" placeholder="First Name" value={form.firstName} onChange={handleOnInputChange}/>
      </div>
    </div>
    <div className="col">
      <div className="form-outline">
      <label className="form-label">Last name</label>
        <input type="text" className="form-control" name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleOnInputChange}/>
      </div>
    </div>
  </div>

  {/* <!-- Email input --> */}
  <div className="form-outline mb-4">
    <label className="form-label">Email </label>
    <input type="email" className="form-control" name="email" placeholder="Enter a valid email" value={form.email} onChange={handleOnInputChange} />
  </div>

  {/* <!-- Password input --> */}
  <div className="form-outline mb-4">
    <label className="form-label">Password</label>
    <input type="password" className="form-control" name="password" placeholder="Enter a secure password" value={form.password} onChange={handleOnInputChange}/>
  </div>
  <div className="form-outline mb-4">
    <label className="form-label">Confirm Email</label>
    <input type="password" className="form-control" name="passwordConfirm" placeholder="Enter a secure password" value={form.passwordConfirm} onChange={handleOnInputChange}/>
  </div>

           {/* <!-- Submit button --> */}

            <button type="submit" className="btn btn-dark btn-block mb-4" disabled={isLoading} onClick={handleOnSubmit}>{isLoading ? "Loading..." : "Create Account"}</button>
           

  {/* <!-- Register buttons --> */}
    <div className="text-center">
        <p>Already a member? <a href="/login">Login
            </a></p>
    </div>
    </div>
    </div>
</form>
   )
}