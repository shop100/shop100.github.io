angular
    .module("AppControllers", [
        'ui.router'
    ])
    .config([
        "$urlRouterProvider",
        "$stateProvider",
        function ($urlRouterProvider, $stateProvider) {
        var homeState = {
            name: 'home',
            url: '/',
            template: '',
            controller:[
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
            views:{
                "@": {
                    controller: require('./controllers/CoursesShowController.js'),
                    template: require('./pages/course-show.html')
                }
            }
        };
        var courseModuleShowState = {
            name: 'courses.show.module',
            url: '/:course_id/modules/:module_id',
            views:{
                "@": {
                    controller: require('./controllers/CoursesModuleShowController.js'),
                    template: require('./pages/course-module-show.html')
                }
            }
        };

        $stateProvider.state(homeState);
        $stateProvider.state(coursesState);
        $stateProvider.state(courseState);
        $stateProvider.state(courseModuleShowState);
        $urlRouterProvider.otherwise('/');
    }]);
