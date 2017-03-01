/**
Core script to handle the entire theme and core functions
**/

var aperture;
var shutter;
var iso;

var currMode = 0;
var videoOn = 0;
var power = 1;


var availMode = ["Program Auto", "Shutter", "Aperture"];
var availModeDisplay = ["P", "TV", "AV"];
var availAperture;
var availShutter;
var availISO;

var QuickSidebar = function () {

    // Handles quick sidebar toggler
    var handleQuickSidebarToggler = function () {
        // quick sidebar toggler
        $('.dropdown-quick-sidebar-toggler a, .page-quick-sidebar-toggler, .quick-sidebar-toggler').click(function (e) {
            $('body').toggleClass('page-quick-sidebar-open'); 
        });
    };


    var handleSettingChange = function () {
        var wrapper = $('.page-quick-sidebar-wrapper');
        var wrapperChat = wrapper.find('.page-quick-sidebar-chat');

        var initChatSlimScroll = function () {
            var chatUsers = wrapper.find('.page-quick-sidebar-chat-users');
            var chatUsersHeight;

            chatUsersHeight = wrapper.height() - wrapper.find('.nav-tabs').outerHeight(true);

            // chat user list 
            App.destroySlimScroll(chatUsers);
            chatUsers.attr("data-height", chatUsersHeight);
            App.initSlimScroll(chatUsers);

            var chatMessages = wrapperChat.find('.page-quick-sidebar-chat-user-messages');
            var chatMessagesHeight = chatUsersHeight - wrapperChat.find('.page-quick-sidebar-chat-user-form').outerHeight(true);
            chatMessagesHeight = chatMessagesHeight - wrapperChat.find('.page-quick-sidebar-nav').outerHeight(true);

            // user chat messages 
            App.destroySlimScroll(chatMessages);
            chatMessages.attr("data-height", chatMessagesHeight);
            App.initSlimScroll(chatMessages);
        };

        initChatSlimScroll();
        App.addResizeHandler(initChatSlimScroll); // reinitialize on window resize

        wrapper.find('.page-quick-sidebar-chat-users .media-list > .selMode').click(function () {
            $("#nav_title").text("Mode");   
            var ci = availMode.indexOf(currMode);
            generateSettingHTML(availModeDisplay, ci, "setMode", 0);
            console.log("selected mode settings");

            wrapperChat.addClass("page-quick-sidebar-content-item-shown");
        });

        wrapper.find('.page-quick-sidebar-chat-users .media-list > .selAperture').click(function () {
            $("#nav_title").text("Aperture");   
            var ci = availAperture.indexOf(aperture);
            var lb = ci - 5;
            var hb = ci + 5;
            if (ci - 5 < 0) {
                lb = 0;
            }
            if (ci + 5 > availAperture.length - 1) {
                hb = availAperture.length - 1;
            }
            generateSettingHTML(availAperture.slice(lb, hb), ci, "setAperture", lb);

            wrapperChat.addClass("page-quick-sidebar-content-item-shown");
        });

        wrapper.find('.page-quick-sidebar-chat-users .media-list > .selShutter').click(function () {
            $("#nav_title").text("Shutter");
            var ci = availShutter.indexOf(shutter);
             console.log(ci);
            var lb = ci - 5;
            var hb = ci + 5;
            if (ci - 5 < 0) {
                lb = 0;
            }
            if (ci + 5 > availShutter.length - 1) {
                hb = availShutter.length - 1;
            }
            // console.log(lb + " "+ hb + " " + ci + " " +  availShutter.slice(lb, hb));
            generateSettingHTML(availShutter.slice(lb, hb), ci, "setShutter", lb);

            wrapperChat.addClass("page-quick-sidebar-content-item-shown");
        });

        wrapper.find('.page-quick-sidebar-chat-users .media-list > .selISO').click(function () {
            $("#nav_title").text("ISO");
            var ci = availISO.indexOf(iso);  
            var lb = ci - 5;
            var hb = ci + 5;
            if (ci - 5 < 0) {
                lb = 0
            }
            if (ci + 5 > availISO.length - 1) {
                hb = availISO.length - 1;
            }
            generateSettingHTML(availISO.slice(lb, hb), ci, "setISO", lb);
            wrapperChat.addClass("page-quick-sidebar-content-item-shown");
        });

        wrapper.find('.page-quick-sidebar-chat-user .list-settings > .setting').click(function (e) {

            console.log($(this).attr('value') + $(this).attr('function'));

            e.preventDefault();
            var clickedButton = e.target;
            var setting = $(this).attr('function');
            var value = $(this).attr('value');
            if (setting == "setMode") {
                var valIndex = availModeDisplay.indexOf(value);
                value = availMode[valIndex];
            }

            var request = new XMLHttpRequest();
            request.open("GET", "/" + setting +"/" + value, true);
            request.send();
            updateDataValues();

            wrapperChat.removeClass("page-quick-sidebar-content-item-shown");
        });


        wrapper.find('.page-quick-sidebar-chat-user .page-quick-sidebar-back-to-list').click(function () {
            $("#nav_title").text("Settings");    
            wrapperChat.removeClass("page-quick-sidebar-content-item-shown");
        });

        

        var generateSettingHTML = function(options, current, setting, lb) {
            var htmlResult = "";
            for (i = 0; i < options.length; i++) {
                if (current != i + lb) {
                    htmlResult += '<li class="media setting" value=' + options[i] + ' function= ' + setting + '><div class="media-body"><h4 class="media-heading">' + options[i] + '</h4></div></li>';
                } else {
                    htmlResult += '<li class="media setting" value=' + options[i] + ' function= ' + setting + '><div class="media-body"><h4 class="media-heading">' + options[i] + '</h4><div class="media-heading-sub"> Current </div></div></li>'; 
                }

            }
  
             $("#setting_html").html(htmlResult);  
             handleSettingChange();

                                
        };


    };

    var setupVideoButtonCallback = function() {
        var switchModeButton = document.querySelector('.switchModeButton')
        switchModeButton.addEventListener("click", function(e) {
            e.preventDefault();
            var request = new XMLHttpRequest();
            console.log("Clicked button to switch mode");
            if (currMode == 1) {
                $("#switch_button_text").text("Switch to Video Mode");
                
                request.open("GET", "/setPictureMode", true);
                currMode = 0;

            } else {
                $("#switch_button_text").text("Switch to Picture Mode");
                request.open("GET", "/setVideoMode", true);
                currMode = 1;
            }
            request.send();
        });


        var recordButton = document.querySelector('.recordButton');
        recordButton.addEventListener("click", function(e) {
            e.preventDefault();
            var request = new XMLHttpRequest();
            if (currMode == 1) {

                if (videoOn == 0) {
                    console.log("Clicked button to take Video");
                    $(".recordButton").removeClass("icon-control-play");
                    $(".recordButton").addClass("icon-control-pause");
                    request.open("GET", "/takeVideo", true);
                    request.send();
                    videoOn = 1;
                } else {
                    console.log("Clicked button to stop Video");
                    $(".recordButton").removeClass("icon-control-pause");
                    $(".recordButton").addClass("icon-control-play");
                    request.open("GET", "/stopVideo", true);
                    request.send();
                    videoOn = 0;
                }
            } else {
                console.log("Clicked button to take picture");
                request.open("GET", "/takePicture", true);
                request.send();
            }

        });
    };

    var updateDataValues = function() {
        // aperture = "4.2";
        // shutter = "1/20";
        // iso = "400";
        // currMode = "Shutter";
        // $("#aperture").text(aperture);
        // $("#shutter").text(shutter);
        // $("#iso").text(iso);
        // $("#mode").text(availModeDisplay[availMode.indexOf(currMode)]);
        // $("#power_setting").text("Turn Off");

        $SCRIPT_ROOT = "";
        $.getJSON($SCRIPT_ROOT+"/_data", function(data) {
            console.log("Recievd Data:");
            console.log(data);


            currMode = data.mode[0];

            if (currMode == 0) {
                $("#switch_button_text").text("Switch to Picture Mode");
            } else {
                $("#switch_button_text").text("Switch to Video Mode");
            }

            if (power == 0) {
                $("#power_setting").text("Turn On");
            } else {
                $("#power_setting").text("Turn Off");
            }

            availAperture = data.avail_aperture;
            availISO = data.avail_iso;
            availShutter = data.avail_shutter;

            aperture = data.aperture;
            shutter = data.shutter;
            iso = data.iso;

            console.log(availAperture);

            $("#aperture").text(aperture);
            $("#shutter").text(shutter);
            $("#iso").text(iso);
            $("#mode").text(availModeDisplay[availMode.indexOf(currMode)]);
        });
        setTimeout(updateDataValues, 5000);

    };

    return {

        init: function () {
            //layout handlers
            handleSettingChange();
            setupVideoButtonCallback();
            handleQuickSidebarToggler();
            updateDataValues();
        }
    };

}();

if (App.isAngularJsApp() === false) { 
    jQuery(document).ready(function() {    
       QuickSidebar.init(); // init metronic core componets
    });
}