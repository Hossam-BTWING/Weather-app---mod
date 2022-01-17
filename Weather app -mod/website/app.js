/* Global Variables */
//let baseURL = 'http://api.openweathermap.org/data/2.5/weather?zip={zip code},{country code}&appid={API key}';

let apiKey = ",&appid=9c398eddcf88f7574e0df25d9b8c12d3&units=imperial"; //got it by signing up to their website
let baseURL = "http://api.openweathermap.org/data/2.5/weather?zip="; //got it from their website

// Note that its my code using what I learnt from udacity and Elzero Web and you would find me testing it in all its parts using console.log which I commented out !
// Create a new date instance dynamically with JS
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
let d = new Date();
let month = months[d.getMonth()]; // to display month name
let newDate = month + "." + d.getDate() + "." + d.getFullYear();

// Event Listener part: (to detect click event on the button with id generate)
document.getElementById("generate").addEventListener("click", performAction);

function performAction(e) {
  //function of the event listener to get the value after the user enters it and click generate
  const zipCode = document.getElementById("zip").value;
  const feeling = document.getElementById("feelings").value;
  //retData(baseURL, zipCode, apiKey)

  //Getting specific data:(temp,feels_like temp, city name, wind speed, sky condition)
  retData(baseURL, zipCode, apiKey).then((data) => {
    if (data) {
      //to display specific data as retData function returns lots of information.
      const {
        main: { temp, feels_like },
        name: city,
        weather: [{ description }],
        wind: { speed },
      } = data;

      const other = {
        newDate,
        city,
        temp,
        description,
        feeling,
        speed,
        feels_like,
      };
      postData("/post", other); //executing the postData function (to server)
      frontData(); //executing the frontData function (to Front-End)
    }
  });
}

// function to retrieve data:(from the open source weather website using baseurl zip code and api key)
const retData = async (baseURL, zip, key) => {
  try {
    const response = await fetch(baseURL + zip + key);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log("error", error);
  }
};

//POSTING DATA: (to our server)
const postData = async (url = "", other = {}) => {
  // console.log(other);
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    // Body data type must match "Content-Type" header
    body: JSON.stringify(other),
  });

  try {
    const newData = await response.json();
    //console.log(newData);     //working !
    return newData;
  } catch (error) {
    console.log("error", error);
  }
};

// POSTING DATA TO FRONT-END:
const frontData = async () => {
  const response = await fetch("/get");
  try {
    const clData = await response.json();
    console.log(clData);
    document.getElementById("date").innerHTML = "Date:" + clData.newDate;
    document.getElementById("city").innerHTML = "City:" + clData.city;
    document.getElementById("temp").innerHTML = "Temp:" + clData.temp;
    document.getElementById("feels").innerHTML =
      "Feels like:" + clData.feels_like;
    document.getElementById("description").innerHTML =
      "Sky:" + clData.description;
    document.getElementById("content").innerHTML = "Feeling:" + clData.feeling;
    document.getElementById("wind").innerHTML = "Wind Speed:" + clData.speed;
  } catch (error) {
    console.log("error", error);
  }
};
