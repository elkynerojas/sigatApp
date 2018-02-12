var servicioDepartamento = "http://192.168.1.39/sigatWS/departamento";
var db = openDatabase("sigat", "1.0", "sigat_Local", 2 * 1024 * 1024);

function departamentoListar(dep_id){
   if (sessionStorage.conexion == 1){
    departamentoListarIL(dep_id);
  }else{
    departamentoListarOL(dep_id);
  }
}
function departamentoListarIL(dep_id){
    //alert("prod-listar = "+document.getElementById("filtro").value);
    $.ajax({      
            url: servicioDepartamento+"/listar",
            type: "GET",
            timeout: 100000,
            dataType: "json"			                
    }).done( function( data ){
            var datos = JSON.parse( data );    
            selectDepartamento(datos,dep_id);
    }).fail( function( jqXHR, textStatus, errorThrown ){
            alert("Error en listar Departamento");
    }).always( function(){

    });            
}
function departamentoListarOL(dep_id){
   db.transaction(function(tx){
          tx.executeSql(
            'select * from departamento',
            [],
            function(tx,resultado){
              var datos = resultado.rows;
              console.log(datos);
              if (datos.length>0){
                selectDepartamento(datos,dep_id);
              }
            }
          );
        });
}
function selectDepartamento(datos,dep_id){
    var str = "";
    $("#dep_id option").remove();
    $("#dep_id_act option").remove();
    str=str+"<option value = 'null' selectted=''></option>";
    $.each(datos, function(i){
        str = str+"<option  value='";
        str=str+datos[i].dep_id;
        if(datos[i].dep_id==dep_id){
           str=str+"' selected=''>";  
       }else{
            str=str+"'>";
       }
        str=str+datos[i].dep_descripcion;
        str=str+"</option>";
    });
    
    $("#dep_id").append(str);
    $("#dep_id_act").append(str);
}

function departamentoImp(rut_id){
  
    $.ajax({      
      url: servicioDepartamento+"/imp/"+rut_id,
      type: "GET",
      timeout: 100000,
      dataType: "json"                            
    }).done( function( data ){
      var datos = JSON.parse( data );             
       if (datos){
         db.transaction(function(tx) {
             tx.executeSql('DELETE FROM departamento');
            })
        $.each(datos, function(i){
            db.transaction(function(tx) {  
             tx.executeSql('INSERT INTO departamento ( dep_id,dep_descripcion,reg_id) VALUES (?, ?, ?)', 
                [datos[i].dep_id, datos[i].dep_descripcion, datos[i].reg_id]
                );
            })
        });
    }
    
    }).fail( function( jqXHR, textStatus, errorThrown ){
      alert("Error en importar departamento");
    }).always( function(){

    });               
}
