;(function (window, undefined) {
    'use strict';
    
    /* 验证日期是否大于某个日期值，若小于则不通过
     * 示例：
     * <input type="text" date-gt equals="pyfabzkz.ksrq"/>
     * */
    hiocsApp.directive('dateGt',function(){
        return {
            restrict:"A",
            require:'ngModel',
            link: function (scope, iElement, iAttrs, ctrl) {
                scope.$watch(iAttrs.ngModel, function (newVal) {
                    if(!newVal) return;
                    // 日期小于比较值，则验证不通过
                    var equalsVal = scope.$eval(iAttrs.equals);
                    if(newVal && equalsVal && newVal < equalsVal){
                        ctrl.$setValidity('integer', false);
                    }else{
                        ctrl.$setValidity('integer', true);
                    }
                });
            }
        }
    });

})(window);