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
            template: ''
        };

        var coursesState = {
            name: 'courses',
            url: '/courses',
            controller: require('./controllers/CoursesController.js'),
            template: require('./pages/courses.html')
        };

        var courseState = {
            name: 'courses.show',
            url: '/courses/:id',
            views:{
                "@": {
                    controller: require('./controllers/CoursesShowController.js'),
                    template: require('./pages/course-show.html')
                }
            }
        };

        $stateProvider.state(homeState);
        $stateProvider.state(coursesState);
        $stateProvider.state(courseState);
        $urlRouterProvider.otherwise('/');
    }]);
