var app = app || {};

app.utility = app.utility || {};

app.utility.jsonp = function(url, callbackmethod) {
	/**
	 *Create a new _src variable to append the callback param to the url 
	 */
	var _src = url + '&callback=' + callbackmethod;
	
	/**
	 *Create the script element 
	 */
	var _script = document.createElement('script');
	
	/**
	 *Set the source of the script element to be the same as the one specified above 
	 */
	_script.src = _src;
	
	/**
	 *To prevent the script from blocking other requests, load it
	 * asynchronously where possible 
	 */
	_script.async = "async";
	
	/**
	 *Once the script has loaded, the function will execute and the
	 * script tag can be removed from the head of document 
	 */
	_script.onload = _script.onreadystatechange = function(load) {
		var script = document.head.removeChild(load.target);
		script = null;
	}
	
	/**
	 *This privileged method will send the request by appending the script to the DOM 
	 */
	this.send = function() {
		document.head.appendChild(_script);
	}
}
