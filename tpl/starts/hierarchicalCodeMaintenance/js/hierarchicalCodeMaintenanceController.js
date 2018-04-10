/**
 * Created by Administrator on 2017-07-18.
 */
;(function (window, undefined) {
    'use strict';

    window.Start_hierarchicalCodeMaintenanceController = function ($compile,$scope, $uibModal, $rootScope, $window, Start_hierarchicalCodeMaintenanceService, alertService, app) {
        // 表格的高度
        $scope.toolbar_height = angular.element('#toolbar').height();
        $scope.menu_height = angular.element('#menu').height();
        $scope.search_height = angular.element('#searchHeight').height();
        $scope.table_height = $window.innerHeight - $scope.toolbar_height - $scope.menu_height - 38;
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var attributeNamesForOrderBy = {};
            attributeNamesForOrderBy[params.sortName] = params.sortOrder;
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                attributeNamesForOrderBy: attributeNamesForOrderBy
            };
            return angular.extend(pageParam, $scope.codeGrade);
        }
        $scope.showTable = {
            onLoadSuccess: function() {
                $compile(angular.element('#showTable').contents())($scope);
            },
            // url: 'data_test/starts/tableview_hierarchicalCodeMaintenance.json',
            url: app.api.address + '/virtual-class/levelCodeType',
            method: 'get',
            cache: false,
            height: $scope.table_height,
            toolbar: '#toolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [10, 20, 30, 50, 100], // 设置可供选择的页面数据条数
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            sortName: 'num', // 默认排序字段
            sortOrder: 'asc', // 默认排序方式
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
            columns: [
                {checkbox: true, width: "5%"},
                {field:"id", title:"主键", visible:false},
                {field:"",title:"序号",align:"center",valign:"middle", width: "5%", formatter: function (value, row, index) {
                    return index+1;
                }},
                {field:"num",title:"等级类别码",align:"center",valign:"middle",sortable:true},
                {field:"name",title:"等级类别",align:"center",valign:"middle"},
                {field:"engName",title:"英文名称",align:"center",valign:"middle"},
                {field:"courseNum",title:"对应课程号",align:"center",valign:"middle",sortable:true},
                {field:"courseName",title:"对应课程名称",align:"center",valign:"middle"},
                {field:"operation",title:"操作",align:"center",valign:"middle",width: "20%",
                    formatter : function (value, row, index) {
                        var infoEditBtn = "<button has-permission='hierarchicalCodeMaintenance:update' type='button' ng-click='openModify(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>修改</button>";
                        var codeMaintain = "<button has-permission='hierarchicalCodeMaintenance:codeMaintenance' id='btn_fzrsz'  type='button' ng-click='codeMaintain(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>代码维护</button>";
                        return infoEditBtn+"&nbsp"+codeMaintain;
                    }
                }
            ]
        };


        // 打开新增面板
        $scope.openAdd = function(){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/starts/hierarchicalCodeMaintenance/index_add.html',
                size: '',
                controller: openAddController
            });
        };
        // 打开修改面板
        $scope.openModify = function(data){

            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/starts/hierarchicalCodeMaintenance/index_modify.html',
                size: '',
                resolve: {
                    item: function () {
                        return data;
                    }
                },
                controller: openModifyController
            });
        };


        // 打开删除面板
        $scope.openDelete = function(){
            var rows = angular.element('#showTable').bootstrapTable('getSelections');
            if(rows.length == 0){
                alertService('请先选择要删除的项');
                return;
            }
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/starts/hierarchicalCodeMaintenance/index_delete.html',
                size: '',
                resolve: {
                    items: function () {
                        return rows;
                    },
                },
                controller: openDeleteController
            });
        };

        // 代码维护
        $scope.codeMaintain = function(data){

            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/starts/hierarchicalCodeMaintenance/index_codeMaintain.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return data;
                    }
                },
                controller: codeMaintainController
            });
        };
    };
    Start_hierarchicalCodeMaintenanceController.$inject = ['$compile','$scope', '$uibModal', '$rootScope', '$window', 'Start_hierarchicalCodeMaintenanceService', 'alertService', 'app'];

    // 添加控制器
    var openAddController = function ($compile, $scope, $uibModalInstance, $uibModal, Start_hierarchicalCodeMaintenanceService, formVerifyService, alertService) {
        // 对应课程信息下拉框数据
        $scope.courseData = [
            {
                id: "",
                name:"==请选择=="
            }
        ];
        Start_hierarchicalCodeMaintenanceService.getCourse(function (error, message, data) {
            for(var i = 0; i < data.rows.length; i++){
                $scope.courseData.push(data.rows[i]);
            }
            var html = '' +
                '<select ng-model="codeGrade.courseId"  ng-required="true" id="courseName" name="courseName" ui-jq="chosen" ui-options="{search_contains: true}"  class="form-control">'+
                '<option ng-repeat="date in courseData" value="{{date.id}}">{{date.name}}</option>'+
                '</select>';
            angular.element("#courseName").parent().empty().append(html);
            $compile(angular.element("#courseName").parent().contents())($scope);

        });
        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };

            Start_hierarchicalCodeMaintenanceService.add($scope.codeGrade, function (error, message) {
                if (error) {
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                angular.element('#showTable').bootstrapTable('refresh');
                alertService('success', '新增成功');
            });
        };
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    };
    openAddController.$inject = ['$compile', '$scope', '$uibModalInstance', '$uibModal', 'Start_hierarchicalCodeMaintenanceService', 'formVerifyService', 'alertService'];

    // 修改控制器
    var openModifyController = function ($compile, $scope, $uibModalInstance, item, Start_hierarchicalCodeMaintenanceService, alertService, formVerifyService) {
        // 对应课程信息下拉框数据
        $scope.courseData = [
            {
                id: "",
                name:"==请选择=="
            }
        ];
        Start_hierarchicalCodeMaintenanceService.getCourse(function (error, message, data) {
            for(var i = 0; i < data.rows.length; i++){
                $scope.courseData.push(data.rows[i]);
            }
            var html = '' +
                '<select ng-model="codeGrade.courseId"  ng-required="true" id="courseName" name="courseName" ui-jq="chosen" ui-options="{search_contains: true}"  class="form-control">'+
                '<option ng-repeat="date in courseData" value="{{date.id}}">{{date.name}}</option>'+
                '</select>';
            angular.element("#courseName").parent().empty().append(html);
            $compile(angular.element("#courseName").parent().contents())($scope);
        });
        // 数据初始化
        $scope.codeGrade = item;
        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };

            Start_hierarchicalCodeMaintenanceService.update($scope.codeGrade, function (error, message) {
                if (error) {
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                angular.element('#showTable').bootstrapTable('refresh');
                alertService('success', '修改成功');
            });
        };
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    };
    openModifyController.$inject = ['$compile', '$scope', '$uibModalInstance', 'item', 'Start_hierarchicalCodeMaintenanceService', 'alertService', 'formVerifyService'];

    // 维护代码控制器
    var codeMaintainController = function (Start_hierarchicalCodeMaintenanceService, alertService,app,$compile,$rootScope, $uibModal,$window,$scope, $uibModalInstance, item) {
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var attributeNamesForOrderBy = {};
            attributeNamesForOrderBy[params.sortName] = params.sortOrder;
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
               attributeNamesForOrderBy: attributeNamesForOrderBy
            };
            return angular.extend(pageParam, $scope.code);
        };
        // 表格的高度
        var win_height = $window.innerHeight;
        var table_height = win_height - 100;
        $rootScope.$log.debug("win_height: " + win_height);
        $rootScope.$log.debug("table_height: " + table_height);
        $scope.levelCodeTable = {
            onLoadSuccess: function() {
                $compile(angular.element('#levelCodeTable').contents())($scope);
            },
            // url: 'data_test/starts/tableview_codeLevel.json',
            url: app.api.address + '/virtual-class/levelCodeSetting/levelTypeId/' + item.id,
            method: 'get',
            cache: false,
            height: table_height,
            toolbar: '#toolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [10, 20, 30, 50, 100], // 设置可供选择的页面数据条数
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            sortName: 'sort', // 默认排序字段
            sortOrder: 'asc', // 默认排序方式
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
            columns: [
                {checkbox: true, width: "5%"},
                {field:"id", title:"主键", visible:false},
                {field:"",title:"序号",align:"center",valign:"middle", width: "5%", formatter: function (value, row, index) {
                    return index+1;
                }},
                {field:"num",title:"等级代码",align:"center",valign:"middle"},
                {field:"name",title:"等级名称",align:"center",valign:"middle"},
                {field:"sort",title:"排序",align:"center",valign:"middle",sortable:true},
                {field:"operation",title:"操作",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        var infoEditBtn1 = "<button has-permission='hierarchical:codeMaintenance:update'  type='button' ng-click='aaa(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>修改</button>";
                        return infoEditBtn1;
                    }
                }
            ]
        };

        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#levelCodeTable').bootstrapTable('selectPage', 1);
            // angular.element('#levelCodeTable').bootstrapTable('refresh');
        }
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.code = {};
            angular.element('#levelCodeTable').bootstrapTable('refresh');
        }

        // 打开新增面板
        $scope.openAdd = function(){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/starts/hierarchicalCodeMaintenance/code_add.html',
                size: '',
                resolve: {
                    item: function () {
                        return item;
                    },
                },
                controller: openAddCodeController
            });
        };

        // 打开删除面板
        $scope.openDelete = function(){
            var rows = angular.element('#levelCodeTable').bootstrapTable('getSelections');
            if(rows.length == 0){
                alertService('请先选择要删除的项');
                return;
            }
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/starts/hierarchicalCodeMaintenance/code_delete.html',
                size: '',
                resolve: {
                    items: function () {
                        return rows;
                    },
                },
                controller: openDeleteCodeController
            });
        };

        // 打开等级修改面板
        $scope.aaa = function(data){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/starts/hierarchicalCodeMaintenance/code_modify.html',
                size: '',
                resolve: {
                    item: function () {
                        return data;
                    }
                },
                controller: levelModifyController
            });
        };
        $scope.ok = function () {
            // var rows = angular.element('#levelCodeTable').bootstrapTable('getSelections');

            // Start_hierarchicalCodeMaintenanceService.add($scope.gradeListMaintenance, function (error, message) {
            //     if (error) {
            //         alertService(message);
            //         return;
            //     }
            $uibModalInstance.close();
            angular.element('#showTable').bootstrapTable('refresh');
            alertService('success', '新增成功');
            // });
        };
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    };
    codeMaintainController.$inject = ['Start_hierarchicalCodeMaintenanceService', 'alertService','app','$compile','$rootScope','$uibModal', '$window','$scope', '$uibModalInstance', 'item'];

    // 添加控制器
    var openAddCodeController = function (item,$scope, $uibModalInstance, $uibModal, Start_hierarchicalCodeMaintenanceService, formVerifyService, alertService) {

        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };

            $scope.code.levelTypeId = item.id;

            Start_hierarchicalCodeMaintenanceService.addCode($scope.code, function (error, message) {
                if (error) {
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                angular.element('#levelCodeTable').bootstrapTable('refresh');
                alertService('success', '新增成功');
            });
        };
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    };
    openAddCodeController.$inject = ['item','$scope', '$uibModalInstance', '$uibModal', 'Start_hierarchicalCodeMaintenanceService', 'formVerifyService', 'alertService'];

    // 等级修改控制器
    var levelModifyController = function ($scope, $uibModalInstance, item, Start_hierarchicalCodeMaintenanceService, alertService, formVerifyService) {
        // 数据初始化
        $scope.code = item;
        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };

            Start_hierarchicalCodeMaintenanceService.codeUpdate($scope.code, function (error, message) {
                if (error) {
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                angular.element('#levelCodeTable').bootstrapTable('refresh');
                alertService('success', '修改成功');
            });
        };
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    };
    levelModifyController.$inject = ['$scope', '$uibModalInstance', 'item', 'Start_hierarchicalCodeMaintenanceService', 'alertService', 'formVerifyService'];

    // 删除代码控制器
    var openDeleteCodeController = function ($scope, $uibModalInstance, items, Start_hierarchicalCodeMaintenanceService, alertService) {
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {
            var ids = []; // 等级代码设置数组
            var levelIds = []; //等级Id
            items.forEach (function(code) {
                ids.push(code.id);
                levelIds.push(code.levelId);
            });
            Start_hierarchicalCodeMaintenanceService.codeDelete({ids:ids,levelIds:levelIds}, function (error, message) {
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#levelCodeTable').bootstrapTable('refresh');
                alertService('success', '删除成功');
            });
            $uibModalInstance.close();
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openDeleteCodeController.$inject = ['$scope', '$uibModalInstance', 'items', 'Start_hierarchicalCodeMaintenanceService', 'alertService'];

    // 删除控制器
    var openDeleteController = function ($scope, $uibModalInstance, items, Start_hierarchicalCodeMaintenanceService, alertService) {
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {
            var ids = []; // 代码类型号数组
            items.forEach (function(codeGrade) {
                ids.push(codeGrade.id);
            });
            Start_hierarchicalCodeMaintenanceService.delete(ids, function (error, message) {
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#showTable').bootstrapTable('refresh');
                alertService('success', '删除成功');
            });
            $uibModalInstance.close();
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openDeleteController.$inject = ['$scope', '$uibModalInstance', 'items', 'Start_hierarchicalCodeMaintenanceService', 'alertService'];

})(window);

