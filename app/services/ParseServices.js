angular.module('ParseServices', [])
.factory('ParseSDK', function() {

  // pro-tip: swap these keys out for PROD keys automatically on deploy using grunt-replace
  Parse.initialize("PgiXb5njv7cEQmx3VpfHW5q7bZ8Ix55cLJv6ea0E", "6ZvwPAvcFFTKmRhSVJZsaMomBLZDVP37NLOf01tw"); 

});