import "./MedicationDetails"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";
import axios from "axios"


export default function MedicationDetails (){
    // State Variables
    const {medicationId} = useParams();
    const [medication, setMedication] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const [foundId, setFoundId] = useState(false);
    const [mayTreat, setMayTreat] = useState([])

    
    // Fetch medication info from medications database 
    useEffect( () => {
        async function fetchById() {
            setIsLoading(true);

            const { data, error } = await apiClient.fetchMedicationById(medicationId);

            if (error) {
                setErrors((e) => ({error}));
            }
        
            if (data?.medication) {
                setMedication(data.medication);
                setFoundId(true);
            }    

            setIsLoading(false);
        }
        
        fetchById();

    }, [])

    // Fetch info about medication
    useEffect(() => {
        axios.get("https://rxnav.nlm.nih.gov/REST/rxclass/class/byRxcui.json?rxcui="+ medication.rxcui +"&relaSource=MEDRT&relas=may_treat")

      .then((response) => {
        setMayTreat(response.data.rxclassDrugInfoList.rxclassDrugInfo)
      })

      .catch((error)=>{
          setErrors(errors)

      })
    }, [ medication.rxcui])


    
    if (mayTreat) {
        var tempMayTreat = mayTreat.map((current) => {

            return current.rxclassMinConceptItem.className
        })

        var filteredMayTreat = [...new Set(tempMayTreat)]

    }

    if (medication.rxcui !== 0 && filteredMayTreat) {
        console.log(medication.rxcui)
        for (let i = 0; i < filteredMayTreat.length; i++){
            console.log(filteredMayTreat[i])

        }
    }


    return (
        <div className="container px-4 px-lg-5 h-100">
            <div className="col gx-4 gx-lg-5 h-100 mx-auto  pb-5">

                {/* Title row */}
                <div className="row">
                    <h2 className="fw-bold mb-5 row">{medication.name}</h2>
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
                    <p className="h4">Used to treat:</p> 
                    {filteredMayTreat.map((item, idx) => (
                        <span  key={idx}>{item}</span>
                    ))}
                    </div>
                

            </div>
        </div>

    )
}