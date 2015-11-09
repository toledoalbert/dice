// we isolate our data module so we can reuse them independently
angular.module('dice.models.Questions', ['parse-angular.enhance'])
.run(function() {

	// --------------------------
	// Article Object Definition
	// --------------------------

	// Under the hood, everytime you fetch a Article object from Parse,
	// the SDK will natively use this extended class, so you don't have to 
	// worry about objects instantiation if you fetch them from a Parse query for instance

	var Questions = Parse.Object.extend({
		className:"Questions",
		// Extend the object with getter and setters  (see parse-angular-patch GitHub repo)
		attrs: ["course", "week", "type", "choices", "answer", "hint", "points", "body"]
	});

});