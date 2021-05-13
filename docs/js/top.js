async function Parse(URL){	
	var json = [];
	var Country = new Array();
	var NotNeed = new Array("Province/State","Lat","Long");
	function hasInArray(arr,value){
		for(var i = 0;i<arr.length;i++){
			if(value === arr[i]){
				return i;
			}
		}
		return -1;
	}
	await d3.csv(URL).then(function(csvdata){ 
		for (var j = 0; j < csvdata.length; j++) {
			row = csvdata[j];
			if(hasInArray(Country,row['Country/Region']) == -1){
				var RowAddToJson = {};
				for (let attr in row) {
					if (hasInArray(NotNeed,attr) != -1) {
						continue;
					}
					if(attr === 'Country/Region'){
						RowAddToJson[attr] = row[attr];
					}
					else{
						RowAddToJson[attr] = Number(row[attr]);
					}
				}
				json.push(RowAddToJson);
				Country.push(row['Country/Region']);
			}
			else{
				for (let attr in row) {
					if (attr === 'Country/Region' || hasInArray(NotNeed,attr) != -1) {
						continue;
					}
					json[hasInArray(Country,row['Country/Region'])][attr] += Number(row[attr]);
				}
			}				
		}			
	})
//	console.log(json[0]);
	return json;
}

async function ActiveArray(Confirmed,death,recover,CountryName){	
	var result = [];
	for(var i = 0; i < Confirmed.length;i++){
		if(Confirmed[i]['Country/Region'] !== CountryName){
			continue;
		}
		for (index in Confirmed[i]) {
			if(index === 'Country/Region'){
				continue;
			}
			result.push({
				value: Confirmed[i][index]-death[i][index]-recover[i][index],
				date: index
			})
		}
	}
	//console.log(result);
	return result;
}

async function Top10(){
	var all = await nowDay();
	var top10data = [];
	
	var Confirm = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';
	var Deaths = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv';
	var Recovered = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv';
	
	var Confirmed = await Parse(Confirm);
	var death = await Parse(Deaths);
	var recover = await Parse(Recovered);
	
	for(var i = 0;i < 10;i ++){
		var row = {};
		row.data = await ActiveArray(Confirmed,death,recover,all[i]['Country_Region']);
		row.name = all[i]['Country_Region'];
		top10data.push(row);
	}
	//console.log(top10data);
	return top10data;
}

async function TopN(n){
	var top10data = await Top10();
	return [top10data[n-1]];
}
