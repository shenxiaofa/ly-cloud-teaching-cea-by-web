;(function (window, undefined) {
    'use strict';

    window.scheme_majorCurriculaReviewController = function ($compile, $scope, $uibModal, $rootScope, $window, scheme_majorCurriculaReviewService, alertService, app) {
        // 表格的高度
        $scope.win_height = $window.innerHeight;
        $scope.table_height = $scope.win_height - 223;
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var attributeNamesForOrderBy = {};
            attributeNamesForOrderBy[params.sortName] = params.sortOrder;
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                attributeNamesForOrderBy: attributeNamesForOrderBy
            };
            $rootScope.$log.debug(angular.extend(pageParam, $scope.reviewInfo));
            return angular.extend(pageParam, $scope.reviewInfo);
        }
        $scope.majorCoursePlanReviewTable = {
            //url: 'data_test/scheme/tableview_majorCoursePlanReview.json',
            url:app.api.address + '/scheme/majorScheme/reviewInfo',
            method: 'get',
            cache: false,
            height: $scope.table_height,
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [10, 20, 30],
            search: false,
            showColumns: true,
            showRefresh: true,
            queryParams: $scope.queryParams,//传递参数（*）
            responseHandler:function(response){
                return response.data;
            },
            onLoadSuccess: function() {
                $compile(angular.element('#majorCoursePlanReviewTable').contents())($scope);
            },
            clickToSelect: false,
            columns: [
                {checkbox: true,width: "5%"},
                {field:"campusName",title:"所属校区",align:"center",valign:"middle"},
                {field:"grade",title:"年级",align:"center",valign:"middle"},
                {field:"deptName",title:"所属单位",align:"center",valign:"middle"},
                {field:"majorName",title:"专业名称",align:"center",valign:"middle"},
                {field:"majorCode",title:"专业代码",align:"center",valign:"middle"},
                {field:"educationLevel_ID",title:"学生类别",align:"center",valign:"middle"},
                {field:"instanceCount",title:"实例数",align:"center",valign:"middle"},
                {field:"cz",title:"操作",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        var reviewBtn = "<button id='btn_fzrsz' has-permission='majorCurriculaReview:review' type='button' ng-click='review(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>进入审核</button>";
                        return reviewBtn;
                    }
                }
            ]
        };

        $scope.reviewInfo = {
            campusNumber : "",
            grade : "",
            majorCode : "",
            educationLevel_ID : "",
            reviewStatus : ""
        }
        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#majorCoursePlanReviewTable').bootstrapTable('selectPage', 1);
           // angular.element('#majorCoursePlanReviewTable').bootstrapTable('refresh');
        }
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.reviewInfo = {};
            // 重新初始化下拉框
            angular.element('form[name="codeCategorySearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#majorCoursePlanReviewTable').bootstrapTable('refresh');
        }
        // 查询表单显示和隐藏切换
        $scope.isHideSearchForm = false; // 默认显示
        $scope.searchFormHideToggle = function () {
            $scope.isHideSearchForm = !$scope.isHideSearchForm
            if ($scope.isHideSearchForm) {
                $scope.table_height = $scope.table_height + 115;
            } else {
                $scope.table_height = $scope.table_height - 115;
            }
            angular.element('#majorCoursePlanReviewTable').bootstrapTable('resetView',{ height: $scope.table_height } );
        }

        //校区下拉框数据
        $scope.campus = [];
        scheme_majorCurriculaReviewService.getCampus(function (error,message,data) {
            $scope.campus = data.data;
            var html = '' +
                '<select ui-select2  ui-chosen="codeCategorySearchForm.campusNumber"  '
                +  ' ng-model="reviewInfo.campusNumber" id="campusNumber" name="campusNumber" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option ng-repeat="a in campus" value="{{a.campusNumber}}">{{a.campusName}}</option> '
                +  '</select>';
            angular.element("#campusNumber").parent().empty().append(html);
            $compile(angular.element("#campusNumber").parent().contents())($scope);
        });
        //学生类别下拉框数据
        $scope.studentCategory = [];
        scheme_majorCurriculaReviewService.getSelected('XSLBDM', function (error,message,data) {
            $scope.studentCategory = data.data;
            var html = '' +
                '<select ui-select2  ui-chosen="codeCategorySearchForm.educationLevel_ID" '
                +  ' ng-model="reviewInfo.educationLevel_ID" id="educationLevel_ID" name="educationLevel_ID" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option ng-repeat="a in studentCategory" value="{{a.dataNumber}}">{{a.dataName}}</option> '
                +  '</select>';
            angular.element("#educationLevel_ID").parent().empty().append(html);
            $compile(angular.element("#educationLevel_ID").parent().contents())($scope);
        });

        // 打开审核面板
        $scope.review = function(data){
            var modal =  $uibModal.open({
                    animation: true,
                    backdrop: 'static',
                    templateUrl: 'tpl/scheme/majorCurriculaReview/review.html',
                    size: 'lg',
                    resolve: {
                        item: function () {
                            return data;
                        }
                    },
                    controller: reviewController
                });
            };
    };
    scheme_majorCurriculaReviewController.$inject = ['$compile', '$scope', '$uibModal', '$rootScope', '$window', 'scheme_majorCurriculaReviewService', 'alertService', 'app'];

    var reviewController = function ($rootScope, $compile, $scope, $uibModal, $uibModalInstance, app, item, scheme_majorCurriculaReviewService, alertService) {
        //左边高度
        var tabHeight = angular.element('#majorCoursePlanReviewTable').css("height");
        var leftHeight = parseInt(tabHeight.substr(0,tabHeight.length-2))+220;
        console.log(leftHeight);
        $scope.leftList = {
            "height" : leftHeight
        }
        //左边单位菜单栏
        $scope.applyDept = [];
        //tab页标签
        $scope.modelInfo = [];
        $scope.majorCurriculaApply_ID = "";    //课程计划申请id
        $scope.MajorSchemeDemand_ID = "";       //专业方案要求id
        $scope.MajorSchemeDemand = {};
        $scope.remark = "";
        //审核结果
        $scope.result = "";
        //获取申请单位
        scheme_majorCurriculaReviewService.applyDept(item.major_ID,function (error,message,data) {
            data.forEach(function (value) {
                if(value.result == "0")
                    value.result = "不通过";
                if(value.result == "1")
                    value.result = "通过";
                if(value.result == "2")
                    value.result = "审核中";

            });
            $scope.btnShow = false;
            $scope.applyDept = data;
            $scope.majorCurriculaApply_ID = data[0].majorCurriculaApply_ID;
            $scope.result = data[0].result;
            if($scope.result == "审核中")
                $scope.btnShow = true;
            $scope.remark = data[0].remark;
            scheme_majorCurriculaReviewService.getTitle($scope.majorCurriculaApply_ID,function (error,message,data) {
                $scope.modelInfo = data;
                $scope.MajorSchemeDemand.majorSchemeDemand_ID = data[0].id;
                angular.element('#majorCoursePlanEnterReview').bootstrapTable('refresh');
                $scope.activeJustified = 0;
            });
        });

        $scope.deptClick = function (dept) {
            if($scope.result == "审核中"){
                $scope.btnShow = true;
            }else {
                $scope.btnShow = false;
            }

            $scope.majorCurriculaApply_ID = dept.majorCurriculaApply_ID;
            $scope.result = dept.result;
            $scope.remark = dept.remark;
            scheme_majorCurriculaReviewService.getTitle(dept.majorCurriculaApply_ID,function (error,message,data) {
                $scope.modelInfo = data;

                if(data.length === 0){
                    $scope.MajorSchemeDemand.majorSchemeDemand_ID = "";
                }else {
                    $scope.MajorSchemeDemand.majorSchemeDemand_ID = data[0].id;
                }
                angular.element('#majorCoursePlanEnterReview').bootstrapTable('refresh');
                $scope.activeJustified = 0;
            });
        }

        $scope.change = function (data) {
            $scope.MajorSchemeDemand.majorSchemeDemand_ID = data.id;
            angular.element('#majorCoursePlanEnterReview').bootstrapTable('refresh');
        }

        $scope.close = function () {
            $uibModalInstance.close();
        };
        $scope.queryParams = function queryParams() {
            return  $scope.MajorSchemeDemand;
        }
        $scope.majorCoursePlanEnterReview = {
            //url: 'data_test/scheme/tableview_majorCoursePlanEnterReview.json',
            url:app.api.address + '/scheme/majorCurricula/curriculaChange',
            method: 'get',
            cache: false,
            height: 280,
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: false,
            pageSize: 10,
            pageNumber:1,
            pageList: [10, 20, 30],
            search: false,
            queryParams: $scope.queryParams,
            responseHandler:function(response){
                var value = {
                    rows : response.data,
                    total : response.data.length
                };
                return value;
            },
            onLoadSuccess: function(data) {
                $compile(angular.element('#majorCoursePlanEnterReview').contents())($scope);
                $scope.$apply(function () {
                    $scope.completeCredit = 0;
                    for(var index=0; index < data.rows.length; index++){
                        $scope.completeCredit += parseFloat(data.rows[index].credit);
                    }
                });
            },
            clickToSelect: false,
            columns: [
                {checkbox: true,width: "5%"},
                {field:"semester",title:"开课学期",align:"center",valign:"middle"},
                {field:"courseNum",title:"课程号",align:"center",valign:"middle"},
                {field:"courseName",title:"课程名称",align:"center",valign:"middle"},
                {field:"type",title:"变更类型",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        if(value == "1"){
                            return "新增"
                        }
                        if(value == "2"){
                            return "修改"
                        }
                        if(value == "3"){
                            return "删除"
                        }
                    }
                },
                {field:"credit",title:"学分",align:"center",valign:"middle"},
                {field:"totalHour",title:"总学时",align:"center",valign:"middle"},
                {field:"examWay",title:"考核方式",align:"center",valign:"middle"},
                {field:"theoryHour",title:"理论学时",align:"center",valign:"middle"},
                {field:"practiceHour",title:"实践学时",align:"center",valign:"middle"}
            ]
        };

        $scope.ok = function () {
            if($scope.result != "审核中"){
                alertService("已审核");
                return;
            }
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/scheme/majorCurriculaReview/transact.html',
                resolve: {
                    business_ID: function () {
                        return $scope.majorCurriculaApply_ID;
                    },
                    parentModal :function () {
                        return $uibModalInstance;
                    }
                },
                controller: transactController
            });
        }
    }
    reviewController.$inject = ['$rootScope','$compile', '$scope', '$uibModal', '$uibModalInstance', 'app', 'item', 'scheme_majorCurriculaReviewService', 'alertService'];

    var transactController = function ($rootScope, $compile, $scope, $uibModal, $uibModalInstance, parentModal, app, business_ID, scheme_majorCurriculaReviewService, alertService) {
        $scope.close = function () {
            $uibModalInstance.close();
        };
        $scope.review = {
            majorCurriculaApply_ID : business_ID,
            remark : "",
            result : "1"
        }
        $scope.ok = function () {
            $rootScope.showLoading = true;
            scheme_majorCurriculaReviewService.review($scope.review,function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                parentModal.close();
                angular.element('#classCoursePlanReviewTable').bootstrapTable('refresh');
                alertService('success', '审核成功');
            });
        }

    }
    transactController.$inject = ['$rootScope', '$compile', '$scope', '$uibModal', '$uibModalInstance', 'parentModal', 'app', 'business_ID', 'scheme_majorCurriculaReviewService', 'alertService'];

})(window);
