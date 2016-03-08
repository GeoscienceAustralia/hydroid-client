(function(){
    "use strict";

    var mod = angular.module('config', []);

    mod.constant('hydroidConfig',  {
            awsRdfsUrl: '//hydroid-output.s3-website-ap-southeast-2.amazonaws.com/rdfs/',
            awsImagesUrl: '//hydroid-output.s3-website-ap-southeast-2.amazonaws.com/images/'
    })
})();