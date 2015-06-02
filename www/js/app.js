// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.directives'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }


        });
    })


    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('giris', {
                url: '/giris',
                templateUrl: 'templates/giris.html',
                controller: 'GirisCtrl'
            })

            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: 'AppCtrl'
            })

            .state('app.anasayfa', {
                url: "/anasayfa",
                views: {
                    'menuContent': {
                        templateUrl: "templates/anasayfa.html",
                        controller: 'AnasayfaCtrl'
                    }
                }
            })

            .state('app.maps', {
                url: "/maps",
                views: {
                    'menuContent': {
                        templateUrl: "templates/maps.html",
                        controller: 'MapsCtrl'
                    }
                }
            })

            .state('app.il_listesi', {
                url: "/il_listesi",
                views: {
                    'menuContent': {
                        templateUrl: "templates/il_listesi.html",
                        controller: 'IlListesiCtrl'
                    }
                }
            })

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/anasayfa');
    })

    .factory("transformRequestAsFormPost",
    function () {

        // I prepare the request data for the form post.
        function transformRequest(data, getHeaders) {
            var headers = getHeaders();
            headers["Content-type"] = "application/x-www-form-urlencoded; charset=utf-8";
            return ( serializeData(data) );
        }


        // Return the factory value.
        return ( transformRequest );
        // ---
        // PRVIATE METHODS.
        // ---
        // I serialize the given Object into a key-value pair string. This
        // method expects an object and will default to the toString() method.
        // --
        // NOTE: This is an atered version of the jQuery.param() method which
        // will serialize a data collection for Form posting.
        // --
        // https://github.com/jquery/jquery/blob/master/src/serialize.js#L45
        function serializeData(data) {
            // If this is not an object, defer to native stringification.
            if (!angular.isObject(data)) {
                return ( ( data == null ) ? "" : data.toString() );
            }

            var buffer = [];
            // Serialize each key in the object.
            for (var name in data) {
                if (!data.hasOwnProperty(name)) {
                    continue;
                }
                var value = data[name];
                buffer.push(
                    encodeURIComponent(name) + "=" + encodeURIComponent(( value == null ) ? "" : value)
                );
            }
            // Serialize the buffer and clean it up for transportation.
            var source = buffer.join("&").replace(/%20/g, "+");
            return ( source );

        }

    })

    .service('Service_Il', function ($http) {

        var ilList = [];
        this.add = function (il) {
            ilList.push(il);
        }

        this.get = function (id) {
            return ilList[0];
        }

        this.getIlListesi = function () {

            var url = base_url() + "adres/get_il";

            $http.get(url).then(function (resp) {
                return resp.data;


            }, function (err) {
                console.error('ERR', err);
                return [];
                // err.status will contain the status code
            })
        }

    })

    .factory("Api", function ($http) {

        return {

            getIlListesi: function (url,success) {
                $http({
                    url: base_url()+ url,
                    method: "GET",
                    params: {}
                })
                    .success(function (data) {

                        success(data)

                    });
            }
        }
    })

    .run(function ($rootScope, $state) {

        $rootScope.$on('$stateChangeStart', function (event, next, nextParams, fromState) {
            //$state.go("giris", {}, {reload: true});
            //console.log("stateChangeStart---111");

            var login = window.localStorage['login'] || '0';
            var login_redirect = window.localStorage['login_redirect'] || '0';
            if (login_redirect == '0') {
                if (login == '0') {
                    $state.go("giris", {}, {reload: true});
                    window.localStorage['login_redirect'] = '1';
                    //console.log("1");
                }
            }


        });
    });

