;(function (window, undefined) {
    'use strict';

    hiocsApp.service("electiveCurriculumService", ['$http', '$log', 'app', function($http, $log, app) {
        // 停开
        this.stopOpen = function(id, callback) {
            $log.debug("electiveCurriculumService put run ...");
            var data={
                id:id,
                sign:"1"
            };

            $http({
                method: 'PUT',
                url: app.api.address + '/curriculum/curriculum/stopSign',
                params:data
            }).then(function successCallback(response) {
                debugger;
                callback(response.data.data);
            }, function errorCallback(response) {
                $log.debug(response);
            });
        };

        // 恢复
        this.recoveryOpen = function(id, callback) {
            $log.debug("electiveCurriculumService put run ...");
            var data={
                id:id,
                sign:"0"
            };
            $http({
                method: 'PUT',
                url: app.api.address + '/curriculum/curriculum/stopSign',
                params:data
            }).then(function successCallback(response) {
                callback(response.data.data);
            }, function errorCallback(response) {
                $log.debug(response);
            });
        };

        //添加教学计划
        this.addCurriculum = function(data, callback) {
            $log.debug("electiveCurriculumService post run ...");
            $http.post(app.api.address + '/curriculum/curriculum', data)
                .then(function successCallback(response) {
                    $log.debug(response);
                }, function errorCallback(response) {
                    $log.debug(response);
                });
        };

        //编辑教学计划
        this.editCurriculum = function(data, callback) {
            $log.debug("compulsoryCurriculumService post run ...");
            debugger;
            $http({
                method: 'PUT',
                url: app.api.address + '/curriculum/curriculum',
                params:data
            }).then(function successCallback(response) {
                callback(response.data.data);
            }, function errorCallback(response) {
                $log.debug(response);
            });
        };

        // 删除开课计划
        this.delCurriculum = function(id, callback) {
            $log.debug("compulsoryCurriculumService delete run ...");
            var ids = [];
            ids.push(id);

            var data = {
                ids:ids
            };
            $http({
                method: 'DELETE',
                url: app.api.address + '/curriculum/curriculum',
                params:data
            }).then(function successCallback(response) {
                callback(response.data.data);
            }, function errorCallback(response) {
                $log.debug(response);
            });
        };

        // 获取学年学期下拉框
        this.getSemesters = function(callback) {
            $http.get(app.api.address + '/base-info/acadyearterm/findAcadyeartermNamesBox')
                .then(function successCallback(response) {
                    callback(true,null,response.data);
                }, function errorCallback(response) {
                });
        };

        // 获取考试方式下拉框
        this.getExamWays= function(callback) {
            $http.get(app.api.address + '/base-info/codedata/findcodedataNames?datableNumber=KHFS')
                .then(function successCallback(response) {
                    callback(true,null,response.data);
                }, function errorCallback(response) {
                });
        };
        // 获取校区下拉框
        this.getCampus= function(callback) {
            $http.get(app.api.address + '/base-info/campus/findCampusNamesBox')
                .then(function successCallback(response) {
                    callback(true,null,response.data);
                }, function errorCallback(response) {
                });
        };
        // 获取课程模块下拉框
        this.getCourseModule= function(callback) {
            $http.get(app.api.address + '/base-info/courseModule/findCourseModuleNamesBox')
                .then(function successCallback(response) {
                    callback(true,null,response.data);
                }, function errorCallback(response) {
                });
        };
    }]);

})(window);