module.exports = [
    "$scope",
    "CourseService",
    function (scope, CourseService) {
        CourseService.all().then(function (resp) {
            scope.courses = resp.data;
        })
    }
];
