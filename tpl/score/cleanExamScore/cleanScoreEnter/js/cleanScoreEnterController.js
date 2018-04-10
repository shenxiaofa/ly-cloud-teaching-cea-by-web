/**
 * Created by test on 2017/6/27.
 */
;(function (window, undefined) {
    'use strict';
    //考试课程维护Controller
    window.score_cleanScoreEnterController = function(baseinfo_generalService, $compile, app, $scope, $uibModal, $rootScope, $window, score_cleanScoreEnterService, alertService) {

        // 表格的高度
        $scope.table_height = $window.innerHeight - 204;

        // 查询参数
        $scope.searchParam = {type : '3'}
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder
            };
            return angular.extend(pageParam, $scope.searchParam);
        }
        baseinfo_generalService.findAcadyeartermNamesBox(function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.semesterObjs = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.id as plateObj.acadYearSemester  for plateObj in semesterObjs" '
                +  ' ng-model="searchParam.semester_ID" id="semester_ID" name="semester_ID" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#semester_ID").parent().empty().append(html);
            $compile(angular.element("#semester_ID").parent().contents())($scope);
        });
        $scope.cleanScoreEnterTable = {
            onLoadSuccess: function() {
                $compile(angular.element('#cleanScoreEnterTable').contents())($scope);
            },
            url:app.api.address + '/score/makeupExamScore',
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
            responseHandler:function(response){
                return response.data;
            },
            columns: [
                {field:"semester",title:"开课学期",align:"center",valign:"middle"},
                {field:"roundNum",title:"轮次",align:"center",valign:"middle",formatter : function (value, row, index) {
                    if(value){
                        return  "清考第"+  value +"轮次";
                    }else{
                        return "";
                    }
                }},
                {field:"courseNum",title:"课程代码",align:"center",valign:"middle"},
                {field:"courseName",title:"课程名称",align:"center",valign:"middle"},
                {field:"department",title:"开课单位",align:"center",valign:"middle"},
                {field:"courseProperty",title:"课程属性",align:"center",valign:"middle"},
                {field:"credit",title:"学分",align:"center",valign:"middle"},
                {field:"className",title:"班级名称",align:"center",valign:"middle"},
                {field:"notInputCount",title:"未录入人数",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        return  row.notInputCount+ "/"+row.studentCount;
                    }},
                {field:"status",title:"操作状态",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        if("1"==value){return  "暂存";}
                        if("2"==value){return  "提交";}
                        if("3"==value){return  "退回";}
                        return  "";
                    }},
                {field:"cz",title:"操作",align:"center",valign:"middle",width:"10%",
                    formatter : function (value, row, index) {
                        var maintain =  "<button id='btn_update' type='button' ng-click='maintain(" + JSON.stringify(row) + ")'  class='btn btn-default btn-sm''>录入</button>";
                        var update =  "<button id='btn_update' type='button' ng-click='adjust(" + JSON.stringify(row) + ",1)'  class='btn btn-default btn-sm''>修改</button>";
                        var adjust =  "<button id='btn_update' type='button' ng-click='adjust(" + JSON.stringify(row) + ")'  class='btn btn-default btn-sm''>更正</button>";
                        var detail =  "<button id='btn_update' type='button' ng-click='detail(" + JSON.stringify(row) + ")'  class='btn btn-default btn-sm''>查看</button>";

                        var endDate = new Date(row.endDate);
                        var recheckDate = new Date(row.endDate);;
                        recheckDate.setDate(endDate.getDate()+parseInt(row.recheckDays));
                        if(row.status == "2"&& endDate<new Date()<recheckDate){
                            return update + "&nbsp;" +detail;
                        }
                        if(row.status == "3"){
                            return   adjust+ "&nbsp;"+detail;
                        }
                        return  maintain+ "&nbsp;"+detail;
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
            angular.element('#cleanScoreEnterTable').bootstrapTable('resetView',{ height: $scope.table_height } );
        };

        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#cleanScoreEnterTable').bootstrapTable('selectPage', 1);
        };
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.makeupExaminationList = {};
            angular.element('#cleanScoreEnterTable').bootstrapTable('refresh');
        };

        /*
         *录入
        */
        $scope.maintain = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/score/cleanExamScore/cleanScoreEnter/enter.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return row;
                    }
                },
                controller: enterController
            });
        }
        /*
         *更正
        */
        $scope.adjust = function(row,num){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/score/cleanExamScore/cleanScoreEnter/adjust.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return row;
                    },
                    num: function (){
                        return num;
                    }
                },
                controller: adjustController
            });
        }

        /*
         *详情
         */
        $scope.detail = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/score/cleanExamScore/cleanScoreEnter/detail.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return row;
                    }
                },
                controller: detailController
            });
        }
    }
    score_cleanScoreEnterController.$inject = ['baseinfo_generalService', '$compile', 'app', '$scope', '$uibModal', '$rootScope', '$window', 'score_cleanScoreEnterService', 'alertService'];

    //录入控制器
    var enterController = function ($rootScope, $filter, uuid4, $compile, $scope, alertService, app, $uibModalInstance, item, score_cleanScoreEnterService) {
        console.log(item.kcbh);
        $scope.item = item;
        $scope.teacherEnter = {
            url:app.api.address + '/score/makeupExamScore/makeupScoreList?type=3&list_ID='+item.cjlrrw_ID,
            //url: 'data_test/exam/tableview_studentList.json',
            method: 'get',
            cache: false,
            height: 357,
            //toolbar:"#toolbar",
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [5, 10, 20, 50],
            search: false,
            showColumns: false,
            showRefresh: false,
            clickToSelect: true,
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#teacherEnter').contents())($scope);
            },
            onLoadSuccess: function() {
                $compile(angular.element('#teacherEnter').contents())($scope);
            },
            responseHandler:function(response){
                var data = {
                    rows :response.data,
                    total : response.data.length
                }
                return data;
            },
            columns: [
                {field:"",title:"序号",align:"center",valign:"middle", width: "5%", formatter: function (value, row, index) {
                    return index+1;
                }},
                {field:"studentId",title:"学生学号",align:"center",valign:"middle"},
                {field:"studentName",title:"学生姓名",align:"center",valign:"middle"},
                {field:"className",title:"班级名称",align:"center",valign:"middle"},
                {field:"scoreCount",title:"清考成绩",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        if(value){
                            $scope["examScore"+row.studentId] = parseFloat(value);
                        }
                        var input = '<input type="number" ng-required="true" ng-model='+"examScore"+row.studentId+'  min="0.0" max="100" style="width: 64px;" step="1" value="'+value+'"  name='+"examScore"+row.studentId+' size="3"/>';
                        return input;
                    }},
                {field:"scoreFlag",title:"成绩标记",align:"center",valign:"middle"},
                {field:"inputName",title:"录入人",align:"center",valign:"middle"},
                {field:"inputTime",title:"修改时间",align:"center",valign:"middle"}
            ]
        }
        // 导入
        $scope.openImport = function() {
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/score/cleanupExamScore/cleanupScoreEnter/importData.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return item;
                    }
                },
                controller: openImportController
            });
        }
        // 导出
        $scope.openExport = function() {
            $scope.params = {
                type:'3',
                list_ID: item.cjlrrw_ID,
                routeKey: uuid4.generate()
            }
            $scope.isNotAllowWindowClose = true; // 是否允许关闭窗口
            $rootScope.showLoading = true; // 开启加载提示
            // 导出数据
            score_cleanScoreEnterService.exportData($scope.params, function (data) {

                var blob = new Blob([data], {type: "application/vnd.ms-excel"});
                var objectUrl = window.URL.createObjectURL(blob);
                var currentTime = $filter('date')(new Date(), 'yyyyMMddHHmmss');
                var aForExcel = angular.element('<a download="补清考成绩单-导出数据-' + currentTime + app.excel.ext + '"><span class="forExcel">导出</span></a>').attr('href', objectUrl);
                angular.element('body').append(aForExcel);
                angular.element('.forExcel').click();
                aForExcel.remove();
                // 允许关闭
                $scope.isNotAllowWindowClose = false;
                $rootScope.showLoading = false; // 关闭加载提示
                $uibModalInstance.close();
            });
        }

        // 输出打印
        $scope.previewAndPrint = function () {
            var LODOP = getLodop();
            LODOP.PRINT_INIT('清考学生成绩单');
            LODOP.SET_PRINT_STYLE('FontSize', 18);
            //LODOP.SET_PRINT_STYLE('Bold', 1);
            // LODOP.ADD_PRINT_TEXT(50, 231, 260, 39, '正考学生成绩单');
            var data = angular.element('#teacherEnter').bootstrapTable('getData' );
            var tableHTML = '';
            for(var i=0;i<data.length;i++){
                var obj = data[i];
                if(!obj.className){
                    obj.className = ""
                }
                if(!obj.scoreCount){
                    obj.scoreCount = ""
                }
                if(!obj.scoreFlag){
                    obj.scoreFlag = ""
                }
                if(!obj.inputName){
                    obj.inputName = ""
                }
                if(!obj.inputTime){
                    obj.inputTime = ""
                }
                tableHTML += '<tr data-index="'+i+'"><td style="text-align: center; vertical-align: middle; width:47px; ">'+ (i+1) +'</td>';
                tableHTML += '<td style="text-align: center; vertical-align: middle; width: 79px; ">'+ obj.studentId +'</td>';
                tableHTML += '<td style="text-align: center; vertical-align: middle; width: 66px; ">'+ obj.studentName +'</td>';
                tableHTML += '<td style="text-align: center; vertical-align: middle; width: 150px; ">'+ obj.className +'</td>';
                tableHTML += '<td style="text-align: center; vertical-align: middle; width: 50px; ">'+ obj.scoreCount +'</td>';
                tableHTML += '<td style="text-align: center; vertical-align: middle; width: 66px; ">'+ obj.scoreFlag +'</td>';
                tableHTML += '<td style="text-align: center; vertical-align: middle; width: 54px; ">'+ obj.inputName +'</td>';
                tableHTML += '<td style="text-align: center; vertical-align: middle; width: 150px; ">'+ obj.inputTime +'</td></tr>';
            }
            var html ='<table border="1" cellspacing="0" bgcolor="#FFFFFF"style="border-collapse:collapse;table-layout:fixed;border:solid 1px black;">' +
                '<caption style="font-size: 18px;font-weight: bold;">清考学生成绩单</caption>' +
                '<thead class="ng-scope"><tr>' +
                '<th style="font-size: 15px;font-weight: bold;text-align: center; vertical-align: middle; width: 5%; " data-field="" tabindex="0"><div class="th-inner ">序号</div><div class="fht-cell" style="width: 47px;"></div></th>' +
                '<th style="font-size: 15px;font-weight: bold;text-align: center; vertical-align: middle; " data-field="studentId" tabindex="0"><div class="th-inner ">学生学号</div><div class="fht-cell" style="width: 79px;"></div></th>' +
                '<th style="font-size: 15px;font-weight: bold;text-align: center; vertical-align: middle; " data-field="studentName" tabindex="0"><div class="th-inner ">学生姓名</div><div class="fht-cell" style="width: 66px;"></div></th>' +
                '<th style="font-size: 15px;font-weight: bold;text-align: center; vertical-align: middle; " data-field="className" tabindex="0"><div class="th-inner ">班级名称</div><div class="fht-cell" style="width: 150px;"></div></th>' +
                '<th style="font-size: 15px;font-weight: bold;text-align: center; vertical-align: middle; " data-field="scoreCount" tabindex="0"><div class="th-inner ">补考成绩</div><div class="fht-cell" style="width: 50px;"></div></th>' +
                '<th style="font-size: 15px;font-weight: bold;text-align: center; vertical-align: middle; " data-field="scoreFlag" tabindex="0"><div class="th-inner ">成绩标记</div><div class="fht-cell" style="width: 66px;"></div></th>' +
                '<th style="font-size: 15px;font-weight: bold;text-align: center; vertical-align: middle; " data-field="inputName" tabindex="0"><div class="th-inner ">录入人</div><div class="fht-cell" style="width: 54px;"></div></th>' +
                '<th style="font-size: 15px;font-weight: bold;text-align: center; vertical-align: middle; " data-field="inputTime" tabindex="0"><div class="th-inner ">修改时间</div><div class="fht-cell" style="width: 150px;"></div></th>' +
                '</tr></thead>' +
                '<tbody></tbody> '+ tableHTML+'</table>';


            LODOP.ADD_PRINT_HTM(88, 50, 800, 900, html);
            LODOP.PREVIEW();
        }

        $scope.save = function() {
            if ($scope.timeout != null && $scope.timeout != "") {
                alertService('系统将在' + $scope.timeout + '分钟后自动保存');
                var timer = $timeout(function () {
                    var tabData = angular.element('#teacherEnter').bootstrapTable('getOptions').data;
                    var examScores = angular.element('#teacherEnter input[name="examScore"]');
                    var params = [];
                    for (var i=0; i<tabData.length; i++) {
                        params[i] = {};
                        params[i].bqkxscj_ID = tabData[i].bqkxscj_ID;
                        params[i].score = $scope["examScore"+tabData[i].studentId];
                       // params[i].status = status;
                        params[i].cjlrrw_id = item.cjlrrw_ID;
                        params[i].semesterId = item.semesterId;
                        params[i].courseNum = item.courseNum;
                        params[i].studentNum = tabData[i].studentId;
                    }
                    //$rootScope.showLoading = true; // 开启加载提示
                    score_cleanScoreEnterService.update(params,function (error, message) {
                        //$rootScope.showLoading = false; // 关闭加载提示
                        if (error) {
                            alertService(message);
                            return;
                        }
                    });
                }, $scope.timeout * 60000);
            }
        }
        $scope.ok = function (status,form) {
            if(form){
                if(form.$invalid) {
                    // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                    formVerifyService(form);
                    return;
                };
            }
            var tabData = angular.element('#teacherEnter').bootstrapTable('getOptions').data;
            var examScores = angular.element('#teacherEnter input[name="examScore"]');
            var params = [];
            for (var i=0; i<tabData.length; i++) {
                params[i] = {};
                params[i].bqkxscj_ID = tabData[i].bqkxscj_ID;
                params[i].score = $scope["examScore"+tabData[i].studentId];
                params[i].status = status;
                params[i].cjlrrw_id = item.cjlrrw_ID;
                params[i].semesterId = item.semesterId;
                params[i].courseNum = item.courseNum;
                params[i].studentNum = tabData[i].studentId;

            }
            //$rootScope.showLoading = true; // 开启加载提示
            score_cleanScoreEnterService.update(params,function (error, message) {
                //$rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                alertService('success', '保存成功');
            });
            angular.element('#cleanScoreEnterTable').bootstrapTable('refresh');
            if(status==2){
                $uibModalInstance.close();
            }
        };
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    };
    enterController.$inject = ['$rootScope', '$filter', 'uuid4','$compile', '$scope', 'alertService', 'app', '$uibModalInstance', 'item', 'score_cleanScoreEnterService'];

    //更正控制器
    var adjustController = function ($rootScope, $filter, uuid4, $compile, $scope, app, alertService, $uibModalInstance, item, num, score_cleanScoreEnterService) {
        $scope.item = item;
        $scope.commitSign = false;
        $scope.saveSign = true;
        if(num){
            $scope.commitSign = true;
            $scope.saveSign = false;
        }
        $scope.teacherEnter = {
            url:app.api.address + '/score/makeupExamScore/makeupScoreList?type=3&list_ID='+item.cjlrrw_ID,
            method: 'get',
            cache: false,
            height: 357,
            //toolbar:"#toolbar",
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [5, 10, 20, 50],
            search: false,
            showColumns: false,
            showRefresh: false,
            clickToSelect: true,
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#teacherEnter').contents())($scope);
            },
            onLoadSuccess: function() {
                $compile(angular.element('#teacherEnter').contents())($scope);
            },
            responseHandler:function(response){
                var data = {
                    rows :response.data,
                    total : response.data.length
                }
                return data;
            },
            columns: [
                {field:"",title:"序号",align:"center",valign:"middle", width: "5%", formatter: function (value, row, index) {
                    return index+1;
                }},
                {field:"studentId",title:"学生学号",align:"center",valign:"middle"},
                {field:"studentName",title:"学生姓名",align:"center",valign:"middle"},
                {field:"className",title:"班级名称",align:"center",valign:"middle"},
                {field:"scoreCount",title:"清考成绩",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        if(value){
                            $scope["examScore"+row.studentId] = parseFloat(value);
                        }
                        var input = '<input type="number" ng-required="true" ng-model='+"examScore"+row.studentId+'  min="0.0" max="100" style="width: 64px;" step="1" value="'+value+'"  name='+"examScore"+row.studentId+' size="3"/>';
                        return input;
                    }},
                {field:"scoreFlag",title:"成绩标记",align:"center",valign:"middle"},
                {field:"inputName",title:"录入人",align:"center",valign:"middle"},
                {field:"inputTime",title:"修改时间",align:"center",valign:"middle"}
            ]
        }
        // 导入
        $scope.openImport = function() {
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/score/cleanupExamScore/cleanupScoreEnter/importData.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return item;
                    }
                },
                controller: openImportController
            });
        }
        // 导出
        $scope.openExport = function() {
            $scope.params = {
                type:'3',
                list_ID: item.cjlrrw_ID,
                routeKey: uuid4.generate()
            }
            $scope.isNotAllowWindowClose = true; // 是否允许关闭窗口
            $rootScope.showLoading = true; // 开启加载提示
            // 导出数据
            score_cleanScoreEnterService.exportData($scope.params, function (data) {

                var blob = new Blob([data], {type: "application/vnd.ms-excel"});
                var objectUrl = window.URL.createObjectURL(blob);
                var currentTime = $filter('date')(new Date(), 'yyyyMMddHHmmss');
                var aForExcel = angular.element('<a download="补清考成绩单-导出数据-' + currentTime + app.excel.ext + '"><span class="forExcel">导出</span></a>').attr('href', objectUrl);
                angular.element('body').append(aForExcel);
                angular.element('.forExcel').click();
                aForExcel.remove();
                // 允许关闭
                $scope.isNotAllowWindowClose = false;
                $rootScope.showLoading = false; // 关闭加载提示
                $uibModalInstance.close();
            });
        }
        $scope.save = function() {
            if ($scope.timeout != null && $scope.timeout != "") {
                alertService('系统将在' + $scope.timeout + '分钟后自动保存');
                var timer = $timeout(function () {
                    var tabData = angular.element('#teacherEnter').bootstrapTable('getOptions').data;
                    var examScores = angular.element('#teacherEnter input[name="examScore"]');
                    var params = [];
                    for (var i=0; i<tabData.length; i++) {
                        params[i] = {};
                        params[i].bqkxscj_ID = tabData[i].bqkxscj_ID;
                        params[i].score = $scope["examScore"+tabData[i].studentId];
                        // params[i].status = status;
                        params[i].cjlrrw_id = item.cjlrrw_ID;
                        params[i].semesterId = item.semesterId;
                        params[i].courseNum = item.courseNum;
                        params[i].studentNum = tabData[i].studentId;
                    }
                    //$rootScope.showLoading = true; // 开启加载提示
                    score_cleanScoreEnterService.update(params,function (error, message) {
                        //$rootScope.showLoading = false; // 关闭加载提示
                        if (error) {
                            alertService(message);
                            return;
                        }
                    });
                }, $scope.timeout * 60000);
            }
        }
        $scope.ok = function (number,form) {
            if(form){
                if(form.$invalid) {
                    // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                    formVerifyService(form);
                    return;
                };
            }
            var tabData = angular.element('#teacherEnter').bootstrapTable('getOptions').data;
            var examScores = angular.element('#teacherEnter input[name="examScore"]');
            var params = [];
            for (var i=0; i<tabData.length; i++) {
                params[i] = {};
                params[i].bqkxscj_ID = tabData[i].bqkxscj_ID;
                params[i].score = $scope["examScore"+tabData[i].studentId];
                params[i].cjlrrw_id = item.cjlrrw_ID;
                params[i].semesterId = item.semesterId;
                params[i].courseNum = item.courseNum;
                params[i].studentNum = tabData[i].studentId;
                if(number!=3){
                    params[i].status = number; //提交
                }
            }
            //$rootScope.showLoading = true; // 开启加载提示
            score_cleanScoreEnterService.update(params,function (error, message) {
                //$rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                alertService('success', '保存成功');
            });
            angular.element('#cleanScoreEnterTable').bootstrapTable('refresh');
            $uibModalInstance.close();
        };
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    };
    adjustController.$inject = ['$rootScope', '$filter', 'uuid4', '$compile', '$scope', 'app', 'alertService', '$uibModalInstance', 'item', 'num', 'score_cleanScoreEnterService'];

    //详情控制器
    var detailController = function ($scope, app, alertService, $uibModalInstance, item, score_cleanScoreEnterService) {
        $scope.item = item;
        $scope.teacherEnter = {
            url:app.api.address + '/score/makeupExamScore/makeupScoreList?type=3&list_ID='+item.cjlrrw_ID,
            method: 'get',
            cache: false,
            height: 357,
            //toolbar:"#toolbar",
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
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
                var data = {
                    rows :response.data,
                    total : response.data.length
                }
                return data;
            },
            columns: [
                {field:"",title:"序号",align:"center",valign:"middle", width: "5%", formatter: function (value, row, index) {
                    return index+1;
                }},
                {field:"studentId",title:"学生学号",align:"center",valign:"middle"},
                {field:"studentName",title:"学生姓名",align:"center",valign:"middle"},
                {field:"className",title:"班级名称",align:"center",valign:"middle"},
                {field:"scoreCount",title:"清考成绩",align:"center",valign:"middle"},
                {field:"scoreFlag",title:"成绩标记",align:"center",valign:"middle"},
                {field:"inputName",title:"录入人",align:"center",valign:"middle"},
                {field:"inputTime",title:"修改时间",align:"center",valign:"middle"}
            ]
        }

        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    };
    detailController.$inject = ['$scope', 'app', 'alertService', '$uibModalInstance', 'item', 'score_cleanScoreEnterService'];

    // 导入控制器
    var openImportController = function ($compile, $rootScope, $scope, $uibModal, $filter, $uibModalInstance,score_cleanScoreEnterService, item, uuid4, app) {
        // 导出模板
        $scope.exportTemplate = function() {
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/score/cleanupExamScore/cleanupScoreEnter/exportTemplate.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return item;
                    }
                },
                controller: openExportTemplateController
            });
        }
        $scope.params = {
            list_ID: item.cjlrrw_ID,
            routeKey: uuid4.generate()
        }
        // 导入
        $scope.uploadExcelFile = function () {
            var excelFile = angular.element('#excelFile')[0].files[0];
            // 导入数据
            var formData = new FormData();
            formData.append ('list_ID', $scope.params.list_ID);
            formData.append ('routeKey', $scope.params.routeKey);
            formData.append ('file', excelFile);
            formData.append ('type', '3');
            $rootScope.showLoading = true; // 开启加载提示
            score_cleanScoreEnterService.importData(formData, function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
            });
        };
        // 实时日志显示
        $scope.client = showImportLog($scope);
        $scope.close = function () {
            // 关闭监听
            $scope.client.disconnect();
            angular.element('#teacherEnter').bootstrapTable('refresh');
            $uibModalInstance.close();

        };
    };
    openImportController.$inject = ['$compile', '$rootScope', '$scope', '$uibModal', '$filter', '$uibModalInstance', 'score_cleanScoreEnterService', 'item', 'uuid4', 'app'];

    // 导出控制器
    var openExportController = function ($scope, $filter, $uibModalInstance, item, score_cleanScoreEnterService, uuid4, $rootScope, app) {
        $scope.params = {
            type:'3',
            list_ID: item.cjlrrw_ID,
            routeKey: uuid4.generate()
        }
        $scope.isNotAllowWindowClose = true; // 是否允许关闭窗口
        $rootScope.showLoading = true; // 开启加载提示
        // 导出数据
        score_cleanScoreEnterService.exportData($scope.params, function (data) {

            var blob = new Blob([data], {type: "application/vnd.ms-excel"});
            var objectUrl = window.URL.createObjectURL(blob);
            var currentTime = $filter('date')(new Date(), 'yyyyMMddHHmmss');
            var aForExcel = angular.element('<a download="补清考成绩单-导出数据-' + currentTime + app.excel.ext + '"><span class="forExcel">导出</span></a>').attr('href', objectUrl);
            angular.element('body').append(aForExcel);
            angular.element('.forExcel').click();
            aForExcel.remove();
            // 允许关闭
            $scope.isNotAllowWindowClose = false;
            $rootScope.showLoading = false; // 关闭加载提示
            $uibModalInstance.close();
        });
    };
    openExportController.$inject = ['$scope', '$filter', '$uibModalInstance', 'item', 'score_cleanScoreEnterService', 'uuid4', '$rootScope', 'app'];

    // 导出模板控制器
    var openExportTemplateController = function ($scope, $filter, $uibModalInstance, item, score_cleanScoreEnterService, uuid4, $rootScope, app) {
        $scope.params = {
            type:'3',
            list_ID: item.cjlrrw_ID,
            routeKey: uuid4.generate()
        }
        $scope.isNotAllowWindowClose = true; // 是否允许关闭窗口
        $rootScope.showLoading = true; // 开启加载提示
        // 导出模板
        score_cleanScoreEnterService.exportTemplate($scope.params, function (data) {
            var blob = new Blob([data], {type: "application/vnd.ms-excel"});
            var objectUrl = window.URL.createObjectURL(blob);
            var currentTime = $filter('date')(new Date(), 'yyyyMMddHHmmss');
            var aForExcel = angular.element('<a download="补清考成绩单-导入模板-' + currentTime + app.excel.ext + '"><span class="forExcel">导出</span></a>').attr('href', objectUrl);
            angular.element('body').append(aForExcel);
            angular.element('.forExcel').click();
            aForExcel.remove();
            // 允许关闭
            $scope.isNotAllowWindowClose = false;
            $rootScope.showLoading = false; // 关闭加载提示
            $uibModalInstance.close();
        });
    };
    openExportTemplateController.$inject = ['$scope', '$filter', '$uibModalInstance', 'item', 'score_cleanScoreEnterService', 'uuid4', '$rootScope', 'app'];

    // 实时日志显示
    var showImportLog = function ($scope, app, $compile) {
        $scope.logs = "";
        var ws = new WebSocket('ws://' + app.rabbitmq.hostname + ':15674/ws');
        var client = Stomp.over(ws);
        var index = 0;
        client.connect(app.rabbitmq.username, app.rabbitmq.password, function () {
            var subscribeObject = client.subscribe('/exchange/' + app.rabbitmq.logExchange + '/' + $scope.params.routeKey, function (data) {
                $scope.$apply(function () {
                    index+=1;
                    var log = data.body;
                    log = angular.fromJson(log);
                    $scope.logData = angular.fromJson(log);
                    if(log.status=="START" || log.status=="CHECK" || log.status=="END" ){
                        log = log.message
                    }
                    if(log.status=="IMPORT_DATA"){
                        log = "总处理数据"+ log.totalCount+"条,成功"+ log.successCount+"条," +log.message
                    }
                    if($scope.logData.level=="ERROR"){
                        $scope.logs+='<font color="#982C2C">'+index + '.'+ log+'</font><br/>';
                    }else{
                        $scope.logs+='<font color="#5DFF16">'+index + '.'+ log+'</font><br/>';
                    }

                    angular.element("#logs").empty().append($scope.logs);
                    $compile(angular.element("#logs").contents())($scope);
                });
            });
        }, function () {
            $scope.$apply(function () {
                $scope.logs+='<font color="#982C2C">获取导入信息失败</font><br/>';
                angular.element("#logs").empty().append($scope.logs);
                $compile(angular.element("#logs").contents())($scope);
            });
        }, '/');
        client.debug = function(message) {
            // 屏蔽调试信息
        };
        return client;
    }

    // 实时日志显示
    var showExportLog = function ($scope, app) {
        $scope.logs = [];
        var ws = new WebSocket('ws://' + app.rabbitmq.hostname + ':15674/ws');
        var client = Stomp.over(ws);
        client.connect(app.rabbitmq.username, app.rabbitmq.password, function () {
            var subscribeObject = client.subscribe('/exchange/' + app.rabbitmq.logExchange + '/' + $scope.params.routeKey, function (data) {
                $scope.$apply(function () {
                    var log = data.body;
                    log = angular.fromJson(log);
                    $scope.logs.push(log);
                });
            });
        }, function () {
            $scope.$apply(function () {
                $scope.logs.push({
                    message: '获取导出信息失败'
                });
            });
        }, '/');
        client.debug = function(message) {
            // 屏蔽调试信息
        };
        return client;
    }

})(window);
