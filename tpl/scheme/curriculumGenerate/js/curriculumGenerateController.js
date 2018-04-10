;(function (window, undefined) {
    'use strict';

    window.curriculumGenerateController = function ($compile, $scope, $uibModal, $rootScope, $window, alertService, app,curriculumGenerateService) {

		$scope.inCurriculumFind = {
            semesterId: "", // 学年学期ID
            courseKeyword: "", //  年级
            courseDeptId:""
        };

        // 表格的高度
        $scope.win_height = $window.innerHeight;
        $scope.table_height = $scope.win_height - 145;

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
                url:app.api.address + '/scheme/majorScheme/myselfDeptTree',
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
                        $scope.inCurriculumFind.courseDeptId = "";
                    } else {
                        //$scope.inCurriculumFindDto.grade = parentId;
                        $scope.inCurriculumFind.courseDeptId = id;
                    }
                    // 刷新右边内容数据（若是初始化，由于表格未初始化，报异常，不需处理）
                    try {
                        angular.element('#curriculumStatisticalTable').bootstrapTable('refresh');
                    } catch (e) {}
                }
            }
        };

        //开课学期下拉框
        $scope.semesters = [];
        curriculumGenerateService.getSemesters(function (error,message,data) {
            $scope.semesters = data.data;
            var html = '' +
                '<select  ui-chosen="curriculumSearchForm.semesterId" '
                +  ' ng-model="inCurriculumFind.semester" id="semester" name="semester" ui-jq="chosen"ui-options="{search_contains: true}" ui-jq="chosen" class="form-control"> '
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
        };

        $scope.curriculumStatisticalTable = {
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
            queryParamsType: '',
            search: false,
            showColumns: true,
            showRefresh: true,
            responseHandler:function(response){
                return response.data;
            },
            onLoadSuccess: function() {
                $compile(angular.element('#curriculumStatisticalTable').contents())($scope);
            },
            clickToSelect: true,
            columns: [
                {field:"semesterName",title:"开课学期",align:"center",valign:"middle"},
                {field:"courseDeptName",title:"开课单位",align:"center",valign:"middle"},
                {field:"courseName",title:"课程名称",align:"center",valign:"middle"},
                {field:"courseNum",title:"课程号",align:"center",valign:"middle"},
                {field:"coursePropertyName",title:"课程属性",align:"center",valign:"middle"},
                {field:"credit",title:"学分",align:"center",valign:"middle"},
                {field:"totalHour",title:"学时",align:"center",valign:"middle"},
                {
                    field: "studentCount", title: "上课人数", align: "center", valign: "middle",
                    formatter: function (value, row, index) {
                        var studentCountBtn = "<a  ng-click='openStudentCountDetail(" + JSON.stringify(row) + ")'>"+value+"</a>";
                        return studentCountBtn;
                    }
                },
                {field:"classPlanCount",title:"班级计划数",align:"center",valign:"middle",
                    formatter: function (value, row, index) {
                        var schemeCountDetail = "<a  ng-click='openSchemeCountDetail(" + JSON.stringify(row) + ")'>"+value+"</a>";
                        return schemeCountDetail;
                    }
                }
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
            angular.element('#curriculumStatisticalTable').bootstrapTable('resetView',{ height: $scope.table_height } );
        }

        // 查询表单提交
        $scope.searchSubmit = function () {
            $scope.inCurriculumFind.semesterId = $scope.inCurriculumFind.semester;
            angular.element('#curriculumStatisticalTable').bootstrapTable('selectPage', 1);
          //  angular.element('#curriculumStatisticalTable').bootstrapTable('refresh');
        }
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.inCurriculumFind = {};
            angular.element('#curriculumStatisticalTable').bootstrapTable('refresh');
        }

        // 教学计划打开生成面板
        $scope.generateCurriculum = function(){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/scheme/curriculumGenerate/curriculumGenerate.html',
                size: 'lg',
                resolve: {
                    deptNum: function () {
                        return $scope.inCurriculumFind.courseDeptId;
                    }
                },
                controller: generateController
            });
        };

        // 教学计划打开上课人数详情面板
        $scope.openStudentCountDetail = function(row){
            var data = {
                "serverName":app.api.address + "/curriculum/classCurriculum/studentBaseInfo?curriculumId="+row.id
            };

            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/scheme/curriculumGenerate/studentCountDetail.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return data;
                    }
                },
                controller: studentCountDetailController
            });
        };

        // 教学计划打开上课人数详情面板
        $scope.openSchemeCountDetail = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/scheme/curriculumGenerate/schemeCountDetail.html',
                size: 'lg',
                resolve: {
                item: function () {
                    return row;
                }
            },
                controller: schemeCountDetailController
            });
        };
    };
    curriculumGenerateController.$inject = ['$compile', '$scope', '$uibModal', '$rootScope', '$window', 'alertService', 'app','curriculumGenerateService'];

    // 教学计划生成控制器
    var generateController = function ($compile,$scope, $uibModalInstance, $uibModal,deptNum, curriculumGenerateService,alertService,formVerifyService) {
        $scope.inClassCurriculaFindDto = {};
        //开课学期下拉框
        $scope.semesters = [];
        curriculumGenerateService.getSemesters(function (error,message,data) {
            $scope.semesters = data.data;
            var html = '' +
                '<select ui-select2  ui-chosen="curriculumGenerateForm.semesterId" '
                +  ' ng-model="inClassCurriculaFindDto.semesterId" id="semesterId" ng-required="true" name="semesterId" ui-jq="chosen"ui-options="{search_contains: true}" ui-jq="chosen" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option  ng-repeat="semester in semesters" value="{{semester.id}}">{{semester.acadYearSemester}}</option> '
                +  '</select>';
            angular.element("#semesterId").parent().empty().append(html);
            $compile(angular.element("#semesterId").parent().contents())($scope);
        });

        //年级下拉框
        $scope.grades = [];
        curriculumGenerateService.getGrade(function (error,message,data) {
            $scope.grades = data.data;
            var html = '' +
                '<select ui-select2 ng-change="cascadeProfession()" ui-chosen="curriculumGenerateForm.grade" '
                +  ' ng-model="inClassCurriculaFindDto.grade" id="grade" name="grade" ui-jq="chosen"ui-options="{search_contains: true}" ui-jq="chosen" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option  ng-repeat="grade in grades" value="{{grade.id}}">{{grade.value}}</option> '
                +  '</select>';
            angular.element("#grade").parent().empty().append(html);
            $compile(angular.element("#grade").parent().contents())($scope);
        });
        //专业下拉框
        $scope.professions = [];
        curriculumGenerateService.getProfession($scope.inClassCurriculaFindDto,function (error,message,data) {
            $scope.professions = data.data;
            var html = '' +
                '<select ui-select2  ui-chosen="curriculumGenerateForm.majorId" '
                +  ' ng-model="inClassCurriculaFindDto.majorId" id="majorId" name="majorId" ui-jq="chosen"ui-options="{search_contains: true}" ui-jq="chosen" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option  ng-repeat="profession in professions" value="{{profession.id}}">{{profession.value}}</option> '
                +  '</select>';
            angular.element("#majorId").parent().empty().append(html);
            $compile(angular.element("#majorId").parent().contents())($scope);
        });

        $scope.cascadeProfession = function () {
            curriculumGenerateService.getProfession($scope.inClassCurriculaFindDto,function (error,message,data) {
                $scope.professions = data.data;
                var html = '' +
                    '<select ui-select2  ui-chosen="curriculumGenerateForm.majorId" '
                    +  ' ng-model="inClassCurriculaFindDto.majorId" id="majorId"  name="majorId" ui-jq="chosen"ui-options="{search_contains: true}" ui-jq="chosen" class="form-control"> '
                    +  '<option value="">==请选择==</option> '
                    +  '<option  ng-repeat="profession in professions" value="{{profession.id}}">{{profession.value}}</option> '
                    +  '</select>';
                angular.element("#majorId").parent().empty().append(html);
                $compile(angular.element("#majorId").parent().contents())($scope);
            });
        }

        $scope.inClassCurriculaFindDto = {
            semesterId: "", // 学年学期ID
            grade: "", //  年级
            majorId: "",// 专业主键
            deptNum:deptNum,
            way: ""  // 生成方式
        };

        // 数据初始化
        $scope.save = function (form) {
            // 处理前验证
            if(!form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);

                curriculumGenerateService.generate($scope.inClassCurriculaFindDto, function (error, message) {
                    if (error) {
                        alertService(message);
                        return;
                    }
                    alertService('success', '生成成功');
                    angular.element('#curriculumStatisticalTable').bootstrapTable('refresh');
                });
                $uibModalInstance.close();
                return;
            };

        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    generateController.$inject = ['$compile','$scope', '$uibModalInstance', '$uibModal','deptNum','curriculumGenerateService', 'alertService','formVerifyService'];

    // 上课人数详情界面
    var studentCountDetailController = function ($compile,$scope, $uibModalInstance, $uibModal, item,curriculumGenerateService,alertService,formVerifyService) {
        $scope.close = function () {
            $uibModalInstance.close();
        };

        debugger;
        //开课学期下拉框
        $scope.campuss = [];
        curriculumGenerateService.getCampuss(function (error,message,data) {
            debugger;
            $scope.campuss = data.data;
            var html = '' +
                '<select ui-select2  ui-chosen="studentCountDetailForm.campusId" '
                +  ' ng-model="inStudentBaseInfoFindDto.campusId" id="campusId" ng-required="true" name="campusId" ui-jq="chosen"ui-options="{search_contains: true}" ui-jq="chosen" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option  ng-repeat="campus in campuss" value="{{campus.id}}">{{campus.campusName}}</option> '
                +  '</select>';
            angular.element("#campusId").parent().empty().append(html);
            $compile(angular.element("#campusId").parent().contents())($scope);
        });

        $scope.inStudentBaseInfoFindDto = {};

        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var attributeNamesForOrderBy = {};
            attributeNamesForOrderBy[params.sortName] = params.sortOrder;
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                attributeNamesForOrderBy: attributeNamesForOrderBy
            };
            return angular.extend(pageParam, $scope.inStudentBaseInfoFindDto);
        }

        $scope.studentCountDetailTable = {
            url: item.serverName,
            method: 'get',
            cache: false,
            height: "800px",
            //toolbar: '#toolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: false,
            pageSize: 10,
            pageNumber:1,
            queryParams: $scope.queryParams,//传递参数（*）
            queryParamsType: '',
            search: false,
            showColumns: false,
            showRefresh: false,
            responseHandler:function(response){
                return response.data;
            },
            onLoadSuccess: function() {
                $compile(angular.element('#studentCountDetailTable').contents())($scope);
            },
            clickToSelect: true,
            columns: [
                {field:"campusName",title:"所属校区",align:"center",valign:"middle"},
                {field:"deptName",title:"所属学院",align:"center",valign:"middle"},
                {field:"grade",title:"年级",align:"center",valign:"middle"},
                {field:"gradeMarjorName",title:"专业",align:"center",valign:"middle"},
                {field:"className",title:"班级",align:"center",valign:"middle"},
                {field:"studentNum",title:"学号",align:"center",valign:"middle"},
                {field:"studentName",title:"姓名",align:"center",valign:"middle"},
                {field:"statusState",title:"学籍状态",align:"center",valign:"middle"}
            ]
        };

        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#studentCountDetailTable').bootstrapTable('selectPage', 1);
            //angular.element('#studentCountDetailTable').bootstrapTable('refresh');
        }
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.inStudentBaseInfoFindDto = {};
            angular.element('#studentCountDetailTable').bootstrapTable('refresh');
        }
    };
    studentCountDetailController.$inject = ['$compile','$scope', '$uibModalInstance', '$uibModal','item','curriculumGenerateService', 'alertService','formVerifyService'];

    // 班级开课计划界面
    var schemeCountDetailController = function ($compile,$scope, $uibModalInstance, $uibModal,item, alertService,formVerifyService,app) {
        debugger;
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
            //toolbar: '#toolbar', //工具按钮用哪个容器
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
                {field:"studentCount",title:"人数",align:"center",valign:"middle",
                    formatter: function (value, row, index) {
                        var studentCountBtn = "<a  ng-click='openStudentCountDetail(" + JSON.stringify(row) + ")'>"+value+"</a>";
                        return studentCountBtn;
                    }
                }
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

        // 打开班级学生详情面板
        $scope.openStudentCountDetail = function(row){
            var data = {
                "serverName":app.api.address + "/student/studentBaseInfo?classId="+row.id
            };
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/scheme/curriculumGenerate/studentCountDetail.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return data;
                    }
                },
                controller: studentCountDetailController
            });
        };
    };
    schemeCountDetailController.$inject = ['$compile','$scope', '$uibModalInstance', '$uibModal','item', 'alertService','formVerifyService',"app"];
})(window);
