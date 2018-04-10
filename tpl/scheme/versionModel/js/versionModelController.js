;(function (window, undefined) {
    'use strict';

    window.scheme_versionModelController = function (app, $compile, $scope, $uibModal, $rootScope, $window, $timeout, scheme_versionModelService, alertService) {
        // 模块设置查询对象
        $scope.versionModel = {};
        // 范围维护查询对象
        $scope.modelDataRange = {
            schemeVersion_ID:"", //版本id
            grade:"",//年份
            name:"",//模块名称
            department:""//操作单位
        };
        $scope.schemeVersion_ID = "";
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
                url: app.api.address + '/scheme/version/tree',
                type: "GET",
                dataFilter: function (treeId, parentNode, responseData) {
                    
                    return responseData.data;
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
                    // 展开根节点
                    var nodes = treeObj.getNodes();
                    angular.forEach(nodes, function(data, index, array){
                        treeObj.expandNode(data, true);
                    });
                    // 模拟点击第一个根节点
                    var node = treeObj.getNodesByFilter(function (node) {
                        return node.level == 1;
                    }, true);
                    angular.element("#"+node.tId+"_a").trigger("click");
                },
                onClick: function(event, treeId, treeNode) {
                    var type = treeNode.type;
                    var name = treeNode.name;
                    var id = treeNode.id;
                    if (type == "grade") { // 培养方案适用年份
                        return;
                        // $scope.versionModel.schemeName = "";
                        // $scope.versionModel.grade = name;
                        // $scope.modelDataRange.schemeVersion_ID = "";
                        // $scope.modelDataRange.grade = name;
                    } else { // 培养方案版本名称
                        $scope.versionModel.schemeName = name;
                        $scope.versionModel.grade = "";
                        $scope.modelDataRange.schemeVersion_ID = id;
                        $scope.modelDataRange.grade = "";
                        $scope.schemeVersion_ID = id;
                    }
                    // 刷新右边内容数据（若是初始化，由于表格未初始化，报异常，不需处理）
                    try {
                        angular.element('#versionModelTable').bootstrapTable('refresh');
                        angular.element('#modelDataRangeTable').bootstrapTable('refresh');
                    } catch (e) {}
                }
            }
        };
        // 表格的高度
        $scope.versionModelTableHeight = $window.innerHeight - 104;
        // 查询参数
        $scope.versionModelQueryParams = function versionModelQueryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
            };
            $rootScope.$log.debug(angular.extend(pageParam, $scope.versionModel));
            return angular.extend(pageParam, $scope.versionModel);
        }
        $scope.versionModelTable = {
            //url: 'data_test/scheme/tableview_versionModel.json',
            url: app.api.address + '/scheme/versionModel',
            method: 'get',
            cache: false,
            height: $scope.versionModelTableHeight,
            toolbar: '#versionModelToolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [10, 20, 30], // 设置可供选择的页面数据条数
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField : "id", // 指定主键列
            uniqueId: "id", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.versionModelQueryParams,//传递参数（*）
            search: false,
            showColumns: true,
            showRefresh: true,
            responseHandler:function(response){
                return response.data;
            },
            onLoadSuccess: function() {
                $compile(angular.element('#versionModelTable').contents())($scope);
            },
            columns: [
                {checkbox: true, width: "5%"},
                {field:"id", title:"主键", visible:false},
                {field:"name",title:"模块名称",align:"left",valign:"middle"},
                {field:"courseProperty_ID",title:"课程性质id",visible:false},
                {field:"courseProperty",title:"课程性质",align:"center",valign:"middle"},
                {field:"presetCourseSign",title:"是否预置课程",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        if (value == "1") {
                            return "是"
                        }
                        return "否";
                    }
                },
                {field:"departments",title:"操作范围",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        var names = "";
                        angular.forEach(value, function(data, index, array){
                            names += data.name + "、";
                        });
                        if (names.length > 0) {
                            names = names.substring(0, names.length - 1);
                        }
                        return names;
                    }
                },
                {field:"operation",title:"操作",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        return "<button type='button' has-permission='versionModel:model:update' class='btn btn-sm btn-default' ng-click='versionModelOpenModify("+ angular.toJson(row) +")'><span class='fa fa-edit toolbar-btn-icon'></span>修改</button>";
                    }
                }
            ]
        };
        
        // 判断卡片是都被点击
        $scope.clickAlready1 = function(){
			angular.element('#versionModelTable').bootstrapTable('refresh');
        };

        // 模块设置打开新增面板
        $scope.versionModelOpenAdd = function(){
            if($scope.schemeVersion_ID === ""){
                alertService("请选择培养方案版本");
                return;
            }
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/scheme/versionModel/versionModelAdd.html',
                size: 'lg',
                resolve: {
                    schemeVersion_ID: function () {
                        return $scope.schemeVersion_ID;
                    }
                },
                controller: versionModelOpenAddController
            });
        };
        // 模块设置打开修改面板
        $scope.versionModelOpenModify = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/scheme/versionModel/versionModelModify.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return row;
                    }
                },
                controller: versionModelOpenModifyController
            });
        };
        // 打开模块设置删除面板
        $scope.versionModelOpenDelete = function(){
            var rows = angular.element('#versionModelTable').bootstrapTable('getSelections');
            if(rows.length == 0){
                alertService('请先选择要删除的项');
                return;
            }
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/scheme/versionModel/versionModelDelete.html',
                size: '',
                resolve: {
                    items: function () {
                        return rows;
                    },
                },
                controller: versionModelOpenDeleteController
            });
        };

        // 表格的高度
        $scope.modelDataRangeTableHeight = $window.innerHeight - 230;
        // 查询参数
        $scope.modelDataRangeQueryParams = function modelDataRangeQueryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
            };
            $rootScope.$log.debug(angular.extend(pageParam, $scope.modelDataRange));
            return angular.extend(pageParam, $scope.modelDataRange);
        }
        $scope.modelDataRangeTable = {
            //url: 'data_test/scheme/tableview_modelDataRange.json',
            url: app.api.address + '/scheme/versionModel/dataRange',
            method: 'get',
            cache: false,
            height: $scope.modelDataRangeTableHeight,
            toolbar: '#modelDataRangeToolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [10, 20, 30], // 设置可供选择的页面数据条数
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField : "id", // 指定主键列
            uniqueId: "id", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.modelDataRangeQueryParams,//传递参数（*）
            search: false,
            showColumns: true,
            showRefresh: true,
            responseHandler:function(response){
                return response.data;
            },
            onLoadSuccess: function() {
                $compile(angular.element('#modelDataRangeTable').contents())($scope);
            },
            columns: [
                {checkbox: true, width: "5%"},
                {field:"id", title:"主键", visible:false},
                {field:"name",title:"模块名称",align:"left",valign:"middle"},
                {field:"courseProperty_ID",title:"课程性质",align:"center",valign:"middle"},
                {field:"presetCourseSign",title:"是否预置课程",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        if (value == "1") {
                            return "是"
                        }
                        return "否";
                    }
                },
                {field:"operationDeptName",title:"操作单位",align:"center",valign:"middle"},
                {field:"departments",title:"数据范围",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        var names = "";
                        angular.forEach(value, function(data, index, array){
                            names += data.dataDeptName + "、";
                        });
                        if (names.length > 0) {
                            names = names.substring(0, names.length - 1);
                        }
                        return names;
                    }
                },
                {field:"operation",title:"操作",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        return "<button type='button' has-permission='versionModel:data:update' class='btn btn-sm btn-default' ng-click='modelDataRangeOpenModify("+ angular.toJson(row) +")'><span class='fa fa-edit toolbar-btn-icon'></span>修改</button>";
                    }
                }
            ]
        };
        
        // 判断卡片是都被点击
        $scope.clickAlready2 = function(){
			angular.element('#modelDataRangeTable').bootstrapTable('refresh');
        };

        // 查询表单显示和隐藏切换
        $scope.isHideSearchForm = false; // 默认显示
        $scope.searchFormHideToggle = function () {
            $scope.isHideSearchForm = !$scope.isHideSearchForm
            if ($scope.isHideSearchForm) {
                $scope.modelDataRangeTableHeight = $scope.modelDataRangeTableHeight + 15;
            } else {
                $scope.modelDataRangeTableHeight = $scope.modelDataRangeTableHeight - 15;
            }
            angular.element('#modelDataRangeTable').bootstrapTable('resetView',{ height: $scope.modelDataRangeTableHeight } );
        };
        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#modelDataRangeTable').bootstrapTable('selectPage', 1);
            //angular.element('#modelDataRangeTable').bootstrapTable('refresh');
        };
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.modelDataRange.versionModelName = "";
            $scope.modelDataRange.deptName = "";
            angular.element('#modelDataRangeTable').bootstrapTable('refresh');
        };
        // 打开范围维护修改面板
        $scope.modelDataRangeOpenModify = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/scheme/versionModel/modelDataRangeModify.html',
                size: '',
                resolve: {
                    item: function () {
                        return row;
                    }
                },
                controller: modelDataRangeOpenModifyController
            });
        };
        // 打开范围维护删除面板
        $scope.modelDataRangeOpenDelete = function(){
            var rows = angular.element('#modelDataRangeTable').bootstrapTable('getSelections');
            if(rows.length == 0){
                alertService('请先选择要删除的项');
                return;
            }
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/scheme/versionModel/modelDataRangeDelete.html',
                size: '',
                resolve: {
                    items: function () {
                        return rows;
                    },
                },
                controller: modelDataRangeOpenDeleteController
            });
        };
    };
    scheme_versionModelController.$inject = ['app', '$compile', '$scope', '$uibModal', '$rootScope', '$window', '$timeout', 'scheme_versionModelService', 'alertService'];

    // 模块设置添加控制器
    var versionModelOpenAddController = function ($rootScope, $scope, $compile, $uibModalInstance, $uibModal, schemeVersion_ID, scheme_versionModelService, formVerifyService, alertService) {
        //课程模块下拉框数据
        $scope.courseModel = [];
        scheme_versionModelService.getCourseModel(function (error,message,data) {
            $scope.courseModel = data.data;
            var html = '' +
                '<select ui-select2 ng-change="changeCode()" ui-chosen="versionModelAddform.model_ID" ng-required="true" '
                +  ' ng-model="versionModel.model_ID" id="model_ID" name="model_ID" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option  ng-repeat="a in courseModel" value="{{a.id}}">{{a.name}}</option> '
                +  '</select>';
            angular.element("#model_ID").parent().empty().append(html);
            $compile(angular.element("#model_ID").parent().contents())($scope);
        });
        //绑定模块代码
        $scope.changeCode = function () {
            var modelID = angular.element("#model_ID").val();
            $scope.versionModel.id = modelID;
            $scope.courseModel.forEach (function(schemeMd) {
                if(modelID === schemeMd.id){
                    $scope.versionModel.modelCode = schemeMd.code;
                    return;
                }
            });
        }
        //课程属性
        $scope.courseProperty = [];
        scheme_versionModelService.getSelected('KCSXDM',function (error,message,data) {
            $scope.courseProperty = data.data;
            var html = '' +
                '<select ui-select2  ui-chosen="versionModelAddform.courseProperty_ID" ng-required="true" '
                +  ' ng-model="versionModel.courseProperty_ID" id="courseProperty_ID" name="courseProperty_ID" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option  ng-repeat="a in courseProperty" value="{{a.id}}">{{a.name}}</option> '
                +  '</select>';
            angular.element("#courseProperty_ID").parent().empty().append(html);
            $compile(angular.element("#courseProperty_ID").parent().contents())($scope);
        });
        
        //单位
        $scope.dept = [];
        scheme_versionModelService.getDept(function (error,message,data) {
            $scope.dept = data.data;
            var html = '' +
                '<select ui-select2  multiple ui-chosen="versionModelAddform.modelOperationRange"  '
                +  ' ng-model="versionModel.modelOperationRange" id="modelOperationRange" name="modelOperationRange" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option  ng-repeat="a in dept" value="{{a.id}}">{{a.name}}</option> '
                +  '</select>';
            angular.element("#modelOperationRange").parent().empty().append(html);
            $compile(angular.element("#modelOperationRange").parent().contents())($scope);
        });
        // 数据初始化
        $scope.versionModel = {
            presetCourseSign: "0", // 是否预置课程
            modelCode : "",// 只做展示
            model_ID : "", //模块id
            courseProperty_ID: "", //课程属性id
            modelOperationRange: [], //操作范围
            schemeVersion_ID: schemeVersion_ID
        };
        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            $rootScope.showLoading = true;
            scheme_versionModelService.versionModelAdd($scope.versionModel, function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else {
                    angular.element('#versionModelTable').bootstrapTable('refresh');
                    angular.element('#modelDataRangeTable').bootstrapTable('refresh');
                    alertService('success', '新增成功');
                }
                $uibModalInstance.close();
            });
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    versionModelOpenAddController.$inject = ['$rootScope', '$scope', '$compile', '$uibModalInstance', '$uibModal', 'schemeVersion_ID', 'scheme_versionModelService', 'formVerifyService', 'alertService'];

    // 模块设置修改控制器
    var versionModelOpenModifyController = function ($rootScope, $scope, $compile, $uibModalInstance, item, scheme_versionModelService, alertService, formVerifyService) {
        var modelOperationRange = [];
        angular.forEach(item.departments, function(data, index, array){
            modelOperationRange.push(data.id);
        });
        var modelDataRange = [];
        angular.forEach(item.modelDataRange, function(data, index, array){
            modelDataRange.push(data.id);
        });

        //课程模块下拉框数据
        $scope.courseModel = [];
        scheme_versionModelService.getCourseModel(function (error,message,data) {
            $scope.courseModel = data.data;
            var html = '' +
                '<select ui-select2 ng-change="changeCode()" ui-chosen="versionModelModifyForm.model_ID" ng-required="true" '
                +  ' ng-model="versionModel.model_ID" id="model_ID" name="model_ID" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option  ng-repeat="a in courseModel" value="{{a.id}}">{{a.name}}</option> '
                +  '</select>';
            angular.element("#model_ID").parent().empty().append(html);
            $compile(angular.element("#model_ID").parent().contents())($scope);
        });
        //绑定模块代码
        $scope.changeCode = function () {
            var modelID = angular.element("#model_ID").val();
            $scope.versionModel.id = modelID;
            $scope.courseModel.forEach (function(schemeMd) {
                if(modelID === schemeMd.id){
                    $scope.versionModel.modelCode = schemeMd.code;
                    return;
                }
            });
        }
        //课程属性
        $scope.courseProperty = [];
        scheme_versionModelService.getSelected('KCSXDM',function (error,message,data) {
            $scope.courseProperty = data.data;
            var html = '' +
                '<select ui-select2  ui-chosen="versionModelModifyForm.courseProperty_ID" ng-required="true" '
                +  ' ng-model="versionModel.courseProperty_ID" id="courseProperty_ID" name="courseProperty_ID" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option  ng-repeat="a in courseProperty" value="{{a.id}}">{{a.name}}</option> '
                +  '</select>';
            angular.element("#courseProperty_ID").parent().empty().append(html);
            $compile(angular.element("#courseProperty_ID").parent().contents())($scope);
        });

        //单位
        $scope.dept = [];
        scheme_versionModelService.getDept(function (error,message,data) {
            $scope.dept = data.data;
            var html = '' +
                '<select ui-select2  multiple ui-chosen="versionModelModifyForm.modelOperationRange" ng-required="true" '
                +  ' ng-model="versionModel.modelOperationRange" id="modelOperationRange" name="modelOperationRange" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option  ng-repeat="a in dept" value="{{a.id}}">{{a.name}}</option> '
                +  '</select>';
            angular.element("#modelOperationRange").parent().empty().append(html);
            $compile(angular.element("#modelOperationRange").parent().contents())($scope);
        });

        // 数据初始化
        $scope.versionModel = {
            id: item.id, // 版本模块主键
            model_ID: item.model_ID, // 课程模块id
            modelCode: item.modelCode, // 课程模块代码
            //name: item.model_ID, // 课程模块名称
            courseProperty_ID: item.courseProperty_ID, // 课程属性
            presetCourseSign: item.presetCourseSign, // 是否预置课程
            modelOperationRange: modelOperationRange // 操作范围
        };
        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            $rootScope.showLoading = true;
            scheme_versionModelService.versionModelUpdate($scope.versionModel, function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else {
                    angular.element('#versionModelTable').bootstrapTable('refresh');
                    angular.element('#modelDataRangeTable').bootstrapTable('refresh');
                    alertService('success', '修改成功');
                }
                $uibModalInstance.close();

            });
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    versionModelOpenModifyController.$inject = ['$rootScope', '$scope', '$compile', '$uibModalInstance', 'item', 'scheme_versionModelService', 'alertService', 'formVerifyService'];

    // 模块设置删除控制器
    var versionModelOpenDeleteController = function ($rootScope, $scope, $uibModalInstance, items, scheme_versionModelService, alertService) {
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {
            var ids = [];
            items.forEach (function(versionModel) {
                ids.push(versionModel.id);
            });
            $rootScope.showLoading = true;
            scheme_versionModelService.versionModelDelete(ids, function (error, message) {
                $rootScope.showLoading = false;
                if (error) {
                    alertService(message);
                    return;
                }else{
                    angular.element('#versionModelTable').bootstrapTable('refresh');
                    angular.element('#modelDataRangeTable').bootstrapTable('refresh');
                   // alertService('success', '删除成功');
                }
                $uibModalInstance.close();

            });
            $uibModalInstance.close();
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    versionModelOpenDeleteController.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'items', 'scheme_versionModelService', 'alertService'];

    // 范围维护修改控制器
    var modelDataRangeOpenModifyController = function ($rootScope, $scope, $compile, $uibModalInstance, item, scheme_versionModelService, alertService, formVerifyService) {

        // scheme_versionModelService.getDataDept(item.versionModel_ID, item.operationDept_ID,function (error,message,data) {
        //     data.data.forEach (function(dept) {
        //         $scope.modelDataRange.dataRange_ID.push(dept.id);
        //     });
        // });

        // 数据初始化
        $scope.modelDataRange = {
            id: item.id, // 主键
            dataRange_ID: [] // 数据范围
        };
        angular.forEach(item.departments, function(data, index, array){
            $scope.modelDataRange.dataRange_ID.push(data.dataDept_ID);
        });

        //单位
        $scope.dept = [];
        scheme_versionModelService.getDept(function (error,message,data) {
            $scope.dept = data.data;
            var html = '' +
                '<select ui-select2  multiple ui-chosen="modelDataRangeModifyForm.dataRange_ID" ng-required="true" '
                +  ' ng-model="modelDataRange.dataRange_ID" id="dataRange_ID" name="dataRange_ID" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option  ng-repeat="a in dept" value="{{a.id}}">{{a.name}}</option> '
                +  '</select>';
            angular.element("#dataRange_ID").parent().empty().append(html);
            $compile(angular.element("#dataRange_ID").parent().contents())($scope);
        });
        $scope.ok = function (form) {

            //如果不选择，默认数据范围就是操作单位本身
            if($scope.modelDataRange.dataRange_ID.length == 0){
                $scope.modelDataRange.dataRange_ID[0] = item.operationDept_ID;
            }
            $rootScope.showLoading = true; // 开启加载提示
            scheme_versionModelService.modelDataRangeUpdate($scope.modelDataRange, function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else{
                    angular.element('#modelDataRangeTable').bootstrapTable('refresh');
                    alertService('success', '修改成功');
                }
                $uibModalInstance.close();

            });
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    modelDataRangeOpenModifyController.$inject = ['$rootScope', '$scope', '$compile', '$uibModalInstance', 'item', 'scheme_versionModelService', 'alertService', 'formVerifyService'];

    // 范围维护删除控制器
    var modelDataRangeOpenDeleteController = function ($rootScope, $scope, $uibModalInstance, items, scheme_versionModelService, alertService) {
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {
            var ids = [];
            items.forEach (function(modelDataRange) {
                ids.push(modelDataRange.id);
            });
            $rootScope.showLoading = true; // 开启加载提示
            scheme_versionModelService.modelDataRangeDelete(ids, function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else {
                    angular.element('#modelDataRangeTable').bootstrapTable('refresh');
                    //alertService('success', '删除成功');
                }
                $uibModalInstance.close();
            });
            $uibModalInstance.close();
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    modelDataRangeOpenDeleteController.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'items', 'scheme_versionModelService', 'alertService'];

})(window);
