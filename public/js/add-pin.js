var PinBoard = {
    pinsaddDom : null,
    images : null,
    images_show_index: -1
};

PinBoard.init = function(){
    this.pinsaddDom = $('.pins-add-board');
    this.pinsaddDom.find('#close').click(function(){
        PinBoard.close();
    });
    this.addEventHandler();

    this._initAddBoard();
    //this.pinsaddDom.find('#addboard').focus();

    bindTextTips(this.pinsaddDom.find('#addboard'));
    bindTextTips(this.pinsaddDom.find('#txt_add_url'));


}


PinBoard.removeImage = function(url){
    if(this.images.length > 0){
        var newData = new Array();
        for(var i=0; i<this.images.length; i++){
            if(this.images[i] != url){
                newData[newData.length] = this.images[i];
            }
        }
        this.images = newData;
    }
}


/***
 * Disable/Enable board selector
 *
 * @param disabled
 * @private
 */
PinBoard._disableBoardSelector = function(disabled){
    var $board_selector = PinBoard.pinsaddDom.find('#board-selector');
    if(disabled){
        $board_selector.attr('disabled','disabled').addClass('disabled');
        $board_selector.find('input[type=checkbox]').attr('disabled','disabled');
    }else{
        $board_selector.removeAttr('disabled').removeClass('disabled');
        $board_selector.find('input[type=checkbox]').removeAttr('disabled');
    }
}


PinBoard.loadBoards = function(){
    if(PinBoard.pinsaddDom.children('option').length > 1) return;   //if we have load it.
    $.ajax({
        url: '/account/board/all',
        type: 'post',
        dataType: 'json',
        success: function(data) {
            if(data){
                for(var i=0;i<data.length;i++){
                    //PinBoard.pinsaddDom.find('#board').append(new Option(data[i].name, data[i].id, true, true));
                    PinBoard._insertBoard(data[i].id, data[i].name)
                }
                PinBoard._bindBoardSelectorEvent();
            }
        }
    });
}

PinBoard._bindBoardSelectorEvent = function(){
    var $board_selector = PinBoard.pinsaddDom.find('#board-selector');

    $board_selector.children('li').click(function(){
        if($board_selector.attr('disabled') == 'disabled') return;

        var $checkboxDom = $(this).children('input[type=checkbox]');
        $(this).parent().find('input:checked').attr('checked',false);
        if($checkboxDom.is(':checked')){
            $checkboxDom.attr('checked',false);
            PinBoard.pinsaddDom.find('#board').val(0);
        }else{
            $checkboxDom.attr('checked',true);
            PinBoard.pinsaddDom.find('#board').val($checkboxDom.val());
        }
    }).mouseover(function(){
        if($board_selector.attr('disabled') != 'disabled')
            $(this).css({
                'background-color': '#c5f1ff',
                cursor: 'pointer'
            });
    }).mouseout(function(){
        if($board_selector.attr('disabled') != 'disabled')
            $(this).css({
                'background-color': '#fff',
                cursor: 'default'
            });
    });
}

/***
 * Insert board
 *
 * @param id
 * @param name
 * @private
 */
PinBoard._insertBoard = function(id, name){
    var $board_selector = PinBoard.pinsaddDom.find('#board-selector');
    var html = '<li>';
    html += '<input type="checkbox" value="' + id + '">&nbsp;';
    html += name;
    html += '</li>';
    $board_selector.append(html);
}

PinBoard.showArrow = function(show){
    if(show) this.pinsaddDom.find('.arrow-right,.arrow-left').show();
    else this.pinsaddDom.find('.arrow-right,.arrow-left').hide();
}


/***
 * Show loading and disable related buttons
 * @param show
 */
PinBoard.grabingImage = function(process){
    if(process){
        this.pinsaddDom.find('#grabing-loading').show();
        this.pinsaddDom.find('#but-addpin').attr('disabled','disabled');
        this.pinsaddDom.find('#btn_add_url').attr('disabled','disabled');
    }else{
        this.pinsaddDom.find('#grabing-loading').hide();
        this.pinsaddDom.find('#but-addpin').removeAttr('disabled');
        this.pinsaddDom.find('#btn_add_url').removeAttr('disabled');
    }
}


