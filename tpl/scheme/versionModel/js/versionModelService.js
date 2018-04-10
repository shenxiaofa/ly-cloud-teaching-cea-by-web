;(function (window, undefined) {
    'use strict';

    hiocsApp.service("scheme_versionModelService", ['$http', '$log', 'app', function($http, $log, app) {
        // 模块设置添加
        this.versionModelAdd = function(versionModel, callback) {
            $http.post(app.api.address + '/scheme/versionModel', versionModel)
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
        // 模块设置修改
        this.versionModelUpdate = function(versionModel, callback) {
            $http.put(app.api.address + '/scheme/versionModel/'+versionModel.id, versionModel)
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
        // 模块设置删除
        this.versionModelDelete = function(ids, callback) {
            $http.delete(app.api.address + '/scheme/versionModel/'+ids)
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

        // 范围维护修改
        this.modelDataRangeUpdate = function(modelDataRange, callback) {
            $http.put(app.api.address + '/scheme/versionModel/updateDataRange', modelDataRange)
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
        // 范围维护删除
        this.modelDataRangeDelete = function(ids, callback) {
            $http.delete(app.api.address + '/scheme/versionModel/operationRange/'+ids)
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
        // 获取数据范围 versionModel_ID 版本模块id operationDept_ID 操作单位id
        this.getDataDept = function(versionModel_ID, operationDept_ID, callback) {
            $http.get(app.api.address + '/scheme/versionModel/dataDept?versionModel_ID='+versionModel_ID+'&operationDept_ID='+operationDept_ID)
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback(true,null,response.data);
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    callback(true, response.data.message);
                });
        };
        // 获取课程模块下拉框
        this.getCourseModel = function(callback) {
            $http.get(app.api.address + '/scheme/share/courseModel')
                .then(function successCallback(response) {
                    callback(true,null,response.data);
                }, function errorCallback(response) {
                });
        };
        // 获取代码集下拉框
        this.getSelected = function(code, callback) {
            $http.get(app.api.address + '/scheme/share/selected?code='+code)
                .then(function successCallback(response) {
                    callback(true,null,response.data);
                }, function errorCallback(response) {
                });
        };
        // 获取单位下拉框
        this.getDept = function(callback) {
            $http.get(app.api.address + '/scheme/share/dept')
                .then(function successCallback(response) {
                    callback(true,null,response.data);
                }, function errorCallback(response) {
                });
        };
    }]);

})(window);