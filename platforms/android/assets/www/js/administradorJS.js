var servicioAdministrador = "http://192.168.1.39/sigatWS/administrador";
var db = openDatabase("sigat", "1.0", "sigat_Local", 2 * 1024 * 1024);

function tecnicoBuscar(tecnico){
    //alert("prod-listar = "+document.getElementById("filtro").value);
    $.ajax({      
            url: servicioTecnico+"/buscar/"+tecnico,
            type: "GET",
            timeout: 100000,
            dataType: "json"			                
    }).done( function( data ){
            var datos = JSON.parse( data ); 
            console.log("listar js "+JSON.stringify(datos));               
        productorVerLista(datos);
//        selectPersona(datos,persona);
    }).fail( function( jqXHR, textStatus, errorThrown ){
            alert("Campo de Busqueda Vacio");
    }).always( function(){

    });            
}

function administradorImp(rut_id){
  
    $.ajax({      
      url: servicioAdministrador+"/imp/"+rut_id,
      type: "GET",
      timeout: 100000,
      dataType: "json"                            
    }).done( function( data ){
      var datos = JSON.parse( data ); 
      //console.log(JSON.stringify(data));            
       if (datos){
         db.transaction(function(tx) {
             tx.executeSql('DELETE FROM persona where tip_id = 1 ');
            })
          db.transaction(function(tx) {
             tx.executeSql('DELETE FROM administrador ');
            })
        $.each(datos, function(i){
            db.transaction(function(tx) {  
             tx.executeSql('INSERT INTO persona ( per_cc,per_nombre,per_apellido,'
              +'gen_id,per_telefono,per_direccion,per_correo,tip_id, per_cc_aux) VALUES (?,?,?,?,?,?,?,?,?)', 
                [datos[i].per_cc, datos[i].per_nombre, datos[i].per_apellido, datos[i].gen_id,
                datos[i].per_telefono,  datos[i].per_direccion, datos[i].per_correo, datos[i].tip_id, datos[i].per_cc]
                );
            })
            db.transaction(function(tx) {  
             tx.executeSql('INSERT INTO administrador ( adm_id,per_cc,cac_id )'
              +' VALUES (?,?,?)', 
                [datos[i].adm_id, datos[i].per_cc, datos[i].cac_id]
                );
            })
        });
    }
    
    }).fail( function( jqXHR, textStatus, errorThrown ){
      alert("Error en importar administrador");
    }).always( function(){

    });               
}

