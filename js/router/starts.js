/**
 * Created by test on 2017/6/29.
 */
;(function (window, undefined) {
    'use strict';
    // 教务管理模块
    hiocsApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $stateProvider.state('home.common.hierarchicalCodeMaintenance', {//
            url: '/hierarchicalCodeMaintenance',
            templateUrl: 'tpl/starts/hierarchicalCodeMaintenance/index.html',
            controller: Start_hierarchicalCodeMaintenanceController,
            ncyBreadcrumb: {
                label: '等级代码维护'
            }
        }).state('home.common.gradeListMaintenanceController', {//
            url: '/gradeListMaintenance',
            templateUrl: 'tpl/starts/gradeListMaintenance/index.html',
            controller: Start_gradeListMaintenanceController,
            ncyBreadcrumb: {
                label: '等级学生名单维护'
            }
        }).state('home.common.plateSettingController', {//
            url: '/plateSetting',
            templateUrl: 'tpl/starts/plateSetting/index.html',
            controller: Start_plateSettingController,
            ncyBreadcrumb: {
                label: '行政班版块设置'
            }
        }).state('home.common.gradePlateSettingController', {//
            url: '/gradePlateSetting',
            templateUrl: 'tpl/starts/gradePlateSetting/index.html',
            controller: Start_gradePlateSettingController,
            ncyBreadcrumb: {
                label: '等级课程板块设置'
            }
        }).state('home.common.plateTeachingTaskController', {//
            url: '/plateTeachingTask',
            templateUrl: 'tpl/starts/plateTeachingTask/index.html',
            controller: Start_plateTeachingTaskController,
            ncyBreadcrumb: {
                label: '板块教学任务安排'
            }
        }).state('home.common.startsTimeSetting', { // 开课时间设置
                url: '/startsTimeSetting',
                templateUrl: 'tpl/starts/timeSetting/index.html',
                controller: starts_timeSettingController,
                ncyBreadcrumb: {
                    label: '开课时间设置'
                }
            })
            .state('home.common.requiredCourseClassManage', { // 必修课开课管理
                url: '/requiredCourseClassManage',
                templateUrl: 'tpl/starts/requiredCourseClassManage/index.html',
                controller: starts_requiredCourseController,
                ncyBreadcrumb: {
                    label: '必修课开课管理'
                }
            }).state('home.common.requiredCourseArrange', {//必修-教学班安排
            url: '/requiredCourseArrange/:id/:moduleName/:courseNum/:courseName/:credit/:semesterId',
            templateUrl: 'tpl/starts/requiredCourseArrange/index.html',
            controller: starts_requiredCourseArrangeController,
            ncyBreadcrumb: {
                label: '必修-教学班安排'
            }
        }).state('home.common.electiveCourseClassManage', { // 选修课开课管理
            url: '/electiveCourseClassManage',
            templateUrl: 'tpl/starts/electiveCourseClassManage/index.html',
            controller: starts_electiveCourseController,
            ncyBreadcrumb: {
                label: '选修课开课管理'
            }
        }).state('home.common.electiveCourseArrange', {//选修-教学班安排
            url: '/electiveCourseArrange/:id/:moduleName/:courseNum/:courseName/:credit/:semesterId',
            templateUrl: 'tpl/starts/electiveCourseArrange/index.html',
            controller: starts_electiveCourseArrangeController,
            ncyBreadcrumb: {
                label: '选修-教学班安排'
            }
        }).state('home.common.projectCode', {//项目代码维护
            url: '/projectCode',
            templateUrl: 'tpl/starts/projectCode/index.html',
            controller: starts_projectCodeController,
            ncyBreadcrumb: {
                label: '项目代码维护'
            }
        }).state('home.common.projectCodeMaintenance', {//项目代码类型维护
            url: '/projectCodeMaintenance',
            templateUrl: 'tpl/starts/projectCodeMaintenance/index.html',
            controller: starts_projectCodeMaintenanceController,
            ncyBreadcrumb: {
                label: '项目代码类型维护'
            }
        }).state('home.common.projectModule', {//项目板块设置
                url: '/projectModule',
                templateUrl: 'tpl/starts/projectModule/index.html',
                controller: starts_projectModuleController,
                ncyBreadcrumb: {
                    label: '项目板块设置'
                }
            })
            .state('home.common.projectTeachingClass', {//项目教学班设置
                url: '/projectTeachingClass',
                templateUrl: 'tpl/starts/projectTeachingClass/index.html',
                controller: starts_teachingClassController,
                ncyBreadcrumb: {
                    label: '项目教学班设置'
                }
            }).state('home.common.administrativeSection', {//行政班板块设置
            url: '/administrativeSection',
            templateUrl: 'tpl/starts/administrativeSection/index.html',
            controller: starts_administrativeSectionController,
            ncyBreadcrumb: {
                label: '行政班板块设置'
            }
        }).state('home.common.projectModuleAdd', {//
            url: '/projectModuleAdd',
            templateUrl: 'tpl/starts/projectModule/add.html',
            controller: starts_openAddController,
            ncyBreadcrumb: {
                label: '教学任务管理 / 项目板块设置 / 新增',
            }
        }).state('home.common.projectModuleModify', {//
            url: '/projectModuleModify/:params',
            templateUrl: 'tpl/starts/projectModule/modify.html',
            controller: starts_openModifyController,
            ncyBreadcrumb: {
                label: '教学任务管理 / 项目板块设置 / 修改',
            }
        }).state('home.common.gradePlateSettingAdd', {//
            url: '/gradePlateSettingAdd',
            templateUrl: 'tpl/starts/gradePlateSetting/add.html',
            controller: starts_gradePlateOpenAddController,
            ncyBreadcrumb: {
                label: '教学任务管理 / 等级板块设置 / 新增',
            }
        }).state('home.common.gradePlateSettingModify', {//
            url: '/gradePlateSettingModify/:params',
            templateUrl: 'tpl/starts/gradePlateSetting/modify.html',
            controller: starts_gradePlateOpenModifyController,
            ncyBreadcrumb: {
                label: '教学任务管理 / 等级板块设置 / 修改',
            }
        });
        // }).state('home.common.schoolElectiveTeachingTaskArrange', {//
        //     url: '/schoolElectiveTeachingTaskArrange',
        //     templateUrl: 'tpl/teachingTask/schoolElectiveTeachingTaskArrange/index.html',
        //     controller: teachingTask_schoolElectiveArrangeController,
        //     ncyBreadcrumb: {
        //         label: '全校选修课教学任务安排'
        //     }
        // }).state('home.common.sportsManage', {//
        //     url: '/sportsManage',
        //     templateUrl: 'tpl/teachingTask/sportsManage/index.html',
        //     controller: teachingTask_sportsManageController,
        //     ncyBreadcrumb: {
        //         label: '体育项目管理'
        //     }
        // }).state('home.common.home.commonRequiredCourseTeachingTaskArrange', {//
        //     url: '/home.commonRequiredCourseTeachingTaskArrange',
        //     templateUrl: 'tpl/teachingTask/home.commonRequiredCourseTeachingTaskArrange/index.html',
        //     controller: teachingTask_home.commonRequiredCourseArrangeController,
        //     ncyBreadcrumb: {
        //         label: '普通必修课教学任务安排'
        //     }
        // }).state('home.common.requiredCourseSituation', {//
        //     url: '/requiredCourseSituation',
        //     templateUrl: 'tpl/teachingTask/requiredCourseSituation/index.html',
        //     controller: teachingTask_requiredCourseSituationController,
        //     ncyBreadcrumb: {
        //         label: '全校必选课修读情况'
        //     }
        // }).state('home.common.sportCourseTimeSet', {//
        //     url: '/sportCourseTimeSet',
        //     templateUrl: 'tpl/teachingTask/sportCourseTimeSet/index.html',
        //     controller: teachingTask_sportCourseTimeSetController,
        //     ncyBreadcrumb: {
        //         label: '体育课班级时间板块设置'
        //     }
        // }).state('home.common.sportCourseTimeArrange', {//
        //     url: '/sportCourseTimeArrange',
        //     templateUrl: 'tpl/teachingTask/sportCourseTimeArrange/index.html',
        //     controller: teachingTask_sportCourseTimeArrangeController,
        //     ncyBreadcrumb: {
        //         label: '体育课班级上课时间安排'
        //     }
        // }).state('home.common.sportCourseTeachingPlan', {//
        //     url: '/sportCourseTeachingPlan',
        //     templateUrl: 'tpl/teachingTask/sportCourseTeachingPlan/index.html',
        //     controller: teachingTask_sportCourseTeachingPlanController,
        //     ncyBreadcrumb: {
        //         label: '体育课教学任务安排'
        //     }
        // }).state('home.common.englishRankCodeManage', {//
        //     url: '/englishRankCodeManage',
        //     templateUrl: 'tpl/teachingTask/englishRankCodeManage/index.html',
        //     controller: teachingTask_englishRankCodeManageController,
        //     ncyBreadcrumb: {
        //         label: '英语等级代码管理'
        //     }
        // })
    }]);
})(window);


