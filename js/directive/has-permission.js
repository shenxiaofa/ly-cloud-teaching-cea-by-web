;(function (window, undefined) {
    'use strict';
    
    /*使用方法：元素加上 has-permission 属性，其值为权限值
     * 示例：
     * <button has-permission="user:insert" type="button" class="btn btn-default " ng-click="openAdd()">
     *     <span class="fa fa-plus toolbar-btn-icon"></span>新增
     * </button>
     * */
    hiocsApp.directive('hasPermission',['$localStorage', 'app', function($localStorage, app){
        return {
            restrict:"A",
            link: function (scope, iElement, iAttrs) {
                // 若为调试模式，则跳过
                if (app.debug) {
                    return;
                }
                var hasPermission = function (permissionId) {
                    var result = false;
                    if ($localStorage.__permission__by) {
                        angular.forEach($localStorage.__permission__by, function(serving, index, array){
                            angular.forEach(serving, function(data, index, array){
                                if (permissionId == data.qxbh) {
                                    result = true;
                                }
                            });
                        });
                    }
                    return result;
                }
                var result = hasPermission(iAttrs.hasPermission);
                if (!result) {
                    iElement.remove();
                }
            }
        }
    }]);

})(window);