PinBoard.addingPin = function(process){
    this._disableBoardSelector(process);
    if(process){
        this.pinsaddDom.find('#but-addpin').attr('disabled','disabled');
    }else{
        this.pinsaddDom.find('#but-addpin').removeAttr('disabled');
    }
}

PinBoard._initAddBoard = function(){
    var addBoardDom = PinBoard.pinsaddDom.find('#addboard');
    var addBoardLoadingDom = PinBoard.pinsaddDom.find('.addboard-loading');
    addBoardDom.keydown(function(event){
        if(event.keyCode == 13){    //press enter
            $.ajax({
                url: '/customer/boards/quickadd',
                type: 'post',
                dataType: 'json',
                data: 'board=' + addBoardDom.val(),
                beforeSend: function(){
                    addBoardLoadingDom.show();
                },
                success: function(data) {
                    //$('#form-add-pins').children('#uploaded').val(0);
                    if(data.result){
                        PinBoard._insertBoard(data.boardid, addBoardDom.val());
                        addBoardDom.val('');
                        PinBoard._bindBoardSelectorEvent();     //bind event
                    }else{
                        alert(data.reason);
                    }
                },
                complete: function(){
                    addBoardLoadingDom.hide();
                }
            });
            event.preventDefault();
        }
    })
}


PinBoard.addEventHandler = function(){
    var $frame = $('.pins-add-board').find('#wrap');
    this.pinsaddDom.find('#add_url,#add_upload').click(function(){
        PinBoard.pinsaddDom.find('.wrap').toggle();
        PinBoard.pinsaddDom.find('div[id^=wrap_]').hide();
        PinBoard.pinsaddDom.find('#wrap_' + $(this).attr('id')).show();
    });

    this.pinsaddDom.find('#add_url,#add_upload').click(function(){
        PinBoard.loadBoards();
    });

    this.pinsaddDom.find('#create_board').click(function(){

    });

    /**
     * Event handle function for add url button
     */
    this.pinsaddDom.find('#btn_add_url').click(function(){
        var url = $('#txt_add_url').val();
        //$(this).attr('disabled','disabled');
        console.log('Start to grab images...');
        $.ajax({
            url: '/customer/pins/grabimages',
            type: 'post',
            dataType: 'json',
            data: {
                url:url
            },
            beforeSend: function(){
                PinBoard.grabingImage(true);
            },
            success: function(data) {
                if(data){
                    PinBoard.images = data;
                    PinBoard.images_show_index = 0;
                    var html ='';
                    for(var i=0; i < data.length; i++){
                        html += '<li style="display:none"><img src="' + data[i] + '"></li>';
                        console.log('get ', data[i]);
                    }
                    $('#pins-shows-thumb ul').html(html);
                    $('#pins-shows-thumb ul li img').load(function(){
                        var width = $(this)[0].width;
                        var height = $(this)[0].height;
                        if(width < 180/* || height < 240*/){
                            $(this).parent().remove();
                            PinBoard.removeImage($(this).attr('src'));
                        }else{
                            $(this).css({
                                'width' : '180px',
                                //'height' : '240px'
                            });
                        }
                    }).error(function(){
                        $(this).parent().remove();
                        PinBoard.removeImage($(this).attr('src'));
                    });
                    $('#pins-shows-thumb ul li').show();
                    if(data.length > 1) PinBoard.showArrow(true);   //show arrow
                    PinBoard.bindClickEvent();
                }else{
                    console.log('Nothing found');
                }
            },
            complete: function(){
                PinBoard.grabingImage(false);
            },
            error: function(jqXHR, textStatus, errorThrown){
                console.log('Fatal error:', textStatus);
            }
        });
    });

    /***
     * Event handle function for left-right arrows
     */
    this.pinsaddDom.find('.arrow-left').click(function(){
        if(PinBoard.images_show_index == 0) return;
        var left = $('#pins-shows-thumb ul').css('left');
        left = parseInt(left.replace('px','')) + 180;
        PinBoard.images_show_index--;
        $('#pins-shows-thumb ul').css('left',left + 'px');
    });
    this.pinsaddDom.find('.arrow-right').click(function(){
        if(PinBoard.images_show_index == PinBoard.images.length - 1) return;
        var left = $('#pins-shows-thumb ul').css('left');
        left = parseInt(left.replace('px','')) - 180;
        PinBoard.images_show_index++;
        $('#pins-shows-thumb ul').css('left',left + 'px');
    });

    return this;
}


