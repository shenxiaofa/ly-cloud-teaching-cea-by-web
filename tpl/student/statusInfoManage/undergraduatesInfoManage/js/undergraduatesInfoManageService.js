;(function (window, undefined) {
    'use strict';

    hiocsApp.service("student_undergraduatesInfoManageService", ['$http', '$log', 'app', function($http, $log, app) {

        // 查询主页下拉框数据
        this.get = function(callback) {
            $log.debug("student_undergraduatesInfoManageService get run ...");
            $http.get(app.api.address + '/student/statusInfo/selectionData', {
                    headers : {permission: 'undergraduatesInfo:query'}
                } )
                .then(function successCallback(response) {
                    callback( response.data.data);
                });
        };

        // 查询/新增下拉框数据
        this.selectionAddData = function(callback) {
            $log.debug("student_undergraduatesInfoManageService get run ...");
            $http.get(app.api.address + '/student/statusInfo/selectionAddData',{
                    headers : {permission: 'undergraduatesInfo:query'}
                } )
                .then(function successCallback(response) {
                    callback( response.data.data);
                });
        };

        // 添加
        this.add = function(statusInfo,callback) {
            $log.debug("student_undergraduatesInfoManageService add run ...");
            $log.debug(statusInfo);
            $http.post(app.api.address + '/student/statusInfo', statusInfo,{
                    headers : {permission: 'undergraduatesInfo:insert'}
                })
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback();
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };
        // 修改
        this.update = function(statusInfo,callback) {
            $log.debug("student_undergraduatesInfoManageService update run ...");
            $log.debug(statusInfo);
            $http.put(app.api.address + '/student/statusInfo', statusInfo,{
                      headers:{permission:'undergraduatesInfo:update'}
            })
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback();
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };
        // 删除
        this.delete = function(ids,callback) {
            $log.debug("student_undergraduatesInfoManageService delete run ...");
            $log.debug(ids);
            $http.delete(app.api.address + '/student/statusInfo/'+ids,{
                    headers:{ permission:'undergraduatesInfo:delete'}
                })
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback();
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        }
    }]);

})(window);