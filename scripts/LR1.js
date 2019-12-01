var histrorialCerraduras;
var tablaR1 = [];
var tablaLALR = [];
var countConjuntos;
var dicReglas;
$(document).ready(function(){
	$("#btnLR1").on("click",function(){
		console.log(listaReglas);
		tablaR1 = LR1(listaReglas);
		console.log("tabla final");
		//ImprimirTabla(tablaR1);
	});
	$("#btnEvaluarLR1").on("click",function(){
		console.log("Evaluando expresion con LR1");
		var exp = $("#inputExpresionLR1").val();
		EvaluarLR(tablaR1,exp,"tablaEvaluarLR1","ResultadoLR1");
	});
	$("#cerrarModalLR1").on("click",function(){
		$("#tablaLR1 thead").empty();
		$("#tablaLR1 tbody").empty();
		$("#tablaEvaluarLR0 tbody").empty();
	});
});

function LR1(reglas){
	//variables para la iteracion de la tabla
	var conjuntos = [];
	var simbolosAnalizados = [];
	var stritem;//atributo string del item
	var lstitem;//atributo lista del item
	var item;
	//comenzamos creando la regla aumentada
	let reglaAumentada = new ListaDoble();
	let reglaaux = new ListaDoble();
	let nodoaux = new Nodo("Q");
	SetNodoInicial(reglaAumentada,nodoaux);
	let nodoaux2 = new Nodo(""+reglas.nodoInicial.simbolo);
	nodoaux2.terminal = false;
	SetNodoInicial(reglaaux,nodoaux2);
	reglaAumentada.insertarDerecho(reglaaux);
	reglaAumentada.insertarAbajo(reglas);
	reglaAumentada.ImprimirLista();
	//Fin creacion regla aumentada
	//diccionario de reglas que utilizaremos para la generacion de la tabla
	dicReglas = CreateDictionary(reglaAumentada);
	historialCerraduras = [];
	//////////////////////////////////
	//Comenzamos con la cerradura S0//
	//////////////////////////////////
	countConjuntos = 1;
	stritem = ConvertirAItem(reglaAumentada.nodoInicial);
	lstitem = ["$"];
	item = new Item(stritem,lstitem);
	//item.Imprimir();
	let itemarray = [];
	itemarray.push(item)
	historialCerraduras.push(itemarray);
	conjuntos.push(CerraduraLR1(item,reglaAumentada));
	ImprimirConjuntos(conjuntos);
	console.log(conjuntos);
	/////////////////////////////////
	//Iteracion conjuntos restantes//
	/////////////////////////////////
	let row;//fila de la tabla que se ira creando conforme se generen los conjuntos
	let itemSeparados = [];//lista de items separados por su simbolo despues del punto
	let conaux = []; //elemento de la lista itemSeparados
	let alfa;//simbolo actualmente analizado
	let aux;//item auxiliar para usos varios
	for(let i=0;i<conjuntos.length;i++){
		console.log("Analizando conjunto: "+i);
		console.log(conjuntos[i]);
		let tamrow = VT.length+VN.length+1;
		row = new Array(tamrow);
		//Llenando la fila
		for(let j=0;j<row.length;j++)
			row[j] = "-";
		tablaR1.push(row);
		//////////////////////////////////////////////////////////////
		//separamos los items en una lista dependiendo de su simbolo//
		//despues del punto para facilitar el proceso de analisis   //
		//////////////////////////////////////////////////////////////
		let conjuntoAux = [];
		for(let j=0;j<conjuntos[i].length;j++)
			conjuntoAux.push(new Item(conjuntos[i][j].stritem,conjuntos[i][j].simbitem));
		itemSeparados = [];
		//proceso de separacion
		while(conjuntoAux.length>0){
			alfa = conjuntoAux[0].stritem[conjuntoAux[0].stritem.indexOf('.')+1];
			conaux = [];
			for(let x=0;x<conjuntoAux.length;x++){
				if(alfa == conjuntoAux[x].stritem[conjuntoAux[x].stritem.indexOf('.')+1]){
					conaux.push(conjuntoAux[x]);
					conjuntoAux.shift(x,1);
					x = -1;
				}
			}
			itemSeparados.push(conaux);
		}
		console.log("items separados");
		console.log(itemSeparados);
		//analizamos cada uno de los items  ya separados
		for(let j=0;j<itemSeparados.length;j++){
			console.log("Analizando reglas:");
			for(let z=0;z<itemSeparados[j].length;z++){
				itemSeparados[j][z].Imprimir();
			}
			alfa = itemSeparados[j][0].stritem[itemSeparados[j][0].stritem.indexOf('.')+1];
			console.log("Con alfa: "+alfa);

			//si es Ω entonces aplicacion la funcion mover
			if(alfa == "Ω"){
				console.log("alfa es epsilon");
				console.log("Agregando...");
				aux = new Item(Mover(itemSeparados[j][0].stritem),itemSeparados[j][0].simbitem);
				console.log(aux);
				itemSeparados[j][0] = aux;
				console.log("Resultado:");
				console.log(itemSeparados[j]);
				conjuntos[i][j] = itemSeparados[j][0];
				alfa = itemSeparados[j][0].stritem[itemSeparados[j][0].stritem.indexOf('.')+1];
				console.log("Nuevo alfa: "+alfa);
			}
			itemsMover = [];
			for(let x=0;x<itemSeparados[j].length;x++)
				itemsMover.push(new Item(Mover(itemSeparados[j][x].stritem),itemSeparados[j][x].simbitem));
			console.log("itemsMover");
			console.log(itemsMover);
			let simbIndex = BuscarEnHistorialLR1(itemsMover);
			console.log("simbIndex: "+simbIndex);
			if(simbIndex<0){
				console.log("Nueva cerradura");
				//si el alfa es undefined entonce no se calcula su IrA
				if(alfa!=undefined){
					console.log("Calculando IrA de");
					ImprimirArregloItems(itemSeparados[j]);
					aux = IrAConjuntoLR1(itemSeparados[j],reglaAumentada);
					console.log("Nuevo conjunto");
					ImprimirArregloItems(aux);
					conjuntos.push(aux);
					console.log("Actualizacion conjuntos");
					ImprimirConjuntos(conjuntos);
					//llenando tabla
					if(VN.includes(alfa)){
						tablaR1[i][ObtenerColumnaTablaLR1(alfa)] = countConjuntos;
						console.log("tablaR1["+i+"]["+ObtenerColumnaTablaLR1(alfa)+"]= "+countConjuntos);
					}else{
						tablaR1[i][ObtenerColumnaTablaLR1(alfa)] = "d"+countConjuntos;
						console.log("tablaR1["+i+"]["+ObtenerColumnaTablaLR1(alfa)+"]= d"+countConjuntos);
					}
					countConjuntos++;
					console.log("Agregando cerradura a historial");
					console.log("Agreando items:");
					ImprimirArregloItems(itemsMover);
					historialCerraduras.push(itemsMover);
					console.log("Nuevo historial");
					for(let y=0;y<historialCerraduras.length;y++)
						ImprimirArregloItems(historialCerraduras[y]);
				}else{
					console.log("no hay IrA por punto al final del item");
				}
			}else{
				console.log("cerradura ya calculada");
				console.log("LLenando tabla con la cerradura ya calculada");
				if(VN.includes(alfa)){
							tablaR1[i][ObtenerColumnaTablaLR1(alfa)] = simbIndex;
					console.log("tablaR1["+i+"]["+ObtenerColumnaTablaLR1(alfa)+"] = "+simbIndex);
				}else{
					tablaR1[i][ObtenerColumnaTablaLR0(alfa)] = "d"+simbIndex;
					console.log("tablaR1["+i+"]["+ObtenerColumnaTablaLR1(alfa)+"] = d"+simbIndex);
				}
			}

			/////////////////////////////////////////////////
			//Etapa de agregación de reducciones a la tabla//
			/////////////////////////////////////////////////
			console.log("Agregacion de restricciones");
			ImprimirArregloItems(conjuntos[i]);
			let numRegla;
			let simbTabla;
			let itemFinal = -1;
			//Buscamos si en el nuevo conjunto hay un punto hasta el final
			for(let x=0;x<conjuntos[i].length;x++){
				index = conjuntos[i][x].stritem.indexOf('.');
				console.log("indexFinal: "+index+" tam: "+conjuntos[i][x].stritem.length);
				if(index == conjuntos[i][x].stritem.length-1){
					itemFinal = conjuntos[i][x];
				}
			}
			if(itemFinal!=-1){
				console.log("Item con punto al final: "+itemFinal.ToString());
				console.log("calculando restricciones");
				numRegla = FindNumRegla(dicReglas,itemFinal.stritem);
				if(numRegla==0){
					tablaR1[i][ObtenerColumnaTablaLR1("$")] = "A";
					console.log("tablaR1["+i+"]["+ObtenerColumnaTablaLR1("$")+"] = A");
				}else{
					//agregamos la restriccion para cada uno de los simbolos de la produccion del item
					for(let x=0;x<itemFinal.simbitem.length;x++){
						tablaR1[i][ObtenerColumnaTablaLR1(itemFinal.simbitem[x])] = "r"+numRegla;
						console.log("tablaR1["+i+"]["+ObtenerColumnaTablaLR1(itemFinal.simbitem[x])+"] = r"+numRegla);
					}
				}
			}
		}
	}

	///////////////////////////////////////////////
	//creando LALR con el historial de cerraduras//
	///////////////////////////////////////////////
	console.log("Creando tabla LALR");
	let buscar;//kernel a buscar
	let flag = false;//bandera para indicar si fue encontrado el kernel
	let indexKernel;
	let fila;
	for(let i=0;i<historialCerraduras.length;i++){
		tamrow = VT.length+VN.length+1;
		row = new Array(tamrow);
		//Llenando la fila
		for(let j=0;j<row.length;j++)
			row[j] = tablaR1[i][j];
		tablaLALR.push(row);
		indexKernel = BuscarKernelEnHistorialLR1(historialCerraduras[i],i+1);
		if(indexKernel>=0){
			console.log("Kernel encontrado en: "+indexKernel);
			console.log("Combinando estado "+indexKernel);
			/*fila = "";
			for(let j=0;j<tablaR1[indexKernel].length;j++)
				fila += tablaR1[indexKernel][j];
			console.log(fila);*/
			console.log("Con el estado original: "+i);
			/*fila = "";
			for(let j=0;j<tablaLALR[i].length;j++)
				fila += tablaLALR[i][j];
			console.log(fila);
			for(let j=0;j<tablaLALR[i].length;j++){
				if(tablaLALR[i][j]=="-"){
					tablaLALR[i][j]=tablaR1[indexKernel][j];
				}
			}
			console.log("Resultado: ");
			fila = "";
			for(let j=0;j<tablaLALR[i].length;j++)
				fila += tablaLALR[i][j];
			console.log(fila);*/
			historialCerraduras.splice(indexKernel,1);
		}else{
			console.log("Kernel no encontrado");
		}
	}
	ImprimirTabla(tablaLALR);

	/*Imprimiendo resultados*/
	ImprimirConjuntos(conjuntos);
	MostrarTablaLR(tablaR1,"tablaLR1");
	$("#modalTablaLR1").modal("show");
	return tablaR1;
}

