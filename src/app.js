require("./services.js");
require("./controllers.js");

angular
    .module("App", [
        "ngMaterial",
        "AppServices",
        "AppControllers"
    ])
    .run(["$rootScope", function ($rootScope, $mdSidenav, $mdMedia) {
        $rootScope.openMenu = function () {
            $mdSidenav("left").toggle();
        };
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
                    html = html.replace(/\[b]/gi,'<strong>');
                    html = html.replace(/\[\/b]/gi,'</strong>');
                    html = html.replace(/\[h1]/gi,'<h1>');
                    html = html.replace(/\[\/h1]/gi,'</h1>');
                    html = html.replace(/\[h2]/gi,'<h2>');
                    html = html.replace(/\[\/h2]/gi,'</h2>');

                    html = html.replace(/\n/gi,'<br/>');

                    html = html.replace(/\[note]/gi,'<div class="noteBlock"><span class="note">');
                    html = html.replace(/\[\/note]/gi,'</span></div>');

                    html = html.replace(/\[code format="(.*?)"]/gi,'<div class="codeBlock"><span class="code $1">');
                    html = html.replace(/\[\/code]/gi,'</span></div>');

                    scope.html = $sce.trustAsHtml(html);
                });
            }
        };
    }]);
