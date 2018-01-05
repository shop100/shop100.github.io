module.exports = [
    "$http",
    "RESOURCES_URL",
    function ($http, RESOURCES_URL) {
        var lessonService = {};
        lessonService.get = function (course_id, module_id, lesson_id) {
            return $http.get(RESOURCES_URL + 'courses' + '/' + course_id + '/' + 'modules' + '/' + module_id + '/' + 'lessons' + '/' + lesson_id + '.json');
        };
        return lessonService;
    }
];
