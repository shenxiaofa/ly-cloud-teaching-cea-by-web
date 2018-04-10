/**
 * Created by test on 2017/6/27.
 */
;(function (window, undefined) {
    'use strict';
    //考试课程维护Controller
    window.score_achievementModifyApplyController = function($scope, $uibModal, $compile, $window, $rootScope, score_achievementModifyApplyService, alertService) {
        
		// 表格的高度
        $scope.table_heightLeft = $window.innerHeight - 285;
        $scope.table_heightRight = $window.innerHeight - 285;

		// 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder
            };
            return angular.extend(pageParam, $scope.examClassManageLeft);
        };

        //考试班创建table
        $scope.examClassCreateTable = {
            url: 'data_test/exam/tableview_examClassManageTable.json',
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
            columns: [
                {field:"semesterId",title:"学年学期",align:"center",valign:"middle"},
                {field:"courseNum",title:"课程编号",align:"center",valign:"middle"},
                {field:"courseName",title:"课程名称",align:"center",valign:"middle"},
                {field:"departmentName",title:"开课单位",align:"center",valign:"middle"},
                {field:"credit",title:"学分",align:"center",valign:"middle"},
                {field:"totalHour",title:"学时",align:"center",valign:"middle"},
                {field:"examStatus",title:"考试状态",align:"center",valign:"middle"},
                {field:"examWays",title:"考试方式",align:"center",valign:"middle"},
                {field:"cz",title:"操作",align:"center",valign:"middle",width: "10%",
                    formatter : function (value, row, index) {
                        return "<button id='btn_create' type='button' ng-click='createExamClass(" + JSON.stringify(row) + ")' class='btn btn-default'>我要办理</button>";
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
                templateUrl: 'tpl/score/achievementModification/apply/handle.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return row;
                    }
                },
                controller: createExamClassController
            });
        };

        // 查询参数
        $scope.queryParamsRight = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder
            };
            return angular.extend(pageParam, $scope.examClassManageRight);
        };

        //考试班维护table
        $scope.examClassMaintainTable = {
            url: 'data_test/exam/tableview_examClassMaintainTable.json',
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
            columns: [
                {field:"semesterId",title:"学年学期",align:"center",valign:"middle"},
                {field:"courseNum",title:"课程编号",align:"center",valign:"middle"},
                {field:"courseName",title:"课程名称",align:"center",valign:"middle"},
                {field:"departmentName",title:"开课单位",align:"center",valign:"middle"},
                {field:"credit",title:"学分",align:"center",valign:"middle"},
                {field:"applyTime",title:"申请时间",align:"center",valign:"middle"},
                {field:"approvalStatus",title:"审核状态",align:"center",valign:"middle",formatter:function(value, row, index)  {
                    if(value=='0'){
                        return '通过'
                    }else if(value=='1'){
                        return '不通过'
                    }else if(value=='2'){
                        return '待审核'
                    }else{
                        return value;
                    }
                }},
                {field:"cz",title:"操作",align:"center",valign:"middle",width: "18%",
                    formatter : function (value, row, index) {
                        var btncreate = "<button id='btn_maintain' type='button' ng-click='maintainExamClass(" + JSON.stringify(row) + ")' class='btn btn-default'>查看</button>";
                        return btncreate;

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
                templateUrl: 'tpl/score/achievementModification/apply/see.html',
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
    score_achievementModifyApplyController.$inject = ['$scope', '$uibModal', '$compile', '$window', '$rootScope', 'score_achievementModifyApplyService', 'alertService'];

    //创建考试班
    var createExamClassController = function($scope, $compile, $timeout, $uibModalInstance, item, score_achievementModifyApplyService, formVerifyService){
        $scope.kcbh=item.kcbh;
        $scope.kcmc=item.kcmc;
        $scope.kkdw=item.kkdw;
        $scope.xs=item.xs;
        $scope.xf=item.xf;
        //排课单位设置
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
                angular.element('#teachingTask').multiSelect('select_all');
            }, 200);
        };

        $scope.selectionFooterClick = function () {
            $timeout(function () {
                angular.element('#teachingTask').multiSelect('deselect_all');
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
            score_achievementModifyApplyService.add($scope.examTeachingTask,$scope.teachingTask);
            $uibModalInstance.close();
        };
    }
    createExamClassController.$inject = ['$scope', '$compile', '$timeout', '$uibModalInstance', 'item', 'score_achievementModifyApplyService', 'formVerifyService'];

    //维护考试班
    var maintainExamClassController = function($scope, $compile, $timeout, $uibModalInstance, item, score_achievementModifyApplyService){
        $scope.ksbbh=item.ksbbh;
        $scope.ksbmc=item.ksbmc;
        $scope.kcbh=item.kcbh;
        $scope.kcmc=item.kcmc;
        $scope.kkdw=item.kkdw;
        $scope.xs=item.xs;
        $scope.xf=item.xf;

        //排课单位设置
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
                angular.element('#teachingTask').multiSelect('select_all');
            }, 200);
        };

        $scope.selectionFooterClick = function () {
            $timeout(function () {
                angular.element('#teachingTask').multiSelect('deselect_all');
            }, 200);
        };
        $scope.cancel= function(){
            $uibModalInstance.close();
        }

        $scope.cancel= function(){
            $uibModalInstance.close();
        }
        $scope.ok = function (form) {
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            score_achievementModifyApplyService.update($scope.teachingTask);
            $uibModalInstance.close();
        };
    }
    maintainExamClassController.$inject = ['$scope', '$compile', '$timeout', '$uibModalInstance', 'item', 'score_achievementModifyApplyService'];

    //删除考试班
    var deleteExamClassController = function($scope, $uibModalInstance, item, score_achievementModifyApplyService){
        console.log(item.ksbbh);
        $scope.message = "确定要删除吗？";
        $scope.cancel= function(){
            $uibModalInstance.close();
        }
        $scope.ok = function () {
            $uibModalInstance.close();
        };
    }
    deleteExamClassController.$inject = ['$scope', '$uibModalInstance', 'item', 'score_achievementModifyApplyService'];
})(window);
