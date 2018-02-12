var servicioTrampa = "http://192.168.1.39/sigatWS/trampa";

function trampaListar(filtro){
  var valido = validarBuscar();
  if(valido){
    if(sessionStorage.conexion == 1){ 
      trampaListarIL(filtro);
    }
    else{
      trampaListarOL(filtro);
    } 
  }
}
function trampaInsertar(){
  var dataJson = '{"tra_id":"'+ document.getElementById("tra_id").value + '",\n\
  "tit_id":"' + document.getElementById("tit_id").value + '",\n\
  "atr_id":"' + document.getElementById("atr_id").value + '",\n\
  "est_id":"' + "2" + '",\n\
  "tra_fecha_reg":"Now()",\n\
  "tra_fecha_act":"Now()",\n\
  "tra_tec_reg":"'+sessionStorage.tec_id+'",\n\
  "tra_tec_act":"'+sessionStorage.tec_id+'"}';
  $.ajax({
    url: servicioTrampa+'/insert',
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
          trampaVolver();
        } 
      }
    );
  }).fail( function( jqXHR, textStatus, errorThrown ){
    alert( "Error en insertar" );
  }).always( function(){

  }); 
}
function trampaListarIL(filtro){
  var valido = validarBuscar();
  if(valido){
    $.ajax({      
      url: servicioTrampa+"/listar/"+filtro,
      type: "GET",
      timeout: 100000,
      dataType: "json"                            
    }).done( function( data ){
      var datos = JSON.parse( data );
      //console.log(JSON.stringify(datos));
      TrampaVerLista(datos);
    }).fail( function( jqXHR, textStatus, errorThrown ){
      alert("Error en Listar");
    }).always( function(){

    }); 
  }              
}
function trampaListarOL(filtro){
  db.transaction(function(tx){
    tx.executeSql(
      'select * from trampa as tra '
      +'inner join atrayente as atr on (atr.atr_id = tra.atr_id) '
      +'inner join tipo_trampa as tit on (tit.tit_id = tra.tit_id) '
      +'inner join estado as est on (est.est_id = tra.est_id) '
      +'where  '
      +'cast (tra.tra_id as varchar) like \'%\' || ? || \'%\' '
      +'or upper (tit.tit_descripcion) like \'%\' || ? || \'%\' '
      +'or upper (atr.atr_descripcion) like \'%\' || ? || \'%\' ',
      [filtro,filtro,filtro],
      function(tx,resultado){
        var datos = resultado.rows;
        console.log(datos);
        if (datos.length>0){
          TrampaVerLista(datos);
        }
      }
    );
  });
}
function trampaBuscar(){
  $.ajax({      
    url: servicioTrampa+"/buscar/"+sessionStorage.Tra_id,
    type: "GET",
    timeout: 100000,
    dataType: "json"			                
  }).done( function( data ){
    var datos = JSON.parse( data );
    console.log(JSON.stringify(datos));
    trampaVerBusqueda(datos);
    sessionStorage.removeItem('Tra_id');
  }).fail( function( jqXHR, textStatus, errorThrown ){
    alert("Campo de Busqueda Vacio");
  }).always( function(){

  });            
}
function trampaImp(rut_id){
  $.ajax({      
    url: servicioTrampa+"/imp/"+rut_id,
    type: "GET",
    timeout: 100000,
    dataType: "json"                            
  }).done( function( data ){
    var datos = JSON.parse( data ); 
    console.log(datos);            
    if (datos){
      db.transaction(function(tx) {
        tx.executeSql('DELETE FROM trampa');
      })  
      $.each(datos, function(i){
        db.transaction(function(tx) {  
          tx.executeSql('INSERT INTO trampa ( tra_id, tit_id, atr_id,'
            +'est_id, tra_fecha_reg, tra_fecha_act, tra_tec_reg, tra_tec_act, tra_id_aux) VALUES (?,?,?,?,?,?,?,?,?)', 
            [datos[i].tra_id, datos[i].tit_id, datos[i].atr_id, datos[i].est_id,
            datos[i].tra_fecha_reg,  datos[i].tra_fecha_act, datos[i].tra_tec_reg, datos[i].tra_tec_act, datos[i].tra_id]
          );
        })
      });
    }
  }).fail( function( jqXHR, textStatus, errorThrown ){
      alert("Error en importar trampas");
  }).always( function(){
  });               
}
function trampaExp(){
  db.transaction(function(tx) {
    tx.executeSql('SELECT *from trampa', [], function (tx, resultado) {
      var datos = resultado.rows;
      console.log(datos);
      var tr = '';
      $.each(datos, function(i){
        var dataJson = '{"tra_id":"'+datos[i].tra_id+'",'
        +'"tit_id":"'+datos[i].tit_id+'",'
        +'"atr_id":"'+datos[i].atr_id+'",'
        +'"est_id":"'+datos[i].est_id+'",'
        +'"tra_fecha_reg":"'+datos[i].tra_fecha_reg+'",'
        +'"tra_fecha_act":"'+datos[i].tra_fecha_act+'",'
        +'"tra_tec_reg":"'+datos[i].tra_tec_reg+'",'
        +'"tra_tec_act":"'+datos[i].tra_tec_act+'",'
        +'"tra_id_aux":"'+datos[i].tra_id_aux+'"}';
        $.ajax({
          url: servicioTrampa+"/export",
          type: "POST",
          timeout: 100000,
          dataType: "json",
          data: dataJson                  
        }).done( function(data){
        }).fail( function( jqXHR, textStatus, errorThrown ){
          alert( "Error en trampaExp" );
        }).always( function(){
        }); 
      })  
    }); 
  }, null);
}
function trampaListarInactivas(filtro){
  var valido = true;
  if(valido){
    $.ajax({      
      url: servicioTrampa+"/listarInactivas/"+filtro,
      type: "GET",
      timeout: 100000,
      dataType: "json"                            
    }).done( function( data ){
      var datos = JSON.parse( data );
      console.log(JSON.stringify(datos));
      selectTrampa(datos,'');
    }).fail( function( jqXHR, textStatus, errorThrown ){
      alert("Error en Listar");
    }).always( function(){
    }); 
  }              
}
function trampaBuscar(){
  $.ajax({      
    url: servicioTrampa+"/buscar/"+sessionStorage.Tra_id,
    type: "GET",
    timeout: 100000,
    dataType: "json"                      
  }).done( function( data ){
    var datos = JSON.parse( data );
    console.log(JSON.stringify(datos));
    trampaVerBusqueda(datos);
    sessionStorage.removeItem('Tra_id');
  }).fail( function( jqXHR, textStatus, errorThrown ){
    alert("Campo de Busqueda Vacio");
  }).always( function(){
  });            
}

