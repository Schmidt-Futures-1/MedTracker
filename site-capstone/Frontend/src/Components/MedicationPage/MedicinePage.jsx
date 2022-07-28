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
        // Fetch the user's medications using apiClient
        const fetchMedications = async () => {
            const { data, error} = await apiClient.fetchUserMedications();

            if (data) {
                setMedications(data.medications);
                setError(null);
            } 

            if (error) {
                setError(error);
            }

            setIsLoading(false);
        }

        
        // Call the fetch medications function
        setIsLoading(true);
        setError(null);
        fetchMedications();

        
      }, [user]);



    return(
        <div className="container marg">

            {/* Page Title */}
            <div className="row text-center">
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
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-3 row-cols-xl-4 ">
            {isLoading? <h1>Loading...</h1> :
                medications?.map((item, idx) => {
                    return(
                    <MedicineCard key={idx} medication={item}/>
                    )
                })
                }
            </div>        
            

        </div>


       )
    }






