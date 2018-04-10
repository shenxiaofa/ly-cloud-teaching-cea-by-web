/**
 * Created by test on 2017/6/27.
 */
;(function (window, undefined) {
    'use strict';
    //考试课程维护Controller
    window.score_scoreReviewController = function(baseinfo_generalService, $compile, $scope, $uibModal, $rootScope, $window, score_scoreReviewServices, alertService, app) {

        // 表格的高度
        $scope.table_height = $window.innerHeight - 224;

        $scope.searchParam = {monitor:"monitor"}
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder
            };
            return angular.extend(pageParam, $scope.searchParam);
        }

        baseinfo_generalService.findAcadyeartermNamesBox(function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.semesterObjs = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.id as plateObj.acadYearSemester  for plateObj in semesterObjs" '
                +  ' ng-model="searchParam.semester_ID" id="semester" name="semester" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#semester").parent().empty().append(html);
            $compile(angular.element("#semester").parent().contents())($scope);
        });

        $scope.scoreReviewTable = {
            onLoadSuccess: function() {
                $compile(angular.element('#scoreReviewTable').contents())($scope);
            },
            //url: 'data_test/exam/tableview_makeupExaminationListManage.json',
            url:app.api.address + '/score/formalExamScore',
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
                {checkbox: true, width: "5%"},
                {field:"semester",title:"开课学期",align:"center",valign:"middle"},
                {field:"courseNum",title:"课程代码",align:"center",valign:"middle"},
                {field:"courseName",title:"课程名称",align:"center",valign:"middle"},
                {field:"department",title:"开课单位",align:"center",valign:"middle"},
                {field:"courseProperty",title:"课程属性",align:"center",valign:"middle"},
                {field:"credit",title:"学分",align:"center",valign:"middle"},
                {field:"className",title:"班级名称",align:"center",valign:"middle"},
                {field:"notInputCount",title:"未录入数/人数",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        return  row.notInputCount+ "/"+row.studentCount;
                    }},
                {field:"status",title:"操作状态",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        if("1"==value){return  "暂存";}
                        if("2"==value){return  "提交";}
                        if("3"==value){return  "退回";}
                        if(""==value||undefined==value){
                            return  "草稿";
                        }
                        return  "";
                    }},
                {field:"cz",title:"操作",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        var adjust =  "<button id='btn_update' type='button' ng-click='adjust(" + JSON.stringify(row) + ")'  class='btn btn-default btn-sm''>退回</button>";
                        var detail =  "<button id='btn_update' type='button' ng-click='detail(" + JSON.stringify(row) + ")'  class='btn btn-default btn-sm''>查看</button>";
                        if(row.status==undefined||row.status==""){
                            return   detail;
                        }else if(row.status=='3'||row.status=='1'){
                            return   detail;
                        }
                        return   adjust + "&nbsp;"+detail;;
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
            angular.element('#scoreReviewTable').bootstrapTable('resetView',{ height: $scope.table_height } );
        };

        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#scoreReviewTable').bootstrapTable('selectPage', 1);
        };
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.searchParam = {monitor:"monitor"};
            angular.element('form[name="pyfabzkz_form"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#scoreReviewTable').bootstrapTable('refresh');
        };

        /*
         *查看
         */
        $scope.detail = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/score/formalExamScore/scoreReview/detail.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return row;
                    }
                },
                controller: detailController
            });
        }

        /*
         *批量审批
        */
        $scope.review = function(row){
            var rows = angular.element('#scoreReviewTable').bootstrapTable('getSelections');
            if(rows.length == 0){
                alertService('请先选择要退回的项');
                return;
            }
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/score/formalExamScore/scoreReview/review.html',
                resolve: {
                    items: function () {
                        return rows;
                    }
                },
                controller: adjustController
            });
        }
        /*
         *审批
        */
        $scope.adjust = function(row){
            var rows = angular.element('#scoreReviewTable').bootstrapTable('getSelections');
            if(rows.length==0 && row==null){
                alertService('请先选择要退回的项');
                return;
            }
            if(row){
                rows.push(row);
            }
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/score/formalExamScore/scoreReview/review.html',
                size: 'lg',
                resolve: {
                    items: function () {
                        return rows;
                    }
                },
                controller: adjustController
            });
        }
    }
    score_scoreReviewController.$inject = ['baseinfo_generalService', '$compile', '$scope', '$uibModal', '$rootScope', '$window', 'score_scoreReviewServices', 'alertService', 'app'];


    var detailController = function ($scope, $uibModalInstance,app, item, score_formalScoreEnterService, alertService, uuid4, $rootScope, $filter) {
        $scope.item = item;
        $scope.teacherEnter = {
            url:app.api.address + '/score/formalExamScore/formalScoreList?list_ID='+item.cjlrrw_ID,
            //url: 'data_test/exam/tableview_studentList.json',
            method: 'get',
            cache: false,
            height: 357,
            //toolbar:"#toolbar",
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: false,
            pageSize: 10,
            pageNumber:1,
            pageList: [5, 10, 20, 50],
            search: false,
            showColumns: false,
            showRefresh: false,
            clickToSelect: true,
            responseHandler:function(response){
                var data = {
                    rows :response.data,
                    total : response.data.length
                }
                return data;
            },
            columns: [
                {field:"",title:"序号",align:"center",valign:"middle", width: "5%", formatter: function (value, row, index) {
                    return index+1;
                }},
                {field:"studentId",title:"学生学号",align:"center",valign:"middle"},
                {field:"studentName",title:"学生姓名",align:"center",valign:"middle"},
                {field:"className",title:"班级名称",align:"center",valign:"middle"},
                {field:"examScoreScale",title:"期末成绩比例",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        return value*100+"%";
                    }},
                {field:"usualScoreScale",title:"平时成绩比例",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        return value*100+"%";
                    }},
                {field:"examScore",title:"正考成绩",align:"center",valign:"middle"},
                {field:"usualScore",title:"平时成绩",align:"center",valign:"middle"},
                {field:"scoreCount",title:"总成绩",align:"center",valign:"middle"},
                {field:"scoreFlag",title:"成绩标记",align:"center",valign:"middle"},

                {field:"inputName",title:"录入人",align:"center",valign:"middle"},
                {field:"inputTime",title:"录入时间",align:"center",valign:"middle"}
            ]
        }
        // 导出
        $scope.openExport = function() {
            $scope.params = {
                list_ID: item.cjlrrw_ID,
                routeKey: uuid4.generate()
            }
            $scope.isNotAllowWindowClose = true; // 是否允许关闭窗口
            $rootScope.showLoading = true; // 开启加载提示
            // 导出数据
            score_formalScoreEnterService.exportData($scope.params, function (data) {

                var blob = new Blob([data], {type: "application/vnd.ms-excel"});
                var objectUrl = window.URL.createObjectURL(blob);
                var currentTime = $filter('date')(new Date(), 'yyyyMMddHHmmss');
                var aForExcel = angular.element('<a download="正考成绩单-导出数据-' + currentTime + app.excel.ext + '"><span class="forExcel">导出</span></a>').attr('href', objectUrl);
                angular.element('body').append(aForExcel);
                angular.element('.forExcel').click();
                aForExcel.remove();
                // 允许关闭
                $scope.isNotAllowWindowClose = false;
                $rootScope.showLoading = false; // 关闭加载提示
                $uibModalInstance.close();
            });
        }

        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    };
    detailController.$inject = ['$scope', '$uibModalInstance', 'app', 'item', 'score_formalScoreEnterService', 'alertService', 'uuid4', '$rootScope', '$filter'];

    //审批意见
    var opinionController = function ($scope, $uibModalInstance, score_scoreReviewServices, formVerifyService) {
        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            score_scoreReviewServices.add($scope.invigilationTeachers);
            $uibModalInstance.close();
        };
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    };
    opinionController.$inject = ['$scope', '$uibModalInstance', 'score_scoreReviewServices', 'formVerifyService'];

    //录入控制器
    var enterController = function ($scope, $uibModalInstance, item, score_scoreReviewServices) {
        $scope.item = item;
        $scope.studentListTable = {
            url: 'data_test/exam/tableview_studentList.json',
            method: 'get',
            cache: false,
            height: 357,
            //toolbar:"#toolbar",
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [5, 10, 20, 50],
            search: false,
            showColumns: false,
            showRefresh: false,
            clickToSelect: true,
            columns: [
                {field:"xh",title:"序号",align:"center",valign:"middle"},
                {field:"xh",title:"学生学号",align:"center",valign:"middle"},
                {field:"xm",title:"学生姓名",align:"center",valign:"middle"},
                {field:"xb",title:"班级名称",align:"center",valign:"middle"},
                {field:"yx",title:"平时成绩",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                    return "<input type='text' size='3'  class='form-control'/>"
                }},
                {field:"zy",title:"正考成绩",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        return "<input type='text' size='3'  class='form-control'/>"
                    }},
                {field:"nj",title:"总成绩",align:"center",valign:"middle"},
                {field:"bj",title:"成绩标记",align:"center",valign:"middle"},
                {field:"zkcj",title:"录入人",align:"center",valign:"middle"},
                {field:"biaoj",title:"修改时间",align:"center",valign:"middle"}
            ]
        }
        $scope.ok = function () {
            $uibModalInstance.close();
        };
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    };
    enterController.$inject = ['$scope', '$uibModalInstance', 'item', 'score_scoreReviewServices'];
    //退回控制器
    var adjustController = function ($uibModal,$scope, $uibModalInstance, items, score_scoreReviewServices, alertService) {
        $scope.message = "确定要退回吗？ ";
        var params = [];
        var obj = {};
        items.forEach (function(data) {
            obj.cjlrrw_id = data.cjlrrw_ID;
            obj.status = '3';
            obj.semesterId = data.semesterId;
            obj.courseNum = data.courseNum;
            params.push(obj);
        });
        $scope.ok = function () {
            score_scoreReviewServices.update(params, function (error, message) {
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#scoreReviewTable').bootstrapTable('refresh');
                alertService('success', '退回成功');
            });
            $uibModalInstance.close();
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };

    };
    adjustController.$inject = ['$uibModal','$scope', '$uibModalInstance', 'items', 'score_scoreReviewServices', 'alertService'];
})(window);
