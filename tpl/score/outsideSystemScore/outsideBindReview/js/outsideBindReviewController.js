/**
 * Created by test on 2017/6/27.
 */
;(function (window, undefined) {
    'use strict';
    //考试课程维护Controller
    window.score_outsideBindReviewController = function(baseinfo_generalService, $compile, $scope, $uibModal, $rootScope, $window, score_outsideBindReviewService, alertService, app) {

        // 表格的高度
        $scope.table_height = $window.innerHeight - 242;

        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder
            };
            return angular.extend(pageParam, $scope.outsideBindReview);
        }
        baseinfo_generalService.findAcadyeartermNamesBox(function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.semesterObjs = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.id as plateObj.acadYearSemester  for plateObj in semesterObjs" '
                +  ' ng-model="outsideBindReview.semesterId" id="semesterId" name="semesterId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#semesterId").parent().empty().append(html);
            $compile(angular.element("#semesterId").parent().contents())($scope);
        });
        var myCount = 0;
        function mergeCells(data,fieldName,colspan,target){
            //声明一个map计算相同属性值在data对象出现的次数和
            var sortMap = {};
            for(var i = 0 ; i < data.length ; i++){
                for(var prop in data[i]){
                    if(prop == fieldName){
                        var key = data[i][prop]
                        if(key){
                            if(sortMap.hasOwnProperty(key)){
                                sortMap[key] = sortMap[key] * 1 + 1;
                            } else {
                                sortMap[key] = 1;
                            }
                            break;
                        }
                    }
                }
            }
            var index = 0;
            for(var prop in sortMap){
                var count = sortMap[prop] * 1;
                if(count>1){
                    myCount += count;
                    $(target).bootstrapTable('mergeCells',{index:index, field:fieldName, colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"checkbox", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"cz", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"semesterId", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"applyTime", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"auditStatus", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"cnCourseName", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"enCourseName", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"credit", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"totalHour", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"score", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"courseModual", colspan: colspan, rowspan:count});
                }
                index += count;
            }
        }

        function mergeCells2(data,fieldName,colspan,target){
            //声明一个map计算相同属性值在data对象出现的次数和
            var sortMap = {};
            for(var i = 0 ; i < data.length ; i++){
                for(var prop in data[i]){
                    if(prop == fieldName){
                        var key = data[i][prop]
                        if(key){
                            if(sortMap.hasOwnProperty(key)){
                                sortMap[key] = sortMap[key] * 1 + 1;
                            } else {
                                sortMap[key] = 1;
                            }
                            break;
                        }
                    }
                }
            }

            var index = 0;
            for(var prop in sortMap){
                var count = sortMap[prop] * 1;
                if(count>1){
                    $(target).bootstrapTable('mergeCells',{index:index, field:fieldName, colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"checkbox", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"cz", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"semesterId", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"applyTime", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"decidCourseNum", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"auditStatus", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"osysCnCourseName", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"osysEnCourseName", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"osysCourseModular", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"osysCourseCredit", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"osysCourseTotalHour", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"osysCourseScore", colspan: colspan, rowspan:count});
                }else{

                }
                index += count;
            }
        }
        $scope.outsideBindReviewManageTable = {
            onLoadSuccess: function() {
                $compile(angular.element('#outsideBindReviewManageTable').contents())($scope);
                //合并单元格
                var data = $('#outsideBindReviewManageTable').bootstrapTable('getData', true);
                // mergeCells(data, "id", 1, $('#outsideBindReviewManageTable'));
                // mergeCells(data, "studentScoreId", 1, $('#outsideBindReviewManageTable'));
                mergeCells(data, "studentScoreId", 1, $('#outsideBindReviewManageTable'));
                if(myCount){
                    mergeCells2(data, "outSysScoreId", 1, $('#outsideBindReviewManageTable'));
                }
                // if(mark){
                // }else{
                //     mergeCells(data, "semesterId", 1, $('#outsideBindReviewManageTable'));
                //     mergeCells(data, "applyTime", 1, $('#outsideBindReviewManageTable'));
                //     mergeCells(data, "osysCnCourseName", 1, $('#outsideBindReviewManageTable'));
                //     mergeCells(data, "osysEnCourseName", 1, $('#outsideBindReviewManageTable'));
                //     mergeCells(data, "osysCourseModular", 1, $('#outsideBindReviewManageTable'));
                //     mergeCells(data, "osysCourseCredit", 1, $('#outsideBindReviewManageTable'));
                //     mergeCells(data, "osysCourseTotalHour", 1, $('#outsideBindReviewManageTable'));
                //     mergeCells(data, "osysCourseScore", 1, $('#outsideBindReviewManageTable'));
                //     mergeCells(data, "decidCourseNum", 1, $('#outsideBindReviewManageTable'));
                //     mergeCells(data, "auditStatus", 1, $('#outsideBindReviewManageTable'));
                //     $('#outsideBindReviewManageTable').bootstrapTable('mergeCells',{index:0, field:'checkbox', colspan: 1, rowspan:myCount});
                //     $('#outsideBindReviewManageTable').bootstrapTable('mergeCells',{index:0, field:'cz', colspan: 1, rowspan:myCount});
                // }

            },
            //url: 'data_test/exam/tableview_makeupExaminationListManage.json',
            url:app.api.address + '/score/outSysScoreReview/queryScoreBinding',
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
            responseHandler:function(response){
                return response.data;
            },
            columns: [
               {field:"checkbox", checkbox: true, width: "5%"},
                {field:"id", title:"",visible:false},
                {field:"outSysScoreId", title:"",visible:false},
                {field:"studentScoreId", title:"",visible:false},
                {field:"semesterId", title:"学年学期",align:"center",valign:"middle"},
                {field:"applyTime", title:"申请时间",align:"center",valign:"middle"},
                {field:"cnCourseName", title:"中文课程名称",align:"center",valign:"middle"},
                {field:"enCourseName", title:"英文课程名称",align:"center",valign:"middle"},
                {field:"courseModual",title:"课程模块",align:"center",valign:"middle"},
                {field:"credit",title:"学分",align:"center",valign:"middle"},
                {field:"totalHour",title:"学时",align:"center",valign:"middle"},
                {field:"score",title:"成绩",align:"center",valign:"middle"},
                {field:"osysCnCourseName",title:"系统外中文课程名称",align:"center",valign:"middle"},
                {field:"osysEnCourseName",title:"系统外英文课程名称",align:"center",valign:"middle"},
                {field:"osysCourseModular",title:"系统外课程模块",align:"center",valign:"middle"},
                {field:"osysCourseCredit",title:"系统外课程学分",align:"center",valign:"middle"},
                {field:"osysCourseTotalHour",title:"系统外课程学时",align:"center",valign:"middle"},
                {field:"osysCourseScore",title:"系统外课程成绩",align:"center",valign:"middle"},
                {field:"decidCourseNum",title:"认定课程数",align:"center",valign:"middle"},
                {field:"auditStatus",title:"审核状态",align:"center",valign:"middle"},
                {field:"cz",title:"操作",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        var adjust =  "<button id='btn_update' type='button' ng-click='adjust(" + JSON.stringify(row) + ")'  class='btn btn-default btn-sm''>审批</button>";
                        var adjustOut =  "<button id='btn_update' type='button' ng-click='adjustOut(" + JSON.stringify(row) + ")'  class='btn btn-default btn-sm''>审批</button>"
                        var data = $('#outsideBindReviewManageTable').bootstrapTable('getData', true);
                        if(data[index+1]){
                            if(data[index].studentScoreId = data[index+1].studentScoreId){
                                return   adjust;
                            }else{
                                return adjustOut;
                            }
                        }else{
                            return   adjust;
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
                $scope.table_height = $scope.table_height + 155;
            } else {
                $scope.table_height = $scope.table_height - 155;
            }
            angular.element('#outsideBindReviewManageTable').bootstrapTable('resetView',{ height: $scope.table_height } );
        };

        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#outsideBindReviewManageTable').bootstrapTable('selectPage', 1);
        };
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.makeupExaminationList = {};
            angular.element('form[name="curriculaSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#outsideBindReviewManageTable').bootstrapTable('refresh');
        };

        // 打开生成补考任务
        $scope.produced = function(){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/exam/makeupExamManage/makeupExamListManage/producedExamClass.html',
                size: 'lg',
                controller: producedExamClassController
            });
        };

        /*
         *批量审批
        */
        $scope.review = function(){
            var rows = angular.element('#outsideBindReviewManageTable').bootstrapTable('getSelections');
            if(rows.length == 0){
                    alertService('请先选择需要审批的记录');
                    return;
                }
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/score/outsideSystemScore/outsideBindReview/opinion.html',
                resolve: {
                    items: function () {
                        return rows;
                    }
                },
                controller: opinionController
            });
        }
        /*
         *审批
        */
        $scope.adjust = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/score/outsideSystemScore/outsideBindReview/review.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return row;
                    }
                },
                controller: adjustController
            });
        }

        /*
         *审批
         */
        $scope.adjustOut = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/score/outsideSystemScore/outsideBindReview/reviewOut.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return row;
                    }
                },
                controller: adjustOutController
            });
        }
    }
    score_outsideBindReviewController.$inject = ['baseinfo_generalService', '$compile', '$scope', '$uibModal', '$rootScope', '$window', 'score_outsideBindReviewService', 'alertService', 'app'];


    //生成补考任务控制器
    var producedExamClassController = function ($scope, $uibModalInstance, score_outsideBindReviewService, formVerifyService) {
        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            score_outsideBindReviewService.add($scope.invigilationTeachers);
            $uibModalInstance.close();
        };
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    };
    producedExamClassController.$inject = ['$scope', '$uibModalInstance', 'score_outsideBindReviewService', 'formVerifyService'];

    //审批意见
    var opinionController = function ($scope, $uibModalInstance, items, score_outsideBindReviewService, formVerifyService ,alertService) {
        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            var processInstanceIds = [];
            items.forEach(function (data) {
                processInstanceIds.push(data.processExempleId);
            })
            score_outsideBindReviewService.review($scope.opinion,processInstanceIds, function (error, message) {
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#outsideBindReviewManageTable').bootstrapTable('refresh');
                $uibModalInstance.close();
                alertService('success', '保存成功');
            });
        };
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    };
    opinionController.$inject = ['$scope', '$uibModalInstance', 'items', 'score_outsideBindReviewService', 'formVerifyService', 'alertService'];

    //录入控制器
    // var enterController = function ($scope, $uibModalInstance, item, score_outsideBindReviewService) {
    //     $scope.student = item;
    //     $scope.outsideBindReviewListTable = {
    //         url: 'data_test/exam/tableview_studentList.json',
    //         method: 'get',
    //         cache: false,
    //         height: 300,
    //         //toolbar:"#toolbar",
    //         sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
    //         striped: true,
    //         pagination: true,
    //         pageSize: 10,
    //         pageNumber:1,
    //         pageList: [5, 10, 20, 50],
    //         search: false,
    //         showColumns: false,
    //         showRefresh: false,
    //         clickToSelect: true,
    //         columns: [
    //             {field:"semesterId",title:"学年学期",align:"center",valign:"middle"},
    //             {field:"cnCourseName",title:"中文课程名称",align:"center",valign:"middle"},
    //             {field:"enCourseName",title:"英文课程名称",align:"center",valign:"middle"},
    //             {field:"courseModular",title:"课程模块",align:"center",valign:"middle"},
    //             {field:"credit",title:"学分",align:"center",valign:"middle"},
    //             {field:"totalHour",title:"学时",align:"center",valign:"middle"},
    //             {field:"courseProperty",title:"课程性质",align:"center",valign:"middle"},
    //             // {field:"scoreType",title:"成绩类别",align:"center",valign:"middle"},
    //             {field:"score",title:"成绩",align:"center",valign:"middle"}
    //         ]
    //     }
    //     $scope.ok = function () {
    //         $uibModalInstance.close();
    //     };
    //     $scope.cancel = function () {
    //         $uibModalInstance.close();
    //     };
    // };
    // enterController.$inject = ['$scope', '$uibModalInstance', 'item', 'score_outsideBindReviewService'];
    // //更正控制器
    var adjustController = function ($uibModal,$scope, $uibModalInstance, item, score_outsideBindReviewService, app) {
        $scope.student = item;
        $scope.student.outSysBindingId =item.id;

        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder
            };
            return angular.extend(pageParam, $scope.student);
        }
        $scope.outsideBindReviewListTable = {
            //url: 'data_test/exam/tableview_studentList.json',
            url:app.api.address + '/score/outSysScoreApply/queryOutSysCourseInfoByBindId',
            method: 'get',
            cache: false,
            height: 300,
            // toolbar:"#toolbar",
            // sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParams,//传递参数（*）
            striped: true,
            // pagination: false,
            // pageSize: 10,
            // pageNumber:1,
            // pageList: [5, 10, 20, 50],
            search: false,
            showColumns: false,
            showRefresh: false,
            responseHandler:function(response){
                return response.data;
            },
            columns: [
                {field:"semesterId",title:"学年学期",align:"center",valign:"middle"},
                {field:"cnCourseName",title:"中文课程名称",align:"center",valign:"middle"},
                {field:"enCourseName",title:"英文课程名称",align:"center",valign:"middle"},
                {field:"courseModule",title:"课程模块",align:"center",valign:"middle"},
                {field:"credit",title:"学分",align:"center",valign:"middle"},
                {field:"totalHour",title:"学时",align:"center",valign:"middle"},
                {field:"courseProperty",title:"课程性质",align:"center",valign:"middle"},
               //{field:"scoreType",title:"成绩类别",align:"center",valign:"middle"},
                {field:"score",title:"成绩",align:"center",valign:"middle"}
            ]
        }
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
        var items = [];
        items.push(item);
        $scope.review = function(){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/score/outsideSystemScore/outsideBindReview/opinion.html',
                resolve: {
                    items: function () {
                        return items;
                    }
                },
                controller: opinionController
            });
            $uibModalInstance.close();
        }

    };
    adjustController.$inject = ['$uibModal','$scope', '$uibModalInstance', 'item', 'score_outsideBindReviewService', 'app'];

    var adjustOutController = function ($uibModal,$scope, $uibModalInstance, item, score_outsideBindReviewService, app) {
        $scope.outsideBindReview = item;
        $scope.outsideBindReview.outSysBindingId = item.id;
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder
            };
            return angular.extend(pageParam, $scope.outsideBindReview);
        }
        $scope.outsideBindReviewListTable = {
            //url: 'data_test/exam/tableview_studentList.json',
            url:app.api.address + '/score/outSysScoreApply/queryCourseInfoByBindId',
            method: 'get',
            cache: false,
            height: 300,
            //toolbar:"#toolbar",
            // sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParams,//传递参数（*）
            striped: true,
            // pagination: true,
            // pageSize: 10,
            // pageNumber:1,
            // pageList: [5, 10, 20, 50],
            search: false,
            showColumns: false,
            showRefresh: false,
            responseHandler:function(response){
                return response.data;
            },
            columns: [
                {field:"semesterId",title:"学年学期",align:"center",valign:"middle"},
                {field:"cnCourseName",title:"中文课程名称",align:"center",valign:"middle"},
                {field:"enCourseName",title:"英文课程名称",align:"center",valign:"middle"},
                {field:"courseModule",title:"课程模块",align:"center",valign:"middle"},
                {field:"credit",title:"学分",align:"center",valign:"middle"},
                {field:"totalHour",title:"学时",align:"center",valign:"middle"},
                {field:"courseProperty",title:"课程性质",align:"center",valign:"middle"},
                //{field:"scoreType",title:"成绩类别",align:"center",valign:"middle"},
                {field:"score",title:"成绩",align:"center",valign:"middle"}
            ]
        }
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
        var items = [];
        items.push(item);
        $scope.review = function(){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/score/outsideSystemScore/outsideReview/opinion.html',
                resolve: {
                    item: function () {
                        return items;
                    }
                },
                controller: opinionController
            });
        }

    };
    adjustOutController.$inject = ['$uibModal','$scope', '$uibModalInstance', 'item', 'score_outsideBindReviewService','app'];
})(window);
