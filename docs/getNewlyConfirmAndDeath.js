 async function Newly(URL){
	var json=[];
	var Country = new Array();
	var attrs = new Array();
	//判断是否在数组中
	function hasInArray(arr,value){
		for(var i = 0;i<arr.length;i++){
			if(value === arr[i]){
				return i;
			}
		}
		return -1;
	}
	
	await d3.csv(URL).then(function(csvdata){
		//选择好日期
		function getEffectiveDate(){
			var EffectiveDate = '';
			for(let attr in csvdata[0]){
				attrs.push(attr);
			}
			EffectiveDate = attrs[attrs.length-1];
			return EffectiveDate;
		}
		//根据有效日期筛选数据
		for (var j = 0; j < csvdata.length; j++) {
			index = j;
			row = csvdata[index];
			if(hasInArray(Country,row['Country/Region']) == -1){
				var RowAddToJson = {};
				RowAddToJson.Country_Region = row['Country/Region'];
				RowAddToJson.value = Number(row[getEffectiveDate()]);
				json.push(RowAddToJson);
				Country.push(row['Country/Region']);
			}
			else{
				json[hasInArray(Country,row['Country/Region'])]['value'] += Number(row[getEffectiveDate()]);
				}
			}				
		})
	
	return json;
}

async function ConfirmAll(){
	
	//URL
	var Confirm = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';
	//var Deaths = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv';
	//var Recovered = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv';
	
	var Confirmed = await Newly(Confirm);
	//var death = await Common(Deaths);
	var result = [];
	for (index in Confirmed) {
		result.push({
			name:Confirmed[index]['Country_Region'],
			value: Confirmed[index]['value']
		})
	}
	console.log(result);
	return result;
}