function GetMax(arreglo){
	var max = 0;
	for(var i=0;i<arreglo.length;i++)
		if(arreglo[i]>max)
			max = arreglo[i];
	return max;
}

class ListaDoble{
	constructor(){
		this.nodoInicial = null;
		this.nodoArriba = null;
		this.nodoAbajo = null;
		this.profAbajo = [];
		this.nodos = [];
		this.simbolos = [];
		this.filas = 0;
		this.profundidadArriba = 0;
		this.profundidadAbajo = 0;
	}

	calcularProfundidadesAbajo(){
		var profundidad = 0;
		var n = this.nodoInicial;
		var n2;
		var aux = new Nodo();
		var aux2 = new Nodo();
		while(n!=null){
			n2 = n.nodoUp;
			while(n2.nodoAbajo!=null){
				profundidad++;
				aux2 = n2.nodoAbajo;
				n2 = aux2;
			}
			this.profAbajo.push(profundidad);
			this.profundidadAbajo += profundidad;
			profundidad = 0;
			aux = n.nodoAbajo;
			n = aux;
		}
	}

	calcularDatos(){
		this.filas = 0;
		var profundidadArr = [];
		var profundidad = 1;
		var n = this.nodoInicial;
		var n2;
		var aux = new Nodo();
		var aux2 = new Nodo();
		while(n !=null){
			this.filas++;
			n2 = n;
			while(n2.nodoArriba != null){
				profundidad++;
				aux2 = n2.nodoArriba;
				n2 = aux2;
			}
			profundidadArr.push(profundidad);
			profundidad = 1;
			aux = n.nodoAbajo;
			n = aux;
		}
		profundidadArriba = GetMax(profundidadArr);
	}

	insertarArriba(lista){
		if(this.nodoArriba == null && this.nodoAbajo == null){
			this.nodoArriba = lista.nodoArriba;
			this.nodoAbajo = lista.nodoAbajo;
			this.nodoInicial = lista.nodoInicial;
			for(var i=0;i<lista.nodos.length;i++)
				this.nodos.push(lista.nodos[i]);
		} else {
			this.nodoArriba.nodoUp = lista.nodoInicial;
			this.nodoArriba = lista.nodoArriba;
			for(var i=0;i<lista.nodos.length;i++)
				this.nodos.push(lista.nodos[i]);
			this.nodoArriba.nodoUp = null;
		}
	}

	insertarAbajo(lista){
		if(this.nodoArriba == null && this.nodoAbajo == null){
			this.nodoArriba = lista.nodoArriba;
			this.nodoAbajo = lista.nodoAbajo;
			this.nodoInicial = lista.nodoInicial;
			for(var i=0;i<lista.nodos.length;i++)
				this.nodos.push(lista.nodos[i]);
		} else {
			this.nodoAbajo.nodoDown = lista.nodoInicial;
			this.nodoAbajo = lista.nodoInicial;
			this.nodoArriba = lista.nodoArriba;
			for(var i=0;i<lista.nodos.length;i++)
				this.nodos.push(lista.nodos[i]);
		}
	}

	get nodoInicial(){
		return this._nodoInicial;
	}

	set nodoInicial(nodoInicial){
		this._nodoInicial = nodoInicial;
		this._nodoArriba = nodoInicial;
		this._nodoAbajo = nodoInicial;
		this.nodos = [];
		this._nodos.push(nodoInicial);
	}

	get nodoArriba(){
		return this._nodoArriba;
	}

	set nodoArriba(nodoArriba){
		this._nodoArriba = nodoArriba;
	}

	get nodoAbajo(){
		return this._nodoAbajo;
	}

	set nodoAbajo(nodoAbajo){
		this._nodoAbajo = nodoAbajo;
	}

	get profAbajo(){
		return this._profAbajo;
	}

	set profAbajo(profAbajo){
		this._profAbajo = profAbajo;
	}

	get nodos(){
		return this._nodos;
	}

	set nodos(nodos){
		this._nodos = nodos;
	}

	get simbolos(){
		return this._simbolos;
	}

	set simbolos(simbolos){
		this._simbolos = simbolos;
	}

	get filas(){
		return this._filas;
	}

	set filas(filas){
		this._filas = filas;
	}

	get profArriba(){
		return this._profArriba;
	}

	set profArriba(profArriba){
		this._profArriba = profArriba;
	}

	get profAbajo(){
		return this._profAbajo;
	}

	set profAbajo(profAbajo){
		this._profAbajo = profAbajo;
	}
}