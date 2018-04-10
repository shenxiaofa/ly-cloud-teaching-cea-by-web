;(function (window, undefined) {
    'use strict';

    /*
     * 接收两个参数：
     *  1.提示类型：'warning'、'success'、'danger'，默认是 'warning'
     *  2.提示信息
     * 示例：
     * alertService('请先选择一项');
     * 或
     * alertService('success', '新增成功');
     * */
    hiocsApp.service("alertService", ['$uibModal', function($uibModal) {
        return function () {
            var argsLen = arguments.length;
            if (argsLen == 0) {
                throw new Error('请传入需要提示的信息');
            }
            var message = '';
            if (argsLen == 1) {
                message = arguments[0]
            }
            var type = '';
            if (argsLen > 1) {
                type = arguments[0]
                message = arguments[1]
            }
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'js/service/alertService/alert.html',
                size: '',
                resolve: {
                    alert: function () {
                        return {
                            type: type || 'warning',
                            message: message
                        }
                    }
                },
                controller: alertController
            });
        }
    }]);

    var alertController = function ($scope, $uibModalInstance, alert) {
        $scope.alert = alert;
        $scope.ok = function () {
            $uibModalInstance.close();
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    alertController.$inject = ['$scope', '$uibModalInstance', 'alert'];

})(window);