$(function () {

    const API_KEY = 'c5ee4748d7145c114e378414ee8366b8';
    var idioma = $('html').attr('lang');

    $('#buscar').hide();

    //Cambio de color de los botones del nav
    $('.boton-nav').on('click', function(){ 
        $('.boton-nav').removeClass('active');
        $(this).addClass('active');
    });

    $('.boton-nav').first().on('click', function(){ // Botón Nav Home
        $('#home').show();
        $('#buscar').hide();
        $('#localizacion').hide();
    });

    $('.boton-nav').first().next().next().on('click', function(){ // Botón Nav Buscar
        $('#home').hide();
        $('#buscar').show();
        $('#localizacion').hide();
    });

    var onSuccess = function(position) {
        var divTiempo = $('#localizacion').children('.tiempo');

        $.get("https://api.openweathermap.org/data/2.5/weather?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&appid=" + API_KEY, function (data) {
            generarTiempo(divTiempo, data.name);
        });
    };    
    function onError(error) { alert('code: '    + error.code    + '\nmessage: ' + error.message + '\n'); }

    $('.boton-nav').first().next().on('click', function(){ // Botón Nav Localización
        $('#home').hide();
        $('#buscar').hide();
        $('#localizacion').show();

        
        navigator.geolocation.getCurrentPosition(onSuccess, onError);

    });

    

    $('#btn-buscar').on('click', function() { // Botón buscar tiempo ciudad
        var divTiempo = $('#buscar').children('.tiempo');
        var ciudad = $('input').val();
        $('input').val("");
        $('input').focus();

        generarTiempo(divTiempo, ciudad);
        

    });



    $('input').keypress(function(e){ // Para que si esta el usuario en el input y presiones el enter se pulse el boton de buscar
        var code = (e.keyCode ? e.keyCode : e.which);
        if(code==13){
            $('#btn-buscar').click();
        }
    });

    function dia(diasSumar) { // Función que te devuelve el día cuando le sumas unos dias
        var hoy = new Date();
        var dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
        var diasEn = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    
        var dia = hoy.getDay() + diasSumar;
    
        return idioma == 'es' ? dias[(dia > dias.length ? dia -= dias.length : dia) - 1] : diasEn[(dia > dias.length ? dia -= dias.length : dia) - 1];
    }

    function generarTiempo(divTiempo, ciudad){
        divTiempo.children().remove();
        $.get("https://api.openweathermap.org/data/2.5/weather?q=" + ciudad + "&lang=" + idioma + "&appid=" + API_KEY, function (data) {
            
            divTiempo.append('<h3>' + data.name + '</h3>')
            divTiempo.append('<p class="negrita">' + (idioma == "es" ? "Hoy" : "Today") + '</p>');
            
            divTiempo.append('<img class="col-3" src="https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png" alt="Imagen Tiempo">');
            divTiempo.append('<span class="col-3">' + Math.round(data.main.temp - 273.15) + 'ºC </span>')
            divTiempo.append('<span class="col">' + data.weather[0].description + '</span>');
            $.get("https://api.openweathermap.org/data/2.5/forecast?q=" + ciudad + "&lang=" + idioma + "&appid=" + API_KEY, function (data) {
                divTiempo.append('<div class="row mt-3"></div>');
                for (var i = 7; i < data.list.length - 8; i += 8) {
                    var divPrediccion = divTiempo.children('.row')
                    var d = data.list[i];
                    divPrediccion.append('<div class="col-3 mx-auto row"></div>');
                    var divCol = divPrediccion.children().last();

                    
                    divCol.append('<p class="negrita">' + dia((i + 1) / 8) + '</p>');

                    divCol.append('<img class="col-12" src="https://openweathermap.org/img/wn/' + d.weather[0].icon + '@2x.png" alt="Imagen Tiempo">');
                    divCol.append('<span class="col-12">' + Math.round(d.main.temp - 273.15) + 'ºC</span>');
                    divCol.append('<span class="col-12">' + d.weather[0].description + '</span>');
                }
            });
        }); 
    }

});



