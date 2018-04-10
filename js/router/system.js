;(function (window, undefined) {
    'use strict';

    // 系统管理模块
    hiocsApp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('home.common.departmentManage', {
            url: '/departmentManage',
            templateUrl: 'tpl/system/organization/departmentManage/index.html',
            controller: system_departmentManageController,
            ncyBreadcrumb: {
                label: '部门管理',
            }
        }).state('home.common.userManage', {
            url: '/userManage',
            templateUrl: 'tpl/system/organization/userManage/index.html',
            controller: system_userManageController,
            ncyBreadcrumb: {
                label: '用户管理',
            }
        }).state('home.common.roleManage', {
            url: '/roleManage',
            templateUrl: 'tpl/system/organization/roleManage/index.html',
            controller: system_roleManageController,
            ncyBreadcrumb: {
                label: '角色管理',
            }
        }).state('home.common.userGroupManage', {
            url: '/userGroupManage',
            templateUrl: 'tpl/system/organization/userGroupManage/index.html',
            controller: system_userGroupManageController,
            ncyBreadcrumb: {
                label: '用户组管理',
            }
        }).state('home.common.permissionManage', {
            url: '/permissionManage',
            templateUrl: 'tpl/system/permissionManage/permissionManage/index.html',
            controller: system_permissionManageController,
            ncyBreadcrumb: {
                label: '功能权限管理',
            }
        }).state('home.common.dataPermissionManage', {
            url: '/dataPermissionManage',
            templateUrl: 'tpl/system/permissionManage/dataPermissionManage/index.html',
            controller: system_dataPermissionManageController,
            ncyBreadcrumb: {
                label: '数据权限维度',
            }
        }).state('home.common.dataPermissionResourceManage', {
            url: '/dataPermissionResourceManage',
            templateUrl: 'tpl/system/permissionManage/dataPermissionResourceManage/index.html',
            controller: system_dataPermissionResourceManageController,
            ncyBreadcrumb: {
                label: '数据权限范围',
            }
        }).state('home.common.operationLog', {
            url: '/operationLog',
            templateUrl: 'tpl/system/log/operationLog/index.html',
            controller: system_operationLogController,
            ncyBreadcrumb: {
                label: '操作日志',
            }
        }).state('home.common.noticeTypeManage', {
            url: '/noticeTypeManage',
            templateUrl: 'tpl/system/notice/noticeTypeManage/index.html',
            controller: system_noticeTypeManageController,
            ncyBreadcrumb: {
                label: '公告类型',
            }
        }).state('home.common.informNoticeManage', {
            url: '/informNoticeManage',
            templateUrl: 'tpl/system/notice/informNoticeManage/index.html',
            controller: system_informNoticeManageController,
            ncyBreadcrumb: {
                label: '通知公告',
            }
        });
    }]);
    
})(window);


