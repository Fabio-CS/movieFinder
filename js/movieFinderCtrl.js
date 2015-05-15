movieFinder.controller('movieFinderCtrl', function($scope, $http) {
    $scope.search = function(){
    $http.get("https://api.themoviedb.org/3/search/multi?api_key=7fcba73e299bdc5db11e6a6121b0457b&query="+ $scope.query +"&search_type=ngram")
    .success(function(response) {
        var result = [];
        angular.forEach(response.results, function(value, key) {
            if (angular.isDefined(value.name)){
                this.push(value.name);
            }else{
                this.push(value.title)
            }
            }, result);
        $scope.results = result;
        });
    };
});
