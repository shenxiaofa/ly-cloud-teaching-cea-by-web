/**
 * Created by Administrator on 2018/1/18.
 */
;(function (window, undefined) {
    'use strict';

    window.arrange_stuFullTimeInfoManageAddController = function ($compile, $scope, $uibModal,$view, $rootScope, $window,$timeout,$state,$http, arrange_stuFullTimeInfoManageService, formVerifyService,alertService, app) {
        $scope.rightHeaderHeight = $(".header").height()+20;
        $scope.tabHeaderHeight = $(".nav-tabs").height();+40;
        // $("#rollModel").css("height", $window.innerHeight-$scope.rightHeaderHeight-$scope.tabHeaderHeight );
        // $("#easyModel").css("height", $window.innerHeight-$scope.rightHeaderHeight-$scope.tabHeaderHeight );
        var ss = $window.innerHeight;
        // 公告类型查询对象
        $scope.stuFullTimeInfo = {};
        //初始化添加数据
        initAddCondition($scope, $window, $rootScope, app, $compile, $http,$timeout,$state, arrange_stuFullTimeInfoManageService,formVerifyService, alertService);
    };
    arrange_stuFullTimeInfoManageAddController.$inject = ['$compile', '$scope', '$uibModal', '$view','$rootScope', '$window','$timeout','$state','$http', 'arrange_stuFullTimeInfoManageService', 'formVerifyService','alertService', 'app'];

    //初始化添加数据
    var initAddCondition = function ($scope, $window, $rootScope, app, $compile, $http,$timeout,$state, arrange_stuFullTimeInfoManageService, formVerifyService, alertService) {
        // 出生日期参数配置
        $scope.bornTimeOptions = {
            opened: false,
            open: function () {
                $scope.bornTimeOptions.opened = true;
            }
        };
        //入学日期参数配置
        $scope.goSchooleTimeOptions = {
            opened: false,
            open: function () {
                $scope.goSchooleTimeOptions.opened = true;
            }
        };
        // 预计毕业日期参数配置
        $scope.expectGraduateTimeOptions = {
            opened: false,
            open: function () {
                $scope.expectGraduateTimeOptions.opened = true;
            }
        };
        // 毕业日期参数配置
        $scope.graduateTimeOptions = {
            opened: false,
            open: function () {
                $scope.graduateTimeOptions.opened = true;
            }
        };
        // 身份证件有效期参数配置
        $scope.idCardEffectTimeOptions = {
            opened: false,
            open: function () {
                $scope.idCardEffectTimeOptions.opened = true;
            }
        };
        //查询身份证证件类型
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFullTimeInfo/tableview_stuFullTimeInfo_majorType.json",
        }).then(function (response) {
            $scope.idCardTypeList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询国籍地区
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFullTimeInfo/tableview_stuFullTimeInfo_nationCode.json",
        }).then(function (response) {
            $scope.countryCodeList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询性别数据
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_sex.json",
        }).then(function (response) {
            $scope.sexList = response.data.data.list;//性别

        }, function (response) {
            console.log(response);
        });
        //查询政治面貌数据
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFullTimeInfo/tableview_stuFullTimeInfo_politicalStatus.json",
        }).then(function (response) {
            $scope.politicalStatusList = response.data.data.list;//性别

        }, function (response) {
            console.log(response);
        });
        //查询民族数据
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFullTimeInfo/tableview_stuFullTimeInfo_nationCode.json",
        }).then(function (response) {
            $scope.nationList = response.data.data.list;//性别

        }, function (response) {
            console.log(response);
        });
        //查询学院数据
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_college.json",
        }).then(function (response) {
            $scope.deptList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询系部数据
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_college.json",
        }).then(function (response) {
            $scope.departmentList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询专业大类数据
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFullTimeInfo/tableview_stuFullTimeInfo_majorType.json",
        }).then(function (response) {
            $scope.majorTypeList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询专业方向数据
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_profession.json",
        }).then(function (response) {
            $scope.majorSubjectList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询年 级数据
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_grade.json",
        }).then(function (response) {
            $scope.gradeList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询年级专业方向数据
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_gradleProfession.json",
        }).then(function (response) {
            $scope.classMajorList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询班 级数据
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_class.json",
        }).then(function (response) {
            $scope.classList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询学籍状态数据
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFullTimeInfo/tableview_stuFullTimeInfo_studyStatus.json",
        }).then(function (response) {
            $scope.startStatusList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询是否在校数据
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_atSchoolStatus.json",
        }).then(function (response) {
            $scope.schoolStatusList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询是否在籍数据
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_atSchoolStatus.json",
        }).then(function (response) {
            $scope.nationStatusList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询学习形式
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_atSchoolStatus.json",
        }).then(function (response) {
            $scope.studyFormList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询培养层次
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_atSchoolStatus.json",
        }).then(function (response) {
            $scope.developLevelList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询入学方式数据
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_entryWay.json",
        }).then(function (response) {
            $scope.schoolWayList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询生源地
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_entryWay.json",
        }).then(function (response) {
            $scope.orginCodeList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询录取方式
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_entryWay.json",
        }).then(function (response) {
            $scope.originEnrollCodeList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询曾用身份证件类型
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_entryWay.json",
        }).then(function (response) {
            $scope.oldIdCardTypeList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询婚姻状况
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_entryWay.json",
        }).then(function (response) {
            $scope.marrayStatusList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询健康状况
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_entryWay.json",
        }).then(function (response) {
            $scope.healthyStatusList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询信仰宗教
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_entryWay.json",
        }).then(function (response) {
            $scope.religionList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询血型
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_entryWay.json",
        }).then(function (response) {
            $scope.bloodTypeList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询出生地
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_entryWay.json",
        }).then(function (response) {
            $scope.bornAreaList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询籍贯
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_entryWay.json",
        }).then(function (response) {
            $scope.originPlaceList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询港澳台侨外
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_entryWay.json",
        }).then(function (response) {
            $scope.overseasList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询培养方式
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_entryWay.json",
        }).then(function (response) {
            $scope.developWayList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询授予学位类别
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_entryWay.json",
        }).then(function (response) {
            $scope.gradDegreeCodeList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询考生类别
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_entryWay.json",
        }).then(function (response) {
            $scope.examStuTypeList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询毕业类别
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_entryWay.json",
        }).then(function (response) {
            $scope.originGradTypeCodeList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });

        $scope.ok = function (form) {
            // 处理前验证
            if (form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            }
            ;
            $rootScope.showLoading = true; // 开启加载提示
            // arrange_stuFullTimeInfoManageService.add($scope.stuFullTimeInfo, 'stuFullTimeInfo:insert', function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
            //     if (error) {
            //         alertService(message);
            //         return;
            //     }
            //     $uibModalInstance.close();
            //     angular.element('#stuFullTimeInfoTable').bootstrapTable('refresh');
                alertService('success', '新增成功');
            // 跳转到首页页面
            $("body").fadeOut();
            $timeout(function () {
                $state.go("home.common.stuFullTimeInfoManage" );
            }, 500);
            $("body").fadeIn(800);
            // });
        };
        $scope.close = function () {
            // 跳转到首页页面
            $("body").fadeOut();
            $timeout(function () {
                $state.go("home.common.stuFullTimeInfoManage" );
            }, 500);
            $("body").fadeIn(800);
        };

    };

})(window);