import "./MedicineCard.css"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"


export default function MedicineCard({medication}){
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
                    <a href="#" className="btn btn-dark btn-space">Edit</a>
                    <a href="#" className="btn btn-dark btn-space">Delete</a>
                </div>          
                
            </div>
        </div>
        
       )
    }






