var servicioAlertas = "http://192.168.1.39/sigatWS/alertas";
var db = openDatabase("sigat", "1.0", "sigat_Local", 2 * 1024 * 1024);

function calcularMTD(){
    $.ajax({      
      url: servicioAlertas+"/mtd/"+sessionStorage.Pre_id,
      type: "GET",
      timeout: 100000,
      dataType: "json"                            
    }).done( function( data ){
      var datos = JSON.parse( data );
      alertasVerMTD(datos);
      console.log(datos);
    }).fail( function( jqXHR, textStatus, errorThrown){
      alert("Error al calcular MTD");
    }).always( function(){

    });                
}
function alertasInsertar(){
  var dataJson = '{"tec_id":"'+ sessionStorage.tec_id + '",\n\
                  "ale_fecha":"Now()",\n\
                  "rut_id":"' + document.getElementById("rut_id").value + '",\n\
                  "pre_id":"' + document.getElementById("pre_id").value + '",\n\
                  "ale_mtd":"'+document.getElementById("ale_mtd").value+'"}';
    //alert(dataJson);
  $.ajax({
    url: servicioAlertas,
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
          alertasVolver();
        } 
      }
    );
  }).fail( function( jqXHR, textStatus, errorThrown ){
    alert( "Error en insertar" );
  }).always( function(){

  }); 
}
function alertasListar(filtro){
  var valido = validarBuscar();
  if(valido){
    $.ajax({      
      url: servicioAlertas+"/listar/"+filtro,
      type: "GET",
      timeout: 100000,
      dataType: "json"                            
    }).done( function( data ){
      var datos = JSON.parse( data );
      alertasVerLista(datos);
      console.log(JSON.stringify(datos));
    }).fail( function( jqXHR, textStatus, errorThrown ){
      alert("Error en Listar");
    }).always( function(){

    }); 
  }              
}
function alertasVerLista(datos){ 
  $("#tablaResultados tbody").remove();
  var tr;  
  $.each(datos, function(i){
    tr = $("<tr>");
    tr.append(
      "<td>"+datos[i].ale_fecha+"</td>"
      +"<td>"+datos[i].pre_id+"-"+datos[i].pre_nombre+"</td> "
      +"<td>"+datos[i].per_nombre+" "+datos[i].per_apellido+"</td>"
      +"<td>"+datos[i].ale_mtd+"</td>"
      +"</tr>"
    );
    $('#tablaResultados').append(tr);
  });
}
function alertasVerMTD(datos){
    var color;
    if(datos.mtd<0.5){
      color = 'verde';
    }
    if(datos.mtd>=0.5 && datos.mtd<0.8 ){
      color = 'amarillo';
    }
    if(datos.mtd>=0.8 && datos.mt<1 ){
      color = 'naranja';
    }
    if(datos.mtd>=1){
      color = 'rojo';
    }
     $('#nombre-predio p').remove();
     $('#nombre-predio').append('<p>'+datos['pre_id']+' '+datos['pre_nombre']+'</p>');
     $('#mtd div').remove();
    switch (color){
      case 'verde':
        $('#mtd').append(
          "<div style = 'color:#10B90A'>"
          +"<img src = '../img/alerta-verde.png' style='width:80px; height:80px'>"
          +"<h1 style='font-size:15px'>"+"El MTD de este predio es </h1>"
          +"<h1 style='font-size:30px'>"+datos.mtd+"</h1>"
          +"<h1 style='font-size:15px'>"+"<b>SE ENCUENTRA POR DEBAJO DEL NIVEL DE ALERTA</b>"+"</h1>"
           +"<a href='javascript:alertasInsertar()'>"
          +"<button type='button' class='btn btn-success'>"
          +"<span><img src='../img/alerta.png' class='botonimg'></span>"
          +"Registrar alerta" 
          +"</button>"
          +"</a>"
          +"</div>"
        );
      break;
      case 'amarillo':
        $('#mtd').append(
          "<div style = 'color:#F9F219'>"
          +"<img src = '../img/alerta-amarilla.png' style='width:80px; height:80px'>"
          +"<h1 style='font-size:15px'>"+"El MTD de este predio es </h1>"
          +"<h1 style='font-size:30px'>"+datos.mtd+"</h1>"
          +"<h1 style='font-size:15px'>"+"<b>SE ENCUENTRA EN ALERTA AMARILLA</b>"+"</h1>"
          +"<a href='javascript:alertasInsertar()'>"
          +"<button type='button' class='btn btn-success'>"
          +"<span><img src='../img/alerta.png' class='botonimg'></span>"
          +"Registrar alerta" 
          +"</button>"
          +"</a>"
          +"</div>"
        );
      break;
      case 'naranja':
        $('#mtd').append(
          "<div style = 'color:#FFA533'>"
          +"<img src = '../img/alerta-naranja.png' style='width:80px; height:80px'>"
          +"<h1 style='font-size:15px'>"+"El MTD de este predio es </h1>"
          +"<h1 style='font-size:30px'>"+datos.mtd+"</h1>"
          +"<h1 style='font-size:15px'>"+"<b>SE ENCUENTRA EN ALERTA NARANJA</b>"+"</h1>"
          +"<a href='javascript:alertasInsertar()'>"
          +"<button type='button' class='btn btn-success'>"
          +"<span><img src='../img/alerta.png' class='botonimg'></span>"
          +"Registrar alerta" 
          +"</button>"
          +"</a>"
          +"</div>"
        );
      break;
      case 'rojo':
        $('#mtd').append(
          "<div style = 'color:#F90C0C'>"
          +"<img src = '../img/alerta-roja.png' style='width:80px; height:80px'>"
          +"<h1 style='font-size:15px'>"+"El MTD de este predio es </h1>"
          +"<h1 style='font-size:30px'>"+datos.mtd+"</h1>"
          +"<h1 style='font-size:15px'>"+"<b>SE ENCUENTRA EN ALERTA ROJA</b>"+"</h1>"
          +"<a href='javascript:alertasInsertar()'>"
          +"<button type='button' class='btn btn-success'>"
          +"<span><img src='../img/alerta.png' class='botonimg'></span>"
          +"Registrar alerta" 
          +"</button>"
          +"</a>"
          +"</div>"
        );
      break;
    }
    $("#pre_id").val(datos.pre_id);
    $("#ale_mtd").val(datos.mtd); 
    $("#rut_id").val(datos.rut_id);
}
function alertasAsigarPredio(){
	sessionStorage.Pre_id = document.getElementById('pre_id').value;
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
function alertasImp(rut_id){
  
    $.ajax({      
      url: servicioAlertas+"/imp/"+rut_id,
      type: "GET",
      timeout: 100000,
      dataType: "json"                            
    }).done( function( data ){
      var datos = JSON.parse( data ); 
      console.log(JSON.stringify(data));            
       if (datos){
         db.transaction(function(tx) {
             tx.executeSql('DELETE FROM alertas');
            })  
        $.each(datos, function(i){
            db.transaction(function(tx) {  
             tx.executeSql('INSERT INTO alertas (pre_id, ale_fecha, ale_mtd,'
              +'tec_id, rut_id)'
              +' VALUES (?,?,?,?,?)', 
                [datos[i].pre_id, datos[i].ale_fecha, datos[i].ale_mtd,
                datos[i].tec_id,  datos[i].rut_id]);
            })
        });
      }
    }).fail( function( jqXHR, textStatus, errorThrown ){
      alert("Error en importar Alertas");
    }).always( function(){

    });               
}
function alertasVolver(){
  window.location = 'Gestion-Alertas.html';
}