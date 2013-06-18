ERROR_NOT_LOGIN = -1;

/*function loadImg(obj)
{
    var $this = $(obj);
    $this.attr('src', $this.parent('a').siblings('span').attr('src'));
} */

function showLogin(info)
{
    $('#pop-login').modal({
        persist:true,
        opacity:30,
        overlayCss: { backgroundColor:"#000" },
        closeClass: "close"
    });
}

/*
Scroll event binding function
 */
function bindScroll($dom, imgheight)
{
    var $img = $dom.children('img');
    var divheight = $dom.height();
    var direction = -1;     //-1 means init, 1 means down, 0 means up
    var scrollspeed = 1000;

    if(imgheight > divheight){      //can be triggered
        //alert(divheight + '   ' + imgheight);
        $img.css({top:'0px'});
        $dom.bind('mouseenter',function(e){
            var e=e||event;

            var x = e.pageX - $(this).offset().left;
            var y = e.pageY - $(this).offset().top;
            //$dom.css('cursor','');
            if(y < divheight / 2){      //move to top
                direction = 0;
            }else{                      //move to bottom
                direction = 1;
            }
            $img.animate({
                'top': (direction == 1?(divheight - imgheight):0)
            },scrollspeed, function() {
                direction = -1;
            });
        }).bind('mouseleave',function(){
                $img.stop();
        }).bind('mousemove',function(e){
            var e=e||event;
            var newdirection = -1;
            var x = e.pageX - $(this).offset().left;
            var y = e.pageY - $(this).offset().top;
            if(y < divheight / 2){      //move to top
                newdirection = 0;
            }else{
                newdirection = 1;
            }
            if(newdirection != direction){
                direction = newdirection;
                $img.stop();
                $img.animate({
                    'top': (direction == 1?(divheight - imgheight):0)
                }, scrollspeed, function() {
                    direction = -1
                });
            }
        });
    }
}


/***
 * Load message count
 */
function loadMessageCount()
{
    if(isLogged()){
        $.ajax({
            url: '/customer/index/getmsg',
            type: 'post',
            dataType: 'json',
            data: {
            },
            success: function(data){
                $('.message-count a').attr('title',data.unread + ' ' + $('.message-count a').attr('title'));
                $('.message-count a').html(data.unread).fadeIn('fast');
            }
        });
    }
}


/***
 * check if users have login
 * @return {Boolean}
 */
function isLogged()
{
    var hash = $.cookie('username');
    return hash == null ? false:true;
}


function bindTextTips($dom)
{
    $dom.val($dom.attr('data'));
    $dom.focus(function(){
        if($dom.val() == $dom.attr('data')){
            $dom.attr('data', $dom.val());
            $dom.val('');
        }
    }).blur(function(){
        if($dom.val() == ''){
            $dom.val($dom.attr('data'));
        }
    });
}


function initShoppingCart()
{
    $('#shopping-cart-icon').mouseenter(function(){
        $('#shopping-cart').show();
    });
    $('#shopping-cart').mouseleave(function(){
        $(this).hide();
    });
    $.ajax({
        url: '/main/cart/mycart',
        type: 'POST',
        //dataType: 'json',
        data:{},
        beforeSend: function(){
        },
        success: function(data){
            $('#shopping-cart').html(data);
            $('#but-cart-view').click(function(){
                window.location = $(this).data('url');
            });

            var liCount = $(data).find('li').length;

            $('.shopping-cart-item-count').html(liCount > 0 ? liCount - 1 : 0).fadeIn();;
        }
    });


}


function getRandomEvents()
{
    if(isLogged()){
        $.ajax({
            url: '/customer/ajax/random',
            type: 'POST',
            beforeSend: function(){
            },
            success: function(data){
                /*$.modal(data,{
                    opacity:70,
                    overlayCss: { backgroundColor:"#000" }
                });*/
                /*$(data).find('#close').click(function(){
                    $.modal.close();
                });*/
            }
        });
    }
}

$(function(){
    document.body.onselectstart = function(){
        //return false;
    };
//    onselectstart='return false'

    /* like, unlike按钮 */
    /*$('.like,.unlike').click(function(){
        var data = $(this).data('like');
        var likeAction = 1;
        if($(this).hasClass('unlike')) likeAction = 0;
        var $followDom = $(this);

        $.ajax({
            url: '/customer/ajax/like',
            type: 'post',
            dataType: 'json',
            data: {
                pin: $(this).data('id'),
                type: 'pin',
                like: likeAction
            },
            success: function(data){
                alert(data);
                if(data.result){
                    if(likeAction){
                        $followDom.removeClass('like');
                        $followDom.addClass('unlike');
                    }else{
                        $followDom.removeClass('unlike');
                        $followDom.addClass('like');
                    }
                }
            }
        });
    });*/


    /* follow, unfollow按钮 */
   $('.follow,.unfollow').click(function(){
        var data = eval($(this).attr('data'));
        var followAction = true;
        if($(this).hasClass('unfollow')) followAction = false;
       var $followDom = $(this);
       $.ajax({
           url: '/customer/index/follow',
           type: 'post',
           dataType: 'json',
           //async:false,
           data: {
               user:    data,
               follow:  followAction
           },
           success: function(data) {
               if(data.result){
                    if(followAction){
                        $followDom.removeClass('follow');
                        $followDom.addClass('unfollow');
                        $followDom.html('已关注 <em>| 取消</em>');
                     }else{
                        $followDom.removeClass('unfollow');
                        $followDom.addClass('follow');
                        $followDom.html('关注');
                     }
                }
           }
       });

   });
    /* Textarea */
    $('.txta,.search-box').each(function(){
        var $dom = $(this);
        bindTextTips($dom);
    });

    //bind shopping cart icon

    initShoppingCart();

    getRandomEvents();

    $('input[type=text],textarea,input[type=password]').focus(function(){
        $(this).addClass('tfocus');
    }).blur(function(){
        $(this).removeClass('tfocus');
    });
});




//function unloadImg(obj)
//{
//    var $this = $(obj);
//    $this.removeAttr('src');
//}