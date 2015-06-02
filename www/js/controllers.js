angular.module('starter.controllers', [])

    .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {
        // Form data for the login modal
        $scope.loginData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function () {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function () {
            $scope.modal.show();
        };

        // Perform the login action when the user submits the login form
        $scope.doLogin = function () {
            console.log('Doing login', $scope.loginData);
            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function () {
                $scope.closeLogin();
            }, 1000);
        };
    })


    .controller('GirisCtrl', function ($scope, $state, $ionicPopup, $http) {
        $scope.loginData = {username: '', password: ''};

        $scope.login = function () {
            $http({
                method: 'POST',
                url: 'http://www.app.kuaforx.com/api/uyeler/login',
                data: {email: $scope.loginData.username, sifre: $scope.loginData.password},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    var str = [];
                    for (var key in obj) {
                        if (obj[key] instanceof Array) {
                            for (var idx in obj[key]) {
                                var subObj = obj[key][idx];
                                for (var subKey in subObj) {
                                    str.push(encodeURIComponent(key) + "[" + idx + "][" + encodeURIComponent(subKey) + "]=" + encodeURIComponent(subObj[subKey]));
                                }
                            }
                        }
                        else {
                            str.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]));
                        }
                    }
                    return str.join("&");
                }
            }).success(function (response) {

                if (JSON.stringify(response).length < 4) {
                    console.log("giris yapılamadı.");
                    //alert("hata olustu...");


                    var alertPopup = $ionicPopup.alert({
                        title: "Giriş Başarısız!",
                        template: 'Bilgilerinizi kontrol ediniz ve tekrar deneyiniz.'
                    });
                    alertPopup.then(function (res) {
                        console.log('Thank you for not eating my delicious ice cream cone');
                    });

                    return;
                }

                if (validateEmail(response[0].email)) {
                    //alert(response[0].email);
                    //console.log(response[0].email);
                    window.localStorage['login'] = '1';
                    $state.go("app.anasayfa", {}, {reload: true});
                }

            });

        }

    })


    .controller('MapsCtrl', function ($scope, $state, $ionicLoading, $compile) {


        console.log('map ctrl loading');

        var configureMarker = function (mark, map) {
            var site = new google.maps.LatLng(mark.lat, mark.lng);
            var marker = new google.maps.Marker({position: site, map: map, title: mark.name});
            //alert("click eventi oluşturuluyor..");
            google.maps.event.addListener(marker, 'click', function () {

                console.log("tiklandiii.");
                alert("tiklandiii.");
                var cnt = ["<b>" + mark.name + "</b> <br/>", "" + mark.city];
                var infowindow = new google.maps.InfoWindow({
                    content: cnt.join()
                });
                infowindow.open(marker.get('map'), marker);
            });


        };

        $scope.mapCreated = function (map) {
            console.log('map created');
            $scope.map = map;


            var data = [
                {lat: 43.07493, lng: -89.381388, name: "Firma X", city: "Warszawa", address1: "", address2: ""},
                {lat: 43.04993, lng: -89.441388, name: "Inna firma", city: "Warszawa", address1: "", address2: ""},
                {lat: 43.03493, lng: -89.531388, name: "FirmaZ", city: "Poznań", address1: "", address2: ""},
                {lat: 42.97393, lng: -89.841388, name: "ATO Firma sp zoo", city: "Wrocław", address1: "", address2: ""},
                {
                    lat: 42.94238,
                    lng: -88.883211,
                    name: "X i Y oraz synowie, oops córki",
                    city: "Poznań",
                    address1: "",
                    address2: ""
                },
                {lat: 42.95321, lng: -88.992839, name: "Chromosom ltd", city: "Rzeszów", address1: "", address2: ""}
            ]

            for (var i = 0; i < data.length; i++) {
                configureMarker(data[i], map);

            }
            ;

            $scope.map.setCenter(new google.maps.LatLng(data[0].lat, data[0].lng));

            /*
             $http.get('http://localhost:3000/companies')
             .success(function(data, status, headers, config) {
             console.log('got data', data);
             for (var i=0; i<data.length; i++) {
             configureMarker(data[i], map);

             };
             $scope.map.setCenter(new google.maps.LatLng(data[0].lat, data[0].lng));
             })
             .error(function(data, status, headers, config) {
             console.log('got error', arguments);
             });
             */

            //$scope.centerOnMe();
        };

        $scope.centerOnMe = function () {
            console.log("Centering");
            if (!$scope.map) {
                return;
            }

            $scope.loading = $ionicLoading.show({
                content: 'Getting current location...',
                showBackdrop: false
            });

            navigator.geolocation.getCurrentPosition(function (pos) {
                console.log('Got pos', pos);
                $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
                $scope.loading.hide();
            }, function (error) {
                alert('Unable to get location: ' + error.message);
            });
        };


    })

    .controller('AnasayfaCtrl', function ($scope, $state, $ionicPopup) {

        $scope.$on('$ionicView.enter', function () {
            console.log(angular.toJson($scope.loginData));
            console.log("ppp");
        });

        var login = window.localStorage['login'] || '0';
        if (login == '0') {
            $state.go("giris", {}, {reload: true});
        }

        $scope.cikis = function () {
            window.localStorage['login'] = '0';
            $state.go("giris", {}, {reload: true});
        }

    })

    .controller('IlListesiCtrl', function ($scope, $state, $http, Service_Il,Api) {

        Api.getIlListesi("adres/get_il",function(data) {
            $scope.iller = data;
        })

        $scope.rowClick = function (il) {
            var i = {
                id: il.ilID,
                'name': il.ilID,
                'email': 'hello@gmail.com',
                'phone': '123-2343-44'
            }
            Service_Il.add(i);
            console.log(Service_Il.get(0));

        }

    });



