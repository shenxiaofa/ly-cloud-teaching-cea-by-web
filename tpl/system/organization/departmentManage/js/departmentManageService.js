;(function (window, undefined) {
    'use strict';

    hiocsApp.service("system_departmentManageService", ['$http', '$log', 'app', function($http, $log, app) {
        // 添加
        this.add = function(department, permission, callback) {
            $log.debug("system_departmentManageService add run ...");
            $log.debug(department);
            $http.post(app.api.address + '/system/department', department, {
                headers : {permission: permission}
            })
                .then(function successCallback(response) {
                    if (response.data.meta.success) {
                        callback();
                    } else {
                        callback(true, response.data.meta.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };
        // 修改
        this.update = function(department, permission, callback) {
            $log.debug("system_departmentManageService update run ...");
            $log.debug(department);
            $http.put(app.api.address + '/system/department', department, {
                    headers : {permission: permission}
            })
                .then(function successCallback(response) {
                    if (response.data.meta.success) {
                        callback();
                    } else {
                        callback(true, response.data.meta.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };
        // 删除
        this.delete = function(id, permission, callback) {
            $log.debug("system_departmentManageService delete run ...");
            $log.debug(id);
            $http.delete(app.api.address + '/system/department/' + id, {
                    headers : {permission: permission}
            })
                .then(function successCallback(response) {
                    if (response.data.meta.success) {
                        callback();
                    } else {
                        callback(true, response.data.meta.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };
        // 获取单位类型
        this.findDepartmentType = function(departmentType, callback) {
            $log.debug("system_permissionManageService findDepartmentType run ...");
            $log.debug(departmentType);
            $http.get(app.api.address + '/system/departmentType', {params: departmentType})
                .then(function successCallback(response) {
                    if (response.data.meta.success) {
                        callback(null, null, response.data.data.list);
                    } else {
                        callback(true, response.data.meta.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };
        // 获取部门
        this.findDepartmentById = function(dwh, permission, callback) {
            $log.debug("system_permissionManageService findDepartmentById run ...");
            $log.debug(dwh);
            $http.get(app.api.address + '/system/department/' + dwh, {
                    headers : {permission: permission}
            })
                .then(function successCallback(response) {
                    if (response.data.meta.success) {
                        callback(null, null, response.data.data);
                    } else {
                        callback(true, response.data.meta.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };
        // 获取所有部门
        this.findDepartment = function(department, permission, callback) {
            $log.debug("system_departmentManageService findDepartment run ...");
            $log.debug(department);
            $http.get(app.api.address + '/system/department/', {
                    params: department,
                    headers : {permission: permission}
                })
                .then(function successCallback(response) {
                    if (response.data.meta.success) {
                        callback(null, null, response.data.data.list);
                    } else {
                        callback(true, response.data.meta.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };
    }]);

})(window);