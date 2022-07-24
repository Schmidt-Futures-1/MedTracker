import { useState, useEffect } from "react"
import axios from "axios"
import "./Interaction.css"

export default function Interaction({ }) {
    


    // State variables ----------------------------------------------------------------------------

    // Medication 1 input form data
    const [form1, setForm1] = useState({
        medication1: "",
        rxcui1: 0,
    });

    // Medication 2 input form data
    const [form2, setForm2] = useState({
        medication2: "",
        rxcui2: 0,
    });

    // API results for an interaction pair
    const [interactionInfo, setInteractionInfo] = useState({
        severity: "",
        description: "",
        link1: "",
        link2: ""
    });

    // API name for first medication
    const [name1, setName1] = useState("");

    // API name for second medication
    const [name2, setName2] = useState("");
    const [errors, setErrors] = useState({});



    // Functions ----------------------------------------------------------------------------------

    // Updates form1
    const handleOnInputChange1 = (event) => { 
        setForm1((f) => ({ ...f, [event.target.name]: event.target.value })); 
    }

    // Updates form 2
    const handleOnInputChange2= (event) => { 
        setForm2((f) => ({ ...f, [event.target.name]: event.target.value })); 
    }


    // Retrieves API response data for medication 1
    useEffect(() => {
        axios.get("https://rxnav.nlm.nih.gov/REST/rxcui.json?name=" + form1.medication1 + "&search=1")
            .then((response) => {
                setForm1({...form1 ,rxcui1: response.data.idGroup.rxnormId[0]})
            })
            .catch((error) => {
                setForm1({...form1 ,rxcui1: 0})
            })
        
    }, [form1.medication1])

    // Retrieves API response data for medication 2
    useEffect(() => {
        axios.get("https://rxnav.nlm.nih.gov/REST/rxcui.json?name=" + form2.medication2 + "&search=1")
            .then((response) => {                
                setForm2({...form2 ,rxcui2: response.data.idGroup.rxnormId[0]})
            })
            .catch((error) => {
                setForm2({...form2 ,rxcui2: 0})
            })
        
    }, [form2.medication2])

    // Retrieves API response data for an interaction
    const handleOnCompare = () => {
       
        axios.get("https://rxnav.nlm.nih.gov/REST/interaction/list.json?rxcuis=" + form1.rxcui1 + "+" + form2.rxcui2)
                
            // Valid request handling for successful interaction
            .then((response) => {

                if (form1.rxcui1 !== form2.rxcui2) {
                    setInteractionInfo({
                        ...interactionInfo, severity: response.data.fullInteractionTypeGroup[0].fullInteractionType[0].interactionPair[0].severity,
                        description: response.data.fullInteractionTypeGroup[0].fullInteractionType[0].interactionPair[0].description,
                        link1: response.data.fullInteractionTypeGroup[0].fullInteractionType[0].interactionPair[0].interactionConcept[0].sourceConceptItem.url,
                        link2: response.data.fullInteractionTypeGroup[0].fullInteractionType[0].interactionPair[0].interactionConcept[1].sourceConceptItem.url,
                    })
                    
                    setName1(response.data.fullInteractionTypeGroup[0].fullInteractionType[0].minConcept[0].name)
                    setName2(response.data.fullInteractionTypeGroup[0].fullInteractionType[0].minConcept[1].name)
                }
                else if (form1.rxcui1 === 0 && form2.rxcui2 === 0) {
                    setInteractionInfo({
                        ...interactionInfo, severity: "invalid",
                        description: "Invalid request! Please enter valid medication names!"
                    })
                }
                else if (form1.rxcui1 === form2.rxcui2 ) {
                    setInteractionInfo({
                        ...interactionInfo, severity: "invalid",
                        description: "These two medications are the same. Please enter differing names."
                    })
                }
            })
            

            // Error handling for invalid interaction requests
            .catch((error) => {
                
                if (form1.rxcui1 !== 0 && form2.rxcui2 !== 0 && form1.medication1 !== form2.medication2 ) {
                    setInteractionInfo({
                        ...interactionInfo, severity: "",
                        description: "There was no interaction data found for these medications."
                    })
                }
                else if (form1.rxcui1 === 0 && form2.rxcui2 === 0) {
                    setInteractionInfo({
                        ...interactionInfo, severity: "invalid",
                        description: "Invalid request! Please enter valid medication names!"
                    })
                }
                else if (form1.rxcui1 === 0 && form2.rxcui2 !== 0) {
                    setInteractionInfo({
                        ...interactionInfo, severity: "invalid",
                        description: "Invalid request! Please enter a valid name for Medication 1!"
                    })
                }
                else if (form1.rxcui1 !== 0 && form2.rxcui2 === 0) {
                    setInteractionInfo({
                        ...interactionInfo, severity: "invalid",
                        description: "Invalid request! Please enter a valid name for Medication 2!"
                    })
                }
                else if (form1.rxcui1 !== 0 && form2.rxcui2 !== 0 ){
                    setInteractionInfo({
                        ...interactionInfo, severity: "same",
                        description: "These two medications are the same. Please enter differing names."
                    })
                }
            })
    }





    // HTML ---------------------------------------------------------------------------------------
    return (
        <div className="container px-4 px-lg-5 h-100">
            <div className="col gx-4 gx-lg-5 h-100 mx-auto  pb-5">
                <div className="form-row row">
                    <h2 className="fw-bold mb-5 row">Interaction Checker</h2>
                </div>


                <form>

                    {errors?.form1 ?
                        <div className="text-center">
                            <label className=" form-label error  "> {errors.form1} </label>
                        </div>
                        : ""
                    }

                    {/* Input forms */}
                    <div className="form-row row">

                        {/* Input form 1 */}
                        <div className="col-md-4 mb-3" >
                            
                        <label className="form-label"> Medication 1</label>
                            <input name="medication1" type="text"  autoComplete="off" className="form-control " placeholder="Medication 1" value={form1.medication1} onChange={handleOnInputChange1} />
                            
                            {/* Error handling for form 1*/}
                            <div>
                                {form1?.rxcui1 !== 0 && form1.medication1?.length !== 0 ?
                                    
                                    <div className="success">
                                        {form1.medication1} is a valid medication &#10003;
                                    </div>
                                    :
                                    <div >
                                        &nbsp;
                                    </div>
                                }

                                {form1?.rxcui1 === 0 && form1.medication1?.length !== 0 ?
                                    <div className="error">Please enter a a valid medication!</div>
                                    :
                                    <div >
                                        &nbsp;
                                    </div>
                                    
                                } 
                            </div>   
                        </div>

                        {/* Input form 2 */}
                        <div className="col-md-4 mb-3" >                           
                            <label className="form-label"> Medication 2</label>
                            <input id='myInput' name="medication2" type="text" className="form-control" placeholder="Medication 2" value={form2.medication2} onChange={handleOnInputChange2} />
                            <div>
                                {form2.rxcui2 !== 0 && form2.medication2.length !== 0 ?
                                    <div className="success">
                                        {form2.medication2} is a valid medication &#10003;
                                    </div>
                                    :
                                    
                                    <div >
                                        &nbsp;
                                    </div>
                                }

                                {/* Error handling for form 2 */}
                                {form2.rxcui2 === 0 && form2.medication2.length !== 0 ?
                                    
                                    <div className="error">Please enter a a valid medication!</div>
                                    :
                                    <div >
                                        &nbsp;
                                    </div>
                                } 
                            </div>   
                        </div>

                        {/* Compare button */}
                        <div className="align-self-baseline text-center mt-4 mb-5">
                            <a className="btn btn-dark btn-x1 row " onClick={handleOnCompare}>Compare</a> 
                        </div>
                    </div>
                </form>

                {/* Interaction response data ------------------------------------------------- */}
                
                {/* Valid interaction found */}
                {interactionInfo.severity !== ""  && interactionInfo.severity !== "invalid" && interactionInfo.severity !== "same" &&
                    
                    <div>
                        <div className="row response">
                            Severity: {interactionInfo.severity}
                        </div>
                        <br></br>

                        <div className="row response">
                            Description: {interactionInfo.description}
                        </div>
                        <br></br>
                       
                        <br />
                        <div className="row response links">
                            For more information on {name1}, click<a href={interactionInfo.link1} target="_blank">here</a>
                            
                        </div>
                        <br/>
                        <div className="row response links">
                            For more information on {name2}, click<a href={interactionInfo.link2} target="_blank">here</a>
                        </div>
                        
                    </div>
                }

                {/* Display invalid interaction */}
                {interactionInfo.severity === "" && interactionInfo.description !== "" ?
                    
                    <div>
                        <div className="row response">
                            {interactionInfo.description}
                        </div>
                    </div>
                    

                    :
                    <div className="row response"> 
                    </div>
                }

                {/* Display invalid interaction */}
                {interactionInfo.severity === "invalid" ?
                    <div>
                        <div className="row response error">
                            {interactionInfo.description}
                        </div>
                    </div>
                    :
                    <div className="row response"> 
                    </div>
                }

                {/* Display interaction between 2 medications of the same name */}
                {interactionInfo.severity === "same" ?
                    <div>
                        <div className="row response error">
                            {interactionInfo.description}
                        </div>
                    </div>
                    :
                    <div className="row response"> 
                    </div>
                }


        </div>
    </div>
    )
}
