/**
 * Created by test on 2017/6/27.
 */
;(function (window, undefined) {
    'use strict';
    //考试课程维护Controller
    window.finalExam_listManageController = function($compile,app,baseinfo_generalService, $scope, $uibModal, $rootScope, $window, finalExam_listManageService, alertService) {

        // 表格的高度
        $scope.table_height = $window.innerHeight - 226;
        $scope.makeupExaminationList={};
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder,
                examType:"1"
            };
            return angular.extend(pageParam, $scope.makeupExaminationList);
        }

        $scope.makeupExaminationListManageTable = {
            onLoadSuccess: function() {
                $compile(angular.element('#makeupExaminationListManageTable').contents())($scope);
            },
            //url: 'data_test/exam/tableview_makeupExaminationListManage.json',
            url:app.api.address + '/exam/formalList',
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
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParams,//传递参数（*）
            showColumns: true,
            showRefresh: true,
            clickToSelect: true,
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
                {field:"studentCount",title:"考生数",align:"center",valign:"middle"},
                {field:"effectiveSign",title:"是否安排",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        if(value == "1"){
                            return "是";
                        }
                        return "否";
                    }
                },
                {field:"cz",title:"操作",align:"center",valign:"middle",width:"15%",
                    formatter : function (value, row, index) {
                        var maintain =  "<button id='btn_update' type='button' ng-click='maintain(" + JSON.stringify(row) + ")'  class='btn btn-default btn-sm''>维护正考名单</button>";
                        var enabled =  "<button id='btn_update' type='button' ng-click='enabled(" + JSON.stringify(row) + ",1)'  class='btn btn-default btn-sm''>安排</button>";
                        if(row.effectiveSign == "1"){
                             enabled =  "<button id='btn_update' type='button' ng-click='enabled(" + JSON.stringify(row) + ",0)'  class='btn btn-default btn-sm''>不安排</button>";
                        }
                        return    maintain+enabled;
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
            angular.element('#makeupExaminationListManageTable').bootstrapTable('resetView',{ height: $scope.table_height } );
        };
        
        $scope.enabled = function (data,status) {
            $rootScope.showLoading = true; // 开启加载提示
            finalExam_listManageService.examEnable(data.id,status,function (error, message,data) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else{
                    angular.element('#makeupExaminationListManageTable').bootstrapTable('refresh');
                }
            });
        };
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
        

        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#makeupExaminationListManageTable').bootstrapTable('selectPage', 1);
        };
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.makeupExaminationList = {};
            angular.element('form[name="pyfabzkz_form"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#makeupExaminationListManageTable').bootstrapTable('refresh');
        };

        // 打开生成补考任务
        $scope.produced = function(){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/exam/finalExamManage/finalExamListManage/producedExamClass.html',
                controller: producedExamClassController
            });
        };

        //打开维护补考名单
        $scope.maintain = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/exam/finalExamManage/finalExamListManage/maintainExamClass.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return row;
                    }
                },
                controller: maintainExamClassController
            });
        }
    }
    makeupExam_listManageController.$inject = ['$compile', 'app', 'baseinfo_generalService', '$scope', '$uibModal', '$rootScope', '$window', 'finalExam_listManageService', 'alertService'];


    //生成补考任务控制器
    var producedExamClassController = function ($scope, $rootScope, $compile, baseinfo_generalService, $uibModalInstance,alertService, finalExam_listManageService, formVerifyService) {

        $scope.invigilationTeachers = {

        }

        //学年学期
        baseinfo_generalService.findAcadyeartermNamesBox(function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.semesterObjs = data.data;
            var html = '' +
                '<select ui-select2  ng-options="plateObj.id as plateObj.acadYearSemester  for plateObj in semesterObjs" '
                +  ' ng-model="invigilationTeachers.semesterId" id="semesterId" name="semesterId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#semesterId").parent().empty().append(html);
            $compile(angular.element("#semesterId").parent().contents())($scope);
        });

        //学籍状态
        baseinfo_generalService.findcodedataNames({datableNumber: "XJZT"},function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.studentStatus = data.data;
            var html = '' +
                '<select ui-select2  ng-options="plateObj.dataNumber as plateObj.dataName  for plateObj in studentStatus" '
                +  ' ng-model="invigilationTeachers.studentStatus" id="studentStatus" name="studentStatus" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#studentStatus").parent().empty().append(html);
            $compile(angular.element("#studentStatus").parent().contents())($scope);
        });
        //课程属性
        baseinfo_generalService.findcodedataNames({datableNumber: "KCSXDM"},function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.courseProperty = data.data;
            var html = '' +
                '<select ui-select2 multiple ng-options="plateObj.dataNumber as plateObj.dataName  for plateObj in courseProperty" '
                +  ' ng-model="invigilationTeachers.courseProperty" id="courseProperty" name="courseProperty" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#courseProperty").parent().empty().append(html);
            $compile(angular.element("#courseProperty").parent().contents())($scope);
        });
        //学生类别
        baseinfo_generalService.findcodedataNames({datableNumber: "XSLBDM"},function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.studentCategoryCode = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.dataNumber as plateObj.dataName  for plateObj in studentCategoryCode" '
                +  ' ng-model="invigilationTeachers.studentCategoryCode" id="studentCategoryCode" name="studentCategoryCode" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#studentCategoryCode").parent().empty().append(html);
            $compile(angular.element("#studentCategoryCode").parent().contents())($scope);
        });

        //开课单位
        finalExam_listManageService.courseDeptPull(function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.deptId = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.id as plateObj.name  for plateObj in deptId" ng-change="showCourseLibrary()" '
                +  ' ng-model="invigilationTeachers.deptId"  id="deptId" name="deptId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#deptId").parent().empty().append(html);
            $compile(angular.element("#deptId").parent().contents())($scope);
        });

        //课程库
     $scope.showCourseLibrary = function () {
          baseinfo_generalService.showCourseLibrary({
              pageNo: "1",
              pageSize: "9999",
              param:{
                  establishUnitNumber: $scope.invigilationTeachers.deptId,
                  whether: "1"
              }
          },function (error, message,data) {
              if (error) {
                  alertService(message);
                  return;
              }
              $scope.courseId = data.data.rows;
              var html = '' +
                  '<select ui-select2 ng-options="plateObj.courseNumber as plateObj.courseName  for plateObj in courseId" '
                  +  ' ng-model="invigilationTeachers.courseId" id="courseId" name="courseId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                  +  '<option value="">==请选择==</option> '
                  +  '</select>';
              angular.element("#courseId").parent().empty().append(html);
              $compile(angular.element("#courseId").parent().contents())($scope);
          });
      }
        $scope.showCourseLibrary();

        //招生单位
        finalExam_listManageService.deptPull(function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.collegeId = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.id as plateObj.name  for plateObj in collegeId" ng-change="classPull()" '
                +  ' ng-model="invigilationTeachers.collegeId" id="collegeId" name="collegeId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#collegeId").parent().empty().append(html);
            $compile(angular.element("#collegeId").parent().contents())($scope);
        });
        //年级
        baseinfo_generalService.gradeList(function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.grade = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.dataNumber as plateObj.dataNumber  for plateObj in grade" ng-change="classPull()" '
                +  ' ng-model="invigilationTeachers.grade" id="grade" name="grade" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#grade").parent().empty().append(html);
            $compile(angular.element("#grade").parent().contents())($scope);
        });

        //专业
        finalExam_listManageService.majorPull(function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.majorId = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.id as plateObj.name  for plateObj in majorId" ng-change="classPull()" '
                +  ' ng-model="invigilationTeachers.majorId" id="majorId" name="majorId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#majorId").parent().empty().append(html);
            $compile(angular.element("#majorId").parent().contents())($scope);
        });

        $scope.classPull = function () {
            //班级
            finalExam_listManageService.classPull(
                {
                    grade:$scope.invigilationTeachers.grade,
                    majorId:$scope.invigilationTeachers.majorId,
                    deptId:$scope.invigilationTeachers.collegeId
                },function (error, message,data) {
                    if (error) {
                        alertService(message);
                        return;
                    }
                    $scope.classId = data.data;
                    var html = '' +
                        '<select ui-select2 ng-options="plateObj.id as plateObj.name  for plateObj in classId" '
                        +  ' ng-model="invigilationTeachers.classId" id="classId" name="classId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                        +  '<option value="">==请选择==</option> '
                        +  '</select>';
                    angular.element("#classId").parent().empty().append(html);
                    $compile(angular.element("#classId").parent().contents())($scope);
                });
        }
        $scope.classPull();

        finalExam_listManageService.currentSemester("",function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }else{
                $scope.invigilationTeachers.semesterId = data.data[0].id;
            }
        });
        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            console.log($scope.invigilationTeachers.semesterId);
            $rootScope.showLoading = true; // 开启加载提示
            finalExam_listManageService.create($scope.invigilationTeachers,function (error, message,data) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else{
                    angular.element('#makeupExaminationListManageTable').bootstrapTable('refresh');
                }
            });
            $uibModalInstance.close();
        };
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    };
    producedExamClassController.$inject = ['$scope', '$rootScope', '$compile', 'baseinfo_generalService', '$uibModalInstance', 'alertService', 'finalExam_listManageService', 'formVerifyService'];

    //维护补考名单控制器
    var maintainExamClassController = function ($scope, $rootScope, alertService, $compile, app, $uibModalInstance, item, finalExam_listManageService) {
        console.log(item.kcbh);
        $scope.student = item;
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder
            };
            return angular.extend(pageParam, "");
        }
        $scope.studentListTable = {
            //url: 'data_test/exam/tableview_studentList.json',
            url:app.api.address + '/exam/formalList/studentList?formaIid='+item.id,
            method: 'get',
            cache: false,
            height: 357,
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParams,//传递参数（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [5, 10, 20, 50],
            search: false,
            showColumns: false,
            showRefresh: false,
            clickToSelect: true,
            responseHandler:function(response){
                return response.data;
            },
            onLoadSuccess: function() {
                $compile(angular.element('#studentListTable').contents())($scope);
            },
            columns: [
                {field:"studentNum",title:"学号",align:"center",valign:"middle"},
                {field:"name",title:"姓名",align:"center",valign:"middle"},
                {field:"sex",title:"性别",align:"center",valign:"middle"},
                {field:"dept",title:"院系",align:"center",valign:"middle"},
                {field:"major",title:"专业",align:"center",valign:"middle"},
                {field:"grade",title:"年级",align:"center",valign:"middle"},
                {field:"className",title:"班级",align:"center",valign:"middle"},
                {field:"enable",title:"是否安排",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        if(value == "1"){
                            return "是";
                        }
                        return "否";
                    }
                },
                {field:"flag",title:"标记",align:"center",valign:"middle"},
                {field:"enable",title:"操作",align:"center",valign:"middle",width:"15%",
                    formatter : function (value, row, index) {
                        var enabled =  "<button id='btn_update' type='button' ng-click='enabled(" + JSON.stringify(row) + ",1)'  class='btn btn-default btn-sm''>安排</button>";
                        if(row.enable == "1"){
                            enabled =  "<button id='btn_update' type='button' ng-click='enabled(" + JSON.stringify(row) + ",0)'  class='btn btn-default btn-sm''>不安排</button>";
                        }
                        return enabled;
                    }
                }
            ]
        }

        $scope.enabled = function (data,status) {
            $rootScope.showLoading = true; // 开启加载提示
            finalExam_listManageService.studentEnable(data.id,status,function (error, message,data) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else{
                    angular.element('#studentListTable').bootstrapTable('refresh');
                }
            });
        };
        $scope.cancel = function () {
            $uibModalInstance.close();
        };

        $scope.ok = function () {
            $uibModalInstance.close();
        };
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    };
    maintainExamClassController.$inject = ['$scope', '$rootScope', 'alertService', '$compile', 'app', '$uibModalInstance', 'item', 'finalExam_listManageService'];
})(window);
