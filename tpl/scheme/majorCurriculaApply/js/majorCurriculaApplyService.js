;(function (window, undefined) {
    'use strict';

    hiocsApp.service("scheme_majorCurriculaApplyService", ['$http', '$log', 'app', function($http, $log, app) {
        // 获取校区下拉框
        this.getCampus = function(callback) {
            $http.get(app.api.address + '/base-info/campus/findCampusNamesBox')
                .then(function successCallback(response) {
                    callback(true,null,response.data);
                }, function errorCallback(response) {
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
        // 获取专业下拉框
        this.getMajor = function(data, callback) {
            $http.get(app.api.address + '/scheme/share/major?dept_ID='+data.dept_ID+'&schemeSign='+data.schemeSign)
                .then(function successCallback(response) {
                    callback(true,null,response.data);
                }, function errorCallback(response) {
                });
        };
        //获取标签页标题
        this.getTitle = function (id,dept_ID,callback) {
            var title = [];
            $http.get(app.api.address + '/scheme/majorCurricula/apply/'+id+'?dept_ID='+dept_ID)
            //$http.get(app.api.address + '/scheme/majorCurricula/'+id)
                .then(function successCallback(response) {
                    callback(true,null,response.data.data);
                }, function errorCallback(response) {
                    id.debug(response);
                });
        }

        // 添加课程计划变更信息
        this.addCourseChange = function(data,callback) {
            $http.post(app.api.address + '/scheme/majorScheme/apply', data)
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
            $http.post(app.api.address + '/scheme/majorScheme/toReview/'+data.major_ID+'/'+data.reason)
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
            $http.delete(app.api.address + '/scheme/majorCurricula/'+id)
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

        //培养方案下拉列表
        this.getSchemeVersionSelect = function (callback) {
            $http.get(app.api.address + '/scheme/version')
                .then(function successCallback(response) {
                    callback(true,null,response.data.data);
                }, function errorCallback(response) {
                    id.debug(response);
                });
        }
        // 复制方案
        this.copyScheme = function(ids ,data,callback) {
            $http.post(app.api.address + '/scheme/majorScheme/copyScheme/'+ids, data)
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
        // 获取表格数据
        this.getTable = function(param, callback) {
            $http.get(app.api.address + '/scheme/majorCurricula/curriculaChange?majorSchemeDemand_ID='+param.majorSchemeDemand_ID+'&model_ID='+param.id)
                .then(function successCallback(response) {
                    callback(true,null,response.data);
                }, function errorCallback(response) {
                });
        };
    }]);

})(window);