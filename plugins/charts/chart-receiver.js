////////////////////////////////
// SETUP


var ChartUtil = {};

ChartUtil.is_google_loaded = false;	

ChartUtil.registerInit = function() {
		// probably should do something here -- this is triggered when charts can be drawn
		ChartUtil.is_google_loaded = true;
		}

ChartUtil.isInitialized = function() {
		return ChartUtil.is_google_loaded;
	}


// this gets called multiple times.  OK?
ChartUtil.initialize = function() {
	// Load the Visualization API
	google.load('visualization', '1.0', {
		'packages' : ['corechart']
	});

	google.setOnLoadCallback(ChartUtil.registerInit);
	
}

// lets do this
ChartUtil.initialize();





//I gave in and made this global...  I was raised wrong, maybe.  but, f javascript oop
// evilly referenced in Charts.call_when_initialized() right now
ChartUtil.next_chart_id = 1;
var getNextChartId = function() {
	return ("Chart_" + (ChartUtil.next_chart_id)++);
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
//  CHART


//f javascript stupid closures inheritance stupid oop language stupid
var ChartType = function(type) {

		/// each charttype
		if (type) {
			this.chart_type = type;
		} else {
			this.chart_type = "Unknown";
		}

	};


//////////////
// All charts: this prototype, dude

// DEFAULT options for all charts
ChartType.prototype.options = {
	legend : 'none'
};



// attempting to cascade option defaults at each 'class'.  this is wack.
//   so, all charts have legend:none; all scatterplots add X,Y; individual charts add Z.
ChartType.prototype.getOptions = function() {
	var opt = {}, ret = {}, att;
	if ( typeof this.options !== 'undefined') {
		opt = this.options;
	}
	if ( typeof this.__proto__ !== 'undefined' && typeof this.__proto__.getOptions === 'function') {
		// prototype has options to get, need shallow merge with override to local stuff
		var parentopt = this.__proto__.getOptions();
		// merged all parent stuff, eh?
		for (att in parentopt) {
			ret[att] = parentopt[att];
		}
	}
	for (att in opt) {
		ret[att] = opt[att];
	}
	return ret;
}


// adds option to *instance*
ChartType.prototype.addOption = function(key, value) {
	if (this.options == undefined) {
		this.options = {};
	}
	this.options[key] = value;
	// why not
	return this.getOptions();
}


// once there was a local getNextChartId.

ChartType.prototype.getChartId = function() {
	// all charts need a chartid field, yo.
	return this.chartid;
}


ChartType.prototype.makeChartDiv = function(title, caption) {
	var title_div = "";
	var caption_div = "";
	var anchor;
	var chart_div;

	anchor = '<a href="#' + this.getChartId() + '"></a> '
	if (title) {
		title_div = ' <div class="title">' + title + '</div> ';
	}
	if (caption) {
		caption_div = ' <div class="caption">' + caption + '</div> ';
	}
	chart_div = '<div class="chart-wrapper"> ' + anchor + title_div + '<div id="' + this.getChartId() + '" class="chart"></div> ' + caption_div + ' </div>';
	document.getElementById('chart-container').innerHTML = document.getElementById('chart-container').innerHTML + chart_div;
}


ChartType.prototype.scrollTo = function() {
	// someday
}


// takes a List object with, potentially, a header (non number) in the first row.
// returns an object with key "header" = header, "values" = array of values
ChartType.prototype.processColumn = function(list) {
	var header = "";
	var array = list.asArray();
	if (!( this.isNumber(list.at(1)))) {
		header = list.at(1);
		array = array.slice(1);
	}
	return {
		'header' : header,
		'values' : array
	};
}


// from http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric
ChartType.prototype.isNumber = function(n) {
	return (!isNaN(parseFloat(n)) && isFinite(n) );
}


//// g_chart
// unused?


ChartType.prototype.g_chart = undefined;

ChartType.prototype.setGChart = function(g_chart) {
	this.g_chart = g_chart;
}

ChartType.prototype.getGChart = function() {
	if (this.g_chart === undefined || this.g_chart === null) {
		throw Error("uh oh: google chart hasn't been made yet");
	}
	return this.g_chart;
}



//////

// also scrolls to anchor div
ChartType.prototype.draw = function() {
	var opts = this.getOptions();
	window.location.hash = '#' + this.getChartId();
	if (this.g_datatable !== undefined && this.g_chart !== undefined) {
		this.g_chart.draw(this.g_datatable, opts);
	}
}







/////////////////////////////
/////////////////////////////
/// SCATTERPLOT


reportScatterPlotXlistYlist = function(x_list, y_list) {
	var sp = new Scatterplot(x_list, y_list);
	return sp.getChartId();
}





function Scatterplot(x_list, y_list) {

	this.chartid = getNextChartId();

	// these are objects with 'header' and 'values' fields
	this.x_col = this.processColumn(x_list);
	this.y_col = this.processColumn(y_list);

	this.g_datatable = this.makeGDataTable();

	this.caption = this.getCaption();
	this.options = this.getInitialOptions();
	this.chartDiv = this.makeChartDiv(null, this.caption);

	this.g_chart = null;   // do I need this?  huh?
	this.setGChart(new google.visualization.ScatterChart(document.getElementById(this.chartid)) );
	this.draw();
};


//////////
/// All scatterplot stuff (prototype, you classic oop fool)
Scatterplot.prototype = new ChartType('Scatterplot');


// default options for all scatterplots
Scatterplot.prototype.options = {};


// embrace the ugliness.
Scatterplot.prototype.makeGDataTable = function() {
	var g_datatable = new google.visualization.DataTable();
	var x_array = this.x_col['values'];
	var y_array = this.y_col['values'];
	var minlen = 0, tempx, tempy, i;

	g_datatable.addColumn('number', this.x_col['header']);
	g_datatable.addColumn('number', this.y_col['header']);

	minlen = Math.min(x_array.length, y_array.length);
	// add rows to dataTable
	for ( i = 0; i < minlen; i++) {
		tempx = parseFloat(x_array[i]);
		tempy = parseFloat(y_array[i]);
		if (tempx == NaN || tempy == NaN) {
		} else {
			g_datatable.addRow([tempx, tempy]);
		}
	}

	return g_datatable;
}


Scatterplot.prototype.getCaption = function() {
	var n = this.g_datatable.getNumberOfRows();
	var max = Math.max(this.x_col['values'].length, this.y_col['values'].length);

	return ("<div>(" + n + " datapoints in graph; " + (max - n) + " datapoints exluded. )</div>");
}


Scatterplot.prototype.getInitialOptions = function() {
	// will these be set in the prototype?  hope not
	var opt = {};
	opt['title'] = "Chart " + this.chartid.substring(6);  // ha
	opt['hAxis'] = {title: this.x_col['header']};
	opt['vAxis'] = {title: this.y_col['header']};
	
	return opt;
}







///////////////////////////////////
/// HISTOGRAM

reportHistogram = function(list) {
	var h = new Histogram(list);
	return h.getChartId();
}



function Histogram(list) {

	this.chartid = getNextChartId();

	// these are objects with 'header' and 'values' fields
	this.col = this.processColumn(list);

	this.n_excluded = 0;
	this.n_included = 0;
	this.g_datatable = this.makeGDataTable();

	this.caption = this.getCaption();
	this.options = this.getInitialOptions();
	this.chartDiv = this.makeChartDiv(null, this.caption);

	this.g_chart = null;   // do I need this?  huh?
	this.setGChart(new google.visualization.ColumnChart(document.getElementById(this.chartid)) );
	this.draw();
};


//////////
/// 
Histogram.prototype = new ChartType('Histogram');


// default options for all histograms
Histogram.prototype.options = {};


// this sucks
Histogram.prototype.makeGDataTable = function() {
	var g_datatable = new google.visualization.DataTable();
	var arr = this.col['values'];
	var binranges = [];
	var bincounts = [];
	var i, temp, n_included=0, n_excluded=0;

	g_datatable.addColumn('string', 'Values');
	g_datatable.addColumn('number', this.col['header']);
	
	// get a copy, parse as numbers, remove non-numbers
	var sorted = [];
	for (i=0; i<arr.length;i++) {
		temp = parseFloat(arr[i]);
		if (temp == NaN) {
			n_excluded++;
		} else {
			sorted.push(temp);
			n_included++;
		}
	}
	this.n_included = n_included;
	this.n_excluded = n_excluded;
	
	// get bins, using freedman / diaconis -- bin size = 2 * iqr * n^-1/3
	// need to do some intelligent rounding, damnit!!
	sorted.sort(function(a,b) {return a-b});  // sort ascending
	var mid_index = ((sorted.length / 2) - 0.5);
	var q1_index = mid_index/2;
	var q3_index = mid_index + q1_index;
	var iqr = this.get_indexed_value(sorted, q3_index) - this.get_indexed_value(sorted, q1_index) ;
	var binwidth = (2 * iqr * Math.pow(arr.length, (-1/3)));
	//binwidth = Math.floor(binwidth) + 1;  // bad for small numbers!
	var range = (sorted[sorted.length - 1] - sorted[0]);
	var numbins = (Math.floor(range/binwidth) + 1);
	if (numbins < 3) {numbins = 3};  // just to keep sane, not that I don't trust dr's freedman or diaconis
	var binrange = numbins * binwidth;
	var overlap = binrange - range;
	var left = sorted[0] - (overlap/2);
	for (i=0; i<numbins; i++) {
		binranges[i] = left + (i * binwidth);
		bincounts[i] = 0;
	}
	// add an extra binrange, to ensure we will catch everything...
	binrange[numbins] = Number.MAX_VALUE;
		
	// get the counts	
	var bin_index = 0;
	for (i=0; i<sorted.length; i++) {
		while (sorted[i] >= binranges[bin_index+1]) {
			// might need to skip a bin, so need a while loop
			bin_index++;
		}
		bincounts[bin_index] = bincounts[bin_index] + 1;
	}
 	
	for (i=0; i<numbins; i++) {
		g_datatable.addRow([ "[ " + binranges[i] + " -- " + (binranges[i] + binwidth) + " )", bincounts[i]]);
	}
	
	return g_datatable;
}


// gets possibly interpolated value for possibly non-integer indexes.
// index must be in range, yo
Histogram.prototype.get_indexed_value = function(arr, ind) {
	if (Math.floor(ind) == ind) {
		// integer index, woot
		return arr[Math.floor(ind)];
	} else {
		var decimal = ind - Math.floor(ind);
		return ((arr[Math.floor(ind)] * decimal) + 
				(arr[Math.floor(ind) + 1] * (1 - decimal) ));
	}
}



Histogram.prototype.getCaption = function() {
	return ("<div>(" + this.n_included + " datapoints in graph; " + this.n_excluded + " datapoints exluded. )</div>");
}


Histogram.prototype.getInitialOptions = function() {
	// will these be set in the prototype?  hope not
	var opt = {};
	opt['title'] = "Chart " + this.chartid.substring(6);  // no ha
	opt['hAxis'] = {title: this.col['header']};
	opt['bar'] = {groupWidth: '99%' };

	return opt;
}



////////////

// takes a list of lists, obviously.
reportBarChart = function(lol) {
	var bc = new BarChart(lol);
	return bc.getChartId();
}



function BarChart(lol) {
	var i;

	this.chartid = getNextChartId();

	// get array of columns
	var cs = lol.asArray();
	for (i = 0; i<cs.length; i++) {
		cs[i] = this.processColumn(cs[i]);
	}
	this.cols_array = cs;
	
	throw Error("Bar Chart not yet implemented");  // need to test first!

	this.n_excluded = 0;
	this.n_included = 0;
	this.g_datatable = this.makeGDataTable();

	//this.caption = this.getCaption();
	//this.options = this.getInitialOptions();
	//this.chartDiv = this.makeChartDiv(null, this.caption);

	//this.g_chart = null;   // do I need this?  huh?
	//this.setGChart(new google.visualization.ColumnChart(document.getElementById(this.chartid)) );
	//this.draw();
};


BarChart.prototype.makeGDataTable = function() {
	var g_datatable = new google.visualization.DataTable();
	var arrs = [];  // array of data arrays (['values'] from columns)
	var cats = [];   // categories -- unique values or a bar
	var cnts = {};   // category (key) : array of counts for each data_array (value)
	var i, r, c, temp_arr, temp_val;
	var maxlen = 0;
	
	// set up arrs, determine maxlen
	// WAIT -- SHOULD WE ACCEPT ALL VALUES FROM COLUMS, OR
    //  DO ROW-WISE MISSING DATA??
	for (c=0; c<this.cols_array.length; c++) {
		arrs[c] = this.cols_array[c]['values'];
		if (arrs[c].length > maxlen) {
			maxlen = arrs[c].length;
		}
	}
	
	
	// do a row at a time 
	for (r=0; r<maxlen; r++) {
		// and look at each column in this row
		for (c=0; c<arrs.length; c++) {
			if (r < arr[c].length) {
				// ok, this data array has a value to check
				if (cats.contains(arr[c][r])) {
					// we've seen a similar value before; so, add 1 to the right location in cnts
					temp_arr = cnts[arr[c][r]];
					temp_val = temp_arr[c];
					temp_arr[c] = temp_val + 1;
				} else {
					// never see this value, new category needed
					cats.push(arr[c][r]);
					cnts[arr[c][r]] = new Array();
					temp_arr = cnts[arr[c][r]];
					for (i=0; i<this.cols_array.length; i++) {
						// pre-populate this cnts array with 0s... makes me feel better
						temp_arr[i] = 0;
					}
				}
			}
		}
	} // that was fun
	
	// build the Data table
	var row, cat, col;
	// add the column 
	row = new Array();
	row[0] = "Categories";  // ? better name here?
	for (c=0; c<arrs.length; c++) {
		col = this.cols_array[c];
		row[c+1] = col['header'];
	}
	g_datatable.addRow(row);
	// add the counts
	for (i=0; i< cats.length; i++) {
		// cats[i] = category
		row = new Array(); // data table row - header + counts for each category
		cat = cats[i];  // the category
		row.push(cat);  
		temp_arr = cnts[cat];
		for (c=0; c<arrs.length; c++) {
			row[c+1] = temp_arr[c];
		}
		g_datatable.addRow(row);
	}
	
	// well, there are no bugs in *that*.
}



//////////
/// 
BarChart.prototype = new ChartType('BarChart');
