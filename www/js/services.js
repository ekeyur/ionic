angular.module('fabular.services', [])
//Factory
.factory('fabularService',function($http){
  var service = {};

  service.getThings = function(category){
    // console.log(category);
    var url = '/things/'+category;
    return $http({
      method : 'GET',
      url : url,
    });
  };
return service;
});
