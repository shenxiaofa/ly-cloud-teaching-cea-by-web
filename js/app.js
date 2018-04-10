;(function (window, undefined) {
    'use strict';

    window.hiocsApp = angular.module('hiocsApp',[
        'ui.router',
        'ncy-angular-breadcrumb',
        'ui.load',
        'ui.jq',
        'oc.lazyLoad',
        'ngAnimate',
        /*'pasvaz.bindonce',*/
        'ngLocale',
        'ui.bootstrap',
        'ng-scroll-bar',
        'ngStorage',
        'uuid4',
        /*'ngclipboard',*/
        'ngCookies',
        'uiSwitch',
        'ngSanitize',
        'angularFileUpload'
    ]);
    
})(window);