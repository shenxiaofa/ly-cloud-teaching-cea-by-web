;(function (window, undefined) {
    'use strict';

    window.scheme_majorSchemeInfoManageController = function ($timeout,$compile, $scope, $uibModal, $rootScope, $window, scheme_majorSchemeInfoManageService, alertService, app) {
        //校区下拉框数据
        $scope.campus = [];
        scheme_majorSchemeInfoManageService.getCampus(function (error,message,data) {
            $scope.campus = data.data;
            var html = '' +
                '<select ui-select2  ui-chosen="searchForm.educationLevel"  '
                +  ' ng-model="majorScheme.campusNumber" id="campusNumber" name="campusNumber" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option ng-repeat="a in campus" value="{{a.campusNumber}}">{{a.campusName}}</option> '
                +  '</select>';
            angular.element("#campusNumber").parent().empty().append(html);
            $compile(angular.element("#campusNumber").parent().contents())($scope);
        });
        //学生类别下拉框数据
        $scope.studentCategory = [];
        scheme_majorSchemeInfoManageService.getSelected('XSLBDM', function (error,message,data) {
            $scope.studentCategory = data.data;
            var html = '' +
                '<select ui-select2  ui-chosen="searchForm.studentCategoryCode" '
                +  ' ng-model="majorScheme.studentCategoryCode" id="studentCategoryCode" name="studentCategoryCode" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
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

        // var mouseWheel = document.getElementById('left-tree');
        // if (mouseWheel.addEventListener) {
        //     mouseWheel.addEventListener('DOMMouseScroll', function(event) {
        //         if(event.detail<0){
        //             if(parseInt($("#menuTree").css("margin-top"))< 0){
        //                 $("#menuTree").css("margin-top",$("#menuTree").offset().top+100);
        //             }else{
        //                 $("#menuTree").css("margin-top",0);
        //             }
        //         }
        //         if(event.detail>0){
        //             $("#menuTree").css("margin-top",$("#menuTree").offset().top-100);
        //         }
        //     }, false);
        // }
        // mouseWheel.onmousewheel = function(event) {
        //     event = event || window.event;
        //     mouseWheel.innerHTML = event.wheelDelta;
        //     event.returnValue = false;
        // }


        $scope.majorScheme = {
            grade : "",
            dept_ID : "",
            campusNumber: "",
            majorCodeOrName : "",
            studentCategoryCode : "",
            schemeSign : "",
        };
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var attributeNamesForOrderBy = {};
            //attributeNamesForOrderBy[params.sortName] = params.sortOrder;
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                attributeNamesForOrderBy: attributeNamesForOrderBy
            };
            $rootScope.$log.debug(angular.extend(pageParam, $scope.majorScheme));
            return angular.extend(pageParam, $scope.majorScheme);
        }
        $scope.majorSchemeTable = {
            //url: 'data_test/scheme/tableview_majorScheme.json',
            url: app.api.address + '/scheme/majorScheme',
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
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            sortName: 'majorCode', // 默认排序字段
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
            onLoadSuccess: function() {
                $compile(angular.element('#majorSchemeTable').contents())($scope);
            },
            clickToSelect: false,
            columns: [
                {checkbox: true,width: "5%"},
                {field:"majorScheme_ID",title:"专业培养方案id",visible:false},
                {field:"gradeMajor_ID",title:"年级专业id",visible:false},
                {field:"campus",title:"校区",align:"center",valign:"middle"},
                {field:"grade",title:"年级",align:"center",valign:"middle"},
                {field:"majorName",title:"专业名称",align:"center",valign:"middle"},
                {field:"majorCode",title:"专业代码",align:"center",valign:"middle"},
                {field:"deptName",title:"单位",align:"center",valign:"middle"},
                {field:"schemeVersion",title:"方案版本",align:"center",valign:"middle"},
                {field:"studentCategory",title:"学生类别",align:"center",valign:"middle"},
                {field:"cz",title:"操作",align:"center",valign:"middle",width: "35%",
                    formatter : function (value, row, index) {
                        var id = row.majorScheme_ID;
                        var btnCss = 'btn btn-default btn-sm';
                        var style = '';
                        //不存在培养方案
                        if(typeof(id) == "undefined"){
                            btnCss = 'btn btn-sm';
                            style = 'margin-right: 5px;';
                        }
                        var infoEditBtn = "<button id='btn_fzrsz' style='"+style+"' has-permission='majorSchemeInfoManage:baseInfo'  type='button' ng-click='openSet(0," + JSON.stringify(row) + ")' class='"+btnCss+"'>基本信息</button>";
                        var creditSetBtn = "<button id='btn_fzrsz' style='"+style+"' has-permission='majorSchemeInfoManage:credit' type='button' ng-click='openSet(1," + JSON.stringify(row) + ")' class='"+btnCss+"'>学时学分</button>";
                        var courseSetBtn = "<button id='btn_fzrsz' style='"+style+"' has-permission='majorSchemeInfoManage:courseSet' type='button' ng-click='openSet(2," + JSON.stringify(row) + ")' class='"+btnCss+"'>课程设置</button>";
                        var deleteBtn = "<button id='btn_fzrsz' has-permission='majorSchemeInfoManage:delete' type='button' ng-click='delete(" + JSON.stringify(row) + ")' class='"+btnCss+" del-btn'>删除</button>";
                        return infoEditBtn+"&nbsp"+creditSetBtn+"&nbsp"+courseSetBtn+"&nbsp"+deleteBtn;
                    }
                }
            ]
        };

        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#majorSchemeTable').bootstrapTable('selectPage', 1);
           // angular.element('#majorSchemeTable').bootstrapTable('refresh');
        }
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.majorScheme.campusNumber = "";
            $scope.majorScheme.majorCodeOrName = "";
            $scope.majorScheme.studentCategoryCode = "";
            $scope.majorScheme.schemeSign = "";
            // 重新初始化下拉框
            angular.element('form[name="searchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#majorSchemeTable').bootstrapTable('refresh');
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
                        $scope.majorScheme.grade = name;
                        $scope.majorScheme.dept_ID = "";
                    } else {
                        $scope.majorScheme.grade = parentId;
                        $scope.majorScheme.dept_ID = id;
                    }

                    // 刷新右边内容数据（若是初始化，由于表格未初始化，报异常，不需处理）
                    try {
                        angular.element('#majorSchemeTable').bootstrapTable('refresh');
                    } catch (e) {}
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
            angular.element('#majorSchemeTable').bootstrapTable('resetView',{ height: $scope.table_height } );
        }

        $scope.copyScheme = function () {
            var rows = angular.element('#majorSchemeTable').bootstrapTable('getSelections');
            if(rows.length == 0){
                alertService('请先选择需要复制的专业');
                return;
            }
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/scheme/majorSchemeInfoManage/copyScheme.html',
                size: '',
                resolve: {
                    rows: function () {
                        return rows;
                    }
                },
                controller: copySchemeController
            });
        }
        //删除
        $scope.delete = function (data) {
            if(typeof(data.majorScheme_ID) == "undefined"){
                alertService('专业下不存在培养方案');
                return;
            }
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/scheme/majorSchemeInfoManage/delete.html',
                size: '',
                resolve: {
                    id: function () {
                        return data.majorScheme_ID;
                    },
                },
                controller: deleteController
            });


        }
        //打开设置面板
        $scope.openSet = function (index,data) {
            if(typeof(data.majorScheme_ID) == "undefined"){
                alertService('请先复制培养方案到专业');
                return;
            }
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/scheme/majorSchemeInfoManage/set.html',
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
    scheme_majorSchemeInfoManageController.$inject = ['$timeout', '$compile', '$scope', '$uibModal', '$rootScope', '$window', 'scheme_majorSchemeInfoManageService', 'alertService', 'app'];

    var copySchemeController = function ($rootScope, rows, formVerifyService, $compile, $scope, $uibModalInstance, scheme_majorSchemeInfoManageService, alertService) {
        $scope.close = function () {
            $uibModalInstance.close();
        };

        //单位
        $scope.dept = [];
        scheme_majorSchemeInfoManageService.getDept(function (error,message,data) {
            $scope.dept = data.data;
            var html = '' +
                '<select ui-select2 ng-change="cascadeMajor()"  ui-chosen="schemeVersionCopyform.deptNum" '
                +  ' ng-model="schemeVersion.deptNum" id="deptNum" name="deptNum" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option  ng-repeat="a in dept" value="{{a.id}}">{{a.name}}</option> '
                +  '</select>';
            angular.element("#deptNum").parent().empty().append(html);
            $compile(angular.element("#deptNum").parent().contents())($scope);
        });
        //专业
        $scope.major = [];
        // scheme_majorSchemeInfoManageService.getMajor("",function (error,message,data) {
        //     $scope.major = data.data;
        //     var html = '' +
        //         '<select ui-select2  ui-chosen="schemeVersionCopyform.major_ID" '
        //         +  ' ng-model="schemeVersion.major_ID" id="major_ID" name="major_ID" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
        //         +  '<option value="">==请选择==</option> '
        //         +  '<option  ng-repeat="a in major" value="{{a.id}}">{{a.name}}</option> '
        //         +  '</select>';
        //     angular.element("#major_ID").parent().empty().append(html);
        //     $compile(angular.element("#major_ID").parent().contents())($scope);
        // });

        $scope.cascadeMajor = function () {
            var param = {
                schemeSign : "1"
            };
            param.dept_ID =  angular.element("#deptNum").val();
            scheme_majorSchemeInfoManageService.getMajor(param, function (error,message,data) {
                $scope.major = data.data;
                var html = '' +
                    '<select ui-select2  ui-chosen="schemeVersionCopyform.major_ID" '
                    +  ' ng-model="schemeVersion.major_ID" id="major_ID" name="major_ID" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                    +  '<option value="">==请选择==</option> '
                    +  '<option  ng-repeat="a in major" value="{{a.id}}">{{a.name}}</option> '
                    +  '</select>';
                angular.element("#major_ID").parent().empty().append(html);
                $compile(angular.element("#major_ID").parent().contents())($scope);
            });
        }

        $scope.schemeVersion = {
            schemeVersion_ID : "",  //来源版本
            deptNum : "",           //来源学院
            major_ID : ""           //来源专业
        };
        $scope.schemeVersionSelect = [];
        // scheme_majorSchemeInfoManageService.getSchemeVersionSelect(function (error,message,data) {
        //     $scope.schemeVersionSelect = data.rows;
        // });
        //
        // $scope.dept = [];
        scheme_majorSchemeInfoManageService.getSchemeVersionSelect(function (error,message,data) {
            $scope.schemeVersionSelect = data.rows;
            var html = '' +
                '<select ui-select2   ui-chosen="schemeVersionCopyform.schemeVersion_ID" '
                +  ' ng-model="schemeVersion.schemeVersion_ID" id="schemeVersion_ID" name="schemeVersion_ID" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option  ng-repeat="a in schemeVersionSelect" value="{{a.id}}">{{a.name}}</option> '
                +  '</select>';
            angular.element("#schemeVersion_ID").parent().empty().append(html);
            $compile(angular.element("#schemeVersion_ID").parent().contents())($scope);
        });

        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            var ids = [];
            rows.forEach (function(gradeMajor) {
                ids.push(gradeMajor.gradeMajor_ID);
            });
            $rootScope.showLoading = true; // 开启加载提示
            scheme_majorSchemeInfoManageService.copyScheme(ids, $scope.schemeVersion,function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else{
                    angular.element('#majorSchemeTable').bootstrapTable('refresh');
                    $uibModalInstance.close();
                    alertService('success', '复制成功');
                }
            });
        }
    }
    copySchemeController.$inject = ['$rootScope', 'rows', 'formVerifyService', '$compile', '$scope', '$uibModalInstance', 'scheme_majorSchemeInfoManageService', 'alertService'];

   var setController = function ($rootScope, app, formVerifyService, $compile, $scope, $uibModalInstance, $uibModal, index, item, scheme_majorSchemeInfoManageService, alertService) {
       //默认选中tab标签页
       $scope.activeJustified = index;
       $scope.close = function () {
           $uibModalInstance.close();
       };
       $scope.majorInfo = {
           majorCode : item.majorCode,
           majorName : item.majorName,
           educationYear : item.educationYear,
           studentCategory : item.studentCategory,
           disciplineCode : item.disciplineCode,
           degree : item.degree,
           minStudyYear : item.minStudyYear,
           maxStudyYear : item.maxStudyYear,
           majorScheme_ID : item.majorScheme_ID, //专业培养方案id
           gradeMajor_ID : item.gradeMajor_ID, //年级专业id
           info : item.info
       }
       //学时学分表格
       $scope.majorSchemeInfoEdit = {
          // url: 'data_test/scheme/tableview_majorSchemeInfoEdit.json',
           url: app.api.address + '/scheme/majorScheme/creditInfo/'+item.majorScheme_ID,
           method: 'get',
           cache: false,
           height: 370,
           sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
           striped: true,
           pagination: false,
           pageSize: 20,
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
               $compile(angular.element('#majorSchemeInfoEdit').contents())($scope);
           },
           clickToSelect: false,
           columns: [
               {field:"id",title:"专业培养方案要求主键",visible:false},
               {field:"schemeModelName",title:"模块名称",align:"center",valign:"middle"},
               {field:"courseProperty",title:"课程性质",align:"center",valign:"middle"},
               {field:"creditDemand",title:"学分要求",align:"center",valign:"middle",width: "15%",
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
                       var deleteBtn = "<button id='btn_fzrsz' has-permission='majorSchemeInfoManage:model:delete' type='button' ng-click='deleteSchemeDemand(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm del-btn'>删除</button>";
                       return deleteBtn;
                   }
               }
           ]
       };
       $scope.deleteSchemeDemand = function (data) {
           $uibModal.open({
               animation: true,
               backdrop: 'static',
               templateUrl: 'tpl/scheme/majorSchemeInfoManage/delete.html',
               size: '',
               resolve: {
                   id: function () {
                       return data.id;
                   },
                   majorScheme_ID: function () {
                       return item.majorScheme_ID;
                   },
                   pScope: function () {
                       return $scope;
                   },

               },
               controller: deleteSchemeDemandController
           });
       }

        //课程设置
       $scope.schemeDemand={};
       $scope.title = [];
       scheme_majorSchemeInfoManageService.getTitle(item.majorScheme_ID,function (error,message,data) {
           $scope.title = data;
           $scope.schemeDemand.majorSchemeDemand_ID = data[0].majorSchemeDemand_ID;
           $scope.schemeDemand.model_ID = data[0].id;
           angular.element('#majorCoursePlanEnter').bootstrapTable('refresh');
       });

       // 查询参数
       $scope.majorCoursePlanEnterQueryParams = function queryParams() {
           return  $scope.schemeDemand;
       }
        //已完成学分
       $scope.completeCredit = 0;
       $scope.majorCoursePlanEnter = {
           //url: 'data_test/scheme/tableview_majorCoursePlanEnter.json',
           url:app.api.address + '/scheme/majorCurricula/curricula',
           method: 'get',
           cache: false,
           height: 330,
           sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
           striped: true,
           pagination: false,
           pageSize: 10,
           pageNumber:1,
           pageList: [10, 20, 30],
           search: false,
           queryParams: $scope.majorCoursePlanEnterQueryParams,
           responseHandler:function(response){
               var data = {
                   rows :response.data,
                   total : response.data.length
               }
               return data;
           },
           onLoadSuccess: function(data) {
               $compile(angular.element('#majorCoursePlanEnter').contents())($scope);
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
                       var updateBtn = "<button id='btn_fzrsz' has-permission='majorSchemeInfoManage:course:update'  type='button' ng-click='update(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>修改</button>";
                       var deleteBtn = "<button id='btn_fzrsz' has-permission='majorSchemeInfoManage:course:delete' type='button' ng-click='delete(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm del-btn'>删除</button>";
                       return updateBtn+"&nbsp"+deleteBtn;
                   }
               }
           ]
       };
       //切换标签页
       $scope.change = function (a) {
           $scope.schemeDemand={
               majorSchemeDemand_ID:a.majorSchemeDemand_ID,
               model_ID:a.id
           }
           angular.element('#majorCoursePlanEnter').bootstrapTable('refresh');
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
               scheme_majorSchemeInfoManageService.setInfo(item.gradeMajor_ID,$scope.majorInfo.info,function (error, message) {
                   $rootScope.showLoading = false; // 关闭加载提示
                   if (error) {
                       alertService(message);
                       return;
                   }else {
                       alertService('success', '保存成功');
                   }
               });
           }
           //学分设置
           if($scope.activeJustified == 1){
               var creditSet = angular.element('#majorSchemeInfoEdit').bootstrapTable('getOptions').data;
               var creditDemands = angular.element('#majorSchemeInfoEdit input[name="creditDemand"]');
               for (var i=0; i<creditDemands.length; i++) {
                   creditSet[i].creditDemand = creditDemands.eq(i).val();
               }
               $rootScope.showLoading = true; // 开启加载提示
               scheme_majorSchemeInfoManageService.setCredit(creditSet,function (error, message) {
                   $rootScope.showLoading = false; // 关闭加载提示
                   if (error) {
                       alertService(message);
                       return;
                   }else {
                       alertService('success', '保存成功');
                   }
               });
           }
           if($scope.activeJustified == 2){
               alertService('success', '保存成功');
           }
       }

       $scope.openAddCourse = function () {
           $uibModal.open({
               animation: true,
               backdrop: 'static',
               templateUrl: 'tpl/scheme/majorSchemeInfoManage/addCourse.html',
               size: 'lg',
               resolve: {
                   majorSchemeDemand_ID: function () {
                       return $scope.schemeDemand.majorSchemeDemand_ID;
                   },
                   model_ID: function () {
                       return $scope.schemeDemand.model_ID;
                   },
                   majorScheme_ID :function () {
                       return item.majorScheme_ID;
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
               templateUrl: 'tpl/scheme/majorSchemeInfoManage/updateCourse.html',
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

       $scope.delete = function (data) {
           $uibModal.open({
               animation: true,
               backdrop: 'static',
               templateUrl: 'tpl/scheme/majorSchemeInfoManage/delete.html',
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
    setController.$inject = ['$rootScope', 'app', 'formVerifyService', '$compile', '$scope', '$uibModalInstance', '$uibModal', 'index', 'item', 'scheme_majorSchemeInfoManageService', 'alertService'];

    var addCourseController = function ($rootScope, majorSchemeDemand_ID, model_ID, majorScheme_ID, grade, formVerifyService, app, $compile, $scope, $uibModalInstance, scheme_majorSchemeInfoManageService, alertService) {
        $scope.close = function () {
            $uibModalInstance.close();
        };
        //单位
        $scope.dept = [];
        scheme_majorSchemeInfoManageService.getDept(function (error,message,data) {
            $scope.dept = data.data;
            var html = '' +
                '<select ui-select2  ui-chosen="courseSearchForm.dept_ID" '
                +  ' ng-model="courseParam.dept_ID" id="dept_ID" name="dept_ID" ui-jq="chosen"ui-options="{search_contains: true}" ui-jq="chosen" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option  ng-repeat="a in dept" value="{{a.id}}">{{a.name}}</option> '
                +  '</select>';
            angular.element("#dept_ID").parent().empty().append(html);
            $compile(angular.element("#dept_ID").parent().contents())($scope);
        });
        //学期
        $scope.semester = [];
        scheme_majorSchemeInfoManageService.getSemester(grade, function (error,message,data) {
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

        //查询参数
        $scope.courseParam = {
            dept_ID : "",
            courseNameOrCode : "",
            model_ID : model_ID,
            majorScheme_ID : majorScheme_ID
        }
        //添加参数
        $scope.courseInfo = {
            id:"",
            semester:"",
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

        $scope.majorCoursePlanAddTable = {
            //url: 'data_test/scheme/tableview_majorCoursePlanAdd.json',
            url: app.api.address + '/scheme/majorScheme/operationCourse',
            method: 'get',
            cache: false,
            height: 310,
            toolbar: '', //工具按钮用哪个容器
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
                        majorSchemeDemand_ID:majorSchemeDemand_ID,//专业方案要求id 模拟数据
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
                $compile(angular.element('#majorCoursePlanAddTable').contents())($scope);
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
            angular.element('#majorCoursePlanAddTable').bootstrapTable('selectPage', 1);
            //angular.element('#majorCoursePlanAddTable').bootstrapTable('refresh');
        }
        // 重置表单
        $scope.searchReset = function () {
            $scope.courseParam.dept_ID = "";
            $scope.courseParam.courseNameOrCode = "";
            angular.element('form[name="courseSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#majorCoursePlanAddTable').bootstrapTable('refresh');
        };
        $scope.ok = function (form) {
            var rows = angular.element('#majorCoursePlanAddTable').bootstrapTable('getSelections');
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
            scheme_majorSchemeInfoManageService.addCourse($scope.courseInfo,function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else {
                    angular.element('#majorCoursePlanEnter').bootstrapTable('refresh');
                    alertService('success', '添加成功');
                }
            });
        }
    }
    addCourseController.$inject = ['$rootScope', 'majorSchemeDemand_ID', 'model_ID', 'majorScheme_ID', 'grade', 'formVerifyService', 'app', '$compile', '$scope', '$uibModalInstance', 'scheme_majorSchemeInfoManageService', 'alertService'];

    var updateCourseController = function ($rootScope, formVerifyService, $compile, $scope, $uibModalInstance, item, grade, scheme_majorSchemeInfoManageService, alertService) {
        $scope.close = function () {
            $uibModalInstance.close();
        };
        $scope.semester = [];
        scheme_majorSchemeInfoManageService.getSemester(grade,function (error,message,data) {
            $scope.semester = data.data;
            var html = '' +
                '<select ui-select2  ui-chosen="codeCategorySearchForm.semester" '
                +  ' ng-model="courseInfo.semester" id="semester" ng-required="true" name="semester" ui-jq="chosen"ui-options="{search_contains: true}" ui-jq="chosen" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option  ng-repeat="a in semester" value="{{a.id}}">{{a.name}}</option> '
                +  '</select>';
            angular.element("#semester").parent().empty().append(html);
            $compile(angular.element("#semester").parent().contents())($scope);
        });
        $scope.courseInfo = {
            id : item.id,
            semester : item.semester,
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
            scheme_majorSchemeInfoManageService.update($scope.courseInfo,function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else {
                    angular.element('#majorCoursePlanEnter').bootstrapTable('refresh');
                    alertService('success', '修改成功');
                }
                $uibModalInstance.close();
            });
        }
    }
    updateCourseController.$inject = ['$rootScope', 'formVerifyService','$compile', '$scope', '$uibModalInstance', 'item', 'grade', 'scheme_majorSchemeInfoManageService', 'alertService'];

    var deleteController = function ($rootScope, formVerifyService, $compile, $scope, $uibModalInstance, scheme_majorSchemeInfoManageService, alertService, id) {
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {

            $rootScope.showLoading = true;
            scheme_majorSchemeInfoManageService.delete(id, function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else{
                    angular.element('#majorSchemeTable').bootstrapTable('refresh');
                   // alertService('success', '删除成功');
                }
                $uibModalInstance.close();
            });

        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    }
    deleteController.$inject = ['$rootScope', 'formVerifyService','$compile', '$scope', '$uibModalInstance', 'scheme_majorSchemeInfoManageService', 'alertService', 'id'];

    var deleteSchemeDemandController = function ($rootScope, formVerifyService, $compile, $scope, $uibModalInstance, scheme_majorSchemeInfoManageService, alertService, id, majorScheme_ID, pScope) {
        $scope.message = "删除模块同时会删除模块下课程计划，确定要删除吗？";
        $scope.ok = function () {

            $rootScope.showLoading = true;
            scheme_majorSchemeInfoManageService.deleteSchemeDemand(id,function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else{
                    scheme_majorSchemeInfoManageService.getTitle(majorScheme_ID,function (error,message,data) {
                        pScope.title = data;
                        pScope.schemeDemand.majorSchemeDemand_ID = data[0].majorSchemeDemand_ID;
                        pScope.schemeDemand.model_ID = data[0].id;
                        angular.element('#majorCoursePlanEnter').bootstrapTable('refresh');
                    });
                    angular.element('#majorSchemeInfoEdit').bootstrapTable('refresh');
                   // alertService('success', '删除成功');
                }
                $uibModalInstance.close();
            });

        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    }
    deleteSchemeDemandController.$inject = ['$rootScope', 'formVerifyService','$compile', '$scope', '$uibModalInstance', 'scheme_majorSchemeInfoManageService', 'alertService', 'id', 'majorScheme_ID', 'pScope'];

    var deleteCurriculaController = function ($rootScope, formVerifyService, $compile, $scope, $uibModalInstance, scheme_majorSchemeInfoManageService, alertService, id) {
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {

            $rootScope.showLoading = true; // 开启加载提示
            scheme_majorSchemeInfoManageService.deleteCurricula(id,function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else {
                    angular.element('#majorCoursePlanEnter').bootstrapTable('refresh');
                   // alertService('success', '删除成功');
                }
                $uibModalInstance.close();
            });

        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    }
    deleteCurriculaController.$inject = ['$rootScope', 'formVerifyService','$compile', '$scope', '$uibModalInstance', 'scheme_majorSchemeInfoManageService', 'alertService', 'id'];



})(window);
