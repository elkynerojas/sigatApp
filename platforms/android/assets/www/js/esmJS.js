var servicioEsm = "http://192.168.1.39/sigatWS/esm";
var db = openDatabase("sigat", "1.0", "sigat_Local", 2 * 1024 * 1024);

function esmListar(filtro){
  
    $.ajax({      
      url: servicioEsm+"/listar/"+filtro,
      type: "GET",
      timeout: 100000,
      dataType: "json"                            
    }).done( function( data ){
      var datos = JSON.parse( data );
            selectEsm(datos,'');
      console.log(JSON.stringify(datos));
    }).fail( function( jqXHR, textStatus, errorThrown ){
      alert("Error en Listar");
    }).always( function(){

    }); 
                
}

function esmImp(){
    $.ajax({      
      url: servicioEsm+"/imp",
      type: "GET",
      timeout: 100000,
      dataType: "json"                            
    }).done( function( data ){
      var datos = JSON.parse( data );             
       if (datos){
         db.transaction(function(tx) {
             tx.executeSql('DELETE FROM especie_mosca');
            })
        $.each(datos, function(i){
            db.transaction(function(tx) {  
             tx.executeSql('INSERT INTO especie_mosca ( esm_id,esm_descripcion) VALUES (?, ?)', 
                [datos[i].esm_id, datos[i].esm_descripcion]
                );
            })
        });
    }
    
    }).fail( function( jqXHR, textStatus, errorThrown ){
      alert("Error en importar arbol");
    }).always( function(){

    });               
}

function selectEsm(datos,esm_id){
    var str = "";
    $("#esm_id option").remove();
    $("#esm_id_act option").remove();
    str=str+"<option value = 'null' selectted=''></option>";
    $.each(datos, function(i){
        str = str+"<option  value='";
        str=str+datos[i].esm_id;
        if(datos[i].esm_id==esm_id){
           str=str+"' selected=''>";  
       }else{
            str=str+"'>";
       }
        str=str+datos[i].esm_descripcion;
        str=str+"</option>";
    });
    
    $("#esm_id").append(str);
    $("#esm_id_act").append(str);
}