;(function (window, undefined) {
    'use strict';
    // 排课管理模块
    hiocsApp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
        .state('home.common.timeSetting', {//排课时间设置
            url: '/timeSetting',
            templateUrl: 'tpl/arrange/basicSetting/timeSetting/index.html',
            controller: arrange_timeSettingController,
            ncyBreadcrumb: {
                label: '排课基本设置 / 排课时间设置'
            }
        })
        
        
        .state('home.common.teacherTimeDemand', {//教师要求要求
            url: '/teacherTimeDemand',
            templateUrl: 'tpl/arrange/demandSetting/teacherTimeDemand/index.html',
            controller: arrange_teacherTimeDemandController,
            ncyBreadcrumb: {
                label: '排课要求设置 / 教师时间要求',
            }
        })
        .state('home.common.teacherTimeSet', {//教师要求要求设置
            url: '/teacherTimeSet/:params',
            templateUrl: 'tpl/arrange/demandSetting/teacherTimeDemand/demandSetting.html',
            controller: arrange_teacherTimeSetController,
            ncyBreadcrumb: {
                label: '排课要求设置 / 教师时间要求 / 要求设置',
            }
        })
        
        .state('home.common.courseTimeDemand', {//课程时间要求
            url: '/courseTimeDemand',
            templateUrl: 'tpl/arrange/demandSetting/courseTimeDemand/index.html',
            controller: arrange_courseTimeDemandController,
            ncyBreadcrumb: {
                label: '排课要求设置 / 课程时间要求',
            }
        })
        .state('home.common.courseTimeSet', {//课程时间要求设置
            url: '/courseTimeSet/:params',
            templateUrl: 'tpl/arrange/demandSetting/courseTimeDemand/demandSetting.html',
            controller: arrange_courseTimeSetController,
            ncyBreadcrumb: {
                label: '排课要求设置 / 课程时间要求 / 要求设置',
            }
        })
        
        .state('home.common.roomTimeDemand', {//场地时间要求
            url: '/roomTimeDemand',
            templateUrl: 'tpl/arrange/demandSetting/roomTimeDemand/index.html',
            controller: arrange_roomTimeDemandController,
            ncyBreadcrumb: {
                label: '排课要求设置 / 场地时间要求',
            }
        })
        .state('home.common.roomTimeSet', {//课程时间要求设置
            url: '/roomTimeSet/:params',
            templateUrl: 'tpl/arrange/demandSetting/roomTimeDemand/demandSetting.html',
            controller: arrange_roomTimeSetController,
            ncyBreadcrumb: {
                label: '排课要求设置 / 场地时间要求 / 要求设置',
            }
        })
        
        .state('home.common.scheduleManage', {//排课安排管理
            url: '/scheduleManage',
            templateUrl: 'tpl/arrange/scheduleArrange/scheduleManage/index.html',
            controller: arrange_scheduleManageController,
            ncyBreadcrumb: {
                label: '课表安排管理 / 排课安排管理',
            }
        }).state('home.common.arrangeTeachingTask', {//安排教学任务
            url: '/arrangeTeachingTask/:params',
            templateUrl: 'tpl/arrange/scheduleArrange/scheduleManage/arrangeTeachingTask/index.html',
            controller: arrange_arrangeTeachingTaskController,
            ncyBreadcrumb: {
                label: '课表安排管理 / 排课安排管理 / 安排教学任务',
            }
        })
        
        .state('home.common.teacherSchedule', {//教师课表
            url: '/teacherSchedule',
            templateUrl: 'tpl/arrange/scheduleDetail/teacherSchedule/index.html',
            controller: arrange_teacherScheduleController,
            ncyBreadcrumb: {
                label: '课表信息查看 / 教师课表',
            }
        }).state('home.common.teacherScheduleDetail', {//教师课表
//          url: '/teacherScheduleDetail',
            url: '/teacherScheduleDetail/:params',
            templateUrl: 'tpl/arrange/scheduleDetail/teacherSchedule/schedule.html',
            controller: arrange_teacherScheduleDetailController,
            ncyBreadcrumb: {
                label: '课表信息查看 / 教师课表查看',
            }
        }).state('home.common.roomSchedule', {//场地课表
            url: '/roomSchedule',
            templateUrl: 'tpl/arrange/scheduleDetail/roomSchedule/index.html',
            controller: arrange_roomScheduleController,
            ncyBreadcrumb: {
                label: '课表信息查看 / 场地课表',
            }
        }).state('home.common.roomScheduleDetail', {//场地课表
            url: '/roomScheduleDetail/:params',
            templateUrl: 'tpl/arrange/scheduleDetail/roomSchedule/schedule.html',
            controller: arrange_roomScheduleDetailController,
            ncyBreadcrumb: {
                label: '课表信息查看 / 场地课表查看',
            }
        }).state('home.common.studentSchedule', {//学生课表
            url: '/studentSchedule',
            templateUrl: 'tpl/arrange/scheduleDetail/studentSchedule/index.html',
            controller: arrange_studentScheduleController,
            ncyBreadcrumb: {
                label: '课表信息查看 / 学生课表',
            }
        }).state('home.common.studentScheduleDetail', {//学生课表
            url: '/studentScheduleDetail/:params',
            templateUrl: 'tpl/arrange/scheduleDetail/studentSchedule/schedule.html',
            controller: arrange_studentScheduleDetailController,
            ncyBreadcrumb: {
                label: '课表信息查看 / 学生课表查看',
            }
        });
    }]);
})(window);


