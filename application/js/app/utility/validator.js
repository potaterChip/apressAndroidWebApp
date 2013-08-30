var app = app || {};
app.utility = app.utility || {};

/**
 *Validator object has static methods
 * to check to easily validate values 
 */

app.utility.validator = {
	
	/**
	 *Checks to see whether a value is empty or not
	 * Returns true if it is, or false if it isn't
	 * @param {String|Object} value
	 * @param {Bool} 
	 */
	isEmpty: function(value) {
		if(value == '' || value == null || value === false) {
			return true;
		}
		return false;
	},
	
	isTypeOf: function(value, type) {
		// First check to see if the type is a string
		if(typeof type == "string") {
			// If it is, we're probably checking against a primitive type
			if(typeof value == type) {
				return true;
			}
		}else {
			//We're dealing with an object comparison
			if(value instanceof type){
				return true;
			}
		}
		
		return false;
	},
	
};
