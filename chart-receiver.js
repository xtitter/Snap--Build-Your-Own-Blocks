////////////////////////////////
// SETUP

// Load the Visualization API 
google.load('visualization', '1.0', {
	'packages' : ['corechart']
});

google.setOnLoadCallback(init);

function init() {
	// probably should do something here -- this is triggered when charts can be drawn
}

// Warns user about closing tab
// borrowed from morphic.js -- not instantiated on morphic.js load, so we'll call it here
window.onbeforeunload = function(evt) {
	var e = evt || window.event, msg = "Are you sure you want to leave?";
	// For IE and Firefox
	if (e) {
		e.returnValue = msg;
	}
	// For Safari / chrome
	return msg;
};


///////////////////////////
//  COMMON 

//f javascript stupid closures stupid language stupid
var Chart = {};
Chart.chart_index = 1;

Chart.getNextIndex = function() {
		return this.chart_index++;
	}


Chart.newChartDiv = function() {
	var new_id = "chart_" + this.getNextIndex();
	document.getElementById('chart-container').innerHTML = document.getElementById('chart-container').innerHTML + '<div id="' + new_id + '" class="chart"></div>';
	return new_id;
}

Chart.scrollDown = function() {
	document.getElementById('chart-container').scrollTop = 99999;
}


/////////////////////////////
/// SCATTERPLOT


addScattPlot_matrix_xind_yind = function(matrix, x_index, y_index, x_title, y_title) {
	
	var gDataTable = google.visualization.arrayToDataTable(matrix, !hasHeaders);

	var specs = {
		chartType : 'ScatterChart',
		containerId : newChartDiv(),
		dataTable : gDataTable,
		options : {
			width : 400,
			height : 240,
			title : "Chart " + chartIndex + ": ScatterPlot"

		}
	}
	google.visualization.drawChart(specs);

}


addScatterPlot_xlist_ylist = function(x_list, y_list, x_title, y_title) {
	var x_header = x_title || "X axis";
	var y_header = y_title || "Y axis";
	var data = new google.visualization.DataTable();
	var i, n_included, n_ignored, minlen, options, chart, tempx, tempy, legend = '';

	// TODO do this conditionally whether its a list or an array, for efficiency
	x_list.becomeArray();
	y_list.becomeArray();
	minlen = Math.min(x_list.length(), y_list.length());

	data.addColumn('number', x_header);
	data.addColumn('number', y_header);
	
	n_included = 0;
	n_ignored = 0
	for ( i = 0; i < minlen; i++) {
		tempx = parseInt(x_list.at(i+1));
		tempy = parseInt(y_list.at(i+1));
		if (tempx == NaN || tempy == NaN) {
			n_ignored++;
		} else {
			data.addRow([tempx, tempy]);
			n_included++;
		}
	}
	
	legend = n_included + " datapoints in graph";
	if (n_ignored != 0) {
		legend += "; " + n_ignored + " datapoints exluded.";
	}
	
	chartid = Chart.newChartDiv();
	Chart.Scatterplot.add(data, chartid, x_header, y_header, legend);
}



///////////

Chart.Scatterplot = {};



Chart.Scatterplot.add = function(data, chartid, x_title, y_title, chart_legend) {
	var options;
	if (!chart_legend || chart_legend == '') {
		chart_legend = 'none';
	}
	options = {
		title: "Chart " + chartid.substring(6),       
		hAxis: {title: x_title},
		vAxis: {title: y_title},
		legend: chart_legend
	}
	var c = new google.visualization.ScatterChart(document.getElementById(chartid));
	c.draw(data, options);
}





///////////////////////////////////
/// HISTOGRAM


addHistogram = function(lst) {
	var id = newChartDiv();

}

