var wf = {
    refresh_sending: false,
    defaults: {
        columnsRow: 6,
        type: '',
        catid: 0,
        boardid: 0,
        like: 0,
        userid: 0,
        owner: '',
        timeline: '',
        tag: '',
        lists: new Array(),
        limit: 12
    },


    init: function(settings){
        $.extend(this.defaults, settings);

        this.initEvent();
        return this;
    },

    initEvent: function(){
        //bind scroll event
        if($('#scroll-top').length > 0){
            $('#scroll-top').children('a').click(function(){
                $('html,body').animate({ scrollTop: 0 }, 'fast');
            });
            $(window).scroll(function(){
                var scrollTop = $(window).scrollTop();
                //var windowHeight = $(window).height();

                if(scrollTop == 0){
                    $('#scroll-top').fadeOut();
                }else if(scrollTop > 200){
                    $('#scroll-top').fadeIn();
                }
            });
        }
        $(window).scroll(function(){
            var scrollTop = $(window).scrollTop();
            var windowHeight = $(window).height();
            if(scrollTop + windowHeight >= $(document).height()){
                //now start to fetch data
                wf.refresh();
            }

        });
        $(window).mousewheel(function(event, delta, deltaX, deltaY) {
            if(deltaY < 0){
                var scrollTop = $(window).scrollTop();
                if(scrollTop == 0) wf.refresh();
            }
            return true; // don't prevent default
        })

    },



    /**
     * Click event handle function for singleline textbox, comments
     */
    bindSingleLine: function($dom){
        bindTextTips($dom);
        $dom.focus(function(){
            $(this).parent().find('img').show();
            $(this).css({
                width:'169px'
            });
        }).blur(function(){
            $(this).parent().find('img').hide();
            $(this).css({
                width:'199px'
            });
        });
    },

    refresh: function(){
        if(wf.refresh_sending) return;
        $.ajax({
            url: '/main/pin/refresh',
            type: 'POST',
            dataType: 'json',
            data: wf.defaults,
            beforeSend: function(){
                $('.pins-loading').show();
                wf.refresh_sending = true;
            },
            success: function(data){
                var $mainDiv = $('#water-fall-area');

                var currentTotal = $mainDiv.children('ul.pin_list').children('li').length;

                //var i = 0;
                for(var i = 0; i < data.data.length; i++){
                    console.log(data.data[i]);

                    var idx = (currentTotal + i) % wf.defaults.columnsRow;
                    if($mainDiv.children('.pin_list:eq(' + idx + ')').length == 0){
                        $mainDiv.append('<ul class="pin_list"></ul>');
                    }
                    var pin = data.data[i];

                    wf.defaults.lists.push(pin.id_pin);

                    var html = '';
                    //html += '<ul>';
                    html += '<li class="pin" data-height="' + pin.thumb_height + '" data-id="' + pin.id_pin + '" data-owner="' + pin.fk_user + '" data-like="0">';

                    html += '<p class="image">';
                    html += '<a href="" class="imglink">';
                    if(pin.product){
                        if(pin.product.retail_price){
                            html += '<span class="prod-rrp">$2.00</span>';
                        }
                        html += '<span class="prod-price">$1.00</span>';
                    }
                    html += '<img src="' + data.config.image_host + pin.filename + '.w192.jpg" style="height:' + pin.thumb_height + 'px" class="w192" />';
                    html += '</a>';
                    html += '</p>';

                    if(pin.description){
                        html += '<p class="desc">' + pin.description + '</p>';
                    }

                    html += '<p class="other">';
                    html += '<a href="">' + pin.likeCount + ' 喜欢</a>';
                    html += '<a href="javascript:void(0);">' + pin.commentCount + ' 评论</a>';
                    html += '<a href="javascript:void(0);" onclick="repinBox.open(this);">' + pin.repinCount + ' 转发</a>';
                    if(pin.lat && pin.lng){
                        html += '<a href="javascript:void(0);" class="map-icon"></a>';
                    }
                    if(pin.product){
                        html += '<a href="javascript:void(0);" class="buy-icon" title="商品"></a>';
                    }
                    html += '</p>';


                    html += '<ul class="comments">';
                    if(pin.comments){
                        //console.log(pin.comments);
                        for(var j = 0; j < pin.comments.length; j++){
                            html += '<li>';
                            html += '<a href="" class="imglink" title="' + pin.comments[j].user.screenname + '">';
                            html += '<img src="' + data.config.image_host + 'avatar/' + pin.comments[j].user.avatar.w30 + '" />';
                            html += '</a>';
                            html += '<span><a href="">' + pin.comments[j].user.screenname + '</a>';
                            if(pin.comments[j].type == 'comment'){
                                html += pin.comments[j].comment;
                            }else{
                                html += '发布到 <a href="">' + pin.board.name + '</a>';
                            }
                            html += '</span>';
                            html += '</li>';
                        }


                    }
                    if(isLogged()){
                        html += '<li class="mycomment clearfix">';
                        html += '<a href=""><img src="' + data.config.image_host + 'avatar/"></a>';
                        html += '<input type="text" class="single-line-text text-tips" data="我来说两句">';
                        html += '</li>';
                    }

                    html += '</ul>';

                    html += '</li>';
                    //html += '</ul>';
                    $mainDiv.children('ul:eq(' + idx + ')').append( html );



                    $mainDiv.children('ul:eq(' + idx + ')').children('li').last().pinbar();

                }
                //console.log($(data).children().length);return;
//                $(data).children('li').each(function(){
//                    var idx = (currentTotal + i) % wf.defaults.columnsRow;
//                    //insert ul
//                    if($mainDiv.children('.pin_list:eq(' + idx + ')').length == 0){
//                        $mainDiv.append('<ul class="pin_list"></ul>');
//                    }
//                    $mainDiv.children('ul:eq(' + idx + ')').append( $(this).pinbar() );
//
//                    $mainDiv.find('.single-line-text').each(function(){
//                        wf.bindSingleLine($(this));
//                    });
//                    //bind error event
//                    $(this).find('.image').find('img').error(function(){
//                        $(this).attr('src','/images/default.jpg');
//                    });
//
//                    i++;
//                });
//                if($(data).find('#timeline').val() != undefined){
//                    wf.defaults.timeline = $(data).find('#timeline').val();
//                    console.log(wf.defaults.timeline);
//                }
            },
            complete: function(){
                wf.refresh_sending = false;
                $('.pins-loading').hide();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert('[' + xhr.status + ']' + thrownError);
            }
        });
    }



};