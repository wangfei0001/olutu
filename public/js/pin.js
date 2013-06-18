var Spin = {
    pin_id: null,
    comment_page: 1
}

Spin.init = function(config)
{
    this.pin_id = config.pin_id;

    this.initEvents();
    this.loadPinComments();
    this.loadTags();
    this.loadOthersLike();

}



Spin.initEvents = function(){
    $('#btn_comment').click(function(){
        var $commentDom = $('#pin-comment').find('#comment');
        var $butDom = $(this);
        if($commentDom.val() != $commentDom.attr('data') && $commentDom.val() != ''){
            $.ajax({
                url: '/customer/index/subcomment',
                type:'post',
                data: {
                    pinid: Spin.pin_id,
                    comment: $commentDom.val()
                },
                beforeSend: function(){
                    $butDom.siblings('.small_loading').show();
                },
                //dataType: 'json',
                success: function(data){
                    $commentDom.val($commentDom.attr('data'));
                    Spin.loadPinComments();
                },
                complete: function(){
                    $butDom.siblings('.small_loading').hide();
                }

            });
        }else{

        }
    });
    $('#keywords-submit').click(function(){
        Spin.addKeywords();
    });
    $('#keywords').focus(function(){
        $(this).removeClass('error-red');
    });
    $('#add-to-cart').click(function(){
        $.ajax({
            url: '/default/pin/buy',
            type:'post',
            dataType: 'json',
            data: {
                pinid: Spin.pin_id,
                quantity: $('#quantity').val()
            },
            beforeSend: function(){

            },
            success: function(data){
                initShoppingCart();
            }

        });
    });

    $('.but-up').click(function(){
        var quantity = parseInt($('#quantity').val());
        quantity = quantity + 1;
        $('#quantity').val(quantity);

    });
    $('.but-down').click(function(){
        var quantity = parseInt($('#quantity').val());
        if(quantity > 1) quantity = quantity - 1;
        $('#quantity').val(quantity);

    });

}

Spin.bindDeleteAndReply = function(){
    $('#pin-comments li').bind('mouseenter',function(){
        $(this).find('.comm-tools').show();
    }).bind('mouseleave',function(){
        $(this).find('.comm-tools').hide();
    });
    $('.comm-reply').click(function(){
        var screenName = $(this).data('screenname');
        var str = '@' + screenName + ' ';
        $('#pin-comment').find('#comment').val(str).focus();
        $('#pin-comment').find('#comment').each(function(){
            document.getElementById("comment").setSelectionRange(str.length, str.length);
        });
    });
    $('.comm-delete').click(function(){
        var id = $(this).data('id');
        $.ajax({
            url: '/customer/index/delcomment',
            type: 'post',
            dataType: 'JSON',
            data: {
                id: id
            },
            beforeSend: function(){

            },
            success: function(data){
                console.log(data);
                if(data) Spin.loadPinComments();
            }

        });
    });
}

Spin.loadPinComments = function(){
    $.ajax({
        url: '/default/pin/comments',
        type: 'post',
        data: {
            pinid: Spin.pin_id,
            page: Spin.comment_page
        },
        success: function(data){
            $('#pin-comments').html(data);
            Spin.bindDeleteAndReply();
        }
    });
}

Spin.addKeywords = function(){
    var keywords = $('#keywords').val();
    if(keywords == $('#keywords').attr('data')) keywords = '';
    $.ajax({
        url: '/customer/pins/addkeywords',
        type: 'post',
        dataType: 'JSON',
        data: {
            pinid: Spin.pin_id,
            keywords: keywords
            /*page: Spin.comment_page*/
        },
        beforeSend: function(){
            $('#tag-add-loading').show();
        },
        success: function(data){
            if(data.result){
                $('#keywords').val('');
                Spin.loadTags();        //reload tags
            }else{
                $('#keywords').addClass('error-red');
            }
        },
        complete: function(){
            $('#tag-add-loading').hide();
        }
    });
}

Spin.loadTags = function(){
    $.ajax({
        url: '/default/pin/loadkeywords',
        type: 'post',
        data: {
            pinid: Spin.pin_id,
        },
        success: function(data){
            $('#pins-tags').children('#tags-area').html(data);
        }
    });
}

Spin.loadOthersLike = function(){
    var $dom = $('.pins-others-like');

    $.ajax({
        url: '/default/pin/loadotherslike',
        type:'post',
        data: {
            pinid: Spin.pin_id
        },
        beforeSend: function(){

        },
        //dataType: 'json',
        success: function(data){
            $dom.html(data);
            if(data != '')
                $dom.parents('.pin-info').show();
        }

    });



}


/**
 * 获取用户的发布
 * @param userid
 * @param count
 */
Spin.loadPinsByUser = function(userid, count){
    $.ajax({
        url: '/default/pin/byuser',
        type: 'post',
        //dataType: 'json',
        data: {
            pinid: Spin.pin_id,
            userid: userid,
            count: count
        },
        success: function(data){
            $('.pin-info').children('#pins-user').html(data);
        }
    });
}

/**
 * 采集于同一目的的发布
 * @param source
 */
Spin.loadPinsBySource = function(source,count){
    if(source == '') return;
    $.ajax({
        url: '/default/pin/bysource',
        type: 'post',
        //dataType: 'json',
        data: {
            pinid: Spin.pin_id,
            source: source,
            count: count
        },
        success: function(data){
            $('.pin-info').children('#pins-source').html(data);
        }
    });
}


Spin.loadThumbsByBoard = function(boardid, page){
    if(typeof(page) == 'undefined') page = 1;
    //alert(boardid + ' ' + page);
    $.ajax({
        url: '/default/pin/thumbs',
        type: 'post',
        //dataType: 'json',
        data: {
            boardid: boardid,
            pinid: Spin.pin_id,
            page: page
        },
        beforeSend: function(){
            $('#thumbs-ajax-loader').show();
        },
        success: function(data){
            $('#pins-thumbs-area').html(data);
        },
        complete: function(){
            $('#thumbs-ajax-loader').hide();
        }
    });
}
