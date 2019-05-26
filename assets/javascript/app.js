// JavaScript for Bootcamp Homework #7
// Paul Raab
// Raab Enterprises LLC
// 4/20/2019
// Rock Paper Scissors Multiplayer

// Wait for document to finish loading
$(document).ready(function () {

    // Open the modal on app start
    // $('#startGame').modal('show');

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

    // Global variables

    // Player number - if one or two is playing - if -1 is watching - if 0 - initial pass
    var playerNum = 0;
    var firstTime = true;
    var numPlayers = 0;
    var numWatchers = 0;

    // The connectionsRef references a specific location in our database.
    // All of our connections will be stored in this directory.
    var connectionsRef = database.ref("/connections");

    // '.info/connected' is a special location provided by Firebase that is updated every time
    // the client's connection state changes.
    // '.info/connected' is a boolean value, true if the client is connected and false if they are not.
    var connectedRef = database.ref(".info/connected");

    // These are the players references
    // Reference entire players folder
    var playersRef = database.ref('players');
    // Reference the p1 folder
    var p1Ref = playersRef.child('p1');
    // Reference the p2 folder
    var p2Ref = playersRef.child('p2');

    // const winsRef = db.ref('win');    // Reference both player losses
    // const losesRef = db.ref('losses');    // Reference both player wins
    // const turnRef = db.ref('turn'); // to track the turns

    // Set references to chat folder
    var chatRef = database.ref('/chat'); // Reference chat

    // Set reference to watchers
    var watchersRef = database.ref("/watchers");

    // Set references to score children
    var scoreRef = database.ref("/score");

    // Empty database itinerary
    // var ref = database.ref("itinerary");
    // ref.set(null);

    // When the client's connection state changes run this function
    // Add onDisconnect().remove() to con object so connection removed from DB when dropped 
    connectedRef.on("value", function (snap) {
        console.log("connectedRef");

        // If they are connected..
        if (snap.val()) {

            // Add user to the connections list.
            var con = connectionsRef.push(true);

            // Remove user from the connection list when they disconnect.
            con.onDisconnect().remove();
        } else {

        }
    });


    // When first loaded or when the connections list changes...
    connectionsRef.on("value", function (snap) {
        console.log("connectionsRef - When first loaded or when the connections list changes");
        if (snap.numChildren() === 1 && firstTime) {

            // Do this on first player
            // If there's only one user, clear the chat history in the db
            chatRef.set({});
            $('#chat').find('ul').empty(); // Clear the HTML

            playerNum = 1;

            enableOne();
            disableTwo();

            $("#startGame").modal();

            // Create the object
            var p1 = {
                choice: '',
                name: 0,
                wins: 0,
                losses: 0,
                ties: 0
            };

            // Set object in DB
            p1Ref.set(p1);

            // Set current number of watchers to 0
            numWatchers = 0;
            var watch = {
                watchers: numWatchers
            };
            watchersRef.set(watch);
            $("#watchers").text(numWatchers);

            // Not firstTime anymore
            firstTime = false;
            $("#players").text(1);
            $("#player1Header").css('background-color', 'red')

        } else if (snap.numChildren() === 1 && !firstTime) {

            // Set current number of watchers to 0
            numWatchers = 0;
            var watch = {
                watchers: numWatchers
            };
            watchersRef.set(watch);
            $("#watchers").text(numWatchers);
            $("#players").text(1);

        } else if (snap.numChildren() === 2 && firstTime) {

            playerNum = 2;

            disableOne();
            enableTwo();

            $("#startGame").modal();

            // Create the object
            var p2 = {
                choice: '',
                name: 0,
                wins: 0,
                losses: 0,
                ties: 0
            };

            // Set object in DB
            p2Ref.set(p2);

            // Set current number of watchers to 0
            numWatchers = 0;
            var watch = {
                watchers: numWatchers
            };
            watchersRef.set(watch);
            $("#watchers").text(numWatchers);

            // Not firstTime anymore
            firstTime = false;
            $("#players").text(2);
            $("#player2Header").css('background-color', 'blue')

        } else if (snap.numChildren() === 2 && !firstTime) {

            // Set current number of watchers to 0
            numWatchers = 0;
            var watch = {
                watchers: numWatchers
            };
            watchersRef.set(watch);
            $("#watchers").text(numWatchers);
            $("#players").text(2);

        } else if (snap.numChildren() > 2) {

            playerNum = -1;

            disableOne();
            disableTwo();

            // Get current number of watchers and set to numChildren - 2
            database.ref("/watchers").once('value', function (snapshot) {
                console.log("watchers");
                console.log(snapshot.val().watchers);
                numWatchers = parseInt(snapshot.val().watchers);
                numWatchers = parseInt(snap.numChildren()) - 2;
                if (numWatchers < 0) {
                    numWatchers = 0;
                }
                console.log(numWatchers);
                var watch = {
                    watchers: numWatchers
                };
                watchersRef.set(watch);

                $("#players").text(2);
                $("#watchers").text(numWatchers);

            });

        }

    });

    // Get username
    $("#lego").on('click', function () {
        // Get the name of the user
        var nameVal = $("#name").val();
        // Set current playner name
        if (playerNum === 1) {
            $("#player1Name").html(nameVal);
            var p1 = {
                choice: '',
                name: nameVal,
                wins: 0,
                losses: 0,
                ties: 0
            };
            p1Ref.set(p1);
        } else {
            $("#player2Name").html(nameVal);
            var p2 = {
                choice: '',
                name: nameVal,
                wins: 0,
                losses: 0,
                ties: 0
            };
            p2Ref.set(p2);
        }
    });

    p1Ref.on("value", function (snapshot) {
        console.log("P1")
        console.log(snapshot);
        var nameVal = snapshot.val().name;
        $("#player1Name").html(nameVal);
    });
    p2Ref.on("value", function (snapshot) {
        console.log("P2")
        console.log(snapshot);
        var nameVal = snapshot.val().name;
        $("#player2Name").html(nameVal);
    });

    // At the page load and subsequent value changes, get a snapshot of the local data.
    // This callback allows the page to stay updated with the values in firebase node "watchers"
    watchersRef.on("value", function (snapshot) {
        console.log(snapshot);

        // Change the HTML to reflect the local value in firebase.
        numWatchers = snapshot.val().watchers;

        // Change the HTML to reflect the local value in firebase.
        $("#watchers").text(numWatchers);

        // If any errors are experienced, log them to console.
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
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

    var resultsText = "";

    initGame();
    initRound();

    function initGame() {
        oneWins = 0;
        oneLosses = 0;
        oneTies = 0;
        twoWins = 0;
        twoLosses = 0;
        twoTies = 0;
    }

    function initRound() {
        console.log("Init Round");
        $("#results").text("Waiting for next round");
        disableOne();
        disableTwo();
    }

    function isDone() {
        onePicked = true;
        onePicked = false;
        twoPicked = true;
        twoPicked = false;

        checkWellPlayed();
    }

    function disableOne() {
        $("#rpgRadios11").attr('disabled', true);
        $("#rpgRadios12").attr('disabled', true);
        $("#rpgRadios13").attr('disabled', true);
    }

    function enableOne() {
        $("#rpgRadios11").attr('disabled', false);
        $("#rpgRadios11").attr('checked', false);
        $("#rpgRadios12").attr('disabled', false);
        $("#rpgRadios12").attr('checked', false);
        $("#rpgRadios13").attr('disabled', false);
        $("#rpgRadios13").attr('checked', false);
    }

    function disableTwo() {
        $("#rpgRadios21").attr('disabled', true);
        $("#rpgRadios22").attr('disabled', true);
        $("#rpgRadios23").attr('disabled', true);
    }

    function enableTwo() {
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
                resultsText = "All tied!!"
                oneTies++;
                twoTies++
            } else if (oneChoice === "rock" && twoChoice === "paper") {
                resultsText = "Player Two Wins!!"
                oneLosses++;
                twoWins++
            } else if (oneChoice === "rock" && twoChoice === "scissors") {
                resultsText = "Player One Wins!!"
                oneWins++;
                twoLosses++
            }
            if (oneChoice === "paper" && twoChoice === "rock") {
                resultsText = "Player One Wins!!"
                oneWins++;
                twoLosses++
            } else if (oneChoice === "paper" && twoChoice === "paper") {
                resultsText = "All tied!!"
                oneTies++;
                twoTies++
            } else if (oneChoice === "paper" && twoChoice === "scissors") {
                resultsText = "Player Two Wins!!"
                oneLosses++;
                twoWins++
            }
            if (oneChoice === "scissors" && twoChoice === "rock") {
                resultsText = "Player Two Wins!!"
                oneLosses++;
                twoWins++
            } else if (oneChoice === "scissors" && twoChoice === "paper") {
                resultsText = "Player One Wins!!"
                oneWins++;
                twoLosses++
            } else if (oneChoice === "scissors" && twoChoice === "scissors") {
                resultsText = "All tied!!"
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

    function updateScore() {
        $("#results").text(resultsText);
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

    // Handle either user entering a chat message
    // Push to the databaase which will then trigger the "child_added" event
    // where we will handle updating the chat window
    const chat = () => {
        // Get the message from the chat input window
        var message = $('#message').val();

        // Push the message
        chatRef.push({
            msg: message
        });

        // Empty input message window
        $('#message').val('');
    }
    $('#chatSend').on('click', chat);

    // Listen for changes in the chat Reference in the db
    // Add a message to the chat window
    chatRef.on('child_added', (snap) => {
        // Create a string with the msg
        let msgStr = `<li class="list-group-item list-group-item-dark">${snap.val().msg}`;
        // Prepend the msg so it's at the top
        $('#chat').find('ul').prepend(msgStr);
    });

});