//////////////////////
// chart container

// maybe namespace should be in Plugin, rather than inheritance?  Or both?

function Charts() {};
Charts.prototype = new Plugin('charts');





////////////
// 

Charts.win = undefined;

Charts.newContainer = function() {
	var temp;
	var url = window.location.href;
	if (( temp = url.indexOf("#")) != -1) {
		// got some weird load fragment, as snap often does!
		url = url.slice(0, temp);
	}
	if (( temp = url.indexOf("?")) != -1) {
		url = url.slice(0, temp);
	}
	url = url.slice(0, url.lastIndexOf("/")) + "/plugins/charts/chart-container.html";
	this.win = window.open(url, "_blank");
}

// shows the chart container
Charts.showContainer = function() {
	// probably should save all the graphs, so can rebuild the page if necessary?
	if (this.win === undefined) {
		// first time
		this.newContainer();
	} else if ( ! this.win.Window) {
		// it got closed
		this.newContainer();
		//load up earlier graphs?
	}
	//this.tab.scrollDown();
	this.win.focus();
}

// TODO returns what callback returns, yo.  Which can't work with setTimeout...
//  we need to do this the snap way, eventually.
Charts.call_when_initialized = function(callback) {
	// invoke callback when google has loaded is true;
	if (Charts.win) {
		//Charts.win.ChartUtil.initialize();
		if (Charts.win.ChartUtil.isInitialized()) {
			return callback.call();
		} else {
			// google hasn't loaded yet, unfortunately
			setTimeout(function() {Charts.call_when_initialized(callback)}, 50);
			// so, what to return?  eh, best guess.  fix this at some point
			return ("Chart_" + Charts.win.ChartUtil.next_chart_id);
		}
	} else {
		// this shouldn't ever happen, if showContainer() was call first 
		throw Error ("Please try again; the Chart window hasn't loaded yet'.'")
	}
}


Charts.getChartObj = function(chartid) {
	// check if valid id, etc..
	if (Charts.win) {
		//someday
		return null;
	}
	throw Error ("Invalid chart reference: " + chartid);
}



////////////
// actual charts


Charts.reportScatterPlotXlistYlist = function(x_list, y_list) {
	var callback = function() {
		return Charts.win.reportScatterPlotXlistYlist(x_list, y_list);
	}
	
	Charts.showContainer();
	return Charts.call_when_initialized(callback);
}


Charts.reportHistogram = function(list) {
	var invoke_f = function() {
		return Charts.win.reportHistogram(list);
	}
	Charts.showContainer();
	return Charts.call_when_initialized(invoke_f);
}



Charts.reportBarChart = function(lol) {
	var invoke_f = function() {
		return Charts.win.reportBarChart(lol);
	}
	Charts.showContainer();
	var chartid = Charts.call_when_initialized(invoke_f);
}



//////



Charts.doAddChartsOption = function(chartid, key, value) {
	// will throw error if invalid chartid
	Charts.getChartObj(chartid);

	throw Error("Add charts option not yet implemented");
}


Charts.doDrawChart = function(chartid) {
	// will throw error if invalid chartid
	Charts.getChartObj(chartid);
	Charts.showContainer();
	
	throw Error("Draw not yet implemented");
}







///////////////
// would be in threads.js -- to be removed when these are custom blocks
//   hitting JSApply

Process.prototype.reportScatterPlotXlistYlist = function(x_list, y_list) {
	return Charts.reportScatterPlotXlistYlist(x_list, y_list);
}

Process.prototype.reportHistogram = function(list) {
	return Charts.reportHistogram(list);
}

Process.prototype.reportBarChart = function(lol) {
	return Charts.reportBarChart(lol);
}

Process.prototype.doAddChartOption = function(chartid, key, value) {
	Charts.doAddChartOption(chartid, key, value)
}

Process.prototype.doDrawChart = function(chartid) {
	Charts.doDrawChart(chartid);
}