PinBoard.bindClickEvent = function(){
    //select the picture
    this.pinsaddDom.find('#pins-shows-thumb ul li').click(function(){
        var url = $(this).children('img').attr('src');
        var selected = $(this).data('selected');

        if(selected == undefined){
            $(this).data('selected',true);
            $(this).children('img').before('<div class="img-check"></div>');
            console.log('add->' + url);
        }else{
            $(this).removeData('selected');
            $(this).children('div.img-check').remove();
            console.log('remove->' + url);
        }
    });
}



PinBoard.close = function(){
    this.reset();
    $.modal.close();
}

PinBoard.reset = function(){
    PinBoard.pinsaddDom.find('.wrap').hide();
    PinBoard.pinsaddDom.find('#wrap_buttons').show();
}

PinBoard.open = function(type){
    if( $('.pins-add-board').length == 1){
        $('.pins-add-board').modal({
            persist:true,
            opacity:30,
            overlayCss: { backgroundColor:"#000" }
        });
    }else{
        showLogin();
    }
    if(type != undefined){      //if click the sub menu directly
        PinBoard.pinsaddDom.find('.wrap').toggle();
        PinBoard.pinsaddDom.find('div[id^=wrap_]').hide();
        PinBoard.pinsaddDom.find('#wrap_' + (type == 0?'add_url':'add_upload')).show();
        PinBoard.loadBoards();
    }
}

PinBoard._getSelectedImages = function(){
    var images = new Array();
    this.pinsaddDom.find('#pins-shows-thumb ul li').each(function(){
        if($(this).data('selected') == true) images[images.length] = $(this).children('img').attr('src');
    });
    return images;
}

PinBoard._generateParams = function(images){
    var str = '';
    for(var i = 0; i < images.length; i++){
        str += 'image' + i + '=' + encodeURIComponent(images[i]) + '&';
    }
    str += 'count=' + images.length;
    return str;
}

PinBoard.submit = function(){

    var images = this._getSelectedImages();
    var str = this._generateParams(images);

    if(str.length > 0){
        $.ajax({
            url: '/customer/pins/addpin',
            type: 'post',
            dataType: 'json',
            data: $('#form-add-pins').serialize() + '&' + str,
            success: function(data) {
                $('#form-add-pins').children('#uploaded').val(0);
                if(data){
                    window.location = data.redirectUrl;
                }
            },
            beforeSend: function(){
                PinBoard.addingPin(true);
            },
            complete: function(){
                PinBoard.addingPin(false);
            }
        });
    }else{
        console.log('No image selected!');
    }
}


PinBoard.ajaxFileUpload = function(){
    /*$("#loading")
        .ajaxStart(function(){
            $(this).show();
        })
        .ajaxComplete(function(){
            $(this).hide();
        });
*/
    $.ajaxFileUpload({
        url:'/customer/pins/upload',
        secureuri:false,
        fileElementId:'fileToUpload',
        dataType: 'json',
        data:{name:'logan', id:'id'},
        success: function (data, status){
            /*if(typeof(data.error) != 'undefined'){
                if(data.error != ''){
                    alert(data.error);
                }else{
                    alert(data.msg);
                }
            }*/
            PinBoard.images = new Array();
            PinBoard.images[0] = data.url;
            PinBoard.images_show_index = 0;
            html = '<li style="display:none" data-selected="true"><img src="' + data.url + '"></li>';

            $('#form-add-pins').children('#uploaded').val(1);
            console.log('get ', data.url);

            $('#pins-shows-thumb ul').html(html);
            $('#pins-shows-thumb ul li').show();


        },
        error: function (data, status, e){
            alert(e);
        }
    });

    return false;

}


$(function(){
    PinBoard.init();
});