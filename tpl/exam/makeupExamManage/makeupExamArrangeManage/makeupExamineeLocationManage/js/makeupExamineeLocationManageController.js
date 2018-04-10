/**
 * Created by test on 2017/6/27.
 */
;(function (window, undefined) {
    'use strict';
    //考试时间管理Controller
    window.makeupExam_examineeLocationManageController = function($scope, $filter, baseinfo_generalService, app, $uibModal, $compile, $window, $rootScope, makeupExam_examineeLocationManageService, alertService) {


        //学年学期
        baseinfo_generalService.findAcadyeartermNamesBox(function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.semesterObjs = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.id as plateObj.acadYearSemester  for plateObj in semesterObjs" '
                +  ' ng-model="examineeLocationManage.semesterId" id="semesterId" name="semesterId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#semesterId").parent().empty().append(html);
            $compile(angular.element("#semesterId").parent().contents())($scope);
        });

        // 表格的高度
        $scope.table_height = $window.innerHeight - 262;
        console.log($window);

        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder,
                examType:"2"
            };
            return angular.extend(pageParam, $scope.examineeLocationManage);
        };

        $scope.examineeLocationTable = {
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
                $compile(angular.element('#examineeLocationTable').contents())($scope);
            },
            responseHandler:function(response){
                return response.data;
            },
            columns: [
                {checkbox: true,width: "3%"},
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
                {field:"location",title:"考试地点",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        if(value == '' || value == null){
                            return "-";
                        }
                        var names = "";
                        angular.forEach(value, function(data, index, array){
                            names += data.classRoomNum + "、";
                        });
                        if (names.length > 0) {
                            names = names.substring(0, names.length - 1);
                        }
                        return names;
                    }},
                {field:"cz",title:"操作",align:"center",valign:"middle",width: "10%",
                    formatter : function (value, row, index) {
                        var btn = "<button id='btn_datetime' type='button' ng-click='locationSet(" + JSON.stringify(row) + ")' class='btn btn-default'>维护学生考点</button>";
                        return btn;
                    }
                }
            ]
        };

        $scope.arrangeLocation = function () {
            var rows = angular.element('#examineeLocationTable').bootstrapTable('getSelections');
            if(rows.length == 0){
                alertService('请先选择要安排的考试班');
                return;
            }
            var ids = [];
            rows.forEach (function(row) {
                ids.push(row.id);
            });
            $rootScope.showLoading = true; // 开启加载提示
            makeupExam_examineeLocationManageService.locationArrange(ids,function (error, message,data) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else{
                    alertService('success', '安排成功');
                }
            });
        }
        $scope.examineeLocationManage={};
        // 开始日期参数配置
        $scope.ksrqOptions = {
            opened: false,
            open: function() {
                $scope.ksrqOptions.opened = true;
            },
            changed : function () {
                $scope.examineeLocationManage.startTime = $scope.examineeLocationManage.startDate;
            }
        };
        // 结束日期参数配置
        $scope.jsrqOptions = {
            opened: false,
            open: function() {
                $scope.jsrqOptions.opened = true;
            },
            changed : function () {
                $scope.examineeLocationManage.endTime = $scope.examineeLocationManage.endDate;
            }
        };
        // 结束日期小于开始日期时的提示
        $scope.jsrqTooltipEnableAndOpen = false;
        $scope.$watch('examineeLocationManage.endTime', function (newValue) {
            if ($scope.examineeLocationManage.startTime && newValue && (newValue < $scope.examineeLocationManage.startTime)) {
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
            angular.element('#examineeLocationTable').bootstrapTable('resetView',{ height: $scope.table_height } );
        };

        // 查询表单提交
        $scope.searchSubmit = function () {
            $scope.examineeLocationManage.startTime =  $filter("date")( $scope.examineeLocationManage.startTime, app.date.format);
            $scope.examineeLocationManage.endTime =  $filter("date")( $scope.examineeLocationManage.endTime, app.date.format);
            angular.element('#examineeLocationTable').bootstrapTable('selectPage', 1);
        };

        // 查询表单重置
        $scope.searchReset = function () {
            $scope.examineeLocationManage = {};
            angular.element('form[name="examineeLocationManageSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#examineeLocationTable').bootstrapTable('refresh');
        };

        //时间指定
        $scope.locationSet = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/exam/makeupExamManage/makeupExamArrangeManage/makeupExamineeLocationManage/locationSet.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return row;
                    }
                },
                controller: examineeLocationSetController
            });
        };
    }
    makeupExam_examineeLocationManageController.$inject = ['$scope', '$filter', 'baseinfo_generalService', 'app', '$uibModal', '$compile', '$window', '$rootScope', 'makeupExam_examineeLocationManageService', 'alertService'];

    //时间指定
    var examineeLocationSetController = function($scope, $uibModal, alertService, $uibModalInstance, item, makeupExam_examineeLocationManageService, $timeout, formVerifyService, $compile){
        $scope.classInfo = {};
        $scope.classInfo.id=item.id; //考试班id
        $scope.classInfo.name=item.name;
        $scope.classInfo.courseNum=item.courseNum;
        $scope.classInfo.courseName=item.courseName;
        $scope.classInfo.dept=item.dept;
        // $scope.classInfo.totalHour=item.totalHour;
        $scope.classInfo.credit=item.credit;
        $scope.classInfo.studentCount=item.studentCount;
        $scope.classInfo.location=item.location;

        //全局的考试地点id
        $scope.examLocationId = "";
        //全局安排考生数
        $scope.arrangeStudent = "";
        // 考生下拉框
        $scope.student = {};
        $scope.classSelected = [];
        function initStudent() {
            console.log($scope.classSelected);
            var html = '' +
                '<select ui-select2 ui-options="teachingTaskOptions"'
                + ' ng-model="classSelected" id="student" ui-jq="multiSelect" '
                + ' class="form-control" multiple> '
                + '<option ng-repeat="option in student.availableOptions" '
                + 'value="{{option.id}}">{{option.studentNum}}  {{option.studentName}}  {{option.sex}}</option> '
                + '</select>';
            angular.element("#student").parent().empty().append(html);
            $compile(angular.element("#student").parent().contents())($scope);
        }

        // makeupExam_examineeLocationManageService.getStudent(item.id,function (error, message,data) {
        //     $scope.student.availableOptions = data.data.rows;
        //     initStudent();
        // });

        //教学班设置
        $scope.teachingTaskOptions = {
            selectableHeader : "<div class='custom-header'>未选考生</div>",
            selectionHeader : "<div class='custom-header'>已选考生</div>",
            selectableFooter: "<div class='custom-header' id='selectable-footer' style='padding-top: 0;'><button class='btn btn-primary' ng-click='selectableFooterClick()' style='width: 100%;height: 100%;color: #555;background: #fff;border: 1px #fff solid;'>全选</button></div>",
            selectionFooter: "<div class='custom-header' id='selection-footer' style='padding-top: 0;'><button class='btn btn-default' ng-click='selectionFooterClick()' style='width: 100%;height: 100%;color: #555!important;background: #fff!important;border: 1px #fff solid!important;'>取消全选</button></div>",
            afterInit: function (container) {
                $compile(container.find('.custom-header').contents())($scope);
            }
        };
        $scope.teachingTask=[];
        $scope.selectableFooterClick = function () {
            $timeout(function () {
                angular.element('#student').multiSelect('select_all');
            }, 200);
        };

        $scope.selectionFooterClick = function () {
            $timeout(function () {
                angular.element('#student').multiSelect('deselect_all');
            }, 200);
        };
        $scope.cancel= function(){
            $uibModalInstance.close();
        }
        $scope.cancel= function(){
            $uibModalInstance.close();
        }

        $scope.select = function (a) {
            var examClassId = a.examClassId;
            angular.element('.selectBtn').removeClass("btn btn-default primary");
            angular.element('.selectBtn').addClass("btn btn-default");
            angular.element('#'+examClassId+'').removeClass("btn btn-default primary");
            angular.element('#'+examClassId+'').addClass("btn btn-primary");
            //examClassId 考试地点id
            //$scope.classInfo.id 考试班id
            $scope.examLocationId = examClassId; //记住考试地点id
            $scope.student = {};
            $scope.classSelected = [];
            makeupExam_examineeLocationManageService.getUnArrangeStudent(examClassId,$scope.classInfo.id,function (error, message,data) {
                $scope.student.availableOptions = data.data;
                angular.forEach($scope.student.availableOptions, function(data, index, array){
                    if(data.examClassId == examClassId){
                        $scope.classSelected.push(data.id);
                    }
                });
                var html = '' +
                    '<select ui-select2 ui-options="teachingTaskOptions"'
                    + ' ng-model="classSelected" id="student" ui-jq="multiSelect" '
                    + ' class="form-control" multiple> '
                    + '<option ng-repeat="option in student.availableOptions" '
                    + 'value="{{option.id}}">{{option.studentNum}}  {{option.studentName}}  {{option.sex}}</option> '
                    + '</select>';
                angular.element("#student").parent().empty().append(html);
                $compile(angular.element("#student").parent().contents())($scope);
            });

        }
        $scope.ok = function (form) {
            if($scope.examLocationId == ""){
                alertService("请选择具体考试地点安排考生");
                return;
            }
            var data = {
                examClassId : $scope.classInfo.id,
                examLocationId : $scope.examLocationId,
                studentIds : $scope.classSelected,
                arrangeStudent: $scope.arrangeStudent,
                selectedStudent : $scope.classSelected.length
            }
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/exam/makeupExamManage/makeupExamArrangeManage/makeupExamineeLocationManage/confirm.html',
                size: '',
                resolve: {
                    data: function () {
                        return data;
                    },
                },
                controller: openConfoirmController
            });

        };

        $scope.student.availableOptions = {};
        initStudent();

        $scope.$on('ngRepeatFinished', function () {
            //下面是在table render完成后执行的js
            $scope.select($scope.classInfo.location[0]);
        });
    }
    examineeLocationSetController.$inject = ['$scope', '$uibModal', 'alertService', '$uibModalInstance', 'item', 'makeupExam_examineeLocationManageService', '$timeout', 'formVerifyService', '$compile'];

    //确认制器
    var openConfoirmController = function ($rootScope, $scope, $uibModalInstance, data, makeupExam_examineeLocationManageService, alertService) {
        $scope.message = "计划安排"+data.arrangeStudent+"人,已选择"+data.selectedStudent+"人,确定继续执行？";
        $scope.ok = function () {
            $rootScope.showLoading = true; // 开启加载提示
            makeupExam_examineeLocationManageService.examineeLocation(data,function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else{
                    alertService('success', '保存成功');
                    $uibModalInstance.close();
                }
            });
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openConfoirmController.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'data', 'makeupExam_examineeLocationManageService', 'alertService'];


})(window);
