;(function (window, undefined) {
    'use strict';

    window.score_scorePasswordManagerController = function ($timeout,$compile, $scope, $uibModal, $rootScope, $window, score_scorePasswordManagerService, alertService, app) {
        
        // 表格的高度
        $scope.win_height = $window.innerHeight;
        $scope.table_height = $scope.win_height - 226;
        $scope.searchParam = {};
        // 初始化菜单树
        initMenuTree($scope, $window, app);

        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var attributeNamesForOrderBy = {};
            //attributeNamesForOrderBy[params.sortName] = params.sortOrder;
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                attributeNamesForOrderBy: attributeNamesForOrderBy
            };
            $rootScope.$log.debug(angular.extend(pageParam, $scope.searchParam));
            return angular.extend(pageParam, $scope.searchParam);
        }
        $scope.passwordTable = {
            url:app.api.address + '/score/scorePassword',
            //url: app.api.address + '/scheme/majorScheme',
            method: 'get',
            cache: false,
            height: $scope.table_height,
            toolbar: '#toolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [10, 20, 30],
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            sortName: 'majorCode', // 默认排序字段
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
                $compile(angular.element('#passwordTable').contents())($scope);
            },
            clickToSelect: false,
            columns: [
                {checkbox: true,width: "5%"},
                {field:"",title:"序号",align:"center",valign:"middle", width: "5%", formatter: function (value, row, index) {
                    return index+1;
                }},
                {field:"departmentName",title:"所属单位",visible:false},
                {field:"teacherNum",title:"职工号",align:"center",valign:"middle"},
                {field:"teacherName",title:"教师姓名",align:"center",valign:"middle"},
                {field:"sex",title:"性别",align:"center",valign:"middle"},
                {field:"teacherType",title:"教工类别",align:"center",valign:"middle"},
                {field:"teachingStatus",title:"任课状况",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        if(value=="0"){
                            return "离任"
                        }else{
                            return "在任"
                        }

                    }},
                {field:"currentStatus",title:"当前状态",align:"center",valign:"middle"},
                {field:"passwordStatus",title:"密码状态",align:"center",valign:"middle"},
                {field:"cz",title:"操作",align:"center",valign:"middle",width: "15%",
                    formatter : function (value, row, index) {
                        var infoEditBtn = "<button id='btn_fzrsz' class='btn btn-default' has-permission='majorSchemeInfoManage:baseInfo'  type='button' ng-click='initPassword(" + JSON.stringify(row) + ")'>初始化密码</button>";
                        return infoEditBtn;
                    }
                }
            ]
        };

        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#passwordTable').bootstrapTable('selectPage', 1);
           // angular.element('#passwordTable').bootstrapTable('refresh');
        }
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.searchParam = {};
            // 重新初始化下拉框
            angular.element('form[name="searchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#passwordTable').bootstrapTable('refresh');
        }

        // 查询表单显示和隐藏切换
        $scope.isHideSearchForm = false; // 默认显示
        $scope.searchFormHideToggle = function () {
            $scope.isHideSearchForm = !$scope.isHideSearchForm
            if ($scope.isHideSearchForm) {
                $scope.table_height = $scope.table_height + 115;
            } else {
                $scope.table_height = $scope.table_height - 115;
            }
            angular.element('#passwordTable').bootstrapTable('resetView',{ height: $scope.table_height } );
        }
        /*
        * 密码初始化
        * */
        $scope.initPassword = function (row) {
            $scope.selectedRows = angular.element('#passwordTable').bootstrapTable('getSelections');
            $scope.useCurrentPageData = angular.element('#passwordTable').bootstrapTable('getData', true);
            $scope.searchedData = angular.element('#passwordTable').bootstrapTable('getData', false);
            // if($scope.selectedRows.length == 0 && row==null){
            //     alertService('请先选择需要初始化密码的教师');
            //     return;
            // }
            if(row){
                $scope.selectedRows.push(row);
                $scope.rowData = 'single';
            }else{
                $scope.rowData = 'multiple';
            }
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/score/scorePasswordManager/initPassword.html',
                size: '',
                resolve: {
                    scope: function () {
                        return $scope;
                    },
                },
                controller: initPasswordController
            });
        }

        /*
         * 密码重置
         * */
        $scope.resetPassword = function () {
                $scope.selectedRows = angular.element('#passwordTable').bootstrapTable('getSelections');
            $scope.useCurrentPageData = angular.element('#passwordTable').bootstrapTable('getData', true);
            $scope.searchedData = angular.element('#passwordTable').bootstrapTable('getData', false);
            // if($scope.selectedRows.length == 0){
            //     alertService('请先选择需要重置密码的教师');
            //     return;
            // }
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/score/scorePasswordManager/reSetPassword.html',
                size: '',
                resolve: {
                    scope: function () {
                        return $scope;
                    },
                },
                controller: resetPasswordController
            });
        }
        //删除
        $scope.delete = function (data) {
            if(typeof(data.majorScheme_ID) == "undefined"){
                alertService('专业下不存在培养方案');
                return;
            }
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/scheme/majorSchemeInfoManage/delete.html',
                size: '',
                resolve: {
                    id: function () {
                        return data.majorScheme_ID;
                    },
                },
                controller: deleteController
            });


        }

    };
    score_scorePasswordManagerController.$inject = ['$timeout', '$compile', '$scope', '$uibModal', '$rootScope', '$window', 'score_scorePasswordManagerService', 'alertService', 'app'];

    var initPasswordController = function ($rootScope, scope, formVerifyService, $compile, $scope, $uibModalInstance, score_scorePasswordManagerService, alertService) {
        $scope.param = {};
        $scope.param.type="0";
        $scope.param.createModel = "1";
        $scope.hideSign = false;
        if(scope.rowData=="single"){
            $scope.hideSign =true;
        }else{
            $scope.hideSign =false;
        }
        $scope.$watch('param.type', function(newVal){
           if(newVal=="0"){
               $scope.requiredMark = false;
               angular.element("#passwordDiv").empty();
               angular.element("#passwordConfirmDiv").empty();


           }else if(newVal=="1"){
               $scope.requiredMark = true;
               var html = '' +
                   '<label class="col-xs-3 control-label required">密码：</label> '
                   +  ' <div class="col-xs-8">'
                   +  '<input type="password" ng-model="param.password" ng-required="true" id="password" name="password" class="form-control"/>'
                   +  '</div> '
               var confirmHTML = '' +
                   '<label class="col-xs-3 control-label required">确认密码：</label> '
                   +  ' <div class="col-xs-8">'
                   +  '<input type="password" ng-model="param.passwordConfirm" ng-required="true" id="passwordConfirm" name="passwordConfirm" class="form-control"/>'
                   +  '</div> '

               angular.element("#passwordDiv").empty().append(html);
               angular.element("#passwordConfirmDiv").empty().append(confirmHTML);
               $compile(angular.element("#passwordDiv").contents())($scope);
               $compile(angular.element("#passwordConfirmDiv").contents())($scope);
           }
        });
        
        $scope.close = function () {
            $uibModalInstance.close();
        };
        
        $scope.ok = function (form) {
            // 处理前验证
            if($scope.param.type == "1"){
                if(form.$invalid) {
                    // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                    formVerifyService(form);
                    return;
                };
            }

            if($scope.param.password !== $scope.param.passwordConfirm){
                alertService('两次输入的密码不一致，请重新确认');
                return;
            }
            var teacherNums = [];
            if($scope.param.createModel == "1"){
                 // 代码类型号数组
                if(scope.selectedRows.length==0){
                    alertService('当前没有选中记录');
                    return;
                }
                scope.selectedRows.forEach (function(data) {
                    teacherNums.push(data.teacherNum);
                });
            }else if($scope.param.createModel=="2"){
                scope.useCurrentPageData.forEach (function(data) {
                    teacherNums.push(data.teacherNum);
                });
            }else if($scope.param.createModel=="3"){
                scope.searchedData.forEach (function(data) {
                    teacherNums.push(data.teacherNum);
                });
            }

            $rootScope.showLoading = true; // 开启加载提示
            score_scorePasswordManagerService.add(teacherNums,$scope.param, function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#passwordTable').bootstrapTable('refresh');
                $uibModalInstance.close();
                alertService('success', '保存成功');
            });
            $uibModalInstance.close();
        }
    }
    initPasswordController.$inject = ['$rootScope', 'scope', 'formVerifyService', '$compile', '$scope', '$uibModalInstance', 'score_scorePasswordManagerService', 'alertService'];

    var resetPasswordController = function ($rootScope, scope, formVerifyService, $compile, $scope, $uibModalInstance, score_scorePasswordManagerService, alertService) {
        $scope.param = {};
        $scope.param.createModel ="1";
        $scope.close = function () {
            $uibModalInstance.close();
        };
        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            var teacherNums = [];
            if($scope.param.createModel == "1"){
                if(scope.selectedRows.length==0){
                    alertService('当前没有选中记录');
                    return;
                }
                // 代码类型号数组
                scope.selectedRows.forEach (function(data) {
                    teacherNums.push(data.teacherNum);
                });
            }else if($scope.param.createModel=="2"){
                scope.useCurrentPageData.forEach (function(data) {
                    teacherNums.push(data.teacherNum);
                });
            }else if($scope.param.createModel=="3"){
                scope.searchedData.forEach (function(data) {
                    teacherNums.push(data.teacherNum);
                });
            }
            $rootScope.showLoading = true; // 开启加载提示
            score_scorePasswordManagerService.update(teacherNums, function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                alertService('success', '重置成功');
            });
            // alertService('success', '重置成功');
            // $uibModalInstance.close();
        }
    }
    resetPasswordController.$inject = ['$rootScope', 'scope', 'formVerifyService', '$compile', '$scope', '$uibModalInstance', 'score_scorePasswordManagerService', 'alertService'];

    var addCourseController = function ($rootScope, majorSchemeDemand_ID, model_ID, majorScheme_ID, grade, formVerifyService, app, $compile, $scope, $uibModalInstance, score_scorePasswordManagerService, alertService) {
        $scope.close = function () {
            $uibModalInstance.close();
        };
        //单位
        $scope.dept = [];
        score_scorePasswordManagerService.getDept(function (error,message,data) {
            $scope.dept = data.data;
            var html = '' +
                '<select ui-select2  ui-chosen="courseSearchForm.dept_ID" '
                +  ' ng-model="courseParam.dept_ID" id="dept_ID" name="dept_ID" ui-jq="chosen"ui-options="{search_contains: true}" ui-jq="chosen" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option  ng-repeat="a in dept" value="{{a.id}}">{{a.name}}</option> '
                +  '</select>';
            angular.element("#dept_ID").parent().empty().append(html);
            $compile(angular.element("#dept_ID").parent().contents())($scope);
        });
        //学期
        $scope.semester = [];
        score_scorePasswordManagerService.getSemester(grade, function (error,message,data) {
            $scope.semester = data.data;
            var html = '' +
                '<select ui-select2  ui-chosen="addForm.semester" '
                +  ' ng-model="courseInfo.semester" id="semester" ng-required="true" name="semester" ui-jq="chosen"ui-options="{search_contains: true}" ui-jq="chosen" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option  ng-repeat="a in semester" value="{{a.id}}">{{a.name}}</option> '
                +  '</select>';
            angular.element("#semester").parent().empty().append(html);
            $compile(angular.element("#semester").parent().contents())($scope);
        });

        //查询参数
        $scope.courseParam = {
            dept_ID : "",
            courseNameOrCode : "",
            model_ID : model_ID,
            majorScheme_ID : majorScheme_ID
        }
        //添加参数
        $scope.courseInfo = {
            id:"",
            semester:"",
            credit:"",
            totalHour:"",
            theoryHour:"",
            practiceHour:"",
            remark:""
        }
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
            };
            return angular.extend(pageParam, $scope.courseParam);
        }

        $scope.majorCoursePlanAddTable = {
            //url: 'data_test/scheme/tableview_majorCoursePlanAdd.json',
            url: app.api.address + '/scheme/majorScheme/operationCourse',
            method: 'get',
            cache: false,
            height: 310,
            toolbar: '', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [10, 20, 30],
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            sortName: 'courseNum', // 默认排序字段
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
            onCheck: function (row) {
                $scope.$apply(function () {
                    $scope.courseInfo = {
                        semester:$scope.courseInfo.semester,
                        course_ID:row.id,
                        majorSchemeDemand_ID:majorSchemeDemand_ID,//专业方案要求id 模拟数据
                        credit:row.credit,
                        totalHour:row.totalHour,
                        theoryHour:row.theoryHour,
                        practiceHour:row.practiceHour,
                        courseName:row.courseName,
                        courseModel:row.courseModel
                    };
                });
            },
            onLoadSuccess: function() {
                $compile(angular.element('#majorCoursePlanAddTable').contents())($scope);
            },
            clickToSelect: true,
            columns: [
                {radio: true,width: "5%"},
                {field:"id",title:"id",visible:false},
                {field:"dept",title:"开课单位",align:"center",valign:"middle"},
                {field:"courseNum",title:"课程号",align:"center",valign:"middle"},
                {field:"courseName",title:"课程名称",align:"center",valign:"middle"},
                {field:"courseModel",title:"课程模块",align:"center",valign:"middle"},
                {field:"credit",title:"学分",align:"center",valign:"middle"},
                {field:"totalHour",title:"总学时",align:"center",valign:"middle"},
                {field:"theoryHour",title:"理论学时",align:"center",valign:"middle"},
                {field:"practiceHour",title:"实践学时",align:"center",valign:"middle"}
            ]
        };
        // 查询表单
        $scope.searchSubmit = function () {
            angular.element('#majorCoursePlanAddTable').bootstrapTable('selectPage', 1);
            //angular.element('#majorCoursePlanAddTable').bootstrapTable('refresh');
        }
        // 重置表单
        $scope.searchReset = function () {
            $scope.courseParam.dept_ID = "";
            $scope.courseParam.courseNameOrCode = "";
            angular.element('form[name="courseSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#majorCoursePlanAddTable').bootstrapTable('refresh');
        };
        $scope.ok = function (form) {
            var rows = angular.element('#majorCoursePlanAddTable').bootstrapTable('getSelections');
            if( rows.length != 1){
                alertService("请选择一条数据");
                return;
            }

            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            $rootScope.showLoading = true; // 开启加载提示
            score_scorePasswordManagerService.addCourse($scope.courseInfo,function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else {
                    angular.element('#majorCoursePlanEnter').bootstrapTable('refresh');
                    alertService('success', '添加成功');
                }
            });
        }
    }
    addCourseController.$inject = ['$rootScope', 'majorSchemeDemand_ID', 'model_ID', 'majorScheme_ID', 'grade', 'formVerifyService', 'app', '$compile', '$scope', '$uibModalInstance', 'score_scorePasswordManagerService', 'alertService'];

    var updateCourseController = function ($rootScope, formVerifyService, $compile, $scope, $uibModalInstance, item, grade, score_scorePasswordManagerService, alertService) {
        $scope.close = function () {
            $uibModalInstance.close();
        };
        $scope.semester = [];
        score_scorePasswordManagerService.getSemester(grade,function (error,message,data) {
            $scope.semester = data.data;
            var html = '' +
                '<select ui-select2  ui-chosen="codeCategorySearchForm.semester" '
                +  ' ng-model="courseInfo.semester" id="semester" ng-required="true" name="semester" ui-jq="chosen"ui-options="{search_contains: true}" ui-jq="chosen" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option  ng-repeat="a in semester" value="{{a.id}}">{{a.name}}</option> '
                +  '</select>';
            angular.element("#semester").parent().empty().append(html);
            $compile(angular.element("#semester").parent().contents())($scope);
        });
        $scope.courseInfo = {
            id : item.id,
            semester : item.semester,
            courseNum : item.courseNum,
            courseName : item.courseName,
            credit : item.credit,
            totalHour : item.totalHour,
            examWay : item.examWay,
            theoryHour : item.theoryHour,
            practiceHour : item.practiceHour,
            courseModel : item.courseModel,
            remark : item.remark
        }


        $scope.ok = function (form) {
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            $rootScope.showLoading = true; // 开启加载提示
            score_scorePasswordManagerService.update($scope.courseInfo,function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else {
                    angular.element('#majorCoursePlanEnter').bootstrapTable('refresh');
                    alertService('success', '修改成功');
                }
                $uibModalInstance.close();
            });
        }
    }
    updateCourseController.$inject = ['$rootScope', 'formVerifyService','$compile', '$scope', '$uibModalInstance', 'item', 'grade', 'score_scorePasswordManagerService', 'alertService'];

    var deleteController = function ($rootScope, formVerifyService, $compile, $scope, $uibModalInstance, score_scorePasswordManagerService, alertService, id) {
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {

            $rootScope.showLoading = true;
            score_scorePasswordManagerService.delete(id, function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else{
                    angular.element('#passwordTable').bootstrapTable('refresh');
                   // alertService('success', '删除成功');
                }
                $uibModalInstance.close();
            });

        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    }
    deleteController.$inject = ['$rootScope', 'formVerifyService','$compile', '$scope', '$uibModalInstance', 'score_scorePasswordManagerService', 'alertService', 'id'];

    var deleteSchemeDemandController = function ($rootScope, formVerifyService, $compile, $scope, $uibModalInstance, score_scorePasswordManagerService, alertService, id, majorScheme_ID, pScope) {
        $scope.message = "删除模块同时会删除模块下课程计划，确定要删除吗？";
        $scope.ok = function () {

            $rootScope.showLoading = true;
            score_scorePasswordManagerService.deleteSchemeDemand(id,function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else{
                    score_scorePasswordManagerService.getTitle(majorScheme_ID,function (error,message,data) {
                        pScope.title = data;
                        pScope.schemeDemand.majorSchemeDemand_ID = data[0].majorSchemeDemand_ID;
                        pScope.schemeDemand.model_ID = data[0].id;
                        angular.element('#majorCoursePlanEnter').bootstrapTable('refresh');
                    });
                    angular.element('#majorSchemeInfoEdit').bootstrapTable('refresh');
                   // alertService('success', '删除成功');
                }
                $uibModalInstance.close();
            });

        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    }
    deleteSchemeDemandController.$inject = ['$rootScope', 'formVerifyService','$compile', '$scope', '$uibModalInstance', 'score_scorePasswordManagerService', 'alertService', 'id', 'majorScheme_ID', 'pScope'];

    var deleteCurriculaController = function ($rootScope, formVerifyService, $compile, $scope, $uibModalInstance, score_scorePasswordManagerService, alertService, id) {
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {

            $rootScope.showLoading = true; // 开启加载提示
            score_scorePasswordManagerService.deleteCurricula(id,function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else {
                    angular.element('#majorCoursePlanEnter').bootstrapTable('refresh');
                   // alertService('success', '删除成功');
                }
                $uibModalInstance.close();
            });

        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    }
    deleteCurriculaController.$inject = ['$rootScope', 'formVerifyService','$compile', '$scope', '$uibModalInstance', 'score_scorePasswordManagerService', 'alertService', 'id'];

    // 初始化菜单树
    var initMenuTree = function ($scope, $window, app) {
        //tree菜单高度
        $scope.leftTreeStyle = {
            "height": $window.innerHeight - 72
        };
        // 树菜单参数设置
        $scope.isTreeInit = true; // 树菜单初始化

        $scope.zTreeOptions = {
            view: {
                selectedMulti: false
            },
            async: {
                enable: true,
                url: app.api.address + "/score/scorePassword/tree",
                autoParam: ["id", "name=name", "pid=pid", "level=level"],
                otherParam: {"otherParam": "otherParam"},
                // dataFilter: filter
            },
            callback: {
                onClick: function (event, treeId, treeNode) {
                    $scope.treeSelectId = treeNode;
                    if (treeNode.level == 0) {
                        $scope.searchListForm = {};
                        $scope.searchParam = $scope.searchListForm;
                        $scope.total = true;
                        $('#passwordTable').bootstrapTable('refreshOptions', {pageNumber: 1, pageSize: 10});
                    }else{
                        $scope.searchListForm = {};
                        $scope.searchListForm.departmentNum = treeNode.id;
                        $scope.searchParam = $scope.searchListForm;
                        $scope.total = true;
                        $('#passwordTable').bootstrapTable('refreshOptions', {pageNumber: 1, pageSize: 10});
                        $scope.searchListForm = {};
                    }
                    var treeObj = $.fn.zTree.getZTreeObj("menuTree");
                    var nodes = treeObj.getSelectedNodes();
                    if (nodes.length > 0) {
                        treeObj.reAsyncChildNodes(nodes[0], "refresh");
                    }
                    // console.log(treeId, treeNode);

                },
                onAsyncSuccess: zTreeOnAsyncSuccess
            }
        };

        //单位树默认展开第一个结点
        var firstAsyncSuccessFlag = 0;

        function zTreeOnAsyncSuccess(event, treeId, msg) {
            if (firstAsyncSuccessFlag == 0) {

                try {
                    //调用默认展开第一个结点
                    var treeObj = $.fn.zTree.getZTreeObj("menuTree");
                    var selectedNode = treeObj.getSelectedNodes();
                    var nodes = treeObj.getNodes();
                    treeObj.expandNode(nodes[0], true);

                    //var childNodes = treeObj.transformToArray(nodes[0]);
                    //treeObj.expandNode(childNodes[1], true);
                    //treeObj.selectNode(childNodes[1]);
                    //var childNodes1 = treeObj.transformToArray(childNodes[1]);
                    //treeObj.checkNode(childNodes1[1], true, true);
                    firstAsyncSuccessFlag = 1;
                } catch (err) {

                }
            }
        }

    }
})(window);
