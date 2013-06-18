
<div class="pins-add-board round-box modal-window">
    <div id="title"><span>收集</span><em id="close" title="关闭"></em></div>
    <div id="content" class="clearfix">
    <div class="wrap" id="wrap_buttons" style="display: block;">
        <div id="add_url" class="add_btn">网址收集</div>
        <div id="add_upload" class="add_btn">上传收集</div>
        <div id="create_board" class="add_btn">创建画廊</div>
    </div>
    <div class="wrap">
        <div id="wrap_add_url">
            <input type="text" id="txt_add_url" name="txt_add_url" class="txt" data="请拷贝完整的网址，我们将为您抓取图片">
            <input type="button" id="btn_add_url" value="采集图片">
        </div>

        <div id="wrap_add_upload">
            <form method="POST" enctype="multipart/form-data">
                <input type="file" id="fileToUpload" name="fileToUpload" class="" onchange="return PinBoard.ajaxFileUpload();">
            </form>
        </div>

            <div id="pins-shows" class="clearfix">   <!-- Bottom part, show images -->

                    <div id="pins-shows-thumb" class="left">
                        <img src="/images/ajax-loader.gif" id="grabing-loading" />

                        <span class="arrow-left"></span>
                        <span class="arrow-right"></span>
                        <ul></ul>
                    </div>

                <div class="left" id="pins-infor-area">
                    <form method="post" id="form-add-pins">
                        <input type="hidden" name="uploaded" id="uploaded" value="0">
                        <input type="hidden" name="board" id="board" value="">
                        <ul id="board-selector">

                        </ul>
                        <input type="text" name="addboard" id="addboard" data="快速创建新画板" maxlength="24">
                        <img src="/images/loading.gif" class="loading addboard-loading" />
                    <div>
                        <p><label for="keywords">添加标签</label></p>
                    <input type="text" id="keywords" name="keywords" data=''>
                    </div>
                    <div>
                        <textarea rows="6" cols="32" data="简短的介绍一下吧" name="description" id="description"></textarea>
                    </div>
                    <div>
                        <input type="button" value="添加图片" id="but-addpin" class="flat-blue" onclick="PinBoard.submit();"> (还可以输入XXX字)
                    </div>
                    </form>
                </div>
            </div>
    </div>
    </div>
</div>