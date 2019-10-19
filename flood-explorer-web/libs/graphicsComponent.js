    google.charts.load('current', {'packages':['corechart']});
    document.getElementById("load").style.display = "none";
    let endpoint = 'https://power.larc.nasa.gov/cgi-bin/v1/DataAccess.py?request=execute&identifier=SinglePoint&';    

    function getTemperature(){
      document.getElementById("load").style.display = "block";
      google.charts.setOnLoadCallback(drawChartTemperatureT2M);
    }

    async function drawChartTemperatureT2M() {
        let initDate = document.getElementById("initDate").value;
        let endDate = document.getElementById("endDate").value;
        let lat = sessionStorage.getItem("lat");
        let long = sessionStorage.getItem("long");        
        let path = `parameters=T2M&startDate=${initDate.replace(/-/g,'')}&endDate=${endDate.replace(/-/g,'')}&userCommunity=SSE&tempAverage=DAILY&outputList=JSON,ASCII&lat=${lat}&lon=${long}&user=anonymous`;


        let temperature = await axios.get(`${endpoint}${path}`);
        let dataProcess = process(temperature.data.features["0"].properties.parameter.T2M);
        var data = google.visualization.arrayToDataTable(dataProcess);
    
      var options = {
        title: 'Temperatura',
        hAxis: {title: 'Fecha',  titleTextStyle: {color: '#333'}},
        vAxis: {minValue: 0}
      };
    
      var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
      document.getElementById("load").style.display = "none";              
      chart.draw(data, options);

    }

    function process(obj){
        let array = [];
        array.push(['Fecha','℃']);

        for(let o in obj){
            array.push([formatDate(o),obj[o]]);
        }

        return array;
    }

    function formatDate(date){
      return date.substring(0,4)+'-'+date.substring(4,6)+'-'+date.substring(6,8);
    }

