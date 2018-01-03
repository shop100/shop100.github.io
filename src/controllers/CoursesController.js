module.exports = [
    "$scope",
    "CourseService",
    function (scope, CourseService) {
        CourseService.all().then(function (resp) {
            scope.courses = resp.data;
            scope.courses = scope.courses.map(function (course) {
                CourseService.get(course).then(function (resp) {
                    let respData = resp.data.course;
                    course.alias = respData.alias;
                    course.glossary = respData.glossary;
                    course.groups = respData.groups;
                    course.id = respData.id;
                    course.language = respData.language;
                    course.languageName = respData.languageName;
                    course.modules = respData.modules;
                    course.name = respData.name;
                    course.tags = respData.tags;
                    course.version = respData.version;
                });
                return course;
            })
        })
    }
];
