/**
 * Created by Administrator on 2018/1/17.
 */
;(function (window, undefined) {
    'use strict';

    window.arrange_stuRewPunishInfoManageController = function ($compile, $scope, $uibModal, $rootScope, $window, $http, arrange_stuRewPunishInfoManageService, baseinfo_generalService, alertService, app) {
        //监听屏幕宽度改变搜索框的样式
        $scope.rightContentHeight = $(".right-content-search").height() + 20 - 40;
        $scope.rightHeaderHeight = $(".header").height() + 20;
        $scope.rightTableToolbarHeight = $("#stuRewPunishInfo_toolbar").height() + 10;
        $scope.table_height = $window.innerHeight - ($scope.rightContentHeight + 40 + $scope.rightHeaderHeight + $scope.rightTableToolbarHeight);
        window.onresize = function () {
            $scope.rightContentHeight = $(".right-content-search").height() + 20 - 40;
            $scope.rightHeaderHeight = $(".header").height() + 20;
            $scope.rightTableToolbarHeight = $("#stuRewPunishInfo_toolbar").height() + 10;
            $scope.table_height = $window.innerHeight - ($scope.rightContentHeight + 40 + $scope.rightHeaderHeight + $scope.rightTableToolbarHeight);
        };
        // 学生惩处查询对象
        $scope.stuRewPunishInfo = {};
        //初始化搜索数据
        initIndexSearch($scope, $window, $rootScope, app, $compile, $http, arrange_stuRewPunishInfoManageService, baseinfo_generalService, alertService);
        // 初始化表格
        initIndexTable($scope, $window, $rootScope, app, $compile, arrange_stuRewPunishInfoManageService, alertService);

        // 打开新增面板
        $scope.openAdd = function () {
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/student/statusInfoManage/stuRewPunishInfoManage/add.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return $scope.stuRewPunishInfo;
                    }
                },
                controller: openAddController
            });
        };
        // 打开修改面板
        $scope.openModify = function (row) {
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/student/statusInfoManage/stuRewPunishInfoManage/modify.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return row;
                    }
                },
                controller: openModifyController
            });
        };
        // 打开删除面板
        $scope.openDelete = function (row) {
            var rows = $('#stuRewPunishInfoManageTable').bootstrapTable('getSelections');
            if (rows.length == 0) {
                //打开提示框
                alertService("warn", "请选中要删除的记录!");
                return false;
            }
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/student/statusInfoManage/stuRewPunishInfoManage/delete.html',
                size: '',
                resolve: {
                    item: function () {
                        return rows;
                    }
                },
                controller: openDeleteController
            });
        };
    };
    arrange_stuRewPunishInfoManageController.$inject = ['$compile', '$scope', '$uibModal', '$rootScope', '$window', '$http', 'arrange_stuRewPunishInfoManageService', 'baseinfo_generalService', 'alertService', 'app'];


    // 添加控制器
    var openAddController = function ($rootScope, $compile, $scope, $uibModalInstance, $uibModal, $filter, $http, arrange_stuRewPunishInfoManageService, formVerifyService, baseinfo_generalService, alertService, app) {

        // 初始化数据
        $scope.stuRewPunishInfo = {
            rewPunCcode: "",
            rewPunSutName: "",
            rewPunGender: "",
            rewPunSchrollState: "",
            rewPunWhetherAtsch: "",
            rewPunWheGraduate: '1',
            rewPunWheDegree: '1',
            rewPunSource: '',
            rewPunSourceName: '',
            rewPunCode: '',
            rewPunName: ''
        };

        // 违纪日期参数配置
        $scope.rewPundateOptions = {
            opened: false,
            open: function () {
                $scope.rewPundateOptions.opened = true;
            }
        };
        // 处分日期参数配置
        $scope.rewPunTimeOptions = {
            opened: false,
            open: function () {
                $scope.rewPunTimeOptions.opened = true;
            }
        };
        // 处分撤销日期参数配置
        $scope.rewPunRepealTimeOptions = {
            opened: false,
            open: function () {
                $scope.rewPunRepealTimeOptions.opened = true;
            }
        };
        //查询违纪类别数据，现在是假数据
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuRewPunishInfo/tableview_stuRewPunishInfo_rewPunType.json",
        }).then(function (response) {
            $scope.rewPunTypeCodeList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询处分来源数据，现在是假数据
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuRewPunishInfo/tableview_stuRewPunishInfo_rewPunSource.json",
        }).then(function (response) {
            $scope.rewPunSourceList = response.data.data.list;
            var html = '' +
                ' <select ng-model="stuRewPunishInfo.rewPunSource" name="rewPunSource" ng-options=" rewPunSource.dataNumber as rewPunSource.name for rewPunSource in rewPunSourceList"  ui-chosen="stuRewPunishInfoAdd_form.rewPunSource" ng-required="true" id="rewPunSource" class="form-control" ui-jq="chosen" ui-options="{search_contains: true}">' +
                '<option value="">==请选择==</option>' +
                '</select>';
            angular.element("#rewPunSource").parent().empty().append(html);
            $compile(angular.element("#rewPunSource").parent().contents())($scope);
        }, function (response) {
            console.log(response);
        });
        $scope.$watch('stuRewPunishInfo.rewPunSource', function (newValue, oldValue) {
            $scope.stuRewPunishInfo.rewPunSourceName = $("#rewPunSource").find("option:selected").text();
        });
        //查询处分名称数据，现在是假数据
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuRewPunishInfo/tableview_stuRewPunishInfo_rewPunCode.json",
        }).then(function (response) {
            $scope.rewPunCodeList = response.data.data.list;
            var html = '' +
                ' <select ng-model="stuRewPunishInfo.rewPunCode" name="rewPunCode" ng-options=" rewPunCode.dataNumber as rewPunCode.name for rewPunCode in rewPunCodeList" ui-chosen="stuRewPunishInfoAdd_form.rewPunCode" ng-required="true" id="rewPunCode" class="form-control" ui-jq="chosen" ui-options="{search_contains: true}">' +
                '<option value="">==请选择==</option>' +
                '</select>';
            angular.element("#rewPunCode").parent().empty().append(html);
            $compile(angular.element("#rewPunCode").parent().contents())($scope);
        }, function (response) {
            console.log(response);
        });
        $scope.$watch('stuRewPunishInfo.rewPunCode', function (newValue, oldValue) {
            $scope.stuRewPunishInfo.rewPunName = $("#rewPunCode").find("option:selected").text();
        });
        //查询处分发起部门数据
        baseinfo_generalService.findDepartmentNamesBox(function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.rewPunSponDeparList = data.data;
            $rootScope.$log.debug(data);
            var html = '' +
                '  <select ng-model="stuRewPunishInfo.rewPunSponDepar" name="rewPunSponDepar" ng-options="rewPunSponDepar.departmentNumber as rewPunSponDepar.departmentName for rewPunSponDepar in rewPunSponDeparList" ui-chosen="stuRewPunishInfoAdd_form.rewPunSponDepar" ng-required="true" id="rewPunSponDepar" class="form-control" ui-jq="chosen" ui-options="{search_contains: true}">' +
                '<option value="">==请选择==</option>' +
                '</select>';
            angular.element("#rewPunSponDepar").parent().empty().append(html);
            $compile(angular.element("#rewPunSponDepar").parent().contents())($scope);
        });
        //查询处分部门数据
        baseinfo_generalService.findDepartmentNamesBox(function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.rewPunDeparList = data.data;
            $rootScope.$log.debug(data);
            var html = '' +
                ' <select ng-model="stuRewPunishInfo.rewPunDepar" name="rewPunDepar" ng-options="rewDepar.departmentNumber as rewDepar.departmentName for rewDepar in rewPunDeparList" ui-chosen="stuRewPunishInfoAdd_form.rewPunDepar" ng-required="true" id="rewPunDepar" class="form-control" ui-jq="chosen" ui-options="{search_contains: true}">' +
                '<option value="">==请选择==</option>' +
                '</select>';
            angular.element("#rewPunDepar").parent().empty().append(html);
            $compile(angular.element("#rewPunDepar").parent().contents())($scope);
        });
        $scope.findMsg = function () {
            //请求获取用户信息
            $http({
                method: "get",
                params: {"rewPunCcode": $scope.stuRewPunishInfo.rewPunCcode},
                // url: "/student-status/new-student/select"
                url: "data_test/student/stuRewPunishInfo/tableview_stuFlagInfo_userInfo.json",
            }).then(function (response) {
                var stuInfo = response.data.data.list;
                $scope.stuRewPunishInfo.rewPunSutName = stuInfo[0].rewPunSutName;
                $scope.stuRewPunishInfo.rewPunGender = stuInfo[0].rewPunGender;
                $scope.stuRewPunishInfo.rewPunSchrollState = stuInfo[0].rewPunSchrollState;
                $scope.stuRewPunishInfo.rewPunWhetherAtsch = stuInfo[0].rewPunWhetherAtsch;
                $scope.stuRewPunishInfo.rewPunCollege = stuInfo[0].rewPunCollege;
                $scope.stuRewPunishInfo.rewPunGradeMajor = stuInfo[0].rewPunGradeMajor;
            }, function (response) {
                console.log(response);
            });
        }
        $scope.ok = function (form) {
            //转日期格式
            $scope.stuRewPunishInfo.rewPundate = $filter("date")($scope.stuRewPunishInfo.rewPundate, app.date.formatDate);
            $scope.stuRewPunishInfo.rewPunTime = $filter("date")($scope.stuRewPunishInfo.rewPunTime, app.date.formatDate);
            $scope.stuRewPunishInfo.rewPunRepealTime = $filter("date")($scope.stuRewPunishInfo.rewPunRepealTime, app.date.formatDate);
            // 处理前验证
            if (form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            }
            ;
            $rootScope.showLoading = true; // 开启加载提示
            arrange_stuRewPunishInfoManageService.add($scope.stuRewPunishInfo, 'stuRewPunishInfo:insert', function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                angular.element('#stuRewPunishInfoManageTable').bootstrapTable('refresh');
                alertService('success', '新增成功');
            });
        };
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    };
    openAddController.$inject = ['$rootScope', '$compile', '$scope', '$uibModalInstance', '$uibModal', '$filter', '$http', 'arrange_stuRewPunishInfoManageService', 'formVerifyService', 'baseinfo_generalService', 'alertService', 'app'];
    // 修改控制器
    var openModifyController = function ($rootScope, $timeout, $compile, $scope, $uibModalInstance, item, $filter, $http, arrange_stuRewPunishInfoManageService, baseinfo_generalService, alertService, formVerifyService, app) {
        // 初始化数据
        $scope.stuRewPunishInfo = {
            rewPunId: item.rewPunId,
            rewPunCcode: item.rewPunCcode,
            rewPunSutName: item.rewPunSutName,
            rewPunGender: item.rewPunGender,
            rewPunSchrollState: item.rewPunSchrollState,
            rewPunWhetherAtsch: item.rewPunWhetherAtsch,
            rewPunCollege: item.rewPunCollege,
            rewPunGradeMajor: item.rewPunGradeMajor,
            rewPundate: new Date(item.rewPundate),
            rewPunTypeCode: item.rewPunTypeCode,
            rewPunBriefing: item.rewPunBriefing,
            rewPunSource: item.rewPunSource,
            rewPunCode: item.rewPunCode,
            rewPunTime: new Date(item.rewPunTime),
            rewPunProof: item.rewPunProof,
            rewPunRepealTime: new Date(item.rewPunRepealTime),
            rewPunRepealProof: item.rewPunRepealProof,
            rewPunSponDepar: item.rewPunSponDepar,
            rewPunDepar: item.rewPunDepar,
            rewPunWheGraduate: item.rewPunWheGraduate == 0 ? '0' : '1',
            rewPunWheDegree: item.rewPunWheDegree == 0 ? '0' : '1',
            rewPunAdapt: item.rewPunAdapt,
            rewPunMoney: item.rewPunMoney,
            rewPunCause: item.rewPunCause
        };
        // 违纪日期参数配置
        $scope.rewPundateOptions = {
            opened: false,
            open: function () {
                $scope.rewPundateOptions.opened = true;
            }
        };
        // 处分日期参数配置
        $scope.rewPunTimeOptions = {
            opened: false,
            open: function () {
                $scope.rewPunTimeOptions.opened = true;
            }
        };
        // 处分撤销日期参数配置
        $scope.rewPunRepealTimeOptions = {
            opened: false,
            open: function () {
                $scope.rewPunRepealTimeOptions.opened = true;
            }
        };

        //查询违纪类别数据，现在是假数据
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuRewPunishInfo/tableview_stuRewPunishInfo_rewPunType.json",
        }).then(function (response) {
            $scope.rewPunTypeCodeList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询处分来源数据，现在是假数据
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuRewPunishInfo/tableview_stuRewPunishInfo_rewPunSource.json",
        }).then(function (response) {
            $scope.rewPunSourceList = response.data.data.list;
            var html = '' +
                ' <select ng-model="stuRewPunishInfo.rewPunSource" name="rewPunSource" ng-options=" rewPunSource.dataNumber as rewPunSource.name for rewPunSource in rewPunSourceList"  ui-chosen="stuRewPunishInfoEdit_form.rewPunSource" ng-required="true" id="rewPunSource" class="form-control" ui-jq="chosen" ui-options="{search_contains: true}">' +
                '<option value="">==请选择==</option>' +
                '</select>';
            angular.element("#rewPunSource").parent().empty().append(html);
            $compile(angular.element("#rewPunSource").parent().contents())($scope);
        }, function (response) {
            console.log(response);
        });
        $scope.$watch('stuRewPunishInfo.rewPunSource', function (newValue, oldValue) {
            $scope.stuRewPunishInfo.rewPunSourceName = $("#rewPunSource").find("option:selected").text();
        });
        //查询处分名称数据，现在是假数据
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuRewPunishInfo/tableview_stuRewPunishInfo_rewPunCode.json",
        }).then(function (response) {
            $scope.rewPunCodeList = response.data.data.list;

            var html = '' +
                ' <select ng-model="stuRewPunishInfo.rewPunCode" name="rewPunCode" ng-options=" rewPunCode.dataNumber as rewPunCode.name for rewPunCode in rewPunCodeList" ui-chosen="stuRewPunishInfoEdit_form.rewPunCode" ng-required="true" id="rewPunCode" class="form-control" ui-jq="chosen" ui-options="{search_contains: true}">' +
                '<option value="">==请选择==</option>' +
                '</select>';
            angular.element("#rewPunCode").parent().empty().append(html);
            $compile(angular.element("#rewPunCode").parent().contents())($scope);
        }, function (response) {
            console.log(response);
        });
        $scope.$watch('stuRewPunishInfo.rewPunCode', function (newValue, oldValue) {
            $scope.stuRewPunishInfo.rewPunName = $("#rewPunCode").find("option:selected").text();
        });
        //查询处分发起部门数据
        baseinfo_generalService.findDepartmentNamesBox(function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.rewPunSponDeparList = data.data;
            $rootScope.$log.debug(data);
            var html = '' +
                '  <select ng-model="stuRewPunishInfo.rewPunSponDepar" name="rewPunSponDepar" ng-options="rewPunSponDepar.departmentNumber as rewPunSponDepar.departmentName for rewPunSponDepar in rewPunSponDeparList" ui-chosen="stuRewPunishInfoEdit_form.rewPunSponDepar" ng-required="true" id="rewPunSponDepar" class="form-control" ui-jq="chosen" ui-options="{search_contains: true}">' +
                '<option value="">==请选择==</option>' +
                '</select>';
            angular.element("#rewPunSponDepar").parent().empty().append(html);
            $compile(angular.element("#rewPunSponDepar").parent().contents())($scope);
        });
        //查询处分部门数据
        baseinfo_generalService.findDepartmentNamesBox(function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.rewPunDeparList = data.data;
            $rootScope.$log.debug(data);
            var html = '' +
                ' <select ng-model="stuRewPunishInfo.rewPunDepar" name="rewPunDepar" ng-options="rewDepar.departmentNumber as rewDepar.departmentName for rewDepar in rewPunDeparList" ui-chosen="stuRewPunishInfoEdit_form.rewPunDepar" ng-required="true" id="rewPunDepar" class="form-control" ui-jq="chosen" ui-options="{search_contains: true}">' +
                '<option value="">==请选择==</option>' +
                '</select>';
            angular.element("#rewPunDepar").parent().empty().append(html);
            $compile(angular.element("#rewPunDepar").parent().contents())($scope);
        });


        $scope.ok = function (form) {
            //转日期格式
            $scope.stuRewPunishInfo.rewPundate = $filter("date")($scope.stuRewPunishInfo.rewPundate, app.date.formatDate);
            $scope.stuRewPunishInfo.rewPunTime = $filter("date")($scope.stuRewPunishInfo.rewPunTime, app.date.formatDate);
            $scope.stuRewPunishInfo.rewPunRepealTime = $filter("date")($scope.stuRewPunishInfo.rewPunRepealTime, app.date.formatDate);
            // 处理前验证
            if (form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            }
            ;
            $rootScope.showLoading = true; // 开启加载提示
            arrange_stuRewPunishInfoManageService.update($scope.stuRewPunishInfo, 'stuRewPunishInfo:update', function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                angular.element('#stuRewPunishInfoManageTable').bootstrapTable('refresh');
                alertService('success', '修改成功');
            });
        };
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    };
    openModifyController.$inject = ['$rootScope', '$timeout', '$compile', '$scope', '$uibModalInstance', 'item', '$filter', '$http', 'arrange_stuRewPunishInfoManageService', 'baseinfo_generalService', 'alertService', 'formVerifyService', 'app'];


    // 删除控制器
    var openDeleteController = function ($rootScope, $scope, $uibModalInstance, item, arrange_stuRewPunishInfoManageService, alertService) {
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {
            $scope.ids = [];
            angular.forEach(item, function (data, index, array) {
                $scope.ids.push(data.rewPunId);
            });
            $rootScope.showLoading = true; // 开启加载提示
            arrange_stuRewPunishInfoManageService.delete($scope.ids, 'stuRewPunishInfo:delete', function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#stuRewPunishInfoManageTable').bootstrapTable('refresh');
                alertService('success', '删除成功');
            });
            $uibModalInstance.close();
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openDeleteController.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'item', 'arrange_stuRewPunishInfoManageService', 'alertService'];

    //初始化搜索数据
    var initIndexSearch = function ($scope, $window, $rootScope, app, $compile, $http, arrange_stuRewPunishInfoManageService, baseinfo_generalService, alertService) {
        // 处分日期参数配置
        $scope.rewPunTimeOptions = {
            opened: false,
            open: function () {
                $scope.rewPunTimeOptions.opened = true;
            }
        };
        //查询性别数据
        baseinfo_generalService.findcodedataNames({datableNumber: "XBM"}, function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.rewPunGenderList = data.data;//性别
            $rootScope.$log.debug(data);

        });
        //查询学院数据
        baseinfo_generalService.findDepartmentNamesBox(function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.rewPunCollegeList = data.data;
            $rootScope.$log.debug(data);

        });
        //查询年 级数据
        baseinfo_generalService.gradeList(function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.rewPunGradeList = data.data;
            $rootScope.$log.debug(data);

        });
        //查询专业方向数据 参数0
        baseinfo_generalService.professionDirectionPull({majorProfessionDircetion: "0"}, function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.rewPunMajorList = data.data;
            $rootScope.$log.debug(data);

        });
        //查询年级专业方向数据,这里有联动
        baseinfo_generalService.gradeProfessionPull({
            pageNo: "1",
            pageSize: "50",
            param: {
                majorGradeProfession: "0",
                grade: "",
                GLDWH: ""
            }
        }, function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.rewPunGradeMajorList = data.data;
            $rootScope.$log.debug(data);

        });
        $scope.$watch('stuFlagInfo.grade', function (newValue, oldValue) {
            if (newValue == null) {
                baseinfo_generalService.gradeProfessionPull({
                    pageNo: "1",
                    pageSize: "50",
                    param: {
                        majorGradeProfession: "0",
                        grade: "",
                        GLDWH: ""
                    }
                }, function (error, message, data) {
                    if (error) {
                        alertService(message);
                        return;
                    }
                    $scope.rewPunGradeMajorList = data.data;
                    $rootScope.$log.debug(data);

                });
                return;
            }
            baseinfo_generalService.gradeProfessionPull({
                pageNo: "1",
                pageSize: "50",
                param: {
                    majorGradeProfession: "0",
                    grade: newValue,
                    GLDWH: ""
                }
            }, function (error, message, data) {
                if (error) {
                    alertService(message);
                    return;
                }
                $scope.rewPunGradeMajorList = data.data;
                $rootScope.$log.debug(data);

            });
        });
        //查询违纪类别数据
        baseinfo_generalService.findcodedata({
            pageNo: "1",
            pageSize: "1000",
            total: false,
            param: {
                datableNumber: "",//这里要写一个代码
                dataNumber: "",
                dataName: "",
                dataSubjection: ""
            }
        }, function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.rewPunTypeCodeList = data.data.rows;
            $rootScope.$log.debug(data);

        });
        // $http({
        //     method: "get",
        //     // url: "/student-status/new-student/select"
        //     url: "data_test/student/stuRewPunishInfo/tableview_stuRewPunishInfo_rewPunType.json",
        // }).then(function (response) {
        //     $scope.rewPunTypeCodeList = response.data.data.list;
        //
        // }, function (response) {
        //     console.log(response);
        // });
        //查询处分来源数据
        baseinfo_generalService.findcodedata({
            pageNo: "1",
            pageSize: "1000",
            total: false,
            param: {
                datableNumber: "",//这里要写一个代码
                dataNumber: "",
                dataName: "",
                dataSubjection: ""
            }
        }, function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.rewPunSourceList = data.data.rows;
            $rootScope.$log.debug(data);

        });
        // $http({
        //     method: "get",
        //     // url: "/student-status/new-student/select"
        //     url: "data_test/student/stuRewPunishInfo/tableview_stuRewPunishInfo_rewPunSource.json",
        // }).then(function (response) {
        //     $scope.rewPunSourceList = response.data.data.list;
        //
        // }, function (response) {
        //     console.log(response);
        // });
        //查询处分名称数据
        baseinfo_generalService.findcodedata({
            pageNo: "1",
            pageSize: "1000",
            total: false,
            param: {
                datableNumber: "",//这里要写一个代码
                dataNumber: "",
                dataName: "",
                dataSubjection: ""
            }
        }, function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.rewPunCodeList = data.data.rows;
            $rootScope.$log.debug(data);

        });
        // $http({
        //     method: "get",
        //     // url: "/student-status/new-student/select"
        //     url: "data_test/student/stuRewPunishInfo/tableview_stuRewPunishInfo_rewPunCode.json",
        // }).then(function (response) {
        //     $scope.rewPunCodeList = response.data.data.list;
        //
        // }, function (response) {
        //     console.log(response);
        // });
        //查询处分部门数据
        baseinfo_generalService.findDepartmentNamesBox(function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.rewPunDeparList = data.data;
            $rootScope.$log.debug(data);
            var html = '' +
                '  <select ng-model="stuRewPunishInfo.rewPunDepar" ng-options="rewPunDepar.departmentNumber as rewPunDepar.departmentName for rewPunDepar in rewPunDeparList" name="rewPunDepar" id="rewPunDepar_search" class="form-control" ui-jq="chosen" ui-options="{search_contains: true}">' +
                '<option value="">==请选择==</option>' +
                '</select>';
            angular.element("#rewPunDepar_search").parent().empty().append(html);
            $compile(angular.element("#rewPunDepar_search").parent().contents())($scope);
        });
        // $http({
        //     method: "get",
        //     // url: "/student-status/new-student/select"
        //     url: "data_test/student/stuRewPunishInfo/tableview_stuFlagInfo_rewPunDepar.json",
        // }).then(function (response) {
        //     $scope.rewPunDeparList = response.data.data.list;
        //
        // }, function (response) {
        //     console.log(response);
        // });
        //是否按时毕业
        $scope.rewPunWheGraduateList = [{name: "是", value: "1"}, {name: "否", value: "0"}];
        //是否获得学位
        $scope.rewPunWheDegreeList = [{name: "是", value: "1"}, {name: "否", value: "0"}];
        //是否在校
        $scope.rewPunWhetherAtschList = [{name: "是", value: "1"}, {name: "否", value: "0"}];

    };
    // 初始化表格
    var initIndexTable = function ($scope, $window, $rootScope, app, $compile, arrange_stuRewPunishInfoManageService, alertService) {
        // 表格的高度
        // $scope.table_height = $window.innerHeight - 296;
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNum: params.pageNumber  //页码
            };
            // 去除为 null 或 "" 值的查询字段
            var stuRewPunishInfoQuery = {};
            angular.forEach($scope.stuRewPunishInfo, function (data, index, array) {
                if (data) {
                    stuRewPunishInfoQuery[index] = data;
                }
            });
            $rootScope.$log.debug(angular.extend(pageParam, stuRewPunishInfoQuery));
            return angular.extend(pageParam, stuRewPunishInfoQuery);
        };
        $scope.stuRewPunishInfoManageTable = {
            // url: 'data_test/student/tableview_stuRewPunishInfo.json',
            url: app.api.address + '/student/stuRewPunish/list',
            headers: {
                permission: "stuRewPunishInfo:query"
            },
            method: 'post',
            cache: false,
            height: $scope.table_height,
            toolbar: '#stuRewPunishInfo_toolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber: 1,
            pageList: [10, 20, 30, 50, 100], // 设置可供选择的页面数据条数
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            sortName: 'dwh', // 默认排序字段
            sortOrder: 'asc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            sortable: false, // 禁用排序
            idField: "dwh", // 指定主键列
            uniqueId: "dwh", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParams,//传递参数（*）
            search: false,
            showColumns: true,
            showRefresh: true,
            responseHandler: function (response) {
                return {
                    total: response.data.total,
                    rows: response.data.rows
                };
            },
            onLoadSuccess: function () {
                $compile(angular.element('#stuRewPunishInfoManageTable').contents())($scope);
            },
            onColumnSwitch: function (field, checked) {
                var visibleColumns = $('#stuRewPunishInfoManageTable').bootstrapTable('getVisibleColumns', "");
                if (visibleColumns.length <= 8) {
                    $('#stuRewPunishInfoManageTable').removeClass("tableScroll");
                } else {
                    $('#stuRewPunishInfoManageTable').addClass("tableScroll");
                }
                $compile(angular.element('#stuRewPunishInfoManageTable').contents())($scope);
            },
            onCheckAll: function (rows) {
                return false;
            },
            columns: [
                {checkbox: true, align: "center", valign: "middle", width: "5%"},
                {
                    field: "",
                    title: "序号",
                    align: "center",
                    valign: "middle",
                    width: "5%",
                    formatter: function (value, row, index) {
                        return index + 1;
                    }
                },
                {field: "rewPunCcode", title: '学号', align: "center", valign: "middle"},
                {field: "rewPunSutName", title: '姓名', align: "center", valign: "middle"},
                {field: "rewPunGender", title: '性别', align: "center", valign: "middle"},
                {field: "rewPunCollege", title: '学院', align: "center", valign: "middle"},
                {field: "rewPunMajor", title: '专业方向', align: "center", valign: "middle"},
                {field: "rewPunGradeMajor", title: '年级专业方向', align: "center", valign: "middle"},
                {field: "rewPunGrade", title: '年级', align: "center", valign: "middle"},
                {field: "rewPundate", title: '违纪日期', align: "center", valign: "middle"},
                {field: "rewPunBriefing", title: '违纪简况', align: "center", valign: "middle"},
                {field: "rewPunTypeCode", title: '违纪类别', align: "center", valign: "middle"},
                {field: "rewPunSource", title: '处分来源', align: "center", valign: "middle"},
                {field: "rewPunCode", title: '处分名称', align: "center", valign: "middle"},
                {field: "rewPunCause", title: '处分原因', align: "center", valign: "middle"},
                {field: "rewPunTime", title: '处分日期', align: "center", valign: "middle"},
                {field: "rewPunProof", title: '处分文号', align: "center", valign: "middle"},
                {field: "rewPunRepealTime", title: '处分撤销日期', align: "center", valign: "middle"},
                {field: "rewPunRepealProof", title: '处分撤销文号', align: "center", valign: "middle"},
                {
                    field: "rewPunWheGraduate",
                    title: '是否按时毕业',
                    align: "center",
                    valign: "middle",
                    formatter: function (value, row, index) {
                        if (value == 1) {
                            return "是";
                        } else {
                            return "否";
                        }
                    }
                },
                {
                    field: "rewPunWheDegree",
                    title: '是否获得学位',
                    align: "center",
                    valign: "middle",
                    formatter: function (value, row, index) {
                        if (value == 1) {
                            return "是";
                        } else {
                            return "否";
                        }
                    }
                },
                {field: "rewPunSponDepar", title: '处分发起单位', align: "center", valign: "middle"},
                {field: "rewPunDepar", title: '处分单位', align: "center", valign: "middle"},
                {field: "rewPunAdapt", title: '适用条款', align: "center", valign: "middle"},
                {field: "rewPunMoney", title: '处罚金额', align: "center", valign: "middle"},
                {field: "rewPunSchrollState", title: '学籍状态', align: "center", valign: "middle"},
                {
                    field: "rewPunWhetherAtsch",
                    title: '是否在校',
                    align: "center",
                    valign: "middle",
                    formatter: function (value, row, index) {
                        if (value == 1) {
                            return "是";
                        } else {
                            return "否";
                        }
                    }
                },
                {
                    field: "operation", title: '操作', align: "center", valign: "middle",
                    formatter: function (value, row, index) {
                        var modifyBtn = "<button has-permission='stuRewPunishInfo:update' type='button' class='btn btn-sm btn-default' ng-click='openModify(" + angular.toJson(row) + ")'><span class='fa fa-edit toolbar-btn-icon'></span>修改</button>";
                        return modifyBtn;
                    }
                }
            ]
        };
        // 查询表单显示和隐藏切换
        $scope.isHideSearchForm = false; // 默认显示
        $scope.searchFormHideToggle = function () {
            $scope.isHideSearchForm = !$scope.isHideSearchForm
            if ($scope.isHideSearchForm) {
                $scope.table_height = $scope.table_height + $scope.rightContentHeight;
            } else {
                $scope.table_height = $scope.table_height - $scope.rightContentHeight;
            }
            angular.element('#stuRewPunishInfoManageTable').bootstrapTable('resetView', {height: $scope.table_height});
        };
        // 查询表单提交
        $scope.searchSubmit = function () {
            // angular.element('#stuRewPunishInfoManageTable').bootstrapTable('refresh');
            //当没有一条数据的时候，是不发请求的
            var ss = $scope.stuRewPunishInfo.rewPunGender;
            angular.element('#stuRewPunishInfoManageTable').bootstrapTable('selectPage', 1);
        };
        // 查询表单重置
        $scope.reset = function () {
            $scope.stuRewPunishInfo = {};
            // 重新初始化下拉框
            angular.element('form[name="stuRewPunishInfoSearch_form"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#stuRewPunishInfoManageTable').bootstrapTable('selectPage', 1);
        }

    }

})(window);
