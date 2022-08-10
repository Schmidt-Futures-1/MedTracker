import "./MedicineCard.css"
import { Link } from "react-router-dom"
import apiClient from "../../services/apiClient"

export default function MedicineCard({medication, refresh, setRefresh}){
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

        // Change state so that component refreshes on Medicine Page
        setRefresh(!refresh);
    }

    return (
        <>
            {/* Vertically Centered modal called when refill button is clicked*/}
            {/* <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">Are You Sure?</h5>
                            <button type="button" className="btn-close btn-dark" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body"> */}
                            {/* Span to let users know what they are confirming to */}
                            {/* <span className="Confirm">Do you really want to delete this medication? This process cannot be undone.</span>
                        </div>
                        {/* <div className="modal-footer"> */}
                            {/* <button type="button" className="btn btn-dark" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => deleteMedicine(medication.id)}>Confirm Delete</button>
                        </div> 

                    </div>
                </div>
            </div> */}



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

                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => deleteMedicine(medication.id)}>Delete</button>
                    {/* <button type="button" className="btn btn-danger btn-space" data-bs-toggle="modal" data-bs-target="#staticBackdrop" >Delete</button> */}
                </div>          
                
            </div>
        </div>
        </>
       )
    }






