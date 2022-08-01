import "./MedicationDetails.css"
import { Link, useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";
import axios from "axios"
import LoadingPage from "../LoadingPage/LoadingPage";
import AccessForbidden from "../Error Pages/AccessForbidden";
import NotFound from "../Error Pages/NotFound";
import Cronstrue from "cronstrue"
import parser from "cron-parser"

export default function MedicationDetails() {
    //---------------------------------- State Variables
    const { medicationId } = useParams();
    const [medication, setMedication] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState(null);     // Errors for fetchMedicationById api call
    const [nlmError, setNLMError] = useState(null); // Errors for api call from nlm api
    const [foundId, setFoundId] = useState(false);
    const [mayTreat, setMayTreat] = useState([])
    const [drugbankLink, setDrugBankLink] = useState("")
    const [notificationId, setNotificationId] = useState(0);

    const [refillAmount, setRefillAmount] = useState(0);
    const [error, setError] = useState({})

    //---------------------------------- Refill Functions
    // Handles when user is typing into input in refill modal
    const handleOnInputChange = (event) => {
        setRefillAmount(event.target.value);
    }

    // Called when refill modal button is clicked
    const handleOnSubmit = async () => {

        const { data, error } = await apiClient.refillMedication(refillAmount, medication.id)

        if (data) {
            setRefillAmount(0);
        }
        if (error) {
            setError((e) => ({ ...e, form:error }));
        }
    } 
    
    //----------------------------------Fetch Medication Details
    // Fetch medication info from medications database 
    // Update when refillAmount is changed (meaning current pill count will be updated when user refills medications)
    useEffect( () => {
        async function fetchById() {
            setIsLoading(true);

            const { data, error, errorStatus } = await apiClient.fetchMedicationById(medicationId);

            if (error) {
                setErrors((e) => ({ error, errorStatus }));
            }
        
            if (data?.medication) {
                setMedication(data.medication);
                setNotificationId(data?.medication?.notification_id)
                setFoundId(true);
                setErrors(null);
            }

            setIsLoading(false);
        }
        
        fetchById();

    }, [refillAmount, notificationId])

    //---------------------------------- Fetch Info from NLM Api
    // Fetch info on what medication is used to treat 
    useEffect(() => {
        axios.get("https://rxnav.nlm.nih.gov/REST/rxclass/class/byRxcui.json?rxcui=" + medication.rxcui + "&relaSource=MEDRT&relas=may_treat")

            .then((response) => {
                setMayTreat(response.data.rxclassDrugInfoList.rxclassDrugInfo)
            })
            .catch((error) => {
                setNLMError(error)
            })
    }, [medication.rxcui])
    
    // Fetch link for medication
    useEffect(() => {
        axios.get("https://rxnav.nlm.nih.gov/REST/interaction/interaction.json?rxcui=" + medication.rxcui + "&sources=DRUGBANK")

            .then((response) => {
                setDrugBankLink(response.data.interactionTypeGroup[0].interactionType[0].interactionPair[0].interactionConcept[0].sourceConceptItem.url)
            })
            .catch((error) => {
                setNLMError(error)
            })
    }, [medication.rxcui])


    // If med info was successfully pulled from api, filter it
    // Must filter or else the info will appear twice
    if (mayTreat) {
        var tempMayTreat = mayTreat.map((current) => {
            return current.rxclassMinConceptItem.className
        })
        var filteredMayTreat = [...new Set(tempMayTreat)]

    }

    //---------------------------------- Formatting Cron Time
    // Store the cron time for this medicine
    let readableCronTime = medication?.notification_time
    let nextAlert = ""
    let prevAlert = ""


    // Parse the cron time from notifications table
    if (readableCronTime) { 
        var parsedCron = parser.parseExpression(medication?.notification_time)

        if (parsedCron ) {

            // Get day, month, date, year, hour, and minute for NEXT alert
            let nextDayTemp = parsedCron.next().getDay().toString()
            parsedCron.reset()

            let nextMonthTemp = parsedCron.next().getMonth().toString()
            parsedCron.reset()

            let nextDate = parsedCron.next().getDate().toString()
            parsedCron.reset()

            let nextYear = parsedCron.next().getFullYear().toString()
            parsedCron.reset()
        
            let nextHour = parsedCron.next().getHours().toString()
            parsedCron.reset()

            let nextMinute = parsedCron.next().getMinutes().toString()
            parsedCron.reset()

            // Get day, month, date, year, hour, and minute for PREV alert
            let prevDayTemp = parsedCron.prev().getDay().toString()
            parsedCron.reset()

            let prevMonthTemp = parsedCron.prev().getMonth().toString()
            parsedCron.reset()

            let prevDate = parsedCron.prev().getDate().toString()
            parsedCron.reset()

            let prevYear = parsedCron.prev().getFullYear().toString()
            parsedCron.reset()
            
            let prevHour = parsedCron.prev().getHours().toString()
            parsedCron.reset()

             let prevMinute = parsedCron.prev().getMinutes().toString()
            parsedCron.reset()
            
            // Set the day name for next and prev alerts
            let nextDay = ""
            let prevDay = ""
            if (nextDayTemp === "0") {nextDay = "Sunday"}
            if (nextDayTemp === "1") { nextDay = "Monday" }
            if (nextDayTemp === "2") { nextDay = "Tuesday" }
            if (nextDayTemp === "3") { nextDay = "Wednesday" }
            if (nextDayTemp === "4") { nextDay = "Thursday" }
            if (nextDayTemp === "5") { nextDay = "Friday" }
            if (nextDayTemp === "6") { nextDay = "Saturday" }

            if (prevDayTemp === "0") {prevDay = "Sunday"}
            if (prevDayTemp === "1") { prevDay = "Monday" }
            if (prevDayTemp === "2") { prevDay = "Tuesday" }
            if (prevDayTemp === "3") { prevDay = "Wednesday" }
            if (prevDayTemp === "4") { prevDay = "Thursday" }
            if (prevDayTemp === "5") { prevDay = "Friday" }
            if (prevDayTemp === "6") { prevDay = "Saturday" }


            // Initialize next and previous months to be used in alert on screen
            let nextMonth = ""
            let prevMonth = ""

            // Convert NEXT months to correct names
            if (nextMonthTemp === "0") {nextMonth = "January"}
            if (nextMonthTemp === "1") { nextMonth = "February" }
            if (nextMonthTemp === "2") { nextMonth = "March" }
            if (nextMonthTemp === "3") { nextMonth = "April" }
            if (nextMonthTemp === "4") { nextMonth = "May" }
            if (nextMonthTemp === "5") { nextMonth = "June" }
            if (nextMonthTemp === "6") { nextMonth = "July" }
            if (nextMonthTemp === "7") {nextMonth = "August"}
            if (nextMonthTemp === "8") { nextMonth = "September" }
            if (nextMonthTemp === "9") { nextMonth = "October" }
            if (nextMonthTemp === "10") { nextMonth = "November" }
            if (nextMonthTemp === "11") { nextMonth = "December" }

            // Convert PREV months to correct names
            if (prevMonthTemp === "0") {prevMonth = "January"}
            if (prevMonthTemp === "1") { prevMonth = "February" }
            if (prevMonthTemp === "2") { prevMonth = "March" }
            if (prevMonthTemp === "3") { prevMonth = "April" }
            if (prevMonthTemp === "4") { prevMonth = "May" }
            if (prevMonthTemp === "5") { prevMonth = "June" }
            if (prevMonthTemp === "6") { prevMonth = "July" }
            if (prevMonthTemp === "7") {prevMonth = "August"}
            if (prevMonthTemp === "8") { prevMonth = "September" }
            if (prevMonthTemp === "9") { prevMonth = "October" }
            if (prevMonthTemp === "10") { prevMonth = "November" }
            if (prevMonthTemp === "11") { prevMonth = "December" }

             // Format the minute and hour time string for next alert
             if (nextMinute < 10) {
                nextMinute = "0" + nextMinute
            }
                
            if (nextHour > 12) {
                nextHour = nextHour - 12
                    nextMinute = nextMinute + " PM"
            }
            else if (nextHour === "12") {
                nextMinute = nextMinute + " PM"
            }
            else {
                nextMinute = nextMinute + " AM"
            }

             // Format the minute and hour time string for previous alert
             if (prevMinute < 10) {
                prevMinute = "0" + prevMinute
            }
                
            if (prevHour > 12) {
                prevHour = prevHour - 12
                prevMinute = prevMinute + " PM"
            }
            else if (prevHour === "12") {
                prevMinute = prevMinute + " PM"
            }
            else {
                prevMinute = prevMinute + " AM"
            }
            
            // Set the full string for next and prev alerts
            nextAlert = nextDay + ", " + nextMonth + " " + nextDate + ", " + nextYear + " at " + nextHour + ":" + nextMinute
            prevAlert = prevDay + ", " + prevMonth + " " + prevDate + ", " + prevYear + " at " + prevHour + ":" + prevMinute
        }
        
    }

    //---------------------------------- Delete Notification function
    async function deleteNotification(notificationId) {
        const {data, error} = await apiClient.deleteNotification(notificationId);
    }
    
    return (
        <>
        
            {/* Vertically Centered modal called when refill button is clicked*/}
            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">Refill Medication</h5>
                        <button type="button" className="btn-close btn-dark" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {/* entered amount gets added to amount left  */}
                        <form>
                            <div className="form-outline">
                                <label className="form-label">Enter Refill Amount</label>
                                <input min={0} name="refillAmount" type="number" className="form-control" placeholder="Enter Refill Amount" value={refillAmount} onChange={handleOnInputChange} />
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-dark" data-bs-dismiss="modal" onClick={handleOnSubmit}>Refill</button>
                    </div>

                    </div>
                </div>
                </div>
        
            {/* Med Details Page */}
            <div className="med-details-page">
            {/* Error checks for page, if user attempts to access another user's med details page or if they try to access med details that don't exist */}
            {isLoading? <LoadingPage /> :
            (errors?.errorStatus === 403)? <AccessForbidden message={errors.error}/> :
            (errors?.errorStatus === 404)? <NotFound /> :
            <>             
                <div className="container px-4 px-lg-5 h-100">
                    
                    <div className="col gx-4 gx-lg-5 h-100 mx-auto  pb-5 exam-details ">

                        {/* Title row */}
                        <Link className="back-link" to="/cabinet">
                                <button className="back-link "> &#8249; Back to Medicine Cabinet</button>
                        </Link>


                        {/* Edit and Refill buttons */}
                        <Link className=" btn-dark btn btn-block edit-button" to={`/cabinet/edit/${medicationId}`}>
                                Edit
                        </Link>



                        {/* Medication Name */}           
                        <div className="row">
                            <h2 className="fw-bold mb-3 row capitalize">{medication.name}</h2>
                        </div>  
                                        <div className="text-center">
                            <button type="button" className="btn btn-dark btn-space  mb-5 refill-btn" data-bs-toggle="modal" data-bs-target="#staticBackdrop" >Refill</button>
                            
                            </div>
                    
                        {/* Strength */}
                        <div className="row mb-4 ">                     
                            <p className="h4">Strength: {medication.strength} {medication.units}</p> 
                        </div>
                                        
                        {/* Count */}
                        <div className="row mb-4">
                            <p className="h4">Pills Left: {medication.current_pill_count}/{medication.total_pill_count}</p> 
                        </div>
                        
                        {/* Frequency is AS NEEDED */}
                        {medication.frequency === "As Needed" &&
                            <div className="row mb-4">
                                <p className="h4">Frequency: {medication.frequency}</p>
                            </div>
                        }

                        {/* Frequency is SCHEDULED */}
                        {medication.frequency === "Scheduled" && nextAlert &&
                            <div>
                                <div className="row mb-4">
                                    <p className="h4">Frequency: {Cronstrue.toString(readableCronTime, { verbose: true })}</p>
                                </div>
                                <div className="row mb-4">
                                    <p className="h4">Next Alert: {nextAlert }</p>
                                </div>
                                <div className="row mb-4">
                                    <p className="h4">Last Alert: {prevAlert }</p>
                                </div>
                            </div>
                                        
                        }

                       

                        {/* Used to treat */}
                        {mayTreat.length > 0 &&
                            <div className="row mb-4">
                                <p className="h4 ">Used to treat:</p>

                                <div className="together ">
                                    {filteredMayTreat.map((item, idx) => (
                                        <span className="pill" key={idx}>{item} </span>
                                    ))}
                                </div>
                            </div>
                        }
                                        

                        {/* DrugBank Link */}
                        {drugbankLink !== "" &&
                        <div className="row mb-4 mt-5 text-center">
                            <p className="h4 ">Find more information on <span className="capitalize">{medication.name}</span> <a href={drugbankLink} target="_blank">here</a></p> 
                        </div>
                        }
                                        
                        {/* Delete notification button */}
                        {medication.notification_time !== null &&
                            <div className="text-center">
                                <button type="button" className="btn btn-danger btn-space mb-5 delete-btn" onClick={() => deleteNotification(notificationId)} >Delete Notification</button>
                            </div>
                        }
                    </div>
                </div>        
            </>        
            }
            </div>        
        </>
    )
}