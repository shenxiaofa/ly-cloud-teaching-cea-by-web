;(function (window, undefined) {
    'use strict';

    /*
     * 功能：验证不通过的输入框会变红色
     * 接收一个个参数：
     *  1.angular 表单对象
     * 示例：
     * formVerifyService(codeCategoryAddform);
     * */
    hiocsApp.service("formVerifyService", [function() {
        return function (form) {
            angular.forEach(form, function(value, key) {
                if(!/^\$/.test(key)) form[key].$setDirty();
            });
        }
    }]);

})(window);