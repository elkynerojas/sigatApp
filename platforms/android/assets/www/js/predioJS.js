var servicioPredio = "http://192.168.1.39/sigatWS/predio";
var db = openDatabase("sigat", "1.0", "sigat_Local", 2 * 1024 * 1024);

function predioInsertar(){
  if(sessionStorage.conexion ==1){
    predioInsertarIL();
  }else{
    predioInsertarOL();
  }
}
function predioListar(filtro){
  var valido = validarBuscar();
  if(valido){
    
    if(sessionStorage.conexion == 1){ 
        predioListarIL(filtro);
    }
    else{
      predioListarOL(filtro);
    } 
  }
}
function predioBuscar(){
  if (sessionStorage.conexion == 1){
    predioBuscarIL();
  }else{
    predioBuscarOL();
  }
}
function predioActualizar(){
  if(sessionStorage.conexion ==1){
    predioActualizarIL();
  }else{
    predioActualizarOL();
  }
}
function predioInsertarIL(){
    var dataJson = '{"mun_id":"'+ document.getElementById("mun_id").value + '",\n\
                  "pre_nombre":"' + document.getElementById("pre_nombre").value + '",\n\
                  "pre_area":"' + document.getElementById("pre_area").value + '",\n\
                  "pre_lotes":"' + document.getElementById("pre_lotes").value + '",\n\
                  "per_cc":"' + document.getElementById("per_cc").value + '",\n\
                  "pre_fecha_reg":"Now()",\n\
                  "pre_fecha_act":"Now()",\n\
                  "pre_tec_reg":"'+sessionStorage.tec_id+'",\n\
                  "pre_tec_act":"'+sessionStorage.tec_id+'"}';
  $.ajax({
    url: servicioPredio+'/insert',
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
          predioVolver();
        } 
      }
    );
  }).fail( function( jqXHR, textStatus, errorThrown ){
    alert( "Error en insertar" );
  }).always( function(){

  });
}
function predioInsertarOL(){
    var pre_id;
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
        'select  max(pre_id) as pre_id from predio ',
        [],
        function(tx,resultado){ 
          var datos = resultado.rows;
          console.log(datos); 
          $.each(datos, function(i){
            pre_id = datos[i].pre_id + 1;
            console.log(pre_id);
          });
        }
      );    
    });
    db.transaction(function(tx){
      tx.executeSql(
      'insert into predio (pre_id, pre_nombre, pre_area, pre_lotes, per_cc, pre_fecha_reg, pre_fecha_act, pre_tec_reg, pre_tec_act, pre_id_aux)'
      +'values(?,upper(?),?,?,?,?,?,?,?,?)',
      [pre_id,
        document.getElementById("pre_nombre").value,
        document.getElementById("pre_area").value,
        document.getElementById("pre_lotes").value,
        document.getElementById("per_cc").value,
        hoy,
        hoy,
        sessionStorage.tec_id,
        sessionStorage.tec_id,
        pre_id
      ]);
    });
    swal({
      title:'Operación Exitosa',
      text: 'Se registró el predio en la base de datos local',
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
          predioVolver();
        } 
      }
    );
}
function predioListarIL(filtro){
  var valido = validarBuscar();
  if(valido){
    $.ajax({      
      url: servicioPredio+"/listar/"+filtro,
      type: "GET",
      timeout: 100000,
      dataType: "json"                            
    }).done( function( data ){
      var datos = JSON.parse( data );
      predioVerLista(datos);
      //console.log(JSON.stringify(datos));
    }).fail( function( jqXHR, textStatus, errorThrown ){
      alert("Error en Listar");
    }).always( function(){

    }); 
  }              
}
function predioListarOL(filtro){
  db.transaction(function(tx){
          tx.executeSql(
            'select * from predio as pre '
            +'inner join productor as prod on (pre.per_cc = prod.per_cc) '
            +'inner join persona as per on (per.per_cc = prod.per_cc) '
            +'inner join municipio as mun on (prod.mun_id = mun.mun_id) '
            +'where  '
            +'cast (per.per_cc as varchar) like \'%\' || ? || \'%\' '
            +'or upper (per.per_nombre) like \'%\' || ? || \'%\' '
            +'or upper (per.per_apellido) like \'%\' || ? || \'%\' '
            +'or upper (pre.pre_nombre) like \'%\' || ? || \'%\' '
            +'or upper (mun.mun_descripcion) like \'%\' || ? || \'%\' ',
            [filtro,filtro,filtro,filtro,filtro],
            function(tx,resultado){
              var datos = resultado.rows;
              console.log(datos);
              if (datos.length>0){
                predioVerLista(datos);
              }
            }
          );
        });
}
function predioActualizarIL(){
  var dataJson = '{"pre_id":"'+ document.getElementById("pre_id").value + '",\n\
                  "pre_nombre":"' + document.getElementById("pre_nombre").value + '",\n\
                  "pre_area":"' + document.getElementById("pre_area").value + '",\n\
                  "pre_lotes":"' + document.getElementById("pre_lotes").value + '",\n\
                  "per_cc":"' + document.getElementById("per_cc").value + '",\n\
                  "pre_fecha_act":"Now()",\n\
                  "pre_tec_act":"'+sessionStorage.tec_id+'",\n\
                  "pre_id_aux":"'+document.getElementById("pre_id_aux").value+'"}';
  $.ajax({
    url: servicioPredio,
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
          predioVolver();
        } 
      }
    );
  }).fail( function( jqXHR, textStatus, errorThrown ){
    alert( "Error en actualizar" );
  }).always( function(){

  }); 
}
function predioActualizarOL(){
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
      'update predio set pre_id = ?, pre_nombre = ?, pre_area = ?, pre_lotes = ?,'
      +' per_cc = ?, pre_fecha_act = ?, pre_tec_act = ?'
      +'where pre_id_aux = ? ',
      [document.getElementById("pre_id").value,
        document.getElementById("pre_nombre").value,
        document.getElementById("pre_area").value,
        document.getElementById("pre_lotes").value,
        document.getElementById("per_cc").value,
        hoy,
        sessionStorage.tec_id,
        document.getElementById("pre_id_aux").value
      ]);
    });
    swal({
      title:'Operación Exitosa',
      text: 'Se Actualizó el predio en la base de datos local',
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
          predioVolver();
        } 
      }
    );
}
function predioBuscarIL(){
  $.ajax({      
    url: servicioPredio+"/buscar/"+sessionStorage.Pre_id,
    type: "GET",
    timeout: 100000,
    dataType: "json"                      
  }).done( function( data ){
    var datos = JSON.parse( data );
    console.log(JSON.stringify(datos));
    predioVerBusquedaIL(datos);
    sessionStorage.removeItem('Pre_id');
  }).fail( function( jqXHR, textStatus, errorThrown ){
    alert("Error en predioBuscar()");
  }).always( function(){

  });            
}
function predioBuscarOL(){
  
    db.transaction(function(tx){
      tx.executeSql(
        'select * from predio as pre '
        +'inner join productor as prod on (prod.per_cc = pre.per_cc) '
        +'inner join persona as per on (prod.per_cc = per.per_cc) '
        +'inner join municipio as mun on (prod.mun_id = mun.mun_id) '
        +'inner join departamento as dep on (mun.dep_id = dep.dep_id) '
        +'where  '
        +'pre.pre_id = ?  ',
        [sessionStorage.Pre_id],
        function(tx,resultado){ 
          var datos = resultado.rows; 
          console.log(datos);
          predioVerBusquedaOL(datos);  
        });
          
        }//fin funcion
      );
      
}
function predioListarxMunicipio(filtro){
  var valido = true;
  if(valido){
    $.ajax({      
      url: servicioPredio+"/listarxMunicipio/"+filtro,
      type: "GET",
      timeout: 100000,
      dataType: "json"                            
    }).done( function( data ){
      var datos = JSON.parse( data );
      selectPredio(datos,'');
      console.log(JSON.stringify(datos));
    }).fail( function( jqXHR, textStatus, errorThrown ){
      alert("Error en Listar");
    }).always( function(){

    }); 
  }              
}
function predioListarxUbi(filtro){
  var valido = true;
  if(valido){
    $.ajax({      
      url: servicioPredio+"/listarxUbi/"+filtro,
      type: "GET",
      timeout: 100000,
      dataType: "json"                            
    }).done( function( data ){
      var datos = JSON.parse( data );
      selectPredio(datos,'');
      console.log(JSON.stringify(datos));
    }).fail( function( jqXHR, textStatus, errorThrown ){
      alert("Error en Listar");
    }).always( function(){

    }); 
  }              
}
function predioListarxRuta(filtro){
  var valido = true;
  if(valido){
    $.ajax({      
      url: servicioPredio+"/listarxRuta/"+filtro,
      type: "GET",
      timeout: 100000,
      dataType: "json"                            
    }).done( function( data ){
      var datos = JSON.parse( data );
      selectPredio(datos,'');
      console.log(JSON.stringify(datos));
    }).fail( function( jqXHR, textStatus, errorThrown ){
      alert("Error en Listar");
    }).always( function(){

    }); 
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
function predioImp(rut_id){
  
    $.ajax({      
      url: servicioPredio+"/imp/"+rut_id,
      type: "GET",
      timeout: 100000,
      dataType: "json"                            
    }).done( function( data ){
      var datos = JSON.parse( data ); 
      //console.log(JSON.stringify(data));            
       if (datos){
         db.transaction(function(tx) {
             tx.executeSql('DELETE FROM predio');
          })
         
        $.each(datos, function(i){
            
            db.transaction(function(tx) {  
             tx.executeSql('INSERT INTO predio (pre_id, pre_nombre, pre_area,'
              +'pre_lotes, per_cc, pre_fecha_reg, pre_fecha_act, pre_tec_reg, pre_tec_act, pre_id_aux) VALUES (?,?,?,?,?,?,?,?,?,?)', 
                [datos[i].pre_id, datos[i].pre_nombre, datos[i].pre_area, datos[i].pre_lotes,
                datos[i].per_cc, datos[i].pre_fecha_reg, datos[i].pre_fecha_act, datos[i].pre_tec_reg, datos[i].pre_tec_act, datos[i].pre_id]
                );
            })
        });
    }
    
    }).fail( function( jqXHR, textStatus, errorThrown ){
      alert("Error al importar predios");
    }).always( function(){

    });               
}
function predioExp(){

    db.transaction(function(tx) {
    tx.executeSql('SELECT *from predio', [], function (tx, resultado) {
      var datos = resultado.rows;
      //console.log(datos);
      var tr = '';
      $.each(datos, function(i){
        var dataJson = '{"pre_id":"'+datos[i].pre_id+'",'
                    +'"pre_nombre":"'+datos[i].pre_nombre+'",'
                    +'"pre_area":"'+datos[i].pre_area+'",'
                    +'"pre_lotes":"'+datos[i].pre_lotes+'",'
                    +'"per_cc":"'+datos[i].per_cc+'",'
                    +'"pre_fecha_reg":"'+datos[i].pre_fecha_reg+'",'
                    +'"pre_fecha_act":"'+datos[i].pre_fecha_act+'",'
                    +'"pre_tec_reg":"'+datos[i].pre_tec_reg+'",'
                    +'"pre_tec_act":"'+datos[i].pre_tec_act+'",'
                    +'"pre_id_aux":"'+datos[i].pre_id_aux+'"}'
          console.log(dataJson);
          $.ajax({
            url: servicioPredio+"/export",
            type: "POST",
            timeout: 100000,
            dataType: "json",
            data: dataJson                  
          }).done( function(data){

          }).fail( function( jqXHR, textStatus, errorThrown ){
            alert( "Error en exportar predio");
          }).always( function(){

          }); 
      })
      
    }); 
  }, null);
}


function predioVerLista(datos){ 
  $("#tablaResultados tbody").remove();
  var tr;  
  $.each(datos, function(i){
    tr = $("<tr>");
    tr.append(
      "<td><input type='radio'name='pre_sel' value='"+datos[i].pre_id+"'/></td>"
      +"<td>"+datos[i].pre_id+"</td>"
      +"<td>"+datos[i].pre_nombre+"</td>"
      +"<td>"+datos[i].mun_descripcion
      +"<td>"+datos[i].pre_area
      +"<td>"+datos[i].per_nombre+" "+datos[i].per_apellido
      +"</tr>"
    );
    $('#tablaResultados').append(tr);
  });
}

function predioId(ruta){
  var valido = validarRadio();
  if(valido){
    sessionStorage.Pre_id = $('input:radio[name=pre_sel]:checked').val();
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

function validarRadio(){
  if($('input:radio[name=pre_sel]:checked').val()){
    return true;
  }
  return false;
}



function predioVerBusquedaIL(datos){ 
  $('#Historial-Predio div').remove();
  $('#nombre-predio p').remove();
  $('#nombre-predio').append("<p>"+datos.pre_id+" "+datos.pre_nombre+"</p>");
  var str = $("<div class = ''>");
  str.append(
    "<h2>"+datos.pre_nombre
    +"<br>"+datos.pre_id+"</h2>"
    +"<p> REGISTRADO POR : "+datos.tec_reg_nombre+" El "+datos.pre_fecha_reg+"<br>"
    +"ACTUALIZADO POR : "+datos.tec_act_nombre+" El "+datos.pre_fecha_act+"</p>"
    +"</div>"
  );
  $("#HistorialPredio").append(str);
  $("#pre_id").val(datos.pre_id);
  $("#pre_id_aux").val(datos.pre_id);
  $("#pre_nombre").val(datos.pre_nombre);
  $("#pre_area").val(datos.pre_area);
  $("#pre_lotes").val(datos.pre_lotes);
  $("#per_cc").val(datos.per_cc);
  $("#dep_id").val(datos.dep_id);
  $("#dep_descripcion").val(datos.dep_descripcion);
  $("#mun_id").val(datos.mun_id);
  $("#mun_descripcion").val(datos.mun_descripcion);
//  departamentoListar(datos.dep_id);
//  municipioListar(datos.dep_id,datos.mun_id);
  productorListarxMunicipio(datos.mun_id,datos.per_cc);
  //selectProductor()
}
function predioVerBusquedaOL(datos){ 
    
  $('#HistorialPredio div').remove();

  
    var pre_id;
    var pre_nombre;
    var pre_area;
    var pre_lotes;
    var per_cc;
    var mun_id;
    var mun_descripcion;
    var dep_id;
    var dep_descripcion;
    $.each(datos, function(i){
      pre_id = datos[i].pre_id;
      pre_nombre = datos[i].pre_nombre;
      pre_area = datos[i].pre_area;
      pre_lotes = datos[i].pre_lotes;
      per_cc = datos[i].per_cc;
      mun_id = datos[i].mun_id;
      mun_descripcion = datos[i].mun_descripcion;
      dep_id = datos[i].dep_id;
      dep_descripcion = datos[i].dep_descripcion; 
    });
        
    $("#pre_id").val(pre_id);
    $("#pre_id_aux").val(pre_id);
    $("#pre_nombre").val(pre_nombre);
    $("#pre_area").val(pre_area);
    $("#pre_lotes").val(pre_lotes);
    $("#per_cc").val(per_cc);
    $("#dep_id").val(datos.dep_id);
    $("#dep_descripcion").val(dep_descripcion);
    $("#mun_id").val(datos.mun_id);
    $("#mun_descripcion").val(mun_descripcion);
    productorListarxMunicipio(mun_id,per_cc);
}
function selectPredio(datos,pre_id){
    var str = "";
    $("#pre_id option").remove();
    $("#pre_id_act option").remove();
    str=str+"<option value = 'null' selectted=''></option>";
    $.each(datos, function(i){
        str = str+"<option  value='";
        str=str+datos[i].pre_id;
        if(datos[i].pre_id==pre_id){
           str=str+"' selected=''>";  
       }else{
            str=str+"'>";
       }
        str=str+datos[i].pre_id+' '+datos[i].pre_nombre;
        str=str+"</option>";
    });
    
    $("#pre_id").append(str);
    $("#pre_id_act").append(str);
}

function GetProductor(filtro){
  
  $.ajax({      
    url: servicioPredio+"/buscar/"+filtro,
    type: "GET",
    timeout: 100000,
    dataType: "json"                      
  }).done( function( data ){
    var datos = JSON.parse( data );             
    var str = "";
    $("#per_cc option").remove();
    $("#per_cc_act option").remove();
    str=str+"<option value = 'null' selected=''></option>";
    
        str = str+"<option  value='";
        str=str+datos.per_cc;
        str=str+"' selected = '' >";
        str=str+datos.per_cc+' '+datos.per_nombre+' '+datos.per_apellido;
        str=str+"</option>";
    
    
    $("#per_cc").append(str);
    $("#per_cc_act").append(str);
  }).fail( function( jqXHR, textStatus, errorThrown ){
    alert("Error al obtener información del productor");
  }).always( function(){

  }); 
}
function predioVolver(){
  window.location = 'Gestion-Predio.html';
}