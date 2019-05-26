    // Get a new player
    // Functions
    const playerName = () => {
        // Connected event handler
        connectedRef.on('value', (snap) => { // Check if someone connected/disconnected
            console.log("Connected playerName")
            console.log(snap);
            if (snap.val()) { // If someone connected
                connectionsRef.push(true);
                connectionsRef.onDisconnect().remove(); // Remove user from the connection list when they disconnect
            }
        });
        // Connections folder
        connectionsRef.on('value', (snap) => { // If I just moved someone to my connection folder
            console.log("When first loaded or when the connections list changes");

            console.log(snap);
            console.log(`Number of players online ${snap.numChildren()}`);
            activePnum = snap.numChildren(); // Get the number of connections at the moment
            pNameVal = $("#name").val(); // Get the name of the user
            $('span.playerName').html(` ${pNameVal}`); // Greet current player

            if (activePnum == 1) { // If you're the 1st player
                console.log("First player");

                // Do this on first player
                // If there's only one user, clear the chat history in the db
                chatRef.set({});
                $('#chat').find('ul').empty(); // Clear the HTML

                p1NameVal = pNameVal; // Store the current name into a new variable to keep track inside the app
                // Create the object
                const p1 = {
                    choice: '',
                    name: p1NameVal,
                };
                const t = {
                    whoseturn: turn
                };

                // Sync object
                p1Ref.set(p1);
                turnRef.set(t);

                // Wait for player two
                $rPanel.html('Waiting for player 2');
                console.log('Waiting for player 2');

                turn = 'p2turn';
                turnRef.update({
                    whoseturn: turn
                }); // Update the turn in the db

            } else if (activePnum == 2) { // If you are the 2nd player
                p2NameVal = pNameVal; // Store the current name into a different variable to keep track
                // Create the object
                const p2 = {
                    choice: '',
                    name: p2NameVal
                };
                const w = {
                    p1: p1Wins,
                    p2: p2Wins
                }
                const l = {
                    p1: p1Losses,
                    p2: p2Losses
                }
                // Sync object
                p2Ref.set(p2);
                winsRef.set(w);
                losesRef.set(l);

                // Inform user
                $rPanel.html('Play Now!');
                console.log('play now');
                turn = 'p1turn';
                turnRef.update({
                    whoseturn: turn
                });
            }
        });
    }
