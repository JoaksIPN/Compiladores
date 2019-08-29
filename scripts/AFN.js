var numEstados=0;//variable global cuanta estados
var numAFN = 0;//variable global cuenta afns
var numTransiciones=0;//variable global cuenta transicioens
var nodos = new vis.DataSet(); //nodos totales
var aristas = new vis.DataSet(); //aristas totales
var contenedor = document.getElementById("contenedor"); //contenedor del grafo
var datos = {
	nodes: nodos,
	edges: aristas
};
var opciones = {
	edges:{
		arrows:{
			to:{
				enabled:true
			}
		}
	}
};
var grafo = new vis.Network(contenedor,datos,opciones);



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


class AFN {
	constructor(car){
		this.alfabeto = [car];
		this.estados = [];
		this.id = numAFN++;

		this.estados.push(new Estado(numEstados++,true,false));
		this.estados.push(new Estado(numEstados++,false,true));
		var t = new Transicion(numTransiciones++,car,car,this.estados[1].id);
		var ts = [t];
		this.estados[0].transiciones = ts;
	}

	Union(afn){
		var t1,t2,t3,t4;
		/*Se genera el nuevo estado inicial*/
		var e1 = new Estado(numEstados++,true,false);
		/*Remueve propiedad del actual estado inicial//
		//y crea una nueva transicion en afn local--------*/
		for(var i=0;i<this.estados.length;i++){
			if(this.estados[i].start){
				this.estados[i].start = false;
				t1 = new Transicion(numTransiciones++,'ɛ','ɛ',this.estados[i].id);
			}
		}
		//En afn
		for(var i=0;i<afn.estados.length;i++){
			if(afn.estados[i].start){
				afn.estados[i].start = false;
				t2 = new Transicion(numTransiciones++,'ɛ','ɛ',afn.estados[i].id);
			}
		}

		var trans = [t1,t2];
		e1.transiciones = trans;
		/*********Se genera nuevo estado final*******************/
		var e2 = new Estado(numEstados++,false,true);
		/*Remueve estados finales y crea transiciones al nuevo estado final*/
		//En afn local
		for(var i=0;i<this.estados.length;i++){
			if(this.estados[i].end){
				this.estados[i].end = false;
				t3 = new Transicion(numTransiciones++,'ɛ','ɛ',e2.id);
				//Agregamos transicion al estado que era estado final
				this.estados[i].transiciones.push(t3);
			}
		}
		/*En afn*/
		for(var i=0;i<afn.estados.length;i++){
			if(afn.estados[i].end){
				afn.estados[i].end = false;
				t4 = new Transicion(numTransiciones++,'ɛ','ɛ',e2.id);
				//Agregamos transicion al estado que era estado final
				afn.estados[i].transiciones.push(t4);
			}
		}
		/* se crea nuevo alfabeto*/
		for(var i=0;i<afn.alfabeto.length;i++)
			this.alfabeto.push(afn.alfabeto[i]);
		/*Se agregan estados del afn y los dos nuevos estados al array del afn local*/
		for(var i=0;i<afn.estados.length;i++)
			this.estados.push(afn.estados[i]);
		this.estados.push(e1);
		this.estados.push(e2);
		return this;
	}

	Concatenar(afn){
		
	}
}