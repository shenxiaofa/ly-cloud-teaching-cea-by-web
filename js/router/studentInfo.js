/**
 * Created by Administrator on 2018/1/18.
 */
;(function (window, undefined) {
    'use strict';
    // 学籍信息模块
    hiocsApp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('home.common.stuInfoAdd', {
                url: '/stuInfoAdd',
                templateUrl: 'tpl/student/statusInfoManage/stuFullTimeInfoManage/add.html',
                controller: arrange_stuFullTimeInfoManageAddController,
                ncyBreadcrumb: {
                    label: '学籍信息管理 / 国内学生学籍信息管理 / 新增'
                }
            }).state('home.common.stuInfoEdit', {
            url: '/stuInfoEdit',
            templateUrl: 'tpl/student/statusInfoManage/stuFullTimeInfoManage/modify.html',
            controller: arrange_stuFullTimeInfoManageEditController,
            params: {'stuFullTimeInfo': null},
            ncyBreadcrumb: {
                label: '学籍信息管理 / 国内学生学籍信息管理 / 编辑'
            }
        }).state('home.common.stuInfoView', {
            url: '/stuInfoView',
            templateUrl: 'tpl/student/statusInfoManage/stuFullTimeInfoManage/view.html',
            controller: arrange_stuFullTimeInfoManageViewController,
            params: {'stuFullTimeInfo': null},
            ncyBreadcrumb: {
                label: '学籍信息管理 / 国内学生学籍信息管理 / 查看'
            }
        }).state('home.common.stuOverSeasInfoAdd', {
            url: '/stuOverSeasInfoAdd',
            templateUrl: 'tpl/student/statusInfoManage/stuOverseasInfoManage/add.html',
            controller: arrange_stuOverseasInfoManageAddController,
            ncyBreadcrumb: {
                label: '学籍信息管理 / 国外留学生学籍信息管理 / 新增'
            }
        }).state('home.common.stuOverSeasInfoEdit', {
            url: '/stuOverSeasInfoEdit',
            templateUrl: 'tpl/student/statusInfoManage/stuOverseasInfoManage/modify.html',
            controller: arrange_stuOverseasInfoManageEditController,
            params: {'stuOverseasInfo': null},
            ncyBreadcrumb: {
                label: '学籍信息管理 / 国外留学生学籍信息管理 / 编辑'
            }
        }).state('home.common.stuOverSeasInfoView', {
            url: '/stuOverSeasInfoView',
            templateUrl: 'tpl/student/statusInfoManage/stuOverseasInfoManage/view.html',
            controller: arrange_stuOverseasInfoManageViewController,
            params: {'stuOverseasInfo': null},
            ncyBreadcrumb: {
                label: '学籍信息管理 / 国外留学生学籍信息管理 / 查看'
            }
        });
        /* .state('home.common.enteringBatch', {
         url: '/enteringBatch/:params',
         templateUrl: 'tpl/home/entering/enteringBatch.html',
         controller: teacherEntering_enteringBatchController,
         ncyBreadcrumb: {
         label: '首页 / 正考成绩录入 / 批量成绩录入',
         }
         });*/
    }]);
})(window);