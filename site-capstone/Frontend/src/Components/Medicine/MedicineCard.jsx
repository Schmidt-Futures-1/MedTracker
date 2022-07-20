import "./MedicineCard.css"


export default function MedicineCard(){
    return(
        <div className="container">
            <div className="row">
                <h2 className="fw-bold mb-3">Medicine Cabinet</h2>
                </div>
                <div className="text-center">
                {/* <!-- Submit button --> */}
                <button type="submit" className="btn btn-dark btn-block mb-4"><a href="/create">Add Medication</a></button>
                </div>
                <div className="row">
                <div className="col-sm-3">
                    <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Medicine Name</h5>
                        <p className="card-text">Strength: ##</p>
                        <p className="card-text">Pills Left: ##</p>
                        <a href="#" className="btn btn-dark btn-space">Refill</a>
                        <a href="#" className="btn btn-dark btn-space">Edit</a>
                        <a href="#" className="btn btn-dark btn-space">Delete</a>
                    </div>
                    </div>
                </div>
            </div>
        </div>

       )
    }






