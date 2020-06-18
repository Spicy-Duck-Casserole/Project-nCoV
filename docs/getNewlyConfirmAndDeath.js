async function Newly(URL) {
	var ISO = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/UID_ISO_FIPS_LookUp_Table.csv';
	var json = [];
	var Country = new Array();
	var attrs = new Array();
	//判断是否在数组中
	function hasInArray(arr, value) {
		for (var i = 0; i < arr.length; i++) {
			if (value === arr[i]) {
				return i;
			}
		}
		return -1;
	}

	ISOData = await d3.csv(ISO);
	csvdata = await d3.csv(URL);


	//选择好日期
	function getEffectiveDate() {
		var EffectiveDate = '';
		for (let attr in csvdata[0]) {
			attrs.push(attr);
		}
		EffectiveDate = attrs[attrs.length - 1];
		return EffectiveDate;
	}

	function getIso3(value) {
		for (var i = 0; i < ISOData.length; i++) {
			if (value === ISOData[i].Country_Region) {
				return ISOData[i].iso3;
			}
		}
		return 'unknown';
	}
	//根据有效日期筛选数据
	for (var j = 0; j < csvdata.length; j++) {
		index = j;
		row = csvdata[index];
		if (hasInArray(Country, row['Country/Region']) == -1) {
			var RowAddToJson = {};
			RowAddToJson.Country_Region = row['Country/Region'];
			RowAddToJson.iso3 = getIso3(row['Country/Region']);
			RowAddToJson.value = Number(row[getEffectiveDate()]);
			json.push(RowAddToJson);
			Country.push(row['Country/Region']);
		}
		else {
			json[hasInArray(Country, row['Country/Region'])]['value'] += Number(row[getEffectiveDate()]);
		}
	}

	return json;
}

async function ConfirmAVGAll() {

	//URL
	var pop_url = 'population.csv';
	var Confirm = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';
	//var Deaths = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv';
	//var Recovered = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv';

	var Confirmed = await Newly(Confirm);
	//var death = await Common(Deaths);
	var result = [];

	var pop = await d3.csv(pop_url);

	function get2018pop(value) {
		for (var i = 0; i < pop.length; i++) {
			if (pop[i]['Country Code'] === value) {
				return Number(pop[i]['2018']);
			}
		}
		return 0;
	}

	await d3.csv(pop_url).then(function (csvdata) {
		for (index in Confirmed) {
			if (get2018pop(Confirmed[index]['iso3']) === 0) continue;
			result.push({
				iso3: Confirmed[index]['iso3'],
				name: Confirmed[index]['Country_Region'],
				value: Confirmed[index]['value'] * 1000000 / get2018pop(Confirmed[index]['iso3'])
			})
		}
	})
	console.log(result);
	return result;
}

async function DeathsAVGAll() {

	//URL
	var pop_url = 'population.csv';
	//var Confirm = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';
	var Deaths = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv';
	//var Recovered = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv';

	var Confirmed = await Newly(Deaths);
	//var death = await Common(Deaths);
	var result = [];

	var pop = await d3.csv(pop_url);

	function get2018pop(value) {
		for (var i = 0; i < pop.length; i++) {
			if (pop[i]['Country Code'] === value) {
				return Number(pop[i]['2018']);
			}
		}
		return 0;
	}

	await d3.csv(pop_url).then(function (csvdata) {
		for (index in Confirmed) {
			if (get2018pop(Confirmed[index]['iso3']) === 0) continue;
			result.push({
				iso3: Confirmed[index]['iso3'],
				name: Confirmed[index]['Country_Region'],
				value: Confirmed[index]['value'] * 1000000 / get2018pop(Confirmed[index]['iso3'])
			})
		}
	})
	console.log(result);
	return result;
}

async function RecoverAVGAll() {

	//URL
	var pop_url = 'population.csv';
	//var Confirm = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';
	//var Deaths = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv';
	var Recovered = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv';

	var Confirmed = await Newly(Recovered);
	//var death = await Common(Deaths);
	var result = [];

	var pop = await d3.csv(pop_url);

	function get2018pop(value) {
		for (var i = 0; i < pop.length; i++) {
			if (pop[i]['Country Code'] === value) {
				return Number(pop[i]['2018']);
			}
		}
		return 0;
	}

	await d3.csv(pop_url).then(function (csvdata) {
		for (index in Confirmed) {
			if (get2018pop(Confirmed[index]['iso3']) === 0) continue;
			result.push({
				iso3: Confirmed[index]['iso3'],
				name: Confirmed[index]['Country_Region'],
				value: Confirmed[index]['value'] * 1000000 / get2018pop(Confirmed[index]['iso3'])
			})
		}
	})
	console.log(result);
	return result;
}
async function ConfirmAll() {

	//URL
	var Confirm = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';
	//var Deaths = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv';
	//var Recovered = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv';

	var Confirmed = await Newly(Confirm);
	//var death = await Common(Deaths);
	var result = [];

	for (index in Confirmed) {
		result.push({
			iso3: Confirmed[index]['iso3'],
			name: Confirmed[index]['Country_Region'],
			value: Confirmed[index]['value']
		})
	}

	console.log(result);
	return result;
}
async function DeathsAll() {

	//URL
	//var Confirm = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';
	var Deaths = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv';
	//var Recovered = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv';

	var Confirmed = await Newly(Deaths);
	//var death = await Common(Deaths);
	var result = [];

	for (index in Confirmed) {
		result.push({
			iso3: Confirmed[index]['iso3'],
			name: Confirmed[index]['Country_Region'],
			value: Confirmed[index]['value']
		})
	}

	console.log(result);
	return result;
}
async function RecoverdAll() {

	//URL
	//var Confirm = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';
	//var Deaths = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv';
	var Recovered = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv';

	var Confirmed = await Newly(Recovered);
	//var death = await Common(Deaths);
	var result = [];

	for (index in Confirmed) {
		result.push({
			iso3: Confirmed[index]['iso3'],
			name: Confirmed[index]['Country_Region'],
			value: Confirmed[index]['value']
		})
	}

	console.log(result);
	return result;
}
