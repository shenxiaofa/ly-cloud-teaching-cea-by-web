;(function (window, undefined) {
    'use strict';

    hiocsApp.service("scheme_classCurriculaApplyService", ['$http', '$log', 'app', function($http, $log, app) {
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

        // 获取学年学期下拉框
        this.getSemester = function(grade,callback) {
            $http.get(app.api.address + '/scheme/share/semester?grade='+grade)
                .then(function successCallback(response) {
                    callback(true,null,response.data);
                }, function errorCallback(response) {
                });
        };

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

        // 送审
        this.toReview = function(data,callback) {
            $http.post(app.api.address + '/scheme/classScheme/toReview/'+data.class_ID+'/'+data.reason)
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
        // 保存
        this.save = function(class_ID,callback) {
            $http.post(app.api.address + '/scheme/classScheme/saveRecord/'+class_ID)
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

        // 添加课程计划变更信息
        this.addCourseChange = function(data,callback) {
            $log.debug("plan_planPreparedControlService add run ...");
            $http.post(app.api.address + '/scheme/classScheme/apply', data)
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
        // 恢复
        this.recover = function(id, callback) {
            $log.debug("plan_planPreparedControlService delete run ...");
            $http.delete(app.api.address + '/scheme/classScheme/recover?id='+id)
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

        // 获取表格数据
        this.getTab = function(classSchemeDemand_ID,callback) {
            $http.get(app.api.address + '/scheme/classCurricula/curriculaChange?classSchemeDemand_ID='+classSchemeDemand_ID)
                .then(function successCallback(response) {
                    callback(true,null,response.data);
                }, function errorCallback(response) {
                });
        };
    }]);

})(window);