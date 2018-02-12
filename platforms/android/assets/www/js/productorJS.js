var servicioProductor = "http://192.168.1.39/sigatWS/productor";
var db = openDatabase("sigat", "1.0", "sigat_Local", 2 * 1024 * 1024);



function productorInsertar(){
  if (sessionStorage.conexion == 1){
    productorInsertarIL();
  }else{
    productorInsertarOL();
  }
}
function productorActualizar(){
  if (sessionStorage.conexion == 1){
    productorActualizarIL();
  }else{
    productorActualizarOL();
  }
}
function productorBuscar(){
  if (sessionStorage.conexion == 1){
    productorBuscarIL();
  }else{
    productorBuscarOL();
  }
}
function productorListar(filtro){
  
  var valido = validarBuscar();
  if(valido){
    
    if(sessionStorage.conexion == 1){ 
        productorListarIL(filtro);
    }
    else{
      productorListarOL(filtro);
    } 
  }              
}
function productorListarxMunicipio(filtro,per_cc){
  if (sessionStorage.conexion == 1){
    productorListarxMunicipioIL(filtro,per_cc);
  }else{
    productorListarxMunicipioOL(filtro,per_cc);
  }
}
function productorInsertarIL(){
  
  var dataJson = '{"per_cc":"'+ document.getElementById("per_cc").value + '",\n\
                  "per_nombre":"' + document.getElementById("per_nombre").value + '",\n\
                  "per_apellido":"' + document.getElementById("per_apellido").value + '",\n\
                  "gen_id":"' + document.getElementById("gen_id").value + '",\n\
                  "per_direccion":"' + document.getElementById("per_direccion").value + '",\n\
                  "per_correo":"' + document.getElementById("per_correo").value + '",\n\
                  "per_telefono":"' + document.getElementById("per_telefono").value + '",\n\
                  "tip_id":"3",\n\
                  "prod_fecha_reg":"Now()",\n\
                  "prod_fecha_act":"Now()",\n\
                  "prod_tec_reg":"'+sessionStorage.tec_id+'",\n\
                  "prod_tec_act":"'+sessionStorage.tec_id+'",\n\
                  "prod_estado":"true",\n\
                  "mun_id":"'+document.getElementById("mun_id").value+'"}';
  $.ajax({
    url: servicioProductor+'/insert',
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
          productorVolver();
        } 
      }
    );
  }).fail( function( jqXHR, textStatus, errorThrown ){
    alert( "Error en insertar" );
  }).always( function(){

  }); 
 
 }
