import "./MedicineCard.css"


export default function MedicineCard(){
    return(
        <div className="container">
            <div class="row">
                <h2 className="fw-bold mb-3">Medicine Cabinet</h2>
                </div>
                <div className="text-center">
                {/* <!-- Submit button --> */}
                <button type="submit" className="btn btn-dark btn-block mb-4"><a href="/create">Add Medication</a></button>
                </div>
                <div class="row">
                <div class="col-sm-3">
                    <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Medicine Name</h5>
                        <p class="card-text">Strength: ##</p>
                        <p class="card-text">Pills Left: ##</p>
                        <a href="#" class="btn btn-dark btn-space">Refill</a>
                        <a href="#" class="btn btn-dark btn-space">Edit</a>
                        <a href="#" class="btn btn-dark btn-space">Delete</a>
                    </div>
                    </div>
                </div>
            </div>
        </div>

       )
    }






