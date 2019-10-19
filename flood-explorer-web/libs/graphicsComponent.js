    google.charts.load('current', {'packages':['corechart','bar']});
    document.getElementById("load").style.display = "none";
    let endpoint = 'https://power.larc.nasa.gov/cgi-bin/v1/DataAccess.py?request=execute&identifier=SinglePoint&';    

    function setParameters(initDate, endDate, lat, long, type){
      return `parameters=${type}&startDate=${initDate.replace(/-/g,'')}&endDate=${endDate.replace(/-/g,'')}&userCommunity=SSE&tempAverage=DAILY&outputList=JSON,ASCII&lat=${lat}&lon=${long}&user=anonymous`;
    }

    function getTemperature(){
      document.getElementById("load").style.display = "block";
      google.charts.setOnLoadCallback(drawChartTemperatureT2M);
    }

    async function drawChartTemperatureT2M() {
        let initDate = document.getElementById("initDate").value;
        let endDate = document.getElementById("endDate").value;
        let lat = sessionStorage.getItem("lat");
        let long = sessionStorage.getItem("long");        
        let path = setParameters(initDate, endDate, lat, long, 'T2M,TQV');


        let charts = await axios.get(`${endpoint}${path}`);

        //Chart Temperature
        let dataProcess = process('Rango de fechas','℃',charts.data.features["0"].properties.parameter.T2M);
        var data = google.visualization.arrayToDataTable(dataProcess);
    
        var options = {
          title: `Estadísticas de temperatura en (${lat},${long})`,
          hAxis: {title: 'Rango de fechas',  titleTextStyle: {color: '#333'}},
          vAxis: {title: 'Temperatura en ℃'}
        };
    
        var chart = new google.visualization.AreaChart(document.getElementById('chart_temperature'));
        chart.draw(data, options);

        //Chart Precipitable water
        dataProcess = process('Rango de fechas','Centímetros',charts.data.features["0"].properties.parameter.TQV);
        data = google.visualization.arrayToDataTable(dataProcess);
        options = {
          trendlines: {
            0: {type: 'linear', lineWidth: 5, opacity: .3},
            1: {type: 'exponential', lineWidth: 10, opacity: .3}
          },
          title: `Estadísticas de agua precipitable en (${lat},${long})`,
          hAxis: {title: 'Rango de fechas',  titleTextStyle: {color: '#333'},
          viewWindow: {
            min: [0,0],
            max: [0, 0]
          }
          },
          vAxis: {title: 'Medida en centímetros'}
        };
    
        chart = new google.visualization.ColumnChart(document.getElementById('chart_precipitable'));
        chart.draw(data, options);


        document.getElementById("load").style.display = "none";                      

    }  

    function process(x,y,obj){
        let array = [];
        array.push([x,y]);

        for(let o in obj){
            array.push([formatDate(o),obj[o]]);
        }

        return array;
    }

    function formatDate(date){
      return date.substring(0,4)+'-'+date.substring(4,6)+'-'+date.substring(6,8);
    }
