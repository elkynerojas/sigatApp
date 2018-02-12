var servicioRuta = "http://192.168.1.39/sigatWS/ruta";

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
  if (sessionStorage.conexion == 1){
    rutaListarIL();
  }else{
    rutaListarOL();
  }
}

function rutaListarIL(){
  
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

function rutaListarOL(){
  db.transaction(function(tx){
      tx.executeSql(
      'select * from ruta where cac_id = ? ',
      [sessionStorage.cac_id],
      function (tx, resultado) {
      var datos = resultado.rows;
      selectRuta(datos);
    });
    });
}

function rutaImp(rut_id){
  
    $.ajax({      
      url: servicioRuta+"/imp/"+rut_id,
      type: "GET",
      timeout: 100000,
      dataType: "json"                            
    }).done( function( data ){
      var datos = JSON.parse( data ); 
      //console.log('productorImp '+ JSON.stringify(data));            
       if (datos){
         db.transaction(function(tx) {
             tx.executeSql('DELETE FROM ruta');
          })
          
        $.each(datos, function(i){
            db.transaction(function(tx) {  
             tx.executeSql('INSERT INTO ruta ( rut_id,rut_nombre,rut_descripcion,'
              +'cac_id,mun_id,rut_fecha_reg,rut_fecha_act,rut_adm_reg,rut_adm_act,est_id) VALUES (?,?,?,?,?,?,?,?,?,?)', 
                [datos[i].rut_id, datos[i].rut_nombre, datos[i].rut_descripcion, datos[i].cac_id,
                datos[i].mun_id,  datos[i].rut_fecha_reg, datos[i].rut_fecha_act, datos[i].rut_adm_reg, 
                datos[i].rut_adm_act, datos[i].est_id]
                );
            })   
        });
    }
    
    }).fail( function( jqXHR, textStatus, errorThrown ){
      alert("Error en importar ruta");
    }).always( function(){

    });               
}


function rutaVerBusqueda (datos){
	
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