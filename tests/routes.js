var expect = require("expect.js");
var routes = require("./../routes.js");

describe("Routes", function() {

	beforeEach(routes.clear.bind(routes));

	function someHandler() {};
	it("should register static paths", function() {
		routes.addRoute("/static/path", someHandler);  
		var r = routes.getRoute("/static/path");
		expect(r.handler).to.be(someHandler);
	});


	it("should register paths with one parameter", function() {
		routes.addRoute("/parameter/path/:id", someHandler);  
		var r = routes.getRoute("/parameter/path/42");
		expect(r.handler).to.be(someHandler);
	});

	it("should only consider whole paths", function() {
		routes.addRoute("/parameter/path/:id", someHandler);  
		var r = routes.getRoute("/before/parameter/path/42");
		expect(r.handler).to.not.be(someHandler);

		var r = routes.getRoute("/parameter/path/42/after");
		expect(r.handler).to.not.be(someHandler);
	});

	it("should register paths with one parameter not named id", function() {
		routes.addRoute("/parameter/path/:resource", someHandler);  
		var r = routes.getRoute("/parameter/path/42");
		expect(r.handler).to.be(someHandler);
	});

	it("should register paths with two parameters", function() {
		routes.addRoute("/two/:a/parameters/:b/c", someHandler);  
		var r = routes.getRoute("/two/32/parameters/42/c");
		expect(r.handler).to.be(someHandler);
	});

	it("should return captured parameter in path", function() {
		routes.addRoute("/parameter/path/:id", someHandler);  
		var r = routes.getRoute("/parameter/path/42");
		expect(r.handler).to.be(someHandler);
		expect(r.params.id).to.be("42");
	});



});
