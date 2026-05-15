$(function() {

	// Get the form.
	var form = $('#contact-form');

	// Get the messages div.
	var formMessages = $('.form-messege');

	// Set up an event listener for the contact form.
	$(form).submit(function(e) {
		// Stop the browser from submitting the form.
		e.preventDefault();

		// Serialize the form data.
		var formData = $(form).serialize();

		// Submit the form using AJAX.
		$.ajax({
			type: 'POST',
			url: $(form).attr('action'),
			data: formData
		})
		.done(function(response) {
			// response is auto-parsed JSON (Content-Type: application/json)
			$(formMessages).removeClass('error').addClass('success');
			$(formMessages).css({ 'color': '#07BF51', 'margin-top': '12px', 'font-size': '14px' });
			$(formMessages).text(response && response.message ? response.message : 'Your message has been sent successfully.');
			$('#contact-form input,#contact-form textarea').val('');
		})
		.fail(function(data) {
			$(formMessages).removeClass('success').addClass('error');
			$(formMessages).css({ 'color': '#c0392b', 'margin-top': '12px', 'font-size': '14px' });
			var msg = 'Oops! An error occurred. Please call 6380496226 or email kaliammalcollege@gmail.com.';
			if (data.responseJSON && data.responseJSON.message) {
				msg = data.responseJSON.message;
			}
			$(formMessages).text(msg);
		});
	});

});
