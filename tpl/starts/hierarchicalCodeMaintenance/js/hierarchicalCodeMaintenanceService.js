/**
 * Created by Administrator on 2017-07-18.
 */
;(function (window, undefined) {
    'use strict';

    hiocsApp.service("Start_hierarchicalCodeMaintenanceService", ['$http', '$log', 'app', function($http, $log, app) {
        //获取对应课程信息下拉框数据
        this.getCourse = function(callback) {
            $log.debug("Start_plateSettingService getMenuTree run ...");
            $http.get(app.api.address + '/virtual-class/course',{params: {pageNum: 1, pageSize: 0}})
                .then(function successCallback(response) {
                    $log.debug(response);
                    callback(false, null, response.data.data);
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };
        // 添加
        this.add = function(codeGrade, callback) {
            $log.debug("baseResource_codeCategoryService add run ...");
            $log.debug(codeGrade);
            $http.post(app.api.address + '/virtual-class/levelCodeType', codeGrade)
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
        // 添加代码
        this.addCode = function(code, callback) {
            $log.debug("baseResource_codeCategoryService add run ...");
            $log.debug(code);
            $http.post(app.api.address + '/virtual-class/levelCode', code)
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
        this.update = function(codeGrade, callback) {
            $log.debug("baseResource_codeCategoryService update run ...");
            $log.debug(codeGrade);
            $http.put(app.api.address + '/virtual-class/levelCodeType/'+codeGrade.id, codeGrade)
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
        // 修改代码
        this.codeUpdate = function(code, callback) {
            $log.debug("baseResource_codeCategoryService update run ...");
            $log.debug(code);
            code.id = code.levelId;
            $http.put(app.api.address + '/virtual-class/levelCode/'+code.id, code)
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
        this.delete = function(ids, callback) {
            $log.debug("baseResource_codeCategoryService delete run ...");
            $log.debug(ids);
            $http.delete(app.api.address + '/virtual-class/levelCodeType/'+ids)
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
        // 删除代码
        this.codeDelete = function(ids, callback) {
            $log.debug("baseResource_codeCategoryService delete run ...");
            $log.debug(ids);
            var levelCodeSetIds = ids.ids;
            var levelIds = ids.levelIds;
            $http.delete(app.api.address + '/virtual-class/levelCode/'+levelCodeSetIds + "/" + levelIds)
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