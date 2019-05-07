// Homework #8
// Team #4
// 4/24/2019
// Project #1 - Pack  Your Bags
// 
// Key new functionality:
// 4/27/2019
//   Added row selection from itinerary table
//   Got data for particular row and put on itinerary day update view
//   On update btn click, updated firebase with modfied itinerary for selected day.
// ToDo

// Wait for document to finish loading
$(document).ready(function () {

    // Initialize Firebase - user aand itinerary
    var firebaseConfig = {
        apiKey: "AIzaSyBCaYatDIe9pSgDZ27AS9jrQiwiqrCLbW0",
        authDomain: "pvraab-rpsmulti.firebaseapp.com",
        databaseURL: "https://pvraab-rpsmulti.firebaseio.com",
        projectId: "pvraab-rpsmulti",
        storageBucket: "pvraab-rpsmulti.appspot.com",
        messagingSenderId: "829755045999",
        appId: "1:829755045999:web:98acc045d33e7b72"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    var database = firebase.database();

    // Set references to score children
    scoreRef = database.ref("/score");

    // (CRITICAL - BLOCK) //
    // connectionsRef references a specific location in our database.
    // All of our connections will be stored in this directory.
    var connectionsRef = database.ref("/connections");

    // '.info/connected' is a special location provided by Firebase that is updated every time
    // the client's connection state changes.
    // '.info/connected' is a boolean value, true if the client is connected and false if they are not.
    var connectedRef = database.ref(".info/connected");

    // When the client's connection state changes...
    connectedRef.on("value", function (snap) {

        // If they are connected..
        if (snap.val()) {

            // Add user to the connections list.
            var con = connectionsRef.push(true);

            // Remove user from the connection list when they disconnect.
            con.onDisconnect().remove();
        }
    });

    // When first loaded or when the connections list changes...
    connectionsRef.on("value", function (snapshot) {

        // Display the viewer count in the html.
        // The number of online users is the number of children in the connections list.
        $("#watchers").text(snapshot.numChildren());

        // Limit connections
        if (snapshot.numChildren() >= 2) {
            database.goOffline()
        }
        else {
            database.goOnline()
        }
    });

    // -------------------------------------------------------------- (CRITICAL - BLOCK) --------------------------- //
    // Set Initial Counter
    var initialValue = 100;
    var clickCounter = initialValue;

    // At the page load and subsequent value changes, get a snapshot of the local data.
    // This callback allows the page to stay updated with the values in firebase node "clicks"
    database.ref("/clicks").on("value", function (snapshot) {

        // Print the local data to the console.
        console.log(snapshot.val());


        // Change the HTML to reflect the local value in firebase.
        clickCounter = snapshot.val().clickCount;

        // Log the value of the clickCounter
        console.log(clickCounter);

        // Change the HTML to reflect the local value in firebase.
        $("#click-value").text(clickCounter);

        // If any errors are experienced, log them to console.
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    // --------------------------------------------------------------

    // Whenever a user clicks the click-button
    $("#click-button").on("click", function () {

        // Reduce the clickCounter by 1
        clickCounter--;

        // Alert User and reset the counter
        if (clickCounter === 0) {
            alert("Phew! You made it! That sure was a lot of clicking.");
            clickCounter = initialValue;
        }

        // Save new value to Firebase
        database.ref("/clicks").set({
            clickCount: clickCounter
        });

        // Log the value of clickCounter
        console.log(clickCounter);
    });

    // Whenever a user clicks the restart button
    $("#restart-button").on("click", function () {

        // Set the clickCounter back to initialValue
        clickCounter = initialValue;

        // Save new value to Firebase
        database.ref("/clicks").set({
            clickCount: clickCounter
        });

        // Log the value of clickCounter
        console.log(clickCounter);

        // Change the HTML Values
        $("#click-value").text(clickCounter);
    });
});