require("./services.js");
require("./controllers.js");

angular
    .module("App", [
        "ngMaterial",
        "AppServices",
        "AppControllers"
    ])
    .run(["$rootScope",function ($rootScope, $mdSidenav, $mdMedia) {
        $rootScope.openMenu = function () {
            $mdSidenav('left').toggle();
        }
    }])
;

