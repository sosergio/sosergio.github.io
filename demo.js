(function () {
    "use strict";

    angular.module('demoApp', [
            'angular-eat',
        ])
        .controller("demo", DemoCtrl)
        .directive("scrollPosition", ScrollPosition)
        .directive("formatHtml", FormatHtml)
    ;

    DemoCtrl.$inject = ["$scope"];
    function DemoCtrl($scope) {
        var vm = this;
        vm.textInput = {
            model: ""
        }
        vm.memdate = {
            model: new Date()
        }
        vm.scroll = 0;

        window.vm = vm;
        activate();


        function activate() {
        }
    }




    ScrollPosition.$inject = ["$window"];
    function ScrollPosition($window) {
        return {
            scope: {
                scroll: '=scrollPosition'
            },
            link: function(scope, element, attrs) {
                var windowEl = angular.element($window);
                windowEl.bind('scroll', function() {
                    scope.scroll = this.pageYOffset;
                    scope.$apply();
                });
               
            }
        };
    }

    function FormatHtml() {
        return {
            
            compile: function (element, attrs) {

                element[0].innerHTML = element[0].innerHTML.replace(new RegExp("<", 'g'), "&lt;")
                           .replace(new RegExp(">", 'g'), "&gt;");

            }
        };
    }

})();