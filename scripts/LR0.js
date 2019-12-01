var tablaR0 = [];
var historialCerraduras;
var countConjuntos;
var dicReglas;
$(document).ready(function(){
	$("#btnLR0").on("click",function(){
		console.log("Generando tabla LR0");
		tablaR0 = LR0(listaReglas);
	});
	$("#btnEvaluarLR0").on("click",function(){
		console.log("Evaluando expresion con LR0");
		var exp = $("#inputExpresionLR0").val();
		EvaluarLR(tablaR0,exp,"tablaEvaluarLR0","ResultadoLR0");
	});
	$("#cerrarModalLR0").on("click",function(){
		$("#tablaLR0 thead").empty();
		$("#tablaLR0 tbody").empty();
		$("#tablaEvaluarLR0 tbody").empty();
	});
});

/*Funcion para evaluar una expresion con la tabla LR0*/
function EvaluarLR(tabla,cadena,nombreTabla,nombreResultado){
	$("#"+nombreTabla+" tbody").empty();
	$("#"+nombreResultado).empty();
	$("#"+nombreResultado).empty();
	var cad = [];//cadena transformada en array
	var accion;//accion a reaizar
	var pila = [];//pila de instrucciones
	var topPila;
	var topCad;
	console.log(tabla);
	//llenamos el array cad
	for(let i=0;i<cadena.length;i++)
		cad.push(cadena[i]);
	//agreamos el simbolo e $
	cad.push("$");
	pila.push("0");
	console.log("Iniciamos analizador");
	while(accion!="A" && accion!="-"){
		topPila = pila.pop();
		pila.push(topPila);
		topCad = cad.shift();
		cad.unshift(topCad);
		accion = tabla[topPila][ObtenerColumnaTablaLR0(topCad)];
		console.log("|"+topPila+"|"+topCad+"|"+accion+"|");
		dibujarFila(pila,cad,accion,nombreTabla);
		if(accion[0]=='d'){
			console.log("Desplazamiento detectado");
			pila.push(topCad);
			pila.push(accion.substring(1));
			console.log(pila);
			cad.shift();
			console.log(cad);
		}else if(accion[0]=='r'){
			console.log("Rediccion detectada");
			console.log(pila);
			var numReduccion = accion.substring(1);
			var numPops;
			var reduccion = dicReglas[numReduccion];
			//verificamos si la reduccion no es un epsilon
			if(reduccion.substring(1)!="Ω"){
				//deducimos la cantidad de pops que vamos a hacer
				numPops = (reduccion.length-1)*2;
				console.log("Hacemos pop "+numPops+" veces");
				//realizamos los pops
				for(let i=0;i<numPops;i++){
					console.log("pop "+i+": "+pila.pop());
					console.log(pila);
				}
			}else{
				console.log("La regla de reduccion es epsilon por lo tanto no se cambia nada");
			}
			//guardamos el valor actual del pop para usarlo despues
			topPila = pila.pop();
			pila.push(topPila);
			console.log("Valor en el tope: "+topPila);
			//hacemos push con el no terminal de la regla
			console.log("insertamos a la pila: "+reduccion[0]);
			pila.push(""+reduccion[0]);
			console.log(pila);
			//despues ponemos el contenido de la tabla[topPila][no terminal]
			var aux = tabla[topPila][ObtenerColumnaTablaLR0(reduccion[0])];
			console.log("Insertamos a la pila desde la tabla: "+aux);
			pila.push(aux);
			console.log(pila);
		}else{
					}
	}
	if(accion=="A"){
		console.log("CADENA ACEPTADA");
		$("#"+nombreResultado).append("<div class='alert alert-success' role='alert'>CADENA ACEPTADA</div>");
	}else{
		console.log("ERROR EN LA CADENA");
		$("#"+nombreResultado).append("<div class='alert alert-danger' role='alert'>CADENA NO ACEPTADA</div>");
	}

}

