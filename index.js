const search = document.querySelector('input');

const dateTime = document.querySelector('.date-time');
const nameCountry = document.querySelector('.name-country');

//~ const giphyImg = document.querySelector('.giphy');

const weatherIcon = document.querySelector('.weather-icon');
const temp = document.querySelector('.temp');

const feelsLike = document.querySelector('.feels-like');
const description = document.querySelector('.description');
const pop = document.querySelector('.pop');

const error = document.querySelector('.error');

const windSpeed = document.querySelector('.wind-speed');
const humidity = document.querySelector('.humidity');
const pressure = document.querySelector('.pressure');
const visibility = document.querySelector('.visibility');
const uv = document.querySelector('.uv');

const tempBtn = document.querySelector('.temp-btn');
const humidBtn = document.querySelector('.humidity-btn');
const precpBtn = document.querySelector('.precp-btn');

const dailyForecast = document.querySelector('.daily');
const table = document.querySelector('.table');


let hourlyMenu = 'temperature';
let city = null;
let hourlyArr ;


try{
	error.innerHTML = '';
getCoordinates('London');
}
catch{
		error.textContent = 'Server Load error/Slow connection';
	}
search.addEventListener('change',() => {
		city = search.value;
		search.value = '';
		
		getCoordinates(city);
	});


