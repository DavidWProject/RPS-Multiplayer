var config = {
    apiKey: "AIzaSyBhCN9fDsVDJBX5vE0HLI2JJ4eNbek_Hxc",
    authDomain: "my-awesome-project-483b8.firebaseapp.com",
    databaseURL: "https://my-awesome-project-483b8.firebaseio.com",
    projectId: "my-awesome-project-483b8",
    storageBucket: "my-awesome-project-483b8.appspot.com",
    messagingSenderId: "765458071986"
};

firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();

// connectionsRef references a specific location in our database.
// All of our connections will be stored in this directory.
var connectionsRef = database.ref("/connections");

// '.info/connected' is a special location provided by Firebase that is updated
// every time the client's connection state changes.
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

// When the user clicks on the button, open the modal 
$(document).ready(function () {
    $(modal).show(); 
});

// When the user clicks on <span> (x), close the modal
$(span).on("click", function() {
    $(modal).hide(); 
    $(game).fadeIn("slow"); 
});

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

$(submit).on("click", function() {
    $(modal).hide(); 
    var nameValue = $("#usr").val(); 
    console.log(nameValue); 
    $(game).fadeIn("slow");  
})

$(modal).keypress(function (e) {

    if (e.which == 13) {
        var nameValue = $("#usr").val(); 
        console.log(nameValue); 
        $(game).fadeIn("slow");  
        $(modal).hide(); 
    }
});

$(rock).on("click", function () {
    $(rock).clone().appendTo(yourMove).css({"margin-left" : "35%"}); 
});

$(paper).on("click", function () {
    $(paper).clone().appendTo(yourMove).css({"margin-left" : "35%"}); 
});

$(scissor).on("click", function () {
    $(scissor).clone().appendTo(yourMove).css({"margin-left" : "35%"}); 
});