function ImprimirArregloItems(arreglo){
	let line = "";
	for(let i=0;i<arreglo.length;i++)
		line += arreglo[i].ToString()+",";
	console.log(line);
}

function IrAConjuntoLR1(items,reglas){
	let respuesta = [];
	let index;
	let alfa;
	//se calculan las cerraduras de cada uno de los items
	for(let i=0;i<items.length;i++){
		alfa = items[i].stritem[items[i].stritem.indexOf('.')+1];
		console.log("IrA("+alfa+")");
		aux = IrALR1(items[i],reglas);
		console.log("Resultado IrA");
		ImprimirArregloItems(aux);
		if(aux==-1){
			console.log("Error en el IrA");
		}else{
			console.log("Array respuesta:");
			ImprimirArregloItems(respuesta);
			respuesta = Union(respuesta,aux);
			console.log("Union:");
			ImprimirArregloItems(respuesta);
		}
	}

	return respuesta;
}

function IrALR1(item,reglas){
	console.log("IrA");
	console.log("Analizando: "+item.ToString());
	item.stritem = Mover(item.stritem);
	console.log("Item: "+item.ToString());
	//si es -1 significa que el punto esta hasta el final y no se busca cerradura
	if(item!=-1){
			return CerraduraLR1(item,reglas);
	}

	return -1;
}

