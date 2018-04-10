;(function (window, undefined) {
    'use strict';

    hiocsApp.service("starts_requiredCourseService", ['$http', '$log', 'app', function($http, $log, app) {
        // 查询学年学期
        this.get = function(callback) {
            $log.debug("starts_requiredCourseService get run ...");
            $http.get(app.api.address + '/virtual-class/openPlan/selectSemester')
                .then(function successCallback(response) {
                    callback( response.data.data);
                });
        };

        // 查询可排学年学期
        this.getSemester = function(callback) {
            $log.debug("starts_requiredCourseService get run ...");
            $http.get(app.api.address + '/virtual-class/openControl/semester')
                .then(function successCallback(response) {
                    callback( response.data.data);
                });
        };
        // 修改
        this.update = function(codeCategory, callback) {
            $log.debug("starts_requiredCourseService update run ...");
            $log.debug(codeCategory);
            // $http.put(app.api.address + '/virtual-class/code/category/'+codeCategory.id, codeCategory)
            //     .then(function successCallback(response) {
            //         if (response.data.code == app.api.code.success) {
            //             callback();
            //         } else {
            //             callback(true, response.data.message);
            //         }
            //     }, function errorCallback(response) {
            //         $log.debug(response);
            //         callback(true, app.api.message.error);
            //     });
        };
        // 删除
        this.delete = function(codeTypeIds, callback) {
            $log.debug("starts_requiredCourseService delete run ...");
            $log.debug(codeTypeIds);
            // $http.delete(app.api.address + '/virtual-class/code/category/'+codeTypeIds)
            //     .then(function successCallback(response) {
            //         if (response.data.code == app.api.code.success) {
            //             callback();
            //         } else {
            //             callback(true, response.data.message);
            //         }
            //     }, function errorCallback(response) {
            //         $log.debug(response);
            //         callback(true, app.api.message.error);
            //     });
        }
    }]);

})(window);