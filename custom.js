(function($) {
	'use strict';
	let vid = document.getElementById("bgvid");

	if(vid) {
		let pauseButton = $("#play-cont button");

		if(window.matchMedia('(prefers-reduced-motion)').matches) {
			vid.removeAttribute("autoplay");
			vid.pause();
			pauseButton.html('Paused');
		}

		function vidFade() {
			vid.classList.add("stopfade");
		}

		vid.addEventListener('ended', function() {
			// only functional if "loop" is removed 
			vid.pause();
			// to capture IE10
			vidFade();
		});

		pauseButton.on("click", function() {
			vid.classList.toggle("stopfade");
			if(vid.paused) {
				vid.play();
				pauseButton.hide();
				$(".frame-bg").hide();
				vid.classList.add("playing");
			} else {
				vid.pause();
				pauseButton.show();
				$(".frame-bg").show();
				vid.classList.remove("playing");
			}
		});
	}

	$('#get-status').on('submit', async function(e){
		e.preventDefault();

		$('#status-result').html('<span>Please wait...</span>');

		const formData = $(this).serializeArray();
		const ind = formData.findIndex((e,i) => e.name === 'address');
		const address = formData[ind].value;

		if(!/^0x[a-fA-F0-9]{40}$/.test(address)) {
			$('#status-result').html('<span class="error">Invalid address.</span>')
			return false;
		}

		let obj = {};
		formData.forEach((arr) => obj[arr.name] = arr.value);

		$('#get-status button, #get-status input').prop('disabled', true);

		try {
			const res = await fetch($(this).attr('action'), {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(obj)
			})

			if(res.status !== 200) throw new Error();

			let decData = await res.json();

			if(decData.status === true) {
				let finalText = '';

				if(decData.message.whitelisted === true) finalText += '<span class="success">This address is whitelisted!</span>';
				else finalText += '<span>This address is not whitelisted.</span>';

				if(
					decData.message.usdt > 0 ||
					decData.message.usdc > 0 ||
					decData.message.busd > 0
				) {
					finalText += '<br/><span>From this address was deposited ';

					let depText = [];
					if(decData.message.usdt > 0) depText.push(`<strong>${decData.message.usdt.toFixed(2)} USDT</strong>`);
					if(decData.message.usdc > 0) depText.push(`<strong>${decData.message.usdc.toFixed(2)} USDC</strong>`);
					if(decData.message.busd > 0) depText.push(`<strong>${decData.message.busd.toFixed(2)} BUSD</strong>`);

					finalText += depText.join(' and ');
					
					finalText += '.</span>'
				}

				$('#status-result').html(finalText);
			} else {
				$('#status-result').html(`<span class="error">${decData.message}</span>`);
			}
		} catch(err) {
			$('#status-result').html('<span class="error">An unexpected error occured. Please try again later.</span>');
		}

		$('#get-status button, #get-status input').prop('disabled', false);
	})

	$('.bxslider').bxSlider({
		auto: false,
		pager: false,
		slideWidth: 280,
		minSlides: 1,
		maxSlides: 4,
		moveSlides: 1,
		slideMargin:10,
		speed: 450,
		mouseDrag: true,
		preloadImages: 'all'
	});

	document.querySelectorAll('a[href^="#"]').forEach(anchor => {
		anchor.addEventListener('click', function (e) {
			e.preventDefault();
			document.querySelector(this.getAttribute('href')).scrollIntoView({
				behavior: 'smooth'
			});
		});
	});
})(jQuery);