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
    const chatRef = database.ref('chat'); // Reference chat

    // Do this on first player
    chatRef.set({}); // If there's only one user, clear the chat history in the db
    $('#chat').find('ul').empty(); // Clear the HTML


    // Program variables
    const $chatBtn = $('#chatSend');
    const $chatInput = $('#message');
    const $chatUl = $('#chat').find('ul');

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
        } else {
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

    // Define player game variables
    var oneChoice = null;
    var onePicked = false;
    var oneWins = 0;
    var oneLosses = 0;
    var oneTies = 0;

    var twoChoice = null;
    var twoPicked = false;
    var twoWins = 0;
    var twoLosses = 0;
    var twoTies = 0;

    function initGame() {
        oneWins = 0;
        oneLosses = 0;
        oneTies = 0;
        twoWins = 0;
        twoLosses = 0;
        twoTies = 0;
    }

    function disableOne() {
        onePicked = true;
        checkWellPlayed();
        $("#rpgRadios11").attr('disabled', true);
        $("#rpgRadios12").attr('disabled', true);
        $("#rpgRadios13").attr('disabled', true);
    }

    function enableOne() {
        onePicked = false;
        $("#rpgRadios11").attr('disabled', false);
        $("#rpgRadios11").attr('checked', false);
        $("#rpgRadios12").attr('disabled', false);
        $("#rpgRadios12").attr('checked', false);
        $("#rpgRadios13").attr('disabled', false);
        $("#rpgRadios13").attr('checked', false);
    }

    function disableTwo() {
        twoPicked = true;
        checkWellPlayed();
        $("#rpgRadios21").attr('disabled', true);
        $("#rpgRadios22").attr('disabled', true);
        $("#rpgRadios23").attr('disabled', true);
    }

    function enableTwo() {
        twoPicked = false;
        $("#rpgRadios21").attr('disabled', false);
        $("#rpgRadios21").attr('checked', false);
        $("#rpgRadios22").attr('disabled', false);
        $("#rpgRadios22").attr('checked', false);
        $("#rpgRadios23").attr('disabled', false);
        $("#rpgRadios23").attr('checked', false);
    }

    function checkWellPlayed() {
        if (onePicked && twoPicked) {
            if (oneChoice === "rock" && twoChoice === "rock") {
                oneTies++;
                twoTies++
            } else if (oneChoice === "rock" && twoChoice === "paper") {
                oneLosses++;
                twoWins++
            } else if (oneChoice === "rock" && twoChoice === "scissors") {
                oneWins++;
                twoLosses++
            }
            if (oneChoice === "paper" && twoChoice === "rock") {
                oneWins++;
                twoLosses++
            } else if (oneChoice === "paper" && twoChoice === "paper") {
                oneTies++;
                twoTies++
            } else if (oneChoice === "paper" && twoChoice === "scissors") {
                oneLosses++;
                twoWins++
            }
            if (oneChoice === "scissors" && twoChoice === "rock") {
                oneLosses++;
                twoWins++
            } else if (oneChoice === "scissors" && twoChoice === "paper") {
                oneWins++;
                twoLosses++
            } else if (oneChoice === "scissors" && twoChoice === "scissors") {
                oneTies++;
                twoTies++
            }

            // Update the score
            updateScore();
            setTimeout(myFunction, 3000);
            setTimeout(initRound, 5000);
        }
    }

    function myFunction() {
        alert('Hello');
    }

    function initRound() {
        console.log("Init Round");
        $("#whoOne").text("Dont Know");
        enableOne();
        enableTwo();
    }

    function updateScore() {
        $("#whoOne").text("Good Time");
        $("#oneWins").text(oneWins);
        $("#oneLosses").text(oneLosses);
        $("#oneTies").html(oneTies);
        $("#twoWins").text(twoWins);
        $("#twoLosses").text(twoLosses);
        $("#twoTies").text(twoTies);
    }

    // $('input:radio[name=rpgRadios]:checked').change(function () {
    $('.form-check-input').click(function () {
        console.log(this);

        if ($(this).attr("id") == 'rpgRadios11') {
            oneChoice = "rock";
            oneThis = $(this);
            $("#playerOneImg").attr('src', './assets/images/rock1.jpg');
            disableOne();
            console.log("Rock");
        }
        if ($(this).attr("id") == 'rpgRadios12') {
            oneChoice = "paper";
            $("#playerOneImg").attr('src', './assets/images/paper1.jpg');
            disableOne();
            console.log("Paper");
        }
        if ($(this).attr("id") == 'rpgRadios13') {
            oneChoice = "scissors";
            $("#playerOneImg").attr('src', './assets/images/scissors1.jpg');
            disableOne();
            console.log("Scissors");
        }

        if ($(this).attr("id") == 'rpgRadios21') {
            twoChoice = "rock";
            $("#playerTwoImg").attr('src', './assets/images/rock2.jpg');
            disableTwo();
            console.log("Rock");
        }
        if ($(this).attr("id") == 'rpgRadios22') {
            twoChoice = "paper";
            $("#playerTwoImg").attr('src', './assets/images/paper2.jpg');
            disableTwo();
            console.log("Paper");
        }
        if ($(this).attr("id") == 'rpgRadios23') {
            twoChoice = "scissors";
            $("#playerTwoImg").attr('src', './assets/images/scissors2.jpg');
            disableTwo();
            console.log("Scissors");
        }
    });


    const chat = () => {
        let leMsg = $chatInput.val(); // Get the msg from the chat input
        chatRef.push({ // Push the message
            msg: leMsg
        });
        $chatInput.val(''); // Empty input
    }

    chatRef.on('child_added', (snap) => { // Listen for changes in the chat Reference in the db
        let msgStr = `<li class="list-group-item list-group-item-dark">${snap.val().msg}`; // Create a string with the msg
        $chatUl.prepend(msgStr); // Prepend the msg so it's at the top
    });

    $('#chatSend').on('click', chat);



});