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
        CourseService.all().then(function (resp) {
            if (!rootScope.courses) {
                rootScope.courses = resp.data;
            }

            rootScope.courses = rootScope.courses.map(function (course) {
                CourseService.get(course).then(function (resp) {
                    var respData = resp.data.course;
                    course.modules = respData.modules;
                    course.name = respData.name;
                });

                return course;
            });
        });
        scope.stateGo = function (stateName, stateParams) {
            state.go(stateName, stateParams);
        };

    }
];
