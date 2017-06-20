var app = angular.module("wikiApp", []);

app.controller("wikiController", ["$scope", "searchResults", function($scope, searchResults) {
    $scope.reset = function() {
        if($scope.content) $scope.content = '';
        if($scope.results) $scope.results = '';
    };

    $scope.check = function() {
        if ($scope.content === "" || !$scope.content) return false;
        return true;
    }
    
    $scope.getResults = function(){
        if($scope.check()) {
            searchResults.get($scope.content).then(function(data){
                $scope.results = data.data.query.pages;
                for(var page in $scope.results){
                    $scope.results[page].link = 'https://en.wikipedia.org/wiki/' + $scope.results[page].title; 
                }
            });
        }
    };
}]);

app.factory("searchResults", function($http) {
    var config = {
        params: {
            format: "json",
            action: "query",
            prop: "extracts",
            exchars: "140",
            exlimit: "10",
            exintro: "",
            explaintext: "",
            rawcontinue: "",
            generator: "search",
            gsrlimit: "30",
            callback: "JSON_CALLBACK"
        }
    };
    var url = "https://en.wikipedia.org/w/api.php?";
    
    var results = {
        get: function(data) {
            config.params.gsrsearch = data;
            return $http.jsonp(url,config).then(function(rq){
                console.log(rq);
                return rq;
            });
        }
    };
    return results;
});

app.filter('orderObjectBy', function() {
  return function(items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
    if(reverse) filtered.reverse();
    return filtered;
  };
});