document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("new-channel").addEventListener("click", function() {
        var number = Math.floor(Math.random() * Math.floor(999999999));
        document.location.href="plateau.html?channel="+number;
    });

});