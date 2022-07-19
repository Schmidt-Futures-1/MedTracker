import { Link } from "react-router-dom"
import "./Navbar.css"
import logo from "../../Assets/codepath.70a9a31f.svg"
import apiClient from "../../services/apiClient"


export default function NavBar({user, setUser}){
  const handleLogout = async() => {
    await apiClient.logout()
    setUser({})

  }

    return(

        <nav className="navbar navbar-expand-lg bg-light">
      <div className="container-fluid">
        <div className="navbar-brand"><Link to="/"><img src={logo} alt="codepath logo"/></Link></div>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <div className="nav-link active" aria-current="page">
              <Link to="/"><li>Home</li></Link>
                </div>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/create">Create Medicine</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/cabinet">Medicine Cabinet</a>
            </li>
          </ul>
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
                <div className="nav-link">
                    <button className="btn-secondary">
                        <Link to="/login"><li>Login</li></Link>
                    </button>
                
                    </div>
            </li>
            <li className="nav-item">
                <div className="nav-link">
                    <button className="btn-secondary">
                        <Link to="/register"><li>Sign Up</li></Link>
                    </button>
                    </div>
            </li>
            <li className="nav-item">
                <div className="nav-link">
                    <button onClick={handleLogout} className="btn-secondary">Sign Out</button>
                    </div>
            </li>
        </ul>
        </div>
      </div>
    </nav>

    )
}