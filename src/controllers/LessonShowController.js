module.exports = [
    "$scope",
    "LessonService",
    "CourseService",
    "$stateParams",
    "$mdToast",
    function (scope, LessonService, CourseService, params, toast) {
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
            if (scope.lesson.quizzes) {
                var selectedQuizPosition = scope.lesson.quizzes.indexOf(selectedQuiz);
                var nextQuiz = scope.lesson.quizzes[selectedQuizPosition+1];
                if(nextQuiz){
                    scope.selectQuiz(nextQuiz);
                }else{
                    CourseService.doneLesson(scope.lesson);
                }
            }
            return LessonService.done(selectedQuiz);
        };
        scope.isDone = function (selectedQuiz) {
            return LessonService.isDone(selectedQuiz);
        };
        scope.$watch('quizSelected.question|json', function () {
            if(!scope.quizSelected){
                return;
            }
            scope.placeholder = scope.quizSelected.question.split('[!raw!]')[1];
            if(typeof scope.placeholder === 'undefined'){
                scope.placeholder = scope.quizSelected.question.split('[!html!]')[1];
            }
        });
        scope.$watch('quizSelected.question|json', function () {
            if(!scope.quizSelected){
                return;
            }
            var questionSegments = scope.quizSelected.question.split('[!raw!]');
            scope.question = questionSegments[0];
            if(typeof questionSegments[1] === 'undefined'){
                scope.question = scope.quizSelected.question.split('[!html!]')[0];
            }
        });
        scope.check = function () {
            toast.show(
                toast.simple()
                    .textContent('Đáp án chưa chính xác, vui lòng chọn lại!')
                    .action('OK')
                    .highlightAction(true)
                    .highlightClass('md-warning')// Accent is used by default, this just demonstrates the usage.
                    .position('bottom right')
            );
        };
        scope.skipText = function () {
            scope.view = 'quiz';
        };
    }
];
