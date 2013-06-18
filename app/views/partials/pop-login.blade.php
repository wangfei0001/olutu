<div id="pop-login" class="round-box">
    <div id="login-content">
    Please login
        <div class="close"></div>
    <form method="post" action="<?php //echo $this->url(array('module'=>'customer','controller'=>'index','action'=>'login'),'customer',false);?>">
        <ul class="form-ul">
            <li><label>用户名或Email:</label><input type="text" name="email" id="email"></li>
            <li><label> 密码:</label><input type="password" name="password" id="password"></li>
            <li><label></label><input type="checkbox"> 两周内不重新登录 </li>
            <li><label></label><input type="submit" value="登录"> <a href="<?php //echo $this->url(array('module'=>'customer','controller'=>'index','action'=>'forgot'),'customer',false);?>">忘记密码？</a></li>
        </ul>
    </form>
    </div>
</div>