/**
 * Created by test on 2017/6/27.
 */
;(function (window, undefined) {
    'use strict';
    //考试课程维护Controller
    window.score_scoreInfoMaintainController = function(baseinfo_generalService, $compile, $scope, $uibModal, $rootScope, $window, score_scoreInfoMaintainService, alertService, app) {

        // 表格的高度
        $scope.table_height = $window.innerHeight - 226;

        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder
            };
            return angular.extend(pageParam, $scope.scoreInfoMaintain);
        }
        baseinfo_generalService.findAcadyeartermNamesBox(function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.semesterObjs = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.id as plateObj.acadYearSemester  for plateObj in semesterObjs" '
                +  ' ng-model="scoreInfoMaintain.semesterId" id="semesterId" name="semesterId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#semesterId").parent().empty().append(html);
            $compile(angular.element("#semesterId").parent().contents())($scope);
        });
        $scope.makeupExaminationListManageTable = {
            onLoadSuccess: function() {
                $compile(angular.element('#makeupExaminationListManageTable').contents())($scope);
            },
            url:app.api.address + '/score/scoreMaintain',
            method: 'get',
            cache: false,
            height: $scope.table_height,
            toolbar: '#toolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParams,//传递参数（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [5, 10, 20, 50],
            search: false,
            showColumns: true,
            showRefresh: true,
            clickToSelect: true,
            responseHandler:function(response){
                return response.data;
            },
            columns: [
                {field:"semester",title:"学年学期",align:"center",valign:"middle"},
                {field:"studentNum",title:"学号",align:"center",valign:"middle"},
                {field:"studentName",title:"姓名",align:"center",valign:"middle"},
                {field:"examType",title:"考试类型",align:"center",valign:"middle",formatter : function (value, row, index) {
                    if(value=="1"){
                        return  "正考";
                    }
                    if(value=="2") {
                        return "补考";
                    }
                    if(value=="3") {
                        return "清考";
                    }
                }},
                {field:"roundNum",title:"轮次",align:"center",valign:"middle",formatter : function (value, row, index) {
                    if(value){
                        return  "第"+  value +"轮";
                    }else{
                        return "";
                    }
                }},
                {field:"validSign",title:"是否有效",align:"center",valign:"middle",formatter : function (value, row, index) {
                    if(value=="1"){
                        return  "是";
                    }else{
                        return "否";
                    }
                }},
                {field:"courseNum",title:"课程编号",align:"center",valign:"middle"},
                {field:"courseName",title:"课程名称",align:"center",valign:"middle"},
                {field:"deptName",title:"开课单位",align:"center",valign:"middle"},
                {field:"credit",title:"学分",align:"center",valign:"middle"},
                {field:"examWay",title:"考试方式",align:"center",valign:"middle"},
                {field:"usualScore",title:"平时成绩",align:"center",valign:"middle"},
                {field:"examScore",title:"期末成绩",align:"center",valign:"middle"},
                {field:"totalScore",title:"总评成绩",align:"center",valign:"middle"},
                {field:"makeupScore",title:"补考成绩",align:"center",valign:"middle"},
                {field:"cleanupScore",title:"清考成绩",align:"center",valign:"middle"},
                {field:"inputTime",title:"录入时间",align:"center",valign:"middle"},
                {field:"cz",title:"操作",align:"center",valign:"middle",width:"10%",
                    formatter : function (value, row, index) {
                        var adjust =  "<button id='btn_update' type='button' ng-click='update(" + JSON.stringify(row) + ")'  class='btn btn-default btn-sm''>修改</button>";
                        var work =  "<button id='btn_update' type='button' ng-click='updateStatus(" + JSON.stringify(row) + ")'  class='btn btn-default btn-sm''>失效</button>";
                        var unable =  "<button id='btn_update' type='button' ng-click='updateStatus(" + JSON.stringify(row) + ")'  class='btn btn-default btn-sm''>生效</button>";
                        if(row.validSign=="1"){
                            return  adjust+ "&nbsp;"+work;
                        }else{
                            return  adjust+ "&nbsp;"+unable;
                        }
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
            angular.element('#makeupExaminationListManageTable').bootstrapTable('resetView',{ height: $scope.table_height } );
        };

        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#makeupExaminationListManageTable').bootstrapTable('selectPage', 1);
        };
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.makeupExaminationList = {};
            angular.element('#makeupExaminationListManageTable').bootstrapTable('refresh');
        };

        /*
         *修改
        */
        $scope.update = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/score/maintainManager/scoreInfoMaintain/update.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return row;
                    }
                },
                controller: updateController
            });
        }

        /*
         *修改
         */
        $scope.updateStatus = function(row){
            score_scoreInfoMaintainService.update(row, function (error, message) {
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#makeupExaminationListManageTable').bootstrapTable('refresh');
                // alertService('success', '修改成功');
            });
        }
    }
    score_scoreInfoMaintainController.$inject = ['baseinfo_generalService', '$compile', '$scope', '$uibModal', '$rootScope', '$window', 'score_scoreInfoMaintainService', 'alertService', 'app'];



    //更正控制器
    var updateController = function ($scope, $uibModalInstance, item, score_scoreInfoMaintainService, alertService) {
        $scope.scoreInfoMaintain = item;
        $scope.scoreInfoMaintain.usualScore = parseFloat(item.usualScore);
        $scope.scoreInfoMaintain.examScore = parseFloat(item.examScore);
        $scope.scoreInfoMaintain.totalScore = parseFloat(item.totalScore);
        $scope.scoreInfoMaintain.makeupScore = parseFloat(item.makeupScore);
        $scope.scoreInfoMaintain.cleanupScore = parseFloat(item.cleanupScore);

        $scope.scoreInfoMaintain.oldUsualScore = item.usualScore;
        $scope.scoreInfoMaintain.oldExamScore = item.examScore;
        $scope.scoreInfoMaintain.oldTotalScore = item.totalScore;
        $scope.scoreInfoMaintain.oldMakeupScore = item.makeupScore;
        $scope.scoreInfoMaintain.oldCleanupScore = item.cleanupScore;
        $scope.scoreInfoMaintain.type="1";
        if(item.examType=="1"){
            $scope.firstExamShow = false;
            $scope.makeupExamShow = true;
            $scope.cleanupExamShow = true;
            $scope.firstExamRequired = true;
            $scope.makeupExamRequired = false;
            $scope.cleanupExamRequired = false;
            item.scale = "平时成绩("+item.usualScoreScale*100+"%)：期末成绩("+item.examScoreScale*100+"%)"
            $scope.$watch('scoreInfoMaintain.usualScore', function(newVal){
                var usualScore = parseFloat(newVal);
                if (isNaN(usualScore)) {
                    return;
                }
                var examScore = parseFloat(item.examScore);
                item.totalScore = usualScore*item.usualScoreScale + examScore*item.examScoreScale;
            });
            $scope.$watch('scoreInfoMaintain.examScore', function(newVal){
                var examScore = parseFloat(newVal);
                if (isNaN(examScore)) {
                    return;
                }
                var usualScore = parseFloat(item.usualScore);
                item.totalScore = usualScore*item.usualScoreScale + examScore*item.examScoreScale;
            });
        }else if(item.examType=="2"){
            $scope.makeupExamShow = false;
            $scope.firstExamShow = true;
            $scope.cleanupExamShow = true;
            $scope.makeupExamRequired = true;
            $scope.firstExamRequired = false;
            $scope.cleanupExamRequired = false;
        }else if(item.examType=="3"){
            $scope.makeupExamShow = true;
            $scope.firstExamShow = true;
            $scope.cleanupExamShow = false;
            $scope.makeupExamRequired = false;
            $scope.firstExamRequired = false;
            $scope.cleanupExamRequired = true;
            item.roundNum = "第"+item.roundNum+"轮";
        }
        $scope.ok = function (form) {
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            score_scoreInfoMaintainService.update($scope.scoreInfoMaintain, function (error, message) {
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#makeupExaminationListManageTable').bootstrapTable('refresh');
                alertService('success', '修改成功');
            });
            $uibModalInstance.close();
        };
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    };
    updateController.$inject = ['$scope', '$uibModalInstance', 'item', 'score_scoreInfoMaintainService', 'alertService'];
})(window);
