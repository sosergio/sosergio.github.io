
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
})();