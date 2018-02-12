var servicioInspeccion = "http://192.168.1.39/sigatWS/inspeccion";
var db = openDatabase("sigat", "1.0", "sigat_Local", 2 * 1024 * 1024);

function inspeccionInsertar(){
  var dataJson = '{"ins_fecha":"'+ document.getElementById("ins_fecha").value + '",\n\
                  "pre_id":"' + document.getElementById("pre_id").value + '",\n\
                  "per_cc":"' + document.getElementById("per_cc").value + '",\n\
                  "tec_id":"' + sessionStorage.tec_id + '",\n\
                  "ins_estado":"' + document.getElementById("ins_estado").value + '",\n\
                  "rut_id":"' + document.getElementById("rut_id").value + '",\n\
                  "ins_obs":"'+document.getElementById("ins_obs").value+'"}';
  $.ajax({
    url: servicioInspeccion,
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
          inspeccionVolver();
        } 
      }
    );
  }).fail( function( jqXHR, textStatus, errorThrown ){
    alert( "Error en insertar" );
  }).always( function(){

  }); 
}
function inspeccionListar(filtro){
  
 
    $.ajax({      
      url: servicioInspeccion+"/listar/"+filtro,
      type: "GET",
      timeout: 100000,
      dataType: "json"                            
    }).done( function( data ){
      var datos = JSON.parse( data );
      inspeccionVerLista(datos);
      //console.log(JSON.stringify(datos));
    }).fail( function( jqXHR, textStatus, errorThrown ){
      alert("Error en Listar");
    }).always( function(){

    }); 
                
}
function inspeccionVerLista(datos){ 
  $("#tablaResultados tbody").remove();
  var tr;  
  $.each(datos, function(i){
  	if(datos[i].ins_estado==true){
  		var estado = 'Satisfactorio'
  	}else{
  		var estado = 'Insatisfactorio'
  	}
    tr = $("<tr>");
    tr.append(
      "<td>"+datos[i].ins_fecha+"</td>"
      +"<td>"+datos[i].per_nombre+" "+datos[i].per_apellido+"</td>"
      +"<td>"+estado
      +"<td>"+datos[i].ins_obs
      +"</tr>"
    );
    $('#tablaResultados').append(tr);
  });
}
function inspeccionImp(rut_id){
  
    $.ajax({      
      url: servicioInspeccion+"/imp/"+rut_id,
      type: "GET",
      timeout: 100000,
      dataType: "json"                            
    }).done( function( data ){
      var datos = JSON.parse( data ); 
      console.log(JSON.stringify(data));            
       if (datos){
         db.transaction(function(tx) {
             tx.executeSql('DELETE FROM inspeccion');
            })  
        $.each(datos, function(i){
            db.transaction(function(tx) {  
             tx.executeSql('INSERT INTO inspeccion ( ins_fecha, pre_id, per_cc,'
              +'tec_id, ins_estado, ins_obs, rut_id)'
              +' VALUES (?,?,?,?,?,?,?)', 
                [datos[i].ins_fecha, datos[i].pre_id, datos[i].per_cc, datos[i].tec_id,
                datos[i].ins_estado,  datos[i].ins_obs, datos[i].rut_id]);
            })
        });
      }
    }).fail( function( jqXHR, textStatus, errorThrown ){
      alert("Error en importar inspeccion");
    }).always( function(){

    });               
}
function inspeccionVolver(){
	window.location = 'Gestion-Inspeccion.html'
}