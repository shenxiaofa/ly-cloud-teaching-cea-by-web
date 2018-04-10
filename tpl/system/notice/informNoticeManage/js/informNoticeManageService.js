/**
 * Created by Administrator on 2018/1/11.
 */
;(function (window, undefined) {
    'use strict';

    hiocsApp.service("system_informNoticeManageService", ['$timeout', '$http', '$log', 'app', function($timeout, $http, $log, app) {

        // 添加
        this.add = function(informNotice, permission, callback) {
            $log.debug("system_informNoticeManageService add run ...");
            $log.debug(informNotice);
            $http.post(app.api.address + '/system/informNotice', informNotice, {
                    headers : {permission: permission}
                })
                .then(function successCallback(response) {
                    if (response.data.meta.success) {
                        callback();
                    } else {
                        callback(true, response.data.meta.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };
        // 修改
        this.update = function(informNotice, permission, callback) {
            $log.debug("system_informNoticeManageService update run ...");
            $log.debug(informNotice);
            $http.put(app.api.address + '/system/informNotice', informNotice, {
                    headers : {permission: permission}
                })
                .then(function successCallback(response) {
                    if (response.data.meta.success) {
                        callback();
                    } else {
                        callback(true, response.data.meta.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };
        // 删除
        this.delete = function(noticeIds, permission, callback) {
            $log.debug("system_noticeTypeManageService delete run ...");
            $log.debug(noticeIds);
            $http.delete(app.api.address + '/system/informNotice/' +noticeIds, {
                    headers : {permission: permission}
                })
                .then(function successCallback(response) {
                    if (response.data.meta.success) {
                        callback();
                    } else {
                        callback(true, response.data.meta.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };

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
        }
    }]);

})(window);