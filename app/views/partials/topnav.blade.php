<nav class="top-bar">
    <!--div class="header-top trans8"></div-->
    <div class="search-area">
        <form method="get" action="/search">
            <input type="text" id="q" name="q" class="search-box text-tips" data="搜你喜欢"><button type="submit" class="search-button" title="找一找"></button>
        </form>
    </div><script type="text/javascript">
    $(function(){
        loadMessageCount();
    });
</script>
    <section class="login-area top-bar-section">
        <span class="nav" id="but-slideshow">幻灯片</span>
        <span class="highlight-but nav"><a href="/customer/invite">邀请</a></span>

        <ul class="left">
            <li class="has-dropdown">
                <a onclick="PinBoard.open();">添加 +</a>
                <ul class="dropdown">
                    <li><a href="javascript:void(0);" onclick="PinBoard.open(0);">网址收集</a></li>
                    <li><a href="javascript:void(0);" onclick="PinBoard.open(1);">上传收集</a></li>
                </ul>
            </li>
        </ul>

        <ul class="left">
            <li class="has-dropdown">
                <a href="">关于</a>
                <ul class="dropdown">
                    <li><a href="/about">关于我们</a></li>
                    <li><a href="/about/copyright">版权说明</a></li>
                    <li><a href="/about/tools">收集工具</a></li>
                    <li><a href="/about/contact">联系我们</a></li>
                </ul>
            </li>
        </ul>

            <span class="nav" id="shopping-cart-icon">
            <a href="/cart">购物车<span class="shopping-cart-item-count radius5" style="display: inline;">0</span></a>

            <div id="shopping-cart"><div class="flat-pink right" id="but-cart-view" data-url="/cart">查看购物车</div></div>
        </span>


        <ul class="left">

            <li class="has-dropdown" onclick="window.location='/customer'">
                <a href=""> <img src="http://pinterest.image//avatar/1.w30.jpg" id="avatar-thumb">上海阿菲    </a>
                <ul class="dropdown">
                    <li><a href="/customer/boards">画板</a></li>
                    <li><a href="/customer/pins">收集</a></li>
                    <li><a href="/customer/pins/index/filter/like">喜欢</a></li>
                    <li class="separator"></li>
                    <li><a href="/customer/invite">邀请/查找好友</a></li>
                    <li><a href="/customer/index/setting">帐号设置</a></li>
                    <li class="separator"></li>
                    <li><a href="/follower/wangfei001">粉丝</a></li>
                    <li><a href="/following/wangfei001">关注</a></li>
                    <li class="separator"></li>
                    <li><a href="{{ URL::to_action('account::login@logout') }}">退出</a></li>
                </ul>

            </li>

        </ul>

        <span class="message-count"><a href="/customer/messages" title="条短消息"></a></span>
    </section>
    <!--div class="header-float"></div-->
</nav>
    <?php //var_dump(Auth::guest())?>