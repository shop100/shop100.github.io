module.exports = [
    "$scope",
    "LessonService",
    "CourseService",
    "$stateParams",
    "$state",
    "$mdToast",
    function (scope, LessonService, CourseService, params, state, toast) {
        CourseService.get({slug: params.slug}).then(function (resp) {
            var course = resp.data.course;
            var modules = course.modules;
            var currentModule = modules.filter(function(module){return Number(module.id)===Number(params.module_id)})[0];
            var currentLesson = currentModule.lessons.filter(function(lesson){return Number(lesson.id)===Number(params.lesson_id)})[0];
            var currentLessonPosition;
            currentLessonPosition = currentModule.lessons.indexOf(currentLesson);
            var currentModulePosition;
            currentModulePosition=course.modules.indexOf(currentModule);
            var nextLesson = currentModule.lessons[currentLessonPosition+1];
            var nextModule = modules[currentModulePosition+1];
            var toastTextContent = 'Chính xác. Chúc mừng bạn đã hoàn thành tiết học';
            if(nextLesson){
                state.go('courses.show.module.lesson', {
                    lesson_id: nextLesson.id,
                    module_id: currentModule.id,
                    course_id: course.id,
                    slug: course.alias,
                });
            }else{
                if(nextModule) {
                    state.go('courses.show', {
                        slug:params.slug,
                    });
                    toastTextContent = 'Chính xác. Chúc mừng bạn đã hoàn thành học phần.';
                } else {
                    state.go('courses.show', {
                        slug:params.slug,
                    });
                    toastTextContent = 'Chính xác. Chúc mừng bạn đã hoàn thành khóa học ' + course.name;
                }
            }

            toast.show(
                toast.simple()
                    .textContent(toastTextContent)
                    .highlightAction(true)
                    .highlightClass('md-success')
                    .position('bottom right')
            );
        });
    }
];
