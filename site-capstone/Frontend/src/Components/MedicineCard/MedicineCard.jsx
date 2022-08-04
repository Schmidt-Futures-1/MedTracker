import "./MedicineCard.css"
import { Link } from "react-router-dom"
import apiClient from "../../services/apiClient"

export default function MedicineCard({medication}){
    // Returns the notification id based on the medication
    async function fetchNotification(medicationId) {
        const {data, error} = await apiClient.fetchMedicationById(medicationId);
        return data?.medication?.notification_id;
    }

    async function deleteNotification(notificationId) {
        const {data, error} = await apiClient.deleteNotification(notificationId);
    }

    // Calls delete request in the backend
    async function deleteMedicine(medicationId) {
        // Fetches notification id of notificaiton associated with medication id
        const notificationId = await fetchNotification(medicationId);

        // Delete the notification
        await deleteNotification(notificationId);

        // Delete the medication
        const {data, error} = await apiClient.deleteMedication(medicationId);
    
        // Refresh's page on submit to remove deleted card
        window.location.reload(false);
    }

    return (
        <>
        {/* Medicine Card Code */}
        <div >
            {/* Single card starts here */}
            <div className="card mb-4 text-center center card-color zoom" >
                <div className="card-body">

                    {/* Clicking on any of these links will send user to medicine details page */}
                    <Link className="links" to={`/cabinet/${medication.id}`}>
                        <h4 className="card-title capitalize">{medication.name}</h4>
                        <hr className="padding-hr"></hr>
                        <p className="card-text">Strength: {medication.strength} { medication.units}</p>
                        <p className="card-text mb-2">Pills Left: {medication.current_pill_count} / {medication.total_pill_count }</p>
                    </Link>

                    {/* Details, Edit and Delete buttons */}
                    {/* <Link className="btn btn-dark btn-space" to={`/cabinet/${medication.id}`}>Details</Link> */}

                    <Link to={`/cabinet/edit/${medication.id}`} className="btn btn-dark btn-space">Edit</Link>

                    <button className="btn btn-danger btn-space" onClick={() => deleteMedicine(medication.id)} >Delete</button>
                </div>          
                
            </div>
        </div>
        </>
       )
    }






