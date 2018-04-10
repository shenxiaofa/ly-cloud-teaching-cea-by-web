;(function (window, undefined) {
    'use strict';

    /*
    * 主界面
    * */
    window.scheme_compulsoryCurriculumController = function ($compile, $scope, $uibModal, $rootScope, $window,compulsoryCurriculumService, alertService, app) {
        $scope.inCurriculumFind = {
            semesterId: "", // 学年学期ID
            courseKeyword: "", //  年级
            coursePropertyNum: "1", //课程属性编号
            courseDeptId:""
        };

        // 表格的高度
        $scope.win_height = $window.innerHeight;
        $scope.table_height = $scope.win_height - 155;

        //tree菜单高度
        $scope.leftTree = {
            "border-right":"1px solid #e5e5e5",
            "height": $scope.win_height-100,
            "padding-top":"15px"
        };

        //tree菜单高度
        $scope.leftTreeStyle = {
            "height": $window.innerHeight-70
        };

        $scope.zTreeOptions = {
            view: {
                dblClickExpand: false,
                showLine: true,
                selectedMulti: false
            },
            async: {
                enable: true,
                //url: app.api.address + '/scheme/majorScheme/tree',
                url:app.api.address + '/scheme/majorScheme/openDeptTree',
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
                        return node.level == 0;
                    }, true);
                    if(node){
                        angular.element("#"+node.tId+"_a").trigger("click");
                    }
                },
                onClick: function(event, treeId, treeNode) {
                    var type = treeNode.type;
                    var name = treeNode.name;
                    var id = treeNode.id;
                    var parentId = treeNode.parentId;
                    if (type == "grade") {
                        //$scope.inCurriculumFindDto.grade = name;
                        $scope.inCurriculumFind.courseDeptId = "";
                    } else {
                        //$scope.inCurriculumFindDto.grade = parentId;
                        $scope.inCurriculumFind.courseDeptId = id;
                    }
                    // 刷新右边内容数据（若是初始化，由于表格未初始化，报异常，不需处理）
                    try {
                        angular.element('#compulsoryCurriculumTable').bootstrapTable('refresh');
                    } catch (e) {}
                }
            }
        };

        //开课学期下拉框
        $scope.semesters = [];
        compulsoryCurriculumService.getSemesters(function (error,message,data) {
            $scope.semesters = data.data;
            var html = '' +
                '<select ui-chosen="codeCategorySearchForm.semester" '
                +  ' ng-model="inClassCurriculaFind.semester" id="semester"  name="semesterId" ui-jq="chosen"ui-options="{search_contains: true}" ui-jq="chosen" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option  ng-repeat="semester in semesters" value="{{semester.id}}">{{semester.acadYearSemester}}</option> '
                +  '</select>';
            angular.element("#semester").parent().empty().append(html);
            $compile(angular.element("#semester").parent().contents())($scope);
        });

        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var attributeNamesForOrderBy = {};
            attributeNamesForOrderBy[params.sortName] = params.sortOrder;
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                attributeNamesForOrderBy: attributeNamesForOrderBy
            };
            $rootScope.$log.debug(angular.extend(pageParam, $scope.inCurriculumFind));
            return angular.extend(pageParam, $scope.inCurriculumFind);
        }

        $scope.compulsoryCurriculumTable = {
            url: app.api.address + '/curriculum/curriculum',
            method: 'get',
            cache: false,
            height: $scope.table_height,
            toolbar: '#toolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [10, 20, 30],
            queryParams: $scope.queryParams,//传递参数（*）
            search: false,
            showColumns: true,
            showRefresh: true,
            responseHandler:function(response){
                return response.data;
            },
            onLoadSuccess: function() {
                $compile(angular.element('#compulsoryCurriculumTable').contents())($scope);
            },
            clickToSelect: true,
            columns: [
                {field:"semesterId",title:"开课学期",align:"center",valign:"middle"},
                {field:"courseDeptName",title:"开课单位",align:"center",valign:"middle"},
                {field:"courseName",title:"课程名称",align:"center",valign:"middle"},
                {field:"courseNum",title:"课程号",align:"center",valign:"middle"},
                {field:"coursePropertyName",title:"课程属性",align:"center",valign:"middle"},
                {field:"credit",title:"学分",align:"center",valign:"middle"},
                {field:"totalHour",title:"学时",align:"center",valign:"middle"},
                {field:"studentCount",title:"上课人数",align:"center",valign:"middle"},
                {field:"classPlanCount",title:"班级计划数",align:"center",valign:"middle"},
                {field:"src",title:"数据来源",align:"center",valign:"middle",
                    formatter:function(value, row, index){
                        if("1" == value){
                            return "生成";
                        }else{
                            return "新增";
                        }
                }},
                {field:"cz",title:"操作", align:"center", valign:"middle",
                    formatter : function (value, row, index) {
                        var stopOpenBtn = "";
                        if(row.stopSign == 0){
                            stopOpenBtn = "<button id='btn_stop_open' has-permission='compulsoryCurriculum:stopOpen'  type='button' ng-click='stopOpen(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>停开</button>";
                        }else{
                            stopOpenBtn = "<button id='btn_stop_open' has-permission='compulsoryCurriculum:recoveryOpen' type='button' ng-click='recoveryOpen(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>恢复</button>";
                        }

                        var editBtn = "<button id='btn_edit' has-permission='compulsoryCurriculum:update' type='button' ng-click='edit(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>编辑</button>";
                        var delBtn = "";
                        if("0" == row.src){
                            delBtn = "<button id='btn_edit' has-permission='compulsoryCurriculum:delete' type='button' ng-click='del(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm del-btn'>删除</button>";
                        }
                        var classPlanMaintainBtn = "";
                        if("0" != row.src){
                            classPlanMaintainBtn = "<button id='btn_class_plan_maintain' has-permission='compulsoryCurriculum:maintainClassPlan' type='button' ng-click='maintainClassPlan(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>班级计划维护</button>";
                        }
                        return stopOpenBtn+"&nbsp"+editBtn+"&nbsp"+delBtn+"&nbsp"+classPlanMaintainBtn;
                }}
            ]
        };

        // 查询表单显示和隐藏切换
        $scope.isHideSearchForm = false; // 默认显示
        $scope.searchFormHideToggle = function () {
            $scope.isHideSearchForm = !$scope.isHideSearchForm
            if ($scope.isHideSearchForm) {
                $scope.table_height = $scope.table_height + 45;
            } else {
                $scope.table_height = $scope.table_height - 45;
            }
            angular.element('#compulsoryCurriculumTable').bootstrapTable('resetView',{ height: $scope.table_height } );
        }

        // 查询表单提交
        $scope.searchSubmit = function () {
            $scope.inCurriculumFind.semesterId = $scope.inCurriculumFind.semester;
            angular.element('#compulsoryCurriculumTable').bootstrapTable('selectPage', 1);
            //angular.element('#compulsoryCurriculumTable').bootstrapTable('refresh');
        }
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.inCurriculumFindDto = {};
            angular.element('#compulsoryCurriculumTable').bootstrapTable('refresh');
        }

        $scope.addCurriculum = function(){

            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/scheme/compulsoryCurriculum/curriculumAdd.html',
                size: 'lg',
                resolve: {
                    courseDeptId: function () {
                        return $scope.inCurriculumFind.courseDeptId;
                    }
                },
                controller: curriculumAddController
            });
        };

        $scope.edit = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/scheme/compulsoryCurriculum/curriculumEdit.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return row;
                    }
                 },
                controller: curriculumEditController
            });
        };

        $scope.del = function(row){
            compulsoryCurriculumService.delCurriculum(row.id, function (error, message) {
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#compulsoryCurriculumTable').bootstrapTable('refresh');
            });
        };

        $scope.stopOpen = function(row){
            compulsoryCurriculumService.stopOpen(row.id, function (error, message) {
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#compulsoryCurriculumTable').bootstrapTable('refresh');
            });
        };

        $scope.recoveryOpen = function(row){
            compulsoryCurriculumService.recoveryOpen(row.id, function (error, message) {
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#compulsoryCurriculumTable').bootstrapTable('refresh');
            });
        };

        // 教学计划打开上课人数详情面板
        $scope.maintainClassPlan = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/scheme/compulsoryCurriculum/curriculumMaintain.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return row;
                    }
                },
                controller: maintainClassSchemePlanController
            });
        };
    };
    scheme_compulsoryCurriculumController.$inject = ['$compile', '$scope', '$uibModal', '$rootScope', '$window', 'compulsoryCurriculumService','alertService', 'app'];

    /*
    * 添加界面
    * */
    var curriculumAddController = function (app,$compile,$scope, $uibModalInstance, $uibModal,compulsoryCurriculumService, courseDeptId,alertService,formVerifyService){
        $scope.close = function () {
            $uibModalInstance.close();
        };

        //开课学期下拉框
        $scope.semesters = [];
        compulsoryCurriculumService.getSemesters(function (error,message,data) {
            $scope.semesters = data.data;
            var html = '' +
                '<select ui-select2  ui-chosen="addForm.semesterId" '
                +  ' ng-model="inCurriculumStoreDto.semesterId" id="semesterId" ng-required="true" name="semesterId" ui-jq="chosen"ui-options="{search_contains: true}" ui-jq="chosen" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option  ng-repeat="semester in semesters" value="{{semester.id}}">{{semester.acadYearSemester}}</option> '
                +  '</select>';
            angular.element("#semesterId").parent().empty().append(html);
            $compile(angular.element("#semesterId").parent().contents())($scope);
        });

        //考核方式下拉框
        $scope.examWays = [];
        compulsoryCurriculumService.getExamWays(function (error,message,data) {
            $scope.examWays = data.data;
            var html = '' +
                '<select ui-select2  ui-chosen="addForm.examWayNum" '
                +  ' ng-model="inCurriculumStoreDto.examWayNum" id="examWayNum" name="semesterId" ui-jq="chosen"ui-options="{search_contains: true}" ui-jq="chosen" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option  ng-repeat="examWay in examWays" value="{{examWay.id}}">{{examWay.dataName}}</option> '
                +  '</select>';
            angular.element("#examWayNum").parent().empty().append(html);
            $compile(angular.element("#examWayNum").parent().contents())($scope);
        });

        //查询参数
        $scope.inCourseFindDto = {
            courseNameOrNum : "",
            filterCurricula: false,
            courseProperty:"1"
        }
        //添加参数
        $scope.inCurriculumStoreDto = {
            courseDeptId:courseDeptId,
            courseId:"",
            courseName:"",
            courseNum:"",
            coursePropertyNum:"1",
            coursePropertyName:"必修",
            semesterId:"",
            credit:"",
            totalHour:"",
            examWayNum:"",
            way:"",
            studentCount:"",
            remark:"",
            src:"0"
        };
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            $scope.inCourseFindDto.courseProperty = "1";
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                total: true,
                param: $scope.inCourseFindDto
            };
            return angular.extend(pageParam, $scope.inCourseFindDto);
        }
        $scope.classCoursePlanAddTable = {
            url: app.api.address + '/base-info/courseLibrary/showCourseLibrary',
            method: 'post',
            cache: false,
            height: 0,
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
            search: false,
            showColumns: false,
            showRefresh: false,
            queryParams: $scope.queryParams,//传递参数（*）
            responseHandler:function(response){
                return response.data;
            },
            onCheck: function (row) {
                $scope.$apply(function () {
                    $scope.inCurriculumStoreDto.courseId = row.id;
                    $scope.inCurriculumStoreDto.courseName = row.courseName;
                    $scope.inCurriculumStoreDto.courseNum = row.courseNumber;
                    $scope.inCurriculumStoreDto.semesterId = row.buildSchoolSemester;
                    $scope.inCurriculumStoreDto.credit = row.credit;
                    $scope.inCurriculumStoreDto.totalHour = row.totalHour;
                    $scope.inCurriculumStoreDto.examWayNum = row.examWayNum;
                    $scope.inCurriculumStoreDto.remark = row.remark;
                });
            },
            onLoadSuccess: function() {
                $compile(angular.element('#classCoursePlanAddTable').contents())($scope);
            },
            clickToSelect: true,
            columns: [
                {radio: true,width: "5%"},
                {field:"id",title:"id",visible:false},
                {field:"establishUnitNumberName",title:"开课单位",align:"center",valign:"middle"},
                {field:"courseNumber",title:"课程号",align:"center",valign:"middle"},
                {field:"courseName",title:"课程名称",align:"center",valign:"middle"},
                {field:"courseModuleName",title:"课程模块",align:"center",valign:"middle"},
                {field:"credit",title:"学分",align:"center",valign:"middle"},
                {field:"totalHours",title:"总学时",align:"center",valign:"middle"},
                {field:"theoryHours",title:"理论学时",align:"center",valign:"middle"},
                {field:"testHours",title:"实践学时",align:"center",valign:"middle"}
            ]
        };

        // 查询表单
        $scope.searchSubmit = function () {
            $scope.inCourseFindDto.courseProperty = "1";
            angular.element('#classCoursePlanAddTable').bootstrapTable('selectPage', 1);
            //angular.element('#classCoursePlanAddTable').bootstrapTable('refresh');
        }
        // 重置表单
        $scope.searchReset = function () {
            $scope.inCourseFindDto.courseProperty = "1";
            $scope.inCourseFindDto.courseNameOrNum = "";
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
            compulsoryCurriculumService.addCurriculum($scope.inCurriculumStoreDto,function (error, message) {
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#classCoursePlanAddTable').bootstrapTable('refresh');
                alertService('success', '添加成功');
            });
        }
    };
    curriculumAddController.$inject = ['app','$compile','$scope', '$uibModalInstance', '$uibModal','compulsoryCurriculumService','courseDeptId', 'alertService','formVerifyService'];

    /*
    * 编辑界面
    * */
    var curriculumEditController = function ($scope, $uibModalInstance, $uibModal,compulsoryCurriculumService, item,alertService,formVerifyService){
        $scope.InCurriculumStoreDto = {
            id : item.id,//班级培养方案
            semesterId : item.semesterId,
            courseName : item.courseName,
            coursePropertyName : item.coursePropertyName,
            courseDeptName : item.courseDeptName,
            credit : item.credit,
            totalHour : item.totalHour,
            theoryHour : item.theoryHour,
            practiceHour : item.practiceHour,
            examWayNum:item.examWayNum,
            examWay:item.examWay,
            remark:item.remark,
            way:item.way,
            studentCount:item.studentCount
        };

        $scope.save = function (form) {
            // 处理前验证
            if(!form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                compulsoryCurriculumService.editCurriculum($scope.InCurriculumStoreDto, function (error, message) {
                    if (error) {
                        alertService(message);
                        return;
                    }
                    alertService('success', '编辑成功');
                    angular.element('#compulsoryCurriculumTable').bootstrapTable('refresh');
                });
                $uibModalInstance.close();
                return;
            };
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    curriculumEditController.$inject = ['$scope', '$uibModalInstance', '$uibModal','compulsoryCurriculumService','item', 'alertService','formVerifyService'];

    /*
    * 班级开课计划维护界面
    * */
    var maintainClassSchemePlanController = function ($compile,$scope, $uibModalInstance, $uibModal,compulsoryCurriculumService, item,alertService,formVerifyService,app) {
        $scope.close = function () {
            $uibModalInstance.close();
        };

        $scope.inClassCurriculumFindDto = {
            campusId : "", //校区ID
            classDeptName : "", //课程所属部门明恒
            grade : "", //年级
            majorName : "", //专业名称
            studentTypeNum : "", //学生类别码
            className : "", //班级名称
            curriculumId : item.id
        };

        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var attributeNamesForOrderBy = {};
            attributeNamesForOrderBy[params.sortName] = params.sortOrder;
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                attributeNamesForOrderBy: attributeNamesForOrderBy
            };
            return angular.extend(pageParam, $scope.inClassCurriculumFindDto);
        };

        $scope.classSchemePlanTable = {
            url: app.api.address + '/curriculum/classCurriculum',
            method: 'get',
            cache: false,
            height: "800px",
           // toolbar: '#toolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [10, 20, 30],
            queryParamsType: '',
            queryParams: $scope.queryParams,//传递参数（*）
            search: false,
            showColumns: false,
            showRefresh: false,
            responseHandler:function(response){
                return response.data;
            },
            onLoadSuccess: function() {
                $compile(angular.element('#classSchemePlanTable').contents())($scope);
            },
            clickToSelect: true,
            columns: [
                {field:"campusName",title:"所属校区",align:"center",valign:"middle"},
                {field:"classDeptName",title:"所属学院",align:"center",valign:"middle"},
                {field:"grade",title:"年级",align:"center",valign:"middle"},
                {field:"majorName",title:"专业",align:"center",valign:"middle"},
                {field:"studentTypeName",title:"学生类别",align:"center",valign:"middle"},
                {field:"className",title:"班级名称",align:"center",valign:"middle"},
                {field:"studentCount",title:"人数",align:"center",valign:"middle"},
                {field:"src",title:"数据来源",align:"center",valign:"middle",
                    formatter:function(value, row, index){
                        if("1" == value){
                            return "生成";
                        }else{
                            return "新增";
                        }
                    }
                },
                {field:"cz",title:"操作", align:"center", valign:"middle",
                    formatter : function (value, row, index) {
                        var stopOpenBtn = "";
                        if(row.stopSign == 0){
                            stopOpenBtn = "<button id='btn_stop_open' has-permission='compulsoryCurriculum:classSchemePlan:stopOpen' type='button' ng-click='stopOpen(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>停开</button>";
                        }else{
                            stopOpenBtn = "<button id='btn_stop_open' has-permission='compulsoryCurriculum:classSchemePlan:recoveryOpen' type='button' ng-click='recoveryOpen(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>恢复</button>";
                        }

                        var deleteBtn = "";
                        if("2" == row.src){
                            deleteBtn = "<button id='btn_del' has-permission='compulsoryCurriculum:classSchemePlan:delete' type='button' ng-click='del(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm del-btn'>删除</button>";
                        }
                        return stopOpenBtn+"&nbsp"+deleteBtn;
                    }}
            ]
        };

        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#classSchemePlanTable').bootstrapTable('selectPage', 1);
            //angular.element('#classSchemePlanTable').bootstrapTable('refresh');
        };
        // 查询表单重置
        $scope.searchReset = function () {
            var curriculumId = $scope.inClassCurriculumFindDto.curriculumId;
            $scope.inClassCurriculumFindDto = {
                curriculumId:curriculumId
            };
            angular.element('#classSchemePlanTable').bootstrapTable('refresh');
        };

        // 教学计划打开上课人数详情面板
        // $scope.addClassCurriculum = function(){
        //     $uibModal.open({
        //         animation: true,
        //         backdrop: 'static',
        //         templateUrl: 'tpl/scheme/compulsoryCurriculum/classSelect.html',
        //         size: 'lg',
        //         resolve: {
        //             item: function () {
        //                 return item;
        //             }
        //         },
        //         controller: classSelectController
        //     });
        // };

        $scope.stopOpen = function(row){
            compulsoryCurriculumService.stopOpenClassCurriculum(row.id, function (error, message) {
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#classSchemePlanTable').bootstrapTable('refresh');
            });
        };

        $scope.recoveryOpen = function(row){
            compulsoryCurriculumService.recoveryOpenClassCurriculum(row.id, function (error, message) {
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#classSchemePlanTable').bootstrapTable('refresh');
            });
        };

        $scope.del = function(row){
            compulsoryCurriculumService.delClassCurriculum(row.id, function (error, message) {
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#classSchemePlanTable').bootstrapTable('refresh');
            });
        };
    };
    maintainClassSchemePlanController.$inject = ['$compile','$scope', '$uibModalInstance', '$uibModal','compulsoryCurriculumService','item', 'alertService','formVerifyService','app'];

    /*
     * 班级开课计划维护界面
     * */
    // var classSelectController = function ($compile,$scope, $uibModalInstance, $uibModal, compulsoryCurriculumService,item ,alertService,formVerifyService) {
    //     $scope.close = function () {
    //         $uibModalInstance.close();
    //     };
    //
    //     $scope.inClassFindDto = {
    //         campusId : "", //校区ID
    //         deptName : "", //课程所属部门明恒
    //         grade : "", //年级
    //         majorName : "", //专业名称
    //         studentTypeNum : "", //学生类别码
    //         className : "" //班级名称
    //     };
    //
    //     // 查询参数
    //     $scope.queryParams = function queryParams(params) {
    //         var attributeNamesForOrderBy = {};
    //         attributeNamesForOrderBy[params.sortName] = params.sortOrder;
    //         var pageParam = {
    //             pageSize: params.pageSize,   //页面大小
    //             pageNo: params.pageNumber,  //页码
    //             attributeNamesForOrderBy: attributeNamesForOrderBy
    //         };
    //         return angular.extend(pageParam, $scope.inClassFindDto);
    //     };
    //
    //     $scope.classTable = {
    //         url: app.api.address + '/student/class',
    //         method: 'get',
    //         cache: false,
    //         height: "800px",
    //         sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
    //         striped: true,
    //         pagination: true,
    //         pageSize: 10,
    //         pageNumber:1,
    //         pageList: [5, 10, 20, 50],
    //         queryParamsType: '',
    //         queryParams: $scope.queryParams,//传递参数（*）
    //         search: false,
    //         showColumns: true,
    //         showRefresh: true,
    //         responseHandler:function(response){
    //             return response.data;
    //         },
    //         onLoadSuccess: function() {
    //             $compile(angular.element('#classTable').contents())($scope);
    //         },
    //         clickToSelect: true,
    //         columns: [
    //             {checkbox: true, width: "5%"},
    //             {field:"campusName",title:"所属校区",align:"center",valign:"middle"},
    //             {field:"deptName",title:"所属学院",align:"center",valign:"middle"},
    //             {field:"grade",title:"年级",align:"center",valign:"middle"},
    //             {field:"majorName",title:"专业",align:"center",valign:"middle"},
    //             {field:"studentTypeName",title:"学生类别",align:"center",valign:"middle"},
    //             {field:"className",title:"班级名称",align:"center",valign:"middle"},
    //             {field:"studentCount",title:"人数",align:"center",valign:"middle"}
    //         ]
    //     };
    //
    //     // 查询表单提交
    //     $scope.searchSubmit = function () {
    //         angular.element('#classTable').bootstrapTable('refresh');
    //     };
    //     // 查询表单重置
    //     $scope.searchReset = function () {
    //         $scope.inClassFindDto = {};
    //         angular.element('#classTable').bootstrapTable('refresh');
    //     };
    //
    //     $scope.selectClass = function() {
    //         var rows = angular.element('#classTable').bootstrapTable('getSelections');
    //         if(rows.length == 0){
    //             alertService('请先选择要添加的行政班');
    //             return;
    //         };
    //         var ids = [];
    //
    //         rows.forEach (function(row) {
    //             ids.push(row.id);
    //         });
    //
    //         var data = {
    //             curriculumId:item.id,
    //             classIds:ids
    //         };
    //         compulsoryCurriculumService.addClass(data, function (error, message) {
    //             if (error) {
    //                 alertService(message);
    //                 return;
    //             }
    //             alertService('success', '添加班级计划成功');
    //             angular.element('#classSchemePlanTable').bootstrapTable('refresh');
    //         });
    //         $uibModalInstance.close();
    //         return;
    //     };
    // };
    // classSelectController.$inject = ['$compile','$scope', '$uibModalInstance', '$uibModal','compulsoryCurriculumService', 'item','alertService','formVerifyService'];
})(window);
