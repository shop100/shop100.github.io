module.exports = [
    "$scope",
    "LessonService",
    "$stateParams",
    function (scope, LessonService, params) {
        LessonService.get(params.course_id, params.module_id, params.lesson_id).then(function (resp) {
            scope.lesson = resp.data.lesson;
        });
        scope.selectLessonText = function (quiz) {

        };
        scope.selectQuiz = function (quiz) {

        }
    }
];
