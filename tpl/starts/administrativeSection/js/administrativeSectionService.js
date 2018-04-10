;(function (window, undefined) {
    'use strict';

    hiocsApp.service("starts_administrativeSectionService", ['$http', '$log', 'app', function($http, $log, app) {
        //获取板块下拉框数据
        this.getProjectPlate = function(callback) {
            $log.debug("Start_plateSettingService getMenuTree run ...");
            $http.get(app.api.address + '/virtual-class/projectPlate/all')
                .then(function successCallback(response) {
                    $log.debug(response);
                    callback(false, null, response.data.data);
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };
        // 添加
        this.add = function(codeCategory, callback) {
            $log.debug("starts_administrativeSectionService add run ...");
            $log.debug(codeCategory);
            // $http.post(app.api.address + '/virtual-class/code/category', codeCategory)
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
        // 修改
        this.update = function(adminSection, callback) {
            $log.debug("starts_administrativeSectionService update run ...");
            $log.debug(adminSection);
            $http.put(app.api.address + '/virtual-class/projectClassTime/'+adminSection.id, adminSection)
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
        // 清空板块
        this.delete = function(ids, callback) {
            $log.debug("starts_administrativeSectionService delete run ...");
            $log.debug(ids);
            $http.put(app.api.address + '/virtual-class/projectClassTime/plateEmptied/'+ids)
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
        this.deleteById = function(ids, callback) {
            $log.debug("starts_teachingClassService delete run ...");
            $log.debug(ids);
            $http.delete(app.api.address + '/virtual-class/projectClassTime/'+ids)
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
        this.setPlate = function(adminSectionEntity, callback) {
            $log.debug("starts_teachingClassService delete run ...");
            $log.debug(adminSectionEntity);
            $http.put(app.api.address + '/virtual-class/projectClassTime/setPlate/',adminSectionEntity)
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
    }]);

})(window);