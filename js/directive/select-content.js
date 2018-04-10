;(function (window, undefined) {
    'use strict';
    
    /*使用方法：元素加上 select-content、item-value 和 item-label 属性
     * 示例：
     * <div select-content selecteds="selecteds" item-value="id" item-label="mc"/>
     * */
    hiocsApp.directive('selectContent', [function(){
        return {
            restrict:"EA",
            scope: {
                selecteds: '='
            },
            replace: true, // 替换指令在HTML中绑定的元素
            template: '<div class="select-content">' +
            '<span class="select-item" ng-repeat="selected in selecteds">{{selected[labelKey]}}&nbsp;<button type="button" class="close" ng-click="selectedsRemove(selected)"><span>&times;</span></button></span>' +
            '</div>',
            link: function (scope, iElement, iAttrs) {
                scope.labelKey = iAttrs.itemLabel || 'label';
                scope.valueKey = iAttrs.itemValue || 'value';
                scope.selectedsRemove = function (row) {
                    // 将单个项转换为数组
                    var rows = [];
                    rows.push(row);
                    var tempSelecteds = [];
                    angular.forEach(scope.selecteds, function(selected, selectedIndex) {
                        var isRemove = false; // 是否需要删除
                        angular.forEach(rows, function(row, index) {
                            if (row[scope.valueKey] == selected[scope.valueKey]) {
                                isRemove = true;
                            }
                        });
                        if (!isRemove) {
                            tempSelecteds.push(selected);
                        }
                    });
                    scope.selecteds = tempSelecteds;
                }
            }
        }
    }]);

})(window);