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
    $("#connected-viewers").text(snap.numChildren());
});

// Get the modal
var modal = $("#myModal");

// Get the button that opens the modal
var btn = $("#myBtn");

// Get the <span> element that closes the modal
var span = $(".close");

// When the user clicks on the button, open the modal 
$(document).ready(function () {
    $("#myModal").show(); 
})

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}