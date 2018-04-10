/**
 * Created by Administrator on 2018/1/18.
 */
;(function (window, undefined) {
    'use strict';

    window.arrange_stuOverseasInfoManageEditController = function ($compile, $scope,$stateParams, $uibModal, $view, $rootScope, $location, $anchorScroll, $window, $timeout, $state,$http, arrange_stuOverseasInfoManageService,formVerifyService, alertService, app) {

        // 国外留学生学籍信息查询对象
        $scope.stuOverseasInfo =  $stateParams.stuOverseasInfo;
        $scope.stuOverseasInfo.idCardType = $scope.stuOverseasInfo.idCardTypeId;
        $scope.stuOverseasInfo.countryCode = $scope.stuOverseasInfo.countryCodeId;
        $scope.stuOverseasInfo.sexCode = $scope.stuOverseasInfo.sexCodeId;
        $scope.stuOverseasInfo.dept = $scope.stuOverseasInfo.deptId;
        $scope.stuOverseasInfo.department = $scope.stuOverseasInfo.departmentId;
        $scope.stuOverseasInfo.grade = $scope.stuOverseasInfo.gradeId;
        $scope.stuOverseasInfo.classMajor = $scope.stuOverseasInfo.classMajorId;
        $scope.stuOverseasInfo.class = $scope.stuOverseasInfo.classId;
        $scope.stuOverseasInfo.studyStatus = $scope.stuOverseasInfo.studyStatusId;
        $scope.stuOverseasInfo.schoolStatus = $scope.stuOverseasInfo.schoolStatusId;
        $scope.stuOverseasInfo.nationStatus = $scope.stuOverseasInfo.nationStatusId;
        $scope.stuOverseasInfo.developLevel = $scope.stuOverseasInfo.developLevelId;
        $scope.stuOverseasInfo.schoolWay = $scope.stuOverseasInfo.schoolWayId;
        $scope.stuOverseasInfo.bornTime = new Date($scope.stuOverseasInfo.bornTime);
        $scope.stuOverseasInfo.goSchooleTime = new Date($scope.stuOverseasInfo.goSchooleTime);
        $scope.stuOverseasInfo.oldIdCardType = $scope.stuOverseasInfo.oldIdCardTypeId;
        $scope.stuOverseasInfo.marrayStatus = $scope.stuOverseasInfo.marrayStatusId;
        $scope.stuOverseasInfo.healthyStatus = $scope.stuOverseasInfo.healthyStatusId;
        $scope.stuOverseasInfo.religion = $scope.stuOverseasInfo.religionId;
        $scope.stuOverseasInfo.bloodType = $scope.stuOverseasInfo.bloodTypeId;
        $scope.stuOverseasInfo.idCardEffectTime = $scope.stuOverseasInfo.idCardEffectTime == undefined ?'':new Date($scope.stuOverseasInfo.idCardEffectTime);
        $scope.stuOverseasInfo.stuOverseasType = $scope.stuOverseasInfo.stuOverseasTypeId;
        $scope.stuOverseasInfo.bornArea = $scope.stuOverseasInfo.bornAreaId;
        $scope.stuOverseasInfo.schoolFeeOrigin = $scope.stuOverseasInfo.schoolFeeOriginId;
        $scope.stuOverseasInfo.courseLanguage = $scope.stuOverseasInfo.courseLanguageId;
        $scope.stuOverseasInfo.developWay = $scope.stuOverseasInfo.developWayId;

        //初始化编辑数据
        initEditCondition($scope, $window, $rootScope, app, $compile,$state,$timeout, $http, arrange_stuOverseasInfoManageService,formVerifyService, alertService);

        $scope.stuOverseasInfo_familly = {};
        $scope.stuOverseasInfo_experience = {};
        $scope.stuOverseasInfo_interflowo = {};
        $scope.stuOverseasInfo_changerollo = {};
        $scope.stuOverseasInfo_doubdegreeo = {};
        $scope.stuOverseasInfo_registero = {};
        $scope.stuOverseasInfo_courseo = {};
        $scope.stuOverseasInfo_punishmento = {};
        //初始化家庭成员
        initFamillyTable($scope, $window, $rootScope, app, $compile, arrange_stuOverseasInfoManageService, alertService);
        //初始化学习经历
        initExperienceTable($scope, $window, $rootScope, app, $compile, arrange_stuOverseasInfoManageService, alertService);
        //初始化交流经历表格
        initInterflowoTable($scope, $window, $rootScope, app, $compile, arrange_stuOverseasInfoManageService, alertService);
        //初始化异动情况表格
        initChangerolloTable($scope, $window, $rootScope, app, $compile, arrange_stuOverseasInfoManageService, alertService);
        //初始化双专业双学位辅修表格
        initDoubdegreeoTable($scope, $window, $rootScope, app, $compile, arrange_stuOverseasInfoManageService, alertService);
        //初始化注册状态表格
        initRegisteroTable($scope, $window, $rootScope, app, $compile, arrange_stuOverseasInfoManageService, alertService);
        //初始化学籍变动日志表格
        initCourseoTable($scope, $window, $rootScope, app, $compile, arrange_stuOverseasInfoManageService, alertService);
        //初始化惩处表格
        initPunishmentoTable($scope, $window, $rootScope, app, $compile, arrange_stuOverseasInfoManageService, alertService);
        //点击学习经历刷新表格
        $scope.queryExperience = function () {
            angular.element('#stuOverseasInfoExperienceTable').bootstrapTable('refresh');
        };
        //点击家庭成员刷新表格
        $scope.queryFamilly = function () {
            angular.element('#stuOverseasInfoFamillyTable').bootstrapTable('refresh');
        };
        //点击交流经历刷新表格
        $scope.queryInterflowo = function () {
            angular.element('#stuOverseasInfoInterflowoTable').bootstrapTable('refresh');
        };
        //点击异动情况刷新表格
        $scope.queryChangerollo = function () {
            angular.element('#stuOverseasInfoChangerolloTable').bootstrapTable('refresh');
        };
        //点击双专业双学位辅修刷新表格
        $scope.queryDoubdegreeo = function () {
            angular.element('#stuOverseasInfoDoubdegreeoTable').bootstrapTable('refresh');
        };
        //点击注册状态刷新表格
        $scope.queryRegistero = function () {
            angular.element('#stuOverseasInfoRegisteroTable').bootstrapTable('refresh');
        };
        //点击学籍变动日志刷新表格
        $scope.queryCourseo = function () {
            angular.element('#stuOverseasInfoCourseoTable').bootstrapTable('refresh');
        };
        //点击惩处刷新表格
        $scope.queryPunishmento = function () {
            angular.element('#stuOverseasInfoPunishmentoTable').bootstrapTable('refresh');
        };
        //打开家庭成员新增面板
        $scope.btnAddFamily = function () {
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/student/statusInfoManage/stuOverseasInfoManage/stuFamilyAdd.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return $scope.stuOverseasInfo_familly;
                    }
                },
                controller: openAddFamilyController
            });
        };

        //打开家庭成员编辑面板
        $scope.openFamillyModify = function (row) {
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/student/statusInfoManage/stuOverseasInfoManage/stuFamilyEdit.html',
                size: 'lg',
                resolve: {
                    item: function ( ) {
                        return row;
                    }
                },
                controller: openEditFamilyController
            });
        };
        // 打开家庭成员删除面板
        $scope.btnDelFamily = function ( ) {
            var rows = $('#stuOverseasInfoFamillyTable').bootstrapTable('getSelections');
            if (rows.length == 0) {
                //打开提示框
                alertService("warn", "请选中要删除的记录!");
                return false;
            }
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/student/statusInfoManage/stuOverseasInfoManage/delete.html',
                size: '',
                resolve: {
                    item: function () {
                        return rows;
                    }
                },
                controller: openDeleteFamilyController
            });
        };
        //打开学习经历新增面板
        $scope.btnExperAdd = function () {
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/student/statusInfoManage/stuOverseasInfoManage/stuExperienceAdd.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return $scope.stuOverseasInfo_experience;
                    }
                },
                controller: openAddExperienceController
            });
        };

        //打开学习经历编辑面板
        $scope.openExperienceModify = function (row) {
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/student/statusInfoManage/stuOverseasInfoManage/stuExperienceEdit.html',
                size: 'lg',
                resolve: {
                    item: function ( ) {
                        return row;
                    }
                },
                controller: openEditExperienceController
            });
        };
        // 打开学习经历删除面板
        $scope.btnDelexper = function ( ) {
            var rows = angular.element('#stuOverseasInfoExperienceTable').bootstrapTable('getSelections');
            if (rows.length == 0) {
                //打开提示框
                alertService("warn", "请选中要删除的记录!");
                return false;
            }
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/student/statusInfoManage/stuOverseasInfoManage/delete.html',
                size: '',
                resolve: {
                    item: function () {
                        return rows;
                    }
                },
                controller: openDeleteExperienceController
            });
        };

    };
    arrange_stuOverseasInfoManageEditController.$inject = ['$compile', '$scope','$stateParams', '$uibModal', '$view', '$rootScope', '$location', '$anchorScroll', '$window', '$timeout', '$state', '$http','arrange_stuOverseasInfoManageService','formVerifyService', 'alertService', 'app'];

    //添加家庭成员
    var openAddFamilyController = function ($rootScope, $compile, $scope,$stateParams, $uibModalInstance, $uibModal,$http, arrange_stuOverseasInfoManageService, formVerifyService, alertService, app) {

        // 初始化数据
        $scope.stuOverseasInfo_family = {};
        $scope.stuOverseasInfo_family.stuNumber =   $stateParams.stuOverseasInfo.num;
        $scope.stuOverseasInfo_family.stuName =  $stateParams.stuOverseasInfo.name;
        //查询称谓
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFullTimeInfo/tableview_stuFullTimeInfo_majorType.json",
        }).then(function (response) {
            $scope.familyRelationCodeList = response.data.data.list;

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
            // arrange_stuOverseasInfoManageService.add($scope.stuOverseasInfo, 'stuOverseasInfo:insert', function (error, message) {
             $rootScope.showLoading = false; // 关闭加载提示
            //  if (error) {
            //  alertService(message);
            //  return;
            //  }
             $uibModalInstance.close();
             angular.element('#stuOverseasInfoFamillyTable').bootstrapTable('refresh');
             alertService('success', '新增成功');
            //  });
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openAddFamilyController.$inject = ['$rootScope', '$compile', '$scope','$stateParams', '$uibModalInstance', '$uibModal','$http', 'arrange_stuOverseasInfoManageService', 'formVerifyService', 'alertService', 'app'];
    //编辑家庭成员
    var openEditFamilyController = function ($rootScope, $compile, $scope,$stateParams, $uibModalInstance, $uibModal,$http, arrange_stuOverseasInfoManageService,item, formVerifyService, alertService, app) {
        // 初始化数据
        $scope.stuOverseasInfo_family = item;
        $scope.stuOverseasInfo_family.stuNumber =   $stateParams.stuOverseasInfo.num;
        $scope.stuOverseasInfo_family.stuName =  $stateParams.stuOverseasInfo.name;
        $scope.stuOverseasInfo_family.familyRelationCode =  $scope.stuOverseasInfo_family.familyRelationCodeId;
        $scope.stuOverseasInfo_family.familyAge = parseInt( $scope.stuOverseasInfo_family.familyAge);
        //查询称谓
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFullTimeInfo/tableview_stuFullTimeInfo_majorType.json",
        }).then(function (response) {
            $scope.familyRelationCodeList = response.data.data.list;

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
            //  if (error) {
            //  alertService(message);
            //  return;
            //  }
            $uibModalInstance.close();
            angular.element('#stuOverseasInfoFamillyTable').bootstrapTable('refresh');
            alertService('success', '修改成功');
            //  });
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openEditFamilyController.$inject = ['$rootScope', '$compile', '$scope','$stateParams', '$uibModalInstance', '$uibModal','$http', 'arrange_stuOverseasInfoManageService','item', 'formVerifyService', 'alertService', 'app'];

    //添加学习经历
    var openAddExperienceController = function ($rootScope, $compile, $scope,$stateParams, $uibModalInstance, $uibModal, arrange_stuOverseasInfoManageService, formVerifyService, alertService, app) {
        // 初始化数据
        $scope.stuOverseasInfo_experience = {};
        $scope.stuOverseasInfo_experience.stuNumber = $stateParams.stuOverseasInfo.num;
        $scope.stuOverseasInfo_experience.stuName = $stateParams.stuOverseasInfo.name;
        // 结束年月参数配置
        $scope.experEndTimeOptions = {
            opened: false,
            open: function() {
                $scope.experEndTimeOptions.opened = true;
            }
        };

        // 开始年月参数配置
        $scope.experBeginTimeOptions = {
            opened: false,
            open: function() {
                $scope.experBeginTimeOptions.opened = true;
            }
        };

        $scope.ok = function (form) {
            // 处理前验证
            if (form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            }
            ;
            $rootScope.showLoading = true; // 开启加载提示
            // arrange_stuOverseasInfoManageService.add($scope.stuOverseasInfo, 'stuOverseasInfo:insert', function (error, message) {
             $rootScope.showLoading = false; // 关闭加载提示
            //  if (error) {
            //  alertService(message);
            //  return;
            //  }
             $uibModalInstance.close();
             angular.element('#stuOverseasInfoExperienceTable').bootstrapTable('refresh');
             alertService('success', '新增成功');
            //  });
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openAddExperienceController.$inject = ['$rootScope', '$compile', '$scope','$stateParams', '$uibModalInstance', '$uibModal', 'arrange_stuOverseasInfoManageService', 'formVerifyService', 'alertService', 'app'];
    //编辑学习经历
    var openEditExperienceController = function ($rootScope, $compile, $scope,$stateParams, $uibModalInstance, $uibModal, arrange_stuOverseasInfoManageService,item, formVerifyService, alertService, app) {
        // 初始化数据
        $scope.stuOverseasInfo_experience = item;
        $scope.stuOverseasInfo_experience.experBeginTime = new Date(item.experBeginTime);
        $scope.stuOverseasInfo_experience.experEndTime = new Date(item.experEndTime);
        $scope.stuOverseasInfo_experience.stuNumber = $stateParams.stuOverseasInfo.num;
        $scope.stuOverseasInfo_experience.stuName = $stateParams.stuOverseasInfo.name;
        // 开始年月参数配置
        $scope.experBeginTimeOptions = {
            opened: false,
            open: function() {
                $scope.experBeginTimeOptions.opened = true;
            }
        };
        // 结束年月参数配置
        $scope.experEndTimeOptions = {
            opened: false,
            open: function() {
                $scope.experEndTimeOptions.opened = true;
            }
        };

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
            //  if (error) {
            //  alertService(message);
            //  return;
            //  }
            $uibModalInstance.close();
            angular.element('#stuOverseasInfoExperienceTable').bootstrapTable('refresh');
            alertService('success', '修改成功');
            //  });
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openEditExperienceController.$inject = ['$rootScope', '$compile', '$scope','$stateParams', '$uibModalInstance', '$uibModal', 'arrange_stuOverseasInfoManageService','item', 'formVerifyService', 'alertService', 'app'];
    // 删除家庭成员
    var openDeleteFamilyController = function ($rootScope, $scope, $uibModalInstance, item, arrange_stuOverseasInfoManageService, alertService) {
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {
            $rootScope.showLoading = true; // 开启加载提示
            // arrange_stuOverseasInfoManageService.delete(item.stuOverseasInfoId, 'stuOverseasInfo:delete', function (error, message) {
             $rootScope.showLoading = false; // 关闭加载提示
            //  if (error) {
            //  alertService(message);
            //  return;
            //  }
             angular.element('#stuOverseasInfoFamillyTable').bootstrapTable('refresh');
             alertService('success', '删除成功');
            //  });
            $uibModalInstance.close();
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openDeleteFamilyController.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'item', 'arrange_stuOverseasInfoManageService', 'alertService'];
    // 删除学习经历
    var openDeleteExperienceController = function ($rootScope, $scope, $uibModalInstance, item, arrange_stuOverseasInfoManageService, alertService) {
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {
            $rootScope.showLoading = true; // 开启加载提示
           // arrange_stuOverseasInfoManageService.delete(item.stuOverseasInfoId, 'stuOverseasInfo:delete', function (error, message) {
             $rootScope.showLoading = false; // 关闭加载提示
           //   if (error) {
           //   alertService(message);
           //   return;
           //   }
             angular.element('#stuOverseasInfoExperienceTable').bootstrapTable('refresh');
             alertService('success', '删除成功');
           //   });
            $uibModalInstance.close();
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openDeleteExperienceController.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'item', 'arrange_stuOverseasInfoManageService', 'alertService'];

    // 初始化家庭成员表格
    var initFamillyTable = function ($scope, $window, $rootScope, app, $compile, arrange_stuOverseasInfoManageService, alertService) {
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNum: params.pageNumber  //页码
            };
            // 去除为 null 或 "" 值的查询字段
            var stuOverseasExperienceInfoQuery = {};
            angular.forEach($scope.stuOverseasInfo_experience, function (data, index, array) {
                if (data) {
                    stuOverseasExperienceInfoQuery[index] = data;
                }
            });
            $rootScope.$log.debug(angular.extend(pageParam, stuOverseasExperienceInfoQuery));
            return angular.extend(pageParam, stuOverseasExperienceInfoQuery);
        }
        $scope.stuOverseasInfoFamillyTable = {
            url: 'data_test/student/tableview_stuOverseasInfo_familly.json',
            // url: app.api.address + '/student/stuOverseasInfo',
            headers: {
                permission: "stuOverseasFamillyInfo:query"
            },
            method: 'get',
            cache: false,
            height: 700,
            toolbar: '#familly_toolbar', //工具按钮用哪个容器
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
                    rows: response.data.list
                };
            },
            onLoadSuccess: function () {
                $compile(angular.element('#stuOverseasInfoFamillyTable').contents())($scope);
            },
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#stuOverseasInfoFamillyTable').contents())($scope);
            },
            columns: [
                {checkbox: true, width: "3%"},
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
                {field: "familyRelationCode", title: '称谓', align: "center", valign: "middle"},
                {field: "familyMemberName", title: '姓名', align: "center", valign: "middle"},
                {field: "familyAge", title: '年龄', align: "center", valign: "middle"},
                {field: "familyWorkUnit", title: '工作单位', align: "center", valign: "middle"},
                {field: "familyPhone", title: '联系电话', align: "center", valign: "middle"},
                {
                    field: "operation", title: "操作", align: "center", valign: "middle",
                    formatter: function (value, row, index) {
                        var modifyBtn = "<button has-permission='stuOverseasInfo:update' type='button' class='btn btn-sm btn-default' ng-click='openFamillyModify(" + angular.toJson(row) + ")'><span class='fa fa-edit toolbar-btn-icon'></span>修改</button>";
                        return modifyBtn + "&nbsp;";
                    }
                }
            ],
            loadImmediately: true
        };
    };
    // 初始化学习经历表格
    var initExperienceTable = function ($scope, $window, $rootScope, app, $compile, arrange_stuOverseasInfoManageService, alertService) {
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNum: params.pageNumber  //页码
            };
            // 去除为 null 或 "" 值的查询字段
            var stuOverseasExperienceInfoQuery = {};
            angular.forEach($scope.stuOverseasInfo_experience, function (data, index, array) {
                if (data) {
                    stuOverseasExperienceInfoQuery[index] = data;
                }
            });
            $rootScope.$log.debug(angular.extend(pageParam, stuOverseasExperienceInfoQuery));
            return angular.extend(pageParam, stuOverseasExperienceInfoQuery);
        }
        $scope.stuOverseasInfoExperienceTable = {
            url: 'data_test/student/tableview_stuOverseasInfo_experience.json',
            // url: app.api.address + '/student/stuOverseasInfo',
            headers: {
                permission: "stuOverseasExperienceInfo:query"
            },
            method: 'get',
            cache: false,
            height: 700,
            toolbar: '#experience_toolbar', //工具按钮用哪个容器
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
                    rows: response.data.list
                };
            },
            onLoadSuccess: function () {
                $compile(angular.element('#stuOverseasInfoExperienceTable').contents())($scope);
            },
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#stuOverseasInfoExperienceTable').contents())($scope);
            },
            columns: [
                {checkbox: true, width: "3%"},
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
                {field: "experBeginTime", title: '学习起始日期', align: "center", valign: "middle"},
                {field: "experEndTime", title: '学习终止日期', align: "center", valign: "middle"},
                {field: "experStudyUnit", title: '学习单位', align: "center", valign: "middle"},
                {field: "experSite", title: '学习地址', align: "center", valign: "middle"},
                {
                    field: "operation", title: "操作", align: "center", valign: "middle",
                    formatter: function (value, row, index) {
                        var modifyBtn = "<button has-permission='stuOverseasInfo:update' type='button' class='btn btn-sm btn-default' ng-click='openExperienceModify(" + angular.toJson(row) + ")'><span class='fa fa-edit toolbar-btn-icon'></span>修改</button>";
                        return modifyBtn + "&nbsp;";
                    }
                }
            ],
            loadImmediately: true
        };
    };
    // 初始化交流经历表格
    var initInterflowoTable = function ($scope, $window, $rootScope, app, $compile, arrange_stuOverseasInfoManageService, alertService) {
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNum: params.pageNumber  //页码
            };
            // 去除为 null 或 "" 值的查询字段
            var stuOverseasInterflowoInfoQuery = {};
            angular.forEach($scope.stuOverseasInfo_interflowo, function (data, index, array) {
                if (data) {
                    stuOverseasInterflowoInfoQuery[index] = data;
                }
            });
            $rootScope.$log.debug(angular.extend(pageParam, stuOverseasInterflowoInfoQuery));
            return angular.extend(pageParam, stuOverseasInterflowoInfoQuery);
        }
        $scope.stuOverseasInfoInterflowoTable = {
            url: 'data_test/student/tableview_stuOverseasInfo_conmunity.json',
            // url: app.api.address + '/student/stuOverseasInfo',
            headers: {
                permission: "stuOverseasInterflowoInfo:query"
            },
            method: 'get',
            cache: false,
            height: 700,
            toolbar: '#interflowo_toolbar', //工具按钮用哪个容器
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
                    rows: response.data.list
                };
            },
            onLoadSuccess: function () {
                $compile(angular.element('#stuOverseasInfoInterflowoTable').contents())($scope);
            },
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#stuOverseasInfoInterflowoTable').contents())($scope);
            },
            columns: [
                {checkbox: true, width: "3%"},
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
                {field: "startTime", title: '学习起始日期', align: "center", valign: "middle"},
                {field: "endTime", title: '学习终止日期', align: "center", valign: "middle"},
                {field: "sendToCollegeName", title: '派往学校', align: "center", valign: "middle"},
                {field: "sentToMajorName", title: '派往专业', align: "center", valign: "middle"},
                {field: "exchangeStatus", title: '交流状态', align: "center", valign: "middle"}
            ],
            loadImmediately: true
        };
    };
    // 初始化异动情况表格
    var initChangerolloTable = function ($scope, $window, $rootScope, app, $compile, arrange_stuOverseasInfoManageService, alertService) {
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNum: params.pageNumber  //页码
            };
            // 去除为 null 或 "" 值的查询字段
            var stuOverseasChangerolloInfoQuery = {};
            angular.forEach($scope.stuOverseasInfo_changerollo, function (data, index, array) {
                if (data) {
                    stuOverseasChangerolloInfoQuery[index] = data;
                }
            });
            $rootScope.$log.debug(angular.extend(pageParam, stuOverseasChangerolloInfoQuery));
            return angular.extend(pageParam, stuOverseasChangerolloInfoQuery);
        }
        $scope.stuOverseasInfoChangerolloTable = {
            url: 'data_test/student/tableview_stuOverseasInfo_changerollo.json',
            // url: app.api.address + '/student/stuOverseasInfo',
            headers: {
                permission: "stuOverseasChangerolloInfo:query"
            },
            method: 'get',
            cache: false,
            height: 700,
            toolbar: '#changerollo_toolbar', //工具按钮用哪个容器
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
                    rows: response.data.list
                };
            },
            onLoadSuccess: function () {
                $compile(angular.element('#stuOverseasInfoChangerolloTable').contents())($scope);
            },
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#stuOverseasInfoChangerolloTable').contents())($scope);
            },
            columns: [
                {checkbox: true, width: "3%"},
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
                {field: "changeDate", title: '发文日期', align: "center", valign: "middle"},
                {field: "changeNumber", title: '文号', align: "center", valign: "middle"},
                {field: "changeTypeName", title: '异动类别', align: "center", valign: "middle"},
                {field: "changeCauseNAME", title: '异动原因', align: "center", valign: "middle"}
            ],
            loadImmediately: true
        };
    };
    // 初始化双专业双学位辅修表格
    var initDoubdegreeoTable = function ($scope, $window, $rootScope, app, $compile, arrange_stuOverseasInfoManageService, alertService) {
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNum: params.pageNumber  //页码
            };
            // 去除为 null 或 "" 值的查询字段
            var stuOverseasDoubdegreeoInfoQuery = {};
            angular.forEach($scope.stuOverseasInfo_doubdegreeo, function (data, index, array) {
                if (data) {
                    stuOverseasDoubdegreeoInfoQuery[index] = data;
                }
            });
            $rootScope.$log.debug(angular.extend(pageParam, stuOverseasDoubdegreeoInfoQuery));
            return angular.extend(pageParam, stuOverseasDoubdegreeoInfoQuery);
        }
        $scope.stuOverseasInfoDoubdegreeoTable = {
            url: 'data_test/student/tableview_stuOverseasInfo_doubdegreeo.json',
            // url: app.api.address + '/student/stuOverseasInfo',
            headers: {
                permission: "stuOverseasDoubdegreeoInfo:query"
            },
            method: 'get',
            cache: false,
            height: 700,
            toolbar: '#doubdegreeo_toolbar', //工具按钮用哪个容器
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
                    rows: response.data.list
                };
            },
            onLoadSuccess: function () {
                $compile(angular.element('#stuOverseasInfoDoubdegreeoTable').contents())($scope);
            },
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#stuOverseasInfoDoubdegreeoTable').contents())($scope);
            },
            columns: [
                {checkbox: true, width: "3%"},
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
                {field: "degreeType", title: '辅修类别', align: "center", valign: "middle"},
                {field: "degreeCollege", title: '学院', align: "center", valign: "middle"},
                {field: "degreeMajor", title: '专业方向', align: "center", valign: "middle"},
                {field: "degreeGrade", title: '年级', align: "center", valign: "middle"},
                {field: "degreeConclusion", title: '毕业结论', align: "center", valign: "middle"}
            ],
            loadImmediately: true
        };
    };
    // 初始化注册状态表格
    var initRegisteroTable = function ($scope, $window, $rootScope, app, $compile, arrange_stuOverseasInfoManageService, alertService) {
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNum: params.pageNumber  //页码
            };
            // 去除为 null 或 "" 值的查询字段
            var stuOverseasRegisteroInfoQuery = {};
            angular.forEach($scope.stuOverseasInfo_registero, function (data, index, array) {
                if (data) {
                    stuOverseasRegisteroInfoQuery[index] = data;
                }
            });
            $rootScope.$log.debug(angular.extend(pageParam, stuOverseasRegisteroInfoQuery));
            return angular.extend(pageParam, stuOverseasRegisteroInfoQuery);
        }
        $scope.stuOverseasInfoRegisteroTable = {
            url: 'data_test/student/tableview_stuOverseasInfo_registero.json',
            // url: app.api.address + '/student/stuOverseasInfo',
            headers: {
                permission: "stuOverseasRegisteroInfo:query"
            },
            method: 'get',
            cache: false,
            height: 700,
            toolbar: '#registero_toolbar', //工具按钮用哪个容器
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
                    rows: response.data.list
                };
            },
            onLoadSuccess: function () {
                $compile(angular.element('#stuOverseasInfoRegisteroTable').contents())($scope);
            },
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#stuOverseasInfoRegisteroTable').contents())($scope);
            },
            columns: [
                {checkbox: true, width: "3%"},
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
                {field: "regisSemester", title: '学年学期', align: "center", valign: "middle"},
                {field: "regisReport", title: '报到状态', align: "center", valign: "middle"},
                {field: "regisEnroll", title: '注册状态', align: "center", valign: "middle"},
                {field: "regisPay", title: '缴费状态', align: "center", valign: "middle"}
            ],
            loadImmediately: true
        };
    };
    // 初始化学籍变动日志表格
    var initCourseoTable = function ($scope, $window, $rootScope, app, $compile, arrange_stuOverseasInfoManageService, alertService) {
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNum: params.pageNumber  //页码
            };
            // 去除为 null 或 "" 值的查询字段
            var stuOverseasCourseoInfoQuery = {};
            angular.forEach($scope.stuOverseasInfo_courseo, function (data, index, array) {
                if (data) {
                    stuOverseasCourseoInfoQuery[index] = data;
                }
            });
            $rootScope.$log.debug(angular.extend(pageParam, stuOverseasCourseoInfoQuery));
            return angular.extend(pageParam, stuOverseasCourseoInfoQuery);
        }
        $scope.stuOverseasInfoCourseoTable = {
            url: 'data_test/student/tableview_stuOverseasInfo_courseo.json',
            // url: app.api.address + '/student/stuOverseasInfo',
            headers: {
                permission: "stuOverseasCourseoInfo:query"
            },
            method: 'get',
            cache: false,
            height: 700,
            toolbar: '#courseo_toolbar', //工具按钮用哪个容器
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
                    rows: response.data.list
                };
            },
            onLoadSuccess: function () {
                $compile(angular.element('#stuOverseasInfoCourseoTable').contents())($scope);
            },
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#stuOverseasInfoCourseoTable').contents())($scope);
            },
            columns: [
                {checkbox: true, width: "3%"},
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
                {field: "courProof", title: '学籍变更文号', align: "center", valign: "middle"},
                {field: "changetorNum", title: '学籍变更人工号', align: "center", valign: "middle"},
                {field: "changetorName", title: '学籍变更人姓名', align: "center", valign: "middle"},
                {field: "changetorTime", title: '学籍变更时间', align: "center", valign: "middle"},
                {
                    field: "operation", title: "操作", align: "center", valign: "middle",
                    formatter: function (value, row, index) {
                        var modifyBtn = "<button has-permission='stuOverseasInfo:update' type='button' class='btn btn-sm btn-default' ng-click='viewCourse(" + angular.toJson(row) + ")'><span class='fa fa-edit toolbar-btn-icon'></span>查看</button>";
                        return modifyBtn + "&nbsp;";
                    }
                }
            ],
            loadImmediately: true
        };
    };
    // 初始化惩处表格
    var initPunishmentoTable = function ($scope, $window, $rootScope, app, $compile, arrange_stuOverseasInfoManageService, alertService) {
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNum: params.pageNumber  //页码
            };
            // 去除为 null 或 "" 值的查询字段
            var stuOverseasPunishmentoInfoQuery = {};
            angular.forEach($scope.stuOverseasInfo_punishmento, function (data, index, array) {
                if (data) {
                    stuOverseasPunishmentoInfoQuery[index] = data;
                }
            });
            $rootScope.$log.debug(angular.extend(pageParam, stuOverseasPunishmentoInfoQuery));
            return angular.extend(pageParam, stuOverseasPunishmentoInfoQuery);
        }
        $scope.stuOverseasInfoPunishmentoTable = {
            url: 'data_test/student/tableview_stuOverseasInfo_punishmento.json',
            // url: app.api.address + '/student/stuOverseasInfo',
            headers: {
                permission: "stuOverseasPunishmentoInfo:query"
            },
            method: 'get',
            cache: false,
            height: 700,
            toolbar: '#punishmento_toolbar', //工具按钮用哪个容器
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
                    rows: response.data.list
                };
            },
            onLoadSuccess: function () {
                $compile(angular.element('#stuOverseasInfoPunishmentoTable').contents())($scope);
            },
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#stuOverseasInfoPunishmentoTable').contents())($scope);
            },
            columns: [
                {checkbox: true, width: "3%"},
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
                {field: "rewPundate", title: '违纪日期', align: "center", valign: "middle"},
                {field: "rewPunBriefing", title: '违纪简况', align: "center", valign: "middle"},
                {field: "rewPunTypeName", title: '违纪类别', align: "center", valign: "middle"},
                {field: "rewPunSourceName", title: '处分来源', align: "center", valign: "middle"},
                {field: "rewPunName", title: '处分名称', align: "center", valign: "middle"},
                {field: "rewPunCause", title: '处分原因', align: "center", valign: "middle"},
                {field: "rewPunTime", title: '处分日期', align: "center", valign: "middle"},
                {field: "rewPunProof", title: '处分文号', align: "center", valign: "middle"},
                {field: "rewPunRepealTime", title: '处分撤销日期', align: "center", valign: "middle"},
                {field: "rewPunRepealProof", title: '处分撤销文号', align: "center", valign: "middle"},
                {field: "rewPunWheGraduate", title: '是否按时毕业', align: "center", valign: "middle"},
                {field: "rewPunWheDegree", title: '是否获得学位', align: "center", valign: "middle"},
                {field: "rewPunSponDeparName", title: '处分发起单位', align: "center", valign: "middle"},
                {field: "rewPunDeparName", title: '处分单位', align: "center", valign: "middle"},
                {field: "rewPunAdapt", title: '适用条款', align: "center", valign: "middle"},
                {field: "rewPunMoney", title: '处罚金额', align: "center", valign: "middle"},
                {field: "rewPunSchrollState", title: '学籍状态', align: "center", valign: "middle"},
                {field: "rewPunWhetherAtsch", title: '是否在校', align: "center", valign: "middle"}
            ],
            loadImmediately: true
        };
    };

    //初始化编辑数据
    var initEditCondition = function ($scope, $window, $rootScope, app, $compile,$state,$timeout, $http, arrange_stuOverseasInfoManageService,formVerifyService, alertService) {

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
        //查询来华留学生类别
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_sex.json",
        }).then(function (response) {
            $scope.stuOverseasTypeList = response.data.data.list;//性别

        }, function (response) {
            console.log(response);
        });
        //查询来华留学经费来源
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_sex.json",
        }).then(function (response) {
            $scope.schoolFeeOriginList = response.data.data.list;//性别

        }, function (response) {
            console.log(response);
        });
        //查询授课语言
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_sex.json",
        }).then(function (response) {
            $scope.courseLanguageList = response.data.data.list;//性别

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
            $scope.studyStatusList = response.data.data.list;

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
            // $uibModalInstance.close();
            // angular.element('#stuOverseasInfoTable').bootstrapTable('refresh');
            alertService('success', '修改成功');
            // 跳转到首页页面
            $("body").fadeOut();
            $timeout(function () {
                $state.go("home.common.stuOverseasInfoManage" );
            }, 500);
            $("body").fadeIn(800);
            // });
        };
        $scope.close = function () {
            // 跳转到首页页面
            $("body").fadeOut();
            $timeout(function () {
                $state.go("home.common.stuOverseasInfoManage" );
            }, 500);
            $("body").fadeIn(800);
        };
    };


})(window);