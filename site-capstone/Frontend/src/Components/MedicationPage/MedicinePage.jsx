import "./MedicinePage.css"
import MedicineCard from "../MedicineCard/MedicineCard"
import apiClient from "../../services/apiClient";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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
        <div className="container marg">

            {/* Page Title */}
            <div className="row">
                <h2 className="fw-bold mb-3">Medicine Cabinet</h2>
            </div>
            
            {/* Add Medication button */}
            <div className="text-center">
                {/* <!-- Submit button --> */}
                <Link to="/create">
                    <button type="submit" className="btn btn-dark btn-block mb-4">Add Medication</button>
                    </Link>
            </div>

            {/* Medicine cards */}
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-3 row-cols-xl-4 ">
            {isLoading? <h1>Loading...</h1> :
                medications?.map((item, idx) => {
                    return(<>
                    <MedicineCard key={idx} medication={item}/>
                    </>
                    )
                })
                }
            </div>        
            
            

        </div>


       )
    }






