require("quiz-drag-drop/quiz-drag-drop.js");
require("quiz-fill-in-blank/quiz-fill-in-blank.js");
require("quiz-single-multiple-choice/quiz-single-choice.js");
require("quiz-single-multiple-choice/quiz-multiple-choices.js");
angular
    .module("AppControllers", [
        "ui.router",
        "DragDropQuiz",
        "FillInBlankQuiz",
        "MultipleChoiceQuiz",
        "SingleChoiceQuiz",
        "ngMaterial"
    ])
    .config([
        "$urlRouterProvider",
        "$stateProvider",
        function ($urlRouterProvider, $stateProvider) {
            var homeState = {
                name: 'home',
                url: '/',
                template: '',
                controller: [
                    "$state",
                    function ($state) {
                        $state.go('courses');
                    }
                ]
            };

            var coursesState = {
                name: 'courses',
                url: '/courses',
                controller: require('./controllers/CoursesController.js'),
                template: require('./pages/courses.html')
            };

            var courseState = {
                name: 'courses.show',
                url: '/:slug',
                views: {
                    "@": {
                        controller: require('./controllers/CoursesShowController.js'),
                        template: require('./pages/course-show.html')
                    }
                }
            };
            var courseModuleShowState = {
                name: 'courses.show.module',
                url: '/:course_id/modules/:module_id',
                views: {
                    "@": {
                        controller: require('./controllers/CoursesModuleShowController.js'),
                        template: require('./pages/course-module-show.html')
                    }
                }
            };
            var lessonShowState = {
                name: 'courses.show.module.lesson',
                url: '/lessons/:lesson_id',
                views: {
                    "@": {
                        controller: require('./controllers/LessonShowController.js'),
                        template: require('./pages/lesson-show.html')
                    }
                }
            };

            $stateProvider.state(homeState);
            $stateProvider.state(coursesState);
            $stateProvider.state(courseState);
            $stateProvider.state(courseModuleShowState);
            $stateProvider.state(lessonShowState);
            $urlRouterProvider.otherwise('/');
        }]);
