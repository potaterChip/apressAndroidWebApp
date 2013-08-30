var app = app || {};

app.controller = app.controller || {};

app.controller.favorites = function() {
	var _listScroll = null;
	this.init = function() {}
	
	this.list = function() {
		// Get the favorites from local storage
		var _favorites = JSON.parse(localStorage.favorites),
		// Create an empty movies variable
		_movies = [],
		// Get the favoritesList card from the DOM
		_favoriteslist = document.getElementById('card-favorite_list');
		/**
		 * Loop through each of the favorites backward
		 * to ensure that the most recent favorite
		 * is displayed at the top of the list 
		 */
		
		for(var i = _favorites.length; i > 0; i--) {
			var _favorite = _favorites[i - 1];
			
			// Push the movie model to the movies array
			
			_movies.push(new app.model.movie(unescape(_favorite.title),
				_favorite.id, _favorite.posterframe, unescape(_favorite.synopsis)))
		}
		
		/**
		 *Create a new movielist view with the _movies model 
		 */
		var view = new app.view.movielist(_movies);
		
		//Set the contents of the search results div
		_favoriteslist.innerHTML = '';
		
		// Append the view to the favorites list
		_favoriteslist.appendChild(view.render());
		
		//Destroy the listScroll if it exists
		if(_listScroll !== null) {
			_listScroll.destroy();
			_listScroll = null;
		}
		
		// Create a new one
		_listScroll = new iScroll(_favoriteslist);
		
		//Hide all the cards
		app.utility.deck.hideAllCards();
		//Show only the favorites card
		app.utility.deck.showCard('card-favorite_list');
	}
	
	this.add = function(data) {
		//Get the movie data
		var _movie = data;
		//Load the favorites from the localStorage
		var _favorites = JSON.parse(localStorage.favorites);
		
		/**
		 * Check to see whether the movie is already in the user's favorites 
		 */
		for(var i = 0; i < favorites.length; i++) {
			if(_favorites[i].id == _movie.id) {
				return;
			}
		}
		
		/**
		 * Change the button's attributes 
		 */
		if(this.nodeName == 'A'){
			this.setAttribute('data-action', 'remove');
			this.classList.remove('add');
			this.classList.add('remove');
			this.textContent = 'un-favorites';
		}
		
		//Push the movie to the favorites array
		_favorites.push(_movie);
		
		//Save it back to localStorage
		localStorage.favorites = JSON.stringify(_favorites);
	}
	
	this.remove = function(data) {
		//Get the ID of the favorites to remove
		var _id = data.id;
		// Get the user's favorites from localStorage
		var _favorites = JSON.parse(localStorage.favorites);
		
		//Loop through the favorites
		for(var i = 0; i < _favorites.length; i++) {
			// If there's a match
			if(_favorites[i].id == id) {
				//Remove the item from teh favorites using splice
				_favorites.splice(i, 1);
			}
		}
		
		// Save the changed favorites object back to localStorage
		localStorage.favorites = JSON.stringify(_favorites);
		
		/**
		 * Change the add/remove favorites button
		 * so that it will either add/remove the item
		 * from the favorites 
		 */
		if(this.nodeName == 'A') {
			this.setAttribute('data-action', 'add');
			this.classList.remove('remove');
			this.classList.add('add');
			this.textContent = 'favorites';
		}
	}
	
	this.init();
}
