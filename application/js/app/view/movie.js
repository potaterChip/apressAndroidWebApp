var app = app || {};
app.view = app.view || {};

/**
 *Creates a new view for a movie list item
 * @param {app.model.movie} movie 
 */

app.view.movie = function(movie) {
	var _rootElement = document.createElement('div');
	_rootElement.innerHTML = [
		'<header class="movie-header">',
		'<img src="', movie.getPosterframe(), '" alt="', movie.getTitle(), '" class="poster" width="100%" />',
		'<hgroup class="movie-title">',
		'<a href="#" class="btn-favorite add" data-controller="favorites" data-action="add" data-params=\'{"id": "', movie.getRtid(), '", "title": "', 
		escape(movie.getTitle()), '", "synopsis": "',
		escape(movie.getSynopsis()),
		'", "posterframe": "', movie.getPosterframe(), '"}\'>favorite</a>',
		'<h2>', movie.getTitle(), '</h2>',
		'<p class="movie-release-date">Cinematic Release -',
			movie.getReleaseDate().getCinema().getDate(), '/',
			movie.getReleaseDate().getCinema().getMonth() + 1, '/',
			movie.getReleaseDate().getCinema().getFullYear(), '</p>',
			'</hgroup>',
			'</header>',
			'<div class="movie-content">',
				'<div class="block-container span-three">',
					'<section class="block" id="block-synopsis">',
						'<div class="content">',
						'<p>', movie.getSynopsis(), '</p>',
						'</div>', 
					'</section>',
					'<section class="block" id="block-cast">',
						'<div class="content">',
							'<h3>Cast List</h3>',
							'<ul class="list scrolling medium"></ul>',
						'</div>',
					'</section>',
					'<section class="block" id="block-video">',
						'<div class="content"',
							'<h3>Video Clips</h3>',
							'<ul class="list grid"></ul>',
						'</div>',
					'</section>',
				'</div>',
			'</div>',
			'<footer class="footer screenbar">',
			'<a class="back" href="/" data-controller="favorites" data-action="list">my favorites</a>',
			'</footer>'
	].join('');
	
	//Check to see whether the movie is in the user's favorites
	if(movie.isFavorite()){
		var _favoriteButton = _rootElement.querySelector('a.btn-favorite');
		_favoriteButton.setAttribute('data-action', 'remove');
		_favoriteButton.classList.remove('add');
		_favoriteButton.classList.add('remove');
		_favoriteButton.textContent = 'un-favorite';
	}
	
	for(var i = 0; i < movie.getActors().length; i++) {
		var actor = movie.getActor(i);
		var element = document.createElement('li');
		element.innerHTML = [
			'<p>', actor.getName(), '<br />',
			'<em>', actor.getRole(), '</em></p>'
		].join('');
		_rootElement.querySelector('#block-cast ul.list').appendChild(element);
	}
	
	this.render = function() {
		return _rootElement;
	}
	
}
