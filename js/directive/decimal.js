;(function (window, undefined) {
    'use strict';

    /*使用方法：
     * <input type="tel" class="form-control" name="age" required ng-model="age" decimal/>
     *  <div class="help-block" ng-show="MyForm.age.$error.integer">该项必须为整数</div>
     *  tips：
     * 自定义指令用来校验是不是整数，记得这个时候不要使用input的number不然你输入abc等值的时候无法触发watch可以改用tel，
     * 如果不想使用这个指令也可以使用ng-pattern配合正则完成
     * */
    hiocsApp.directive('decimal',function(){
        return {
            restrict:"A",
            require:'ngModel',
            link: function (scope, iElement, iAttrs, ctrl) {
                var reg = /^(([1-9]+)|([0-9]+\.[0-9]{1,2}))$/;
                scope.$watch(iAttrs.ngModel, function (newVal) {
                    if(!newVal) return;
                    if(!reg.test(newVal)){
                        ctrl.$setValidity('decimal', false);
                    }else{
                        ctrl.$setValidity('decimal', true);
                    }
                });
            }
        }
    });

})(window);