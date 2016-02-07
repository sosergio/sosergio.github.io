(function(){
  
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
    
  
        
})();