function productorInsertarOL(){
    
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
      'insert into persona (per_cc,per_nombre,per_apellido,gen_id,per_telefono,per_direccion,per_correo,tip_id,per_cc_aux)'
      +'values(?,?,?,?,?,?,?,?,?)',
      [document.getElementById("per_cc").value,
        document.getElementById("per_nombre").value,
        document.getElementById("per_apellido").value,
        document.getElementById("gen_id").value,
        document.getElementById("per_telefono").value,
        document.getElementById("per_direccion").value,
        document.getElementById("per_correo").value,
        '3',
        document.getElementById("per_cc").value
      ]);
    });
    db.transaction(function(tx){
      tx.executeSql(
      'insert into productor (per_cc, prod_fecha_reg, prod_fecha_act, prod_tec_reg, prod_tec_act, prod_estado, mun_id)'
      +'values(?,?,?,?,?,?,?)',
      [document.getElementById("per_cc").value,
        hoy,
        hoy,
        sessionStorage.tec_id,
        sessionStorage.tec_id,
        "true",
        document.getElementById("mun_id").value
      ]);
    });
    swal({
      title:'Operación Exitosa',
      text: 'Se registró el productor en la base de datos local',
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
          productorVolver();
        } 
      }
    );
}
function productorActualizarIL(){
  var dataJson = '{"per_cc":"'+ document.getElementById("per_cc").value + '",\n\
                  "per_nombre":"' + document.getElementById("per_nombre").value + '",\n\
                  "per_apellido":"' + document.getElementById("per_apellido").value + '",\n\
                  "gen_id":"' + document.getElementById("gen_id").value + '",\n\
                  "per_direccion":"' + document.getElementById("per_direccion").value + '",\n\
                  "per_correo":"' + document.getElementById("per_correo").value + '",\n\
                  "per_telefono":"' + document.getElementById("per_telefono").value + '",\n\
                  "tip_id":"3",\n\
                  "prod_fecha_act":"Now()",\n\
                  "prod_tec_act":"'+sessionStorage.tec_id+'",\n\
                  "prod_estado":"true",\n\
                  "mun_id":"'+document.getElementById("mun_id").value+'",\n\
                  "per_cc_aux":"'+document.getElementById("per_cc_aux").value+'"}'
  $.ajax({
    url: servicioProductor,
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
          productorVolver();

        } 
      }
    );
  }).fail( function( jqXHR, textStatus, errorThrown ){
    alert( "Error en actualizar" );
  }).always( function(){

  }); 
}
function productorActualizarOL(){
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
      'update persona set per_cc = ?, per_nombre = ?, per_apellido = ?, gen_id = ?,'
      +' per_telefono = ?, per_direccion = ?, per_correo = ?, tip_id = ?, per_cc_aux = ? '
      +'where per_cc = ? ',
      [document.getElementById("per_cc").value,
        document.getElementById("per_nombre").value,
        document.getElementById("per_apellido").value,
        document.getElementById("gen_id").value,
        document.getElementById("per_telefono").value,
        document.getElementById("per_direccion").value,
        document.getElementById("per_correo").value,
        '3',
        document.getElementById("per_cc").value,
        document.getElementById("per_cc_aux").value
      ]);
    });
    db.transaction(function(tx){
      tx.executeSql(
      'update productor set per_cc = ?, prod_fecha_act = ?, prod_tec_act = ?, prod_estado = ?, mun_id = ? '
      +'where per_cc = ? ',
      [document.getElementById("per_cc").value,
        hoy,
        sessionStorage.tec_id,
        "true",
        document.getElementById("mun_id").value,
        document.getElementById("per_cc_aux").value
      ]);
    });
    swal({
      title:'Operación Exitosa',
      text: 'Se Actualizó el productor en la base de datos local',
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
          productorVolver();
        } 
      }
    );
}

