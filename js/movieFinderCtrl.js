movieFinder.controller('movieFinderCtrl', function($scope, $http, $log) {
    $scope.zeroState = true;
    $scope.currentPage = 1;
    $scope.maxSize = 10;
    $scope.hasPagination = false;
    $scope.search = function(){
        $scope.hasPagination = false;
        $scope.zeroState = false;
        $scope.hasMovies = false;
        $scope.hasActors = false;
        $scope.hasTV = false;
        $scope.totalResults = 0;
        $scope.totalPages = 0;
        $scope.movies = [];
        $scope.actors = [];
        $scope.tv = [];
        $http.get("https://api.themoviedb.org/3/search/multi?api_key=7fcba73e299bdc5db11e6a6121b0457b&query="+ $scope.query +"&search_type=ngram")
            .success(function(response) {
                if(response.total_pages > 1){
                    $scope.hasPagination = true;
                }
            angular.forEach(response.results, function(value, key) {
                        if(value.media_type === "movie"){
                            $scope.movies.push(value);
                            $scope.hasMovies = true;
                        }else if(value.media_type === "person"){
                            $scope.actors.push(value)
                            $scope.hasActors = true;
                        }else{
                            $scope.tv.push(value);
                            $scope.hasTV = true;
                        }
                    });
                $scope.totalItems = response.total_results;
                if($scope.hasMovies && $scope.hasActors && $scope.hasTV){
                    $scope.colClass = "col-sm-4";
                }else if(($scope.hasMovies && $scope.hasActors && !$scope.hasTV) || ($scope.hasMovies && !$scope.hasActors && $scope.hasTV) || (!$scope.hasMovies && $scope.hasActors && $scope.hasTV)){
                    $scope.colClass = "col-sm-6";
                }else if(($scope.hasMovies && !$scope.hasActors && !$scope.hasTV) || (!$scope.hasMovies && !$scope.hasActors && $scope.hasTV) || (!$scope.hasMovies && $scope.hasActors && !$scope.hasTV)){
                    $scope.colClass = "col-sm-12";
                }
            });
        };
    $scope.pageChanged = function(){
        $scope.movies = [];
        $scope.actors = [];
        $scope.tv = [];
        $scope.hasMovies = false;
        $scope.hasActors = false;
        $scope.hasTV = false;
        $http.get("https://api.themoviedb.org/3/search/multi?api_key=7fcba73e299bdc5db11e6a6121b0457b&query="+ $scope.query +"&search_type=ngram&page="+$scope.currentPage)
            .success(function(response) {
            angular.forEach(response.results, function(value, key) {
                if(value.media_type === "movie"){
                    $scope.movies.push(value);
                    $scope.hasMovies = true;
                }else if(value.media_type === "person"){
                    $scope.actors.push(value)
                    $scope.hasActors = true;
                }else{
                      $scope.tv.push(value);
                      $scope.hasTV = true;
                }
            });
            if($scope.hasMovies && $scope.hasActors && $scope.hasTV){
                        $scope.colClass = "col-sm-4";
        }else if(($scope.hasMovies && $scope.hasActors && !$scope.hasTV) || ($scope.hasMovies && !$scope.hasActors && $scope.hasTV) || (!$scope.hasMovies && $scope.hasActors && $scope.hasTV)){
            $scope.colClass = "col-sm-6";
        }else if(($scope.hasMovies && !$scope.hasActors && !$scope.hasTV) || (!$scope.hasMovies && !$scope.hasActors && $scope.hasTV) || (!$scope.hasMovies && $scope.hasActors && !$scope.hasTV)){
            $scope.colClass = "col-sm-12";
        }
        });
    };
});
