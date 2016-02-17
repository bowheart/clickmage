$(function() {
	var propagating = false;
	$('.game-tab-content').on('click', '.panel-heading', function(event) {
		if (!$(event.target).is($(this).find('a'))) $(this).find('a').click();
	});
	
	
	window.app.keyRows = [
		[49, 50, 51, 52, 53, 54, 55, 56, 57, 48], // 1 - 0
		[113, 119, 101, 114, 116, 121, 117, 105, 111, 112], // q - p
		[97, 115, 100, 102, 103, 104, 106, 107, 108, 59], // a - ;
		[122, 120, 99, 118, 98, 110, 109, 44, 46, 47] // z - /
	];
	$(document).keypress(function(event) {
		var key = event.which;
		$('.hotkey-' + key + ':visible').click();
	});
});


(function() {
	var close = function() {
		this.animate({ marginTop: '-72px', opacity: 0 }, function() {
			$(this).remove();
		});
	}
	
	window.alert = function(type, text) {
		var el = $('<div class="alert alert-' + type + '">' + text + '<button class="close">&times;</button></div>');
		$('#alerts').append(el);
		el.animate({ marginTop: 0, opacity: 1 });
		
		el.find('.close').click(close.bind(el));
		
		window.setTimeout(function() {
			close.call(el);
		}, 5000);
	};
})();
