import { useState, useEffect } from "react"
import axios from "axios"
import "./Interaction.css"
import { useAutocomplete } from "../Autocomplete/useAutocomplete";
import SearchBar from "../Autocomplete/SearchBar";
import React, { useRef } from "react";


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
    const [mayTreat1, setMayTreat1] = useState([])


    // API name for second medication
    const [name2, setName2] = useState("");
    const [mayTreat2, setMayTreat2] = useState([])

    const [errors, setErrors] = useState({});
    const [nlmError, setNLMError] = useState(null); // Errors for api call from nlm api

    const [selectedOption1, setSelectedOption1] = useState(null); // Selected option from medicine name drop down
    const [selectedOption2, setSelectedOption2] = useState(null); // Selected option from medicine name drop down

    // The value of the search bar 1
    const [searchQuery1, setSearchQuery1] = useState("");
    // The hook to retrieve autocomplete 1 results using "searchQuery"
    const autocompleteResults1 = useAutocomplete(searchQuery1);

    // The value of the search bar 2
    const [searchQuery2, setSearchQuery2] = useState("");
    // The hook to retrieve autocomplete 2 results using "searchQuery"
    const autocompleteResults2 = useAutocomplete(searchQuery2);


    // References the component we would like to auto-scroll to
    const titleRef = useRef();

    // Functions ----------------------------------------------------------------------------------

    // The onChange handler for the search input 1
    const handleSearchInputChange1 = (e) => {
        setSearchQuery1(e.target.value);
    };

    // The onChange handler for the search input 2
    const handleSearchInputChange2 = (e) => {
        setSearchQuery2(e.target.value);
    };


    // Retrieves API response data for medication 1
    useEffect(() => {
        axios.get("https://rxnav.nlm.nih.gov/REST/rxcui.json?name=" + searchQuery1 + "&search=1")
            .then((response) => {
                setForm1({...form1 ,rxcui1: response.data.idGroup.rxnormId[0]})
            })
            .catch((error) => {
                setForm1({...form1 ,rxcui1: 0})
            })
        
    }, [searchQuery1])

    // Retrieves API response data for medication 2
    useEffect(() => {
        axios.get("https://rxnav.nlm.nih.gov/REST/rxcui.json?name=" + searchQuery2 + "&search=1")
            .then((response) => {                
                setForm2({...form2 ,rxcui2: response.data.idGroup.rxnormId[0]})
            })
            .catch((error) => {
                setForm2({...form2 ,rxcui2: 0})
            })
        
    }, [searchQuery2])

    // Retrieves API response data for an interaction
     const  handleOnCompare =  () => {

       
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
                        ...interactionInfo, severity: "",
                        description: "There was no interaction data found for these medications."
                    })
                }
            })
            // Insert a slight time delay to allow for smoother animation
            setTimeout(()=>{
                titleRef.current.scrollIntoView({ behavior: "smooth" });
                titleRef.current.style.animation = " linear 1s 1 blinker";
            }, 100);
     }
    
     // Allows page to know when the animation is over
     const handleAnimationEnd = () => {
        titleRef.current.style.animation = "none";
    }

    // Fetch info on what medication 1 is used to treat 
    useEffect(() => {
        axios.get("https://rxnav.nlm.nih.gov/REST/rxclass/class/byRxcui.json?rxcui="+ form1.rxcui1 +"&relaSource=MEDRT&relas=may_treat")

    .then((response) => {
        setMayTreat1(response.data.rxclassDrugInfoList.rxclassDrugInfo)
    })

    .catch((error)=>{
        setNLMError(error)
        setMayTreat1([])


    })
    }, [form1.rxcui1])
        
    // Fetch info on what medication 2 is used to treat 
    useEffect(() => {
        axios.get("https://rxnav.nlm.nih.gov/REST/rxclass/class/byRxcui.json?rxcui="+ form2.rxcui2 +"&relaSource=MEDRT&relas=may_treat")

    .then((response) => {
        setMayTreat2(response.data.rxclassDrugInfoList.rxclassDrugInfo)
    })

    .catch((error)=>{
        setNLMError(error)
        setMayTreat2([])

    })
    }, [form2.rxcui2])

    if (mayTreat1) {
        var tempMayTreat1 = mayTreat1.map((current) => {

            return current.rxclassMinConceptItem.className
        })

        var filteredMayTreat1 = [...new Set(tempMayTreat1)]

    }

    if (mayTreat2) {
        var tempMayTreat2 = mayTreat2.map((current) => {

            return current.rxclassMinConceptItem.className
        })

        var filteredMayTreat2 = [...new Set(tempMayTreat2)]
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
                    <div className="form-row row card-sizes">

                        {/* Input form 1 */}
                        <div className="col-md-4 mb-3 pt-3 pb-3 card side-card-padding card-color card-bottom interaction-cards " >
                            
                        <h5 className="form-label"> Medication 1</h5>

                            <SearchBar
                                name="medication1"
                                className="form-control"
                                searchQuery={searchQuery1}
                                handleOnChange={(e) => {
                                    handleSearchInputChange1(e);
                                }}
                                autocompleteResults={autocompleteResults1}
                            />
                            
                            {/* Error handling for form 1*/}
                            <div>
                                {form1?.rxcui1 !== 0 && searchQuery1.length !== 0 ?
                                    
                                    <div className="success">
                                        {searchQuery1} is a valid medication &#10003;
                                    </div>
                                    :
                                    <div >
                                        &nbsp;
                                    </div>
                                }

                                {form1?.rxcui1 === 0 && searchQuery1.length !== 0 ?
                                    <div className="error">Please enter a valid medication!</div>
                                    :
                                    <div >
                                        &nbsp;
                                    </div>
                                    
                                } 
                            </div>   

                            {filteredMayTreat1.length !== 0 &&
                                <div className="together ">
                                    <h6>May treat:</h6> 
                                    {filteredMayTreat1.map((item, idx) => (
                                        <span className="pill" key={idx}>{item} </span>
                                    ))}
                                </div>
                            }
                        </div>

                        {/* Input form 2 */}
                        <div className="col-md-4 mb-3 pt-3 pb-3 card card-color interaction-cards" >                           
                            <h5 className="form-label"> Medication 2</h5>

                            <SearchBar

                                name="medication2"
                                className="form-control"
                                searchQuery={searchQuery2}
                                handleOnChange={(e) => {
                                    handleSearchInputChange2(e);
                                }}
                                autocompleteResults={autocompleteResults2}
                            />
                            <div>
                                {form2.rxcui2 !== 0 && searchQuery2.length !== 0 ?
                                    <div className="success">
                                        {searchQuery2} is a valid medication &#10003;
                                    </div>
                                    :
                                    
                                    <div >
                                        &nbsp;
                                    </div>
                                }

                                {/* Error handling for form 2 */}
                                {form2.rxcui2 === 0 && searchQuery2.length !== 0 ?
                                    
                                    <div className="error">Please enter a valid medication!</div>
                                    :
                                    <div >
                                        &nbsp;
                                    </div>
                                } 
                            </div>  
                            
                            {filteredMayTreat2.length !== 0 &&
                                <div className="together ">
                                   <h6 > May treat:</h6> 
                                    {filteredMayTreat2.map((item, idx) => (
                                        <span className="pill" key={idx}>{item} </span>
                                    ))}
                                </div>
                            }
                            
                        </div>

                        {/* Check Interaction button */}

                        <div className="align-self-baseline text-center mt-4 mb-5">
                            <a className="btn btn-dark btn-x1 row " onClick={handleOnCompare}><span>Check Interaction</span></a> 
                        </div>
                    </div>
                </form>

                {/* Interaction response data ------------------------------------------------- */}
                
                {/* Valid interaction found */}
                {interactionInfo.severity !== ""  && interactionInfo.severity !== "invalid" && interactionInfo.severity !== "same" &&
                    
                    <div className="card interaction-results " ref={titleRef} onAnimationEnd={handleAnimationEnd}>
                        <h3 className="row">
                            Results
                        </h3>
                        <hr />
                        
                        <div className="row response ">
                           <b className="bold-padding"> Description: </b> {interactionInfo.description}
                        </div>
                        <br></br>
                       
                        <br />
                        <div className="row response links">
                            For more information on {name1}, click<a className="result-link" href={interactionInfo.link1} target="_blank">&nbsp;here</a>
                            
                        </div>
                        <br/>
                        <div className="row response links">
                            For more information on {name2}, click<a className="result-link" href={interactionInfo.link2} target="_blank">&nbsp;here</a>
                        </div>
                        
                    </div>
                }

                {/* Display invalid interaction */}
                {interactionInfo.severity === "" && interactionInfo.description !== "" ?
                    
                    <div>
                        <div className="row response " ref={titleRef} onAnimationEnd={handleAnimationEnd}>
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
                        <div className="row response error " ref={titleRef} onAnimationEnd={handleAnimationEnd}>
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
                        <div className="row response error " ref={titleRef} onAnimationEnd={handleAnimationEnd}>
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
