module.exports = [
    "$rootScope",
    "$scope",
    "CourseService",
    function ($rootScope, scope, CourseService) {
        $rootScope.$watch("courses", function (newVal) {
            if (newVal) {
                scope.courses = $rootScope.courses.filter(function (course) {
                    var reject = ["HTML", "PHP", "JavaScript"].indexOf(course.slug) < 0;
                    return !reject;
                });
            }
        });
    }
];
