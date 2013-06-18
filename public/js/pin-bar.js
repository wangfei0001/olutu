$.fn.pinbar = function(settings){
    var defaults = {
    };
    $.extend(defaults, settings);

    var pinDom = $(this);

    var html = '<div class="tool">';
        html += '<a href="javascript:void(0);" class="repin" title="转发"></a>';
        html += '<a href="javascript:void(0);" class="' + (pinDom.data('like') == '1'?'unlike':'like') + '" title="喜欢"></a>';
        html += '<a href="javascript:void(0);" class="comment" title="评论"></a>';
        html += '</div>';

    $(this).children('.image').before(html);
    var $pinbar = $(this).children('.tool');

    $(this).mouseenter(function(){
        $pinbar.fadeIn(100);
    });

    $(this).mouseleave(function(){
        if(repinBox.repin == false){        //如果转发窗口没有显示
            $pinbar.fadeOut(100);
        }
    });

    $pinbar.children('a.repin').click(function(event){
        if(isLogged()){
            repinBox.open($(this)[0]);
            event.preventDefault();
        }else{
            showLogin();
        }
    });

    //like button
    $pinbar.children('a.like,a.unlike').click(function(event){
        if(isLogged()){
            var likeAction = $(this).attr('class') == 'like'?1:0;
            var id = pinDom.data('id');
            var $likeDom = $(this);
            $.ajax({
                url: '/customer/ajax/like',
                type: 'post',
                dataType: 'json',
                data: {
                    pin: id,
                    type: 'pin',
                    like: likeAction
                },
                success: function(data){
                    if(data.result){
                        if(likeAction){
                            $likeDom.removeClass('like');
                            $likeDom.addClass('unlike');
                        }else{
                            $likeDom.removeClass('unlike');
                            $likeDom.addClass('like');
                        }
                    }
                }
            });
            event.preventDefault();
        }else{
            showLogin();
        }
    });

    //comment button
    $pinbar.children('a.comment').click(function(event){

        if(isLogged()){
            var $dom = pinDom.find('.comments li.mycomment .single-line-text');

            $dom.parent().find('img').show();
            $dom.css({
                width:'169px'
            });
            $dom.focus();
            event.preventDefault();
        }else{
            showLogin();
        }
    });

    pinDom.find('.comments li.mycomment input[type=text]').keydown(function(event){
        if(event.keyCode == 13){    //press enter
            if($(this).val().length == 0) return;
            var id = pinDom.data('id');
            var commentDom = $(this);
            $.ajax({
                url: '/customer/index/subcomment',
                type:'post',
                data: {
                    pinid: id,
                    comment: $(this).val()
                },
                beforeSend: function(){

                },
                //dataType: 'json',
                success: function(data){
                    //Spin.loadPinComments();

                    commentDom.val('');
                    $.fn.pinbar.loadComments(pinDom);
                }
            });
        }
    });
    return this;
};


$.fn.pinbar.loadComments = function(pinDom){
    var id = pinDom.data('id');
    $.ajax({
        url: '/default/pin/comments2',
        type: 'post',
        data: {
            pinid: id
        },
        success: function(data){
            pinDom.find('.comments li[class!=mycomment]').remove();
            pinDom.find('.comments li').before(data);
        }
    });
};

//$(function(){
//    $('.pin_list li').each(function(){
//        $(this).pinbar();
//    });
//});