var contenido;//gramaticas guardadas en el archivo
var listaReglas; //lista de lista dodne estan las reglas
var contador = 0; //contador para el deceso recursivo
var indice = 0;//indice usado en el decenso recursivo
var VT = [];
var VN = [];
var lex;
var lexemas = [];
var tokens = [];
var lexemaActual;
$(document).ready(function(){
	if (window.File && window.FileReader && window.FileList && window.Blob) {
	  // Great success! All the File APIs are supported.
	} else {
	  alert('The File APIs are not fully supported in this browser.');
	}
	$("#inputGramatica").on("change",function(){
		var fr = new FileReader();
		fr.onload = function() {
			/*AQUI HACER USO DE LA GRAMATICA*/
			var tablaSimbolos; //simbolos del archivo en una tabla
			contenido = this.result;
			console.log(contenido);
			CreateGrammarList(contenido);
		}
		fr.readAsText(this.files[0]);
	});
});

function CreateGrammarList(file){
	listaReglas = new ListaDoble();
	contador = 0;
	indice = 0;
	VN = GetNoTerminales(file);
	console.log("Simbolos no terminales:");
	console.log(VN);
	VT = GetTerminales(file);
	console.log("Simbolos terminales:");
	console.log(VT);
	//obtenemos arreglo de gramatica sustituido por sus tokens
	var rows = [];
	rows = textoTabla.split('♫');
	for(var i=0;i<rows.length;i++)
		rows[i] = rows[i].split('&');
	console.log(rows);
	lex = EvaluarCadena(rows,file+"a");
	console.log("tokens de las gramaticas");
	console.log(lex);
	//inicia decenso recursivo para la creacion de las listas
	if(G(listaReglas)){
		var t = lex.shift();
		console.log("t: "+t);
		if(t == 30){//30 corresponde al token de $ que representa fin de cadena
			console.log(listaReglas);
			//return true;
		}
	}
	//return false;
}

/********************************/
/*funciones de decenso recursivo*/
/********************************/

function G(lista){
	console.log("G");
	if(!ListaReglas(lista)){
		console.log("regreso true");
		return true;
	}
	console.log("regreso false");
	return false;
}

function ListaReglas(lista){
	var l2 = new ListaDoble();
	console.log("lista reglas");
	var t;
	if(Regla(lista)){
		t = lex.shift();
		console.log("t: "+t);
		if(t==15){/*15 es el tocken del ;*/
			lexemaActual = contenido[indice];
			lexemas.push(lexemaActual);
			tokens.push(t);
			indice++;
			if(ListaReglasP(l2)){
				console.log("Lista 2: ");
				console.log(l2);
				console.log("Lista 1:");
				console.log(lista);
				lista.insertarAbajo(l2);
				console.log("nueva lista 1");
				console.log(lista);
				console.log("regreso true");
				return true;
			}
		}else{
			lex.unshift(t);
		}
	}
	console.log("regreso false");
	return false;
}

function ListaReglasP(lista){
	var l2 = new ListaDoble();
	console.log("ListaReglasP");
	var t;
	if(Regla(lista)){
		t = lex.shift();
		console.log("t: "+t);
		if(t == 15){/*15 es el tocken del punto y coma*/
			lexemaActual = contenido[indice];
			lexemas.push(lexemaActual);
			tokens.push(t);
			indice++;
			if(ListaReglasP(l2)){
				if(l2.nodoInicial != null){
					lista.insertarAbajo(l2);
				}
				console.log("regreso true");
				return true;
			}
		}else{
			lex.unshift(t);
		}
		console.log("regreso false t:"+t);
		return false;
	}
	lista = null;
	console.log("regreso true");
	return true;
}

function Regla(lista){
	var l2 = new ListaDoble();
	console.log("Regla");
	var t;
	if(LadoIzq(lista)){
		t = lex.shift();
		console.log("t: "+t);
		lexemaActual = contenido[indice];
		indice++;
		if(t == 10){//10 es el tocken para la flecha
			lexemas.push(lexemaActual);
			tokens.push(t);
			if(ListaLadosDer(l2)){
				if(l2.nodoInicial != null){
					lista.insertarAbajo(l2);
				}
				console.log("regreso true");
				return true;
			}
		}

	}
	console.log("regreso false");
	lex.unshift(t);
	return false;
}

