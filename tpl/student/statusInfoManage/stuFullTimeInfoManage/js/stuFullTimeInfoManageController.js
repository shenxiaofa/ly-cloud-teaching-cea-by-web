/**
 * Created by Administrator on 2018/1/17.
 */
;(function (window, undefined) {
    'use strict';

    window.arrange_stuFullTimeInfoManageController = function ($compile, $scope, $uibModal, $view, $rootScope, $window, $timeout, $state, $http, arrange_stuFullTimeInfoManageService, alertService, app) {
        //监听屏幕宽度改变搜索框的样式
        $scope.rightContentHeight = $(".right-content-search").height()+20-40;
        $scope.rightHeaderHeight = $(".header").height()+20;
        $scope.rightTableToolbarHeight = $("#stuFullTimeInfo_toolbar").height()+10;
        $scope.table_height = $window.innerHeight - ($scope.rightContentHeight+40+$scope.rightHeaderHeight+$scope.rightTableToolbarHeight);
        window.onresize = function(){
            $scope.rightContentHeight = $(".right-content-search").height()+20-40;
            $scope.rightHeaderHeight = $(".header").height()+20;
            $scope.rightTableToolbarHeight = $("#stuFullTimeInfo_toolbar").height()+10;
            $scope.table_height = $window.innerHeight - ($scope.rightContentHeight+40+$scope.rightHeaderHeight+$scope.rightTableToolbarHeight);
        };
        // 国内学生学籍管理查询对象
        $scope.stuFullTimeInfo = {};
        //初始化搜索数据
        initIndexSearch($scope, $rootScope, app, $compile, $http, arrange_stuFullTimeInfoManageService, alertService);
        // 初始化表格
        initIndexTable($scope, $window, $rootScope, app, $compile, arrange_stuFullTimeInfoManageService, alertService);
        // 打开新增面板
        $scope.openAdd = function () {
            // 跳转到编辑页面
            $("body").fadeOut();
            $timeout(function () {
                $state.go("home.common.stuInfoAdd");
            }, 500);
            $("body").fadeIn(800);
        };
        // 打开修改面板
        $scope.openModify = function (row) {
            // 跳转到编辑页面
            $("body").fadeOut();
            $timeout(function () {
                $state.go("home.common.stuInfoEdit", {stuFullTimeInfo: row});
            }, 500);
            $("body").fadeIn(800);
        };
        // 打开学号查看详细信息面板
        $scope.openViewDetail = function (row) {
            // 跳转到编辑页面
            $("body").fadeOut();
            $timeout(function () {
                $state.go("home.common.stuInfoView", {stuFullTimeInfo: row});
            }, 500);
            $("body").fadeIn(800);
        };
        // 打开删除面板
        $scope.openDelete = function ( ) {
            var rows = angular.element('#stuFullTimeInfoTable').bootstrapTable('getSelections');
            if (rows.length == 0) {
                //打开提示框
                alertService("warn", "请选中要删除的记录!");
                return false;
            }
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/student/statusInfoManage/stuFullTimeInfoManage/delete.html',
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
    arrange_stuFullTimeInfoManageController.$inject = ['$compile', '$scope', '$uibModal', '$view', '$rootScope', '$window', '$timeout', '$state', '$http', 'arrange_stuFullTimeInfoManageService', 'alertService', 'app'];


     // 删除控制器
    var openDeleteController = function ($rootScope, $scope, $uibModalInstance, item, arrange_stuFullTimeInfoManageService, alertService) {
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {
            $rootScope.showLoading = true; // 开启加载提示
            // arrange_stuFullTimeInfoManageService.delete(item.stuFullTimeInfoId, 'stuFullTimeInfo:delete', function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
            //     if (error) {
            //         alertService(message);
            //         return;
            //     }
                angular.element('#stuFullTimeInfoTable').bootstrapTable('refresh');
                alertService('success', '删除成功');
            // });
            $uibModalInstance.close();
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openDeleteController.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'item', 'arrange_stuFullTimeInfoManageService', 'alertService'];

    //初始化搜索数据
    var initIndexSearch = function ($scope, $rootScope, app, $compile, $http, arrange_stuFullTimeInfoManageService, alertService) {
        // 出生日期参数配置
        $scope.bornTimeOptions = {
            opened: false,
            open: function () {
                $scope.bornTimeOptions.opened = true;
            }
        };
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
        //查询学制数据
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFullTimeInfo/tableview_stuFullTimeInfo_schoolForm.json",
        }).then(function (response) {
            $scope.schoolFormList = response.data.data.list;

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
        //查询当前校区数据
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_schoolArea.json",
        }).then(function (response) {
            $scope.schoolAreaList = response.data.data.list;

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

    };
    // 初始化表格
    var initIndexTable = function ($scope, $window, $rootScope, app, $compile, arrange_stuFullTimeInfoManageService, alertService) {
        // 表格的高度
        // $scope.table_height = $window.innerHeight - 384;
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNum: params.pageNumber  //页码
            };
            // 去除为 null 或 "" 值的查询字段
            var stuFullTimeInfoQuery = {};
            angular.forEach($scope.stuFullTimeInfo, function (data, index, array) {
                if (data) {
                    stuFullTimeInfoQuery[index] = data;
                }
            });
            $rootScope.$log.debug(angular.extend(pageParam, stuFullTimeInfoQuery));
            return angular.extend(pageParam, stuFullTimeInfoQuery);
        };
        $scope.stuFullTimeInfoTable = {
            url: 'data_test/student/tableview_stuFullTimeInfo.json',
            // url: app.api.address + '/student/stuFullTimeInfo',
            headers: {
                permission: "stuFullTimeInfo:query"
            },
            method: 'get',
            cache: false,
            height: $scope.table_height,
            toolbar: '#stuFullTimeInfo_toolbar', //工具按钮用哪个容器
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
                $compile(angular.element('#stuFullTimeInfoTable').contents())($scope);
            },
            onColumnSwitch: function (field, checked) {
                var visibleColumns = $('#stuFullTimeInfoTable').bootstrapTable('getVisibleColumns', "");
                if (visibleColumns.length <= 15) {
                    $('#stuFullTimeInfoTable').removeClass("tableScroll");
                } else {
                    $('#stuFullTimeInfoTable').addClass("tableScroll");
                }
                $compile(angular.element('#stuFullTimeInfoTable').contents())($scope);
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
                {field: "examNum", title: '考生号', align: "center", valign: "middle"},
                {
                    field: "num", title: '学号', align: "center", valign: "middle",
                    /*formatter: function (value, row, index) {
                        return "<p style='cursor:pointer;color:#33aadd' ng-click='openViewDetail(" + angular.toJson(row) + ")'>" + value + " </p>";
                    }*/
                },
                {field: "name", title: '姓名', align: "center", valign: "middle"},
                {field: "sexCode", title: '性别', align: "center", valign: "middle"},
                {field: "dept", title: '学院', align: "center", valign: "middle"},
                {field: "majorSubject", title: '专业方向', align: "center", valign: "middle"},
                {field: "grade", title: '年级', align: "center", valign: "middle"},
                {field: "classMajor", title: '年级专业方向', align: "center", valign: "middle"},
                {field: "standardName", title: '国标专业', align: "center", valign: "middle", visible: false},
                {field: "majorType", title: '专业大类', align: "center", valign: "middle", visible: false},
                {field: "schoolForm", title: '学制', align: "center", valign: "middle"},
                {field: "goSchooleTime", title: '入学日期', align: "center", valign: "middle"},
                {field: "class", title: '班级', align: "center", valign: "middle", visible: false},
                {field: "schoolArea", title: '当前校区', align: "center", valign: "middle"},
                {field: "studyStatus", title: '学籍状态', align: "center", valign: "middle"},
                {
                    field: "schoolStatus", title: '是否在校', align: "center", valign: "middle",
                    formatter: function (value, row, index) {
                        if (value == 1) {
                            return "在校";
                        } else if (value == 0) {
                            return "不在校";
                        }
                    }
                },
                {
                    field: "nationStatus",
                    title: '是否在籍',
                    align: "center",
                    valign: "middle",
                    visible: false,
                    formatter: function (value, row, index) {
                        if (value == 1) {
                            return "在籍";
                        } else if (value == 0) {
                            return "不在籍";
                        }
                    }
                },
                {field: "orginCode", title: '生源地', align: "center", valign: "middle", visible: false},
                {field: "schoolWay", title: '入学方式', align: "center", valign: "middle", visible: false},
                {field: "bornTime", title: '出生日期', align: "center", valign: "middle", visible: false},
                {field: "idCard", title: '身份证件号', align: "center", valign: "middle", visible: false},
                {field: "politicalStatus", title: '政治面貌', align: "center", valign: "middle", visible: false},
                {field: "nationCode", title: '民族', align: "center", valign: "middle", visible: false},

                {
                    field: "operation", title: "操作", align: "center", valign: "middle",
                    formatter: function (value, row, index) {
                        var modifyBtn = "<button has-permission='stuFullTimeInfo:update' type='button' class='btn btn-sm btn-default' ng-click='openModify(" + angular.toJson(row) + ")'><span class='fa fa-edit toolbar-btn-icon'></span>修改</button>";
                        // var deleteBtn = "<button has-permission='stuFullTimeInfo:delete' type='button' class='btn btn-sm btn-default del-btn' ng-click='openDelete(" + angular.toJson(row) + ")'><span class='fa fa-times toolbar-btn-icon'></span>删除</button>";
                        return modifyBtn + "&nbsp;" ;
                    }
                }
            ]
        };
        // 查询表单显示和隐藏切换
        $scope.isHideSearchForm = false; // 默认显示
        $scope.searchFormHideToggle = function () {
            $scope.isHideSearchForm = !$scope.isHideSearchForm;
            if ($scope.isHideSearchForm) {
                // $scope.table_height = $scope.table_height + 280;
                $scope.table_height = $scope.table_height + $scope.rightContentHeight ;
            } else {
                $scope.table_height = $scope.table_height - $scope.rightContentHeight  ;
            }
            angular.element('#stuFullTimeInfoTable').bootstrapTable('resetView', {height: $scope.table_height});
        }
        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#stuFullTimeInfoTable').bootstrapTable('selectPage', 1);
        }
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.stuFullTimeInfo = {};
            // 重新初始化下拉框
            angular.element('form[name="stuFullTimeInfoManageSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#stuFullTimeInfoTable').bootstrapTable('selectPage', 1);
        }
    }

})(window);