function productorListarIL(filtro){
  $.ajax({      
    url: servicioProductor+"/listar/"+filtro,
    type: "GET",
    timeout: 100000,
    dataType: "json"                            
  }).done( function( data ){
      var datos = JSON.parse( data );             
      productorVerLista(datos);
    }).fail( function( jqXHR, textStatus, errorThrown ){
      alert("Error en Listar");
    }).always( function(){
    });  
}
function productorListarOL(filtro){
  db.transaction(function(tx){
          tx.executeSql(
            'select * from persona as per, '
            +'productor as prod, '
            +'genero as gen, '
            +'municipio as mun '
            +'where ( '
            +'per.per_cc = prod.per_cc  and '
            +'per.gen_id = gen.gen_id  and '
            +'prod.mun_id = mun.mun_id ) '
            +'and (cast (per.per_cc as varchar) like \'%\' || ? || \'%\' '
            +'or upper (per.per_nombre) like \'%\' || ? || \'%\' '
            +'or upper (per.per_apellido) like \'%\' || ? || \'%\' '
            +'or upper (per.per_direccion) like \'%\' || ? || \'%\' '
            +'or upper (mun.mun_descripcion) like \'%\' || ? || \'%\') ',
            [filtro,filtro,filtro,filtro,filtro],
            function(tx,resultado){
              var datos = resultado.rows;
              console.log(datos);
              if (datos.length>0){
                productorVerLista(datos);
              }
            }
          );
        });
}
function productorImp(rut_id){
  
    $.ajax({      
      url: servicioProductor+"/imp/"+rut_id,
      type: "GET",
      timeout: 100000,
      dataType: "json"                            
    }).done( function( data ){
      var datos = JSON.parse( data ); 
      //console.log('productorImp '+ JSON.stringify(data));            
       if (datos){
         db.transaction(function(tx) {
             tx.executeSql('DELETE FROM productor');
          })
          db.transaction(function(tx) {
             tx.executeSql('DELETE FROM persona where tip_id = 3');
          })
        $.each(datos, function(i){
            db.transaction(function(tx) {  
             tx.executeSql('INSERT INTO persona ( per_cc,per_nombre,per_apellido,'
              +'gen_id,per_telefono,per_direccion,per_correo,tip_id, per_cc_aux) VALUES (?,?,?,?,?,?,?,?,?)', 
                [datos[i].per_cc, datos[i].per_nombre, datos[i].per_apellido, datos[i].gen_id,
                datos[i].per_telefono,  datos[i].per_direccion, datos[i].per_correo, datos[i].tip_id, datos[i].per_cc]
                );
            })
            db.transaction(function(tx) {  
             tx.executeSql('INSERT INTO productor ( per_cc,prod_fecha_reg,prod_fecha_act,'
              +'prod_tec_reg,prod_tec_act,prod_estado,mun_id) VALUES (?,?,?,?,?,?,?)', 
                [datos[i].per_cc, datos[i].prod_fecha_reg, datos[i].prod_fecha_act, datos[i].prod_tec_reg,
                datos[i].prod_tec_act,datos[i].prod_estado,datos[i].mun_id]
                );
            })
        });
    }
    
    }).fail( function( jqXHR, textStatus, errorThrown ){
      alert("Error en importar productor");
    }).always( function(){

    });               
}

function productorExp(){

    db.transaction(function(tx) {
    tx.executeSql('SELECT per.per_cc, per.per_nombre, per.per_apellido, per.gen_id, per.per_telefono, '
      +' per.per_direccion, per.per_correo, per.tip_id, per.per_cc_aux, prod.prod_fecha_reg, prod.prod_fecha_act,  '
      +'prod.prod_tec_reg, prod.prod_tec_act, prod.prod_estado, prod.mun_id ' 
      +' FROM productor as prod, ' 
      +'persona as per where prod.per_cc = per.per_cc', [], function (tx, resultado) {
      var datos = resultado.rows;
      //console.log(datos);
      var tr = '';
      $.each(datos, function(i){
        var dataJson = '{"per_cc":"'+datos[i].per_cc+'",'
                    +'"per_nombre":"'+datos[i].per_nombre+'",'
                    +'"per_apellido":"'+datos[i].per_apellido+'",'
                    +'"gen_id":"'+datos[i].gen_id+'",'
                    +'"per_telefono":"'+datos[i].per_telefono+'",'
                    +'"per_direccion":"'+datos[i].per_direccion+'",'
                    +'"per_correo":"'+datos[i].per_correo+'",'
                    +'"tip_id":"'+datos[i].tip_id+'",'
                    +'"prod_fecha_reg":"'+datos[i].prod_fecha_reg+'",'
                    +'"prod_fecha_act":"'+datos[i].prod_fecha_act+'",'
                    +'"prod_tec_reg":"'+datos[i].prod_tec_reg+'",'
                    +'"prod_tec_act":"'+datos[i].prod_tec_act+'",'
                    +'"prod_estado":"'+datos[i].prod_estado+'",'
                    +'"mun_id":"'+datos[i].mun_id+'",'
                    +'"per_cc_aux":"'+datos[i].per_cc_aux+'"}'
          console.log(dataJson);
          $.ajax({
            url: servicioProductor+"/export",
            type: "POST",
            timeout: 100000,
            dataType: "json",
            data: dataJson                  
          }).done( function(data){

          }).fail( function( jqXHR, textStatus, errorThrown ){
            alert( "Error en exportar productor" );
          }).always( function(){

          }); 
      })
      
    }); 
  }, null);
}

