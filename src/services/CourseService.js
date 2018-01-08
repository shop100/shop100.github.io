module.exports = [
    "$http",
    "RESOURCES_URL",
    "ProgressService",
    function ($http, RESOURCES_URL, ProgressService) {
    var courseService = {};
    courseService.all = function () {
        return $http.get(RESOURCES_URL+'courses/items.json');
    };
    courseService.get = function (course) {
        return $http.get(RESOURCES_URL+'courses/'+ course.slug+'.json');
    };
        var lessonProgressType = 'lesson';
        courseService.doneLesson = function (lesson) {
            ProgressService.done(lessonProgressType, lesson.id);
        };
        courseService.isDoneLesson = function (lesson) {
            return ProgressService.isDone(lessonProgressType, lesson.id);
        };
    return courseService;
}];
