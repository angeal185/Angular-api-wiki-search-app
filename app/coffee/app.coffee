app = angular.module('wikiApp', [])
app.controller 'wikiController', [
  '$scope'
  'searchResults'
  ($scope, searchResults) ->

    $scope.reset = ->
      if $scope.content
        $scope.content = ''
      if $scope.results
        $scope.results = ''
      return

    $scope.check = ->
      if $scope.content == '' or !$scope.content
        return false
      true

    $scope.getResults = ->
      if $scope.check()
        searchResults.get($scope.content).then (data) ->
          $scope.results = data.data.query.pages
          for page of $scope.results
            $scope.results[page].link = 'https://en.wikipedia.org/wiki/' + $scope.results[page].title
          return
      return

    return
]
app.factory 'searchResults', ($http) ->
  config = params:
    format: 'json'
    action: 'query'
    prop: 'extracts'
    exchars: '140'
    exlimit: '10'
    exintro: ''
    explaintext: ''
    rawcontinue: ''
    generator: 'search'
    gsrlimit: '30'
    callback: 'JSON_CALLBACK'
  url = 'https://en.wikipedia.org/w/api.php?'
  results = get: (data) ->
    config.params.gsrsearch = data
    $http.jsonp(url, config).then (rq) ->
      console.log rq
      rq
  results
app.filter 'orderObjectBy', ->
  (items, field, reverse) ->
    filtered = []
    angular.forEach items, (item) ->
      filtered.push item
      return
    filtered.sort (a, b) ->
      if a[field] > b[field] then 1 else -1
    if reverse
      filtered.reverse()
    filtered