function productorListarxMunicipioIL(filtro,per_cc){
  $.ajax({      
    url: servicioProductor+"/listarxMunicipio/"+filtro,
    type: "GET",
    timeout: 100000,
    dataType: "json"                            
  }).done( function( data ){
    var datos = JSON.parse( data );
    //console.log(JSON.stringify(datos));
    selectProductor(datos,per_cc);
  }).fail( function( jqXHR, textStatus, errorThrown ){
    alert("Error en Listar");
  }).always( function(){

  });                 
}
function productorListarxMunicipioOL(filtro,per_cc){
  db.transaction(function(tx){
    tx.executeSql(
      'select * from persona as per '
      +'inner join productor as prod on (prod.per_cc = per.per_cc)'
      +'inner join genero as gen on (per.gen_id  = gen.gen_id)'
      +'inner join municipio as mun on (prod.mun_id = mun.mun_id)'
      +'where mun.mun_id = ? ',
      [filtro],
      function(tx,resultado){
        var datos = resultado.rows;
        console.log('productorListarxMunicipioOL');
        console.log(datos);
        if (datos.length>0){
          selectProductor(datos,per_cc);
        }
      }
    );
  });
}
function productorId(ruta){
  var valido = validarRadio();
  if(valido){
    sessionStorage.Prod_id = $('input:radio[name=prod_sel]:checked').val();
    window.location = ruta; 
  }else{
    swal({
      title:'Falta un dato',
      text: 'Seleccione un Productor' ,
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
  if($('input:radio[name=prod_sel]:checked').val()){
    return true;
  }
  return false;
}

function productorVolver(){
  window.location = 'Gestion-Productor.html'; 
}

function productorBuscarIL(){
  $.ajax({      
    url: servicioProductor+"/buscar/"+sessionStorage.Prod_id,
    type: "GET",
    timeout: 100000,
    dataType: "json"                      
  }).done( function( data ){
      var datos = JSON.parse( data );             
      productorVerBusquedaIL(datos);
      sessionStorage.removeItem('Prod_id');
      console.log("buscar js "+JSON.stringify(datos));
    }).fail( function( jqXHR, textStatus, errorThrown ){
      alert("Campo de Busqueda Vacio");
    }).always( function(){

    });             
}

function productorBuscarOL(){
  db.transaction(function(tx){
    tx.executeSql(
      'select * from persona as per '
      +'inner join productor as prod on (prod.per_cc = per.per_cc) '
      +'inner join municipio as mun on (prod.mun_id = mun.mun_id) '
      +'inner join departamento as dep on (mun.dep_id = dep.dep_id) '
      +'where  '
      +'prod.per_cc = ?  ',
      [sessionStorage.Prod_id],
      function(tx,resultado){ 
        var datos = resultado.rows; 
        console.log(datos);
        productorVerBusquedaOL(datos);  
      }
    );      
  });      
}
function productorVerLista(datos){ 
  $("#tablaResultados tbody").remove();
  var tr;  
  $.each(datos, function(i){
    tr = $("<tr>");
    tr.append(
      "<td><input type='radio'name='prod_sel' value='"+datos[i].per_cc+"'/></td>"
      +"<td>"+datos[i].per_cc+"</td>"
      +"<td>"+datos[i].per_nombre+" "+datos[i].per_apellido+"</td>"
      +"<td>"+datos[i].mun_descripcion
      +"<td>"+datos[i].per_direccion
      +"<td>"+datos[i].per_telefono
      +"</tr>"
    );
    $('#tablaResultados').append(tr);
  });
}

function selectGenero(gen_id){

  $("#gen_id option").remove();
  if(sessionStorage.conexion == 1){
    switch(gen_id){
      case '1': 
      var str = "<option value = '1' selected = '' >Masculino</option>"
      +"<option value = '2' > Femenino</option>";
      break;
     case '2': 
      var str = "<option value = '1' >Masculino</option>"
      +"<option value = '2' selected = '' > Femenino</option>";
      break;
    }
  }else{
    switch(gen_id){
    case 1: 
      var str = "<option value = '1' selected = '' >Masculino</option>"
              +"<option value = '2' > Femenino</option>";
      break;
     case 2: 
      var str = "<option value = '1' >Masculino</option>"
              +"<option value = '2' selected = '' > Femenino</option>";
      break;
    }
  }
  
  $("#gen_id").append(str);
}
function selectProductor(datos,per_cc){
    var str = "";
    $("#per_cc option").remove();
    $("#per_cc_act option").remove();
    str=str+"<option value = 'null' selectted=''></option>";
    $.each(datos, function(i){
        str = str+"<option  value='";
        str=str+datos[i].per_cc;
        if(datos[i].per_cc==per_cc){
           str=str+"' selected=''>";  
       }else{
            str=str+"'>";
       }
        str=str+datos[i].per_nombre+' '+datos[i].per_apellido;
        str=str+"</option>";
    });
    
    $("#per_cc").append(str);
    $("#per_cc_act").append(str);
}
function productorVerBusquedaIL(datos){ 
    
  $('#HistorialProductor div').remove();
    var str = $("<div class = ''>");
    str.append(
      "<h2>"+datos.per_nombre+" " +datos.per_apellido
      +"<br>"+datos.per_cc+"</h2>"
      +"<p> REGISTRADO POR : "+datos.tec_reg_nombre+" El "+datos.prod_fecha_reg+"<br>"
      +"ACTUALIZADO POR : "+datos.tec_act_nombre+" El "+datos.prod_fecha_act+"</p>"
      +"</div>"
    );
    $("#HistorialProductor").append(str);
    $("#per_cc").val(datos.per_cc);
    $("#per_cc_aux").val(datos.per_cc);
    $("#per_nombre").val(datos.per_nombre);
    $("#per_apellido").val(datos.per_apellido);
    $("#per_direccion").val(datos.per_direccion);
    $("#per_telefono").val(datos.per_telefono);
    $("#per_correo").val(datos.per_correo);
    departamentoListar(datos.dep_id);
    municipioListar(datos.dep_id,datos.mun_id);
    selectGenero(datos.gen_id);  
}
function productorVerBusquedaOL(datos){ 
    
  $('#HistorialProductor div').remove();
    var prod_cc;
    var prod_nombre;
    var prod_apellido;
    var prod_direccion;
    var prod_telefono;
    var prod_correo;
    var prod_genero;
    var prod_municipio;
    var prod_departamento;
    var prod_tec_reg;
    var prod_tec_act;
    var prod_fecha_reg;
    var prod_fecha_act;
    var tec_reg_nombre;
    var tec_act_nombre;
    $.each(datos, function(i){
      prod_cc = datos[i].per_cc;
      prod_nombre = datos[i].per_nombre;
      prod_apellido = datos[i].per_apellido;
      prod_direccion = datos[i].per_direccion;
      prod_telefono = datos[i].per_telefono;
      prod_correo = datos[i].per_correo;
      prod_genero = datos[i].gen_id;
      prod_municipio = datos[i].mun_id;
      prod_departamento = datos[i].dep_id; 
    });
    
    $("#per_cc").val(prod_cc);
    $("#per_cc_aux").val(prod_cc);
    $("#per_nombre").val(prod_nombre);
    $("#per_apellido").val(prod_apellido);
    $("#per_direccion").val(prod_direccion);
    $("#per_telefono").val(prod_telefono);
    $("#per_correo").val(prod_correo);
    departamentoListar(prod_departamento);
    municipioListar(prod_departamento,prod_municipio);
    selectGenero(prod_genero); 
}