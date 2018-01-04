module.exports = [
    "$scope",
    "CourseService",
    "$stateParams",
    function (scope, CourseService, $stateParams) {
        CourseService.get({slug:$stateParams.slug}).then(function (resp) {
            scope.course = resp.data.course;
        });
    }
];
