module.exports = [
    "$http",
    "RESOURCES_URL",
    "ProgressService",
    function ($http, RESOURCES_URL, ProgressService) {
        var lessonService = {};
        lessonService.get = function (course_id, module_id, lesson_id) {
            return $http.get(RESOURCES_URL + 'courses' + '/' + course_id + '/' + 'modules' + '/' + module_id + '/' + 'lessons' + '/' + lesson_id + '.json');
        };
        lessonService.done = function (lesson, quiz) {
            var progressType = 'lessonQuiz_' + lesson.id;
            return ProgressService.done(progressType, quiz.id);
        };
        lessonService.isDone = function (lesson, quiz) {
            var progressType = 'lessonQuiz_' + lesson.id;
            return ProgressService.done(progressType, quiz.id);
        };
        return lessonService;
    }
];
