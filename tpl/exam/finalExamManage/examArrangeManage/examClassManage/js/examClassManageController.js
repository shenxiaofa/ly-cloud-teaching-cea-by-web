/**
 * Created by test on 2017/6/27.
 */
;(function (window, undefined) {
    'use strict';
    //考试课程维护Controller
    window.exam_classManageController = function($scope, baseinfo_generalService, app, $uibModal, $compile, $window, $rootScope, exam_classManageService, alertService) {
        
		// 表格的高度
        $scope.table_heightLeft = $window.innerHeight - 254;
        $scope.table_heightRight = $window.innerHeight - 254;
        $scope.examClassManageLeft = {};
		// 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder,
                examType:"1"
            };
            return angular.extend(pageParam, $scope.examClassManageLeft);
        };

        //考试班创建table
        $scope.examClassCreateTable = {
            //url: 'data_test/exam/tableview_examClassManageTable.json',
            url:app.api.address + '/exam/formalArrange/findFormalTask',
            method: 'get',
            cache: false,
            height: $scope.table_heightLeft,
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
				$compile(angular.element('#examClassCreateTable').contents())($scope);
			},
            responseHandler:function(response){
                return response.data;
            },
            columns: [
                {field:"semester",title:"学年学期",align:"center",valign:"middle"},
                {field:"courseNum",title:"课程编号",align:"center",valign:"middle"},
                {field:"courseNanme",title:"课程名称",align:"center",valign:"middle"},
                {field:"dept",title:"开课单位",align:"center",valign:"middle"},
                {field:"credit",title:"学分",align:"center",valign:"middle"},
                {field:"totalHour",title:"学时",align:"center",valign:"middle"},
                {field:"classCount",title:"总教学班数",align:"center",valign:"middle"},
                {field:"notArrangeCount",title:"未安排数",align:"center",valign:"middle"},
                {field:"cz",title:"操作",align:"center",valign:"middle",width: "10%",
                    formatter : function (value, row, index) {
                        return "<button id='btn_create' type='button' ng-click='createExamClass(" + JSON.stringify(row) + ")' class='btn btn-default'>创建考试班</button>";
                    }
                }
            ],
        };

        /**
         * 点击考试班创建
         */
        $scope.leftClickAlready = function() {
			angular.element('#examClassCreateTable').bootstrapTable('selectPage', 1);
        };
        
        // 查询表单显示和隐藏切换
        $scope.isHideSearchForm1 = false; // 默认显示
        $scope.searchFormHideToggle1 = function () {
            $scope.isHideSearchForm1 = !$scope.isHideSearchForm1
            if ($scope.isHideSearchForm1) {
                $scope.table_heightLeft = $scope.table_heightLeft + 115;
            } else {
                $scope.table_heightLeft = $scope.table_heightLeft - 115;
            }
            angular.element('#examClassCreateTable').bootstrapTable('resetView',{ height: $scope.table_heightLeft } );
        };
        
        // 查询表单提交
        $scope.searchSubmitLeft = function () {
            angular.element('#examClassCreateTable').bootstrapTable('selectPage', 1);
        }; 
        
        // 查询表单重置
        $scope.searchResetLeft = function () {
            $scope.examClassManageLeft = {};
            angular.element('#examClassCreateTable').bootstrapTable('refresh');
        };

        //创建考试班
        $scope.createExamClass = function(row){

            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/exam/finalExamManage/examArrangeManage/examClassManage/createExamClass.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return row;
                    }
                },
                controller: createExamClassController
            });
        };


        //学年学期
        baseinfo_generalService.findAcadyeartermNamesBox(function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.semesterObjs = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.id as plateObj.acadYearSemester  for plateObj in semesterObjs" '
                +  ' ng-model="examClassManageRight.semesterId" id="semesterId" name="semesterId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#semesterId").parent().empty().append(html);
            $compile(angular.element("#semesterId").parent().contents())($scope);
        });

        $scope.examClassManageRight = {};
        // 查询参数
        $scope.queryParamsRight = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder,
                examType:"1"
            };
            return angular.extend(pageParam, $scope.examClassManageRight);
        };

        //考试班维护table
        $scope.examClassMaintainTable = {
            //url: 'data_test/exam/tableview_examClassMaintainTable.json',
            url:app.api.address + '/exam/formalArrange/findFormalExamClass',
            method: 'get',
            cache: false,
            height: $scope.table_heightRight,
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
            queryParams: $scope.queryParamsRight,//传递参数（*）
            showColumns: true,
            showRefresh: true,
            clickToSelect: true,
			onLoadSuccess: function() {
				$compile(angular.element('#examClassMaintainTable').contents())($scope);
			},
            responseHandler:function(response){
                return response.data;
            },
            columns: [
                {field:"semester",title:"学年学期",align:"center",valign:"middle"},
                {field:"id",title:"考试班编号",align:"center",valign:"middle"},
                {field:"name",title:"考试班名称",align:"center",valign:"middle"},
                {field:"courseNum",title:"课程编号",align:"center",valign:"middle"},
                {field:"courseNanme",title:"课程名称",align:"center",valign:"middle"},
                {field:"dept",title:"开课单位",align:"center",valign:"middle"},
                {field:"credit",title:"学分",align:"center",valign:"middle"},
                {field:"totalHour",title:"学时",align:"center",valign:"middle"},
                {field:"classCount",title:"教学班数",align:"center",valign:"middle"},
                {field:"cz",title:"操作",align:"center",valign:"middle",width: "18%",
                    formatter : function (value, row, index) {
                        var btncreate = "<button id='btn_maintain' type='button' ng-click='maintainExamClass(" + JSON.stringify(row) + ")' class='btn btn-default'>维护考试班</button>";
                        var btndelete = "<button id='btn_createExamClass' type='button' ng-click='deleteExamClass(" + JSON.stringify(row) + ")' class='btn btn-default'>删除考试班</button>";
                        return btncreate+btndelete;

                    }
                }
            ],
        };

        /**
         * 点击考试班维护
         */
        $scope.rightClickAlready = function() {
			angular.element('#examClassMaintainTable').bootstrapTable('selectPage', 1);
        };
        
        // 查询表单显示和隐藏切换
        $scope.isHideSearchForm2 = false; // 默认显示
        $scope.searchFormHideToggle2 = function () {
            $scope.isHideSearchForm2 = !$scope.isHideSearchForm2
            if ($scope.isHideSearchForm2) {
                $scope.table_heightRight = $scope.table_heightRight + 115;
            } else {
                $scope.table_heightRight = $scope.table_heightRight - 115;
            }
            angular.element('#examClassMaintainTable').bootstrapTable('resetView',{ height: $scope.table_heightRight } );
        };
        
        // 查询表单提交
        $scope.searchSubmitRight = function () {
            angular.element('#examClassMaintainTable').bootstrapTable('selectPage', 1);
        }; 
        
        // 查询表单重置
        $scope.searchResetRight = function () {
            $scope.examClassManageRight = {};
            angular.element('form[name="examClassManageSearchFormRight"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#examClassMaintainTable').bootstrapTable('refresh');
        };

        //维护考试班
        $scope.maintainExamClass = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/exam/finalExamManage/examArrangeManage/examClassManage/maintainExamClass.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return row;
                    }
                },
                controller: maintainExamClassController
            });
        };

        //删除考试班
        $scope.deleteExamClass = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/exam/finalExamManage/examArrangeManage/examClassManage/deleteExamClass.html',
                size: '',
                resolve: {
                    item: function () {
                        return row;
                    }
                },
                controller: deleteExamClassController
            });
        };
        
    }
    exam_classManageController.$inject = ['$scope', 'baseinfo_generalService', 'app', '$uibModal', '$compile', '$window', '$rootScope', 'exam_classManageService', 'alertService'];

    //创建考试班
    var createExamClassController = function($scope, $rootScope, alertService, $compile, $timeout, $uibModalInstance, item, exam_classManageService, formVerifyService){
        $scope.info = {};
        $scope.info.courseNum=item.courseNum;
        $scope.info.courseNanme=item.courseNanme;
        $scope.info.dept=item.dept;
        $scope.info.totalHour=item.totalHour;
        $scope.info.credit=item.credit;
        $scope.info.id=item.id;
        $scope.examTeachingTask ={};
        // exam_classManageService.getTeachingClass(item.id,function (error, message,data) {
        //     //$rootScope.showLoading = false; // 关闭加载提示
        //
        //     $scope.classInfo =  data.data;
        //
        // });

        exam_classManageService.getSerialNumber(item.id,function (error, message,data) {
                $scope.examTeachingTask.id = (data.data)[0].examClassNum;
                $scope.examTeachingTask.name = (data.data)[0].examClassName;
            }

        )

        // 教学班下拉框
        $scope.classInfo = {};
        $scope.classSelected = [];
        exam_classManageService.getTeachingClass(item.id,"",function (error, message,data) {
            $scope.classInfo.availableOptions = data.data;
            var html = '' +
                '<select ui-select2 ui-options="teachingTaskOptions"'
                +  ' ng-model="classSelected" id="classInfo" ui-jq="multiSelect" '
                +  ' ui-options="classInfoOptions" class="form-control" multiple> '
                +  '<option ng-repeat="option in classInfo.availableOptions" '
                +  'value="{{option.id}}">{{option.className}}({{option.studentCount}}人)</option> '
                +  '</select>';
            angular.element("#classInfo").parent().empty().append(html);
            $compile(angular.element("#classInfo").parent().contents())($scope);
        });

        //教学班设置
        $scope.teachingTaskOptions = {
            selectableHeader : "<div class='custom-header'>未选教学班</div>",
            selectionHeader : "<div class='custom-header'>已选教学班</div>",
            selectableFooter: "<div class='custom-header' id='selectable-footer' style='padding-top: 0;'><button class='btn btn-primary' ng-click='selectableFooterClick()' style='width: 100%;height: 100%;color: #555;background: #fff;border: 1px #fff solid;'>全选</button></div>",
            selectionFooter: "<div class='custom-header' id='selection-footer' style='padding-top: 0;'><button class='btn btn-default' ng-click='selectionFooterClick()' style='width: 100%;height: 100%;color: #555!important;background: #fff!important;border: 1px #fff solid!important;'>取消全选</button></div>",
            afterInit: function (container) {
                $compile(container.find('.custom-header').contents())($scope);
            }
        };
        $scope.teachingTask=[];
        $scope.selectableFooterClick = function () {
            $timeout(function () {
                angular.element('#classInfo').multiSelect('select_all');
            }, 200);
        };

        $scope.selectionFooterClick = function () {
            $timeout(function () {
                angular.element('#classInfo').multiSelect('deselect_all');
            }, 200);
        };
        $scope.cancel= function(){
            $uibModalInstance.close();
        }
        $scope.ok = function (form) {
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            if($scope.classSelected == null || $scope.classSelected == "" || $scope.classSelected.length == 0){
                alertService("请选择教学班");
                return;
            }
            var data= {
                taskId:item.id,
                id : $scope.examTeachingTask.id,
                name : $scope.examTeachingTask.name,
                teachingClassId : $scope.classSelected
                }
            $rootScope.showLoading = true; // 开启加载提示
            exam_classManageService.add(data,function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else{
                    alertService('success', '创建考试班成功');
                    angular.element('#examClassCreateTable').bootstrapTable('refresh');
                    angular.element('#examClassMaintainTable').bootstrapTable('refresh');
                    $uibModalInstance.close();
                }

            });
            $uibModalInstance.close();
        };
    }
    createExamClassController.$inject = ['$scope', '$rootScope', 'alertService', '$compile', '$timeout', '$uibModalInstance', 'item', 'exam_classManageService', 'formVerifyService'];

    //维护考试班
    var maintainExamClassController = function($scope, $rootScope, formVerifyService, alertService, $compile, $timeout, $uibModalInstance, item, exam_classManageService){
        $scope.examClass = {};
        $scope.examClass.id=item.id; //考试班id
        $scope.examClass.name=item.name;
        $scope.examClass.courseNum=item.courseNum;
        $scope.examClass.courseNanme=item.courseNanme;
        $scope.examClass.dept=item.dept;
        $scope.examClass.totalHour=item.totalHour;
        $scope.examClass.credit=item.credit;


        // 教学班下拉框
        $scope.classInfo = {};
        $scope.classSelected = [];
        exam_classManageService.getTeachingClass(item.formalId,item.id,function (error, message,data) {
            $scope.classInfo.availableOptions = data.data;
            angular.forEach($scope.classInfo.availableOptions, function(data, index, array){
                if(data.examClassId != "" && data.examClassId != null){
                    $scope.classSelected.push(data.id);
                }
            });
            var html = '' +
                '<select ui-select2 ui-options="teachingTaskOptions"'
                +  ' ng-model="classSelected" id="classInfo" ui-jq="multiSelect" '
                +  ' ui-options="classInfoOptions" class="form-control" multiple> '
                +  '<option ng-repeat="option in classInfo.availableOptions" '
                +  'value="{{option.id}}">{{option.className}}({{option.studentCount}}人)</option> '
                +  '</select>';
            angular.element("#classInfo").parent().empty().append(html);
            $compile(angular.element("#classInfo").parent().contents())($scope);
        });


        //教学班设置
        $scope.teachingTaskOptions = {
            selectableHeader : "<div class='custom-header'>未选教学班</div>",
            selectionHeader : "<div class='custom-header'>已选教学班</div>",
            selectableFooter: "<div class='custom-header' id='selectable-footer' style='padding-top: 0;'><button class='btn btn-primary' ng-click='selectableFooterClick()' style='width: 100%;height: 100%;color: #555;background: #fff;border: 1px #fff solid;'>全选</button></div>",
            selectionFooter: "<div class='custom-header' id='selection-footer' style='padding-top: 0;'><button class='btn btn-default' ng-click='selectionFooterClick()' style='width: 100%;height: 100%;color: #555!important;background: #fff!important;border: 1px #fff solid!important;'>取消全选</button></div>",
            afterInit: function (container) {
                $compile(container.find('.custom-header').contents())($scope);
            }
        };
        $scope.teachingTask=[];
        $scope.selectableFooterClick = function () {
            $timeout(function () {
                angular.element('#classInfo').multiSelect('select_all');
            }, 200);
        };

        $scope.selectionFooterClick = function () {
            $timeout(function () {
                angular.element('#classInfo').multiSelect('deselect_all');
            }, 200);
        };
        $scope.cancel= function(){
            $uibModalInstance.close();
        }

        $scope.cancel= function(){
            $uibModalInstance.close();
        }
        $scope.ok = function (form) {
            if($scope.classSelected == null || $scope.classSelected == "" || $scope.classSelected.length == 0){
                alertService("请选择教学班");
                return;
            }
            var data= {
                id : item.id,
                teachingClassId : $scope.classSelected
            }
            $rootScope.showLoading = true; // 加载提示
            exam_classManageService.maintainExamClass(data,function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else{
                    alertService('success', '修改成功');
                    angular.element('#examClassMaintainTable').bootstrapTable('refresh');
                    $uibModalInstance.close();
                }

            });
            $uibModalInstance.close();
        };
    }
    maintainExamClassController.$inject = ['$scope', '$rootScope', 'formVerifyService', 'alertService', '$compile', '$timeout', '$uibModalInstance', 'item', 'exam_classManageService'];

    //删除考试班
    var deleteExamClassController = function($scope, $rootScope, alertService, $uibModalInstance, item, exam_classManageService){
        console.log(item.ksbbh);
        $scope.message = "确定要删除吗？";
        $scope.cancel= function(){
            $uibModalInstance.close();
        }
        $scope.ok = function () {
            $rootScope.showLoading = true; // 加载提示
            exam_classManageService.delete(item.id,function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else{
                    alertService('success', '删除成功');
                    angular.element('#examClassMaintainTable').bootstrapTable('refresh');
                    angular.element('#examClassCreateTable').bootstrapTable('refresh');
                    $uibModalInstance.close();
                }

            });
            $uibModalInstance.close();
        };
    }
    deleteExamClassController.$inject = ['$scope', '$rootScope', 'alertService', '$uibModalInstance', 'item', 'exam_classManageService'];
})(window);
