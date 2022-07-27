import "./Dashboard.css"
import { useState, useEffect } from "react"
import apiClient from "../../services/apiClient";
import parser from "cron-parser"
import { notification } from "antd";




export default function Dashboard({ user, setUser }) {

    var current = new Date();
  
    
    // State variables
    const [medications, setMedications] = useState([]);
    const [notifications, setNotifications] = useState([]);

    const [errors, setError] = useState([]);
    const [isLoading, setIsLoading] = useState();

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


    // Functions ----------------------------------------------------------------------------------

    // Get medications for user
    useEffect(() => {
        const fetchMedications = async () => {
            const { data, error } = await apiClient.fetchUserMedications();
            if (data) {
                setMedications(data.medications);
                setError(null);
            }
            if (error) {
                setError(error);
            }
            setIsLoading(false);
        }
        
        if (user?.email) {
            setIsLoading(true);
            setError(null);
            fetchMedications();
        } else {
            setIsLoading(false);
        }
    }, [user]);

    // Get notifications for user
    useEffect(() => {
        
        const fetchNotifications = async () => {
            const { data, error } = await apiClient.fetchUserNotifications();
            if (data) {
                setNotifications(data.notifications);
                setError(null)
            }
            if (error) {
                setError(error)
            }

            setIsLoading(false)
        }
        if (user?.email) {
            setIsLoading(true);
            setError(null);
            fetchNotifications();
        }
        else {
            setIsLoading(false)
        }
    }, [user])
    
    // Variable holds medications that are currently low and are PILLS
    let filteredMedicine = medications.filter(medicine => ((medicine.current_pill_count < 10 && medicine.units === "mg") || (medicine.current_pill_count < 100 && medicine.units === "mL")))
    
    let filteredNotifications = [{
        dosage: "",
        id: "",
        notification_time: "",
        phone_number: "",
        user_name: "",
        hours: "",
        minutes: "",
        timestamp: ""
    }]

    for (let i = 0; i < notifications.length; i++) {

        // Parse the cron time from notifications table
        let parsedCron = parser.parseExpression(notifications[i].notification_time)

        // Get the next notification date for this entry
        parsedCron.reset()

        // Split the cron string into a new array
        const splitCron = parsedCron.stringify().split(' ');

        // If first two array elements are not "*" and the third is a "*", this event occurs everyday
        if (splitCron[0] !== "*" && splitCron[1] !== "*" && !splitCron[1].includes(",") && splitCron[2] === "*") {

            // It is safe to take store this notification in an array to be outputted to table
            filteredNotifications.push(notifications[i])
            let hr = parsedCron.next().getHours().toString()
            parsedCron.reset()

            let min = parsedCron.next().getMinutes().toString()
            parsedCron.reset()

            
            if (min < 10) {
                min = "0" + min
            }
                
            if (hr > 12) {
                    hr = hr - 12
                    min = min + " PM"
            }
            else if (hr === 12) {
                min = min + " PM"
            }
            else {
                min = min + " AM"
            }
            let lastIndex = filteredNotifications.length - 1


            filteredNotifications[lastIndex].hours = hr

            filteredNotifications[lastIndex].minutes = min
            filteredNotifications[lastIndex].timestamp = parsedCron.next().getTime().toString()
            parsedCron.reset()
            
        }

        // This event occurs everyday at one hour, and then the next hour
        else if (splitCron[0] !== "*" && splitCron[1].includes(',') && splitCron[2] === "*") {

            // Get the number of commas in this string
            // allows us to know how many times to loop
            let loopLimit = ((splitCron[1].match(new RegExp(",", "g")) || []).length)
                
            // Split this string on the commas
            let cronSplitOnHyphen = splitCron[1].split(',')

            // start for-loop
            for (let j = 0; j < loopLimit + 1; j++) {


                // Add an element to the end of the array
                filteredNotifications.push({
                    dosage: notifications[i].dosage,
                    id: notifications[i].id,
                    notification_time: notifications[i].notification_time,
                    phone_number: notifications[i].phone_number,
                    user_name: notifications[i].user_name,
                    hours: "",
                    minutes: "",
                    name: notifications[i].name,
                    timestamp: ""
                })

                // Get the correct hour and minutes for this element
                let hr = cronSplitOnHyphen[j]
                let min = splitCron[0]
                
                if (min < 10) {
                    min = "0" + min
                }
                
                if (hr > 12) {
                    hr = hr - 12
                    min = min + " PM"
                }
                else {
                    min = min + " AM"
                }
            
        
                // Store the last index of the filtered array
                let lastIndex = filteredNotifications.length - 1
            

                // Insert minutes and hours into the current array element
                filteredNotifications[lastIndex].hours = hr
                filteredNotifications[lastIndex].minutes = min
            
                // Store a new cron time for the first hour
                filteredNotifications[lastIndex].notification_time = splitCron[0] + " " + cronSplitOnHyphen[j] + " " + splitCron[2] + " " + splitCron[3] + " " + splitCron[4]
                let firstCronTime = parser.parseExpression(filteredNotifications[lastIndex].notification_time)

                filteredNotifications[lastIndex].timestamp = firstCronTime.next().getTime().toString()
                parsedCron.reset()
            }
        }
    }

    // Deletes first element of array.
    // We need this because the first element always contains placeholder data
    filteredNotifications.shift()


    // Sort the array by times
    filteredNotifications.sort(function (x, y) {
        return x.timestamp - y.timestamp
    })

    // Filter remaining notifications for today
    let remainingNotifications = filteredNotifications.filter(reminder => (new Date(parseInt(reminder.timestamp)).getDate() === current.getDate()))  

    return (
        <div className="container">
            <div className="row">
                {/* welcome tag for the user name */}
                <h1 className="fw-bold mb-5">{greet}, {user.firstName}</h1>
                

                {/* Today's Remaining Medicine table */}
                {remainingNotifications.length > 0 ?
                    <div className="col-8 tables ">
                        {/* Table to show todays upcoming meds */}
                        <h3 className="fw-bold mb-4">Today's Remaining Medications</h3>

                        <table className="table-style medications-padding">
                            <thead>
                                <tr>
                                    <th className="col-sm-2 header-text" scope="col">Time</th>
                                    <th className="col-sm-4 header-text" scope="col">Medication</th>
                                    <th className="col-sm-4 header-text" scope="col">Dosage</th>
                                </tr>
                            </thead>
                            {/* One row for the table */}
                            {remainingNotifications.length > 0 &&
                                remainingNotifications.map((reminder, key) =>
                                (
                                    <tr>
                                        <td scope="row ">{reminder.hours}:{reminder.minutes}</td>
                                        <td className="capitalize">{reminder.name}</td>
                                        <td>{reminder.dosage}</td>
                                    </tr>
                                ))
                            }
                        </table>
                    </div>
                    :
                    // Display when there are no medications that are currently low
                    <div className="col-4 tables currently-low empty ">
                        <h3 className="fw-bold mb-4">Today's Remaining Medications</h3>
                        <h2>Nothing scheduled for later</h2>
                    </div>
                }
                
                
                {/* Currently low table */}
                {filteredMedicine.length > 0 ? 
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
                        
                        {/* One row of the table */}
                        {
                            filteredMedicine.map((medicine, key)  => 
                            (
                                <tr >
                                        <td className="capitalize">{medicine.name }</td>
                                        <td className="error" scope="row">{medicine.current_pill_count}/{medicine.total_pill_count }</td>
                                </tr>
                                
                       ))
                            }
                    </table>
                        </div>
                        
                    :

                    // Display when there are no medications that are currently low
                    <div className="col-4 tables currently-low empty">
                        <h3 className="fw-bold mb-4">Currently Low</h3>
                        <h2>None</h2>
                        
                    </div>  
                }
                
            
                
            </div>
        </div>    
    )

}