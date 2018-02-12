var servicioCentroAcopio = "http://192.168.1.39/sigatWS/cac";
function rutaBuscar(mun_id){
  $.ajax({      
    url: servicioRuta+"/buscar/"+mun_id,
    type: "GET",
    timeout: 100000,
    dataType: "json"			                
  }).done( function( data ){
    var datos = JSON.parse( data );
    //alert(JSON.stringify(datos));             
    rutaVerBusqueda(datos);
  }).fail( function( jqXHR, textStatus, errorThrown ){
    alert("Error en rutaBuscar");
  }).always( function(){

  });            
}

function rutaListar(){
  
    $.ajax({      
      url: servicioRuta+"/listar/"+sessionStorage.cac_id,
      type: "GET",
      timeout: 100000,
      dataType: "json"                            
    }).done( function( data ){
      var datos = JSON.parse( data );
      selectRuta(datos);
      //console.log(JSON.stringify(datos));
    }).fail( function( jqXHR, textStatus, errorThrown ){
      alert("Error en Listar");
    }).always( function(){

    });                
}

function centroAcopioImp(rut_id){
  
    $.ajax({      
      url: servicioCentroAcopio+"/imp/"+rut_id,
      type: "GET",
      timeout: 100000,
      dataType: "json"                            
    }).done( function( data ){
      var datos = JSON.parse( data ); 
      //console.log('productorImp '+ JSON.stringify(data));            
       if (datos){
         db.transaction(function(tx) {
             tx.executeSql('DELETE FROM centro_acopio');
          })
          
        $.each(datos, function(i){
            db.transaction(function(tx) {  
             tx.executeSql('INSERT INTO centro_acopio ( cac_id,cac_descripcion, dep_id)'
              +'VALUES (?,?,?)', 
                [datos[i].cac_id, datos[i].cac_descripcion, datos[i].dep_id]
              );
            })   
        });
    }
    
    }).fail( function( jqXHR, textStatus, errorThrown ){
      alert("Error en importar centro de acopio");
    }).always( function(){

    });               
}


function rutaVerBusqueda (datos){
	alert(JSON.stringify(datos));
	$("#rut_id").val(datos.rut_id);
	$("#cod_ruta").val(document.getElementById("mun_id").value +'0'+datos.rut_id);
}

function selectRuta(datos){
    var str = "";
    $("#rut_id option").remove();
   
    str=str+"<option value = 'null' selectted=''></option>";
    $.each(datos, function(i){
        str = str+"<option  value='";
        str=str+datos[i].rut_id;
        
        str=str+"'>";
       
        str=str+datos[i].rut_id+' '+datos[i].rut_nombre;
        str=str+"</option>";
    });
    
    $("#rut_id").append(str);
}