;(function (window, undefined) {
    'use strict';
    window.score_exemptApprovalController = function($compile, app, baseinfo_generalService, $scope, $uibModal, $rootScope, $window, score_exemptApprovalService, alertService){

        // 表格的高度
        $scope.table_height = $window.innerHeight-130;

        // 审核tab表格的高度
        $scope.shTable_height = $window.innerHeight-223;

        // 维护tab表格的高度
        $scope.whTable_height = $window.innerHeight-348;

        //学年学期
        baseinfo_generalService.findAcadyeartermNamesBox(function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.semesterObjs = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.id as plateObj.acadYearSemester  for plateObj in semesterObjs" '
                +  ' ng-model="makeupExaminationList.semesterId" id="semesterId" name="semesterId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#semesterId").parent().empty().append(html);
            $compile(angular.element("#semesterId").parent().contents())($scope);
        });

        //考试方式
        baseinfo_generalService.findcodedataNames({datableNumber: "KSFSDM"},function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.examWays = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.dataNumber as plateObj.dataName  for plateObj in examWays" '
                +  ' ng-model="makeupExaminationList.examWays" id="examWays" name="examWays" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#examWays").parent().empty().append(html);
            $compile(angular.element("#examWays").parent().contents())($scope);
        });

        // 查询参数
        $scope.shQueryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder
            };
            return angular.extend(pageParam, $scope.makeupExaminationList);
        }

        //考试方式审批 table
        $scope.examinationMethodApprovalTable = {
            url:app.api.address + '/exam/examReview/exemptExamInfo',
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
                {field:"semester",title:"学年学期",align:"center",valign:"middle"},
                {field:"studentId",title:"学号",align:"center",valign:"middle"},
                {field:"studentName",title:"姓名",align:"center",valign:"middle"},
                {field:"courseId",title:"课程编号",align:"center",valign:"middle"},
                {field:"courseName",title:"课程名称",align:"center",valign:"middle"},
                {field:"dept",title:"开课单位",align:"center",valign:"middle"},
                {field:"credit",title:"学分",align:"center",valign:"middle"},
                {field:"examWay",title:"考试方式",align:"center",valign:"middle"},
                {field:"reviewStatus",title:"审批状态",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        if(value == '0'){
                            return '不通过';
                        }
                        if(value == '1'){
                            return '通过';
                        }
                        if(value == '2'){
                            return '审核中';
                        }
                    }},
                {field:"cz",title:"操作",align:"center",valign:"middle",width: "10%",
                    formatter : function (value, row, index) {
                        if(row.reviewStatus == '2'){
                            return "<button id='btn_delete'  type='button' ng-click='approval(" + JSON.stringify(row) + ")' class='btn btn-default'>审批</button>";
                        }
                        return "<button id='btn_delete'  type='button' disabled='disabled' class='btn'>审批</button>";
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
                $scope.shTable_height = $scope.shTable_height + 115;
            } else {
                $scope.shTable_height = $scope.shTable_height - 115;
            }
            angular.element('#examinationMethodApprovalTable').bootstrapTable('resetView',{ height: $scope.shTable_height } );
        };
        
        // 查询表单提交
        $scope.shSearchSubmit = function () {
            angular.element('#examinationMethodApprovalTable').bootstrapTable('selectPage', 1);
        };
        
        // 查询表单重置
        $scope.shSearchReset = function () {
            $scope.makeupExaminationList = {};
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
                    templateUrl: 'tpl/exam/studentExemptExamination/approval/batchApproval.html',
                    resolve: {
                        items: function () {
                            return rows;
                        }, parentModal: function () {
                            return "";
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
                templateUrl: 'tpl/exam/studentExemptExamination/approval/approval.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return data;
                    },
                },
                controller: examinationMethodApproval
            });
        }

        /**
         * 点击考试方式维护
         */
        $scope.whClickAlready = function() {
			angular.element('#examinationMethodMaintainTable').bootstrapTable('refresh');
        };
        
        $scope.ok = function () {
            var data = angular.element('#examinationMethodMaintainTable').bootstrapTable('getData');
            data.forEach (function(obj) {
                obj.ksfs = angular.element('#ksfs'+obj.id)[0].value;
                obj.pscjbl = angular.element('#pscjbl'+obj.id)[0].value;
                obj.qmcjbl = angular.element('#qmcjbl'+obj.id)[0].value;
            });
            score_exemptApprovalService.add(data);
        }

    }
    score_exemptApprovalController.$inject = ['$compile', 'app', 'baseinfo_generalService', '$scope', '$uibModal', '$rootScope', '$window', 'score_exemptApprovalService', 'alertService'];

    //批量审批
    var examinationMethodBatchApproval = function ($scope, $rootScope, alertService, formVerifyService, parentModal, $uibModalInstance, items, score_exemptApprovalService) {
        $scope.cancel= function(){
            $uibModalInstance.close();
        }
        $scope.ok = function (form) {

            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            var param = [];
            items.forEach (function(data) {
                if(data.reviewStatus == '2'){
                    var tem = {
                        processId : data.processId,
                        node : data.node,
                        result :$scope.result,
                        opinion : $scope.record
                    }
                    param.push(tem);
                }
            });
            $rootScope.showLoading = true; // 开启加载提示
            score_exemptApprovalService.batchApproval(param,function (error, message,data) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else{
                    angular.element('#examinationMethodApprovalTable').bootstrapTable('refresh');
                }
            });
            $uibModalInstance.close();
            if(parentModal){
                parentModal.close();
            }
        };
    }
    examinationMethodBatchApproval.$inject = ['$scope', '$rootScope', 'alertService', 'formVerifyService', 'parentModal', '$uibModalInstance', 'items', 'score_exemptApprovalService'];

    //审批
    var examinationMethodApproval = function ($scope, $uibModalInstance, $uibModal, item, score_exemptApprovalService, alertService) {
        $scope.apply = item;

        $scope.cancel= function(){
            $uibModalInstance.close();
        }
        $scope.ok = function (form) {
            var items =[item];
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/exam/studentExemptExamination/approval/batchApproval.html',
                resolve: {
                    items: function () {
                        return items;
                    },
                    parentModal: function () {
                        return $uibModalInstance;
                    },
                },
                controller: examinationMethodBatchApproval
            });
        };
    }
    examinationMethodApproval.$inject = ['$scope', '$uibModalInstance', '$uibModal', 'item', 'score_exemptApprovalService', 'alertService'];
})(window);
