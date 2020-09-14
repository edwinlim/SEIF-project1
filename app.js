//*Controller*************************************

//1. initialise the program

//*MODEL******************************************

//2. GENERATE THE LOCATIONS FROM LAT LONG OF SINGAPORE

function Place(name, lat, long) {
	this.name = name;
	this.lat = lat;
	this.long = long;
}

let loc1 = new Place('bedok', 1.3236, 103.9273);
let loc2 = new Place('Jurong', 1.3329, 103.7436);
let loc3 = new Place('Yishun', 1.4304, 103.8354);

let wolfArray = [loc1, loc2, loc3];
let ridingHoodArray = [loc1, loc2, loc3];
//4. COMPUTE DISTANCE FOR HUMAN CHOICE

//5. GENERATE RANDOM CHOICE FOR WOLF
wolfArray = shuffle(wolfArray);
ridingHoodArray = shuffle(ridingHoodArray);

//5. COMPUTE DISTANCE FOR WOLF CHOICE

//6. COMPARE RESULT

//*VIEWS******************************************

//3. GET USER INPUT

//7. DECLARE WINNER

/***************FUNCTIONS************************************************************************/
//make function for computing distance between 2 GPS coordinates

let distance = (lat1, lon1, lat2, lon2) => {
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
};

let distanceBetweenTwoArrayObject = (obj1, obj2) => {
	return distance(obj1.lat, obj1.long, obj2.lat, obj2.long);
};

let totalTourDistance = (obj) => {
	let x = 0;
	for (i = 0; i < obj.length - 1; i++) {
		x += distanceBetweenTwoArrayObject(obj[i], obj[i + 1]);
	}

};

totalTourDistance(wolfArray);
totalTourDistance(ridingHoodArray);
//function for shuffling array

function shuffle(array) {
	var currentIndex = array.length,
		temporaryValue,
		randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

//function to compute total distance

let totalDistance = (arr) => {
	for (i = 0; i < arr.length; i++) {}
};

/***************FUNCTIONS************************************************************************/
