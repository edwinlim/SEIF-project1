//declare variables

const api = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
const key = '&key=AIzaSyCLizIMWsnndbOO1otEWtbnQ-W6e9HRexo';
let ridingHoodLocationArray = [];
let ridingHoodArray = [];
let wolfArray = [];

/***************FUNCTIONS************************************************************************/
//make function for computing distance between 2 GPS coordinates

function distance(lat1, lon1, lat2, lon2) {
	const R = 6371e3; // metres
	const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
	const φ2 = (lat2 * Math.PI) / 180;
	const Δφ = ((lat2 - lat1) * Math.PI) / 180;
	const Δλ = ((lon2 - lon1) * Math.PI) / 180;

	const a =
		Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
		Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	const d = R * c; // in metres

	return d;
}

function distanceBetweenTwoArrayObject(obj1, obj2) {
	return distance(obj1.lat, obj1.long, obj2.lat, obj2.long);
}

function totalTourDistance(arrObj) {
	let x = 0;

	for (i = 0; i < arrObj.length - 1; i++) {
		x += distanceBetweenTwoArrayObject(arrObj[i], arrObj[i + 1]);
	}
	return x;
}

function compare_sort(arrObj) {
	for (i = 0; i < arrObj.length; i++) {
		let j = i;
		while (j < arrObj.length - 2) {
			let a = distanceBetweenTwoArrayObject(arrObj[j], arrObj[j + 1]);
			let b = distanceBetweenTwoArrayObject(arrObj[j], arrObj[j + 2]);
			if (a > b) {
				[arrObj[j + 1], arrObj[j + 2]] = [arrObj[j + 2], arrObj[j + 1]];
			}
			j++;
		}
	}
}

//*Controller*************************************

//1. initialise the program

//*MODEL******************************************

//2. GENERATE THE LOCATIONS FROM LAT LONG OF SINGAPORE

function Place(name, lat, long) {
	this.name = name;
	this.lat = lat;
	this.long = long;
}

//3. GET USER INPUT && PUSH TO LABELS ON RIDING HOOD PANEL

document.querySelector('#get-food').addEventListener('click', function() {
	let x = document.getElementById('food-input1').value;
	document.getElementById('red-location1').innerText = x;

	x = document.getElementById('food-input2').value;
	document.getElementById('red-location2').innerText = x;

	x = document.getElementById('food-input3').value;
	document.getElementById('red-location3').innerText = x;

	x = document.getElementById('food-input4').value;
	document.getElementById('red-location4').innerText = x;

	this.classList.remove('blink');
	document.getElementsByClassName('challenge').classList.remove('blink');
	document.getElementById('wolf-plan').classList.remove('blink');
	document.getElementById('red-plan').classList.add('blink');
});
//4. COMPUTE DISTANCE FOR RED RIDING HOOD'S ROUTE
document.getElementById('red-plan').addEventListener('click', function(e) {
	e.preventDefault();

	let red_route = document.getElementsByClassName('red-route');
	for (i = 0; i < red_route.length; i++) {
		ridingHoodLocationArray[i] = red_route[i].innerText;
	}
	ridingHoodArray = [];
	ridingHoodLocationArray.forEach((element, index) => {
		let url = api + element + key;
		url = encodeURI(url);
		axios
			.get(url)
			.then(function(response) {
				ridingHoodArray[index] = new Place(
					element,
					response.data.results[0].geometry.location.lat,
					response.data.results[0].geometry.location.lng
				);
				console.log(ridingHoodArray);
			})
			.catch(function(error) {
				console.log(error);
			});
	});
	setTimeout(function() {
		ridingHoodScore = totalTourDistance(ridingHoodArray) / 1000;
		wolfArray = ridingHoodArray;
	}, 1500);

	this.classList.remove('blink');
	document.getElementById('wolf-plan').classList.add('blink');
});

document.getElementById('wolf-plan').addEventListener('click', function() {
	if (wolfArray === []) {
		alert('Ladies first');
	} else {
		//5. GENERATE OPTIMUM CHOICE FOR WOLF

		compare_sort(wolfArray);
		document.getElementById('wolf-location1').innerText = wolfArray[0].name;
		document.getElementById('wolf-location2').innerText = wolfArray[1].name;
		document.getElementById('wolf-location3').innerText = wolfArray[2].name;
		document.getElementById('wolf-location4').innerText = wolfArray[3].name;
		//5. COMPUTE DISTANCE FOR WOLF CHOICE

		wolfScore = totalTourDistance(wolfArray) / 1000;

		//6. COMPARE RESULT

		if (ridingHoodScore < wolfScore) {
			fairyTaleEnding = true;
		} else if (ridingHoodScore > wolfScore) {
			fairyTaleEnding = false;
		} else {
			fairyTaleEnding = 'null';
		}

		displayResult(fairyTaleEnding);
	}
});

//*VIEWS******************************************
var _el;

function dragOver(e) {
	if (isBefore(_el, e.target)) e.target.parentNode.insertBefore(_el, e.target);
	else e.target.parentNode.insertBefore(_el, e.target.nextSibling);
}

function dragStart(e) {
	e.dataTransfer.effectAllowed = 'move';
	e.dataTransfer.setData('text/plain', null); // Thanks to bqlou for their comment.
	_el = e.target;
}

function isBefore(el1, el2) {
	if (el2.parentNode === el1.parentNode)
		for (
			var cur = el1.previousSibling;
			cur && cur.nodeType !== 9;
			cur = cur.previousSibling
		)
			if (cur === el2) return true;
	return false;
}
//7. DECLARE WINNER

function displayResult(fairyTaleEnding) {
	let message = '';
	if (fairyTaleEnding) {
		message = `Little Red Riding Hood beats the wolf to Grandma by traveling ${Math.round(
			ridingHoodScore
		)}km compared to the wolf's ${Math.round(wolfScore)}km`;
	} else if (!fairyTaleEnding) {
		message = `The wolf arrives ahead of Little Red Riding Hood covering ${Math.round(
			wolfScore
		)}km compared to Red Riding Hood's ${Math.round(
			ridingHoodScore
		)}, eats up Grandma, and the rest is history.`;
	} else {
		message = `They both arrive at the same time, but ... that's not enough to save Grandma.`;
	}

	document.getElementById('result-text').innerText = message;
}
//function for shuffling array

//function to compute total distance

/***************FUNCTIONS************************************************************************/

//rubbish

//Function shuffle(array) {
// 	var currentIndex = array.length,
// 		temporaryValue,
// 		randomIndex;

// 	// While there remain elements to shuffle...
// 	while (0 !== currentIndex) {
// 		// Pick a remaining element...
// 		randomIndex = Math.floor(Math.random() * currentIndex);
// 		currentIndex -= 1;

// 		// And swap it with the current element.
// 		temporaryValue = array[currentIndex];
// 		array[currentIndex] = array[randomIndex];
// 		array[randomIndex] = temporaryValue;
// 	}

// 	return array;
// }