function LR0(reglas){
	///////////////////////////////////////////////////////////////////////
	//se agrega la regla aumentada Q -> ladoizq(primera regla)/////////////
	var reglaA = new ListaDoble();//reglas aumentadas
	var reglaaux = new ListaDoble();
	var n = new Nodo("Q");
	SetNodoInicial(reglaA,n);
	var n2 = new Nodo(""+reglas.nodoInicial.simbolo);
	var aux;
	var index;//unbiacion del punto
	var arrayItems;//array de items que tengan el mismo simbolo despues del punto
	n2.terminal = false;
	SetNodoInicial(reglaaux,n2);
	reglaA.insertarDerecho(reglaaux);
	reglaA.insertarAbajo(reglas);
	reglaA.ImprimirLista();
	/*Termina creacion de regla aumentada*/
	//diccionario de reglas que  utlizaremos para la generacion de la tabla
	dicReglas = CreateDictionary(reglaA);
	historialCerraduras = [];
	//////////////////////////////////////////////////
	//comenzamos con la cerradura de la primer regla//
	//////////////////////////////////////////////////
	var conjuntos = [];
	var simbolosAnalizados =[];//controla que no se analice mas de una vez un simbolo por cada uno de los Si
	countConjuntos = 1;
	//obtenemos S0
	var item = ConvertirAItem(reglaA.nodoInicial);
	historialCerraduras.push(item);
	conjuntos.push(Cerradura(item,reglaA));
	var row;//fila de la tabla
	var alfa;//alfa a la que se le hace la operacion IrA
	var simbIndex;//index de la cerradura que ya fue calcualda
	var itemSeparados;//items separados por simbolos despues del punto
	var itemsMover; //operacion mover hecha a items separados
	//recorre todos los conjuntos
	for(var i=0;i<conjuntos.length;i++){
		console.log("Analizando conjunto: "+i);
		ImprimirArreglo(conjuntos[i]);
		var tamrow = VT.length+VN.length+1;
		row = new Array(tamrow);
		//inicializamos row con puros -
		for(var k = 0;k<row.length;k++)
			row[k] = "-";
		tablaR0.push(row);
		console.log("tablaR0 tam: "+tablaR0.length);
		ImprimirTabla(tablaR0);
		//separamos los items del conjunto conforme su simbolo despues del punto
		var conjuntoAux =[];//copia del conjunto que se esta analizando actualmente
		for(let j=0;j<conjuntos[i].length;j++)
			conjuntoAux.push(conjuntos[i][j]);
		itemSeparados = [];
		var conaux = [];
		console.log("conjuntoAux");
		ImprimirArreglo(conjuntoAux);
		//separamos los items conforme a sus simbolos despues del punto
		while(conjuntoAux.length>0){
			//obtenemos el alfa
			alfa = conjuntoAux[0][conjuntoAux[0].indexOf('.')+1];
			//console.log("alfa: "+alfa);
			conaux = [];
			for(let x=0;x<conjuntoAux.length;x++){
				if(alfa==conjuntoAux[x][conjuntoAux[x].indexOf('.')+1]){
					//console.log("alfa encontrado con: "+conjuntoAux[x]);
					conaux.push(conjuntoAux[x]);
					conjuntoAux.shift(x,1);
					//console.log("conaux");
					//ImprimirArreglo(conaux);
					//console.log("conjuntoAux");
					//ImprimirArreglo(conjuntoAux);
					x = -1;
				}
			}
			//console.log("agregando conaux");
			//ImprimirArreglo(conaux);
			itemSeparados.push(conaux);
		}//terminamos de separarlos
		console.log("items separados");
		console.log(itemSeparados);
		//recorre cada uno de los elementos de los items separados
		for(var j=0;j<itemSeparados.length;j++){
			//console.log(conjuntos[i]);
			console.log("Analizando reglas: ");
			console.log(itemSeparados[j]);
			alfa = itemSeparados[j][0][itemSeparados[j][0].indexOf('.')+1];
			console.log("Con alfa: "+alfa);

			//si alfa es Ω entonces aplicamos la funcion mover
			if(alfa=="Ω"){
				console.log("alfa es epsilon");
				console.log("Agregando...");
				aux = Mover(itemSeparados[j][0]);
				console.log(aux);
				itemSeparados[j][0] = aux;
				console.log("Resultado");
				ImprimirArreglo(itemSeparados[j]);
				conjuntos[i][j] = itemSeparados[j][0];
				alfa = itemSeparados[j][0][itemSeparados[j][0].indexOf('.')+1];
				console.log("Nueva alfa: "+alfa);
			}
			itemsMover = [];
			for(let x=0;x<itemSeparados[j].length;x++)
				itemsMover.push(Mover(itemSeparados[j][x]));
			//checamos si ya se hizo la cerradura anteriormente
			simbIndex = BuscarEnHistorial(itemsMover);
			console.log("simbIndex: "+simbIndex);
			if(simbIndex<0){
				console.log("Nueva cerradura");
				//si alfa es undefined entonces no se calcula su IrA
				if(alfa!=undefined){
					console.log("Calculando IrA de");
					console.log(itemSeparados[j]);
					aux = IrAConjunto(itemSeparados[j],reglaA);
					console.log("Nuevo conjunto");
					ImprimirArreglo(aux);
					conjuntos.push(aux);
					//llenando la tabla
					if(VN.includes(alfa)){
						tablaR0[i][ObtenerColumnaTablaLR0(alfa)] = countConjuntos;
						console.log("tablaR0["+i+"]["+ObtenerColumnaTablaLR0(alfa)+"] = "+countConjuntos);
					}else{
						tablaR0[i][ObtenerColumnaTablaLR0(alfa)] = "d"+countConjuntos;
						console.log("tablaR0["+i+"]["+ObtenerColumnaTablaLR0(alfa)+"] = d"+countConjuntos);
					}
					countConjuntos++;
					console.log("Agregando cerradura a historial");
					//se tienen que agregar pero ya con la operacion mover realizada en ellos
					for(let y=0;y<itemSeparados[j].length;y++)
						if(Mover(itemSeparados[j][y])!=-1)
							itemSeparados[j][y] = Mover(itemSeparados[j][y]);
					historialCerraduras.push(itemSeparados[j]);
					for(let y=0;y<historialCerraduras.length;y++){
						ImprimirArreglo(historialCerraduras[y]);
					}
				}else{
					console.log("no hay IrA por punto al final de item");
				}
			}else{
				console.log("cerradura ya calculada");
				console.log("Llenando tabla con cerradura ya calculada");
				//llenando la tabla
				if(VN.includes(alfa)){
					tablaR0[i][ObtenerColumnaTablaLR0(alfa)] = simbIndex;
					console.log("tablaR0["+i+"]["+ObtenerColumnaTablaLR0(alfa)+"] = "+simbIndex);
				}else{
					tablaR0[i][ObtenerColumnaTablaLR0(alfa)] = "d"+simbIndex;
					console.log("tablaR0["+i+"]["+ObtenerColumnaTablaLR0(alfa)+"] = d"+simbIndex);
				}
			}
			/////////////////////////////////////////////////
			//Etapa de agregacion de reducciones a la tabla//
			/////////////////////////////////////////////////
			let numRegla;//numero de regla asociada al item con punto al final
			let simbTabla;//lista de simbolos obtenidos por el follow al lado izq de la regla asociada
			let itemFinal = -1;//item con el punto al final
			//buscamos si en el nuevo conjunto hay un punto hasta el final
			for(let x=0;x<conjuntos[i].length;x++){
				index = conjuntos[i][j].indexOf('.');
				if(index == conjuntos[i][j].length-1){
					itemFinal = conjuntos[i][j];
					break;
				}
			}
			console.log("item con punto al final: "+itemFinal);
			if(itemFinal!=-1){
				console.log("calculando reducciones");
				numRegla = FindNumRegla(dicReglas,itemFinal);
				if(numRegla==0){
					tablaR0[i][ObtenerColumnaTablaLR0("$")] = "A";
					console.log("tablaR0["+i+"]["+ObtenerColumnaTablaLR0("$")+"] = A");
				}else{
					simbTabla = Follow(dicReglas[numRegla][0],reglas);
					console.log("Follow "+dicReglas[numRegla][0]);
					console.log(simbTabla);
					for(let x=0;x<simbTabla.length;x++){
						tablaR0[i][ObtenerColumnaTablaLR0(simbTabla[x])] = "r"+numRegla;
						console.log("tablaR0["+i+"]["+ObtenerColumnaTablaLR0(simbTabla[x])+"] = r"+numRegla);
					}
				}
			}
		}
	}
	console.log("conjuntos");
	console.log(conjuntos);
	MostrarTablaLR(tablaR0,"tablaLR0");
	$("#modalTablaLR0").modal("show");
	return tablaR0;
}

