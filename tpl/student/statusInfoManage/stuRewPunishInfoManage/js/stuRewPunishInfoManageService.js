/**
 * Created by Administrator on 2018/1/17.
 */
;(function (window, undefined) {
    'use strict';

    hiocsApp.service("arrange_stuRewPunishInfoManageService", ['$timeout', '$http', '$log', 'app', function($timeout, $http, $log, app) {
// 添加
        this.add = function(stuRewPunishInfo, permission, callback) {
            $log.debug("student_stuRewPunishInfooManageService add run ...");
            $log.debug(stuRewPunishInfo);
            $http.post(app.api.address + '/student/stuRewPunish', stuRewPunishInfo, {
                    headers : {permission: permission}
                })
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback();
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };
        // 修改
        this.update = function(stuRewPunishInfo, permission, callback) {
            $log.debug("student_stuRewPunishInfoManageService update run ...");
            $log.debug(stuRewPunishInfo);
            $http.put(app.api.address + '/student/stuRewPunish', stuRewPunishInfo, {
                    headers : {permission: permission}
                })
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback();
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };
        // 删除
        this.delete = function(id, permission, callback) {
            $log.debug("student_stuRewPunishInfoManageService delete run ...");
            $log.debug(id);
            $http.delete(app.api.address + '/student/stuRewPunish?ids=' + id, {
                    headers : {permission: permission}
                })
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback();
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };
        /* // 添加
         this.add = function(noticeType, permission, callback) {
         $log.debug("system_noticeTypeManageService add run ...");
         $log.debug(noticeType);
         $http.post(app.api.address + '/system/noticeType', noticeType, {
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
         this.update = function(noticeType, permission, callback) {
         $log.debug("system_noticeTypeManageService update run ...");
         $log.debug(noticeType);
         $http.put(app.api.address + '/system/noticeType', noticeType, {
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
         this.delete = function(id, permission, callback) {
         $log.debug("system_noticeTypeManageService delete run ...");
         $log.debug(id);
         $http.delete(app.api.address + '/system/noticeType/' + id, {
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
         // 获取公告类型
         this.findNoticeType = function(noticeType,permission, callback) {
         $log.debug("system_noticeTypeManageService findNoticeType run ...");
         $log.debug(noticeType);
         $http.get(app.api.address + '/system/noticeType', {
         params: noticeType ,
         headers : {permission: permission}
         })
         .then(function successCallback(response) {
         if (response.data.meta.success) {
         callback(null, null, response.data.data.list);
         } else {
         callback(true, response.data.meta.message);
         }
         }, function errorCallback(response) {
         $log.debug(response);
         callback(true, app.api.message.error);
         });
         };*/
    }]);

})(window);