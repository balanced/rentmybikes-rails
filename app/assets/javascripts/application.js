// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery.min.js
//= require main.js
//= require_self

var csrf = '54cb4ff6c29811e2b033026ba7cd33d0';
var marketplaceUri = '/v1/marketplaces/TEST-MP2UYf5pQkWiYblaPeZT42rJ';
//  kick everything off when jquery is ready
$(function () {
    rentmybike.init({
        csrfToken:csrf,
        marketplaceUri:marketplaceUri
    });
});