async function getCoordinates(city){
		try{
			error.innerHTML = '';
		const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=f3ff2d887ca8e44b4d677a9bfe02f400`,{mode:'cors'})
		
		const data = await response.json();
		
		const lat = data.coord.lat;
		const lon = data.coord.lon;
		const name = data.name;
		const country = data.sys.country;

		nameCountry.textContent = name+","+" "+country;

		weatherUpdate(lat,lon);
	}
	catch{
			error.textContent = new Error("Enter correct spelling or valid city name");
		}
	}

async function weatherUpdate(lat,lon){
		const response = await fetch(`http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=f3ff2d887ca8e44b4d677a9bfe02f400`,{mode:'cors'})
		
		const data = await response.json();
		const icon = data.current.weather[0].icon;
		const currentDate = new Date(data.current.dt*1000);
				
	  
		let arr = hourlyData(data,hourlyMenu);
		hourlyArr = arr;
	
	
		google.charts.load('current', {'packages':['corechart']});
		google.charts.setOnLoadCallback(() => {drawChart(arr,hourlyMenu)});
		
		
		tempBtn.addEventListener('click',() => {
			hourlyMenu = 'temperature';
			let arr = hourlyData(data,hourlyMenu);
			google.charts.load('current', {'packages':['corechart']});
			google.charts.setOnLoadCallback(() => {drawChart(arr,hourlyMenu)});
		
		});

		humidBtn.addEventListener('click',() => {
			hourlyMenu = 'humidity';
			let arr = hourlyData(data,hourlyMenu);
			google.charts.load('current', {'packages':['corechart']});
			google.charts.setOnLoadCallback(() => {drawChart(arr,hourlyMenu)});
		
		});

		precpBtn.addEventListener('click',() => {
			hourlyMenu = 'precipitation';
			let arr = hourlyData(data,hourlyMenu);
			google.charts.load('current', {'packages':['corechart']});
			google.charts.setOnLoadCallback(() => {drawChart(arr,hourlyMenu)});
		
		});




		//~ let descrip = data.current.weather[0].description;

		//~ fetch(`https://api.giphy.com/v1/gifs/translate?api_key=q7TTn65HCznFlVO214TS2Wp6ZGHECAsW&s=${descrip}`)
			//~ .then(resp => resp.json())
				//~ .then(response => {
					//~ giphyImg.src = response.data.images.original.url;

				//~ });

	
		
		currentParameters(data,icon);
		getDateFormat(currentDate,data);
		
		daily(data);
	}
	
function currentParameters(data,icon){
	
		weatherIcon.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
		temp.innerHTML = Math.floor(data.current.temp - 273)+" "+"&#176;"+ "C";
		pop.innerHTML = 'Chances of rain: ' + (data.daily[0].pop*100).toFixed()+'%';
		
		feelsLike.innerHTML = "Feels Like: "+ Math.floor(data.current.feels_like - 273) +" " + "&#176;" + "C";
		description.textContent = data.current.weather[0].description;
		
		let windDirection = document.createElement('span');
		windDirection.innerHTML = '&#8594;';
		let deg = data.current.wind_deg - 90;
		windDirection.style.transform = `rotate(${deg}deg)`;
		
		windSpeed.innerHTML = `Wind Speed:   ${data.current.wind_speed}   m/s`;
		windSpeed.appendChild(windDirection);
		
		humidity.textContent = "Humidity: " + data.current.humidity + ' %';
		visibility.textContent = `Visibility:  ${data.current.visibility/1000}  km`;
		pressure.textContent = "Pressure: " + data.current.pressure + " hPa";
		uv.textContent = "UV: " + data.current.uvi ;
		
	}
	
function getDateFormat(date,data){
		let month = date.toLocaleString('default',{month:'short'});
		let dateString = date.getDate();

		let time = date.toLocaleString('default',{timeZone:data.timezone}).split(',')[1];
		let format = time.split(':');
		let ampm = format[2].slice(2,);
		
		let strDate = `${month} ${dateString}, ${format[0]}:${format[1]} ${ampm}`;
		
		dateTime.textContent = strDate;
	}
	
function dailyData(data,i){
		let date = new Date(data.daily[i].dt*1000).toLocaleString('default',{timeZone:`${data.timezone}`}).split('/');
		let dateStr = date[0]+"/"+date[1];
		
		let icon = data.daily[i].weather[0].icon;
		
		let img = document.createElement('img');
		img.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
		
		let temp = Math.floor(data.daily[i].temp.max-273)+"&#176;"+ "C"+'/'+Math.floor(data.daily[i].temp.min-273)+"&#176;"+ "C";
		
		let precp = (data.daily[i].pop*100).toFixed()+'%';
		
		let humid = data.daily[i].humidity+"%";
		
		return [dateStr,img,temp,precp,humid];
	}

function daily(data){	
		table.innerHTML = '';
		
		let headingRow = document.createElement('tr');
		table.appendChild(headingRow);
		
		let h1 = document.createElement('th');
		h1.textContent = 'Day';
		headingRow.appendChild(h1);
		
		let h2 = document.createElement('th');
		h2.textContent = '';
		headingRow.appendChild(h2);
		
		let h3 = document.createElement('th');
		h3.textContent = 'Temperature';
		headingRow.appendChild(h3);

		let h4 = document.createElement('th');
		h4.textContent = 'Precipitation';
		headingRow.appendChild(h4);
		
		let h5 = document.createElement('th');
		h5.textContent = 'Humidity';
		headingRow.appendChild(h5);

		
		for(let i = 0; i < data.daily.length; i++){
			
			let forecastData = dailyData(data,i);
			
				let tableRow = document.createElement('tr');
				table.appendChild(tableRow);
				
				let data1 = document.createElement('td');
				data1.innerHTML = forecastData[0];
				tableRow.appendChild(data1);
				
				let data2 = document.createElement('td');
				data2.appendChild(forecastData[1]);
				tableRow.appendChild(data2);
				
				let data3 = document.createElement('td');
				data3.innerHTML = forecastData[2];
				tableRow.appendChild(data3);
				
				let data4 = document.createElement('td');
				data4.innerHTML = forecastData[3];
				tableRow.appendChild(data4);
				
				let data5 = document.createElement('td');
				data5.innerHTML = forecastData[4];
				tableRow.appendChild(data5);
			}
	}


function hourlyData(data,str){
	
	
		 let arr = [['time',str]];
		  for(let i = 0; i<data.hourly.length;i++){
				let newarr = [];
				let time = new Date(data.hourly[i].dt*1000).toLocaleString('default',{timeZone:data.timezone}).split(',')[1].split(':');
				
				let strTime = time[0]+time[2].slice(2,);
				let temp = Math.floor(data.hourly[i].temp-273)
				let humid = data.hourly[i].humidity;
				let precp = parseInt((data.hourly[i].pop*100).toFixed());
			
			
				newarr.push(strTime);
				if(str === 'temperature')
					newarr.push(temp);
				else if(str === 'humidity')
					newarr.push(humid)
				else if(str === 'precipitation')
					newarr.push(precp)
				arr.push(newarr);
			  }
			  		  
		return arr;
	}

     
	function drawChart(arr,str) {
		 
		 if(str === 'temperature')
			str += ' in Celcius';
		else
			str += ' in %';
		 
        var dat2 = google.visualization.arrayToDataTable(arr);
        var options = {
          legend:'none',
          backgroundColor:'none',
          chartArea:{'width':'90%',
					'left':50,
					},
			vAxis:{
					title:str
				},
			hAxis:{
					title:'Time',
					slantedText:true,
					slantedTextAngle:90
				}
		 
        };

        var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

        chart.draw(dat2, options);
      }

     

	
