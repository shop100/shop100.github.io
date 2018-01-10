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
        function ($rootScope, $mdSidenav, $mdMedia, $state) {
        $rootScope.$state = $state;
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
