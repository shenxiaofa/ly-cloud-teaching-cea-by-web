/**
 * Created by Administrator on 2017-07-18.
 */
;(function (window, undefined) {
    'use strict';

    window.Start_gradeListMaintenanceController = function (baseinfo_generalService,$compile,$scope, $uibModal, $rootScope, $window, start_gradeListMaintenanceService, alertService, app) {
        //年级下拉框
        $scope.gradeData = [{
            id: "",
            value:"==请选择=="
        }];
        start_gradeListMaintenanceService.getGrade(function (error, message, data) {
            if(data != undefined){
                for(var i = 0; i < data.length; i++){
                    $scope.gradeData.push(data[i]);
                }
            }
            var html = '' +
                '<select ng-model="gradeListMaintenance.year"   id="grade" name="grade" ui-jq="chosen" ui-options="{search_contains: true}"  class="form-control">'+
                '<option ng-repeat="date in gradeData" value="{{date.id}}">{{date.value}}</option>'+
                '</select>';
            angular.element("#grade").parent().empty().append(html);
            $compile(angular.element("#grade").parent().contents())($scope);

        });

        //学院下拉框
        $scope.facultyData = [{
            id: "",
            departmentName:"==请选择=="
        }];
        baseinfo_generalService.findDepartmentNamesBox(function (error, message, data) {
            for(var i = 0; i < data.data.length; i++){
                $scope.facultyData.push(data.data[i]);
            }
            var html = '' +
                '<select ng-model="gradeListMaintenance.facultyId"  id="facultyId" name="facultyId" ui-jq="chosen" ui-options="{search_contains: true}"  class="form-control">'+
                '<option ng-repeat="date in facultyData" value="{{date.id}}">{{date.departmentName}}</option>'+
                '</select>';
            angular.element("#facultyId").parent().empty().append(html);
            $compile(angular.element("#facultyId").parent().contents())($scope);

        });

        //专业下拉框
        $scope.professionData = [{
            id: "",
            name:"==请选择=="
        }];
        baseinfo_generalService.professionDirectionPull({majorProfessionDircetion : ''},function (error, message, data) {
            for(var i = 0; i < data.data.length; i++){
                $scope.professionData.push(data.data[i]);
            }
            var html = '' +
                '<select ng-model="gradeListMaintenance.professionId"  id="professionalDirection" name="professionalDirection" ui-jq="chosen" ui-options="{search_contains: true}"  class="form-control">'+
                '<option ng-repeat="date in professionData" value="{{date.id}}">{{date.name}}</option>'+
                '</select>';
            angular.element("#professionalDirection").parent().empty().append(html);
            $compile(angular.element("#professionalDirection").parent().contents())($scope);

        });

        //行政班下拉框数据
        $scope.executiveClassData = [
            {
                id: "",
                name:"==请选择=="
            }
        ];
        start_gradeListMaintenanceService.executiveClass(function (error, message, data) {
            for(var i = 0; i < data.length; i++){
                $scope.executiveClassData.push(data[i]);
            }
            var html = '' +
                '<select ng-model="gradeListMaintenance.executiveClassId"   id="executiveClassId" name="executiveClassId" ui-jq="chosen" ui-options="{search_contains: true}"  class="form-control">'+
                '<option ng-repeat="date in executiveClassData" value="{{date.id}}">{{date.name}}</option>'+
                '</select>';
            angular.element("#executiveClassId").parent().empty().append(html);
            $compile(angular.element("#executiveClassId").parent().contents())($scope);
        });

        //学号下拉框
        $scope.numData = [{
            schoolId: "",
            num:"==请选择=="
        }];
        start_gradeListMaintenanceService.getStudent(function (error, message, data) {
            if(data != undefined){
                for(var i = 0; i < data.length; i++){
                    $scope.numData.push(data[i]);
                }
            }
            var html = '' +
                '<select ng-model="gradeListMaintenance.num"   id="StudentId" name="StudentId" ui-jq="chosen" ui-options="{search_contains: true}"  class="form-control">'+
                '<option ng-repeat="date in numData" value="{{date.schoolId}}">{{date.num}}</option>'+
                '</select>';
            angular.element("#StudentId").parent().empty().append(html);
            $compile(angular.element("#StudentId").parent().contents())($scope);

        });

        //姓名下拉框数据
        $scope.nameData = [
            {
                schoolId: "",
                name:"==请选择=="
            }
        ];
        start_gradeListMaintenanceService.getStudent(function (error, message, data) {
            for(var i = 0; i < data.length; i++){
                $scope.nameData.push(data[i]);
            }
            var html = '' +
                '<select ng-model="gradeListMaintenance.studentId"   id="name" name="name" ui-jq="chosen" ui-options="{search_contains: true}"  class="form-control">'+
                '<option ng-repeat="date in nameData" value="{{date.schoolId}}">{{date.name}}</option>'+
                '</select>';
            angular.element("#name").parent().empty().append(html);
            $compile(angular.element("#name").parent().contents())($scope);
        });

        //等级类型下拉框数据
        $scope.rankTypeData = [
            {
                id: "",
                name:"==请选择=="
            }
        ];
        start_gradeListMaintenanceService.getRankType(function (error, message, data) {
            for(var i = 0; i < data.length; i++){
                $scope.rankTypeData.push(data[i]);
            }
            var html = '' +
                '<select ng-model="gradeListMaintenance.levelType"   id="rankType" name="rankType" ui-jq="chosen" ui-options="{search_contains: true}"  class="form-control">'+
                '<option ng-repeat="date in rankTypeData" value="{{date.id}}">{{date.name}}</option>'+
                '</select>';
            angular.element("#rankType").parent().empty().append(html);
            $compile(angular.element("#rankType").parent().contents())($scope);
        });

        //等级代码下拉框数据
        $scope.rankData = [
            {
                id: "",
                name:"==请选择=="
            }
        ];
        start_gradeListMaintenanceService.getCode(function (error, message, data) {
            for(var i = 0; i < data.length; i++){
                $scope.rankData.push(data[i]);
            }
            var html = '' +
                '<select ng-model="gradeListMaintenance.gradeId"   id="rank" name="rank" ui-jq="chosen" ui-options="{search_contains: true}"  class="form-control">'+
                '<option ng-repeat="date in rankData" value="{{date.id}}">{{date.name}}</option>'+
                '</select>';
            angular.element("#rank").parent().empty().append(html);
            $compile(angular.element("#rank").parent().contents())($scope);
        });

        start_gradeListMaintenanceService.getSemester(function (data) {
            if(data != undefined){
                $scope.sznj = data.semesterId;
                // var kssj = Date.parse(data.startTime);
                // var jssj = Date.parse(data.endTime);
                $scope.kssj = data.startTime;
                $scope.jssj = data.endTime;
            }
        });

        // 表格的高度
        $scope.toolbar_height = angular.element('#toolbar').height();
        $scope.menu_height = angular.element('#menu').height();
        $scope.search_height = angular.element('#searchHeight').height();
        $scope.table_height = $window.innerHeight - $scope.toolbar_height - $scope.menu_height - $scope.search_height - 60;
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var attributeNamesForOrderBy = {};
            attributeNamesForOrderBy[params.sortName] = params.sortOrder;
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                attributeNamesForOrderBy: attributeNamesForOrderBy
            };
            return angular.extend(pageParam, $scope.gradeListMaintenance);
        }
        $scope.showTable = {
            onLoadSuccess: function() {
                $compile(angular.element('#showTable').contents())($scope);
            },
            // url: 'data_test/starts/tableview_gradeListMaintenance.json',
            url: app.api.address + '/virtual-class/studentGradeVo',
            method: 'get',
            cache: false,
            height: $scope.table_height,
            toolbar: '#toolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [5,10, 20, 30, 50, 100], // 设置可供选择的页面数据条数
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            sortName: 'num', // 默认排序字段
            sortOrder: 'asc', // 默认排序方式
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
            columns: [
                {checkbox: true, width: "5%"},
                {field:"id", title:"主键", visible:false},
                {field:"",title:"序号",align:"center",valign:"middle", width: "5%", formatter: function (value, row, index) {
                    return index+1;
                }},
                {field:"year",title:"年级",align:"center",valign:"middle"},
                {field:"faculty",title:"学院",align:"center",valign:"middle"},
                {field:"profession",title:"专业方向",align:"center",valign:"middle"},
                {field:"executiveClassName",title:"班级",align:"center",valign:"middle"},
                {field:"num",title:"学号",align:"center",valign:"middle",sortable:true},
                {field:"name",title:"姓名",align:"center",valign:"middle"},
                {field:"levelTypeName",title:"等级类别",align:"center",valign:"middle"},
                {field:"gradeName",title:"等级",align:"center",valign:"middle"}
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
            angular.element('#showTable').bootstrapTable('resetView',{ height: $scope.table_height } );
        };

        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#showTable').bootstrapTable('selectPage', 1);
            // angular.element('#showTable').bootstrapTable('refresh');
        };
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.gradeListMaintenance = {};
            $scope.gradeListMaintenance.grade = "";
            $scope.gradeListMaintenance.facultyId = "";
            $scope.gradeListMaintenance.professionalDirection = "";
            $scope.gradeListMaintenance.executiveClassId = "";
            $scope.gradeListMaintenance.StudentId = "";
            $scope.gradeListMaintenance.name = "";
            $scope.gradeListMaintenance.rankType = "";
            $scope.gradeListMaintenance.rank = "";
            angular.element('#showTable').bootstrapTable('refresh');
            angular.element('form[name="gradeListMaintenanceSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
        };

        // 打开新增面板
        $scope.openAdd = function(){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/starts/gradeListMaintenance/add.html',
                size: 'lg',
                controller: addController
            });
        };
        // 打开修改面板
        $scope.openModify = function(){
            var rows = angular.element('#showTable').bootstrapTable('getSelections');
            if(rows.length == 0){
                alertService('请先选择需修改的项');
                return;
            }
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/starts/gradeListMaintenance/modify.html',
                size: '',
                resolve: {
                    items: function () {
                        return rows;
                    }
                },
                controller: modifyController
            });
        };

        // 打开删除面板
        $scope.openDelete = function(){
            var rows = angular.element('#showTable').bootstrapTable('getSelections');
            if(rows.length == 0){
                alertService('请先选择要删除的项');
                return;
            }
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/starts/gradeListMaintenance/delete.html',
                size: '',
                resolve: {
                    items: function () {
                        return rows;
                    },
                },
                controller: deleteController
            });
        };
    };
    Start_gradeListMaintenanceController.$inject = ['baseinfo_generalService','$compile','$scope', '$uibModal', '$rootScope', '$window', 'start_gradeListMaintenanceService', 'alertService', 'app'];

    // 添加控制器
    var addController = function (baseinfo_generalService,app,$compile, $scope, $uibModalInstance, $uibModal, start_gradeListMaintenanceService, formVerifyService, alertService) {
        // 等级类型下拉框数据
        $scope.gradeTypeData = [
        ];
        $scope.gradeListMaintenance = {};
        start_gradeListMaintenanceService.getGradeType(function (error, message, data) {
            for(var i = 0; i < data.length; i++){
                $scope.gradeTypeData.push(data[i]);
            }
            var html = '' +
                '<select ng-model="gradeListMaintenance.mergeId"  ng-required="true" id="mergeId" name="mergeId" ui-jq="chosen" ui-options="{search_contains: true}"  class="form-control">'+
                '<option ng-repeat="date in gradeTypeData" value="{{date.mergeId}}">{{date.mergeName}}</option>'+
                '</select>';
            angular.element("#mergeId").parent().empty().append(html);
            $compile(angular.element("#mergeId").parent().contents())($scope);
            if($scope.gradeTypeData.length != 0){
                $scope.gradeListMaintenance.mergeId = $scope.gradeTypeData[0].mergeId;
                // $scope.mergeName = $scope.gradeTypeData[1].mergeName;
                $scope.mergeId = $scope.gradeListMaintenance.mergeId;
            }
        });

        //校区下拉框数据
        $scope.facultyData = [
            {
                id: "",
                departmentName:"==请选择=="
            }
        ];
        baseinfo_generalService.findDepartmentNamesBox(function (error, message, data) {
            for(var i = 0; i < data.data.length; i++){
                $scope.facultyData.push(data.data[i]);
            }
            var html = '' +
                '<select ng-model="gradeListMaintenance.facultyId"  ng-required="true" id="facultyId" name="facultyId" ui-jq="chosen" ui-options="{search_contains: true}"  class="form-control">'+
                '<option ng-repeat="date in facultyData" value="{{date.id}}">{{date.departmentName}}</option>'+
                '</select>';
            angular.element("#facultyId").parent().empty().append(html);
            $compile(angular.element("#facultyId").parent().contents())($scope);
        });

        //专业下拉框数据
        $scope.professionData = [
            {
                id: "",
                name:"==请选择=="
            }
        ];
        baseinfo_generalService.professionDirectionPull({majorProfessionDircetion:'1'},function (error, message, data) {
            for(var i = 0; i < data.data.length; i++){
                $scope.professionData.push(data.data[i]);
            }
            var html = '' +
                '<select ng-model="gradeListMaintenance.professionId"  ng-required="true" id="professionId" name="professionId" ui-jq="chosen" ui-options="{search_contains: true}"  class="form-control">'+
                '<option ng-repeat="date in professionData" value="{{date.id}}">{{date.name}}</option>'+
                '</select>';
            angular.element("#professionId").parent().empty().append(html);
            $compile(angular.element("#professionId").parent().contents())($scope);
        });

        //行政班下拉框数据
        $scope.executiveClassData = [
            {
                id: "",
                name:"==请选择=="
            }
        ];
        start_gradeListMaintenanceService.executiveClass(function (error, message, data) {
            for(var i = 0; i < data.length; i++){
                $scope.executiveClassData.push(data[i]);
            }
            var html = '' +
                '<select ng-model="gradeListMaintenance.executiveClassId"  ng-required="true" id="executiveClassId" name="executiveClassId" ui-jq="chosen" ui-options="{search_contains: true}"  class="form-control">'+
                '<option ng-repeat="date in executiveClassData" value="{{date.id}}">{{date.name}}</option>'+
                '</select>';
            angular.element("#executiveClassId").parent().empty().append(html);
            $compile(angular.element("#executiveClassId").parent().contents())($scope);
        });

        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var attributeNamesForOrderBy = {};
            attributeNamesForOrderBy[params.sortName] = params.sortOrder;
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                attributeNamesForOrderBy: attributeNamesForOrderBy
            };
            return angular.extend(pageParam, $scope.gradeListMaintenance);
        }
        $scope.showTable1 = {
            onLoadSuccess: function() {
                $compile(angular.element('#showTable1').contents())($scope);
            },
            // url: 'data_test/starts/tableview_gradeListMaintenance.json',
            url: app.api.address + '/virtual-class/studentInformation/filter',
            method: 'get',
            cache: false,
            // height: $scope.table_height,
            toolbar: '', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [5,10, 20, 30, 50, 100], // 设置可供选择的页面数据条数
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            sortName: 'num', // 默认排序字段
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
            columns: [
                {checkbox: true, width: "5%"},
                {field:"id", title:"主键", visible:false},
                {field:"",title:"序号",align:"center",valign:"middle", width: "5%", formatter: function (value, row, index) {
                    return index+1;
                }},
                {field:"faculty",title:"学院",align:"center",valign:"middle"},
                {field:"profession",title:"专业",align:"center",valign:"middle"},
                {field:"executiveClassName",title:"行政班级",align:"center",valign:"middle"},
                {field:"num",title:"学号",align:"center",valign:"middle",sortable:true},
                {field:"name",title:"姓名",align:"center",valign:"middle"}
            ]
        };

        $scope.look = function () {
            $scope.ids = angular.element("#levelTypeId").val();
            angular.element('#showTable1').bootstrapTable('refresh');
        };

        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#showTable1').bootstrapTable('selectPage', 1);
            // angular.element('#showTable1').bootstrapTable('refresh');
        };
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.gradeListMaintenance = {};
            $scope.gradeListMaintenance.facultyId = "";
            $scope.gradeListMaintenance.professionId = "";
            $scope.gradeListMaintenance.executiveClassId = "";
            $scope.gradeListMaintenance.mergeId = $scope.mergeId;
            angular.element('#showTable1').bootstrapTable('refresh');
            angular.element('form[name="gradeListMaintenanceSearchForm"] select[id="name"]').val("").trigger("chosen:updated");
            angular.element('form[name="gradeListMaintenanceSearchForm"] select[id="facultyId"]').val("").trigger("chosen:updated");
            angular.element('form[name="gradeListMaintenanceSearchForm"] select[id="professionId"]').val("").trigger("chosen:updated");
            angular.element('form[name="gradeListMaintenanceSearchForm"] select[id="executiveClassId"]').val("").trigger("chosen:updated");
            angular.element('form[name="gradeListMaintenanceSearchForm"] select[id="mergeId"]').val($scope.mergeId).trigger("chosen:updated");
        };


        $scope.ok = function (form) {
            // 处理前验证
            //  if(form.$invalid) {
            //      // 调用共用服务验证（效果：验证不通过的输入框会变红色）
            //      formVerifyService(form);
            //      return;
            //  };
            var mergeId = $scope.gradeListMaintenance.mergeId;
            if(!mergeId){
                alertService("请先维护等级代码，等级代码不能为空");
                return;
            }
            var rows = angular.element('#showTable1').bootstrapTable('getSelections');
            var ids = []; // 数组
            rows.forEach (function(gradeListMaintenance) {
                ids.push(gradeListMaintenance.schoolId);
            });
            start_gradeListMaintenanceService.add({mergeId:mergeId,ids:ids}, function (error, message) {
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#showTable').bootstrapTable('refresh');
                alertService('success', '新增成功');
            });
        };


        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    };
    addController.$inject = ['baseinfo_generalService','app','$compile', '$scope', '$uibModalInstance', '$uibModal', 'start_gradeListMaintenanceService', 'formVerifyService', 'alertService'];

    // 添加学生信息控制器
    var addStudentController = function (ids,baseinfo_generalService,app,$compile, $scope, $uibModalInstance, $uibModal, start_gradeListMaintenanceService, formVerifyService, alertService) {

        //校区下拉框数据
        $scope.facultyData = [
            {
                id: "",
                departmentName:"==请选择=="
            }
        ];
        baseinfo_generalService.findDepartmentNamesBox(function (error, message, data) {
            for(var i = 0; i < data.data.length; i++){
                $scope.facultyData.push(data.data[i]);
            }
            var html = '' +
                '<select ng-model="studentInfo.facultyId"  ng-required="true" id="facultyId" name="facultyId" ui-jq="chosen" ui-options="{search_contains: true}"  class="form-control">'+
                '<option ng-repeat="date in facultyData" value="{{date.id}}">{{date.departmentName}}</option>'+
                '</select>';
            angular.element("#facultyId").parent().empty().append(html);
            $compile(angular.element("#facultyId").parent().contents())($scope);
        });

        //专业下拉框数据
        $scope.professionData = [
            {
                id: "",
                departmentName:"==请选择=="
            }
        ];
        baseinfo_generalService.professionDirectionPull({majorProfessionDircetion:'1'},function (error, message, data) {
            for(var i = 0; i < data.data.length; i++){
                $scope.professionData.push(data.data[i]);
            }
            var html = '' +
                '<select ng-model="studentInfo.professionId"  ng-required="true" id="professionId" name="professionId" ui-jq="chosen" ui-options="{search_contains: true}"  class="form-control">'+
                '<option ng-repeat="date in professionData" value="{{date.id}}">{{date.departmentName}}</option>'+
                '</select>';
            angular.element("#professionId").parent().empty().append(html);
            $compile(angular.element("#professionId").parent().contents())($scope);
        });

        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var attributeNamesForOrderBy = {};
            attributeNamesForOrderBy[params.sortName] = params.sortOrder;
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                attributeNamesForOrderBy: attributeNamesForOrderBy
            };
            return angular.extend(pageParam, $scope.studentInfo);
        }
        $scope.studentInfoTable = {
            onLoadSuccess: function() {
                $compile(angular.element('#showTable').contents())($scope);
            },
            url: app.api.address + '/virtual-class/studentInformation/filter/',
            method: 'get',
            cache: false,
            // height: $scope.table_height,
            toolbar: '', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [5,10, 20, 30, 50, 100], // 设置可供选择的页面数据条数
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            sortName: 'num', // 默认排序字段
            sortOrder: 'desc', // 默认排序方式
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
            columns: [
                {checkbox: true, width: "5%"},
                {field:"id", title:"主键", visible:false},
                {field:"",title:"序号",align:"center",valign:"middle", width: "5%", formatter: function (value, row, index) {
                    return index+1;
                }},
                {field:"faculty",title:"学院",align:"center",valign:"middle"},
                {field:"profession",title:"专业",align:"center",valign:"middle"},
                {field:"executiveClassName",title:"行政班级",align:"center",valign:"middle"},
                {field:"num",title:"学号",align:"center",valign:"middle",sortable:true},
                {field:"name",title:"姓名",align:"center",valign:"middle"}
            ]
        };

        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#studentInfoTable').bootstrapTable('selectPage', 1);
            // angular.element('#studentInfoTable').bootstrapTable('refresh');
        };
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.studentInfo = {};
            angular.element('#studentInfoTable').bootstrapTable('refresh');
        };


        $scope.ok = function (form) {
            var mergeId = $scope.gradeListMaintenance.mergeId;
            var rows = angular.element('#studentInfoTable').bootstrapTable('getSelections');
            var ids = []; // 数组
            rows.forEach (function(gradeListMaintenance) {
                ids.push(gradeListMaintenance.schoolId);
            });
            start_gradeListMaintenanceService.add({mergeId:mergeId,ids:ids}, function (error, message) {
                if (error) {
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                angular.element('#studentInfoTable').bootstrapTable('refresh');
                alertService('success', '新增成功');
            });
        };


        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    };
    addStudentController.$inject = ['ids','baseinfo_generalService','app','$compile', '$scope', '$uibModalInstance', '$uibModal', 'start_gradeListMaintenanceService', 'formVerifyService', 'alertService'];



    // 修改控制器
    var modifyController = function (app,$compile,$scope, $uibModalInstance, items, start_gradeListMaintenanceService, alertService, formVerifyService) {
        // if(items[0].mergeId == null){
        //     items[0].mergeId = items[0].levelType + items[0].gradeId;
        // }
        $scope.gradeListMaintenance = items[0];
        // 等级类型下拉框数据
        $scope.gradeTypeData = [
            {
                mergeId: "",
                mergeName:"==请选择=="
            }
        ];
        start_gradeListMaintenanceService.getGradeType(function (error, message, data) {
            for(var i = 0; i < data.length; i++){
                $scope.gradeTypeData.push(data[i]);
            }
            var html = '' +
                '<select ng-model="gradeListMaintenance.mergeId" ng-change="look()" ng-required="true" id="levelTypeId" name="levelTypeId" ui-jq="chosen" ui-options="{search_contains: true}"  class="form-control">'+
                '<option ng-repeat="date in gradeTypeData" value="{{date.mergeId}}">{{date.mergeName}}</option>'+
                '</select>';
            angular.element("#levelTypeId").parent().empty().append(html);
            $compile(angular.element("#levelTypeId").parent().contents())($scope);
        });


        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder
            };
            return angular.extend(pageParam, $scope.gradeListMaintenance);
        }
        $scope.showTable2 = {
            onLoadSuccess: function() {
                $compile(angular.element('#showTable2').contents())($scope);
            },
            // url: 'data_test/starts/tableview_gradeListMaintenance.json',
            url: app.api.address + '/virtual-class/studentInformation/filter',
            method: 'get',
            cache: false,
            // height: $scope.table_height,
            toolbar: '#toolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [5,10, 20, 30, 50, 100], // 设置可供选择的页面数据条数
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            sortName: 'grade', // 默认排序字段
            sortOrder: 'desc', // 默认排序方式
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
            columns: [
                {checkbox: true, width: "5%"},
                {field:"id", title:"主键", visible:false},
                {field:"",title:"序号",align:"center",valign:"middle", width: "5%", formatter: function (value, row, index) {
                    return index+1;
                }},
                {field:"faculty",title:"学院",align:"center",valign:"middle"},
                {field:"profession",title:"专业",align:"center",valign:"middle"},
                {field:"executiveClassName",title:"行政班级",align:"center",valign:"middle"},
                {field:"num",title:"学号",align:"center",valign:"middle"},
                {field:"name",title:"姓名",align:"center",valign:"middle"}
            ]
        };

        $scope.look = function () {
            // var ids = angular.element("#levelTypeId").val();
            angular.element('#showTable2').bootstrapTable('refresh');
        };

        $scope.ok = function (form) {
            var mergeId = $scope.gradeListMaintenance.mergeId;
            var ids = []; // 数组
            items.forEach (function(gradeListMaintenance) {
                ids.push(gradeListMaintenance.id);
            });
            start_gradeListMaintenanceService.update({mergeId:mergeId,ids:ids}, function (error, message) {
                if (error) {
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                angular.element('#showTable').bootstrapTable('refresh');
                alertService('success', '修改成功');
            });
        };
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    };
    modifyController.$inject = ['app','$compile','$scope', '$uibModalInstance', 'items', 'start_gradeListMaintenanceService', 'alertService', 'formVerifyService'];


    // 删除控制器
    var deleteController = function ($scope, $uibModalInstance, items, start_gradeListMaintenanceService, alertService) {
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {
            var ids = []; // 代码类型号数组
            items.forEach (function(gradeListMaintenance) {
                ids.push(gradeListMaintenance.id);
            });
            start_gradeListMaintenanceService.delete(ids, function (error, message) {
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#showTable').bootstrapTable('refresh');
                alertService('success', '删除成功');
            });
            $uibModalInstance.close();
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    deleteController.$inject = ['$scope', '$uibModalInstance', 'items', 'start_gradeListMaintenanceService', 'alertService'];

})(window);

