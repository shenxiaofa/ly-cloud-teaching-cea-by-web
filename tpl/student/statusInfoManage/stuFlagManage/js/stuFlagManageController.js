/**
 * Created by Administrator on 2018/1/17.
 */
;(function (window, undefined) {
    'use strict';

    window.arrange_stuFlagManageController = function ($compile, $scope, $uibModal, $rootScope, $window, $timeout, $http, arrange_stuFlagManageService, baseinfo_generalService, alertService, app) {
        //监听屏幕宽度改变搜索框的样式
        $scope.rightContentHeight = $(".right-content-search").height() + 20 - 40;
        $scope.rightHeaderHeight = $(".header").height() + 20;
        $scope.rightTableToolbarHeight = $("#stuFlag_toolbar").height() + 10;
        $scope.table_height = $window.innerHeight - ($scope.rightContentHeight + 40 + $scope.rightHeaderHeight + $scope.rightTableToolbarHeight);
        window.onresize = function () {
            $scope.rightContentHeight = $(".right-content-search").height() + 20 - 40;
            $scope.rightHeaderHeight = $(".header").height() + 20;
            $scope.rightTableToolbarHeight = $("#stuFlag_toolbar").height() + 10;
            $scope.table_height = $window.innerHeight - ($scope.rightContentHeight + 40 + $scope.rightHeaderHeight + $scope.rightTableToolbarHeight);
        };
        // 学生标签查询对象
        $scope.stuFlagInfo = {};
        //初始化搜做数据
        initIndexSeacher($scope, $window, $rootScope, app, $compile, $http, arrange_stuFlagManageService, baseinfo_generalService, alertService);
        // 初始化表格
        initIndexTable($scope, $window, $rootScope, app, $compile, arrange_stuFlagManageService, alertService);
        //导出数据
        $scope.listvalue = [];//
        //导出
        $scope.openExport = function () {
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/student/statusInfoManage/stuFlagManage/export.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return $scope.stuFlagInfo;
                    }
                },
                controller: openExportController
            });

            // $scope.listTitle = $scope.stuFlagManageTable.columns ; //
            // $scope.listTitleEnd = [];
            // var tbodys = [];
            // for(var i = 1; i < $scope.listTitle.length; i++) {
            //     if($scope.listTitle[i].title !="序号" && $scope.listTitle[i].title !="操作"){
            //         var tbody = {} ;
            //         $scope.listTitleEnd.push($scope.listTitle[i].title);
            //         var filed = $scope.listTitle[i].field;
            //         var title = $scope.listTitle[i].title;
            //         tbody[filed]= title;
            //         tbodys.push(tbody)
            //     }
            // }
            // var paramslist = {
            //     title: "单位信息",//表名
            //     thead: $scope.listTitleEnd,//弹出框按钮
            //     relationship:tbodys,//表头和实体关系
            //     param: $scope.searchListForm
            // }
            //
            // $timeout(function() {
            //     $rootScope.$broadcast('drillTable', paramslist);
            //     $('.showDrilltable').css('display', 'block');
            // }, 0);
        };

        // 打开新增面板
        $scope.openAdd = function () {
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/student/statusInfoManage/stuFlagManage/add.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return $scope.stuFlagInfo;
                    }
                },
                controller: openAddController
            });
        };

        // 打开修改面板
        $scope.openModify = function () {
            var rows = $('#stuFlagManageTable').bootstrapTable('getSelections');
            if (rows.length == 0) {
                //打开提示框
                alertService("warn", "请选中要修改的记录!");
                return false;
            }
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/student/statusInfoManage/stuFlagManage/modify.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return rows;
                    }
                },
                controller: openModifyController
            });
        };

        // 打开删除面板
        $scope.openDelete = function () {
            var rows = $('#stuFlagManageTable').bootstrapTable('getSelections');
            if (rows.length == 0) {
                //打开提示框
                alertService("warn", "请选中要删除的记录!");
                return false;
            }
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/student/statusInfoManage/stuFlagManage/delete.html',
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
    arrange_stuFlagManageController.$inject = ['$compile', '$scope', '$uibModal', '$rootScope', '$window', '$timeout', '$http', 'arrange_stuFlagManageService', 'baseinfo_generalService', 'alertService', 'app'];

    // 添加控制器
    var openAddController = function ($rootScope, $compile, $scope, $uibModalInstance, $uibModal, $http, arrange_stuFlagManageService, formVerifyService, baseinfo_generalService, alertService, app) {
        // 初始化数据
        $scope.stuFlagInfo = {};

        //查询是否在校数据,直接写死在html
        //查询入学方式数据
        baseinfo_generalService.findcodedataNames({datableNumber: "RXFSM"}, function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.entranceTypeAddList = data.data;
            $rootScope.$log.debug(data);
            var html = '' +
                ' <select ng-model="stuFlagInfo.entranceType" ng-options="entranceType.dataNumber as entranceType.dataName for entranceType in entranceTypeAddList" name="entranceType" id="entranceType_add" class="form-control" ui-jq="chosen" ui-options="{search_contains: true}">' +
                '<option value="">==请选择==</option>' +
                '</select>';
            angular.element("#entranceType_add").parent().empty().append(html);
            $compile(angular.element("#entranceType_add").parent().contents())($scope);
        });
        // //查询学生标签数据
        // $http({
        //     method: "get",
        //     // url: "/student-status/new-student/select"
        //     url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_stuFlag.json",
        // }).then(function (response) {
        //     $scope.stuFlagNameList = response.data.data.list;
        //
        // }, function (response) {
        //     console.log(response);
        // });
        //查询学生信息
        initStuInfoTable($scope, $rootScope, app, $compile, arrange_stuFlagManageService, alertService);
        $scope.ok = function (form) {

            // 处理前验证
            if (form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            }
            ;
            //验证学生信息是否勾选
            var stuRows = $('#stuFlagManageAddTable').bootstrapTable('getSelections');
            if (stuRows.length == 0) {
                //打开提示框
                alertService("warn", "请选中要增加的记录!");
                return false;
            }

            $scope.stuFlagInfo.listStuFlag = [];
            angular.forEach(stuRows, function (data, index, array) {
                var listStuFlagObj = {
                    stuFlagCode: $scope.stuFlagInfo.stuFlagCode,
                    stuFlagName: $scope.stuFlagInfo.stuFlagCode == "1" ? "班长" : "课代表",
                    stuNumber: data.stuNumber
                };
                $scope.stuFlagInfo.listStuFlag.push(listStuFlagObj);
            });
            $rootScope.showLoading = true; // 开启加载提示
            arrange_stuFlagManageService.add($scope.stuFlagInfo.listStuFlag, 'stuFlagInfo:insert', function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                angular.element('#stuFlagManageTable').bootstrapTable('refresh');
                alertService('success', '新增成功');
            });
        };
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    };
    openAddController.$inject = ['$rootScope', '$compile', '$scope', '$uibModalInstance', '$uibModal', '$http', 'arrange_stuFlagManageService', 'formVerifyService', 'baseinfo_generalService', 'alertService', 'app'];
    // 修改控制器
    var openModifyController = function ($rootScope, $timeout, $compile, $scope, $uibModalInstance, item, $http, arrange_stuFlagManageService, alertService, formVerifyService, app) {
        //查询学生标签数据
        // $http({
        //     method: "get",
        //     // url: "/student-status/new-student/select"
        //     url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_stuFlag.json",
        // }).then(function (response) {
        //     $scope.stuFlagNameList = response.data.data.list;
        //
        // }, function (response) {
        //     console.log(response);
        // });
        // 初始化数据
        $scope.stuFlagInfo = {
            // stuFlagInfoId:item.stuFlagInfoId, // 公告类型id
            // stuFlagInfoName: item.stuFlagInfoName, // 公告类型名称
            // sortNum: item.sortNum, // 排序号
            // describe: item.describe// 描述
        };
        $scope.stuFlagInfo.ids = [];
        angular.forEach(item, function (data, index, array) {
            console.log(data);
            $scope.stuFlagInfo.ids.push(data.id);
        });
        $scope.ok = function (form) {
            // 处理前验证
            if (form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            }
            ;
            $scope.stuFlagInfo.stuFlagName = $scope.stuFlagInfo.stuFlagCode == "1" ? "班长" : "课代表";
            $rootScope.showLoading = true; // 开启加载提示
            arrange_stuFlagManageService.update($scope.stuFlagInfo, 'stuFlagInfo:update', function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                angular.element('#stuFlagManageTable').bootstrapTable('refresh');
                alertService('success', '修改成功');
            });
        };
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    };
    openModifyController.$inject = ['$rootScope', '$timeout', '$compile', '$scope', '$uibModalInstance', 'item', '$http', 'arrange_stuFlagManageService', 'alertService', 'formVerifyService', 'app'];

    // 删除控制器
    var openDeleteController = function ($rootScope, $scope, $uibModalInstance, item, arrange_stuFlagManageService, alertService) {
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {
            $rootScope.showLoading = true; // 开启加载提示
            $scope.ids = [];
            angular.forEach(item, function (data, index, array) {
                console.log(data);
                $scope.ids.push(data.id);
            });
            arrange_stuFlagManageService.delete( $scope.ids , 'stuFlagInfo:delete', function (error, message) {
            $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
            angular.element('#stuFlagManageTable').bootstrapTable('refresh');
            alertService('success', '删除成功');
            });
            $uibModalInstance.close();
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openDeleteController.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'item', 'arrange_stuFlagManageService', 'alertService'];

    // 导出控制器
    var openExportController = function ($rootScope, $timeout, $compile, $scope, $uibModalInstance, item, arrange_stuFlagManageService, alertService, formVerifyService, app) {
        var isCheckAll = false;
        $scope.afterSelectAll = function () {
            if (isCheckAll) {
                $("input[name='afterFruit']").each(function () {
                    this.checked = false;
                });
                isCheckAll = false;
            } else {
                $("input[name='afterFruit']").each(function () {
                    this.checked = true;
                });
                isCheckAll = true;
            }
        };
        $scope.afterReport = function () {
            var header = [];
            var tbody = [];
            var index = 0;
            var obj = document.getElementsByName("afterFruit");
            var check_val = [];
            for (var i = 0; i < obj.length; i++) {
                if (obj[i].checked)
                    check_val.push(obj[i].value);
            }
            if (check_val.length > 0) {
                header = check_val;
            } else {
                alertService("error", '至少选中一个字段,才能导出');
                // modalFactory.openAlert({message:'至少选中一个字段,才能导出',scope: $scope});
                return;
            }
            // var excel = {
            //     name : $scope.data.title,
            //     thead : header,
            //     relationship:$scope.data.relationship,//表头和实体关系
            //     param : $scope.data.param //条件查询参数
            // }
            // $rootScope.$broadcast('to-excel', excel);
        }
        // $scope.listTitle = $scope.stuFlagManageTable.columns ; //
        // $scope.listTitleEnd = [];
        // var tbodys = [];
        // for(var i = 1; i < $scope.listTitle.length; i++) {
        //     if($scope.listTitle[i].title !="序号" && $scope.listTitle[i].title !="操作"){
        //         var tbody = {} ;
        //         $scope.listTitleEnd.push($scope.listTitle[i].title);
        //         var filed = $scope.listTitle[i].field;
        //         var title = $scope.listTitle[i].title;
        //         tbody[filed]= title;
        //         tbodys.push(tbody)
        //     }
        // }
        // var paramslist = {
        //     title: "单位信息",//表名
        //     thead: $scope.listTitleEnd,//弹出框按钮
        //     relationship:tbodys,//表头和实体关系
        //     param: $scope.searchListForm
        // };
        //
        // $timeout(function() {
        //     $rootScope.$broadcast('drillTable', paramslist);
        //     $('.showDrilltable').css('display', 'block');
        // }, 0);
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    };
    openExportController.$inject = ['$rootScope', '$timeout', '$compile', '$scope', '$uibModalInstance', 'item', 'arrange_stuFlagManageService', 'alertService', 'formVerifyService', 'app'];
    //查询学生信息
    var initStuInfoTable = function ($scope, $rootScope, app, $compile, arrange_stuFlagManageService, alertService) {
        // 表格的高度
        $scope.table_height = 305;
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNum: params.pageNumber  //页码
            };
            // 去除为 null 或 "" 值的查询字段
            var stuFlagInfoAddQuery = {};
            angular.forEach($scope.stuFlagInfo, function (data, index, array) {
                if (data) {
                    stuFlagInfoAddQuery[index] = data;
                }
            });
            $rootScope.$log.debug(angular.extend(pageParam, stuFlagInfoAddQuery));
            return angular.extend(pageParam, stuFlagInfoAddQuery);
        };
        $scope.stuFlagManageAddTable = {
            // url: 'data_test/student/tableview_stuFlagInfoAdd.json',
            url: app.api.address + '/student/countrystu/countryStuGather',
            headers: {
                permission: "stuFlagInfo:query"
            },
            method: 'post',
            // method: 'get',
            cache: false,
            height: $scope.table_height,
            toolbar: '#stuFlagManageAddTable_toolbar', //工具按钮用哪个容器
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
                $compile(angular.element('#stuFlagManageAddTable').contents())($scope);
            },
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#stuFlagManageAddTable').contents())($scope);
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
                {field: "stuNumber", title: '学号', align: "center", valign: "middle"},
                {field: "stuName", title: '姓名', align: "center", valign: "middle"},
                {field: "gender", title: '性别', align: "center", valign: "middle"},
                {
                    field: "whetherInSchool", title: '是否在校', align: "center", valign: "middle",
                    formatter: function (value, row, index) {
                        if (value == 1) {
                            return "是";
                        } else if (value == 0) {
                            return "否";
                        }
                    }
                },
                {field: "entranceType", title: '入学方式', align: "center", valign: "middle"}
            ]
        };
        // 查询表单提交
        $scope.search = function () {
            angular.element('#stuFlagManageAddTable').bootstrapTable('selectPage', 1);
        }
        // 查询表单重置
        $scope.reset = function () {
            $scope.stuFlagInfo = {};
            // 重新初始化下拉框
            angular.element('form[name="stuFlagAdd_form"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#stuFlagManageAddTable').bootstrapTable('selectPage', 1);
        }
    };
    //初始化搜索数据
    var initIndexSeacher = function ($scope, $window, $rootScope, app, $compile, $http, arrange_stuFlagManageService, baseinfo_generalService, alertService) {
        //查询性别数据
        baseinfo_generalService.findcodedataNames({datableNumber: "XBM"}, function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.sexList = data.data;//性别
            $rootScope.$log.debug(data);

        });
        //查询学生标签数据,这个不明确 直接在html中写死
        // baseinfo_generalService.findcodedataNames( {datableNumber: "XSLBDM"},function (error, message, data) {
        //     if (error) {
        //         alertService(message);
        //         return;
        //     }
        //     $scope.studentTagList = data.data;
        //     $rootScope.$log.debug(data);
        //
        // });
        //查询学院数据
        baseinfo_generalService.findDepartmentNamesBox(function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.deptList = data.data;
            $rootScope.$log.debug(data);

        });
        //   $http({
        //       method: "get",
        //       // url: "/student-status/new-student/select"
        //       url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_college.json",
        //   }).then(function (response) {
        //       $scope.deptList = response.data.data.list;
        //
        //   }, function (response) {
        //       console.log(response);
        //   });
        //   //查询年 级数据
        baseinfo_generalService.gradeList(function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.gradeList = data.data;
            $rootScope.$log.debug(data);

        });
        //查询专业方向数据，参数0
        baseinfo_generalService.professionDirectionPull({majorProfessionDircetion: "0"}, function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.majorList = data.data;
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
            $scope.classMajorList = data.data;
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
                    $scope.classMajorList = data.data;
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
                $scope.classMajorList = data.data;
                $rootScope.$log.debug(data);

            });
            console.log("Fiume");
        });
        //   //查询班 级数据
        baseinfo_generalService.classList(function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.executiveClassNameList = data.data;
            $rootScope.$log.debug(data);

        });
        //查询当前校区数据
        baseinfo_generalService.findCampusNamesBox(function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.schoolAreaList = data.data;
            $rootScope.$log.debug(data);

        });
        //查询是否在校数据，直接写在html里面
        //   $http({
        //       method: "get",
        //       // url: "/student-status/new-student/select"
        //       url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_atSchoolStatus.json",
        //   }).then(function (response) {
        //       $scope.whetherInSchoolId = response.data.data.list;
        //
        //   }, function (response) {
        //       console.log(response);
        //   });
        //   //查询入学方式数据
        baseinfo_generalService.findcodedataNames({datableNumber: "RXFSM"}, function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.entranceTypeList = data.data;
            $rootScope.$log.debug(data);

        });
    };
    // 初始化表格
    var initIndexTable = function ($scope, $window, $rootScope, app, $compile, arrange_stuFlagManageService, alertService) {
        // 表格的高度
        // $scope.table_height = $window.innerHeight - 275;
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNum: params.pageNumber  //页码
            };
            // 去除为 null 或 "" 值的查询字段
            var stuFlagInfoQuery = {};
            angular.forEach($scope.stuFlagInfo, function (data, index, array) {
                if (data) {
                    stuFlagInfoQuery[index] = data;
                }
            });
            $rootScope.$log.debug(angular.extend(pageParam, stuFlagInfoQuery));
            return angular.extend(pageParam, stuFlagInfoQuery);
        };
        $scope.stuFlagManageTable = {
            // url: 'data_test/student/tableview_stuFlagInfo.json',
            url: app.api.address + '/student/stuFlagInfo/list',
            headers: {
                permission: "stuFlagInfo:query"
            },
            // method: 'get',
            method: 'post',
            cache: false,
            height: $scope.table_height,
            toolbar: '#stuFlag_toolbar', //工具按钮用哪个容器
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
                console.log(response.data)
                console.log(response.data.rows)
                console.log(response.data.total)
                return {
                    total: response.data.total,
                    rows: response.data.rows
                };
            },
            onLoadSuccess: function () {
                $compile(angular.element('#stuFlagManageTable').contents())($scope);
            },
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#stuFlagManageTable').contents())($scope);
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
                {field: "stuNumber", title: '学号', align: "center", valign: "middle"},
                {field: "stuName", title: '姓名', align: "center", valign: "middle"},
                {field: "gender", title: '性别', align: "center", valign: "middle"},
                {field: "stuFlagName", title: '学生标签', align: "center", valign: "middle"},
                {field: "locationCampus", title: '学院', align: "center", valign: "middle"},
                {field: "professionDirect", title: '专业方向', align: "center", valign: "middle"},
                {field: "grade", title: '年级', align: "center", valign: "middle"},
                {field: "gradeProfession", title: '年级专业方向', align: "center", valign: "middle"},
                {field: "clasz", title: '班级', align: "center", valign: "middle"},
                {field: "registerCampus", title: '当前校区', align: "center", valign: "middle"},
                {
                    field: "whetherInSchool", title: '是否在校', align: "center", valign: "middle",
                    formatter: function (value, row, index) {
                        if (value == 1) {
                            return "是";
                        } else if (value == 0) {
                            return "否";
                        }
                    }
                },
                {field: "entranceType", title: '入学方式', align: "center", valign: "middle"},
                {field: "flagTime", title: '标记时间', align: "center", valign: "middle"}
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
            angular.element('#stuFlagManageTable').bootstrapTable('resetView', {height: $scope.table_height});
        }
        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#stuFlagManageTable').bootstrapTable('selectPage', 1);
        }
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.stuFlagInfo = {};
            // 重新初始化下拉框
            angular.element('form[name="stuFlagManageSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#stuFlagManageTable').bootstrapTable('selectPage', 1);
        }
    }

})(window);
