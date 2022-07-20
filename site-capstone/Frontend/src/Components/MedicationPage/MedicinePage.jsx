import "./MedicinePage.css"
import MedicineCard from "../MedicineCard/MedicineCard"
import apiClient from "../../services/apiClient";
import { useState, useEffect } from "react";

export default function MedicinePage({ user, setUser })
{

    // State variables ----------------------------------------------------------------------------
    const [medications, setMedications] = useState([]);
    const [errors, setError] = useState([]);
    const [isLoading, setIsLoading] = useState();


    // Functions ----------------------------------------------------------------------------------

    useEffect(() => {
        const fetchMedications = async () => {
            const { data, error} = await apiClient.fetchUserMedications();
            console.log("fetch meds data", data);
            if (data) {
                setMedications(data.medications);
                console.log("after setting meds", medications)
                setError(null);
            } 
            if (error) {
                setError(error);
            }

            

            setIsLoading(false);
        }
        
        if (user?.email) {
            setIsLoading(true);
            setError(null);
            fetchMedications();
        } else {
            setIsLoading(false);
        }
      }, [user]);



    console.log("med page meds", medications)

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
            {isLoading? <h1>Loading...</h1> :
                medications?.map((item, idx) => (
                    <MedicineCard key={idx} medication={item}/>
                ))
            }

        </div>


       )
    }






