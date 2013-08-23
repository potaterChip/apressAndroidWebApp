var app = app || {};

app.controller = app.controller || {};

app.controller.movies = function() {
	var _self = this,
	_searchfield = document.querySelector('#add-movie input[name="query"]'),
	_searchform = document.getElementById('add-movie'),
	_searchresultscard = document.getElementById('card-movie_search_results'),
	_searchTimeout,
	_viewScrolls = [],
	_searchScroll = null;
	
	this.init = function() {}
	
	this.init();
	
	/**
	 * Binds the search form 
	 */
	this.bindSearchForm = function() {
		/**
		 *Here you add an event listener to the search field using
		 * the focus event listener. If there's a value, then show the results 
		 */
		_searchfield.addEventListener('focus', function() {
			if(this.value.length > 0) {
				app.utility.deck.showCard('card-movie_search_results');
			}
		});
		
		_searchform.addEventListener('submit', function(e){
			e.preventDefault();
			
			//Clear the _searchTimeout timeout
			clearTimeout(_searchTimeout);
			
			var value = _searchfield.value;
			
			if(value.length > 0) {
				_self.search(value);
			}
		});
		
		_searchform.addEventListener('input', function(){
			/**
			 * This is the value of the input field 
			 */
			var value = _searchfield.value;
			
			/**
			 * This will clear the search timeout 
			 */
			clearTimeout(_searchTimeout);
			
			/**
			 * You don't want to run search staright after every
			 * key press. This will set a timout of 1 second
			 * (1000 ms) before the search function is called 
			 */
			if(value.length > 0) {
				document.getElementById('taskbar').classList.add('searchactive');
			}else {
				document.getElementById('taskbar').classList.remove('searchactive');
			}
			
			_searchTimeout = setTimeout(function() {
				_self.search(value);
			}, 1000);
		});
	}
	
	this.search = function(query) {
		//Check to see whether the query length is longer than 0 characters
		if(query.length > 0) {
			/*
			 * Encode the query so that it can be passed
			 * Through the URL
			 */
			query = encodeURIComponent(query);
			
			/**
			 * Create a new JSONP request 
			 */
			var jsonp = new app.utility.jsonp(
				'http://api.rottentomatoes.com/api/public/v1.0/movies.json?apikey=gbsqxdbgvjzhmn27x2xbxfa9&q=' + query,
				'app.bootstrap.getController("movies").showSearchResults');
			
			/**
			 * Send the request 
			 */
			jsonp.send();
			
			/**
			 * Add the loading class to the search field 
			 */
			_searchfield.classList.add('loading');
		}
	}
	
	this.showSearchResults = function(rtresults) {
		
		/**
		 * This is the Rotten Tomatoes API data.
		 * The following code will process the data
		 * returned and convert it to models
		 * that the application will understand.
		 * You could wrap these API class into
		 * a separate library, but for now having
		 * them in the controller will suffice 
		 */
		
		// First, create an empty array to hold the results
		var results = [];
		
		// Next, loop through the results from Rotten Tomatoes
		for(var i = 0; i < rtresults.movies.length; i++) {
			var rtmovie = rtresults.movies[i];
			// For every result you create a new movie object
			var title = rtmovie.title || '', 
			rtid = rtmovie.id, 
			posterframe = rtmovie.posters.original || '', 
			synopsis = rtmovie.synopsis || '';
			results.push(new app.model.movie(title, rtid, posterframe, synopsis));
		}
		
		// Create the view using the data
		var view = new app.view.movielist(results);
		
		// Set the contents of the search results div
		_searchresultscard.innerHTML = '';
		_searchresultscard.appendChild(view.render());
		// Controlling page needs to be handled by it's own utility or class
		_searchresultscard.classList.add('active');
		_searchfield.classList.remove('loading');
		results = null;
		
		// Check to see whether the search scroll is null
		if(_searchScroll !== null) {
			// If it isn't, destory it
			try {
			_searchScroll.destroy();
			}catch (err) {};
			_searchScroll = null;
		}
		
		// Initialize the search scroll for the results card
		_searchScroll = new iScroll(_searchresultscard);
	}
	
	this.find = function(data) {
		//Check to see whether the ID exists in the action params/data
		if(typeof data.id === 'undefined'){
			throw "No ID supplied to find action in view controller";
			return;
		}
		
		// Create a new JSONP request
		var jsonp = new app.utility.jsonp(
			'http://api.rottentomatoes.com/api/public/v1.0/movies/' +
			data.id + '.json?apikey=gbsqxdbgvjzhmn27x2xbxfa9','app.bootstrap.getController("movies").view');
			
	 
		//Send the request
		jsonp.send();
	}
	
	this.view = function(rtresult) {
		//Check to see whether an object has been returned
		if(!app.utility.validator.isTypeOf(rtresult, 'object')){
			//If it's not an object, don't show the movie
			return;
		}
		
		//Create a new movie object
		var movie = new app.model.movie(rtresult.title, rtresult.id, rtresult.posters.original, rtresult.synopsis),
		viewcard = document.getElementById('card-movie_info');
		
		/**
		 * Set the DVD and cinema release dates 
		 */
		
		var releaseDate = new app.type.releaseDate( new Date(rtresult.release_dates.theater),
			new Date(rtresult.release_dates.dvd));
		movie.setReleaseDate(releaseDate);
		
		/**
		 * Set the movie's rating 
		 */
		movie.setRating(rtresult.mpaa_rating);
		
		var _favorites = JSON.parse(localStorage.favorites);
		
		for(var i = 0; i < _favorites.length; i++) {
			if(_favorites[i].id == movie.getRtid()) {
				/**
				 *If a match is found, set the 
				 * favorite flag to true 
				 */
				
				movie.setFavorite(true);
			}
		}
		
		/**
		 * Add actors to the movie  
		 */
		for(var i = 0; i < rtresult.abridged_cast.length; i++) {
			var cast = rtresult.abridged_cast[i],
			character = (typeof cast.characters === 'undefined') ? '' : cast.characters[0];
			var actor = new app.model.actor(cast.name, character);
			movie.addActor(actor);
		}
		
		// Create the movie view
		var view = new app.view.movie(movie);
		viewcard.innerHTML = view.render().innerHTML;
		
		// Initalize iScroll
		_viewScrolls.push(new iScroll(viewcard.querySelector('.movie-content'), {vScroll: false, vScrollbar: false}));
		
		[].forEach.call(viewcard.getElementsByClassName('block'), function(el){
			_viewScrolls.push(new iScroll(el, {hScroll: false, hScrollbar: false}));
		});
		
		/**
		 * Add an event listener to the window. If it resizes,
		 * reset the iScroll so that it adjusts to the new size. 
		 */
		
		window.addEventListener('resize', function() {
			setTimeout(function() {
				_searchScroll.refresh();
				
				for(var i = 0; i < _scrolls.length; i++) {
					_viewScrolls[i].refresh();
				}
				
			}, 100);
		});
		
		/**
		 *Hide all of the cards 
		 */
		app.utility.deck.hideAllCards();
		
		/**
		 * Show the movie info card 
		 */
		app.utility.deck.showCard('card-movie_info');
	}
	
	this.init = function() {
		this.bindSearchForm();
	}
	
	this.init();
}
