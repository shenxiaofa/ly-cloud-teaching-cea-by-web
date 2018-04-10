;(function (window, undefined) {
    'use strict';

    window.score_outsideApplyController = function (app, $compile, $scope, $uibModal, $rootScope, $window, $timeout, scheme_classCurriculaApplyService, alertService) {
        // 模块设置查询对象
        $scope.versionModel = {};
        // 范围维护查询对象
        $scope.modelDataRange = {};
        //tree菜单高度
        $scope.leftTreeStyle = {
            "height": $window.innerHeight-100
        };

        //学生类别下拉框数据
        $scope.studentCategory = [];
        scheme_classCurriculaApplyService.getSelected('XSLBDM', function (error,message,data) {
            $scope.studentCategory = data.data;
            var htmlFirst = '' +
                '<select ui-select2  ui-chosen="curriculaSearchForm.studentCategoryCode" '
                +  ' ng-model="classScheme.studentCategoryCode" id="studentCategoryCode" name="studentCategoryCode" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option ng-repeat="a in studentCategory" value="{{a.dataNumber}}">{{a.dataName}}</option> '
                +  '</select>';
            angular.element("#studentCategoryCode").parent().empty().append(htmlFirst);
            $compile(angular.element("#studentCategoryCode").parent().contents())($scope);

            var htmlSecond = '' +
                '<select ui-select2  ui-chosen="recordForm.studentCategory" '
                +  ' ng-model="record.studentCategoryCode" id="studentCategory" name="studentCategory" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option ng-repeat="a in studentCategory" value="{{a.dataNumber}}">{{a.dataName}}</option> '
                +  '</select>';
            angular.element("#studentCategory").parent().empty().append(htmlSecond);
            $compile(angular.element("#studentCategory").parent().contents())($scope);
        });
        // 树菜单参数设置
        $scope.zTreeOptions = {
            view: {
                dblClickExpand: false,
                showLine: true,
                selectedMulti: false
            },
            async: {
                enable: true,
                //url: app.api.address + '/base-info/department/gradeDepartmentTree',
                url: app.api.address + '/scheme/majorScheme/tree',
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
                    var parentId = treeNode.parentId;
                    if (type == "grade") {
                        $scope.classScheme.grade = name;
                        $scope.classScheme.deptNum = "";
                        $scope.record.grade = name;
                        $scope.record.deptNum = "";
                    } else {
                        $scope.classScheme.grade = parentId;
                        $scope.classScheme.deptNum = id;
                        $scope.record.grade = parentId;
                        $scope.record.deptNum = id;
                        // 刷新右边内容数据（若是初始化，由于表格未初始化，报异常，不需处理）
                        try {
                            angular.element('#classCurriculaTable').bootstrapTable('refresh');
                            angular.element('#classCurriculaRecordTable').bootstrapTable('refresh');
                        } catch (e) {}
                    }

                }
            }
        };
        // 表格的高度
        $scope.tableHeight = $window.innerHeight - 225;

        // 查询参数
        $scope.classScheme = {
            grade : "",                 //年级
            deptNum : "",               //单位
            studentCategoryCode : "",   //学生类别（培养层次）
            majorName : "",             //专业
            className : "",             //班级
            schemeSign : ""             //是否存在方案
        }
        $scope.classSchemeParams = function versionModelQueryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
            };
            $rootScope.$log.debug(angular.extend(pageParam, $scope.classScheme));
            return angular.extend(pageParam, $scope.classScheme);
        }
        $scope.classCurriculaTable = {
            url: 'data_test/scheme/tableview_majorCoursePlanAdd.json',
            //url: app.api.address + '/scheme/classScheme/info',
            method: 'get',
            toolbar: '#toolbar', //工具按钮用哪个容器
            cache: false,
            height: $scope.tableHeight,
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
            queryParams: $scope.classSchemeParams,//传递参数（*）
            search: false,
            showColumns: true,
            showRefresh: true,
            responseHandler:function(response){
                return response.data;
            },
            onLoadSuccess: function() {
                $compile(angular.element('#classCurriculaTable').contents())($scope);
            },
            columns: [
                {checkbox: true, width: "5%"},
                {field:"id", title:"学年学期", visible:false},
                {field:"cnCourseName",title:"中文课程名称",visible:false},
                {field:"enCourseName",title:"英文课程名称",align:"center",valign:"middle"},
                {field:"courseModual",title:"课程模块",align:"center",valign:"middle"},
                {field:"credit",title:"学分",align:"center",valign:"middle"},
                {field:"totalHour",title:"学时",align:"center",valign:"middle"},
                {field:"courseProperty",title:"课程性质",align:"center",valign:"middle"},
                {field:"scoreType",title:"成绩类别",align:"center",valign:"middle"},
                {field:"score",title:"成绩",align:"center",valign:"middle"},
                {field:"decidCourseNum",title:"认定课程数",align:"center",valign:"middle"},
                {field:"auditStatus",title:"审核状态",align:"center",valign:"middle"},
                {field:"operation",title:"操作",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        var delBtn = "<button id='btn_fzrsz' has-permission='classCurriculaApply:apply:add' type='button' ng-click='del(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>删除</button>";
                        var overBtn = "<button id='btn_fzrsz' has-permission='classCurriculaApply:apply:add' type='button' ng-click='over(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>办理完成</button>";
                        var applyBind = "<button id='btn_fzrsz' has-permission='classCurriculaApply:apply:add' type='button' ng-click='applyBind(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>申请成绩绑定</button>";
                        return delBtn+overBtn+""+applyBind;
                    }
                }
            ]
        };
        
        // 判断卡片是都被点击
        $scope.clickAlready1 = function(){
			angular.element('#classCurriculaTable').bootstrapTable('refresh');
        };

        //查询
        $scope.curriculaSearchSubmit = function () {
            angular.element('#classCurriculaTable').bootstrapTable('selectPage', 1);
            //angular.element('#classCurriculaTable').bootstrapTable('refresh');
        }
        // 查询表单重置
        $scope.curriculaSearchReset = function () {
            $scope.classScheme.studentCategoryCode = "";
            $scope.classScheme.majorName = "";
            $scope.classScheme.className = "";
            $scope.classScheme.schemeSign = "";
            // 重新初始化下拉框
            angular.element('form[name="curriculaSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#classCurriculaTable').bootstrapTable('refresh');
        }
        // 查询表单显示和隐藏切换
        $scope.isHideSearchForm = false; // 默认显示
        $scope.searchFormToggle = function () {
            $scope.isHideSearchForm = !$scope.isHideSearchForm
            if ($scope.isHideSearchForm) {
                $scope.tableHeight = $scope.tableHeight + 45;
            } else {
                $scope.tableHeight = $scope.tableHeight - 45;
            }
            angular.element('#classCurriculaTable').bootstrapTable('resetView',{ height: $scope.tableHeight } );
        };
        // 申请绑定
        $scope.applyBind = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/score/outsideSystemScore/outsideApply/applyBind.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return row;
                    }
                },
                controller: applyOutsideSchoolController
            });
        };
        // 申请成绩绑定
        $scope.applyScoreBind = function(){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/score/outsideSystemScore/outsideApply/applyScoreBind.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return "";
                    }
                },
                controller: applyScoreBindController
            });
        };


        // 表格的高度
        $scope.classCurriculaRecordTableHeight = $window.innerHeight - 299;
        
        // 查询参数
        $scope.record = {
            grade : "",                 //年级
            deptNum : "",               //单位
            studentCategoryCode : "",   //学生类别（培养层次）
            majorName : "",             //专业
            className : "",             //班级
            schemeSign : ""             //是否存在方案
        }
        $scope.recordQueryParams = function modelDataRangeQueryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
            };
            return angular.extend(pageParam, $scope.record);
        }
        $scope.classCurriculaRecordTable = {
            url: 'data_test/score/tableview_majorScheme.json',
            //url: app.api.address + '/scheme/classScheme/applyRecord',
            method: 'get',
            cache: false,
            toolbar: '#toolbar_tab2', //工具按钮用哪个容器
            height: $scope.classCurriculaRecordTableHeight,
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
            queryParams: $scope.recordQueryParams,//传递参数（*）
            search: false,
            showColumns: true,
            showRefresh: true,
            responseHandler:function(response){
                return response.data;
            },
            onLoadSuccess: function() {
                $compile(angular.element('#classCurriculaRecordTable').contents())($scope);
                angular.element('#classCurriculaRecordTable').bootstrapTable('resetView',{ height: $scope.classCurriculaRecordTableHeight } );

            },
            columns: [
                {checkbox: true, width: "5%"},
                {field:"semesterId", title:"学年学期"},
                {field:"applyTime", title:"申请时间"},
                {field:"cnCourseName", title:"中文课程名称"},
                {field:"enCourseName", title:"英文课程名称"},
                {field:"courseModual",title:"课程模块",align:"center",valign:"middle"},
                {field:"credit",title:"学分",align:"center",valign:"middle"},
                {field:"totalHour",title:"学时",align:"center",valign:"middle"},
                {field:"scoreType",title:"成绩类别",align:"center",valign:"middle"},
                {field:"score",title:"成绩",align:"center",valign:"middle"},
                {field:"OsysCnCourseName",title:"系统外中文课程名称",align:"center",valign:"middle"},
                {field:"OsysEnCourseName",title:"系统外英文课程名称",align:"center",valign:"middle"},
                {field:"OsysCourseModular",title:"系统外课程模块",align:"center",valign:"middle"},
                {field:"OsysCourseCredit",title:"系统外课程学分",align:"center",valign:"middle"},
                {field:"OsysCourseTotalHour",title:"系统外课程学时",align:"center",valign:"middle"},
                {field:"OsysScoreType",title:"系统外成绩类别",align:"center",valign:"middle"},
                {field:"OsysCourseScore",title:"系统外课程成绩",align:"center",valign:"middle"},
                {field:"decidCourseNum",title:"认定课程数",align:"center",valign:"middle"},
                {field:"auditStatus",title:"审核状态",align:"center",valign:"middle"},
                {field:"operation",title:"操作",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        var delBtn = "<button id='btn_fzrsz' has-permission='classCurriculaApply:apply:add' type='button' ng-click='del(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>删除</button>";
                        var overBtn = "<button id='btn_fzrsz' has-permission='classCurriculaApply:apply:add' type='button' ng-click='over(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>办理完成</button>";
                        return delBtn+overBtn;
                    }
                }
            ]
        };
        
        // 判断卡片是都被点击
        $scope.clickAlready2 = function(){
			angular.element('#classCurriculaRecordTable').bootstrapTable('refresh');
        };

        // 查询表单显示和隐藏切换
        $scope.isHideSearchForm = false; // 默认显示
        $scope.searchFormHideToggle = function () {
            $scope.isHideSearchForm = !$scope.isHideSearchForm
            if ($scope.isHideSearchForm) {
                $scope.classCurriculaRecordTableHeight = $scope.classCurriculaRecordTableHeight + 115;
            } else {
                $scope.classCurriculaRecordTableHeight = $scope.classCurriculaRecordTableHeight - 115;
            }
            angular.element('#classCurriculaRecordTable').bootstrapTable('resetView',{ height: $scope.classCurriculaRecordTableHeight } );
        };
        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#classCurriculaRecordTable').bootstrapTable('selectPage', 1);
           // angular.element('#classCurriculaRecordTable').bootstrapTable('refresh');
        };
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.record.studentCategoryCode = "";
            $scope.record.majorName = "";
            $scope.record.className = "";
            $scope.record.schemeSign = "";
            angular.element('#classCurriculaRecordTable').bootstrapTable('refresh');
        };

    };
    score_outsideApplyController.$inject = ['app', '$compile', '$scope', '$uibModal', '$rootScope', '$window', '$timeout', 'scheme_classCurriculaApplyService', 'alertService'];


    // 指定申请人
    var applyOutsideSchoolController = function ($rootScope, $uibModal, $compile, app, $scope, $uibModalInstance, item, scheme_classCurriculaApplyService, alertService, formVerifyService) {

        // 查询参数
        $scope.queryParams = function queryParams() {
            return  $scope.schemeDemand;
        }

        // 完成学分
        $scope.completeCredit = 0;;
        $scope.outsideApplyListTable =  {
            url: 'data_test/scheme/tableview_SchemeVersion.json',
            //url: app.api.address + '/scheme/classCurricula/curriculaChange',
            method: 'get',
            cache: false,
            height: 400,
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
            queryParams: $scope.schemeDemand,//传递参数（*）
            search: false,
            onLoadSuccess: function(data) {
                $compile(angular.element('#teacherIntoTable').contents())($scope);
                $scope.$apply(function () {
                    $scope.completeCredit = 0;
                    for(var index=0; index < data.rows.length; index++){
                        $scope.completeCredit += parseFloat(data.rows[index].credit);
                    }
                });
            },
            columns: [
                {checkbox: true, width: "5%"},
                {field:"cnCourseName",title:"课程中文名",align:"center",valign:"middle"},
                {field:"enCourseName",title:"课程英文名",align:"center",valign:"middle"},
                {field:"departmentNam",title:"开课单位",align:"center",valign:"middle"},
                {field:"courseProperty",title:"课程属性",align:"center",valign:"middle"},
                {field:"credit",title:"学分",align:"center",valign:"middle"}
            ]
        };
        //切换标签页
        $scope.change = function (a) {
            $scope.schemeDemand.classSchemeDemand_ID = a.classSchemeDemand_ID;
            $scope.schemeDemand.id = a.classSchemeDemand_ID;
            $scope.schemeDemand.model_ID= a.id;
            angular.element('#adjustApplyTable').bootstrapTable('refresh');
        }
        $scope.save = function () {
            $rootScope.showLoading = true; // 开启加载提示
            scheme_classCurriculaApplyService.save(item.class_ID, function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                alertService('success', '保存成功');
            });
        }
        
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    };
    applyOutsideSchoolController.$inject = ['$rootScope', '$uibModal', '$compile', 'app','$scope', '$uibModalInstance', 'item', 'scheme_classCurriculaApplyService', 'alertService', 'formVerifyService'];

    //申请成绩绑定
    var applyScoreBindController = function ($rootScope, $uibModal, $compile, app, $scope, $uibModalInstance, item, scheme_classCurriculaApplyService, alertService, formVerifyService) {

        // 查询参数
        $scope.queryParams = function queryParams() {
            return  $scope.schemeDemand;
        }

        // 完成学分
        $scope.completeCredit = 0;;
        $scope.outsideCourseTable =  {
            url: 'data_test/scheme/tableview_SchemeVersion.json',
            //url: app.api.address + '/scheme/classCurricula/curriculaChange',
            method: 'get',
            cache: false,
            height: 400,
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
            queryParams: $scope.schemeDemand,//传递参数（*）
            search: false,
            onLoadSuccess: function(data) {
                $compile(angular.element('#teacherIntoTable').contents())($scope);
                $scope.$apply(function () {
                    $scope.completeCredit = 0;
                    for(var index=0; index < data.rows.length; index++){
                        $scope.completeCredit += parseFloat(data.rows[index].credit);
                    }
                });
            },
            columns: [
                {checkbox: true, width: "5%"},
                {field:"cnCourseName",title:"课程中文名",align:"center",valign:"middle"},
                {field:"enCourseName",title:"课程英文名",align:"center",valign:"middle"},
                {field:"departmentNam",title:"开课单位",align:"center",valign:"middle"},
                {field:"courseProperty",title:"课程属性",align:"center",valign:"middle"},
                {field:"credit",title:"学分",align:"center",valign:"middle"}
            ]
        };
        $scope.courseCurriculaTable =  {
            url: 'data_test/scheme/tableview_SchemeVersion.json',
            //url: app.api.address + '/scheme/classCurricula/curriculaChange',
            method: 'get',
            cache: false,
            height: 400,
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
            queryParams: $scope.schemeDemand,//传递参数（*）
            search: false,
            onLoadSuccess: function(data) {
                $compile(angular.element('#teacherIntoTable').contents())($scope);
                $scope.$apply(function () {
                    $scope.completeCredit = 0;
                    for(var index=0; index < data.rows.length; index++){
                        $scope.completeCredit += parseFloat(data.rows[index].credit);
                    }
                });
            },
            columns: [
                {checkbox: true, width: "5%"},
                {field:"semester",title:"课程中文名",align:"center",valign:"middle"},
                {field:"courseNum",title:"课程英文名",align:"center",valign:"middle"},
                {field:"courseName",title:"开课单位",align:"center",valign:"middle"},
                {field:"credit",title:"课程属性",align:"center",valign:"middle"},
                {field:"totalHour",title:"学分",align:"center",valign:"middle"}
            ]
        };
        //切换标签页
        $scope.change = function (a) {
            $scope.schemeDemand.classSchemeDemand_ID = a.classSchemeDemand_ID;
            $scope.schemeDemand.id = a.classSchemeDemand_ID;
            $scope.schemeDemand.model_ID= a.id;
            angular.element('#adjustApplyTable').bootstrapTable('refresh');
        }
        $scope.save = function () {
            $rootScope.showLoading = true; // 开启加载提示
            scheme_classCurriculaApplyService.save(item.class_ID, function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                alertService('success', '保存成功');
            });
        }

        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    };
    applyScoreBindController.$inject = ['$rootScope', '$uibModal', '$compile', 'app','$scope', '$uibModalInstance', 'item', 'scheme_classCurriculaApplyService', 'alertService', 'formVerifyService'];





    var deleteController = function ($rootScope, formVerifyService,$compile, $scope, $uibModalInstance, scheme_classCurriculaApplyService, alertService, pScope) {
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {

            $rootScope.showLoading = true; // 开启加载提示
            scheme_classCurriculaApplyService.addCourseChange(pScope.courseInfo,function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                pScope.creditValidate(pScope);
                $uibModalInstance.close();
                angular.element('#adjustApplyTable').bootstrapTable('refresh');
               // alertService('success', '删除成功');
            });

        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    }
    deleteController.$inject = ['$rootScope', 'formVerifyService','$compile', '$scope', '$uibModalInstance', 'scheme_classCurriculaApplyService', 'alertService', 'pScope'];

})(window);
