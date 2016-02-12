(function(){
  
    angular.module("eat.components", [
        "eat.components.group",
        "eat.components.group.fast",
        "eat.components.memorableDate",
        "eat.components.money",
    ]);
    
})();;(function(){
  
    angular.module("eat.components.group.fast", [
      
    ])
    .constant("constants",{
        "HTML_INPUT_TYPES":"button checkbox color date datetime datetime-local email file hidden image month number password radio range reset search submit tel text time url week",
        "ATTRS_TO_SKIP":"label help input"
    })
    .directive("eatGroupFast", eatGroupFast)
    ;
    
    eatGroupFast.$inject=["constants"];
    function eatGroupFast(constants){
        
        return {
            restrict: 'E',
            compile: compile
        }
        
        function compile(element, attrs) {
            var eatGroup = angular.element("<eat-group/>");
            
            //creating the label
            var label = angular.element("<label>");
            label.html(attrs.label);
            eatGroup.append(label);
            
            //creating the input
            var input;
            var isInput = false;
            if(constants.HTML_INPUT_TYPES.indexOf(attrs.input) > -1){
                input = angular.element("<input/>");
                input.attr("type", attrs.input);
            }else {
                input =  angular.element("<"+attrs.input+"/>");
            }
            var _attrs=attrs;
            angular.forEach(attrs.$attr, function(key){
                element.removeAttr(key);
                if(constants.ATTRS_TO_SKIP.indexOf(key) == -1){
                    input.attr(key,_attrs[_attrs.$normalize(key)]);
                }
            });
            eatGroup.append(input);
            
            //creating the help
            var help = angular.element("<eat-help/>");
            help.html(attrs.help);
            eatGroup.append(help);
            
            //creating the validation message directive
            var messages = angular.element("<eat-messages/>");
            eatGroup.append(messages);
            
            //adding the group to the element
            element.append(eatGroup);
           
            //removing fast-group from the DOM ...mmm not working!
            //element.replaceWith(eatGroup);
            
        }

    }
    
  
        
})();;(function(){
  
    angular.module("eat.components.group", [])
    .directive("eatGroup", eatGroup)
    .directive("eatInputBuffet", eatInputBuffet)
    .directive("label", label)
    .directive("input", input)
    .directive("eatHelp", eatHelp)
    .directive("eatMessages", eatMessages)
    ;
    
    eatGroup.$inject= ["$eatCoreUtil"];
    function eatGroup($eatCoreUtil){
        
        return {
            restrict: 'EA',
            link: postLink,
            controller: EatGroupCtrl,
            controllerAs:"ctrl",
            require:["?^form", "eatGroup"]
        };
       
        function postLink(scope, element, attrs, ctrls) {
            var formCtrl = ctrls[0];
            var eatGroupCtrl = ctrls[1];
            if(formCtrl){
                eatGroupCtrl.formCtrl = formCtrl;
                
                if (!formCtrl.$name) {
                    //set a name on the form if it hasn't got one
                    var name = 'form_' + $eatCoreUtil.nextUid();
                    var form = $eatCoreUtil.getClosest(element[0],"form");
                    angular.element(form).attr("name",name);
                    formCtrl.$name = name;
                }
            }
            element.addClass('eat-group');
             
            
        }
        
        EatGroupCtrl.$inject = ["$animate", "$element","$scope", "$eatCoreUtil"];
        function EatGroupCtrl($animate, $element, $scope, $eatCoreUtil){
            var ctrl = this;
            //properties
            ctrl.input = null;
            ctrl.formCtrl = null;
            ctrl.isValid = false;
            ctrl.ngModel = null;
            ctrl.isRequired = false;

            //methods            
            ctrl.setInvalid = setInvalid;
            ctrl.setFocused = setFocused;
            ctrl.setRequired = setRequired;
            ctrl.setValid = setValid;
            ctrl.isFormSubmitted = isFormSubmitted;
            ctrl.setInput = setInput; 
            ctrl.setHasValue = setHasValue; 
            ctrl.setNgModel = setNgModel;
            
            function setInvalid(isInvalid) {
                ctrl.isValid = !isInvalid;
                if (isInvalid) {
                    $animate.addClass($element, 'eat-group-invalid');
                } else {
                    $animate.removeClass($element, 'eat-group-invalid');
                }
            }  
            function setValid(isValid) {
                ctrl.isValid = isValid;
                if (isValid) {
                    $animate.addClass($element, 'eat-group-valid');
                } else {
                    $animate.removeClass($element, 'eat-group-valid');
                }
            } 
            
            function setHasValue(hasValue) {
                setInvalid(ctrl.isRequired && !hasValue);
                setValid(hasValue);
                
                if (hasValue) {
                    $animate.addClass($element, 'eat-group-has-value');
                } else {
                    $animate.removeClass($element, 'eat-group-has-value');
                }
            }  
             
            function setFocused(isFocused) {
                $element.toggleClass('eat-group-focused', !!isFocused);
            }
            
            function setRequired(isRequired){
                ctrl.isRequired = isRequired;
                $element.toggleClass('eat-group-required', !!isRequired);
            }  
            
            function setInput(input){
                ctrl.input = input;
            }   
            
            function setNgModel(model){
                ctrl.ngModel = model;
                $scope.$watch(isErrorGetter, setInvalid);
            }
            
            function isFormSubmitted() {
                return ctrl.formCtrl ? ctrl.formCtrl.$submitted : false;
            };
           
            var isErrorGetter = function() {                
                return ctrl.ngModel.$invalid && (ctrl.ngModel.$touched || isFormSubmitted());
            };
            
        }

    }
    
     function eatInputBuffet(){
        
        return {
            restrict: 'EA',
            link: postLink,
            controller: EatInputBuffetCtrl,
            controllerAs:"ctrl",
            require:["^eatGroup", "eatInputBuffet"]
        };

        function postLink(scope, element, attr, ctrls) {
            element.addClass('eat-input-buffet');
            
            if(ctrls.length == 0){
                throw Error("eat-input-buffet must be inside an eat-group");   
            };
            
            var containerCtrl = ctrls[0];
            var eatInputBuffetCtrl = ctrls[1];
            eatInputBuffetCtrl.parent = containerCtrl;
        }
        
        function EatInputBuffetCtrl(){
            var ctrl = this;
        }

    }
    
    input.$inject = ["$eatCoreUtil"];
    function input($eatCoreUtil){
        
        return {
            restrict: 'E',
            link: postLink,
            controller: InputCtrl,
            controllerAs:"ctrl",
            require:["^eatGroup", "?ngModel", "^?eatInputBuffet"]
        };

        function postLink(scope, element, attr, ctrls) {
            var eatGroupCtrl = ctrls[0];
            if(!eatGroupCtrl)throw Error("eat-input must be inside an eat-group");
            
            var ngModelCtrl = ctrls[1];
            var eatInputBuffetCtrl = ctrls[2];
            
            element.addClass('eat-input');
            var isReadonly = angular.isDefined(attr.readonly);
            var isRequired = angular.isDefined(attr.required);
            
            eatGroupCtrl.setRequired(isRequired);
            
            var id = element.attr('id'); 
            if (!id) {
                id = 'input_' + $eatCoreUtil.nextUid();
                element.attr('id', id);
            }
            if (!element.attr('name')) {
                element.attr('name', id);
            }
            
            
            if (!isReadonly) {
                element
                    .on('focus', function(ev) {
                        eatGroupCtrl.setFocused(true);
                    })
                    .on('blur', function(ev) {
                        eatGroupCtrl.setFocused(false);
                        if(!eatInputBuffetCtrl){
                            inputCheckValue();
                        }
                    });
            }
                
            if(!eatInputBuffetCtrl){
                eatGroupCtrl.setNgModel(ngModelCtrl);
                ngModelCtrl.$parsers.push(ngModelPipelineCheckValue);
                ngModelCtrl.$formatters.push(ngModelPipelineCheckValue);
            }
            
            function ngModelPipelineCheckValue(arg) {
                eatGroupCtrl.setHasValue(!ngModelCtrl.$isEmpty(arg));
                return arg;
            }

            function inputCheckValue() {
                // An input's value counts if its length > 0,
                // or if the input's validity state says it has bad input (eg string in a number input)
                eatGroupCtrl.setHasValue(element.val().length > 0 || (element[0].validity || {}).badInput);
            }
        }
        
        function InputCtrl(){
            var ctrl = this;
        }
        
        
    }
    
    function label(){
        
        return {
            restrict: 'E',
            link: postLink,
            controller: LabelCtrl,
            controllerAs:"ctrl"
        };

        function postLink(scope, element) {
            
            element.addClass('eat-label');
        }
        
        function LabelCtrl(){
            var ctrl = this;
            
        }
    }
    
    function eatHelp(){
        
        return {
            restrict: 'E',
            link: postLink,
            controller: EatHelpCtrl
        };

        function postLink(scope, element) {
            element.addClass('eat-help');
        }
        
        function EatHelpCtrl(){
            
        }
    }
    
      function eatMessages(){
        
        return {
            restrict: 'E',
            scope:{},
            template:'<div class="eat-messages" ng-messages="errorModel"><div ng-messages-include="eat-error-messages"></div></div>',
            link:preLink,
            controller: EatMessagesCtrl,
            require:["^eatGroup"]
        };
        
        function preLink(scope, element, attrs, ctrls){
            var eatGroupCtrl = ctrls[0];
            var getter = function(){
                return eatGroupCtrl.ngModel.$touched ||
                       eatGroupCtrl.formCtrl.$submitted ? 
                            eatGroupCtrl.ngModel.$error : null;
            }
            scope.$watch(getter, function(newValue){
                scope.errorModel = newValue;
            });
            
        }
        function EatMessagesCtrl(){
            
        }
    }
        
})();;(function(){
  
    angular.module("eat.components.memorableDate", [
      
    ])
    .directive("eatMemorableDate", eatMemorableDate)
    ;
    eatMemorableDate.$inject = ["$eatCoreUtil"]
    function eatMemorableDate($eatCoreUtil){
        
        return {
            restrict: 'EA',
            link: postLink,
            require:["ngModel", "^eatGroup"],
            scope:{},
            template:
                '<eat-input-buffet>'+
                    '<input type="number" max-length="2" min="1" max="31" ng-model="day"/>'+
                    '<input type="number" max-length="2" min="1" max="12" ng-model="month"/>'+
                    '<input type="number" max-length="4" min="1800" max="2500" ng-model="year"/>'+
                '</eat-input-buffet>'
        };

        function postLink(scope, element, attrs, ctrls) {
           element.removeAttr('label');
           element.removeAttr('type');
           element.removeAttr('help');
           var eatGroupCtrl = ctrls[1];
           var ngModelController = ctrls[0];
           ngModelController.$formatters.push(formatInput);
           ngModelController.$render = renderViewValue;
           ngModelController.$parsers.push(parseOutput);
           
           var isRequired = angular.isDefined(attrs.required);
           eatGroupCtrl.setRequired(isRequired);
           
           eatGroupCtrl.setNgModel(ngModelController);
            
           // This will push the $viewValue value through the parsers
           // before it is synchronized out to the $modelValue and the ngModel
           // binding.
           scope.$watch('day + month + year', function(newValue,oldValue) {
              if(oldValue != newValue){
                    var date = {
                            year: scope.year, 
                            month: scope.month, 
                            day:scope.day
                    };
                    ngModelController.$setTouched(true);
                    ngModelController.$setViewValue(date);
              }
           });
                    
           // ngModel --> $modelValue --> [[[ Formatters ]]] --> $viewValue --> $render().
           function formatInput(model){
               var isValid = $eatCoreUtil.isValidDate(model);
               var vm = null;
               if(isValid){
                   vm = {
                     day:model.getDay(),
                     month:model.getMonth()+1,
                     year:model.getFullYear()  
                   };
               }
               setValidity(vm);
               return vm; 
           }
           
           //this is crucial when the directive is loaded with a set model
           function renderViewValue(){
               var vm = ngModelController.$viewValue;
               if(vm){
                scope.day   = vm.day;
                scope.month = vm.month;
                scope.year  = vm.year;
               };
               setValidity(vm);
           }
           
           // Widget --> $viewValue --> [[[ Parsers ]]] --> $modelValue --> ngModel.
           function parseOutput(vm){
               if(setValidity(vm)) 
                    return new Date(vm.year,vm.month-1,vm.day);
               return null;
           }
           
            
           
           var _ele  = element;
           function setValidity(vm){
               var isValid = false;
               if(vm && vm.day && vm.month && vm.year){
                   var date = new Date(vm.year,vm.month-1,vm.day);
                   isValid= $eatCoreUtil.isValidDate(date);
               }else if(!isRequired && !vm){
                   isValid = true;
               }
               
               if(ngModelController.$touched || eatGroupCtrl.isFormSubmitted()){
                   var yearVal = _ele[0].querySelector("[ng-model='year']").validity.valid;
                   var monthVal = _ele[0].querySelector("[ng-model='month']").validity.valid;
                   var dayVal = _ele[0].querySelector("[ng-model='day']").validity.valid;
                   isValid = isValid && yearVal && monthVal && dayVal;
                   ngModelController.$setValidity("date", isValid);
                   eatGroupCtrl.setValid(isValid);
               }
               
               return isValid;
           }
           
           
           
        }

    }
    
  
        
})();;(function(){
  
    angular.module("eat.components.money", [
      
    ])
    .directive("eatMoney", eatMoney)
    ;
    eatMoney.$inject = ["$eatCoreUtil"]
    function eatMoney($eatCoreUtil){
        
        return {
            restrict: 'EA',
            link: postLink,
            require:["ngModel", "^eatGroup"],
            scope:{},
            template:
                '<eat-input-buffet class="eat-money">'+
                    '<select ng-model="currency"><option>EUR</option><option>GBP</option></select>'+
                    '<span class="eat-money-currency-symbol">{{currency=="EUR"?"€":""}}{{currency=="GBP"?"£":""}}</span>'+
                    '<input type="number" min="0" ng-model="amount"/>'+
                '</eat-input-buffet>'
        };

        function postLink(scope, element, attrs, ctrls) {
           element.removeAttr('label');
           element.removeAttr('type');
           element.removeAttr('help');
           var eatGroupCtrl = ctrls[1];
           var ngModelController = ctrls[0];
           ngModelController.$formatters.push(formatInput);
           ngModelController.$render = renderViewValue;
           ngModelController.$parsers.push(parseOutput);
           
           var isRequired = angular.isDefined(attrs.required);
           eatGroupCtrl.setRequired(isRequired);
           
           eatGroupCtrl.setNgModel(ngModelController);
            
           // This will push the $viewValue value through the parsers
           // before it is synchronized out to the $modelValue and the ngModel
           // binding.
           scope.$watch('currency + amount', function(newValue,oldValue) {
              if(oldValue != newValue){
                    var money = {
                            currency: scope.currency, 
                            amount: scope.amount
                    };
                    ngModelController.$setTouched(true);
                    ngModelController.$setViewValue(money);
              }
           });
                    
           // ngModel --> $modelValue --> [[[ Formatters ]]] --> $viewValue --> $render().
           function formatInput(model){
               var isValid = $eatCoreUtil.isValidDate(model);
               var vm = null;
               if(model){
                   vm = {
                     day:model.amount,
                     month:model.currency
                   };
               }
               setValidity(vm);
               return vm; 
           }
           
           //this is crucial when the directive is loaded with a set model
           function renderViewValue(){
               var vm = ngModelController.$viewValue;
               if(vm){
                scope.amount   = vm.amount;
                scope.currency = vm.currency;
               };
               setValidity(vm);
           }
           
           // Widget --> $viewValue --> [[[ Parsers ]]] --> $modelValue --> ngModel.
           function parseOutput(vm){
               if(setValidity(vm)) 
                    return {amount: vm.amount, currency: vm.currency};
               return null;
           }
           
            var isErrorGetter = function() {                
                return ngModelController.$invalid && (ngModelController.$touched || eatGroupCtrl.isFormSubmitted());
            };
            scope.$watch(isErrorGetter, eatGroupCtrl.setInvalid);
           
           var _ele  = element;
           function setValidity(vm){
               var isValid = false;
               if(!isRequired && !vm){
                   isValid = true;
               }
               
               if(ngModelController.$touched || eatGroupCtrl.isFormSubmitted()){
                   var yearVal = _ele[0].querySelector("[ng-model='amount']").validity.valid;
                   var monthVal = _ele[0].querySelector("[ng-model='currency']").validity.valid;
                   isValid = isValid && yearVal && monthVal;
                   ngModelController.$setValidity("money", isValid);
                   eatGroupCtrl.setValid(isValid);
               }
               
               return isValid;
           }
           
           
           
        }

    }
    
  
        
})();;
var nextUniqueId = 0;

(function(){
  
    
  
    angular.module("eat.core", [])
    .factory("$eatCoreUtil", eatCoreUtil);
    
    
    function eatCoreUtil(){
        var service = {
            nextUid : nextUid,
            isValidDate: isValidDate,
            getClosest: getClosest
        };
        return service;
        
        
        function nextUid(){
            nextUniqueId++;
            return '' + nextUniqueId;
        }
        
    }
    
    function isValidDate(d){
        if ( Object.prototype.toString.call(d) === "[object Date]" ) {
            // it is a date
            if ( isNaN( d.getTime() ) ) {  // d.valueOf() could also work
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return false
        }
    }
    
    function getClosest(el, tagName, onlyParent) {
        if (el instanceof angular.element) el = el[0];
        tagName = tagName.toUpperCase();
        if (onlyParent) el = el.parentNode;
        if (!el) return null;
        do {
            if (el.nodeName === tagName) {
            return el;
            }
        } while (el = el.parentNode);
        return null;
    }
})();;(function(){
  
    angular.module("angular-eat", [
        "ngMessages",
        "eat.components",
        "eat.core"
    ]);
    
})();