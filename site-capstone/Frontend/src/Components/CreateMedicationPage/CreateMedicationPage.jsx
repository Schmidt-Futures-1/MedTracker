import { useState, useEffect } from "react"
import axios from "axios"
import "./CreateMedicationPage.css"
import TimePicker from "react-time-picker"
import apiClient from "../../services/apiClient"
import { useNavigate } from "react-router-dom"
import { Cron } from 'react-js-cron';
import 'react-js-cron/dist/styles.css';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import "./CreateMedicationPage.css"



export default function CreateMedication({user, setUser, addMedications, medications, addNotifications}) {

    // State Variables --------------------------------------------------------

    const [form, setForm] = useState({
        medicationName: "",
        rxcui: 0,
        strength: "",
        units: "mg",
        frequency: "As Needed",
        currentPillCount: "",
        maxPillCount: "",
    });

    const [dosage, setDosage] = useState("")        // Amount of pills they are taking at a specific time
    const [cronTime, setCronTime] = useState('');   // Notification time formatted in cronTime


    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({});


    const navigate = useNavigate()

    // Functions --------------------------------------------------------------

    const handleOnInputChange = (event) => {
        setForm((f) => ({ ...f, [event.target.name]: event.target.value }));
    }

    const handleOnDosageChange = (event) => {
        setDosage(event.target.value)
    }

    const createMedication = async () => {
        /////////// Api Call for Create Medication ///////////
        setIsLoading(true)

        const { data, error } = await apiClient.createMedication({name: form.medicationName, rxcui: form.rxcui, strength: form.strength, units: form.units, frequency: form.frequency, current_pill_count: form.currentPillCount, total_pill_count: form.maxPillCount})

        // Save medication data in variable that is returned by this function. It needs to be passed in to the createNotification call
        const medicationData = data.medication;

        if (data) {
            addMedications(data.medication)
            setForm({ medicationName: "", rxcui: 0, strength: "", units: "mg", frequency: "As Needed", currentPillCount: "",maxPillCount: ""})

            if (form.frequency === "As Needed") {
                navigate("/cabinet")
            }
           
        }
        if (error) {
            setErrors((e) => ({ ...e, form:error }));
        }

    
        setIsLoading(false)

        return medicationData;

    }

    
    const createNotification = async (medicationData) => {
        /////////// Api Call for Create Notification ///////////
        setIsLoading(true)

        const { data, error } = await apiClient.createNotification({notification:{notification_time:cronTime, dosage}, medication:medicationData})


        if (data) {
            addNotifications(data.newNotification)
            setDosage("")
            setCronTime('* * * * *')
            navigate("/cabinet")
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

        if (cronTime === '* * * * *' && form.frequency === "Scheduled") {
            setErrors((e) => ({ ...e, form: "Invalid Time" }));
            return;
        } else {      
            setErrors((e) => ({ ...e, form: null }));
        }

        if (dosage === "" && form.frequency === "Scheduled") {
            setErrors((e) => ({ ...e, form: "Invalid Dosage" }));
            return;
        } else {      
            setErrors((e) => ({ ...e, form: null }));
        }

        /////////// Api Calls ///////////
        const medicationData = await createMedication();
        if (form.frequency !== "As Needed") {
            await createNotification(medicationData);
        }
        setIsLoading(false);
        
    };

    // Get the rxcui from the API if the nmedication name is valid
    useEffect(() => {
        axios.get("https://rxnav.nlm.nih.gov/REST/rxcui.json?name=" + form.medicationName + "&search=1")
            .then((response) => {
                setForm({...form ,rxcui: response.data.idGroup.rxnormId[0]})
            })
            .catch((error) => {
                setForm({...form ,rxcui: 0})
            })
        
    }, [form.medicationName])


    return (
        <div className="container px-4 px-lg-5 h-100">
            <div className="col gx-4 gx-lg-5 h-100 mx-auto pb-5">
                <div className="form-row row">
                    <h2 className="fw-bold mb-5 row">Add Medication</h2>
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
                            <input name="medicationName" type="text" className="form-control" placeholder="Medication" value={form.medicationName} onChange={handleOnInputChange} />
                            <div>
                        {form.rxcui !== 0 && form.medicationName.length !== 0 &&
                                    <div className="success">
                                        {form.medicationName} is a valid medication
                                    </div>
                        }

                        {form.rxcui === 0 && form.medicationName.length !== 0 &&
                            <div className="error">Please enter a a valid medication!</div>
                                } 
                            </div>                        
                        </div>
                    </div>

                    {/* ROW 2 -  */}
                    <div className="row mb-3 ">
                        <div className="md-2 col-md-3">
                            <div className="form-outline">
                                <label className="form-label">Strength</label>
                                <input min={0} name="strength" type="number" className="form-control" placeholder="Strength" value={form.strength}  onChange={handleOnInputChange} />
                            </div>
                        </div>
                        
                        <div className="col-md-3">
                            <label className="mb-2" >Units</label>
                                <select name="units" id="inputState" className="form-control" value={form.units}  onChange={handleOnInputChange}>
                                    <option defaultValue>mg</option>
                                    <option>mL</option>
                                </select>
                        </div>
                    </div>

                     {/* ROW 3 - Pill Counts */}
                    <div className="row mb-3 ">
                        <div className="md-2 col-md-3">
                            <div className="form-outline">
                                <label className="form-label">Current Pill Count</label>
                                <input min={0} name="currentPillCount" type="number" className="form-control" placeholder="Current Pill Count" value={form.currentPillCount}  onChange={handleOnInputChange}/>
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
                    
                    {/* OPTIONAL ROW 5 - Timing */}
                    {form.frequency === "Scheduled" ?
                        <div className=" text-center row mb-3 ">
                            <label className="form-label">Notification Time</label>
                            <div className=" mb-3">

                                <Cron className="cron-inputs"
                                    defaultPeriod={'day'} 
                                    allowedPeriods={[
                                        'year',
                                        'month',
                                        'week',
                                        'day'
                                    ]}
                                    leadingZero={'minutes'}
                                    clockFormat={'12-hour-clock'}
                                    value={cronTime}
                                    setValue={setCronTime}
                                />          
                                
                            </div>
                            <div className=" text-center md-2 col-md-3 ">
                                    <label className="form-label">Dosage</label>
                                    <input min={1} name="dosage" type="number" className="form-control" placeholder="Dosage" value={dosage} onChange={handleOnDosageChange} />
                                    
                                </div> 
                        </div>
                        : ""
                    }

                    <div className="align-self-baseline text-center mt-4 mb-5">
                        <a className="btn btn-dark btn-x1 row " onClick={handleOnSubmit}>Add Medication</a> 
                    </div>
                </form>
            </div>
        </div>
    ) 
}