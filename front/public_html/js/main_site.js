/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready( function (e) {

    // Global
    var windowWidth = $(window).width();
    var $img = $("#top-banner-images"), i = 0, speed = 300;

    /** Load all our images for our top banner into this array */
    var images = [
        'images/stock-photo-200657659.jpg',
        'images/1391275534_nithiin.gif',
        'images/chictravelphotos-22june154-1326.jpg'
    ];

    /**
     * Controls the changing of images in our top-banner. Done at
     * set interval, currently 10secs... Changes to 30secs
     */
    window.setInterval(function() {
        $img.fadeOut(speed, function() {
            $img.attr('src', images[(++i % images.length)]);
            $img.fadeIn(speed);
        });
    }, 10000);

});


