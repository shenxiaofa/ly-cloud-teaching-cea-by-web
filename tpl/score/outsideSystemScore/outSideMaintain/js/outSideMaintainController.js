;(function (window, undefined) {
    'use strict';

    window.score_outSideMaintainController = function (baseinfo_generalService, app, $compile, $scope, $uibModal, $rootScope, $window, $timeout, score_outSideMaintainService, alertService) {
        // 模块设置查询对象
        $scope.versionModel = {};
        // 范围维护查询对象
        $scope.modelDataRange = {};
        // //学生类别下拉框数据
        // $scope.studentCategory = [];
        // score_outSideMaintainService.getSelected('XSLBDM', function (error,message,data) {
        //     $scope.studentCategory = data.data;
        //     var htmlFirst = '' +
        //         '<select ui-select2  ui-chosen="curriculaSearchForm.studentCategoryCode" '
        //         +  ' ng-model="classScheme.studentCategoryCode" id="studentCategoryCode" name="studentCategoryCode" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control"> '
        //         +  '<option value="">==请选择==</option> '
        //         +  '<option ng-repeat="a in studentCategory" value="{{a.dataNumber}}">{{a.dataName}}</option> '
        //         +  '</select>';
        //     angular.element("#studentCategoryCode").parent().empty().append(htmlFirst);
        //     $compile(angular.element("#studentCategoryCode").parent().contents())($scope);
        //
        //     var htmlSecond = '' +
        //         '<select ui-select2  ui-chosen="recordForm.studentCategory" '
        //         +  ' ng-model="record.studentCategoryCode" id="studentCategory" name="studentCategory" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control"> '
        //         +  '<option value="">==请选择==</option> '
        //         +  '<option ng-repeat="a in studentCategory" value="{{a.dataNumber}}">{{a.dataName}}</option> '
        //         +  '</select>';
        //     angular.element("#studentCategory").parent().empty().append(htmlSecond);
        //     $compile(angular.element("#studentCategory").parent().contents())($scope);
        // });
        // 表格的高度
        $scope.tableHeight = $window.innerHeight - 304;

        // 查询参数
        $scope.outSideMaintain = {}
        $scope.classSchemeParams = function versionModelQueryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
            };
            $rootScope.$log.debug(angular.extend(pageParam, $scope.outSideMaintain));
            return angular.extend(pageParam, $scope.classScheme);
        }
        baseinfo_generalService.findcodedataNames({datableNumber: "KCSXDM"}, function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.coursePropertyObjs = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.dataNumber as plateObj.dataName  for plateObj in coursePropertyObjs" '
                +  ' ng-model="outSideMaintain.courseProperty" id="courseProperty" name="courseProperty" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#courseProperty").parent().empty().append(html);
            $compile(angular.element("#courseProperty").parent().contents())($scope);
        });
        baseinfo_generalService.findAcadyeartermNamesBox(function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.semesterObjs = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.id as plateObj.acadYearSemester  for plateObj in semesterObjs" '
                +  ' ng-model="outSideMaintain.semesterId" id="semesterId" name="semesterId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#semesterId").parent().empty().append(html);
            $compile(angular.element("#semesterId").parent().contents())($scope);
        });
        score_outSideMaintainService.findCourseModel(function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.courseModularObjs = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.id as plateObj.name  for plateObj in courseModularObjs" '
                +  ' ng-model="outSideMaintain.courseModular" id="courseModular" name="courseModular" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#courseModular").parent().empty().append(html);
            $compile(angular.element("#courseModular").parent().contents())($scope);
        });
        $scope.classCurriculaTable = {
            // url: 'data_test/scheme/tableview_majorCoursePlanAdd.json',
            url: app.api.address + '/score/outSysScoreApply',
            method: 'get',
            toolbar: '#toolbar', //工具按钮用哪个容器
            cache: false,
            height: $scope.tableHeight,
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
            queryParams: $scope.classSchemeParams,//传递参数（*）
            search: false,
            showColumns: true,
            showRefresh: true,
            responseHandler:function(response){
                return response.data;
            },
            onLoadSuccess: function() {
                $compile(angular.element('#classCurriculaTable').contents())($scope);
            },
            columns: [
                {checkbox: true, width: "5%"},
                {field:"semesterId", title:"学年学期",align:"center",valign:"middle"},
                {field:"studentNum",title:"学号",align:"center",valign:"middle"},
                {field:"studentName",title:"姓名",align:"center",valign:"middle"},
                {field:"cnCourseName",title:"中文课程名",align:"center",valign:"middle"},
                {field:"enCourseName",title:"英文课程名",align:"center",valign:"middle"},
                {field:"courseModule",title:"课程模块",align:"center",valign:"middle"},
                {field:"credit",title:"学分",align:"center",valign:"middle"},
                {field:"totalHour",title:"学时",align:"center",valign:"middle"},
                {field:"courseProperty",title:"课程性质",align:"center",valign:"middle"},
                //{field:"scoreType",title:"成绩类别",align:"center",valign:"middle"},
                {field:"score",title:"课程成绩",align:"center",valign:"middle"},
                {field:"decideCourseNum",title:"认定课程数",align:"center",valign:"middle"},
                {field:"cz",title:"操作",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        var updateBtn = "<button id='btn_fzrsz'  type='button' ng-click='update(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>修改</button>";
                        var delBtn = "<button id='btn_fzrsz'  type='button' ng-click='del(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>删除</button>";
                        return updateBtn+delBtn;
                    }
                }
            ]
        };
        
        // 判断卡片是都被点击
        $scope.clickAlready1 = function(){
			angular.element('#classCurriculaTable').bootstrapTable('refresh');
        };

        //查询
        $scope.curriculaSearchSubmit = function () {
            angular.element('#classCurriculaTable').bootstrapTable('selectPage', 1);
            //angular.element('#classCurriculaTable').bootstrapTable('refresh');
        }
        // 查询表单重置
        $scope.curriculaSearchReset = function () {
            // $scope.classScheme.studentCategoryCode = "";
            // $scope.classScheme.majorName = "";
            // $scope.classScheme.className = "";
            // $scope.classScheme.schemeSign = "";
            // 重新初始化下拉框
            $scope.outSideMaintain = {};
            angular.element('form[name="curriculaSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#classCurriculaTable').bootstrapTable('refresh');
        }
        // 查询表单显示和隐藏切换
        $scope.isHideSearchForm = false; // 默认显示
        $scope.searchFormToggle = function () {
            $scope.isHideSearchForm = !$scope.isHideSearchForm
            if ($scope.isHideSearchForm) {
                $scope.tableHeight = $scope.tableHeight + 155;
            } else {
                $scope.tableHeight = $scope.tableHeight - 155;
            }
            angular.element('#classCurriculaTable').bootstrapTable('resetView',{ height: $scope.tableHeight } );
        };
        // 新增
        $scope.add = function(){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/score/outsideSystemScore/outSideMaintain/add.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return "";
                    }
                },
                controller: addController
            });
        };
       // 删除
        $scope.deleteBinding = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/score/outsideSystemScore/outSideMaintain/delete.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return row;
                    }
                },
                controller: deleteBindingController
            });
        };

        // 删除
        $scope.del = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/score/outsideSystemScore/outSideMaintain/delete.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return row;
                    }
                },
                controller: delController
            });
        };

        //修改
        $scope.update = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/score/outsideSystemScore/outSideMaintain/update.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return row;
                    }
                },
                controller: updateController
            });
        };
        //绑定
        $scope.bindCourse = function(){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/score/outsideSystemScore/outSideMaintain/courseBind.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return "";
                    }
                },
                controller: bindCourseController
            });
        };
        //OneForMoreBindCourse
        $scope.OneForMoreBindCourse = function(){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/score/outsideSystemScore/outSideMaintain/courseBind.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return "1";
                    }
                },
                controller: bindCourseController
            });
        };

        //绑定
        $scope.updateCourse = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/score/outsideSystemScore/outSideMaintain/updateCourse.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        row.type = "manyToOne"
                        return row;
                    }
                },
                controller: updateCourseController
            });
        };


        // 表格的高度
        $scope.classCurriculaRecordTableHeight = $window.innerHeight - 248;
        $scope.outSideMaintain.type = "maintain";
        // 查询参数
        // $scope.record = {}
        $scope.recordQueryParams = function modelDataRangeQueryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
            };
            return angular.extend(pageParam, $scope.outSideMaintain);
        }
        baseinfo_generalService.findAcadyeartermNamesBox(function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.semesterObjs = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.id as plateObj.acadYearSemester  for plateObj in semesterObjs" '
                +  ' ng-model="outSideMaintain.semesterId" id="_semesterId" name="semesterId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#_semesterId").parent().empty().append(html);
            $compile(angular.element("#_semesterId").parent().contents())($scope);
        });
        var myCount = 0;
        function mergeCells(data,fieldName,colspan,target){
            //声明一个map计算相同属性值在data对象出现的次数和
            var sortMap = {};
            for(var i = 0 ; i < data.length ; i++){
                for(var prop in data[i]){
                    if(prop == fieldName){
                        var key = data[i][prop]
                        if(key){
                            if(sortMap.hasOwnProperty(key)){
                                sortMap[key] = sortMap[key] * 1 + 1;
                            } else {
                                sortMap[key] = 1;
                            }
                            break;
                        }
                    }
                }
            }
            var index = 0;
            for(var prop in sortMap){
                var count = sortMap[prop] * 1;
                if(count>1){
                    $(target).bootstrapTable('mergeCells',{index:index, field:fieldName, colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"checkbox", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"cz", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"semesterId", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"studentNum", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"studentName", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"studentDepartmentName", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"semesterMajor", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"className", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"cnCourseName", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"enCourseName", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"credit", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"totalHour", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"score", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"courseModual", colspan: colspan, rowspan:count});
                }else{
                    myCount += count;
                }
                index += count;
            }
        }

        function mergeCells2(data,fieldName,colspan,target){
            //声明一个map计算相同属性值在data对象出现的次数和
            var sortMap = {};
            for(var i = 0 ; i < data.length ; i++){
                for(var prop in data[i]){
                    if(prop == fieldName){
                        var key = data[i][prop]
                        if(key){
                            if(sortMap.hasOwnProperty(key)){
                                sortMap[key] = sortMap[key] * 1 + 1;
                            } else {
                                sortMap[key] = 1;
                            }
                            break;
                        }
                    }
                }
            }

            var index = 0;
            for(var prop in sortMap){
                var count = sortMap[prop] * 1;
                if(count>1){
                    $(target).bootstrapTable('mergeCells',{index:index, field:fieldName, colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"checkbox", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"cz", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"semesterId", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"studentNum", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"studentName", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"studentDepartmentName", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"semesterMajor", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"className", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"osysCnCourseName", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"osysEnCourseName", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"osysCourseModular", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"osysCourseCredit", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"osysCourseTotalHour", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"osysCourseScore", colspan: colspan, rowspan:count});
                }else{

                }
                index += count;
            }
        }

        $scope.classCurriculaRecordTable = {
           // url: 'data_test/score/tableview_majorScheme.json',
            url:app.api.address + '/score/outSysScoreReview/queryScoreBinding',
            //url: app.api.address + '/scheme/classScheme/applyRecord',
            method: 'get',
            cache: false,
            toolbar: '#toolbar_tab2', //工具按钮用哪个容器
            height: $scope.classCurriculaRecordTableHeight,
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
            queryParams: $scope.recordQueryParams,//传递参数（*）
            search: false,
            showColumns: true,
            showRefresh: true,
            responseHandler:function(response){
                return response.data;
            },
            onLoadSuccess: function() {
                $compile(angular.element('#classCurriculaRecordTable').contents())($scope);
                angular.element('#classCurriculaRecordTable').bootstrapTable('resetView',{ height: $scope.classCurriculaRecordTableHeight } );

                //合并单元格
                var data = $('#classCurriculaRecordTable').bootstrapTable('getData', true);
                // mergeCells(data, "id", 1, $('#classCurriculaRecordTable'));
                mergeCells(data, "studentScoreId", 1, $('#classCurriculaRecordTable'));
                if(myCount){
                    mergeCells2(data, "outSysScoreId", 1, $('#classCurriculaRecordTable'));
                }
            },
            columns: [
                {field:"checkbox",checkbox: true, width: "5%"},
                // {field:"id"},
                {field:"studentScoreId",visible:false},
                {field:"semesterId", title:"学年学期",align:"center",valign:"middle"},
                {field:"studentNum", title:"学号",align:"center",valign:"middle"},
                {field:"studentName", title:"姓名",align:"center",valign:"middle"},
                {field:"studentDepartmentName", title:"所属学院",align:"center",valign:"middle"},
                {field:"semesterMajor",title:"年级专业",align:"center",valign:"middle"},
                {field:"className",title:"班级",align:"center",valign:"middle"},
                {field:"cnCourseName",title:"中文课程名称",align:"center",valign:"middle"},
                {field:"enCourseName",title:"英文课程名称",align:"center",valign:"middle"},
                {field:"courseModual",title:"课程模块",align:"center",valign:"middle"},
                {field:"credit",title:"学分",align:"center",valign:"middle"},
                {field:"totalHour",title:"学时",align:"center",valign:"middle"},
                // {field:"scoreType",title:"成绩类别",align:"center",valign:"middle"},
                {field:"score",title:"成绩",align:"center",valign:"middle"},
                {field:"outSysScoreId",visible:false},
                {field:"osysCnCourseName",title:"系统外中文课程名称",align:"center",valign:"middle"},
                {field:"osysEnCourseName",title:"系统外英文课程名称",align:"center",valign:"middle"},
                {field:"osysCourseModular",title:"系统外课程模块",align:"center",valign:"middle"},
                {field:"osysCourseCredit",title:"系统外课程学分",align:"center",valign:"middle"},
                {field:"osysCourseTotalHour",title:"系统外课程学时",align:"center",valign:"middle"},
                //{field:"osysScoreType",title:"系统外成绩类别",align:"center",valign:"middle"},
                {field:"osysCourseScore",title:"系统外课程成绩",align:"center",valign:"middle"},
                {field:"cz",title:"操作",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        var updateBtn = "<button id='btn_fzrsz'  type='button' ng-click='updateCourse(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>修改</button>";
                        var delBtn = "<button id='btn_fzrsz'  type='button' ng-click='deleteBinding(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>删除</button>";
                        return updateBtn+delBtn;
                    }

                }
            ]
        };
        
        // 判断卡片是都被点击
        $scope.clickAlready2 = function(){
			angular.element('#classCurriculaRecordTable').bootstrapTable('refresh');
        };

        // 查询表单显示和隐藏切换
        $scope.isHideSearchForm = false; // 默认显示
        $scope.searchFormHideToggle = function () {
            $scope.isHideSearchForm = !$scope.isHideSearchForm
            if ($scope.isHideSearchForm) {
                $scope.classCurriculaRecordTableHeight = $scope.classCurriculaRecordTableHeight + 115;
            } else {
                $scope.classCurriculaRecordTableHeight = $scope.classCurriculaRecordTableHeight - 115;
            }
            angular.element('#classCurriculaRecordTable').bootstrapTable('resetView',{ height: $scope.classCurriculaRecordTableHeight } );
        };
        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#classCurriculaRecordTable').bootstrapTable('selectPage', 1);
           // angular.element('#classCurriculaRecordTable').bootstrapTable('refresh');
        };
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.outSideMaintain = {};
            angular.element('form[name="curriculaSearchForm1"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#classCurriculaRecordTable').bootstrapTable('refresh');
        };

    };
    score_outSideMaintainController.$inject = ['baseinfo_generalService', 'app', '$compile', '$scope', '$uibModal', '$rootScope', '$window', '$timeout', 'score_outSideMaintainService', 'alertService'];

    // 删除控制器
    var delController = function ($scope, $uibModalInstance, item, score_outSideMaintainService, alertService) {
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {
            // var ids = []; // 代码类型号数组
            // items.forEach (function(courseArrange) {
            //     ids.push(courseArrange.id);
            // });
            score_outSideMaintainService.delete(item.id, function (error, message) {
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#classCurriculaTable').bootstrapTable('refresh');
                alertService('success', '删除成功');
            });
            $uibModalInstance.close();
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    delController.$inject = ['$scope', '$uibModalInstance', 'item', 'score_outSideMaintainService', 'alertService'];

    // 删除控制器
    var deleteBindingController = function ($scope, $uibModalInstance, item, score_outSideMaintainService, alertService) {
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {
            // var ids = []; // 代码类型号数组
            // items.forEach (function(courseArrange) {
            //     ids.push(courseArrange.id);
            // });
            score_outSideMaintainService.deleteBinding(item.id, function (error, message) {
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#classCurriculaRecordTable').bootstrapTable('refresh');
                alertService('success', '删除成功');
            });
            $uibModalInstance.close();
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    deleteBindingController.$inject = ['$scope', '$uibModalInstance', 'item', 'score_outSideMaintainService', 'alertService'];

    // 新增
    var addController = function ($rootScope, $uibModal, $compile, app, $scope, $uibModalInstance, baseinfo_generalService,score_outSideMaintainService) {
        // $scope.outSideMaintain = {};
        baseinfo_generalService.findAcadyeartermNamesBox(function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.semesterObjs = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.id as plateObj.acadYearSemester  for plateObj in semesterObjs" '
                +  ' ng-model="outSideMaintain.semesterId" id="semesterId" name="semesterId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#semesterId").parent().empty().append(html);
            $compile(angular.element("#semesterId").parent().contents())($scope);
        });
        score_outSideMaintainService.findCourseModel(function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.courseModularObjs = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.id as plateObj.name  for plateObj in courseModularObjs" '
                +  ' ng-model="outSideMaintain.courseModular" id="courseModular" name="courseModular" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#courseModular").parent().empty().append(html);
            $compile(angular.element("#courseModular").parent().contents())($scope);
        });
        $scope.selectStudent = function () {
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/score/outsideSystemScore/outSideMaintain/selector.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return $scope.outSideMaintain;
                    }
                },
                controller: score_studentSelectController
            });
        }
        $scope.ok = function (form) {
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            score_outSideMaintainService.add($scope.outSideMaintain, function (error, message) {
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#classCurriculaTable').bootstrapTable('refresh');
                $uibModalInstance.close();
                alertService('success', '新增成功');
            });
        }
        
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    };
    addController.$inject = ['$rootScope', '$uibModal', '$compile', 'app','$scope', '$uibModalInstance', 'baseinfo_generalService','score_outSideMaintainService'];
    // 修改
    var updateController = function ($rootScope, $uibModal, $compile, app, $scope, $uibModalInstance, item, score_outSideMaintainService, alertService, formVerifyService,baseinfo_generalService) {
        $scope.outSideMaintain = item;
        $scope.outSideMaintain.totalHour = parseFloat(item.totalHour);
        $scope.outSideMaintain.credit = parseFloat(item.credit);
        $scope.outSideMaintain.score = parseFloat(item.score);
        baseinfo_generalService.findAcadyeartermNamesBox(function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.semesterObjs = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.id as plateObj.acadYearSemester  for plateObj in semesterObjs" '
                +  ' ng-model="outSideMaintain.semesterId" id="semesterId" name="semesterId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#semesterId").parent().empty().append(html);
            $compile(angular.element("#semesterId").parent().contents())($scope);
        });
        score_outSideMaintainService.findCourseModel(function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.courseModularObjs = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.id as plateObj.name  for plateObj in courseModularObjs" '
                +  ' ng-model="outSideMaintain.courseModular" id="courseModular" name="courseModular" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#courseModular").parent().empty().append(html);
            $compile(angular.element("#courseModular").parent().contents())($scope);
        });
        $scope.ok = function () {
            score_outSideMaintainService.update($scope.outSideMaintain, function (error, message) {
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#classCurriculaTable').bootstrapTable('refresh');
                $uibModalInstance.close();
                alertService('success', '修改成功');
            });
        }

        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    };
    updateController.$inject = ['$rootScope', '$uibModal', '$compile', 'app','$scope', '$uibModalInstance', 'item', 'score_outSideMaintainService', 'alertService', 'formVerifyService', 'baseinfo_generalService'];

    // 绑定课程
    var bindCourseController = function ($rootScope, $uibModal, $compile, app, $scope, $uibModalInstance, item, score_outSideMaintainService, alertService, formVerifyService) {
        $scope.outSideMaintain = {};
        // $scope.param = {outSysBindingId:item.id,studentNum:item.studentNum};
        $scope.updateParams = function versionModelQueryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
            };
            //$rootScope.$log.debug(angular.extend(pageParam, $scope.param));
            return angular.extend(pageParam,$scope.outSideMaintain);
        }
        var radio = true;
        var checkbox = false;
        if(item){
            radio = false;
            checkbox = true;
        }

        $scope.selectStudent = function () {
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/score/outsideSystemScore/outSideMaintain/selector.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return $scope.outSideMaintain;
                    }
                },
                controller: score_studentSelectController
            });
        }
        $scope.ok = function () {
            var outRows = angular.element('#outsideCourseTable').bootstrapTable('getSelections');
            var studentRows = angular.element('#courseCurriculaTable').bootstrapTable('getSelections');
            var outSysScoreIds = [];
            var studentScoreIds = [];
            outRows.forEach(function(outsideCourse,index) {
                outSysScoreIds.push(outsideCourse.xtwcj_ID);
            });
            studentRows.forEach(function(course,index) {
                studentScoreIds.push(course.xscjd_ID);
            });
            score_outSideMaintainService.courseBinding(outSysScoreIds,studentScoreIds, function (error, message) {
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#classCurriculaRecordTable').bootstrapTable('refresh');
                $uibModalInstance.close();
                alertService('success', '绑定成功');
            });
        }
        $scope.outsideCourseTable =  {
            //url: 'data_test/scheme/tableview_SchemeVersion.json',
            url: app.api.address + '/score/outSysScoreApply/queryOutSysCourseInfoByBindId',
            method: 'get',
            cache: false,
            height: 400,
            // sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            // striped: true,
            // pagination: true,
            // pageSize: 10,
            // pageNumber:1,
            // pageList: [10, 20, 30], // 设置可供选择的页面数据条数
            // paginationPreText: '上一页',
            // paginationNextText: '下一页',
            // silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField : "id", // 指定主键列
            uniqueId: "id", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.updateParams,//传递参数（*）
            search: false,
            clickToSelect: true,
            responseHandler:function(response){
                return response.data;
            },
            onLoadSuccess: function(data) {
                $compile(angular.element('#outsideCourseTable').contents())($scope);
                // var ids = [];
                // data.forEach(function(outsideCourse) {
                //     if(item.id==outsideCourse.bdcjd_ID){
                //         ids.push(outsideCourse.xtwcj_ID);
                //     }
                // });
                // angular.element('#outsideCourseTable').bootstrapTable('checkBy',  {field:"xtwcj_ID", values:ids});
                // $scope.$apply(function () {
                //     $scope.completeCredit = 0;
                //     for(var index=0; index < data.rows.length; index++){
                //         $scope.completeCredit += parseFloat(data.rows[index].credit);
                //     }
                // });
            },
            columns: [
                {radio: checkbox,checkbox:radio, width: "5%"},
                {field:"bdcjd_ID",visible:false},
                {field:"xtwcj_ID",visible:false},
                {field:"cnCourseName",title:"课程中文名",align:"center",valign:"middle"},
                {field:"enCourseName",title:"课程英文名",align:"center",valign:"middle"},
                // {field:"deparementName",title:"开课单位",align:"center",valign:"middle"},
                {field:"courseProperty",title:"课程属性",align:"center",valign:"middle"},
                {field:"credit",title:"学分",align:"center",valign:"middle"}
            ]
        };
        $scope.courseCurriculaTable =  {
            //url: 'data_test/scheme/tableview_SchemeVersion.json',
            url: app.api.address + '/score/outSysScoreApply/queryCourseInfoByBindId',
            method: 'get',
            cache: false,
            height: 400,
            // sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            // striped: true,
            // pagination: true,
            // pageSize: 10,
            // pageNumber:1,
            // pageList: [10, 20, 30], // 设置可供选择的页面数据条数
            // paginationPreText: '上一页',
            // paginationNextText: '下一页',
            // silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField : "id", // 指定主键列
            uniqueId: "id", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.updateParams,//传递参数（*）
            search: false,
            clickToSelect: true,
            responseHandler:function(response){
                return response.data;
            },
            onLoadSuccess: function(data) {
                $compile(angular.element('#courseCurriculaTable').contents())($scope);
                var courseIndex = 0;
                // data.forEach(function(outsideCourse,index) {
                //     if(item.id==outsideCourse.bdcjd_ID){
                //         courseIndex=index;
                //     }
                // });
                // angular.element('#courseCurriculaTable').bootstrapTable('check',  courseIndex);
                // var courseIds = [];
                // data.forEach(function(course) {
                //     if(item.id==course.bdcjd_ID){
                //         courseIds.push(course.xscjd_ID);
                //     }
                // });
                // angular.element('#courseCurriculaTable').bootstrapTable('checkBy',  {field:"xscjd_ID", values:courseIds});
            },
            columns: [
                {radio: radio,checkbox:checkbox, width: "5%"},
                {field:"bdcjd_ID",visible:false},
                {field:"xscjd_ID",visible:false},
                {field:"cnCourseName",title:"课程中文名",align:"center",valign:"middle"},
                {field:"enCourseName",title:"课程英文名",align:"center",valign:"middle"},
                {field:"departmentName",title:"开课单位",align:"center",valign:"middle",width:"35%"},
                {field:"courseProperty",title:"课程属性",align:"center",valign:"middle"},
                {field:"credit",title:"学分",align:"center",valign:"middle"}
            ]
        };
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    };
    bindCourseController.$inject = ['$rootScope', '$uibModal', '$compile', 'app','$scope', '$uibModalInstance', 'item', 'score_outSideMaintainService', 'alertService', 'formVerifyService'];
    // 修改绑定课程
    var updateCourseController = function ($rootScope, $uibModal, $compile, app, $scope, $uibModalInstance, item, score_outSideMaintainService, alertService, formVerifyService) {
        $scope.outSideMaintain = item;
        $scope.param = {outSysBindingId:item.id,studentNum:item.studentNum};
        $scope.updateParams = function versionModelQueryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
            };
            //$rootScope.$log.debug(angular.extend(pageParam, $scope.param));
            return angular.extend(pageParam,$scope.param);
        }
        $scope.ok = function () {
            var outRows = angular.element('#outsideCourseTable').bootstrapTable('getSelections');
            var studentRows = angular.element('#courseCurriculaTable').bootstrapTable('getSelections');
            var outSysScoreIds = [];
            var studentScoreIds = [];
            outRows.forEach(function(outsideCourse,index) {
                outSysScoreIds.push(outsideCourse.xtwcj_ID);
            });
            studentRows.forEach(function(course,index) {
                studentScoreIds.push(course.xscjd_ID);
            });
            score_outSideMaintainService.updateCourseBinding(item.id,outSysScoreIds,studentScoreIds, function (error, message) {
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#classCurriculaTable').bootstrapTable('refresh');
                $uibModalInstance.close();
                alertService('success', '修改成功');
            });
        }
        var radio = true;
        var checkbox = false;
        if(item.type="manyToOne"){
            radio = false;
            checkbox = true;
        }
        $scope.outsideCourseTable =  {
            //url: 'data_test/scheme/tableview_SchemeVersion.json',
            url: app.api.address + '/score/outSysScoreApply/queryOutSysCourseInfoByBindId',
            method: 'get',
            cache: false,
            height: 400,
            // sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            // striped: true,
            // pagination: true,
            // pageSize: 10,
            // pageNumber:1,
            // pageList: [10, 20, 30], // 设置可供选择的页面数据条数
            // paginationPreText: '上一页',
            // paginationNextText: '下一页',
            // silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField : "id", // 指定主键列
            uniqueId: "id", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.updateParams,//传递参数（*）
            search: false,
            clickToSelect: true,
            responseHandler:function(response){
                return response.data;
            },
            onLoadSuccess: function(data) {
                $compile(angular.element('#outsideCourseTable').contents())($scope);
                var ids = [];
                var courseIndex = 0;
                data.forEach(function(outsideCourse,index) {
                    if(item.id==outsideCourse.bdcjd_ID){
                        ids.push(outsideCourse.xtwcj_ID);
                        courseIndex=index;
                    }
                });
                if(checkbox){
                    if(data.length>0){
                        angular.element('#outsideCourseTable').bootstrapTable('check',  courseIndex);
                    }
                }else{
                    angular.element('#outsideCourseTable').bootstrapTable('checkBy',  {field:"xtwcj_ID", values:ids});
                }

                // $scope.$apply(function () {
                //     $scope.completeCredit = 0;
                //     for(var index=0; index < data.rows.length; index++){
                //         $scope.completeCredit += parseFloat(data.rows[index].credit);
                //     }
                // });
            },
            columns: [
                {radio: checkbox,checkbox:radio, width: "5%"},
                {field:"bdcjd_ID",visible:false},
                {field:"xtwcj_ID",visible:false},
                {field:"cnCourseName",title:"课程中文名",align:"center",valign:"middle"},
                {field:"enCourseName",title:"课程英文名",align:"center",valign:"middle"},
                // {field:"deparementName",title:"开课单位",align:"center",valign:"middle"},
                {field:"courseProperty",title:"课程属性",align:"center",valign:"middle"},
                {field:"credit",title:"学分",align:"center",valign:"middle"}
            ]
        };
        $scope.courseCurriculaTable =  {
            //url: 'data_test/scheme/tableview_SchemeVersion.json',
            url: app.api.address + '/score/outSysScoreApply/queryCourseInfoByBindId',
            method: 'get',
            cache: false,
            height: 400,
            // sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            // striped: true,
            // pagination: true,
            // pageSize: 10,
            // pageNumber:1,
            // pageList: [10, 20, 30], // 设置可供选择的页面数据条数
            // paginationPreText: '上一页',
            // paginationNextText: '下一页',
            // silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField : "id", // 指定主键列
            uniqueId: "id", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.updateParams,//传递参数（*）
            search: false,
            clickToSelect: true,
            responseHandler:function(response){
                return response.data;
            },
            onLoadSuccess: function(data) {
                $compile(angular.element('#courseCurriculaTable').contents())($scope);
                var ids = [];
                var courseIndex = 0;
                data.forEach(function(outsideCourse,index) {
                    if(item.id==outsideCourse.bdcjd_ID){
                        ids.push(outsideCourse.xscjd_ID);
                        courseIndex=index;
                    }
                });
                if(checkbox){
                    angular.element('#courseCurriculaTable').bootstrapTable('checkBy',  {field:"xscjd_ID", values:ids});
                }else{
                    if(data.length>0){
                        angular.element('#courseCurriculaTable').bootstrapTable('check',  courseIndex);
                    }
                }
                // var courseIds = [];
                // data.forEach(function(course) {
                //     if(item.id==course.bdcjd_ID){
                //         courseIds.push(course.xscjd_ID);
                //     }
                // });
                // angular.element('#courseCurriculaTable').bootstrapTable('checkBy',  {field:"xscjd_ID", values:courseIds});
            },
            columns: [
                {radio: radio,checkbox:checkbox, width: "5%"},
                {field:"bdcjd_ID",visible:false},
                {field:"xscjd_ID",visible:false},
                {field:"cnCourseName",title:"课程中文名",align:"center",valign:"middle"},
                {field:"enCourseName",title:"课程英文名",align:"center",valign:"middle"},
                {field:"departmentName",title:"开课单位",align:"center",valign:"middle",width:"35%"},
                {field:"courseProperty",title:"课程属性",align:"center",valign:"middle"},
                {field:"credit",title:"学分",align:"center",valign:"middle"}
            ]
        };
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    };
    updateCourseController.$inject = ['$rootScope', '$uibModal', '$compile', 'app','$scope', '$uibModalInstance', 'item', 'score_outSideMaintainService', 'alertService', 'formVerifyService'];





    var deleteController = function ($rootScope, formVerifyService,$compile, $scope, $uibModalInstance, score_outSideMaintainService, alertService, pScope) {
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {

            $rootScope.showLoading = true; // 开启加载提示
            score_outSideMaintainService.addCourseChange(pScope.courseInfo,function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                pScope.creditValidate(pScope);
                $uibModalInstance.close();
                angular.element('#classCurriculaTable').bootstrapTable('refresh');
               // alertService('success', '删除成功');
            });

        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    }
    deleteController.$inject = ['$rootScope', 'formVerifyService','$compile', '$scope', '$uibModalInstance', 'score_outSideMaintainService', 'alertService', 'pScope'];

})(window);
