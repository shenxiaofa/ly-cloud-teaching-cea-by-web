;(function (window, undefined) {
    'use strict';

    window.scheme_majorCurriculaApplyController = function ($compile, $scope, $uibModal, $rootScope, $window, scheme_majorCurriculaApplyService, alertService, app) {
        $scope.MajorCurriculaApply = {};
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var attributeNamesForOrderBy = {};
            attributeNamesForOrderBy[params.sortName] = params.sortOrder;
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                attributeNamesForOrderBy: attributeNamesForOrderBy
            };
            $rootScope.$log.debug(angular.extend(pageParam, $scope.MajorCurriculaApply));
            return angular.extend(pageParam, $scope.MajorCurriculaApply);
        }

        //校区下拉框数据
        $scope.campus = [];
        scheme_majorCurriculaApplyService.getCampus(function (error,message,data) {
            $scope.campus = data.data;
            var html = '' +
                '<select ui-select2  ui-chosen="majorCurriculaApplyForm.educationLevel"  '
                +  ' ng-model="MajorCurriculaApply.campusNumber" id="campusNumber" name="campusNumber" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option ng-repeat="a in campus" value="{{a.campusNumber}}">{{a.campusName}}</option> '
                +  '</select>';
            angular.element("#campusNumber").parent().empty().append(html);
            $compile(angular.element("#campusNumber").parent().contents())($scope);
        });

        //学生类别下拉框数据
        $scope.studentCategory = [];
        scheme_majorCurriculaApplyService.getSelected('XSLBDM', function (error,message,data) {
            $scope.studentCategory = data.data;
            var html = '' +
                '<select ui-select2  ui-chosen="majorCurriculaApplyForm.educationLevel_ID" '
                +  ' ng-model="majorScheme.educationLevel_ID" id="educationLevel_ID" name="educationLevel_ID" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option ng-repeat="a in studentCategory" value="{{a.dataNumber}}">{{a.dataName}}</option> '
                +  '</select>';
            angular.element("#educationLevel_ID").parent().empty().append(html);
            $compile(angular.element("#educationLevel_ID").parent().contents())($scope);
        });
        // 表格的高度
        $scope.win_height = $window.innerHeight;
        $scope.table_height = $scope.win_height - 223;
        $scope.majorCoursePlanApplyTable = {
            url: app.api.address + '/scheme/majorCurricula',
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
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            sortName: 'createTime', // 默认排序字段
            sortOrder: 'desc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField : "id", // 指定主键列
            uniqueId: "id", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParams,//传递参数（*）
            showColumns: true,
            showRefresh: true,
            responseHandler:function(response){
                return response.data;
            },
            onLoadSuccess: function() {
                $compile(angular.element('#majorCoursePlanApplyTable').contents())($scope);
            },
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#majorCoursePlanApplyTable').contents())($scope);
            },
            clickToSelect: false,
            columns: [
                {checkbox: true,width: "5%"},
                {field:"id",title:"专业培养方案id",visible:false},
                {field:"major_ID",title:"年级专业id",visible:false},
                {field:"campusName",title:"所属校区",align:"center",valign:"middle"},
                {field:"grade",title:"年级",align:"center",valign:"middle"},
                {field:"deptName",title:"所属单位",align:"center",valign:"middle"},
                {field:"majorName",title:"专业名称",align:"center",valign:"middle"},
                {field:"majorCode",title:"专业代码",align:"center",valign:"middle"},
                {field:"educationLevel_ID",title:"学生类别",align:"center",valign:"middle"},
                {field:"reviewStatus",title:"审核状态",align:"center",valign:"middle"},
                {field:"cz",title:"操作",align:"center",valign:"middle",width: "15%",
                    formatter : function (value, row, index) {
                        if(row.reviewStatus == "未提交"){
                            var infoEditBtn = "<button id='btn_fzrsz' has-permission='majorCurriculaApply:Input' type='button' ng-click='entering(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>录入</button>";
                            var deleteBtn = "<button id='btn_fzrsz' has-permission='majorCurriculaApply:copy' type='button' ng-click='copy(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>复制</button>";
                            return infoEditBtn+"&nbsp"+deleteBtn;
                        }
                        var disableEditBtn = "<button id='btn_fzrsz' style='margin-right: 5px'  has-permission='majorCurriculaApply:Input' type='button' disabled='disabled' class='btn btn-sm'>录入</button>";
                        var disaleDeleteBtn = "<button id='btn_fzrsz' style='margin-right: 5px'  has-permission='majorCurriculaApply:copy' type='button' disabled='disabled' class='btn btn-sm'>复制</button>";
                        return disableEditBtn+"&nbsp"+disaleDeleteBtn;
                    }
                }
            ]
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
            angular.element('#majorCoursePlanApplyTable').bootstrapTable('resetView',{ height: $scope.table_height } );
        }

        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#majorCoursePlanApplyTable').bootstrapTable('selectPage', 1);
            //angular.element('#majorCoursePlanApplyTable').bootstrapTable('refresh');
        }
        $scope.searchReset = function () {
            $scope.MajorCurriculaApply = {};
            // 重新初始化下拉框
            //angular.element('form[name="schemeVersionSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#majorCoursePlanApplyTable').bootstrapTable('refresh');
        }

        // 打开录入面板
        $scope.entering = function(data){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/scheme/majorCurriculaApply/entering.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return data;
                    }
                },
                controller: enteringController
            });
        };
        //复制
        $scope.copy = function (item) {
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/scheme/majorCurriculaApply/copyScheme.html',
                size: '',
                resolve: {
                    item: function () {
                        return item;
                    }
                },
                controller: copySchemeController
            });
        }
    };
    scheme_majorCurriculaApplyController.$inject = ['$compile', '$scope', '$uibModal', '$rootScope', '$window', 'scheme_majorCurriculaApplyService', 'alertService', 'app'];

    var copySchemeController = function ($rootScope, item, formVerifyService, $compile, $scope, $uibModalInstance, scheme_majorCurriculaApplyService, alertService) {
        $scope.close = function () {
            $uibModalInstance.close();
        };

        //单位
        $scope.dept = [];
        scheme_majorCurriculaApplyService.getDept(function (error,message,data) {
            $scope.dept = data.data;
            var html = '' +
                '<select ui-select2 ng-change="cascadeMajor()"  ui-chosen="schemeVersionCopyform.deptNum" '
                +  ' ng-model="schemeVersion.deptNum" id="deptNum" name="deptNum" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option  ng-repeat="a in dept" value="{{a.departmentNumber}}">{{a.departmentName}}</option> '
                +  '</select>';
            angular.element("#deptNum").parent().empty().append(html);
            $compile(angular.element("#deptNum").parent().contents())($scope);
        });
        //专业
        $scope.major = [];
        // scheme_majorCurriculaApplyService.getMajor("",function (error,message,data) {
        //     $scope.major = data.data;
        //     var html = '' +
        //         '<select ui-select2  ui-chosen="schemeVersionCopyform.major_ID" '
        //         +  ' ng-model="schemeVersion.major_ID" id="major_ID" name="major_ID" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
        //         +  '<option value="">==请选择==</option> '
        //         +  '<option  ng-repeat="a in major" value="{{a.id}}">{{a.name}}</option> '
        //         +  '</select>';
        //     angular.element("#major_ID").parent().empty().append(html);
        //     $compile(angular.element("#major_ID").parent().contents())($scope);
        // });

        $scope.cascadeMajor = function () {
            var param = {
                schemeSign : "1"
            };
            param.dept_ID =  angular.element("#deptNum").val();
            scheme_majorCurriculaApplyService.getMajor(param, function (error,message,data) {
                $scope.major = data.data;
                var html = '' +
                    '<select ui-select2  ui-chosen="schemeVersionCopyform.major_ID" '
                    +  ' ng-model="schemeVersion.major_ID" id="major_ID" name="major_ID" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                    +  '<option value="">==请选择==</option> '
                    +  '<option  ng-repeat="a in major" value="{{a.id}}">{{a.name}}</option> '
                    +  '</select>';
                angular.element("#major_ID").parent().empty().append(html);
                $compile(angular.element("#major_ID").parent().contents())($scope);
            });
        }
        
        $scope.schemeVersion = {
            schemeVersion_ID : "",  //来源版本
            deptNum : "",           //来源学院
            major_ID : ""           //来源专业
        };
        $scope.schemeVersionSelect = [];
        scheme_majorCurriculaApplyService.getSchemeVersionSelect(function (error,message,data) {
            $scope.schemeVersionSelect = data.rows;
        });

        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            var major_ID = item.major_ID;
            $rootScope.showLoading = true; // 开启加载提示
            scheme_majorCurriculaApplyService.copyScheme(major_ID, $scope.schemeVersion,function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#majorCoursePlanApplyTable').bootstrapTable('refresh');
                alertService('success', '复制成功');
            });
        }
    }
    copySchemeController.$inject = ['$rootScope','item', 'formVerifyService', '$compile', '$scope', '$uibModalInstance', 'scheme_majorCurriculaApplyService', 'alertService'];


    var enteringController = function ($rootScope, app, $compile, $scope, $uibModal, $uibModalInstance, item, scheme_majorCurriculaApplyService, alertService) {
        $scope.schemeDemand={};
        $scope.title = [];
        $scope.s = 0;
        scheme_majorCurriculaApplyService.getTitle(item.id, item.dept_ID,function (error,message,data) {
            $scope.title = data;
            $scope.schemeDemand.majorSchemeDemand_ID = data[0].majorSchemeDemand_ID;
            $scope.schemeDemand.model_ID = data[0].id;

            //学分要求验证
            $scope.title.forEach(function (param) {
                scheme_majorCurriculaApplyService.getTable(param, function (error,message,data) {
                    if(data.data == null || data.data == ""){
                        param.completeCredit = 0;
                    }
                    data.data.forEach (function(item) {
                        item.majorSchemeDemand_ID = param.majorSchemeDemand_ID;
                        $scope.title.forEach(function (model){
                            if(item.majorSchemeDemand_ID ==  model.majorSchemeDemand_ID){
                                if(isNaN(model.completeCredit)){model.completeCredit = 0}
                                model.completeCredit += parseFloat(item.credit);
                            }
                        })
                        console.log($scope.title);
                    });
                    $scope.title.forEach(function (param) {
                        if(parseFloat(param.completeCredit) < parseFloat(param.creditDemand)){
                            $scope.btnDisable = true;
                            $scope.btnClass = "btn btn-warning";
                            param.style = "tabStyle";
                            param.tabClass = "*";
                        }else{
                            param.style = "";
                            param.tabClass = "";
                        }
                    })
                })
            })
            angular.element('#majorCoursePlanEnter').bootstrapTable('refresh');
        });

        $scope.creditValidate = function (myScope) {
            myScope.title.forEach(function (param) {
                myScope.btnDisable = false;
                param.completeCredit = 0;
                myScope.btnClass = "btn btn-info";
                scheme_majorCurriculaApplyService.getTable(param, function (error,message,data) {
                    if(data.data == null || data.data == ""){
                        param.completeCredit = 0;
                    }
                    data.data.forEach (function(item) {
                        myScope.title.forEach(function (model){
                            if(item.courseModel ==  model.name){
                                if(isNaN(model.completeCredit)){model.completeCredit = 0}
                                model.completeCredit += parseFloat(item.credit);
                            }
                        })
                        console.log(myScope.title);
                    });
                    myScope.title.forEach(function (param) {
                        if(parseFloat(param.completeCredit) < parseFloat(param.creditDemand)){
                            myScope.btnDisable = true;
                            myScope.btnClass = "btn btn-warning";
                            param.tabClass = "*";
                            param.style = "tabStyle";
                        }else{
                            param.tabClass = "";
                            param.style = "";
                            // myScope.btnDisable = false;
                            // myScope.btnClass = "btn btn-info btn-sm";
                        }
                    })
                    myScope.toReviewBtnValidate(myScope);
                })
            })
        }
        $scope.toReviewBtnValidate = function(myScope){
            myScope.btnDisable = false;
            myScope.btnClass = "btn btn-info";
            myScope.title.forEach(function (param) {
                if(parseFloat(param.completeCredit) < parseFloat(param.creditDemand)){
                    myScope.btnDisable = true;
                    myScope.btnClass = "btn btn-warning";
                    return;
                }
            })
        }

        $scope.close = function () {
            $uibModalInstance.close();
        };

        // 查询参数
        $scope.queryParams = function queryParams() {
            return  $scope.schemeDemand;
        }
        //完成学分
        $scope.completeCredit = 0;
        //按钮disable
        $scope.btnDisable = false;
        $scope.btnClass = "btn btn-info";

        $scope.majorCoursePlanEnter = {
            //url: 'data_test/plan/tableview_majorCoursePlanEnter.json',
            url:app.api.address + '/scheme/majorCurricula/curriculaChange',
            method: 'get',
            cache: false,
            height: 0,
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
                $compile(angular.element('#majorCoursePlanEnter').contents())($scope);
                $scope.$apply(function () {
                    $scope.completeCredit = 0;
                    for(var index=0; index < data.rows.length; index++){
                        $scope.completeCredit += parseFloat(data.rows[index].credit);
                    }
                });
            },
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#majorCoursePlanEnter').contents())($scope);
            },
            clickToSelect: false,
            columns: [
                {checkbox: true,width: "5%"},
                {field:"course_ID",visible:false},
                {field:"semester",title:"开课学期",align:"center",valign:"middle",width: "15%"},
                {field:"courseNum",title:"课程号",align:"center",valign:"middle"},
                {field:"courseName",title:"课程名称",align:"center",valign:"middle",width: "20%"},
                {field:"credit",title:"学分",align:"center",valign:"middle"},
                {field:"totalHour",title:"总学时",align:"center",valign:"middle"},
                {field:"examWay",title:"考核方式",align:"center",valign:"middle"},
                {field:"theoryHour",title:"理论学时",align:"center",valign:"middle"},
                {field:"practiceHour",title:"实践学时",align:"center",valign:"middle"},
                {field:"cz",title:"操作",align:"center",valign:"middle",width: "20%",
                    formatter : function (value, row, index) {
                        var updateBtn = "<button id='btn_fzrsz' has-permission='majorCurriculaApply:Input:update' type='button' ng-click='update(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>修改</button>";
                        var deleteBtn = "<button id='btn_fzrsz' has-permission='majorCurriculaApply:Input:delete' type='button' ng-click='delete(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm del-btn'>删除</button>";
                        return updateBtn+"&nbsp"+deleteBtn;
                    }
                }
            ]
        };
        //切换标签页
        $scope.change = function (a) {
            $scope.schemeDemand={
                majorSchemeDemand_ID:a.majorSchemeDemand_ID,
                model_ID:a.id
            }
            angular.element('#majorCoursePlanEnter').bootstrapTable('refresh');
        }

        $scope.delete = function (data) {
            $scope.courseInfo = {
                majorCurricula_ID : data.id,                   //专业课程计划id
                course_ID : data.course_ID,
                semester : data.semester,
                type : "3",
                majorSchemeDemand_ID : $scope.schemeDemand.majorSchemeDemand_ID,
                credit : data.credit,
                totalHour : data.totalHour,
                examWay : data.examWay,
                theoryHour : data.theoryHour,
                practiceHour : data.practiceHour,
                courseModel : data.courseModel,
                remark : data.remark
            }
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/scheme/majorCurriculaApply/delete.html',
                size: '',
                resolve: {
                    courseInfo: function () {
                        return $scope.courseInfo;
                    },
                    pScope: function () {
                        return $scope;
                    }
                },
                controller: deleteController
            });
        }

        $scope.tabs = [true, false, false];
        $scope.tab = function(index){
            angular.forEach($scope.tabs, function(i, v) {
                $scope.tabs[v] = false;
            });
            $scope.tabs[index] = true;
        }

        $scope.toReview = function () {
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/scheme/majorCurriculaApply/apply.html',
                size: 'lg',
                resolve: {
                    major_ID: function () {
                        return  item.major_ID;
                    },
                    parentModal : function () {
                       return $uibModalInstance;
                    }
                },
                controller: applyController
            });
        }

        $scope.update = function (data) {
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/scheme/majorCurriculaApply/updateCourse.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        data.majorSchemeDemand_ID = $scope.schemeDemand.majorSchemeDemand_ID;
                        return data;
                    },
                    grade: function () {
                        return item.grade;
                    },
                    creditValidate : function () {
                        return $scope.creditValidate;
                    },
                    myScope : function () {
                        return $scope;
                    }
                },
                controller: updateCourseController
            });
        }
        
        $scope.openAdd = function () {
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/scheme/majorCurriculaApply/add.html',
                size: 'lg',
                resolve: {
                    majorSchemeDemand_ID: function () {
                        return $scope.schemeDemand.majorSchemeDemand_ID;
                    },
                    model_ID: function () {
                        return $scope.schemeDemand.model_ID;
                    },
                    grade: function () {
                        return item.grade;
                    },
                    myScope : function () {
                        return $scope;
                    }
                },
                controller: addCourseController
            });
        }
    }
    enteringController.$inject = ['$rootScope','app', '$compile', '$scope', '$uibModal', '$uibModalInstance', 'item', 'scheme_majorCurriculaApplyService', 'alertService'];

    var updateCourseController = function ($rootScope, formVerifyService, $compile, $scope, $uibModalInstance, item, grade, scheme_majorCurriculaApplyService, alertService, myScope) {
        $scope.close = function () {
            $uibModalInstance.close();
        };
        //学期
        $scope.semester = [];
        scheme_majorCurriculaApplyService.getSemester(grade, function (error,message,data) {
            $scope.semester = data.data;
            var html = '' +
                '<select ui-select2  ui-chosen="codeCategorySearchForm.semester" '
                +  ' ng-model="courseInfo.semester" id="semester" ng-required="true" name="semester" ui-jq="chosen"ui-options="{search_contains: true}" ui-jq="chosen" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option  ng-repeat="a in semester" value="{{a.id}}">{{a.name}}</option> '
                +  '</select>';
            angular.element("#semester").parent().empty().append(html);
            $compile(angular.element("#semester").parent().contents())($scope);
        });

        $scope.courseInfo = {
            majorCurricula_ID : item.id,                   //专业课程计划id
            course_ID : item.course_ID,
            semester : item.semester,
            type : "2",
            majorSchemeDemand_ID : item.majorSchemeDemand_ID,
            courseNum : item.courseNum,
            courseName : item.courseName,
            credit : item.credit,
            totalHour : item.totalHour,
            examWay : item.examWay,
            theoryHour : item.theoryHour,
            practiceHour : item.practiceHour,
            courseModel : item.courseModel,
            remark : item.remark
        }


        $scope.ok = function (form) {
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            $rootScope.showLoading = true;
            scheme_majorCurriculaApplyService.addCourseChange($scope.courseInfo,function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                myScope.creditValidate(myScope);
                angular.element('#majorCoursePlanEnter').bootstrapTable('refresh');
                alertService('success', '修改成功');
            });
        }
    }
    updateCourseController.$inject = ['$rootScope', 'formVerifyService','$compile', '$scope', '$uibModalInstance', 'item', 'grade', 'scheme_majorCurriculaApplyService', 'alertService', 'myScope'];
   
    var applyController = function ($rootScope, formVerifyService, parentModal, $compile, $scope, $uibModalInstance, major_ID, scheme_majorCurriculaApplyService, alertService) {
        $scope.close = function () {
            $uibModalInstance.close();
        };
        
        $scope.toReview = {
            major_ID : major_ID,
            reason : ""
        }

        $scope.ok = function (form) {
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            $rootScope.showLoading = true;
            scheme_majorCurriculaApplyService.toReview($scope.toReview,function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else {
                    alertService('success', '送审成功');
                }
                $uibModalInstance.close();
                parentModal.close();
                angular.element('#majorCoursePlanApplyTable').bootstrapTable('refresh');

            });
        }
    }
    applyController.$inject = ['$rootScope', 'formVerifyService', 'parentModal', '$compile', '$scope', '$uibModalInstance', 'major_ID', 'scheme_majorCurriculaApplyService', 'alertService'];


    var addCourseController = function ($rootScope, majorSchemeDemand_ID, model_ID, grade, formVerifyService, app, $compile, $scope, $uibModalInstance, scheme_majorCurriculaApplyService, alertService, myScope) {
        $scope.close = function () {
            $uibModalInstance.close();
        };

        //单位
        $scope.dept = [];
        scheme_majorCurriculaApplyService.getDept(function (error,message,data) {
            $scope.dept = data.data;
            var html = '' +
                '<select ui-select2 ui-chosen="courseSearchForm.deptNum" '
                +  ' ng-model="courseParam.dept_ID" id="dept_ID" name="dept_ID" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option  ng-repeat="a in dept" value="{{a.departmentNumber}}">{{a.departmentName}}</option> '
                +  '</select>';
            angular.element("#dept_ID").parent().empty().append(html);
            $compile(angular.element("#dept_ID").parent().contents())($scope);
        });
        //学期
        $scope.semester = [];
        scheme_majorCurriculaApplyService.getSemester(grade,function (error,message,data) {
            $scope.semester = data.data;
            var html = '' +
                '<select ui-select2  ui-chosen="addForm.semester" '
                +  ' ng-model="courseInfo.semester" id="semester" ng-required="true" name="semester" ui-options="{search_contains: true}" ui-jq="chosen" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option  ng-repeat="a in semester" value="{{a.id}}">{{a.name}}</option> '
                +  '</select>';
            angular.element("#semester").parent().empty().append(html);
            $compile(angular.element("#semester").parent().contents())($scope);
        });

        //查询参数
        $scope.courseParam = {
            majorSchemeDemand_ID : majorSchemeDemand_ID,
            dept_ID : "",
            courseNameOrCode : "",
            model_ID : model_ID
        }
        //添加参数
        $scope.courseInfo = {
            course_ID:"",
            majorSchemeDemand_ID:majorSchemeDemand_ID,
            type:"1",
            semester:"",
            credit:"",
            totalHour:"",
            theoryHour:"",
            practiceHour:"",
            remark:""
        }
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
            };
            return angular.extend(pageParam, $scope.courseParam);
        }

        $scope.majorCoursePlanAddTable = {
            //url: 'data_test/scheme/tableview_majorCoursePlanAdd.json',
            url: app.api.address + '/scheme/majorScheme/operationCourse',
            method: 'get',
            cache: false,
            height: $scope.table_height,
            toolbar: '', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [10, 20, 30],
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            sortName: 'courseNum', // 默认排序字段
            sortOrder: 'desc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField : "id", // 指定主键列
            uniqueId: "id", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParams,//传递参数（*）
            search: false,
            showColumns: false,
            showRefresh: false,
            responseHandler:function(response){
                return response.data;
            },
            onCheck: function (row) {
                $scope.$apply(function () {
                    $scope.courseInfo = {
                        semester:$scope.courseInfo.semester,
                        course_ID:row.id,
                        majorSchemeDemand_ID:majorSchemeDemand_ID,//专业方案要求id
                        type:"1",
                        credit:row.credit,
                        totalHour:row.totalHour,
                        theoryHour:row.theoryHour,
                        practiceHour:row.practiceHour,
                        courseName:row.courseName,
                        courseModel:row.courseModel
                    };
                });
            },
            onLoadSuccess: function() {
                $compile(angular.element('#majorCoursePlanAddTable').contents())($scope);
            },
            clickToSelect: true,
            columns: [
                {radio: true,width: "5%"},
                {field:"id",title:"id",visible:false},
                {field:"dept",title:"开课单位",align:"center",valign:"middle"},
                {field:"courseNum",title:"课程号",align:"center",valign:"middle"},
                {field:"courseName",title:"课程名称",align:"center",valign:"middle"},
                {field:"courseModel",title:"课程模块",align:"center",valign:"middle"},
                {field:"credit",title:"学分",align:"center",valign:"middle"},
                {field:"totalHour",title:"总学时",align:"center",valign:"middle"},
                {field:"theoryHour",title:"理论学时",align:"center",valign:"middle"},
                {field:"practiceHour",title:"实践学时",align:"center",valign:"middle"}
            ]
        };

        // 查询表单
        $scope.searchSubmit = function () {
            angular.element('#majorCoursePlanAddTable').bootstrapTable('selectPage', 1);
           // angular.element('#majorCoursePlanAddTable').bootstrapTable('refresh');
        }
        // 重置表单
        $scope.searchReset = function () {
            $scope.courseParam.dept_ID = "";
            $scope.courseParam.courseNameOrCode = "";
            angular.element('form[name="courseSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#majorCoursePlanAddTable').bootstrapTable('refresh');
        };

        $scope.ok = function (form) {
            var rows = angular.element('#majorCoursePlanAddTable').bootstrapTable('getSelections');
            if( rows.length != 1){
                alertService("请选择一条数据");
                return;
            }

            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            $rootScope.showLoading = true;
            scheme_majorCurriculaApplyService.addCourseChange($scope.courseInfo,function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                myScope.creditValidate(myScope);
                angular.element('#majorCoursePlanEnter').bootstrapTable('refresh');
                alertService('success', '添加成功');
            });
        }
    }
    addCourseController.$inject = ['$rootScope', 'majorSchemeDemand_ID', 'model_ID', 'grade', 'formVerifyService', 'app', '$compile', '$scope', '$uibModalInstance', 'scheme_majorCurriculaApplyService', 'alertService', 'myScope'];

    var deleteController = function ($rootScope, formVerifyService, $compile, $scope, $uibModalInstance, scheme_majorCurriculaApplyService, alertService, courseInfo, pScope) {
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {

            $rootScope.showLoading = true; // 开启加载提示
            scheme_majorCurriculaApplyService.addCourseChange(courseInfo,function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                //重新进行学分要求验证
                pScope.creditValidate(pScope);
                angular.element('#majorCoursePlanEnter').bootstrapTable('refresh');
                $uibModalInstance.close();
               // alertService('success', '删除成功');
            });

        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    }
    deleteController.$inject = ['$rootScope', 'formVerifyService', '$compile', '$scope', '$uibModalInstance', 'scheme_majorCurriculaApplyService', 'alertService', 'courseInfo', 'pScope'];

})(window);
