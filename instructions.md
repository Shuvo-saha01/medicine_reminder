# Instructions
- adhere to all the conditions mentioned in this instructions.md
- maintain the report.md file
- report.md will contain:
    - tasks to be done
    - tasks completed
    - tasks pending
    - new tasks created
    - this is basically the report for the agent in case the instruction is inturrupted mid run and needs to pickup later without repeating the same tasks again 

# Goal of this project 
- create a mobile application with react native , expo and the best practises to make it suitable for a medication reminder app for people of all age. it will have following features:
    - offline so no need for authentication
    - aesthetic designs and attractive to both young and old. 
    - users can set alarms for their med time 
    - the app will have a push notification to alert the user to take their medicine 
        - this notification should be displayed even if the app is not running
        - this notification should have a taken and missed button on press of which it will update the database accordingly and also remove the notification.
    - lastly report page will have a log of the users medicine taking history in a github commit history type layout, and also it will have streaks, taken and missed count for lifetime of the app
    - logic of the following catagory
        - streaks
            - if user miss a medication in a day, the streak will be returned to 0
        - taken 
            - if users takes a medicine it will get added to taken count 
        - missed
            - if users miss a medicine it will get added to missed count 

# Database
- use @react-native-async-storage/async-storage for offline storage, it is a key value store and we will use it to store all the data. 

# Local notification
- use expo-notifications for local notification, this will allow us to schedule and display notifications even when the app is not running.


# alert system 
- setting up alert only takes the name of the medicine and time of alert configured to their own time clock

# On app close 
- the app should not be killed even if the user closes the app. it should run in the background. 

# home page 
- home page should display all the alerts set up by the user, with the name of the medicine and time of alert. 
- there should be a button to delete an alert 
- there should be a button to edit an alert 
- the home page should be updated in real time when the user adds, deletes, or edits an alert 
- there should be a tab navigator to navigate to the report page 

# alert page 
- it will have the form to create a alert and on submit it will update the database and also schedule a notification using expo-notifications

- it will only have the name and time of alert to be added and nothing else. and also an aesthetic and attractive deisgn
- this alert modal should also have a cool animation on open and close
- this alert modal should be full screen and not a pop up

# report page 
report page will have a log of the users medicine taking history in a github commit history type layout, and also it will have streaks, taken and missed count for lifetime of the app 

# design system
- use minimal pastel colors for styling 
- use 60/30/10 rule for colors
- use rounded corners for all UI elements
- use white as bg and pastel color for secondary color and a accent color for some buttons or something 

# code quality
- write clean, maintainable and modular code
- use best practices for react native and expo
- use typescript
- use functional components and hooks
- use proper error handling
- use proper comments to explain the code
- follow the folder structure properly

# folder structure
- src/
    - components/
        - Home.tsx
        - Alert.tsx
        - Report.tsx
        - CustomButton.tsx
    - constants/
        - Colors.ts
    - navigation/
        - AppNavigator.tsx
    - storage/
        - AsyncStorage.ts
    - utils/
        - Helper.ts
    - App.tsx

# best practices
- use functional components and hooks
- use proper error handling
- use proper comments to explain the code
- follow the folder structure properly
- follow the design system properly
- follow the best practices for react native and expo

# animation and transition
- use react-native-reanimated for animations
- use react-native-gesture-handler for gestures
