const cityInput = document.querySelector(".city_input");
const searchBtn = document.querySelector(".search_btn");

searchBtn.addEventListener("click", () => {
  if (cityInput.value.trim() != "") {
    
    cityInput.value = "";
    cityInput.blur();
  }
});

cityInput.addEventListener("keydown", (e) => {
  if (e.key == "Enter" && cityInput.value.trim() != "") {
      
    cityInput.value = "";
    cityInput.blur();
  }
});
