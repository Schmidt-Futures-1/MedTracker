import { Link } from "react-router-dom"
import "./Navbar.css"
// import logo from "../../Assets/codepath.70a9a31f.svg"
import logo from "../../assets/medtracker-logo.png"
import apiClient from "../../services/apiClient"
import { useNavigate } from "react-router-dom"


export default function NavBar({user, setUser}){
  const navigate = useNavigate() 
  const handleLogout = async() => {
    await apiClient.logout()
    setUser({})
    navigate("/")
  }

    return(

    <nav className="navbar navbar-expand-lg bg-dark bg-color">
      <div className="container-fluid">

        <div className="navbar-brand"><Link to="/"><img src={logo} alt="medtracker logo" width="auto" height="60"/></Link></div>

        <button className="navbar-toggler bg-color" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon custom-toggler bg-color"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              {user?.email?(
                <Link className="nav-link" to="/dashboard">Dashboard</Link>
              ):("")}
            </li>

            <li className="nav-item">
              {user?.email?(
                <Link className="nav-link" to="/create">Add Medication</Link>
              ):("")}
            </li>

            <li className="nav-item">
              {user?.email?(
                <Link className="nav-link" to="/cabinet">Medicine Cabinet</Link>
              ):("")}
            </li>

            {/* Nav link for interaction tracker */}
            <li className="nav-item">
              {user?.email?(
                <Link className="nav-link bg-color" to="/interaction">Interaction Checker</Link>
              ):("")}
            </li>
          </ul>

          <ul className="navbar-nav ml-auto bg-color">
            <li className="nav-item ">
                <div className="nav-link">
                    {user?.email?(
                        ""
                  ) : (
                      <Link to="/login">
                          <button className="btn-secondary login-sizing ">Login</button> 
                      </Link>
                    )}
                </div>
            </li>
            <li className="nav-item">
                <div className="nav-link">
                     {user?.email?(
                        <button onClick={handleLogout} className="btn-secondary bg-color">Sign Out</button> 
                  ) : (
                      <Link to="/register">
                          <button className="btn-secondary bg-color">Sign Up</button>  
                      </Link>
                          )}
                </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>


    )
}
