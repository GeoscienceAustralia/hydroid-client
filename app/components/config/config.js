(function(){
    "use strict";

    var mod = angular.module('config', []);

    mod.constant('hydroidConfig',  {
        s3BundlesUrl: '/api/download/bundle/',
        solrUrl: '/solr',
        solrCollection:'hydroid',
        menuUrl: '/data/menu.json'
    })
    
})();