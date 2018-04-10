/**
 * Created by test on 2017/6/27.
 */
;(function (window, undefined) {
    'use strict';
    //考试时间管理Controller
    window.exam_recordManageController = function($scope,app, $filter, baseinfo_generalService, $uibModal, $window, $compile, $rootScope, exam_recordManageService, alertService) {
        //学年学期
        baseinfo_generalService.findAcadyeartermNamesBox(function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.semesterObjs = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.id as plateObj.acadYearSemester  for plateObj in semesterObjs" '
                +  ' ng-model="examRecordManage.semesterId" id="semesterId" name="semesterId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#semesterId").parent().empty().append(html);
            $compile(angular.element("#semesterId").parent().contents())($scope);
        });
		// 表格的高度
        $scope.table_height = $window.innerHeight - 264;
        
		// 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder,
                examType:"1"
            };
            return angular.extend(pageParam, $scope.examRecordManage);
        };

        $scope.examRecordTable = {
            url:app.api.address + '/exam/formalManage/findExamLocationInfo',
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
            idField : "kcbh", // 指定主键列
            uniqueId: "kcbh", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParams,//传递参数（*）
            showColumns: true,
            showRefresh: true,
            clickToSelect: true,
			onLoadSuccess: function() {
				$compile(angular.element('#examRecordTable').contents())($scope);
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
            {field:"locationName",title:"考试地点",align:"center",valign:"middle"},
                {field:"cz",title:"操作",align:"center",valign:"middle",width: "10%",
                    formatter : function (value, row, index) {
                        var btn = "<button id='btn_teacherSet' type='button' ng-click='examSituationManage(" + JSON.stringify(row) + ")' class='btn btn-default'>考场情况维护</button>";
                        return btn;

                    }
                }
            ]
        };

        $scope.examRecordManage={};
        // 开始日期参数配置
        $scope.ksrqOptions = {
            opened: false,
            open: function() {
                $scope.ksrqOptions.opened = true;
            },
            changed : function () {
                $scope.examRecordManage.startTime = $scope.examRecordManage.startDate;
            }
        };
        // 结束日期参数配置
        $scope.jsrqOptions = {
            opened: false,
            open: function() {
                $scope.jsrqOptions.opened = true;
            },
            changed : function () {
                $scope.examRecordManage.endTime = $scope.examRecordManage.endDate;
            }
        };
        // 结束日期小于开始日期时的提示
        $scope.jsrqTooltipEnableAndOpen = false;
        $scope.$watch('examRecordManage.endTime', function (newValue) {
            if ($scope.examRecordManage.startTime && newValue && (newValue < $scope.examRecordManage.startTime)) {
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
            angular.element('#examRecordTable').bootstrapTable('resetView',{ height: $scope.table_height } );
        };


        // 查询表单提交
        $scope.searchSubmit = function () {
            $scope.examRecordManage.startTime =  $filter("date")( $scope.examRecordManage.startTime, app.date.format);
            $scope.examRecordManage.endTime =  $filter("date")( $scope.examRecordManage.endTime, app.date.format);
            angular.element('#examRecordTable').bootstrapTable('selectPage', 1);
        }; 
        
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.examRecordManage = {};
            angular.element('form[name="examRecordManageSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#examRecordTable').bootstrapTable('refresh');
        };
        
        //时间指定
        $scope.examSituationManage = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/exam/finalExamManage/examArrangeManage/examRecordManage/examSituationManage.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return row;
                    }
                },
                controller: examSituationManageController
            });
        }
    }
    exam_recordManageController.$inject = ['$scope', 'app', '$filter', 'baseinfo_generalService', '$uibModal', '$window', '$compile', '$rootScope', 'exam_recordManageService', 'alertService'];

    //时间指定
    var examSituationManageController = function($scope, $rootScope, baseinfo_generalService, alertService, app, $uibModalInstance, $compile, item, exam_recordManageService){
        $scope.classInfo = {};
        $scope.classInfo.locationName=item.locationName;
        $scope.classInfo.courseNum=item.courseNum;
        $scope.classInfo.courseName=item.courseName;
        $scope.classInfo.dept=item.dept;
        $scope.classInfo.credit=item.credit;
        $scope.classInfo.studentCount=item.studentCount;
        $scope.classInfo.teacherCount=item.teacherCount;

        //考试标记
        baseinfo_generalService.findcodedataNames({datableNumber: "BJDM"},function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.mark = data.data;
            // var html = '' +
            //     '<select ui-select2 ng-options="plateObj.dataNumber as plateObj.dataName  for plateObj in examWay" '
            //     +  ' ng-model="makeupExaminationList.examWay" id="examWay" name="examWay" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
            //     +  '<option value="">==请选择==</option> '
            //     +  '</select>';
            // angular.element("#examWay").parent().empty().append(html);
            // $compile(angular.element("#examWay").parent().contents())($scope);
        });

        $scope.examSituationManageTable = {
            url:app.api.address + '/exam/formalManage/examRecordInfo?classId='+item.id+'&locationId='+item.locationId,
            method: 'get',
            cache: false,
            height: 357,
            // toolbar: '#toolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: false,
            pagination: false,
            pageSize: 10,
            pageNumber:1,
            pageList: [5, 10, 20, 50],
            search: false,
            showColumns: false,
            showRefresh: false,
            clickToSelect: true,
			onLoadSuccess: function() {
				$compile(angular.element('#examSituationManageTable').contents())($scope);
			},
            responseHandler:function(response){
                var data = {
                    rows :response.data,
                    total : response.data.length
                }
                return data;
            },
            columns: [
                {field:"studentNum",title:"学号",align:"center",valign:"middle"},
                {field:"studentName",title:"姓名",align:"center",valign:"middle"},
                {field:"sex",title:"性别",align:"center",valign:"middle"},
                {field:"dept",title:"院系",align:"center",valign:"middle"},
                {field:"major",title:"专业",align:"center",valign:"middle"},
                {field:"grade",title:"年级",align:"center",valign:"middle"},
                {field:"mark",title:"标记",align:"center",valign:"middle",width: "15%",
                    formatter : function (value, row, index) {

                        $scope.$watch('mark', function(newVal){
                            var html = '' +
                                '<select ui-select2 ng-options="plateObj.dataNumber as plateObj.dataName  for plateObj in mark" '
                                +  '  ng-model='+"mark"+row.studentNum+' id='+"mark"+row.studentNum+' name="mark" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                                +  '<option value="">==请选择==</option> '
                                +  '</select>';
                            angular.element("#mark"+row.studentNum).parent().empty().append(html);
                            $compile(angular.element("#mark"+row.studentNum).parent().contents())($scope);
                        });
                        $scope["mark"+row.studentNum] = value;
                        //var selectHtml = '<select name="examWay" id='+"examWay"+row.id+'  ng-model='+"examWay"+row.id+' class="col-xs-8 form-control mark"> <option value="">==请选择==</option> </select>'
                        var html = '' +
                            '<select ui-select2 ng-options="plateObj.dataNumber as plateObj.dataName  for plateObj in mark" '
                            +  ' ng-model='+"mark"+row.studentNum+' id='+"mark"+row.studentNum+' name="mark" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control examWay"> '
                            +  '<option value="">==请选择==</option> '
                            +  '</select>';
                        return html;
                        //$scope["mark"+row.studentNum] = value;
                        // var selectHtml = '<select name="mark"  ng-model='+"mark"+row.studentNum+' class="col-xs-8 form-control mark"> <option value="">==请选择==</option> <option value="1">缺考</option><option value="2">作弊</option></select>';
                        // return selectHtml;


                    }
                }
            ]
        }

        $scope.cancel= function(){
            $uibModalInstance.close();
        }
        $scope.ok = function () {
            //obj.examWay =  $scope['examWay'+obj.id];
            var data = angular.element('#examSituationManageTable').bootstrapTable('getData');
            var mark = angular.element('#examSituationManageTable select[name="mark"]');
            var params = [];
            for (var i=0; i<data.length; i++) {
                params[i] = {};
                params[i].studentId = data[i].id;
                //params[i].mark = mark.eq(i).val();
                params[i].mark = $scope['mark'+data[i].studentNum];
                //params[i].status = "2"; //提交
            }
            $rootScope.showLoading = true; // 加载提示
            exam_recordManageService.mark(params,function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else{
                    alertService('success', '保存成功');
                    $uibModalInstance.close();
                }

            });
            $uibModalInstance.close();
        }
    }
    examSituationManageController.$inject = ['$scope', '$rootScope', 'baseinfo_generalService', 'alertService', 'app', '$uibModalInstance', '$compile', 'item', 'exam_recordManageService'];
})(window);
