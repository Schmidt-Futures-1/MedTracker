import "./Login.css"
import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import apiClient from "../../services/apiClient"

export default function Login({setUser, user}){
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState({})
    const [form, setForm] = useState({
      email: "",
      password: "",
    })

    const handleOnInputChange = (event) =>{
        if (event.target.name === "email"){
            if (event.target.value.indexOf('@') === 1){
                setError((e) => ({...e, email: "Please enter a valid email."}))
            }else{
                setError((e) => ({...e, email: null}))
            }
        }
        setForm((f) => ({...f, [event.target.name]: event.target.value}))
    }

    const handleOnSubmit = async (e) => {
        e.preventDefault()

        setError((e) => ({...e, form: null}))

        const {data, error} = await apiClient.login({ email: form.email, password: form.password })
        if (data?.user){
            setUser(data.user);
            apiClient.setToken(data.token)
        }

        if(data){
            apiClient.setToken(data.token)
        }
        if(error){
            setError((e) => ({...e, form: error}))
        }
    }

    useEffect(() => {
        if(user?.email){
            navigate("/")
        }
    }, [user, navigate])

    console.log(error)

    return(

        <form className="form">
            <div className="container">
                <div className="col-4 mx-auto">
                    <h2 className="fw-bold mb-5">Login now</h2>
                    
                    {/* Error handling outputs to webpage */}
                    {error?.form &&
                        <div className="error">
                            {error.form}
                        </div>
                    }

                    {/* <!-- Email input --> */}
                    <div className="form-outline mb-4">

                        
                        <label for="email" className="form-label" >Email address</label>
                        
                        <input type="email" id="email" name="email" className="form-control" placeholder="user@gmail.com" value={form.email} onChange={handleOnInputChange} />
                        
            </div>

            {/* <!-- Password input --> */}
            <div className="form-outline mb-4">
                <label className="form-label">Password</label>
                <input type="password" name="password" id="password" className="form-control" placeholder="**********" value={form.password} onChange={handleOnInputChange}/>
            </div>

            {/* <!-- Submit button --> */}
            <button type="submit" className="btn btn-dark btn-block mb-4" disabled={isLoading} onClick={handleOnSubmit}>Sign in</button>

            {/* <!-- Register buttons --> */}
            <div className="register text-center">
                <p>Not a member? <a href="/register">
                    Register
                    </a></p>
            </div>

        </div>

    </div>

</form>


    )
}







