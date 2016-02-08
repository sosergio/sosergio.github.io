(function(){
  
    angular.module("demoApp", [
        'angular-eat'
    ])
        .controller("appController", controller);

    controller.$inject = [];
    function controller() {
        
        var vm = this;
        vm.message = "Please register using the form below.";
        vm.participants = 10;
        vm.user = {
            
        };
        vm.updateChildren = function(){
            var num = angular.isNumber(vm.user.childrenCount)?vm.user.childrenCount:0;
            if(!vm.user.children) vm.user.children = new Array(0); 
            if(vm.user.children.length != num){
                vm.user.children = new Array(num);
                for(var i =0; i<num; i++){
                    vm.user.children[i] = {name:""};
                }
            }
                
            
        }
        vm.submit = function(){
            
        }
        
        
    }
    
})();