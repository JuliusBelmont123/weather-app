const apiKey=YOUR_API_KEY;
let btn=document.getElementById('btn');
let input=document.getElementById('input');
let result=document.getElementById('result');
let loading=document.getElementById('loading');
let map;
let marker;
let zz=1;
btn.addEventListener('click',()=>{
    if (zz==1) {
        let city=input.value.trim();
        if (city) {
            getWeather(city);
        }
        else {
            alert("Enter a city name");
        }
    }
});
async function getWeather(city) {
    const apiUrl=`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    try {
        loading.style.display="block";
        let response=await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('city not found');
        }
        let json=await response.json();
        console.log(json);
        displayWeather(json);
        //showMap(json.coord.lat,json.coord.lon,json.name);
    }
    catch (err) {
        result.innerText=`${err.name}: ${err.message}`;
        result.style.color="red";
    }
    finally {
        loading.style.display="none";    
    }
}
function displayWeather(data) {

    let {name,main,wind,visibility,weather,coord}=data;
    let text=`City: ${name}\tTemperature: ${main.temp}°C\n
    Feels Like: ${main.feels_like}°C\tWind Speed: ${wind.speed} m/s\n
    Visibility: ${visibility} metres\tWeather: ${weather[0].description}\n`; 
    zz=0;
    animateText(text,result,()=>{
        document.getElementById('map').style.border="5px solid red";
        showMap(coord.lat,coord.lon,name);
    });
    zz=1;
}
function animateText(text,element,callback) {
    let i=0;
    element.innerHTML="";
    result.style.color="white";
    function typeCharacter() {
        if (i<text.length) {
            if (text[i]==='\n') {
                element.innerHTML+='<br>';
            }
            else if (text[i]==='\t') {
                for (let j=0;j<8;j++) element.innerHTML+='&nbsp;';
            }
            else {
                element.innerHTML+=text[i];
            }
            i++;
            setTimeout(typeCharacter,50);
        }
        else if (callback) {
            callback();
        }
    }
    typeCharacter();
}
function showMap(lat,lon,cityName) {
    if (!map) {
        map=L.map('map').setView([lat,lon],13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
            attribution: '© OpenStreetMap contributors',
        }).addTo(map);
    }
    else {
        map.setView([lat,lon],13);
    }
    if (marker) {
        map.removeLayer(marker);
    }
    marker=L.marker([lat,lon]).addTo(map).bindPopup(`<b>${cityName}</b>`).openPopup();
}