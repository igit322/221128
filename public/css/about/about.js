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

  $(".arrow").click(function () {
    if ($(up).hasClass(more)) {
      $(up).addClass(close).removeClass(more);
      if (window.matchMedia("screen and (max-width: 480px)").matches) {
        $(boximg).slice(1, 10).hide();
        let location = document.querySelector("#certi").offsetTop;
        $("html,body").animate({ scrollTop: location }, 0);
      } else {
        $(boximg).slice(4, 10).hide();
        let location = document.querySelector("#certi").offsetTop;
        $("html,body").animate({ scrollTop: location }, 0);
      }
    } else if ($(up).hasClass(close)) {
      $(up).removeClass(close).addClass(more);
      if (window.matchMedia("screen and (max-width: 480px)").matches)
        $(boximg).slice(1, 10).show();
      else $(boximg).slice(4, 10).show();
    }
  });

  $(window).resize(function () {
    if ($(window).width() > 768) {
      $(".arrow").css("display", "none");
      $(boximg).slice(0, 10).show();
    } else $(".arrow").css("display", "block");

    if ($(window).width() < 768) {
      $(boximg).slice(4, 10).hide();
      $(up).addClass(close).removeClass(more);
    }

    if ($(window).width() > 480) {
      $(boximg).slice(0, 4).show();
    }

    if ($(window).width() < 480) {
      $(boximg).slice(1, 4).hide();
      $(up).addClass(close).removeClass(more);
    }
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
