;(function (window, undefined) {
    'use strict';

    window.score_cleanScoreEnteringController = function (baseinfo_generalService, app, $compile, $scope, $uibModal, $rootScope, $window, $timeout, score_cleanScoreEnteringService, alertService) {
        // 表格的高度
        $scope.tableHeight = $window.innerHeight - 245;

        // 查询参数
        $scope.searchParamClass = {
            type:"selectMakeup",
            taskType:'3'
        };
        $scope.classSchemeParams = function versionModelQueryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
            };
            $rootScope.$log.debug(angular.extend(pageParam, $scope.searchParamClass));
            return angular.extend(pageParam, $scope.searchParamClass);
        }
        baseinfo_generalService.findAcadyeartermNamesBox(function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.semesterObjs = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.id as plateObj.acadYearSemester  for plateObj in semesterObjs" '
                +  ' ng-model="searchParamClass.semester" id="semester" name="semester" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#semester").parent().empty().append(html);
            $compile(angular.element("#semester").parent().contents())($scope);
        });

        baseinfo_generalService.findcodedataNames({datableNumber: "KCSXDM"}, function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.coursePropertyObjs = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.dataNumber as plateObj.dataName  for plateObj in coursePropertyObjs" '
                +  ' ng-model="searchParamClass.courseProperty" id="courseProperty" name="courseProperty" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#courseProperty").parent().empty().append(html);
            $compile(angular.element("#courseProperty").parent().contents())($scope);
        });

        $scope.enteringClassTable = {
            url: app.api.address + '/score/scoreEntering',
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
                $compile(angular.element('#enteringClassTable').contents())($scope);
            },
            columns: [
                {checkbox: true, width: "5%"},
                {field:"semester", title:"学年学期"},
                {field:"roundNum",title:"轮次",align:"center",valign:"middle",formatter : function (value, row, index) {
                    if(value){
                        return  "清考第"+  value +"轮次";
                    }else{
                        return "";
                    }
                }},
                {field:"courseNum",title:"课程编号"},
                {field:"courseName",title:"课程名称",align:"center",valign:"middle"},
                {field:"department",title:"开课单位",align:"center",valign:"middle"},
                {field:"credit",title:"学分",align:"center",valign:"middle"},
                {field:"courseProperty",title:"课程属性",align:"center",valign:"middle"},
                // {field:"teacher",title:"任课教师",align:"center",valign:"middle"},
                {field:"className",title:"班级名称",align:"center",valign:"middle"},
                {field:"recheckDays",title:"复核天数",align:"center",valign:"middle"},
                {field:"startDate",title:"发布日期",align:"center",valign:"middle"},
                {field:"endDate",title:"截止日期",align:"center",valign:"middle"},
                {field:"count",title:"人数",align:"center",valign:"middle"},
                {field:"inputCount",title:"录入人数",align:"center",valign:"middle"},
                {field:"operation",title:"操作",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        return "<button type='button' has-permission='classCurriculaApply:apply:adjust'  class='btn btn-default btn-sm' ng-click='appointEnter("+ angular.toJson(row) +")'><span class='fa fa-edit toolbar-btn-icon'></span>指定录入人</button>";
                    }
                }
            ]
        };

        // 判断卡片是都被点击
        $scope.clickAlready1 = function(){
            angular.element('#enteringClassTable').bootstrapTable('refresh');
        };

        //查询
        $scope.curriculaSearchSubmit = function () {
            angular.element('#enteringClassTable').bootstrapTable('selectPage', 1);
        }
        // 查询表单重置
        $scope.curriculaSearchReset = function () {
            $scope.searchParamClass = {
                type:"selectMakeup",
                taskType:'3'};
            // 重新初始化下拉框
            angular.element('form[name="curriculaSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#enteringClassTable').bootstrapTable('refresh');
        }
        // 查询表单显示和隐藏切换
        $scope.isHideSearchForm = false; // 默认显示
        $scope.searchFormToggle = function () {
            $scope.isHideSearchForm = !$scope.isHideSearchForm
            if ($scope.isHideSearchForm) {
                $scope.tableHeight = $scope.tableHeight + 115;
            } else {
                $scope.tableHeight = $scope.tableHeight - 115;
            }
            angular.element('#enteringClassTable').bootstrapTable('resetView',{ height: $scope.tableHeight } );
        };

        // 打开生成正考任务
        $scope.producedTask = function(){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/score/cleanExamScore/scoreEntering/producedTask.html',
                size: 'lg',
                controller: producedTaskController
            });
        };

        // 批量更改任务时间
        $scope.updateTime = function(){
            $scope.selectedRows = angular.element('#enteringClassTable').bootstrapTable('getSelections');
            $scope.useCurrentPageData = angular.element('#enteringClassTable').bootstrapTable('getData', true);
            $scope.searchedData = angular.element('#enteringClassTable').bootstrapTable('getData', false);
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/score/formalExamScore/scoreEntering/datetimeSet.html',
                size: 'lg',
                resolve: {
                    scope: function () {
                        return $scope;
                    }
                },
                controller: datetimeSetController
            });
        };

        // 指定录入人
        $scope.appointEnter = function(row){
            var rows = $('#enteringClassTable').bootstrapTable('getSelections');
            if(rows.length==0 && row==null){
                alertService('请先选择要录入的项');
                return;
            }
            if(row){
                rows.push(row);
            }
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/score/cleanExamScore/scoreEntering/appointEnter.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return rows;
                    }
                },
                controller: appointEnterController
            });
        };


        // 表格的高度
        $scope.enteringPersonTableHeight = $window.innerHeight - 245;

        // 查询参数
        $scope.searchParamPeople = {
            type:"selectMakeupExecutor",
            taskType:'3'
        }
        $scope.recordQueryParams = function modelDataRangeQueryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
            };
            return angular.extend(pageParam, $scope.searchParamPeople);
        }
        baseinfo_generalService.findAcadyeartermNamesBox(function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.semesterObjs = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.id as plateObj.acadYearSemester  for plateObj in semesterObjs" '
                +  ' ng-model="searchParamPeople.semester" id="semester_" name="semester_" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#semester_").parent().empty().append(html);
            $compile(angular.element("#semester_").parent().contents())($scope);
        });
        $scope.enteringPersonTable = {
            // url: 'data_test/score/tableview_majorScheme.json',
            url: app.api.address + '/score/scoreEntering',
            method: 'get',
            cache: false,
            toolbar: '#toolbar_tab2', //工具按钮用哪个容器
            height: $scope.enteringPersonTableHeight,
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
                $compile(angular.element('#enteringPersonTable').contents())($scope);
                angular.element('#enteringPersonTable').bootstrapTable('resetView',{ height: $scope.enteringPersonTableHeight } );

            },
            columns: [
                {checkbox: true, width: "5%"},
                {field:"semester", title:"学年学期"},
                {field:"courseNum", title:"课程编号"},
                {field:"courseName", title:"课程名称"},
                {field:"department", title:"开课单位"},
                {field:"credit",title:"学分",align:"center",valign:"middle"},
                {field:"courseProperty",title:"课程属性",align:"center",valign:"middle"},
                // {field:"teacher",title:"任课教师",align:"center",valign:"middle"},
                {field:"className",title:"班级名称",align:"center",valign:"middle"},
                {field:"count",title:"人数",align:"center",valign:"middle"},
                {field:"inputName",title:"成绩录入人",align:"center",valign:"middle"},
                {field:"operation",title:"操作",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        return "<button type='button'  class='btn btn-sm btn-default' ng-click='updateExecutor("+ angular.toJson(row) +")'><span class='fa fa-edit toolbar-btn-icon'></span>更改录入人</button>";
                    }
                }
            ]
        };


        // 指定录入人
        $scope.updateExecutor = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/score/cleanExamScore/scoreEntering/appointEnter.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return row;
                    }
                },
                controller: updateExecutorController
            });
        };

        // 判断卡片是都被点击
        $scope.clickAlready2 = function(){
            angular.element('#enteringPersonTable').bootstrapTable('refresh');
        };

        // 查询表单显示和隐藏切换
        $scope.isHideSearchForm = false; // 默认显示
        $scope.searchFormHideToggle = function () {
            $scope.isHideSearchForm = !$scope.isHideSearchForm
            if ($scope.isHideSearchForm) {
                $scope.enteringPersonTableHeight = $scope.enteringPersonTableHeight + 115;
            } else {
                $scope.enteringPersonTableHeight = $scope.enteringPersonTableHeight - 115;
            }
            angular.element('#enteringPersonTable').bootstrapTable('resetView',{ height: $scope.enteringPersonTableHeight } );
        };
        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#enteringPersonTable').bootstrapTable('selectPage', 1);
            // angular.element('#enteringPersonTable').bootstrapTable('refresh');
        };
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.searchParamPeople = {
                type:"selectMakeupExecutor",
                taskType:'3'};
            angular.element('form[name="curriculaSearchForm2"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#enteringPersonTable').bootstrapTable('refresh');
        };


        // 打开删除面板
        $scope.delEnter = function(){
            var rows = angular.element('#enteringPersonTable').bootstrapTable('getSelections');
            if(rows.length == 0){
                alertService('请先选择要删除的项');
                return;
            }

            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/score/cleanExamScore/scoreEntering/delete.html',
                resolve: {
                    items: function () {
                        return rows;
                    },
                },
                controller: delEnterController
            });
        };

    };
    score_cleanScoreEnteringController.$inject = ['baseinfo_generalService', 'app', '$compile', '$scope', '$uibModal', '$rootScope', '$window', '$timeout', 'score_cleanScoreEnteringService', 'alertService'];

    //生成任务控制器
    var producedTaskController = function ($scope, $uibModalInstance,alertService, score_cleanScoreEnteringService,baseinfo_generalService, formVerifyService , $compile, $rootScope) {
        initProducedTaskMetaData($scope, baseinfo_generalService, alertService, $compile);
        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            $scope.producedTask.type='3';
            $rootScope.showLoading = true; // 开启加载提示
            score_cleanScoreEnteringService.generate($scope.producedTask,function (error, message,data) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#enteringClassTable').bootstrapTable('refresh');
                $uibModalInstance.close();
                alertService('success', '生成成功');
            });
            $uibModalInstance.close();
        };
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    };
    producedTaskController.$inject = ['$scope', '$uibModalInstance', 'alertService', 'score_cleanScoreEnteringService', 'baseinfo_generalService', 'formVerifyService', '$compile','$rootScope'];
    
    //删除录入人
    var delEnterController = function ($timeout, $scope, $uibModalInstance, $compile, items, score_cleanScoreEnteringService, formVerifyService) {

        $scope.message = "确定要删除吗？";
        $scope.ok = function (form) {
            var ids = [];
            items.forEach (function(data) {
                ids.push(data.executorId);
            });
            score_cleanScoreEnteringService.delete(ids, function (error, message) {
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#enteringPersonTable').bootstrapTable('refresh');
                alertService('success', '删除成功');
            });
            $uibModalInstance.close();
        };
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    };
    delEnterController.$inject = ['$timeout', '$scope', '$uibModalInstance', '$compile', 'items', 'score_cleanScoreEnteringService', 'formVerifyService'];


    // 指定录入人
    var appointEnterController = function (baseinfo_generalService, $rootScope, $uibModal, $compile, app, $scope, $uibModalInstance, item, score_cleanScoreEnteringService, alertService, formVerifyService) {

        // 查询参数
        $scope.searchParam = {};
        $scope.queryParams = function versionModelQueryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
            };
            $rootScope.$log.debug(angular.extend(pageParam, $scope.searchParam));
            return angular.extend(pageParam, $scope.searchParam);
        }
        baseinfo_generalService.findcodedataNames({datableNumber: "XBM"},function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.sexObjs = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.dataNumber as plateObj.dataName  for plateObj in sexObjs" '
                +  ' ng-model="searchParam.sex" id="sex" name="sex" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#sex").parent().empty().append(html);
            $compile(angular.element("#sex").parent().contents())($scope);
        });

        baseinfo_generalService.findcodedataNames({datableNumber: "JZGLBM"}, function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.teacherCategoryObjs = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.dataNumber as plateObj.dataName  for plateObj in teacherCategoryObjs" '
                +  ' ng-model="searchParam.teacherCategory" id="teacherCategory" name="teacherCategory" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#teacherCategory").parent().empty().append(html);
            $compile(angular.element("#teacherCategory").parent().contents())($scope);
        });
        $scope.teacherIntoTable =  {
            //url: 'data_test/scheme/tableview_SchemeVersion.json',
            url: app.api.address + '/score/scoreEntering/queryTeacher',
            method: 'get',
            cache: false,
            height: 300,
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
            clickToSelect: true,
            responseHandler:function(response){
                return response.data;
            },
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
                {field:"",title:"序号",align:"center",valign:"middle", width: "5%", formatter: function (value, row, index) {
                    return index+1;
                }},
                {field:"user_ID",title:"职工号",align:"center",valign:"middle"},
                {field:"name",title:"教师姓名",align:"center",valign:"middle"},
                {field:"IDNumber",title:"身份证号",align:"center",valign:"middle"},
                {field:"sex",title:"性别",align:"center",valign:"middle"},
                {field:"department",title:"所在单位",align:"center",valign:"middle"},
                {field:"teacherCategory",title:"教师类别",align:"center",valign:"middle"},
                // {field:"cz",title:"操作",align:"center",valign:"middle",width: "20%",
                //     formatter : function (value, row, index) {
                //         var updateBtn = "<button id='btn_fzrsz' has-permission='classCurriculaApply:apply:add' type='button' ng-click='update(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>查看详情</button>";
                //         return updateBtn;
                //     }
                // }
            ]
        };

        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#teacherIntoTable').bootstrapTable('selectPage', 1);
            // angular.element('#enteringPersonTable').bootstrapTable('refresh');
        };
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.searchParam={};
            angular.element('form[name="pyfabzkz_form"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#teacherIntoTable').bootstrapTable('refresh');
        };

        $scope.save = function () {
            $rootScope.showLoading = true; // 开启加载提示
            var rows = angular.element('#teacherIntoTable').bootstrapTable('getSelections');
            if(rows.length == 0){
                $rootScope.showLoading = false; // 关闭加载提示
                alertService('请先选择录入人');
                return;
            }
            var taskIds = []; // 代码类型号数组
            item.forEach (function(data) {
                taskIds.push(data.id);
            });
            score_cleanScoreEnteringService.save(taskIds, rows, function (error, message) {
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
    appointEnterController.$inject = ['baseinfo_generalService', '$rootScope', '$uibModal', '$compile', 'app','$scope', '$uibModalInstance', 'item', 'score_cleanScoreEnteringService', 'alertService', 'formVerifyService'];

    // 更改录入人
    var updateExecutorController = function (baseinfo_generalService, $rootScope, $uibModal, $compile, app, $scope, $uibModalInstance, item, score_cleanScoreEnteringService, alertService, formVerifyService) {

        // 查询参数
        $scope.searchParam = {};
        $scope.queryParams = function versionModelQueryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
            };
            $rootScope.$log.debug(angular.extend(pageParam, $scope.searchParam));
            return angular.extend(pageParam, $scope.searchParam);
        }
        baseinfo_generalService.findcodedataNames({datableNumber: "XBM"},function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.sexObjs = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.dataNumber as plateObj.dataName  for plateObj in sexObjs" '
                +  ' ng-model="searchParam.sex" id="sex" name="sex" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#sex").parent().empty().append(html);
            $compile(angular.element("#sex").parent().contents())($scope);
        });

        baseinfo_generalService.findcodedataNames({datableNumber: "JZGLBM"}, function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.teacherCategoryObjs = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.dataNumber as plateObj.dataName  for plateObj in teacherCategoryObjs" '
                +  ' ng-model="searchParam.teacherCategory" id="teacherCategory" name="teacherCategory" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#teacherCategory").parent().empty().append(html);
            $compile(angular.element("#teacherCategory").parent().contents())($scope);
        });
        $scope.teacherIntoTable =  {
            //url: 'data_test/scheme/tableview_SchemeVersion.json',
            url: app.api.address + '/score/scoreEntering/queryTeacher',
            method: 'get',
            cache: false,
            height: 300,
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
            clickToSelect: true,
            responseHandler:function(response){
                return response.data;
            },
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
                {radio: true, width: "5%"},
                {field:"",title:"序号",align:"center",valign:"middle", width: "5%", formatter: function (value, row, index) {
                    return index+1;
                }},
                {field:"user_ID",title:"职工号",align:"center",valign:"middle"},
                {field:"name",title:"教师姓名",align:"center",valign:"middle"},
                {field:"IDNumber",title:"身份证号",align:"center",valign:"middle"},
                {field:"sex",title:"性别",align:"center",valign:"middle"},
                {field:"department",title:"所在单位",align:"center",valign:"middle"},
                {field:"teacherCategory",title:"教师类别",align:"center",valign:"middle"},
                // {field:"cz",title:"操作",align:"center",valign:"middle",width: "20%",
                //     formatter : function (value, row, index) {
                //         var updateBtn = "<button id='btn_fzrsz' has-permission='classCurriculaApply:apply:add' type='button' ng-click='update(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>查看详情</button>";
                //         return updateBtn;
                //     }
                // }
            ]
        };

        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#teacherIntoTable').bootstrapTable('selectPage', 1);
            // angular.element('#enteringPersonTable').bootstrapTable('refresh');
        };
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.searchParam={};
            angular.element('form[name="pyfabzkz_form"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#teacherIntoTable').bootstrapTable('refresh');
        };

        $scope.save = function () {
            var rows = angular.element('#teacherIntoTable').bootstrapTable('getSelections');
            if(rows.length == 0){
                alertService('请先选择录入人');
                return;
            }
            $rootScope.showLoading = true; // 开启加载提示
            score_cleanScoreEnteringService.update(item.executorId, rows[0], function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#enteringPersonTable').bootstrapTable('refresh');
                $uibModalInstance.close();
                alertService('success', '保存成功');
            });
        }

        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    };
    updateExecutorController.$inject = ['baseinfo_generalService', '$rootScope', '$uibModal', '$compile', 'app','$scope', '$uibModalInstance', 'item', 'score_cleanScoreEnteringService', 'alertService', 'formVerifyService'];

