;(function (window, undefined) {
    'use strict';
    // 考务管理模块
    hiocsApp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('home.common.scorePasswordManagerController', {//成绩密码管理
                url: '/scorePasswordManagerController',
                templateUrl: 'tpl/score/scorePasswordManager/index.html',
                controller: score_scorePasswordManagerController,
                ncyBreadcrumb: {
                    label: '成绩密码管理'
                }
            }).state('home.common.scoreEnteringController', {//正考成绩录入控制
            url: '/scoreEnteringController',
            templateUrl: 'tpl/score/formalExamScore/scoreEntering/index.html',
            controller: score_scoreEnteringController,
            ncyBreadcrumb: {
                label: '正考成绩录入控制'
            }
            }).state('home.common.teacherScoreEnterController', {//正考教师录入控制
                url: '/teacherScoreEnterController',
                templateUrl: 'tpl/score/formalExamScore/teacherScoreEnter/index.html',
                controller: score_teacherScoreEnterController,
                ncyBreadcrumb: {
                    label: '正考教师录入控制'
                }
            }).state('home.common.formalScoreEnterController', {//正考成绩录入控制
            url: '/formalScoreEnterController',
            templateUrl: 'tpl/score/formalExamScore/formalScoreEnter/index.html',
            controller: score_formalScoreEnterController,
            ncyBreadcrumb: {
                label: '正考成绩录入控制'
                }
            }).state('home.common.scoreReviewController', {//正考成绩审核控制
            url: '/scoreReviewController',
            templateUrl: 'tpl/score/formalExamScore/scoreReview/index.html',
            controller: score_scoreReviewController,
            ncyBreadcrumb: {
                label: '成绩监控管理'
                }
            }).state('home.common.makeupScoreEnterController', {//正考成绩录入控制
            url: '/makeupScoreEnterController',
            templateUrl: 'tpl/score/makeupExamScore/makeupScoreEnter/index.html',
            controller: score_makeupScoreEnterController,
            ncyBreadcrumb: {
                label: '补考成绩录入控制'
            }
            }).state('home.common.makeupScoreEnteringController', {//补考成绩录入控制
                url: '/makeupScoreEnteringController',
                templateUrl: 'tpl/score/makeupExamScore/scoreEntering/index.html',
                controller: score_makeupScoreEnteringController,
                ncyBreadcrumb: {
                    label: '补考成绩录入'
                }
            }).state('home.common.makeupTeacherScoreEnterController', {//正考教师录入控制
            url: '/makeupTeacherScoreEnterController',
            templateUrl: 'tpl/score/makeupExamScore/teacherScoreEnter/index.html',
            controller: score_makeupTeacherScoreEnterController,
            ncyBreadcrumb: {
                label: '补考教师录入控制'
            }
            }).state('home.common.makeupScoreReviewController', {//正考成绩审核控制
                url: '/makeupScoreReviewController',
                templateUrl: 'tpl/score/makeupExamScore/scoreReview/index.html',
                controller: score_makeupScoreReviewController,
                ncyBreadcrumb: {
                    label: '成绩监控管理'
                }
            }).state('home.common.cleanScoreEnterController', {//正考成绩录入控制
                url: '/cleanScoreEnterController',
                templateUrl: 'tpl/score/cleanExamScore/cleanScoreEnter/index.html',
                controller: score_cleanScoreEnterController,
                ncyBreadcrumb: {
                    label: '清考成绩录入控制'
                }
            }).state('home.common.cleanScoreEnteringController', {//补考成绩录入控制
            url: '/cleanScoreEnteringController',
            templateUrl: 'tpl/score/cleanExamScore/scoreEntering/index.html',
            controller: score_cleanScoreEnteringController,
            ncyBreadcrumb: {
                label: '清考成绩录入'
            }
        }).state('home.common.cleanTeacherScoreEnterController', {//正考教师录入控制
            url: '/cleanTeacherScoreEnterController',
            templateUrl: 'tpl/score/cleanExamScore/teacherScoreEnter/index.html',
            controller: score_cleanTeacherScoreEnterController,
            ncyBreadcrumb: {
                label: '清考教师录入控制'
            }
        }).state('home.common.cleanScoreReviewController', {//正考成绩审核控制
            url: '/cleanScoreReviewController',
            templateUrl: 'tpl/score/cleanExamScore/scoreReview/index.html',
            controller: score_cleanScoreReviewController,
            ncyBreadcrumb: {
                label: '成绩监控管理'
            }
        }).state('home.common.scoreInfoMaintainController', {//成绩信息维护
            url: '/scoreInfoMaintainController',
            templateUrl: 'tpl/score/maintainManager/scoreInfoMaintain/index.html',
            controller: score_scoreInfoMaintainController,
            ncyBreadcrumb: {
                label: '成绩信息维护'
            }
        }).state('home.common.outsideApplyController', {//系统外成绩申请
            url: '/outsideApplyController',
            templateUrl: 'tpl/score/outsideSystemScore/outsideApply/index.html',
            controller: score_outsideApplyController,
            ncyBreadcrumb: {
                label: '系统外成绩申请'
            }
        }).state('home.common.outsideReviewController', {//系统外成绩审核
            url: '/outsideReviewController',
            templateUrl: 'tpl/score/outsideSystemScore/outsideReview/index.html',
            controller: score_outsideReviewController,
            ncyBreadcrumb: {
                label: '系统外成绩审核'
            }
        }).state('home.common.outsideBindReviewController', {//系统外成绩审核
            url: '/outsideBindReviewController',
            templateUrl: 'tpl/score/outsideSystemScore/outsideBindReview/index.html',
            controller: score_outsideBindReviewController,
            ncyBreadcrumb: {
                label: '外校成绩绑定审核'
            }
        }).state('home.common.outSideMaintainController', {//系统外成绩审核
            url: '/outSideMaintainController',
            templateUrl: 'tpl/score/outsideSystemScore/outSideMaintain/index.html',
            controller: score_outSideMaintainController,
            ncyBreadcrumb: {
                label: '系统外成绩维护'
            }
        }).state('home.common.achievementModificationApply', {//学生缓考申请studentsExemptExamination
            url: '/achievementModificationApply',
            templateUrl: 'tpl/score/achievementModification/apply/index.html',
            controller: score_achievementModifyApplyController,
            ncyBreadcrumb: {
                label: '成绩修改申请'
            }
        }).state('home.common.achievementModificationApproval', {//学生缓考申请studentsSlowExaminationMaintain
            url: '/achievementModificationApproval',
            templateUrl: 'tpl/score/achievementModification/approval/index.html',
            controller: score_achievementApprovalController,
            ncyBreadcrumb: {
                label: '成绩修改审核'
            }
        }).state('home.common.achievementModificationMaintain', {//学生缓考申请studentsExemptExamination
            url: '/achievementModificationMaintain',
            templateUrl: 'tpl/score/achievementModification/maintain/index.html',
            controller: score_achievementMaintainController,
            ncyBreadcrumb: {
                label: '成绩修改统计'
            }
        }).state('home.common.achievementConfirmationApply', {//学生缓考申请studentsExemptExamination
            url: '/achievementConfirmationApply',
            templateUrl: 'tpl/score/achievementConfirmation/apply/index.html',
            controller: score_achievementConfirmApplyController,
            ncyBreadcrumb: {
                label: '成绩认定申请'
            }
        }).state('home.common.achievementConfirmationApproval', {//学生缓考申请studentsSlowExaminationMaintain
            url: '/achievementConfirmationApproval',
            templateUrl: 'tpl/score/achievementConfirmation/approval/index.html',
            controller: score_achievementConfirmApprovalController,
            ncyBreadcrumb: {
                label: '成绩认定审核'
            }
        }).state('home.common.achievementConfirmationMaintain', {//学生缓考申请studentsExemptExamination
            url: '/achievementConfirmationMaintain',
            templateUrl: 'tpl/score/achievementConfirmation/maintain/index.html',
            controller: score_achievementConfirmMaintainController,
            ncyBreadcrumb: {
                label: '成绩认定统计'
            }
        }).state('home.common.batchPrinting', {//学生缓考申请studentsExemptExamination
            url: '/batchPrinting',
            templateUrl: 'tpl/score/batchPrinting/index.html',
            controller: score_batchPrintingController,
            ncyBreadcrumb: {
                label: '成绩批量打印'
            }
        });
    }]);
})(window);


