var servicioCap = "http://192.168.1.39/sigatWS/cap";

function capInsertar(){
  var dataJson = '{"tec_id":"'+ sessionStorage.tec_id + '",\n\
                  "cac_id":"' + sessionStorage.cac_id + '",\n\
                  "vig_id":"' + document.getElementById("vig_id").value + '",\n\
                  "rut_id":"' + document.getElementById("rut_id").value + '",\n\
                  "tra_id":"' + document.getElementById("tra_id").value + '",\n\
                  "pre_id":"' + document.getElementById("pre_id").value + '",\n\
                  "esm_id":"' + document.getElementById("esm_id").value + '",\n\
                  "cap_fecha_cap":"' + document.getElementById("cap_fecha_cap").value + '",\n\
                  "cap_machos":"' + document.getElementById("cap_machos").value + '",\n\
                  "cap_hembras":"' + document.getElementById("cap_hembras").value + '",\n\
                  "fen_id":"' + document.getElementById("fen_id").value + '",\n\
                  "cap_fecha_dia":"' + document.getElementById("cap_fecha_dia").value + '",\n\
                  "cap_mue":"' + document.getElementById("cap_mue").value + '"}';
                  
    //alert(dataJson);
  $.ajax({
    url: servicioCap,
    type: "POST",
    timeout: 100000,
    dataType: "json",
    data: dataJson                  
  }).done( function(data){
      
   var datos = JSON.parse(data);
   swal({
      title:datos.titulo,
      text: datos.mensaje,
      type:datos.est,
      showCancelButton:false,
      confirmButtonColor: "#ac2925",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#ac2925",
      closeOnConfirm: false,
      closeOnCancel: false
      },function(isConfirm){
        if (isConfirm) {
          capVolver();
        } 
      }
    );
  }).fail( function( jqXHR, textStatus, errorThrown ){
    alert( "Error en insertar" );
  }).always( function(){

  }); 
}

function capListar(filtro){
  var valido = validarBuscar();
  if(valido){
    $.ajax({      
      url: servicioCap+"/listar/"+filtro,
      type: "GET",
      timeout: 100000,
      dataType: "json"                            
    }).done( function( data ){
      var datos = JSON.parse( data );             
      capVerLista(datos);
    }).fail( function( jqXHR, textStatus, errorThrown ){
      alert("Error en Listar");
    }).always( function(){

    }); 
  }              
}
function capVerLista(datos){ 
  $("#tablaResultados tbody").remove();
  var tr;  
  $.each(datos, function(i){
    tr = $("<tr>");
    tr.append(
      "<td><input type='radio'name='cap_sel' value= '"+"{\"cap_fecha_cap\":\""+datos[i].cap_fecha_cap+"\",\"tra_id\":\""+datos[i].tra_id+"\",\"esm_id\":\""+datos[i].esm_id+"\"}"+"'/></td>"
      +"<td>"+datos[i].vig_id+"</td>"
      +"<td>"+datos[i].reg_descripcion+"</td>"
      +"<td>"+datos[i].dep_descripcion+"</td>"
      +"<td>"+datos[i].mun_descripcion+"</td>"
       +"<td>"+datos[i].rut_id+"</td>"
      +"<td>"+datos[i].cod_ruta+"</td>"
      +"<td>"+datos[i].tit_descripcion+"</td>"
      +"<td>"+datos[i].tra_id+"</td>"
      +"<td>"+datos[i].esm_id+" "+datos[i].esm_descripcion+"</td>"
      +"<td>"+datos[i].cap_fecha_cap+"</td>"
      +"<td>"+datos[i].per_nombre+" "+datos[i].per_apellido+"</td>"
      +"<td>"+datos[i].cap_machos+"</td>"
      +"<td>"+datos[i].cap_hembras+"</td>"
      +"<td>"+datos[i].est_descripcion+"</td>"
      +"<td>"+datos[i].fen_descripcion+"</td>"
      +"<td>"+datos[i].cap_fecha_dia+"</td>"
      +"<td>"+datos[i].cap_mue+"</td>"
      +"</tr>"
    );
    $('#tablaResultados').append(tr);
  });
}

function capBuscar(){
	var dataJson = $('input:radio[name=ubi_sel]:checked').val();
  $.ajax({      
    url: servicioCap+"/buscar",
    type: "POST",
    timeout: 100000,
    dataType: "json",
    data: dataJson			                
  }).done( function( data ){
    var datos = JSON.parse( data );             
    console.log(JSON.stringify(datos));
  }).fail( function( jqXHR, textStatus, errorThrown ){
    alert("Campo de Busqueda Vacio");
  }).always( function(){

  });            
}
function capImp(rut_id){
  
    $.ajax({      
      url: servicioCap+"/imp/"+rut_id,
      type: "GET",
      timeout: 100000,
      dataType: "json"                            
    }).done( function( data ){
      var datos = JSON.parse( data ); 
      console.log(JSON.stringify(data));            
       if (datos){
         db.transaction(function(tx) {
             tx.executeSql('DELETE FROM cap');
            })
          
        $.each(datos, function(i){
            db.transaction(function(tx) {  
             tx.executeSql('INSERT INTO cap ( tec_id, cac_id, cap_semana, cap_ano, '
              +'vig_id, rut_id, tra_id, esm_id, cap_fecha_cap, cap_machos, cap_hembras, fen_id, cap_fecha_dia, cap_mue, pre_id)'
              +' VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', 
                [datos[i].tec_id, datos[i].cac_id, datos[i].cap_semana, datos[i].cap_ano,
                datos[i].vig_id,  datos[i].rut_id, datos[i].tra_id, datos[i].esm_id, datos[i].cap_fecha_cap,
                datos[i].cap_machos, datos[i].cap_hembras, datos[i].fen_id, datos[i].cap_fecha_dia, datos[i].cap_mue, datos[i].pre_id]
                );
            })
        });
      }
    
    }).fail( function( jqXHR, textStatus, errorThrown ){
      alert("Error en importar cap");
    }).always( function(){

    });               
}
function validarBuscar(){
  if(document.getElementById("filtro").value){
    sessionStorage.filtro = document.getElementById("filtro").value;
    return true;
  }
  swal({
    title:'Falta un dato',
    text: 'Campo de Búsqueda Vacio' ,
    type: 'warning',
    showCancelButton:false,
    confirmButtonColor: "#ac2925",
    confirmButtonText: "Aceptar",
    cancelButtonText: "Cancelar",
    cancelButtonColor: "#ac2925",
    closeOnConfirm: true,
    closeOnCancel: false
    },function(isConfirm){
      if (isConfirm) {
        return false;
      } 
    }
  );
}

function validarRadio(){
  if($('input:radio[name=ubi_sel]:checked').val()){
    return true;
  }
  return false;
}

function capVolver(){
  window.location='Gestion-Captura.html'
}