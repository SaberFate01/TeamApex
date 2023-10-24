This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

## Team Apex
This app "ELDOME" is created by Team Apex, focusing on the welfare of older populations.

   Working Team:
   Front End& Mobile Application: Yun Fei
   Back End Team: Joel, Prakash
   Design Team: Jin Yue, Sam, Wang Qing Yi

## File Structure
- assets (image files)
- components (global header)
- data (Arbitary data for global usage)
-  screens (The various screens of the app)
-  Node Modules ( The dependencies)
- App.tsx (The main initiator)
- package.json ( All dependencies installed at init)

# 1. Installing the application
- **macOS & iOS**, you’ll need to install at least:
    - Homebrew, Node.js, Watchman, CocoaPods, Xcode and Xcode’s Command Line Tools.
    - Note, if you’re using a Mac with Apple silicon (e.g. M1), there be certain commands that differ with your CPU architecture in mind.
- **macOS & Android**, you’ll need to install at least:
    - Homebrew, Node.js, Watchman, Zulu OpenJDK and Android Studio.
    - Android Studio will require additional configuration by updating an `ANDROID_SDK_ROOT` environment variable, and setting up a virtual device (i.e. emulator).
    - Note, if you’re using a Mac with Apple silicon (e.g. M1), there be certain commands that differ with your CPU architecture in mind.
- **Windows & Android**, you’ll need to install at least:
    - Node.js, Java SE Development Kit and Android Studio.
    - Android Studio will require additional configuration by updating an `ANDROID_HOME` environment variable, and setting up a virtual device (i.e. emulator).
  
# 2. Getting Started with server
First, cd to the server folder 

Then, run 'npm install' after you have finished installing all the dependencies 

Remember to download and install MySql Modules, and start a connection on localhost

Then, same as the client, run 'npm start'

# 3. Getting Started with client

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 3.1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 3.2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.


# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

### PYTHON SERVER API

URL: https://flask-dot-acoustic-cirrus-396009.ts.r.appspot.com

This is a guide on how to use this API.

