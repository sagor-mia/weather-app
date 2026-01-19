// ==============================
// Minimal Weather App JS - v1.0 Final
// Features: Animated placeholder, loading spinner, fade-in weather, localStorage, responsive, accessibility
// ==============================

// API configuration
const apiKey = "029e72f96a6264c206b122ea1a6ef5ad";
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

// ==============================
// DOM ELEMENTS
// ==============================
const form = document.querySelector(".search");
const searchInput = form.querySelector("input");
const tempDisplay = document.querySelector(".temp");
const cityDisplay = document.querySelector(".city");
const humidityDisplay = document.querySelector(".humidity");
const windDisplay = document.querySelector(".wind");
const weatherIcon = document.querySelector(".weather-icon");
const weatherSection = document.querySelector(".weather");
const errorDisplay = document.querySelector(".error");
const loadingSpinner = document.querySelector(".loading");

// ==============================
// Weather icons mapping
// ==============================
const iconMap = {
  Clouds: "./images/clouds.png",
  Clear: "./images/clear.png",
  Rain: "./images/rain.png",
  Mist: "./images/mist.png",
  Drizzle: "./images/drizzle.png",
  Haze: "./images/haze.png",
};

// ==============================
// FUNCTIONS
// ==============================

/**
 * Show error message and hide weather
 * @param {string} message
 */
function showError(message) {
  errorDisplay.textContent = message;
  errorDisplay.style.display = "block";
  weatherSection.classList.remove("show");
  loadingSpinner.style.display = "none";
}

/**
 * Display weather data
 * @param {object} data
 */
function displayWeather(data) {
  tempDisplay.textContent = Math.round(data.main.temp) + "°C";
  cityDisplay.textContent = data.name;
  humidityDisplay.textContent = data.main.humidity + "%";
  windDisplay.textContent = Math.round(data.wind.speed * 3.6) + " km/h"; // convert m/s → km/h

  const weatherType = data.weather[0].main;
  weatherIcon.src = iconMap[weatherType] || "./images/default.png";
  weatherIcon.alt = weatherType;

  errorDisplay.style.display = "none";

  // Fade-in weather content
  weatherSection.classList.remove("show");
  setTimeout(() => weatherSection.classList.add("show"), 50);

  // Hide loading
  loadingSpinner.style.display = "none";

  // Clear input
  searchInput.value = "";

  // Save last searched city
  localStorage.setItem("lastCity", data.name);

  // Update placeholder animation
  startPlaceholderAnimation();
}

/**
 * Fetch weather data
 * @param {string} city
 */
async function checkWeather(city) {
  try {
    // Show loading spinner
    loadingSpinner.style.display = "block";

    const response = await fetch(`${apiUrl}${city}&appid=${apiKey}`);
    if (!response.ok) throw new Error("Invalid city name");

    const data = await response.json();
    displayWeather(data);
  } catch (err) {
    showError("Invalid or empty city name");
  }
}

/**
 * Handle form submission
 * @param {Event} e
 */
function handleFormSubmit(e) {
  e.preventDefault();
  const city = searchInput.value.trim();
  if (city !== "") checkWeather(city);
  else showError("Please enter a city name");
}

// ==============================
// Animated placeholder logic
// Smooth fade and updates even while typing
// ==============================
let placeholderInterval;

function startPlaceholderAnimation() {
  clearInterval(placeholderInterval);

  const lastCity = localStorage.getItem("lastCity");
  const texts = ["Enter a city name"];
  if (lastCity) texts.push(`Last searched: ${lastCity}`);

  let index = 0;

  function animate() {
    // Only update placeholder if user is not typing
    if (document.activeElement !== searchInput) {
      searchInput.setAttribute("placeholder", texts[index]);
      index = (index + 1) % texts.length;
    }
    placeholderInterval = setTimeout(animate, 1500); // 1.5s per text
  }

  animate();
}

// ==============================
// Initialize App
// ==============================
function loadLastCity() {
  startPlaceholderAnimation();

  const lastCity = localStorage.getItem("lastCity");
  if (lastCity) checkWeather(lastCity); // Show last searched city automatically
}

// ==============================
// Event listener
// ==============================
form.addEventListener("submit", handleFormSubmit);

// Start the app
loadLastCity();
