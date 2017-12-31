module.exports = ["$http", "RESOURCES_URL", function ($http, RESOURCES_URL) {
    var courseService = {};
    courseService.all = function () {
        return $http.get(RESOURCES_URL+'courses/items.json');
    };
    return courseService;
}];
