/**
 * Created by Administrator on 2017-07-18.
 */
;(function (window, undefined) {
    'use strict';

    window.Start_plateTeachingTaskController = function ($timeout,$compile,$scope, $uibModal, $rootScope, $window, Start_plateTeachingTaskService, alertService, app) {
        $scope.plateSetting = {};
        $scope.plateTeaching = {};
        $scope.gradeNumObjs="";
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
                        angular.element('#plateTable').bootstrapTable('refresh');
                    } catch (e) {}
                }
            }
        };
        // 表格的高度
        // $scope.toolbar_height = angular.element('#toolbar').height();
        // $scope.menu_height = angular.element('#menu').height();
        // $scope.search_height = angular.element('#searchHeight').height();
        // $scope.table_height = $window.innerHeight - $scope.toolbar_height - $scope.menu_height - $scope.search_height - 90;
        $scope.relative_height = ($window.innerHeight - 175)/2;
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
        $scope.yxzmk = "";
        $scope.sksj = "";

        $scope.plateTable = {
            onLoadSuccess: function(data) {
                $compile(angular.element('#plateTable').contents())($scope);
                if(data.total>0){
                    angular.element('#plateTable').bootstrapTable('check', 0);
                }
            },
            //url: 'data_test/starts/tableview_plateTask.json',
            url: app.api.address + '/virtual-class/gradePlateArrange',
            method: 'get',
            cache: false,
            height: $scope.relative_height,
            toolbar: '#toolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 5,
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
            showColumns: false,
            showRefresh: false,
            responseHandler:function(response){
                return response.data;
            },
            clickToSelect: true,
            onCheck: function (row) {
                $scope.$apply(function () {
                    $scope.gradeNumObjs="";
                    $scope.yxzmk = row.name;
                    if(row.gradePlateTime){
                        $scope.sksj = row.gradePlateTime.replace(/<\/br>/g,',');
                    }else{
                        $scope.sksj = "";
                    }
                    $scope.plateTeaching.plateId = row.id;
                    $scope.plateTeaching.planId = $scope.plateSetting.planId;
                    Start_plateTeachingTaskService.getGradeNum($scope.plateTeaching,function (data) {
                        selectGradeNum(data);
                        // console.log($scope.gradeNumObjs);
                    });
                    var selectGradeNum = function (gradeNumObjs) {
                        if(gradeNumObjs.length==0){
                            $scope.gradeNumObjs="";
                        }else{
                            angular.forEach(gradeNumObjs, function(data,index, array){
                                array[index] ="等级："+data.gradeName+"     人数："+data.arrangeNum+"      已安排人数："+data.arrangedNum+"      教学班："+data.classCount;
                                $scope.gradeNumObjs = $scope.gradeNumObjs + array[index] +"\r\n";
                            });
                        }
                    }
                    angular.element('#classTable').bootstrapTable('refresh');
                });
            },
            columns: [
                {radio: true, width: "5%"},
                {field:"id", title:"主键", visible:false},
                {field:"",title:"序号",align:"center",valign:"middle", width: "5%", formatter: function (value, row, index) {
                    return index+1;
                }},
                {field:"name",title:"模块",align:"center",valign:"middle"},
                {field:"classNum",title:"教学任务数",align:"center",width: "20%",valign:"middle"},
                {field:"gradePlateTime",title:"上课时间",align:"center",width: "40%",valign:"middle"},
            ]
        };
        $scope.queryParams1 = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder
            };
            return angular.extend(pageParam, $scope.plateTeaching);
        }
        $scope.classTable = {
            onLoadSuccess: function() {
                $compile(angular.element('#classTable').contents())($scope);
            },
            // url: 'data_test/starts/tableview_teachingClass.json',
            url: app.api.address + '/virtual-class/gradePlateArrange/select',
            method: 'get',
            cache: false,
            height: $scope.relative_height,
            toolbar: '#toolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 5,
            pageNumber:1,
            pageList: [5,10, 20, 30, 50, 100], // 设置可供选择的页面数据条数
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            sortName: 'startStopCycle', // 默认排序字段
            sortOrder: 'desc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField : "id", // 指定主键列
            uniqueId: "id", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParams1,//传递参数（*）
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
                {field:"num",title:"教学班号",align:"center",valign:"middle"},
                {field:"name",title:"教学班名称",align:"center",valign:"middle"},
                {field:"gradeId", visible:false},
                {field:"semesterId", visible:false},

                {field:"gradeName",title:"对应等级",align:"center",valign:"middle"},
                {field:"lowestCount",title:"最低开班人数",align:"center",valign:"middle"},
                {field:"highestCount",title:"最高容纳人数",align:"center",valign:"middle"},
                {field:"",title:"操作",align:"center",valign:"middle",width: "20%",
                    formatter : function (value, row, index) {
                        var setting = "<button has-permission='plateTeachingTask:update' type='button' ng-click='modify(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>修改</button>";
                        var maintenanceList = "<button has-permission='plateTeachingTask:classList' type='button' ng-click='classList(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>名单维护</button>";
                        return setting+"&nbsp"+maintenanceList;
                    }
                }

            ]
        };

        // 查询表单显示和隐藏切换
        $scope.isHideSearchForm = false; // 默认显示
        $scope.searchFormHideToggle = function () {
            $scope.isHideSearchForm = !$scope.isHideSearchForm
            if ($scope.isHideSearchForm) {
                $scope.table_height = $scope.table_height + 98;
            } else {
                $scope.table_height = $scope.table_height - 98;
            }
            angular.element('#classTable').bootstrapTable('resetView',{ height: $scope.table_height } );
        }

        // // 查询表单提交
        // $scope.searchSubmit = function () {
        //     angular.element('#classTable').bootstrapTable('refresh');
        //     angular.element('#plateTable').bootstrapTable('refresh');
        // }
        // // 查询表单重置
        // $scope.searchReset = function () {
        //     $scope.class = {};
        //     angular.element('#classTable').bootstrapTable('refresh');
        //     angular.element('#plateTable').bootstrapTable('refresh');
        // }

        // 打开新增面板
        $scope.openAdd = function(){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/starts/plateTeachingTask/add.html',
                size: '',
                resolve: {
                    item: function () {
                        return $scope.plateTeaching;
                    }
                },
                controller: addController
            });
        };
        // 打开修改面板
        $scope.modify = function(data){

            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/starts/plateTeachingTask/modify.html',
                size: '',
                resolve: {
                    item: function () {
                        return data;
                    },
                    plateTeaching: function () {
                        return $scope.plateTeaching;
                    }
                },
                controller: modifyController
            });
        };

        // 打开班级名单
        $scope.classList = function(data){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/starts/plateTeachingTask/list/classList.html',
                resolve: {
                    item: function () {
                        return data;
                    },
                    plateTeaching:function () {
                        return $scope.plateTeaching;
                    },
                    indexScope:function () {
                        return $scope;
                    }
                },
                size: 'lg',
                controller: openListController
            });
        };

        // 打开删除面板
        $scope.openDelete = function(){
            var rows = angular.element('#classTable').bootstrapTable('getSelections');
            if(rows.length == 0){
                alertService('请先选择要删除的项');
                return;
            }
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/starts/plateTeachingTask/delete.html',
                size: 'lg',
                resolve: {
                    items: function () {
                        return rows;
                    },
                },
                controller: deleteController
            });
        };

        // 打开删除面板
        $scope.deleteClassList = function(){
            var rows = angular.element('#classTable').bootstrapTable('getSelections');
            if(rows.length == 0){
                alertService('请先选择要删除的项');
                return;
            }
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/starts/plateTeachingTask/delete.html',
                size: 'lg',
                resolve: {
                    items: function () {
                        return rows;
                    },
                },
                controller: deleteClassListController
            });
        };
    };
    Start_plateTeachingTaskController.$inject = ['$timeout','$compile','$scope', '$uibModal', '$rootScope', '$window', 'Start_plateTeachingTaskService', 'alertService', 'app'];

    // 添加控制器
    var addController = function ($compile,$scope, $uibModalInstance, $uibModal,item, Start_plateTeachingTaskService, formVerifyService, alertService) {
 
        var semesterObjs = [];
        Start_plateTeachingTaskService.get(item.planId,function (data) {
            // console.log(data);
            semesterObjs = data;
            findSemester();
        });
        var findSemester = function () {
            $scope.semesterObjs =semesterObjs;
            var html = '' +
                '<select ng-change="testChange()" ng-options="plateObj.id as plateObj.name  for plateObj in semesterObjs" ui-chosen="plateArrangeAddform.gradeId" ng-required="true" '
                +  ' ng-model="plateTeaching.gradeId" id="gradeId" name="gradeId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#gradeId").parent().empty().append(html);
            $compile(angular.element("#gradeId").parent().contents())($scope);
        }

        // $scope.testChange=function(){
        //     console.log($scope.plateSetting.plateId);
        //     angular.forEach(selectData , function(data,index,array){
        //         if($scope.plateSetting.plateId ==data.id){
        //             if(data.gradePlateTime){
        //                 data.gradePlateTime = data.gradePlateTime.replace(/<\/br>/g,"\r\n");
        //             }
        //             $scope.plateSetting.plateTime =data.gradePlateTime ;
        //         }
        //     });
        // }

        $scope.ok = function (form) {
            if($scope.plateTeaching.lowestCount>$scope.plateTeaching.highestCount){
                alertService("最低开班人数不能大于最高容纳人数");
                return;
            }
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            $scope.plateTeaching.plateId = item.plateId;
            $scope.plateTeaching.planId = item.planId;
            // console.log($scope.plateSetting)
            Start_plateTeachingTaskService.add($scope.plateTeaching, function (error, message) {
                if (error) {
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                angular.element('#classTable').bootstrapTable('refresh');
                alertService('success', '新增成功');
            });
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    addController.$inject = ['$compile',    '$scope', '$uibModalInstance', '$uibModal', 'item', 'Start_plateTeachingTaskService', 'formVerifyService', 'alertService'];

    var openListController = function ($scope,$uibModalInstance, $uibModal, plateTeaching, item, indexScope, $rootScope, $window, Start_plateTeachingTaskService, formVerifyService, alertService, app) {
        //查询参数
        var a = item;
        $scope.queryParams = function queryParams(params) {
            var attributeNamesForOrderBy = {};
            attributeNamesForOrderBy[params.sortName] = params.sortOrder;
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                attributeNamesForOrderBy: attributeNamesForOrderBy,
                classId: item.id,
                openId: plateTeaching.planId
            };
            $rootScope.$log.debug(angular.extend(pageParam, $scope.classList));
            return angular.extend(pageParam, $scope.classList);
        }

        $scope.classListTable = {
            //url: 'data_test/starts/tableview_classList.json',
            url: app.api.address + '/virtual-class/classList',
            method: 'get',
            cache: false,
            height: 495,
            toolbar: '#toolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber: 1,
            pageList: [10, 20, 30, 50, 100], // 设置可供选择的页面数据条数
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            sortName: '', // 默认排序字段
            sortOrder: 'desc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField: "id", // 指定主键列
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
                {field: "id", title: "主键", visible: false},
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
                {field: "num", title: "学号", align: "center", valign: "middle"},
                {field: "name", title: "姓名", align: "center", valign: "middle"},
                {field: "executiveClassName", title: "行政班级", align: "center", valign: "middle"}
            ]
        };
        //打开新增面板
        $scope.openAddList = function(){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/starts/plateTeachingTask/list/add.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return item;
                    },
                    plateTeaching: function () {
                        return plateTeaching;
                    },
                    indexScope:function () {
                        return indexScope;
                    }
                },
                controller: openListAddController
            });
        };
        // //删除
        $scope.openDeleteList = function(){
            var rows = angular.element('#classListTable').bootstrapTable('getSelections');
            if(rows.length == 0){
                alertService('请先选择要删除的项');
                return;
            }
            var selClassList = [];
            rows.forEach (function(selClass) {

                selClassList.push(selClass);
            });
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/starts/requiredCourseArrange/list/delete.html',
                size: '',
                resolve: {
                    items: function () {
                        return selClassList;
                    },
                    classId :function () {
                        return item.id;
                    },
                    plateTeaching:function () {
                        return plateTeaching;
                    },
                    indexScope:function () {
                        return indexScope;
                    }
                },
                controller: openListDeleteController
            });
        };

        $scope.isHideSearchForm = false; // 默认显示
        $scope.searchFormHideToggle = function () {
            $scope.isHideSearchForm = !$scope.isHideSearchForm
            if ($scope.isHideSearchForm) {
                $scope.table_height = $scope.table_height + 98;
            } else {
                $scope.table_height = $scope.table_height - 98;
            }
            angular.element('#classListTable').bootstrapTable('resetView',{ height: $scope.table_height } );
        }
        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#classListTable').bootstrapTable('selectPage', 1);
            // angular.element('#classListTable').bootstrapTable('refresh');
        }
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.classList = {};
            angular.element('#classListTable').bootstrapTable('refresh');
        }

        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openListController.$inject =['$scope', '$uibModalInstance' ,'$uibModal', 'plateTeaching', 'item', 'indexScope', '$rootScope', '$window', 'Start_plateTeachingTaskService', 'formVerifyService', 'alertService', 'app'];

    var openListAddController = function ($scope,$uibModalInstance, $uibModal, plateTeaching, item, indexScope, $rootScope, $window, Start_plateTeachingTaskService, formVerifyService, alertService, app) {
        //查询参数
        $scope.queryParams = function queryParams(params) {
            var attributeNamesForOrderBy = {};
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                classId: item.id,
                gradeId: item.gradeId,
                openId:plateTeaching.planId
            };
            $rootScope.$log.debug(angular.extend(pageParam, $scope.unSelClassList));
            return angular.extend(pageParam, $scope.unSelClassList);
        }

        $scope.unSelClassListTable = {
            //url: 'data_test/starts/tableview_classList.json',
            url: app.api.address + '/virtual-class/gradePlateArrange/selectClassList',
            method: 'get',
            cache: false,
            height: 495,
            toolbar: '#toolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber: 1,
            pageList: [10, 20, 30, 50, 100], // 设置可供选择的页面数据条数
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            sortName: '', // 默认排序字段
            sortOrder: 'desc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField: "id", // 指定主键列
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
                {field: "id", title: "主键", visible: false},
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
                {field: "id", visible: false},
                {field: "num", title: "学号", align: "center", valign: "middle"},
                {field: "name", title: "姓名", align: "center", valign: "middle"},
                {field: "executiveClassName", title: "行政班级", align: "center", valign: "middle"}
            ]
        };

        $scope.isHideSearchForm = false; // 默认显示
        $scope.searchFormHideToggle = function () {
            $scope.isHideSearchForm = !$scope.isHideSearchForm
            if ($scope.isHideSearchForm) {
                $scope.table_height = $scope.table_height + 98;
            } else {
                $scope.table_height = $scope.table_height - 98;
            }
            angular.element('#unSelClassListTable').bootstrapTable('resetView',{ height: $scope.table_height } );
        }
        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#unSelClassListTable').bootstrapTable('selectPage', 1);
            // angular.element('#unSelClassListTable').bootstrapTable('refresh');
        }
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.unSelClassList = {};
            angular.element('#unSelClassListTable').bootstrapTable('refresh');
        }

        $scope.ok = function (form) {
            // 处理前验证
            var rows = angular.element('#unSelClassListTable').bootstrapTable('getSelections');
            if(rows.length == 0){
                alertService('请先选择要新增的项');
                return;
            }
            var selClassList = [];
            rows.forEach (function(selClass) {
                selClass.teachingTaskId = item.id;
                selClass.semesterId = item.semesterId;
                selClass.schoolId = selClass.id
                selClass.teachingClassId = '3';
                selClassList.push(selClass);
            });
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            Start_plateTeachingTaskService.addClassList(selClassList, function (error, message) {
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#classListTable').bootstrapTable('refresh');

                Start_plateTeachingTaskService.getGradeNum(plateTeaching,function (data) {
                    selectGradeNum(data);
                    // console.log(gradeNumObjs);
                });
                var selectGradeNum = function (gradeNumObjsData) {
                    indexScope.gradeNumObjs="";
                    if(gradeNumObjsData.length==0){
                        indexScope.gradeNumObjs="";
                    }else{
                        angular.forEach(gradeNumObjsData, function(data,index, array){
                            array[index] ="等级"+data.gradeName+"人数："+data.arrangeNum+"      已安排人数："+data.arrangedNum+"      教学班："+data.classCount;
                            indexScope.gradeNumObjs = indexScope.gradeNumObjs + array[index] +"\r\n\r\n";
                        });
                    }
                }
                alertService('success', '新增成功');
            });
            $uibModalInstance.close();
        };

        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openListAddController.$inject =['$scope', '$uibModalInstance' ,'$uibModal', 'plateTeaching', 'item', 'indexScope', '$rootScope', '$window', 'Start_plateTeachingTaskService', 'formVerifyService', 'alertService', 'app'];

    // 删除控制器
    var openListDeleteController = function ($scope, $uibModalInstance, items,classId, indexScope, plateTeaching, Start_plateTeachingTaskService, alertService) {
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {
            var ids = []; // 代码类型号数组
            items.forEach (function(selClassList) {
                ids.push(selClassList.id);
            });
            Start_plateTeachingTaskService.deleteClassList(ids, classId, function (error, message) {
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#classListTable').bootstrapTable('refresh');
                Start_plateTeachingTaskService.getGradeNum(plateTeaching,function (data) {
                    selectGradeNum(data);
                    // console.log(indexScope.gradeNumObjs);
                });
                var selectGradeNum = function (gradeNumObjsData) {
                    indexScope.gradeNumObjs="";

                    angular.forEach(gradeNumObjsData, function(data,index, array){
                        array[index] ="等级"+data.gradeName+"人数："+data.arrangeNum+"      已安排人数："+data.arrangedNum+"      教学班："+data.classCount;
                        indexScope.gradeNumObjs = indexScope.gradeNumObjs + array[index] +"\r\n\r\n";
                    });

                }
                alertService('success', '删除成功');
            });
            $uibModalInstance.close();
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };


    };
    openListDeleteController.$inject = ['$scope', '$uibModalInstance', 'items','classId', 'indexScope', 'plateTeaching', 'Start_plateTeachingTaskService', 'alertService'];

    // 修改控制器
    var modifyController = function ($compile, $scope, $uibModalInstance, item, plateTeaching, Start_plateTeachingTaskService, alertService, formVerifyService) {
        // 数据初始化
        var semesterObjs = [];
        Start_plateTeachingTaskService.get(plateTeaching.planId, function (data) {
            // console.log(data);
            semesterObjs = data;
            findSemester();
        });
        var findSemester = function () {
            $scope.semesterObjs =semesterObjs;
            var html = '' +
                '<select ng-change="testChange()" ui-select2 ng-options="plateObj.id as plateObj.name  for plateObj in semesterObjs" ui-chosen="plateArrangeModifyform.gradeId" ng-required="true" '
                +  ' ng-model="plateTeaching.gradeId" id="gradeId" name="gradeId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#gradeId").parent().empty().append(html);
            $compile(angular.element("#gradeId").parent().contents())($scope);
        }
        $scope.plateTeaching = item;
        $scope.ok = function (form) {
            if($scope.plateTeaching.lowestCount>$scope.plateTeaching.highestCount){
                alertService("最低开班人数不能大于最高容纳人数");
                return;
            }
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };

            Start_plateTeachingTaskService.update($scope.plateTeaching, function (error, message) {
                if (error) {
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                angular.element('#classTable').bootstrapTable('refresh');
                alertService('success', '修改成功');
            });
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    modifyController.$inject = ['$compile', '$scope', '$uibModalInstance', 'item', 'plateTeaching', 'Start_plateTeachingTaskService', 'alertService', 'formVerifyService'];


    // 删除控制器
    var deleteController = function ($scope, $uibModalInstance, items, Start_plateTeachingTaskService, alertService) {
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {
            var ids = []; // 代码类型号数组
            items.forEach (function(gradePlateSetting) {
                ids.push(gradePlateSetting.id);
            });
            Start_plateTeachingTaskService.delete(ids, function (error, message) {
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#classTable').bootstrapTable('refresh');
                alertService('success', '删除成功');
            });
            $uibModalInstance.close();
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    deleteController.$inject = ['$scope', '$uibModalInstance', 'items', 'Start_plateTeachingTaskService', 'alertService'];

    // 删除控制器
    var deleteClassListController = function ($scope, $uibModalInstance, items, Start_plateTeachingTaskService, alertService) {
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {
            var ids = []; // 代码类型号数组
            items.forEach (function(gradePlateSetting) {
                ids.push(gradePlateSetting.id);
            });
            Start_plateTeachingTaskService.deleteCourseList(ids, function (error, message) {
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#classTable').bootstrapTable('refresh');
                alertService('success', '删除成功');
            });
            $uibModalInstance.close();
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    deleteClassListController.$inject = ['$scope', '$uibModalInstance', 'items', 'Start_plateTeachingTaskService', 'alertService'];

})(window);

