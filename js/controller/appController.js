;(function (window, undefined) {
    'use strict';
    
    hiocsApp.controller('hiocsCtr', ['$rootScope', '$scope', '$q', '$localStorage', function ($rootScope, $scope, $q, $localStorage) {
        $rootScope.$log.debug("app controller run ...");
        var _this = this;
        _this.getLoginUser = function () {
            var deferred = $q.defer();
            return deferred.promise;
        };
        _this.getLoginUser();

        // 左侧菜单栏收缩
        $rootScope.$storage = $localStorage.$default({
            thinLeftNav: false
        });
        _this.toggleThinLeftNav = function () {
            $rootScope.$log.debug("toggleThinLeftNav thinLeftNav: " + $rootScope.$storage.thinLeftNav);
            $rootScope.$storage.thinLeftNav = !$rootScope.$storage.thinLeftNav;
            $localStorage.thinLeftNav = $rootScope.$storage.thinLeftNav;
        };

        // 底部导航栏列表
        $rootScope.bottomNavItems = [
            {
                "id": "plan_item",
                "name": "培养方案",
                "child": [
                    {
                        "name": "培养方案编制控制",
                        "href": "common.planPreparedControl"
                    },
                    {
                        "name": "培养方案编制审批流程设置",
                        "href": "common.planPreparedApprovalProcessSetting"
                    },
                    {
                        "name": "培养方案编制审批流程监控",
                        "href": "common.planPreparedApprovalProcessMonitor"
                    }
                ]
            }
        ];

        //关闭所有窗口
        $scope.closeAllWindows = function () {
            $rootScope.bottomNavItems = [];
        }

        //移除当前项
        $scope.removeThisItem = function(name){
            if($rootScope.bottomNavItems[0].child.length == 1){
                $rootScope.bottomNavItems = [];
                return;
            }
            for(var i=0; i<$rootScope.bottomNavItems[0].child.length; i++){
                if(name === $rootScope.bottomNavItems[0].child[i].name){
                    $rootScope.bottomNavItems[0].child.splice(i,1);
                    console.log($rootScope.bottomNavItems[0].child);
                }
            }
        }
        
    }]);

})(window);
