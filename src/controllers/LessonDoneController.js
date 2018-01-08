module.exports = [
    "$scope",
    "LessonService",
    "CourseService",
    "$stateParams",
    "$state",
    "$mdToast",
    function (scope, LessonService, CourseService, params, state, toast) {
        console.log(params);
    }
];
