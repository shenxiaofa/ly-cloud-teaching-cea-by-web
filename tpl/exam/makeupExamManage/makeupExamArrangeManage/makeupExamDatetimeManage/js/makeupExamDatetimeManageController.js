/**
 * Created by test on 2017/6/27.
 */
;(function (window, undefined) {
    'use strict';
    //考试时间管理Controller
    window.makeupExam_datetimeManageController = function($scope, $filter, app, baseinfo_generalService, $uibModal, $compile, $window, $rootScope, makeupExam_datetimeManageService, alertService) {

        //学年学期
        baseinfo_generalService.findAcadyeartermNamesBox(function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.semesterObjs = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.id as plateObj.acadYearSemester  for plateObj in semesterObjs" '
                +  ' ng-model="examDatetimeManage.semesterId" id="semesterId" name="semesterId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#semesterId").parent().empty().append(html);
            $compile(angular.element("#semesterId").parent().contents())($scope);
        });

        $scope.examDatetimeManage={};
        // 表格的高度
        $scope.table_height = $window.innerHeight - 254;

        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder,
                examType:"2"
            };
            return angular.extend(pageParam, $scope.examDatetimeManage);
        };

        $scope.examDatetimeTable = {
            url:app.api.address + '/exam/formalManage/findExamClassInfo',
            method: 'get',
            cache: false,
            height: $scope.table_height,
            toolbar: '#toolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [5, 10, 20, 50],
            search: false,
            sortOrder: 'desc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField : "ksbbh", // 指定主键列
            uniqueId: "ksbbh", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParams,//传递参数（*）
            showColumns: true,
            showRefresh: true,
            clickToSelect: true,
            onLoadSuccess: function() {
                $compile(angular.element('#examDatetimeTable').contents())($scope);
            },
            responseHandler:function(response){
                return response.data;
            },
            columns: [
                {field:"semester",title:"学年学期",align:"center",valign:"middle"},
                {field:"id",title:"考试班编号",align:"center",valign:"middle"},
                {field:"name",title:"考试班名称",align:"center",valign:"middle"},
                {field:"courseNum",title:"课程编号",align:"center",valign:"middle"},
                {field:"courseName",title:"课程名称",align:"center",valign:"middle"},
                {field:"dept",title:"开课单位",align:"center",valign:"middle"},
                {field:"credit",title:"学分",align:"center",valign:"middle"},
                {field:"totalHour",title:"学时",align:"center",valign:"middle"},
                {field:"studentCount",title:"考生数",align:"center",valign:"middle"},
                {field:"startTime",title:"考试开始时间",align:"center",valign:"middle"},
                {field:"endTime",title:"考试结束时间",align:"center",valign:"middle"},
                // {field:"location",title:"考试地点",align:"center",valign:"middle",
                //     formatter : function (value, row, index) {
                //         if(value == '' || value == null){
                //             return "-";
                //         }
                //         var names = "";
                //         angular.forEach(value, function(data, index, array){
                //             names += data.classRoomNum + "、";
                //         });
                //         if (names.length > 0) {
                //             names = names.substring(0, names.length - 1);
                //         }
                //         return names;
                //     }},
                {field:"cz",title:"操作",align:"center",valign:"middle",width: "10%",
                    formatter : function (value, row, index) {
                        var btn = "<button id='btn_datetime' type='button' ng-click='datetimeSet(" + JSON.stringify(row) + ")' class='btn btn-default'>时间指定</button>";
                        return btn;
                    }
                }
            ]
        };

        // 开始日期参数配置
        $scope.ksrqOptions = {
            opened: false,
            open: function() {
                $scope.ksrqOptions.opened = true;
            },
            changed : function () {
                $scope.examDatetimeManage.startTime = $scope.examDatetimeManage.startDate;
            }
        };
        // 结束日期参数配置
        $scope.jsrqOptions = {
            opened: false,
            open: function() {
                $scope.jsrqOptions.opened = true;
            },
            changed : function () {
                $scope.examDatetimeManage.endTime = $scope.examDatetimeManage.endDate;
            }
        };
        // 结束日期小于开始日期时的提示
        $scope.jsrqTooltipEnableAndOpen = false;
        $scope.$watch('examDatetimeManage.endTime', function (newValue) {
            if ($scope.examDatetimeManage.startTime && newValue && (newValue < $scope.examDatetimeManage.startTime)) {
                $scope.jsrqTooltipEnableAndOpen = true;
                return;
            }
            $scope.jsrqTooltipEnableAndOpen = false;
        });

        // 查询表单显示和隐藏切换
        $scope.isHideSearchForm = false; // 默认显示
        $scope.searchFormHideToggle = function () {
            $scope.isHideSearchForm = !$scope.isHideSearchForm
            if ($scope.isHideSearchForm) {
                $scope.table_height = $scope.table_height + 155;
            } else {
                $scope.table_height = $scope.table_height - 155;
            }
            angular.element('#examDatetimeTable').bootstrapTable('resetView',{ height: $scope.table_height } );
        };

        // 查询表单提交
        $scope.searchSubmit = function () {
            $scope.examDatetimeManage.startTime =  $filter("date")( $scope.examDatetimeManage.startTime, app.date.format);
            $scope.examDatetimeManage.endTime =  $filter("date")( $scope.examDatetimeManage.endTime, app.date.format);
            angular.element('#examDatetimeTable').bootstrapTable('selectPage', 1);
        };

        // 查询表单重置
        $scope.searchReset = function () {
            $scope.examDatetimeManage = {};
            angular.element('form[name="examDatetimeManageSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#examDatetimeTable').bootstrapTable('refresh');
        };

        //时间指定
        $scope.datetimeSet = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/exam/makeupExamManage/makeupExamArrangeManage/makeupExamDatetimeManage/datetimeSet.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return row;
                    }
                },
                controller: datetimeSetController
            });
        }
    }
    makeupExam_datetimeManageController.$inject = ['$scope', '$filter', 'app', 'baseinfo_generalService', '$uibModal', '$compile', '$window', '$rootScope', 'makeupExam_datetimeManageService', 'alertService'];

    //时间指定
    var datetimeSetController = function($scope, $rootScope, app, $filter, alertService, $uibModalInstance, item, makeupExam_datetimeManageService, formVerifyService){
        $scope.examDatetimeManage={};
        $scope.examDatetimeManage.id=item.id;
        $scope.examDatetimeManage.name=item.name;
        $scope.examDatetimeManage.courseNum=item.courseNum;
        $scope.examDatetimeManage.courseName=item.courseName;
        $scope.examDatetimeManage.dept=item.dept;
        $scope.examDatetimeManage.totalHour=item.totalHour;
        $scope.examDatetimeManage.credit=item.credit;
        $scope.examDatetimeManage.studentCount=item.studentCount;
        $scope.examDatetimeManage.startTime=item.startTime;
        $scope.examDatetimeManage.endTime=item.endTime;
        if(item.startTime!=undefined){
            $scope.examDatetimeManage.startTime =new Date(item.startTime);
        }
        if(item.endTime!=undefined){
            $scope.examDatetimeManage.endTime =new Date(item.endTime);
        }


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
        $scope.$watch('examDatetimeManage.endTime', function (newValue) {
            if ($scope.examDatetimeManage.startTime && newValue && (newValue < $scope.examDatetimeManage.startTime)) {
                $scope.jsrqTooltipEnableAndOpen = true;
                return;
            }
            $scope.jsrqTooltipEnableAndOpen = false;
        });

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
            //转日期格式
            $scope.examDatetimeManage.startTime =  $filter("date")($scope.examDatetimeManage.startTime, app.date.format);
            $scope.examDatetimeManage.endTime =  $filter("date")($scope.examDatetimeManage.endTime, app.date.format);
            var data = {
                id: $scope.examDatetimeManage.id,
                startTime: $scope.examDatetimeManage.startTime,
                endTime : $scope.examDatetimeManage.endTime
            }
            $rootScope.showLoading = true; // 开启加载提示
            makeupExam_datetimeManageService.update(data,function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else{
                    alertService('success', '修改成功');
                    angular.element('#examDatetimeTable').bootstrapTable('refresh');
                    $uibModalInstance.close();
                }

            });
            $uibModalInstance.close();
        };
    }
    datetimeSetController.$inject = ['$scope', '$rootScope', 'app', '$filter', 'alertService', '$uibModalInstance', 'item', 'makeupExam_datetimeManageService', 'formVerifyService'];
})(window);
