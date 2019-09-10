var automatas = []; //array de automatas creados
var claseBoton; //variable que contiene el nombre de la clase agreada al boton del modal
$(document).ready(function(){

	/*Funciones que se mandan a llamar cuando se da click a una operacion AFN
	*Descripcion: en el html hay una plantilla de modal con el id templateModal, con 
	*con las siguientes funciones se modificara el contenido de la plantilla dependiendp
	*de la operacion solicitada*/

	/*Al dar click en nuevo AFN*/
	$("#btnNuevo").on("click",function(){ //Agrega los automatas creados a las combobox
		/*codigo html que se mostrara como cuerpo del modal*/
		var contenido = "<div class='custom-control custom-radio custom-control-inline'>"
			+"<input type='radio' id='inputRadio1' name='inputRadio' class='custom-control-input'><label class='custom-control-label' "
			+"for='inputRadio1'>Un simbolo</label></div><div class='custom-control custom-radio custom-control-inline'>"
			+"<input type='radio' id='inputRadio2' name='inputRadio' class='custom-control-input'><label class='custom-control-label' "
			+"for='inputRadio2'>Conjunto de simbolos</label></div>"
			+"<div class='input-group mt-3'><div class='input-group-prepend'>"
			+"<span class='input-group-text'>Valor minimo:</span></div>"
			+"<input type='text' class='form-control' id='inputValorMin'><div class='input-group-prepend'>"
			+"<span class='input-group-text'>Valor maximo:</span></div>"
			+"<input type='text' class='form-control' id='inputValorMax'></div>";
		claseBoton = "nuevoAFN";
		generarModal("Crear nuevo AFN",contenido,"Crear");//funcion para generar modal
		$("#templateModal").modal("show");//mostramos modal
	});

	/*Al dar click en union*/
	$("#btnUnion").on("click",function(){ 
		//codigo html que se mostrara como cuerpo en el modal
		var contenido = "<div class='form-group'><div class='input-group mb-3'>"+
            "<div class='input-group-prepend'><label class='input-group-text' "
            +"for='inputGroupSelect01'>Automatas</label></div>"
            +"<select class='custom-select' id='inputGroupSelect01'><option selected>"
            +"1er AFN</option></select><select class='custom-select' id='inputGroupSelect02'>"
            +"<option selected>2do AFN</option></select></div></div>";
        claseBoton = "unirAFN";
        generarModal("Unir dos AFN",contenido,"Unir");
        $("#btnUnirTodo").fadeIn();
        $("#templateModal").modal("show");//mostramos modal
        //Agrega los automatas creados a los combobox
		for(var i=0;i<automatas.length;i++){
			$("#inputGroupSelect01").append("<option value='"+i+"'>Id: "+i+" alfabeto: "+automatas[i].alfabeto+"</option>");
			$("#inputGroupSelect02").append("<option value='"+i+"'>Id: "+i+" alfabeto: "+automatas[i].alfabeto+"</option>");
		}
	});

	//Al dar click a unir todo
	$("#btnUnirTodo").on("click",function(){
		console.log("entro");
		var nuevo = UnirTodo(automatas);
		automatas = [];
		automatas.push(nuevo);
		DibujarAFNs(automatas);
		$("#btnUnirTodo").fadeOut();
		$("#templateModal").modal("hide");//escondemos modal
		$("#btnSubmit").removeClass("unirAFN");

	});

	/*Al dar click en concatenar*/
	$("#btnConcatenar").on("click",function(){
		var contenido = "<div class='form-group'><div class='input-group mb-3'>"+
            "<div class='input-group-prepend'><label class='input-group-text' "
            +"for='inputGroupSelect01'>Automatas</label></div>"
            +"<select class='custom-select' id='inputGroupSelect01'><option selected>"
            +"1er AFN</option></select><select class='custom-select' id='inputGroupSelect02'>"
            +"<option selected>2do AFN</option></select></div></div>";
        claseBoton = "concatenarAFN";
        generarModal("Concatenar dos AFN",contenido,"Concatenar");
        $("#templateModal").modal("show");//mostramos modal
        //Agrega los automatas creados a los combobox
		for(var i=0;i<automatas.length;i++){
			$("#inputGroupSelect01").append("<option value='"+i+"'>Id: "+i+" alfabeto: "+automatas[i].alfabeto+"</option>");
			$("#inputGroupSelect02").append("<option value='"+i+"'>Id: "+i+" alfabeto: "+automatas[i].alfabeto+"</option>");
		}
	});
	/*Al dar click en cerradura positiva*/
	$("#btnCerraduraPositiva").on("click",function(){
		var contenido = "<div class='form-group'><div class='input-group mb-3'>"+
            "<div class='input-group-prepend'><label class='input-group-text' "
            +"for='inputGroupSelect01'>Automatas</label></div>"
            +"<select class='custom-select' id='inputGroupSelect01'><option selected>"
            +"1er AFN</option></select></div></div>";
        claseBoton = "positivaAFN";
        generarModal("Crear cerradura positiva",contenido,"Crear");
        $("#templateModal").modal("show");
        for(var i=0;i<automatas.length;i++){
			$("#inputGroupSelect01").append("<option value='"+i+"'>Id: "+i+" alfabeto: "+automatas[i].alfabeto+"</option>");
			$("#inputGroupSelect02").append("<option value='"+i+"'>Id: "+i+" alfabeto: "+automatas[i].alfabeto+"</option>");
		}
	});
	/*Al dar click en cerradura de kleene*/
	$("#btnCerraduraKleene").on("click",function(){
		var contenido = "<div class='form-group'><div class='input-group mb-3'>"+
            "<div class='input-group-prepend'><label class='input-group-text' "
            +"for='inputGroupSelect01'>Automatas</label></div>"
            +"<select class='custom-select' id='inputGroupSelect01'><option selected>"
            +"1er AFN</option></select></div></div>";
        claseBoton = "kleeneAFN";
        generarModal("Crear cerradura de kleene",contenido,"Crear");
        $("#templateModal").modal("show");
        for(var i=0;i<automatas.length;i++){
			$("#inputGroupSelect01").append("<option value='"+i+"'>Id: "+i+" alfabeto: "+automatas[i].alfabeto+"</option>");
			$("#inputGroupSelect02").append("<option value='"+i+"'>Id: "+i+" alfabeto: "+automatas[i].alfabeto+"</option>");
		}
	});
	/*Al dar click en generar AFD*/
	$("#btnAFD").on("click",function(){
		console.log(automatas[0]);
		var afd = new AFD('d');
		var tabla = afd.convertir_AFD(automatas[0]);
		console.log(tabla);
	});

	/******************FIN FUNCIONES OPERACIONES AFN*************************/

	/**********Funciones para generar AFNs ********************************/
	/*Descripcion: al generarse el modal el boton de modal tiene agregada una clase 
	**Ej. si se clickeo en nuevo AFN el boton del modal tendra una clase nuevoAFN
	**Dependiendo de la clase agregada es la funcion se que ejecutara 
	*/

	$("#btnSubmit").on("click",function(){
		//al dar click en el boton se determinara cual es la clase que tiene y sabiendo esto
		//se ejecutaran las instrucciones correspondientes
		if($("#btnSubmit").hasClass("nuevoAFN")){//crea nuevo afn
			var min = $("#inputValorMin").val(); //obtenemos valor min del input
			var max = $("#inputValorMax").val();
			if(min==max){ //en caso de que se registre un solo simbolo
				automatas.push(new AFN(min));//se genera con alfabeto de un simbolo
			} else {
				automatas.push(new AFN(min+"-"+max));//se genera con alfabeto de un rango
			}
			DibujarAFN(automatas[automatas.length-1]); //dibujamos automata
			$("#templateModal").modal("hide");//escondemos modal
			$("#inputSimbolo").val("");//reseteamos el valor del input
			//quitamos clase
			$("#btnSubmit").removeClass("nuevoAFN");
		} else if($("#btnSubmit").hasClass("unirAFN")){ //unir afn
			var afn = $("#inputGroupSelect01").val();//index de primer afn
			var afn2 = $("#inputGroupSelect02").val();//index de segundo afn
			if(afn!=afn2){//si son diferentes index
				automatas[afn].Union(automatas[afn2]); //obtenemos nuevo automata	
				/*borramos automatas de la lista*/
				automatas.splice(afn2,1);
				console.log(automatas);
				DibujarAFNs(automatas);//repintamos los nuevos automatas
				/*Quitamos opciones de ambos combobox*/
				$("#inputGroupSelect01").empty().append("<option value=''>1er AFN</option>");
				$("#inputGroupSelect02").empty().append("<option value=''>2do AFN</option>");
				$("#templateModal").modal("hide");//escondemos modal
				$("#btnSubmit").removeClass("unirAFN");
				$("#btnUnirTodo").fadeOut();
			}else
				alert("Selecciona dos automatas diferentes");
		} else if($("#btnSubmit").hasClass("concatenarAFN")){//concatenar afn
			var afn = $("#inputGroupSelect01").val();//index de primer afn
			var afn2 = $("#inputGroupSelect02").val();//index de segundo afn
			if(afn!=afn2){//si son diferentes index
				automatas[afn].Concatenar(automatas[afn2]); //obtenemos nuevo automata	
				/*borramos automatas de la lista*/
				automatas.splice(afn2,1);
				console.log(automatas);
				DibujarAFNs(automatas);//repintamos los nuevos automatas
				/*Quitamos opciones de ambos combobox*/
				$("#inputGroupSelect01").empty().append("<option value=''>1er AFN</option>");
				$("#inputGroupSelect02").empty().append("<option value=''>2do AFN</option>");
				$("#templateModal").modal("hide");//escondemos modal
				$("#btnSubmit").removeClass("concatenarAFN");
			}else
				alert("Selecciona dos automatas diferentes");	
		} else if($("#btnSubmit").hasClass("positivaAFN")){
			var afn = $("#inputGroupSelect01").val();//id del afn seleccionado
			automatas[afn].CerraduraPositiva();//se genera cerradura al afn
			console.log(automatas);
			/*Repintamos todos los automatas*/
			DibujarAFNs(automatas);
			/*Quitamos opciones del combobox*/
			$("#inputGroupSelect01").empty().append("<option value=''>1er AFN</option>");$("#inputGroupSelect02").empty().append("<option value=''>2do AFN</option>");
			$("#templateModal").modal("hide");//escondemos modal
			$("#btnSubmit").removeClass("positivaAFN");
		} else if($("#btnSubmit").hasClass("kleeneAFN")){
			var afn = $("#inputGroupSelect01").val();//id del afn seleccionado
			automatas[afn].C_Estrella();//se genera cerradura al afn
			console.log(automatas);
			/*Repintamos todos los automatas*/
			DibujarAFNs(automatas);
			/*Quitamos opciones del combobox*/
			$("#inputGroupSelect01").empty().append("<option value=''>1er AFN</option>");$("#inputGroupSelect02").empty().append("<option value=''>2do AFN</option>");
			$("#templateModal").modal("hide");//escondemos modal
			$("#btnSubmit").removeClass("kleeneAFN");
		}
	});
	/******FIN CONTROL DE BOTON DEL MODAL********************/
	/*Handler limpiar canvas*/
	$("#btnBorrar").on("click",function(){
		LimpiarContenedor();
		automatas = [];
		numEstados = 0;
		numAFN = 0;
		numTransiciones = 0;
	});

	/*Handler cuando se da click al boton de cerrar modal*/
	$("#cerrarModal").on("click",function(){
		//se debe quitar la clase agregada al btnSubmit para evitar bugs
		$("#btnSubmit").removeClass(claseBoton);
		$("#btnUnirTodo").fadeOut();
	});
});


/*Constructor de modals
**claseBoton: clase que sea agrega al boton que sirve para identificar la operacion solicitada
**titulo: texto que sera el titulo del modal
**contenido: codigo html que se mostrara en el cuerpo del modal
**textoBoton: texto del boton aceptar
*/
function generarModal(titulo,contenido,textoBoton){
	$("#templateModal h5#templateModalLabel").text(titulo);
	$("#templateModal div.modal-body").html(contenido);
	$("#templateModal button#btnSubmit").text(textoBoton);
	$("#templateModal button#btnSubmit").addClass(claseBoton);
}