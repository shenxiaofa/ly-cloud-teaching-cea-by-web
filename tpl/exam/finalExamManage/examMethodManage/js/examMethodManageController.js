;(function (window, undefined) {
    'use strict';
    window.exam_methodManageController = function($compile, baseinfo_generalService, app, $scope, $uibModal, $rootScope, $window, exam_methodManageService, alertService){

        //考试方式
        baseinfo_generalService.findcodedataNames({datableNumber: "KSFSDM"},function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.examWay = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.dataNumber as plateObj.dataName  for plateObj in examWay" '
                +  ' ng-model="makeupExaminationList.examWay" id="examWay" name="examWay" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#examWay").parent().empty().append(html);
            $compile(angular.element("#examWay").parent().contents())($scope);
        });


        //学年学期
        baseinfo_generalService.findAcadyeartermNamesBox(function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.semesterObjs = data.data;
            var html2 = '' +
                '<select ui-select2 ng-options="plateObj.id as plateObj.acadYearSemester  for plateObj in semesterObjs" '
                +  ' ng-model="makeupExaminationList.semesterId" id="semesterId" name="semesterId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#semesterId").parent().empty().append(html2);
            $compile(angular.element("#semesterId").parent().contents())($scope);

            var html = '' +
                '<select ui-select2 ng-options="plateObj.id as plateObj.acadYearSemester  for plateObj in semesterObjs" '
                +  ' ng-model="makeupExamList.semesterId" id="semesterId_review" name="semesterId_review" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#semesterId_review").parent().empty().append(html);
            $compile(angular.element("#semesterId_review").parent().contents())($scope);
            

        });

        // 表格的高度
        $scope.table_height = $window.innerHeight-130;

        // 审核tab表格的高度
        $scope.shTable_height = $window.innerHeight-216;

        // 维护tab表格的高度
        $scope.whTable_height = $window.innerHeight-256;

        //考试方式申请 table
        $scope.examinationMethodApplyTable = {
            url:app.api.address + '/exam/testTask/examWayTask',
            method: 'get',
            cache: false,
            height: $scope.table_height,
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）			striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [5, 10, 20, 50],
            search: false,
            showColumns: true,
            showRefresh: true,
            uniqueId: "id",
            onLoadSuccess: function() {
                $compile(angular.element('#examinationMethodApplyTable').contents())($scope);
            },
            responseHandler:function(response){
                return response.data;
            },
            columns: [
                {field:"name",title:"申请表单",align:"center",valign:"middle"},
                {field:"semester",title:"学年学期",align:"center",valign:"middle"},
                {field:"applyTime",title:"申请时间",align:"center",valign:"middle"},
                {field:"teachers",title:"执行人",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        if(value == '' || value == null){
                            return "-";
                        }
                        var names = "";
                        angular.forEach(value, function(data, index, array){
                            names += data.name + "、";
                        });
                        if (names.length > 0) {
                            names = names.substring(0, names.length - 1);
                        }
                        return names;
                    }},
                {field:"status",title:"审批状态",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        if(value == "0"){
                            return "不通过";
                        }
                        if(value == "1"){
                            return "通过";
                        }
                        if(value == "2"){
                            return "已提交";
                        }
                        return "未提交";
                    }
                },
                {field:"cz",title:"操作",align:"center",valign:"middle",width: "10%",
                    formatter : function (value, row, index) {
                        if(row.status == '1' || row.status == '2'){
                             return "<button type='button' class='btn btn-default' disabled='disabled'>确认考试方式</button>";
                        }else{
                            return "<button  type='button' ng-click='confirm(" + JSON.stringify(row) + ")' class='btn btn-info'>确认考试方式</button>";
                        }
                    }
                }
            ],
        };
        
        //确认考试方式
        $scope.confirm = function(row) {
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/exam/finalExamManage/examMethodManage/examinationMethodConfirm.html',
                size: 'lg',
                resolve: {
                    items: function () {
                        return row;
                    }
                },
                controller: examinationMethodConfirm
            });
        }

        // 查询参数
        $scope.shQueryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder
            };
            return angular.extend(pageParam, $scope.makeupExamList);
        }

        //考试方式审批 table
        $scope.examinationMethodApprovalTable = {
            url:app.api.address + '/exam/testTask/examWayTask',
            method: 'get',
            cache: false,
            height: $scope.shTable_height,
            toolbar: '#toolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            sortOrder: 'desc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField : "xnxq", // 指定主键列
            uniqueId: "xnxq", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.shQueryParams,//传递参数（*）
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [5, 10, 20, 50],
            search: false,
            showColumns: true,
            showRefresh: true,
            clickToSelect: true,
            onLoadSuccess: function() {
                $compile(angular.element('#examinationMethodApprovalTable').contents())($scope);
            },
            responseHandler:function(response){
                return response.data;
            },
            columns: [
                {checkbox: true,width: "3%"},
                {field:"name",title:"申请表单",align:"center",valign:"middle"},
                {field:"semester",title:"学年学期",align:"center",valign:"middle"},
                {field:"courseName",title:"课程名称",align:"center",valign:"middle"},
                {field:"applyTime",title:"申请时间",align:"center",valign:"middle"},
                {field:"teachers",title:"执行人",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        if(value == '' || value == null){
                            return "-";
                        }
                        var names = "";
                        angular.forEach(value, function(data, index, array){
                            names += data.name + "、";
                        });
                        if (names.length > 0) {
                            names = names.substring(0, names.length - 1);
                        }
                        return names;
                    }},
                {field:"status",title:"审批状态",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        if(value == "0"){
                            return "不通过";
                        }
                        if(value == "1"){
                            return "通过";
                        }
                        if(value == "2"){
                            return "审核中";
                        }
                        return "未提交";
                    }
                },
                {field:"id",title:"操作",align:"center",valign:"middle",width: "10%",
                    formatter : function (value, row, index) {
                        if(row.status == "2"){
                            return "<button id='btn_delete'  type='button' ng-click='approval(" + JSON.stringify(row) + ")' class='btn btn-info'>审批</button>";
                        }
                        return "<button type='button' class='btn btn-default' disabled='disabled'>审批</button>";
                    }
                }
            ],
        };
        
        /**
         * 点击考试方案审核
         */
        $scope.shClickAlready = function() {
			angular.element('#examinationMethodApprovalTable').bootstrapTable('refresh');
        };
        
        // 查询表单显示和隐藏切换
        $scope.shIsHideSearchForm = false; // 默认显示
        $scope.shSearchFormHideToggle = function () {
            $scope.shIsHideSearchForm = !$scope.shIsHideSearchForm
            if ($scope.shIsHideSearchForm) {
                $scope.shTable_height = $scope.shTable_height + 75;
            } else {
                $scope.shTable_height = $scope.shTable_height - 75;
            }
            angular.element('#examinationMethodApprovalTable').bootstrapTable('resetView',{ height: $scope.shTable_height } );
        };
        
        // 查询表单提交
        $scope.shSearchSubmit = function () {
            angular.element('#examinationMethodApprovalTable').bootstrapTable('selectPage', 1);
        };
        
        // 查询表单重置
        $scope.shSearchReset = function () {
            $scope.makeupExamList = {};
            angular.element('form[name="shpyfabzkzsh_form"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#examinationMethodApprovalTable').bootstrapTable('refresh');
        };

        //批量审批
        $scope.batchApproval = function(){
            var rows = $('#examinationMethodApprovalTable').bootstrapTable('getSelections');
            if(rows.length==0){
                alertService('请先选择要审批的项');
            }else{
                $uibModal.open({
                    animation: true,
                    backdrop: 'static',
                    templateUrl: 'tpl/exam/finalExamManage/examMethodManage/examinationMethodBatchApproval.html',
                    size: 'lg',
                    resolve: {
                        items: function () {
                            return rows;
                        },
                    },
                    controller: examinationMethodBatchApproval
                });
            }
        }

        //审批
        $scope.approval = function(data){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/exam/finalExamManage/examMethodManage/examinationMethodApproval.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return data;
                    },
                },
                controller: examinationMethodApproval
            });
        }

        // 查询参数
        $scope.whQueryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder
            };
            return angular.extend(pageParam, $scope.makeupExaminationList);
        }

        //维护
        $scope.examinationMethodMaintainTable =  {
            url:app.api.address + '/exam/testTask/allTeachingClass',
            method: 'get',
            cache: false,
            height:  $scope.whTable_height,
            toolbar : "#toolbar3",
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.whQueryParams,//传递参数（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [5, 10, 20, 50],
            search: false,
            showColumns: true,
            showRefresh: true,
            uniqueId: "id",
            onLoadSuccess: function() {
                $compile(angular.element('#examinationMethodMaintainTable').contents())($scope);
            },
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#examinationMethodMaintainTable').contents())($scope);
            },
            responseHandler:function(response){
                return response.data;
            },
            columns: [
                {checkbox: true,width: "3%"},
                {field:"semester",title:"学年学期",align:"center",valign:"middle"},
                {field:"courseId",title:"课程代码",align:"center",valign:"middle"},
                {field:"courseName",title:"课程名称",align:"center",valign:"middle"},
                {field:"dept",title:"开课单位",align:"center",valign:"middle"},
                {field:"totalHour",title:"学时",align:"center",valign:"middle"},
                {field:"credit",title:"学分",align:"center",valign:"middle"},
                {field:"className",title:"教学班名称",align:"center",valign:"middle"},
                {field:"studentCount",title:"上课人数",align:"center",valign:"middle"},
                {field:"examWay",title:"考试方式",align:"center",valign:"middle",width: "15%",
                    formatter : function (value, row, index) {
                        // $scope.$watch('examWay'+row.id, function(newVal){
                        //     $scope["examWay"+row.id] = value;
                        // });
                        $scope.$watch('examWay', function(newVal){
                            var html = '' +
                                '<select ui-select2 ng-options="plateObj.dataNumber as plateObj.dataName  for plateObj in examWay" '
                                +  '  ng-model='+"examWay"+row.id+' id='+"examWay"+row.id+' name="examWay" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                                +  '<option value="">==请选择==</option> '
                                +  '</select>';
                            angular.element("#examWay"+row.id).parent().empty().append(html);
                            $compile(angular.element("#examWay"+row.id).parent().contents())($scope);
                        });
                        $scope["examWay"+row.id] = value;
                        //var selectHtml = '<select name="examWay" id='+"examWay"+row.id+'  ng-model='+"examWay"+row.id+' class="col-xs-8 form-control mark"> <option value="">==请选择==</option> </select>'
                        var html = '' +
                            '<select ui-select2 ng-options="plateObj.dataNumber as plateObj.dataName  for plateObj in semesterObjs" '
                            +  ' ng-model='+"examWay"+row.id+' id='+"examWay"+row.id+' name="examWay" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control examWay"> '
                            +  '<option value="">==请选择==</option> '
                            +  '</select>';
                        return html;
                    }
                },
                {field:"usualScoreScale",title:"平时成绩比例",align:"center",valign:"middle",width: "5%",
                    formatter : function (value, row, index) {
                        $scope.$watch('exam'+row.id, function(newVal){
                            $scope["usual"+row.id] = 100-newVal;
                        });
                        // if(value==undefined){
                        // }else {
                        //     $scope["usual"+row.id] = value.substring(2);
                        // }
                        value = Math.floor(value * 100);
                        var input = '<input type="number" id='+"usual"+row.id+' ng-model='+"usual"+row.id+' min="0" max="100" style="width: 64px;"   value="'+value+'"  name="usualScore" size="2"/>';
                        return input;
                    }
                },
                {field:"examScoreScale",title:"期末成绩比例",align:"center",valign:"middle",width: "5%",
                    formatter : function (value, row, index) {
                        $scope.$watch('usual'+row.id, function(newVal){
                            $scope["exam"+row.id] = 100-newVal;
                        });
                        // if(value==undefined){
                        // }else {
                        //     $scope["exam"+row.id] = value.substring(2);
                        // }
                        value = Math.floor(value * 100);
                        var input = '<input type="number" id='+"exam"+row.id+' ng-model='+"exam"+row.id+' style="width: 64px;" min="0" max="100" value="'+value+'"  name="examScore" size="2"/>';
                        return input;
                    }
                }
            ]
        }
        //保存
        $scope.ok = function () {
            var data = angular.element('#examinationMethodMaintainTable').bootstrapTable('getSelections');
            if(data == null || data.length < 1){
                alertService("请将选择需要保存的项");
                return;
            }
            for(var i = 0; i<data.length; i++ ){
                var obj = data[i];
                obj.examWay =  $scope['examWay'+obj.id];
                //obj.examWay = angular.element('#examWay'+obj.id)[0].value;
                obj.usualScoreScale = angular.element('#usual'+obj.id)[0].value;
                obj.examScoreScale = angular.element('#exam'+obj.id)[0].value;
                if(obj.examWay == "" || obj.usualScoreScale == "" || obj.examScoreScale == ""){
                    alertService("请将信息补充完整再提交");
                    return;
                }
                obj.usualScoreScale = parseInt(obj.usualScoreScale)/100;
                obj.examScoreScale = parseInt(obj.examScoreScale)/100;
            }
            $rootScope.showLoading = true; // 加载提示
            exam_methodManageService.examWayMaintain(data,function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else{
                    angular.element('#examinationMethodMaintainTable').bootstrapTable('refresh');
                    $uibModalInstance.close();
                }

            });
        }

        /**
         * 点击考试方式维护
         */
        $scope.whClickAlready = function() {
			angular.element('#examinationMethodMaintainTable').bootstrapTable('refresh');
        };
        
        // 查询表单显示和隐藏切换
        $scope.whIsHideSearchForm = false; // 默认显示
        $scope.whSearchFormHideToggle = function () {
            $scope.whIsHideSearchForm = !$scope.whIsHideSearchForm
            if ($scope.whIsHideSearchForm) {
                $scope.whTable_height = $scope.whTable_height + 115;
            } else {
                $scope.whTable_height = $scope.whTable_height - 115;
            }
            angular.element('#examinationMethodMaintainTable').bootstrapTable('resetView',{ height: $scope.whTable_height } );
        };
        
        // 查询表单提交
        $scope.whSearchSubmit = function () {
            angular.element('#examinationMethodMaintainTable').bootstrapTable('refresh');
        };
        
        // 查询表单重置
        $scope.whSearchReset = function () {
            $scope.makeupExaminationList = {};
            angular.element('form[name="pyfabzkzwh_form"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#examinationMethodMaintainTable').bootstrapTable('refresh');
        };


    }
    exam_methodManageController.$inject = ['$compile', 'baseinfo_generalService', 'app', '$scope', '$uibModal', '$rootScope', '$window', 'exam_methodManageService', 'alertService'];

    //确认考试方式
    var examinationMethodConfirm = function ($scope, $rootScope, alertService, $compile, app, items, $window, $uibModalInstance, exam_methodManageService) {

        // 表格的高度
        $scope.table_height = $window.innerHeight - 252;

        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder
            };
            return angular.extend(pageParam, $scope.makeupExaminationList);
        }

        $scope.examinationMethodApprovalTable1 =  {
            url:app.api.address + '/exam/testTask/teachingClass?examWayTaskId='+items.id,
            method: 'get',
            cache: false,
            height: 500,
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）			striped: true,
            search: false,
            showColumns: false,
            showRefresh: false,
            uniqueId: "kcdm",
            onLoadSuccess: function() {
                $compile(angular.element('#examinationMethodApprovalTable1').contents())($scope);
            },
            responseHandler:function(response){
                var data ={}
                data.rows = response.data;
                return data;
            },
            columns: [
                {field:"courseId",title:"课程代码",align:"center",valign:"middle"},
                {field:"courseName",title:"课程名称",align:"center",valign:"middle"},
                {field:"dept",title:"开课单位",align:"center",valign:"middle"},
                {field:"totalHour",title:"学时",align:"center",valign:"middle"},
                {field:"credit",title:"学分",align:"center",valign:"middle"},
                {field:"className",title:"教学班名称",align:"center",valign:"middle"},
                {field:"studentCount",title:"上课人数",align:"center",valign:"middle"},
                {field:"examWay",title:"考试方式",align:"center",valign:"middle",width: "15%",
                    formatter : function (value, row, index) {
                        $scope["examWay"+row.id] = value;
                        var selectHtml = '<select name="examWay" id='+"examWay"+row.id+'  ng-model='+"examWay"+row.id+' class="col-xs-8 form-control mark"> <option value="">==请选择==</option> <option value="1">笔试闭卷</option><option value="2">笔试开卷</option></select>'
                        return selectHtml;
                    }
                },
                {field:"usualScoreScale",title:"平时成绩比例",align:"center",valign:"middle",width: "5%",
                    formatter : function (value, row, index) {

                        $scope.$watch('exam'+row.id, function(newVal){
                            $scope["usual"+row.id] = 100-newVal;
                        });
                        
                        $scope["usual"+row.id] = value.substring(2);
                        var input = '<input type="number" id='+"usual"+row.id+' ng-model='+"usual"+row.id+' min="0" max="100" style="width: 64px;"   value="'+value+'"  name="usualScore" size="2"/>';
                        return input;
                    }
                },
                {field:"examScoreScale",title:"期末成绩比例",align:"center",valign:"middle",width: "5%",
                    formatter : function (value, row, index) {


                        $scope.$watch('usual'+row.id, function(newVal){
                            $scope["exam"+row.id] = 100-newVal;
                        });
                        $scope["exam"+row.id] = value.substring(2);
                        var input = '<input type="number" id='+"exam"+row.id+' ng-model='+"exam"+row.id+' style="width: 64px;" min="0" max="100" value="'+value+'"  name="examScore" size="2"/>';
                        return input;
                    }
                }
            ],
        }
        $scope.cancel= function(){
            $uibModalInstance.close();
        }



        $scope.ok = function () {
            var data = angular.element('#examinationMethodApprovalTable1').bootstrapTable('getData');
            for(var i = 0; i<data.length; i++ ){
                var obj = data[i];
                obj.examWay = angular.element('#examWay'+obj.id)[0].value;
                obj.usualScoreScale = angular.element('#usual'+obj.id)[0].value;
                obj.examScoreScale = angular.element('#exam'+obj.id)[0].value;
                if(obj.examWay == "" || obj.usualScoreScale == "" || obj.examScoreScale == ""){
                    alertService("请将信息补充完整再提交");
                    return;
                }
                obj.usualScoreScale = parseInt(obj.usualScoreScale)/100;
                obj.examScoreScale = parseInt(obj.examScoreScale)/100;
            }
            $rootScope.showLoading = true; // 加载提示
            exam_methodManageService.apply(data,function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else{
                    angular.element('#examinationMethodApplyTable').bootstrapTable('refresh');
                    $uibModalInstance.close();
                }

            });
            $uibModalInstance.close();
        };

    }
    examinationMethodConfirm.$inject = ['$scope', '$rootScope', 'alertService', '$compile', 'app', 'items', '$window', '$uibModalInstance', 'exam_methodManageService'];

    //批量审批
    var examinationMethodBatchApproval = function ($scope, $rootScope, alertService, $uibModalInstance, items, exam_methodManageService) {
        $scope.cancel= function(){
            $uibModalInstance.close();
        }
        $scope.ok = function (result) {
            var yj = $scope.opinion;
            if(yj==undefined){
                alertService('请填写审批意见');
                return;
            }
            var param = [];
            items.forEach (function(data) {
                //已提交的 进行审批
                if(data.status == '2'){
                    var obj = {
                        businessId : data.id,
                        result: result,
                        opinion : $scope.opinion
                    }
                    param.push(obj);
                }
            });
            $rootScope.showLoading = true; // 加载提示
            exam_methodManageService.batchApproval(param,function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else{
                    angular.element('#examinationMethodApprovalTable').bootstrapTable('refresh');
                    angular.element('#examinationMethodApplyTable').bootstrapTable('refresh');
                    $uibModalInstance.close();
                }

            });
            $uibModalInstance.close();
        };
    }
    examinationMethodBatchApproval.$inject = ['$scope', '$rootScope', 'alertService', '$uibModalInstance', 'items', 'exam_methodManageService'];

    //审批
    var examinationMethodApproval = function ($scope, $rootScope, $compile, app, $uibModalInstance, item, exam_methodManageService, alertService) {
        $scope.examinationMethodApprovalTable2 =  {
            url:app.api.address + '/exam/testTask/teachingClass?examWayTaskId='+item.id,
            method: 'get',
            cache: false,
            height: 450,
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）			striped: true,
            // pagination: true,
            // pageSize: 10,
            // pageNumber:1,
            // pageList: [5, 10, 20, 50],
            search: false,
            showColumns: false,
            showRefresh: false,
            uniqueId: "id",
            onLoadSuccess: function() {
                $compile(angular.element('#examinationMethodApprovalTable2').contents())($scope);
            },
            responseHandler:function(response){
                var data ={}
                data.rows = response.data;
                return data;
            },
            columns: [
                {field:"courseId",title:"课程代码",align:"center",valign:"middle"},
                {field:"courseName",title:"课程名称",align:"center",valign:"middle"},
                {field:"dept",title:"开课单位",align:"center",valign:"middle"},
                {field:"totalHour",title:"学时",align:"center",valign:"middle"},
                {field:"credit",title:"学分",align:"center",valign:"middle"},
                {field:"className",title:"教学班名称",align:"center",valign:"middle"},
                {field:"studentCount",title:"上课人数",align:"center",valign:"middle"},
                {field:"examWayName",title:"考试方式",align:"center",valign:"middle",width: "15%"},
                {field:"usualScoreScale",title:"平时成绩比例",align:"center",valign:"middle",width: "5%",
                    formatter : function (value, row, index) {
                        return value.substring(2)+"%";
                    }
                },
                {field:"examScoreScale",title:"期末成绩比例",align:"center",valign:"middle",width: "5%",
                    formatter : function (value, row, index) {
                        return value.substring(2)+"%";
                    }
                }
            ],
        }
        $scope.cancel= function(){
            $uibModalInstance.close();
        }
        $scope.ok = function (result) {
            var param = [];
            var yj = $scope.spyj;
            if(yj==undefined){
                alertService('请填写审批意见');
                return;
            }
            var obj = {
                businessId : item.id,
                result: result,
                opinion : $scope.spyj
            }
            param.push(obj);
            $rootScope.showLoading = true; // 加载提示
            exam_methodManageService.batchApproval(param,function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else{
                    angular.element('#examinationMethodApprovalTable').bootstrapTable('refresh');
                    angular.element('#examinationMethodApplyTable').bootstrapTable('refresh');
                    $uibModalInstance.close();
                }

            });
            $uibModalInstance.close();
        };
    }
    examinationMethodApproval.$inject = ['$scope', '$rootScope', '$compile', 'app', '$uibModalInstance', 'item', 'exam_methodManageService', 'alertService'];
})(window);
