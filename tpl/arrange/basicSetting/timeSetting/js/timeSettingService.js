;(function (window, undefined) {
    'use strict';

    hiocsApp.service("arrange_timeSettingService", ['$http', '$log', 'app', '$rootScope', function($http, $log, app, $rootScope) {

        // 添加
        this.addFun = function($scope, app, alertService) {
            var _this = this;
            $rootScope.showLoading = true; // 开启加载提示
            /*count判断一开始数据表中是否有一条数据，接着如果下拉框选中的学期要设置成排课学期，
            	那么先将“排课控制表”中的“是否排课学期”字段更新为“否”，再执行添加操作“排课控制表”
            */
            if($scope.count>0 && '1' == $scope.timeSetting.arrangeSign) {
                $http({
                    method : 'PUT',
                    data : {'arrangeSign' : '2','semesterId' :$scope.arrangeSemester, 'type' : 'updateArrangeSign'},
                    url : app.api.address + '/arrange/arrangeControl'
                }).then(function successCallback(response, status, headers, config) {
                	$rootScope.showLoading = false; // 关闭加载提示
                    _this.addArrangeControlFun($scope, app, alertService); //添加操作
                }, function errorCallback(response, status, headers, config) {
                	$rootScope.showLoading = false; // 关闭加载提示
                    alertService(response.data.message);
                });
            }else {
                _this.addArrangeControlFun($scope, app, alertService); //添加操作
            }
        };

        /**
         * 新增排课控制信息
         * @param timeSetting
         * @param app
         * @param alertService
         */
        this.addArrangeControlFun = function($scope, app, alertService) {
            var _this = this;
            $rootScope.showLoading = true; // 开启加载提示
            $http({
                method : 'POST',
                data : $scope.timeSetting, //将整个对象作为参数传入后台
                url : app.api.address + '/arrange/arrangeControl'
            }).then(function successCallback(response, status, headers, config) {
            	$rootScope.showLoading = false; // 关闭加载提示
                $scope.timeSetting.startTime = new Date($scope.timeSetting.startTime);
                $scope.timeSetting.endTime = new Date($scope.timeSetting.endTime);
                // alertService("添加成功！");
                _this.addArrangeEnableDept($scope, '1', $scope.timeSetting.deptId, $scope.timeSetting.semesterId, app, alertService);
                location.reload();		// 简单粗暴直接页面上刷新
            }, function errorCallback(response, status, headers, config) {
            	$rootScope.showLoading = false; // 关闭加载提示
                // alertService(response.data.message);
                alertService(response.data.message);
            });
        }

        /**
         * 修改排课控制信息
         * @param timeSetting
         * @param app
         * @param alertService
         */
        this.updateFun = function($scope, app, alertService) {
            var _this = this;
            $rootScope.showLoading = true; // 开启加载提示
            /*当下拉选项选中的是当前的排课学年学期，况且要设置为排课学期，那么要
            	先将“排课控制表”中的“是否排课学期”字段更新为“否”，再更新“排课控制表”
            */
            if('1' == $scope.timeSetting.arrangeSign && $scope.arrangeSemester==$scope.timeSetting.semesterId){
                $http({
                    method : 'PUT',
                    data : {
                    	'arrangeSign' : '2',
                    	'semesterId' : $scope.arrangeSemester,
                    	'type' : 'updateArrangeSign'
                    },
                    url : app.api.address + '/arrange/arrangeControl'
                }).then(function successCallback(response, status, headers, config) {
                	$rootScope.showLoading = false; // 关闭加载提示
                    _this.updateArrangeControl($scope, app, alertService);
                }, function errorCallback(response, status, headers, config) {
                	$rootScope.showLoading = false; // 关闭加载提示
                    alertService(response.data.message);
                });
            }else if('1' == $scope.timeSetting.arrangeSign && $scope.arrangeSemester!=$scope.timeSetting.semesterId){ //选中学期与当前不一样时将当前学期设置为不可排课学期
            	$http({
                    method : 'PUT',
                    data : {
                    	'arrangeSign' : '2',
                    	'semesterId' : $scope.arrangeSemester,
                    	'type' : 'updateArrangeSign'
                    },
                    url : app.api.address + '/arrange/arrangeControl'
                }).then(function successCallback(response, status, headers, config){
                	$rootScope.showLoading = false; // 关闭加载提示
                    _this.updateArrangeSemesterControl($scope, app, alertService);
                }, function errorCallback(response, status, headers, config) {
                	$rootScope.showLoading = false; // 关闭加载提示
                    alertService(response.data.message);
                });
            }else{// 若不是当前排课学年学期，则把状态改为非启用的学年学期，其中的arrangeSign为2
            	$http({
                    method : 'PUT',
                    data : {
                    	'arrangeSign' : '2',
                    	'semesterId' : $scope.timeSetting.semesterId,
                    	'type' : 'updateArrangeSign'
                    },
                    url : app.api.address + '/arrange/arrangeControl'
                }).then(function successCallback(response, status, headers, config) {
                	$rootScope.showLoading = false; // 关闭加载提示
                    _this.updateArrangeControl($scope, app, alertService);
                }, function errorCallback(response, status, headers, config) {
                	$rootScope.showLoading = false; // 关闭加载提示
                    alertService(response.data.message);
                });
            }
        };
		
		 this.updateArrangeSemesterControl = function($scope, app, alertService) {
            var _this = this;
            $rootScope.showLoading = true; // 开启加载提示
            $scope.timeSetting.type = 'updateByPrimaryKey'; //全表更新
            $http({
                method : 'PUT',
                data : $scope.timeSetting,
                url : app.api.address + '/arrange/arrangeControl'
            }).then(function successCallback(response, status, headers, config) {
            	$rootScope.showLoading = false; // 关闭加载提示
                $scope.timeSetting.startTime = new Date($scope.timeSetting.startTime);
                $scope.timeSetting.endTime = new Date($scope.timeSetting.endTime);
                _this.addArrangeEnableDept($scope, '2', $scope.timeSetting.deptId, $scope.timeSetting.semesterId, app, alertService);
                // alertService("更新成功！");
            }, function errorCallback(response, status, headers, config) {
            	$rootScope.showLoading = false; // 关闭加载提示
                // alertService(response.data.message);
                alertService(response.data.message);
            });
        }
		
        this.updateArrangeControl = function($scope, app, alertService) {
            var _this = this;
            $rootScope.showLoading = true; // 开启加载提示
            $scope.timeSetting.type = 'updateByPrimaryKey';
            if($scope.timeSetting.arrangeSign == "2"){	// 当遇到非当前学年学期时候，把状态改成当前学年学期
            	$scope.timeSetting.arrangeSign = "1";
            }
            $http({
                method : 'PUT',
                data : $scope.timeSetting,
                url : app.api.address + '/arrange/arrangeControl'
            }).then(function successCallback(response, status, headers, config) {
            	$rootScope.showLoading = false; // 关闭加载提示
                $scope.timeSetting.startTime = new Date($scope.timeSetting.startTime);
                $scope.timeSetting.endTime = new Date($scope.timeSetting.endTime);
                _this.addArrangeEnableDept($scope, '2', $scope.timeSetting.deptId, $scope.timeSetting.semesterId, app, alertService);
                // alertService("更新成功！");
            }, function errorCallback(response, status, headers, config) {
            	$rootScope.showLoading = false; // 关闭加载提示
                // alertService(response.data.message);
                alertService(response.data.message);
            });
        }

        /**
         * 添加可排单位
         * @param flag 操作类型 ：1.新增；2.更新
         * @param deptId 部门主键
         * @param semesterId 学年学期主键
         * @param app
         * @param alertService
         */
        this.addArrangeEnableDept = function($scope, flag, deptId, semesterId, app, alertService) {
            if(!semesterId){
                return ;
            }
            $rootScope.showLoading = true; // 开启加载提示
            var _this = this;
            $http({
                method : 'DELETE',
                params : {'type' : 'deleteBySemesterId', 'semesterId' : semesterId},
                url : app.api.address + '/arrange/arrangeEnableDept'
            }).then(function successCallback(response, status, headers, config) {
                if(deptId && deptId.length>0){
                    $http({
                        method : 'POST',
                        data : [{'deptId' : ((deptId instanceof Array) ? deptId.toString() :  deptId), 'semesterId' : semesterId}],//{'deptId' : '1', 'semesterId' : '1'},//
                        url : app.api.address + '/arrange/arrangeEnableDept'
                    }).then(function successCallback(response, status, headers, config) {
                    	$rootScope.showLoading = false; // 关闭加载提示
                        _this.tipFun($scope, app, flag, alertService);
                    }, function errorCallback(response, status, headers, config) {
                    	$rootScope.showLoading = false; // 关闭加载提示
                        alertService(response.data.message);
                    });
                }else{
                    _this.tipFun($scope, app, flag, alertService);
                }
            }, function errorCallback(response, status, headers, config) {
                alertService(response.data.message);
            });
        }

        /**
         * 查询排课学年学期
         */
        this.selectArrangeSemester = function($scope, app, alertService){
            $http({
                method : 'GET',
                params : {'type' : 'selectArrangeSemester'},
                url : app.api.address + '/arrange/arrangeControl'
            }).then(function successCallback(response, status, headers, config) {
                if(response.data.data.rows && response.data.data.rows.length > 0) {
                    $scope.arrangeSemester = response.data.data.rows[0].semester
                    $scope.timeSetting.arrangeSemester = response.data.data.rows[0].semester
                }else{
                    $scope.arrangeSemester = '';
                    $scope.timeSetting.arrangeSemester = '';
                }
            }, function errorCallback(response, status, headers, config) {
                alertService(response.data.message);
            });
        };

        /**
         * 提示方法
         * @param flag 1.添加；2.更新
         * @param alertService
         */
        this.tipFun = function($scope, app, flag, alertService){
            var _this = this;
            _this.selectArrangeSemester($scope, app, alertService);
            if('1' == flag){
            	$rootScope.showLoading = false; // 关闭加载提示
                alertService("添加成功！");
            }else if('2' == flag){
            	$rootScope.showLoading = false; // 关闭加载提示
                alertService("更新成功！");
            }
        };

        /**
         * 学年学期下拉框（无参）
         * @param callback
         */
        this.getSemesterId = function(callback) {
            $http.get(app.api.address + '/base-info/acadyearterm/findAcadyeartermNamesBox')
                .then(function successCallback(response) {
                    callback(null, null, response.data);
                }, function errorCallback(response) {
                }
            );
        };
        
        /**
         * 单位下拉框（无参）
         * @param callback
         */
        this.getDepartment = function(callback) {
            $http.get(app.api.address + '/base-info/department/findDepartmentNamesBox')
                .then(function successCallback(response) {
                    callback(null, null, response.data);
                }, function errorCallback(response) {
                }
            );
        };
    }]);

})(window);
