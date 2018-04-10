;(function (window, undefined) {
    'use strict';

    // 培养方案模块
    hiocsApp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('home.common.schemeVersionManage', {
            url: '/schemeVersionManage',
            templateUrl: 'tpl/scheme/schemeVersion/index.html',
            controller: scheme_schemeVersionController,
            ncyBreadcrumb: {
                label: '版本基本信息管理',
            }
        }).state('home.common.versionModelManage', {
            url: '/versionModelManage',
            templateUrl: 'tpl/scheme/versionModel/index.html',
            controller: scheme_versionModelController,
            ncyBreadcrumb: {
                label: '课程体系设置管理',
            }
        }).state('home.common.schemeVersionCreditManage', {
            url: '/schemeVersionCreditManage',
            templateUrl: 'tpl/scheme/schemeVersionCredit/index.html',
            controller: scheme_schemeVersionCreditController,
            ncyBreadcrumb: {
                label: '版本学分计划管理',
            }
        }).state('home.common.majorSchemeInfoManage', {
            url: '/majorSchemeInfoManage',
            templateUrl: 'tpl/scheme/majorSchemeInfoManage/index.html',
            controller: scheme_majorSchemeInfoManageController,
            ncyBreadcrumb: {
                label: '培养方案信息管理',
            }
        }).state('home.common.majorCurriculaApply', {
            url: '/majorCurriculaApply',
            templateUrl: 'tpl/scheme/majorCurriculaApply/index.html',
            controller: scheme_majorCurriculaApplyController,
            ncyBreadcrumb: {
                label: '专业课程计划申请',
            }
        }).state('home.common.majorCurriculaReview', {
            url: '/majorCurriculaReview',
            templateUrl: 'tpl/scheme/majorCurriculaReview/index.html',
            controller: scheme_majorCurriculaReviewController,
            ncyBreadcrumb: {
                label: '专业课程计划审核',
            }
        }).state('home.common.classSchemeInfoManage', {
            url: '/classSchemeInfoManage',
            templateUrl: 'tpl/scheme/classSchemeInfoManage/index.html',
            controller: scheme_classSchemeInfoManageController,
            ncyBreadcrumb: {
                label: '培养方案信息管理',
            }
        }).state('home.common.classCurriculaApply', {
            url: '/classCurriculaApply',
            templateUrl: 'tpl/scheme/classCurriculaApply/index.html',
            controller: scheme_classCurriculaApplyController,
            ncyBreadcrumb: {
                label: '班级课程计划申请',
            }
        }).state('home.common.classCurriculaReview', {
            url: '/classCurriculaReview',
            templateUrl: 'tpl/scheme/classCurriculaReview/index.html',
            controller: scheme_classCurriculaReviewController,
            ncyBreadcrumb: {
                label: '班级课程计划审核',
            }
        }).state('home.common.curriculumGenerateIndex', {
            url: '/curriculumGenerateIndex',
            templateUrl: 'tpl/scheme/curriculumGenerate/index.html',
            controller: curriculumGenerateController,
            ncyBreadcrumb: {
                label: '教学计划统计生成',
            }
        }).state('home.common.mandatoryStudied', {
            url: '/mandatoryStudied',
            templateUrl: 'tpl/scheme/mandatoryStudied/index.html',
            controller: scheme_mandatoryStudiedController,
            ncyBreadcrumb: {
                label: '必选课修读情况查询',
            }
        }).state('home.common.compulsoryCurriculum', {
            url: '/compulsoryCurriculum',
            templateUrl: 'tpl/scheme/compulsoryCurriculum/index.html',
            controller: scheme_compulsoryCurriculumController,
            ncyBreadcrumb: {
                label: '必修课教学计划管理',
            }
        }).state('home.common.electiveCurriculum', {
            url: '/electiveCurriculum',
            templateUrl: 'tpl/scheme/electiveCurriculum/index.html',
            controller: scheme_electiveCurriculumController,
            ncyBreadcrumb: {
                label: '选修课教学计划管理',
            }
        });
    }]);
    
})(window);