function IrAConjunto(Ss,reglas){
	let respuesta = [];
	let index;
	let alfa;
	//se calculan las cerraduras de cada uno de los items
	for(let i=0;i<Ss.length;i++){
		alfa = Ss[i][Ss[i].indexOf('.')+1];
		console.log("IrA("+alfa+")");
		aux = IrA(Ss[i],reglas);
		console.log("Resultado IrA");
		ImprimirArreglo(aux);
		if(aux==-1){
			console.log("Error en el IrA");
		}else{
			console.log("Array respuesta:");
			ImprimirArreglo(respuesta);
			respuesta = Union(respuesta,aux);
			console.log("Union:");
			ImprimirArreglo(respuesta);
		}
	}

	return respuesta;
}

function IrA(S,reglas){
	console.log("IrA");
	console.log("Analizando: "+S);
	let index;
	item = Mover(S);
	console.log("Item: "+item);
	//si es -1 significa que el punto esta hasta el final y no se busca cerradura
	if(item!=-1){
			return Cerradura(item,reglas);
	}

	return -1;
}

function ImprimirTabla(tabla){
	let tam;
	//primero imprimimos los encabezados
	let row = " ";
	for(let i=0;i<VT.length;i++)
		row += VT[i];
	row += "$";
	for(let i=0;i<VN.length;i++)
		row += VN[i];
	console.log(row);
	for(let i=0;i<tabla.length;i++){
		row = i+":";
		tam = tabla[i].length
		for(let j=0;j<tam;j++){
			row += tabla[i][j];
		}
		console.log(row);
	}
}

