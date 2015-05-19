movieFinder.controller('movieFinderCtrl', function($scope, $http, $log) {
    $scope.hasResults = false;
    $scope.maxSize = 10;
    $scope.hasPagination = false;
    $scope.currentPage = 1;
    $scope.initSearch = function(){
        $scope.currentPage = 1;
        $scope.movies = [];
        $scope.actors = [];
        $scope.tv = [];
    };
    $scope.search = function(){
        $scope.hasPagination = false;
        $scope.hasResults = true;
        $scope.hasMovies = false;
        $scope.hasActors = false;
        $scope.hasDetails = false;
        $scope.hasTV = false;
        $scope.totalResults = 0;
        $scope.totalPages = 0;
        $scope.movies = [];
        $scope.actors = [];
        $scope.tv = [];
        $http.get("https://api.themoviedb.org/3/search/multi?api_key=7fcba73e299bdc5db11e6a6121b0457b&query="+ $scope.query +"&search_type=ngram&page="+$scope.currentPage)
            .success(function(response) {
                if(response.total_pages > 1){
                    $scope.hasPagination = true;
                }
            angular.forEach(response.results, function(value, key) {
                        if(value.media_type === "movie"){
                            if (value.poster_path != null && angular.isDefined(value.poster_path))
                                value.poster_path = "http://image.tmdb.org/t/p/w185/" + value.poster_path;
                            else
                                value.poster_path = "/img/no_poster_image.jpg";
                            $scope.movies.push(value);
                            $scope.hasMovies = true;
                        }else if(value.media_type === "person"){
                            if (value.profile_path != null && angular.isDefined(value.profile_path))
                                value.profile_path = "http://image.tmdb.org/t/p/w185/" + value.profile_path;
                            else
                                value.profile_path = "/img/no_profile_image.jpg";
                            $scope.actors.push(value)
                            $scope.hasActors = true;
                        }else{
                            if (value.poster_path != null && angular.isDefined(value.poster_path))
                                value.poster_path = "http://image.tmdb.org/t/p/w185/" + value.poster_path;
                            else
                                value.poster_path = "/img/no_poster_image.jpg";
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
    $scope.getInfoDetails = function(type, id){
        $scope.infoDetail = null;
        $scope.hasDetails = true;
        $scope.hasResults = false;
        $scope.hasPagination = false;
        $http.get("https://api.themoviedb.org/3/"+type+"/"+id+"?api_key=7fcba73e299bdc5db11e6a6121b0457b")
            .success(function(response) {
                if(type === "person"){
                    if (response.profile_path != null && angular.isDefined(response.profile_path))
                        response.image = "http://image.tmdb.org/t/p/h632/" + response.profile_path;
                    else
                        response.image = "/img/no_profile_image.jpg";
                }else{
                    if (response.poster_path != null && angular.isDefined(response.poster_path))
                        response.image = "http://image.tmdb.org/t/p/w342/" + response.poster_path;
                    else
                        response.image = "/img/no_poster_image.jpg";
                }
            response.media_type = type;
            $scope.infoDetail = response;
        });
    };
});
