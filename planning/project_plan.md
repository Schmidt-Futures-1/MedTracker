
# Project Plan - *Medicine Tracker (WIP)*


## User Roles and Personas

Medication user: a person looking for a web app to track and manange their medication(s)

Caretaker: someone who is trying to manage and track medication for their resident, family member, or friend

--------------------------------------------------------------------------------------------------------------

Medication user: Robert is about to be a junior in college. Along with other obligations as a young adult, it can be difficult to regularly track and take his medication. He takes 3 different medications daily but one of them needs to be taken 3 times a day. He needs an app that he will have access to for his medicine, no matter what device he is on because he is constantly moving around and running errands.

Jeb is in his mid 60's and takes 5 medications daily. He is retired and really wants to make sure he does not miss a does. He doesn't own a smartphone but has an easy-to-use chromebook he rarely uses. He needs an simple web app to track his medication because it can be so easy to forget. Pen and paper are just not enough.

Luis is 53 years old and he lives in the Texas suburbs. He takes 6 medications daily, some of them twice a day. He uses his phone and computer for work, but is not very tech savvy and prefers his computer. He is very forgetful regarding taking his medications and often can’t remember if he has taken them. He also finds it difficult to know whether new medications he gets will not interact well with all of the others he is taking.

Caregiver: Derek is 25 years old and lives in a suburb near his parents. He travels often for work and along with his personal duties he has to check up on his mother to see if she is taking her prescribed medicine every day. He is very tech savvy and due to his travels, he always has his phone with him. He needs a system that notifies him when she should be taking her medication so he can reach out to her to confirm.

Amanda is a newly graduated caretaker for Jim. Along with her other duties she must remember to give Jim his medications at certain times. As she's new to the job and doesn't know all the medication he takes off the top of her head she would like a system that has all the medications he takes and notifies her when he should be receiving the medication. Due to her not always being in the house she would like a system that can notify her even if she isn't in front of a computer.

## User Stories
### Core Features
1. As a medication user, I want to list my medication on any device, so that I can always have access to it.
2. As a medication user, I want to track my medication, so that I can always keep track of what I've taken.
3. As a medication user, I want to edit my medication easily, so that I can update my doses & reschedule intakes if needed.
4. As a medication user, I want to have a simple dashboard, so that I can see what is left to take, take, & refill on one     page.
5. As a medication user, I want to know if there are any interactions between the medications I am taking, so that I can      avoid taking any medications together that can have a negative reaction together.


### Stretch Features
6. As a caretaker, I want to get notified when my charge needs to take their medication, so that I can make sure they take    their medication on time.
7. As a caretaker, I want to have a list of all my charge’s medications, so that I know what they are taking and can keep     track of all of their medications.
8. As a caretaker, I want to check if any of my charge’s medications have adverse reactions with food, so that I know what    I can and can’t feed my charge when they are taking their medication.
9. As a caretaker, I want to see the specific details for my charge’s medications, so that I know how much they need to       take, when they need to take them and other medicine specific details.
10. As a caretaker, I want a list of near accurate times of when a charge last took their medication, so that I can keep      track of whether they have taken their medications.

## Pages/Screens

List all the pages and screens in the app. Include wireframes for at least 3 of them.

## Data Model

#### Users
| Column Name    | Type            | Description                       |
| -------------- | --------------- | ----------------------------------|
| id             | Number          | unique ID for user (default field)|
| first_name     | String          | user's first name                 |
| last_name      | String          | user's last name                  |
| email          | String          | unique email for user             |
| password       | String          | user's password                   |


 
#### Medicine
| Column Name    | Type            | Description                           |
| -------------- | --------------- | --------------------------------------|
| id             | Number          | unique ID for medicine (default field)|
| name  | String          | name of medicine       |
| strength       | Number          | numerical value of medicine's strength|                                     |
| units          | String          | units that the medicine uses          |                                     |
| frequency      | String          | how often user takes medication    |
| rxcui          | String          | nih api unique id       |
| dosage         | Number          | amount of medication user is taken per interval|
| times_per_day  | Number          | amount of times that user takes their medication per day (default 1)|
| remaining_medicine         | Number          | amount of medication (in dosages) the user has left before they have to refill|



#### Notification
| Column Name    | Type            | Description                           |
| -------------- | --------------- | --------------------------------------|
| id             | Number          | unique ID for medicine (default field)|
| notification_time | timestamp    | time user wants to be notified to take their medication|
| has_taken | Boolean   | boolean representing whether a user has taken their medication (default 0)|
| med_id  | Number (foreign key)   | references the id from Medicine table |
| user_id | Number (foreign key)   | references the id from the Users table|


## Endpoints

| CRUD           | HTTP Verb       | Description      | User Stories                    |
| -------------- | --------------- | -----------------|-------------------------------- |
| Create         | POST            | Create a new user account (register)        | 1-10 |
| Create         | POST            | Create a new user session (login)           | 1-10 |
| Create         | POST            | Create new medicine for user                | 1    |
| Read           | GET             | Fetch existing medicine for user            | 2, 4, 7, 9|
| Delete         | DELETE          | Delete an existing medicine for user        | 3  |
| Update         | PUT             | Update an existing medication for user      | 3  |
| Create         | POST            | Create new notification for medicine        | 6  |
| Read           | GET             | Fetch existing notification for user        |6, 10, 9|
| Delete         | DELETE          | Delete an existing notification for medicine| 6  |
| Update         | PUT             | Update an existing notification for medicine| 6  |
| Read           | GET             | Fetch drug-drug interaction information     |   5|

### Wireframe Pages

#### Landing Page
![](https://i.imgur.com/faizrwd.png)

#### Register Page
![](https://i.imgur.com/CIZlVuL.png)

#### Login Page
![](https://i.imgur.com/nPP1ZVx.png)

#### Add Medication Page
![](https://i.imgur.com/JItpU5E.png)

#### All Medications Page
![](https://i.imgur.com/OfhpKqe.png)

#### Medications Details Page
![](https://i.imgur.com/l6NscNY.png)

#### Dashboard Page
![](https://i.imgur.com/s4P0WGQ.png)

#### Interaction Checker Page
![](https://i.imgur.com/FDIUCHM.png)

#### Interaction Checker Results Page
![](https://i.imgur.com/UewsGNC.png)

***Don't forget to set up your Issues, Milestones, and Project Board!***
