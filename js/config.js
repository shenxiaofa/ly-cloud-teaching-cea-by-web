;(function (window, undefined) {
    'use strict';

    hiocsApp.constant('app', {
        debug: false, // 是否开启调试模式
        api: {
            address: "",
            // address: "http://192.168.30.152:10000",
            // 响应代码
            code: {
                success: 200, // 成功
                unauthorized: 401, // 未授权，http 级别
                notLogin: 10, // 未登录
                notPrivilege: 12 // 未授权
            },
            message: {
                error: "系统异常，请联系管理员！",
                session: {
                    timeout: "前端session会话超时，请重新登录"
                }
            },
            session: {
                intervalCheck: 3, // 间隔检查时间，单位为秒，3秒
                idleTime: 1800 // 过期时间，单位为秒，30分钟
            }
        },
        date: {
            format: 'yyyy-MM-dd HH:mm:ss',
            formatDate: 'yyyy-MM-dd'
        },
        user: {
            type: {
                teacher: '0',
                student: '1'
            },
            loginStatus: {
                login: 1,
                logout: 0
            }
        },
        baseinfo: {
            prefix: '/base-manage'  // 基础资源 ui 的 url 前缀
        },
        rabbitmq: {
            logExchange: 'logExchange',
            hostname: '192.168.30.153', // 开发环境
            //hostname: '192.168.30.154', // 测试环境
            //hostname: '202.205.127.124', // 生产环境
            username: 'log',
            password: 'log123456'
        },
        excel: {
            ext: '.xls'
        }
    });

    // 请求拦截
    hiocsApp.factory('userInterceptor', ['$rootScope', '$q', 'app', function($rootScope, $q, app){
        return {
            // 请求之前切入
            'request': function(config) {
                $rootScope.$emit('refreshLastAccessTime');
                return config;
            },
            // 请求响应失败时切入
            'responseError': function(rejection) {
                $rootScope.$log.debug("userInterceptor responseError run ...");
                if (rejection.status == app.api.code.unauthorized) {
                    var errorCode = rejection.data.code + '';
                    errorCode = parseInt(errorCode.substr(errorCode.length - 3, 3));
                    if (errorCode == app.api.code.notPrivilege) {
                        // 若未授权，则提示
                        $rootScope.$emit('userIntercepted', 'notPrivilege', rejection.data.message);
                    } else {
                        // 若未登录，则跳转到登录页面
                        $rootScope.$emit('userIntercepted', 'notLogin', rejection.data.message);
                    }
                    return;
                }
                return $q.reject(rejection);
            }
        };
    }]);

    hiocsApp.config(['$logProvider', '$httpProvider', 'app', function ($logProvider, $httpProvider, app) {
        $logProvider.debugEnabled(true); // 启用打印日志
        // 若关闭调试模式，则启用拦截器
        if (!app.debug) {
            $httpProvider.interceptors.push('userInterceptor'); // 请求拦截
        }
    }]);

})(window);