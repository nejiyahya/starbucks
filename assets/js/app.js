// Make sure jQuery has been loaded
if (typeof jQuery === 'undefined') {

  throw new Error('requires jQuery')

}

(function($) {

	//_____________ HAMBURGER
	$('#hamburgerClick').click(function(e) {
		/* Act on the event */
		e.preventDefault();
		$(this).toggleClass('show');
		$('.menu #menuComponent').slideToggle();
	});

	//_____________ SLICK LIST
	$('.slick-list').addClass('u-animate u-zoom--in u-delay--half');

})(jQuery);