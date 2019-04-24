const axios = require('axios');

const getCountry = async (user_input) => {
		try {
			const country = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address='${user_input}'&key=AIzaSyD7fG4H7rqJAWnB9OBfkhImMCVkoslLWGA`)
			var list_split = `${country.data.results[0].formatted_address}`;
			var split = list_split.split(', ');

			return split[split.length - 1];
		}
		catch(err) {
			console.log('Error getting country');
		}
}

const getCapital = async (country_) => {
		try {
			var capital = await axios.get(`https://restcountries.eu/rest/v2/name/${country_}`)

			return `${capital.data[0].capital}`;
		}
		catch(err) {
			console.log('Error getting capital');
		}
};

const getWeather = async (capital) => {
		try {
		const weather = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${capital}&APPID=62f088dc76101fdcc3a8a1a89e3e05f4&units=metric`)
		return [weather.data.weather[0].description, weather.data.main.temp]
		}
		catch(err) {
			console.log('Error getting weather.');
		}
};


const print_this = async (country1) => {
	
	try {
		const country__ = await getCountry(country1);
		const capital = await getCapital(country__);
		const weather = await getWeather(capital);
		// issue here
		return `The weather in ${capital}, capital of ${country__} is ${weather[1]} degrees Celsius with ${weather[0]} where bold indicates variables.`;
	}
	catch(err) {
		console.log(`Unable to get requested data for '${country1}'`);
	}
}

// const display_contents = async () => {
// 	console.log(print_this('Philippines'));
// }

print_this('Japan');