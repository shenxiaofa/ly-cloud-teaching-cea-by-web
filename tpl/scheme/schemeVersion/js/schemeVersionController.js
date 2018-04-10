;(function (window, undefined) {
    'use strict';

    window.scheme_schemeVersionController = function ($compile, $scope, $uibModal, $rootScope, $window, scheme_schemeVersionService, alertService, app) {
        //学生类别下拉框数据
        $scope.category = [];
        scheme_schemeVersionService.getSelected('XSLBDM', function (error,message,data) {
            $scope.category = data.data;
            var html = '' +
                '<select  ui-chosen="schemeVersionSearchForm.educationLevel" '
                +  ' ng-model="scheme.educationLevel" id="educationLevel" name="educationLevel" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option ng-repeat="a in category" value="{{a.dataNumber}}">{{a.dataName}}</option> '
                +  '</select>';
            angular.element("#educationLevel").parent().empty().append(html);
            $compile(angular.element("#educationLevel").parent().contents())($scope);
        });

        // 表格的高度
        $scope.table_height = $window.innerHeight - 184;
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder
            };
            return angular.extend(pageParam, $scope.scheme);
        }
        $scope.schemeVersionTable = {
            //url: 'data_test/scheme/tableview_schemeVersion.json',
            url: app.api.address + '/scheme/version',
            method: 'get',
            cache: false,
            height: $scope.table_height,
            toolbar: '#toolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [10, 20, 30], // 设置可供选择的页面数据条数
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            sortName: 'createTime', // 默认排序字段
            sortOrder: 'desc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField : "id", // 指定主键列
            uniqueId: "id", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParams,//传递参数（*）
            search: false,
            showColumns: true,
            showRefresh: true,
            responseHandler:function(response){
                return response.data;
            },
            onLoadSuccess: function() {
                $compile(angular.element('#schemeVersionTable').contents())($scope);
            },
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#schemeVersionTable').contents())($scope);
            },
            columns: [
                {checkbox: true, width: "5%"},
                {field:"id", title:"主键", visible:false},
                {field:"educationLevel_ID", title:"学生类别id/培养层次id", visible:false},
                {field:"name",title:"版本名称",align:"left",valign:"middle"},
                {field:"studentCategory",title:"学生类别",align:"center",valign:"middle",sortable:false},
                {field:"educationYear", title:"学制",align:"center",valign:"middle",sortable:false},
                {field:"grade",title:"适用年份",align:"center",valign:"middle",sortable:false},
                {field:"startTime",title:"开始日期",align:"center",valign:"middle",sortable:false},
                {field:"endTime",title:"结束日期",align:"center",valign:"middle",sortable:false},
                {field:"creator",title:"创建人",align:"center",valign:"middle"},
                {field:"createTime",title:"创建时间",align:"center",valign:"middle",sortable:false},
                {field:"operation",title:"操作",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        return "<button type='button' has-permission='schemeVersion:update' class='btn btn-sm btn-default' ng-click='openModify("+ angular.toJson(row) +")'><span class='fa fa-edit toolbar-btn-icon'></span>修改</button>";
                    }
                }
            ]
        };
        // 查询表单显示和隐藏切换
        $scope.isHideSearchForm = false; // 默认显示
        $scope.searchFormHideToggle = function () {
            $scope.isHideSearchForm = !$scope.isHideSearchForm
            if ($scope.isHideSearchForm) {
                $scope.table_height = $scope.table_height + 75;
            } else {
                $scope.table_height = $scope.table_height - 75;
            }
            angular.element('#schemeVersionTable').bootstrapTable('resetView',{ height: $scope.table_height } );
        }
        // 查询表单提交
        $scope.searchSubmit = function () {
            $scope.scheme.educationLevel_ID = $scope.scheme.educationLevel;
            angular.element('#schemeVersionTable').bootstrapTable('selectPage', 1);
            //angular.element('#schemeVersionTable').bootstrapTable('refresh');
        }
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.scheme = {};
            // 重新初始化下拉框
            angular.element('form[name="schemeVersionSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#schemeVersionTable').bootstrapTable('refresh');
        }
        // 打开新增面板
        $scope.openAdd = function(){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/scheme/schemeVersion/add.html',
                size: 'lg',
                controller: openAddController
            });
        };
        // 打开修改面板
        $scope.openModify = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/scheme/schemeVersion/modify.html',
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
        $scope.openDelete = function(){
            var rows = angular.element('#schemeVersionTable').bootstrapTable('getSelections');
            if(rows.length == 0){
                alertService('请先选择要删除的项');
                return;
            }
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/scheme/schemeVersion/delete.html',
                size: '',
                resolve: {
                    items: function () {
                        return rows;
                    },
                },
                controller: openDeleteController
            });
        };
    };
    scheme_schemeVersionController.$inject = ['$compile', '$scope', '$uibModal', '$rootScope', '$window', 'scheme_schemeVersionService', 'alertService', 'app'];

    // 添加控制器
    var openAddController = function ($rootScope,app, $compile, $filter, $scope, $uibModalInstance, $uibModal, scheme_schemeVersionService, formVerifyService, alertService) {
        //学生类别下拉框数据
        $scope.studentCategory = [];
        scheme_schemeVersionService.getSelected('XSLBDM', function (error,message,data) {
            $scope.studentCategory = data.data;
            var html = '' +
                '<select ui-select2  ui-chosen="schemeVersionAddform.educationLevel" ng-required="true" '
                +  ' ng-model="schemeVersion.educationLevel_ID" id="educationLevel_ID" name="educationLevel" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option ng-repeat="a in studentCategory" value="{{a.dataNumber}}">{{a.dataName}}</option> '
                +  '</select>';
            angular.element("#educationLevel_ID").parent().empty().append(html);
            $compile(angular.element("#educationLevel_ID").parent().contents())($scope);
        });
        // 数据初始化
        $scope.schemeVersion = {
            name: "", // 版本名称
            educationLevel_ID: "", // 培养层次
            grade: "", // 适用年份
            startTime: "", // 开始日期
            endTime: "", // 结束日期
            remark: "", // 培养方案简介
        };
        // 开始日期参数配置
        $scope.startTimeOptions = {
            opened: false,
            open: function() {
                $scope.startTimeOptions.opened = true;
            }
        };
        // 结束日期参数配置
        $scope.endTimeOptions = {
            opened: false,
            open: function() {
                $scope.endTimeOptions.opened = true;
            }
        };
        // 结束日期小于开始日期时的提示
        $scope.endTimeTooltipEnableAndOpen = false;
        $scope.$watch('schemeVersion.endTime', function (newValue) {
            if ($scope.schemeVersion.startTime && newValue && (newValue < $scope.schemeVersion.startTime)) {
                $scope.endTimeTooltipEnableAndOpen = true;
                return;
            }
            $scope.endTimeTooltipEnableAndOpen = false;
        });
        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            //转日期格式
            $scope.schemeVersion.startTime =  $filter("date")($scope.schemeVersion.startTime, app.date.format);
            $scope.schemeVersion.endTime =  $filter("date")($scope.schemeVersion.endTime, app.date.format);
            $rootScope.showLoading = true; // 开启加载提示
            scheme_schemeVersionService.add($scope.schemeVersion, function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else {
                    alertService('success', '保存成功');
                    angular.element('#schemeVersionTable').bootstrapTable('refresh');
                    $uibModalInstance.close();
                }
            });

        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openAddController.$inject = ['$rootScope','app', '$compile', '$filter', '$scope', '$uibModalInstance', '$uibModal', 'scheme_schemeVersionService', 'formVerifyService', 'alertService'];

    // 修改控制器
    var openModifyController = function ($rootScope, $scope, $compile, $uibModalInstance, item, scheme_schemeVersionService, alertService, formVerifyService) {
        //学生类别下拉框数据
        $scope.studentCategory = [];
        scheme_schemeVersionService.getSelected('XSLBDM', function (error,message,data) {
            $scope.studentCategory = data.data;
            var html = '' +
                '<select ui-select2  ui-chosen="schemeVersionModifyform.educationLevel" ng-required="true" '
                +  ' ng-model="schemeVersion.educationLevel_ID" id="educationLevel_ID" name="educationLevel" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option ng-repeat="a in studentCategory" value="{{a.dataNumber}}">{{a.dataName}}</option> '
                +  '</select>';
            angular.element("#educationLevel_ID").parent().empty().append(html);
            $compile(angular.element("#educationLevel_ID").parent().contents())($scope);
        });


        // 数据初始化
        $scope.schemeVersion = item;
        $scope.schemeVersion.startTime = new Date(item.startTime), // 开始日期
        $scope.schemeVersion.endTime = new Date(item.endTime), // 结束日期
            // 开始日期参数配置
            $scope.startTimeOptions = {
                opened: false,
                open: function() {
                    $scope.startTimeOptions.opened = true;
                }
            };
        // 结束日期参数配置
        $scope.endTimeOptions = {
            opened: false,
            open: function() {
                $scope.endTimeOptions.opened = true;
            }
        };
        // 结束日期小于开始日期时的提示
        $scope.endTimeTooltipEnableAndOpen = false;
        $scope.$watch('schemeVersion.endTime', function (newValue) {
            if ($scope.schemeVersion.startTime && newValue && (newValue < $scope.schemeVersion.startTime)) {
                $scope.endTimeTooltipEnableAndOpen = true;
                return;
            }
            $scope.endTimeTooltipEnableAndOpen = false;
        });    
        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            console.log($scope.schemeVersion);
            $rootScope.showLoading = true; // 开启加载提示
            scheme_schemeVersionService.update($scope.schemeVersion, function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                }else{
                    angular.element('#schemeVersionTable').bootstrapTable('refresh');
                    alertService('success', '修改成功');
                    $uibModalInstance.close();
                }

            });
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openModifyController.$inject = ['$rootScope', '$scope', '$compile', '$uibModalInstance', 'item', 'scheme_schemeVersionService', 'alertService', 'formVerifyService'];

    // 删除控制器
    var openDeleteController = function ($rootScope, $scope, $uibModalInstance, items, scheme_schemeVersionService, alertService) {
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {
            var ids = [];
            items.forEach (function(schemeVersion) {
                ids.push(schemeVersion.id);
            });
            $rootScope.showLoading = true;
            scheme_schemeVersionService.delete(ids, function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else{
                    angular.element('#schemeVersionTable').bootstrapTable('refresh');
                    //alertService('success', '删除成功');
                }
                $uibModalInstance.close();
            });

        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openDeleteController.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'items', 'scheme_schemeVersionService', 'alertService'];

})(window);
