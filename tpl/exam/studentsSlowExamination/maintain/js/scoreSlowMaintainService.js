/**
 * Created by test on 2017/6/27.
 */
;(function (window, undefined) {
    'use strict';

    hiocsApp.service("score_slowMaintainService", ['$http', '$log', 'app', function($http, $log, app) {
        // 添加
        this.add = function(data, callback) {
            $log.debug("add run ...");
            $http.post(app.api.address + '/exam/examReview/addSlowExam',data)
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

        //删除附件
        this.deleteAttachment = function (fileId, permission, callback) {
            $http.delete(app.api.address + '/system/informNotice/deleteAttachment', {
                    headers : {permission: permission},
                    params : {
                        fileId : fileId
                    }
                })
                .then(function successCallback(response) {
                    if (response.meta.success) {
                        callback();
                    } else {
                        callback(true, response.meta.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };

        // 下载
        this.exportTemplate = function(data, callback) {
            $log.debug("exportTemplate run ...");
            $log.debug(data);
            console.log(data);
            $http.get(app.api.address + '/system/informNotice/downloadAttachment?fileId='+data, {
                    params: data,
                    responseType: 'blob'	// 二进制的流
                })
                .then(function successCallback(response) {
                    callback(response.data);
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };
        
        // 修改
        this.update = function(ids,sjbh) {
            $log.debug("update run ...");
            $log.debug(ids);
            $log.debug(sjbh);
            /* $http.put(app.api.address + '/kwgl/jkjswh', jkjswh)
             .then(function successCallback(response) {
             $log.debug(response);
             }, function errorCallback(response) {
             $log.debug(response);
             });*/
        }

        // 删除
        this.delete = function(data, callback) {
            $log.debug("delete run ...");
            $http.delete(app.api.address + '/exam/examReview/deleteSlowExam/'+data)
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