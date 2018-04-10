;(function (window, undefined) {
    'use strict';

    hiocsApp.service("scheme_schemeVersionService", ['$http', '$log', 'app', function($http, $log, app) {
        // 获取学生类别
        this.getSelected = function(code, callback) {
            $http.get(app.api.address + '/base-info/codedata/findcodedataNames?datableNumber='+code)
                .then(function successCallback(response) {
                        callback(true,null,response.data);
                }, function errorCallback(response) {
                });
        };
        // 添加
        this.add = function(schemeVersion, callback) {
            $log.debug("scheme_schemeVersionService add run ...");
            $log.debug(schemeVersion);
            $http.post(app.api.address + '/scheme/version', schemeVersion)
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback();
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, response.data.message);
                });
        };
        // 修改
        this.update = function(schemeVersion, callback) {
            $http.put(app.api.address + '/scheme/version/'+schemeVersion.id, schemeVersion)
             .then(function successCallback(response) {
                 if (response.data.code == app.api.code.success) {
                     callback();
                 } else {
                     callback(true, response.data.message);
                 }
             }, function errorCallback(response) {
                 callback(true, response.data.message);
                $log.debug(response);
             });
        };
        // 删除
        this.delete = function(ids, callback) {
            $log.debug("scheme_schemeVersionService delete run ...");
            $log.debug(ids);
            $http.delete(app.api.address + '/scheme/version/'+ids)
             .then(function successCallback(response) {
                 if (response.data.code == app.api.code.success) {
                     callback();
                 } else {
                     callback(true, response.data.message);
                 }
             }, function errorCallback(response) {
                 callback(true, response.data.message);
             });
        }
    }]);

})(window);