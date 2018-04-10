/**
 * Created by test on 2017/6/27.
 */
;(function (window, undefined) {
    'use strict';
    //考试课程维护Controller
    window.exam_paperNumberManageController = function($scope, $uibModal, $rootScope, $window, exam_paperNumberManageService, alertService) {

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
            columns: [
                {checkbox: true,width: "3%"},
                {field:"xnxq",title:"学年学期",align:"center",valign:"middle"},
                {field:"sjbh",title:"试卷编号",align:"center",valign:"middle"},
                {field:"kcdm",title:"课程代码",align:"center",valign:"middle"},
                {field:"kcmc",title:"课程名称",align:"center",valign:"middle"},
                {field:"kkdw",title:"开课单位",align:"center",valign:"middle"},
                {field:"xf",title:"学分",align:"center",valign:"middle"},
                {field:"xs",title:"学时",align:"center",valign:"middle"},
                {field:"jxbmc",title:"教学班名称",align:"center",valign:"middle"},
                {field:"skrs",title:"上课人数",align:"center",valign:"middle"},
                {field:"ksfs",title:"考试方式",align:"center",valign:"middle"},
                {field:"rkjs",title:"任课教师",align:"center",valign:"middle"}

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
        $scope.numberSet = function(){
            var rows = angular.element('#examinationPaperNumberManageTable').bootstrapTable('getSelections');
            if(rows.length == 0){
                alertService('请先选择要设置的项');
                return;
            }

            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/exam/finalExamManage/examPaperNumberManage/index_numberSet.html',
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
    exam_paperNumberManageController.$inject = ['$scope', '$uibModal', '$rootScope', '$window', 'exam_paperNumberManageService', 'alertService'];


    //编号设置控制器
    var examinationPaperNumberSetController = function ($timeout, $scope, $uibModalInstance, $compile, items, exam_paperNumberManageService, formVerifyService) {
        var numArray = [];

        $timeout(function () {
            items.forEach(function(data){
                var numObj = {};
                numObj.id = data.id;
                numObj.jxbmc = data.jxbmc;
                numArray.push(numObj);
                var spanHtml = "<span style='margin-left: 5px;margin-top: 5px;padding: 0px 3px;font-size: 12px;display: inline-block;" +
                    "background-color: #fefefe;box-sizing: border-box;line-height: normal;border: 1px solid #d0dee5;" +
                    "background-repeat: repeat;background-position: 0 center;line-height:23px;' " +
                    "data-enity-levelstr='0:style' id='"+ data.id +"'>"+ data.jxbmc +
                    "<button type='button' class='close' style='margin-left:5px;color: red' ng-click='remove("+ JSON.stringify(numObj) +")' aria-hidden='false'> ×  </button> </span>";
                // angular.element('#jxbDiv').empty().append(spanHtml);
                angular.element("#jxbDiv").append(spanHtml);
                $compile(angular.element("#jxbDiv").parent().contents())($scope);

            });
            // console.log(numArray);

            $scope.remove = function (array) {
                angular.element("#"+array.id).remove();
                angular.forEach(numArray , function(obj){
                    if(array.id == obj.id){
                        var index = numArray.indexOf(obj);
                        numArray.splice(index,1);
                        return;
                    }
                });
                // console.log(numArray);
            };


        }, 200);

        $scope.ok = function (form) {
            var sjbh = $scope.sjbh;
            var ids = [];
            angular.forEach(numArray , function(obj){
                ids.push(obj.id);
            });
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            exam_paperNumberManageService.update(ids,sjbh);
            $uibModalInstance.close();
            
        };
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    };
    examinationPaperNumberSetController.$inject = ['$timeout', '$scope', '$uibModalInstance', '$compile', 'items', 'exam_paperNumberManageService', 'formVerifyService'];
})(window);
