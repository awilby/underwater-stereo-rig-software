var availAperture;
var aperture;

function update_values() {
	$SCRIPT_ROOT = {{ request.script_root|tojson|safe }};
	$.getJSON($SCRIPT_ROOT+"/_data",
		function(data) {
			console.log("Recievd Data:")
			console.log(data)

			availAperture = data.avail_aperture.split(",");
			aperture = data.aperture;
			$("#avail_aperture").text(data.avail_aperture)
			$("#avail_shutter").text(data.avail_shutter)
			$("#avail_iso").text(data.avail_iso)
			$("#mode").text(data.mode)
			$("#videoMode").text(data.videoMode)
			$("#aperture").text(data.aperture)
			$("#shutter").text(data.shutter)
			$("#iso").text(data.iso)
		});
	setTimeout(update_values, 5000);
};


$(update_values());
addEventListener("DOMContentLoaded", function() {
	var shootButton = document.querySelector('.shootButton')
	shootButton.addEventListener("click", function(e) {
		e.preventDefault();
		var request = new XMLHttpRequest();
    	console.log("Clicked button to take picture");
		request.open("GET", "/takePicture", true);
		request.send();
	});
	var modeButtons = document.querySelectorAll('.modeButton')
	for (var i=0; i < modeButtons.length; i++) {
		modeButton = modeButtons[i];
		modeButton.addEventListener("click", function(e) {
			e.preventDefault();
			var clickedButton = e.target;
			var mode = clickedButton.value;
			var request = new XMLHttpRequest();
			request.open("GET", "/setMode/" + mode, true);
			request.send();
		});
	}

	var apertureUpButton = document.querySelector('.aperture_up')
	apertureUpButton.addEventListener("click", function(e) {
		e.preventDefault();
		var currAperIndex = availAperture.indexOf(aperture);
		if (currAperIndex < availAperture.length()) {
			var request = new XMLHttpRequest();
			var newValue = availAperture[currAperIndex + 1]
			request.open("GET", "/setAperture/" + newValue, true);
			request.send();
		}

	});

	var apertureDownButton = document.querySelector('.aperture_down')
	apertureDownButton.addEventLisrtener("click", function(e) {
		e.preventDefault();
		var currAperIndex = availAperture.indexOf(aperture);
		if (currAperIndex > 0) {
			var request = new XMLHttpRequest();
			var newValue = availAperture[currAperIndex - 1]
			request.open("GET", "/setAperture/" + newValue, true);
			request.send();
		}
	});



	var shutterButton = document.querySelector('.shutterButton')
	shutterButton.addEventListener("click", function(e) {
		e.preventDefault();
		var request = new XMLHttpRequest();
		request.open("GET", "/setShutter/" + document.getElementById("shutterField").value.replace('/', '.'), true);
		request.send();
	});
	var isoButton = document.querySelector('.isoButton')
	isoButton.addEventListener("click", function(e) {
		e.preventDefault();
		var request = new XMLHttpRequest();
		request.open("GET", "/setISO/" + document.getElementById("isoField").value, true);
		request.send();
	});

	//NEW STUFF
	var recordButton = document.querySelector('.recordButton')
	recordButton.addEventListener("click", function(e) {
		e.preventDefault();
		var request = new XMLHttpRequest();
    	console.log("Clicked button to take Video");
		request.open("GET", "/takeVideo", true);
		request.send();
	});

	var switchVideoButton = document.querySelector('.switchVideoButton')
	switchVideoButton.addEventListener("click", function(e) {
		e.preventDefault();
		var request = new XMLHttpRequest();
    	console.log("Clicked button to switch to Video mode");
		request.open("GET", "/setVideoMode", true);
		request.send();
	});

	var switchPictureButton = document.querySelector('.switchPictureButton')
	switchPictureButton.addEventListener("click", function(e) {
		e.preventDefault();
		var request = new XMLHttpRequest();
    	console.log("Clicked button to switch to Picture mode");
		request.open("GET", "/setPictureMode", true);
		request.send();
	});

	var cameraOnButton = document.querySelector('.cameraOn')
	cameraOnButton.addEventListener("click", function(e) {
		e.preventDefault();
		var request = new XMLHttpRequest();
    	console.log("Clicked button turn on camera");
		request.open("GET", "/setCameraOn", true);
		request.send();
	});

	var cameraOffButton = document.querySelector('.cameraOff')
	cameraOffButton.addEventListener("click", function(e) {
		e.preventDefault();
		var request = new XMLHttpRequest();
    	console.log("Clicked button to turn off camera");
		request.open("GET", "/setCameraOff", true);
		request.send();
	});


	//
	update_values();
}, true);
