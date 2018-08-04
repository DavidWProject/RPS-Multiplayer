var config = {
    apiKey: "AIzaSyBhCN9fDsVDJBX5vE0HLI2JJ4eNbek_Hxc",
    authDomain: "my-awesome-project-483b8.firebaseapp.com",
    databaseURL: "https://my-awesome-project-483b8.firebaseio.com",
    projectId: "my-awesome-project-483b8",
    storageBucket: "my-awesome-project-483b8.appspot.com",
    messagingSenderId: "765458071986"
};

firebase.initializeApp(config);


// console.log(firebase.initializeApp(config).name);

// Create a variable to reference the database.
var database = firebase.database();

// connectionsRef references a specific location in our database.
// All of our connections will be stored in this directory.
var connectionsRef = database.ref("/connections");

// '.info/connected' is a special location provided by Firebase that is updated
// every time the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = database.ref(".info/connected");

var game = {
    name: "",
    score: 0,
}

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
connectionsRef.on("value", function (snap) {

    // Display the viewer count in the html.
    // The number of online users is the number of children in the connections list.
    if (snap.numChildren() > 1) {
        $("#connected-viewers").text(snap.numChildren() + " users");
    } else {
        $("#connected-viewers").text(snap.numChildren() + " user");
    }
});

// Get the modal
var modal = $("#myModal");

// Get the button that opens the modal
var btn = $("#myBtn");

// Get the <span> element that closes the modal
var span = $(".close");

var submit = $(".submit");

var game = $(".main-game");

var rock = $(".rock");

var paper = $(".paper");

var scissor = $(".scissor");

var yourMove = $(".your-move");

var oppMove = $(".opponent-move");

var player1 = $(".player1");

var button = $(".center");

var playerOneExists = false;

var playerTwoExists = false;

var playerOneData = null;

var playerTwoData = null;

var currentPlayers = null;

var currentTurn = null;

var playerNum = false;

var chatData = database.ref("/chat");

var playersRef = database.ref("players");

var currentTurnRef = database.ref("turn");

// Function to capitalize usernames
function capitalize(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
}

// When the user clicks on the button, open the modal 
$(document).ready(function () {
    $(modal).show();
});

// When the user clicks on <span> (x), close the modal
$(span).on("click", function () {
    $(modal).hide();
    $(game).fadeIn("slow");

});

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

enterPlayers();

function enterPlayers() {
    $(submit).on("click", function () {
        var nameValue = $("#usr").val();
        $(game).fadeIn("slow");
        $(modal).hide();
        if (nameValue !== "") {
            $(player1).text(capitalize(nameValue));
            getInGame();
        }

    });

    $(modal).keypress(function (e) {

        if (e.which == 13) {
            var nameValue = $("#usr").val();
            $(game).fadeIn("slow");
            $(modal).hide();
            if (nameValue !== "") {
                $(player1).text(capitalize(nameValue));
                getInGame();
            }
        }
    });

};

//Chat Listener
$("#chatsubmit").click(function () {

    if ($("#inputchat").val() !== "") {

        var message = $("#inputchat").val();

        chatData.push({
            name: username,
            message: message,
            time: firebase.database.ServerValue.TIMESTAMP,
            idNum: playerNum
        });

        $("#inputchat").val("");
    }
});

$("#chatsubmit").keypress(function (e) {

    if (e.which === 13 && $("#inputchat").val() !== "") {
        event.preventDefault();

        var message = $("#inputchat").val();

        chatData.push({
            name: username,
            message: message,
            time: firebase.database.ServerValue.TIMESTAMP,
            idNum: playerNum
        });

        $("#inputchat").val("");
    }
});

$(document).on("click", ".center", function () {
    if ($(this).val() === "rock") {
        $(".rock-img").clone().appendTo(yourMove).css({
            "margin-left": "38%",
            "margin-right": "35%"
        });
        button.attr("disabled", true);
    }
    if ($(this).val() === "paper") {
        $(".paper-img").clone().appendTo(yourMove).css({
            "margin-left": "38%",
            "margin-right": "35%"
        });
        button.attr("disabled", true);
    }
    if ($(this).val() === "scissor") {
        $(".scissor-img").clone().appendTo(yourMove).css({
            "margin-left": "38%",
            "margin-right": "35%"
        });
        button.attr("disabled", true);
    }

    var clickChoice = $(this).val();

    playerRef.child("choice").set(clickChoice);

    currentTurnRef.transaction(function (turn) {
        return turn + 1;
    });
});

