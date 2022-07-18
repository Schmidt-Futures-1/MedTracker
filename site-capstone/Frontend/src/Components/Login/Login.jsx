import "./Login.css"
import { Link, useNavigate } from "react-router-dom"

export default function Login(){
    return(


<form className="form">
    <div className="container">
        <div className="col-4 mx-auto">
        <h2 className="fw-bold mb-5">Login now</h2>
            {/* <!-- Email input --> */}
            <div className="form-outline mb-4">
                <label className="form-label">Email address</label>
                <input type="email" id="email" className="form-control" placeholder="user@gmail.com" />
            </div>

            {/* <!-- Password input --> */}
            <div className="form-outline mb-4">
                <label className="form-label">Password</label>
                <input type="password" id="password" className="form-control" placeholder="**********"/>
            </div>

            {/* <!-- Submit button --> */}
            <button type="submit" className="btn btn-dark btn-block mb-4">Sign in</button>

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







