;(function (window, undefined) {
    'use strict';
    
    /*使用方法：元素加上 has-role 属性，其值为角色编号
     * 示例：
     * <button has-role="admin" type="button" class="btn btn-default " ng-click="openAdd()">
     *     <span class="fa fa-plus toolbar-btn-icon"></span>新增
     * </button>
     * */
    hiocsApp.directive('hasRole',['$localStorage', 'app', function($localStorage, app){
        return {
            restrict:"A",
            link: function (scope, iElement, iAttrs) {
                // 若为调试模式，则跳过
                if (app.debug) {
                    return;
                }
                var hasRole = function (roleId) {
                    var result = false;
                    if ($localStorage.__roles__by) {
                        angular.forEach($localStorage.__roles__by, function(role, index, array){
                            if (roleId == role) {
                                result = true;
                            }
                        });
                    }
                    return result;
                }
                var result = hasRole(iAttrs.hasRole);
                if (!result) {
                    iElement.remove();
                }
            }
        }
    }]);

})(window);