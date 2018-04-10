/**
 * Created by Administrator on 2017-07-18.
 */
;(function (window, undefined) {
    'use strict';

    window.Start_plateSettingController = function ($timeout,$compile,$scope, $uibModal, $rootScope, $window, Start_plateSettingService, alertService, app) {
        // 模块设置查询对象
        $scope.plateSetting = {};
        //tree菜单高度
        $scope.leftTreeStyle = {
            "height": $window.innerHeight-70
        };
        // 树菜单参数设置
        $scope.zTreeOptions = {
            view: {
                dblClickExpand: false,
                showLine: true,
                selectedMulti: false
            },
            async: {
                enable: true,
                url: app.api.address + '/virtual-class/openPlan/selectGradeTree',
                type:'get',
                dataFilter: function (treeId, parentNode, responseData) {
                    var result = [];
                    var array = responseData.data;
                    for(var i = 0; i < array.length; i++){
                        var perArray = array[i];
                        for(var n = 0; n < perArray.length; n++){
                            var item = {
                                id: i + 1
                            };
                            if(n == 0){
                                item.parentId = 0;
                                item.openSign = perArray[0][1];
                                item.name = perArray[0][0];
                                item.type = "xnxq";
                            }else{
                                item.id = n + 10;
                                item.parentId = i + 1;
                                item.name = perArray[n][1];
                                item.type = perArray[n][0];
                            }
                            result.push(item);
                        }
                    }
                    return result;
                }
            },
            data: {
                key: {
                    url: ""
                },
                simpleData: {
                    enable:true,
                    idKey: "id",
                    pIdKey: "parentId",
                    rootPId: ""
                }
            },
            callback: {
                onAsyncSuccess: function (event, treeId, treeNode, msg) {
                    // 模拟点击树节点
                    var treeObj = $.fn.zTree.getZTreeObj(treeId);
                    if(treeObj){
                        // 展开根节点(调用默认展开第一个结点 )
                        var nodes = treeObj.getNodes();
                        angular.forEach(nodes, function(data, index, array){
                            // treeObj.expandNode(data, true);
                            if(data.openSign=='1'){
                                var childNodes = treeObj.transformToArray(nodes[index]);
                                var childNodes1 = treeObj.transformToArray(childNodes[1]);
                                treeObj.selectNode(childNodes1[0]); //选中第一个父节点下面第一个子节点
                                if(childNodes1[0]){
                                    treeObj.setting.callback.onClick(null, treeObj.setting.treeId, childNodes1[0]);//点击第一个父节点下面第一个子节点
                                }
                            }else{
                                var childNodes = treeObj.transformToArray(nodes[0]);
                                var childNodes1 = treeObj.transformToArray(childNodes[1]);
                                treeObj.selectNode(childNodes1[0]); //选中第一个父节点下面第一个子节点
                                if(childNodes1[0]){
                                    treeObj.setting.callback.onClick(null, treeObj.setting.treeId, childNodes1[0]);//点击第一个父节点下面第一个子节点
                                }
                            }
                        });
                    }
                },
                onClick: function(event, treeId, treeNode) {
                    var type = treeNode.type;
                    var name = treeNode.name;
                    if (type == "xnxq") { // 等级课程学年学期
                        $scope.plateSetting.planId = "";
                    } else { // 项目课程名称
                        $scope.plateSetting.planId = type;
                        // $rootScope.xnxq = treeNode.parentNode.name;
                        $rootScope.type = type;
                    }
                    // 刷新右边内容数据（若是初始化，由于表格未初始化，报异常，不需处理）
                    try {
                        angular.element('#showTable').bootstrapTable('refresh');
                    } catch (e) {}
                }
            }
        };
        // 表格的高度
        $scope.toolbar_height = angular.element('#toolbar').height();
        $scope.menu_height = angular.element('#menu').height();
        $scope.search_height = angular.element('#searchHeight').height();
        $scope.table_height = $window.innerHeight - $scope.toolbar_height - $scope.menu_height - $scope.search_height - 58;
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder
            };
            return angular.extend(pageParam, $scope.plateSetting);
        }
        $scope.showTable = {
            onLoadSuccess: function() {
                $compile(angular.element('#showTable').contents())($scope);
            },
            //url: 'data_test/starts/tableview_plateSetting.json',
            url: app.api.address + '/virtual-class/gradePlateSetting',
            method: 'get',
            cache: false,
            height: $scope.table_height,
            toolbar: '#toolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [5,10, 20, 30, 50, 100], // 设置可供选择的页面数据条数
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            sortName: 'classTime', // 默认排序字段
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
            columns: [
                {checkbox: true,align:"center",valign:"middle", width: "5%"},
                {field:"id", title:"主键", visible:false},
                {field:"plateId", visible:false},
                {field:"timeSettingId", visible:false},
                {field:"semesterId", visible:false},
                {field:"courseId", visible:false},
                {field:"executiveClassId", visible:false},
                {field:"",title:"序号",align:"center",valign:"middle", width: "5%", formatter: function (value, row, index) {
                    return index+1;
                }},
                {field:"deptName",title:"学院",align:"center",valign:"middle"},
                {field:"major",title:"专业",align:"center",valign:"middle"},
                {field:"executiveClass",title:"行政班级",align:"center",valign:"middle"},
                {field:"courseName",title:"课程名称",align:"center",valign:"middle"},
                {field:"plateName",title:"板块",align:"center",valign:"middle"},
                {field:"plateTime",title:"上课时间",align:"center",valign:"middle"},
                {field:"",title:"操作",align:"center",valign:"middle",width: "10%",
                    formatter : function (value, row, index) {
                        var setting = "<button has-permission='plateSetting:plateSet' type='button' ng-click='setting(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>板块安排</button>";
                        return setting;
                    }
                }
            ]
        };

        // 查询表单显示和隐藏切换
        $scope.isHideSearchForm = false; // 默认显示
        $scope.searchFormHideToggle = function () {
            $scope.isHideSearchForm = !$scope.isHideSearchForm
            if ($scope.isHideSearchForm) {
                $scope.table_height = $scope.table_height + 115;
            } else {
                $scope.table_height = $scope.table_height - 115;
            }
            angular.element('#showTable').bootstrapTable('resetView',{ height: $scope.table_height } );
        }

        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#showTable').bootstrapTable('selectPage', 1);
            // angular.element('#showTable').bootstrapTable('refresh');
        };
        // 查询表单重置
        $scope.searchReset = function () {
            var planId = $scope.plateSetting.planId ;
            $scope.plateSetting = {};
            $scope.plateSetting.planId = planId;
            angular.element('#showTable').bootstrapTable('refresh');
            angular.element('form[name="plateSettingSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
        }



        // 打开板块安排面板
        $scope.setting = function(date){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/starts/plateSetting/plateArrangement.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return date;
                    }
                },
                controller: plateArrangementController
            });
        };

        // 打开清空板块安排面板
        $scope.cleanPlate = function(){
            var rows = angular.element('#showTable').bootstrapTable('getSelections');
            if(rows.length == 0){
                alertService('请先选择要删除的项');
                return;
            }
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/starts/plateSetting/emptyPlate.html',
                size: 'lg',
                resolve: {
                    items: function () {
                        return rows;
                    },
                },
                controller: deleteController
            });
        };
    };
    Start_plateSettingController.$inject = ['$timeout','$compile','$scope', '$uibModal', '$rootScope', '$window', 'Start_plateSettingService', 'alertService', 'app'];

    // 修改控制器
    var plateArrangementController = function ($compile, $scope, $uibModalInstance, item, Start_plateSettingService, alertService, formVerifyService) {
        var selectData = [];
        $scope.plateObjs = [];
        Start_plateSettingService.get( function (data) {
            selectData = data;
            addSelectDate();
        });
        var addSelectDate = function () {
            $scope.plateObjs = selectData;
            if(!$scope.plateSetting.plateId){
                $scope.plateSetting.plateTime = "";
            }
            angular.forEach(selectData , function(data,index,array){
                if($scope.plateSetting.plateId ==data.id){
                    if(data.gradePlateTime){
                        data.gradePlateTime = data.gradePlateTime.replace(/<\/br>/g,"\r\n");
                    }
                    $scope.plateSetting.plateTime =data.gradePlateTime ;
                }
            });
            console.log($scope.plateObjs);
            var html = '' +
                '<select ng-change="testChange()" ui-select2 ng-options="plateObj.id as plateObj.name  for plateObj in plateObjs" ui-chosen="codeGrade_add_form.plateId" ng-required="true" '
             +  ' ng-model="plateSetting.plateId" id="plateId" name="plateId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
             +  '<option value="">==请选择==</option> '
             +  '</select>';
            angular.element("#plateId").parent().empty().append(html);
            $compile(angular.element("#plateId").parent().contents())($scope);
        }

        $scope.testChange=function(){
            console.log($scope.plateSetting.plateId);
            if(!$scope.plateSetting.plateId){
                $scope.plateSetting.plateTime = "";
            }
            angular.forEach(selectData , function(data,index,array){
                if($scope.plateSetting.plateId ==data.id){
                    if(data.gradePlateTime){
                        data.gradePlateTime = data.gradePlateTime.replace(/<\/br>/g,"\r\n");
                    }
                    $scope.plateSetting.plateTime =data.gradePlateTime ;
                }
            });
        }
        
        // 数据初始化
        $scope.plateSetting = item;
        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };

            Start_plateSettingService.update($scope.plateSetting, function (error, message) {
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
    plateArrangementController.$inject = ['$compile', '$scope', '$uibModalInstance', 'item', 'Start_plateSettingService', 'alertService', 'formVerifyService'];


    // 删除控制器
    var deleteController = function ($scope, $uibModalInstance, items, Start_plateSettingService, alertService) {
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {
            var ids = []; // 代码类型号数组
            items.forEach (function(gradeListMaintenance) {
                ids.push(gradeListMaintenance.timeSettingId);
            });
            Start_plateSettingService.delete(ids, function (error, message) {
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
    deleteController.$inject = ['$scope', '$uibModalInstance', 'items', 'Start_plateSettingService', 'alertService'];

})(window);

