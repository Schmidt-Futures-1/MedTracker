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
    
    // Fetch medication info from medications database 
    useEffect( () => {
        async function fetchById() {
            setIsLoading(true);

            const { data, error, errorStatus } = await apiClient.fetchMedicationById(medicationId);

            if (error) {
                setErrors((e) => ({error, errorStatus}));
                console.log("error", error, errorStatus)
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

    // if (medication.rxcui !== 0 && filteredMayTreat) {
    //     console.log(medication.rxcui)
    //     for (let i = 0; i < filteredMayTreat.length; i++){
    //         console.log(filteredMayTreat[i])

    //     }
    // }

    console.log("errors", errors?.errorStatus)


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

                    {/* Dosage - if available */}
                    {/* <div className="row mb-4 ">
                    <p className="h4">Dosage:</p> 
                    </div> */}

                    {/* Frequency */}
                    <div className="row mb-4">
                    <p className="h4">Frequency: {medication.frequency}</p> 
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
        



    )
}