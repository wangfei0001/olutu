<?php
    //include css and javascript
    $this->headLink()->appendStylesheet('/css/pin.css');
    $this->headScript()->offsetSetFile(6, '/js/re-pin.js');
?>
<div id="pins-repin-box" class="round-box modal-window">
        <div id="title"><span>转采</span><em id="close" title="关闭"></em></div>
        <div id="content" class="clearfix">
            <div id="preview" class="left">

            </div>
            <div class="left" id="repins-infor-area">
            <form method="post" id="repin-form">
                <input type="hidden" name="board" id="board" value="">
                <ul id="board-selector">

                </ul>
                <input type="text" name="addboard" id="addboard" data="快速创建新画板" maxlength="24">
                <img src="/images/loading.gif" class="loading addboard-loading" />

                <textarea rows="6" cols="32" name="description" id="description"></textarea>

                <p><input type="button" value="转采" class="flat-blue" onclick="repinBox.submit();"></p>
            </form>
            </div>
        </div>
</div>