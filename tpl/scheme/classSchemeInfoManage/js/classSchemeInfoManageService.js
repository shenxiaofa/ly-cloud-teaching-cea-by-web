;(function (window, undefined) {
    'use strict';

    hiocsApp.service("scheme_classSchemeInfoManageService", ['$http', '$log', 'app', function($http, $log, app) {
        // 复制到班级
        this.copyToClass = function(data,callback) {
            $http.post(app.api.address + '/scheme/classScheme/scheme', data)
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

        //动态获取tab分页标签
        this.getTitle = function (id,callback) {
            var title = [];
            $http.get(app.api.address + '/scheme/classCurricula/'+id)
                .then(function successCallback(response) {
                    callback(true,null,response.data.data);
                }, function errorCallback(response) {
                    id.debug(response);
                });
        }
        // 修改课程计划
        this.update = function(data,callback) {
            $http.put(app.api.address + '/scheme/classScheme/curricula', data)
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
        // 删除培养方案
        this.delete = function(id,callback) {
            $http.delete(app.api.address + '/scheme/classScheme?id='+id)
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
        // 删除培养方案要求
        this.deleteDemand = function(id,callback) {
            $http.delete(app.api.address + '/scheme/classScheme/Demand?id='+id)
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
        // 删除课程计划
        this.deleteCurricula = function(id,callback) {
            $http.delete(app.api.address + '/scheme/classScheme/curricula?id='+id)
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
        //设置信息
        this.setInfo = function(classSchemeId, info,callback) {
            $http.put(app.api.address + '/scheme/classScheme/infomation?classSchemeId='+classSchemeId+'&info='+info)
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
        //设置学分
        this.setCredit = function(creditSet,callback) {
            $http.put(app.api.address + '/scheme/classScheme/credit',creditSet)
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
        // 添加课程计划
        this.addCourse = function(data,callback) {
            $http.post(app.api.address + '/scheme/classScheme/curricula', data)
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

        // 获取学生类别
        this.getSelected = function(code, callback) {
            $http.get(app.api.address + '/base-info/codedata/findcodedataNames?datableNumber='+code)
                .then(function successCallback(response) {
                    callback(true,null,response.data);
                }, function errorCallback(response) {
                });
        };
        // 获取单位下拉框
        this.getDept = function(callback) {
            $http.get(app.api.address + '/base-info/department/findDepartmentNamesBox')
                .then(function successCallback(response) {
                    callback(true,null,response.data);
                }, function errorCallback(response) {
                });
        };
        // 获取学年学期下拉框
        this.getSemester = function(grade,callback) {
            $http.get(app.api.address + '/scheme/share/semester?grade='+grade)
                .then(function successCallback(response) {
                    callback(true,null,response.data);
                }, function errorCallback(response) {
                });
        };
    }]);

})(window);