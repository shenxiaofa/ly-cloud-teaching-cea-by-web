/**
 * Created by test on 2017/6/27.
 */
;(function (window, undefined) {
    'use strict';
    //考试课程维护Controller
    window.score_slowMaintainController = function($compile, $filter, baseinfo_generalService, app, $scope, $uibModal, $rootScope, $window, score_slowMaintainService, alertService) {

        //学年学期
        baseinfo_generalService.findAcadyeartermNamesBox(function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.semesterObjs = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.id as plateObj.acadYearSemester  for plateObj in semesterObjs" '
                +  ' ng-model="examQualification.semesterId" id="semesterId" name="semesterId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#semesterId").parent().empty().append(html);
            $compile(angular.element("#semesterId").parent().contents())($scope);
        });
        // 表格的高度
        $scope.table_height = $window.innerHeight - 223;

        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder,
                reviewStatus : '1'
            };
            return angular.extend(pageParam, $scope.examQualification);
        }

        $scope.examinationPaperNumberManageTable = {
            url:app.api.address + '/exam/examReview/reviewInfo',
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
            responseHandler:function(response){
                return response.data;
            },
            columns: [
                {checkbox: true,width: "3%"},
                {field:"semester",title:"学年学期",align:"center",valign:"middle"},
                {field:"studentId",title:"学号",align:"center",valign:"middle"},
                {field:"studentName",title:"姓名",align:"center",valign:"middle"},
                {field:"courseId",title:"课程编号",align:"center",valign:"middle"},
                {field:"courseName",title:"课程名称",align:"center",valign:"middle"},
                {field:"dept",title:"开课单位",align:"center",valign:"middle"},
                {field:"credit",title:"学分",align:"center",valign:"middle"},
                {field:"fileId",title:"附件",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        return "<a ng-click='checkField(" + JSON.stringify(value) + ")'  href='javascript:;'>value</a>";
                    }},
                {field:"reason",title:"原因",align:"center",valign:"middle"},
                {field:"cz",title:"操作",align:"center",valign:"middle",width: "10%",
                    formatter : function (value, row, index) {
                        return "<button type='button' ng-click='deleteOne(" + JSON.stringify(row) + ")' class='btn btn-default'>删除</button>";
                    }
                }

            ]
        };

        //下载
        $scope.checkField = function(value){
            var fileId = value;
            console.log(fileId);
            score_slowMaintainService.exportTemplate(fileId, function (data) {
                var blob = new Blob([data], {
                    type: "application/octet-stream"
                });
                fileId = fileId.substring(fileId.indexOf("."), fileId.length); // 获取到文件的末尾文件类型名
                var objectUrl = window.URL.createObjectURL(blob);
                var currentTime = $filter('date')(new Date(), 'yyyyMMddHHmmss');
                var aForExcel = angular.element('<a download="缓考文件-' + currentTime + fileId + '"><span class="forExcel">导出</span></a>').attr('href', objectUrl);
                angular.element('body').append(aForExcel);
                angular.element('.forExcel').click();
                aForExcel.remove();
                // 允许关闭
                $rootScope.showLoading = false; // 关闭加载提示
            });
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
            angular.element('#examinationPaperNumberManageTable').bootstrapTable('resetView',{ height: $scope.table_height } );
        };
        
        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#examinationPaperNumberManageTable').bootstrapTable('selectPage', 1);
        };
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.examQualification = {};
            angular.element('form[name="pyfabzkz_form"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#examinationPaperNumberManageTable').bootstrapTable('refresh');
        };

        // 新增
        $scope.add = function(){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/exam/studentsSlowExamination/maintain/add.html',
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
                templateUrl: 'tpl/exam/studentsSlowExamination/maintain/delete.html',
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
                templateUrl: 'tpl/exam/studentsSlowExamination/maintain/delete.html',
                resolve: {
                    items: function () {
                        return rows;
                    },
                },
                controller: examinationPaperNumberSetController
            });
        };
    }
    score_slowMaintainController.$inject = ['$compile', '$filter', 'baseinfo_generalService', 'app', '$scope', '$uibModal', '$rootScope', '$window', 'score_slowMaintainService', 'alertService'];

    // 删除控制器
    var deleteOneController = function ($scope, $rootScope, $uibModalInstance,alertService, item, score_slowMaintainService) {
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {
            var ids = [item.buseinssId];
            $rootScope.showLoading = true; // 开启加载提示
            score_slowMaintainService.delete(ids,function (error, message,data) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else{
                    angular.element('#examinationPaperNumberManageTable').bootstrapTable('refresh');
                }
            });
            $uibModalInstance.close();
        };
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    };
    deleteOneController.$inject = ['$scope', '$rootScope', '$uibModalInstance', 'alertService', 'item', 'score_slowMaintainService'];

    var addController = function (app, $filter, $scope, $rootScope, FileUploader, alertService, $uibModal, $uibModalInstance, score_slowMaintainService, formVerifyService) {
        $scope.slowExam = {
        }
        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            $rootScope.showLoading = true; // 开启加载提示
            $scope.slowExam.file = $scope.fileId;
            score_slowMaintainService.add($scope.slowExam,function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else{
                    alertService('success', '添加成功');
                    angular.element('#examinationPaperNumberManageTable').bootstrapTable('refresh');
                    $uibModalInstance.close();
                }

            });
            console.log("invigilationTeachers  :  "+$scope.invigilationTeachers);
            $uibModalInstance.close();
        };


        $scope.courseChoose = function(){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/exam/studentsSlowExamination/maintain/add_course.html',
                size: 'lg',
                resolve: {
                    pScope: function () {
                        return $scope;
                    },
                },
                controller: courseChooseController
            });
        };
        $scope.stuChoose = function(){
            if($scope.slowExam.id == "" || $scope.slowExam.id == undefined){
                alertService("请先选择课程");
                return;
            }
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/exam/studentsSlowExamination/maintain/add_stu.html',
                size: 'lg',
                resolve: {
                    pScope: function () {
                        return $scope;
                    },
                },
                controller: stuChooseController
            });
        };

        /*************************上传附件开始*******************************/
        // 上传附件【文件】
        $scope.uploader = new FileUploader({
            url: app.api.address + '/system/informNotice/uploadAttachment'
        });
        $scope.uploader.onAfterAddingFile = function(fileItem) {
            fileItem.upload();
            $scope.showProgress = true;	// 展示进度条
        };
        $scope.uploader.onErrorItem = function(fileItem, response, status, headers) {
            alertService(response.meta.message);
        };
        $scope.uploader.onCompleteItem = function(fileItem, response, status, headers) {
            if (response.meta.success) {
                // 获取 fileId
                $scope.fileId = response.data;
                console.log("fileId = " + $scope.fileId);
            } else {
                alertService(response.meta.message);
            }
        };
        // 删除上传文件
        $scope.deleteAttachment = function (fileId) {
            console.log($scope.uploader.queue);
            score_slowMaintainService.deleteAttachment(fileId, 'informNoticeManage:delete', function (error, message) {
                if (error) {
                    alertService(message);
                    return;
                };
            });
            $scope.uploader.queue[0].file.name = "";
            $scope.uploader.queue[0].file.size = "";
            $scope.uploader.queue = [];
            $scope.showProgress = false;
        };
        // 关闭窗口时删除文件
        $scope.cancel = function (fileId) {
            if(fileId != null){
                // 删除上传文件
                score_slowMaintainService.deleteAttachment(fileId, 'informNoticeManage:delete', function (error, message) {
                    if (error) {
                        alertService(message);
                        return;
                    };
                });
            }
            $uibModalInstance.close();
        };

        /*************************上传附件结束*******************************/


    }
    addController.$inject = ['app', '$filter', '$scope', '$rootScope', 'FileUploader', 'alertService', '$uibModal', '$uibModalInstance', 'score_slowMaintainService', 'formVerifyService'];

    //课程选择控制器
    var courseChooseController =  function ($scope,baseinfo_generalService, app, pScope, $compile, alertService, $uibModalInstance, score_slowMaintainService){

        //学年学期
        baseinfo_generalService.findAcadyeartermNamesBox(function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.semesterObjs = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.id as plateObj.acadYearSemester  for plateObj in semesterObjs" '
                +  ' ng-model="student.semesterId" id="semesterId" name="semesterId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#semesterId").parent().empty().append(html);
            $compile(angular.element("#semesterId").parent().contents())($scope);
        });

        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder,
            };
            return angular.extend(pageParam, $scope.student);
        };
        $scope.examQualificationAddTable = {
            url:app.api.address + '/exam/examReview/courseInfo',
            method: 'get',
            cache: false,
            height: 321,
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [5, 10, 20, 50],
            search: false,
            sortOrder: 'desc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParams,//传递参数（*）
            showColumns: false,
            showRefresh: false,
            clickToSelect: true,
            onLoadSuccess: function() {
                $compile(angular.element('#examQualificationTable').contents())($scope);
            },
            responseHandler:function(response){
                return response.data;
            },
            columns: [
                {radio: true,width: "3%"},
                {field:"semester",title:"学年学期",align:"center",valign:"middle"},
                {field:"courseName",title:"课程名称",align:"center",valign:"middle"},
                {field:"courseNum",title:"课程号",align:"center",valign:"middle"},
                {field:"dept",title:"开课单位",align:"center",valign:"middle"},
                {field:"courseProperty",title:"课程性质",align:"center",valign:"middle"},
                {field:"credit",title:"学分",align:"center",valign:"middle"},
                {field:"examWay",title:"考试方式",align:"center",valign:"middle"}
            ]
        }

        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#examQualificationAddTable').bootstrapTable('selectPage', 1);
        };
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.student = {};
            angular.element('form[name="pyfabzkz_form"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#examQualificationAddTable').bootstrapTable('refresh');
        };

        //取消
        $scope.cancel= function(){
            $uibModalInstance.close();
        }
        //确认
        $scope.ok = function () {
            var rows = $('#examQualificationAddTable').bootstrapTable('getSelections');
            if(rows.length == 0){
                alertService('请先选择课程');
                return;
            }
            pScope.slowExam = rows[0];
            $uibModalInstance.close();
        };
    }
    courseChooseController.$inject = ['$scope', 'baseinfo_generalService', 'app', 'pScope', '$compile', 'alertService', '$uibModalInstance', 'score_slowMaintainService'];


    //学生选择控制器
    var stuChooseController =  function ($scope, app, pScope, $compile, alertService, $uibModalInstance, score_slowMaintainService){
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder,
                coursePlanId : pScope.slowExam.id
            };
            return angular.extend(pageParam, $scope.student);
        };
        $scope.examQualificationAddTable = {
            url:app.api.address + '/exam/examReview/stuInfo',
            method: 'get',
            cache: false,
            height: 321,
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [5, 10, 20, 50],
            search: false,
            sortOrder: 'desc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParams,//传递参数（*）
            showColumns: false,
            showRefresh: false,
            clickToSelect: true,
            onLoadSuccess: function() {
                $compile(angular.element('#examQualificationTable').contents())($scope);
            },
            responseHandler:function(response){
                return response.data;
            },
            columns: [
                {radio: true,width: "3%"},
                {field:"studentNum",title:"学号",align:"center",valign:"middle"},
                {field:"studentName",title:"姓名",align:"center",valign:"middle"},
                {field:"college",title:"院系",align:"center",valign:"middle"},
                {field:"className",title:"班级",align:"center",valign:"middle"}
            ]
        }

        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#examQualificationAddTable').bootstrapTable('selectPage', 1);
        };
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.student = {};
            angular.element('form[name="pyfabzkz_form"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#examQualificationAddTable').bootstrapTable('refresh');
        };

        //取消
        $scope.cancel= function(){
            $uibModalInstance.close();
        }
        //确认
        $scope.ok = function () {
            var rows = $('#examQualificationAddTable').bootstrapTable('getSelections');
            if(rows.length == 0){
                alertService('请先选择学生');
                return;
            }
            pScope.slowExam.studentNum = rows[0].studentNum;    //学号
            pScope.slowExam.studentName = rows[0].studentName;  //姓名
            pScope.slowExam.college = rows[0].college;          //院系
            pScope.slowExam.className = rows[0].className;      //班级
            pScope.slowExam.registerId = rows[0].registerId;    //学籍id
            pScope.slowExam.collegeId = rows[0].collegeId;      //院系id
            pScope.slowExam.classId = rows[0].classId;          //班级id
            $uibModalInstance.close();
        };
    }
    stuChooseController.$inject = ['$scope', 'app', 'pScope', '$compile', 'alertService', '$uibModalInstance', 'score_slowMaintainService'];

    //编号设置控制器
    var examinationPaperNumberSetController = function ($timeout, $rootScope, alertService, $scope, $uibModalInstance, $compile, items, score_slowMaintainService, formVerifyService) {
        
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {
            var param = [];
            items.forEach (function(data) {

                    param.push(data.buseinssId);
            });
            $rootScope.showLoading = true; // 开启加载提示
            score_slowMaintainService.delete(param,function (error, message,data) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else{
                    angular.element('#examinationPaperNumberManageTable').bootstrapTable('refresh');
                }
            });
            $uibModalInstance.close();
        };
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    };
    examinationPaperNumberSetController.$inject = ['$timeout', '$rootScope', 'baseinfo_generalService', 'alertService', '$scope', '$uibModalInstance', '$compile', 'items', 'score_slowMaintainService', 'formVerifyService'];

})(window);
