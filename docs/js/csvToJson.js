function formateNum(value){
	if(value<10){
		return '0'+value;
	}
	return value;
}

function is_thirty(value){
	if(value == 2||value == 4||value == 6||value == 9||value == 11)return true;
	return false;
}
function getCorrectNewlyDate(){
	var newDate = new Date();
	var expectedDate = newDate.getDate();
	var expectedMonth = newDate.getMonth()+1;
	var expectedYear = newDate.getFullYear();
	if(expectedDate-2<=0){
		if(expectedMonth==1){// 1
			expectedYear = expectedYear - 1;
			expectedMonth = 12;
			expectedDate = 31+(expectedDate-2);//31 30
		}
		else if(is_thirty(expectedMonth)){//2 4 6 9 11
			expectedMonth--;
			expectedDate = 31+(expectedDate-2);//31 30
		}
		else if(expectedMonth == 3){//3
			expectedMonth--;
			if(expectedYear%4==0&&(expectedYear%100!=0 || expectedYear%400 == 0))expectedDate = 29+(expectedDate-2);
			else expectedDate = 28+(expectedDate-2);
		}
		else{//5 7 8 10 12
			expectedMonth--;
			expectedDate = 30+(expectedDate-2);
		}
	}
	else expectedDate-=2;
	return formateNum(expectedMonth)+'-'+formateNum(expectedDate)+'-'+expectedYear;
}

//数据源得翻墙
//动态生成URL
async function nowDay(){
	var dateName = getCorrectNewlyDate();
	var Sample = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/'+ dateName +'.csv';
	var ISO = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/UID_ISO_FIPS_LookUp_Table.csv';
	var json = [];
	var Country = new Array();
	var ISOData = new Array();

	function hasInArray(arr,value){
		for(var i = 0;i<arr.length;i++){
			if(value === arr[i]){
				return i;
			}
		}
		return -1;
	}


	function newSort(value1, value2) {
		if(value1.Confirmed > value2.Confirmed){
			return -1;
		}else if(value1.Confirmed < value2.Confirmed){
			return 1;
		}else{
			return 0;
		}
	}

	data = await d3.csv(ISO)
		
	ISOData = data;
	
	csvdata = await d3.csv(Sample)
	
	for(var i = 0;i < csvdata.length;i++) {
		 //index获取当前已存在的国家在数组中的下标
		 //如果不存在 会是-1 则新建一条json数组记录并插入,并在国家数组中存放国家名
		 var index = hasInArray(Country, csvdata[i].Country_Region);
		 if( index === -1){
			 var row = {};
			 row.Country_Region = csvdata[i]['Country_Region'];
			 row.iso2 = getIso2(row.Country_Region);
			 row.Confirmed = Number(csvdata[i].Confirmed);
			 row.Deaths = Number(csvdata[i].Deaths);
			 row.Recovered = Number(csvdata[i].Recovered);
			 row.Active = Number(csvdata[i].Active);
			 json.push(row);
			 Country.push(row.Country_Region);
		 }
		 //已存在 则根据下标，将其它数据添加到json数组中对应下标的记录中
		 else{
			 json[index].Confirmed += Number(csvdata[i].Confirmed);
			 json[index].Deaths += Number(csvdata[i].Deaths);
			 json[index].Recovered += Number(csvdata[i].Recovered);
			 json[index].Active += Number(csvdata[i].Active);
		 }	 		 
 	}  
	
	json.sort(newSort);

	function getIso2(value){
		for(var i = 0; i<ISOData.length;i++){
			if(value === ISOData[i].Country_Region){
				return ISOData[i].iso2.toLowerCase();
			}
		}
		return 'unknown';
	}

	console.log(json);
	return json;
}

async function global(){
	var dateName = getCorrectNewlyDate();
	var Sample = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/'+ dateName +'.csv';
	var json = [];
	var csvdata = await d3.csv(Sample);
	for(var i = 0;i < csvdata.length;i++){
		if(i === 0){
			var row = {};
			row.name = "global";
			row.Confirmed = Number(csvdata[i].Confirmed);
			row.Deaths = Number(csvdata[i].Deaths);
			row.Recovered = Number(csvdata[i].Recovered);
			row.Active = Number(csvdata[i].Active);
			json.push(row);
		}
		else{
			json[0].Confirmed += Number(csvdata[i].Confirmed);
			json[0].Deaths += Number(csvdata[i].Deaths);
			json[0].Recovered += Number(csvdata[i].Recovered);
			json[0].Active += Number(csvdata[i].Active);
		}
	}
	console.log(json);
	return json;
}
