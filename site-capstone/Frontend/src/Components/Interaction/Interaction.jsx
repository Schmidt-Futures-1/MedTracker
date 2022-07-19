import { useState, useEffect } from "react"
import axios from "axios"
import "./Interaction.css"

export default function Interaction({ }) {
    
    const [form1, setForm1] = useState({
        medication1: "",
        rxcui1: 0,
    });

    const [form2, setForm2] = useState({
        medication2: "",
        rxcui2: 0,
    });

    const [interactionInfo, setInteractionInfo] = useState({
        severity: "",
        description: "",
    });


    const [errors, setErrors] = useState({});

    const handleOnInputChange1 = (event) => { 
        setForm1((f) => ({ ...f, [event.target.name]: event.target.value })); 
    }

    const handleOnInputChange2= (event) => { 
        setForm2((f) => ({ ...f, [event.target.name]: event.target.value })); 
    }

    useEffect(() => {
        axios.get("https://rxnav.nlm.nih.gov/REST/rxcui.json?name=" + form1.medication1 + "&search=1")
            .then((response) => {
                console.log(response.data.idGroup.rxnormId[0])
                setForm1({...form1 ,rxcui1: response.data.idGroup.rxnormId[0]})
            })
            .catch((error) => {
                setForm1({...form1 ,rxcui1: 0})
            })
        
    }, [form1.medication1])

    useEffect(() => {
        axios.get("https://rxnav.nlm.nih.gov/REST/rxcui.json?name=" + form2.medication2 + "&search=1")
            .then((response) => {
                console.log(response.data.idGroup.rxnormId[0])
                
                setForm2({...form2 ,rxcui2: response.data.idGroup.rxnormId[0]})
            })
            .catch((error) => {
                setForm2({...form2 ,rxcui2: 0})
            })
        
    }, [form2.medication2])

    
    const handleOnCompare = () => {
       
            axios.get("https://rxnav.nlm.nih.gov/REST/interaction/list.json?rxcuis=" + form1.rxcui1 + "+" + form2.rxcui2)
                .then((response) => {
                    console.log(response.data.fullInteractionTypeGroup[0].fullInteractionType[0].interactionPair[0].severity)
                    setInteractionInfo({
                        ...interactionInfo, severity: response.data.fullInteractionTypeGroup[0].fullInteractionType[0].interactionPair[0].severity,
                        description: response.data.fullInteractionTypeGroup[0].fullInteractionType[0].interactionPair[0].description
                    
                    })
                    //setInteractionInfo({...interactionInfo ,description: response.data.fullInteractionTypeGroup[0].fullInteractionType[0].interactionPair[0].description})

                })
                .catch((error) => {
                    console.log("no interaction")
                })
            
        

    }

    console.log(interactionInfo)

    return (
        <div className="container px-4 px-lg-5 h-100">
        <div className="col gx-4 gx-lg-5 h-100 mx-auto  pb-5">
            <div className="form-row row">
                <h2 className="fw-bold mb-5 row">Create Medication</h2>
            </div>
            <form>

            {errors?.form1 ?
                    <div className="text-center">
                    
            <label className=" form-label error  "> { errors.form1} </label>
            </div>
            : ""
          }
                {/* ROW 1 */}
                <div className="form-row row">
                    <div className="col-md-4 mb-3" >                           
                        <label className="form-label"> Medication Name</label>
                        <input name="medication1" type="text" className="form-control" placeholder="Medication" value={form1.medication1} onChange={handleOnInputChange1} />
                            <div>
                                {form1?.rxcui1 !== 0 && form1.medication1?.length !== 0 ?
                                    
                                    <div className="success">
                                        {form1.medication1} is a valid medication
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

                        <div className="col-md-4 mb-3" >                           
                        <label className="form-label"> Medication Name</label>
                        <input name="medication2" type="text" className="form-control" placeholder="Medication" value={form2.medication2} onChange={handleOnInputChange2} />
                        <div>
                    {form2.rxcui2 !== 0 && form2.medication2.length !== 0 ?
                                <div className="success">
                                    {form2.medication2} is a valid medication
                                    </div>

                                    :
                                    
                                    <div >
                                        &nbsp;
                                    </div>
                    }

                    {form2.rxcui2 === 0 && form2.medication2.length !== 0 ?
                                    <div className="error">Please enter a a valid medication!</div>
                                    :
                                    <div >
                                    &nbsp;
                                </div>
                            } 
                        </div>                        
                        </div>
                        <div className="align-self-baseline text-center mt-4 mb-5">
                        <a className="btn btn-dark btn-x1 row " onClick={handleOnCompare}>Compare</a> 
                    </div>
                </div>

                </form>
                
                {interactionInfo.severity === "" ?
                    <div className="row response">
                        
                    </div>
                    :
                    <div>
                        <div className="row response">
                            Severity: {interactionInfo.severity}
                        </div>
                        <div className="row response">
Description: {interactionInfo.description}
</div>
                    </div>
                    


                    
                }
        </div>
    </div>
    )
}
