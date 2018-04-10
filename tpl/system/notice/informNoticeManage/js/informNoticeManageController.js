/**
 * Created by Administrator on 2018/1/11.
 */
;(function (window, undefined) {
    'use strict';

    window.system_informNoticeManageController = function ($compile, $scope, $uibModal, $rootScope, $window, FileUploader, system_informNoticeManageService,system_noticeTypeManageService, alertService, app) {
        // 公告类型查询对象
        $scope.informNotice = {};
        // 初始化表格
        initIndexTable($scope, $window, $rootScope, app, $compile, system_informNoticeManageService,system_noticeTypeManageService, alertService);
        // 打开新增面板
        $scope.openAdd = function(){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/system/notice/informNoticeManage/add.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return $scope.informNotice;
                    }
                },
                controller: openAddController
            });
        };
        // 打开修改面板
        $scope.openModify = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/system/notice/informNoticeManage/modify.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return row;
                    }
                },
                controller: openModifyController
            });
        };
        // 打开删除面板
        $scope.openDelete = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/system/notice/informNoticeManage/delete.html',
                size: '',
                resolve: {
                    item: function () {
                        return row;
                    }
                },
                controller: openDeleteController
            });
        };
        // 打开模块设置删除面板
        $scope.batchOpenDelete = function(){
            var rows = angular.element('#informNoticeTable').bootstrapTable('getSelections');
            if(rows.length == 0){
                alertService('请先选择要删除的项');
                return;
            }
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/system/notice/informNoticeManage/delete.html',
                size: '',
                resolve: {
                    items: function () {
                        return rows;
                    },
                },
                controller: openBatchDeleteController
            });
        };
    };
    system_informNoticeManageController.$inject = ['$compile', '$scope', '$uibModal', '$rootScope', '$window','FileUploader', 'system_informNoticeManageService','system_noticeTypeManageService', 'alertService', 'app'];

    // 添加控制器
    var openAddController = function ($rootScope, $compile, $scope, $uibModalInstance, $uibModal, FileUploader,$filter, system_informNoticeManageService,system_noticeTypeManageService,system_departmentManageService, system_userManageService, system_roleManageService, formVerifyService, alertService, app) {
        // 初始化数据
        $scope.informNotice = {
            noticeName:'',//通知公告名称
            noticeTypeId: '', // 公告类型id
            topSign:'1',//是否置顶
            scopeControlSign:'1',//是否控制范围
            noticeUserRangeIds:[],//用户范围
            noticeDeptRangeIds:[],//部门范围
            noticeRoleRangeIds:[],//角色范围
            status:'1',//发布状态
            validDate:'',//有效日期
            pushSign:'1',//是否发送消息
            pushWay:{
                wechat:'',//微信
                message:'',//短信
                inTimeMessage:''//及时通讯
            },//发送渠道
            content:'',//公告内容
            fujian:'',//附件
            noticeFileDTO:[],
            selecteds: []
        };
        // 初始化查询公告类型
        $scope.noticeTypeNameData = [
            {
                noticeTypeId: '',
                noticeTypeName: '== 请选择 =='
            }
        ];
        // 有效日期参数配置
        $scope.validDateOptions = {
            opened: false,
            open: function() {
                $scope.validDateOptions.opened = true;
            }
        };
        system_noticeTypeManageService.findNoticeType({pageNum: 1, pageSize: 0},'noticeType:query', function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            };
            if (data && data.length > 0) {
                $scope.noticeTypeNameData = $scope.noticeTypeNameData.concat(data);
            };
            var html = '' +
                '<select ng-model="informNotice.noticeTypeId" ui-chosen="informNoticeAddForm.noticeTypeId" ng-required="true" id="noticeTypeId_add" name="noticeTypeId" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">'+
                '<option ng-repeat="noticeTypeNameItem in noticeTypeNameData" value="{{noticeTypeNameItem.noticeTypeId}}">{{noticeTypeNameItem.noticeTypeName}}</option>'+
                '</select>';
            angular.element("#noticeTypeId_add").parent().empty().append(html);
            $compile(angular.element("#noticeTypeId_add").parent().contents())($scope);
        });

        // 初始化查询用戶范围选择器
        $scope.selectBmgly = function () {
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/system/notice/informNoticeManage/selector.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return $scope.informNotice;
                    }
                },
                controller: system_userSelectMutipleController
            });
        }

        // 初始化查询部门范围
       $scope.noticeDeptRangeData = [
            {
                dwh:'',//noticeUserRangeId部门id数组
                dwmc:'== 请选择 =='//noticeUserRangeName部门名
            }
       ];
        system_departmentManageService.findDepartment({pageNum: 1, pageSize: 0}, 'department:query',function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            };
            if (data && data.length > 0) {
                $scope.noticeDeptRangeData = $scope.noticeDeptRangeData.concat(data);
            };
            var html = '' +
                '<select multiple    ng-model="informNotice.noticeDeptRangeIds" ui-chosen="informNoticeAddForm.noticeDeptRangeIds"  id="noticeDeptRangeIds_select" name="noticeDeptRangeIds" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">'+
                '<option ng-repeat="noticeDeptRangeItem in noticeDeptRangeData" value="{{noticeDeptRangeItem.dwh}}">{{noticeDeptRangeItem.dwmc}}</option>'+
                '</select>';
            angular.element("#noticeDeptRangeIds_select").parent().empty().append(html);
            $compile(angular.element("#noticeDeptRangeIds_select").parent().contents())($scope);
        });
        // 初始化查询角色范围
        $scope.noticeRoleRangeData = [
            {
                jsbh:'',//noticeUserRangeId部门id数组
                mc:'== 请选择 =='//noticeUserRangeName部门名
            }
        ];
        system_roleManageService.findRole({pageNum: 1, pageSize: 0 ,zt: "1"},'role:query', function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            };
            if (data && data.length > 0) {
                $scope.noticeRoleRangeData = $scope.noticeRoleRangeData.concat(data);
            };
            var html = '' +
                '<select multiple    ng-model="informNotice.noticeRoleRangeIds" ui-chosen="informNoticeAddForm.noticeRoleRangeIds"  id="noticeRoleRangeIds_select" name="noticeRoleRangeIds" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">'+
                '<option ng-repeat="noticeRoleRangeItem in noticeRoleRangeData" value="{{noticeRoleRangeItem.jsbh}}">{{noticeRoleRangeItem.mc}}</option>'+
                '</select>';
            angular.element("#noticeRoleRangeIds_select").parent().empty().append(html);
            $compile(angular.element("#noticeRoleRangeIds_select").parent().contents())($scope);
        });

        $scope.ok = function (form) {
            angular.forEach($scope.informNotice.selecteds, function(data, index, array){
                $scope.informNotice.noticeUserRangeIds.push(data.id);
            });
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            $rootScope.showLoading = true; // 开启加载提示
            //处理请求前的参数数据
            postParamDataDeal($scope);
            system_informNoticeManageService.add($scope.informNotice, 'informNotice:insert', function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                angular.element('#informNoticeTable').bootstrapTable('refresh');
                alertService('success', '新增成功');
            });
        };


        /*************************上传附件开始*******************************/

        // 上传附件【文件】
        $scope.uploader = new FileUploader({
            url: app.api.address + '/system/informNotice/uploadAttachment'
        });
        $scope.uploader.onAfterAddingFile = function(fileItem) {
            fileItem.upload();
        };
        $scope.uploader.onErrorItem = function(fileItem, response, status, headers) {
            alertService(response.meta.message);
        };
        $scope.fileIds=[];
        $scope.fileDTO = [];
        $scope.uploader.onCompleteItem = function(fileItem, response, status, headers) {
            if (response.meta.success) {
                // 获取 fileId
                $scope.fileId = response.data;
                console.log("fileId = " + $scope.fileId);
                $scope.fileIds.push($scope.fileId );
                console.log("fileIds = " + $scope.fileIds);

                //生成一个附件对象
                var thisFileName = '';
                var thisFileSize = '';
                console.log("xx:"+$scope.uploader.queue);
                angular.forEach($scope.uploader.queue, function(data, index, array){
                    thisFileName = data.file.name;
                    // thisFileSize = data.file.size/1024/1024|number:2;
                    thisFileSize = $filter('number')(data.file.size/1024/1024 , 2);
                });
                var fileObj = {
                    annexId: $scope.fileId,//附件id
                    annexName:thisFileName,//附件名称
                    annexSize:thisFileSize//附件大小,以MB计算
                };
                $scope.fileDTO.push( fileObj);
                $scope.informNotice.noticeFileDTO = $scope.fileDTO;
                console.log($scope.fileDTO );
            } else {
                alertService(response.meta.message);
            }
        };
        // 删除上传文件
        $scope.deleteAttachment = function (index) {
            var fileId = $scope.fileIds[index];
            console.log( fileId );
            system_informNoticeManageService.deleteAttachment(fileId, 'informNoticeManage:delete', function (error, message) {
                if (error) {
                    alertService(message);
                    return;
                }
            });
            $scope.uploader.queue.splice(index, 1);
            //$index包含了ng-repeat过程中的循环计数
            $scope.fileIds.splice(index, 1);
            $scope.informNotice.noticeFileDTO.splice(index,1);
            console.log( $scope.informNotice.noticeFileDTO );
        }

        /*************************上传附件结束*******************************/
        // 关闭窗口时删除文件
        $scope.close = function ( ) {
            angular.forEach($scope.fileIds, function(data, index, array) {
                var fileId = data;
                if (fileId != null) {
                    // 删除上传文件
                    system_informNoticeManageService.deleteAttachment(fileId, 'informNoticeManage:delete', function (error, message) {
                        if (error) {
                            alertService(message);
                            return;
                        }
                        ;
                    });
                }
            });
            $uibModalInstance.close();
        };
    };
    openAddController.$inject = ['$rootScope', '$compile', '$scope', '$uibModalInstance', '$uibModal','FileUploader','$filter', 'system_informNoticeManageService','system_noticeTypeManageService','system_departmentManageService', 'system_userManageService', 'system_roleManageService', 'formVerifyService', 'alertService', 'app'];
    // 修改控制器
    var openModifyController = function ($rootScope, $timeout, $compile, $scope, $uibModalInstance, $uibModal,item, FileUploader,$filter,system_informNoticeManageService, system_noticeTypeManageService,system_departmentManageService, system_userManageService, system_roleManageService, alertService, formVerifyService, app) {

        $scope.informNotic={
            noticeFileDTO:[]
        };
        // 有效日期参数配置
        $scope.validDateOptions = {
            opened: false,
            open: function() {
                $scope.validDateOptions.opened = true;
            }
        };
        // 初始化下拉框数据
        initAddAndModifyMetaData($scope, $uibModal,system_informNoticeManageService, system_noticeTypeManageService,system_departmentManageService, system_userManageService, system_roleManageService, item, alertService, $compile);
        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            $rootScope.showLoading = true; // 开启加载提示
            //处理请求前的参数数据
            postParamDataDeal($scope);
            $scope.informNotice.noticeUserRangeIds = [];
            angular.forEach($scope.informNotice.selecteds, function(data, index, array){
                $scope.informNotice.noticeUserRangeIds.push(data.id);
            });
            system_informNoticeManageService.update($scope.informNotice, 'informNotice:update', function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                angular.element('#informNoticeTable').bootstrapTable('refresh');
                alertService('success', '修改成功');
            });
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
        /*************************上传附件开始*******************************/

        // 上传附件【文件】
        $scope.uploader =  new FileUploader({
             url: app.api.address + '/system/informNotice/uploadAttachment'
        });
        $scope.uploader.queue=[];
        $scope.fileIds=[];

        angular.forEach(item.noticeFileDTO, function(data, index, array){
            var fileQueue ={
                file:{
                    name:data.annexName,
                    size:1024*1024*1024
                },
                progress:100,
                isSuccess: true
            };
            $scope.uploader.queue.push( fileQueue);
            $scope.fileIds.push( data.annexId);
            console.log( $scope.uploader.queue );
        });
       //
       // $scope.uploader = new FileUploader({
       //      url: app.api.address + '/system/informNotice/uploadAttachment'
       //  });
        $scope.uploader.onAfterAddingFile = function(fileItem) {
            fileItem.upload();
        };
        $scope.uploader.onErrorItem = function(fileItem, response, status, headers) {
            alertService(response.meta.message);
        };

        $scope.fileDTO = [];
        $scope.uploader.onCompleteItem = function(fileItem, response, status, headers) {
            if (response.meta.success) {
                // 获取 fileId
                $scope.fileId = response.data;
                console.log("fileId = " + $scope.fileId);
                $scope.fileIds.push($scope.fileId );
                console.log("fileIds = " + $scope.fileIds);

                //生成一个附件对象
                var thisFileName = '';
                var thisFileSize = '';
                angular.forEach($scope.uploader.queue, function(data, index, array){
                    thisFileName = data.file.name;
                    // thisFileSize = data.file.size/1024/1024|number:2;
                    thisFileSize = $filter('number')(data.file.size/1024/1024 , 2);

                    console.log("添加了新的上传文件："+$scope.uploader.queue.file );
                });
                console.log("添加了新的上传："+$scope.uploader.queue );
                var fileObj = {
                    annexId: $scope.fileId,//附件id
                    annexName:thisFileName,//附件名称
                    annexSize:thisFileSize//附件大小,以MB计算
                };
                $scope.fileDTO.push( fileObj);
                $scope.informNotice.noticeFileDTO = $scope.fileDTO;
                console.log($scope.fileDTO );
            } else {
                alertService(response.meta.message);
            }
        };
        // 删除上传文件
        $scope.deleteAttachment = function (index) {
            var fileId = $scope.fileIds[index];
            console.log( fileId );
            system_informNoticeManageService.deleteAttachment(fileId, 'informNoticeManage:delete', function (error, message) {
                if (error) {
                    alertService(message);
                    return;
                }
            });
            $scope.uploader.queue.splice(index, 1);
            //$index包含了ng-repeat过程中的循环计数
            $scope.fileIds.splice(index, 1);
            $scope.informNotice.noticeFileDTO.splice(index,1);
            console.log( $scope.informNotice.noticeFileDTO );
        }

        /*************************上传附件结束*******************************/
    };
    openModifyController.$inject = ['$rootScope', '$timeout', '$compile', '$scope', '$uibModalInstance','$uibModal', 'item','FileUploader','$filter', 'system_informNoticeManageService', 'system_noticeTypeManageService','system_departmentManageService', 'system_userManageService', 'system_roleManageService', 'alertService', 'formVerifyService', 'app'];
    // 批量删除控制器
    var openBatchDeleteController = function ($rootScope, $scope, $uibModalInstance, items, system_informNoticeManageService, alertService) {
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {
            var noticeIds = [];
            items.forEach (function(informNotice) {
                noticeIds.push(informNotice.noticeId);
            });
            $rootScope.showLoading = true;
            system_informNoticeManageService.delete(noticeIds,'noticeType:delete', function (error, message) {
                $rootScope.showLoading = false;
                if (error) {
                    alertService(message);
                    return;
                }else{
                    angular.element('#informNoticeTable').bootstrapTable('refresh');
                    angular.element('#informNoticeTable').bootstrapTable('refresh');
                    // alertService('success', '删除成功');
                }
                $uibModalInstance.close();

            });
            $uibModalInstance.close();
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openBatchDeleteController.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'items', 'system_informNoticeManageService', 'alertService'];
    // 删除控制器
    var openDeleteController = function ($rootScope, $scope, $uibModalInstance, item, system_informNoticeManageService, alertService) {
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {
            $rootScope.showLoading = true; // 开启加载提示
            var noticeIds = [];
            noticeIds.push(item.noticeId);
           system_informNoticeManageService.delete(noticeIds, 'noticeType:delete', function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#informNoticeTable').bootstrapTable('refresh');
                alertService('success', '删除成功');
            });
            $uibModalInstance.close();
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openDeleteController.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'item', 'system_informNoticeManageService', 'alertService'];

    // 初始化添加和修改面板下拉框数据
    var initAddAndModifyMetaData = function ($scope, $uibModal,system_informNoticeManageService, system_noticeTypeManageService,system_departmentManageService, system_userManageService, system_roleManageService, item, alertService, $compile){
        var noticeDeptRangeIds = [];
        angular.forEach(item.noticeDeptRangeDTO, function(data, index, array){
            noticeDeptRangeIds.push(data.deptId);
        });
        var noticeRoleRangeIds = [];
        angular.forEach(item.noticeRoleRangeDTO, function(data, index, array){
            noticeRoleRangeIds.push(data.roseId);
        });
        var noticeUserRangeIds = [];
        angular.forEach(item.noticeUserRangeDTO, function(data, index, array){
            noticeUserRangeIds.push(data.userId);
        });
        var noticeUserRangeObjs = [];
        angular.forEach(item.noticeUserRangeDTO, function(data, index, array){
            var userObj={
                'id':data.userId,
                'mc':data.userName
            };
            noticeUserRangeObjs.push(userObj);
        });
        // 初始化查询公告类型
        $scope.noticeTypeNameData = [
            {
                noticeTypeId: '',
                noticeTypeName: '== 请选择 =='
            }
        ];
        system_noticeTypeManageService.findNoticeType({pageNum: 1, pageSize: 0},'noticeType:query', function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            };
            if (data && data.length > 0) {
                $scope.noticeTypeNameData = $scope.noticeTypeNameData.concat(data);
            };
            var html = '' +
                '<select ng-model="informNotice.noticeTypeId" ui-chosen="informNoticeAddForm.noticeTypeId" ng-required="true" id="noticeTypeId_edit" name="noticeTypeId" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">'+
                '<option ng-repeat="noticeTypeNameItem in noticeTypeNameData" value="{{noticeTypeNameItem.noticeTypeId}}">{{noticeTypeNameItem.noticeTypeName}}</option>'+
                '</select>';
            angular.element("#noticeTypeId_edit").parent().empty().append(html);
            $compile(angular.element("#noticeTypeId_edit").parent().contents())($scope);
        });

        // 初始化查询用戶范围
        /* $scope.noticeUserRangeData = [];
         system_userManageService.findUser({pageNum: 1, pageSize: 0},'user:query', function (error, message, data) {
             angular.forEach(data, function(data, index, array){
                 var deptObj = {
                     'userId':data.yhbh,
                     'userName':data.xm
                 };
                 $scope.noticeUserRangeData.push(deptObj);
             });
         if (error) {
         alertService(message);
         return;
         };
         var html = '' +
         '<select multiple    ng-model="informNotice.noticeUserRangeIds" ui-chosen="informNoticeAddForm.noticeUserRangeIds"  id="noticeUserRangeIds_select" name="noticeUserRangeIds" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">'+
         '<option ng-repeat="noticeUserRangeItem in noticeUserRangeData" value="{{noticeUserRangeItem.userId}}">{{noticeUserRangeItem.userName}}</option>'+
         '</select>';
         angular.element("#noticeUserRangeIds_select").parent().empty().append(html);
         $compile(angular.element("#noticeUserRangeIds_select").parent().contents())($scope);
         });*/
        // 初始化查询用戶范围选择器
        $scope.selectBmgly = function () {
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/system/notice/informNoticeManage/selector.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return $scope.informNotice;
                    }
                },
                controller: system_userSelectMutipleController
            });
        }
        // 初始化查询部门范围
        $scope.noticeDeptRangeData = [];
        system_departmentManageService.findDepartment({pageNum: 1, pageSize: 0}, 'department:query',function (error, message, data) {
            angular.forEach(data, function(data, index, array){
                var deptObj = {
                    'deptId':data.dwh,
                    'deptName':data.dwmc
                };
                $scope.noticeDeptRangeData.push(deptObj);
            });
            if (error) {
                alertService(message);
                return;
            };
            var html = '' +
                '<select ui-select2  multiple ui-chosen="informNoticeModifyForm.noticeDeptRangeIds"   '
                +  ' ng-model="informNotice.noticeDeptRangeIds" id="noticeDeptRangeIds_select" name="noticeDeptRangeIds" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option  ng-repeat="noticeDeptRangeItem in noticeDeptRangeData" value="{{noticeDeptRangeItem.deptId}}">{{noticeDeptRangeItem.deptName}}</option> '
                +  '</select>';
            angular.element("#noticeDeptRangeIds_select").parent().empty().append(html);
            $compile(angular.element("#noticeDeptRangeIds_select").parent().contents())($scope);
        });
        // 初始化查询角色范围
        $scope.noticeRoleRangeData = [];
        system_roleManageService.findRole({pageNum: 1, pageSize: 0 ,zt: "1"},'role:query', function (error, message, data) {
            angular.forEach(data, function(data, index, array){
                var deptObj = {
                    'roseId':data.jsbh,
                    'roleName':data.mc
                };
                $scope.noticeRoleRangeData.push(deptObj);
            });
            if (error) {
                alertService(message);
                return;
            };
            var html = '' +
                '<select multiple    ng-model="informNotice.noticeRoleRangeIds" ui-chosen="informNoticeModifyForm.noticeRoleRangeIds"  id="noticeRoleRangeIds_select" name="noticeRoleRangeIds" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">'+
                '<option ng-repeat="noticeRoleRangeItem in noticeRoleRangeData" value="{{noticeRoleRangeItem.roseId}}">{{noticeRoleRangeItem.roleName}}</option>'+
                '</select>';
            angular.element("#noticeRoleRangeIds_select").parent().empty().append(html);
            $compile(angular.element("#noticeRoleRangeIds_select").parent().contents())($scope);
        });

        // 初始化数据
        $scope.informNotice = {
            noticeId:item.noticeId,
            noticeName:item.noticeName,//通知公告名称
            noticeTypeId: item.noticeTypeId, // 公告类型id
            noticeTypeName:item.noticeTypeName,
            topSign:item.topSign==1?'1':'0',//是否置顶
            scopeControlSign:item.scopeControlSign==1?'1':'0',//是否控制范围
            noticeUserRangeIds:noticeUserRangeIds,//用户范围
            noticeDeptRangeIds:noticeDeptRangeIds,//部门范围
            noticeRoleRangeIds:noticeRoleRangeIds,//角色范围
            status:item.status==1?'1':'0',//发布状态
            validDate:item.validDate == null ?'':new Date(item.validDate),//有效日期
            pushSign:item.pushSign==1?'1':'0',//是否发送消息
            pushWay:{
                wechat:new RegExp('wechat').test(item.pushWay)==true?true:'',//微信
                message:new RegExp('message').test(item.pushWay)==true?true:'',//短信
                inTimeMessage:new RegExp('inTimeMessage').test(item.pushWay)==true?true:''//及时通讯
            },//发送渠道
            content:item.content,//公告内容
            fujian:item.fujian,//附件
            selecteds:noticeUserRangeObjs
        };

    }
    //处理请求前的参数数据
    var postParamDataDeal = function ($scope) {

        var topSign = $scope.informNotice.topSign;
        var scopeControlSign = $scope.informNotice.scopeControlSign;
        var status = $scope.informNotice.status;
        var pushSign = $scope.informNotice.pushSign;
        var pushWay = $scope.informNotice.pushWay;
        var edit_pushWay = "";
        if(topSign=="0"){
            $scope.informNotice.topSign = 0;
        }else{
            $scope.informNotice.topSign = 1;
        }
        if(scopeControlSign=="0"){
            $scope.informNotice.scopeControlSign = 0;
        }else{
            $scope.informNotice.scopeControlSign = 1;
        }
        if(status=="0"){
            $scope.informNotice.status = 0;
        }else{
            $scope.informNotice.status = 1;
        }
        if(pushSign=="0"){
            $scope.informNotice.pushSign = 0;
        }else{
            $scope.informNotice.pushSign = 1;
        }
        if( pushWay.wechat==true){
            edit_pushWay = "wechat,";
        }
        if( pushWay.message==true){
            edit_pushWay = edit_pushWay+"message,";
        }
        if( pushWay.inTimeMessage==true){
            edit_pushWay = edit_pushWay+"inTimeMessage,";
        }
        $scope.informNotice.pushWay = edit_pushWay.substring(0,edit_pushWay.lastIndexOf(","));

    }
    // 初始化表格
    var initIndexTable = function ($scope, $window, $rootScope, app, $compile, system_informNoticeManageService,system_noticeTypeManageService, alertService) {
        // 初始化查询公告类型
        $scope.noticeTypeNameData = [
            {
                noticeTypeId: '',
                noticeTypeName: '== 请选择 =='
            }
        ];
        system_noticeTypeManageService.findNoticeType({pageNum: 1, pageSize: 0},'noticeType:query', function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            };
            if (data && data.length > 0) {
                $scope.noticeTypeNameData = $scope.noticeTypeNameData.concat(data);
            };
            var html = '' +
                '<select ng-model="informNotice.noticeTypeId" ui-chosen="informNoticeSearchForm.noticeTypeId"  id="noticeTypeId_select" name="noticeTypeId" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">'+
                '<option ng-repeat="noticeTypeNameItem in noticeTypeNameData" value="{{noticeTypeNameItem.noticeTypeId}}">{{noticeTypeNameItem.noticeTypeName}}</option>'+
                '</select>';
            angular.element("#noticeTypeId_select").parent().empty().append(html);
            $compile(angular.element("#noticeTypeId_select").parent().contents())($scope);
        });
        // 表格的高度
        $scope.table_height = $window.innerHeight - 184;
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNum: params.pageNumber  //页码
            };
            // 去除为 null 或 "" 值的查询字段
            var noticeTypeQuery = {};
            angular.forEach($scope.informNotice, function (data, index, array) {
                if (data) {
                    noticeTypeQuery[index] = data;
                }
            });
            $rootScope.$log.debug(angular.extend(pageParam, noticeTypeQuery));
            return angular.extend(pageParam, noticeTypeQuery);
        };
        $scope.informNoticeTable = {
            //url: 'data_test/system/tableview_informNotice.json',
            url: app.api.address + '/system/informNotice',
            headers: {
                permission: "informNotice:query"
            },
            method: 'get',
            cache: false,
            height: $scope.table_height,
            toolbar: '#toolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber: 1,
            pageList: [10, 20, 30, 50, 100], // 设置可供选择的页面数据条数
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            sortName: 'editeTime', // 默认排序字段
            sortOrder: 'desc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            sortable: false, // 禁用排序
            idField: "noticeId", // 指定主键列
            uniqueId: "noticeId", // 每行唯一标识
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
                $compile(angular.element('#informNoticeTable').contents())($scope);
            },
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#informNoticeTable').contents())($scope);
            },
            columns: [
                {checkbox: true, width: "5%"},
                {field:"noticeId", title:"主键", visible:false},
                {field: "noticeName", title: "标题", align: "left", valign: "middle"},
                {field: "noticeTypeName", title: "公告类型", align: "left", valign: "middle"},
                {field: "status", title: "状态", align: "left", valign: "middle",
                    formatter:function (value,row,index) {
                        var data = "";
                        switch(value) {
                            case 0:
                                data = "是";
                                break;
                            case 1:
                                data = "否";
                                break;
                            default:
                                data;
                        };
                        return data;
                    }    
                },
                {
                    field: "operation", title: "操作", align: "center", valign: "middle",
                    formatter: function (value, row, index) {
                        var modifyBtn = "<button has-permission='informNotice:update' type='button' class='btn btn-sm btn-default' ng-click='openModify(" + angular.toJson(row) + ")'><span class='fa fa-edit toolbar-btn-icon'></span>修改</button>";
                        var deleteBtn = "<button has-permission='informNotice:delete' type='button' class='btn btn-sm btn-default del-btn' ng-click='openDelete(" + angular.toJson(row) + ")'><span class='fa fa-times toolbar-btn-icon'></span>删除</button>";
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
                $scope.table_height = $scope.table_height + 75;
            } else {
                $scope.table_height = $scope.table_height - 75;
            }
            angular.element('#informNoticeTable').bootstrapTable('resetView', {height: $scope.table_height});
        }
        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#informNoticeTable').bootstrapTable('selectPage', 1);
        }
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.informNotice = {};
            // 重新初始化下拉框
            angular.element('form[name="informNoticeSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#informNoticeTable').bootstrapTable('selectPage', 1);
        }
    }
})(window);