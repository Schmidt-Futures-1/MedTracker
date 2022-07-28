import "./MedicationDetails.css"
import { Link, useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";
import axios from "axios"
import LoadingPage from "../LoadingPage/LoadingPage";
import AccessForbidden from "../Error Pages/AccessForbidden";
import NotFound from "../Error Pages/NotFound";


export default function MedicationDetails (){
    // State Variables
    const {medicationId} = useParams();
    const [medication, setMedication] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState(null);     // Errors for fetchMedicationById api call
    const [nlmError, setNLMError] = useState(null); // Errors for api call from nlm api
    const [foundId, setFoundId] = useState(false);
    const [mayTreat, setMayTreat] = useState([])
    const [drugbankLink, setDrugBankLink] = useState("")

    const [refillAmount, setRefillAmount] = useState(0);
    const [error, setError] = useState({})
    
    // Fetch medication info from medications database 
    // Update when refillAmount is changed (meaning current pill count will be updated when user refills medications)
    useEffect( () => {
        async function fetchById() {
            setIsLoading(true);

            const { data, error, errorStatus } = await apiClient.fetchMedicationById(medicationId);

            if (error) {
                setErrors((e) => ({error, errorStatus}));
                // console.log("error", error, errorStatus)
            }
        
            if (data?.medication) {
                setMedication(data.medication);
                setFoundId(true);
                setErrors(null);
            }    

            setIsLoading(false);
        }
        
        fetchById();

    }, [refillAmount])

    // Fetch info on what medication is used to treat 
    useEffect(() => {
        axios.get("https://rxnav.nlm.nih.gov/REST/rxclass/class/byRxcui.json?rxcui="+ medication.rxcui +"&relaSource=MEDRT&relas=may_treat")

      .then((response) => {
        setMayTreat(response.data.rxclassDrugInfoList.rxclassDrugInfo)
      })

      .catch((error)=>{
        setNLMError(error)

      })
    }, [medication.rxcui])
    
    // Fetch link for medication
    useEffect(() => {
        axios.get("https://rxnav.nlm.nih.gov/REST/interaction/interaction.json?rxcui=" + medication.rxcui + "&sources=DRUGBANK")

      .then((response) => {
        setDrugBankLink(response.data.interactionTypeGroup[0].interactionType[0].interactionPair[0].interactionConcept[0].sourceConceptItem.url)
      })

      .catch((error)=>{
        setNLMError(error)

      })
    }, [ medication.rxcui])


    // If med info was successfully pulled from api, filter it
    // Must filter or else the info will appear twice
    if (mayTreat) {
        var tempMayTreat = mayTreat.map((current) => {

            return current.rxclassMinConceptItem.className
        })

        var filteredMayTreat = [...new Set(tempMayTreat)]

    }

    // Handles when user is typing into input in refill modal
    const handleOnInputChange = (event) => {
        setRefillAmount(event.target.value);
        // console.log("medication id in input change", medication.id)
        // console.log("event", event)
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


    return (
        <>
        
            {/* Vertically Centered modal called when refill button is clicked*/}
            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">Refill Medication</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
                    
                    <div className="col gx-4 gx-lg-5 h-100 mx-auto  pb-5 exam-details">

                        {/* Title row */}
                        <Link className="back-link" to="/cabinet">
                                <button className="back-link "> &#8249; Back to Medicine Cabinet</button>
                        </Link>


                        {/* Edit and Refill buttons */}
                        <Link className=" btn-dark btn btn-block edit-button" to={`/cabinet/edit/${medicationId}`}>
                                Edit
                        </Link>

                        <button type="button" className="btn btn-dark btn-space refillBtn" data-bs-toggle="modal" data-bs-target="#staticBackdrop" >Refill</button>


                        {/* Medication Name */}           
                        <div className="row">
                            <h2 className="fw-bold mb-5 row capitalize">{medication.name}</h2>
                        </div>           
                    

                        {/* Strength */}
                        <div className="row mb-4 ">                     
                        <p className="h4">Strength: {medication.strength} {medication.units}</p> 
                        </div>

                        {/* Frequency */}
                        <div className="row mb-4">
                        <p className="h4">Frequency: {medication.frequency}</p> 
                        </div>

                        {/* Count */}
                        <div className="row mb-4">
                        <p className="h4">Pills Left: {medication.current_pill_count}/{medication.total_pill_count}</p> 
                        </div>

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
        </>

        



    )
}