module.exports = ["$http", "RESOURCES_URL", function ($http, RESOURCES_URL) {
    var moduleService = {};
    moduleService.get = function (course) {
        return $http.get(RESOURCES_URL+'courses/'+ course.slug+'.json');
    };
    return moduleService;
}];
