;(function (window, undefined) {
    'use strict';

    window.scheme_electiveCurriculumController = function ($compile, $scope, $uibModal, $rootScope, $window,electiveCurriculumService, alertService, app) {
        $scope.inCurriculumFindDto = {
            semesterId: "", // 学年学期ID
            courseKeyword: "", //  年级
            coursePropertyNum: "2", //课程属性编号
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
                    angular.element("#"+node.tId+"_a").trigger("click");
                },
                onClick: function(event, treeId, treeNode) {
                    var type = treeNode.type;
                    var name = treeNode.name;
                    var id = treeNode.id;
                    var parentId = treeNode.parentId;
                    if (type == "grade") {
                        //$scope.inCurriculumFindDto.grade = name;
                        $scope.inCurriculumFindDto.courseDeptId = "";
                    } else {
                        //$scope.inCurriculumFindDto.grade = parentId;
                        $scope.inCurriculumFindDto.courseDeptId = id;
                    }
                    // 刷新右边内容数据（若是初始化，由于表格未初始化，报异常，不需处理）
                    try {
                        angular.element('#electiveCurriculumTable').bootstrapTable('refresh');
                    } catch (e) {}
                }
            }
        };

        //开课学期下拉框
        $scope.semesters = [];
        electiveCurriculumService.getSemesters(function (error,message,data) {
            $scope.semesters = data.data;
            var html = '' +
                '<select ui-select2  ui-chosen="codeCategorySearchForm.semesterId" '
                +  ' ng-model="inCurriculumStoreDto.semesterId" id="semesterId"  name="semesterId" ui-jq="chosen"ui-options="{search_contains: true}" ui-jq="chosen" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option  ng-repeat="semester in semesters" value="{{semester.id}}">{{semester.acadYearSemester}}</option> '
                +  '</select>';
            angular.element("#semesterId").parent().empty().append(html);
            $compile(angular.element("#semesterId").parent().contents())($scope);
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
            $rootScope.$log.debug(angular.extend(pageParam, $scope.inCurriculumFindDto));
            return angular.extend(pageParam, $scope.inCurriculumFindDto);
        };

        $scope.electiveCurriculumTable = {
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
                $compile(angular.element('#electiveCurriculumTable').contents())($scope);
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
                            stopOpenBtn = "<button id='btn_stop_open' has-permission='electiveCurriculum:stopOpen' type='button' ng-click='stopOpen(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>停开</button>";
                        }else{
                            stopOpenBtn = "<button id='btn_stop_open' has-permission='electiveCurriculum:recoveryOpen' type='button' ng-click='recoveryOpen(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>恢复</button>";
                        }
                        var editBtn = "<button id='btn_edit' has-permission='electiveCurriculum:update' type='button' ng-click='edit(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>编辑</button>";
                        var delBtn = "";
                        if("0" == row.src){
                            delBtn = "<button id='btn_delete' has-permission='electiveCurriculum:delete' type='button' ng-click='del(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm del-btn'>删除</button>";
                        }
                        return stopOpenBtn+"&nbsp"+editBtn+"&nbsp"+delBtn;
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
            angular.element('#electiveCurriculumTable').bootstrapTable('resetView',{ height: $scope.table_height } );
        };

        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#electiveCurriculumTable').bootstrapTable('refresh');
        };
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.inCurriculumFindDto = {};
            angular.element('#electiveCurriculumTable').bootstrapTable('refresh');
        };

        $scope.stopOpen = function(row){
            electiveCurriculumService.stopOpen(row.id, function (error, message) {
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#electiveCurriculumTable').bootstrapTable('refresh');
            });
        };

        $scope.recoveryOpen = function(row){
            electiveCurriculumService.recoveryOpen(row.id, function (error, message) {
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#electiveCurriculumTable').bootstrapTable('refresh');
            });
        };

        $scope.addCurriculum = function(){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/scheme/electiveCurriculum/curriculumAdd.html',
                size: 'lg',
                resolve: {
                    courseDeptId: function () {
                        return $scope.inCurriculumFindDto.courseDeptId;
                    }
                },
                controller: curriculumAddController
            });
        };

        $scope.edit = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/scheme/electiveCurriculum/curriculumEdit.html',
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
            electiveCurriculumService.delCurriculum(row.id, function (error, message) {
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#electiveCurriculumTable').bootstrapTable('refresh');
            });
        };
    };
    scheme_electiveCurriculumController.$inject = ['$compile', '$scope', '$uibModal', '$rootScope', '$window','electiveCurriculumService', 'alertService', 'app'];

    var curriculumAddController = function ($scope, $compile, $uibModalInstance, $uibModal, app, courseDeptId, alertService,formVerifyService,electiveCurriculumService){
        $scope.close = function () {
            $uibModalInstance.close();
        };

        //开课学期下拉框
        $scope.semesters = [];
        electiveCurriculumService.getSemesters(function (error,message,data) {
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
        electiveCurriculumService.getExamWays(function (error,message,data) {
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
            courseProperty:"2"
        }
        //添加参数
        $scope.inCurriculumStoreDto = {
            courseDeptId:courseDeptId,
            courseId:"",
            courseName:"",
            courseNum:"",
            coursePropertyNum:"2",
            coursePropertyName:"选修",
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
            $scope.inCourseFindDto.courseProperty = "2";
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
            $scope.inCourseFindDto.courseProperty = "2";
            angular.element('#classCoursePlanAddTable').bootstrapTable('selectPage', 1);
            //angular.element('#classCoursePlanAddTable').bootstrapTable('refresh');
        }
        // 重置表单
        $scope.searchReset = function () {
            $scope.inCourseFindDto.courseProperty = "2";
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
            electiveCurriculumService.addCurriculum($scope.inCurriculumStoreDto,function (error, message) {
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#classCoursePlanAddTable').bootstrapTable('refresh');
                alertService('success', '添加成功');
            });
        }
    };
    curriculumAddController.$inject = ['$scope', '$compile', '$uibModalInstance', '$uibModal', 'app', 'courseDeptId', 'alertService','formVerifyService','electiveCurriculumService'];

    var curriculumEditController = function ($scope, $uibModalInstance, $uibModal,electiveCurriculumService, item,alertService,formVerifyService){
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
                electiveCurriculumService.editCurriculum($scope.InCurriculumStoreDto, function (error, message) {
                    if (error) {
                        alertService(message);
                        return;
                    }
                    alertService('success', '编辑成功');
                    angular.element('#electiveCurriculumTable').bootstrapTable('refresh');
                });
                $uibModalInstance.close();
                return;
            };
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    curriculumEditController.$inject = ['$scope', '$uibModalInstance', '$uibModal','electiveCurriculumService','item', 'alertService','formVerifyService'];
})(window);
