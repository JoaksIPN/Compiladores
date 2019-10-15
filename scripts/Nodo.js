class Nodo {
	constructor(simbolo = "none",nodoUp = null,nodoDown = null,terminal = null){
		this.simbolo = simbolo;
		this.nodoUp = nodoUp;
		this.nodoDown = nodoDown;
		this.terminal = terminal;
	}

	Imprimir(){
		console.log("Nodo{simbolo: "+this.simbolo+" nodoUp: "+this.nodoUp+" nodoDown: "+nodoDown);
	}

	get simbolo(){
		return this._simbolo;
	}

	set simbolo(simbolo){
		this._simbolo = simbolo;
	}

	get nodoUp(){
		return this._nodoUp;
	}

	set nodoUp(nodoUp){
		this._nodoUp = nodoUp;
	}

	get nodoDown(){
		return this._nodoDown;
	}

	set nodoDown(nodoDown){
		this._nodoDown = nodoDown;
	}

	get terminal(){
		return this._terminal;
	}

	set terminal(terminal){
		this._terminal = terminal;
	}
}