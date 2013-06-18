var MapShow = {
    config: null,
    data: new Array(),
    map: null,

    Open: function(){
        $('body').css({
            'overflow-y': 'hidden'
        });
        if($('.ms-container').length == 0){
            var html = this.generateHtml();
            $(html).appendTo($('body'));

            this.initialize();


            $('.ms-container #close').click(function(){
                MapShow.Close();
            });

            this.FetchData();
        }else{
            $('.ms-container').show();
        }

    },

    initialize: function(){
        var mapOptions = {
            zoom: 4,
            center: new google.maps.LatLng(-33, 151),
            panControl: false,
            zoomControl: false,
            scaleControl: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        this.map = new google.maps.Map(document.getElementById('full_map_canvas'),
            mapOptions);
    },

    generateHtml: function(){
        var html = '';

        html += '<div class="ms-container">';
        html += '    <div class="ms_header">';
        html += '        <a hre="javascript:void(0);" id="close">Close</a>';
        html += '    </div>';
        html += '    <div class="ms_main" id="full_map_canvas">';
        html += '    </div>';
        //html += '    <a href="javascript:void(0);" id="mycarousel-prev">上页</a> <a href="javascript:void(0);" id="mycarousel-next">下页</a>';
        html += '</div>'
        return html;
    },

    Close: function(){
        $('body').css({
            'overflow-y': 'auto'
        });
        $('.ms-container').hide();
    },

    FetchData: function(){
        //now start to fetch data
        $.ajax({
            url: '/default/pin/refresh3',
            type: 'POST',
            dataType: 'json',
            //data:{},
            beforeSend: function(){
            },
            success: function(data){
                for(var i = 0; i < data.length; i++){
                    MapShow.addMark(data[i]);
                }
                MapShow.fillMap();
            },
            complete: function(){

            }
        });
    },

    /***
     * Add mark to google map
     * @constructor
     */
    addMark: function(data){
        console.log(data);
        MapShow.data[MapShow.data.length] = data;     //insert data
        var myLatlng = new google.maps.LatLng(data.lat,data.lng);

        var marker = new google.maps.Marker({
            position: myLatlng,
            map: this.map,
            title: 'Hello World!'
        });
    },

    fillMap: function(){
        var bounds = new google.maps.LatLngBounds();
        for(var i = 0; i < MapShow.data.length; i++){
            var myLatlng = new google.maps.LatLng(MapShow.data[i].lat,MapShow.data[i].lng);
            bounds.extend(myLatlng);
        }
        MapShow.map.fitBounds(bounds);
    }
}