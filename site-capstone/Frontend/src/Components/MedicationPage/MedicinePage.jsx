import "./MedicinePage.css"
import MedicineCard from "../MedicineCard/MedicineCard"

export default function MedicinePage({
    user,
    setUser

})
{

    return(
        <div className="container">

            {/* Page Title */}
            <div className="row">
                <h2 className="fw-bold mb-3">Medicine Cabinet</h2>
            </div>
            
            {/* Add Medication button */}
            <div className="text-center">
                {/* <!-- Submit button --> */}
                <button type="submit" className="btn btn-dark btn-block mb-4"><a href="/create">Add Medication</a></button>
            </div>

            {/* Medicine cards */}
            <MedicineCard/>

        </div>


       )
    }






