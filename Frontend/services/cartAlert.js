document.addEventListener('DOMContentLoaded', function() {
    var modal = document.getElementById("paymentModal");
    var btn = document.getElementById("openModal");
    var span = document.getElementsByClassName("close")[0];
    var form = document.getElementById("paymentForm");

    btn.onclick = function() {
        modal.style.display = "block";
    }

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    form.onsubmit = function(event) {
        event.preventDefault();
        modal.style.display = "none";
    }
});