function CerraduraLR1(item,reglas){
	console.log("Creando cerradura de "+item.ToString());
	let cerradura = [];
	let index; //posicion del punto en el stritem
	let simbol;//simbolo que esta despues del punto
	let produccion = [];
	//Se agrega el item al que se le hace la cerradura
	cerradura.push(item);
	//recorre todos los elementos que esten en la cerradura en ese momento
	for(let i=0;i<cerradura.length;i++){
		index = cerradura[i].stritem.indexOf('.');
		if(index+1<cerradura[i].stritem.length){
			simbol = cerradura[i].stritem[index+1];
			if(VN.includes(simbol) && simbol != cerradura[i].stritem[0]){
				
				//cerradura = UnionLR1(cerradura,CrearItemsLR1(simbol,cerradura[i].simbitem,reglas));
				if(VT.includes(cerradura[i].stritem[index+2])){
					produccion.push(cerradura[i].stritem[index+2]);
					console.log("Producciones:");
					ImprimirArreglo(produccion);
					cerradura = UnionLR1(cerradura,CrearItemsLR1(simbol,produccion,reglas));
				}else{
					console.log("Producciones: ");
					ImprimirArreglo(cerradura[i].simbitem);
					cerradura = UnionLR1(cerradura,CrearItemsLR1(simbol,cerradura[i].simbitem,reglas));
				}
			}
		}
	}

	return cerradura;
}

