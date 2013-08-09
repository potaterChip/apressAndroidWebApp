var app = app || {};

app.model = app.model || {};

/**
 *A video source used within a video
 * You must add this object to a video once instantiated
 * @param {String} url
 * @param {app.type.format} format 
 */
app.model.videosource = function appModelVideoSource(url, format) {
	
	/**
	 *The video source's instance variables 
	 */
	var _url,
		_format,
		_self = this;
		validator = app.utility.validator;
		
	/**
	 *Set the instance variables using the constructor's arguments 
	 */
	this.init = function() {
		this.setUrl(url);
		this.setFormat(format);
	}
	
		
		/**
	* Getters and setters
	*/
	/**
	* Gets the url of the video source
	* @return {String}
	*/
	this.getUrl = function(){
	return _url;
	}
	/**
	* Sets the url of the video source
	* @param {String} url
	*/
	this.setUrl = function(url){
		// Check to see whether the value is a primitive string type
		if(!validator.isTypeOf(url, "string")){
			throw{
				message: "The url property in the videosource model requires a 'string' type",
				type: "validation_exception"
			}
			return;
		}
		_url = url;
	}
	
	/**
	* Gets the mimetype of the video source
	* @return {app.type.format}
	*/
	this.getFormat = function(){
	return _format;
	}
	
	/**
	* Sets the mimetype of the video source
	* @param {app.type.format} format
	*/
	this.setFormat = function(format){
		// Check to see whether the value is an app.type.format
		if(!validator.isTypeOf(format, app.type.format)){
			throw{
				message: "The format property in the videosource model requires a 'app.type.format' type",
				type: "validation_exception"
			}
			return;
		}
	_format = format;
	}
		
	this.init();
}
