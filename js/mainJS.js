var bUpdateLogo = true;
var staggerPillarsInterval;
var bPillarsStarted = false;
var emailURL = 'email.php';
var PHONE_REGEXP = /^[(]{0,1}[0-9]{3}[)\.\- ]{0,1}[0-9]{3}[\.\- ]{0,1}[0-9]{4}$/;
var EMAIL_REGEX = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

$(document).ready(function(){

  $(".button-collapse").sideNav();

  /* Scrollspy */
  $('.scrollspy').scrollSpy({scrollOffset: $('#header').height()});
    $('.scrollspy').on('scrollSpy:enter', function() {
      // fixes issue with active class being added to <a> instead of parent <li>
      $('.menu').each(function(){
        $(this).children().each(function(){
          $(this).removeClass('active');
        });
      });
      $('.menu').find('a[href="#'+$(this).attr('id')+'"]').parent().addClass('active');
      window.history.pushState(null,null,window.location.href.split('#')[0]+'#' +$(this).attr('id'))
    }).on('scrollSpy:exit', function(){
      $('.menu').find('a[href="#'+$(this).attr('id')+'"]').parent().removeClass('active');
    });

    /* load background images programatically for better control */
  $('.card-image').each(function(){
    if($(this).attr('data-bg')){
      $(this).css('background-image','url('+$(this).attr('data-bg')+')');
    }
  });

  /* fix scrollspy offset when content changes for breakpoints */
  $(window).resize(function(){
    $('.scrollspy').scrollSpy({scrollOffset: $('#header').height()});
  });

  /* manual scroll effects */
  $(window).on("scroll", function(){
    var scrollAmount = $(this).scrollTop();
    var scrHeight = $(this).height();
    var scrWidth = $(this).width();
    /* visibility of discovery button on page start */
    if(scrollAmount > 60){
      $('#discoverButton').hide();
    }else{
      $('#discoverButton').show();
    }

    /* keep logo fixed when  */
    if(scrollAmount < scrHeight){
      $('#logo').css({
        'transform' : 'translate(0px, '+ scrollAmount  +'px)'
      });

      if(scrHeight > 600){
        $('#logoMessage').css({
          'transform' : 'translate(0px, '+ scrollAmount * 1 +'%)'
        });
      }else{
        $('#logoMessage').css({
          'transform' : 'translate(0px, '+ scrollAmount * 1.5 +'%)'
        });
      }
    }

    if(!staggerPillarsInterval && scrollAmount > $('#aboutPage').offset().top-70){
      staggerPillars();
      staggerPillarsInterval = window.setInterval(staggerPillars,400);
    }

  });

  $('#efSubmit').click(function(){
    submitEmail();
  });
  $('#efPhone').on("blur", function(){
    validatePhone();
  });
  $('#efEmail').on("blur", function(){
    validateEmail();
  });
});

function staggerPillars(){
  bPillarsStarted = true;
  let pillars = $('#pillarWrapper').children();
  let bContinue = true;
  let i = 0;
  while (bContinue){
    if(!$(pillars[i]).hasClass("pillarSlide")){
      $(pillars[i]).addClass("pillarSlide");
      bContinue = false;
    }
    i++;
  }
  if(i >= pillars.length){
    window.clearInterval(staggerPillarsInterval);
  }
}

function validatePhone(){
  if(!PHONE_REGEXP.test($('#efPhone').val()) || $('#efPhone').val()==''){
    $('#efPhone').addClass('invalid');
    return false;
  }else{
    $('#efPhone').removeClass('invalid');
    let oldPhone = $('#efPhone').val().replace(/\D/g,'');
    let tPhone = '';
    tPhone += "(" + oldPhone.substr(0,3)+")";
    tPhone += oldPhone.substr(3,3)+"-";
    tPhone += oldPhone.substr(6,4);
    $('#efPhone').val(tPhone);
    return true;
  }
}

function validateEmail(){
  if(!EMAIL_REGEX.test($('#efEmail').val()) || $('#efEmail').val() == ''){
    $('#efEmail').addClass('invalid');
    return false;
  }else{
    $('#efEmail').removeClass('invalid');
    return true;
  }
}
function clearEmailForm(){
  $('#efName').val('');
  $('#efCompName').val('');
  $('#efEmail').val('');
  $('#efPhone').val('');
  $('#efMessage').val('');
  $('#efSubmit').removeClass('disabled');
}
function submitEmail(){
  let bCanSend = true;
  fdata = {
    name:$('#efName').val().trim(),
    compName: $('#efCompName').val().trim(),
    email: $('#efEmail').val().trim(),
    phone: $('#efPhone').val().trim(),
    message: $('#efMessage').val().trim()
  };
  if(!validateEmail()){
    bCanSend = false;
  }
  if(!validatePhone()){
    bCanSend = false;
  }
  if(fdata.name == ''){
    bCanSend = false;
    $('#efName').addClass("invalid");
  }
  if(fdata.message == ''){
    bCanSend = false;
    $('#efMessage').addClass("invalid");
  }
  if(bCanSend){
    $('#efSubmit').addClass('disabled');
    $.ajax({
          url: emailURL,
          type: 'POST',
          dataType: "json",
          data: JSON.stringify(fdata)
      }).always(function(data){
        if(data.responseText == 'success'){
          Materialize.toast("Email sent", 2000);
          clearEmailForm();
        }else{
          Materialize.toast(data.responseText, 2000);
          $('#efSubmit').removeClass('disabled');
        }
      });
  }
}