function trampaActualizar(){
  var dataJson = '{"tra_id":"'+ document.getElementById("tra_id").value + '",\n\
  "tit_id":"' + document.getElementById("tit_id").value + '",\n\
  "atr_id":"' + document.getElementById("atr_id").value + '",\n\
  "est_id":"' + document.getElementById("est_id").value + '",\n\
  "tra_fecha_act":"Now()",\n\
  "tra_tec_act":"'+sessionStorage.tec_id+'",\n\
  "tra_id_aux":"'+document.getElementById("tra_id_aux").value+'"}'
  $.ajax({
    url: servicioTrampa,
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
          trampaVolver();
        } 
      }
    );
  }).fail( function( jqXHR, textStatus, errorThrown ){
    alert( "Error en actualizar" );
  }).always( function(){

  }); 
}

function TrampaVerLista(datos){
  $("#tablaResultados tbody").remove();
  var tr;  
  $.each(datos, function(i){
    tr = $("<tr>");
    tr.append(
      "<td><input type='radio'name='tra_sel' value='"+datos[i].tra_id+"'/></td>"
      +"<td>"+datos[i].tra_id+"</td>"
      +"<td>"+datos[i].tit_descripcion+"</td>"
      +"<td>"+datos[i].atr_descripcion
      +"<td>"+datos[i].est_descripcion
      +"</tr>"
    );
    $('#tablaResultados').append(tr);
  });
}
function trampaVerBusqueda(datos){ 
  $('#Historial-Trampa div').remove();

  var str = $("<div class = ''>");
  str.append(
    "<h2>"+datos.tra_id+"</h2>"
    +"<p> REGISTRADO POR : "+datos.tec_reg_nombre+" El "+datos.tra_fecha_reg+"<br>"
    +"ACTUALIZADO POR : "+datos.tec_act_nombre+" El "+datos.tra_fecha_act+"</p>"
    +"</div>"
  );
  $("#HistorialTrampa").append(str);
  $("#tra_id").val(datos.tra_id);
  $("#tra_id_aux").val(datos.tra_id);
  selectTipo(datos.tit_id);
  selectAtrayente(datos.atr_id);
  selectEstado(datos.est_id)
}
function trampaAsignarCampos(datos){
  $.ajax({      
    url: servicioTrampa+"/buscar/"+document.getElementById('tra_id').value,
    type: "GET",
    timeout: 100000,
    dataType: "json"                      
  }).done( function( data ){
    var datos = JSON.parse( data );
    console.log(JSON.stringify(datos));
    $('#tit_id').val(datos.tit_id);
    $('#atr_id').val(datos.atr_id);
  }).fail( function( jqXHR, textStatus, errorThrown ){
    alert("Error al Recolectar información de la trampa");
  }).always( function(){
  }); 
}
function trampaId(ruta){
  var valido = validarRadio();
  if(valido){
    sessionStorage.Tra_id = $('input:radio[name=tra_sel]:checked').val();
    window.location = ruta; 
  }else{
    swal({
      title:'Falta un dato',
      text: 'Seleccione una Trampa' ,
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
  if($('input:radio[name=tra_sel]:checked').val()){
    return true;
  }
  return false;
}
function trampaVolver(){
  window.location = 'Gestion-Trampa.html';
}
function selectTipo(tit_id){
  $("#tit_id option").remove();
  switch(tit_id){
    case '1': 
      var str = "<option value = '1' selected = '' >Jackson</option>"
      +"<option value = '2' > McPhail</option>";
    break;
    case '2': 
      var str = "<option value = '1' >Jackson</option>"
      +"<option value = '2' selected = '' >McPhail</option>";
    break;
  }
  $("#tit_id").append(str);
}
function selectEstado(est_id){
  $("#est_id option").remove();
  switch(est_id){
    case '1': 
      var str = "<option value = '1' selected = '' >Activo</option>"
              +"<option value = '2' >Inactivo</option>";
      break;
     case '2': 
      var str = "<option value = '1' >Activo</option>"
              +"<option value = '2' selected = '' >Inactivo</option>";
      break;
    }
    $("#est_id").append(str);
}
function selectAtrayente(atr_id){
  $("#atr_id option").remove();
  switch(atr_id){
    case '1': 
      var str = "<option value = '1' selected = '' >Proteina Hidrolizada</option>"
      +"<option value = '2' >Tremidlure</option>"
      +"<option value = '3' >Methyl Eugenol</option>"
      +"<option value = '4' >Cuelure</option>"
    break;
    case '2': 
      var str = "<option value = '1' >Proteina Hidrolizada</option>"
      +"<option value = '2' selected = '' >Tremidlure</option>"
      +"<option value = '3' >Methyl Eugenol</option>"
      +"<option value = '4' >Cuelure</option>"
    break;
    case '3': 
      var str = "<option value = '1' >Proteina Hidrolizada</option>"
      +"<option value = '2' >Tremidlure</option>"
      +"<option value = '3' selected = '' >Methyl Eugenol</option>"
      +"<option value = '4' >Cuelure</option>"
    break;
    case '4': 
      var str = "<option value = '1' >Proteina Hidrolizada</option>"
      +"<option value = '2' >Tremidlure</option>"
      +"<option value = '3' >Methyl Eugenol</option>"
      +"<option value = '4' selected = '' >Cuelure</option>"
    break;   
  }
  $("#atr_id").append(str);
}
function selectTrampa(datos,tra_id){
  var str = "";
  $("#tra_id option").remove();
  str=str+"<option value = 'null' selectted=''></option>";
  $.each(datos, function(i){
    str = str+"<option  value='";
    str=str+datos[i].tra_id;
    if(datos[i].tra_id==tra_id){
      str=str+"' selected=''>";  
    }else{
      str=str+"'>";
    }
    str=str+datos[i].tra_id;
    str=str+"</option>";
  });
  $("#tra_id").append(str);   
}