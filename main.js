const apiKey = "029e72f96a6264c206b122ea1a6ef5ad";
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

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

const iconMap = {
  Clouds: "./images/clouds.png",
  Clear: "./images/clear.png",
  Rain: "./images/rain.png",
  Mist: "./images/mist.png",
  Drizzle: "./images/drizzle.png",
  Haze: "./images/haze.png",
};

function showError(message) {
  errorDisplay.textContent = message;
  errorDisplay.style.display = "block";
  weatherSection.classList.remove("show");
  loadingSpinner.style.display = "none";
}

function displayWeather(data) {
  tempDisplay.textContent = Math.round(data.main.temp) + "°C";
  cityDisplay.textContent = data.name;
  humidityDisplay.textContent = data.main.humidity + "%";
  windDisplay.textContent = Math.round(data.wind.speed * 3.6) + " km/h";

  const weatherType = data.weather[0].main;
  weatherIcon.src = iconMap[weatherType] || "./images/default.png";
  weatherIcon.alt = weatherType;

  errorDisplay.style.display = "none";

  weatherSection.classList.remove("show");
  setTimeout(() => weatherSection.classList.add("show"), 50);

  loadingSpinner.style.display = "none";
  searchInput.value = "";
  searchInput.blur();

  localStorage.setItem("lastCity", data.name);
  typePlaceholderInstant();
}

async function checkWeather(city) {
  try {
    loadingSpinner.style.display = "block";
    const response = await fetch(`${apiUrl}${city}&appid=${apiKey}`);
    if (!response.ok) throw new Error("Invalid city name");
    const data = await response.json();
    displayWeather(data);
  } catch {
    showError("Invalid or empty city name");
  }
}

function handleFormSubmit(e) {
  e.preventDefault();
  const city = searchInput.value.trim();
  if (city !== "") checkWeather(city);
  else showError("Please enter a city name");
}

searchInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    handleFormSubmit(e);
    searchInput.blur();
  }
});

// ==============================
// Placeholder Typing v1.5 Ultimate
// ==============================
let typingTimeout;
let typingIndex = 0;
let currentText = "";
let placeholderTexts = [];
let textIndex = 0;

function startTypingAnimation() {
  clearTimeout(typingTimeout);

  const lastCity = localStorage.getItem("lastCity");
  placeholderTexts = ["Enter a city name"];
  if (lastCity) placeholderTexts.push(`Last searched: ${lastCity}`);

  textIndex = 0;
  typeNextText();
}

function typeNextText() {
  if (document.activeElement === searchInput) {
    typingTimeout = setTimeout(typeNextText, 1500);
    return;
  }

  currentText = "";
  typingIndex = 0;
  const fullText = placeholderTexts[textIndex];
  const speed = Math.max(50, 200 / fullText.length);

  function typeLetter() {
    if (typingIndex < fullText.length) {
      currentText += fullText[typingIndex];
      searchInput.setAttribute("placeholder", currentText);
      typingIndex++;
      typingTimeout = setTimeout(typeLetter, speed);
    } else {
      typingTimeout = setTimeout(() => {
        textIndex = (textIndex + 1) % placeholderTexts.length;
        typeNextText();
      }, 1000);
    }
  }

  typeLetter();
}

function typePlaceholderInstant() {
  clearTimeout(typingTimeout);

  const lastCity = localStorage.getItem("lastCity");
  const text = lastCity ? `Last searched: ${lastCity}` : "Enter a city name";

  currentText = "";
  typingIndex = 0;
  const speed = Math.max(30, 150 / text.length);

  function typeLetter() {
    if (typingIndex < text.length) {
      currentText += text[typingIndex];
      searchInput.setAttribute("placeholder", currentText);
      typingIndex++;
      typingTimeout = setTimeout(typeLetter, speed);
    } else {
      startTypingAnimation();
    }
  }

  typeLetter();
}

// Initialize App
function loadLastCity() {
  startTypingAnimation();
  const lastCity = localStorage.getItem("lastCity");
  if (lastCity) checkWeather(lastCity);
}

form.addEventListener("submit", handleFormSubmit);
loadLastCity();
