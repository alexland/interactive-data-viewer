
$(function() {
		var ping = new io.connect('http://' + window.location.host);

		// Establish event handlers
		ping.on('disconnect', function() {
			ping.socket.reconnect();
		});

		function getPrintableDate(date) {
		  return date.getFullYear().toString() + '/' +
			 (date.getMonth()+1).toString() + '/' +
			 date.getDate().toString() + ' ' +
			 date.getHours().toString() + ':' +
			 date.getMinutes().toString() + ':' +
			 date.getSeconds().toString() + '.' +
			 date.getMilliseconds().toString();
		}

		function encodeDate(date)
		{
			return [ date.getHours(),
					  date.getMinutes(),
					  date.getSeconds(),
					  date.getMilliseconds()
			];
		}

		function decodeDate(data)
		{
			var date = new Date();
			return new Date(date.getFullYear(), date.getMonth(), date.getDate(),
							data[0], data[1], data[2], data[3]);
		}
		ping.on('connect', function() {
		  function sendPing()
		  {
			  ping.emit('ping', encodeDate(new Date()), function(clientDate, serverDate) {
				var client = decodeDate(clientDate);
				var server = decodeDate(serverDate);
				var now = new Date();

				$('#ping').html('Ping: ' + (now.getTime() - client.getTime()).toString() + ' ms.<br/>' +
								'C2S: ' + (server.getTime() - client.getTime()).toString() + ' ms.<br/>'
								);

				setTimeout(sendPing, 250);
			  });
		  }
		  sendPing();
		});
	});