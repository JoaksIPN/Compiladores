var afn = new AFN('a'); //creamos afn basico
var afn2 = new AFN('b'); //creamos afn basico
//console.log(afn);
console.log(afn2);
console.log(afn.Union(afn2));
DibujarAFN(afn); //dibujamos afn


function DibujarAFN(afn){
	try{
		/*****Recorremos todos los estados************/
		for(var i=0;i<afn.estados.length;i++){
			/* por cada estado recorrido se agrega un nodo al grafo */
			var num = afn.estados[i].id;
			var name = ""+num;
			//se le asigna un color dependiendo de que tipo de estado sea
			if(afn.estados[i].start){//Dibuja estado inicial
				nodos.add({
					id:num,
					label:name,
					color: '#81F7BE'
				});
			} else if(afn.estados[i].end){//dbuja estado final
				nodos.add({
					id:num,
					label:name,
					color: '#F78181'
				});
			} else{ //dibuja otro
				nodos.add({
					id:num,
					label:name
				});
			}
			/* fin de agregacion de nodos*/
		}
		/****recorremos todos los estados*******/
		for(var i=0;i<afn.estados.length;i++){
			var idFrom = afn.estados[i].id; //id de origen de la transicion
			var caracteres; //simbolos de la transicion
			var idTo; //destino de la transicion
			/*****recorremos transiciones del estado****/
			for(var j=0;j<afn.estados[i].transiciones.length;j++){
				/***por cada transicion se agrega un edge al grafo***/
				//si valorMin y valorMax son los mismos entonces
				if(afn.estados[i].transiciones[j].valorMax==afn.estados[i].transiciones[j].valorMin)
					caracteres = afn.estados[i].transiciones[j].valorMax;
				else{ //si no
					caracteres = "("+valorMin+",...,"+valorMax+")";
				}
				idTo = afn.estados[i].transiciones[j].idSalida;
				/**Agremos edge al grafo**/
				aristas.add([
					{from:idFrom, to:idTo, label:caracteres}
				]);
			}
		}
	} catch(err){
		alert(err);
	}
}