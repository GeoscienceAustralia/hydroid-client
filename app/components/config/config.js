(function(){
    "use strict";

    var mod = angular.module('config', []);

    mod.constant('hydroidConfig',  {
            s3RdfsUrl: '//hydroid-output.s3-website-ap-southeast-2.amazonaws.com/rdfs/',
            s3ImagesUrl: '//hydroid-output.s3-website-ap-southeast-2.amazonaws.com/images/',
            s3BundlesUrl: '/api/download/bundle/'
    })
})();