/*
 * Created by Status O'Brien on 23/05/17.
 *
 * This file contains all the information for our header. Includes
 * all the resize functionality, position and general information regarding
 * the header
 */

$(document).ready(function () {

    // Main Globals
    var $windowWidth = $(window).width();
    var $windowHeight = $(window).height();
    var dropdownMenuImageInterval = 0, i = 1, speed = 300, interval_time = 2000;

    /**
     * Use this funciton to change and display the image within the
     * dropdown menu to suit the category you are currently looking at,
     * We will copy this for the women and kids sections, which are
     * the two functions posted below.
     */
    $(".men-cat-items").hover(function () {
        clearDropdownImage();

        var catItem = $(this).text().toLowerCase();
        var dir = 'images/';
        var img = $('#dropdown_image');

        switch (catItem) {
            case 'shoes':
                dir += 'mens-shoes/shoes';
                break;
            case 'shirts':
                dir += 'mens-shirts/cs';
                break;
        }

        displayDropdownImages(img, dir, $(this));
    });

    /**
     * Same as .men-cat-items function, should be above this function
     */
    $(".women-cat-items").hover(function () {
        var catItem = $(this).text().toLowerCase();
        var dir = 'dropdown_images/';
        var img = $('#women_dropdown_img');
        switch (catItem) {
            case 'shoes':
                dir += catItem + '1.jpg';
                break;
        }
        img.attr('src', dir);
        img.fadeIn(300);
        // img.height($originalDropdownHeight / 1.5);

    });

    /**
     * Controls the opening and closing of our drop-down menu,
     */
    $(".mega-dropdown").hover(function () {
        // remove the image in the dropdown
        clearDropdownImage();


        // show the menu
        $(this).children('ul').show();

        // now that we are inside the dropdown menu, we can
        // set the spacing of the items inside to be exact

    }, function () {
        $(this).children('ul').hide();
    });

    /************************************************
     ************* LOG IN/OUT FUNCTIONS *************
     ************************************************/
    $('.error').hide();

    /**
     * Stops modal from auto opening, and opens the modal
     */
    $('#login-modal').dialog({
        autoOpen: true
    });

    $('.btn-login').on('click', function () {
        // validate the form. pass the correct information
        // to the server. If the server invalidates
        // display the error

        $('.login-register').addClass('fa fa-user');
        $('.login-register').text('');

        // we also would like to change the login/register button to a logged in image
        $('.error').show();
    })

    /**
     * Because we removed the exit button, we have to do
     * this manually.
     */
    $('.close').on('click', function () {
        $('.error').hide(); // just in case it was not reset

        $('#login-modal').dialog('close');
    });

    /**
     * Display the register input fields, remove the
     * login input fields
     */
    $('#register-btn').on('click', function () {
        $('.loginBox').hide();
        $('.registerBox').show();
        $('.login-footer').hide();
        $('.register-footer').show();
    });
    /** The opposite to the above method */
    $('#login-btn').on('click', function () {
        $('.registerBox').hide();
        $('.loginBox').show();
        $('.register-footer').hide();
        $('.login-footer').show();
    });

    /************************************************
     ************* SEARCH BAR FUNCTIONS *************
     ************************************************/

    /**
     * Query the search when the user presses the enter button.
     * This is an alternative to onClick
     */
    $('.search-form-control').keypress(function (e) {
        if (e.which == 13 && validateSearchInput()) {
            // process the information
            var query = $(this).val().toLowerCase();
            // call the appropriate function
            postSearchQuery(query);
        }
    });

    /**
     * When the user clicks on the search bar area, all the text will
     * clear from the input
     */
    $('.search-form-control').on('click', function (){
       $(this).val('');
    });

    /**
     * Query the search when the user clicks the icon.
     * This is an alternative to 'enter' keypress
     */
    $('.fa-search').on('click', function () {
        // instantly return if the search bar is empty
        validateSearchInput();

        // user has clicked the search icon,
        var query = $(this).val().toLowerCase();

        // call the appropriate function
        postSearchQuery(query);
    });

    $('.fa-shopping-cart').hover( function () {
        // call function to retrieve kart items
        getUserKartItems();
    });

    /************************************************
     *********** SPECIAL FUNCTION CALLS *************
     ***********   AND HELPER METHODS   *************
     ************************************************/

    /**
     * This function sets our drop down menu to be
     * a specific size, we will also use this function
     * when the window changes its size
     */
    function dropdownMenuInitialSize() {

        var dropDownHeight = $('.row').height();
        var newHeight = $('#header-flash-image').height() - $('.navbar').height();

        $('.mega-dropdown-menu').height(newHeight);
        $('.mega-dropdown-menu').width($windowWidth);
        return dropDownHeight;
    }

    /**
     * Controls the positioning of the columns inside
     * the drop-down menu. Places our items in a nice
     * manner
     */
    function dropdownMenuInsideSpacing() {
        var classesLength = $('.col-sm-3').length;
        var colsWidth = $('.col-sm-3').width();
        var colsHeight = $('.mega-dropdown-menu').height();
        var width = ($windowWidth - (colsWidth * classesLength)) / 2;
        var height = (colsHeight - $originalDropdownHeight) / 2;

        $('.mega-dropdown-menu').children('li').children('ul').css({
            'padding-right': width + 'px',
            'padding-top': height + 'px',
            'padding-bottom': height + 'px'
        });
    }

    /**
     * Removes the dropdown image that is displayed in the dropdown
     * menu.
     */
    function clearDropdownImage() {
        clearInterval(dropdownMenuImageInterval);
        $('#dropdown_image').attr('src', '');
        $('#dropdown_image').attr('alt', '');
    }

    /**
     * Helper Method:
     * Used for setting a picture to change at a given
     * time interval
     */
    function displayDropdownImages(img, dir, $this) {
        // we give it an image first
        img.attr('src', dir + '1.jpg');
        img.attr('alt', $this.text() + ' goes here');

        // now we set its interval for the image to change
        dropdownMenuImageInterval = setInterval(function () {
            img.fadeOut(speed, function () {
                if (i == 7) {
                    i = 0;
                }
                img.attr('src', dir + (++i) + '.jpg');
                img.attr('alt', $(this).text() + ' goes here');
                img.fadeIn();
            });
        }, interval_time);
    }

    /**
     * Validates the search input given by the user
     */
    function validateSearchInput() {
        var query = $('.search-form-control').val().toLowerCase();
        if (query == '') {
            alert('empty string') // error check for now (testing)
            return false;
        }
        // will also need to check against XSS
        return true;
    }

    function postSearchQuery(query) {
        $.ajax ({
            url: 'http://localhost:3000/search',
            type: 'GET',
            data: JSON.stringify({
                item: query
            }),
            contentType: "application/json",
            dataType: "json"
        });
    }

    /**
     * Ajax call to retrieve all the information regarding the users kart,
     * possibly need to send them the user...
     */
    function getUserKartItems() {
        $.ajax ({
            url: 'http://localhost:3000/kart_items',
            type: 'GET',

            error: function (err) {
                // User must sign in to access kart
                return;
            }
        }).then(displayKartItems);
    }

    /**
     * Displays the list within our kart items dropdown menu.
     * @param rows
     */
    function displayKartItems (rows) {
        // access items by name, description, etc
        if (rows.length <= 0)
            return;

        // needs to be more accurately defined
        if ($('#kart-user-items').children().length > 0)
            return;

        var totalPrice = 0;

        var i;
        for (i=0; i<rows.length; i++) {

            // combine total price
            totalPrice += rows[i].price;

            var kartHTML = '' +
                '<li>' +
                '   <span class="item">' +
                '      <span class="item-left">' +
                '          <img id="kart-item-img" src="' + rows[i].imagesource + '" alt="" />' +
                '          <span class="item-info">' +
                '              <span class="item-name"></span>' +
                '              <span class="item-price"></span>' +
                '          </span>' +
                '      </span>' +
                '      <span class="item-right">' +
                '          <button class="btn btn-xs btn-danger pull-right"><i class="fa fa-trash-o"></i> </button>' +
                '      </span>' +
                '   </span>' +
                '</li>';

            var newItem = $(kartHTML);
            newItem.find('.item-name').text(rows[i].name);
            newItem.find('.item-price').text(rows[i].price);

            newItem.hide();
            $('#kart-user-items').prepend(newItem);
            newItem.show('clip',250).effect('highlight',1000);
        }

        // append 'view cart' to the back
        var endKartHTML = '' +
            '<li class="divider"></li>' +
            '<li><a class="text-center" href="/login">View Cart</a></li>';
        $('#kart-user-items').append(endKartHTML);
    }
});