function MostrarTablaLR(tabla,nombreTabla){
	//generamos xcabezeras;
	var thead = $("#"+nombreTabla+" thead");
	var tbody = $("#"+nombreTabla+" tbody");
	thead.append("<tr>");
	thead.append("<th></th>");
	for(let i=0;i<VT.length;i++)
		thead.append("<th style='font-size: 15px; padding: 0px;' scope='col'>"+VT[i]+"</th>");
	thead.append("<th style='font-size: 15px; padding: 0px;' scope='col'>$</th>");
	for(let i=0;i<VN.length;i++)
		thead.append("<th style='font-size: 15px; padding: 0px;' scope='col'>"+VN[i]+"</th>")
	//llenamos la tabla
	for(var i=0;i<tabla.length;i++){
		tbody.append("<tr>");
		tbody.append("<td style='font-size: 15px; padding: 0px;'>"+i+"</td>");
		for(var j=0;j<tabla[i].length;j++){
			tbody.append("<td style='font-size: 15px; padding: 0px;'>"+tabla[i][j]+"</td>");
		}
		tbody.append("</tr>");
	}
}

function FindNumRegla(diccionario,item){
	item = item.replace(".","");
	item = item.replace(">","");
	return diccionario.indexOf(item);
}

function CreateDictionary(reglas){
		let diccionario = [];
		let nodo = reglas.nodoInicial;
		let nodo2,nodo3,nodo4;
		let regla;
		while(nodo!=null){
			regla = ""+nodo.simbolo;
			nodo2 = nodo;
			while(nodo2.nodoDer!=null){
				nodo2 = nodo2.nodoDer;
				if(nodo2.nodoDown!=null)
					nodo3 = nodo2.nodoDown;
				regla += ""+nodo2.simbolo;
			}
			diccionario.push(regla);
			
			while(nodo3!=null){
				regla = ""+nodo.simbolo;
				regla +=  ""+nodo3.simbolo;
				nodo4 = nodo3;
				while(nodo4.nodoDer!=null){
					nodo4 = nodo4.nodoDer;
					regla+= ""+nodo4.simbolo;
				}
				diccionario.push(regla);
				nodo3 = nodo3.nodoDown;
			}
			nodo = nodo.nodoDown;
		}

		return diccionario;
	}

