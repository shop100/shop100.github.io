var RESOURCES = 'https://shop100.github.io/';
var CourseService = require("./services/CourseService");
angular
    .module("AppServices", [])
    .constant("RESOURCES_URL", RESOURCES)
    .service("CourseService", CourseService)
;