// 时间设置
    var datetimeSetController = function ($filter, $rootScope, $uibModal, $compile, app, $scope, $uibModalInstance, scope, score_cleanScoreEnteringService, alertService, formVerifyService) {

        // 查询参数
        $scope.datetimeManage = {};
        $scope.datetimeManage.createModel = "1";
        // 开始日期参数配置
        $scope.ksrqOptions = {
            opened: false,
            open: function() {
                $scope.ksrqOptions.opened = true;
            }
        };
        // 结束日期参数配置
        $scope.jsrqOptions = {
            opened: false,
            open: function() {
                $scope.jsrqOptions.opened = true;
            }
        };
        // 结束日期小于开始日期时的提示
        $scope.jsrqTooltipEnableAndOpen = false;
        $scope.$watch('datetimeManage.endDate', function (newValue) {
            if ($scope.datetimeManage.startDate && newValue && (newValue < $scope.datetimeManage.startDate)) {
                $scope.jsrqTooltipEnableAndOpen = true;
                return;
            }
            $scope.jsrqTooltipEnableAndOpen = false;
        });

        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            $rootScope.showLoading = true; // 开启加载提示
            var taskIds = []; // 代码类型号数组
            if($scope.datetimeManage.createModel == "1"){
                // 代码类型号数组
                if(scope.selectedRows.length==0){
                    $rootScope.showLoading = false; // 关闭加载提示
                    alertService('当前没有选中记录');
                    return;
                }
                scope.selectedRows.forEach (function(data) {
                    taskIds.push(data.id);
                });
            }else if($scope.datetimeManage.createModel=="2"){
                scope.useCurrentPageData.forEach (function(data) {
                    taskIds.push(data.id);
                });
            }else if($scope.datetimeManage.createModel=="3"){
                scope.searchedData.forEach (function(data) {
                    taskIds.push(data.id);
                });
            }
            
            //转日期格式
            $scope.datetimeManage.startDate =  $filter("date")($scope.datetimeManage.startDate, app.date.format);
            $scope.datetimeManage.endDate =  $filter("date")($scope.datetimeManage.endDate, app.date.format);
            score_cleanScoreEnteringService.updateTime(taskIds, $scope.datetimeManage, function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                angular.element('#enteringClassTable').bootstrapTable('refresh');
                alertService('success', '保存成功');
            });
        }

        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    };
    datetimeSetController.$inject = ['$filter', '$rootScope', '$uibModal', '$compile', 'app','scope', '$uibModalInstance', 'items', 'score_cleanScoreEnteringService', 'alertService', 'formVerifyService'];

    var deleteController = function ($rootScope, formVerifyService,$compile, $scope, $uibModalInstance, score_cleanScoreEnteringService, alertService, pScope) {
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {

            $rootScope.showLoading = true; // 开启加载提示
            score_cleanScoreEnteringService.addCourseChange(pScope.courseInfo,function (error, message) {
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
    deleteController.$inject = ['$rootScope', 'formVerifyService','$compile', '$scope', '$uibModalInstance', 'score_cleanScoreEnteringService', 'alertService', 'pScope'];

    var initProducedTaskMetaData = function($scope, baseinfo_generalService, alertService, $compile) {
        // 学年学期
        $scope.semesterIdData = [
            {
                id: '',
                acadYearSemester: '== 请选择 =='
            }
        ];
        baseinfo_generalService.findAcadyeartermNamesBox(function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            if (data && data.data && data.data.length > 0) {
                $scope.semesterIdData = $scope.semesterIdData.concat(data.data);
            }
            var html = '' +
                '<select ng-model="producedTask.semesterId" ui-chosen="jkjswh_add_form.semesterId" ng-required="true" id="semesterId" name="semesterId" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="semesterIdItem in semesterIdData" value="{{semesterIdItem.id}}">{{semesterIdItem.acadYearSemester}}</option>' +
                '</select>';
            angular.element("#semesterId").parent().empty().append(html);
            $compile(angular.element("#semesterId").parent().contents())($scope);
        });
        baseinfo_generalService.findCourseModel(function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.courseModularObjs = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.id as plateObj.name  for plateObj in courseModularObjs" '
                +  ' ng-model="producedTask.courseModuleId" id="courseModuleId" name="courseModuleId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#courseModuleId").parent().empty().append(html);
            $compile(angular.element("#courseModuleId").parent().contents())($scope);
        });

        baseinfo_generalService.findCourseLibrary(function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.courseNumObjs = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.courseNumber as plateObj.courseName  for plateObj in courseNumObjs" '
                +  ' ng-model="producedTask.courseNum" id="courseNum" name="courseNum" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#courseNum").parent().empty().append(html);
            $compile(angular.element("#courseNum").parent().contents())($scope);
        });
        //课程属性
        $scope.coursePropertyData = [
            {
                dataNumber: '',
                dataName: '== 请选择 =='
            }
        ];
        baseinfo_generalService.findcodedataNames({datableNumber: "KCSXDM"}, function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            if (data && data.data && data.data.length > 0) {
                $scope.coursePropertyData = $scope.coursePropertyData.concat(data.data);
            }
            var html = '' +
                '<select ng-model="producedTask.coursePropertyNum" id="coursePropertyNum" name="coursePropertyNum" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="courseProperty in coursePropertyData" value="{{courseProperty.dataNumber}}">{{courseProperty.dataName}}</option>' +
                '</select>';
            angular.element("#coursePropertyNum").parent().empty().append(html);
            $compile(angular.element("#coursePropertyNum").parent().contents())($scope);
        });
        // 上课院系
        $scope.deptIdData = [
            {
                departmentNumber: '',
                departmentName: '== 请选择 =='
            }
        ];
        baseinfo_generalService.findDepartmentNamesBox(function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            if (data && data.data && data.data.length > 0) {
                $scope.deptIdData = $scope.deptIdData.concat(data.data);
            }
            var html = '' +
                '<select ng-model="producedTask.collegeId" id="collegeId" name="collegeId" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="deptIdItem in deptIdData" value="{{deptIdItem.departmentNumber}}">{{deptIdItem.departmentName}}</option>' +
                '</select>';
            angular.element("#collegeId").parent().empty().append(html);
            $compile(angular.element("#collegeId").parent().contents())($scope);
        });

        // 上课院系
        $scope.deptIdData = [
            {
                departmentNumber: '',
                departmentName: '== 请选择 =='
            }
        ];
        baseinfo_generalService.findDepartmentNamesBox(function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            if (data && data.data && data.data.length > 0) {
                $scope.deptIdData = $scope.deptIdData.concat(data.data);
            }
            var html = '' +
                '<select ng-model="producedTask.deptId" id="deptId" name="deptId" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="deptIdItem in deptIdData" value="{{deptIdItem.departmentNumber}}">{{deptIdItem.departmentName}}</option>' +
                '</select>';
            angular.element("#deptId").parent().empty().append(html);
            $compile(angular.element("#deptId").parent().contents())($scope);
        });
        // 上课年级
        $scope.gradeNameData = [
            {
                id: '',
                dataNumber: '== 请选择 =='
            }
        ];
        baseinfo_generalService.gradeList(function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            if (data && data.data && data.data.length > 0) {
                var gradeList = [];
                angular.forEach(data.data, function(grade, index){
                    gradeList.push({
                        id: grade.dataNumber,
                        dataNumber: grade.dataNumber
                    });
                });
                $scope.gradeNameData = $scope.gradeNameData.concat(gradeList);
            }
            var html = '' +
                '<select ng-model="producedTask.gradeName" id="gradeName" name="gradeName" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="gradeNameItem in gradeNameData" value="{{gradeNameItem.id}}">{{gradeNameItem.dataNumber}}</option>' +
                '</select>';
            angular.element("#gradeName").parent().empty().append(html);
            $compile(angular.element("#gradeName").parent().contents())($scope);
        });
        // 专业名称
        $scope.majorIdData = [
            {
                code: '',
                name: '== 请选择 =='
            }
        ];
        baseinfo_generalService.gradeProfessionPull({}, function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            if (data && data.data && data.data.length > 0) {
                $scope.majorIdData = $scope.majorIdData.concat(data.data);
            }
            var html = '' +
                '<select ng-model="producedTask.majorId" id="majorId" name="majorId" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="majorIdItem in majorIdData" value="{{majorIdItem.code}}">{{majorIdItem.name}}</option>' +
                '</select>';
            angular.element("#majorId").parent().empty().append(html);
            $compile(angular.element("#majorId").parent().contents())($scope);
        });
        // 班级名称
        $scope.executiveClassIdData = [
            {
                id: '',
                name: '== 请选择 =='
            }
        ];
        baseinfo_generalService.classList(function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            if (data && data.data && data.data.length > 0) {
                $scope.executiveClassIdData = $scope.executiveClassIdData.concat(data.data);
            }
            var html = '' +
                '<select ng-model="producedTask.executiveClassId" id="executiveClassId" name="executiveClassId" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="executiveClassIdItem in executiveClassIdData" value="{{executiveClassIdItem.id}}">{{executiveClassIdItem.name}}</option>' +
                '</select>';
            angular.element("#executiveClassId").parent().empty().append(html);
            $compile(angular.element("#executiveClassId").parent().contents())($scope);
        });
    }
    
})(window);
