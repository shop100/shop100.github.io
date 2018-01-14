module.exports = [
    "$scope",
    "LessonService",
    "CourseService",
    "$stateParams",
    "$state",
    "$mdToast",
    function (scope, LessonService, CourseService, params, state, toast) {
        LessonService.get(params.course_id, params.module_id, params.lesson_id).then(function (resp) {
            scope.lesson = resp.data.lesson;
            var quiz = scope.lesson.quizzes[0];
            scope.selectLessonText(quiz);
            if(!quiz.textContent){
                scope.view = 'quiz';
            }
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
                    scope.view = 'text';
                    if(!nextQuiz.textContent) {
                        scope.view = 'quiz';
                    }
                }else{
                    CourseService.doneLesson(scope.lesson);
                    var paramsDoneLesson = angular.extend({}, params);
                    paramsDoneLesson.lesson_id = scope.lesson.id;
                    state.go('courses.show.module.lesson.done', paramsDoneLesson);
                    scope.view = 'quiz';
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
        scope.$watch('quizSelected.textContent', function () {
            if (scope.quizSelected) {
                var textSegments = scope.quizSelected.textContent.replace(/\n/gim, 'JS_BREAK_LINE').replace(/\r/gim, 'JS_RETURN_BACK').split(/\[code.*?code]/gim);
                var codeSegments = scope.quizSelected.textContent.replace(/\n/gim, 'JS_BREAK_LINE').replace(/\r/gim, 'JS_RETURN_BACK').match(/\[code.*?code]/gim);
                var segments = [];
                for(var i = 0;i<Math.max(textSegments.length, codeSegments.length);i++){
                    if (textSegments[i]) {
                        segments.push({content:textSegments[i], type:'text'});
                    }
                    if (codeSegments[i]) {
                        var format = codeSegments[i].match(/format="(.*?)"/gim);
                        format = format[0].replace("format=\"",'').replace('"','');
                        if(format === 'raw'){
                            format = null;
                        }
                        segments.push({
                            content:codeSegments[i].replace(/\[[a-z0-9]+ .*?]/gim,'').replace(/\[[a-z0-9]+?]/gim,'').replace(/\[\/[a-z0-9]+?\]/gim,''),
                            type:'code',
                            format: format
                        });
                    }
                }
                segments = segments.map(function (segment) {
                    segment.content = segment.content.replace(/JS_BREAK_LINE/gim, '\n').replace(/JS_RETURN_BACK/gim, '\r');
                    return segment;
                });
                scope.textContentSegments = (segments);
            }
        });
        scope.editorOnLoad = function (_editor) {
            _editor.setShowPrintMargin(false);
        };
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
