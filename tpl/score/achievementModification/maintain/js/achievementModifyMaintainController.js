/**
 * Created by test on 2017/6/27.
 */
;(function (window, undefined) {
    'use strict';
    //考试课程维护Controller
    window.score_achievementMaintainController = function($compile, $scope, $uibModal, $rootScope, $window, score_achievementMaintainService, alertService) {

        // 表格的高度
        $scope.table_height = $window.innerHeight - 292;

        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder
            };
            return angular.extend(pageParam, $scope.examQualification);
        }

        $scope.examinationPaperNumberManageTable = {
            url: 'data_test/exam/tableview_examinationPaperNumberManage.json',
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
            onLoadSuccess: function() {
                $compile(angular.element('#examinationPaperNumberManageTable').contents())($scope);
            },
            columns: [
                {checkbox: true,width: "3%"},
                {field:"semesterId",title:"学年学期",align:"center",valign:"middle"},
                {field:"studentId",title:"学号",align:"center",valign:"middle"},
                {field:"studentName",title:"姓名",align:"center",valign:"middle"},
                {field:"courseNum",title:"课程编号",align:"center",valign:"middle"},
                {field:"courseName",title:"课程名称",align:"center",valign:"middle"},
                {field:"departmentId",title:"开课单位",align:"center",valign:"middle"},
                {field:"credit",title:"学分",align:"center",valign:"middle"},
                {field:"fj",title:"附件",align:"center",valign:"middle"},
                {field:"reason",title:"原因",align:"center",valign:"middle"},
                {field:"cz",title:"操作",align:"center",valign:"middle",width: "10%",
                    formatter : function (value, row, index) {
                        return "<button id='btn_delete'  type='button' ng-click='deleteOne(" + JSON.stringify(row) + ")' class='btn btn-default'>删除</button>";
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
            angular.element('#examinationPaperNumberManageTable').bootstrapTable('resetView',{ height: $scope.table_height } );
        };
        
        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#examinationPaperNumberManageTable').bootstrapTable('selectPage', 1);
        };
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.examQualification = {};
            angular.element('#examinationPaperNumberManageTable').bootstrapTable('refresh');
        };

        // 打开编号设置面板
        $scope.add = function(){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/score/achievementModification/maintain/add.html',
                size: 'lg',
                resolve: {
                },
                controller: addController
            });
        };

        $scope.deleteOne = function(data){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/score/achievementModification/maintain/delete.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return data;
                    },
                },
                controller: deleteOneController
            });
        };

        // 打开编号设置面板
        $scope.delete = function(){
            var rows = angular.element('#examinationPaperNumberManageTable').bootstrapTable('getSelections');
            if(rows.length == 0){
                alertService('请先选择要设置的项');
                return;
            }

            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/score/achievementModification/maintain/delete.html',
                size: 'lg',
                resolve: {
                    items: function () {
                        return rows;
                    },
                },
                controller: examinationPaperNumberSetController
            });
        };
    }
    score_achievementMaintainController.$inject = ['$compile', '$scope', '$uibModal', '$rootScope', '$window', 'score_achievementMaintainService', 'alertService'];

    // 删除控制器
    var deleteOneController = function ($scope, $uibModalInstance, item, score_achievementMaintainService) {
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {
            var ids = []; // 培养方案编制控制编号集合
            // score_achievementMaintainService.delete(id);
            $uibModalInstance.close();
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    deleteOneController.$inject = ['$scope', '$uibModalInstance', 'item', 'score_achievementMaintainService'];

    var addController = function ($scope, $uibModalInstance, score_achievementMaintainService, formVerifyService) {
        // $scope.invigilationTeachers = {
        //     gh : "",    //工号
        //     xm : "",    //姓名
        //     xb : "",    //性别
        //     sfzh : "",  //身份证号
        //     ssdw : "",  //所属单位
        //     lxfs : "",  //联系方式
        //     sfky : "",  //是否可用
        //     yhkh : ""   //银行卡号
        // }
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
            exam_invigilationTeachersManageService.add($scope.invigilationTeachers);
            console.log("invigilationTeachers  :  "+$scope.invigilationTeachers);
            $uibModalInstance.close();
        };

    }
    addController.$inject = ['$scope', '$uibModalInstance', 'score_achievementMaintainService', 'formVerifyService'];

    //编号设置控制器
    var examinationPaperNumberSetController = function ($timeout, $scope, $uibModalInstance, $compile, items, score_achievementMaintainService, formVerifyService) {
        
        $scope.message = "确定要删除吗？";
        $scope.ok = function (form) {
            // var sjbh = $scope.sjbh;
            // var ids = [];
            // angular.forEach(numArray , function(items){
            //     ids.push(obj.id);
            // });
            // 处理前验证
            // if(form.$invalid) {
            //     // 调用共用服务验证（效果：验证不通过的输入框会变红色）
            //     formVerifyService(form);
            //     return;
            // };
            //score_achievementMaintainService.delete(ids,sjbh);
            $uibModalInstance.close();
        };
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    };
    examinationPaperNumberSetController.$inject = ['$timeout', '$scope', '$uibModalInstance', '$compile', 'items', 'score_achievementMaintainService', 'formVerifyService'];

})(window);
