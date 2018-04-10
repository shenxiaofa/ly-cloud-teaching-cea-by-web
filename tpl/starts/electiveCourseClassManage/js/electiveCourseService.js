;(function (window, undefined) {
    'use strict';

    hiocsApp.service("starts_electiveCourseService", ['$http', '$log', 'app', function($http, $log, app) {
        // 查询可排学年学期
        this.getSemester = function(callback) {
            $log.debug("starts_requiredCourseService get run ...");
            $http.get(app.api.address + '/virtual-class/openControl/semester')
                .then(function successCallback(response) {
                    callback( response.data.data);
                });
        };
        // 查询所有学年学期
        this.get = function(callback) {
            $log.debug("starts_electiveCourseService get run ...");
            $http.get(app.api.address + '/virtual-class/openPlan/selectSemester')
                .then(function successCallback(response) {
                    callback( response.data.data);
                });
        };
    }]);

})(window);