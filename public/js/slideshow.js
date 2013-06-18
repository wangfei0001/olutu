/***
 * Status: 0-doing, 1-pause, 2-stop
 *
 * @type {Object}
 */
var SlideShow  = {
    pinList: new Array(),
    timeout: null,
    curIndex: -1,
    status: 0,
    //previewTotalPage: 0,
    previewItemsPage: 9
};

SlideShow.Open = function(){
    $('body').css({
        'overflow-y': 'hidden'
    });
    if($('.ss-container').length == 0){
        var html = this.generateHtml();
        $(html).appendTo($('body'));

        $('.ss-container #close').click(function(){
            SlideShow.Close();
        });

        $('.ss_main').mouseenter(function(){
            $('.img_prev,.img_next').fadeIn();
        }).mouseleave(function(){
            $('.img_prev,.img_next').fadeOut();
        });

        $(document.body).keydown(function(event){
            switch(event.which){
                case 37:    //left
                    SlideShow.Prev();
                    break;
                case 39:    //right
                    SlideShow.Next();
                    break;
            }
        });
        this.FetchData();
    }else{
        $('.ss-container').show();
    }

}

SlideShow.Close = function(){
    $('body').css({
        'overflow-y': 'auto'
    });
    $('.ss-container').hide();
}

SlideShow.generateHtml = function(){
    var html = '';
    html += '<div class="ss-container">';
    html += '    <div class="ss_header">';
    html += '        <a hre="javascript:void(0);" id="close">Close</a>';
    html += '    </div>';
    html += '    <div class="ss_main">';
    html += '       <div id="img_frame"><img src="/images/loading.gif" /></div>';
    html += '       <div class="img_prev"></div><div class="img_next"></div>'
    html += '    </div>';
    html += '    <div class="ss-carousel">';
    html += '       <ul id="mycarousel" class="jcarousel-skin-tango"></ul>';
    html += '    </div>';
    //html += '    <a href="javascript:void(0);" id="mycarousel-prev">上页</a> <a href="javascript:void(0);" id="mycarousel-next">下页</a>';
    html += '</div>';

    return html;
}



/*SlideShow.mycarousel_initCallback = function(carousel) {
    jQuery('#mycarousel-next').bind('click', function() {
        carousel.next();
        return false;
    });

    jQuery('#mycarousel-prev').bind('click', function() {
        carousel.prev();
        return false;
    });
} */

SlideShow.FetchData = function(){
    //now start to fetch data
    $.ajax({
        url: '/default/pin/refresh2',
        type: 'POST',
        dataType: 'json',
        data:{},
        beforeSend: function(){
        },
        success: function(data){
            for(var i = 0; i < data.length; i++){
                $('.ss-carousel .jcarousel-skin-tango').
                    append('<li><img src="' + data[i].thumbUrl + '"></li>');
            }
            SlideShow.pinList = SlideShow.pinList.concat(data);
            //SlideShow.previewTotalPage = parseInt((SlideShow.pinList.length - 1) / SlideShow.previewItemsPage) + 1;
        },
        complete: function(){
            jQuery('#mycarousel').jcarousel({
                scroll: 10
                /*initCallback: SlideShow.mycarousel_initCallback,
                //hide auto-generated next-previous button  ??????
                buttonNextHTML: null,
                buttonPrevHTML: null*/
            });
            $('.ss-carousel ul li').mouseenter(function(){
                $(this).find('img').animate({
                    opacity: 1
                }, 300, function() {
                });
            }).mouseleave(function(){
                $(this).find('img').css('opacity','0.4');
            }).click(function(){
                SlideShow.curIndex = $(this).parent().children('li').index($(this));
                //SlideShow.CalculatePreviewPage();
                SlideShow.Select();
            });
            $('.img_prev').click(function(){ SlideShow.Prev(); });
            $('.img_next').click(function(){ SlideShow.Next(); });

            //SlideShow.timeout = setInterval('SlideShow.intervalCallback()', 3000);
        }
    });
}

SlideShow.intervalCallback = function(){
    if(this.status == 0){      //if we need to run it
        if(this.curIndex != -1 && (this.curIndex + 1) % this.previewItemsPage == 0){
            $('.jcarousel-next').trigger('click');
        }
        if(this.curIndex < this.pinList.length - 1) this.curIndex++;
        else{
            //alert('End 1');
        }

        this.Select();
    }
}

SlideShow.Prev = function(){
    if(this.curIndex % this.previewItemsPage == 0/* && this.previewPage > 1*/){
        $('.jcarousel-prev').trigger('click');
    }
    if(this.curIndex > 0) this.curIndex--;
    this.Select();
}

SlideShow.Next = function(){
    if((this.curIndex + 1) % this.previewItemsPage == 0/* && this.previewPage < this.previewTotalPage*/){
        $('.jcarousel-next').trigger('click');
    }
    if(this.curIndex < this.pinList.length - 1) this.curIndex++;
    else{
        //alert('End 2');
    }
    this.Select();
}

SlideShow.Select = function(){
    var idx = this.curIndex;

    $('.ss-carousel ul li.selected').removeClass('selected');
    $('.ss-carousel ul li:eq(' + idx + ')').addClass('selected');

    var height = parseInt(this.pinList[idx].originalHeight);
    var width = parseInt(this.pinList[idx].originalWidth);

    console.log('width = ' + width + ' height = ' + height);

    if(height > 630){
        width = parseInt(630 * width / height);
        height = 630;
    }

    if(width > 1004){
        width = 1004;
        height = parseInt(1004 * height / width);
    }

    $('.ss_main #img_frame').animate({
        width: width + 20,
        height: height + 20,
        'margin-top': (630-height) / 2 + 'px'
    }, 100, function() {
    }).html( ' <img data-original=' + this.pinList[idx].realUrl + ' width=' + width + ' height=' + height + '> ');

    $(".ss_main #img_frame img").lazyload({
        effect : "fadeIn"
    });

    console.log('currentIndex:%d itemsPerPage:%d\n', this.curIndex, this.previewItemsPage);


}

$(function(){
    $('#but-slideshow').click(function(){
        SlideShow.Open();
    });
})