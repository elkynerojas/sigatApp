var servicioArbol = "http://192.168.1.39/sigatWS/arbol";
var db = openDatabase("sigat", "1.0", "sigat_Local", 2 * 1024 * 1024);

function arbolListar(filtro){
  
    $.ajax({      
      url: servicioArbol+"/listar/"+filtro,
      type: "GET",
      timeout: 100000,
      dataType: "json"                            
    }).done( function( data ){
      var datos = JSON.parse( data );
            selectArbol(datos,'');
      console.log(JSON.stringify(datos));
    }).fail( function( jqXHR, textStatus, errorThrown ){
      alert("Error en Listar");
    }).always( function(){

    }); 
                
}

function arbolImp(){
  
    $.ajax({      
      url: servicioArbol+"/listar",
      type: "GET",
      timeout: 100000,
      dataType: "json"                            
    }).done( function( data ){
      var datos = JSON.parse( data );             
       if (datos){
         db.transaction(function(tx) {
             tx.executeSql('DELETE FROM arbol');
            })
        $.each(datos, function(i){
            db.transaction(function(tx) {  
             tx.executeSql('INSERT INTO arbol ( arb_id,arb_descripcion) VALUES (?, ?)', 
                [datos[i].arb_id, datos[i].arb_descripcion]
                );
            })
        });
    }
    
    }).fail( function( jqXHR, textStatus, errorThrown ){
      alert("Error en importar arbol");
    }).always( function(){

    });               
}

function selectArbol(datos,arb_id){
    var str = "";
    $("#arb_id option").remove();
    $("#arb_id_act option").remove();
    str=str+"<option value = 'null' selectted=''></option>";
    $.each(datos, function(i){
        str = str+"<option  value='";
        str=str+datos[i].arb_id;
        if(datos[i].arb_id==arb_id){
           str=str+"' selected=''>";  
       }else{
            str=str+"'>";
       }
        str=str+datos[i].arb_descripcion;
        str=str+"</option>";
    });
    
    $("#arb_id").append(str);
    $("#arb_id_act").append(str);
}