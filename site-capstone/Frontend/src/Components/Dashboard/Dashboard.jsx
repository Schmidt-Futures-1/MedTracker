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

    console.log(user)
    return (
        <div className="container">
            <div className="row">
                {/* welcome tag for the user name */}
                <h1 className="fw-bold mb-5">{greet}, { user.firstName}</h1>
                    <div className="col-8 tables " >
                        {/* Table to show todays upcoming meds */}
                    <h3 className="fw-bold mb-4">Today's Medication</h3>
                        <table className="table-style medications-padding">
                            <thead>
                                <tr>
                                    <th className="col-sm-2 header-text" scope="col">Time</th>
                                    <th className="col-sm-4 header-text"scope="col">Medication</th>
                                    <th className="col-sm-4 header-text" scope="col">Dosage</th>
                                </tr>
                            </thead>
                                <tr>
                                    <td scope="row">8:00</td>
                                    <td>Zoloft</td>
                                    <td>2 pills</td>
                                </tr>
                                <tr>
                                    <td scope="row">10:00</td>
                                    <td>Albuterol</td>
                                    <td>4 pills</td>
                                </tr>
                                <tr>
                                    <td scope="row">3:00</td>
                                    <td>Xanax</td>
                                    <td>1 pill</td>
                                </tr>
                        </table>
                    </div>

                    <div className="col-4 tables currently-low">
                        {/* shows the current refills on medication within this table */}
                    <h3 className="fw-bold mb-4">Currently Low</h3>
                        <table className="table-style ">
                            <thead>
                                <tr>
                                <th className="col-sm-2 header-text" scope="col">Medication</th>
                                <th className="col-sm-2 header-text" scope="col">Amount Left</th>
                                </tr>
                            </thead>
                                <tr>
                                    <td>Zoloft</td>
                                    <td scope="row ">4/10</td>
                                </tr>
                                <tr>
                                    <td>Albuterol</td>
                                    <td scope="row">5/10</td>
                                </tr>
                                <tr>
                                    <td>Xanax</td>
                                    <td scope="row">30/40</td>
                                </tr>
                        </table>
                    </div>
            </div>
        </div>    
    )

}