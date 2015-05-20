/* The controller for the angular application */
movieFinder.controller('movieFinderCtrl', function($scope, $http, $log) {
    $scope.hasResults = false; // true if has results to be shown
    $scope.maxSize = 10; // The max size of the number on pagination
    $scope.hasPagination = false; // true if is necessary pagination (the pagination uses a angularJS/bootstrap template
    $scope.currentPage = 1; // number of the current for pagination
    $scope.hasDetails = false; // true if the search is a search for details
    // function to clear the results of the last search
    $scope.initSearch = function () {
        $scope.currentPage = 1;
        $scope.movies = [];
        $scope.actors = [];
        $scope.tv = [];
    };
    // function which searches the the movie db for person, movie or TV show, according to the current page.
    // @return populate the 3 arrays of movies, actors and tv information
    $scope.search = function () {
        $scope.hasPagination = false;
        $scope.hasResults = true;
        $scope.hasMovies = false; // true if there are results of type movies to be shown
        $scope.hasActors = false; // true if there are results of type actors to be shown
        $scope.hasTV = false; // true if there are results of type tv to be shown
        $scope.totalResults = 0; // the inital value of the total results
        $scope.totalPages = 0; // the number of pages which was returned from the search
        $scope.movies = [];
        $scope.actors = [];
        $scope.tv = [];
        $http.get("https://api.themoviedb.org/3/search/multi?api_key=7fcba73e299bdc5db11e6a6121b0457b&query=" + $scope.query +"&search_type=ngram&page=" + $scope.currentPage)
            .success(function (response) {
            // if the results are more than one page, then the pagination become true
                if(response.total_pages > 1){
                    $scope.hasPagination = true;
                }
            // iterate over the results and separate them into categories and add a generic image for the lost pictures.
            angular.forEach(response.results, function (value, key) {
                        if(value.media_type === "movie"){
                            if (value.poster_path !== null && angular.isDefined(value.poster_path))
                                value.poster_path = "http://image.tmdb.org/t/p/w185/" + value.poster_path;
                            else
                                value.poster_path = "/img/no_poster_image.jpg";
                            $scope.movies.push(value);
                            $scope.hasMovies = true;
                        } else if(value.media_type === "person") {
                            if (value.profile_path !== null && angular.isDefined(value.profile_path))
                                value.profile_path = "http://image.tmdb.org/t/p/w185/" + value.profile_path;
                            else
                                value.profile_path = "/img/no_profile_image.jpg";
                            $scope.actors.push(value)
                            $scope.hasActors = true;
                        } else {
                            if (value.poster_path !== null && angular.isDefined(value.poster_path))
                                value.poster_path = "http://image.tmdb.org/t/p/w185/" + value.poster_path;
                            else
                                value.poster_path = "/img/no_poster_image.jpg";
                            $scope.tv.push(value);
                            $scope.hasTV = true;
                        }
                    });
                $scope.totalItems = response.total_results;
            // adjusts the columns width according to the results categories
                if($scope.hasMovies && $scope.hasActors && $scope.hasTV){
                    $scope.colClass = "col-sm-4";
                } else if (($scope.hasMovies && $scope.hasActors && !$scope.hasTV) || ($scope.hasMovies && !$scope.hasActors && $scope.hasTV) || (!$scope.hasMovies && $scope.hasActors && $scope.hasTV)){
                    $scope.colClass = "col-sm-6";
                } else if (($scope.hasMovies && !$scope.hasActors && !$scope.hasTV) || (!$scope.hasMovies && !$scope.hasActors && $scope.hasTV) || (!$scope.hasMovies && $scope.hasActors && !$scope.hasTV)){
                    $scope.colClass = "col-sm-12";
                }
            });
        };
    // function which gets the details of some item
    // @param type the type of searched data (movie/tv/person)
    // @param id the id of the item
    // @return populates the infoDetail propertie with the details data
    $scope.getInfoDetails = function (type, id){
        $scope.infoDetail = null; // clear the results of the last search
        $scope.hasDetails = true;
        $scope.hasResults = false;
        $scope.hasPagination = false;
        $http.get("https://api.themoviedb.org/3/" + type + "/" + id + "?api_key=7fcba73e299bdc5db11e6a6121b0457b")
            .success(function (response) {
                if(type === "person"){
                    if (response.profile_path !== null && angular.isDefined(response.profile_path))
                        response.image = "http://image.tmdb.org/t/p/h632/" + response.profile_path;
                    else
                        response.image = "/img/no_profile_image.jpg";
                }else{
                    if (response.poster_path !== null && angular.isDefined(response.poster_path))
                        response.image = "http://image.tmdb.org/t/p/w342/" + response.poster_path;
                    else
                        response.image = "/img/no_poster_image.jpg";
                }
            response.media_type = type;
            $scope.infoDetail = response;
        });
    };
});
