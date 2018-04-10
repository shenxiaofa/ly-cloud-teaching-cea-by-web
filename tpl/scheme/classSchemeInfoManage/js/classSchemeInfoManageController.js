;(function (window, undefined) {
    'use strict';

    window.scheme_classSchemeInfoManageController = function ($compile, $scope, $uibModal, $rootScope, $window, scheme_classSchemeInfoManageService, alertService, app) {
        //学生类别下拉框数据
        $scope.studentCategory = [];
        scheme_classSchemeInfoManageService.getSelected('XSLBDM', function (error,message,data) {
            $scope.studentCategory = data.data;
            var html = '' +
                '<select ui-select2  ui-chosen="codeCategorySearchForm.educationLevel_ID" '
                +  ' ng-model="classScheme.studentCategoryCode" id="studentCategoryCode" name="studentCategoryCode" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option ng-repeat="a in studentCategory" value="{{a.dataNumber}}">{{a.dataName}}</option> '
                +  '</select>';
            angular.element("#studentCategoryCode").parent().empty().append(html);
            $compile(angular.element("#studentCategoryCode").parent().contents())($scope);
        });

        // 表格的高度
        $scope.win_height = $window.innerHeight;
        $scope.table_height = $scope.win_height - 223;

        //tree菜单高度
        $scope.leftTree = {
            "border-right":"1px solid #e5e5e5",
            "height": $scope.win_height-130,
            "padding-top":"15px"
        }

        $scope.queryParams = function queryParams(params) {
            var attributeNamesForOrderBy = {};
           // attributeNamesForOrderBy[params.sortName] = params.sortOrder;
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                attributeNamesForOrderBy: attributeNamesForOrderBy
            };
            $rootScope.$log.debug(angular.extend(pageParam, $scope.classScheme));
            return angular.extend(pageParam, $scope.classScheme);
        }
        $scope.classSchemeTable = {
            //url: 'data_test/scheme/tableview_majorScheme.json',
            url: app.api.address + '/scheme/classScheme/infomation',
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
            search: false,
            showColumns: true,
            sortName: 'createTime', // 默认排序字段
            sortOrder: 'desc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField : "id", // 指定主键列
            uniqueId: "id", // 每行唯一标识
            queryParams: $scope.queryParams,//传递参数（*）
            showRefresh: true,
            responseHandler:function(response){
                return response.data;
            },
            onLoadSuccess: function() {
                $compile(angular.element('#classSchemeTable').contents())($scope);
            },
            clickToSelect: false,
            columns: [
                {checkbox: true,width: "5%"},
                {field:"id",title:"班级培养方案id",visible:false},
                {field:"class_ID",title:"班级id",visible:false},
                {field:"major_ID",title:"年级专业id",visible:false},
                {field:"info",title:"基本信息",visible:false},
                {field:"grade",title:"年级",align:"center",valign:"middle"},
                {field:"deptName",title:"单位",align:"center",valign:"middle"},
                {field:"majorName",title:"专业名称",align:"center",valign:"middle"},
                {field:"majorCode",title:"专业代码",align:"center",valign:"middle"},
                {field:"className",title:"班级名称",align:"center",valign:"middle"},
                {field:"schemeVersion",title:"方案版本",align:"center",valign:"middle"},
                {field:"educationLevel",title:"学生类别",align:"center",valign:"middle"},
                {field:"cz",title:"操作",align:"center",valign:"middle",width: "35%",
                    formatter : function (value, row, index) {
                        var id = row.id;
                        var btnCss = 'btn btn-default btn-sm';
                        var style = '';
                        //不存在培养方案
                        if(typeof(id) == "undefined"){
                            btnCss = 'btn btn-sm';
                            style = 'margin-right: 5px;';
                        }
                        var infoEditBtn = "<button id='btn_fzrsz' style='"+style+"' has-permission='classSchemeInfoManage:baseInfo' type='button' ng-click='openSet(0," + JSON.stringify(row) + ")' class='"+btnCss+"'>基本信息</button>";
                        var creditSetBtn = "<button id='btn_fzrsz' style='"+style+"' has-permission='classSchemeInfoManage:credit'  type='button' ng-click='openSet(1," + JSON.stringify(row) + ")' class='"+btnCss+"'>学时学分</button>";
                        var courseSetBtn = "<button id='btn_fzrsz' style='"+style+"' has-permission='classSchemeInfoManage:courseSet'  type='button' ng-click='openSet(2," + JSON.stringify(row) + ")' class='"+btnCss+"'>课程设置</button>";
                        var deleteBtn = "<button id='btn_fzrsz'  has-permission='classSchemeInfoManage:delete'   type='button' ng-click='delete(" + JSON.stringify(row) + ")' class='btn btn-sm del-btn'>删除</button>";
                        return infoEditBtn+"&nbsp"+creditSetBtn+"&nbsp"+courseSetBtn+"&nbsp"+deleteBtn;
                    }
                }
            ]
        };
        //查询参数
        $scope.classScheme = {
            grade : "",                 //年级
            deptNum : "",               //单位
            studentCategoryCode : "",   //学生类别（培养层次）
            majorName : "",             //专业
            className : "",             //班级
            schemeSign : ""             //是否存在方案
        }

        //查询
        $scope.searchSubmit = function () {
            angular.element('#classSchemeTable').bootstrapTable('selectPage', 1);
            //angular.element('#classSchemeTable').bootstrapTable('refresh');
        }
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.classScheme.studentCategoryCode = "";
            $scope.classScheme.majorName = "";
            $scope.classScheme.className = "";
            $scope.classScheme.schemeSign = "";
            // 重新初始化下拉框
            angular.element('form[name="searchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#classSchemeTable').bootstrapTable('refresh');
        }

        //tree菜单高度
        $scope.leftTreeStyle = {
            "height": $window.innerHeight-70
        };
        $scope.menuTreeControl = {};
        // 树菜单选择回调
        // 树菜单参数设置
        $scope.zTreeOptions = {
            view: {
                dblClickExpand: false,
                showLine: true,
                selectedMulti: false
            },
            async: {
                enable: true,
                url: app.api.address + '/scheme/majorScheme/tree',
                //url: app.api.address + '/base-info/department/gradeDepartmentTree',
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
                    } else {
                        $scope.classScheme.grade = parentId;
                        $scope.classScheme.deptNum = id;
                        // 刷新右边内容数据（若是初始化，由于表格未初始化，报异常，不需处理）
                        try {
                            angular.element('#classSchemeTable').bootstrapTable('refresh');
                        } catch (e) {}
                    }

                }
            }
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
            angular.element('#classSchemeTable').bootstrapTable('resetView',{ height: $scope.table_height } );
        }
        $scope.copyScheme = function () {
            var rows = angular.element('#classSchemeTable').bootstrapTable('getSelections');
            if(rows.length == 0){
                alertService('请先选择需要复制的班级');
                return;
            }
            $rootScope.showLoading = true; // 开启加载提示
            scheme_classSchemeInfoManageService.copyToClass(rows, function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                alertService('success', '复制成功');
                angular.element('#classSchemeTable').bootstrapTable('refresh');
            });
        }

        //删除
        $scope.delete = function (data) {
            if(typeof(data.id) == "undefined"){
                alertService('班级下不存在培养方案');
                return;
            }
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/scheme/classSchemeInfoManage/delete.html',
                size: '',
                resolve: {
                    id: function () {
                        return data.id;
                    }
                },
                controller: deleteController
            });

        }

        //打开设置面板
        $scope.openSet = function (index,data) {
            if(typeof(data.id) == "undefined"){
                alertService('请先复制培养方案到班级');
                return;
            }
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/scheme/classSchemeInfoManage/set.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return data;
                    },index: function () {
                        return index;
                    }
                },
                controller: setController
            });
        }

    };

    var setController = function ($rootScope, app, formVerifyService, $compile, $scope, $uibModalInstance, $uibModal, index, item, scheme_classSchemeInfoManageService, alertService) {
        //默认选中tab标签页
        $scope.activeJustified = index;
        $scope.close = function () {
            $uibModalInstance.close();
        };
        $scope.classScheme = {
            id : item.id,//班级培养方案
            majorCode : item.majorCode,
            majorName : item.majorName,
            clazzName : item.className,
            educationLevel : item.educationLevel,
            studentCategoryCode : item.studentCategoryCode,
            disciplineCode : item.disciplineCode,
            degreeCode : item.degreeCode,
            minStudyYear : item.minStudyYear,
            maxStudyYear : item.maxStudyYear,
            major_ID : item.major_ID, //年级专业id
            class_ID : item.class_ID, //班级id
            info : item.info
        }
        $scope.classSchemeInfoEdit = {
            //url: 'data_test/scheme/tableview_classSchemeInfoEdit.json',
            url: app.api.address + '/scheme/classScheme/Demand?classSchemeId='+item.id,
            method: 'get',
            cache: false,
            height: 380,
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: false,
            pageSize: 10,
            pageNumber:1,
            pageList: [10, 20, 30],
            search: false,
            responseHandler:function(response){
                var data = {
                    rows :response.data,
                    total : response.data.length
                }
                return data;
            },
            onLoadSuccess: function() {
                $compile(angular.element('#classSchemeInfoEdit').contents())($scope);
            },
            clickToSelect: false,
            columns: [
                {field:"id",title:"班级方案要求id",visible:false},
                {field:"modelName",title:"模块名称",align:"center",valign:"middle"},
                {field:"courseProperty_ID",title:"课程性质",align:"center",valign:"middle"},
                {field:"creditDemand",title:"学分要求",align:"center",valign:"middle",width: "10%",
                    formatter : function (value, row, index) {
                        var input = '<input type="number" value="'+value+'"  name="creditDemand" size="4"/>';
                        return input;
                    }
                },
                {field:"presetCourseSign",title:"是否预置课程",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        if(value === "1")
                            return "是";
                        return "否";
                    }
                },
                {field:"cz",title:"操作",align:"center",valign:"middle",width: "20%",
                    formatter : function (value, row, index) {
                        var deleteBtn = "<button id='btn_fzrsz' has-permission='classSchemeInfoManage:model:delete' type='button' ng-click='deleteSchemeDemand(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm del-btn'>删除</button>";
                        return deleteBtn;
                    }
                }
            ]
        };
        $scope.deleteSchemeDemand = function (data) {
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/scheme/classSchemeInfoManage/delete.html',
                size: '',
                resolve: {
                    id: function () {
                        return data.id;
                    },
                    classSchemeId: function () {
                        return item.id;
                    },
                    pScope: function () {
                        return $scope;
                    }
                },
                controller: deleteSchemeDemandController
            });

        }
        //tab标签
        $scope.schemeDemand={
            id:"",
            model_ID:""
        }
        $scope.title = [];
        $scope.s = 0;
        scheme_classSchemeInfoManageService.getTitle(item.id,function (error,message,data) {
            $scope.title = data;
            $scope.schemeDemand.id = data[0].classSchemeDemand_ID;
            $scope.schemeDemand.model_ID = data[0].id;
            angular.element('#classCoursePlanEnter').bootstrapTable('refresh');
        });

        // 查询参数
        $scope.queryParams = function queryParams() {
            return  $scope.schemeDemand;
        }
        //课程设置
        $scope.completeCredit = 0;
        $scope.classCoursePlanEnter = {
            //url: 'data_test/scheme/tableview_classCoursePlanEnter.json',
            url: app.api.address + '/scheme/classScheme/courseInfo?',
            method: 'get',
            cache: false,
            height: 320,
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: false,
            pageSize: 10,
            pageNumber:1,
            pageList: [10, 20, 30],
            search: false,
            queryParams: $scope.queryParams,
            responseHandler:function(response){
                var data = {
                    rows :response.data,
                    total : response.data.length
                }
                return data;
            },
            onLoadSuccess: function(data) {
                $compile(angular.element('#classCoursePlanEnter').contents())($scope);
                $scope.$apply(function () {
                    $scope.completeCredit = 0;
                    for(var index=0; index < data.rows.length; index++){
                        $scope.completeCredit += parseFloat(data.rows[index].credit);
                    }
                });
            },
            clickToSelect: false,
            columns: [
                {field:"id",title:"课程计划id",visible:false},
                {field:"remark",visible:false},
                {field:"semester",title:"开课学期",align:"center",valign:"middle",width: "15%"},
                {field:"courseNum",title:"课程号",align:"center",valign:"middle"},
                {field:"courseName",title:"课程名称",align:"center",valign:"middle",width: "20%"},
                {field:"credit",title:"学分",align:"center",valign:"middle"},
                {field:"totalHour",title:"总学时",align:"center",valign:"middle"},
                {field:"examWay",title:"考核方式",align:"center",valign:"middle"},
                {field:"theoryHour",title:"理论学时",align:"center",valign:"middle"},
                {field:"practiceHour",title:"实践学时",align:"center",valign:"middle"},
                {field:"cz",title:"操作",align:"center",valign:"middle",width: "20%",
                    formatter : function (value, row, index) {
                        var updateBtn = "<button id='btn_fzrsz' has-permission='classSchemeInfoManage:course:update' type='button' ng-click='update(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>修改</button>";
                        var deleteBtn = "<button id='btn_fzrsz' has-permission='classSchemeInfoManage:course:delete' type='button' ng-click='delete(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm del-btn'>删除</button>";
                        return updateBtn+"&nbsp"+deleteBtn;
                    }
                }
            ]
        };
        //切换标签页
        $scope.change = function (a) {
            $scope.schemeDemand={
                id:a.classSchemeDemand_ID,
                model_ID:a.id
            }
            angular.element('#classCoursePlanEnter').bootstrapTable('refresh');
        }

        $scope.openAddCourse = function () {
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/scheme/classSchemeInfoManage/addCourse.html',
                size: 'lg',
                resolve: {
                    id: function () {
                        return $scope.schemeDemand.id;
                    },
                    model_ID: function () {
                        return $scope.schemeDemand.model_ID;
                    },
                    classScheme_ID : function () {
                        return item.id; //班级培养方案id
                    },
                    grade : function () {
                        return item.grade;
                    }
                },
                controller: addCourseController
            });
        }

        $scope.update = function (data) {
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/scheme/classSchemeInfoManage/updateCourse.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return data;
                    },
                    grade : function () {
                        return item.grade;
                    }
                },
                controller: updateCourseController
            });
        }

        $scope.ok = function (form) {
            //基本信息保存
            if($scope.activeJustified == 0){
                if(form.$invalid) {
                    // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                    formVerifyService(form);
                    return;
                };
                $rootScope.showLoading = true; // 开启加载提示
                scheme_classSchemeInfoManageService.setInfo(item.id,$scope.classScheme.info,function (error, message) {
                    $rootScope.showLoading = false; // 关闭加载提示
                    if (error) {
                        alertService(message);
                        return;
                    }
                    angular.element('#classSchemeTable').bootstrapTable('refresh');
                    alertService('success', '保存成功');
                });
            }
            //学分设置
            if($scope.activeJustified == 1){
                var creditSet = angular.element('#classSchemeInfoEdit').bootstrapTable('getOptions').data;
                var creditDemands = angular.element('#classSchemeInfoEdit input[name="creditDemand"]');
                for (var i=0; i<creditDemands.length; i++) {
                    creditSet[i].creditDemand = creditDemands.eq(i).val();
                }
                $rootScope.showLoading = true; // 开启加载提示
                scheme_classSchemeInfoManageService.setCredit(creditSet,function (error, message) {
                    $rootScope.showLoading = false; // 关闭加载提示
                    if (error) {
                        alertService(message);
                        return;
                    }
                    alertService('success', '修改成功');
                });
            }
            if($scope.activeJustified == 2){
                alertService('success', '保存成功');
            }
        }

        $scope.delete = function (data) {

            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/scheme/classSchemeInfoManage/delete.html',
                size: '',
                resolve: {
                    id: function () {
                        return data.id;
                    }
                },
                controller: deleteCurriculaController
            });
        }
    }
    setController.$inject = ['$rootScope', 'app', 'formVerifyService', '$compile', '$scope', '$uibModalInstance', '$uibModal', 'index', 'item', 'scheme_classSchemeInfoManageService', 'alertService'];

    var addCourseController = function ($rootScope, id, model_ID, classScheme_ID, grade, formVerifyService,app, $compile, $scope, $uibModalInstance, scheme_classSchemeInfoManageService, alertService) {
        $scope.close = function () {
            $uibModalInstance.close();
        };
        //单位
        $scope.dept = [];
        scheme_classSchemeInfoManageService.getDept(function (error,message,data) {
            $scope.dept = data.data;
            var html = '' +
                '<select ui-select2  ui-chosen="codeCategorySearchForm.dept_ID" '
                +  ' ng-model="courseParam.dept_ID" id="dept_ID" name="dept_ID" ui-jq="chosen"ui-options="{search_contains: true}" ui-jq="chosen" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option  ng-repeat="a in dept" value="{{a.departmentNumber}}">{{a.departmentName}}</option> '
                +  '</select>';
            angular.element("#dept_ID").parent().empty().append(html);
            $compile(angular.element("#dept_ID").parent().contents())($scope);
        });
        //学期
        $scope.semester = [];
        scheme_classSchemeInfoManageService.getSemester(grade,function (error,message,data) {
            $scope.semester = data.data;
            var html = '' +
                '<select ui-select2  ui-chosen="addForm.semesterId" '
                +  ' ng-model="courseInfo.semesterId" id="semesterId" ng-required="true" name="semesterId" ui-jq="chosen"ui-options="{search_contains: true}" ui-jq="chosen" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option  ng-repeat="a in semester" value="{{a.id}}">{{a.name}}</option> '
                +  '</select>';
            angular.element("#semesterId").parent().empty().append(html);
            $compile(angular.element("#semesterId").parent().contents())($scope);
        });

        //查询参数
        $scope.courseParam = {
            dept_ID : "",
            courseNameOrCode : "",
            model_ID: model_ID,
            classScheme_ID : classScheme_ID
        }
        //添加参数
        $scope.courseInfo = {
            id:"",
            semesterId:"",
            credit:"",
            totalHour:"",
            theoryHour:"",
            practiceHour:"",
            remark:""
        }
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
            };
            return angular.extend(pageParam, $scope.courseParam);
        }
        $scope.classCoursePlanAddTable = {
            //url: 'data_test/scheme/tableview_classCoursePlanAdd.json',
            //url: app.api.address + '/scheme/classScheme/allCourse',
            url: app.api.address + '/scheme/majorScheme/operationCourse',
            method: 'get',
            cache: false,
            height: 0,
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
            search: false,
            showColumns: false,
            showRefresh: false,
            queryParams: $scope.queryParams,//传递参数（*）
            responseHandler:function(response){
                return response.data;
            },
            onCheck: function (row) {
                $scope.$apply(function () {
                    $scope.courseInfo = {
                        semesterId:$scope.courseInfo.semesterId,
                        courseId:row.id,
                        classSchemeDemand_ID:id,//方案要求id
                        credit:row.credit,
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
           // angular.element('#classCoursePlanAddTable').bootstrapTable('refresh');
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
            scheme_classSchemeInfoManageService.addCourse($scope.courseInfo,function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#classCoursePlanAddTable').bootstrapTable('refresh');
                angular.element('#classCoursePlanEnter').bootstrapTable('refresh');
                alertService('success', '添加成功');
            });
        }
    }
    addCourseController.$inject = ['$rootScope','id', 'model_ID', 'classScheme_ID', 'grade', 'formVerifyService', 'app', '$compile', '$scope', '$uibModalInstance', 'scheme_classSchemeInfoManageService', 'alertService'];

    var updateCourseController = function ($rootScope, formVerifyService,$compile, $scope, $uibModalInstance, item,grade, scheme_classSchemeInfoManageService, alertService) {
        $scope.close = function () {
            $uibModalInstance.close();
        };
        //学期
        $scope.semester = [];
        scheme_classSchemeInfoManageService.getSemester(grade, function (error,message,data) {
            $scope.semester = data.data;
            var html = '' +
                '<select ui-select2  ui-chosen="codeCategorySearchForm.semester" '
                +  ' ng-model="courseInfo.semesterId" id="semesterId" ng-required="true" name="semesterId" ui-jq="chosen"ui-options="{search_contains: true}" ui-jq="chosen" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option  ng-repeat="a in semester" value="{{a.id}}">{{a.name}}</option> '
                +  '</select>';
            angular.element("#semesterId").parent().empty().append(html);
            $compile(angular.element("#semesterId").parent().contents())($scope);
        });
        $scope.courseInfo = {
            id : item.id,
            semesterId : item.semester,
            courseNum : item.courseNum,
            courseName : item.courseName,
            credit : item.credit,
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
            scheme_classSchemeInfoManageService.update($scope.courseInfo,function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                angular.element('#classCoursePlanEnter').bootstrapTable('refresh');
                alertService('success', '修改成功');
            });
        }
    }
    updateCourseController.$inject = ['$rootScope', 'formVerifyService','$compile', '$scope', '$uibModalInstance', 'item','grade', 'scheme_classSchemeInfoManageService', 'alertService'];

    var deleteController = function ($rootScope, formVerifyService,$compile, $scope, $uibModalInstance, scheme_classSchemeInfoManageService, alertService, id) {
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {

            $rootScope.showLoading = true; // 开启加载提示
            scheme_classSchemeInfoManageService.delete(id,  function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else {
                    //alertService('success', '删除成功');
                }
                $uibModalInstance.close();
                angular.element('#classSchemeTable').bootstrapTable('refresh');
            })

        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    }
    deleteController.$inject = ['$rootScope', 'formVerifyService','$compile', '$scope', '$uibModalInstance', 'scheme_classSchemeInfoManageService', 'alertService', 'id'];

    var deleteSchemeDemandController = function ($rootScope, formVerifyService,$compile, $scope, $uibModalInstance, scheme_classSchemeInfoManageService, alertService, id, classSchemeId, pScope) {
        $scope.message = "删除模块同时会删除模块下课程计划，确定要删除吗？";
        $scope.ok = function () {

            $rootScope.showLoading = true; // 开启加载提示
            scheme_classSchemeInfoManageService.deleteDemand(id,function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else {
                    //alertService('success', '删除成功');
                    scheme_classSchemeInfoManageService.getTitle(classSchemeId,function (error,message,data) {
                        pScope.title = data;
                        pScope.schemeDemand.id = data[0].classSchemeDemand_ID;
                        pScope.schemeDemand.model_ID = data[0].id;
                        angular.element('#classCoursePlanEnter').bootstrapTable('refresh');
                    });
                }
                $uibModalInstance.close();
                angular.element('#classSchemeInfoEdit').bootstrapTable('refresh');
            });

        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    }
    deleteSchemeDemandController.$inject = ['$rootScope', 'formVerifyService','$compile', '$scope', '$uibModalInstance', 'scheme_classSchemeInfoManageService', 'alertService', 'id', 'classSchemeId', 'pScope'];
    var deleteCurriculaController = function ($rootScope, formVerifyService,$compile, $scope, $uibModalInstance, scheme_classSchemeInfoManageService, alertService, id) {
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {

            $rootScope.showLoading = true; // 开启加载提示
            scheme_classSchemeInfoManageService.deleteCurricula(id,function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else {
                    //alertService('success', '删除成功');
                }
                $uibModalInstance.close();
                angular.element('#classCoursePlanEnter').bootstrapTable('refresh');
            });

        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    }
    deleteCurriculaController.$inject = ['$rootScope', 'formVerifyService','$compile', '$scope', '$uibModalInstance', 'scheme_classSchemeInfoManageService', 'alertService', 'id'];

})(window);
