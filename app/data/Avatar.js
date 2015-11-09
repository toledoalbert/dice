// we isolate our data module so we can reuse them independently
angular.module('hunews.models.User', ['parse-angular.enhance'])
.run(function() {

	// --------------------------
	// Article Object Definition
	// --------------------------

	// Under the hood, everytime you fetch a Article object from Parse,
	// the SDK will natively use this extended class, so you don't have to 
	// worry about objects instantiation if you fetch them from a Parse query for instance

	var User = Parse.Object.extend({
		className:"User",
		// Extend the object with getter and setters  (see parse-angular-patch GitHub repo)
		attrs: ["title", "content", "image", "user", "objectId", "visible"]
	});

});