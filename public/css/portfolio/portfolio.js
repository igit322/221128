$(window).load(function () {
    $("#load").hide();
  });
  
  $(document).ready(function () {
    const more = "more";
    const close = "close";
    const boximg = ".box img";
    const up = ".up";
    if (window.matchMedia("screen and (max-width: 768px)").matches)
      $(function () {
        $(boximg).hide();
        $(boximg).slice(0, 4).show();
      });
    if (window.matchMedia("screen and (max-width: 480px)").matches)
      $(function () {
        $(boximg).hide();
        $(boximg).slice(0, 1).show();
      });
  

  
    const menu = ".so";
    const fadeOut = "magictime fadeOut";
    const fadeIn = "magictime fadeIn";
  
    $(".ham").click(function () {
      if ($(menu).hasClass(more)) {
        $(menu).addClass(fadeOut);
        setTimeout(function () {
          $(menu).addClass(close).removeClass(more);
        }, 500);
      } else if ($(menu).hasClass(close)) {
        $(menu).removeClass(fadeOut);
        $(menu).addClass(fadeIn);
        $(menu).addClass(more).removeClass(close);
      }
  
      $("header #gon nav>ul ul a").click(function () {
        $(menu).addClass(fadeOut);
        setTimeout(function () {
          $(menu).addClass(close).removeClass(more);
        }, 500);
      });
    });
  });
  