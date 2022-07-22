import "./Landing.css"

export default function Landing(){
    return(
    <div className="container px-4 px-lg-5 h-100">
        <div className="headingRow row gx-4 gx-lg-5 h-100">
            <div className="col-lg-8 align-self-end">
                <h1>Landing Page</h1>
                <hr className="divider"></hr>
            </div>
            <div className="col-lg-8 align-self-baseline">
                <p className="mb-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                <a className="btn btn-dark btn-x1 mb-1" href="/register">Sign Up</a><br/>
                <a className="btn btn-dark btn-x1" href="/login">Login</a> 
            </div>
        </div>
    </div>

    )   
}