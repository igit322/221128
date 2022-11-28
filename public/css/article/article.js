$(window).load(function () {
  $("#load").hide();
});

$(document).ready(function () {
  //  네비바 햄버거
  $(".ham").click(function () {
    if ($(".so").hasClass("more")) $(".so").addClass("magictime fadeOut");
    else if ($(".so").hasClass("close"))
      $(".so").removeClass("magictime fadeOut");
  });
  //
  $(".ham").click(function () {
    if ($(".so").hasClass("close")) {
      $(".so").addClass("magictime fadeIn");
      $(".so").addClass("more").removeClass("close");
    } else if ($(".so").hasClass("more")) {
      setTimeout(function () {
        $(".so").addClass("close").removeClass("more");
      }, 500);
    }
  });
});
