var servicioPersona = "http://192.168.1.39/sigatWS/persona";

function personaInsertar(){
    var dataJson = '{"per_cc":"'+ document.getElementById("per_cc").value + '",\n\
                    "per_nombre":"' + document.getElementById("per_nombre").value + '",\n\
                    "per_apellido":"' + document.getElementById("per_apellido").value + '",\n\
                    "gen_id":"' + document.getElementById("gen_id").value + '",\n\
                    "per_direccion":"' + document.getElementById("per_direccion").value + '",\n\
                    "per_correo":"' + document.getElementById("per_correo").value + '",\n\
                    "per_telefono":"' + document.getElementById("per_telefono").value + '",\n\
                    "tip_id":"' + document.getElementById("tip_id").value +'"}';
    alert(dataJson);
    $.ajax({
        url: servicioPersona,
        type: "POST",
        timeout: 100000,
        dataType: "json",
        data: dataJson	                
    }).done( function(data){
            console.log(JSON.stringify(data));
            var datos = JSON.parse(data);
            alert(datos.mensaje);
        
    }).fail( function( jqXHR, textStatus, errorThrown ){
       alert( "Error en insertar" );
     }).always( function(){

     }); 
}
