import "./MedicineCard.css"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import apiClient from "../../services/apiClient"
import { useNavigate } from "react-router-dom"

export default function MedicineCard({medication}){

    const navigate = useNavigate();
    
    // Calls delete request in the backend
    async function deleteMedicine(medicationId) {
        const {data, error} = await apiClient.deleteMedication(medicationId);
    
        if (data?.code === 200) {
          console.log(data.message)
        }
    
        if (error) {
          console.log("delete medicine error: ", error)
        }
        // Refresh's page on submit to remove deleted card
        window.location.reload(false);
    }

    return (
        
        <div >
            {/* Single card starts here */}
            <div className="card mb-4 text-center center card-color zoom" >
                <div className="card-body">
                    <Link className="links" to={`/cabinet/${medication.id}`}>
                        <h5 className="card-title capitalize-me">{medication.name}</h5>
                        <hr className="padding-hr"></hr>
                        <p className="card-text">Strength: {medication.strength} { medication.units}</p>
                        <p className="card-text mb-2">Pills Left: {medication.current_pill_count} / {medication.total_pill_count }</p>
                    </Link>
                    <a href="#" className="btn btn-dark btn-space">Refill</a>
                    <a href={`/cabinet/edit/${medication.id}`} className="btn btn-dark btn-space">Edit</a>
                    <button className="btn btn-dark btn-space" onClick={() => deleteMedicine(medication.id)} >Delete</button>
                </div>          
                
            </div>
        </div>
        
       )
    }






