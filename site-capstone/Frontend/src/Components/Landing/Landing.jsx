import "./Landing.css"
import { Link } from "react-router-dom"


export default function Landing({ user }) {
    
    console.log(user?.firstName)
    return(
    <div className="container px-4 px-lg-5 h-100">
        <div className="headingRow row gx-4 gx-lg-5 h-100">
            <div className="col-lg-8 align-self-end">
                <h1>MedTracker</h1>
                <hr className="divider"></hr>
            </div>
            <div className="col-lg-8 align-self-baseline">
                <p className="mb-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                    {user?.firstName === undefined ?
                        <div>
                            <Link className="btn btn-dark btn-x1 mb-1" to="/register">Sign Up</Link><br />
                            <Link className="btn btn-dark btn-x1" to="/login">Login</Link>
                        </div>
                        :
                        ""
                    }
            </div>
                
        </div>
    </div>

    )   
}