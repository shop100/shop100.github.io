module.exports = [
    "$scope",
    "$stateParams",
    "CourseService",
    "$state",
    function (scope, $stateParams, CourseService, state) {
        CourseService.get({slug:$stateParams.slug}).then(function (resp) {
            scope.course = resp.data.course;
            scope.module = scope.course.modules.filter(function (module) {
                return Number($stateParams.module_id) === Number(module.id);
            })[0];
        });
        scope.goto = function (route, params) {
            state.go(route, params);
        }
    }
];
