;(function (window, undefined) {
    'use strict';
    // 考务管理模块
    hiocsApp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
        .state('home.common.invigilationTeachersManage', {//监考教师管理
            url: '/invigilationTeachersManage',
            templateUrl: 'tpl/exam/invigilationTeachersManage/index.html',
            controller: exam_invigilationTeachersManageController,
            ncyBreadcrumb: {
                label: '监考教师管理'
            }
        }).state('home.common.examQualificationManage', {//考试资格管理
            url: '/examQualificationManage',
            templateUrl: 'tpl/exam/finalExamManage/examQualificationManage/index.html',
            controller: exam_qualificationManageController,
            ncyBreadcrumb: {
                label: '正考考试资格管理'
            }
        }).state('home.common.finalExaminationListManage', {//正考安排管理-科目名单管理
            url: '/finalExaminationListManage',
            templateUrl: 'tpl/exam/finalExamManage/finalExamListManage/index.html',
            controller: finalExam_listManageController,
            ncyBreadcrumb: {
                label: '正考科目及名单管理'
            }
        }).state('home.common.examinationMethodManage', {//正考安排管理-考试方式确认管理
            url: '/examinationMethodManage',
            templateUrl: 'tpl/exam/finalExamManage/examMethodManage/index.html',
            controller: exam_methodManageController,
            ncyBreadcrumb: {
                label: '考试方式确认管理'
            }
        }).state('home.common.examinationCourseManage', {//正考安排管理-考试课程分工维护
            url: '/examinationCourseManage',
            templateUrl: 'tpl/exam/finalExamManage/examCourseManage/index.html',
            controller: exam_courseManageController,
            ncyBreadcrumb: {
                label: '正考考试课程分工维护'
            }
        }).state('home.common.examinationCourseCheck', {//正考安排管理-考试安排分工查看
            url: '/examinationCourseCheck',
            templateUrl: 'tpl/exam/finalExamManage/examCourseCheck/index.html',
            controller: exam_courseCheckController,
            ncyBreadcrumb: {
                label: '正考考试课程分工查看'
            }
        }).state('home.common.examClassManage', {//正考排考管理-考试班级管理
            url: '/examClassManage',
            templateUrl: 'tpl/exam/finalExamManage/examArrangeManage/examClassManage/index.html',
            controller: exam_classManageController,
            ncyBreadcrumb: {
                label: '正考考试班管理'
            }
        }).state('home.common.examDatetimeManage', {//正考排考管理-考试时间管理
            url: '/examDatetimeManage',
            templateUrl: 'tpl/exam/finalExamManage/examArrangeManage/examDatetimeManage/index.html',
            controller: exam_datetimeManageController,
            ncyBreadcrumb: {
                label: '正考考试时间管理'
            }
        }).state('home.common.examLocationManage', {//正考排考管理-考试地点管理
            url: '/examLocationManage',
            templateUrl: 'tpl/exam/finalExamManage/examArrangeManage/examLocationManage/index.html',
            controller: exam_locationManageController,
            ncyBreadcrumb: {
                label: '正考考试地点管理'
            }
        }).state('home.common.examineeLocationManage', {//正考排考管理-考生地点管理
            url: '/examineeLocationManage',
            templateUrl: 'tpl/exam/finalExamManage/examArrangeManage/examineeLocationManage/index.html',
            controller: exam_examineeLocationManageController,
            ncyBreadcrumb: {
                label: '正考考生地点管理'
            }
        }).state('home.common.examTeacherManage', {//正考排考管理-监考老师安排
            url: '/examTeacherManage',
            templateUrl: 'tpl/exam/finalExamManage/examArrangeManage/examTeacherManage/index.html',
            controller: exam_teacherManageController,
            ncyBreadcrumb: {
                label: '正考监考老师管理'
            }
        }).state('home.common.examArrangeCount', {//正考排考管理-考试安排统计
            url: '/examArrangeCount',
            templateUrl: 'tpl/exam/finalExamManage/examArrangeManage/examArrangeCount/index.html',
            controller: exam_examArrangeCountController,
            ncyBreadcrumb: {
                label: '正考考试安排统计'
            }
        }).state('home.common.examTeacherCount', {//正考安排管理-考监考老师统计
            url: '/examTeacherCount',
            templateUrl: 'tpl/exam/finalExamManage/examArrangeManage/examTeacherCount/index.html',
            controller: exam_teacherCountController,
            ncyBreadcrumb: {
                label: '正考监考老师统计'
            }
        }).state('home.common.examRecordManage', {//正考安排管理-考试记录管理
            url: '/examRecordManage',
            templateUrl: 'tpl/exam/finalExamManage/examArrangeManage/examRecordManage/index.html',
            controller: exam_recordManageController,
            ncyBreadcrumb: {
                label: '正考考试记录管理'
            }
        }).state('home.common.makeupExaminationListManage', {//补考安排管理-科目名单管理
            url: '/makeupExaminationListManage',
            templateUrl: 'tpl/exam/makeupExamManage/makeupExamListManage/index.html',
            controller: makeupExam_listManageController,
            ncyBreadcrumb: {
                label: '补考科目及名单管理'
            }
        }).state('home.common.makeupExaminationCourseManage', {//补考安排管理-科目安排分工维护
            url: '/makeupExaminationCourseManage',
            templateUrl: 'tpl/exam/makeupExamManage/makeupExamCourseManage/index.html',
            controller: makeupExam_courseManageController,
            ncyBreadcrumb: {
                label: '补考课程分工安排维护'
            }
        }).state('home.common.makeupExaminationCourseCheck', {//补考安排管理-科目安排分工查看
            url: '/makeupExaminationCourseCheck',
            templateUrl: 'tpl/exam/makeupExamManage/makeupExamCourseCheck/index.html',
            controller: makeupExam_courseCheckController,
            ncyBreadcrumb: {
                label: '补考课程分工安排查看'
            }
        }).state('home.common.makeupExamClassManage', {//补考排考管理-考试班管理
            url: '/makeupExamClassManage',
            templateUrl: 'tpl/exam/makeupExamManage/makeupExamArrangeManage/makeupExamClassManage/index.html',
            controller: makeupExam_classManageController,
            ncyBreadcrumb: {
                label: '补考考试班管理'
            }
        }).state('home.common.makeupExamDatetimeManage', {//补考排考管理-考试时间管理
            url: '/makeupExamDatetimeManage',
            templateUrl: 'tpl/exam/makeupExamManage/makeupExamArrangeManage/makeupExamDatetimeManage/index.html',
            controller: makeupExam_datetimeManageController,
            ncyBreadcrumb: {
                label: '补考考试时间管理'
            }
        }).state('home.common.makeupExamLocationManage', {//补考排考管理-考试地点管理
            url: '/makeupExamLocationManage',
            templateUrl: 'tpl/exam/makeupExamManage/makeupExamArrangeManage/makeupExamLocationManage/index.html',
            controller: makeupExam_locationManageController,
            ncyBreadcrumb: {
                label: '补考考试地点管理'
            }
        }).state('home.common.makeupExamineeLocationManage', {//补考排考管理-考生地点管理
            url: '/makeupExamineeLocationManage',
            templateUrl: 'tpl/exam/makeupExamManage/makeupExamArrangeManage/makeupExamineeLocationManage/index.html',
            controller: makeupExam_examineeLocationManageController,
            ncyBreadcrumb: {
                label: '补考考生地点管理'
            }
        }).state('home.common.makeupExamTeacherManage', {//补考排考管理=监考老师安排
            url: '/makeupExamTeacherManage',
            templateUrl: 'tpl/exam/makeupExamManage/makeupExamArrangeManage/makeupExamTeacherManage/index.html',
            controller: makeupExam_teacherManageController,
            ncyBreadcrumb: {
                label: '补考监考老师管理'
            }
        }).state('home.common.makeupExamArrangeCount', {//补考排考管理-考试安排统计
            url: '/makeupExamArrangeCount',
            templateUrl: 'tpl/exam/makeupExamManage/makeupExamArrangeManage/makeupExamArrangeCount/index.html',
            controller: makeupExam_examArrangeCountController,
            ncyBreadcrumb: {
                label: '补考考试安排统计'
            }
        }).state('home.common.makeupExamTeacherCount', {//补考排考管理-监考老师统计
            url: '/makeupExamTeacherCount',
            templateUrl: 'tpl/exam/makeupExamManage/makeupExamArrangeManage/makeupExamTeacherCount/index.html',
            controller: makeupExam_teacherCountController,
            ncyBreadcrumb: {
                label: '补考监考老师统计'
            }
        }).state('home.common.makeupExamRecordManage', {//补考排考管理-考试记录管理
            url: '/makeupExamRecordManage',
            templateUrl: 'tpl/exam/makeupExamManage/makeupExamArrangeManage/makeupExamRecordManage/index.html',
            controller: makeupExam_recordManageController,
            ncyBreadcrumb: {
                label: '补考考试记录管理'
            }
        }).state('home.common.clearExaminationCourseManage', {//清考安排管理-科目安排分工维护
            url: '/clearExamCourseManage',
            templateUrl: 'tpl/exam/clearExamManage/clearExamCourseManage/index.html',
            controller: clearExam_courseManageController,
            ncyBreadcrumb: {
                label: '清考考试课程分工维护'
            }
        }).state('home.common.clearExaminationCourseCheck', {//清考安排管理-科目安排分工查看
            url: '/clearExaminationCourseCheck',
            templateUrl: 'tpl/exam/clearExamManage/clearExamCourseCheck/index.html',
            controller: clearExam_courseCheckController,
            ncyBreadcrumb: {
                label: '清考考试课程分工查看'
            }
        }).state('home.common.clearExaminationListManage', {//清考安排管理-科目名单管理
            url: '/clearExaminationListManage',
            templateUrl: 'tpl/exam/clearExamManage/clearExamListManage/index.html',
            controller: clearExam_listManageController,
            ncyBreadcrumb: {
                label: '清考科目及名单管理'
            }
        }).state('home.common.examinationPaperNumberManage', {//试卷编号管理-正考试卷编号管理
            url: '/examinationPaperNumberManage',
            templateUrl: 'tpl/exam/finalExamManage/examPaperNumberManage/index.html',
            controller: exam_paperNumberManageController,
            ncyBreadcrumb: {
                label: '正考试卷编号管理'
            }
        }).state('home.common.makeupExaminationPaperNumberManage', {//试卷编号管理-补考试卷编号管理
            url: '/makeupExaminationPaperNumberManage',
            templateUrl: 'tpl/exam/makeupExamManage/makeupExamPaperNumberManage/index.html',
            controller: makeupExam_paperNumberManageController,
            ncyBreadcrumb: {
                label: '补考试卷编号管理'
            }
        }).state('home.common.studentsSlowExamination', {//学生缓考申请
            url: '/studentsSlowExamination',
            templateUrl: 'tpl/exam/studentsSlowExamination/apply/index.html',
            controller: score_studentSlowExamController,
            ncyBreadcrumb: {
                label: '学生缓考申请'
            }
        }).state('home.common.studentsSlowExaminationApproval', {//学生缓考申请studentsSlowExaminationMaintain
            url: '/studentsSlowExaminationApproval',
            templateUrl: 'tpl/exam/studentsSlowExamination/approval/index.html',
            controller: score_slowApprovalController,
            ncyBreadcrumb: {
                label: '学生缓考审批'
            }
        }).state('home.common.studentsSlowExaminationMaintain', {//学生缓考申请studentsExemptExamination
            url: '/studentsSlowExaminationMaintain',
            templateUrl: 'tpl/exam/studentsSlowExamination/maintain/index.html',
            controller: score_slowMaintainController,
            ncyBreadcrumb: {
                label: '学生缓考维护'
            }
        }).state('home.common.studentExemptExaminationApply', {//学生缓考申请studentsExemptExamination
            url: '/studentExemptExaminationApply',
            templateUrl: 'tpl/exam/studentExemptExamination/apply/index.html',
            controller: score_studentExemptExamController,
            ncyBreadcrumb: {
                label: '学生免考申请'
            }
        }).state('home.common.studentsExemptExaminationApproval', {//学生缓考申请studentsSlowExaminationMaintain
            url: '/studentsExemptExaminationApproval',
            templateUrl: 'tpl/exam/studentExemptExamination/approval/index.html',
            controller: score_exemptApprovalController,
            ncyBreadcrumb: {
                label: '学生免考审批'
            }
        }).state('home.common.studentsExemptExaminationMaintain', {//学生缓考申请studentsExemptExamination
            url: '/studentsExemptExaminationMaintain',
            templateUrl: 'tpl/exam/studentExemptExamination/maintain/index.html',
            controller: score_exemptMaintainController,
            ncyBreadcrumb: {
                label: '学生免考维护'
            }
        });
    }]);
})(window);


