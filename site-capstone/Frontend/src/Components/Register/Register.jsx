import { Link } from "react-router-dom"
import "./Resister.css"

export default function Register(){
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
        <input type="text" className="form-control" placeholder="First Name"/>
      </div>
    </div>
    <div className="col">
      <div className="form-outline">
      <label className="form-label">Last name</label>
        <input type="text" className="form-control" placeholder="Last Name"/>
      </div>
    </div>
  </div>

  {/* <!-- Email input --> */}
  <div className="form-outline mb-4">
    <label className="form-label">Email </label>
    <input type="email" className="form-control" placeholder="Enter a valid email" />
  </div>

  {/* <!-- Password input --> */}
  <div className="form-outline mb-4">
    <label className="form-label">Password</label>
    <input type="password" className="form-control" placeholder="Enter a secure password" />
  </div>
  <div className="form-outline mb-4">
    <label className="form-label">Confirm Email</label>
    <input type="password" className="form-control" name="passwordConfirm" placeholder="Enter a secure password" />
  </div>

  {/* <!-- Submit button --> */}
  <button type="submit" className="btn btn-dark btn-block mb-4">Sign up</button>

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