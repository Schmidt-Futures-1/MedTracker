import { useState, useEffect } from "react"
import axios from "axios"
import "./Interaction.css"

export default function Interaction({ }) {
    
    const [form1, setForm1] = useState({
        medication1: "",
        rxcui1: "",
    });

    const [form2, setForm2] = useState({
        medication2: "",
        rxcui2: "",
    });

    const [errors, setErrors] = useState({});

    const handleOnInputChange = (event) => {
       
        setForm((f) => ({ ...f, [event.target.name]: event.target.value }));
        
    }

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
                    <div className="col-md-6 mb-3" >                           
                        <label className="form-label"> Medication Name</label>
                        <input name="medicationName" type="text" className="form-control" placeholder="Medication" value={form1.medication1} onChange={handleOnInputChange} />
                        <div>
                    {form1.rxcui1 !== 0 && form1.medication1.length !== 0 &&
                                <div className="success">
                                    {form.medicationName} is a valid medication
                                </div>
                    }

                    {form1.rxcui1 === 0 && form1.medication1.length !== 0 &&
                        <div className="error">Please enter a a valid medication!</div>
                            } 
                        </div>                        
                    </div>
                </div>


                
            </form>
        </div>
    </div>
    )
}
