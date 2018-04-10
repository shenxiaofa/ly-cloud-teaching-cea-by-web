;(function (window, undefined) {
    'use strict';

    hiocsApp.service("scheme_schemeVersionCreditService", ['$http', '$log', 'app', function($http, $log, app) {
        // 获取树菜单
        this.getMenuTree = function(callback) {
            $http.get('data_test/scheme/tree_versionModelMenuTree.json')
                .then(function successCallback(response) {
                    callback(false, null, response.data.data);
                }, function errorCallback(response) {
                    callback(true, response.data.message);
                });
        };
        // 保存
        this.save = function(versionModels, callback) {
            $http.put(app.api.address + '/scheme/schemeVersionCredit', versionModels)
             .then(function successCallback(response) {
                 if (response.data.code == app.api.code.success) {
                     callback();
                 } else {
                     callback(true, response.data.message);
                 }
             }, function errorCallback(response) {
                 callback(true, response.data.message);
             });
        };
        // 复制到专业
        this.copyToMajor = function(schemeId,callback) {
            $http.post(app.api.address + '/scheme/schemeVersionCredit', schemeId)
             .then(function successCallback(response) {
                 if (response.data.code == app.api.code.success) {
                     callback();
                 } else {
                     callback(true, response.data.message);
                 }
             }, function errorCallback(response) {
                 callback(true, response.data.message);
             });
        };
    }]);

})(window);