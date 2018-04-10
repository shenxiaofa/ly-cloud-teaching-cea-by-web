;(function (window, undefined) {
    'use strict';

    hiocsApp.service("scheme_majorSchemeInfoManageService", ['$http', '$log', 'app', function($http, $log, app) {
        //获取标签页标题
        this.getTitle = function (id,callback) {
            $http.get(app.api.address + '/scheme/majorCurricula/'+id)
                .then(function successCallback(response) {
                    callback(true,null,response.data.data);
                }, function errorCallback(response) {
                    id.debug(response);
                });
        }
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
        //培养方案下拉列表
        this.getSchemeVersionSelect = function (callback) {
            $http.get(app.api.address + '/scheme/version')
                .then(function successCallback(response) {
                    callback(true,null,response.data.data);
                }, function errorCallback(response) {
                    id.debug(response);
                });
        }

        // 添加课程计划
        this.addCourse = function(data,callback) {
            $http.post(app.api.address + '/scheme/majorScheme', data)
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
        // 修改课程计划
        this.update = function(data,callback) {
            $http.put(app.api.address + '/scheme/majorScheme', data)
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
            $http.delete(app.api.address + '/scheme/majorScheme/'+id)
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
        // 删除方案要求
        this.deleteSchemeDemand = function(id,callback) {
            $http.delete(app.api.address + '/scheme/majorScheme/deleteMajorSchemeDemand/'+id)
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
        this.setInfo = function(gradeMajor_ID, info,callback) {
            $http.put(app.api.address + '/scheme/majorScheme/infoSet?gradeMajorId='+gradeMajor_ID+'&info='+info)
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
            $http.put(app.api.address + '/scheme/majorScheme/creditSet',creditSet)
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
        // 获取单位下拉框
        this.getDept = function(callback) {
            $http.get(app.api.address + '/scheme/share/dept')
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
    }]);

})(window);