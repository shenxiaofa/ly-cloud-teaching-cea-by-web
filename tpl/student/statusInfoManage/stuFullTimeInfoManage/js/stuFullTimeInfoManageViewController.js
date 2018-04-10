/**
 * Created by Administrator on 2018/1/19.
 */
;(function (window, undefined) {
    'use strict';

    window.arrange_stuFullTimeInfoManageViewController = function ($compile, $scope,$stateParams, $uibModal, $view, $rootScope, $location, $anchorScroll, $window, $timeout, $state,$http, arrange_stuFullTimeInfoManageService, alertService, app) {
        // 国内留学生学籍信息查询对象
        $scope.stuFullTimeInfo = $stateParams.stuFullTimeInfo;
        $scope.stuFullTimeInfo.idCardType = $scope.stuFullTimeInfo.idCardTypeId;
        $scope.stuFullTimeInfo.countryCode = $scope.stuFullTimeInfo.countryCodeId;
        $scope.stuFullTimeInfo.sexCode = $scope.stuFullTimeInfo.sexCodeId;
        $scope.stuFullTimeInfo.nationCode = $scope.stuFullTimeInfo.nationId;
        $scope.stuFullTimeInfo.politicalStatus = $scope.stuFullTimeInfo.politicalStatusId;
        $scope.stuFullTimeInfo.dept = $scope.stuFullTimeInfo.deptId;
        $scope.stuFullTimeInfo.department = $scope.stuFullTimeInfo.departmentId;
        $scope.stuFullTimeInfo.grade = $scope.stuFullTimeInfo.gradeId;
        $scope.stuFullTimeInfo.classMajor = $scope.stuFullTimeInfo.classMajorId;
        $scope.stuFullTimeInfo.class = $scope.stuFullTimeInfo.classId;
        $scope.stuFullTimeInfo.studyStatus = $scope.stuFullTimeInfo.studyStatusId;
        $scope.stuFullTimeInfo.schoolStatus = $scope.stuFullTimeInfo.schoolStatusId;
        $scope.stuFullTimeInfo.nationStatus = $scope.stuFullTimeInfo.nationStatusId;
        $scope.stuFullTimeInfo.studyForm = $scope.stuFullTimeInfo.studyFormId;
        $scope.stuFullTimeInfo.developLevel = $scope.stuFullTimeInfo.developLevelId;
        $scope.stuFullTimeInfo.schoolWay = $scope.stuFullTimeInfo.schoolWayId;
        $scope.stuFullTimeInfo.orginCode = $scope.stuFullTimeInfo.orginCodeId;
        $scope.stuFullTimeInfo.originEnrollCode = $scope.stuFullTimeInfo.originEnrollCodeId;
        $scope.stuFullTimeInfo.bornTime = new Date($scope.stuFullTimeInfo.bornTime);
        $scope.stuFullTimeInfo.goSchooleTime = new Date($scope.stuFullTimeInfo.goSchooleTime);
        $scope.stuFullTimeInfo.expectGraduateTime = new Date($scope.stuFullTimeInfo.expectGraduateTime);
        $scope.stuFullTimeInfo.oldIdCardType = $scope.stuFullTimeInfo.oldIdCardTypeId;
        $scope.stuFullTimeInfo.marrayStatus = $scope.stuFullTimeInfo.marrayStatusId;
        $scope.stuFullTimeInfo.healthyStatus = $scope.stuFullTimeInfo.healthyStatusId;
        $scope.stuFullTimeInfo.religion = $scope.stuFullTimeInfo.religionId;
        $scope.stuFullTimeInfo.bloodType = $scope.stuFullTimeInfo.bloodTypeId;
        $scope.stuFullTimeInfo.idCardEffectTime = new Date($scope.stuFullTimeInfo.idCardEffectTime);
        $scope.stuFullTimeInfo.bornArea = $scope.stuFullTimeInfo.bornAreaId;
        $scope.stuFullTimeInfo.originPlace = $scope.stuFullTimeInfo.originPlaceId;
        $scope.stuFullTimeInfo.overseas = $scope.stuFullTimeInfo.overseasId;
        $scope.stuFullTimeInfo.developWay = $scope.stuFullTimeInfo.developWayId;
        $scope.stuFullTimeInfo.graduateTime = new Date($scope.stuFullTimeInfo.graduateTime);
        $scope.stuFullTimeInfo.gradDegreeCode = $scope.stuFullTimeInfo.gradDegreeCodeId;
        $scope.stuFullTimeInfo.examStuType = $scope.stuFullTimeInfo.examStuTypeId;
        $scope.stuFullTimeInfo.originGradTypeCode = $scope.stuFullTimeInfo.originGradTypeCodeId;

        //初始化查看数据
        initEditCondition($scope, $window, $rootScope, app, $compile, $http, arrange_stuFullTimeInfoManageService,   alertService);

        $scope.stuFullTimeInfo_familly = {};
        $scope.stuFullTimeInfo_experience = {};
        $scope.stuFullTimeInfo_interflowo = {};
        $scope.stuFullTimeInfo_changerollo = {};
        $scope.stuFullTimeInfo_doubdegreeo = {};
        $scope.stuFullTimeInfo_registero = {};
        $scope.stuFullTimeInfo_courseo = {};
        $scope.stuFullTimeInfo_punishmento = {};
        //初始化家庭成员
        initFamillyTable($scope, $window, $rootScope, app, $compile, arrange_stuFullTimeInfoManageService, alertService);
        //初始化学习经历
        initExperienceTable($scope, $window, $rootScope, app, $compile, arrange_stuFullTimeInfoManageService, alertService);
        //初始化交流经历表格
        initInterflowoTable($scope, $window, $rootScope, app, $compile, arrange_stuFullTimeInfoManageService, alertService);
        //初始化异动情况表格
        initChangerolloTable($scope, $window, $rootScope, app, $compile, arrange_stuFullTimeInfoManageService, alertService);
        //初始化双专业双学位辅修表格
        initDoubdegreeoTable($scope, $window, $rootScope, app, $compile, arrange_stuFullTimeInfoManageService, alertService);
        //初始化注册状态表格
        initRegisteroTable($scope, $window, $rootScope, app, $compile, arrange_stuFullTimeInfoManageService, alertService);
        //初始化学籍变动日志表格
        initCourseoTable($scope, $window, $rootScope, app, $compile, arrange_stuFullTimeInfoManageService, alertService);
        //初始化惩处表格
        initPunishmentoTable($scope, $window, $rootScope, app, $compile, arrange_stuFullTimeInfoManageService, alertService);
        //点击学习经历刷新表格
        $scope.queryExperience = function () {
            angular.element('#stuFullTimeInfoExperienceTable').bootstrapTable('refresh');
        };
        //点击家庭成员刷新表格
        $scope.queryFamilly = function () {
            angular.element('#stuFullTimeInfoFamillyTable').bootstrapTable('refresh');
        };
        //点击交流经历刷新表格
        $scope.queryInterflowo = function () {
            angular.element('#stuFullTimeInfoInterflowoTable').bootstrapTable('refresh');
        };
        //点击异动情况刷新表格
        $scope.queryChangerollo = function () {
            angular.element('#stuFullTimeInfoChangerolloTable').bootstrapTable('refresh');
        };
        //点击双专业双学位辅修刷新表格
        $scope.queryDoubdegreeo = function () {
            angular.element('#stuFullTimeInfoDoubdegreeoTable').bootstrapTable('refresh');
        };
        //点击注册状态刷新表格
        $scope.queryRegistero = function () {
            angular.element('#stuFullTimeInfoRegisteroTable').bootstrapTable('refresh');
        };
        //点击学籍变动日志刷新表格
        $scope.queryCourseo = function () {
            angular.element('#stuFullTimeInfoCourseoTable').bootstrapTable('refresh');
        };
        //点击惩处刷新表格
        $scope.queryPunishmento = function () {
            angular.element('#stuFullTimeInfoPunishmentoTable').bootstrapTable('refresh');
        };

    };
    arrange_stuFullTimeInfoManageViewController.$inject = ['$compile', '$scope','$stateParams', '$uibModal', '$view', '$rootScope', '$location', '$anchorScroll', '$window', '$timeout', '$state','$http', 'arrange_stuFullTimeInfoManageService', 'alertService', 'app'];

    // 初始化家庭成员表格
    var initFamillyTable = function ($scope, $window, $rootScope, app, $compile, arrange_stuFullTimeInfoManageService, alertService) {

        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNum: params.pageNumber  //页码
            };
            // 去除为 null 或 "" 值的查询字段
            var stuFullTimeExperienceInfoQuery = {};
            angular.forEach($scope.stuFullTimeInfo_experience, function (data, index, array) {
                if (data) {
                    stuFullTimeExperienceInfoQuery[index] = data;
                }
            });
            $rootScope.$log.debug(angular.extend(pageParam, stuFullTimeExperienceInfoQuery));
            return angular.extend(pageParam, stuFullTimeExperienceInfoQuery);
        }
        $scope.stuFullTimeInfoFamillyTable = {
            url: 'data_test/student/tableview_stuFullTimeInfo_familly.json',
            // url: app.api.address + '/student/stuFullTimeInfo',
            headers: {
                permission: "stuFullTimeFamillyInfo:query"
            },
            method: 'get',
            cache: false,
            height: 700,
            toolbar: '#familly_toolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber: 1,
            pageList: [10, 20, 30, 50, 100], // 设置可供选择的页面数据条数
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            sortName: 'dwh', // 默认排序字段
            sortOrder: 'asc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            sortable: false, // 禁用排序
            idField: "dwh", // 指定主键列
            uniqueId: "dwh", // 每行唯一标识
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
                $compile(angular.element('#stuFullTimeInfoFamillyTable').contents())($scope);
            },
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#stuFullTimeInfoFamillyTable').contents())($scope);
            },
            columns: [
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
                {field: "familyRelationName", title: '称谓', align: "center", valign: "middle"},
                {field: "familyMemberName", title: '姓名', align: "center", valign: "middle"},
                {field: "familyAge", title: '年龄', align: "center", valign: "middle"},
                {field: "familyWorkUnit", title: '工作单位', align: "center", valign: "middle"},
                {field: "familyPhone", title: '联系电话', align: "center", valign: "middle"}
            ],
            loadImmediately: true
        };
    };
    // 初始化学习经历表格
    var initExperienceTable = function ($scope, $window, $rootScope, app, $compile, arrange_stuFullTimeInfoManageService, alertService) {
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNum: params.pageNumber  //页码
            };
            // 去除为 null 或 "" 值的查询字段
            var stuFullTimeExperienceInfoQuery = {};
            angular.forEach($scope.stuFullTimeInfo_experience, function (data, index, array) {
                if (data) {
                    stuFullTimeExperienceInfoQuery[index] = data;
                }
            });
            $rootScope.$log.debug(angular.extend(pageParam, stuFullTimeExperienceInfoQuery));
            return angular.extend(pageParam, stuFullTimeExperienceInfoQuery);
        }
        $scope.stuFullTimeInfoExperienceTable = {
            url: 'data_test/student/tableview_stuFullTimeInfo_experience.json',
            // url: app.api.address + '/student/stuFullTimeInfo',
            headers: {
                permission: "stuFullTimeExperienceInfo:query"
            },
            method: 'get',
            cache: false,
            height: 700,
            toolbar: '#experience_toolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber: 1,
            pageList: [10, 20, 30, 50, 100], // 设置可供选择的页面数据条数
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            sortName: 'dwh', // 默认排序字段
            sortOrder: 'asc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            sortable: false, // 禁用排序
            idField: "dwh", // 指定主键列
            uniqueId: "dwh", // 每行唯一标识
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
                $compile(angular.element('#stuFullTimeInfoExperienceTable').contents())($scope);
            },
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#stuFullTimeInfoExperienceTable').contents())($scope);
            },
            columns: [
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
                {field: "experBeginTime", title: '学习起始日期', align: "center", valign: "middle"},
                {field: "experEndTime", title: '学习终止日期', align: "center", valign: "middle"},
                {field: "experStudyUnit", title: '学习单位', align: "center", valign: "middle"},
                {field: "experSite", title: '学习地址', align: "center", valign: "middle"}
            ],
            loadImmediately: true
        };
    };
    // 初始化交流经历表格
    var initInterflowoTable = function ($scope, $window, $rootScope, app, $compile, arrange_stuFullTimeInfoManageService, alertService) {
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNum: params.pageNumber  //页码
            };
            // 去除为 null 或 "" 值的查询字段
            var stuFullTimeInterflowoInfoQuery = {};
            angular.forEach($scope.stuFullTimeInfo_interflowo, function (data, index, array) {
                if (data) {
                    stuFullTimeInterflowoInfoQuery[index] = data;
                }
            });
            $rootScope.$log.debug(angular.extend(pageParam, stuFullTimeInterflowoInfoQuery));
            return angular.extend(pageParam, stuFullTimeInterflowoInfoQuery);
        }
        $scope.stuFullTimeInfoInterflowoTable = {
            url: 'data_test/student/tableview_stuFullTimeInfo_conmunity.json',
            // url: app.api.address + '/student/stuFullTimeInfo',
            headers: {
                permission: "stuFullTimeInterflowoInfo:query"
            },
            method: 'get',
            cache: false,
            height: 700,
            toolbar: '#interflowo_toolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber: 1,
            pageList: [10, 20, 30, 50, 100], // 设置可供选择的页面数据条数
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            sortName: 'dwh', // 默认排序字段
            sortOrder: 'asc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            sortable: false, // 禁用排序
            idField: "dwh", // 指定主键列
            uniqueId: "dwh", // 每行唯一标识
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
                $compile(angular.element('#stuFullTimeInfoInterflowoTable').contents())($scope);
            },
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#stuFullTimeInfoInterflowoTable').contents())($scope);
            },
            columns: [
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
                {field: "startTime", title: '学习起始日期', align: "center", valign: "middle"},
                {field: "endTime", title: '学习终止日期', align: "center", valign: "middle"},
                {field: "sendToCollegeName", title: '派往学校', align: "center", valign: "middle"},
                {field: "sentToMajorName", title: '派往专业', align: "center", valign: "middle"},
                {field: "exchangeStatus", title: '交流状态', align: "center", valign: "middle"}
            ],
            loadImmediately: true
        };
    };
    // 初始化异动情况表格
    var initChangerolloTable = function ($scope, $window, $rootScope, app, $compile, arrange_stuFullTimeInfoManageService, alertService) {
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNum: params.pageNumber  //页码
            };
            // 去除为 null 或 "" 值的查询字段
            var stuFullTimeChangerolloInfoQuery = {};
            angular.forEach($scope.stuFullTimeInfo_changerollo, function (data, index, array) {
                if (data) {
                    stuFullTimeChangerolloInfoQuery[index] = data;
                }
            });
            $rootScope.$log.debug(angular.extend(pageParam, stuFullTimeChangerolloInfoQuery));
            return angular.extend(pageParam, stuFullTimeChangerolloInfoQuery);
        }
        $scope.stuFullTimeInfoChangerolloTable = {
            url: 'data_test/student/tableview_stuFullTimeInfo_changerollo.json',
            // url: app.api.address + '/student/stuFullTimeInfo',
            headers: {
                permission: "stuFullTimeChangerolloInfo:query"
            },
            method: 'get',
            cache: false,
            height: 700,
            toolbar: '#changerollo_toolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber: 1,
            pageList: [10, 20, 30, 50, 100], // 设置可供选择的页面数据条数
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            sortName: 'dwh', // 默认排序字段
            sortOrder: 'asc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            sortable: false, // 禁用排序
            idField: "dwh", // 指定主键列
            uniqueId: "dwh", // 每行唯一标识
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
                $compile(angular.element('#stuFullTimeInfoChangerolloTable').contents())($scope);
            },
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#stuFullTimeInfoChangerolloTable').contents())($scope);
            },
            columns: [
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
                {field: "changeDate", title: '发文日期', align: "center", valign: "middle"},
                {field: "changeNumber", title: '文号', align: "center", valign: "middle"},
                {field: "changeTypeName", title: '异动类别', align: "center", valign: "middle"},
                {field: "changeCauseNAME", title: '异动原因', align: "center", valign: "middle"}
            ],
            loadImmediately: true
        };
    };
    // 初始化双专业双学位辅修表格
    var initDoubdegreeoTable = function ($scope, $window, $rootScope, app, $compile, arrange_stuFullTimeInfoManageService, alertService) {
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNum: params.pageNumber  //页码
            };
            // 去除为 null 或 "" 值的查询字段
            var stuFullTimeDoubdegreeoInfoQuery = {};
            angular.forEach($scope.stuFullTimeInfo_doubdegreeo, function (data, index, array) {
                if (data) {
                    stuFullTimeDoubdegreeoInfoQuery[index] = data;
                }
            });
            $rootScope.$log.debug(angular.extend(pageParam, stuFullTimeDoubdegreeoInfoQuery));
            return angular.extend(pageParam, stuFullTimeDoubdegreeoInfoQuery);
        }
        $scope.stuFullTimeInfoDoubdegreeoTable = {
            url: 'data_test/student/tableview_stuFullTimeInfo_doubdegreeo.json',
            // url: app.api.address + '/student/stuFullTimeInfo',
            headers: {
                permission: "stuFullTimeDoubdegreeoInfo:query"
            },
            method: 'get',
            cache: false,
            height: 700,
            toolbar: '#doubdegreeo_toolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber: 1,
            pageList: [10, 20, 30, 50, 100], // 设置可供选择的页面数据条数
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            sortName: 'dwh', // 默认排序字段
            sortOrder: 'asc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            sortable: false, // 禁用排序
            idField: "dwh", // 指定主键列
            uniqueId: "dwh", // 每行唯一标识
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
                $compile(angular.element('#stuFullTimeInfoDoubdegreeoTable').contents())($scope);
            },
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#stuFullTimeInfoDoubdegreeoTable').contents())($scope);
            },
            columns: [
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
                {field: "degreeType", title: '辅修类别', align: "center", valign: "middle"},
                {field: "degreeCollege", title: '学院', align: "center", valign: "middle"},
                {field: "degreeMajor", title: '专业方向', align: "center", valign: "middle"},
                {field: "degreeGrade", title: '年级', align: "center", valign: "middle"},
                {field: "degreeConclusion", title: '毕业结论', align: "center", valign: "middle"}
            ],
            loadImmediately: true
        };
    };
    // 初始化注册状态表格
    var initRegisteroTable = function ($scope, $window, $rootScope, app, $compile, arrange_stuFullTimeInfoManageService, alertService) {
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNum: params.pageNumber  //页码
            };
            // 去除为 null 或 "" 值的查询字段
            var stuFullTimeRegisteroInfoQuery = {};
            angular.forEach($scope.stuFullTimeInfo_registero, function (data, index, array) {
                if (data) {
                    stuFullTimeRegisteroInfoQuery[index] = data;
                }
            });
            $rootScope.$log.debug(angular.extend(pageParam, stuFullTimeRegisteroInfoQuery));
            return angular.extend(pageParam, stuFullTimeRegisteroInfoQuery);
        }
        $scope.stuFullTimeInfoRegisteroTable = {
            url: 'data_test/student/tableview_stuFullTimeInfo_registero.json',
            // url: app.api.address + '/student/stuFullTimeInfo',
            headers: {
                permission: "stuFullTimeRegisteroInfo:query"
            },
            method: 'get',
            cache: false,
            height: 700,
            toolbar: '#registero_toolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber: 1,
            pageList: [10, 20, 30, 50, 100], // 设置可供选择的页面数据条数
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            sortName: 'dwh', // 默认排序字段
            sortOrder: 'asc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            sortable: false, // 禁用排序
            idField: "dwh", // 指定主键列
            uniqueId: "dwh", // 每行唯一标识
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
                $compile(angular.element('#stuFullTimeInfoRegisteroTable').contents())($scope);
            },
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#stuFullTimeInfoRegisteroTable').contents())($scope);
            },
            columns: [
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
                {field: "regisSemester", title: '学年学期', align: "center", valign: "middle"},
                {field: "regisReport", title: '报到状态', align: "center", valign: "middle"},
                {field: "regisEnroll", title: '注册状态', align: "center", valign: "middle"},
                {field: "regisPay", title: '缴费状态', align: "center", valign: "middle"}
            ],
            loadImmediately: true
        };
    };
    // 初始化学籍变动日志表格
    var initCourseoTable = function ($scope, $window, $rootScope, app, $compile, arrange_stuFullTimeInfoManageService, alertService) {
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNum: params.pageNumber  //页码
            };
            // 去除为 null 或 "" 值的查询字段
            var stuFullTimeCourseoInfoQuery = {};
            angular.forEach($scope.stuFullTimeInfo_courseo, function (data, index, array) {
                if (data) {
                    stuFullTimeCourseoInfoQuery[index] = data;
                }
            });
            $rootScope.$log.debug(angular.extend(pageParam, stuFullTimeCourseoInfoQuery));
            return angular.extend(pageParam, stuFullTimeCourseoInfoQuery);
        }
        $scope.stuFullTimeInfoCourseoTable = {
            url: 'data_test/student/tableview_stuFullTimeInfo_courseo.json',
            // url: app.api.address + '/student/stuFullTimeInfo',
            headers: {
                permission: "stuFullTimeCourseoInfo:query"
            },
            method: 'get',
            cache: false,
            height: 700,
            toolbar: '#courseo_toolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber: 1,
            pageList: [10, 20, 30, 50, 100], // 设置可供选择的页面数据条数
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            sortName: 'dwh', // 默认排序字段
            sortOrder: 'asc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            sortable: false, // 禁用排序
            idField: "dwh", // 指定主键列
            uniqueId: "dwh", // 每行唯一标识
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
                $compile(angular.element('#stuFullTimeInfoCourseoTable').contents())($scope);
            },
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#stuFullTimeInfoCourseoTable').contents())($scope);
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
                {field: "courProof", title: '学籍变更文号', align: "center", valign: "middle"},
                {field: "changetorNum", title: '学籍变更人工号', align: "center", valign: "middle"},
                {field: "changetorName", title: '学籍变更人姓名', align: "center", valign: "middle"},
                {field: "changetorTime", title: '学籍变更时间', align: "center", valign: "middle"},
                {
                    field: "operation", title: "操作", align: "center", valign: "middle",
                    formatter: function (value, row, index) {
                        var modifyBtn = "<button has-permission='stuFullTimeInfo:update' type='button' class='btn btn-sm btn-default' ng-click='viewCourse(" + angular.toJson(row) + ")'><span class='fa fa-edit toolbar-btn-icon'></span>查看</button>";
                        return modifyBtn + "&nbsp;";
                    }
                }
            ],
            loadImmediately: true
        };
    };
    // 初始化惩处表格
    var initPunishmentoTable = function ($scope, $window, $rootScope, app, $compile, arrange_stuFullTimeInfoManageService, alertService) {
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNum: params.pageNumber  //页码
            };
            // 去除为 null 或 "" 值的查询字段
            var stuFullTimePunishmentoInfoQuery = {};
            angular.forEach($scope.stuFullTimeInfo_punishmento, function (data, index, array) {
                if (data) {
                    stuFullTimePunishmentoInfoQuery[index] = data;
                }
            });
            $rootScope.$log.debug(angular.extend(pageParam, stuFullTimePunishmentoInfoQuery));
            return angular.extend(pageParam, stuFullTimePunishmentoInfoQuery);
        }
        $scope.stuFullTimeInfoPunishmentoTable = {
            url: 'data_test/student/tableview_stuFullTimeInfo_punishmento.json',
            // url: app.api.address + '/student/stuFullTimeInfo',
            headers: {
                permission: "stuFullTimePunishmentoInfo:query"
            },
            method: 'get',
            cache: false,
            height: 700,
            toolbar: '#punishmento_toolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber: 1,
            pageList: [10, 20, 30, 50, 100], // 设置可供选择的页面数据条数
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            sortName: 'dwh', // 默认排序字段
            sortOrder: 'asc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            sortable: false, // 禁用排序
            idField: "dwh", // 指定主键列
            uniqueId: "dwh", // 每行唯一标识
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
                $compile(angular.element('#stuFullTimeInfoPunishmentoTable').contents())($scope);
            },
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#stuFullTimeInfoPunishmentoTable').contents())($scope);
            },
            columns: [
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
                {field: "rewPundate", title: '违纪日期', align: "center", valign: "middle"},
                {field: "rewPunBriefing", title: '违纪简况', align: "center", valign: "middle"},
                {field: "rewPunTypeName", title: '违纪类别', align: "center", valign: "middle"},
                {field: "rewPunSourceName", title: '处分来源', align: "center", valign: "middle"},
                {field: "rewPunName", title: '处分名称', align: "center", valign: "middle"},
                {field: "rewPunCause", title: '处分原因', align: "center", valign: "middle"},
                {field: "rewPunTime", title: '处分日期', align: "center", valign: "middle"},
                {field: "rewPunProof", title: '处分文号', align: "center", valign: "middle"},
                {field: "rewPunRepealTime", title: '处分撤销日期', align: "center", valign: "middle"},
                {field: "rewPunRepealProof", title: '处分撤销文号', align: "center", valign: "middle"},
                {field: "rewPunWheGraduate", title: '是否按时毕业', align: "center", valign: "middle"},
                {field: "rewPunWheDegree", title: '是否获得学位', align: "center", valign: "middle"},
                {field: "rewPunSponDeparName", title: '处分发起单位', align: "center", valign: "middle"},
                {field: "rewPunDeparName", title: '处分单位', align: "center", valign: "middle"},
                {field: "rewPunAdapt", title: '适用条款', align: "center", valign: "middle"},
                {field: "rewPunMoney", title: '处罚金额', align: "center", valign: "middle"},
                {field: "rewPunSchrollState", title: '学籍状态', align: "center", valign: "middle"},
                {field: "rewPunWhetherAtsch", title: '是否在校', align: "center", valign: "middle"}
            ],
            loadImmediately: true
        };
    };

    //初始化查看数据
    var initEditCondition = function ($scope, $window, $rootScope, app, $compile, $http, arrange_stuFullTimeInfoManageService, alertService) {

        // 出生日期参数配置
        $scope.bornTimeOptions = {
            opened: false,
            open: function () {
                $scope.bornTimeOptions.opened = true;
            }
        };
        //入学日期参数配置
        $scope.goSchooleTimeOptions = {
            opened: false,
            open: function () {
                $scope.goSchooleTimeOptions.opened = true;
            }
        };
        // 预计毕业日期参数配置
        $scope.expectGraduateTimeOptions = {
            opened: false,
            open: function () {
                $scope.expectGraduateTimeOptions.opened = true;
            }
        };
        // 毕业日期参数配置
        $scope.graduateTimeOptions = {
            opened: false,
            open: function () {
                $scope.graduateTimeOptions.opened = true;
            }
        };
        // 身份证件有效期参数配置
        $scope.idCardEffectTimeOptions = {
            opened: false,
            open: function () {
                $scope.idCardEffectTimeOptions.opened = true;
            }
        };
        //查询身份证证件类型
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFullTimeInfo/tableview_stuFullTimeInfo_majorType.json",
        }).then(function (response) {
            $scope.idCardTypeList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询国籍地区
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFullTimeInfo/tableview_stuFullTimeInfo_nationCode.json",
        }).then(function (response) {
            $scope.countryCodeList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
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
        //查询政治面貌数据
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFullTimeInfo/tableview_stuFullTimeInfo_politicalStatus.json",
        }).then(function (response) {
            $scope.politicalStatusList = response.data.data.list;//性别

        }, function (response) {
            console.log(response);
        });
        //查询民族数据
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFullTimeInfo/tableview_stuFullTimeInfo_nationCode.json",
        }).then(function (response) {
            $scope.nationList = response.data.data.list;//性别

        }, function (response) {
            console.log(response);
        });
        //查询学院数据
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_college.json",
        }).then(function (response) {
            $scope.deptList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询系部数据
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_college.json",
        }).then(function (response) {
            $scope.departmentList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询专业大类数据
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFullTimeInfo/tableview_stuFullTimeInfo_majorType.json",
        }).then(function (response) {
            $scope.majorTypeList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询专业方向数据
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_profession.json",
        }).then(function (response) {
            $scope.majorSubjectList = response.data.data.list;

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
            $scope.classMajorList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询班 级数据
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_class.json",
        }).then(function (response) {
            $scope.classList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询学籍状态数据
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFullTimeInfo/tableview_stuFullTimeInfo_studyStatus.json",
        }).then(function (response) {
            $scope.studyStatusList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询是否在校数据
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_atSchoolStatus.json",
        }).then(function (response) {
            $scope.schoolStatusList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询是否在籍数据
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_atSchoolStatus.json",
        }).then(function (response) {
            $scope.nationStatusList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询学习形式
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_atSchoolStatus.json",
        }).then(function (response) {
            $scope.studyFormList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询培养层次
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_atSchoolStatus.json",
        }).then(function (response) {
            $scope.developLevelList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询入学方式数据
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_entryWay.json",
        }).then(function (response) {
            $scope.schoolWayList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询生源地
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_entryWay.json",
        }).then(function (response) {
            $scope.orginCodeList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询录取方式
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_entryWay.json",
        }).then(function (response) {
            $scope.originEnrollCodeList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询曾用身份证件类型
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_entryWay.json",
        }).then(function (response) {
            $scope.oldIdCardTypeList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询婚姻状况
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_entryWay.json",
        }).then(function (response) {
            $scope.marrayStatusList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询健康状况
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_entryWay.json",
        }).then(function (response) {
            $scope.healthyStatusList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询信仰宗教
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_entryWay.json",
        }).then(function (response) {
            $scope.religionList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询血型
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_entryWay.json",
        }).then(function (response) {
            $scope.bloodTypeList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询出生地
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_entryWay.json",
        }).then(function (response) {
            $scope.bornAreaList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询籍贯
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_entryWay.json",
        }).then(function (response) {
            $scope.originPlaceList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询港澳台侨外
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_entryWay.json",
        }).then(function (response) {
            $scope.overseasList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询培养方式
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_entryWay.json",
        }).then(function (response) {
            $scope.developWayList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询授予学位类别
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_entryWay.json",
        }).then(function (response) {
            $scope.gradDegreeCodeList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询考生类别
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_entryWay.json",
        }).then(function (response) {
            $scope.examStuTypeList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });
        //查询毕业类别
        $http({
            method: "get",
            // url: "/student-status/new-student/select"
            url: "data_test/student/stuFlagInfo/tableview_stuFlagInfo_entryWay.json",
        }).then(function (response) {
            $scope.originGradTypeCodeList = response.data.data.list;

        }, function (response) {
            console.log(response);
        });

    };


})(window);