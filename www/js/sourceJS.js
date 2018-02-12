window.addEventListener('load', cargado(),ip());
var db = openDatabase("sigat", "1.0", "sigat_Local", 2 * 1024 * 1024);

function ip(){
    //sessionStorage.ipadd = '190.121.143.213';
    sessionStorage.ipadd = 'localhost';
}

function cargado(){ 
   

    db.transaction(function(tx) {
       
    	tx.executeSql("CREATE TABLE IF NOT EXISTS estado ("
        	+"est_id numeric unique not null,"
			+"est_descripcion varchar unique not null,"
			+"primary key (est_id) )"
		);
		
    	tx.executeSql(
    		"CREATE TABLE IF NOT EXISTS tipo_Persona ("
			+"tip_id numeric unique not null,"
			+"tip_descripcion varchar unique not null,"
			+"primary key (tip_id))"
		);
		
    	tx.executeSql("CREATE TABLE IF NOT EXISTS genero ("
        	+"gen_id numeric unique not null,"
			+"gen_descripcion varchar unique not null,"
			+"primary key (gen_id) )"
		);
		
		tx.executeSql(
			"create table if not exists arbol ( "
			+"arb_id numeric unique not null, "
			+"arb_descripcion varchar unique not null, "
			+"primary key (arb_id) ) "
		);

		tx.executeSql(
			"create table if not exists atrayente ( "
			+"atr_id numeric unique not null, "
			+"atr_descripcion varchar unique not null, "
			+"primary key (atr_id) ) "
		);
		
		
		tx.executeSql(
			"create table if not exists especie_cultivo ( "
			+"esc_id numeric unique not null, "
			+"esc_descripcion varchar unique not null, "
			+"primary key (esc_id) ) "
		);

		tx.executeSql(
			"create table if not exists especie_mosca ( "
			+"esm_id numeric unique not null, "
			+"esm_descripcion varchar unique not null, "
			+"primary key (esm_id) ) "
		);

		tx.executeSql(
			"create table if not exists fenologia ( "
			+"fen_id numeric unique not null, "
			+"fen_descripcion varchar unique not null, "
			+"primary key (fen_id) ) "
		);

		tx.executeSql(
			"create table if not exists localizacion ( "
			+"loc_id numeric unique not null, "
			+"loc_descripcion varchar unique not null, "
			+"primary key (loc_id) ) "
		);

		tx.executeSql(
			"create table if not exists sitio_muestra ( "
			+"sim_id numeric unique not null, "
			+"sim_descripcion varchar unique not null, "
			+"primary key (sim_id) ) "
		);

		tx.executeSql(
			"create table if not exists tipo_trampa ( "
			+"tit_id numeric unique not null, "
			+"tit_descripcion varchar unique not null, "
			+"primary key (tit_id) ) "
		);

		tx.executeSql(
			"create table if not exists vigilancia ( "
			+"vig_id numeric unique not null, "
			+"vig_descripcion varchar unique not null, "
			+"primary key (vig_id) ) "
		);

		tx.executeSql(
			"create table if not exists tipo_usuario ( "
			+"tiu_id numeric unique not null, "
			+"tiu_nombre varchar unique not null, "
			+"primary key (tiu_id) ) "
		);

		tx.executeSql(
    		"CREATE TABLE IF NOT EXISTS region ("
			+"reg_id numeric unique not null,"
			+"reg_descripcion varchar unique not null,"
			+"primary key(reg_id))"
		);
		tx.executeSql(
    		"CREATE TABLE IF NOT EXISTS departamento ( "
			+"dep_id numeric unique not null, "
			+"dep_descripcion varchar unique not null, "
			+"reg_id numeric not null, "
			+"primary key(reg_id), "
			+"foreign key (reg_id) references region (reg_id) "
			+"on update cascade on delete restrict ) "
		);

		tx.executeSql(
    		"CREATE TABLE IF NOT EXISTS municipio ( "
			+"mun_id numeric unique not null, "
			+"mun_descripcion varchar unique not null, "
			+"dep_id numeric not null, "
			+"primary key(mun_id), "
			+"foreign key (dep_id) references departamento (dep_id) "
			+"on update cascade on delete restrict ) "
		);

		tx.executeSql(
    		"CREATE TABLE IF NOT EXISTS centro_acopio ( "
			+"cac_id numeric unique not null, "
			+"cac_descripcion varchar unique not null, "
			+"dep_id numeric not null, "
			+"primary key(cac_id), "
			+"foreign key (dep_id) references departamento (dep_id) "
			+"on update cascade on delete restrict ) "
		);
		tx.executeSql(
    		"create table IF NOT EXISTS persona("
			+"per_cc numeric unique not null,"
			+"per_nombre varchar not null,"
			+"per_apellido varchar not null,"
			+"gen_id numeric not null,"
			+"per_telefono numeric not null,"
			+"per_direccion varchar not null,"
			+"per_correo varchar,"
			+"tip_id numeric not null,"
            +"per_cc_aux numeric unique not null,"
			+"primary key (per_cc),"
			+"foreign key (gen_id) references genero(gen_id)"
			+"on update cascade on delete restrict,"
			+"foreign key (tip_id) references tipo_Persona(tip_id)"
			+"on update cascade on delete restrict)"
		);

		tx.executeSql(
    		"CREATE TABLE IF NOT EXISTS administrador ( "
			+"adm_id numeric unique not null, "
			+"per_cc numeric unique not null, "
			+"cac_id numeric not null, "
			+"primary key(adm_id), "
			+"foreign key (per_cc) references persona (per_cc) "
			+"on update cascade on delete restrict, "
			+"foreign key (cac_id) references centro_acopio (cac_id) "
			+"on update cascade on delete restrict ) "
		);

        tx.executeSql("CREATE TABLE IF NOT EXISTS usuarios ("
        	+"per_cc NUMERIC NOT NULL , " 
        	+"usu_usuario VARCHAR  PRIMARY KEY, "
        	+"usu_contrasena VARCHAR NOT NULL, "
        	+"tiu_id NUMERIC NOT NULL, "
        	+"est_id NUMERIC NOT NULL, "
        	+"prod_cc_aux NUMERIC NOT NULL, "
        	+"foreign key (per_cc) references persona (per_cc) "
        	+"on update cascade on delete restrict,"
        	+"foreign key (tiu_id) references tipo_usuario (tiu_id) "
        	+"on update cascade on delete restrict,"
        	+"foreign key (est_id) references estado (est_id) "
        	+"on update cascade on delete restrict ) " 
        );

        tx.executeSql("CREATE TABLE IF NOT EXISTS tecnico ( "
        	+"tec_id NUMERIC NOT NULL , "
        	+"per_cc NUMERIC NOT NULL , "
        	+"cac_id NUMERIC NOT NULL , "
        	+"adm_id NUMERIC NOT NULL , " 
        	+"tec_fecha_reg date not null, "
        	+"tec_fecha_act date, "
        	+"est_id NUMERIC NOT NULL, "
        	+"foreign key (per_cc) references persona (per_cc) "
        	+"on update cascade on delete restrict, "
        	+"foreign key (cac_id) references centro_acopio (cac_id) "
        	+" on update cascade on delete restrict ) " 
        );

        tx.executeSql(
        	"create table if not exists productor ( "
        	+"per_cc numeric unique not null, "
        	+"prod_fecha_reg date not null, "
        	+"prod_fecha_act date, "
        	+"prod_tec_reg numeric not null, "
        	+"prod_tec_act numeric, "
        	+"prod_estado boolean not null, "
        	+"mun_id numeric not null, "
        	+"primary key (per_cc), "
        	+"foreign key (mun_id) references municipio (mun_id) "
        	+"on update cascade on delete restrict, "
        	+"foreign key (per_cc) references persona (per_cc) "
        	+"on update cascade on delete restrict, "
        	+"foreign key (prod_tec_reg) references tecnico (tec_id) "
        	+"on update cascade on delete restrict, "
        	+"foreign key (prod_tec_act) references tecnico (tec_id) "
        	+"on update cascade on delete restrict) "
        );

        tx.executeSql(
        	"create table if not exists predio ( "
        	+"pre_id numeric unique not null, "
        	+"pre_nombre varchar not null, "
        	+"pre_area float not null, "
        	+"pre_lotes integer not null, "
        	+"per_cc numeric not null, "
        	+"pre_fecha_reg date not null, "
        	+"pre_fecha_act date, "
        	+"pre_tec_reg numeric not null, "
        	+"pre_tec_act numeric, "
            +"pre_id_aux numeric not null, "
        	+"primary key (pre_id), "
        	+"foreign key (per_cc) references productor (per_cc) "
        	+"on update cascade on delete restrict, "
        	+"foreign key (pre_tec_reg) references tecnico (tec_id) "
        	+"on update cascade on delete restrict, "
        	+"foreign key (pre_tec_act) references tecnico (tec_id) "
        	+"on update cascade on delete restrict) "
        );

        tx.executeSql(
        	"create table if not exists lote ( "
        	+"lot_id numeric unique not null, "
        	+"lot_descripcion varchar not null, "
        	+"lot_area float not null, "
        	+"pre_id numeric not null, "
        	+"lot_fecha_reg date not null, "
        	+"lot_fecha_act date, "
        	+"lot_tec_reg numeric not null, "
        	+"lot_tec_act numeric, "
            +"lot_id_aux numeric, "
        	+"primary key (lot_id), "
        	+"foreign key (pre_id) references predio (pre_id) "
        	+"on update cascade on delete restrict ) "
        );

        tx.executeSql(
        	"create table if not exists ruta ( "
        	+"rut_id numeric unique not null, "
        	+"rut_nombre varchar not null, "
        	+"rut_descripcion varchar not null, "
        	+"cac_id numeric not null, "
        	+"mun_id numeric not null, "
        	+"rut_fecha_reg date not null, "
        	+"rut_fecha_act date, "
        	+"rut_adm_reg numeric not null, "
        	+"rut_adm_act numeric, "
        	+"est_id numeric not null, "
        	+"primary key (rut_id), "
        	+"foreign key (cac_id) references centro_acopio (cac_id) "
        	+"on update cascade on delete restrict, "
        	+"foreign key (mun_id) references municipio (mun_id) "
        	+"on update cascade on delete restrict, "
        	+"foreign key (est_id) references estado (est_id) "
        	+"on update cascade on delete restrict) "
        );

        tx.executeSql(
        	"create table if not exists trampa ( "
        	+"tra_id numeric not null, "
        	+"tit_id numeric not null, "
        	+"atr_id numeric not null, "
        	+"est_id numeric not null, "
        	+"tra_fecha_reg date not null, "
        	+"tra_fecha_act date, "
        	+"tra_tec_reg numeric not null, "
        	+"tra_tec_act numeric, "
            +"tra_id_aux numeric not null, "
        	+"primary key (tra_id), "
        	+"foreign key (tit_id) references tipo_trampa (tit_id) "
        	+"on update cascade on delete restrict, "
        	+"foreign key (atr_id) references atrayente (atr_id) "
        	+"on update cascade on delete restrict, "
        	+"foreign key (est_id) references estado (est_id) "
        	+"on update cascade on delete restrict, "
        	+"foreign key (tra_tec_reg) references tecnico (tec_id) "
        	+"on update cascade on delete restrict, "
        	+"foreign key (tra_tec_act) references tecnico (tec_id) "
        	+"on update cascade on delete restrict) "
        );

        tx.executeSql(
        	"create table if not exists ubi ( "
        	+"tec_id numeric not null, "
        	+"vig_id numeric not null, "
        	+"rut_id numeric not null, "
        	+"cod_ruta numeric not null, "
        	+"tra_id numeric not null, "
        	+"ubi_fecha date not null, "
        	+"pre_id numeric not null, "
        	+"prod_id numeric not null, "
        	+"ubi_long float not null, "
        	+"ubi_lat float not null, "
        	+"ubi_alt float not null, "
        	+"ubi_ubicacion varchar not null, "
        	+"loc_id numeric not null, "
        	+"arb_id numeric not null, "
        	+"primary key (ubi_fecha, tra_id, pre_id), "
        	+"foreign key (tec_id) references tecnico (tec_id) "
        	+"on update cascade on delete restrict, "
        	+"foreign key (vig_id) references vigilancia (vig_id) "
        	+"on update cascade on delete restrict, "
        	+"foreign key (rut_id) references ruta (rut_id) "
        	+"on update cascade on delete restrict, "
        	+"foreign key (tra_id) references trampa (tra_id) "
        	+"on update cascade on delete restrict, "
        	+"foreign key (pre_id) references predio (pre_id) "
        	+"on update cascade on delete restrict, "
        	+"foreign key (prod_id) references productor (per_cc) "
        	+"on update cascade on delete restrict, "
        	+"foreign key (loc_id) references localizacion (loc_id) "
        	+"on update cascade on delete restrict, "
        	+"foreign key (arb_id) references arbol (arb_id) "
        	+"on update cascade on delete restrict ) "
        );
        tx.executeSql(
            "create table if not exists cap ( "
            +"tec_id numeric not null, "
            +"cac_id numeric not null, "
            +"cap_semana numeric not null, "
            +"cap_ano numeric not null, "
            +"vig_id numeric not null, "
            +"rut_id numeric not null, "
            +"tra_id numeric not null, "
            +"esm_id numeric not null, "
            +"cap_fecha_cap date not null, "
            +"cap_machos integer not null, "
            +"cap_hembras integer not null, "
            +"fen_id numeric not null, "
            +"cap_fecha_dia date not null, "
            +"cap_mue numeric not null, "
            +"pre_id numeric not null, "
            +"primary key (cap_fecha_cap, tra_id, esm_id), "
            +"foreign key (tec_id) references tecnico (tec_id) "
            +"on update cascade on delete restrict, "
            +"foreign key (vig_id) references vigilancia (vig_id) "
            +"on update cascade on delete restrict, "
            +"foreign key (rut_id) references ruta (rut_id) "
            +"on update cascade on delete restrict, "
            +"foreign key (tra_id) references trampa (tra_id) "
            +"on update cascade on delete restrict, "
            +"foreign key (pre_id) references predio (pre_id) "
            +"on update cascade on delete restrict, "
            +"foreign key (esm_id) references especie_mosca (esm_id) "
            +"on update cascade on delete restrict, "
            +"foreign key (fen_id) references fenologia (fen_id) "
            +"on update cascade on delete restrict, "
            +"foreign key (cac_id) references centro_acopio (cac_id) "
            +"on update cascade on delete restrict) "
        );
        tx.executeSql(
            "create table if not exists inspeccion ( "
            +"ins_fecha date not null, "
            +"pre_id numeric not null, "
            +"per_cc numeric not null, "
            +"tec_id numeric not null, "
            +"ins_estado boolean not null, "
            +"ins_obs varchar not null, "
            +"rut_id numeric not null, "
            +"primary key (ins_fecha, pre_id), "
            +"foreign key (tec_id) references tecnico (tec_id) "
            +"on update cascade on delete restrict, "
            +"foreign key (pre_id) references predio (pre_id) "
            +"on update cascade on delete restrict, "
            +"foreign key (rut_id) references ruta (rut_id) "
            +"on update cascade on delete restrict) "
        );
        tx.executeSql(
            "create table if not exists alertas ( "
            +"pre_id numeric not null, "
            +"ale_fecha date not null, "
            +"ale_mtd float not null, "
            +"tec_id numeric not null, "
            +"rut_id numeric not null, "
            +"primary key (ale_fecha, pre_id), "
            +"foreign key (tec_id) references tecnico (tec_id) "
            +"on update cascade on delete restrict, "
            +"foreign key (pre_id) references predio (pre_id) "
            +"on update cascade on delete restrict, "
            +"foreign key (rut_id) references ruta (rut_id) "
            +"on update cascade on delete restrict) "
        );
        tx.executeSql(
    		"INSERT INTO tipo_persona values"
			+"(1,'ADMINISTRADOR'),(2,'TECNICO'),(3,'PRODUCTOR')"
		);
		tx.executeSql(
    		"INSERT INTO estado values"
			+"(1,'ACTIVO'),(2,'INACTIVO')"
		);
		tx.executeSql(
    		"INSERT INTO genero values"
			+"(1,'MASCULINO'),(2,'FEMENINO')"
		);
		tx.executeSql(
    		"INSERT INTO tipo_usuario values"
			+"(1,'ADMINISTRADOR'),(2,'TECNICO'),(3,'SOPORTE') "
		);
        tx.executeSql(
            "INSERT INTO fenologia values"
            +"(1,'VEGETATIVO'),"
            +"(2,'FLORACION'),"
            +"(3,'FRUCTIFICACION'), "
            +"(4,'DESCANSO'), "
            +"(5,'NO INFORMA'), "
            +"(6,'NO APLICA') "
        );
        tx.executeSql(
            "INSERT INTO atrayente values"
            +"(1,'PROTEINA HIDROLIZADA'),"
            +"(2,'TRIMEDLURE'),"
            +"(3,'METHYL EUGENOL') "
        );
        tx.executeSql(
            "INSERT INTO especie_cultivo values"
            +"(1,'PAPAYA'),"
            +"(2,'UCHUVA'),"
            +"(3,'MORA'), "
            +"(4,'MANGO'), "
            +"(5,'NARANJA'), "
            +"(6,'MANDARINA'), "
            +"(7,'LIMON'), "
            +"(8,'PITAYA'), "
            +"(9,'DURAZNO') "
        );
        tx.executeSql(
            "INSERT INTO localizacion values"
            +"(1,'ARBOL'),"
            +"(2,'POSTE'),"
            +"(3,'SIN INFORMACION') "
        );
        tx.executeSql(
            "INSERT INTO sitio_muestra values"
            +"(1,'SUELO'),"
            +"(2,'ARBOL'),"
            +"(3,'NO IDENTIFICADO'), "
            +"(4,'NO INFORMA') "
        );
        tx.executeSql(
            "INSERT INTO vigilancia values"
            +"(1,'EXPORTACION'),"
            +"(2,'NATIVAS Y CERATITIS'),"
            +"(3,'EXOTICAS') "   
        );
        tx.executeSql(
            "INSERT INTO tipo_trampa values"
            +"(1,'JACKSON'),"
            +"(2,'MCPHAIL')"
        );
		tx.executeSql(
    		"INSERT INTO region values"
			+"(1, 'ANDINA'),"
			+"(2,'CARIBE'),"
			+"(3,'PACIFICA'),"
			+"(4,'ORINOQUIA'),"
			+"(5,'AMAZONIA') "
		);
    });
     
}

