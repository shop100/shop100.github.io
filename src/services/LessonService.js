module.exports = [
    "$http",
    "RESOURCES_URL",
    "ProgressService",
    function ($http, RESOURCES_URL, ProgressService) {
        var lessonService = {};
        lessonService.get = function (course_id, module_id, lesson_id) {
            return $http.get(RESOURCES_URL + 'courses' + '/' + course_id + '/' + 'modules' + '/' + module_id + '/' + 'lessons' + '/' + lesson_id + '.json');
        };
        var progressType = 'lessonQuiz';
        lessonService.done = function (quiz) {
            return ProgressService.done(progressType, quiz.id);
        };
        lessonService.isDone = function (quiz) {
            return ProgressService.isDone(progressType, quiz.id);
        };
        return lessonService;
    }
];
