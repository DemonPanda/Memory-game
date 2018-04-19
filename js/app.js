let symbols = ['diamond', 'diamond', 'car', 'car', 'camera', 'camera', 'rocket', 'rocket', 'money', 'money', 'space-shuttle', 'space-shuttle', 'bomb', 'bomb', 'bicycle', 'bicycle'],
	opened = [],
	match = 0,
	moves = 0,
	currentTimer,
	delay = 400,
	second = 0,
	totalCard = symbols.length / 2,
	threestars = 10,
	twostar = 16,
	onestar = 20,
	$scorePanel = $('#score-panel'),
	$moveNum = $('.moves'),
	$deck = $('.deck'),
	$ratingStars = $('.fa-star'),
	$restart = $('.restart'),
	$timer = $('.timer');


function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

function initGame() {
	var cards = shuffle(symbols);
	$deck.empty();
	match = 0;
	moves = 0;
	$moveNum.text('0');
	$ratingStars.removeClass('fa-star-o').addClass('fa-star');
	for (var i = 0; i < cards.length; i++) {
		$deck.append($('<li class="card"><i class="fa fa-' + cards[i] + '"></i></li>'))
	}
	addCardListener();

	resetTimer(currentTimer);
	second = 0;
	$timer.text(`${second}`)
	initTime();
};


function setRating(moves) {
	var rating = 3;
	if (moves > threestars && moves < twostar) {
		$ratingStars.eq(2).removeClass('fa-star').addClass('fa-star-o');
		rating = 2;
	} else if (moves > twostar && moves < onestar) {
		$ratingStars.eq(1).removeClass('fa-star').addClass('fa-star-o');
		rating = 1;
	} else if (moves > onestar) {
		$ratingStars.eq(0).removeClass('fa-star').addClass('fa-star-o');
		rating = 0;
	}
	return { score: rating };
};

function endGame(moves, score) {
	swal({
  title: 'Sweet! You did it!',
  imageUrl: 'img/nyan-cat.gif',
  imageWidth: 400,
  imageHeight: 200,
  imageAlt: 'Nyan Cat',
  animation: false,
	buttons: true,
	background: '#d3d3d3',
	confirmButtonText: 'Let`s repeat!'
}).then(function (isConfirm) {
		if (isConfirm) {
			initGame();
		}
	})
}

$restart.bind('click', function () {
	swal({
		allowEscapeKey: false,
		allowOutsideClick: false,
		title: 'Are you sure?',
		text: "Your progress will be Lost!",
		imageUrl: 'img/restart.png',
		background: '#d3d3d3',
	  imageWidth: 160,
	  imageHeight: 110,
	  imageAlt: 'Confused smile',
		animation: false,
		showCancelButton: true,
		confirmButtonColor: '#eabd2a',
		cancelButtonColor: '#ff0022',
		cancelButtonText:'Nope',
		confirmButtonText: 'One more time!'
	}).then(function (isConfirm) {
		if (isConfirm) {
			initGame();
		}
	})
});

var addCardListener = function () {

	$deck.find('.card').bind('click', function () {
		var $this = $(this)

		if ($this.hasClass('show') || $this.hasClass('match')) { return true; }

		var card = $this.context.innerHTML;
		$this.addClass('open show');
		opened.push(card);

		if (opened.length > 1) {
			if (card === opened[0]) {
				$deck.find('.open').addClass('match animated infinite rubberBand');
				setTimeout(function () {
					$deck.find('.match').removeClass('open show animated infinite rubberBand');
				}, delay);
				match++;
			} else {
				$deck.find('.open').addClass('notmatch animated infinite wobble');
				setTimeout(function () {
					$deck.find('.open').removeClass('animated infinite wobble');
				}, delay / 1.5);
				setTimeout(function () {
					$deck.find('.open').removeClass('open show notmatch animated infinite wobble');
				}, delay);
			}
			opened = [];
			moves++;
			setRating(moves);
			$moveNum.html(moves);
		}

		if (totalCard === match) {
			setRating(moves);
			var score = setRating(moves).score;
			setTimeout(function () {
				endGame(moves, score);
			}, 500);
		}
	});
};


function initTime() {
	currentTimer = setInterval(function () {
		$timer.text(`${second}`)
		second = second + 1
	}, 1000);
}

function resetTimer(timer) {
	if (timer) {
		clearInterval(timer);
	}
}

initGame();
