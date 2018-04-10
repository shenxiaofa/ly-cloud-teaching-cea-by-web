/**
 * Created by Administrator on 2018/1/17.
 */
;(function (window, undefined) {
    'use strict';

    window.arrange_stuPhotoManageController = function ($compile, $scope, $uibModal, $rootScope, $window,$http, arrange_stuPhotoManageService, alertService, app) {
        //监听屏幕宽度改变搜索框的样式
        $scope.rightContentHeight = $(".right-content-search").height()+20-40;
        $scope.rightHeaderHeight = $(".header").height()+20;
        $scope.rightTableToolbarHeight = $("#stuPhoto_toolbar").height()+10;
        $scope.table_height = $window.innerHeight - ($scope.rightContentHeight+40+$scope.rightHeaderHeight+$scope.rightTableToolbarHeight);
        window.onresize = function(){
            $scope.rightContentHeight = $(".right-content-search").height()+20-40;
            $scope.rightHeaderHeight = $(".header").height()+20;
            $scope.rightTableToolbarHeight = $("#stuPhoto_toolbar").height()+10;
            $scope.table_height = $window.innerHeight - ($scope.rightContentHeight+40+$scope.rightHeaderHeight+$scope.rightTableToolbarHeight);
        };
        // 学生照片查询对象
        $scope.stuPhotoInfo = {};
        //初始化搜索数据
        initIndexSearch($scope, $window, $rootScope, app, $compile,$http, arrange_stuPhotoManageService, alertService);
        // 初始化表格
        initIndexTable($scope, $window, $rootScope, app, $compile, arrange_stuPhotoManageService, alertService);
        //导出数据
        /*$scope.listvalue = [];//
        //导出
        $scope.openExport = function () {
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/student/statusInfoManage/stuPhotoManage/export.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return $scope.stuPhotoInfo;
                    }
                },
                controller: openExportController
            });

            // $scope.listTitle = $scope.stuFlagManageTable.columns ; //
            // $scope.listTitleEnd = [];
            // var tbodys = [];
            // for(var i = 1; i < $scope.listTitle.length; i++) {
            //     if($scope.listTitle[i].title !="序号" && $scope.listTitle[i].title !="操作"){
            //         var tbody = {} ;
            //         $scope.listTitleEnd.push($scope.listTitle[i].title);
            //         var filed = $scope.listTitle[i].field;
            //         var title = $scope.listTitle[i].title;
            //         tbody[filed]= title;
            //         tbodys.push(tbody)
            //     }
            // }
            // var paramslist = {
            //     title: "单位信息",//表名
            //     thead: $scope.listTitleEnd,//弹出框按钮
            //     relationship:tbodys,//表头和实体关系
            //     param: $scope.searchListForm
            // }
            //
            // $timeout(function() {
            //     $rootScope.$broadcast('drillTable', paramslist);
            //     $('.showDrilltable').css('display', 'block');
            // }, 0);
        };*/
        // 打开照片上传面板
        $scope.photoUpload = function (row) {
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/student/statusInfoManage/stuPhotoManage/uploadImg.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return row;
                    }
                },
                controller: openPhotoUploadController
            });
        };
        // 打开查看照片面板
        $scope.photoSee = function (row) {
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/student/statusInfoManage/stuPhotoManage/photoView.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return row;
                    }
                },
                controller: openPhotoViewController
            });
        };
        // 打开批量上传照片面板
        $scope.btnUpload = function () {
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/student/statusInfoManage/stuPhotoManage/batchUpload.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return $scope.stuPhotoInfo;
                    }
                },
                controller: openBtnUploadController
            });
        };
        // 打开批量下载照片面板
        $scope.btnDownPic = function () {
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/student/statusInfoManage/stuPhotoManage/batchDown.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return $scope.stuPhotoInfo;
                    }
                },
                controller: openBtnDownController
            });
        };
    };
    arrange_stuPhotoManageController.$inject = ['$compile', '$scope', '$uibModal', '$rootScope', '$window', '$http','arrange_stuPhotoManageService', 'alertService', 'app'];


    // 照片上传控制器
    var openPhotoUploadController = function ($rootScope, $timeout, $compile, $scope, $uibModalInstance, item, arrange_stuPhotoManageService, alertService, formVerifyService, app) {
        // 初始化数据
        $scope.stuPhotoInfo = {
            stuNumber: item.stuNumber, // 学号
            stuName: item.stuName, // 姓名
            sexCode: item.sexCode, // 性别
            collegeNum: item.collegeNum,// 学院
            major: item.major// 专业
        };

        //图片预览开始
        $scope.startPhotoUrl = "/xx?photoType=1&stuNumber=" + item.stuNumber;
        $scope.endPhotoUrl = "/xx?photoType=2&stuNumber=" + item.stuNumber;

        $scope.change = function (photoType) {
            var read = new FileReader();
            if ('1' == photoType) {
                var file = document.getElementById("startPhotoFile");
                if (file != null && file.files != null && file.files != undefined && file.files.length != 0) {
                    var files = file.files[0];
                    if (files.type != "image/jpeg" && files.type != "image/jpg" && files.type != "image/png") {
                        $("#startPhotoMessage").html("请选择图片文件！");
                        return;
                    }
                    if (files.size >= 20480) {
                        $("#startPhotoMessage").html("文件大小超过20KB!");
                        return;
                    }
                    read.readAsDataURL(files);
                    read.onload = function () {
                        $("#startPhotoMessage").html(" ");
                        var url = read.result  // 拿到读取结果;
                        $("#startPhotoUrl").attr("src", url);
                        $("#saveStartButton").removeClass("picSaveHiden");
                        $("#saveStartButton").addClass("picSaveShow");
                    }
                }
            } else {
                var file = document.getElementById("endPhotoFile");
                if (file != null && file.files != null && file.files != undefined && file.files.length != 0) {
                    var files = file.files[0];
                    if (files.type != "image/jpeg" && files.type != "image/jpg" && files.type != "image/png") {
                        $("#endPhotoMessage").html("请选择图片文件 ");
                        return;
                    }
                    if (files.size >= 20480) {
                        $("#endPhotoMessage").html("文件大小超过20KB ");
                        return;
                    }
                    read.readAsDataURL(files);
                    read.onload = function () {
                        $("#endPhotoMessage").html(" ");
                        var url = read.result  // 拿到读取结果;
                        $("#endPhotoUrl").attr("src", url);
                        $("#saveEndButton").removeClass("picSaveHiden");
                        $("#saveEndButton").addClass("picSaveShow");
                    }
                }
            }
        }
        //图片预览结束

        $scope.ok = function (form) {
            // 处理前验证
            if (form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            }
            ;
            $rootScope.showLoading = true; // 开启加载提示
            /*arrange_stuPhotoManageService.update($scope.stuPhotoInfo, 'stuPhotoInfo:update', function (error, message) {
             $rootScope.showLoading = false; // 关闭加载提示
             if (error) {
             alertService(message);
             return;
             }
             $uibModalInstance.close();
             angular.element('#stuPhotoInfoTable').bootstrapTable('refresh');
             alertService('success', '修改成功');
             });*/
        };
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    };
    openPhotoUploadController.$inject = ['$rootScope', '$timeout', '$compile', '$scope', '$uibModalInstance', 'item', 'arrange_stuPhotoManageService', 'alertService', 'formVerifyService', 'app'];
    // 照片查看控制器
    var openPhotoViewController = function ($rootScope, $timeout, $compile, $scope, $uibModalInstance, item, arrange_stuPhotoManageService, alertService, formVerifyService, app) {
        // 初始化数据
        $scope.stuPhotoInfo = {
            stuNumber: item.stuNumber, // 学号
            stuName: item.stuName, // 姓名
            sexCode: item.sexCode, // 性别
            collegeNum: item.collegeNum,// 学院
            major: item.major// 专业
        };
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    };
    openPhotoViewController.$inject = ['$rootScope', '$timeout', '$compile', '$scope', '$uibModalInstance', 'item', 'arrange_stuPhotoManageService', 'alertService', 'formVerifyService', 'app'];
    // 批量上传照片控制器
    var openBtnUploadController = function ($rootScope, $timeout, $compile, $scope, $uibModalInstance, item, arrange_stuPhotoManageService, alertService, formVerifyService, app) {
        // 初始化数据
        $scope.stuPhotoInfo = {
            stuNumber: item.stuNumber, // 学号
            stuName: item.stuName, // 姓名
            sexCode: item.sexCode, // 性别
            collegeNum: item.collegeNum,// 学院
            major: item.major,// 专业
            photoNameType: '1',// 照片命名方式
            photoType: '1'// 照片类型
        };

        $scope.change = function () {
            var read = new FileReader();
            var file = document.getElementById("stuPhotoFile");
            if (file != null && file.files != null && file.files != undefined && file.files.length != 0) {
                var files = file.files[0];
                $("#imgText").html(files.name);
            }

        };
        //开始导入
        $scope.val = 0;
        $scope.valType = "info";
        $scope.reData = {};
        $scope.toUpload= function(){
            $scope.val = 0;
            var file = document.getElementById("stuPhotoFile");
            if(file == null || file.files == undefined || file.files.length == 0){
                $scope.message = '请先选择文件！';
                return ;
            }
            var files = file.files[0];
            var fileType = files.name.substring(files.name.lastIndexOf(".")+1).toLowerCase();
            if(fileType != 'zip' && fileType != 'jpeg' && fileType != 'jpg' && fileType != 'png'){
                // $("#message").html('请选择 jpeg、jpg、png、zip格式的文件！');
                $scope.message = '请选择 jpeg、jpg、png、zip格式的文件！';
                return ;
            }
            if(fileType == 'jpeg' || fileType == 'jpg' || fileType == 'png'){
                if(files.size > 20480){
                    // $("#message").html('请选择 jpeg、jpg、png、格式的文件大于20KB，请选择小于20KB的文件！');
                    $scope.message = '请选择 jpeg、jpg、png、格式的文件大于20KB，请选择小于20KB的文件！';
                    return ;
                };
            }
            $scope.message = '';
            // $("#message").html("");
           /* $scope.stuPhotoInfo.stuNum = '-1';
            Upload.upload({

                url: 'student-status/stu-photo/uploadStuPhoto',
                //上传的同时带的参数
                data: $scope.stuPhotoInfo,
                //上传的文件
                //file: $scope.stuPhotoInfo.stuPhotoFile
                //headers: { 'Content-Type': undefined }
                //transformRequest: angular.identity,
            }).progress(function (evt) {
                //进度条
                $scope.val = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function (data, status, headers, config) {
                $scope.valType = "success";
                //上传成功
                var dat = data.data;

                $scope.reData.totalNumber = dat.totalNumber;
                $scope.reData.successNumber = dat.successNumber;
                $scope.reData.failNumber = parseInt(dat.totalNumber)-parseInt(dat.successNumber);
                $scope.reData.message = "导入成功！";
                $scope.reData.beyondSizeList = [];
                $scope.reData.notStuNumberList = [];
                if(dat.status == "500"){
                    $scope.valType = "warning";
                    if(parseInt(dat.totalNumber) == $scope.reData.failNumber){
                        $scope.reData.message = "导入失败！";
                    }else{
                        $scope.reData.message = "导入部分成功！";
                    }
                    if(dat.beyondSizeList != null && dat.beyondSizeList != undefined){
                        $scope.reData.beyondSizeList = dat.beyondSizeList;
                    }
                    if(dat.notStuNumberList != null && dat.notStuNumberList != undefined){
                        $scope.reData.notStuNumberList = dat.notStuNumberList;
                    }
                }

            }).error(function (data, status, headers, config) {
                //上传失败
                $scope.valType = "danger";
                console.log('error status: ' + status);

                if('51005102' == data.code){
                    $scope.reData.message = "存在子文件夹！";
                }else if('51005101' == data.code){101
                    $scope.reData.message = "空文件异常！";
                }
            });*/
        };


        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    };
    openBtnUploadController.$inject = ['$rootScope', '$timeout', '$compile', '$scope', '$uibModalInstance', 'item', 'arrange_stuPhotoManageService', 'alertService', 'formVerifyService', 'app'];
    // 批量下载照片控制器
    var openBtnDownController = function ($rootScope, $timeout, $compile, $scope, $uibModalInstance,$http, item, arrange_stuPhotoManageService, alertService, formVerifyService, app) {
        // 初始化数据
        $scope.stuPhotoInfoBatchDown  = {
            stuNumber: item.stuNumber, // 学号
            stuName: item.stuName, // 姓名
            sexCode: item.sexCode, // 性别
            collegeNum: item.collegeNum,// 学院
            major: item.major,// 专业
            photoType: '1'// 照片类型
        };
        //查询学院数据
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_college.json",
        }).then(function (response) {
            $scope.collegeNumList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询年级数据
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_college.json",
        }).then(function (response) {
            $scope.gradeList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        $scope.down = function (stuPhotoInfoBatchDown_form) {
            // 处理前验证
            if(stuPhotoInfoBatchDown_form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(stuPhotoInfoBatchDown_form);
                return;
            };
            $rootScope.showLoading = true; // 开启加载提示
           // arrange_stuPhotoManageService.add($scope.stuPhotoInfo, 'stuPhotoInfo:down', function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
           //      if (error) {
           //          alertService(message);
           //          return;
           //      }
                $uibModalInstance.close();
                // angular.element('#stuPhotoManageTable').bootstrapTable('refresh');
                alertService('success', '下载成功');
           //  });
        };
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    };
    openBtnDownController.$inject = ['$rootScope', '$timeout', '$compile', '$scope', '$uibModalInstance','$http', 'item', 'arrange_stuPhotoManageService', 'alertService', 'formVerifyService', 'app'];

    // 导出控制器
    /*var openExportController = function ($rootScope, $timeout, $compile, $scope, $uibModalInstance, item, arrange_stuPhotoManageService, alertService, formVerifyService, app) {
     var isCheckAll = false;
     $scope.afterSelectAll = function () {
     if (isCheckAll) {
     $("input[name='afterFruit']").each(function () {
     this.checked = false;
     });
     isCheckAll = false;
     } else {
     $("input[name='afterFruit']").each(function () {
     this.checked = true;
     });
     isCheckAll = true;
     }
     };
     $scope.afterReport = function () {
     var header = [];
     var tbody = [];
     var index = 0;
     var obj = document.getElementsByName("afterFruit");
     var check_val = [];
     for (var i = 0; i < obj.length; i++) {
     if (obj[i].checked)
     check_val.push(obj[i].value);
     }
     if (check_val.length > 0) {
     header = check_val;
     } else {
     alertService("error", '至少选中一个字段,才能导出');
     // modalFactory.openAlert({message:'至少选中一个字段,才能导出',scope: $scope});
     return;
     }
     // var excel = {
     //     name : $scope.data.title,
     //     thead : header,
     //     relationship:$scope.data.relationship,//表头和实体关系
     //     param : $scope.data.param //条件查询参数
     // }
     // $rootScope.$broadcast('to-excel', excel);
     }
     // $scope.listTitle = $scope.stuFlagManageTable.columns ; //
     // $scope.listTitleEnd = [];
     // var tbodys = [];
     // for(var i = 1; i < $scope.listTitle.length; i++) {
     //     if($scope.listTitle[i].title !="序号" && $scope.listTitle[i].title !="操作"){
     //         var tbody = {} ;
     //         $scope.listTitleEnd.push($scope.listTitle[i].title);
     //         var filed = $scope.listTitle[i].field;
     //         var title = $scope.listTitle[i].title;
     //         tbody[filed]= title;
     //         tbodys.push(tbody)
     //     }
     // }
     // var paramslist = {
     //     title: "单位信息",//表名
     //     thead: $scope.listTitleEnd,//弹出框按钮
     //     relationship:tbodys,//表头和实体关系
     //     param: $scope.searchListForm
     // };
     //
     // $timeout(function() {
     //     $rootScope.$broadcast('drillTable', paramslist);
     //     $('.showDrilltable').css('display', 'block');
     // }, 0);
     $scope.cancel = function () {
     $uibModalInstance.close();
     };
     };
     openExportController.$inject = ['$rootScope', '$timeout', '$compile', '$scope', '$uibModalInstance', 'item', 'arrange_stuPhotoManageService', 'alertService', 'formVerifyService', 'app'];
     */

    //初始化搜索数据
    var initIndexSearch = function($scope, $window, $rootScope, app, $compile,$http, arrange_stuPhotoManageService, alertService){

        //查询性别数据
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_sex.json",
        }).then(function (response) {
            $scope.sexList = response.data.data.list;//性别

        }, function (response) {
            console.log(response);
        });
        //查询学院数据
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_college.json",
        }).then(function (response) {
            $scope.collegeNumList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询专业方向数据
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_profession.json",
        }).then(function (response) {
            $scope.majorEntityList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询年 级数据
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_grade.json",
        }).then(function (response) {
            $scope.gradeList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询年级专业方向数据
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_gradleProfession.json",
        }).then(function (response) {
            $scope.gradeDirectionEntityList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询班 级数据
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_class.json",
        }).then(function (response) {
            $scope.classNameList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询当前校区数据
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_schoolArea.json",
        }).then(function (response) {
            $scope.campusList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询入学方式
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_atSchoolStatus.json",
        }).then(function (response) {
            $scope.enterWayList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
    };
    // 初始化表格
    var initIndexTable = function ($scope, $window, $rootScope, app, $compile, arrange_stuPhotoManageService, alertService) {
        // 表格的高度
        // $scope.table_height = $window.innerHeight - 264;
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNum: params.pageNumber  //页码
            };
            // 去除为 null 或 "" 值的查询字段
            var stuPhotoInfoQuery = {};
            angular.forEach($scope.stuPhotoInfo, function (data, index, array) {
                if (data) {
                    stuPhotoInfoQuery[index] = data;
                }
            });
            $rootScope.$log.debug(angular.extend(pageParam, stuPhotoInfoQuery));
            return angular.extend(pageParam, stuPhotoInfoQuery);
        };
        $scope.stuPhotoManageTable = {
            url: 'data_test/student/tableview_stuPhotoInfo.json',
            // url: app.api.address + '/system/stuPhotoInfo',
            headers: {
                permission: "stuPhotoInfo:query"
            },
            method: 'get',
            cache: false,
            height: $scope.table_height,
            toolbar: '#stuPhoto_toolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber: 1,
            pageList: [10, 20, 30, 50, 100], // 设置可供选择的页面数据条数
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            sortName: 'stuNumber', // 默认排序字段
            sortOrder: 'asc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            sortable: false, // 禁用排序
            idField: "stuNumber", // 指定主键列
            uniqueId: "stuNumber", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParams,//传递参数（*）
            search: false,
            showColumns: true,
            showRefresh: true,
            responseHandler: function (response) {
                return {
                    total: response.data.total,
                    rows: response.data.list
                };
            },
            onLoadSuccess: function () {
                $compile(angular.element('#stuPhotoManageTable').contents())($scope);
            },
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#stuPhotoManageTable').contents())($scope);
            },
            columns: [
                {checkbox: true, width: "3%"},
                {
                    field: "",
                    title: "序号",
                    align: "center",
                    valign: "middle",
                    width: "5%",
                    formatter: function (value, row, index) {
                        return index + 1;
                    }
                },
                {field: "exaNumber", title: '考生号', align: "center", valign: "middle"},
                {field: "stuNumber", title: '学号', align: "center", valign: "middle"},
                {field: "stuName", title: '姓名', align: "center", valign: "middle"},
                {field: "sexCode", title: '性别', align: "center", valign: "middle"},
                {field: "campus", title: '校区', align: "center", valign: "middle"},
                {field: "collegeNum", title: '学院', align: "center", valign: "middle"},
                {field: "grade", title: '年级', align: "center", valign: "middle"},
                {field: "major", title: '专业方向', align: "center", valign: "middle"},
                {field: "gradeDirection", title: '年级专业方向', align: "center", valign: "middle"},
                {field: "className", title: '班级', align: "center", valign: "middle"},
                {field: "enterWay", title: '入学方式', align: "center", valign: "middle"},
                {
                    field: "startPhotoStatus",
                    title: '有无入学照片',
                    align: "center",
                    valign: "middle",
                    formatter: function (value, row, index) {
                        if (value == 1) {
                            return "有";
                        } else if (value == 0) {
                            return "无";
                        }
                    }
                },
                {
                    field: "endPhotoStatus",
                    title: '有无毕业照片',
                    align: "center",
                    valign: "middle",
                    formatter: function (value, row, index) {
                        if (value == 1) {
                            return "有";
                        } else if (value == 0) {
                            return "无";
                        }
                    }
                },
                {
                    field: "operate", title: '操作', align: "center", valign: "middle",
                    formatter: function (value, row, index) {
                        var modifyBtn = "<button has-permission='stuPhotoInfo:update' type='button' class='btn  btn-default' ng-click='photoSee(" + angular.toJson(row) + ")'>照片查看</button>";
                        var deleteBtn = "<button has-permission='stuPhotoInfo:update' type='button' class='btn  btn-default ' ng-click='photoUpload(" + angular.toJson(row) + ")'>照片上传</button>";
                        return modifyBtn + "&nbsp;" + deleteBtn;
                    }
                }
            ]
        };
        // 查询表单显示和隐藏切换
        $scope.isHideSearchForm = false; // 默认显示
        $scope.searchFormHideToggle = function () {
            $scope.isHideSearchForm = !$scope.isHideSearchForm
            if ($scope.isHideSearchForm) {
                $scope.table_height = $scope.table_height +  $scope.rightContentHeight;
            } else {
                $scope.table_height = $scope.table_height -  $scope.rightContentHeight;
            }
            angular.element('#stuPhotoManageTable').bootstrapTable('resetView', {height: $scope.table_height});
        }
        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#stuPhotoManageTable').bootstrapTable('selectPage', 1);
        }
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.stuPhotoInfo = {};
            // 重新初始化下拉框
            angular.element('form[name="stuPhotoManageSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#stuPhotoManageTable').bootstrapTable('selectPage', 1);
        }
    }

})(window);