function BuscarEnHistorialLR1(items){
	console.log("Buscando: ");
	ImprimirArregloItems(items);
	console.log("En historial: ");
	for(let i=0;i<historialCerraduras.length;i++){
		ImprimirArregloItems(historialCerraduras[i]);
	}

	for(let i=0;i<historialCerraduras.length;i++){
		if(CompararArregloItems(historialCerraduras[i],items)){
			console.log("cerradura encontrada en: "+i);
			return i;
		}
	}
	console.log("Cerradura no encontrada regresando -1");
	return -1;
}

function BuscarKernelEnHistorialLR1(items,indexInicio){
	console.log("Buscando: ");
	ImprimirArregloItems(items);
	console.log("En kernels del historial");

	for(let i=indexInicio;i<historialCerraduras.length;i++){
		if(CompararKernelArregloItems(historialCerraduras[i],items)){
			console.log("Retornando: "+i);
			return i;
		}
	}
	console.log("Kernel no encontrado regresando -1");
	return -1;
}

function CompararArregloItems(a,b){
	let flag;
	if(a.length!=b.length)
		return false;
	for(let i=0;i<a.length;i++){
		flag = false;
		for(let j=0;j<b.length && !flag;j++){
			if(CompararItems(a[i],b[j])){
				flag = true;
			}
		}
		if(flag==false){
			return false;
		}
	}

	return true;
}

function CompararKernelArregloItems(a,b){
	let flag;
	if(a.length!=b.length)
		return false;
	for(let i=0;i<a.length;i++){
		flag = false;
		for(let j=0;j<b.length && !flag;j++){
			if(CompararKernels(a[i],b[j])){
				flag = true;
			}
		}
		if(flag==false){
			return false;
		}
	}
	return true;
}

//Agrega los items2 a la lista items1 sin repetir items
function UnionLR1(items1,items2){
	let flag;
	//recorremos los items de items2
	for(let i=0;i<items2.length;i++){
		flag = false;
		//buscamos si el stritem de items2 ya esta en algun item de items1
		for(let j=0;j<items1.length;j++){
			//pregunta si es igual el stritem
			if(items1[j].stritem == items2[i].stritem){
				flag = true;
				//en caso de que si, checar que sus producciones sean las mismas
				if(!CompararArrays(items1[j].simbitem,items2[i].simbitem)){
					items1.push(items2[i]);
					
					break;
				}
			}
		}
		if(!flag)
			items1.push(items2[i]);
	}

	return items1;
}

function CompararItems(item1,item2){
	if(item1.stritem!=item2.stritem)
		return false;
	if(CompararArrays(item1.simbitem,item2.simbitem))
		return true;
	else
		return false;
}

function CompararKernels(item1,item2){
	if(item1.stritem==item2.stritem)
		return true;
	else
		return false;
}

function CrearItemsLR1(simboloIzq,producciones,reglas){
	console.log("Creando items con "+simboloIzq+" y producciones");
	ImprimirArreglo(producciones);
	let items = [];
	let itemString;
	let itemLista = [];
	itemLista = itemLista.concat(producciones);
	let nodo = reglas.nodoInicial;
	let nodo2,nodoaux;
	let flag = true;
	let i=0;
	while(nodo!=null){
		if(nodo.simbolo==simboloIzq){
			itemString = simboloIzq+">.";
			nodo2 = nodo.nodoDer;
			while(nodo2!=null){
				itemString +=nodo2.simbolo;
				if(nodo2.nodoDown!=null){
					nodoaux = nodo2.nodoDown;
				}
				if(nodo2.nodoDer!=null){
					nodo2 = nodo2.nodoDer;
					if(flag){
						if(VT.includes(nodo2.simbolo) && !itemLista.includes(nodo2.simbolo)){
							itemLista.push(nodo2.simbolo);
						}
						flag = false;
					}
				}else{
					item = new Item(itemString,itemLista);
					items.push(item);
					itemString = simboloIzq+">.";
					nodo2 = nodoaux;
					flag = true;
					nodoaux = null;
				}
			}
			console.log("items creados: ");
			ImprimirArregloItems(items);
			return items;
		}
		nodo = nodo.nodoDown;
	}
}

//returna true si ambos arrays son iguales
function CompararArrays(array1,array2){
	if(array1.length!=array2.length)
		return false;
	for(let i=0;i<array1.length;i++){
		if(!array2.includes(array1[i])){
			return false;
		}
	}
	return true;
}

function ImprimirConjuntos(conjunto){
	console.log("Imprimiendo conjunto");
	for(let i=0;i<conjunto.length;i++){
		console.log("["+i+"]: ");
		for(let j=0;j<conjunto[i].length;j++){
			conjunto[i][j].Imprimir();
		}
	}
}

function ObtenerColumnaTablaLR1(alfa){
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
