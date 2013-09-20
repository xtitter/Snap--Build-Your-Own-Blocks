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

// get id of next chart to be drawn

function Chart() {
	this.chart_index = 1;
	
}

Chart.getNextIndex = function() {
		return chart_index++;
	}


Chart.newChartDiv = function() {
	var new_id = "chart" + Data.chartIndex++;
	document.getElementById('chart-container').innerHTML = document.getElementById('chart-container').innerHTML + '<div id="' + new_id + '" class="chart"></div>';
	return new_id;
}

Chart.scrollDown = function() {
	document.getElementById('chart-container').scrollTop = 99999;
}


/////////////////////////////
/// SCATTERPLOT

// matrix is an array of row-arrays.
// if the first row-array is column headers, hasHeaders should be true
addScattPlot_matrix_xind_ying = function(matrix, x_index, y_index, x_name, y_name) {
	
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

///////////

Chart.Scatterplot = {};

// should fix this to take care to not generate garbage or needlessly duplicate lists
//  -- that is, do something smart while input columns are linked lists
// we only go as far as the shortest list -- and don't return an error if they are of uneven length
Chart.ScatterPlot.addScatterPlot_TwoLists = function(x_list, y_list) {
	var x_header = "X axis";
	var y_header = "Y axis";
	var matrix = [x_header, y_header], i, minlen;

	x_list.becomeArray();
	y_list.becomeArray();
	minlen = min(x_list.length(), y_list.length());
	matrix[minlen] = undefined;
	// make array long enough to hold contents and headers
	for ( i = 0; i < minlen; i++) {
		matrix[i + 1] = [x_list.at(i), y_list.at(i)];
	}
	
	CC.win.addScatterPlot(matrix, true)
}






///////////////////////////////////
/// HISTOGRAM


addHistogram = function(matrix, hasHeaders) {
	hasHeaders = typeof hasHeaders !== 'undefined' ? hasHeaders : true;
	var id = newChartDiv();

}

