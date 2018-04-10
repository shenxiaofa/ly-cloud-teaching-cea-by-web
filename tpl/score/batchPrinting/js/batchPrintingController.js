;(function (window, undefined) {
    'use strict';

    window.score_batchPrintingController = function($timeout, app, $scope, $uibModal, $rootScope, $compile, $window, score_batchPrintingService, baseinfo_generalService, alertService){

        // 表格的高度
        $scope.table_height = $window.innerHeight - 226;

        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder
            };
            return angular.extend(pageParam, $scope.batchPrinting);
        }

        $scope.invigilationTeachersTable = {
            url: app.api.address + '/score/scorePrinting',
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
            responseHandler:function(response){
                return response.data;
            },
            onLoadSuccess: function() {
                $compile(angular.element('#invigilationTeachersTable').contents())($scope);
            },
            columns: [
                {checkbox: true,width: "3%"},
                {field:"studentNum",title:"学号",align:"center",valign:"middle"},
                {field:"studentName",title:"姓名",align:"center",valign:"middle"},
                {field:"statustate",title:"学籍状态",align:"center",valign:"middle"},
                {field:"studentType",title:"学生类别",align:"center",valign:"middle"},
                {field:"departmentName",title:"学院",align:"center",valign:"middle"},
                {field:"gradeName",title:"年级",align:"center",valign:"middle"},
                {field:"majorName",title:"专业",align:"center",valign:"middle"},
                {field:"className",title:"班级",align:"center",valign:"middle"}
            ]
        };

        // 上课年级
        $scope.gradeNameData = [
            {
                id: '',
                dataNumber: '== 请选择 =='
            }
        ];
        baseinfo_generalService.gradeList(function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            if (data && data.data && data.data.length > 0) {
                var gradeList = [];
                angular.forEach(data.data, function(grade, index){
                    gradeList.push({
                        id: grade.dataNumber,
                        dataNumber: grade.dataNumber
                    });
                });
                $scope.gradeNameData = $scope.gradeNameData.concat(gradeList);
            }
            var html = '' +
                '<select ng-model="batchPrinting.gradeName" id="gradeName" name="gradeName" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="gradeNameItem in gradeNameData" value="{{gradeNameItem.id}}">{{gradeNameItem.dataNumber}}</option>' +
                '</select>';
            angular.element("#gradeName").parent().empty().append(html);
            $compile(angular.element("#gradeName").parent().contents())($scope);
        });

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
            $scope.batchPrinting = {};
            angular.element('form[name="pyfabzkz_form"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#invigilationTeachersTable').bootstrapTable('refresh');
        };

        // 打开修改面板
        $scope.preview = function(item){
            var rows = $('#invigilationTeachersTable').bootstrapTable('getSelections');
            if(rows.length == 0||rows.length>1){
                alertService('只能选一条预览的学生');
                return;
            }
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/score/batchPrinting/preview.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return rows[0];
                    }
                },
                controller: previewController
            });
        };

        $scope.print = function(){
            var rows = $('#invigilationTeachersTable').bootstrapTable('getSelections');
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
                for(var prop in sortMap){
                    //console.log(prop,sortMap[prop])
                }
                var index = 0;
                for(var prop in sortMap){
                    var count = sortMap[prop] * 1;
                    $(target).bootstrapTable('mergeCells',{index:index, field:fieldName, colspan: 7});
                    index += count;
                }
            }
            for(var i=0;i<rows.length;i++){
                var item = rows[i];
                $scope.departmentName = item.departmentName;
                $scope.majorName = item.majorName;
                $scope.className = item.className;
                $scope.schoolSystem = item.schoolSystem;
                $scope.studentNum = item.studentNum;
               
                var type = "0";
                var type1 = "1";
                var type2 = "2";
                var type3 = "3";
                $scope.myData = [];
                var totalGradePoint = 0;
                var totalCredit = 0;
                var requireCourseCredit = 0;
                var electiveCourseCredit = 0;
                // $scope.scoreInfo =[];
                // $scope.scoreInfo1 =[];
                // $scope.scoreInfo2 =[];
                // $scope.scoreInfo3 =[];
                // score_batchPrintingService.queryScoreInfo(item.studentNum,type,function (error, message, data) {
                //     if (error) {
                //         alertService(message);
                //         return;
                //     }
                //     $scope.scoreInfo = data.data;
                //     }
                //
                // });
                // score_batchPrintingService.queryScoreInfo(item.studentNum,type,function (error, message, data) {
                //     if (error) {
                //         alertService(message);
                //         return;
                //     }
                //     $scope.scoreInfo1 = data.data;
                // });
                //
                // score_batchPrintingService.queryScoreInfo(item.studentNum,type,function (error, message, data) {
                //     if (error) {
                //         alertService(message);
                //         return;
                //     }
                //     $scope.scoreInfo2 = data.data;
                // });
                //
                // score_batchPrintingService.queryScoreInfo(item.studentNum,type,function (error, message, data) {
                //     if (error) {
                //         alertService(message);
                //         return;
                //     }
                //     $scope.scoreInfo3 = data.data;
                // });

                $scope.scoreIntoTable = {
                    url: app.api.address + '/score/scorePrinting/'+ item.studentNum+'/'+type,
                    // url: app.api.address + '/score/scorePrinting',
                    method: 'get',
                    cache: false,
                    // height: 500,
                    //toolbar: '#ttoolbar', //工具按钮用哪个容器
                    striped: true,
                    search: false,
                    queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
                    queryParams: '',//传递参数（*）
                    clickToSelect: true,
                    responseHandler:function(response){
                        return response.data;
                    },
                    onLoadSuccess: function() {
                        $compile(angular.element('#scoreIntoTable').contents())($scope);
                        var data = $('#scoreIntoTable').bootstrapTable('getData', true);
                        data.forEach(function(obj) {
                            if(obj.gradePoint){
                                $scope.myData.push(obj.gradePoint);
                                totalGradePoint+= parseFloat(obj.gradePoint);
                            }
                            if(obj.credit){
                                totalCredit +=parseFloat(obj.credit);
                            }
                            if(obj.courseProperty){
                                if(obj.courseProperty=="必修"&&obj.credit){
                                    requireCourseCredit +=parseFloat(obj.credit);
                                }
                                else if(obj.courseProperty=="选修"&&obj.credit){
                                    electiveCourseCredit +=parseFloat(obj.credit);
                                }
                            }
                        });
                        //合并单元格
                        mergeCells(data, "semesterId", 1, $('#scoreIntoTable'));
                    },
                    columns: [
                        {field:"semesterId",title:"",align:"center",valign:"middle",formatter: function (value, row, index) {
                            if(row.semesterId){
                                if(row.courseName){
                                    return '';
                                }else{
                                    return value;
                                }
                            }else{
                                return '';
                            }
                        }},
                        {field:"courseName",title:"课程名称",align:"center",valign:"middle",formatter: function (value, row, index) {
                            if(row.courseName){
                                return value;
                            }else{
                                return "";
                            }
                        }},
                        {field:"courseProperty",title:"性质",align:"center",valign:"middle",formatter: function (value, row, index) {
                            if(row.courseProperty){
                                return value;
                            }else{
                                return "";
                            }
                        }},
                        {field:"credit",title:"学分",align:"center",valign:"middle",formatter: function (value, row, index) {
                            if(row.credit){
                                return value;
                            }else{
                                return "";
                            }
                        }},
                        {field:"score",title:"成绩",align:"center",valign:"middle",formatter: function (value, row, index) {
                            if(row.score){
                                return value;
                            }else{
                                return "";
                            }
                        }},
                        {field:"gradePoint",title:"绩点",align:"center",valign:"middle",formatter: function (value, row, index) {
                            if(row.gradePoint){
                                return value;
                            }else{
                                return "";
                            }
                        }},
                        {field:"mark",title:"标识",align:"center",valign:"middle",formatter: function (value, row, index) {
                            if(row.mark){
                                return value;
                            }else{
                                return "";
                            }
                        }}
                    ]
                };
                var tableHtml = '<table id="scoreIntoTable" ui-jq="bootstrapTable" ui-options="scoreIntoTable" class="table table-responsive"></table>'
                angular.element("#table").empty().append(tableHtml);
                $compile(angular.element("#table").contents())($scope);

                var gradeName1= (parseInt(item.gradeName.substr(0,4))+1).toString();
                $scope.scoreIntoTable1 = {
                    url: app.api.address + '/score/scorePrinting/'+ item.studentNum+'/'+type1,
                    // url: app.api.address + '/score/scorePrinting',
                    method: 'get',
                    cache: false,
                    // height: 500,
                    //toolbar: '#ttoolbar', //工具按钮用哪个容器
                    striped: true,
                    search: false,
                    queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
                    queryParams: '',//传递参数（*）
                    clickToSelect: true,
                    responseHandler:function(response){
                        return response.data;
                    },
                    onLoadSuccess: function() {
                        $compile(angular.element('#scoreIntoTable1').contents())($scope);
                        var data = $('#scoreIntoTable1').bootstrapTable('getData', true);
                        data.forEach(function(obj) {
                            if(obj.gradePoint){
                                $scope.myData.push(obj.gradePoint);
                                totalGradePoint+= parseFloat(obj.gradePoint);
                            }
                            if(obj.credit){
                                totalCredit +=parseFloat(obj.credit);
                            }
                            if(obj.courseProperty){
                                if(obj.courseProperty=="必修"&&obj.credit){
                                    requireCourseCredit +=parseFloat(obj.credit);
                                }
                                else if(obj.courseProperty=="选修"&&obj.credit){
                                    electiveCourseCredit +=parseFloat(obj.credit);
                                }
                            }
                        })
                        //合并单元格
                        mergeCells(data, "semesterId", 1, $('#scoreIntoTable1'));
                    },
                    columns: [
                        {field:"semesterId",title:"",align:"center",valign:"middle",formatter: function (value, row, index) {
                            if(row.semesterId){
                                if(row.courseName){
                                    return '';
                                }else{
                                    return value;
                                }
                            }else{
                                return '';
                            }
                        }},
                        {field:"courseName",title:"课程名称",align:"center",valign:"middle",formatter: function (value, row, index) {
                            if(row.courseName){
                                return value;
                            }else{
                                return "";
                            }
                        }},
                        {field:"courseProperty",title:"性质",align:"center",valign:"middle",formatter: function (value, row, index) {
                            if(row.courseProperty){
                                return value;
                            }else{
                                return "";
                            }
                        }},
                        {field:"credit",title:"学分",align:"center",valign:"middle",formatter: function (value, row, index) {
                            if(row.credit){
                                return value;
                            }else{
                                return "";
                            }
                        }},
                        {field:"score",title:"成绩",align:"center",valign:"middle",formatter: function (value, row, index) {
                            if(row.score){
                                return value;
                            }else{
                                return "";
                            }
                        }},
                        {field:"gradePoint",title:"绩点",align:"center",valign:"middle",formatter: function (value, row, index) {
                            if(row.gradePoint){
                                return value;
                            }else{
                                return "";
                            }
                        }},
                        {field:"mark",title:"标识",align:"center",valign:"middle",formatter: function (value, row, index) {
                            if(row.mark){
                                return value;
                            }else{
                                return "";
                            }
                        }}
                    ]
                };
                var tableHtml1 = '<table id="scoreIntoTable1" ui-jq="bootstrapTable" ui-options="scoreIntoTable1" class="table table-responsive"></table>'
                angular.element("#table1").empty().append(tableHtml1);
                $compile(angular.element("#table1").contents())($scope);

                var gradeName2= (parseInt(item.gradeName.substr(0,4))+2).toString();
                $scope.scoreIntoTable2 = {
                    url: app.api.address + '/score/scorePrinting/'+ item.studentNum+'/'+type2,
                    // url: app.api.address + '/score/scorePrinting',
                    method: 'get',
                    cache: false,
                    // height: 500,
                    //toolbar: '#ttoolbar', //工具按钮用哪个容器
                    striped: true,
                    search: false,
                    queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
                    queryParams: '',//传递参数（*）
                    clickToSelect: true,
                    responseHandler:function(response){
                        return response.data;
                    },
                    onLoadSuccess: function() {
                        $compile(angular.element('#scoreIntoTable2').contents())($scope);
                        var data = $('#scoreIntoTable2').bootstrapTable('getData', true);
                        data.forEach(function(obj) {
                            if(obj.gradePoint){
                                $scope.myData.push(obj.gradePoint);
                                totalGradePoint+= parseFloat(obj.gradePoint);
                            }
                            if(obj.credit){
                                totalCredit +=parseFloat(obj.credit);
                            }
                            if(obj.courseProperty){
                                if(obj.courseProperty=="必修"&&obj.credit){
                                    requireCourseCredit +=parseFloat(obj.credit);
                                }
                                else if(obj.courseProperty=="选修"&&obj.credit){
                                    electiveCourseCredit +=parseFloat(obj.credit);
                                }
                            }
                        })
                        //合并单元格
                        mergeCells(data, "semesterId", 1, $('#scoreIntoTable2'));
                    },
                    columns: [
                        {field:"semesterId",title:"",align:"center",valign:"middle",formatter: function (value, row, index) {
                            if(row.semesterId){
                                if(row.courseName){
                                    return '';
                                }else{
                                    return value;
                                }
                            }else{
                                return '';
                            }
                        }},
                        {field:"courseName",title:"课程名称",align:"center",valign:"middle",formatter: function (value, row, index) {
                            if(row.courseName){
                                return value;
                            }else{
                                return "";
                            }
                        }},
                        {field:"courseProperty",title:"性质",align:"center",valign:"middle",formatter: function (value, row, index) {
                            if(row.courseProperty){
                                return value;
                            }else{
                                return "";
                            }
                        }},
                        {field:"credit",title:"学分",align:"center",valign:"middle",formatter: function (value, row, index) {
                            if(row.credit){
                                return value;
                            }else{
                                return "";
                            }
                        }},
                        {field:"score",title:"成绩",align:"center",valign:"middle",formatter: function (value, row, index) {
                            if(row.score){
                                return value;
                            }else{
                                return "";
                            }
                        }},
                        {field:"gradePoint",title:"绩点",align:"center",valign:"middle",formatter: function (value, row, index) {
                            if(row.gradePoint){
                                return value;
                            }else{
                                return "";
                            }
                        }},
                        {field:"mark",title:"标识",align:"center",valign:"middle",formatter: function (value, row, index) {
                            if(row.mark){
                                return value;
                            }else{
                                return "";
                            }
                        }}
                    ]
                };
                var tableHtml2 = '<table id="scoreIntoTable2" ui-jq="bootstrapTable" ui-options="scoreIntoTable2" class="table table-responsive"></table>'
                angular.element("#table2").empty().append(tableHtml2);
                $compile(angular.element("#table2").contents())($scope);

                var gradeName3= (parseInt(item.gradeName.substr(0,4))+3).toString();
                $scope.scoreIntoTable3 = {
                    url: app.api.address + '/score/scorePrinting/'+ item.studentNum+'/'+type3,
                    // url: app.api.address + '/score/scorePrinting',
                    method: 'get',
                    cache: false,
                    // height: 500,
                    //toolbar: '#ttoolbar', //工具按钮用哪个容器
                    striped: true,
                    search: false,
                    queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
                    queryParams: '',//传递参数（*）
                    clickToSelect: true,
                    responseHandler:function(response){
                        return response.data;
                    },
                    onLoadSuccess: function() {
                        $compile(angular.element('#scoreIntoTable3').contents())($scope);
                        var data = $('#scoreIntoTable3').bootstrapTable('getData', true);
                        data.forEach(function(obj) {
                            if(obj.gradePoint){
                                $scope.myData.push(obj.gradePoint);
                                totalGradePoint+= parseFloat(obj.gradePoint);
                            }
                            if(obj.credit){
                                totalCredit +=parseFloat(obj.credit);
                            }
                            if(obj.courseProperty){
                                if(obj.courseProperty=="必修"&&obj.credit){
                                    requireCourseCredit +=parseFloat(obj.credit);
                                }
                                else if(obj.courseProperty=="选修"&&obj.credit){
                                    electiveCourseCredit +=parseFloat(obj.credit);
                                }
                            }
                        })
                        //合并单元格
                        mergeCells(data, "semesterId", 1, $('#scoreIntoTable3'));
                    },
                    columns: [
                        {field:"semesterId",title:"",align:"center",valign:"middle",formatter: function (value, row, index) {
                            if(row.semesterId){
                                if(row.courseName){
                                    return '';
                                }else{
                                    return value;
                                }
                            }else{
                                return '';
                            }
                        }},
                        {field:"courseName",title:"课程名称",align:"center",valign:"middle",formatter: function (value, row, index) {
                            if(row.courseName){
                                return value;
                            }else{
                                return "";
                            }
                        }},
                        {field:"courseProperty",title:"性质",align:"center",valign:"middle",formatter: function (value, row, index) {
                            if(row.courseProperty){
                                return value;
                            }else{
                                return "";
                            }
                        }},
                        {field:"credit",title:"学分",align:"center",valign:"middle",formatter: function (value, row, index) {
                            if(row.credit){
                                return value;
                            }else{
                                return "";
                            }
                        }},
                        {field:"score",title:"成绩",align:"center",valign:"middle",formatter: function (value, row, index) {
                            if(row.score){
                                return value;
                            }else{
                                return "";
                            }
                        }},
                        {field:"gradePoint",title:"绩点",align:"center",valign:"middle",formatter: function (value, row, index) {
                            if(row.gradePoint){
                                return value;
                            }else{
                                return "";
                            }
                        }},
                        {field:"mark",title:"标识",align:"center",valign:"middle",formatter: function (value, row, index) {
                            if(row.mark){
                                return value;
                            }else{
                                return "";
                            }
                        }}
                    ]
                };
                var tableHtml3 = '<table id="scoreIntoTable3" ui-jq="bootstrapTable" ui-options="scoreIntoTable3" class="table table-responsive"></table>'
                angular.element("#table3").empty().append(tableHtml3);
                $compile(angular.element("#table3").contents())($scope);


                $timeout(function () {
                    $scope.averageGradePoint = (totalGradePoint/$scope.myData.length).toFixed(3);
                    $scope.totalCredit =   totalCredit ;
                    $scope.requireCourseCredit =   requireCourseCredit ;
                    $scope.electiveCourseCredit =   electiveCourseCredit ;

                    if(totalCredit==undefined){
                        $scope.totalCredit  = 0;
                    }
                    if(requireCourseCredit==undefined){
                        $scope.requireCourseCredit  = 0;
                    }
                    if(electiveCourseCredit==undefined){
                        $scope.electiveCourseCredit  = 0;
                    }
                    if(totalGradePoint==undefined||$scope.myData.length==0){
                        $scope.averageGradePoint  = 0.0;
                    }
                    var LODOP = getLodop();
                    // LODOP.PRINT_INIT(item.studentName+'学生总成绩单');
                    LODOP.SET_PRINT_STYLE('FontSize', 15);
                    LODOP.SET_PRINT_STYLE('Bold', 1);
                    LODOP.ADD_PRINT_TEXT(50, 480, 480, 39, '北京电影学院成绩表');
                    var tableHTML = '<div"><div style="width:270px;float:left;"><table id="table" border="1" cellspacing="0" bgcolor="#FFFFFF"style="border-collapse:collapse;table-layout:fixed;border:solid 1px ;">'//<td style=\"height:50px;text-align: center; \" style=\"text-align: center; vertical-align: middle; display: none;\"><\/td>
                        +angular.element('#scoreIntoTable').html().replace(/<th style/g,'<th style="font-size: 15px;font-weight: bold;text-align: center; vertical-align: middle; height:50px; "').replace(/<td/g,'<td style=" font-size: 12px;height:50px;text-align: center; "').replace(/<td style=\" font-size: 12px;height:50px;text-align: center; \" style=\"text-align: center; vertical-align: middle; display: none;\"><\/td>/g,'')+'</table></div>' +
                        '<div style="width:270px;float:left;"><table id="table1" border="1" cellspacing="0" bgcolor="#FFFFFF"style="border-collapse:collapse;table-layout:fixed;border:solid 1px;">'
                        +angular.element('#scoreIntoTable1').html().replace(/<th style/g,'<th style="font-size: 15px;font-weight: bold;text-align: center; vertical-align: middle; height:50px; "').replace(/<td/g,'<td style=" font-size: 12px;height:50px;text-align: center; "').replace(/<td style=\" font-size: 12px;height:50px;text-align: center; \" style=\"text-align: center; vertical-align: middle; display: none;\"><\/td>/g,'')+'</table></div>' +
                        '<div style="width:270px;float:left;"><table  border="1" cellspacing="0" bgcolor="#FFFFFF"style="border-collapse:collapse;table-layout:fixed;border:solid 1px ;">'
                        +angular.element('#scoreIntoTable2').html().replace(/<th style/g,'<th style="font-size: 15px;font-weight: bold;text-align: center; vertical-align: middle; height:50px; "').replace(/<td/g,'<td style=" font-size: 12px;height:50px;text-align: center; "').replace(/<td style=\" font-size: 12px;height:50px;text-align: center; \" style=\"text-align: center; vertical-align: middle; display: none;\"><\/td>/g,'')+'</table></div>' +
                        '<div style="width:270px;float:left;"><table  border="1" cellspacing="0" bgcolor="#FFFFFF"style="border-collapse:collapse;table-layout:fixed;border:solid 1px ;">'
                        +angular.element('#scoreIntoTable3').html().replace(/<th style/g,'<th style="font-size: 15px;font-weight: bold;text-align: center; vertical-align: middle; height:50px; "').replace(/<td/g,'<td style=" font-size: 12px;height:50px;text-align: center; "').replace(/<td style=\" font-size: 12px;height:50px;text-align: center; \" style=\"text-align: center; vertical-align: middle; display: none;\"><\/td>/g,'')+'</table></div>' +
                        '</div>'


                    var html = '<style>' +
                        '.row {font-size: 12px; margin-right: -15px;margin-left: -15px;}' +
                        ' .form-group {margin-right: -15px;margin-left: -15px;margin-bottom: 10px;}' +
                        '.col-xs-2 { width: 16.66666667%;}' +
                        '.col-xs-3 { width: 18%;}' +
                        '.col-xs-4 { width: 30.33333333%;}' +
                        '.col-xs-5 { width: 25%;}' +
                        '.col-xs-7 { width: 44.33333333%;}' +
                        '.control-label { padding-top: 7px;margin-bottom: 0;text-align: right;padding-right: 5px;}' +
                        '.col-xs-3, .col-xs-5, .col-xs-7,.col-xs-2, .col-xs-4{ float: left;position: relative;min-height: 1px; padding-right:15px;padding-left: 15px;}' +
                        '</style><form><div class="row">' +
                        '<div class="form-group col-xs-3">' +
                        '<label class="col-xs-5 control-label">学院：</label>' +
                        '<label class="col-xs-7"style="margin-top:7px;text-overflow:ellipsis; white-space:nowrap; overflow:hidden;">'+$scope.departmentName+'</label></div>' +
                        '<div class="form-group col-xs-3"><label class="col-xs-5 control-label">专业：</label>' +
                        '<label class="col-xs-7"style="margin-top:7px;text-overflow:ellipsis; white-space:nowrap; overflow:hidden;">'+$scope.majorName+'</label></div>' +
                        '<div class="form-group col-xs-2"><label class="col-xs-5 control-label">班级：</label>' +
                        '<label class="col-xs-7"style="margin-top:7px;text-overflow:ellipsis; white-space:nowrap; overflow:hidden;">'+$scope.className+'</label>' +
                        '</div>' +
                        '<div class="form-group col-xs-2">' +
                        '<label class="col-xs-7 control-label">学制：</label>' +
                        '<label class="col-xs-5"style="margin-top:7px;text-overflow:ellipsis; white-space:nowrap; overflow:hidden;">'+$scope.schoolSystem+'</label>' +
                        '</div>' +
                        '<div class="form-group col-xs-3">' +
                        '<label class="col-xs-5 control-label">学号：</label>' +
                        '<label class="col-xs-7"style="margin-top:7px;text-overflow:ellipsis; white-space:nowrap; overflow:hidden;">'+$scope.studentNum+'</label>' +
                        '</div>' +
                        '</div>' + tableHTML+
                        '<div class="row">' +
                        '<div class="form-group col-xs-4">' +
                        '<label class="col-xs-5 control-label">平均学分绩点：</label>' +
                        '<label class="col-xs-7"style="margin-top:7px;">'+$scope.averageGradePoint+'</label>' +
                        '</div>' +
                        '<div class="form-group col-xs-4">' +
                        '<label class="col-xs-5 control-label">总学分：</label>' +
                        '<label class="col-xs-7"style="margin-top:7px;">'+$scope.totalCredit+'   其中  必修 '+$scope.requireCourseCredit+'  选修 '+$scope.electiveCourseCredit+'</label>' +
                        '</div>' +
                        '<div class="form-group col-xs-4">' +
                        '<label class="col-xs-7 control-label">毕业证书编号：</label>' +
                        '<label class="col-xs-5"style="margin-top:7px;"></label>' +
                        '</div>' +
                        '</div>' +
                        '<div class="row">' +
                        '<div class="form-group col-xs-4">' +
                        '<label class="col-xs-5 control-label">学位号：</label>' +
                        '<label class="col-xs-7"style="margin-top:7px;"></label>' +
                        '</div>' +
                        '<div class="form-group col-xs-4">' +
                        '<label class="col-xs-5 control-label">教务处(章)：</label>' +
                        '<label class="col-xs-7"style="margin-top:7px;"></label>' +
                        '</div>' +
                        '</div></form>'
                    LODOP.ADD_PRINT_HTM(88, 50, 1200, 1000, html);
                    LODOP.PREVIEW();

                }, 200);

            }
            
            $scope.cancel= function(){
                $uibModalInstance.close();
            }
        }
    }
    score_batchPrintingController.$inject = ['$timeout', 'app', '$scope', '$uibModal', '$rootScope', '$compile', '$window', 'score_batchPrintingService', 'baseinfo_generalService', 'alertService'];
    //转入
    var previewController = function ($timeout, app, $compile, $scope, $uibModalInstance, item, score_batchPrintingService, alertService) {
        $scope.departmentName = item.departmentName;
        $scope.majorName = item.majorName;
        $scope.className = item.className;
        $scope.schoolSystem = item.schoolSystem;
        $scope.studentNum = item.studentNum;

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
            for(var prop in sortMap){
                //console.log(prop,sortMap[prop])
            }
            var index = 0;
            for(var prop in sortMap){
                var count = sortMap[prop] * 1;
                $(target).bootstrapTable('mergeCells',{index:index, field:fieldName, colspan: 7});
                index += count;
            }
        }
        var type = "0";
        var type1 = "1";
        var type2 = "2";
        var type3 = "3";
        $scope.myData = [];
        var totalGradePoint = 0;
        var totalCredit = 0;
        var requireCourseCredit = 0;
        var electiveCourseCredit = 0;
        $scope.scoreIntoTable = {
            url: app.api.address + '/score/scorePrinting/'+ item.studentNum+'/'+type,
            // url: app.api.address + '/score/scorePrinting',
            method: 'get',
            cache: false,
            // height: 500,
            toolbar: '#ttoolbar', //工具按钮用哪个容器
            striped: true,
            search: false,
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: '',//传递参数（*）
            clickToSelect: true,
            responseHandler:function(response){
                return response.data;
            },
            onLoadSuccess: function() {
                $compile(angular.element('#scoreIntoTable').contents())($scope);
                var data = $('#scoreIntoTable').bootstrapTable('getData', true);
                data.forEach(function(obj) {
                    if(obj.gradePoint){
                        $scope.myData.push(obj.gradePoint);
                        totalGradePoint+= parseFloat(obj.gradePoint);
                    }
                    if(obj.credit){
                        totalCredit +=parseFloat(obj.credit);
                    }
                    if(obj.courseProperty){
                        if(obj.courseProperty=="必修"&&obj.credit){
                            requireCourseCredit +=parseFloat(obj.credit);
                        }
                        else if(obj.courseProperty=="选修"&&obj.credit){
                            electiveCourseCredit +=parseFloat(obj.credit);
                        }
                    }
                });
                //合并单元格
                mergeCells(data, "semesterId", 1, $('#scoreIntoTable'));
            },
            columns: [
                {field:"semesterId",title:"",align:"center",valign:"middle",formatter: function (value, row, index) {
                    if(row.semesterId){
                        if(row.courseName){
                            return '';
                        }else{
                            return value;
                        }
                    }else{
                        return '';
                    }
                }},
                {field:"courseName",title:"课程名称",align:"center",valign:"middle",formatter: function (value, row, index) {
                    if(row.courseName){
                        return value;
                    }else{
                        return "";
                    }
                }},
                {field:"courseProperty",title:"性质",align:"center",valign:"middle",formatter: function (value, row, index) {
                    if(row.courseProperty){
                        return value;
                    }else{
                        return "";
                    }
                }},
                {field:"credit",title:"学分",align:"center",valign:"middle",formatter: function (value, row, index) {
                    if(row.credit){
                        return value;
                    }else{
                        return "";
                    }
                }},
                {field:"score",title:"成绩",align:"center",valign:"middle",formatter: function (value, row, index) {
                    if(row.score){
                        return value;
                    }else{
                        return "";
                    }
                }},
                {field:"gradePoint",title:"绩点",align:"center",valign:"middle",formatter: function (value, row, index) {
                    if(row.gradePoint){
                        return value;
                    }else{
                        return "";
                    }
                }},
                {field:"mark",title:"标识",align:"center",valign:"middle",formatter: function (value, row, index) {
                    if(row.mark){
                        return value;
                    }else{
                        return "";
                    }
                }}
            ]
        };
        var gradeName1= (parseInt(item.gradeName.substr(0,4))+1).toString();
        $scope.scoreIntoTable1 = {
            url: app.api.address + '/score/scorePrinting/'+ item.studentNum+'/'+type1,
            // url: app.api.address + '/score/scorePrinting',
            method: 'get',
            cache: false,
            // height: 500,
            toolbar: '#ttoolbar', //工具按钮用哪个容器
            striped: true,
            search: false,
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: '',//传递参数（*）
            clickToSelect: true,
            responseHandler:function(response){
                return response.data;
            },
            onLoadSuccess: function() {
                $compile(angular.element('#scoreIntoTable1').contents())($scope);
                var data = $('#scoreIntoTable1').bootstrapTable('getData', true);
                data.forEach(function(obj) {
                    if(obj.gradePoint){
                        $scope.myData.push(obj.gradePoint);
                        totalGradePoint+= parseFloat(obj.gradePoint);
                    }
                    if(obj.credit){
                        totalCredit +=parseFloat(obj.credit);
                    }
                    if(obj.courseProperty){
                        if(obj.courseProperty=="必修"&&obj.credit){
                            requireCourseCredit +=parseFloat(obj.credit);
                        }
                        else if(obj.courseProperty=="选修"&&obj.credit){
                            electiveCourseCredit +=parseFloat(obj.credit);
                        }
                    }
                })
                //合并单元格
                mergeCells(data, "semesterId", 1, $('#scoreIntoTable1'));
            },
            columns: [
                {field:"semesterId",title:"",align:"center",valign:"middle",formatter: function (value, row, index) {
                    if(row.semesterId){
                        if(row.courseName){
                            return '';
                        }else{
                            return value;
                        }
                    }else{
                        return '';
                    }
                }},
                {field:"courseName",title:"课程名称",align:"center",valign:"middle",formatter: function (value, row, index) {
                    if(row.courseName){
                        return value;
                    }else{
                        return "";
                    }
                }},
                {field:"courseProperty",title:"性质",align:"center",valign:"middle",formatter: function (value, row, index) {
                    if(row.courseProperty){
                        return value;
                    }else{
                        return "";
                    }
                }},
                {field:"credit",title:"学分",align:"center",valign:"middle",formatter: function (value, row, index) {
                    if(row.credit){
                        return value;
                    }else{
                        return "";
                    }
                }},
                {field:"score",title:"成绩",align:"center",valign:"middle",formatter: function (value, row, index) {
                    if(row.score){
                        return value;
                    }else{
                        return "";
                    }
                }},
                {field:"gradePoint",title:"绩点",align:"center",valign:"middle",formatter: function (value, row, index) {
                    if(row.gradePoint){
                        return value;
                    }else{
                        return "";
                    }
                }},
                {field:"mark",title:"标识",align:"center",valign:"middle",formatter: function (value, row, index) {
                    if(row.mark){
                        return value;
                    }else{
                        return "";
                    }
                }}
            ]
        };
        var gradeName2= (parseInt(item.gradeName.substr(0,4))+2).toString();
        $scope.scoreIntoTable2 = {
            url: app.api.address + '/score/scorePrinting/'+ item.studentNum+'/'+type2,
            // url: app.api.address + '/score/scorePrinting',
            method: 'get',
            cache: false,
            // height: 500,
            toolbar: '#ttoolbar', //工具按钮用哪个容器
            striped: true,
            search: false,
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: '',//传递参数（*）
            clickToSelect: true,
            responseHandler:function(response){
                return response.data;
            },
            onLoadSuccess: function() {
                $compile(angular.element('#scoreIntoTable2').contents())($scope);
                var data = $('#scoreIntoTable2').bootstrapTable('getData', true);
                data.forEach(function(obj) {
                    if(obj.gradePoint){
                        $scope.myData.push(obj.gradePoint);
                        totalGradePoint+= parseFloat(obj.gradePoint);
                    }
                    if(obj.credit){
                        totalCredit +=parseFloat(obj.credit);
                    }
                    if(obj.courseProperty){
                        if(obj.courseProperty=="必修"&&obj.credit){
                            requireCourseCredit +=parseFloat(obj.credit);
                        }
                        else if(obj.courseProperty=="选修"&&obj.credit){
                            electiveCourseCredit +=parseFloat(obj.credit);
                        }
                    }
                })
                //合并单元格
                mergeCells(data, "semesterId", 1, $('#scoreIntoTable2'));
            },
            columns: [
                {field:"semesterId",title:"",align:"center",valign:"middle",formatter: function (value, row, index) {
                    if(row.semesterId){
                        if(row.courseName){
                            return '';
                        }else{
                            return value;
                        }
                    }else{
                        return '';
                    }
                }},
                {field:"courseName",title:"课程名称",align:"center",valign:"middle",formatter: function (value, row, index) {
                    if(row.courseName){
                        return value;
                    }else{
                        return "";
                    }
                }},
                {field:"courseProperty",title:"性质",align:"center",valign:"middle",formatter: function (value, row, index) {
                    if(row.courseProperty){
                        return value;
                    }else{
                        return "";
                    }
                }},
                {field:"credit",title:"学分",align:"center",valign:"middle",formatter: function (value, row, index) {
                    if(row.credit){
                        return value;
                    }else{
                        return "";
                    }
                }},
                {field:"score",title:"成绩",align:"center",valign:"middle",formatter: function (value, row, index) {
                    if(row.score){
                        return value;
                    }else{
                        return "";
                    }
                }},
                {field:"gradePoint",title:"绩点",align:"center",valign:"middle",formatter: function (value, row, index) {
                    if(row.gradePoint){
                        return value;
                    }else{
                        return "";
                    }
                }},
                {field:"mark",title:"标识",align:"center",valign:"middle",formatter: function (value, row, index) {
                    if(row.mark){
                        return value;
                    }else{
                        return "";
                    }
                }}
            ]
        };
        var gradeName3= (parseInt(item.gradeName.substr(0,4))+3).toString();
        $scope.scoreIntoTable3 = {
            url: app.api.address + '/score/scorePrinting/'+ item.studentNum+'/'+type3,
            // url: app.api.address + '/score/scorePrinting',
            method: 'get',
            cache: false,
            // height: 500,
            toolbar: '#ttoolbar', //工具按钮用哪个容器
            striped: true,
            search: false,
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: '',//传递参数（*）
            clickToSelect: true,
            responseHandler:function(response){
                return response.data;
            },
            onLoadSuccess: function() {
                $compile(angular.element('#scoreIntoTable3').contents())($scope);
                var data = $('#scoreIntoTable3').bootstrapTable('getData', true);
                data.forEach(function(obj) {
                    if(obj.gradePoint){
                        $scope.myData.push(obj.gradePoint);
                        totalGradePoint+= parseFloat(obj.gradePoint);
                    }
                    if(obj.credit){
                        totalCredit +=parseFloat(obj.credit);
                    }
                    if(obj.courseProperty){
                        if(obj.courseProperty=="必修"&&obj.credit){
                            requireCourseCredit +=parseFloat(obj.credit);
                        }
                        else if(obj.courseProperty=="选修"&&obj.credit){
                            electiveCourseCredit +=parseFloat(obj.credit);
                        }
                    }
                })
                //合并单元格
                mergeCells(data, "semesterId", 1, $('#scoreIntoTable3'));
            },
            columns: [
                {field:"semesterId",title:"",align:"center",valign:"middle",formatter: function (value, row, index) {
                    if(row.semesterId){
                        if(row.courseName){
                            return '';
                        }else{
                            return value;
                        }
                    }else{
                        return '';
                    }
                }},
                {field:"courseName",title:"课程名称",align:"center",valign:"middle",formatter: function (value, row, index) {
                    if(row.courseName){
                        return value;
                    }else{
                        return "";
                    }
                }},
                {field:"courseProperty",title:"性质",align:"center",valign:"middle",formatter: function (value, row, index) {
                    if(row.courseProperty){
                        return value;
                    }else{
                        return "";
                    }
                }},
                {field:"credit",title:"学分",align:"center",valign:"middle",formatter: function (value, row, index) {
                    if(row.credit){
                        return value;
                    }else{
                        return "";
                    }
                }},
                {field:"score",title:"成绩",align:"center",valign:"middle",formatter: function (value, row, index) {
                    if(row.score){
                        return value;
                    }else{
                        return "";
                    }
                }},
                {field:"gradePoint",title:"绩点",align:"center",valign:"middle",formatter: function (value, row, index) {
                    if(row.gradePoint){
                        return value;
                    }else{
                        return "";
                    }
                }},
                {field:"mark",title:"标识",align:"center",valign:"middle",formatter: function (value, row, index) {
                    if(row.mark){
                        return value;
                    }else{
                        return "";
                    }
                }}
            ]
        };
        $timeout(function () {
            // console.log($scope.myData.length);
            // var totalGradePoint = 0;
            // $scope.myData.forEach(function (obj) {
            //     totalGradePoint+=obj;
            // });
            $scope.averageGradePoint = (totalGradePoint/$scope.myData.length).toFixed(3);
            $scope.totalCredit =   totalCredit ;
            $scope.requireCourseCredit =   requireCourseCredit ;
            $scope.electiveCourseCredit =   electiveCourseCredit ;

        }, 200);

        $scope.cancel= function(){
            $uibModalInstance.close();
        }
    }
    previewController.$inject = ['$timeout', 'app', '$compile','$scope', '$uibModalInstance', 'item', 'score_batchPrintingService', 'alertService'];


})(window);
