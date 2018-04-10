;(function (window, undefined) {
    'use strict';
    // 选课管理模块
    hiocsApp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
        .state('home.common.semesterSettingManage', {// 学年学期设置
            url: '/semesterSettingManage',
            templateUrl: 'tpl/choose/chooseCourseStrategyManage/semesterSettingManage/index.html',
            controller: choose_semesterSettingManageController,
            ncyBreadcrumb: {
                label: '选课策略管理 / 学年学期设置'
            }
        }).state('home.common.prohibitionListManage', {// 禁选名单管理
            url: '/prohibitionListManage',
            templateUrl: 'tpl/choose/chooseCourseStrategyManage/prohibitionListManage/index.html',
            controller: choose_prohibitionListManageController,
            ncyBreadcrumb: {
                label: '选课策略管理 / 禁选名单管理'
            }
        }).state('home.common.chooseCourseRoundManage', {// 选课轮次管理
            url: '/chooseCourseRoundManage',
            templateUrl: 'tpl/choose/chooseCourseStrategyManage/chooseCourseRoundManage/index.html',
            controller: choose_chooseCourseRoundManageController,
            ncyBreadcrumb: {
                label: '选课策略管理 / 选课轮次管理'
            }
        }).state('home.common.chooseCourseNumberManage', {// 选课门数控制
            url: '/chooseCourseNumberManage',
            templateUrl: 'tpl/choose/chooseCourseStrategyManage/chooseCourseNumberManage/index.html',
            controller: choose_chooseCourseNumberManageController,
            ncyBreadcrumb: {
                label: '选课策略管理 / 选课门数控制'
            }
        })
        
        .state('home.common.chooseCourseManage', {// 选课课程管理
            url: '/chooseCourseManage',
            templateUrl: 'tpl/choose/chooseCourseProcessManage/chooseCourseManage/index.html',
            controller: choose_chooseCourseManageController,
            ncyBreadcrumb: {
                label: '选课过程管理 / 选课课程管理'
            }
        }).state('home.common.teachingTaskMaintain', {// 选课课程管理
            url: '/teachingTaskMaintain',
            templateUrl: 'tpl/choose/chooseCourseProcessManage/chooseCourseManage/teachingTaskMaintain/index.html',
            controller: choose_teachingTaskMaintainController,
            ncyBreadcrumb: {
                label: '选课过程管理 / 选课课程管理 / 教学班维护'
            }
        }).state('home.common.monitorAdjustManage', {// 选课课程管理
            url: '/monitorAdjustManage',
            templateUrl: 'tpl/choose/chooseCourseProcessManage/monitorAdjustManage/index.html',
            controller: choose_monitorAdjustManageController,
            ncyBreadcrumb: {
                label: '选课过程管理 / 监控调整管理'
            }
        })
        
        .state('home.common.chooseCourseScreenManage', {// 选课筛选管理
            url: '/chooseCourseScreenManage',
            templateUrl: 'tpl/choose/chooseCourseResultManage/chooseCourseScreenManage/index.html',
            controller: choose_chooseCourseScreenManageController,
            ncyBreadcrumb: {
                label: '选课结果管理 / 选课筛选管理'
            }
        }).state('home.common.chooseCourseResultManage', {// 选课结果管理
            url: '/chooseCourseResultManage',
            templateUrl: 'tpl/choose/chooseCourseResultManage/chooseCourseResultManage/index.html',
            controller: choose_chooseCourseResultManageController,
            ncyBreadcrumb: {
                label: '选课结果管理 / 选课结果管理'
            }
        }).state('home.common.classStudentsMaintain', {// 维护选课结果
            url: '/classStudentsMaintain/:params',
            templateUrl: 'tpl/choose/chooseCourseResultManage/chooseCourseResultManage/classStudentsMaintain/index.html',
            controller: choose_classStudentsMaintainController,
            ncyBreadcrumb: {
                label: '选课结果管理 / 选课结果管理 / 维护班级学生'
            }
        })
        
        .state('home.common.classListManage', {// 班级名单管理
            url: '/classListManage',
            templateUrl: 'tpl/choose/classListManage/classListManage/index.html',
            controller: choose_classListManageController,
            ncyBreadcrumb: {
                label: '班级名单管理 / 班级名单管理'
            }
        })
        .state('home.common.classListMaintain', {// 维护班级名称
            url: '/classListMaintain/:params',
            templateUrl: 'tpl/choose/classListManage/classListManage/classListMaintain/index.html',
            controller: choose_classListMaintainController,
            ncyBreadcrumb: {
                label: '班级名单管理 / 班级名单管理/维护班级名称'
            }
        });
    }]);
})(window);


