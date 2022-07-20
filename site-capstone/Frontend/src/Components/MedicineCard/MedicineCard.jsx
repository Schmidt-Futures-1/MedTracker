import "./MedicineCard.css"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"


export default function MedicineCard({medication}){
    return (
        
        <div className="row">
            <div className="col-sm-3">
                

                {/* Single card starts here */}
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">{medication.name }</h5>
                        <p className="card-text">Strength: {medication.strength} { medication.units}</p>
                        <p className="card-text">Pills Left: {medication.current_pill_count} / {medication.total_pill_count }</p>
                        <a href="#" className="btn btn-dark btn-space">Refill</a>
                        <a href="#" className="btn btn-dark btn-space">Edit</a>
                        <a href="#" className="btn btn-dark btn-space">Delete</a>
                    </div>          
                    
                </div>
                
            </div>
            
        </div>
        
       )
    }






