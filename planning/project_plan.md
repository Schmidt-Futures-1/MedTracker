
# Project Plan 07/04/2022 - *Medicine Tracker (WIP)*

## Pod members and team name.
Kiara Bermudez
Robert Reyes-Enamorado
Likashmi Deosaran

### Problem Statement and Target Audience
People that take lots of medication often forget to take their medicine and can have a hard time figuring out what medicines shouldn't be taken together. 

### Brief Description: What is the main purpose of your project? What are the key features your site has to offer its users? How will your targeted audience use your website?
Website that keeps track of user's personal medication, when to take them, and whether medicines have adverse effects when taken together.

### Expected Feature List
- Keeps track of users personal medication - Provides info about individual medications(how many times it needs to be taken per day, whether it needs to be taken with food, what time of day to take it, etc) - Sends alert when user needs to take medication - Medicine interaction checker that tells whether any medication cant be taken together

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
        - learn more about your medicine in a feed of updates (will go away once feed gets long)
        - remind you to get refills
        -  interactions checker (between other meds and food)
        - give alerts for family mebers on whether or not they took their medicine 
    - DOES NOT (we should implement): 
        - have a alcoholic drink moderator (will tell you to wait to take your meds if you have taken alcohol)
        - tell you to drink plenty of water or take with food (unless you look for that info in the app)
        - have a nice dashboard (info feels scattered)
        - recommend you call your doctor and provide their phone number for you to easily call right there when told you need a refill (have to look for it within the app)
        -  users say app feels "scattered"
        -  users complain that they cannot alternate dose intakes
            -  some users need to take 1 pill one night, then 2 the next, and then repeat
        -  does not allow you to take medicine for a set amount of time
            -  Ex: you may have gotten surgery and need to take medicine for 30 days only. You have to manually remove the drug from your profile instead of it just going away

- Round (iOS app)
    - Similar to Medisafe's idea but much more bare
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

How can we prevent the user from jumping around the app too much to fund what they are looking for?

What is possible to accomplish in 5 weeks and what are the stretch features?

Can we link phone numbers to automatically call doctors for refills on click? (may be possible on MacOS)


## User Roles and Personas

Include the most up-to-date user roles and personas.

## User Stories

List the current user stories you will implement.

## Pages/Screens

List all the pages and screens in the app. Include wireframes for at least 3 of them.

## Data Model

Describe your app's data model using diagrams or tables

## Endpoints

List the API endpoints you will need to implement.

***Don't forget to set up your Issues, Milestones, and Project Board!***
