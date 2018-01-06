var RESOURCES = 'https://shop100.github.io/';
var LessonService = require("./services/LessonService");
var CourseService = require("./services/CourseService");
var ProgressService = require("./services/ProgressService");
angular
    .module("AppServices", [])
    .constant("RESOURCES_URL", RESOURCES)
    .service("LessonService", LessonService)
    .service("CourseService", CourseService)
    .service("ProgressService", ProgressService)
;
