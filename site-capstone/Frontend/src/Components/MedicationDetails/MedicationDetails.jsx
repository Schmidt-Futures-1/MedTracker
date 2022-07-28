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
    // State Variables
    const { medicationId } = useParams();
    const [medication, setMedication] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState(null);     // Errors for fetchMedicationById api call
    const [nlmError, setNLMError] = useState(null); // Errors for api call from nlm api
    const [foundId, setFoundId] = useState(false);
    const [mayTreat, setMayTreat] = useState([])
    const [drugbankLink, setDrugBankLink] = useState("")
    
    // Fetch medication info from medications database 
    useEffect(() => {
        async function fetchById() {
            setIsLoading(true);

            const { data, error, errorStatus } = await apiClient.fetchMedicationById(medicationId);

            if (error) {
                setErrors((e) => ({ error, errorStatus }));
            }
        
            if (data?.medication) {
                setMedication(data.medication);
                setFoundId(true);
                setErrors(null);
            }

            setIsLoading(false);
        }
        
        fetchById();

    }, [])

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
    
    return (
        <div className="med-details-page">
        {/* Error checks for page, if user attempts to access another user's med details page or if they try to access med details that don't exist */}
        {isLoading? <LoadingPage /> :
        (errors?.errorStatus === 403)? <AccessForbidden message={errors.error}/> :
        (errors?.errorStatus === 404)? <NotFound /> :
                        <>
                            
                            
                            <div className="container px-4 px-lg-5 h-100">
                                
                                
            <div className="col gx-4 gx-lg-5 h-100 mx-auto  pb-5 exam-details">

                                    {/* Title row */}
                                    <Link className="back-link" to="/cabinet">
                                            <button className="back-link "> &#8249; Back to Medicine Cabinet</button>
                                    </Link>

                                    <Link className=" btn-dark btn btn-block edit-button" to={`/cabinet/edit/${medicationId}`}>
                                           Edit
                                    </Link>
                                    <div className="row">

                                        <h2 className="fw-bold mb-5 row capitalize">{medication.name}</h2>
                                    </div>
                                    
                
                    {/* Strength */}
                    <div className="row mb-4 ">
                    <p className="h4">Strength: {medication.strength} {medication.units}</p> 
                    </div>

                                    {/* Frequency is AS NEEDED */}
                                    {medication.frequency === "As Needed" &&
                                        <div className="row mb-4">
                                            <p className="h4">Frequency: {medication.frequency}</p>
                                        </div>
                                    }

                                    {/* Frequency is SCHEDULED */}
                                    {medication.frequency === "Everyday" && nextAlert &&
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
                    <div className="row mb-4">
                        <p className="h4 ">Used to treat:</p> 

                        <div className="together ">
                            {filteredMayTreat.map((item, idx) => (
                                <span className="pill" key={idx}>{item} </span>
                            ))}
                        </div>
                                    </div>
                                    

                    {/* DrugBank Link */}
                    <div className="row mb-4 mt-5 text-center">
                        <p className="h4 ">Find more information on {medication.name} <a href={drugbankLink} target="_blank">here</a></p> 
                    </div>
                

            </div>
        </div>        
        
        </>        
        }
        </div>
        



    )
}