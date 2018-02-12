var servicioLogin = "http://192.168.1.39/sigatWS/login";
var db = openDatabase("sigat", "1.0", "sigat Local", 2 * 1024 * 1024);

function btnback(){
  if (window.history && window.history.pushState) {

    window.history.pushState('forward', null, './#forward');

    $(window).on('popstate', function() {
      window.location = '#';
    });
  }
}

function salir (){
  
}

function tipo_conexion(){

  var con = $('input:radio[name=conexion]:checked').val()
  
  switch(con){
    case '1' :
      ValidarLoginIL();
    break;
    case '0':
      ValidarLoginOL();
    break;
    default :
    swal({
          title:'Error',
          text: 'Seleccione el tipo de conexión',
          type:'error',
          showCancelButton:false,
          confirmButtonColor: "#ac2925",
          confirmButtonText: "Aceptar",
          cancelButtonText: "Cancelar",
          cancelButtonColor: "#ac2925",
          closeOnConfirm: true,
          closeOnCancel: false
        },function(isConfirm){
              
          }
        );
    break;

  }
}

function validarcon(){
  if (sessionStorage.conexion == 0){
    swal({
          title:'Error',
          text: 'Ingrese en modo Online',
          type:'error',
          showCancelButton:false,
          confirmButtonColor: "#ac2925",
          confirmButtonText: "Aceptar",
          cancelButtonText: "Cancelar",
          cancelButtonColor: "#ac2925",
          closeOnConfirm: true,
          closeOnCancel: false
        },function(isConfirm){
          window.location = '#';
        }
        );
  }else{
    window.location ='../Sincronizacion/sinc.html';
  }
}

function ValidarLoginIL(){
    var key = document.getElementById("usu_contrasena").value;
    var dataJson = '{"usu_usuario":"'+document.getElementById("usu_usuario").value + '",\n\
                    "usu_contrasena":"'+key+'"}';
    //alert(servicioLogin);
    $.ajax({
        url: servicioLogin,
        type: "POST",
        timeout: 50000,
        dataType: "json",
        data: dataJson	                
    }).done( function(data){
        //console.log(JSON.stringify(data));
        var datos = JSON.parse(data);
            /*$.each(datos, function(i){*/
        if(datos.est == 'success'){
          
          db.transaction(function(tx) {  
                tx.executeSql('INSERT INTO usuarios  VALUES (?, ?, ?, ?, ?, ? )', 
                [datos.per_cc, datos.usuario, key, datos.tipo, datos.estado, datos.usuario]
                );
                });
          }
                
       swal({
          title:datos.titulo,
          text: datos.mensaje,
          type:datos.est,
          showCancelButton:false,
          confirmButtonColor: "#ac2925",
          confirmButtonText: "Aceptar",
          cancelButtonText: "Cancelar",
          cancelButtonColor: "#ac2925",
          closeOnConfirm: true,
          closeOnCancel: false
        },function(isConfirm){
              if (isConfirm) {
                    if(datos.usuario){
                        sessionStorage.conexion = 1;
                        sessionStorage.usuario = datos.usuario;
                        sessionStorage.tec_id = datos.tec_id;
                        sessionStorage.cac_id = datos.cac_id;
                        sessionStorage.per_cc = datos.per_cc;
                        sessionStorage.tec_nombre = datos.tec_nombre;
                        sessionStorage.estado = datos.estado;
                        window.location= datos.location;
                    }   
                }else{
                   window.location= datos.location;
                } 
            }
        );
               
    }).fail( function( jqXHR, textStatus, errorThrown ){
       alert( "Error al validar" );
     }).always( function(){

     }); 
}
function ValidarLoginOL(){
   var usu_usuario = document.getElementById("usu_usuario").value;
   var usu_contrasena = document.getElementById("usu_contrasena").value;
   
   db.transaction(function(tx) {
    tx.executeSql('SELECT * FROM usuarios as usu, persona as per,tecnico as tec '
      +' where usu_usuario = ? AND usu_contrasena = ? '
      +'and usu.per_cc = per.per_cc and per.per_cc = tec.per_cc ', 
      [usu_usuario, usu_contrasena], function (tx, resultado) {
      var datos = resultado.rows;
       if (datos.length>0){
        $.each(datos, function(i){
            sessionStorage.tec_id = datos[i].tec_id;
            sessionStorage.per_cc = datos[i].per_cc;
            sessionStorage.tec_nombre = datos[i].per_nombre+" "+datos[i].per_apellido;
            sessionStorage.estado = datos[i].est_id;
            sessionStorage.cac_id = datos[i].cac_id;
        });
        
        swal({
          title:'Ingreso Correcto',
          text: 'Sesión Iniciada para '+usu_usuario,
          type:'success',
          showCancelButton:false,
          confirmButtonColor: "#ac2925",
          confirmButtonText: "Aceptar",
          cancelButtonText: "Cancelar",
          cancelButtonColor: "#ac2925",
          closeOnConfirm: false,
          closeOnCancel: false
        },function(isConfirm){
              if (isConfirm) {
                    if(datos.length>0){
                        sessionStorage.conexion = 0;
                        sessionStorage.usuario = usu_usuario;
                        
                        window.location= 'tecnicoREST/TecnicoHome.html';
                    }   
                }else{
                   window.location= '#';
                } 
            }
        );
        
       }else{
          alert('Ingreso Fallido');
        }
    }); 
  }, null);

}
function sesion(){
    if(!sessionStorage.usuario){
        window.location = 'index.html';
    }
}
function logout(){
   
    swal({
      title: "Cerrar Sesión",
      text: "Está seguro que quiere cerrar la sesión ?",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ac2925",
      confirmButtonText: "Salir",
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#ac2925",
      closeOnConfirm: false,
      closeOnCancel: true
    },
    function(isConfirm){
      if (isConfirm) {
        sessionStorage.clear();
        window.location="index.html";
      } 
    });
 
}



        
            
           
           
