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


Charts.addOption = function(chartid, key, value) {
	alert('addOption ' + chartid + " key " + key + " value " + value);	 
}


Charts.drawChart = function(chartid) {
	alert('drawchart ' + chartid);
}



///////////////
// from threads.js -- to be removed when these are custom blocks
//   hitting JSApply

Process.prototype.reportScatterPlotXlistYlist = function(x_list, y_list) {
	var chartid;
	Charts.showContainer();
	chartid = Charts.win.reportScatterPlotXlistYlist(x_list, y_list);
	return chartid;
}

Process.prototype.reportHistogram = function(list) {
	Charts.showContainer();
	var chartid = Charts.win.addHistogram(list);
	return chartid;
}

Process.prototype.reportBarChart = function(list) {
	Charts.showContainer();
	var chartid = Charts.win.addBarChart(list);
	return chartid;
}

Process.prototype.doAddChartOption = function(chartid, key, value) {
	Charts.addOption(chartid, key, value)
}

Process.prototype.doDrawChart = function(chartid) {
	Charts.drawChart(chartid);
}






////////////
// actual charts


Charts.reportScatterPlotXlistYlist = function(x_list, y_list) {
	Charts.showContainer();
	Charts.win.reportScatterPlotXlistYlist(x_list, y_list);
}


Charts.reportHistogram = function(list) {
	Charts.showContainer();
	Charts.win.addHistogram(list, title);
}



Charts.reportBarChart = function(list) {
	Charts.showContainer();
	Charts.win.addHistogram(list, title);
}

