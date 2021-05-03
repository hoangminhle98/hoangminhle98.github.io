const WAIT_TIME = 1400;
var current;
var index = 0;
var select = 0;
var stack = [];
var toggle = 0;
const MESSAGES = [
  "Let's decorate this place!",
  "You can 'switch' places",
  "Click 'new' to see your options",
  "Drag 'em to wherever you like",
  "Resize with &#x25B2 and &#x25BC",
  "HAVE FUN !",
]
var open = false;
const SELECTION_MESSAGES = [
  "Let's have some friends over",
  "How about more?",
  "... animal friends...",
  "wizards too, I guess ...",
  "... friends from outer space as well ...",
  "now, normal stuff",
  "... still normal ...",
  "let's travel the world",
  "... i don't know, man ...",
  " now all the weird stuff you don't need"
]
const imageURL = [
    "619.jpg", "1234.jpg", "1311.jpg", "1847.jpg", "2040.jpg", "2211.jpg", "2358.jpg",
    "3268.jpg", "3322.jpg", "3930.jpg", "4334.jpg","3222.jpg" , "785.jpg"
]

$(document).ready(function () {
  $('#container0').show()
  $("#collection").load('flaticons.html')
  for (let i = 0; i < MESSAGES.length; i++)
      setTimeout( function () {
        $('#message').html(MESSAGES[i]);
      }, WAIT_TIME*(i+1));

  $('#up').on('click', function() {
    if(current) {
      current.css('width','+=3');
      current.css('height','+=3');
    }  });

  $('#down').on('click', function () {
    if(current) {
      current.css('width','-=2');
      current.css('height','-=2');
    }
  });
  $('#switch').on('click', function () {
    index ++;
    index %= imageURL.length;
    $('#image').attr('src', imageURL[index]);
  });
  $('#next').on('click', function () {
    if (open) {
      $('#container' + select).hide();
      select++;
      select %= SELECTION_MESSAGES.length;
      $('#message').html(SELECTION_MESSAGES[select]);
      $('#container' + select).show();
    }
  });

  $('#check').on('click', function () {
    if (!open) $('#message').html(SELECTION_MESSAGES[select]);
    open = ! open;
  });

  // $('#screenshot').on('click', function () {
  //   $('.newGameCtrl').hide();
  //   $('.speech').hide();
  //   html2canvas($('#outerWrap')[0]).then((canvas) => Canvas2Image.saveAsPNG(canvas))
  //   $('.newGameCtrl').slideDown();
  //   $('.speech').slideDown();
  // });

  $('#undo').on('click', function () {
    if(current) current.remove();
    stack.pop();
    if (stack.length > 0) current = stack[stack.length-1];
  });

  $('.speech').on('click', function () {
      $('.gameCtrl').fadeToggle();
      $('.speech').css("opacity", toggle);
      toggle = 1 - toggle;
  });

});

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("targetID", ev.target.id);
}

function drop(ev) {
  var data = ev.dataTransfer.getData("targetID");
  var obj = $('#'+data).children().clone();
  obj.appendTo(ev.target);
  current = obj;
  stack.push(current);
  ev.preventDefault();
}
