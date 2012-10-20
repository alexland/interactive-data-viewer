
$(function() {

	var vis = d3.select("#viz"),
		WIDTH = 500,
		HEIGHT = 300,
		MARGINS = {top: 20, right: 30, bottom: 30, left: 30},
		xRange = d3.scale.linear()
			.range ([MARGINS.left, WIDTH - MARGINS.right])
			.domain([100, 250]),
		yRange = d3.scale.linear()
			.range ([HEIGHT - MARGINS.top, MARGINS.bottom])
			.domain([0, 500]),
		xAxis = d3.svg.axis()
			.scale(xRange)
			.tickSize(5)
			.tickSubdivide(true),
		yAxis = d3.svg.axis()
			.scale(yRange)
			.tickSize(7)
			.orient("left")
			.tickSubdivide(true);
		drawingData;


	function init() {
		d3.json("t1.json", function(data) {
			vis.append("svg:g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
			.call(xAxis);
		vis.append("svg:g")
			.attr("class", "y axis")
			.attr("transform", "translate(" + (MARGINS.left) + ",0)")
			.call(yAxis);
		update(data);
		})
	}

	function update(drawingData) {
		var circles = vis.selectAll("circle")
				.data(drawingData, function (d) {
					return d.id;
				}),
			// axes aren't data points,
			// so transition object req to change their values
			transition = vis
				.transition()
				.duration(750)
				.ease("linear");
		// update the domain of the x range
		xRange.domain([
			d3.min (drawingData, function(d) { return d.value1; }),
			d3.max (drawingData, function(d) { return d.value1; })
		]);
		// update the domain of the y range
		yRange.domain([
			d3.min (drawingData, function(d) { return d.value2; }),
			d3.max (drawingData, function(d) { return d.value2; })
		]);
		// transition the axes
		transition.select(".x.axis").call(xAxis);
		transition.select(".y.axis").call(yAxis);
		circles
			.enter()
			.insert("svg:circle")
			.attr("cx", function (d) { return xRange (d.value1); })
			.attr("cy", function (d) { return yRange (d.value2); })
			.style("fill", "red");
		circles
			.transition()
			.duration(750)
			.ease("linear")
			.attr("cx", function (d) { return xRange(d.value1); })
			.attr("cy", function (d) { return yRange(d.value2); })
			.attr("r", function (d) { return d.value3; });
		circles.exit ()
			.transition().duration(750).ease("linear")
			.attr("r", 0)
			.remove ();
	}

	function randData() {
		var n = randRange(2, 6),
			dataset = [];
		for (var i=0; i<n; i++) {
			var data = {
				id: i,
				value1: randRange (1, 10),
				value2: randRange (0, 100),
				value3: randRange (2, 10)
			};
			dataset.push (data);
		}
		return dataset;
	}

	function randRange(min, max) {
		return Math.round (Math.random() * (max - min) + min);
	}

	$("#btn1").on("click", update);

})

