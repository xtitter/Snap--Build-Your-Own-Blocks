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


// shouldn't do the innerhtml trick, yo -- big strings will waste space.  Use jquery?
Chart.newChartDiv = function(title, caption) {
	var new_id = "chart_" + this.getNextIndex();
	var title_div = "";
	var caption_div =  "";
	var chart_div;
	
	if (title) {
		title_div = ' <div class="title">' + title + '</div> ';
	}
	if (caption) {
		caption_div = ' <div class="caption">' + caption + '</div> ';
	}
	chart_div = '<div class="chart"> ' + title_div + '<div id="' + new_id + '"></div> ' + caption_div + ' </div>';
	document.getElementById('chart-container').innerHTML = document.getElementById('chart-container').innerHTML + chart_div;
	return new_id;
}

Chart.scrollDown = function() {
	document.getElementById('chart-container').scrollTop = 99999;
}


// from http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric
Chart.isNumber = function (n) {
	return ( !isNaN(parseFloat(n)) && isFinite(n) );
}

// takes a List object with, potentially, a header (non number) in the first row.
// returns an object with key "header" = header, "values" = array of values
Chart.processColumn = function(list) {
	var header = "";
	var array = list.asArray();
	if ( !( Chart.isNumber(list.at(1)))) {
		header = list.at(1);
		array = array.slice(2);
	}
	return  {'header': header, 
		     'values': array};
}

/////////////////////////////
/// SCATTERPLOT




reportScatterPlotXlistYlist = function(x_list, y_list) {
	
	var x_col = Chart.processColumn(x_list);
	var y_col = Chart.processColumn(y_list);
	var data = new google.visualization.DataTable();
	var title = null, caption = null;
	var i, n_included, n_ignored, minlen, options, chart, tempx, tempy;
	var x_array = x_col['values'];
	var y_array = y_col['values'];

	data.addColumn('number', x_col['header']);
	data.addColumn('number', y_col['header']);
	
	minlen = Math.min(x_array.length, y_array.length);
	n_included = 0;
	n_ignored = 0;
	for ( i = 0; i < minlen; i++) {
		tempx = parseFloat(x_array[i]);
		tempy = parseFloat(y_array[i]);
		if (tempx == NaN || tempy == NaN) {
			n_ignored++;
		} else {
			data.addRow([tempx, tempy]);
			n_included++;
		}
	}
	
	caption = n_included + " datapoints in graph";
	if (n_ignored != 0) {
		legend += "; " + n_ignored + " datapoints exluded.";
	}
	
	chartid = Chart.newChartDiv(title, caption);
	Chart.Scatterplot.add(data, chartid, x_col['header'], y_col['header']);
	
	return chartid;
}



///////////

Chart.Scatterplot = {};



Chart.Scatterplot.add = function(data, chartid, x_title, y_title) {
	var options;

	options = {
		title: "Chart " + chartid.substring(6),       
		hAxis: {title: x_title},
		vAxis: {title: y_title}
	}
	var c = new google.visualization.ScatterChart(document.getElementById(chartid));
	c.draw(data, options);
}





///////////////////////////////////
/// HISTOGRAM


reportHistogram = function(lst) {
	var id = newChartDiv();

}






////////////

reportBarChart = function(lst) {
	
}
