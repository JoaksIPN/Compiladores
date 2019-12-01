class Item {
	constructor(stritem = "",simbitem = []){
		this.stritem = stritem;
		this.simbitem = simbitem;
	}

	Imprimir(){
		let res = "["+this.stritem+",{";
		for(let i =0;i<this.simbitem.length;i++)
			res += this.simbitem[i]+",";
		res += "}]";
		console.log(res);
	}

	get stritem(){
		return this._stritem;
	}

	set stritem(stritem){
		this._stritem = stritem;
	}

	get simbitem(){
		return this._simbitem;
	}

	set simbitem(simbitem){
		this._simbitem = simbitem;
	}

	ToString(){
		let res = "["+this.stritem+",{";
		for(let i =0;i<this.simbitem.length;i++)
			res += this.simbitem[i]+",";
		res += "}]";
		return res;
	}
}