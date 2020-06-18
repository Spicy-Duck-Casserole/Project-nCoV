
async function Common(URL,CountryName){	
	var json = [];
	var Country = new Array();
	var NotNeed = new Array("Province/State","Country/Region","Lat","Long");
	function hasInArray(arr,value){
		for(var i = 0;i<arr.length;i++){
			if(value === arr[i]){
				return true;
			}
		}
		return false;
	}
	await d3.csv(URL).then(function(csvdata){ 
		for (var j = 0; j < csvdata.length; j++) {
			index = j
			row = csvdata[index];
			if(row['Country/Region'] === CountryName){
				if(hasInArray(Country,row['Country/Region']) == false){
					var RowAddToJson = {};
					for (let attr in row) {
						if (hasInArray(NotNeed,attr)) {
							continue;
						}					
						RowAddToJson[attr] = Number(row[attr]);
					}
					json.push(RowAddToJson);
					Country.push(CountryName);
				}
				else{
					for (let attr in row) {
						if (hasInArray(NotNeed,attr)) {
							continue;
						}
						json[0][attr] += Number(row[attr]);
					}
				}
				
			}
		}			
	})
//	console.log(json[0]);
	return json[0];
}

async function CountryAll(CountryName){
	
	//var 
	var Confirm = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';
	var Deaths = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv';
	var Recovered = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv';
	
	var Confirmed = await Common(Confirm,CountryName);
	var death = await Common(Deaths,CountryName);
	var recover = await Common(Recovered,CountryName);
	var result = []
	for (index in Confirmed) {
		result.push({
			total: Confirmed[index],
			death: death[index],
			recovered: recover[index],
			date: index.substr(0, index.length - 3)
		})
	}
	console.log(result);
	return result;
}

async function CountryAll(CountryName){
	
	//var 
	var Confirm = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';
	var Deaths = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv';
	var Recovered = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv';
	
	var Confirmed = await Common(Confirm,CountryName);
	var death = await Common(Deaths,CountryName);
	var recover = await Common(Recovered,CountryName);
	var result = []
	for (index in Confirmed) {
		result.push({
			total: Confirmed[index],
			death: death[index],
			recovered: recover[index],
			date: index.substr(0, index.length - 3)
		})
	}
	console.log(result);
	return result;
}

async function Top10Active(){
	var needSolved = await nowDay();
	var CountryTpo10 = new Array();
	for (var i = 0; i < 10; i++) {
		
	}
}