// Update chat on screen when new message detected - ordered by 'time' value
chatData.orderByChild("time").on("child_added", function (snapshot) {

    // If idNum is 0, then its a disconnect message and displays accordingly
    // If not - its a user chat message
    if (snapshot.val().idNum === 0) {
        $("#inputchat").append("<p class=player" + snapshot.val().idNum + "><span>" +
            snapshot.val().name + "</span>: " + snapshot.val().message + "</p>");
    } else {
        $("#inputchat").append("<p class=player" + snapshot.val().idNum + "><span>" +
            snapshot.val().name + "</span>: " + snapshot.val().message + "</p>");
    }

    // Keeps div scrolled to bottom on each update.
    $("#chat-messages").scrollTop($("#chat-messages")[0].scrollHeight);
});

// Tracks changes in key which contains player objects
playersRef.on("value", function (snapshot) {

    // length of the 'players' array
    currentPlayers = snapshot.numChildren();

    // Check to see if players exist
    playerOneExists = snapshot.child("1").exists();
    playerTwoExists = snapshot.child("2").exists();

    // Player data objects
    playerOneData = snapshot.child("1").val();
    playerTwoData = snapshot.child("2").val();

    // If theres a player 1, fill in name and win loss data
    if (playerOneExists) {
        $("#player1-name").text(playerOneData.name);
        $("#player1-wins").text("Wins: " + playerOneData.wins);
        $("#player1-losses").text("Losses: " + playerOneData.losses);
    } else {

        // If there is no player 1, clear win/loss data and show waiting
        $("#player1-name").text("Waiting for Player 1");
        $("#player1-wins").empty();
        $("#player1-losses").empty();
    }

    // If theres a player 2, fill in name and win/loss data
    if (playerTwoExists) {
        $("#player2-name").text(playerTwoData.name);
        $("#player2-wins").text("Wins: " + playerTwoData.wins);
        $("#player2-losses").text("Losses: " + playerTwoData.losses);
    } else {

        // If no player 2, clear win/loss and show waiting
        $("#player2-name").text("Waiting for Player 2");
        $("#player2-wins").empty();
        $("#player2-losses").empty();
    }
});

// Detects changes in current turn key
currentTurnRef.on("value", function (snapshot) {

    // Gets current turn from snapshot
    currentTurn = snapshot.val();

    // Don't do the following unless you're logged in
    if (playerNum) {

        // For turn 1
        if (currentTurn === 1) {

            // If its the current player's turn, tell them and show choices
            if (currentTurn === playerNum) {
                $("#current-turn").html("<h2>It's Your Turn!</h2>");

            } else {

                // If it isn't the current players turn, tells them they're waiting for player one
                $("#current-turn").html("<h2>Waiting for " + playerOneData.name + " to choose.</h2>");
            }

            // Shows yellow border around active player
            $("#player1").css("border", "5px solid orange");
            $("#player2").css("border", "1px solid black");
        } else if (currentTurn === 2) {

            // If its the current player's turn, tell them and show choices
            if (currentTurn === playerNum) {
                $("#current-turn").html("<h2>It's Your Turn!</h2>");

            } else {

                // If it isn't the current players turn, tells them they're waiting for player two
                $("#current-turn").html("<h2>Waiting for " + playerTwoData.name + " to choose.</h2>");

            }

            // Shows yellow border around active player
            $("#player2").css("border", "5px solid orange");
            $("#player1").css("border", "1px solid black");
        } else if (currentTurn === 3) {

            // Where the game win logic takes place then resets to turn 1
            gameLogic(playerOneData.choice, playerTwoData.choice);

            // reveal both player choices
            $("#player1-chosen").text(playerOneData.choice);
            $("#player2-chosen").text(playerTwoData.choice);

            //  reset after timeout
            var moveOn = function () {

                $("#player1-chosen").empty();
                $("#player2-chosen").empty();
                $("#result").empty();

                // check to make sure players didn't leave before timeout
                if (playerOneExists && playerTwoExists) {
                    currentTurnRef.set(1);
                }
            };

            //  show results for 2 seconds, then resets
            setTimeout(moveOn, 2000);
        } else {

            //  if (playerNum) {
            //    $("#player" + playerNum + " ul").empty();
            //  }
            $("#player1 ul").empty();
            $("#player2 ul").empty();
            $("#current-turn").html("<h2>Waiting for another player to join.</h2>");
            $("#player2").css("border", "1px solid black");
            $("#player1").css("border", "1px solid black");
        }
    }
});

