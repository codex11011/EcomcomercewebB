$(function(){


	//import {Spinner} from 'spin.js';

	var opts = {
	  lines: 13, // The number of lines to draw
	  length: 0, // The length of each line
	  width: 17, // The line thickness
	  radius: 45, // The radius of the inner circle
	  scale: 1, // Scales overall size of the spinner
	  corners: 1, // Corner roundness (0..1)
	  color: '#ffffff', // CSS color or array of colors
	  fadeColor: 'transparent', // CSS color or array of colors
	  speed: 1, // Rounds per second
	  rotate: 0, // The rotation offset
	  animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
	  direction: 1, // 1: clockwise, -1: counterclockwise
	  zIndex: 2e9, // The z-index (defaults to 2000000000)
	  className: 'spinner', // The CSS class to assign to the spinner
	  top: '50%', // Top position relative to parent
	  left: '50%', // Left position relative to parent
	  shadow: '0 0 1px transparent', // Box-shadow for the lines
	  position: 'absolute' // Element positioning
	};

var target = document.getElementById('foo');
var spinner = new Spinner(opts).spin(target);

	$('#search').keyup(function(){

		var search_term = $(this).val();

		$.ajax({
			method:'POST',
			url:'/api/search',
			data:{
				search_term
			},
			dataType:'json',
			success: function(json){
				var data = json.hits.hits.map((hit)=>{
				return hit;
				});
				$('#searchResults').empty();
				for(var i=0;i<data.length;i++){
					var html="";
					html += '<div class="col-md-4">';
					html += '<a href="/product/'+ data[i]._source._id +'">';
					html += '<div class="thumbnail">';
					html += '<img src="'+ data[i]._source.image +'">';
					html += '<div class="caption">'
					html += '<h3>'+ data[i]._source.name +'</h3>';
					html += '<p>'+ data[i]._source.category.name +'</p>';
					html += '<p>$'+ data[i]._source.price +'</p>';
					html += '</div></div></a></div>';

					$('#searchResults').append(html);
				}
			},
			error:function(error){
				console.log(err);
			}
		});
	});


		$(document).on('click','#plus',function(e){
			e.preventDefault();//don't want to referesh the page
			var priceValue = parseFloat($('#priceValue').val());
			var quantity = parseInt($('#quantity').val());

			priceValue += parseFloat($('#priceHidden').val());
			quantity += 1;

			$('#quantity').val(quantity);
			$('#priceValue').val(priceValue.toFixed(2));
			$('#total').html(quantity);
		});


		$(document).on('click','#minus',function(e){
			e.preventDefault();//don't want to referesh the page
			var priceValue = parseFloat($('#priceValue').val());
			var quantity = parseInt($('#quantity').val());
			if(quantity == 1){
				priceValue = $('#priceHidden').val();
				quantity = 1;
			}else{
			priceValue -= parseFloat($('#priceHidden').val());
			quantity -= 1;
			}
			
			$('#quantity').val(quantity);
			$('#priceValue').val(priceValue.toFixed(2));
			$('#total').html(quantity);
		});


// 		function stripeTokenHandler(token) {
// 		  // Insert the token ID into the form so it gets submitted to the server
// 		  var form = document.getElementById('payment-form');
// 		  var hiddenInput = document.createElement('input');
// 		  hiddenInput.setAttribute('type', 'hidden');
// 		  hiddenInput.setAttribute('name', 'stripeToken');
// 		  hiddenInput.setAttribute('value', token.id);
// 		  form.appendChild(hiddenInput);

// 		  // Submit the form
// 		  form.submit();
// 		}

// 		// Create a token or display an error when the form is submitted.
// 		// Create a token or display an error when the form is submitted.
// 		var form1 = document.getElementById('payment-form');
// 		form1.addEventListener('submit', function(event) {
// 		  event.preventDefault();

// 		  stripe.createToken(card).then(function(result) {
// 		    if (result.error) {
// 		      // Inform the customer that there was an error.
// 		      var errorElement = document.getElementById('card-errors');
// 		      errorElement.textContent = result.error.message;
// 		    } else {
// 		      // Send the token to your server.
// 		      stripeTokenHandler(result.token);
// 		    }
// 		  });

// });



});

 

 //ajax is a client side script that communicates from
 //server or a database without the need of a post back
//we don't need to refresh the page to see the changes
//changes occur instantly 