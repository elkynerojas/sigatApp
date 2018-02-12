var servicioLote = "http://192.168.1.39/sigatWS/lote";

function loteListar(filtro){
  if (sessionStorage.conexion == 1){
    loteListarIL(filtro);
  }else{
    loteListarOL(filtro)
  }
}
function loteInsertar(){
  if (sessionStorage.conexion == 1){
    loteInsertarIL();
  }else{
    loteInsertarOL();
  }
}
function loteActualizar(){
  if(sessionStorage.conexion ==1){
    loteActualizarIL();
  }else{
    loteActualizarOL();
  }
}
function loteBuscar(){
  if(sessionStorage.conexion ==1){
    loteBuscarIL();
  }else{
    loteBuscarOL();
  }
}
function loteListarIL(filtro){
  
    $.ajax({      
      url: servicioLote+"/listar/"+filtro,
      type: "GET",
      timeout: 100000,
      dataType: "json"                            
    }).done( function( data ){
      var datos = JSON.parse( data );
            loteVerLista(datos);
      console.log(JSON.stringify(datos));
    }).fail( function( jqXHR, textStatus, errorThrown ){
      alert("Error en Listar");
    }).always( function(){

    }); 
                
}
function loteListarOL(filtro){
  db.transaction(function(tx){
    tx.executeSql(
      'select * from lote as lot '
      +'inner join predio as pre on (lot.pre_id = pre.pre_id) '
      +'inner join productor as prod on (pre.per_cc = prod.per_cc) '
      +'inner join persona as per on (prod.per_cc = per.per_cc) '
      +'where  '
      +'lot.pre_id = ? order by lot.lot_descripcion',
      [filtro],
      function(tx,resultado){
        var datos = resultado.rows;
        console.log(datos);
        if (datos.length>0){
          loteVerLista(datos);
        }
      }
    );
  });
}
function loteInsertarIL(){
  var dataJson = '{"pre_id":"'+ sessionStorage.Pre_id + '",\n\
                  "lot_descripcion":"' + document.getElementById("lot_descripcion").value + '",\n\
                  "lot_area":"' + document.getElementById("lot_area").value + '",\n\
                  "lot_fecha_reg":"Now()",\n\
                  "lot_fecha_act":"Now()",\n\
                  "lot_tec_reg":"'+sessionStorage.tec_id+'",\n\
                  "lot_tec_act":"'+sessionStorage.tec_id+'"}';
  $.ajax({
    url: servicioLote+'/insert',
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
          loteVolver();
        } 
      }
    );
  }).fail( function( jqXHR, textStatus, errorThrown ){
    alert( "Error en insertar" );
  }).always( function(){

  }); 
}
function loteInsertarOL(){
    var lot_id;
    var hoy = new Date();
    var dd = hoy.getDate();
    var mm = hoy.getMonth()+1; //hoy es 0!
    var yyyy = hoy.getFullYear();

    if(dd<10) {
        dd='0'+dd
    } 

    if(mm<10) {
        mm='0'+mm
    } 

    hoy = yyyy+'-'+mm+'-'+dd;
    db.transaction(function(tx){
      tx.executeSql(
        'select  max(lot_id) as lot_id, pre_id from lote where pre_id = ?',
        [sessionStorage.Pre_id],
        function(tx,resultado){ 
          var datos = resultado.rows;
          console.log(datos);
          $.each(datos, function(i){
            if(datos[i].lot_id == null){
              lot_id = sessionStorage.Pre_id + '001';
              console.log(lot_id);
            }else{
              lot_id = datos[i].lot_id + 1;
              console.log(lot_id);
            }
          }); 
        }
      );    
    });
    db.transaction(function(tx){
      tx.executeSql(
      'insert into lote (lot_id, lot_descripcion, lot_area, pre_id, lot_fecha_reg, lot_fecha_act, lot_tec_reg, lot_tec_act, lot_id_aux)'
      +'values(?,upper(?),?,?,?,?,?,?,?)',
      [lot_id,
        document.getElementById("lot_descripcion").value,
        document.getElementById("lot_area").value,
        sessionStorage.Pre_id,
        hoy,
        hoy,
        sessionStorage.tec_id,
        sessionStorage.tec_id,
        lot_id
      ]);
    });
    swal({
      title:'Operación Exitosa',
      text: 'Se registró el lote en la base de datos local',
      type: 'success',
      showCancelButton:false,
      confirmButtonColor: "#ac2925",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#ac2925",
      closeOnConfirm: false,
      closeOnCancel: false
      },function(isConfirm){
        if (isConfirm) {
          loteVolver();
        } 
      }
    );
}
function loteBuscarIL(){
  $.ajax({      
    url: servicioLote+"/buscar/"+sessionStorage.Lot_id,
    type: "GET",
    timeout: 100000,
    dataType: "json"			                
  }).done( function( data ){
    var datos = JSON.parse( data );
    console.log(JSON.stringify(datos));
    loteVerBusquedaIL(datos);
    sessionStorage.removeItem('Lot_id');
  }).fail( function( jqXHR, textStatus, errorThrown ){
    alert("Campo de Busqueda Vacio");
  }).always( function(){

  });            
}
function loteBuscarOL(){
  db.transaction(function(tx){
    tx.executeSql(
        'select * from lote as lot '
        +'where  '
        +'lot.lot_id = ?  ',
        [sessionStorage.Lot_id],
        function(tx,resultado){ 
          var datos = resultado.rows; 
          console.log(datos);
          loteVerBusquedaOL(datos);  
        }
    );          
  });    
}
function loteActualizarIL(){
  var dataJson = '{"lot_id":"'+ document.getElementById("lot_id").value + '",\n\
                  "lot_descripcion":"' + document.getElementById("lot_descripcion").value + '",\n\
                  "lot_area":"' + document.getElementById("lot_area").value + '",\n\
                  "lot_fecha_act":"Now()",\n\
                  "lot_tec_act":"'+sessionStorage.tec_id+'",\n\
                  "lot_id_aux":"'+document.getElementById("lot_id_aux").value+'"}';
  $.ajax({
    url: servicioLote,
    type: "PUT",
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
          loteVolver();
        } 
      }
    );
  }).fail( function( jqXHR, textStatus, errorThrown ){
    alert( "Error en actualizar" );
  }).always( function(){

  }); 
}
function loteActualizarOL(){
   var hoy = new Date();
    var dd = hoy.getDate();
    var mm = hoy.getMonth()+1; //hoy es 0!
    var yyyy = hoy.getFullYear();

    if(dd<10) {
        dd='0'+dd
    } 

    if(mm<10) {
        mm='0'+mm
    } 

    hoy = yyyy+'-'+mm+'-'+dd;
    
    db.transaction(function(tx){
      tx.executeSql(
      'update lote set lot_id = ?, lot_descripcion = ?, lot_area = ?,'
      +'lot_fecha_act = ?, lot_tec_act = ?'
      +'where lot_id_aux = ? ',
      [document.getElementById("lot_id").value,
        document.getElementById("lot_descripcion").value,
        document.getElementById("lot_area").value,
        hoy,
        sessionStorage.tec_id,
        document.getElementById("lot_id_aux").value
      ]);
    });
    swal({
      title:'Operación Exitosa',
      text: 'Se Actualizó el lote en la base de datos local',
      type: 'success',
      showCancelButton:false,
      confirmButtonColor: "#ac2925",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#ac2925",
      closeOnConfirm: false,
      closeOnCancel: false
      },function(isConfirm){
        if (isConfirm) {
          loteVolver();
        } 
      }
    );
}
function loteVerBusquedaIL(datos){ 
  $('#HistorialLote div').remove();

  var str = $("<div class = ''>");
  str.append(
    "<h2>"+datos.lot_descripcion
    +"<br>"+datos.lot_id+"</h2>"
    +"<p> REGISTRADO POR : "+datos.tec_reg_nombre+" El "+datos.lot_fecha_reg+"<br>"
    +"ACTUALIZADO POR : "+datos.tec_act_nombre+" El "+datos.lot_fecha_act+"</p>"
    +"</div>"
  );
  $("#HistorialLote").append(str);
  $("#lot_id").val(datos.lot_id);
  $("#lot_id_aux").val(datos.lot_id);
  $("#lot_descripcion").val(datos.lot_descripcion);
  $("#lot_area").val(datos.lot_area);
  $("#pre_id").val(datos.pre_id);
}
function loteVerBusquedaOL(datos){ 
    
  $('#HistorialLote div').remove();

  
    var lot_id;
    var lot_descripcion;
    var lot_area;
    var pre_id;
    $.each(datos, function(i){
      lot_id = datos[i].lot_id;
      lot_descripcion = datos[i].lot_descripcion;
      lot_area = datos[i].lot_area;
      pre_id = datos[i].pre_id; 
    });
        
    $("#lot_id").val(lot_id);
    $("#lot_id_aux").val(lot_id);
    $("#lot_descripcion").val(lot_descripcion);
    $("#lot_area").val(lot_area);
    $("#pre_id").val(pre_id);
}
function loteVerLista(datos){ 
  $("#tablaResultados tbody").remove();
  var tr;  
  $.each(datos, function(i){
    tr = $("<tr>");
    tr.append(
      "<td><input type='radio'name='lot_sel' value='"+datos[i].lot_id+"'/></td>"
      +"<td>"+datos[i].lot_id+"</td>"
      +"<td>"+datos[i].lot_descripcion+"</td>"
      +"<td>"+datos[i].pre_nombre+"</td>"
      +"<td>"+datos[i].lot_area+"</td>"
      +"<td>"+datos[i].per_nombre+" "+datos[i].per_apellido+"</td>"
      +"</tr>"
    );
    $('#tablaResultados').append(tr);
  });
}
function LoteId(ruta){
  var valido = validarRadio();
  if(valido){
    sessionStorage.Lot_id = $('input:radio[name=lot_sel]:checked').val();
    window.location = ruta; 
  }else{
    swal({
      title:'Falta un dato',
      text: 'Seleccione un Predio' ,
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
            
          } 
      }
    );
  }   
}
function loteImp(rut_id){
  
    $.ajax({      
      url: servicioLote+"/imp/"+rut_id,
      type: "GET",
      timeout: 100000,
      dataType: "json"                            
    }).done( function( data ){
      var datos = JSON.parse( data ); 
      //console.log(JSON.stringify(data));            
       if (datos){
         db.transaction(function(tx) {
             tx.executeSql('DELETE FROM lote');
          })
         
        $.each(datos, function(i){
            
            db.transaction(function(tx) {  
             tx.executeSql('INSERT INTO lote (lot_id, lot_descripcion, lot_area,'
              +'pre_id, lot_fecha_reg, lot_fecha_act, lot_tec_reg, lot_tec_act, lot_id_aux) VALUES (?,?,?,?,?,?,?,?,?)', 
                [datos[i].lot_id, datos[i].lot_descripcion, datos[i].lot_area, datos[i].pre_id,
                datos[i].lot_fecha_reg, datos[i].lot_fecha_act, datos[i].lot_tec_reg, datos[i].lot_tec_act, datos[i].lot_id]
                );
            })
        });
    }
    
    }).fail( function( jqXHR, textStatus, errorThrown ){
      alert("Error al importar lotes");
    }).always( function(){

    });               
}
function loteExp(){

    db.transaction(function(tx) {
    tx.executeSql('SELECT *from lote', [], function (tx, resultado) {
      var datos = resultado.rows;
      //console.log(datos);
      var tr = '';
      $.each(datos, function(i){
        var dataJson = '{"lot_id":"'+datos[i].lot_id+'",'
                    +'"lot_descripcion":"'+datos[i].lot_descripcion+'",'
                    +'"lot_area":"'+datos[i].lot_area+'",'
                    +'"pre_id":"'+datos[i].pre_id+'",'
                    +'"lot_fecha_reg":"'+datos[i].lot_fecha_reg+'",'
                    +'"lot_fecha_act":"'+datos[i].lot_fecha_act+'",'
                    +'"lot_tec_reg":"'+datos[i].lot_tec_reg+'",'
                    +'"lot_tec_act":"'+datos[i].lot_tec_act+'",'
                    +'"lot_id_aux":"'+datos[i].lot_id_aux+'"}'
          console.log(dataJson);
          $.ajax({
            url: servicioLote+"/export",
            type: "POST",
            timeout: 100000,
            dataType: "json",
            data: dataJson                  
          }).done( function(data){

          }).fail( function( jqXHR, textStatus, errorThrown ){
            alert( "Error en exportar lote" );
          }).always( function(){

          }); 
      })
      
    }); 
  }, null);
}
function validarRadio(){
  if($('input:radio[name=lot_sel]:checked').val()){
    return true;
  }
  return false;
}
function loteVolver(){
  window.location='Gestion-Lote.html';
}