;(function (window, undefined) {
    'use strict';

    /**
     * 使用示例：
     * <ul id="menuTree" z-tree tree-options="zTreeOptions" class="ztree"></ul>
     */
    hiocsApp.directive('zTree',function(){
        return {
            restrict: "A",
            link: function (scope, iElement, iAttrs) {
                var treeOptions, treeNodes;
                if (!iAttrs.treeOptions) {
                    throw new Error('z-tree: The tree-options attributes does not exist');
                }
                treeOptions = scope.$eval(iAttrs.treeOptions);
                if (iAttrs.treeNodes) {
                    treeNodes = scope.$eval(iAttrs.treeNodes);
                }
                if (treeNodes) {
                    $.fn.zTree.init(iElement, treeOptions, treeNodes);
                } else {
                    $.fn.zTree.init(iElement, treeOptions);
                }
            }
        }
    });

})(window);