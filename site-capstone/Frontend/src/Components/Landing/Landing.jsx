import "./Landing.css"
import { Link } from "react-router-dom"
import loginBackground from "../../assets/login-background.jpg"


export default function Landing({ user }) {
    
    return(
        <div className="container px-4 px-lg-5 h-100 ">
                        <img className="login-background" src={loginBackground} alt="Medicines, syringes, and bottles" />

        <div className="headingRow row gx-4 gx-lg-5 h-100 container-axis">
            <div className="col-lg-8 align-self-end">
                <h1 className="fw-bold b-6">MedTracker</h1>
                <hr className="divider"></hr>
            </div>
            <div className="col-lg-8 align-self-baseline">
                    <p className="mb-5">With so much going in our daily lives, our health can sometimes take a back seat to our other needs.
                        Free up some of the weight on your shoulders with MedTracker. Never forget to take your medication again!</p>
                    {user?.firstName === undefined ?
                        <div className="buttons-row ">
                            <div className="sign-up-row">
                                <Link className="btn btn-dark btn-x1 sign-up-button" to="/login">Login</Link>
                            </div>
                            
                            <Link className="btn btn-dark btn-x1 login-button" to="/register">Sign Up</Link>
                        </div>
                        :
                        ""
                    }
            </div>
                
        </div>
    </div>

    )   
}