function ObtenerColumnaTablaLR0(alfa){
	var index = VT.indexOf(alfa);
	if(alfa == "$"){
		return VT.length;
	}else if(index>=0){
		return index;
	}else{
		index = VN.indexOf(alfa);
		if(index>=0){
			return VT.length+index+1;
		}
	}
}

function Cerradura(item,reglas){
	var res = [];
	res.push(item);
	var index;
	var simbol;
	//console.log(res);
	for(var i=0;i<res.length;i++){
		index = res[i].indexOf('.');
		if(index+1<res[i].length){
			simbol = res[i][index+1];

			if(VN.includes(simbol)){
				//console.log("simbolo: "+simbol);
				res = Union(res,CrearItems(simbol,reglas));
			}
			//console.log(simbol+" es terminal");
		}
	}
	return res;
}


function CrearItems(simboloIzq,reglas){
	var items = [];
	var item;
	var nodo = reglas.nodoInicial;
	var nodo2,nodoaux;
	var i=0;
	while(nodo!=null){
		if(nodo.simbolo==simboloIzq){
			item = simboloIzq+">.";
			nodo2 = nodo.nodoDer;
			while(nodo2!=null){
				item +=nodo2.simbolo;
				if(nodo2.nodoDown!=null){
					nodoaux = nodo2.nodoDown;
				}
				if(nodo2.nodoDer!=null){
					nodo2 = nodo2.nodoDer;
				}else{
					items.push(item);
					item = simboloIzq+">.";
					nodo2 = nodoaux;
					nodoaux = null;
				}
			}
			//console.log("items creados: ");
			//console.log(items);
			return items;
		}
		nodo = nodo.nodoDown;
	}
}

function ConvertirAItem(nodo){
	//console.log(nodo);
	var item=""+nodo.simbolo+">.";
	while(nodo.nodoDer!=null){
		nodo = nodo.nodoDer;
		item += nodo.simbolo;

	}
	return item;
}

function Mover(regla){
	var index = regla.indexOf('.');//posicion del punto
	var newregla = regla.substring(0,index);
	if(index>=0){
		if(index==regla.length-1){
			return -1;
		}else{
			newregla += regla[index+1]+regla[index];
			if(index+1<regla.length-1)
				newregla += regla.substring(index+2);
		}
	}else{
		alert("Mover: punto no encontrado: "+regla);
	}
	return newregla;
}
/*Buscar en historial checa su algun array dentro del historial es la cerradura solcitada y devuelve la posicion del arreglo*/
function BuscarEnHistorial(cerradura){
	console.log("Buscando: ");
	ImprimirArreglo(cerradura);
	console.log("En historial: ");
	for(let i=0;i<historialCerraduras.length;i++){
		ImprimirArreglo(historialCerraduras[i]);
	}

	for(let i=0;i<historialCerraduras.length;i++){
		if(CompararArreglo(historialCerraduras[i],cerradura)){
			console.log("cerradura encontrada en: "+i);
			return i;
		}
	}
	console.log("Cerradura no encontrada regresando -1");
	return -1;
}

function CompararArreglo(a,b){
	let flag;
	if(a.length!=b.length)
		return false;
	for(let i=0;i<a.length;i++){
		flag = false;
		for(let j=0;j<b.length && !flag;j++){
			if(a[i]==b[j]){
				flag = true;
			}
		}
		if(flag==false){
			return false;
		}
	}

	return true;
}

function ImprimirArreglo(array){
	let row="";
	for(let i=0;i<array.length;i++){
		row = row.concat(array[i]+",");
	}
	console.log(row);
}

function dibujarFila(pila,cadena,accion,nombreTabla){
	var tbody = $("#"+nombreTabla+" tbody");
	tbody.append("<tr>");
	var aux = "";
	for(let i=0;i<pila.length;i++)
		aux += pila[i]+",";
	tbody.append("<td style='font-size: 15px; padding: 0px;'>"+aux+"</td>");
	var aux = "";
	for(let i=0;i<cadena.length;i++)
		aux += cadena[i]+",";
	tbody.append("<td style='font-size: 15px; padding: 0px;'>"+aux+"</td>");
	tbody.append("<td style='font-size: 15px; padding: 0px;'>"+accion+"</td>");
	tbody.append("</tr>");
}