function importar(rut_id){
    tecnicoImp(rut_id);
     trampaImp(rut_id);
     ubiImp(rut_id);
     capImp(rut_id);
     inspeccionImp(rut_id);
     alertasImp(rut_id);
     departamentoImp(rut_id);
     municipioImp(rut_id);
     arbolImp();
     esmImp();
     administradorImp(rut_id);
     rutaImp(rut_id);
     centroAcopioImp(rut_id);
     productorImp(rut_id);
     predioImp(rut_id);
     loteImp(rut_id);
     
     $("#cuerpo").html('<div style = "text-align: center; margin-top:20%; margin-bottom:20%"> <img src = "../img/mosca-anim.gif" width = "150px" height = "150px">'
        +' <br>'
        +'<div id="subtitulo" class="col-12">IMPORTANDO DATOS...</div>'
        +' </div>');
     setTimeout(function(){
        swal({
              title:'Operación Exitosa',
              text: 'Se han importado los datos Correctamente',
              type:'success',
              showCancelButton:false,
              confirmButtonColor: "#ac2925",
              confirmButtonText: "Aceptar",
              cancelButtonText: "Cancelar",
              cancelButtonColor: "#ac2925",
              closeOnConfirm: true,
              closeOnCancel: false
            },function(isConfirm){
                 window.location = '../tecnicoREST/TecnicoHome.html'
             }
            );
     },30000) 
} 
function exportar(){
 
 productorExp();
 predioExp();
 loteExp();
 trampaExp();
 $("#cuerpo").html('<div style = "text-align: center; margin-top:20%; margin-bottom:20%"> <img src = "../img/mosca-anim.gif" width = "150px" height = "150px">'
    +' <br>'
    +'<div id="subtitulo" class="col-12">EXPORTANDO DATOS...</div>'
    +' </div>');
 setTimeout(function(){
    swal({
          title:'Operación Exitosa',
          text: 'Se han exportado los datos Correctamente',
          type:'success',
          showCancelButton:false,
          confirmButtonColor: "#ac2925",
          confirmButtonText: "Aceptar",
          cancelButtonText: "Cancelar",
          cancelButtonColor: "#ac2925",
          closeOnConfirm: true,
          closeOnCancel: false
        },function(isConfirm){
             window.location = '../tecnicoREST/TecnicoHome.html'
         }
        );
 },30000)
}  
function confirmarImp(){
    swal({
    title:'Confirmación de Importación',
    text: '¿Está seguro que desea reemplazar los datos guardados?' ,
    type: 'warning',
    showCancelButton:true,
    confirmButtonColor: "#ac2925",
    confirmButtonText: "Aceptar",
    cancelButtonText: "Cancelar",
    cancelButtonColor: "#ac2925",
    closeOnConfirm: true,
    closeOnCancel: true
    },function(isConfirm){
      if (isConfirm) {
        importar(document.getElementById('rut_id').value);
      }else{
        return false;
      } 
    });  
}
function confirmarExp(){
    if(document.getElementById('rut_id').value != 'null'){
        swal({
        title:'Confirmación de Exportación',
        text: '¿Está seguro que desea enviar los datos guardados a la base de datos central?' ,
        type: 'warning',
        showCancelButton:true,
        confirmButtonColor: "#ac2925",
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
        cancelButtonColor: "#ac2925",
        closeOnConfirm: true,
        closeOnCancel: true
        },function(isConfirm){
          if (isConfirm) {
            exportar();
          }else{
            return false;
          } 
        }
        );
    }else{
        swal({
        title:'Falata un Dato',
        text: 'Seleccione una ruta' ,
        type: 'warning',
        showCancelButton:false,
        confirmButtonColor: "#ac2925",
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
        cancelButtonColor: "#ac2925",
        closeOnConfirm: true,
        closeOnCancel: true
        },function(isConfirm){
          if (isConfirm) {
          }
        }
        );
    }    
}
   

function sincVolver(){
    window.location = 'sinc.html';
}