;(function (window, undefined) {
    'use strict';

    hiocsApp.service("curriculumGenerateService", ['$http', '$log', 'app', function($http, $log, app) {
        // 添加
        this.generate = function(inCurriculumFindDto, callback) {
            $log.debug("curriculumGenerateService get run ...");
            $http.post(app.api.address + '/curriculum/courseClassStuCount?semesterId='+inCurriculumFindDto.semesterId+'&grade='+inCurriculumFindDto.grade+'&marjorId='+inCurriculumFindDto.majorId+'&deptNum='+inCurriculumFindDto.deptNum)
                .then(function successCallback(response) {
                    callback( response.data.data);
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
        // 获取年级下拉框
        this.getGrade = function(callback) {
            $http.get(app.api.address + '/base-info/grade-profession/gradePull')
                .then(function successCallback(response) {
                    callback(true,null,response.data);
                }, function errorCallback(response) {
                });

        };
        // 获取专业下拉框
        this.getProfession = function(data,callback) {
            $http.post(app.api.address + '/base-info/grade-profession/professionPull',data)
                .then(function successCallback(response) {
                    callback(true,null,response.data);
                }, function errorCallback(response) {
                });

        };

        // 获取校区下拉框
        this.getCampuss = function(callback) {
            $http.get(app.api.address + '/base-info/campus/findCampusNamesBox')
                .then(function successCallback(response) {
                    callback(true,null,response.data);
                }, function errorCallback(response) {
                });

        };
    }]);

})(window);