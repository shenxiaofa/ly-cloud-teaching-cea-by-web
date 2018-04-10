;(function (window, undefined) {
    'use strict';

    hiocsApp.service("baseinfo_generalService", ['$http', '$log', 'app', function($http, $log, app) {
        /**
         * 校区下拉框（无参）
         * @param callback
         */
        this.findCampusNamesBox = function(callback) {
            $http.get(app.api.address + '/base-info/campus/findCampusNamesBox')
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback(null, null, response.data);
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, response.data.message);
                });
        };

        // 调用示例
        /*baseinfo_generalService.findCampusNamesBox(function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            $rootScope.$log.debug(data);
        });*/

        /**
         * 单位下拉框（无参）
         * @param callback
         */
        this.findDepartmentNamesBox = function(callback) {
            $http.get(app.api.address + '/base-info/department/findDepartmentNamesBox')
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback(null, null, response.data);
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, response.data.message);
                });
        };
        // 调用示例
        /*baseinfo_generalService.findDepartmentNamesBox(function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            $rootScope.$log.debug(data);
        });*/

        /**
         * 学年学期下拉框（无参）
         * @param callback
         */
        this.findAcadyeartermNamesBox = function(callback) {
            $http.get(app.api.address + '/base-info/acadyearterm/findAcadyeartermNamesBox')
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback(null, null, response.data);
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, response.data.message);
                });
        };
        // 调用示例
        /*baseinfo_generalService.findAcadyeartermNamesBox(function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            $rootScope.$log.debug(data);
        });*/

        /**
         * 查询代码数据集
         * @param param
             {
                 datableNumber:代码表号,
                 dataSubjection:隶属代码表号
             }
         * @param callback
         */
        this.findcodedataNames = function(param, callback) {
            $http.get(app.api.address + '/base-info/codedata/findcodedataNames',
                  {
                      params: param
            })
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback(null, null, response.data);
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, response.data.message);
                });
        };
        // 调用示例
        /*baseinfo_generalService.findcodedataNames({datableNumber: "YJXK"}, function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            $rootScope.$log.debug(data);
        });*/
        /**
         * 查询根据代码类型号、代码表号、代码号、代码名称查询代码数据，参数为空时查询所有，支持分页
         * @param param
            {
               pageNo: 当前页,
               pageSize: 每页显示条数,
               param:{
                   datableNumber：代码表号
                   dataNumber：代码号
                   dataName：代码名称
                   dataSubjection：代码类型号
               }
            }
         * @param callback
         */
        this.findcodedata = function(param, callback) {
            $http.get(app.api.address + '/base-info/codedata/findcoded',
                {
                    params: param
                })
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback(null, null, response.data);
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, response.data.message);
                });
        };
		/**
         * 获取当前的学年学期
         * 创建日期：2018年1月29日
         */
        this.getCurrentSemester = function(callback) {
            $http({
				method: 'GET',
				url: app.api.address + '/base-info/acadyearterm/showNewAcadlist'
	      	}).then(function successCallback(response) {
	      		callback(null, null, response.data);
                }, function errorCallback(response) {
                	$log.debug(response);
                }
            );
        };
        
        /**
         * 获取当前的学年学期下的第几周
         * 创建日期：2018年1月29日
         */
        this.getCurrentSemesterWeekly = function(param,callback) {
            $http({
				method: 'GET',
				url: app.api.address + '/base-info/school-calender/weekly?academicYear='+param
	      	}).then(function successCallback(response) {
	      		callback(null, null, response.data);
                }, function errorCallback(response) {
                	$log.debug(response);
                }
            );
        };

        /**
         * 查询当前周的开始结束时间
         * @param param
             {
                 academicYear:学年学期,
                 weekly:周次
             }
         * @param callback
         */
        this.schoolCalender = function(param, callback) {
            $http.get(app.api.address + '/base-info/school-calender', {params: param})
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback(null, null, response.data);
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, response.data.message);
                });
        };
        // 调用示例
        /*baseinfo_generalService.schoolCalender({academicYear: "2017-1", weekly: "2"}, function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            $rootScope.$log.debug(data);
        });*/

        /**
         * 查询课程库
         * @param param
             {
                pageNo: 当前页,
                pageSize: 每页显示条数,
                param:{
                    courseNumber:课程号,
                    courseName：课程名称,
                    courseEngName：课程英文名,
                    establishUnitNumber：开设单位号,
                    courseTypeNumber：课程类型号,
                    credit：学分,
                    totalHours：总学时,
                    buildSchoolSemester：建立学年学期,
                    coursePrincipal：课程负责人,
                    whether：是否启用
                }
             }
         * @param callback
         */
        this.showCourseLibrary = function(param, callback) {
            $http.post(app.api.address + '/base-info/courseLibrary/showCourseLibrary', param)
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback(null, null, response.data);
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, response.data.message);
                });
        };
        // 调用示例
        /*baseinfo_generalService.showCourseLibrary(
            {
                pageNo: "1",
                pageSize: "10",
                param:{
                    courseNumber: "Chinese01",
                    //courseName: "",
                    //courseEngName: "",
                    //establishUnitNumber: "",
                    //courseTypeNumber: "",
                    //credit: "",
                    //totalHours: "",
                    //buildSchoolSemester: "",
                    //coursePrincipal: "",
                    //whether: ""
                }
            },
            function (error, message, data) {
                if (error) {
                    alertService(message);
                    return;
                }
                $rootScope.$log.debug(data);
            }
        );*/

        /**
         * 查询年级专业大类方向下拉框
         * @param param
             {
                pageNo: 当前页,
                pageSize: 每页显示条数,
                param:{
                    majorGradeProfession：是否年级专业大类
                    grade：年级
                    GLDWH：管理单位号
                }
             }
         * @param callback
         */
        this.gradeProfessionPull = function(param, callback) {
            $http.post(app.api.address + '/base-info/grade-profession/pull',param)
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback(null, null, response.data);
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, response.data.message);
                });
        };
        // 调用示例
        /*baseinfo_generalService.gradeProfessionPull(
            {
                pageNo: "1",
                pageSize: "10",
                param:{
                    majorGradeProfession: "0",
                    grade: "",
                    GLDWH: ""
                }
            },
            function (error, message, data) {
                if (error) {
                    alertService(message);
                    return;
                }
                $rootScope.$log.debug(data);
            }
        );*/

        /**
         * 查询专业大类下拉框（无参）
         * @param callback
         */
        this.majorCatePull = function(callback) {
            $http.get(app.api.address + '/base-info/major-cate/pull')
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback(null, null, response.data);
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, response.data.message);
                });
        };
        // 调用示例
        /*baseinfo_generalService.majorCatePull(function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            $rootScope.$log.debug(data);
        });*/

        /**
         * 查询专业大类/专业方向信息下拉框
         * @param param
             {
                majorProfessionDircetion：是否大类
             }
         * @param callback
         */
        this.professionDirectionPull = function(param, callback) {
            $http.get(app.api.address + '/base-info/profession-direction/pull', {params: param})
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback(null, null, response.data);
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, response.data.message);
                });
        };
        // 调用示例
        /*baseinfo_generalService.professionDirectionPull({majorProfessionDircetion: "1"}, function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            $rootScope.$log.debug(data);
        });*/
        
        /**
         * 查询教学楼下拉框（无参）
         * @param callback
         */
        this.teachingBuildingPull = function(callback) {
            $http.get(app.api.address + '/base-info/teaching-building/pull')
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback(null, null, response.data);
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, response.data.message);
                });
        };
        // 调用示例
        /*baseinfo_generalService.teachingBuildingPull(function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            $rootScope.$log.debug(data);
        });*/

        /**
         * 查询教室列表
         * @param param
            {
                pageNo: 当前页,
                pageSize: 每页显示条数,
               param:{
                   campusId：校区ID,
                   teachingBuildId：教学楼ID
               }
            }
         * @param callback
         */
        this.classroomList = function(param, callback) {
            $http.post(app.api.address + '/base-info/classroom/list', param)
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback(null, null, response.data);
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, response.data.message);
                });
        };
        // 调用示例
        /*baseinfo_generalService.classroomList(
            {
                pageNo: "1",
                pageSize: "10",
                param:{
                    campusId: "",
                    teachingBuildId: ""
                }
            },
            function (error, message, data) {
                if (error) {
                    alertService(message);
                    return;
                }
                $rootScope.$log.debug(data);
            }
        );*/

        /**
         * 查询年级列表
         * @param callback
         */
        // this.gradeList = function(callback,permission) {
        this.gradeList = function(callback) {

            $http.get(app.api.address + '/base-info/codedata/findcodedataNames',
                {
                    params: {datableNumber:"NJDM"}
            })
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        var gradeList = [];
                        if (response.data.data && response.data.data.length > 0) {
                            angular.forEach(response.data.data, function(grade, index){
                                gradeList.push({
                                    id: grade.id,
                                    dataNumber: grade.dataNumber
                                });
                            });
                            // 倒序
                            gradeList.sort(function(a, b){
                                if(a.dataNumber > b.dataNumber){
                                    return -1; 
                                }else if(a.dataNumber == b.dataNumber){
                                    return 0;
                                }else{
                                    return 1;
                                }
                            });
                        }
                        response.data.data = gradeList;
                        callback(null, null, response.data);
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, response.data.message);
                });
        };
        // 调用示例
        /*baseinfo_generalService.gradeList(
            function (error, message, data) {
                if (error) {
                    alertService(message);
                    return;
                }
                $rootScope.$log.debug(data);
            }
        );*/

        /**
         * 查询班级列表
         * @param callback
         */
        this.classList = function(callback) {
            $http.get(app.api.address + '/student/class/pull')
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback(null, null, response.data);
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, response.data.message);
                });
        };
        // 调用示例
        /*baseinfo_generalService.classList(
            function (error, message, data) {
                if (error) {
                    alertService(message);
                    return;
                }
                $rootScope.$log.debug(data);
            }
        );*/

        /**
         * 查询注册状态列表
         * @param callback
         */
        this.registerStatusList = function(callback) {
            $http.get(app.api.address + '/base-info/codedata/findcodedataNames', {
                    params: {datableNumber:"ZCZTDM"}
                })
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback(null, null, response.data);
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, response.data.message);
                });
        };
        // 调用示例
        /*baseinfo_generalService.registerStatusList(
            function (error, message, data) {
                if (error) {
                    alertService(message);
                    return;
                }
                $rootScope.$log.debug(data);
            }
        );*/

        /**
         * 查询未注册原因列表
         * @param callback
         */
        this.unregisterReasonList = function(callback) {
            $http.get(app.api.address + '/base-info/codedata/findcodedataNames', {
                    params: {datableNumber:"WZCYYDM"}
                })
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback(null, null, response.data);
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, response.data.message);
                });
        };
        // 调用示例
        /*baseinfo_generalService.unregisterReasonList(
            function (error, message, data) {
                if (error) {
                    alertService(message);
                    return;
                }
                $rootScope.$log.debug(data);
            }
        );*/

        /**
         * 国标专业下拉框
         * @param callback
         */
        this.findNationProfessionPull = function(callback) {
            $http.get(app.api.address + '/base-info/nation-profession/pull')
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback(null, null, response.data);
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, response.data.message);
                });
        };
        // 调用示例
        /*baseinfo_generalService.findNationProfessionPull(
            function (error, message, data) {
                if (error) {
                    alertService(message);
                    return;
                }
                $rootScope.$log.debug(data);
            }
        );*/

        /**
         * 查询课程模块
         * @param callback
         */
        this.findCourseModel = function(callback) {
            $http.get(app.api.address + 'scheme/share/courseModel')
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback(null, null, response.data);
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, response.data.message);
                });
        };
        // 调用示例
        /*baseinfo_generalService.findCourseModel(
         function (error, message, data) {
         if (error) {
         alertService(message);
         return;
         }
         $rootScope.$log.debug(data);
         }
         );*/

        /**
         * 查询课程模块
         * @param callback
         */
        this.findCourseLibrary = function(callback) {
            $http.get(app.api.address + '/base-info/courseLibrary/showAlllist')
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback(null, null, response.data);
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, response.data.message);
                });
        };

        // 调用示例
        /*baseinfo_generalService.findCourseLibrary(
         function (error, message, data) {
         if (error) {
         alertService(message);
         return;
         }
         $rootScope.$log.debug(data);
         }
         );*/


    }]);

})(window);