## Table of Contents
1. [Events](#events)
3. [Group Chat](#group-chat)
4. [One-On-One Chat](#one-on-one-chat)
5. [Self Report](#checkin)
4. [Data Visualization](#Visualization)

## Events
* [Get a specific event with EventID](#get-a-specific-event-with-eventid)
* [Get events (with query)](#get-events-with-query)
* [Add user-created event](#add-user-created-event)
* [Add an event to a user's event history](#add-event-to-users-event-history)
* [Get number of events the user has been to sorted by month](#get-number-of-events-the-user-has-been-to-sorted-by-month)

### Get a Specific Event with EventID

#### Usage
Send a GET request to either:
* https://flask-dot-acoustic-cirrus-396009.ts.r.appspot.com/events/get?eventID=EVENTID
* https://flask-dot-acoustic-cirrus-396009.ts.r.appspot.com/events/get?eventID=EVENTID&userID=USERID

Replace EVENTID with the desired eventID. It will return the info in JSON if exists, or an empty JSON if it doesn't.

**OPTIONAL** Replace USERID with the desired userID. If included, the returned JSON will have a `going` field that is 
whether the specified user is attending the event or not.

#### Example 1
URL: https://flask-dot-acoustic-cirrus-396009.ts.r.appspot.com/events/get?eventID=168881054

Returns:
```
{
    "age": "Adults, Seniors; Adults (30+),Seniors",
    "cost": "Free",
    "description": "Join this group for social and non-competitive fun with a selection of board games, from Rummykub to Sequence. Ideal for adults and seniors. New seniors always welcome.",
    "endDateTime": "2023/10/11 19:00:00",
    "eventID": 168881054,
    "eventImage": "https://www.trumba.com/i/DgDxCaKnWiE52XsLypf5JAj6.jpg",
    "location": "Bracken Ridge Library; Bracken Ridge Library, 77 Bracken Street, Bracken Ridge",
    "startDateTime": "2023/10/11 17:00:00",
    "title": "Undercover games"
}
```

#### Example 2

URL: https://flask-dot-acoustic-cirrus-396009.ts.r.appspot.com/events/get?eventID=168881054&userID=10

Returns:
```
{
    "age": "Adults, Seniors; Adults (30+),Seniors",
    "cost": "Free",
    "description": "Join this group for social and non-competitive fun with a selection of board games, from Rummykub to Sequence. Ideal for adults and seniors. New seniors always welcome.",
    "endDateTime": "2023/10/11 19:00:00",
    "eventID": 168881054,
    "eventImage": "https://www.trumba.com/i/DgDxCaKnWiE52XsLypf5JAj6.jpg",
    "going": false,
    "location": "Bracken Ridge Library; Bracken Ridge Library, 77 Bracken Street, Bracken Ridge",
    "startDateTime": "2023/10/11 17:00:00",
    "title": "Undercover games"
}
```

### Get Events (with query)

#### Usage
Send a POST request to https://flask-dot-acoustic-cirrus-396009.ts.r.appspot.com/events/query

Put `Content-Type: application/json` in the header. In the body, include a JSON object with the following attributes:
* query - a string of comma-separated queries. Use an empty string if no query is to be made.
* num_return - the number of events to be returned. If this is too big, less events may be returned (<300 is probably fine).
* userID - \[Optional\] the userID to get events for. This makes the events personalized for the user (Not working well yet), and include the `going` field on whether the user is going or not.

Each event in the retuned JSON object will **definitely** include
* eventID
* title
* description
* location
* startDateTime
* endDateTime
* eventImage
* age
* \[going\] (if userID is provided in the request body)
  
Fields that may be null are:
* cost

### Example 1:
Body:
```
{
    "query": "",
    "num_return": 100,
    "userID": 10
}
```
Return:
```
[
    {
        "age": "Suitable for all ages; ",
        "cost": "Free",
        "description": "The original of the Brisbane City Markets inner-city markets, Wednesday at Reddacliff Place is a favourite for city workers, local residents and tourists alike. With 85 amazing stalls each week, you’ll never be short for choice - whether it be lunch, groceries, provisions or gifts.",
        "endDateTime": "2023/10/10 22:00:00",
        "eventID": 157556109,
        "eventImage": "https://www.trumba.com/i/DgAe5JdG3AW8HvPm98OAsZmR.jpg",
        "going": false,
        "location": "Reddacliff Place, Brisbane City; Reddacliff Place, 266 George Street, Brisbane City",
        "startDateTime": "2023/10/10 12:00:00",
        "title": "Brisbane City Markets"
    },

    ... +99 events
]
```

### Example 2
Body:
```
{
    "query": "gardening,fitness",
    "num_return": 100
}
```
Return:
```
[
    {
        "age": "Seniors; Seniors",
        "cost": "Free",
        "description": "Gardening has many benefits, particularly as we age. Join horticulturist and 4BC gardening presenter, Paul Plant to discuss the health benefits of gardening and some of the practical garden tasks that help us stay agile as we get older.",
        "endDateTime": "2023/10/06 19:00:00",
        "eventID": 169011299,
        "eventImage": "https://www.trumba.com/i/DgDnWPxC5vzF2CUoT-kwrcz0.jpg",
        "location": "Coopers Plains Library; Coopers Plains Library, 107 Orange Grove Road, Coopers Plains",
        "startDateTime": "2023/10/06 17:00:00",
        "title": "Seniors Month: Gardening for healthy ageing"
    },

    ... +99 events
]
```

### Add User-Created Event
This allows you to define a new event and upload it into the database to be viewed by and reccommended to others.

#### Usage
Send a POST request to https://flask-dot-acoustic-cirrus-396009.ts.r.appspot.com/events/add

Put `ContentType: application/json` in the header, and in the body include a JSON object with the following fields:
* title
* description
* startDateTime (yyyy-MM-dd HH:mm:ss)
* endDateTime (yyyy-MM-dd HH:mm:ss)
* location
* age
* cost

Please **do not** include eventID in the JSON object. The eventID for the new event is automatically generated by the database.

If successful, the request will return a JSON object with the eventID generated for the newly inserted event.

### Example 1
Body:
```
{
    "title": "French Class",
    "description": "Want to learn French? Come join the French learning group for beginners!",
    "age": "All ages",
    "cost": "Free",
    "startDateTime": "2023-10-07 10:00:00",
    "endDateTime": "2023-10-08 11:00:00",
    "location": "Gold Coast",
    "eventImage": "www.google.com"
}
```

Return:
```
{
    "eventID": 170201575
}
```

We can now treat this event as any other event in the database. For example, using the get event API to get the newly inserted event.

URL: https://flask-dot-acoustic-cirrus-396009.ts.r.appspot.com/events/get?eventID=170201575

Return:
```
{
    "age": "All ages",
    "cost": "Free",
    "description": "Want to learn French? Come join the French learning group for beginners!",
    "endDateTime": "2023/10/08 11:00:00",
    "eventID": 170201575,
    "eventImage": "www.google.com",
    "location": "Gold Coast",
    "startDateTime": "2023/10/07 10:00:00",
    "title": "French Class"
}
```

### Add Event to User's Event History
This allows users to keep track of what events they have been to.

#### Usage
Send a POST request to https://flask-dot-acoustic-cirrus-396009.ts.r.appspot.com/events/history

Include `ContentType: application/json` in the header, and in the body include a JSON file with the following fields:
* userID
* eventID
* mode - `add` or `remove`

The `add` mode adds the event to the list of events the user has been to. The `remove` mode removes the event
from the list of events the user has been to. 

If the specified eventID does not exist, you will get 400 Bad Request. 
If the (userID, eventID) pair already exists when doing `add` or if (userID, eventID) pair doesn't exist when doing
`remove`, you will get 400 Bad Request.

#### Example 1:
Body: 
```
{
    "userID": 1,
    "eventID": 170201575,
    "mode": "add"
}
```
Return:
```
{
    "message": "success"
}
```

#### Example 2:
Body:
```
{
    "userID": 1,
    "eventID": 170201575,
    "mode": "remove"
}
```
Return:
```
{
    "message": "success"
}
```

### Get Number of Events the User has Been to (sorted by month)

This is for the data visualization.

#### Usage
Send a GET request to https://flask-dot-acoustic-cirrus-396009.ts.r.appspot.com/events/history/visual?userID=USERID

Replace USERID with the desired userID.

It will return a list of JSON objects with the fields
* month
* count

It includes the previous 12 months from today, including the current month.

#### Example 1
URL: https://flask-dot-acoustic-cirrus-396009.ts.r.appspot.com/events/history/visual?userID=1

Return:
```
[
    {
        "count": 0,
        "month": 11
    },
    {
        "count": 0,
        "month": 12
    },
    {
        "count": 0,
        "month": 1
    },
    {
        "count": 0,
        "month": 2
    },
    {
        "count": 0,
        "month": 3
    },
    {
        "count": 0,
        "month": 4
    },
    {
        "count": 0,
        "month": 5
    },
    {
        "count": 0,
        "month": 6
    },
    {
        "count": 0,
        "month": 7
    },
    {
        "count": 0,
        "month": 8
    },
    {
        "count": 0,
        "month": 9
    },
    {
        "count": 0,
        "month": 10
    }
]
```

## Group Chat
This section explains the functions of group_chat.py
The file creates access to 2 kinds of api's (Both are post requests):
1) https://flask-dot-acoustic-cirrus-396009.ts.r.appspot.com/group_chat/send: This adds the entries into the group_chat database
a) The JSON body: 
Requires:
senderID - integer
timestamp - SQL time stamp format
type - event or fun
chatRoom - int
chatName - name
Optional:
message - String
EventId - int

Example:
{
    "senderID":1,
    "timestamp": "2023-10-02 12:00:00",
    "type": "event",
    "chatRoom": 4,
    "chatName": "TestMessage",
    "message": "Hi",
    "EventId": 1001
}

2) https://flask-dot-acoustic-cirrus-396009.ts.r.appspot.com/group_chat/get: This gets the entries from the group_chat database
Entries (JSON format):
a) ChatRoom alone: displays all the messages and it's associated information in a chatRoom
b) ChatRoom and UserID: displays all the messages sent by the user and it's associated information in that chatRoom
c) ChatName alone: displays all the chats with the chatName and it's associated information
d) UserID: displays all the messages sent by the user and it's associated information from all chatRoom's

Example:
1)
{
    "chatName":"Test2"
}
2)
{
    "chatRoom":0
}
3)
{
    "userID":1
}
4)
{
    "userID":1,
    "chatRoom":0
}

