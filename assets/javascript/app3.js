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

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log("In firebase");
        } else {
            console.log("In not yet");
            setTimeout(myFunction, 5000);
        }
    });


    var database = firebase.database();

    // Global variables

    // Player number - if one or two is playing - if -1 is watching - if 0 - initial pass
    var playerNum = 0;
    var firstTime = true;
    var numPlayers = 0;
    var numWatchers = 0;
    var oneChoice = null;
    var twoChoice = null;

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
    var scoresRef = database.ref("/scores");
    // Reference the p1 folder
    var p1ScoreRef = scoresRef.child('p1');
    // Reference the p2 folder
    var p2ScoreRef = scoresRef.child('p2');

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

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log("Here");
        }
    });

    // When first loaded or when the connections list changes...
    connectionsRef.on("value", function (snap) {
        console.log("connectionsRef - When first loaded or when the connections list changes");
        if (snap.numChildren() === 1 && firstTime) {

            // Set references to chat folder
            chatRef = database.ref('/chat'); // Reference chat

            // Do this on first player
            // If there's only one user, clear the chat history in the db
            chatRef.set({});
            $('#chat').find('ul').empty(); // Clear the HTML

            playerNum = 1;

            // These are the players references
            // Reference entire players folder
            playersRef = database.ref('players');
            // Set references to score children
            scoresRef = database.ref("/scores");

            // Initi player one and two in db
            var p1 = {
                choice: '',
                name: nameVal
            };

            // Reference the p1 folder
            p1Ref = playersRef.child('p1');

            p1Ref.set(p1);
            var p1Score = {
                wins: 0,
                losses: 0,
                ties: 0
            };

            // Reference the p1 folder
            p1ScoreRef = scoresRef.child('p1');
            p1ScoreRef.set(p1Score);

            var p2 = {
                choice: '',
                name: nameVal
            };

            console.log("In not Waiting");
            setTimeout(myFunction, 5000);

            // Reference the p2 folder
            p2Ref = playersRef.child('p2');
            p2Ref.set(p2);

            var p2Score = {
                wins: 0,
                losses: 0,
                ties: 0
            };

            // Reference the p2 folder
            p2ScoreRef = scoresRef.child('p2');
            p2ScoreRef.set(p2Score);

            // Set current number of watchers to 0
            numWatchers = 0;
            var watch = {
                watchers: numWatchers
            };

            // Set reference to watchers
            watchersRef = database.ref("/watchers");
            watchersRef.set(watch);
            $("#watchers").text(numWatchers);

            enableOne();
            disableTwo();

            $("#startGame").modal();

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

            // Initi player two in db
            p1ScoreRef.set(p1Score);
            var p2 = {
                choice: '',
                name: nameVal
            };
            p2Ref.set(p2);
            var p2Score = {
                wins: 0,
                losses: 0,
                ties: 0
            };
            p2ScoreRef.set(p2Score);

            // Set current number of watchers to 0
            numWatchers = 0;
            var watch = {
                watchers: numWatchers
            };
            watchersRef.set(watch);
            $("#watchers").text(numWatchers);

            disableOne();
            enableTwo();

            $("#startGame").modal();

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
                name: nameVal
            };
            p1Ref.set(p1);
            var p1Score = {
                wins: 0,
                losses: 0,
                ties: 0
            };
            p1ScoreRef.set(p1Score);
        } else {
            $("#player2Name").html(nameVal);
            var p2 = {
                choice: '',
                name: nameVal
            };
            p2Ref.set(p2);
            var p2Score = {
                wins: 0,
                losses: 0,
                ties: 0
            };
            p2ScoreRef.set(p2Score);
        }
    });

    // Handle players change
    p1Ref.on("value", function (snapshot) {
        oneChoice = snapshot.val().choice;
        var nameVal = snapshot.val().name;
        $("#player1Name").html(nameVal);
    });
    p2Ref.on("value", function (snapshot) {
        twoChoice = snapshot.val().choice;
        var nameVal = snapshot.val().name;
        $("#player2Name").html(nameVal);
    });

    // Handle scores change
    p1ScoreRef.on('value', function (snapshot) {
        oneWins = snapshot.val().wins;
        oneLosses = snapshot.val().losses;
        oneTies = snapshot.val().ties;
        updateScore();
    });
    p2ScoreRef.on('value', function (snapshot) {
        twoWins = snapshot.val().wins;
        twoLosses = snapshot.val().losses;
        twoTies = snapshot.val().ties;
        updateScore();
    });


    // At the page load and subsequent value changes, get a snapshot of the local data.
    // This callback allows the page to stay updated with the values in firebase node "watchers"
    watchersRef.on("value", function (snapshot) {
        console.log("watchers");
        console.log(snapshot);
        return;

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

    // Disable the player one radio buttons
    function disableOne() {
        $("#rpgRadios11").attr('disabled', true);
        $("#rpgRadios12").attr('disabled', true);
        $("#rpgRadios13").attr('disabled', true);
    }

    // Enable the player one radio buttons
    // Set them all to unchecked
    function enableOne() {
        $("#rpgRadios11").attr('disabled', false);
        $("#rpgRadios11").attr('checked', false);
        $("#rpgRadios12").attr('disabled', false);
        $("#rpgRadios12").attr('checked', false);
        $("#rpgRadios13").attr('disabled', false);
        $("#rpgRadios13").attr('checked', false);
    }

    // Disable the player one radio buttons
    function disableTwo() {
        $("#rpgRadios21").attr('disabled', true);
        $("#rpgRadios22").attr('disabled', true);
        $("#rpgRadios23").attr('disabled', true);
    }

    // Enable the player two radio buttons
    // Set them all to unchecked
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

    // Manage a game choice
    // $('input:radio[name=rpgRadios]:checked').change(function () {
    $('.form-check-input').click(function () {
        console.log(this);

        if ($(this).attr("id") == 'rpgRadios11') {
            oneChoice = "rock";
            onePlayed = true;
            setChoice(oneChoice);
            oneThis = $(this);
            $("#playerOneImg").attr('src', './assets/images/rock1.jpg');
            disableOne();
            console.log("Rock");
        }
        if ($(this).attr("id") == 'rpgRadios12') {
            oneChoice = "paper";
            onePlayed = true;
            setChoice(oneChoice);
            $("#playerOneImg").attr('src', './assets/images/paper1.jpg');
            disableOne();
            console.log("Paper");
        }
        if ($(this).attr("id") == 'rpgRadios13') {
            oneChoice = "scissors";
            onePlayed = true;
            setChoice(oneChoice);
            $("#playerOneImg").attr('src', './assets/images/scissors1.jpg');
            disableOne();
            console.log("Scissors");
        }

        if ($(this).attr("id") == 'rpgRadios21') {
            twoChoice = "rock";
            twoPlayed = true;
            setChoice(twoChoice);
            $("#playerTwoImg").attr('src', './assets/images/rock2.jpg');
            disableTwo();
            console.log("Rock");
        }
        if ($(this).attr("id") == 'rpgRadios22') {
            twoChoice = "paper";
            twoPlayed = true;
            setChoice(twoChoice);
            $("#playerTwoImg").attr('src', './assets/images/paper2.jpg');
            disableTwo();
            console.log("Paper");
        }
        if ($(this).attr("id") == 'rpgRadios23') {
            twoChoice = "scissors"
            setChoice(twoChoice);
            twoPlayed = true;
            $("#playerTwoImg").attr('src', './assets/images/scissors2.jpg');
            disableTwo();
            console.log("Scissors");
        }
    });

    function setChoice(choice) {

        // Get the current player data
        // and update the choice
        if (playerNum === 1) {
            p1Ref.once('value', function (snapshot) {
                // Store everything into a variable.
                var oldChoice = snapshot.val().choice;
                var name = snapshot.val().name;

                var p1 = {
                    choice: choice,
                    name: name
                };
                p1Ref.set(p1);

                // Check if other player is done
                p2Ref.once('value', function (snapshot) {
                    // Store choice
                    twoChoice = snapshot.val().choice;
                    if (oneChoice !== null && twoChoice !== null) {
                        onePicked = true;
                        twoPicked = true;
                        checkWellPlayed();
                    }

                });
            });


        } else {
            p2Ref.once('value', function (snapshot) {
                // Store everything into a variable.
                var oldChoice = snapshot.val().choice;
                var name = snapshot.val().name;

                var p2 = {
                    choice: choice,
                    name: name
                };
                p2Ref.set(p2);

                // Check if other player is done
                p1Ref.once('value', function (snapshot) {
                    // Store choice
                    oneChoice = snapshot.val().choice;
                    if (oneChoice !== null && twoChoice !== null) {
                        onePicked = true;
                        twoPicked = true;
                        checkWellPlayed();
                    }

                });

            });
        }
    };

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