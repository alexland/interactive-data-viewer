
 $(function() {

	var stats = new io.connect('http://' + window.location.host);
		// establish event handlers
		stats.on('disconnect', function() {
			stats.socket.reconnect();
		});
		var plotted_metrics = [
			"active sessions",
			"active_connections",
			"connections/sec",
			"packets sent/sec",
			"packets received/sec"
		];
		var data = [],
			totalPoints = 100;
		for (var i = 0; i < totalPoints; ++i) {
			item = {};
			for (var j = 0; j < plotted_metrics.length; ++j)
			item[plotted_metrics[j]] = 0;
			data.push(item);
		}
		function appendData(values) {
			if (data.length >= totalPoints)
				data = data.slice(1);
				data.push(values);
		}
		function convertValues(name) {
			var res = [];
			for (var i = 0; i < data.length; ++i)
			{
			res.push([i, data[i][name]]);
			}
			return res;
		}
		function prepData() {
			var res = [];
			for (var i in plotted_metrics) {
				var name = plotted_metrics[i];
				res.push({
					label: name,
					data: convertValues(name)
				});
			}
			return res;
		}
		function queryStats() {
			stats.emit('stats', function(data) {
				appendData(data);
				plot.setData(prepData());
				plot.draw();
				// update table
				var placeholder = $('#metrics-table');
				placeholder.empty();
				var table = $('<metrics-table/>');
				for (var i in data) {
					var item = data[i];
					$('<tr/>')
					.append($('<td/>').text(i))
					.append($('<td/>').text(item))
					.appendTo(placeholder);
				}
				table.appendTo(placeholder);
			});
			setTimeout(queryStats, 500);
		}
		var options = {
			series: { shadowSize: 0 },
			yaxis: { min: 0, max: 30 },
			xaxis: { show: true },
			colors: ["#5D8AA8", "#3B7A57", "#CC5500", "#C41E3A",
						"#FFA700", "#00008B"],
			legend: {
				labelBoxBorderColor: null
			}
		};
		//var plot = $.plot($('#placeholder'), [], options);
		var plot = $.plot("#plot-window-1", prepData(), options);
		queryStats();
	});