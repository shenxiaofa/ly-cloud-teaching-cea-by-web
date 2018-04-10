/**
 * Created by test on 2017/6/27.
 */
;(function (window, undefined) {
    'use strict';

    hiocsApp.service("makeupExam_examineeLocationManageService", ['$http', '$log', 'app', function($http, $log, app) {
        // 修改
        this.examineeLocation = function(data, callback) {
            $log.debug("update run ...");
            $http.put(app.api.address + '/exam/formalManage/examineeLocation', data)
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback(false,null,response.data);
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    callback(true, response.data.message);
                });
        }

        // 删除
        this.delete = function(data) {
            $log.debug("delete run ...");
            /*$http.delete(app.api.address + '/pyfa/pyfabzkz/'+ids)
             .then(function successCallback(response) {
             $log.debug(response);
             }, function errorCallback(response) {
             $log.debug(response);
             });*/
        }
        // 获取考生
        this.getStudent = function(examClassId,callback) {
            $http.get(app.api.address + '/exam/formalManage/examineeInfo?id='+examClassId+'&pageSize=9999&pageNo=1')
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback(false,null,response.data);
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    callback(true, response.data.message);
                });
        }
        // 获取未安排的考生
        this.getUnArrangeStudent = function(id,classId,callback) {
            $http.get(app.api.address + '/exam/formalManage/examineeInfoByLocation?id='+id+'&classId='+classId)
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback(false,null,response.data);
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    callback(true, response.data.message);
                });
        }
        // 安排考生地点
        this.locationArrange = function(ids,callback) {
            $http.post(app.api.address + '/exam/formalManage/locationArrange?',ids)
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback(false,null,response.data);
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    callback(true, response.data.message);
                });
        }


    }]);

})(window);
