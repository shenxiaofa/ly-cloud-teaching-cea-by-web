;(function (window, undefined) {
    'use strict';

    window.scheme_classCurriculaReviewController = function ($compile, $scope, $uibModal, $rootScope, $window, scheme_classCurriculaReviewService, alertService, app) {
        // 表格的高度
        $scope.win_height = $window.innerHeight;
        $scope.table_height = $scope.win_height - 223;

        //校区下拉框数据
        $scope.campus = [];
        scheme_classCurriculaReviewService.getCampus(function (error,message,data) {
            $scope.campus = data.data;
            var html = '' +
                '<select ui-select2  ui-chosen="searchForm.educationLevel"  '
                +  ' ng-model="reviewParam.campusNumber" id="campusNumber" name="campusNumber" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option ng-repeat="a in campus" value="{{a.campusNumber}}">{{a.campusName}}</option> '
                +  '</select>';
            angular.element("#campusNumber").parent().empty().append(html);
            $compile(angular.element("#campusNumber").parent().contents())($scope);
        });
        //学生类别下拉框数据
        $scope.studentCategory = [];
        scheme_classCurriculaReviewService.getSelected('XSLBDM', function (error,message,data) {
            $scope.studentCategory = data.data;
            var html = '' +
                '<select ui-select2  ui-chosen="searchForm.educationLevel_ID" '
                +  ' ng-model="reviewParam.educationLevel_ID" id="educationLevel_ID" name="educationLevel_ID" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option ng-repeat="a in studentCategory" value="{{a.dataNumber}}">{{a.dataName}}</option> '
                +  '</select>';
            angular.element("#educationLevel_ID").parent().empty().append(html);
            $compile(angular.element("#educationLevel_ID").parent().contents())($scope);
        });

        $scope.reviewParam = {
            campusNumber : "",
            grade : "",
            majorName : "",
            educationLevel_ID : "",
            className : "",
            reviewStatus : ""
        };
        // 查询参数
        $scope.queryParams = function modelDataRangeQueryParams(params) {
            var attributeNamesForOrderBy = {};
            attributeNamesForOrderBy[params.sortName] = params.sortOrder;
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                attributeNamesForOrderBy: attributeNamesForOrderBy
            };
            $rootScope.$log.debug(angular.extend(pageParam, $scope.classScheme));
            return angular.extend(pageParam, $scope.reviewParam);
            //return pageParam;
        }
        $scope.classCoursePlanReviewTable = {
            //url: 'data_test/scheme/tableview_majorCoursePlanReview.json',
            url:app.api.address + '/scheme/classCurricula/reviewSecond',
            method: 'get',
            cache: false,
            height: $scope.table_height,
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [10, 20, 30], // 设置可供选择的页面数据条数
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField : "id", // 指定主键列
            uniqueId: "id", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParams,//传递参数（*）
            search: false,
            showColumns: true,
            showRefresh: true,
            responseHandler:function(response){
                return response.data;
            },
            onLoadSuccess: function() {
                $compile(angular.element('#classCoursePlanReviewTable').contents())($scope);
            },
            clickToSelect: false,
            columns: [
                {checkbox: true,width: "5%"},
                {field:"processInstance_ID",title:"流程实例id",visible:false},
                {field:"business_ID",title:"业务实例id",visible:false},
                {field:"campusName",title:"所属校区",align:"center",valign:"middle"},
                {field:"grade",title:"年级",align:"center",valign:"middle"},
                {field:"deptName",title:"所属单位",align:"center",valign:"middle"},
                {field:"majorName",title:"专业名称",align:"center",valign:"middle"},
                {field:"className",title:"班级名称",align:"center",valign:"middle"},
                {field:"educationLevel_ID",title:"学生类别",align:"center",valign:"middle"},
                {field:"applyInfo",title:"提交人及时间",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        var info = row.applicant + ": "+row.applicationTime;
                        return info;
                    }
                },
                {field:"reviewStatus",title:"审核状态",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        if(value == "0")
                            return "不通过";
                        if(value == "1")
                            return "通过";
                        if(value == "2")
                            return "审核中";
                    }
                },
                {field:"cz",title:"操作",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        if(row.reviewStatus === "2"){
                            var reviewBtn = "<button id='btn_fzrsz' has-permission='classCurriculaReview:review' type='button' ng-click='review(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>进入审核</button>";
                            return reviewBtn;
                        }
                        var reviewBtn = "<button id='btn_fzrsz' has-permission='classCurriculaReview:review' type='button' disabled  class='btn btn-default btn-sm'>审核结束</button>";
                        return reviewBtn;
                    }
                }
            ]
        };
        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#classCoursePlanReviewTable').bootstrapTable('selectPage', 1);
            //angular.element('#classCoursePlanReviewTable').bootstrapTable('refresh');
        };
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.reviewParam = {};
            // 重新初始化下拉框
            angular.element('form[name="searchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#classCoursePlanReviewTable').bootstrapTable('refresh');
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
            angular.element('#classCoursePlanReviewTable').bootstrapTable('resetView',{ height: $scope.table_height } );
        }

        // 打开审核面板
        $scope.review = function(data){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/scheme/classCurriculaReview/review.html',
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
    scheme_classCurriculaReviewController.$inject = ['$compile', '$scope', '$uibModal', '$rootScope', '$window', 'scheme_classCurriculaReviewService', 'alertService', 'app'];

    var reviewController = function ($rootScope, $compile, $scope, $uibModal, $uibModalInstance, app, item, scheme_classCurriculaReviewService, alertService) {
        $scope.close = function () {
            $uibModalInstance.close();
        };
        $scope.majorCoursePlanEnterReview = {
            //url: 'data_test/scheme/tableview_majorCoursePlanEnterReview.json',
            url:app.api.address + '/scheme/classCurricula/change?classCurriculaApply_ID='+item.business_ID,
            method: 'get',
            cache: false,
            height: 0,
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: false,
            // pageSize: 10,
            // pageNumber:1,
            // pageList: [5, 10, 20, 50],
            search: false,
            responseHandler:function(response){
                var value = {
                    rows : response.data,
                };
                return value;
            },
            onLoadSuccess: function() {
                $compile(angular.element('#majorCoursePlanEnterReview').contents())($scope);
            },
            clickToSelect: true,
            columns: [
                {checkbox: true,width: "5%"},
                {field:"semester",title:"开课学期",align:"center",valign:"middle"},
                {field:"courseModel",title:"课程模块",align:"center",valign:"middle"},
                {field:"courseNum",title:"课程号",align:"center",valign:"middle"},
                {field:"courseName",title:"课程名称",align:"center",valign:"middle"},
                {field:"credit",title:"学分",align:"center",valign:"middle"},
                {field:"totalHour",title:"总学时",align:"center",valign:"middle"},
                {field:"examWay",title:"考核方式",align:"center",valign:"middle"},
                {field:"theoryHour",title:"理论学时",align:"center",valign:"middle"},
                {field:"practiceHour",title:"实践学时",align:"center",valign:"middle"},
                {field:"type",title:"操作内容",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        if(value == "1")
                            return "新增";
                        if(value == "2")
                            return "修改";
                        if(value == "3")
                            return "删除";
                    }
                }
            ]
        };
        $scope.ok = function () {
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/scheme/classCurriculaReview/transact.html',
                resolve: {
                    business_ID: function () {
                        return item.business_ID;
                    },
                    parentModal :function () {
                        return $uibModalInstance;
                    }
                },
                controller: transactController
            });
        }
    }
    reviewController.$inject = ['$rootScope','$compile', '$scope', '$uibModal', '$uibModalInstance', 'app', 'item', 'scheme_classCurriculaReviewService', 'alertService'];

    var transactController = function ($rootScope, $compile, $scope, $uibModal, $uibModalInstance, parentModal, app, business_ID, scheme_classCurriculaReviewService, alertService) {
        $scope.close = function () {
            $uibModalInstance.close();
        };
        $scope.review = {
            classCurriculaApply_ID : business_ID,
            remark : "",
            result : "1"
        }
        $scope.ok = function () {
            $rootScope.showLoading = true;
            scheme_classCurriculaReviewService.review($scope.review,function (error, message) {
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
    transactController.$inject = ['$rootScope','$compile', '$scope', '$uibModal', '$uibModalInstance', 'parentModal', 'app', 'business_ID', 'scheme_classCurriculaReviewService', 'alertService'];

})(window);
