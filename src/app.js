require("./services.js");
require("./controllers.js");

angular
    .module("App", [
        "ngMaterial",
        "AppServices",
        "AppControllers"
    ])
    .run([
        "$rootScope",
        "$mdSidenav",
        "$mdMedia",
        "$state",
        "CourseService",
        function (rScope, $mdSidenav, $mdMedia, $state, CourseService) {
            rScope.$mdMedia = $mdMedia;
        rScope.$state = $state;
        rScope.openMenu = function () {
            $mdSidenav("left").toggle();
        };
            CourseService.all().then(function (resp) {
                rScope.courses = resp.data;
                rScope.courses = rScope.courses.map(function (course) {
                    CourseService.get(course).then(function (resp) {
                        var respData = resp.data.course;
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
    }])
    .directive("bbDecode", ["$sce",function ($sce) {
        return {
            template: "<div ng-bind-html='html'></div>",
            scope: {
                content: "="
            },
            link: function (scope) {
                scope.$watch('content', function () {
                    if(!scope.content){
                        return;
                    }
                    var html = scope.content;
                    var div = document.createElement('div');
                    div.innerText = html;
                    html = div.innerHTML;
                    html = html.replace(/\[b]/gi,'<strong>');
                    html = html.replace(/\[\/b]/gi,'</strong>');
                    html = html.replace(/\[h1]/gi,'<h1>');
                    html = html.replace(/\[\/h1]/gi,'</h1>');
                    html = html.replace(/\[h2]/gi,'<h2>');
                    html = html.replace(/\[\/h2]/gi,'</h2>');

                    html = html.replace(/\n/gi,'<br/>');

                    html = html.replace(/\[note]/gi,'<div class="noteBlock"><span class="note">');
                    html = html.replace(/\[\/note]/gi,'</span></div>');

                    html = html.replace(/\[code format="(.*?)".*?]/gi,'<div class="codeBlock"><span class="code $1">');
                    html = html.replace(/\[\/code]/gi,'</span></div>');
                    html = html.replace(/\[img id="(.*?)" width="100%"]/gi,'<img src="https://api.sololearn.com/DownloadFile?id=$1">');

                    scope.html = $sce.trustAsHtml(html);
                });
            }
        };
    }]);
