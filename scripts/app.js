(function() {
	'use strict';

	var app = {
		//visibleCards: {},
		//daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
		loader: document.querySelector('.loader'),
		content: document.querySelector('#content'),
		online: navigator.onLine
	};


	/*****************************************************************************
	*
	* Event listeners for UI elements
	*
	****************************************************************************/
	
	window.addEventListener('load', function() {
		window.addEventListener('online',  app.update_online_status);
		window.addEventListener('offline', app.update_online_status);
		app.update_online_status();
	});
	
	document.getElementById('but_refresh').addEventListener('click', function() {
		app.load_stores();
	});
  
	document.getElementById('btn_load').addEventListener('click', function() {
		app.load_stores();
	});
  
  
app.update_online_status = function(){
	app.online=navigator.onLine;
	
	if(app.online){
		document.getElementById('online_text').innerHTML='on-line';
		document.getElementById("online_indicator").className="online";
	}else{
		document.getElementById('online_text').innerHTML='off-line';
		document.getElementById("online_indicator").className="offline";
	}
	
	
}
  
app.load_stores = function() {
	//var url="https://127.0.0.1/mypwa_ws/services/get_punti_vendita";
	//var url="http://localhost/mypwa_ws/services/get_punti_vendita";
	//var url="http://localhost/mypwa/data/stores.json";
	var url="https://pumaprojects.github.io/mypwa/data/stores.json";
	//var url="http://109.233.124.156/data/stores.json";
	
	
	app.content.style.display="none"; 
	app.loader.style.display="block"; 
	
	if(!app.online){
		alert("dati da cache");
		if ('caches' in window) {
			//dati in cache
			caches.match(url).then(function(response) {
				if(response) {
					response.json().then(function updateFromCache(json) {
						app.show_stores(json)
					});
				}
			});
		}else{
			alert("no cache in window");
		}
	}else{
		//alert("dati aggiornati");
		// Fetch the latest data.
		var request = new XMLHttpRequest();
		request.onreadystatechange = function() {
		  if (request.readyState === XMLHttpRequest.DONE) {
			if (request.status === 200) {
			  var response = JSON.parse(request.response);
			  app.show_stores(response);
			}
		  } else {
			// Return the initial weather forecast since no data is available.
			//app.updateForecastCard(initialWeatherForecast);
		  }
		};
		request.open('GET', url);
		request.setRequestHeader('Cache-Control', 'no-cache');
		request.send();
	}
  }


  app.show_stores = function(data) {
	//alert(data[0].sto_descrizione);
	var html='<table>';
	html+='<tr>';
	html+='<th>ID</th>';
	html+='<th>Descrizione</th>';
	html+='<th>Indirizzo</th>';
	html+='<th>Cap</th>';
	html+='<th>Città</th>';
	html+='</tr>';
    data.forEach(function(key) {
      //alert(key.sto_descrizione);
	  html+='<tr>';
	  html+='<td>'+key.sto_id+'</td>';
	  html+='<td>'+key.sto_descrizione+'</td>';
	  html+='<td>'+key.sto_indirizzo+'</td>';
	  html+='<td>'+key.sto_cap+'</td>';
	  html+='<td>'+key.sto_citta+'</td>';
	  html+='</tr>';
    });
	html+='</table>';
	
	app.content.innerHTML=html;
	app.content.style.display="block"; 
	app.loader.style.display="none"; 
  }
  
  
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker
			.register('./service-worker.js')
			.then(function() { console.log('Service Worker Registered'); });
	}

	app.update_online_status;
	
})();