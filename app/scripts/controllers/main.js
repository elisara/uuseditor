'use strict';

angular.module('imageEditorApp')
    .controller('MainCtrl', function ($scope) {
        //your friend: console.log();

        $scope.setImageFile = function (element) {
            //$scope.init();
            var reader = new FileReader();
            reader.onload = function (e) {
                $scope.image.src = e.target.result;

            };
            reader.readAsDataURL(element.files[0]);
            $scope.image.onload = $scope.resetImage;


        };
        $scope.init = function () {
            //initialize default calues for variables
            $scope.brightness = 0;
            $scope.contrast = 1;
            $scope.strength = 1;
            $scope.color = {
                red: 0,
                green: 0,
                blue: 0
            };
            $scope.autocontrast = false;
            $scope.vignette = false;
            $scope.canvas = angular.element('#myCanvas')[0];
            $scope.ctx = $scope.canvas.getContext("2d");
            $scope.image = new Image();
            $scope.vignImage = new Image();


        };

        $scope.init();

        $scope.resetImage = function () {
            //when image data is loaded(after onload) put the data into canvas element 
            $scope.canvas.width = $scope.image.width;
            $scope.canvas.height = $scope.image.height;
            $scope.ctx.drawImage($scope.image, 0, 0, $scope.canvas.width, $scope.canvas.height);

            $scope.imageData = $scope.ctx.getImageData(0, 0, $scope.canvas.width, $scope.canvas.height);
            $scope.pixels = $scope.imageData.data;
            $scope.numPixels = $scope.imageData.width * $scope.imageData.height;


            if ($scope.vignImage.src === '') {
                $scope.vignImage.onload = resetVign;
                $scope.vignImage.src = 'images/vignette.jpg';

            }
            


        };

        $scope.applyFilters = function () {
            $scope.resetImage();

            changeBrightness();
            changeContrast();
            tint();
            
            if ($scope.vignette) {
                setVignette();
            }

            $scope.ctx.clearRect(0, 0, $scope.canvas.width, $scope.canvas.height);
            $scope.ctx.putImageData($scope.imageData, 0, 0);
        };


        var changeBrightness = function () {

            var value = parseInt($scope.brightness);

            for (var i = 0; i < $scope.numPixels; i++) {
                $scope.pixels[i * 4] = $scope.pixels[i * 4] + value; // Red
                $scope.pixels[i * 4 + 1] = $scope.pixels[i * 4 + 1] + value; // Green
                $scope.pixels[i * 4 + 2] = $scope.pixels[i * 4 + 2] + value; // Blue
            }

        };


        var changeContrast = function () {
            var value2 = parseFloat($scope.contrast);

            for (var i = 0; i < $scope.numPixels; i++) {
                $scope.pixels[i * 4] = ($scope.pixels[i * 4] - 128) * value2 + 128; // Red
                $scope.pixels[i * 4 + 1] = ($scope.pixels[i * 4] - 128) * value2 + 128; // Green
                $scope.pixels[i * 4 + 2] = ($scope.pixels[i * 4] - 128) * value2 + 128; // Blue
            }

        };


        var tint = function () {

            for (var i = 0; i < $scope.numPixels; i++) {
                $scope.pixels[i * 4] = $scope.pixels[i * 4] + $scope.color.red * $scope.strength / 100; // Red
                $scope.pixels[i * 4 + 1] = $scope.pixels[i * 4 + 1] + $scope.color.green * $scope.strength / 100; // Green
                $scope.pixels[i * 4 + 2] = $scope.pixels[i * 4 + 2] + $scope.color.blue * $scope.strength / 100; // Blue
            }

        };


        var resetVign = function () {
            var cn = document.createElement('canvas');
            cn.width = $scope.image.width;
            cn.height = $scope.image.height;

            var ctx = cn.getContext('2d');
            ctx.drawImage($scope.vignImage, 0, 0, $scope.vignImage.width, $scope.vignImage.height, 0, 0, cn.width, cn.height);
            
            $scope.vignData = ctx.getImageData(0, 0, cn.width, cn.height);
            $scope.vignPixels = $scope.vignData.data;

        };


        var setVignette = function () {

            for (var i = 0; i < $scope.numPixels; i++) {
                $scope.pixels[i * 4] = $scope.pixels[i * 4] * $scope.vignPixels[i * 4] / 255; // Red
                $scope.pixels[i * 4 + 1] = $scope.pixels[i * 4 + 1] * $scope.vignPixels[i * 4 + 1] / 255; // Green
                $scope.pixels[i * 4 + 2] = $scope.pixels[i * 4 + 2] * $scope.vignPixels[i * 4 + 2] / 255; // Blue
            }

        };


        $scope.saveImage = function () {
            var saveAsDataUrl = $scope.canvas.toDataURL('image/png');
            $scope.url = saveAsDataUrl;

        };

    })

.config(function ($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|coui|data):/);

});