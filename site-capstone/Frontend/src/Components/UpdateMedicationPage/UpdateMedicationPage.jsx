import { useState, useEffect } from "react"
import axios from "axios"
import "./UpdateMedicationPage.css"
import TimePicker from "react-time-picker"
import apiClient from "../../services/apiClient"
import { useNavigate, useParams } from "react-router-dom"
import { Cron } from 'react-js-cron';
import 'react-js-cron/dist/styles.css';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import LoadingPage from "../LoadingPage/LoadingPage"


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
    });

    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({});

    const [medication, setMedication] = useState({})
    const {medicationId} = useParams();


    const navigate = useNavigate()

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
                setForm({
                    medicationName: medData.name,
                    rxcui: medData.rxcui,
                    strength: medData.strength,
                    units: medData.units,
                    frequency: medData.frequency,
                    currentPillCount: medData.current_pill_count,
                    maxPillCount: medData.total_pill_count,            
                })
            }    

            setIsLoading(false);
        }
        
        fetchById();

        

    }, [navigate])

    // Functions --------------------------------------------------------------

    const handleOnInputChange = (event) => {
        setForm((f) => ({ ...f, [event.target.name]: event.target.value }));
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


        /////////// Api Calls ///////////
        //setIsLoading(true);

        const { data, error } = await apiClient.updateMedicationDetails({name: form.medicationName, rxcui: form.rxcui, strength: form.strength, units: form.units, frequency: form.frequency, current_pill_count: form.currentPillCount, total_pill_count: form.maxPillCount}, medicationId)

        if (data) {
            setForm({ medicationName: "", rxcui: 0, strength: "", units: "mg", frequency: "As Needed", currentPillCount: "",maxPillCount: ""})
            navigate(`/cabinet/${medicationId}`)
           
        }
        if (error) {
            setErrors((e) => ({ ...e, form:error }));
        }

        //setIsLoading(false)
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
        <>
            {isLoading? <LoadingPage /> :

            <div className="container px-4 px-lg-5 h-100">
                <div className="col gx-4 gx-lg-5 h-100 mx-auto pb-5">
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
                                <input name="medicationName" type="text" className="form-control" placeholder="Medication" value={form.medicationName} onChange={handleOnInputChange} />
                                <div>
                            {/* {form.rxcui !== 0 && form.medicationName.length !== 0 &&
                                        <div className="success">
                                            {form.medicationName} is a valid medication
                                        </div>
                            }

                            {form.rxcui === 0 && form.medicationName.length !== 0 &&
                                <div className="error">Please enter a a valid medication!</div>
                                    }  */}
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

                        

                        <div className="align-self-baseline text-center mt-4 mb-5">
                            <a className="btn btn-dark btn-x1 row " onClick={handleOnSubmit}>Update Medication</a> 
                        </div>
                    </form>
                </div>
            </div>            
            
            }
        
        </>

    ) 
}