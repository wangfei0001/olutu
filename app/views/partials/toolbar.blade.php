<div class="top-quickmenu">
    <ul class="nav">
        <li class="menu">所有分类<em></em>
            @if(!empty($categories))
            <ul>
                @foreach($categories as $key=>$category)
                <li><a href="{{ URL::to_action('main::category@index',array($category['seo_name'])) }}<?php //echo $this->url(array('controller'=>'category','action'=>'index','cat'=>$category['seo_name']),'category',false); ?>"><?php echo $category['name']?></a></li>
                @endforeach
            </ul>
            @endif
        </li>
        <li><a href="">热图排行榜</a></li>
        <li><a href="<?php //echo $this->url(array('controller'=>'pin','action'=>'product'),'default',true);?>">热卖商品</a></li>
        <li><a href="">邀请朋友</a></li>
    </ul>
</div>
