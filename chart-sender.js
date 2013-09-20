// cheap thing to help write blocks quickly
// would normally be in threads.js, eh.
Process.prototype.doJSEval = function(string) {
	var str = (string || '').toString(), ret;
	try {
		ret = eval(str);
	} catch (err) {
		ret = err.toString();
	}
	return ret;
}




//////////////////////
// chart container


function CC() {
	this.win;
};


CC.newContainer = function() {
	var temp;
	var url = window.location.href;
	if (( temp = url.indexOf("#")) != -1) {
		// got some weird load fragment, as snap often does!
		url = url.slice(0, temp);
	}
	if (( temp = url.indexOf("?")) != -1) {
		url = url.slice(0, temp);
	}
	url = url.slice(0, url.lastIndexOf("/")) + "/chart-container.html";
	CC.win = window.open(url, "_blank");
}


CC.show = function() {
	// probably should save all the graphs, so can rebuild the page if necessary?
	if (CC.win === undefined) {
		// first time
		CC.newContainer();
	} else if (!CC.win.window) {
		// it got closed
		CC.newContainer();
		//load up earlier graphs?
	}
	//CC.tab.scrollDown();
	CC.win.focus();
}



////////////
// Scatterplot

CC.addScatterPlot_matix_xind_yind = function(matrix, x_index, y_index, x_name, y_name) {
	CC.show();
	CC.win.addScattPlot_matrix_xind_ying(matrix, x_index, y_index, x_name, y_name);
}


CC.addScatterPlot_xlist_ylist = function(x_list, y_list) {
	CC.show();
	CC.win.addScatterPlot_xlist_ylist(x_list, y_list);
}

/////////////
// Histogram