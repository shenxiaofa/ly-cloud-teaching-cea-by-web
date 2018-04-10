;(function (window, undefined) {
    'use strict';

    hiocsApp.service("scheme_classCurriculaReviewService", ['$http', '$log', 'app', function($http, $log, app) {
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

        // 审核
        this.review = function(review, callback) {
            var param = 'classCurriculaApply_ID='+review.classCurriculaApply_ID+'&remark='+review.remark+'&result='+review.result
            $http.put(app.api.address + '/scheme/classCurricula/review?'+param)
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
    }]);

})(window);