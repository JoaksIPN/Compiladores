var automatas = [];
$(document).ready(function(){
	/*EventHandler para boton nuevo automata*/
	$("#btnCrearNuevo").on("click",function(car){
		var car = $("#inputSimbolo").val(); //obtenemos valor del input
		automatas.push(new AFN(car));//agregamos nuevo automata
		DibujarAFN(automatas[automatas.length-1]); //dibujamos automata
		$("#basicModal").modal("hide");//escondemos modal
		$("#inputSimbolo").val("");//reseteamos el valor del input
	});
	/*EventHandler para boton mostrar modal para union*/
	$("#btnUnion").on("click",function(){ //Agrega los automatas creados a las combobox
		for(var i=0;i<automatas.length;i++){
			$("#inputGroupSelect01").append("<option value='"+i+"'>Id: "+i+" alfabeto: "+automatas[i].alfabeto+"</option>");
			$("#inputGroupSelect02").append("<option value='"+i+"'>Id: "+i+" alfabeto: "+automatas[i].alfabeto+"</option>");
		}
	});
	/*Handler crear union del modal*/
	$("#btnUnirNuevo").on("click",function(car){
		var afn = $("#inputGroupSelect01").val();//index de primer afn
		var afn2 = $("#inputGroupSelect02").val();//index de segundo afn
		if(afn!=afn2){//si son diferentes index
			automatas[afn].Union(automatas[afn2]); //obtenemos nuevo automata	
			/*borramos automatas de la lista*/
			automatas.splice(afn2,1);
			//delete afn2;
			console.log(automatas);
			DibujarAFNs(automatas);//repintamos los nuevos automatas
			/*Quitamos opciones de ambos combobox*/
			$("#inputGroupSelect01").empty().append("<option value=''>1er AFN</option>");
			$("#inputGroupSelect02").empty().append("<option value=''>2do AFN</option>");
		}else
			alert("Selecciona dos automatas diferentes");
	});

});
