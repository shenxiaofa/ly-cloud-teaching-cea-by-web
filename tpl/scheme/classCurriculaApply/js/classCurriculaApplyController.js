;(function (window, undefined) {
    'use strict';

    window.scheme_classCurriculaApplyController = function (app, $compile, $scope, $uibModal, $rootScope, $window, $timeout, scheme_classCurriculaApplyService, alertService) {
        // 模块设置查询对象
        $scope.versionModel = {};
        // 范围维护查询对象
        $scope.modelDataRange = {};
        //tree菜单高度
        $scope.leftTreeStyle = {
            "height": $window.innerHeight-70
        };

        //学生类别下拉框数据
        $scope.studentCategory = [];
        scheme_classCurriculaApplyService.getSelected('XSLBDM', function (error,message,data) {
            $scope.studentCategory = data.data;
            var htmlFirst = '' +
                '<select ui-select2  ui-chosen="curriculaSearchForm.studentCategoryCode" '
                +  ' ng-model="classScheme.studentCategoryCode" id="studentCategoryCode" name="studentCategoryCode" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option ng-repeat="a in studentCategory" value="{{a.dataNumber}}">{{a.dataName}}</option> '
                +  '</select>';
            angular.element("#studentCategoryCode").parent().empty().append(htmlFirst);
            $compile(angular.element("#studentCategoryCode").parent().contents())($scope);

            var htmlSecond = '' +
                '<select ui-select2  ui-chosen="recordForm.studentCategory" '
                +  ' ng-model="record.studentCategoryCode" id="studentCategory" name="studentCategory" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option ng-repeat="a in studentCategory" value="{{a.dataNumber}}">{{a.dataName}}</option> '
                +  '</select>';
            angular.element("#studentCategory").parent().empty().append(htmlSecond);
            $compile(angular.element("#studentCategory").parent().contents())($scope);
        });
        // 树菜单参数设置
        $scope.zTreeOptions = {
            view: {
                dblClickExpand: false,
                showLine: true,
                selectedMulti: false
            },
            async: {
                enable: true,
                //url: app.api.address + '/base-info/department/gradeDepartmentTree',
                url: app.api.address + '/scheme/majorScheme/tree',
                type: "GET",
                dataFilter: function (treeId, parentNode, responseData) {

                    return responseData.data;
                }
            },
            data: {
                key: {
                    url: ""
                },
                simpleData: {
                    enable:true,
                    idKey: "id",
                    pIdKey: "parentId",
                    rootPId: ""
                }
            },
            callback: {
                onAsyncSuccess: function (event, treeId, treeNode, msg) {
                    // 模拟点击树节点
                    var treeObj = $.fn.zTree.getZTreeObj(treeId);
                    // 展开根节点
                    var nodes = treeObj.getNodes();
                    angular.forEach(nodes, function(data, index, array){
                        treeObj.expandNode(data, true);
                    });
                    // 模拟点击第一个根节点
                    var node = treeObj.getNodesByFilter(function (node) {
                        return node.level == 1;
                    }, true);
                    angular.element("#"+node.tId+"_a").trigger("click");
                },
                onClick: function(event, treeId, treeNode) {
                    var type = treeNode.type;
                    var name = treeNode.name;
                    var id = treeNode.id;
                    var parentId = treeNode.parentId;
                    if (type == "grade") {
                        $scope.classScheme.grade = name;
                        $scope.classScheme.deptNum = "";
                        $scope.record.grade = name;
                        $scope.record.deptNum = "";
                    } else {
                        $scope.classScheme.grade = parentId;
                        $scope.classScheme.deptNum = id;
                        $scope.record.grade = parentId;
                        $scope.record.deptNum = id;
                        // 刷新右边内容数据（若是初始化，由于表格未初始化，报异常，不需处理）
                        try {
                            angular.element('#classCurriculaTable').bootstrapTable('refresh');
                            angular.element('#classCurriculaRecordTable').bootstrapTable('refresh');
                        } catch (e) {}
                    }

                }
            }
        };
        // 表格的高度
        $scope.tableHeight = $window.innerHeight - 264;

        // 查询参数
        $scope.classScheme = {
            grade : "",                 //年级
            deptNum : "",               //单位
            studentCategoryCode : "",   //学生类别（培养层次）
            majorName : "",             //专业
            className : "",             //班级
            schemeSign : ""             //是否存在方案
        }
        $scope.classSchemeParams = function versionModelQueryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
            };
            $rootScope.$log.debug(angular.extend(pageParam, $scope.classScheme));
            return angular.extend(pageParam, $scope.classScheme);
        }
        $scope.classCurriculaTable = {
            //url: 'data_test/scheme/tableview_classCurricula.json',
            url: app.api.address + '/scheme/classScheme/infomation',
            method: 'get',
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
                {field:"id", title:"班级培养方案id", visible:false},
                {field:"class_ID",title:"班级id",visible:false},
                {field:"deptName",title:"单位",align:"center",valign:"middle"},
                {field:"grade",title:"年级",align:"center",valign:"middle"},
                {field:"educationLevel",title:"学生类别",align:"center",valign:"middle"},
                {field:"majorName",title:"专业名称",align:"center",valign:"middle"},
                {field:"className",title:"班级名称",align:"center",valign:"middle"},
                {field:"schemeSign",title:"是否存在方案",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        if(typeof(row.id) == "undefined"){
                            return "否";
                        }
                        return "是";
                    }
                },
                {field:"operation",title:"操作",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        //不存在培养方案
                        if(typeof(row.id) == "undefined"){
                            return "<button type='button'  style='margin-right: 5px'  disabled has-permission='classCurriculaApply:applyAdjust'  class='btn btn-sm' ng-click='adjustApply("+ angular.toJson(row) +")'><span class='fa fa-edit toolbar-btn-icon'></span>课程计划调整申请</button>";
                        }
                        return "<button type='button' has-permission='classCurriculaApply:applyAdjust'  class='btn btn-default btn-sm' ng-click='adjustApply("+ angular.toJson(row) +")'><span class='fa fa-edit toolbar-btn-icon'></span>课程计划调整申请</button>";
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
            $scope.classScheme.studentCategoryCode = "";
            $scope.classScheme.majorName = "";
            $scope.classScheme.className = "";
            $scope.classScheme.schemeSign = "";
            // 重新初始化下拉框
            angular.element('form[name="curriculaSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#classCurriculaTable').bootstrapTable('refresh');
        }
        // 查询表单显示和隐藏切换
        $scope.isHideSearchForm = false; // 默认显示
        $scope.searchFormToggle = function () {
            $scope.isHideSearchForm = !$scope.isHideSearchForm
            if ($scope.isHideSearchForm) {
                $scope.tableHeight = $scope.tableHeight + 115;
            } else {
                $scope.tableHeight = $scope.tableHeight - 115;
            }
            angular.element('#classCurriculaTable').bootstrapTable('resetView',{ height: $scope.tableHeight } );
        };
        // 课程计划调整申请
        $scope.adjustApply = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/scheme/classCurriculaApply/adjustApply.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return row;
                    }
                },
                controller: adjustApplyController
            });
        };


        // 表格的高度
        $scope.classCurriculaRecordTableHeight = $window.innerHeight - 266;
        
        // 查询参数
        $scope.record = {
            grade : "",                 //年级
            deptNum : "",               //单位
            studentCategoryCode : "",   //学生类别（培养层次）
            majorName : "",             //专业
            className : "",             //班级
            schemeSign : ""             //是否存在方案
        }
        $scope.recordQueryParams = function modelDataRangeQueryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
            };
            return angular.extend(pageParam, $scope.record);
        }
        $scope.classCurriculaRecordTable = {
            //url: 'data_test/scheme/tableview_classCurriculaRecord.json',
            url: app.api.address + '/scheme/classScheme/applyRecord',
            method: 'get',
            cache: false,
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

            },
            columns: [
                {checkbox: true, width: "5%"},
                {field:"processInstance_ID", title:"流程实例主键", visible:false},
                {field:"classScheme_ID", title:"班级培养方案id", visible:false},
                {field:"class_ID", title:"班级id", visible:false},
                {field:"classCurriculaApply_ID", title:"班级计划申请主键", visible:false},
                {field:"dept",title:"单位",align:"center",valign:"middle"},
                {field:"grade",title:"年级",align:"center",valign:"middle"},
                {field:"educationLevel",title:"学生类别",align:"center",valign:"middle"},
                {field:"majorName",title:"专业名称",align:"center",valign:"middle"},
                {field:"className",title:"班级名称",align:"center",valign:"middle"},
                {field:"applicant",title:"申请人",align:"center",valign:"middle"},
                {field:"applicationTime",title:"申请时间",align:"center",valign:"middle"},
                {field:"status",title:"审批状态",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        var str = "更正（未提交）"
                        if(value == "0"){
                            str = "不通过";
                        }
                        if(value == "1"){
                            str = "通过";
                        }
                        if(value == "2"){
                            str = "审核中";
                        }
                    return  str;
                }},
                {field:"operation",title:"操作",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        if(typeof(row.processInstance_ID) == "undefined" ){
                            return "<button type='button' has-permission='classCurriculaApply:recordAdjust' class='btn btn-sm btn-default' ng-click='adjust("+ angular.toJson(row) +")'><span class='fa fa-edit toolbar-btn-icon'></span>更正</button>";
                        }
                        return "<button type='button' has-permission='classCurriculaApply:recordDetail' class='btn btn-sm btn-info' ng-click='detail("+ angular.toJson(row) +")'><span class='fa fa-edit toolbar-btn-icon'></span>详情</button>";
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
            $scope.record.studentCategoryCode = "";
            $scope.record.majorName = "";
            $scope.record.className = "";
            $scope.record.schemeSign = "";
            angular.element('#classCurriculaRecordTable').bootstrapTable('refresh');
        };

        //更正
        $scope.adjust = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/scheme/classCurriculaApply/adjust.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return row;
                    }
                },
                controller: adjustController
            });
        };
        //详情
        $scope.detail = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/scheme/classCurriculaApply/detail.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return row;
                    }
                },
                controller: detailController
            });
        };
    };
    scheme_classCurriculaApplyController.$inject = ['app', '$compile', '$scope', '$uibModal', '$rootScope', '$window', '$timeout', 'scheme_classCurriculaApplyService', 'alertService'];

    // 更正控制器
    var adjustController = function ($rootScope, $scope, $uibModalInstance, $uibModal, app, $compile, item, scheme_classCurriculaApplyService, formVerifyService, alertService) {
        //tab标签
        $scope.schemeDemand={
            id:"", //方案要求id 与 classSchemeDemand_ID 相同
            model_ID:"",
            classSchemeDemand_ID : "" //方案要求id
        }

        $scope.adjustTable =  {
            //url: 'data_test/scheme/tableview_classCurricula.json',
            url: app.api.address + '/scheme/classCurricula/curriculaApply',
            method: 'get',
            cache: false,
            height: 400,
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
            queryParams: $scope.schemeDemand,//传递参数（*）
            search: false,
            responseHandler:function(response){
                var data = {
                    rows :response.data,
                    total : response.data.length
                }
                return data;
            },
            onLoadSuccess: function(data) {
                $compile(angular.element('#adjustTable').contents())($scope);
                $scope.$apply(function () {
                    $scope.completeCredit = 0;
                    for(var index=0; index < data.rows.length; index++){
                        $scope.completeCredit += parseFloat(data.rows[index].credit);
                    }
                });
            },
            columns: [
                {checkbox: true,width: "5%"},
                {field:"course_ID",visible:false},
                {field:"semester",title:"开课学期",align:"center",valign:"middle"},
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
                },
                {field:"cz",title:"操作",align:"center",valign:"middle",width: "20%",
                    formatter : function (value, row, index) {
                        var updateBtn = "<button id='btn_fzrsz' has-permission='classCurriculaApply:recordAdjust:update' type='button' ng-click='update(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>修改</button>";
                        var deleteBtn = "<button id='btn_fzrsz' has-permission='classCurriculaApply:recordAdjust:delete' type='button' ng-click='delete(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm del-btn'>删除</button>";
                        var recoverBtn = "<button id='btn_fzrsz' has-permission='classCurriculaApply:recordAdjust:recoverCourse' type='button' ng-click='recover(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>恢复</button>";
                        if(row.type == "3"){
                            return recoverBtn;
                        }
                        return updateBtn+"&nbsp"+deleteBtn;
                    }
                }
            ]
        };



        $scope.title = [];
        scheme_classCurriculaApplyService.getTitle(item.classScheme_ID,function (error,message,data) {
            $scope.title = data;
            $scope.schemeDemand.id = data[0].classSchemeDemand_ID;
            $scope.schemeDemand.classSchemeDemand_ID = data[0].classSchemeDemand_ID;
            $scope.schemeDemand.model_ID = data[0].id;
            angular.element('#adjustTable').bootstrapTable('refresh');

            $scope.title.forEach(function (eachTitle) {
                scheme_classCurriculaApplyService.getTab(eachTitle.classSchemeDemand_ID, function (error,message,data) {
                    data.data.forEach(function (curricula) {
                        curricula.classSchemeDemand_ID = eachTitle.classSchemeDemand_ID;
                        if(isNaN(eachTitle.completeCredit)){eachTitle.completeCredit = 0}
                        eachTitle.completeCredit += parseFloat(curricula.credit);
                    })
                    console.log(data.data);
                    console.log($scope.title);
                    $scope.title.forEach(function (title) {
                        if(parseFloat(title.completeCredit) < parseFloat(title.creditDemand)){
                            title.tabClass = "*";
                            $scope.btnDisable = true;
                            $scope.btnClass = "btn btn-default btn-sm";
                        }else {
                            title.tabClass = "";
                        }
                    })
                })

            })
        });

        $scope.creditValidate = function (myScope) {
            myScope.title.forEach(function (eachTitle) {
                myScope.btnDisable = false;
                eachTitle.completeCredit = 0;
                myScope.btnClass = "btn btn-info btn-sm";

                scheme_classCurriculaApplyService.getTab(eachTitle.classSchemeDemand_ID, function (error,message,data) {
                    data.data.forEach(function (curricula) {
                        curricula.classSchemeDemand_ID = eachTitle.classSchemeDemand_ID;
                        if(isNaN(eachTitle.completeCredit)){eachTitle.completeCredit = 0}
                        eachTitle.completeCredit += parseFloat(curricula.credit);
                    })
                    console.log(data.data);
                    console.log($scope.title);
                    $scope.title.forEach(function (title) {
                        if(parseFloat(title.completeCredit) < parseFloat(title.creditDemand)){
                            title.tabClass = "*";
                            $scope.btnDisable = true;
                            $scope.btnClass = "btn btn-default btn-sm";
                        }else {
                            title.tabClass = "";
                        }
                    })
                    myScope.toReviewBtnValidate(myScope);
                })
            })
        }
        $scope.toReviewBtnValidate = function(myScope){
            myScope.btnDisable = false;
            myScope.btnClass = "btn btn-info btn-sm";
            myScope.title.forEach(function (param) {
                if(parseFloat(param.completeCredit) < parseFloat(param.creditDemand)){
                    myScope.btnDisable = true;
                    myScope.btnClass = "btn btn-default btn-sm";
                    return;
                }
            })
        }

        // 查询参数
        $scope.queryParams = function queryParams() {
            return  $scope.schemeDemand;
        }

        // 完成学分
        $scope.completeCredit = 0;;

        //切换标签页
        $scope.change = function (a) {
            $scope.schemeDemand.id = a.classSchemeDemand_ID;
            $scope.schemeDemand.classSchemeDemand_ID = a.classSchemeDemand_ID;
            $scope.schemeDemand.model_ID= a.id;
            angular.element('#adjustTable').bootstrapTable('refresh');
        }
        //新增
        $scope.openAdd = function () {
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/scheme/classCurriculaApply/addCourse.html',
                size: 'lg',
                resolve: {
                    model_ID : function () {
                        return $scope.schemeDemand.model_ID;
                    },
                    id: function () {
                        return $scope.schemeDemand.id;
                    },
                    grade : function () {
                        return  item.grade;
                    },
                    myScope : function () {
                        return $scope;
                    }
                },
                controller: addCourseController
            });
        }
        //修改
        $scope.update = function (data) {
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/scheme/classCurriculaApply/updateCourse.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        data.classSchemeDemand_ID = $scope.schemeDemand.id;
                        return data;
                    },
                    grade : function () {
                        return  item.grade;
                    },
                    myScope : function () {
                        return $scope;
                    }
                },
                controller: updateCourseController
            });
        }
        //删除
        $scope.delete = function (data) {
            $scope.courseInfo = {
                classCurricula_ID : data.id,                  //课程计划id
                course_ID : data.course_ID,
                semester : data.semester,
                type : "3",
                classSchemeDemand_ID : $scope.schemeDemand.id,
                credit : data.credit,
                totalHour : data.totalHour,
                examWay : data.examWay,
                theoryHour : data.theoryHour,
                practiceHour : data.practiceHour,
                courseModel : data.courseModel,
                remark : data.remark
            }
            $rootScope.showLoading = true; // 开启加载提示
            scheme_classCurriculaApplyService.addCourseChange($scope.courseInfo,function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#adjustTable').bootstrapTable('refresh');
                //alertService('success', '删除成功');
            });
        }

        $scope.toReview = function () {
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/scheme/classCurriculaApply/apply.html',
                size: 'lg',
                resolve: {
                    class_ID: function () {
                        return  item.class_ID;
                    }
                },
                controller: applyController
            });
        }
        $scope.recover = function (data) {
            $rootScope.showLoading = true; // 开启加载提示
            scheme_classCurriculaApplyService.recover(data.classCurriculaAdjust_ID, function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                alertService('success', '恢复成功');
            });
        }
        $scope.save = function () {
            $rootScope.showLoading = true; // 开启加载提示
            scheme_classCurriculaApplyService.save(item.class_ID, function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                alertService('success', '保存成功');
            });
        }

        $scope.close = function () {
            $uibModalInstance.close();
        };

        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    adjustController.$inject = ['$rootScope','$scope', '$uibModalInstance', '$uibModal', 'app', '$compile', 'item', 'scheme_classCurriculaApplyService', 'formVerifyService', 'alertService'];
    // 详情控制器
    var detailController = function ($rootScope, $scope, $uibModalInstance, $uibModal, app, $compile, item, scheme_classCurriculaApplyService, formVerifyService, alertService) {
        //tab标签
        $scope.schemeDemand={
            id:"", //方案要求id 与 classSchemeDemand_ID 相同
            model_ID:"",
            classSchemeDemand_ID : "" //方案要求id
        }

        $scope.adjustTable =  {
            //url: 'data_test/scheme/tableview_classCurricula.json',
            url: app.api.address + '/scheme/classCurricula/curriculaApply',
            method: 'get',
            cache: false,
            height: 400,
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
            queryParams: $scope.schemeDemand,//传递参数（*）
            search: false,
            responseHandler:function(response){
                var data = {
                    rows :response.data,
                    total : response.data.length
                }
                return data;
            },
            onLoadSuccess: function(data) {
                $compile(angular.element('#adjustTable').contents())($scope);
                $scope.$apply(function () {
                    $scope.completeCredit = 0;
                    for(var index=0; index < data.rows.length; index++){
                        $scope.completeCredit += parseFloat(data.rows[index].credit);
                    }
                });
            },
            columns: [
                {checkbox: true,width: "5%"},
                {field:"course_ID",visible:false},
                {field:"semester",title:"开课学期",align:"center",valign:"middle"},
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



        $scope.title = [];
        scheme_classCurriculaApplyService.getTitle(item.classScheme_ID,function (error,message,data) {
            $scope.title = data;
            $scope.schemeDemand.id = data[0].classSchemeDemand_ID;
            $scope.schemeDemand.classSchemeDemand_ID = data[0].classSchemeDemand_ID;
            $scope.schemeDemand.model_ID = data[0].id;
            angular.element('#adjustTable').bootstrapTable('refresh');
        });
        // 查询参数
        $scope.queryParams = function queryParams() {
            return  $scope.schemeDemand;
        }

        // 完成学分
        $scope.completeCredit = 0;;

        //切换标签页
        $scope.change = function (a) {
            $scope.schemeDemand.id = a.classSchemeDemand_ID;
            $scope.schemeDemand.classSchemeDemand_ID = a.classSchemeDemand_ID;
            $scope.schemeDemand.model_ID= a.id;
            angular.element('#adjustTable').bootstrapTable('refresh');
        }

        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    detailController.$inject = ['$rootScope','$scope', '$uibModalInstance', '$uibModal', 'app', '$compile', 'item', 'scheme_classCurriculaApplyService', 'formVerifyService', 'alertService'];



    // 模块设置修改控制器
    var adjustApplyController = function ($rootScope, $uibModal, $compile, app, $scope, $uibModalInstance, item, scheme_classCurriculaApplyService, alertService, formVerifyService) {

        //tab标签
        $scope.schemeDemand={
            id:"", //方案要求id 与 classSchemeDemand_ID 相同
            model_ID:"",
            classSchemeDemand_ID : "" //方案要求id
        }

        $scope.btnDisable = false;
        $scope.btnClass = "btn btn-info";

        $scope.title = [];
        scheme_classCurriculaApplyService.getTitle(item.id,function (error,message,data) {
            $scope.title = data;
            $scope.schemeDemand.id = data[0].classSchemeDemand_ID;
            $scope.schemeDemand.classSchemeDemand_ID = data[0].classSchemeDemand_ID;
            $scope.schemeDemand.model_ID = data[0].id;
            angular.element('#adjustApplyTable').bootstrapTable('refresh');

            $scope.title.forEach(function (eachTitle) {
                scheme_classCurriculaApplyService.getTab(eachTitle.classSchemeDemand_ID, function (error,message,data) {
                    if(data.data == null || data.data == ""){
                        eachTitle.completeCredit = 0;
                    }
                    data.data.forEach(function (curricula) {
                        curricula.classSchemeDemand_ID = eachTitle.classSchemeDemand_ID;
                        if(isNaN(eachTitle.completeCredit)){eachTitle.completeCredit = 0}
                        eachTitle.completeCredit += parseFloat(curricula.credit);
                    })
                   console.log(data.data);
                   console.log($scope.title);
                    $scope.title.forEach(function (title) {
                        if(parseFloat(title.completeCredit) < parseFloat(title.creditDemand)){
                            title.tabClass = "*";
                            title.style = "tabStyle";
                            $scope.btnDisable = true;
                            $scope.btnClass = "btn btn-warning";
                        }else {
                            title.tabClass = "";
                            title.style = "";
                        }
                    })
                })

            })
            
        });

        $scope.creditValidate = function (myScope) {
            myScope.title.forEach(function (eachTitle) {
                myScope.btnDisable = false;
                eachTitle.completeCredit = 0;
                myScope.btnClass = "btn btn-info ";

                scheme_classCurriculaApplyService.getTab(eachTitle.classSchemeDemand_ID, function (error,message,data) {
                    if(data.data == null || data.data == ""){
                        eachTitle.completeCredit = 0;
                    }
                    data.data.forEach(function (curricula) {
                        curricula.classSchemeDemand_ID = eachTitle.classSchemeDemand_ID;
                        if(isNaN(eachTitle.completeCredit)){eachTitle.completeCredit = 0}
                        eachTitle.completeCredit += parseFloat(curricula.credit);
                    })
                    console.log(data.data);
                    console.log($scope.title);
                    $scope.title.forEach(function (title) {
                        if(parseFloat(title.completeCredit) < parseFloat(title.creditDemand)){
                            title.tabClass = "*";
                            title.style = "tabStyle";
                            $scope.btnDisable = true;
                            $scope.btnClass = "btn btn-warning ";
                        }else {
                            title.tabClass = "";
                            title.style = "";
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

        // 查询参数
        $scope.queryParams = function queryParams() {
            return  $scope.schemeDemand;
        }

        // 完成学分
        $scope.completeCredit = 0;;
        $scope.adjustApplyTable =  {
            //url: 'data_test/scheme/tableview_classCurricula.json',
            url: app.api.address + '/scheme/classCurricula/curriculaChange',
            method: 'get',
            cache: false,
            height: 400,
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            //pagination: true,
            // pageSize: 10,
            // pageNumber:1,
            // pageList: [10, 20, 30], // 设置可供选择的页面数据条数
            // paginationPreText: '上一页',
            // paginationNextText: '下一页',
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField : "id", // 指定主键列
            uniqueId: "id", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.schemeDemand,//传递参数（*）
            search: false,
            responseHandler:function(response){
                var data = {
                    rows :response.data,
                    total : response.data.length
                }
                return data;
            },
            onLoadSuccess: function(data) {
                $compile(angular.element('#adjustApplyTable').contents())($scope);
                $scope.$apply(function () {
                    $scope.completeCredit = 0;
                    for(var index=0; index < data.rows.length; index++){
                        $scope.completeCredit += parseFloat(data.rows[index].credit);
                    }
                });
            },
            columns: [
                {field:"course_ID",visible:false},
                {field:"semester",title:"开课学期",align:"center",valign:"middle",width: "15%"},
                {field:"courseNum",title:"课程号",align:"center",valign:"middle"},
                {field:"courseName",title:"课程名称",align:"center",valign:"middle",width: "20%"},
                {field:"credit",title:"学分",align:"center",valign:"middle"},
                {field:"totalHour",title:"总学时",align:"center",valign:"middle"},
                {field:"examWay",title:"考核方式",align:"center",valign:"middle"},
                {field:"theoryHour",title:"理论学时",align:"center",valign:"middle"},
                {field:"practiceHour",title:"实践学时",align:"center",valign:"middle"},
                {field:"type",title:"操作内容",align:"center",valign:"middle",width: "20%",
                    formatter : function (value, row, index) {
                       if("1" === value)
                           return "新增";
                       if("2" === value)
                           return "修改";
                       if("3" === value)
                           return "删除";
                    }
                },
                {field:"cz",title:"操作",align:"center",valign:"middle",width: "20%",
                    formatter : function (value, row, index) {
                        var updateBtn = "<button id='btn_fzrsz' has-permission='classCurriculaApply:applyAdjust:update' type='button' ng-click='update(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>修改</button>";
                        var deleteBtn = "<button id='btn_fzrsz' has-permission='classCurriculaApply:applyAdjust:delete' type='button' ng-click='delete(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm del-btn'>删除</button>";
                        return updateBtn+"&nbsp"+deleteBtn;
                    }
                }
            ]
        };
        //切换标签页
        $scope.change = function (a) {
            $scope.schemeDemand.classSchemeDemand_ID = a.classSchemeDemand_ID;
            $scope.schemeDemand.id = a.classSchemeDemand_ID;
            $scope.schemeDemand.model_ID= a.id;
            angular.element('#adjustApplyTable').bootstrapTable('refresh');
        }
        //新增
        $scope.openAdd = function () {
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/scheme/classCurriculaApply/addCourse.html',
                size: 'lg',
                resolve: {
                    id: function () {
                        return $scope.schemeDemand.id;
                    },
                    model_ID : function () {
                        return $scope.schemeDemand.model_ID;
                    },
                    grade : function () {
                        return item.grade;
                    },
                    myScope : function () {
                        return $scope;
                    }
                },
                controller: addCourseController
            });
        }
        //修改
        $scope.update = function (data) {
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/scheme/classCurriculaApply/updateCourse.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        data.classSchemeDemand_ID = $scope.schemeDemand.id;
                        return data;
                    },
                    grade : function () {
                        return item.grade;
                    },
                    myScope : function () {
                        return $scope;
                    }
                },
                controller: updateCourseController
            });
        }
        //删除
        $scope.delete = function (data) {
            $scope.courseInfo = {
                classCurricula_ID : data.id,                  //课程计划id
                course_ID : data.course_ID,
                semester : data.semester,
                type : "3",
                classSchemeDemand_ID : $scope.schemeDemand.id,
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
                templateUrl: 'tpl/scheme/classSchemeInfoManage/delete.html',
                size: '',
                resolve: {
                    pScope: function () {
                        return $scope;
                    }
                },
                controller: deleteController
            });
        }

        $scope.toReview = function () {
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/scheme/classCurriculaApply/apply.html',
                size: 'lg',
                resolve: {
                    class_ID: function () {
                        return  item.class_ID;
                    }
                },
                controller: applyController
            });
        }
        $scope.save = function () {
            $rootScope.showLoading = true; // 开启加载提示
            scheme_classCurriculaApplyService.save(item.class_ID, function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                alertService('success', '保存成功');
            });
        }
        
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    adjustApplyController.$inject = ['$rootScope', '$uibModal', '$compile', 'app','$scope', '$uibModalInstance', 'item', 'scheme_classCurriculaApplyService', 'alertService', 'formVerifyService'];

    var applyController = function ($rootScope, formVerifyService, $compile, $scope, $uibModalInstance, class_ID, scheme_classCurriculaApplyService, alertService) {
        $scope.close = function () {
            $uibModalInstance.close();
        };

        $scope.toReview = {
            class_ID : class_ID,
            reason : ""
        }

        $scope.ok = function (form) {
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            $rootScope.showLoading = true; // 开启加载提示
            scheme_classCurriculaApplyService.toReview($scope.toReview,function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else {
                    alertService('success', '送审成功');
                    angular.element('#classCurriculaRecordTable').bootstrapTable('refresh');
                }
                $uibModalInstance.close();
            });
        }
    }
    applyController.$inject = ['$rootScope','formVerifyService','$compile', '$scope', '$uibModalInstance', 'class_ID', 'scheme_classCurriculaApplyService', 'alertService'];




    var addCourseController = function ($rootScope, id, model_ID, grade, formVerifyService,app, $compile, $scope, $uibModalInstance, scheme_classCurriculaApplyService, alertService, myScope) {
        $scope.close = function () {
            $uibModalInstance.close();
        };

        //单位
        $scope.dept = [];
        scheme_classCurriculaApplyService.getDept(function (error,message,data) {
            $scope.dept = data.data;
            var html = '' +
                '<select ui-select2  ui-chosen="searchForm.dept_ID" '
                +  ' ng-model="courseParam.dept_ID" id="dept_ID" name="dept_ID" ui-jq="chosen"ui-options="{search_contains: true}" ui-jq="chosen" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option  ng-repeat="a in dept" value="{{a.departmentNumber}}">{{a.departmentName}}</option> '
                +  '</select>';
            angular.element("#dept_ID").parent().empty().append(html);
            $compile(angular.element("#dept_ID").parent().contents())($scope);
        });
        //学期
        $scope.semester = [];
        scheme_classCurriculaApplyService.getSemester(grade,function (error,message,data) {
            $scope.semester = data.data;
            var html = '' +
                '<select ui-select2  ui-chosen="addForm.semester" '
                +  ' ng-model="courseInfo.semester" id="semester" ng-required="true" name="semester" ui-jq="chosen"ui-options="{search_contains: true}" ui-jq="chosen" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option  ng-repeat="a in semester" value="{{a.id}}">{{a.name}}</option> '
                +  '</select>';
            angular.element("#semester").parent().empty().append(html);
            $compile(angular.element("#semester").parent().contents())($scope);
        });
        //添加参数
        $scope.courseInfo = {
            course_ID:"",
            classSchemeDemand_ID:id,
            semester:"",
            credit:"",
            type:"1",
            totalHour:"",
            theoryHour:"",
            practiceHour:"",
            remark:""
        }
        // 查询参数
        $scope.courseParam = {
            classSchemeDemand_ID:id,
            dept_ID : "",
            courseNameOrCode : "" ,
            model_ID : model_ID
        };
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
            };
            return angular.extend(pageParam, $scope.courseParam);
        }
        $scope.classCoursePlanAddTable = {
            //url: 'data_test/scheme/tableview_classCoursePlanAdd.json',
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
            pageList: [10, 20, 50],
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
                        classSchemeDemand_ID:id,//方案要求id 
                        credit:row.credit,
                        type:"1",
                        totalHour:row.totalHour,
                        theoryHour:row.theoryHour,
                        practiceHour:row.practiceHour,
                        courseName:row.courseName,
                        courseModel:row.courseModel
                    };
                });
            },
            onLoadSuccess: function() {
                $compile(angular.element('#classCoursePlanAddTable').contents())($scope);
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
            angular.element('#classCoursePlanAddTable').bootstrapTable('selectPage', 1);
            //angular.element('#classCoursePlanAddTable').bootstrapTable('refresh');
        }
        // 重置表单
        $scope.searchReset = function () {
            $scope.courseParam.dept_ID = "";
            $scope.courseParam.courseNameOrCode = "";
            angular.element('form[name="searchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#classCoursePlanAddTable').bootstrapTable('refresh');
        };
        $scope.ok = function (form) {
            var rows = angular.element('#classCoursePlanAddTable').bootstrapTable('getSelections');
            if( rows.length != 1){
                alertService("请选择一条数据");
                return;
            }

            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            $rootScope.showLoading = true; // 开启加载提示
            scheme_classCurriculaApplyService.addCourseChange($scope.courseInfo,function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                myScope.creditValidate(myScope);
                angular.element('#adjustApplyTable').bootstrapTable('refresh');
                angular.element('#classCoursePlanAddTable').bootstrapTable('refresh');
                alertService('success', '添加成功');
            });
        }
    }
    addCourseController.$inject = ['$rootScope','id', 'model_ID', 'grade', 'formVerifyService', 'app', '$compile', '$scope', '$uibModalInstance', 'scheme_classCurriculaApplyService', 'alertService', 'myScope'];
    
    var updateCourseController = function ($rootScope, formVerifyService,$compile,grade, $scope, $uibModalInstance, item, scheme_classCurriculaApplyService, alertService, myScope) {
        $scope.close = function () {
            $uibModalInstance.close();
        };
        //学期
        $scope.semester = [];
        scheme_classCurriculaApplyService.getSemester(grade,function (error,message,data) {
            $scope.semester = data.data;
            var html = '' +
                '<select ui-select2  ui-chosen="updateForm.semester" '
                +  ' ng-model="courseInfo.semester" id="semester" ng-required="true" name="semester" ui-jq="chosen"ui-options="{search_contains: true}" ui-jq="chosen" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option  ng-repeat="a in semester" value="{{a.id}}">{{a.name}}</option> '
                +  '</select>';
            angular.element("#semester").parent().empty().append(html);
            $compile(angular.element("#semester").parent().contents())($scope);
        });
        $scope.courseInfo = {
            classCurricula_ID : item.id,
            course_ID : item.course_ID,
            classSchemeDemand_ID : item.classSchemeDemand_ID,
            semester : item.semester,
            courseNum : item.courseNum,
            courseName : item.courseName,
            credit : item.credit,
            type : "2",
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
            $rootScope.showLoading = true; // 开启加载提示
            scheme_classCurriculaApplyService.addCourseChange($scope.courseInfo,function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                myScope.creditValidate(myScope);
                angular.element('#adjustApplyTable').bootstrapTable('refresh');
                alertService('success', '修改成功');
            });
        }
    }
    updateCourseController.$inject = ['$rootScope', 'formVerifyService','$compile','grade', '$scope', '$uibModalInstance', 'item', 'scheme_classCurriculaApplyService', 'alertService', 'myScope'];

    var deleteController = function ($rootScope, formVerifyService,$compile, $scope, $uibModalInstance, scheme_classCurriculaApplyService, alertService, pScope) {
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {

            $rootScope.showLoading = true; // 开启加载提示
            scheme_classCurriculaApplyService.addCourseChange(pScope.courseInfo,function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                pScope.creditValidate(pScope);
                $uibModalInstance.close();
                angular.element('#adjustApplyTable').bootstrapTable('refresh');
               // alertService('success', '删除成功');
            });

        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    }
    deleteController.$inject = ['$rootScope', 'formVerifyService','$compile', '$scope', '$uibModalInstance', 'scheme_classCurriculaApplyService', 'alertService', 'pScope'];

})(window);
