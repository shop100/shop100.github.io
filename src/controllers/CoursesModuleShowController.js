module.exports = [
    "$rootScope",
    "$scope",
    "$stateParams",
    "CourseService",
    "$state",
    function (rootScope, scope, $stateParams, CourseService, state) {
        CourseService.get({slug:$stateParams.slug}).then(function (resp) {
            scope.course = resp.data.course;
            scope.module = scope.course.modules.filter(function (module) {
                return Number($stateParams.module_id) === Number(module.id);
            })[0];
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
        scope.goto = function (route, params) {
            state.go(route, params);
        }
    }
];