function ListaLadosDer(lista){
	console.log("Lista lados derechos");
	var l2 = new ListaDoble();
	if(LadoDerecho(lista)){
		if(ListaLadosDerP(l2)){
			if(l2.nodoInicial != null){
				lista.insertarAbajo(l2);
			}
			console.log("regreso true");
			return true;
		}
	}
	console.log("regreso false");
	return false;
}

function ListaLadosDerP(lista){
	console.log("Lista lados der p");
	var l2 = new ListaDoble();
	var t;
	t = lex.shift();
	console.log("t: "+t);
	if(t == 20){//20 es el tocken para el OR |
		if(LadoDerecho(l2)){
			lexemaActual = contenido[indice];
			lexemas.push(lexemaActual);
			tokens.push(t);
			indice++;
			if(l2.nodoInicial!=null){
				lista.insertarAbajo(l2);
			}
			if(ListaLadosDerP(lista)){
				console.log("regreso true");
				return true;
			}
		}
		console.log("regreso false");
		lex.unshift(t);
		return false;
	}
	lex.unshift(t);
	console.log("regreso true");
	return true;
}

function LadoDerecho(lista){
	console.log("LadoDerecho");
	var t;
	var simbolos  = [];
	var l2 = new ListaDoble();
	var n;
	t = lex.shift();
	console.log("t: "+t);
	if(t == 5){
		lexemaActual = contenido[indice];
		indice++;
		if(VT.includes(""+lexemaActual)){
			n = new Nodo(""+lexemaActual);
			lexemas.push(lexemaActual);
			tokens.push(t);
			lista.nodoInicial = n;
			n.terminal = true;
		} else if(VN.includes(""+lexemaActual)){
			n = new Nodo(""+lexemaActual);
			lexemas.push(lexemaActual);
			tokens.push(t);
			lista.nodoInicial = n;
			n.terminal = false;
		}
		if(LadoDerechoP(l2)){
			if(l2.nodoInicial != null)
				lista.insertarArriba(l2);
			console.log("regreso true");
			return true;
		}
	} else if (t == 25){//25 es el token para epsilon(omega)
		lexemaActual = contenido[indice];
		lexemas.push(lexemaActual);
		tokens.push(t);
		indice++;
		if(LadoDerechoP(l2)){
			lista.insertarArriba(l2);
			console.log("regreso true");
			return true;
		}
	}
	console.log("regreso false");
	return false;
}

function LadoDerechoP(lista){
	var t;
	console.log("LadoDerechoP");
	var simbolos = [];
	var l2 = new ListaDoble();
	var n = new Nodo();
	t = lex.shift();
	console.log("t: "+t);
	if(t == 5){//5 es el token para los simbolos
		lexemaActual = contenido[indice];
		indice++;
		if(VT.includes(""+lexemaActual)){
			n = new Nodo(""+lexemaActual);
			tokens.push(t);
			lexemas.push(lexemaActual);
			l2.nodoInicial = n;
			n.terminal = true;
		}else if(VN.includes(""+lexemaActual)){
			n = new Nodo(""+lexemaActual);
			tokens.push(t);
			lexemas.push(lexemaActual);
			l2.nodoInicial = n;
			n.terminal = false;
		}
		if(LadoDerechoP(l2)){
			if(l2.nodoInicial != null){
				lista.insertarArriba(l2);
			}
			console.log("regreso true");
			return true;
		}
		console.log("regreso false");
		return false;
	}
	lex.unshift(t);
	console.log("regreso true");
	return true;
}

function LadoIzq(lista){
	var t;
	var n;
	console.log("LadoIzq");
	t = lex.shift();
	console.log("t: "+t);
	if(t == 5){//5 es el token para el simbolo
		lexemaActual = contenido[indice];
		lexemas.push(lexemaActual);
		tokens.push(t);
		n = new Nodo(""+lexemaActual);
		indice++;
		lista.nodoInicial = n;
		console.log("regreso true");
		return true;
	} else if(t == 25){//25 es el token para epsilon(omega)
		lexemaActual = contenido[indice];
		tokens.push(t);
		lex.unshift(t);
		console.log("regreso true");
		return true;
	}
	console.log("regreso false");
	return false;
}

