var app = app || {};

app.bootstrap = (function() {
	/**
	 *Create the controller object 
	 * You explicitly declare the movies and favorites
	 * controllers 
	 */
	var _controller = {
		movies: null, 
		favorites: null
	}
	
	/**
	 *Add a click event listener over the entire document
	 * It will delegate clicks for controllers to the
	 * controller and action 
	 */
	document.addEventListener("click", function(event){
		var target = event.target;
		
		/**
		 *Crawl up the DOM tree from the target element until 
		 * the link surrounding the target element is found 
		 */
		while(target.nodeName !== "A" && target.getAttribute('data-controller') == null && target.getAttribute('data-auction') == null) {
			// We've reached the body element break!
			if(target.parentNode.nodeName == 'HTML') {
				target = null;
				break;
			}
			
			target = target.parentNode;
		}
		
		
		/**
		 *If there's a target, then process the link auction 
		 */
		if(target) {
			/**
			 *You have the target link, so it makes sense to prevent the
			 * link from following through now
			 * This will allow any JavaScript to fail silently 
			 */
			event.preventDefault();
			//Get the controller, action, and params from the element
			var controller = target.getAttribute('data-controller'),
			action = target.getAttribute('data-action'),
			params = target.getAttribute('data-params');
			
			/**
			 *Check to see whether the controller exists in 
			 * the bottstrap and the action is available 
			 */
			if(typeof _controller[controller] === 'undefined' || typeof _controller[controller][action] === 'undefined'){
				//If they don't exist, throw an exception
				throw "Action " + action + "for controller " + controller + " doesn't appear to exist";
				return;
			}
			
			if(params) {
				try{
					//parse as JSON
					params = JSON.parse(params);
				}catch(e) {
					/*
					 * If there's a parsing exception, set the
					 * params to be null
					 */
					params = null;
					return;
				}
			}
			
			_controller[controller][action].call(target, params);
			
		}
	});
	

	if (!localStorage.getItem('favorites')) {
		//if it doesn't, create an empty array and assign it to the storage
		var favorites = [];
		localStorage.favorites = JSON.stringify(favorites);
	}

	return {
		/**
		 *Create an accessor for the controller
		 * which accepts a string representation of the
		 * controller's namespace 
		 */
		
		getController: function(name) {
			
			/**
			 *Split the string into an array using the.
			 * character to separate the string 
			 */
			
			var parts = name.split('.');
			
			/**
			 *Initially set the returned controller to null
			 *  
			 */
			var returnController = null;
			
			/**
			 *If the number of parts is greater than 0 
			 */
			if(parts.length > 0) {
				/**
				 *Set the return the controller to the parent object 
				 */ 
				 returnController = _controller;
				 /**
				  *Loop through each part, gradually assiging the 
				  * action to the return controller 
				  */
				 for(var i = 0; i < parts.length; i++) {
				 	returnController = returnController[parts[i]];
				 }
			}
			
			/**
			 *Return the controller 
			 */
			return returnController;
		},
		
		/**
		 *Initializes all of the controllers. You might not want to do this
		 * automatically, so you can use the initScripts method to execute it. 
		 */
		initScripts: function() {
			_controller.movies = new app.controller.movies();
			_controller.favorites = new app.controller.favorites();
			_controller.favorites.list();
		}
	}
})();
