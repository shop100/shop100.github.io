module.exports = [
    "$scope",
    "LessonService",
    "$stateParams",
    function (scope, LessonService, params) {
        LessonService.get(params.course_id, params.module_id, params.lesson_id).then(function (resp) {
            scope.lesson = resp.data.lesson;
            scope.selectLessonText(scope.lesson.quizzes[0]);
        });
        scope.$watch('lesson.quizzes|json', function () {
            if (scope.lesson && scope.lesson.quizzes) {
                scope.quizSelected = scope.lesson.quizzes.filter(function (quiz) {
                    return quiz.selected;
                })[0];
            }
        });
        scope.deSelectAllItem = function () {
            scope.lesson.quizzes = scope.lesson.quizzes.map(function (quiz) {
                quiz.selected = false;
                return quiz;
            });
        };
        scope.selectLessonText = function (quiz) {
            scope.deSelectAllItem();
            quiz.selected = true;
            scope.view = 'text';
        };
        scope.selectQuiz = function (quiz) {
            scope.deSelectAllItem();
            quiz.selected = true;
            scope.view = 'quiz';
        };
        scope.done = function (selectedQuiz) {
            return LessonService.done(selectedQuiz);
        };
        scope.isDone = function (selectedQuiz) {
            return LessonService.isDone(selectedQuiz);
        };
    }
];
