document.getElementById('current-year').textContent = new Date().getFullYear();
      
      document.getElementById('weatherForm').addEventListener('submit', function(e) {
        e.preventDefault();
        getWeather();
      });
      
      async function getWeather() {
        let City = document.getElementById("City").value.trim();
       

        if (!City) {
          alert("Please enter a city name");
          return;
        }
        
        let apiKey = "e482b06f4247d8dacdacc9627c176195";
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${City}&appid=${apiKey}`;

        try {
          // Show loading state
          const btn = document.querySelector('#weatherForm button');
          btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Loading...';
          btn.disabled = true;
          
          let response = await fetch(url);
          let data = await response.json();
          
          // Reset button
          btn.innerHTML = '<i class="fas fa-search me-2"></i>Get Weather';
          btn.disabled = false;

          if (data.cod !== 200) {
            alert("City not found. Please enter a valid location.");
            return;
          }

          // Extract values
          let celsius = (data.main.temp - 273.15).toFixed(1);
          let description = data.weather[0].description;
          let mainWeather = data.weather[0].main.toLowerCase();
          let humidity = data.main.humidity;
          let windSpeed = (data.wind.speed * 3.6).toFixed(1); // Convert m/s to km/h
          
          // Get current time
          let now = new Date();
          let updateTime = `Updated: ${now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;

          // Update DOM elements
          const tempElement = document.getElementById("Display");
          tempElement.classList.add('temp-change');
          setTimeout(() => tempElement.classList.remove('temp-change'), 500);
          
          tempElement.innerHTML = `${celsius}°C`;
          document.getElementById("location").innerHTML = `${data.name}, ${data.sys.country}`;
          document.getElementById("humidity").innerHTML = humidity;
          document.getElementById("wind").innerHTML = windSpeed;
          document.getElementById("weathertype").innerHTML = description;
          document.getElementById("update-time").textContent = updateTime;

          // Change image based on temperature
          let image = document.getElementById("weather-image");
          if (celsius < 10) {
            image.src = "https://cdn-icons-png.flaticon.com/512/4064/4064270.png"; // cold
            tempElement.style.color = "#4895ef"; // blue for cold
          } else if (celsius < 25) {
            image.src = "https://cdn-icons-png.flaticon.com/512/1146/1146869.png"; // mild
            tempElement.style.color = "#4cc9f0"; // teal for mild
          } else {
            image.src = "https://cdn-icons-png.flaticon.com/512/869/869869.png"; // hot
            tempElement.style.color = "#f8961e"; // orange for hot
          }

          // Change weather icon based on condition
          let icon = document.getElementById("weather-icon");
          let iconClass = "fas ";
          let iconColor = "";

          if (mainWeather.includes("cloud")) {
            iconClass += "fa-cloud";
            iconColor = "#6c757d"; // gray
          } else if (mainWeather.includes("rain")) {
            iconClass += "fa-cloud-rain";
            iconColor = "#4361ee"; // blue
          } else if (mainWeather.includes("snow")) {
            iconClass += "fa-snowflake";
            iconColor = "#4cc9f0"; // light blue
          } else if (mainWeather.includes("thunderstorm")) {
            iconClass += "fa-bolt";
            iconColor = "#f8961e"; // orange
          } else if (mainWeather.includes("drizzle")) {
            iconClass += "fa-cloud-rain";
            iconColor = "#4895ef"; // lighter blue
          } else if (mainWeather.includes("mist") || mainWeather.includes("fog")) {
            iconClass += "fa-smog";
            iconColor = "#adb5bd"; // light gray
          } else {
            iconClass += "fa-sun";
            iconColor = "#f8961e"; // yellow
          }

          icon.className = iconClass + " fa-3x";
          icon.style.color = iconColor;
          document.getElementById("City").value = "";

        } catch (error) {
          console.error("Error fetching weather:", error);
          alert("Something went wrong. Please try again.");
          
          // Reset button if error occurs
          const btn = document.querySelector('#weatherForm button');
          btn.innerHTML = '<i class="fas fa-search me-2"></i>Get Weather';
          btn.disabled = false;

          
        }
      }
