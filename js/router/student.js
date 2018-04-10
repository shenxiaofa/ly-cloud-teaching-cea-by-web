;(function (window, undefined) {
    'use strict';
    // 学籍管理模块
    hiocsApp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
        .state('home.common.executiveClass', {//行政班级管理
            url: '/executiveClass',
            templateUrl: 'tpl/student/classManage/executiveClass/index.html',
            controller: student_executiveClassController,
            ncyBreadcrumb: {
                label: '班级信息管理 / 行政班级管理'
            }
        }).state('home.common.newStudentPlacement', {//新生分班管理
            url: '/newStudentPlacement',
            templateUrl: 'tpl/student/classManage/newStudentPlacement/index.html',
            controller: student_newStudentPlacementController,
            ncyBreadcrumb: {
                label: '班级信息管理 / 新生分班管理'
            }
        }).state('home.common.newStudentPlacementManage', {//新生手动分班
            url: '/manage',
            templateUrl: 'tpl/student/classManage/newStudentPlacement/manage/index.html',
            controller: student_newStudentPlacementManageController,
            ncyBreadcrumb: {
                label: '班级信息管理 / <a href="#!/home/common/newStudentPlacement?moduleId=student&ncyBreadcrumbLabel=新生分班管理">新生分班管理</a> / 手动分班'
            }
        }).state('home.common.studentPlacement', {//学生分班管理
            url: '/studentPlacement',
            templateUrl: 'tpl/student/classManage/studentPlacement/index.html',
            controller: student_studentPlacementController,
            ncyBreadcrumb: {
                label: '班级信息管理 / 学生分班管理'
            }
        }).state('home.common.schoolTransaction', {//学籍异动管理
            url: '/schoolTransaction',
            templateUrl: 'tpl/student/schoolTransaction/index.html',
            controller: student_schoolTransactionController,
            ncyBreadcrumb: {
                label: '学籍异动管理'
            }
        }).state('home.common.undergraduatesInfoManage', {//本科生基本信息维护
            url: '/undergraduatesInfoManage',
            templateUrl: 'tpl/student/statusInfoManage/undergraduatesInfoManage/index.html',
            controller: arrange_undergraduatesInfoManageController,
            ncyBreadcrumb: {
                label: '学籍信息管理 / 基本信息管理'
            }
        }).state('home.common.stuFullTimeInfoManage', {//国内学生学籍信息管理
            url: '/stuFullTimeInfoManage',
            templateUrl: 'tpl/student/statusInfoManage/stuFullTimeInfoManage/index.html',
            controller: arrange_stuFullTimeInfoManageController,
            ncyBreadcrumb: {
                label: '学籍信息管理 / 国内学生学籍信息管理'
            }
        }).state('home.common.stuPhotoManage', {//学生照片管理
            url: '/stuPhotoManage',
            templateUrl: 'tpl/student/statusInfoManage/stuPhotoManage/index.html',
            controller: arrange_stuPhotoManageController,
            ncyBreadcrumb: {
                label: '学籍信息管理 / 学生照片管理'
            }
        }).state('home.common.stuOverseasInfoManage', {//留学生学籍信息管理
            url: '/stuOverseasInfoManage',
            templateUrl: 'tpl/student/statusInfoManage/stuOverseasInfoManage/index.html',
            controller: arrange_stuOverseasInfoManageController,
            ncyBreadcrumb: {
                label: '学籍信息管理 / 留学生学籍信息管理'
            }
        }).state('home.common.stuRewPunishInfoManage', {//学生惩处信息维护
            url: '/stuRewPunishInfoManage',
            templateUrl: 'tpl/student/statusInfoManage/stuRewPunishInfoManage/index.html',
            controller: arrange_stuRewPunishInfoManageController,
            ncyBreadcrumb: {
                label: '学籍信息管理 / 学生惩处信息维护'
            }
        }).state('home.common.stuFlagManage', {//学生标签管理
            url: '/stuFlagManage',
            templateUrl: 'tpl/student/statusInfoManage/stuFlagManage/index.html',
            controller: arrange_stuFlagManageController,
            ncyBreadcrumb: {
                label: '学籍信息管理 / 学生标签管理'
            }
        }).state('home.common.reportRegisterControl', {//报道注册控制
            url: '/reportRegisterControl',
            templateUrl: 'tpl/student/reportRegister/control/index.html',
            controller: student_reportRegisterControlController,
            ncyBreadcrumb: {
                label: '报道注册管理 / 报道注册控制'
            }
        }).state('home.common.reportRegisterManage', {//报道注册管理
            url: '/reportRegisterManage',
            templateUrl: 'tpl/student/reportRegister/manage/index.html',
            controller: student_reportRegisterController,
            ncyBreadcrumb: {
                label: '报道注册管理 / 报道注册管理'
            }
        });
    }]);
})(window);


