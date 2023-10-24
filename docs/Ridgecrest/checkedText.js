document.addEventListener("DOMContentLoaded", function () {
    var checkbox = document.getElementById("failure-color");
    var textElement = document.getElementById("checked-text");

    if (checkbox.checked) {
	textElement.style.display = "block";
    } else {
	textElement.style.display = "none";
    }

    checkbox.addEventListener("change", function () {
	if (checkbox.checked) {
	    textElement.style.display = "block";
	} else {
	    textElement.style.display = "none";
	}
    });
});
