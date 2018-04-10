;(function (window, undefined) {
    'use strict';

    window.exam_invigilationTeachersManageController = function($scope, uuid4, $filter, app, $uibModal, $rootScope, $compile, $window, exam_invigilationTeachersManageService, baseinfo_generalService, alertService){

        // 表格的高度
        $scope.table_height = $window.innerHeight - 223;

        // 查询参数
        $scope.invigilationTeachers = {};
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder
            };
            return angular.extend(pageParam, $scope.invigilationTeachers);
        }
        baseinfo_generalService.findcodedataNames({datableNumber: "XBM"},function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.semesterObjs = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.dataNumber as plateObj.dataName  for plateObj in semesterObjs" '
                +  ' ng-model="invigilationTeachers.sexCode" id="sexCode" name="sexCode" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#sexCode").parent().empty().append(html);
            $compile(angular.element("#sexCode").parent().contents())($scope);
        });
        
        baseinfo_generalService.findDepartmentNamesBox(function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.dept = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.departmentNumber as plateObj.departmentName  for plateObj in dept" '
                +  ' ng-model="invigilationTeachers.dept_Id" id="dept_Id" name="dept_Id" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#dept_Id").parent().empty().append(html);
            $compile(angular.element("#dept_Id").parent().contents())($scope);
        });

        $scope.invigilationTeachersTable = {
            //url: 'data_test/exam/tableview_invigilationTeachers.json',
            url:app.api.address + '/exam/teacher',
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
            sortOrder: 'desc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField : "gh", // 指定主键列
            uniqueId: "gh", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParams,//传递参数（*）
            showColumns: true,
            showRefresh: true,
            clickToSelect: true,
            onLoadSuccess: function() {
                $compile(angular.element('#invigilationTeachersTable').contents())($scope);
            },
            responseHandler:function(response){
                return response.data;
            },
            columns: [
                {checkbox: true,width: "3%"},
                {field:"id",title:"工号",align:"center",valign:"middle"},
                {field:"name",title:"姓名",align:"center",valign:"middle"},
                {field:"sex",title:"性别",align:"center",valign:"middle"},
                {field:"idNumber",title:"身份证号",align:"center",valign:"middle"},
                {field:"dept",title:"所属单位",align:"center",valign:"middle"},
                {field:"tel",title:"联系方式",align:"center",valign:"middle"},
                {field:"bankNumber",title:"银行卡号",align:"center",valign:"middle"},
                {field:"enable",title:"是否可用",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        if(value == '0'){return "否"};
                        if(value == '1'){return "是"};
                    }},
                {field:"",title:"操作",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        return "<button id='btn_update' type='button' ng-click='update(" + JSON.stringify(row) + ")' class='btn btn-default'><span class='glyphicon glyphicon-edit'></span>修改</button>"
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
            angular.element('#invigilationTeachersTable').bootstrapTable('resetView',{ height: $scope.table_height } );
        };
        
        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#invigilationTeachersTable').bootstrapTable('selectPage', 1);
            // angular.element('#administrativeSectionTable').bootstrapTable('refresh');
        };
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.invigilationTeachers = {};
            angular.element('form[name="pyfabzkz_form"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#invigilationTeachersTable').bootstrapTable('refresh');
        };

        // 打开新增面板
        $scope.add = function(){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/exam/invigilationTeachersManage/index_add.html',
                size: 'lg',
                controller: teacherAddController
            });
        };

        // 打开修改面板
        $scope.update = function(item){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/exam/invigilationTeachersManage/index_update.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return item;
                    }
                },
                controller: teacherUpdateController
            });
        };

        // 打开转入面板
        $scope.into = function(item){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/exam/invigilationTeachersManage/index_into.html',
                size: 'lg',
                controller: teacherIntoController
            });
        };
        //打开删除面板
        $scope.delete = function(){
            var rows = $('#invigilationTeachersTable').bootstrapTable('getSelections');
            if(rows.length == 0){
                alertService('请先选择要删除的项');
                return;
            }
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/exam/invigilationTeachersManage/index_delete.html',
                size: '',
                resolve: {
                    items: function () {
                        return rows;
                    },
                },
                controller: teacherDeleteController
            });
        };
        // 导入
        $scope.openImport = function() {
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/exam/invigilationTeachersManage/importData.html',
                size: 'lg',
                controller: openImportController
            });
        }

        // 导出
        $scope.openExport = function() {
            $scope.params = {
                routeKey: uuid4.generate(),
                nameOrId:$scope.invigilationTeachers.nameOrId,
                sexCode:$scope.invigilationTeachers.sexCode,
                idNumber:$scope.invigilationTeachers.idNumber,
                dept_Id:$scope.invigilationTeachers.dept_Id,
                enable:$scope.invigilationTeachers.enable
            }
            $scope.isNotAllowWindowClose = true; // 是否允许关闭窗口
            $rootScope.showLoading = true; // 开启加载提示
            // 导出数据
            exam_invigilationTeachersManageService.exportData($scope.params, function (data) {

                var blob = new Blob([data], {type: "application/vnd.ms-excel"});
                var objectUrl = window.URL.createObjectURL(blob);
                var currentTime = $filter('date')(new Date(), 'yyyyMMddHHmmss');
                var aForExcel = angular.element('<a download="监考教师名单-导出数据-' + currentTime + app.excel.ext + '"><span class="forExcel">导出</span></a>').attr('href', objectUrl);
                angular.element('body').append(aForExcel);
                angular.element('.forExcel').click();
                aForExcel.remove();
                // 允许关闭
                $scope.isNotAllowWindowClose = false;
                $rootScope.showLoading = false; // 关闭加载提示
                $uibModalInstance.close();
            });
        }

    }
    exam_invigilationTeachersManageController.$inject = ['$scope', 'uuid4', '$filter', 'app', '$uibModal', '$rootScope', '$compile', '$window', 'exam_invigilationTeachersManageService', 'baseinfo_generalService', 'alertService'];
    // 导入控制器
    var openImportController = function ($rootScope, $timeout, $scope, $uibModal, $filter, $uibModalInstance,exam_invigilationTeachersManageService, uuid4, app) {
        // 导出模板
        $scope.exportTemplate = function() {
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/exam/invigilationTeachersManage/exportTemplate.html',
                size: 'lg',
                controller: openExportTemplateController
            });
        }
        // 导入
        $scope.params = {
            routeKey: uuid4.generate()
        }
        $scope.uploadExcelFile = function () {
            var excelFile = angular.element('#excelFile')[0].files[0];

            // 导入数据
            var formData = new FormData();
            formData.append ('routeKey', $scope.params.routeKey);
            formData.append ('file', excelFile);
           
            $rootScope.showLoading = true; // 开启加载提示
            exam_invigilationTeachersManageService.importData(formData, function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
               // angular.element('#invigilationTeachersTable').bootstrapTable('refresh');

            });

        };
        // 实时日志显示
        $scope.client = showImportLog($scope);
        $scope.close = function () {
            // 关闭监听
            $scope.client.disconnect();
            $uibModalInstance.close();
        };
    };
    openImportController.$inject = ['$rootScope', '$timeout', '$scope', '$uibModal', '$filter', '$uibModalInstance', 'exam_invigilationTeachersManageService', 'uuid4', 'app'];
    // 导出模板控制器
    var openExportTemplateController = function ($scope, $filter, $uibModalInstance,  exam_invigilationTeachersManageService, uuid4, $rootScope, app) {
        $scope.params = {
            routeKey: uuid4.generate()
        }
        $scope.isNotAllowWindowClose = true; // 是否允许关闭窗口
        $rootScope.showLoading = true; // 开启加载提示
        // 导入模板下载
        exam_invigilationTeachersManageService.exportTemplate($scope.params, function (data) {
            var blob = new Blob([data], {type: "application/vnd.ms-excel"});
            var objectUrl = window.URL.createObjectURL(blob);
            var currentTime = $filter('date')(new Date(), 'yyyyMMddHHmmss');
            var aForExcel = angular.element('<a download="监考教师名单-导入模板-' + currentTime + app.excel.ext + '"><span class="forExcel">导入</span></a>').attr('href', objectUrl);
            angular.element('body').append(aForExcel);
            angular.element('.forExcel').click();
            aForExcel.remove();
            // 允许关闭
            $scope.isNotAllowWindowClose = false;
            $rootScope.showLoading = false; // 关闭加载提示
            $uibModalInstance.close();
        });
        // 实时日志显示
        // var client = showExportLog($scope, app);
        // $scope.close = function () {
        //     client.disconnect(); // 关闭监听
        //     $uibModalInstance.close();
        // };
    };
    openExportTemplateController.$inject = ['$scope', '$filter', '$uibModalInstance', 'exam_invigilationTeachersManageService', 'uuid4', '$rootScope', 'app'];


    //新增
    var teacherAddController = function ($scope,alertService, $rootScope, $uibModalInstance, exam_invigilationTeachersManageService, formVerifyService) {
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
        $scope.invigilationTeachers = {};

        $scope.invigilationTeachers.type = '1';
        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            $scope.invigilationTeachers.dept = $("#dept_Id").find("option:selected").text();
            var data = [$scope.invigilationTeachers];
            $rootScope.showLoading = true; // 开启加载提示
            exam_invigilationTeachersManageService.into(data,function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else{
                    alertService('success', '保存成功');
                    angular.element('#invigilationTeachersTable').bootstrapTable('refresh');
                    $uibModalInstance.close();
                }

            });

        };

    }
    teacherAddController.$inject = ['$scope','alertService', '$rootScope', '$uibModalInstance', 'exam_invigilationTeachersManageService', 'formVerifyService'];

    //修改
    var teacherUpdateController = function ($scope,alertService, $rootScope, $uibModalInstance, item, exam_invigilationTeachersManageService,formVerifyService) {

        $scope.invigilationTeachers = item;
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
            $scope.invigilationTeachers.dept = $("#dept_Id").find("option:selected").text();
            $rootScope.showLoading = true; // 开启加载提示
            exam_invigilationTeachersManageService.update($scope.invigilationTeachers,function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else{
                    alertService('success', '修改成功');
                    angular.element('#invigilationTeachersTable').bootstrapTable('refresh');
                    $uibModalInstance.close();
                }

            });
            $uibModalInstance.close();
        };

    }
    teacherUpdateController.$inject = ['$scope','alertService', '$rootScope', '$uibModalInstance', 'item', 'exam_invigilationTeachersManageService', 'formVerifyService'];

    // 删除控制器
    var teacherDeleteController = function ($scope,alertService, $rootScope, $uibModalInstance, items, exam_invigilationTeachersManageService) {
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {
            var ids = []; // 培养方案编制控制编号集合
            items.forEach (function(data) {
                ids.push(data.id);
            });
            $rootScope.showLoading = true; // 开启加载提示
            exam_invigilationTeachersManageService.delete(ids,function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else{
                    alertService('success', '删除成功');
                    angular.element('#invigilationTeachersTable').bootstrapTable('refresh');
                    $uibModalInstance.close();
                }

            });
            $uibModalInstance.close();
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    teacherDeleteController.$inject = ['$scope','alertService', '$rootScope', '$uibModalInstance', 'items', 'exam_invigilationTeachersManageService'];
    
    //转入
    var teacherIntoController = function ($compile, $rootScope, app, $scope, $uibModalInstance, exam_invigilationTeachersManageService, alertService) {
        $scope.cancel= function(){
            $uibModalInstance.close();
        }


        // // 开始日期参数配置
        // $scope.ksrqOptions = {
        //     opened: false,
        //     open: function() {
        //         $scope.ksrqOptions.opened = true;
        //     }
        // };
        // // 结束日期参数配置
        // $scope.jsrqOptions = {
        //     opened: false,
        //     open: function() {
        //         $scope.jsrqOptions.opened = true;
        //     }
        // };
        // // 结束日期小于开始日期时的提示
        // $scope.jsrqTooltipEnableAndOpen = false;
        // $scope.$watch('jkjswh.jsrq', function (newValue) {
        //     if ($scope.jkjswh.ksrq && newValue && (newValue < $scope.jkjswh.ksrq)) {
        //         $scope.jsrqTooltipEnableAndOpen = true;
        //         return;
        //     }
        //     $scope.jsrqTooltipEnableAndOpen = false;
        // });

        // 查询参数
        $scope.searchParam = {};
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder
            };
            return angular.extend(pageParam, $scope.searchParam);
        }

        $scope.teacherIntoTable = {
            onLoadSuccess: function() {
                $compile(angular.element('#teacherIntoTable').contents())($scope);
            },
            //url: 'data_test/exam/tableview_invigilationTeachers.json',
            url:app.api.address + '/exam/teacher/baseTeacher',
            method: 'get',
            cache: false,
            height: 347,
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [5, 10, 20, 50],
            search: false,
            sortOrder: 'desc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField : "gh", // 指定主键列
            uniqueId: "gh", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParams,//传递参数（*）
            showColumns: true,
            showRefresh: true,
            clickToSelect: true,
            responseHandler:function(response){
                return response.data;
            },
            columns: [
                {checkbox: true,width: "3%"},
                {field:"teacherNum",title:"工号",align:"center",valign:"middle"},
                {field:"name",title:"姓名",align:"center",valign:"middle"},
                {field:"sex",title:"性别",align:"center",valign:"middle"},
                {field:"idNumber",title:"身份证号",align:"center",valign:"middle"},
                {field:"dept",title:"所属单位",align:"center",valign:"middle"},
                {field:"title",title:"现任职称",align:"center",valign:"middle"},
                {field:"teacherCategory",title:"教师类别",align:"center",valign:"middle"},
                {field:"yhbh",title:"操作",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        return "<button id='btn_update' type='button' ng-click='check(" + JSON.stringify(row) + ")'  class='btn btn-default btn-sm''>查看详情</button>"
                    }
                }
            ]
        };
        $scope.ok = function () {
            var rows = $('#teacherIntoTable').bootstrapTable('getSelections');
            if(rows.length == 0){
                alertService('请先选择要转入的项');
                return;
            }
            var ids = []; // 培养方案编制控制编号集合
            rows.forEach (function(jkjswh) {
                ids.push(jkjswh.gh);
            });
            $rootScope.showLoading = true; // 开启加载提示
            exam_invigilationTeachersManageService.into(rows,function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                alertService('success', '保存成功');
                angular.element('#invigilationTeachersTable').bootstrapTable('refresh');
            });
            console.log("data  :  "+ids);
            $uibModalInstance.close();
            // var ids = []; // 教师工号集合
            // items.forEach (function(jkjswh) {
            //     ids.push(jkjswh.gh);
            // });
            // exam_invigilationTeachersManageService.into(ids);
            // $uibModalInstance.close();
        };

        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#teacherIntoTable').bootstrapTable('selectPage', 1);
            // angular.element('#administrativeSectionTable').bootstrapTable('refresh');
        };
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.student = {};
            angular.element('form[name="pyfabzkz_form"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#teacherIntoTable').bootstrapTable('refresh');
        };
    }
    teacherIntoController.$inject = ['$compile', '$rootScope', 'app', '$scope', '$uibModalInstance', 'exam_invigilationTeachersManageService', 'alertService'];
    // 实时日志显示
    var showImportLog = function ($scope) {
        $scope.logs = [];
        var retry = false;
        var socket = new SockJS('/message/excel');
        var stompClient = Stomp.over(socket);
        var index = 0;
        stompClient.connect({}, function (frame) {
            stompClient.subscribe('/topic/' + $scope.params.routeKey, function (data) {
                $scope.$apply(function () {
                    // 若重试，则清空日志数组
                    if (retry) {
                        $scope.logs.splice(0, $scope.logs.length);
                        retry = false;
                        index = 0;
                    }

                    index ++;
                    var log = angular.fromJson(data.body);
                    log = adaptLog(log, index);
                    $scope.logs.push(log);

                    // 若是日志结束，则下次使用时，需清空日志数组
                    if (log.status == "END") {
                        retry = true;
                    }
                });
            });
        });
        stompClient.debug = function(message) {
            // 屏蔽调试信息
        };
        return stompClient;
    }

    // 适配器
    var adaptLog = function(log, index) {
        log['index'] = index;
        if (log.level == "INFO") {
            log['info'] = true;
        } else {
            log['info'] = false;
        }
        if (log.level == "ERROR") {
            log['error'] = true;
        } else {
            log['error'] = false;
        }
        return log;
    }

})(window);