## One-On-One Chat
* [Send a message (incl. an event)](#send-a-message-incl-an-event)
* [Get all messagers for a user with an other](#get-all-messages-for-an-user-and-an-other)
* [Get all messages for a user](#get-all-messages-for-an-user)

### Send a Message (incl. an event)
This allows you to send a message. Sharing an event can be done by sending a message with an eventID.

#### Usage
Send a POST request to https://flask-dot-acoustic-cirrus-396009.ts.r.appspot.com/chat/send

Put `Content-Type: application/json` in the header. In the body, include a JSON object with the following fields:
* senderID - the userID of the user sending the message
* recipientID - the userID of the user the message is sent to
* timestamp - the DateTime of when the message was sent
* message (optional) - the string message
* eventID (optional) - the eventID of the event being shared

#### Example 1 (message)
```
{
    "senderID": 10,
    "recipientID": 11,
    "timestamp": "2023/10/02 18:00:00",
    "message": "What event are you joining?"
}
```

#### Example 2 (eventID)
```
{
    "senderID": 11,
    "recipientID": 10,
    "timestamp": "2023/10/02 18:10:00",
    "eventID": 169011299
}
```

### Get All Messages for an User and an Other
This retrieves all messages (incl. events) sent between two users: user and other.

#### Usage
Send a POST request to https://flask-dot-acoustic-cirrus-396009.ts.r.appspot.com/chat/get

Put `Content-Type: application/json` in the header. In the body, include a JSON object with the following fields:
* userID: the userID of the first user.
* otherID: the userID of the second user.

It will return a JSON object with a list of messages with fields:
* senderID - the userID of the one who sent the message
* recipientID - the userID of the one who received the message
* timestamp - the DateTime of when the message was sent
* message - the string message (can be null)
* eventID - the eventID of the event being shared (can be null)

#### Example 1
Body:
```
{
    "userID": 10,
    "otherID": 11
}
```
Return:
```
[
    {
        "eventID": null,
        "message": "What event are you joining?",
        "recipientID": 11,
        "senderID": 10,
        "timestamp": "2023/10/02 18:00:00"
    },
    {
        "eventID": 169011299,
        "message": null,
        "recipientID": 10,
        "senderID": 11,
        "timestamp": "2023/10/02 18:10:00"
    },
    {
        "eventID": null,
        "message": "Thanks!",
        "recipientID": 11,
        "senderID": 10,
        "timestamp": "2023/10/02 18:20:00"
    }
]
```

### Get All Messages for an User
This retrieves all messages (incl. events) sent and received by the specified user.

#### Usage
Send a POST request to https://flask-dot-acoustic-cirrus-396009.ts.r.appspot.com/chat/get

Put `Content-Type: application/json` in the header. In the body, include a JSON object with the following fields:
* userID: the userID of the first user.

It will return a nested JSON object with the following structure:
* otherID - the userID of the person the specified user has sent or recieved messages from.
* rows - the list of messages sent and recieved between the specified user and the person with otherID

the 'rows' field contains a list of messages with the following fields in each:
* senderID - the userID of the one who sent the message
* recipientID - the userID of the one who received the message
* timestamp - the DateTime of when the message was sent
* message - the string message (can be null)
* eventID - the eventID of the event being shared (can be null)


#### Example 1
Body:
```
{
    "userID": 10
}
```
Return:
```
[
    {
        "otherID": 11,
        "rows": [
            {
                "eventID": null,
                "message": "What event are you joining?",
                "recipientID": 11,
                "senderID": 10,
                "timestamp": "2023/10/02 18:00:00"
            },
            {
                "eventID": 169011299,
                "message": null,
                "recipientID": 10,
                "senderID": 11,
                "timestamp": "2023/10/02 18:10:00"
            },
            {
                "eventID": null,
                "message": "Thanks!",
                "recipientID": 11,
                "senderID": 10,
                "timestamp": "2023/10/02 18:20:00"
            }
        ]
    },
    {
        "otherID": 13,
        "rows": [
            {
                "eventID": null,
                "message": "Who is your favourite piano composer?",
                "recipientID": 13,
                "senderID": 10,
                "timestamp": "2023/10/02 18:30:00"
            },
            {
                "eventID": null,
                "message": "My favourite is Frédéric Chopin!",
                "recipientID": 10,
                "senderID": 13,
                "timestamp": "2023/10/02 18:40:00"
            }
        ]
    }
]
```



## checkin (when making changes in backend handle with caution)

### send a questionnarie
This allows you to send a answers to the questionnaire.

#### Usage
Send a POST request to https://flask-dot-acoustic-cirrus-396009.ts.r.appspot.com/checkin/post


#### Example 1 (message)
```
{
    "userid": 2,
    "date":"2023-11-01",
    "q1":5,
    "q2":4,
    "q3":6,
    "q4":2,
    "q5":1
}
```
If the qi is not entered it is assumed to be 0
The ranking starts from 1 and ends in 6

### Get the aggregate average of all questions 
This retrieves average of a user.

#### Usage
Send a POST request to https://flask-dot-acoustic-cirrus-396009.ts.r.appspot.com/checkin/get

You can add: 
userid: Displays self reporting average from begining of the user 
from_time and userid: Displays self reporting average of user from from_time 
userid, from_time and to_time: Displays self reporting average of user from from_time to to_time

#### Example 1
Body:
```
{
    "userid": 3,
    "from_time": "2023-10-01",
    "to_time": "2023-10-03"
}
```
#### Example 2
Body:
```
{
    "userid": 3
}
```
#### Example 3
Body:
```
{
    "userid": 3,
    "from_time": "2023-10-01"
}
```
## visualization

### send a request
Gets all the interactions of user

#### Usage
Send a POST request to https://flask-dot-acoustic-cirrus-396009.ts.r.appspot.com/data_visual/get

You can add: 
userid: Displays self reporting average, group_interaction, 1v1 chat interaction from begining 
from_time and userid: Displays self reporting average, group_interaction, 1v1 chat interaction of user from from_time 
from_time and to_time: Displays self reporting average, group_interaction, 1v1 chat interaction of user from from_time to to_time

#### Example 1
Body:
```
{
    "userid": 3,
    "from_time": "2023-10-01",
    "to_time": "2023-10-03"
}
```
#### Example 2
Body:
```
{
    "userid": 3
}
```
#### Example 3
Body:
```
{
    "userid": 3,
    "from_time": "2023-10-01"
}



# References
Special Thanks to COMP2140 for the installation guide
Part of the ReadME is generated by React Native Modules
