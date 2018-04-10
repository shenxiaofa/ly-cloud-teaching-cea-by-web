/**
 * Created by Administrator on 2017-07-18.
 */
;(function (window, undefined) {
    'use strict';

    window.Start_gradePlateSettingController = function ($compile, $scope, $uibModal, $rootScope, $window, starts_gradePlateSettingService, alertService, app, $state) {
        // 表格的高度
        $scope.toolbar_height = angular.element('#toolbar').height();
        $scope.menu_height = angular.element('#menu').height();
        $scope.search_height = angular.element('#searchHeight').height();
        $scope.table_height = $window.innerHeight - 180;

        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder
            };
            return angular.extend(pageParam, $scope.gradePlateSetting);
        }
        $scope.showTable = {
            onLoadSuccess: function() {
                $compile(angular.element('#showTable').contents())($scope);
            },
            //url: 'data_test/starts/tableview_gradePlateSetting.json',
            url: app.api.address + '/virtual-class/gradePlate',
            method: 'get',
            cache: false,
            height: $scope.table_height,
            toolbar: '#toolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 5,
            pageNumber:1,
            pageList: [5,10, 20, 30, 50, 100], // 设置可供选择的页面数据条数
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            sortName: 'plateTime', // 默认排序字段
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
                {field:"",title:"序号", align:"center",valign:"middle", width: "5%", formatter: function (value, row, index) {
                    return index+1;
                }},
                {field:"num",title:"板块号",align:"center",valign:"middle"},
                {field:"name",title:"板块名称",align:"center",valign:"middle"},
                {field:"gradePlateTime",title:"板块时间",align:"center",valign:"middle"},
                {field:"startSign",title:"是否启用",align:"center",valign:"middle",formatter : function (value, row, index) {
                        if(value=='0'){
                            return '否'
                        }else{
                            return '是';
                        }
                    }
                },
                {field:"remark",title:"备注",width: "20%",align:"center",valign:"middle"},
                {field:"",title:"操作",align:"center",valign:"middle",width: "10%",
                    formatter : function (value, row, index) {
                        var setting = "<button   type='button' has-permission='gradePlateSetting:update' ng-click='modify(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>修改</button>";
                        return setting;
                    }
                }

            ]
        };

        // 查询表单显示和隐藏切换
        $scope.isHideSearchForm = false; // 默认显示
        $scope.searchFormHideToggle = function () {
            $scope.isHideSearchForm = !$scope.isHideSearchForm
            if ($scope.isHideSearchForm) {
                $scope.table_height = $scope.table_height + 75;
            } else {
                $scope.table_height = $scope.table_height - 75;
            }
            angular.element('#showTable').bootstrapTable('resetView',{ height: $scope.table_height } );
        }

        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#showTable').bootstrapTable('selectPage', 1);
            // angular.element('#showTable').bootstrapTable('refresh');
        }
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.gradePlateSetting = {};
            angular.element('#showTable').bootstrapTable('refresh');
            angular.element('form[name="gradePlateSettingSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
        }

        // 打开新增面板
        $scope.openAdd = function(){
            // $uibModal.open({
            //     animation: true,
            //     backdrop: 'static',
            //     templateUrl: 'tpl/starts/gradePlateSetting/add.html',
            //     size: 'lg',
            //     controller: addController
            // });
            $state.go("home.common.gradePlateSettingAdd");
        };
        // 打开修改面板
        $scope.modify = function(date){

            // $uibModal.open({
            //     animation: true,
            //     backdrop: 'static',
            //     templateUrl: 'tpl/starts/gradePlateSetting/modify.html',
            //     size: 'lg',
            //     resolve: {
            //         item: function () {
            //             return date;
            //         }
            //     },
            //     controller: modifyController
            // });
            var params = angular.toJson(date);
            $state.go("home.common.gradePlateSettingModify",{
                "params" : params
            });
        };


        // 打开删除面板
        $scope.delete = function(){
            var rows = angular.element('#showTable').bootstrapTable('getSelections');
            if(rows.length == 0){
                alertService('请先选择要删除的项');
                return;
            }
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/starts/gradePlateSetting/delete.html',
                size: 'lg',
                resolve: {
                    items: function () {
                        return rows;
                    },
                },
                controller: deleteController
            });
        };
    };
    Start_gradePlateSettingController.$inject = ['$compile', '$scope', '$uibModal', '$rootScope', '$window', 'starts_gradePlateSettingService', 'alertService', 'app', '$state'];

    // 添加控制器
    var addController = function ($compile, $scope, $uibModalInstance, $uibModal, starts_gradePlateSettingService, formVerifyService, alertService) {
        //学年学期下拉框
        var semesterObjs = [];
        starts_gradePlateSettingService.getSemester(function (data) {
            semesterObjs = data;
            findSemester();
        });
        var findSemester = function () {
            $scope.semesterObjs =semesterObjs;
            var html = '' +
                '<select  ui-select2 ng-options="semesterObj.id as semesterObj.name  for semesterObj in semesterObjs" ui-chosen="gradePlateSetting_add_form.semesterId" ng-required="true" '
                +  ' ng-required="true" ng-model="gradePlateSetting.semesterId" id="semesterId" name="semesterId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#semesterId").parent().empty().append(html);
            $compile(angular.element("#semesterId").parent().contents())($scope);
        };
        
        $scope.teacherTimeDemandFinalResult =[];
        $scope.plateTimeTable = {
            onLoadSuccess: function() {
                $compile(angular.element('#plateTimeTable').contents())($scope);
            },
            //url: 'data_test/starts/tableview_gradePlateSetting.json',
            //url: app.api.address + '/virtual-class/gradePlate',
            method: 'get',
            cache: false,
            height: $scope.table_height,
            toolbar: '#toolbar', //工具按钮用哪个容器
           // sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 5,
            pageNumber:1,
            //pageList: [5,10, 20, 30, 50, 100], // 设置可供选择的页面数据条数
           // paginationPreText: '上一页',
           // paginationNextText: '下一页',
            sortName: 'plateTime', // 默认排序字段
            sortOrder: 'desc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField : "id", // 指定主键列
            uniqueId: "id", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
           // queryParams: $scope.queryParams,//传递参数（*）
            search: false,
            showColumns: true,
            showRefresh: true,
            data:$scope.teacherTimeDemandFinalResult,
            columns: [
                {checkbox: true, width: "5%"},
                {field:"startWeek",  visible:false},
                {field:"endWeek",  visible:false},
                {field:"oddEvenWeek",  visible:false},
                {field:"startEndWeek",title:"起止周",align:"center",valign:"middle"},
                {field:"weekDay",title:"星期",align:"center",valign:"middle"},
                {field:"section", visible:false},
                {field:"sectionName",title:"节次",align:"center",valign:"middle"}
            ]
        };

        // 打开新增面板
        $scope.openAdd = function(){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/starts/gradePlateSetting/addTime.html',
                size: 'lg',
                resolve: {
                    items: function () {
                        console.log($scope.teacherTimeDemandFinalResult);
                       // $scope.teacherTimeDemandFinalResult = [];
                       return $scope.teacherTimeDemandFinalResult;
                    },
                },
                controller: addInfoController
            });
        };

        // 打开删除面板
        $scope.openDelete = function(){
            var rows = angular.element('#plateTimeTable').bootstrapTable('getSelections');
            if(rows.length == 0){
                alertService('请先选择要删除的项');
                return;
            }
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/starts/gradePlateSetting/delete.html',
                size: 'lg',
                resolve: {
                    items: function () {
                        return rows;
                    },
                    data: function () {
                        console.log($scope.teacherTimeDemandFinalResult);
                        return $scope.teacherTimeDemandFinalResult;
                    },
                },
                controller: deleteTimeController
            });
        };

        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            $scope.gradePlateSetting.gradePlateTimeList = $scope.teacherTimeDemandFinalResult;
            starts_gradePlateSettingService.add($scope.gradePlateSetting, function (error, message) {
                if (error) {
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                angular.element('#showTable').bootstrapTable('refresh');
                alertService('success', '新增成功');
            });
        };
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    };
    addController.$inject = ['$compile', '$scope', '$uibModalInstance', '$uibModal', 'starts_gradePlateSettingService', 'formVerifyService', 'alertService'];

    var addInfoController = function(app, $timeout, $compile, $scope, $uibModal, $uibModalInstance, items, starts_gradePlateSettingService, formVerifyService, alertService) {

        // 关闭窗口事件
        $scope.close = function() {
            $uibModalInstance.close();
        };

        // 按钮变色处理 通过获取颜色改变颜色
        $scope.changeButtonCss = function(tempId){
            tempId = angular.element('#' + tempId);
            if(tempId.css('background-color') == "rgb(3, 169, 244)") {
                $(tempId).css("background","rgb(255, 255, 255)");
            } else{
                $(tempId).css("background","rgb(3, 169, 244)");
            }
        };

        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                type : 'selectSection',
                pageSize : params.pageSize,   //页面大小
                pageNo : params.pageNumber  //页码
            };
            return angular.extend(pageParam, $scope.teacherTimeDemand);
        };

        $scope.teacherTimeDemandAddTable = {
            url: app.api.address + '/virtual-class/teacherTimeDemand',
            method: 'get',
            cache: false,
            height: 0,
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pageSize: 10,
            pageNumber: 1,
            pageList: [5, 10, 20, 50],
            search: false,
            idField : "section", // 指定主键列
            uniqueId: "section", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParams,//传递参数（*）
            responseHandler: function(data) {
                return {
                    // "total": data.data.total,//总页数
                    "rows": data.data   //数据
                };
            },
            onLoadSuccess: function() {
                $compile(angular.element('#teacherTimeDemandAddTable').contents())($scope);
            },
            clickToSelect: true,
            columns: [{field: "section",title: "小节次",align: "center",valign: "middle",width: "12.5%"},
                {field: "monday",title: "周一",align: "center",valign: "middle",width: "12.5%",
                    formatter: function(value, row, index) {
                        var tempId = row.id;
                        var name = row.section;
                        tempId = "1_"+tempId;
                        var tempClass = row.section.substring(1, row.section.indexOf("节"));
                        tempClass = "btn_selectButton1_"+tempClass;
                        return '<button type="button" name="timeSelect" class="btn_selectButton" ng-click=\'changeButtonCss('+ angular.toJson(tempId) +')\' id='+tempId+' value='+name+'></button>';
                    }
                },
                {field: "tuesday",title: "周二",align: "center",valign: "middle",width: "12.5%",
                    formatter: function(value, row, index) {
                        var tempId = row.id;
                        var name = row.section;
                        tempId = "2_"+tempId;
                        var tempClass = row.section.substring(1, row.section.indexOf("节"));
                        tempClass = "btn_selectButton2_"+tempClass;
                        return '<button type="button" name="timeSelect" class="btn_selectButton" ng-click=\'changeButtonCss('+ angular.toJson(tempId) +')\' id='+tempId+' value='+name+'></button>';
                    }
                },
                {field: "wednesday",title: "周三",align: "center",valign: "middle",width: "12.5%",
                    formatter: function(value, row, index) {
                        var tempId = row.id;
                        var name = row.section;
                        tempId = "3_"+tempId;
                        var tempClass = row.section.substring(1, row.section.indexOf("节"));
                        tempClass = "btn_selectButton3_"+tempClass;
                        return '<button type="button" name="timeSelect" class="btn_selectButton" ng-click=\'changeButtonCss('+ angular.toJson(tempId) +')\'  id='+tempId+' value='+name+'></button>';
                    }
                },
                {field: "thursday",title: "周四",align: "center",valign: "middle",width: "12.5%",
                    formatter: function(value, row, index) {
                        var tempId = row.id;
                        var name = row.section;
                        tempId = "4_"+tempId;
                        var tempClass = row.section.substring(1, row.section.indexOf("节"));
                        tempClass = "btn_selectButton4_"+tempClass;
                        return '<button type="button" name="timeSelect" class="btn_selectButton" ng-click=\'changeButtonCss('+ angular.toJson(tempId) +')\' id='+tempId+' value='+name+'></button>';
                    }
                },
                {field: "friday",title: "周五",align: "center",valign: "middle",width: "12.5%",
                    formatter: function(value, row, index) {
                        var tempId = row.id;
                        var name = row.section;
                        tempId = "5_"+tempId;
                        var tempClass = row.section.substring(1, row.section.indexOf("节"));
                        tempClass = "btn_selectButton5_"+tempClass;
                        return '<button type="button" name="timeSelect" class="btn_selectButton" ng-click=\'changeButtonCss('+ angular.toJson(tempId) +')\' id='+tempId+' value='+name+'></button>';
                    }
                },
                {field: "saturday",title: "周六",align: "center",valign: "middle",width: "12.5%",
                    formatter: function(value, row, index) {
                        var tempId = row.id;
                        var name = row.section;
                        tempId = "6_"+tempId;
                        var tempClass = row.section.substring(1, row.section.indexOf("节"));
                        tempClass = "btn_selectButton6_"+tempClass;
                        return '<button type="button" name="timeSelect" class="btn_selectButton" ng-click=\'changeButtonCss('+ angular.toJson(tempId) +')\' id='+tempId+' value='+name+'></button>';
                    }
                },
                {field: "sunday",title: "周日",align: "center",valign: "middle",width: "12.5%",
                    formatter: function(value, row, index) {
                        var tempId = row.id;
                        var name = row.section;
                        tempId = "7_"+tempId;
                        var tempClass = row.section.substring(1, row.section.indexOf("节"));
                        tempClass = "btn_selectButton7_"+tempClass;
                        return '<button type="button" name="timeSelect" class="btn_selectButton" ng-click=\'changeButtonCss('+ angular.toJson(tempId) +')\' id='+tempId+' value='+name+'></button>';
                    }
                }
            ]
        };

        // 确定提交表单 新增教师时间要求信息
        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            if($scope.time.startWeek>$scope.time.endWeek){
                alertService('开始周不能大于结束周');
                return;
            }

            // 测试并结算出来
            var weekDay = 0;	// 定义星期几
            var weekDayArray = [];	// 存储星期的数组

            var mondaySectionArray = [];	// 周一
            var mondaySection = "";
            var mondaySectionNameArray = [];// 周一
            var mondaySectionName = "";

            var tuesdaySectionArray = [];	// 周二
            var tuesdaySection = "";		// 周二
            var tuesdaySectionNameArray = [];
            var tuesdaySectionName = "";

            var wednesdaySectionArray = [];	// 周三
            var wednesdaySection = "";		// 周三
            var wednesdaySectionNameArray = [];
            var wednesdaySectionName = "";

            var thursdaySectionArray = [];	// 周四
            var thursdaySection = "";		// 周四
            var thursdaySectionNameArray = [];
            var thursdaySectionName = "";

            var fridaySectionArray = [];	// 周五
            var fridaySection = "";			// 周五
            var fridaySectionNameArray = [];
            var fridaySectionName = "";

            var saturdaySectionArray = [];	// 周六
            var saturdaySection = "";		// 周六
            var saturdaySectionNameArray = [];
            var saturdaySectionName = "";

            var sundaySectionArray = [];	// 周日
            var sundaySection = "";			// 周日
            var sundaySectionNameArray = [];
            var sundaySectionName = "";

            var sectionId = "";	// 定义节次，以“,”隔开
            var sectionName = "";
            var sectionArray = [];	// 存储节次的数组
            var sectionNameArray = [];
            $("button[name='timeSelect']").each(function(j,item){
                if(item.style.backgroundColor == "rgb(3, 169, 244)") {
                    weekDay = item.id.substring(item.id.indexOf("_")-1,item.id.indexOf("_"));
                    sectionId = item.id.substring(item.id.indexOf("_")+1);
                    sectionName = item.value;

                    // 根据不同星期添加对应星期的节次,并将数组转换成字符串
                    if(weekDay == 1){
                        mondaySectionArray.push(sectionId);
                        mondaySectionNameArray.push(sectionName);
                        mondaySection = mondaySectionArray.join(",");
                        mondaySectionName = mondaySectionNameArray.join(",");
                    }if(weekDay == 2){
                        tuesdaySectionArray.push(sectionId);
                        tuesdaySectionNameArray.push(sectionName);
                        tuesdaySection = tuesdaySectionArray.join(",");
                        tuesdaySectionName = tuesdaySectionNameArray.join(",");
                    }if(weekDay == 3){
                        wednesdaySectionArray.push(sectionId);
                        wednesdaySectionNameArray.push(sectionName);
                        wednesdaySection = wednesdaySectionArray.join(",");
                        wednesdaySectionName = wednesdaySectionNameArray.join(",");
                    }if(weekDay == 4){
                        thursdaySectionArray.push(sectionId);
                        thursdaySectionNameArray.push(sectionName);
                        thursdaySection = thursdaySectionArray.join(",");
                        thursdaySectionName = thursdaySectionNameArray.join(",");
                    }if(weekDay == 5){
                        fridaySectionArray.push(sectionId);
                        fridaySectionNameArray.push(sectionName);
                        fridaySection = fridaySectionArray.join(",");
                        fridaySectionName = fridaySectionNameArray.join(",");
                    }if(weekDay == 6){
                        saturdaySectionArray.push(sectionId);
                        saturdaySectionNameArray.push(sectionName);
                        saturdaySection = saturdaySectionArray.join(",");
                        saturdaySectionName = saturdaySectionNameArray.join(",");
                    }if(weekDay == 7){
                        sundaySectionArray.push(sectionId);
                        sundaySectionNameArray.push(sectionName);
                        sundaySection = sundaySectionArray.join(",");
                        sundaySectionName = sundaySectionNameArray.join(",");
                    }

                    weekDayArray.push(weekDay);
                    sectionArray.push(sectionId);
                }
            });

            // 星期去重
            weekDayArray.sort();	// 星期数组排序
            var weekDayArrayOnly = [weekDayArray[0]];	// 定义去重数组
            for(var i = 0; i < weekDayArray.length; i++){
                if(weekDayArray[i] !== weekDayArrayOnly[weekDayArrayOnly.length - 1]){
                    weekDayArrayOnly.push(weekDayArray[i]);
                }
            }

            var teacherTimeDemandFinalResult = [];	// 最终提交结果
            // 初始化没有的数据 5条必须的
            var teacherTimeDemand = {};

            // 一遍判断一边push(拉)进来
            if(mondaySection != ""){
                teacherTimeDemand = {
                    "id" : "1",
                    "startWeek" : $scope.time.startWeek,
                    "endWeek" : $scope.time.endWeek,
                    "startEndWeek":$scope.time.startWeek + "-" + $scope.time.endWeek,
                    "oddEvenWeek" : $scope.time.oddEvenWeek,
                    "weekDay" : "1",
                    "sectionName" : mondaySectionName,
                    "section" : mondaySection
                };
                teacherTimeDemandFinalResult.push(teacherTimeDemand);
            }
            if(tuesdaySection != ""){
                teacherTimeDemand = {
                    "id" : "1",
                    "startWeek" : $scope.time.startWeek,
                    "endWeek" : $scope.time.endWeek,
                    "startEndWeek":$scope.time.startWeek + "-" + $scope.time.endWeek,
                    "oddEvenWeek" : $scope.time.oddEvenWeek,
                    "weekDay" : "2",
                    "sectionName" : tuesdaySectionName,
                    "section" : tuesdaySection
                };
                teacherTimeDemandFinalResult.push(teacherTimeDemand);
            }
            if(wednesdaySection != ""){
                teacherTimeDemand = {
                    "id" : "1",
                    "startWeek" : $scope.time.startWeek,
                    "endWeek" : $scope.time.endWeek,
                    "startEndWeek":$scope.time.startWeek + "-" + $scope.time.endWeek,
                    "oddEvenWeek" : $scope.time.oddEvenWeek,
                    "weekDay" : "3",
                    "sectionName" : wednesdaySectionName,
                    "section" : wednesdaySection
                };
                teacherTimeDemandFinalResult.push(teacherTimeDemand);
            }
            if(thursdaySection != ""){
                teacherTimeDemand = {
                    "id" : "1",
                    "startWeek" : $scope.time.startWeek,
                    "endWeek" : $scope.time.endWeek,
                    "startEndWeek":$scope.time.startWeek + "-" + $scope.time.endWeek,
                    "oddEvenWeek" : $scope.time.oddEvenWeek,
                    "weekDay" : "4",
                    "sectionName" : thursdaySectionName,
                    "section" : thursdaySection
                };
                teacherTimeDemandFinalResult.push(teacherTimeDemand);
            }
            if(fridaySection != ""){
                teacherTimeDemand = {
                    "id" : "1",
                    "startWeek" : $scope.time.startWeek,
                    "endWeek" : $scope.time.endWeek,
                    "startEndWeek":$scope.time.startWeek + "-" + $scope.time.endWeek,
                    "oddEvenWeek" : $scope.time.oddEvenWeek,
                    "weekDay" : "5",
                    "sectionName" : fridaySectionName,
                    "section" : fridaySection
                };
                teacherTimeDemandFinalResult.push(teacherTimeDemand);
            }
            if(saturdaySection != ""){
                teacherTimeDemand = {
                    "id" : "1",
                    "startWeek" : $scope.time.startWeek,
                    "endWeek" : $scope.time.endWeek,
                    "startEndWeek":$scope.time.startWeek + "-" + $scope.time.endWeek,
                    "oddEvenWeek" : $scope.time.oddEvenWeek,
                    "weekDay" : "6",
                    "sectionName" : saturdaySectionName,
                    "section" : saturdaySection
                };
                teacherTimeDemandFinalResult.push(teacherTimeDemand);
            }
            if(sundaySection != ""){
                teacherTimeDemand = {
                    "id" : "1",
                    "startWeek" : $scope.time.startWeek,
                    "endWeek" : $scope.time.endWeek,
                    "startEndWeek":$scope.time.startWeek + "-" + $scope.time.endWeek,
                    "oddEvenWeek" : $scope.time.oddEvenWeek,
                    "weekDay" : "7",
                    "sectionName" : sundaySectionName,
                    "section" : sundaySection
                };
                teacherTimeDemandFinalResult.push(teacherTimeDemand);
            }

            //starts_gradePlateSettingService.addTime(teacherTimeDemandFinalResult, function(error, message){
            // $timeout(function () {
                teacherTimeDemandFinalResult.forEach (function( teacherTimeDemand) {
                    items.push( teacherTimeDemand);
                });
                    console.log(items);
                    // if(error) {
                    //     alertService(message);
                    //     return;
                    // }

                angular.element('#plateTimeTable').bootstrapTable('load',items);

                $uibModalInstance.close();
                alertService('success', '新增成功');
            // }, 300);
            //});
        };
    }
    addInfoController.$inject = ['app', '$timeout', '$compile', '$scope', '$uibModal', '$uibModalInstance', 'items', 'starts_gradePlateSettingService', 'formVerifyService', 'alertService'];

    // 修改控制器
    var modifyController = function ($compile, $scope, $uibModalInstance, $uibModal, item, starts_gradePlateSettingService, alertService, formVerifyService) {

        //学年学期下拉框
        var semesterObjs = [];
        starts_gradePlateSettingService.getSemester(function (data) {
            semesterObjs = data;
            findSemester();
        });
        var findSemester = function () {
            $scope.semesterObjs =semesterObjs;
            var html = '' +
                '<select  ui-select2 ng-options="semesterObj.id as semesterObj.name  for semesterObj in semesterObjs" ui-chosen="codeGrade_add_form.semesterId" ng-required="true" '
                +  ' ng-required="true" ng-model="gradePlateSetting.semesterId" id="semesterId" name="semesterId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#semesterId").parent().empty().append(html);
            $compile(angular.element("#semesterId").parent().contents())($scope);
        };

        // 数据初始化
        $scope.gradePlateSetting = item;
        $scope.timeDemandFinalResult = [];
        var timeDemandFinalResult =[];
        starts_gradePlateSettingService.get(item.id, function (data) {
            console.log(data);
            timeDemandFinalResult = data;
            timeDemandFinalResultFn();
        });
        var timeDemandFinalResultFn = function () {
            timeDemandFinalResult.forEach (function( teacherTimeDemand) {
                teacherTimeDemand.startEndWeek = teacherTimeDemand.startWeek+'-'+teacherTimeDemand.endWeek;
                teacherTimeDemand.sectionName = teacherTimeDemand.section;
                teacherTimeDemand.section = teacherTimeDemand.sectionId;
                $scope.timeDemandFinalResult.push( teacherTimeDemand);
            });
            angular.element('#plateTimeTable').bootstrapTable('load',$scope.timeDemandFinalResult);
        };
        $scope.plateTimeTable = {
            onLoadSuccess: function() {
                $compile(angular.element('#plateTimeTable').contents())($scope);
            },
            //url: 'data_test/starts/tableview_gradePlateSetting.json',
            //url: app.api.address + '/virtual-class/gradePlate',
            method: 'get',
            cache: false,
            height: $scope.table_height,
            toolbar: '#toolbar', //工具按钮用哪个容器
            // sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 5,
            pageNumber:1,
            //pageList: [5,10, 20, 30, 50, 100], // 设置可供选择的页面数据条数
            // paginationPreText: '上一页',
            // paginationNextText: '下一页',
            sortName: 'plateTime', // 默认排序字段
            sortOrder: 'desc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField : "id", // 指定主键列
            uniqueId: "id", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            // queryParams: $scope.queryParams,//传递参数（*）
            search: false,
            showColumns: true,
            showRefresh: true,
            data:$scope.timeDemandFinalResult,
            columns: [
                {checkbox: true, width: "5%"},
                {field:"startWeek",  visible:false},
                {field:"endWeek",  visible:false},
                {field:"oddEvenWeek",  visible:false},
                {field:"startEndWeek",title:"起止周",align:"center",valign:"middle"},
                {field:"weekDay",title:"星期",align:"center",valign:"middle"},
                {field:"section", visible:false},
                {field:"sectionName",title:"节次",align:"center",valign:"middle"}

            ]
        };

        // 打开新增面板
        $scope.openAdd = function(){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/starts/gradePlateSetting/addTime.html',
                size: 'lg',
                resolve: {
                    items: function () {
                        console.log($scope.timeDemandFinalResult);
                        // $scope.teacherTimeDemandFinalResult = [];
                        return $scope.timeDemandFinalResult;
                    },
                },
                controller: addInfoController
            });
        };

        // 打开删除面板
        $scope.openDelete = function(){
            var rows = angular.element('#plateTimeTable').bootstrapTable('getSelections');
            if(rows.length == 0){
                alertService('请先选择要删除的项');
                return;
            }
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/starts/gradePlateSetting/delete.html',
                size: 'lg',
                resolve: {
                    items: function () {
                        return rows;
                    },
                    data: function () {
                        console.log($scope.timeDemandFinalResult);
                        return $scope.timeDemandFinalResult;
                    },
                },
                controller: deleteTimeController
            });
        };

        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            $scope.gradePlateSetting.gradePlateTimeList = $scope.timeDemandFinalResult;
            starts_gradePlateSettingService.update($scope.gradePlateSetting, function (error, message) {
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
    modifyController.$inject = ['$compile', '$scope', '$uibModalInstance', '$uibModal', 'item', 'starts_gradePlateSettingService', 'alertService', 'formVerifyService'];

    // 删除控制器
    var deleteTimeController = function ($scope, $uibModalInstance, items, data, starts_gradePlateSettingService, alertService) {
        $scope.message = "确定要删除吗？";
        var timeDemand = {};
        $scope.ok = function () {
            items.forEach (function(item) {
                var index = data.indexOf(item);
                data.splice(index,1);
            });
            alertService('success', '删除成功');
            angular.element('#plateTimeTable').bootstrapTable('load',data);
            $uibModalInstance.close();
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    deleteTimeController.$inject = ['$scope', '$uibModalInstance', 'items', 'data', 'starts_gradePlateSettingService', 'alertService'];

    // 删除控制器
    var deleteController = function ($scope, $uibModalInstance, items, starts_gradePlateSettingService, alertService) {
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {
            var ids = []; // 代码类型号数组
            items.forEach (function(gradePlateSetting) {
                ids.push(gradePlateSetting.id);
            });
            starts_gradePlateSettingService.delete(ids, function (error, message) {
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
    deleteController.$inject = ['$scope', '$uibModalInstance', 'items', 'starts_gradePlateSettingService', 'alertService'];

    // 添加控制器
    window.starts_gradePlateOpenAddController = function ($rootScope, $stateParams, $http, $compile, $scope, $uibModal, $window, starts_gradePlateSettingService, formVerifyService, app, $state) {
        // 表格的高度
        $scope.table_height = $window.innerHeight - 400;
        $scope.scollDivHeight = $window.innerHeight -100;
        //学年学期下拉框
        var semesterObjs = [];
        starts_gradePlateSettingService.getSemester(function (data) {
            semesterObjs = data;
            findSemester();
        });
        var findSemester = function () {
            $scope.semesterObjs =semesterObjs;
            var html = '' +
                '<select  ui-select2 ng-options="semesterObj.id as semesterObj.name  for semesterObj in semesterObjs" ui-chosen="gradePlateSetting_add_form.semesterId" ng-required="true" '
                +  ' ng-required="true" ng-model="gradePlateSetting.semesterId" id="semesterId" name="semesterId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#semesterId").parent().empty().append(html);
            $compile(angular.element("#semesterId").parent().contents())($scope);
        };

        $scope.teacherTimeDemandFinalResult =[];
        $scope.plateTimeTable = {
            onLoadSuccess: function() {
                $compile(angular.element('#plateTimeTable').contents())($scope);
            },
            //url: 'data_test/starts/tableview_gradePlateSetting.json',
            //url: app.api.address + '/virtual-class/gradePlate',
            method: 'get',
            cache: false,
            height: $scope.table_height,
            toolbar: '#toolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            // striped: true,
            // pagination: true,
            pageSize: 20,
            pageNumber:1,
            //pageList: [5,10, 20, 30, 50, 100], // 设置可供选择的页面数据条数
            // paginationPreText: '上一页',
            // paginationNextText: '下一页',
            sortName: 'plateTime', // 默认排序字段
            sortOrder: 'desc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField : "id", // 指定主键列
            uniqueId: "id", // 每行唯一标识
            // queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            // queryParams: $scope.queryParams,//传递参数（*）
            search: false,
            // showColumns: true,
            // showRefresh: true,
            data:$scope.teacherTimeDemandFinalResult,
            columns: [
                {checkbox: true, width: "5%"},
                {field:"startWeek",  visible:false},
                {field:"endWeek",  visible:false},
                {field:"oddEvenWeek",  visible:false},
                {field:"startEndWeek",title:"起止周",align:"center",valign:"middle"},
                {field:"weekDay",title:"星期",align:"center",valign:"middle"},
                {field:"section", visible:false},
                {field:"sectionName",title:"节次",align:"center",valign:"middle"}
            ]
        };

        // 打开新增面板
        $scope.openAdd = function(){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/starts/gradePlateSetting/addTime.html',
                size: 'lg',
                resolve: {
                    items: function () {
                        console.log($scope.teacherTimeDemandFinalResult);
                        // $scope.teacherTimeDemandFinalResult = [];
                        return $scope.teacherTimeDemandFinalResult;
                    },
                },
                controller: addInfoController
            });
        };

        // 返回上一页
        $scope.goBack = function () {
            $state.go("home.common.gradePlateSettingController");
        }

        // 打开删除面板
        $scope.openDelete = function(){
            var rows = angular.element('#plateTimeTable').bootstrapTable('getSelections');
            if(rows.length == 0){
                alertService('请先选择要删除的项');
                return;
            }
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/starts/gradePlateSetting/delete.html',
                size: 'lg',
                resolve: {
                    items: function () {
                        return rows;
                    },
                    data: function () {
                        console.log($scope.teacherTimeDemandFinalResult);
                        return $scope.teacherTimeDemandFinalResult;
                    },
                },
                controller: deleteTimeController
            });
        };

        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            $scope.gradePlateSetting.gradePlateTimeList = $scope.teacherTimeDemandFinalResult;
            starts_gradePlateSettingService.add($scope.gradePlateSetting, function (error, message) {
                if (error) {
                    alertService(message);
                    return;
                }
                // $uibModalInstance.close();
                angular.element('#showTable').bootstrapTable('refresh');
                $state.go("home.common.gradePlateSettingController");
                alertService('success', '新增成功');
            });
        };
        $scope.close = function () {
            $state.go("home.common.gradePlateSettingController");
        };
    };
    starts_gradePlateOpenAddController.$inject = ['$rootScope', '$stateParams', '$http', '$compile', '$scope', '$uibModal', '$window', 'starts_gradePlateSettingService', 'formVerifyService', 'app', '$state'];

    // 修改控制器
    window.starts_gradePlateOpenModifyController = function ($rootScope, $stateParams, $http, $compile, $scope, $uibModal, $window, starts_gradePlateSettingService, formVerifyService, app, $state) {
        $scope.table_height = $window.innerHeight - 285;
        $scope.scollDivHeight = $window.innerHeight -100;
        //学年学期下拉框
        var semesterObjs = [];
        starts_gradePlateSettingService.getSemester(function (data) {
            semesterObjs = data;
            findSemester();
        });
        var findSemester = function () {
            $scope.semesterObjs =semesterObjs;
            var html = '' +
                '<select  ui-select2 ng-options="semesterObj.id as semesterObj.name  for semesterObj in semesterObjs" ui-chosen="codeGrade_add_form.semesterId" ng-required="true" '
                +  ' ng-required="true" ng-model="gradePlateSetting.semesterId" id="semesterId" name="semesterId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#semesterId").parent().empty().append(html);
            $compile(angular.element("#semesterId").parent().contents())($scope);
        };

        var item = angular.fromJson($stateParams.params);
        // 数据初始化
        $scope.gradePlateSetting = item;
        $scope.timeDemandFinalResult = [];
        var timeDemandFinalResult =[];
        starts_gradePlateSettingService.get(item.id, function (data) {
            console.log(data);
            timeDemandFinalResult = data;
            timeDemandFinalResultFn();
        });
        var timeDemandFinalResultFn = function () {
            timeDemandFinalResult.forEach (function( teacherTimeDemand) {
                teacherTimeDemand.startEndWeek = teacherTimeDemand.startWeek+'-'+teacherTimeDemand.endWeek;
                teacherTimeDemand.sectionName = teacherTimeDemand.section;
                teacherTimeDemand.section = teacherTimeDemand.sectionId;
                $scope.timeDemandFinalResult.push( teacherTimeDemand);
            });
            angular.element('#plateTimeTable').bootstrapTable('load',$scope.timeDemandFinalResult);
        };
        $scope.plateTimeTable = {
            onLoadSuccess: function() {
                $compile(angular.element('#plateTimeTable').contents())($scope);
            },
            //url: 'data_test/starts/tableview_gradePlateSetting.json',
            //url: app.api.address + '/virtual-class/gradePlate',
            method: 'get',
            cache: false,
            height: $scope.table_height,
            toolbar: '#toolbar', //工具按钮用哪个容器
            // sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            //pagination: true,
            pageSize: 20,
            pageNumber:1,
            //pageList: [5,10, 20, 30, 50, 100], // 设置可供选择的页面数据条数
            // paginationPreText: '上一页',
            // paginationNextText: '下一页',
            sortName: 'plateTime', // 默认排序字段
            sortOrder: 'desc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField : "id", // 指定主键列
            uniqueId: "id", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            // queryParams: $scope.queryParams,//传递参数（*）
            search: false,
            // showColumns: true,
            // showRefresh: true,
            data:$scope.timeDemandFinalResult,
            columns: [
                {checkbox: true, width: "5%"},
                {field:"startWeek",  visible:false},
                {field:"endWeek",  visible:false},
                {field:"oddEvenWeek",  visible:false},
                {field:"startEndWeek",title:"起止周",align:"center",valign:"middle"},
                {field:"weekDay",title:"星期",align:"center",valign:"middle"},
                {field:"section", visible:false},
                {field:"sectionName",title:"节次",align:"center",valign:"middle"}

            ]
        };

        // 返回上一页
        $scope.goBack = function () {
            $state.go("home.common.gradePlateSettingController");
        }

        // 打开新增面板
        $scope.openAdd = function(){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/starts/gradePlateSetting/addTime.html',
                size: 'lg',
                resolve: {
                    items: function () {
                        console.log($scope.timeDemandFinalResult);
                        // $scope.teacherTimeDemandFinalResult = [];
                        return $scope.timeDemandFinalResult;
                    },
                },
                controller: addInfoController
            });
        };

        // 打开删除面板
        $scope.openDelete = function(){
            var rows = angular.element('#plateTimeTable').bootstrapTable('getSelections');
            if(rows.length == 0){
                alertService('请先选择要删除的项');
                return;
            }
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/starts/gradePlateSetting/delete.html',
                size: 'lg',
                resolve: {
                    items: function () {
                        return rows;
                    },
                    data: function () {
                        console.log($scope.timeDemandFinalResult);
                        return $scope.timeDemandFinalResult;
                    },
                },
                controller: deleteTimeController
            });
        };

        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            $scope.gradePlateSetting.gradePlateTimeList = $scope.timeDemandFinalResult;
            starts_gradePlateSettingService.update($scope.gradePlateSetting, function (error, message) {
                if (error) {
                    alertService(message);
                    return;
                }
                // $uibModalInstance.close();
                angular.element('#showTable').bootstrapTable('refresh');
                $state.go("home.common.gradePlateSettingController");
                alertService('success', '修改成功');
            });
        };

        $scope.close = function () {
            $state.go("home.common.gradePlateSettingController");
        };
    };
    starts_gradePlateOpenModifyController.$inject = ['$rootScope', '$stateParams', '$http', '$compile', '$scope', '$uibModal', '$window', 'starts_gradePlateSettingService', 'formVerifyService', 'app', '$state'];
})(window);

