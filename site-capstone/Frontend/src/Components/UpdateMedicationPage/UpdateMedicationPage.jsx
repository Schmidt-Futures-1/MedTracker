import { useState, useEffect } from "react"
import axios from "axios"
import "./UpdateMedicationPage.css"
import apiClient from "../../services/apiClient"
import { useNavigate, useParams } from "react-router-dom"
import { Cron } from 'react-js-cron';
import 'react-js-cron/dist/styles.css';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import LoadingPage from "../LoadingPage/LoadingPage"
import Cronstrue from "cronstrue"
import { Link } from "react-router-dom"
import { useAutocomplete } from "../Autocomplete/useAutocomplete";
import SearchBar from "../Autocomplete/SearchBar";


export default function UpdateMedication({user, setUser, addMedications, medications, addNotifications}) {

    // State Variables --------------------------------------------------------

    const [form, setForm] = useState({
        medicationName: "",
        rxcui: 0,
        strength: "",
        units: "mg",
        frequency: "As Needed",
        currentPillCount: "",
        maxPillCount: "",
        dosage: "",
        convertedTime: '',
        timezone: "UTC",
        nonConvertedTime: ''
    });

    const [defaultValues, setDefaultValues] = useState({
        dosage: "",
        convertedTime: '',
        timezone: "UTC",
        nonConvertedTime: ''
    })

    //const [dosage, setDosage] = useState("")        // Amount of pills they are taking at a specific time
    //const [cronTime, setCronTime] = useState('');   // Notification time formatted in cronTime
    const [notificationId, setNotificationId] = useState(0);

    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({});

    const [medication, setMedication] = useState({})
    const {medicationId} = useParams();


    const navigate = useNavigate()

    // The value of the search bar
    const [searchQuery, setSearchQuery] = useState("");
    // The hook to retrieve autocomplete results using "searchQuery"
    const autocompleteResults = useAutocomplete(searchQuery);

    // Functions --------------------------------------------------------

      // Fetch medication info from medications database 
      useEffect( () => {
        async function fetchById() {
            setIsLoading(true);

            const { data, error, errorStatus } = await apiClient.fetchMedicationById(medicationId);

            if (error) {
                setErrors((e) => ({error, errorStatus}));
            }
        
            if (data?.medication) {
                const medData = data.medication
                setMedication(data.medication);
                setErrors(null);
                setDefaultValues({
                    timezone: medData.timezone,
                    convertedTime: medData.notification_time,
                    nonConvertedTime: medData.non_converted_time,
                    dosage: medData.dosage                     
                })
                setForm({
                    medicationName: medData.name,
                    rxcui: medData.rxcui,
                    strength: medData.strength,
                    units: medData.units,
                    frequency: medData.frequency,
                    currentPillCount: medData.current_pill_count,
                    maxPillCount: medData.total_pill_count,   
                    timezone: medData.timezone,
                    convertedTime: medData.notification_time,
                    nonConvertedTime: medData.non_converted_time,
                    dosage: medData.dosage        
                })

                setSearchQuery(medData.name)

                setNotificationId(medData.notification_id)

                if (!data.medication?.non_converted_time) {
                    setForm((f) => ({...f, 
                        nonConvertedTime: '0 0 * * *',
                        convertedTime: '0 0 * * *'
                    }))                    
                }
            }    

            setIsLoading(false);
        }
        
        fetchById();
    }, [navigate])

    // Functions --------------------------------------------------------------

    const handleOnInputChange = (event) => {
        if (event.target?.name) {
            setForm((f) => ({ ...f, [event.target.name]: event.target.value }));
        }
    }

    // The onChange handler for the search input
    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Variable needed to adjust the timezone
    var timeChange = 0

    async function handleOnCronTimeChange (newTime)  {

        if (newTime == undefined) {
            return
        }

        setForm((f) => ({ ...f, nonConvertedTime: newTime}))

        // Split the cron string on spaces
        const splitCron = newTime.split(' ');

        // Initialize variables required for for-loop
        let loopLimit = 0
        let cronSplitOnComma = ""

        // Check if hour portion of cron string has any commas
        if (splitCron[1].includes(',')) {

            // Get the number of commas in this string
            // allows us to know how many times to loop
            loopLimit = ((splitCron[1].match(new RegExp(",", "g")) || []).length)
                
            // Split this string on the commas
            cronSplitOnComma = splitCron[1].split(',')
        }

        // Create variables to hold temporary & final values for hour
        let newHour = ""
        let tempNewHour = 0

        // Convert the hours in cron string based on the timezone
        for (let i = 0; i < loopLimit + 1; i++){

            if (form.timezone === "EST") { timeChange = 4 }
            else if (form.timezone === "CST") { timeChange = 5 }
            else if (form.timezone === "MST") { timeChange = 6 }
            else if (form.timezone === "PST") { timeChange = 7 }

            // Execute when we DO NOT have a comma
            if (loopLimit === 0) {

                // Add timezone difference
                tempNewHour = parseInt(splitCron[1]) + timeChange

                // Adjust time if tempNewHour goes above 0 or 23
                if (tempNewHour < 0) { tempNewHour = parseInt(tempNewHour) + 24 }
                else if (tempNewHour > 23) { tempNewHour = parseInt(tempNewHour) - 24 }
            }

            // Execute when we DO HAVE a comma
            else {

                // Add timezone difference
                tempNewHour = parseInt(cronSplitOnComma[i]) + timeChange
   
                // Adjust time if tempNewHour goes above 0 or 23
                if (tempNewHour < 0) { tempNewHour = parseInt(tempNewHour) + 24 }
                else if (tempNewHour > 23) { tempNewHour = parseInt(tempNewHour) - 24 }
            }

            // Add onto the previous new hour string
            newHour = newHour + tempNewHour  + ","
        }

        // We need to check if the string contains commas at all
        if (newHour.includes(",")) {

            // Drop the last comma to fix formatting
            newHour = newHour.substring(0, newHour.length - 1);
        }

        // set the finalized cron time as convertedCron
        setForm((f) => ({ ...f, 
            convertedTime: (splitCron[0] + " " + newHour + " " + splitCron[2] + " " + splitCron[3] + " " + splitCron[4]) }))

        return form.convertedTime
    }

    const updateNotification = async (medicationData) => {
        /////////// Api Call for Create Notification ///////////
        setIsLoading(true)

        // Delete old notification details
        if (notificationId !== 0) {
            await apiClient.deleteNotification(notificationId);
        }
        

        // Create new notification
        const { data, error } = await apiClient.createNotification({notification:{notification_time:form.convertedTime, dosage: form.dosage, timezone: form.timezone, non_converted_time: form.nonConvertedTime}, medication:medicationData})


        if (data) {
            //setDosage("")
            //setCronTime('* * * * *')
            setForm((f) => ({ ...f, 
                    convertedTime: '',
                    timezone: "UTC",
                    nonConvertedTime: '',
                    dosage: ""}))
            navigate(`/cabinet/${medicationId}`)
        }
        if (error) {
            setErrors((e) => ({ ...e, form:error }));
        }
        setIsLoading(false)
    }

    // Submit button functionality
    const handleOnSubmit = async () => {
        /////////// Error Checking ///////////
        if (form.rxcui === 0) {
            setErrors((e) => ({ ...e, form: "Invalid Medication Name" }));
            return;
        } else {      
            setErrors((e) => ({ ...e, form: null }));
        }
        if (form.strength < 0 || form.strength === "") {
            setErrors((e) => ({ ...e, form: "Invalid Strength" }));
            return;
        } else {      
            setErrors((e) => ({ ...e, form: null }));
        }

        if (form.currentPillCount < 0 || form.currentPillCount === "") {
            setErrors((e) => ({ ...e, form: "Invalid Current Medicine Count" }));
            return;
        } else {      
            setErrors((e) => ({ ...e, form: null }));
        }
        
        if (form.maxPillCount < 1 || form.maxPillCount === "") {
            setErrors((e) => ({ ...e, form: "Invalid Max Medicine Count" }));
            return;
        } else {      
            setErrors((e) => ({ ...e, form: null }));
        }

        if (form.maxPillCount < form.currentPillCount) {
            setErrors((e) => ({ ...e, form: "Max pill count must be greater or equal to current pill count" }));
            return;
        } else {      
            setErrors((e) => ({ ...e, form: null }));
        }

        // if (form.cronTime === '* * * * *' && form.frequency === "Scheduled") {
        //     setErrors((e) => ({ ...e, form: "Invalid Time" }));
        //     return;
        // } else {      
        //     setErrors((e) => ({ ...e, form: null }));
        // }

        if (form.dosage === "" && form.frequency === "Scheduled") {
            setErrors((e) => ({ ...e, form: "Invalid Dosage" }));
            return;
        } else {      
            setErrors((e) => ({ ...e, form: null }));
        }


        /////////// Api Calls ///////////
        //setIsLoading(true);

        // Update medication details
        const { data, error } = await apiClient.updateMedicationDetails({name: searchQuery, rxcui: form.rxcui, strength: form.strength, units: form.units, frequency: form.frequency, current_pill_count: form.currentPillCount, total_pill_count: form.maxPillCount}, medicationId)

        if (data) {
            setForm((f) => ({ ...f, medicationName: "", rxcui: 0, strength: "", units: "mg", frequency: "As Needed", currentPillCount: "",maxPillCount: ""}))
            navigate(`/cabinet/${medicationId}`)
           
        }
        if (error) {
            setErrors((e) => ({ ...e, form:error }));
        }

        // If notification information was changed, then update notification
        if ((form.convertedTime != defaultValues.convertedTime || form.dosage != defaultValues.dosage || form.nonConvertedTime!= defaultValues.nonConvertedTime || form.timezone != defaultValues.timezone) && form.frequency !== 'As Needed') {
            updateNotification(data.medication)
        }

        if (form.frequency === "As Needed") {
            await apiClient.deleteNotification(notificationId)
        }

        //setIsLoading(false)
    };

    // Get the rxcui from the API if the medication name is valid
    useEffect(() => {
        axios.get("https://rxnav.nlm.nih.gov/REST/rxcui.json?name=" + searchQuery + "&search=1")
            .then((response) => {
                setForm({...form ,rxcui: response.data.idGroup.rxnormId[0]})
            })
            .catch((error) => {
                setForm({...form ,rxcui: 0})
            })
        
    }, [searchQuery])

    // Update the converted cron time whenever timezone selected time is changed
    useEffect(() => {
        handleOnCronTimeChange()
        
    }, [ form.timezone])


    return (
        <>
            {isLoading? <LoadingPage /> :

            <div className="container px-4 px-lg-5 h-100">
                <div className="col gx-4 gx-lg-5 h-100 mx-auto pb-5">
                    <Link className="back-link refill-back" to={`/cabinet/`+medicationId}>
                                &#8249; Back
                    </Link>

                    <div className="form-row row">
                        <h2 className="fw-bold mb-5 row">Edit Medication</h2>
                    </div>
                    <form>

                    {errors?.form ?
                            <div className="text-center">
                            
                    <label className=" form-label error  "> { errors.form} </label>
                    </div>
                    : ""
                }
                        {/* ROW 1 - Medication Name */}
                        <div className="form-row row">
                            <div className="col-md-6 mb-3" >                           
                                <label className="form-label"> Medication Name</label>
                                <SearchBar
                                    name="update-medicine"
                                    className="form-control"
                                    searchQuery={searchQuery}
                                    handleOnChange={(e) => {
                                        handleSearchInputChange(e);
                                    }}
                                    autocompleteResults={autocompleteResults}
                                />
                            <div>
                            {form.rxcui !== 0 && searchQuery.length !== 0 &&
                                        <div className="success">
                                            {searchQuery} is a valid medication
                                        </div>
                            }

                            {form.rxcui === 0 && searchQuery.length !== 0 &&
                                <div className="error">Please enter a valid medication!</div>
                                    } 
                                </div>                        
                            </div>
                        </div>

                        {/* ROW 2 -  */}
                        <div className="row mb-3 ">
                            <div className="md-2 col-md-3">
                                <div className="form-outline">
                                    <label className="form-label">Strength</label>
                                    <input min={0} name="strength" type="number" className="form-control strength-box-padding" placeholder="Strength" value={form.strength}  onChange={handleOnInputChange} />
                                </div>
                            </div>
                            
                            <div className="col-md-3">
                                <label className="mb-2" >Units</label>
                                    <select name="units" id="inputState" className="form-control" value={form.units}  onChange={handleOnInputChange}>
                                        <option >ug</option>
                                        <option defaultValue>mg</option>
                                        <option>g</option>

                                    </select>
                            </div>
                        </div>

                        {/* ROW 3 - Pill Counts */}
                        <div className="row mb-3 ">
                            <div className="md-2 col-md-3">
                                <div className="form-outline">
                                    <label className="form-label">Current Pill Count</label>
                                    <input min={0} name="currentPillCount" type="number" className="form-control strength-box-padding" placeholder="Current Pill Count" value={form.currentPillCount}  onChange={handleOnInputChange}/>
                                </div>
                            </div>
                            
                            <div className="md-2 col-md-3 ">
                                <div className="form-outline">
                                    <label className="form-label">Max Pills per Container</label>
                                    <input min={1} name="maxPillCount" type="number" className="form-control" placeholder="Max Pills per Container" value={form.maxPillCount}  onChange={handleOnInputChange}/>
                                </div>
                            </div>
                        </div>

                        {/* ROW 4 - Frequency */}
                        <div className="row mb-3 ">
                        <div className="col-md-6">
                                <label className="mb-2" >Frequency</label>
                                    <select name="frequency" id="inputState" className="form-control" value={form.frequency}  onChange={handleOnInputChange}>
                                        <option defaultValue>As Needed</option>
                                        <option>Scheduled</option>
                                    </select>
                            </div>
                            </div>
                            
                            {/* Timezone */}
                            {form.frequency === "Scheduled" ?
                                <div className="row mb-3 ">
                                    <div className="col-md-6">
                                        <label className="mb-2" >Timezone</label>
                                        <select name="timezone" id="inputState" className="form-control" value={form.timezone} onChange={handleOnInputChange}>
                                            <option defaultValue>UTC</option>
                                            <option>EST</option>
                                            <option>CST</option>
                                            <option>MST</option>
                                            <option>PST</option>
                                        </select>
                                    </div>
                                </div>
                                : ""}
                        
                        {/* OPTIONAL ROW 5 - Timing */}
                            {form.frequency === "Scheduled" ?
                                
                                <div className=" text-center row mb-3 ">
                                    
                                    {/* Readable Frequency */}
                                    <div className="row mt-4 mb-2 text-center">
                                        <p className="h4">{Cronstrue.toString(form.nonConvertedTime, { verbose: true })}</p>
                                        <p className="fw-light">*You are going to receive an sms text message reminder for this medication. </p>
                                    </div>

                                <label className="form-label">Reminder Time</label>
                                <div className=" mb-3">

                                    <Cron className="cron-inputs"
                                        defaultPeriod={'day'} 
                                        allowedPeriods={[
                                            'week',
                                            'day'
                                        ]}
                                        leadingZero={'minutes'}
                                        clockFormat={'12-hour-clock'}
                                        value={form.nonConvertedTime}
                                        setValue={handleOnCronTimeChange}
                                        />    
                                                                        
                                </div>
                                <div className=" text-center md-2 col-md-3 ">
                                        <label className="form-label">Dosage</label>
                                        <input min={1} name="dosage" type="number" className="form-control" placeholder="Dosage" value={form.dosage} onChange={handleOnInputChange} />
                                        
                                    </div> 
                            </div>
                            : ""
                        }
                        
                        <div className="align-self-baseline text-center mt-4 mb-5">
                            <a className="btn btn-dark btn-x1 row " onClick={handleOnSubmit}><span>Update Medication</span></a> 
                        </div>
                    </form>
                </div>
            </div>            
            }
        </>
    ) 
}
