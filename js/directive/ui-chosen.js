;(function (window, undefined) {
    'use strict';
    
    /*使用方法：元素加上 ui-chosen 属性、ng-model 和 ng-required 属性
     * 示例：
     * <select ng-model="role.lx" ui-chosen="roleAddform.lx" ng-required="true" id="lx_select" name="lx" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">
     * </select>
     * */
    hiocsApp.directive('uiChosen',function(){
        return {
            restrict:"A",
            require:'ngModel',
            link: function (scope, iElement, iAttrs, ctrl) {
                var toggleStyle = function (value) {
                    if (value) {
                        angular.element('#' + iAttrs.id + '_chosen').children('a').css('border', '1px solid #ec6d51');
                    } else {
                        angular.element('#' + iAttrs.id + '_chosen').children('a').css('border', '1px solid #cfdadd');
                    }
                };
                scope.$watch(iAttrs.uiChosen + '.$invalid', function (newValue) {
                    toggleStyle(newValue);
                });
                scope.$watch(iAttrs.uiChosen + '.$dirty', function (newValue) {
                    if (newValue) {
                        toggleStyle(scope.$eval(iAttrs.uiChosen + '.$invalid'));
                    }
                });
            }
        }
    });

})(window);