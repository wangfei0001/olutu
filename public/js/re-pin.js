/**
 * Created by JetBrains PhpStorm.
 * User: 15
 * Date: 12-4-7
 * Time: 下午10:18
 * To change this template use File | Settings | File Templates.
 */
var repinBox = {
    repinDom : null,
    boardDom : null,
    clickDom : null,
    pinid : null,
    thumb : null,
    repin : false
};

repinBox.init = function(){
    this.repinDom = $('#pins-repin-box');
    this.boardDom = $('#pins-repin-box').find('#board-selector');

    $('#pins-repin-box').find('#close').click(function(){
        repinBox.close();
    });


    this.getBoards()._initAddBoard();

    bindTextTips(this.repinDom.find('#addboard'));
}

repinBox._initAddBoard = function(){
    var addBoardDom = repinBox.repinDom.find('#addboard');
    var addBoardLoadingDom = repinBox.repinDom.find('.addboard-loading');
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
                        repinBox._insertBoard(data.boardid, addBoardDom.val());
                        addBoardDom.val('');
                        repinBox._bindBoardSelectorEvent();     //bind event
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


repinBox.open = function(dom){
    this.clickDom = $(dom);

    this.pinid = $(dom).parent().parent().data('id');

    var result = this.getThumbUrl();
    if(result){

        $('#pins-repin-box').find('#preview').html('<img src="'+this.thumb.url+'" />');

        bindScroll($('#pins-repin-box').find('#preview'), this.thumb.height);

        $('#pins-repin-box').modal({
            persist:true,
            opacity:30,
            overlayCss: { backgroundColor:"#000" }
        });
        this.repin = true;
    }/*else{
        alert('Invalid');
    }*/

}

repinBox.getThumbUrl = function(){
    var result = false;
    if(this.pinid != null){
        $.ajax({
            url: '/account/pin/getthumb',
            type: 'post',
            dataType: 'json',
            async:false,
            data: {
                id:this.pinid
            },
            success: function(data) {
                if(data.login != undefined && data.login == false){
                    showLogin();
                }else{
                    if(data.result){
                        repinBox.thumb = data;
                        result = true;
                    }else{  //error happen

                    }
                }
            }
        });
    }else
        throw('Invalid pin id');

    return result;
}

repinBox._bindBoardSelectorEvent = function(){
    var $board_selector = repinBox.repinDom.find('#board-selector');
    $board_selector.children('li').click(function(){
        var $checkboxDom = $(this).children('input[type=checkbox]');
        $(this).parent().find('input:checked').attr('checked',false);
        console.log($checkboxDom.attr('checked'));
        if($checkboxDom.is(':checked')){
            $checkboxDom.attr('checked',false);
            repinBox.repinDom.find('#board').val(0);
        }else{
            $checkboxDom.attr('checked',true);
            repinBox.repinDom.find('#board').val($checkboxDom.val());
        }
    });
}

/***
 * Insert board
 *
 * @param id
 * @param name
 * @private
 */
repinBox._insertBoard = function(id, name){
    var $board_selector = repinBox.boardDom;
    var html = '<li>';
    html += '<input type="checkbox" value="' + id + '">&nbsp;';
    html += name;
    html += '</li>';
    $board_selector.append(html);
}

repinBox.getBoards = function(){
    if(repinBox.boardDom.children('li').length > 1) return;   //if we have load it.
    $.ajax({
        url: '/account/board/all',
        type: 'post',
        dataType: 'json',
        async:false,
        data: {},
        success: function(data) {
            if(data){
                for(var i=0;i<data.length;i++){
                    //PinBoard.pinsaddDom.find('#board').append(new Option(data[i].name, data[i].id, true, true));
                    repinBox._insertBoard(data[i].id, data[i].name)
                }
                repinBox._bindBoardSelectorEvent();
            }
        }
    });
    return this;
}


repinBox.submit = function(){
    $.ajax({
        url: '/customer/pins/repin',
        type: 'post',
        dataType: 'json',
        data: $('#repin-form').serialize() + '&pinid=' + this.pinid,
        success: function(data) {
            if(data){

                repinBox.reset();
            }
            repinBox.close();
        }
    });
}

repinBox.reset = function(){
    $('#pins-repin-box').find('#description').val('');
}

repinBox.close = function(){
    $.modal.close();
    this.repin = false;
    if(this.clickDom.attr('class') == 'repin'){     //隐藏浮动工具栏
        this.clickDom.parent().hide();
    }
}


$(function(){
    repinBox.init();
});