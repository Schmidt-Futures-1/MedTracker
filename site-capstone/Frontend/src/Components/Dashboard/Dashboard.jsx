import "./Dashboard.css"


export default function Dashboard({ user, setUser }) {
    



    // Variables needed for custom greeting
    var myDate = new Date();
    var hrs = myDate.getHours();
    var greet;

    // Customize greeting based on current time
    if (hrs < 12) {
        greet = 'Good Morning';
    }
    else if (hrs >= 12 && hrs <= 17) {
        greet = 'Good Afternoon';
    }
    else if (hrs >= 17 && hrs <= 24) {
        greet = 'Good Evening';
    }

    return (
        <div className="container">
            <div className="row">
                {/* welcome tag for the user name */}
                <h2 className="fw-bold mb-3">{greet}, { user.firstName}</h2>
                    <div className="col-8">
                        {/* Table to show todays upcoming meds */}
                    <h3 className="fw-bold mb-4">Today's Medication</h3>
                        <table className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                <th className="col-sm-2" scope="col">Time</th>
                                <th className="col-sm-4"scope="col">Medication</th>
                                <th className="col-sm-4" scope="col">Dosage</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                <th scope="row">8:00</th>
                                <td>Zoloft</td>
                                <td>2 pills</td>
                                </tr>
                            </tbody>
                            <tbody>
                                <tr>
                                <th scope="row">10:00</th>
                                <td>albuterol</td>
                                <td>4 pills</td>
                                </tr>
                            </tbody>
                            <tbody>
                                <tr>
                                <th scope="row">3:00</th>
                                <td>Xanax</td>
                                <td>1 pill</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                       
                    <div className="col-4">
                        {/* shows the current refills on medication within this table */}
                    <h3 className="fw-bold mb-4">Currently Low On</h3>
                        <table className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                <th className="col-sm-2" scope="col">Medication Name</th>
                                <th className="col-sm-2" scope="col">Amount Left</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                <td>Zoloft</td>
                                <th scope="row">4/10</th>
                                </tr>
                            </tbody>
                            <tbody>
                                <tr>
                                <td>Albuterol</td>
                                <th scope="row">5/10</th>
                                </tr>
                            </tbody>
                            <tbody>
                                <tr>
                                <td>Xanax</td>
                                <th scope="row">30/40</th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
            </div>
        </div>    
    )

}