// When a player joins, checks to see if there are two players now. If yes, then it will start the game.
playersRef.on("child_added", function (snapshot) {

    if (currentPlayers === 1) {

        // set turn to 1, which starts the game
        currentTurnRef.set(1);
    }
});

// Function to get in the game
function getInGame() {

    // For adding disconnects to the chat with a unique id (the date/time the user entered the game)
    // Needed because Firebase's '.push()' creates its unique keys client side,
    // so you can't ".push()" in a ".onDisconnect"
    var chatDataDisc = database.ref("/chat/" + Date.now());

    // Checks for current players, if theres a player one connected, then the user becomes player 2.
    // If there is no player one, then the user becomes player 1
    if (currentPlayers < 2) {

        if (playerOneExists) {
            playerNum = 2;
        } else {
            playerNum = 1;
        }

        // Creates key based on assigned player number
        playerRef = database.ref("/players/" + playerNum);

        // Creates player object. 'choice' is unnecessary here, but I left it in to be as complete as possible
        playerRef.set({
            name: username,
            wins: 0,
            losses: 0,
            choice: null
        });

        // On disconnect remove this user's player object
        playerRef.onDisconnect().remove();

        // If a user disconnects, set the current turn to 'null' so the game does not continue
        currentTurnRef.onDisconnect().remove();

        // Send disconnect message to chat with Firebase server generated timestamp and id of '0' to denote system message
        chatDataDisc.onDisconnect().set({
            name: username,
            time: firebase.database.ServerValue.TIMESTAMP,
            message: "has disconnected.",
            idNum: 0
        });

        // Remove name input box and show current player number.
        $("#swap-zone").html("<h2>Hi " + username + "! You are Player " + playerNum + "</h2>");
    } else {

        // If current players is "2", will not allow the player to join
        alert("Sorry, Game Full! Try Again Later!");
    }
};

// Game logic - Tried to space this out and make it more readable. Displays who won, lost, or tie game in result div.
// Increments wins or losses accordingly.
function gameLogic(player1choice, player2choice) {

    var playerOneWon = function () {
        $("#result").html("<h2>" + playerOneData.name + "</h2><h2>Wins!</h2>");
        if (playerNum === 1) {
            playersRef.child("1").child("wins").set(playerOneData.wins + 1);
            playersRef.child("2").child("losses").set(playerTwoData.losses + 1);
        }
    };

    var playerTwoWon = function () {
        $("#result").html("<h2>" + playerTwoData.name + "</h2><h2>Wins!</h2>");
        if (playerNum === 2) {
            playersRef.child("2").child("wins").set(playerTwoData.wins + 1);
            playersRef.child("1").child("losses").set(playerOneData.losses + 1);
        }
    };

    var tie = function () {
        $("#result").html("<h2>Tie Game!</h2>");
    };

    if (player1choice === "Rock" && player2choice === "Rock") {
        tie();
    } else if (player1choice === "Paper" && player2choice === "Paper") {
        tie();
    } else if (player1choice === "Scissors" && player2choice === "Scissors") {
        tie();
    } else if (player1choice === "Rock" && player2choice === "Paper") {
        playerTwoWon();
    } else if (player1choice === "Rock" && player2choice === "Scissors") {
        playerOneWon();
    } else if (player1choice === "Paper" && player2choice === "Rock") {
        playerOneWon();
    } else if (player1choice === "Paper" && player2choice === "Scissors") {
        playerTwoWon();
    } else if (player1choice === "Scissors" && player2choice === "Rock") {
        playerTwoWon();
    } else if (player1choice === "Scissors" && player2choice === "Paper") {
        playerOneWon();
    }
};