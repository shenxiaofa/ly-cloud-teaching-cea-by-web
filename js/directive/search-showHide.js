;(function (window, undefined) {
    'use strict';

    /*
     *
     *
     * */
    hiocsApp.directive('searchShowHide',function(){
        return {
            restrict:"A",
            link: function (scope, iElement, iAttrs, ctrl) {
                scope.searchListFlag = " fa-caret-down";
                scope.showHideSearchList =function () {
                    scope.searchList = !scope.searchList;
                    if(scope.searchList){
                        scope.searchListFlag = "fa-caret-right";
                    }else{
                        scope.searchListFlag = " fa-caret-down";
                    }
                }
            }
        }
    });

})(window);
