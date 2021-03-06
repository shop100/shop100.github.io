module.exports = [
    "$scope",
    "CourseService",
    "$stateParams",
    "$state",
    "$rootScope",
    function (scope, CourseService, $stateParams, state, rootScope) {
        CourseService.get({slug:$stateParams.slug}).then(function (resp) {
            scope.course = resp.data.course;
            scope.course.slug = $stateParams.slug;
        });
        scope.stateGo = function (stateName, stateParams) {
            state.go(stateName, stateParams);
        };

    }
];
