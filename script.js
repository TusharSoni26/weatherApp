const wrapper = document.querySelector(".wrapper"),
inputPart = wrapper.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-text"),
inputFeild = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector("button"),
arrowBack = wrapper.querySelector("header i");
let weatherIcon  = document.querySelector(".weather-part img");

inputFeild.addEventListener("keyup",e =>{
    if(e.key == "Enter" && inputFeild.value != "")
    {
        requestAPI(inputFeild.value);
    }
})

locationBtn.addEventListener("click", () =>{
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(onsuccess,onerror);
    }
    else{
        alert("Your browser does not support location");
    }
})

function onsuccess(position)
{
    const {latitude, longitude} = position.coords;
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=c1bc6f570b0d91ea08392b057a3a6f9e`;
    fetchData(api);
}
function onerror(error)
{
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function requestAPI(city){
    let api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=c1bc6f570b0d91ea08392b057a3a6f9e`;
    fetchData(api);
}

function fetchData(api)
{
    infoTxt.innerHTML = "Getting weather details...";
    infoTxt.classList.add("pending");
    console.log(api);
    fetch(api).then(response => response.json()).then(result => weatherDetail(result));
}

function weatherDetail(info){
    if(info.cod == "404")
    {
        infoTxt.innerText = `${inputFeild.value} isn't a valid city name`;
        infoTxt.classList.replace("pending","error");
    }
    else{

        const city = info.name;
        const country = info.sys.country;
        const {description , id} = info.weather[0];
        const {feels_like , humidity , temp} = info.main;

        wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
        wrapper.querySelector(".weather").innerText = description;
        wrapper.querySelector(".location span").innerText = `${city},${country}`;
        wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerText = `${humidity}%`;

        if(id == 800){
            weatherIcon.src = "weather-icons/clear.svg";
        }
        else if(id >= 200 && id<=232){
            weatherIcon.src = "weather-icons/strom.svg";
        }
        else if(id >= 600 && id<=622){
            weatherIcon.src = "weather-icons/snow.svg";
        }
        else if(id >= 701 && id<=781){
            weatherIcon.src = "weather-icons/haze.svg";
        }
        else if(id >= 801 && id<=804){
            weatherIcon.src = "weather-icons/cloud.svg";
        }
        else if((id >= 301 && id<=321) || (id>=500 && id<= 531)){
            weatherIcon.src = "weather-icons/rain.svg";
        } 

        infoTxt.classList.replace("error","pending");
        wrapper.classList.add("active");
    }
}

arrowBack.addEventListener("click",()=>{
    wrapper.classList.remove("active");
    infoTxt.classList.remove("pending");
})
