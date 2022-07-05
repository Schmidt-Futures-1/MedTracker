# Project Proposal 07/04/2022 - *TBA*
Pod members and team name:
    The Medicine Cabinet: <br>
        Kiara Bermudez
        Robert Reyes-Enamorado
        Likashmi Deosaran


### Problem Statement and Target Audience
For individuals that are required to take a large number of medications or have to take medications often, it can be difficult for them to keep track of when to take their medications and what is safe to be taken with them.  Forgetting to take their medications, not knowing what food, beverages, or other medications can be taken with their current medications, and being uncertain of specific details regarding their specific medications are common problems that arise when taking medication, especially in large amounts.

### Brief Description: What is the main purpose of your project? What are the key features your site has to offer its users? How will your targeted audience use your website?
The main purpose of this website is to provide users with a resource for keeping track of all their personal medications and reminders for when to take them. Allowing users to easily see specific details regarding their medications, and letting people check whether their medications can have negative interactions with other medications or food, and drinks they may consume.

### Expected Feature List
- Login/Sign out page so that users can access their own personal account where their medication list and reminder settings can be accessed
- User account page where their medications will be listed and where they can search for other medications to add to their list
- Medication details page so that when a user clicks on a specific medication, it will display information regarding that medication and the user's personal settings ( when it needs to be taken, how many times a day it needs to be taken, whether it needs to be taken with food, etc. )
- Email/text notifications to the user reminding them to take their medication
- Medicine interaction checker which will allow the user to input what medication they are checking and other medications or foods/drinks and then return whether there is a negative interaction


### Related Work: What similar apps and websites? How will your project stand out from these other websites?

    Below are some apps that we have tested to see what is
    lacking and what works for users. Our web app will
    account for most of the flaws that are listed below to
    provide users with the best possible experience.
    

- Medisafe (iOS App)
    - Used for tracking your medication intake to make sure you don't miss a dose
    - Most popular medication tracker on the app store
    - DOES: 
        - save your medications
        - schedule when you should receive an alert to take your medicine
        - gives video instructions on how to take your medicine (source is Med OnCue)
        - learn more about your medicine in a feed of updates (will go away once the feed gets long)
        - remind you to get refills
        -  interactions checker (between other meds and food)
        - give alerts to family members on whether or not they took their medicine 
    - DOES NOT (we should implement): 
        - have an alcoholic drink moderator (will tell you to wait to take your meds if you have taken alcohol)
        - tell you to drink plenty of water or take it with food (unless you look for that info in the app)
        - have a nice dashboard (info feels scattered)
        - recommend you call your doctor and provide their phone number for you to easily call right there when told you need a refill (have to look for it within the app)
        -  users say app feels "scattered"
        -  users complain that they cannot alternate dose intakes
            -  some users need to take 1 pill one night, then 2 the next, and then repeat
        -  does not allow you to take medicine for a set amount of time
            -  Ex: you may have gotten surgery and need to take medicine for 30 days only. You have to manually remove the drug from your profile instead of it just going away

- Round (iOS app)
    - Similar to Medisafe's idea but much barer
    - Input your medication, get alerts (that's it)
    - Easier to navigate than Medisafe 
        - much less overwhelming
    - little reason to be on the app after you set your schedule
    - small file size
    - Not much of an app besides just being a notification system for medicine 
        - Users seem to like the simplicity 

### Open Questions

Is there a better API to use besides: https://open.fda.gov/apis/drug/event/how-to-use-the-endpoint/

Are the features that the competitor apps lack too difficult to implement?

How can we prevent the user from jumping around the app too much to find what they are looking for?

What is possible to accomplish in 5 weeks and what are the stretch features?

Can we link phone numbers to automatically call doctors for refills on click? (maybe possible on MacOS)
