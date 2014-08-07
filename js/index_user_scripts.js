(function()
{
 "use strict";
    var key="";
 /*
   hook up event handlers 
 */

    function format_coordinate(coord)
{
    var abs= coord/Math.abs(coord);
    var response=Math.abs(coord);

    if(Math.abs(Math.floor(coord))>999 && Math.abs(Math.floor(coord))<10000)
    {
        response="0" + Math.abs(coord);
    }
    else if(Math.abs(Math.floor(coord))>99 && Math.abs(Math.floor(coord))<1000)
    {
        response="00" + Math.abs(coord);
    }
    else if(Math.abs(Math.floor(coord))>9 && Math.abs(Math.floor(coord))<100)
    {
        response="000" + Math.abs(coord);
    }
    else if(Math.abs(Math.floor(coord)<10))
    {
        response="0000" + Math.abs(coord);
    }

    response=parseFloat(response.substr(0,3)) + parseFloat(response.substr(3)/60);

    return abs*response;

//return parseFloat(coord.substr(0,2)) + parseFloat(coord.substr(2)/60);
}
    
 function register_event_handlers()
 {
     
   
      $(document).on("intel.xdk.device.hardware.back", function() {
    
    //continue to grab the back button
    intel.xdk.device.addVirtualPage(); 
   // alert("BACK");
 //   document.getElementsByTagName("body")[0].innerHTML += "Hardware back button pressed";
    
});  
   
           
    
        $(document).on("click", "#button_slide", function(evt)
        {
            
          
            document.getElementById('slider-levi').style.top = document.getElementById('af-header-0').clientHeight+'px';
 
        
         uib_sb.toggle_sidebar($(".uib_w_5"));  
        });
        $(document).on("click", ".uib_w_16", function(evt)
        { 
              
               $('#sva_vozila').empty();
        $('#sva_vozila').append('<ul class="list widget uib_w_25" data-uib="app_framework/listview" data-ver="1" id="lista_vozila">');
            uib_sb.toggle_sidebar($(".uib_w_5"));  
            $.ajax({
  type: "POST",
  url: "http://www.autotrack.rs/android_app_service/lista_vozila.php",
  data: { key: key },
  dataType: 'json',
  success: function (data) { 
      $('#lista_vozila').empty();
     
        $.each(data, function(index, element) {
           $('#lista_vozila').append('<li ><a id="'+element.id+'" class="vozilo">'+element.ime+'</a>');

        });
    }
 });        
      
         activate_subpage("#sva_vozila"); 
        });
        $(document).on("click", ".uib_w_23", function(evt)
        {
            
              $("#map").height($(window).height()-document.getElementById('af-header-0').clientHeight);

           var mapOptions = {
        center: new google.maps.LatLng( 0,0),
        zoom: 5,
        mapTypeControl: false,
        streetViewControl: false,
        navigationControl: true,
        scrollwheel: false,
        navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
        
           var map ;        
           var lat=0;
           var longi=0;
           var latc=0;
           var longic=0;
            
            var maxlongi=0;
            var minlongi=100;
            
            var maxlat=0;
            var minlat=100;

      
          
  //$('#map').html('<img src="http://www.steaz.com/dexx/template/map/img/loading.gif" >');
             map = new google.maps.Map(document.getElementById("map"), mapOptions);
                    $.ajax({
  type: "POST",
  url: "http://www.autotrack.rs/android_app_service/lokacija_svih_vozila.php",
  data: { unit_id: evt.currentTarget.id, key: key },
  dataType: 'json',
  success: function (data) { 
        $.each(data, function(index, element) {
            if(element.message=="success"){
        
           lat=format_coordinate(element.latitude);
            longi=format_coordinate(element.longitude);
                

                if(lat<minlat)
                    minlat=lat;
                if(lat>maxlat)
                    maxlat=lat;
                if(longi<minlongi)
                    minlongi=longi;
                 if(longi>maxlongi)
                    maxlongi=longi;
                
            }
            else{
                alert('Nema podataka za trazeno vozilo');
            }
             
            google.maps.event.trigger(map,'resize');
           latc=(maxlat+minlat)/2;
           longic =(maxlongi+minlongi)/2;

       var center = new google.maps.LatLng(latc, longic);
        

    map.panTo(center);
              google.maps.event.trigger(map,'resize');
   var myLatlng = new google.maps.LatLng(lat,longi);
              var marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      icon:'images/icon24.png',
      title: 'Autotrack'
  });

     
            
        //Create an infoWindow
        var infowindow = new google.maps.InfoWindow();
        
        //set the content of infoWindow
        infowindow.setContent("<div><span style='color:black'>Naziv:"+element.ime+"</span></div><div><span style='color:black'>Brzina:"+element.brzina+"</span></div>");
        
        //add click event listener to marker which will open infoWindow          
        google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map,marker); // click on marker opens info window 
        });   
            
            
            
            google.maps.event.trigger(map,'resize');
        
            
        });
      
    }
 }); 
  
            uib_sb.toggle_sidebar($(".uib_w_5"));  
           
             activate_subpage("#map"); 
     
        });
        
        $(document).on("click", "#buttonlogin", function(evt)
        {
            
            
            
              var user = document.getElementById('user').value;
            var pass = document.getElementById('pass').value;
            if (user==='' || pass===''){
            alert('Niste uneli korisnicko ime ili lozinku');  
                //break;
            }
           else{
               $.ajax({
  type: "POST",
  url: "http://www.autotrack.rs/android_app_service/login.php",
  data: { user: user, pass: pass }
  //data: { user: "matesic0707", pass: "qwerty" }
  //data: { user: $( "#user" ).val(), pass: $( "#pass" ).val() }
})
  .done(function( msg ) {

    var obj = jQuery.parseJSON( msg );
if( obj.message === "success" ){
    key = obj.key;
    // document.getElementById('sva_vozila').style.width = $( document ).width();
    //       document.getElementById('sva_vozila').style.height = $( document ).height();
    
   activate_subpage("#sva_vozila"); 
}
else{
alert("Pogresano korisnicko ime ili lozinka!");
}
  }
       )
               .error(function( msg ) {
alert('Nepravilno korisnicko ime ili lozinka');

  }
                     ) }
        });
     
     

  
       $(document).on("click", ".vozilo", function(evt)
       {
           $('#map').empty();
 
 $("#map").height($(window).height()-document.getElementById('af-header-0').clientHeight);

           var mapOptions = {
        center: new google.maps.LatLng( 0,0),
        zoom: 8,
        mapTypeControl: false,
        streetViewControl: false,
        navigationControl: true,
        scrollwheel: false,
        navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
               map = new google.maps.Map(document.getElementById("map"), mapOptions);
   
           var map ;        
           var lat=0;
           var longi=0;

                    $.ajax({
  type: "POST",
  url: "http://www.autotrack.rs/android_app_service/lokacija_vozila.php",
  data: { unit_id: evt.currentTarget.id, key: key },
  dataType: 'json',
  success: function (data) { 
     
        $.each(data, function(index, element) {
            if(element.message=="success"){
   
                
           lat=format_coordinate(element.latitude);
            longi=format_coordinate(element.longitude);
//alert(lat+'-'+longi);
            }
            else{
                alert('Nema podataka za trazeno vozilo');
            }
       
           google.maps.event.trigger(map,'resize');
       var center = new google.maps.LatLng(lat, longi);
//lert(lat+'-'+longi);
    map.panTo(center);
           //  google.maps.event.trigger(map,'resize');
   var myLatlng = new google.maps.LatLng(lat,longi);
              var marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      icon:'images/icon24.png',
      title: 'Autotrack'
  });
            
                     
        //Create an infoWindow
        var infowindow = new google.maps.InfoWindow();
        
        //set the content of infoWindow
        infowindow.setContent("<div><span style='color:black'>Naziv:"+element.ime+"</span></div><div><span style='color:black'>Brzina:"+element.brzina+"</span></div>");
        
        //add click event listener to marker which will open infoWindow          
        google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map,marker); // click on marker opens info window 
        });   
            
           
        });
      
    }
 }); 
           
             activate_subpage("#map"); 
         
        });
        
        
        
        
        
        $(document).on("click", ".uib_w_17", function(evt)
        {
            
                  $.ajax({
  type: "POST",
  url: "http://www.autotrack.rs/android_app_service/lista_vozila.php",
  data: { key: key },
  dataType: 'json',
  success: function (data) { 
      $('#vozilo_select').empty();
     
        $.each(data, function(index, element) {
           $('#vozilo_select').append('<option  value="'+element.id+'">'+element.ime+'</option>');

        });
    }
 }); 
          uib_sb.toggle_sidebar($(".uib_w_5"));  
         activate_subpage("#date"); 
        });
     


     
     
     
     
     
     
     
        $(document).on("click", "#istorija_trazi", function(evt)
        {
             var datum_od = document.getElementById('od_date').value;
            var datum_do = document.getElementById('do_date').value;
            var unit_id = document.getElementById('vozilo_select').value;
          //  alert(datum_od+'-'+datum_do);
            var startDate =  Date.parse(datum_od);
            var endDate =  Date.parse(datum_do);
            var max_proslost = endDate-2592000000;//2592000000 30 dana u milisekundama
        //    alert (max_proslost);
      if (startDate < max_proslost) { 
    alert ("maximalno 30 dana!");
}
             //  document.getElementById('iframe_table').src='images/loader.gif';
     /*       
            
            $.ajax({
  type: "POST",
  url: "http://www.autotrack.rs/android_app_service/istorija_kretanja.php",
  data: { key: key,date_od:datum_od,date_do:datum_do,unit_id:unit_id}
})
  .done(function( msg ) {*/
      
      //  $('#tabel_vozila').empty();
     //  $('#tabel_vozila').append(msg);
     var visina = $(window).height()-document.getElementById('af-header-0').clientHeight;
           var sirina= $(window).width();
      document.getElementById('iframe_table').src='http://www.autotrack.rs/android_app_service/istorija_kretanja.php?key=1111&visina='+visina+'&sirina='+sirina+'&date_od='+datum_od+'&date_do='+datum_do+'&unit_id='+unit_id+'';
 
      activate_subpage("#pozicije"); 
      
     // $("#date").height($(window).height()-document.getElementById('af-header-0').clientHeight);
 // });
        
        });
        
        
         //logout
        $(document).on("click", ".uib_w_18", function(evt)
        {
            key="";
           uib_sb.toggle_sidebar($(".uib_w_5"));  
            activate_subpage("#mainsub"); 
        });
     
     //iscrtaj na mapi
        $(document).on("click", ".uib_w_29", function(evt)
        {
                      var map ; 
               var datum_od = document.getElementById('od_date').value;
            var datum_do = document.getElementById('do_date').value;
            var unit_id = document.getElementById('vozilo_select').value;
          //  alert(datum_od+'-'+datum_do);
            var startDate =  Date.parse(datum_od);
            var endDate =  Date.parse(datum_do);
            var max_proslost = endDate-2592000000;//2592000000 30 dana u milisekundama
        //    alert (max_proslost);
      if (startDate < max_proslost) { 
    alert ("maximalno 30 dana!");
}
        
           //  $('#map').empty();
 
 $("#map").height($(window).height()-document.getElementById('af-header-0').clientHeight);

     
   
            
         
           var latc=0;
           var longic=0;
            var nizMarkera= []; 
            var brojacMarkera=0;
            
            var maxlongi=0;
            var minlongi=100;
            
            var maxlat=0;
            var minlat=100;
           var lat=0;
           var longi=0;
            var drivePlanCoordinates = [];
            var valueToPush = [];
                   $.ajax({
  type: "POST",
  url: "http://www.autotrack.rs/android_app_service/istorija_kretanja_poly.php",
                   
  data: { key: key,date_od:datum_od,date_do:datum_do,unit_id:unit_id},
  dataType: 'json',
  success: function (data) {
      
            valueToPush = [];
           nizMarkera  = [];
      // alert('done');
       $.each(data, function(index, element) {
            if(element.message=="success"){
   
                  //  alert('suc');
           lat=format_coordinate(element.latitude);
            longi=format_coordinate(element.longitude);

                 if(lat<minlat)
                    minlat=lat;
                if(lat>maxlat)
                    maxlat=lat;
                if(longi<minlongi)
                    minlongi=longi;
                 if(longi>maxlongi)
                    maxlongi=longi;
                
            }
            else{
                alert('Nema podataka za trazeno vozilo');
            }
             
          //  google.maps.event.trigger(map,'resize');
           latc=(maxlat+minlat)/2;
           longic =(maxlongi+minlongi)/2;
           
            var point =new google.maps.LatLng(lat,longi);
       drivePlanCoordinates.push(point);
                

           if(element.stanje_vozila=='Parkiran'){
            //   console.log(lat);
            //    console.log(longi);
               var marker = new Object();
marker.lat = lat;
marker.longi = longi;
marker.stanje = element.stanje_vozila;
               marker.vreme = element.gps_vreme;

nizMarkera[brojacMarkera]=marker;
                //console.log(nizMarkera);
              
             //  console.log(nizMarkera[brojacMarkera].lat);
               
               brojacMarkera++
           }
            

           //  google.maps.event.trigger(map,'resize');

          
        });
            var drivepath = new google.maps.Polyline({
    path: drivePlanCoordinates,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 3
  });
    
         var mapOptions = {
        center: new google.maps.LatLng( 0,0),
        zoom: 8,
        mapTypeControl: false,
        streetViewControl: false,
        navigationControl: true,
        scrollwheel: false,
        navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
               map = new google.maps.Map(document.getElementById("map"), mapOptions);
    google.maps.event.trigger(map,'resize');
    var center = new google.maps.LatLng(latc, longic);
    map.panTo(center);
   drivepath.setMap(map); 
      google.maps.event.trigger(map,'resize');
      
      
             var i;
     
         for(i=0;i<nizMarkera.length;i++)  { 
           
   var myLatlng = new google.maps.LatLng(nizMarkera[i].lat,nizMarkera[i].longi);
    var marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      icon:'images/stop.gif',
      title: 'Autotrack'
  });
               //Create an infoWindow
        var infowindow = new google.maps.InfoWindow();
        
        //set the content of infoWindow
        infowindow.setContent("<div><span style='color:black'>"+nizMarkera[i].stanje+"</span></div><div><span style='color:black'>"+nizMarkera[i].vreme+"</span></div>");
        
        //add click event listener to marker which will open infoWindow          
        google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map,marker); // click on marker opens info window 
        });
         
         
}
      
      
  }  
  });
            
          
  
            activate_subpage("#map"); 
            
        });
   
     /*
     $(document).on("click", "#button_slide", function(evt)
        {
  
        });
        $(document).on("click", "#istorija_trazi", function(evt)
        {
       
        });
     */
}

 $(document).ready(register_event_handlers);

 
 
    
})();


