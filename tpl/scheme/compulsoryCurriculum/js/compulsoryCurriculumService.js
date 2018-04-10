;(function (window, undefined) {
    'use strict';

    hiocsApp.service("compulsoryCurriculumService", ['$http', '$log', 'app', function($http, $log, app) {
        // 停开
        this.stopOpen = function(id, callback) {
            $log.debug("compulsoryCurriculumService put run ...");
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
            $log.debug("compulsoryCurriculumService put put ...");
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
            debugger;
            $log.debug("compulsoryCurriculumService post run ...");
            $http({
                method: 'POST',
                url: app.api.address + '/curriculum/curriculum',
                params:data
            }).then(function successCallback(response) {
                callback(response.data.data);
            }, function errorCallback(response) {
                $log.debug(response);
            });
        };

        //编辑教学计划
        this.editCurriculum = function(data, callback) {
            $log.debug("compulsoryCurriculumService put run ...");
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

        this.addClass = function(data, callback) {
            $log.debug("compulsoryCurriculumService post run ...");
            debugger;
            $http({
                method: 'POST',
                url: app.api.address + '/classCurriculum',
                params:data
            }).then(function successCallback(response) {
                callback(response.data.data);
            }, function errorCallback(response) {
                $log.debug(response);
            });
        };

        // 停开班级开课计划
        this.stopOpenClassCurriculum = function(id, callback) {
            $log.debug("electiveCurriculumService put run ...");
            var data={
                id:id,
                sign:"1"
            };

            $http({
                method: 'PUT',
                url: app.api.address + '/curriculum/classCurriculum/stopSign',
                params:data
            }).then(function successCallback(response) {
                debugger;
                callback(response.data.data);
            }, function errorCallback(response) {
                $log.debug(response);
            });
        };

        // 恢复班级开课计划
        this.recoveryOpenClassCurriculum = function(id, callback) {
            $log.debug("electiveCurriculumService put run ...");
            var data={
                id:id,
                sign:"0"
            };
            $http({
                method: 'PUT',
                url: app.api.address + '/curriculum/classCurriculum/stopSign',
                params:data
            }).then(function successCallback(response) {
                callback(response.data.data);
            }, function errorCallback(response) {
                $log.debug(response);
            });
        };

        // 删除班级开课计划
        this.delClassCurriculum = function(id, callback) {
            $log.debug("electiveCurriculumService delete run ...");
            var ids = [];
            ids.push(id);

            var data = {
                ids:ids
            };
            $http({
                method: 'DELETE',
                url: app.api.address + '/curriculum/classCurriculum',
                params:data
            }).then(function successCallback(response) {
                callback(response.data.data);
            }, function errorCallback(response) {
                $log.debug(response);
            });
        };

        // 删除开课计划
        this.delCurriculum = function(id, callback) {
            $log.debug("electiveCurriculumService delete run ...");
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
    }]);

})(window);