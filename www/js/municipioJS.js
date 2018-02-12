var servicioMunicipio = "http://192.168.1.39/sigatWS/municipio";
var db = openDatabase("sigat", "1.0", "sigat_Local", 2 * 1024 * 1024);

function municipioListar(dep_id,mun_id){
  if (sessionStorage.conexion == 1){
     municipioListarIL(dep_id,mun_id);
  }else{
     municipioListarOL(dep_id,mun_id)
  }
}
function municipioListarIL(dep_id,mun_id){
   // alert("departamento = "+document.getElementById("dep_id").value);
    $.ajax({      
            url: servicioMunicipio+"/listar/"+dep_id,
            type: "GET",
            timeout: 100000,
            dataType: "json"			                
    }).done( function( data ){
            var datos = JSON.parse( data ); 
            selectMunicipio(datos,mun_id);
    }).fail( function( jqXHR, textStatus, errorThrown ){
            alert("Error en listar Municipio");
    }).always( function(){

    });            
}
function municipioListarOL(dep_id,mun_id){
  db.transaction(function(tx){
          tx.executeSql(
            'select * from municipio where dep_id = ? ',
            [dep_id],
            function(tx,resultado){
              var datos = resultado.rows;
              console.log(datos);
              if (datos.length>0){
                selectMunicipio(datos,mun_id);
              }
            }
          );
        });
}
function municipioImp(rut_id){
  
    $.ajax({      
      url: servicioMunicipio+"/imp/"+rut_id,
      type: "GET",
      timeout: 100000,
      dataType: "json"                            
    }).done( function( data ){
      var datos = JSON.parse( data );             
       if (datos){
         db.transaction(function(tx) {
             tx.executeSql('DELETE FROM municipio');
            })
        $.each(datos, function(i){
            db.transaction(function(tx) {  
             tx.executeSql('INSERT INTO municipio ( mun_id,mun_descripcion,dep_id) VALUES (?, ?, ?)', 
                [datos[i].mun_id, datos[i].mun_descripcion, datos[i].dep_id]
                );
            })
        });
    }
    
    }).fail( function( jqXHR, textStatus, errorThrown ){
      alert("Error en importar municipio");
    }).always( function(){

    });               
}

function selectMunicipio(datos,mun_id){
    var str = "";
    $("#mun_id option").remove();
    $("#mun_id_act option").remove();
    str=str+"<option value = 'null' selectted=''></option>";
    $.each(datos, function(i){
        str = str+"<option  value='";
        str=str+datos[i].mun_id;
        if(datos[i].mun_id==mun_id){
            str=str+"' selected=''>";  
        }else{
            str=str+"'>";
        }
        str=str+datos[i].mun_descripcion;
        str=str+"</option>";
    });
    
    $("#mun_id").append(str);
    $("#mun_id_act").append(str);
}