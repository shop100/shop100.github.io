module.exports = [
    "$scope",
    "$stateParams",
    "CourseService",
    function (scope, $stateParams, CourseService) {
        CourseService.get({slug:$stateParams.slug}).then(function (resp) {
            scope.course = resp.data.course;
            scope.module = scope.course.modules.filter(function (module) {
                return Number($stateParams.module_id) === Number(module.id);
            })[0];
        });
    }
];
