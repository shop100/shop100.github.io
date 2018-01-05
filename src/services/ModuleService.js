module.exports = ["$http", "RESOURCES_URL", function ($http, RESOURCES_URL) {
    var courseService = {};
    courseService.get = function (course) {
        return $http.get(RESOURCES_URL+'courses/'+ course.slug+'.json');
    };
    return courseService;
}];
