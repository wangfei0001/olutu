<!DOCTYPE html>
<html>
<head>
    <title>Bootstrap 101 Template</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Bootstrap -->
    <link href="/bootstrap/css/bootstrap.min.css" rel="stylesheet" media="screen">

    <script type="text/javascript" src="/js/jquery.cookie.js"></script>
    <script type="text/javascript" src="/js/jquery.simplemodal.1.4.2.min.js"></script>
    <script type="text/javascript" src="/js/jquery.mousewheel.min.js"></script>
    <script type="text/javascript" src="/js/ajaxfileupload.js"></script>
    <script type="text/javascript" src="/js/add-pin.js"></script>
    <script type="text/javascript" src="/js/re-pin.js"></script>
    <script type="text/javascript" src="/js/pin-bar.js"></script>
    <script type="text/javascript" src="/js/pins.js"></script>
    <script type="text/javascript" src="/js/waterfall.js"></script>
    <script type="text/javascript" src="/js/jquery.lazyload.min.js"></script>
    <script type="text/javascript" src="/js/jquery.jcarousel.min.js"></script>
    <script type="text/javascript" src="/js/slideshow.js"></script>
    <script type="text/javascript" src="/js/mapshow.js"></script>
</head>
<body>
@include('partials.topnav')

@if ( isset($toolbar) && $toolbar == true )
{{$toolbarView}}
@endif


<!-- check for flash notification message -->
@if(Session::has('flash_error'))
<div id="flash_error">{{ Session::get('flash_error') }}</div>
@elseif(Session::has('flash_success'))
<div id="flash_success">{{ Session::get('flash_success') }}</div>
@else
<div id="flash_notice">{{ Session::get('flash_notice') }}</div>
@endif




<div class="container">

@yield('content')


</div>


@include('partials.footer')



@include('partials.addpin')

@include('partials.repin')

<script src="http://code.jquery.com/jquery.js"></script>
<script src="/bootstrap/js/bootstrap.min.js"></script>
</body>
</html>