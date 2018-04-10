;(function (window, undefined) {
    'use strict';
    
    /*使用方法：元素加上 on-finish-render-filters 属性
     * 示例：
     *
     *  <tr ng-repeat="user in users" on-finish-render-filters>
            <td>{{user.Id}}</td>
            <td>{{user.Name}}</td>
            <td>{{user.Salary}}</td>
        </tr>

         $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
             //下面是在table render完成后执行的js
             var table = $("#leaderBoard").dataTable({
             bJQueryUI: true,
             "sScrollX": '100%',
             });
         });
     * */
    hiocsApp.directive('onFinishRenderFilters', function ($timeout) {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function() {
                        scope.$emit('ngRepeatFinished');
                    });
                }
            }
        };
    });

})(window);