////////////////////////////
/*FIN FUNCIONES RECURSIVAS*/
////////////////////////////


function GetTerminales(file){
	if(VN.length<=0){
		alert("Calcular no terminales primero");
		return null;
	}else{
		//hacemos un array de reglas separadas por ;
		var reglas  = file.split(';');
		var aux;//substring despues de la flecha
		var index;//posicion donde termina la flecha
		for(var i =0;i<reglas.length;i++){
			for(var j =0;j<reglas[i].length;j++){
				//buscamos el final del simbolo flecha
				if(reglas[i][j] == '-' && reglas[i][j+1] == '>'){
					aux = reglas[i].substring(j+2,reglas[i].length);
					//remplamzamos los no terminlaes por una coma
					for(var k=0;k<VN.length;k++){
						aux = aux.replace(VN[k],",");
					}
					//cada caracter que no sean las comas ni el | sera un terminal
					//si existe un caso especial "num" ese subscring sera un terminal
					//primero buscamos el num
					var loc = aux.indexOf("num")
					if(loc>=0){
						//si lo encuentra lo quitamos de aux y agreamosa  VT
						VT.push("num");
						aux.replace("num","");
					}
					//agregaremos todos los simbolos que no sean , ni | ni $

					for(var k = 0;k<aux.length;k++){
						if(aux[k] !=',' && aux[k] != '|' && aux[k] != '$'){
							if(!isIn(aux[k],VT)){//si aun no se agrega agegarlo
								VT.push(aux[k]);
							}
						}
					}
					
				}
			}	

		}
	}
	return VT;
}

function GetNoTerminales(file){
	//hacemos un array de reglas separadas por ;
	var reglas  = file.split(';');
	var aux;
	for(var i =0;i<reglas.length;i++){
		/*para cada regla sus no terminales seras los
		que estan antes de la flecha*/
		for(var j = 0;j<reglas[i].length;j++){
			if(reglas[i][j] == '-' && reglas[i][j+1] == '>'){
				aux = reglas[i].substring(0,j);
				//si el simbolo aux ya esta en VN entonces no lo agregamos
				if(!isIn(aux,VN))
					VN.push(aux);
				continue;
			}
		}
	}
	return VN;
}

function isIn(simbol,lista){
	for(var i = 0;i<lista.length;i++){
		if(simbol == lista[i])
			return true;
	}
	return false;
}

function EvaluarCadena(tablaEstados,cadena){
		
		var current_state=1;
		var last_accepting_state=-1;
		var token = 0;
		var simbolo_index= -1;
		var token_place = tablaEstados[1].length-1;
		var last_cadena=-1;
		var lex = [];
		if (cadena.length==0)
			return 0;
		while (token < cadena.length) {

			for (var i = 0; i < tablaEstados[0].length; i++) {
				if (tablaEstados[0][i].length>1) {
					var n	= tablaEstados[0][i].split("-");
					//console.log(n);
					if (n[0]<=cadena[token] && cadena[token]<=n[1]) {
						simbolo_index = i;
						break;
					}
				}
				else{
				if (tablaEstados[0][i]==cadena[token])
					simbolo_index = i;
				}
			}
			//ver si hay transicion con el estado actual y el token actual

			if (tablaEstados[current_state][simbolo_index]!=-1) {
				current_state = tablaEstados[current_state][simbolo_index];
				token = token + 1;
				if (tablaEstados[current_state][token_place]!=-1) {
					last_accepting_state = current_state;
					last_cadena = token;
				}
			}
			else {
				if (last_accepting_state == -1) {
					current_state = 0;
					break;
				}
				else {
					token = last_cadena;
					console.log(tablaEstados[last_accepting_state][token_place]);
					lex.push(tablaEstados[last_accepting_state][token_place]);
					current_state = 1;
				}
			}
		}
		return lex;
	}

