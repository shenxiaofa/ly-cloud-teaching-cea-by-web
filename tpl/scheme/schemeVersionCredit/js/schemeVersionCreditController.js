;(function (window, undefined) {
    'use strict';

    window.scheme_schemeVersionCreditController = function (app, $compile, $scope, $uibModal, $rootScope, $window, $timeout, scheme_schemeVersionCreditService, alertService) {
        // 模块查询对象
        $scope.versionModel = {
            schemeVersion_ID : ""
        };
        //tree菜单高度
        $scope.leftTreeStyle = {
            "height": $window.innerHeight-70
        };
        $scope.menuTreeControl = {};
        // 树菜单选择回调
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
                    } else { // 培养方案版本名称
                        $scope.versionModel.schemeName = name;
                        $scope.versionModel.grade = "";
                        $scope.versionModel.schemeVersion_ID = id;
                    }
                    //$scope.versionModel.schemeVersion_ID = id;
                    // 刷新右边内容数据（若是初始化，由于表格未初始化，报异常，不需处理）
                    try {
                        angular.element('#versionModelTable').bootstrapTable('refresh');
                    } catch (e) {}
                }
            }
        };

        // 表格的高度
        $scope.table_height = $window.innerHeight - 68;
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber  //页码
            };
            $rootScope.$log.debug(angular.extend(pageParam, $scope.versionModel));
            return angular.extend(pageParam, $scope.versionModel);
        }
        $scope.versionModelTable = {
            //url: 'data_test/scheme/tableview_versionModel.json',
            url: app.api.address + '/scheme/schemeVersionCredit',
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
                $compile(angular.element('#versionModelTable').contents())($scope);
            },
            columns: [
                {checkbox: true, width: "5%"},
                {field:"id", title:"主键", visible:false},
                {field:"name",title:"模块名称",align:"left",valign:"middle"},
                {field:"courseProperty",title:"课程性质",align:"center",valign:"middle"},
                {field:"creditDemand",title:"学分要求",align:"center",valign:"middle", width: "15%",
                    formatter : function (value, row, index) {
                        return '<input type="number" data-id="' + row.id + '" name="creditDemand" value="' + value + '"/>';
                    }
                },
                {field:"presetCourseSign",title:"是否预置课程",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        if (value == "1") {
                            return "是"
                        }
                        return "否";
                    }
                }
            ]
        };
        // 保存
        $scope.save = function () {
            var versionModels = angular.element('#versionModelTable').bootstrapTable('getOptions').data;
            var creditDemands = angular.element('#versionModelTable input[name="creditDemand"]');
            for (var i=0; i<creditDemands.length; i++) {
                versionModels[i].creditDemand = creditDemands.eq(i).val();
            }
            $rootScope.showLoading = true; // 开启加载提示
            scheme_schemeVersionCreditService.save(versionModels, function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else {
                    alertService('success', '保存成功');
                };
            });

        };
        // 复制到专业
        $scope.copyToMajor = function () {
            var schemeName = $scope.versionModel.schemeName;
            var schemeNameId = $scope.versionModel.schemeVersion_ID;
            if(schemeName == "" ){
                alertService('请先选择培养方案版本');
                return;
            }
            $rootScope.showLoading = true; // 开启加载提示
            scheme_schemeVersionCreditService.copyToMajor(schemeNameId,function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else {
                    alertService('success', '复制成功');
                };

            });
        }
    };
    scheme_schemeVersionCreditController.$inject = ['app', '$compile', '$scope', '$uibModal', '$rootScope', '$window', '$timeout', 'scheme_schemeVersionCreditService', 'alertService'];

    })(window);
