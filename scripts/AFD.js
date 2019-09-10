//variable global cuanta estados
var numAFD = 0;//variable global cuenta afns
var numTransiciones=0;//variable global cuenta transicioens

class AFD {
    constructor(){
		this.alfabeto = [];
		this.estados = [];
        this.id = numAFD++;
        
	}
	
    search(Sid,Siid){
        var index;
        var flag;
        for (let i = 0; i < Sid.length; i++) {
            index=-1;
            flag=true;
            if (Sid[i].lenght===Siid.lenght) {
                for (let j = 0; j < Sid[i].length; j++) {
                    if ((Sid[i][j]!=(Siid[j]))) {
                        flag=false;
                        break;
                    }
                    else{
                        flag=true;
                    }
                }
                if(flag){
                    index=i;
                    break;
                }
            }
            else 
                continue;
                
        }
        return index;
    }
  
    convertir_AFD(AFN){
        var estado;
        var id;
        var idFinal;
        var index;
        var S=[];
        var auxS=[];
        var auxSi=[];
        var queue = new Queue();
        var S0=[];
        var Sid=[];//Sid guardo los ids de cada conjunto
        var S0id=[];//S inicial de ids
        var Siid=[];
        var numEstados=0;
        var i;
        id=AFN.findStartIndex();
        idFinal=AFN.findEndIndex();
        estado=AFN.estados[id];
        S0=AFN.cerradura_e(estado);
        S0.forEach(element => {
            S0id.push(element.id);
        });
        Sid.push(S0id.sort());
        S.push(S0);//Conjunto de estados
        queue.enqueue(S0);
        var transiciones=[];
        var transicion=[];
        transicion=AFN.alfabeto;
        transiciones.push(transicion);
        while (!queue.isEmpty()) {
            auxS=queue.dequeue();
            transicion=[];
            AFN.alfabeto.forEach(element => {
                Siid=[];
                auxSi=AFN.ir_a(auxS,element);
                auxSi.forEach(element => {
                    Siid.push(element.id);
                });

                if(auxSi.lenght!=0){
                index=this.search(Sid,Siid.sort());
                    if(index==-1){
                        S.push(auxSi);
                        Sid.push(Siid.sort());
                        queue.enqueue(auxSi);
                        numEstados++;
                        transicion.push(numEstados);
                    }  
                    else
                        transicion.push(index); 
                }
                else{
                    transicion.push(-1);
                }
                transiciones.push(transicion);

            });
        }
        console.log(S);
        console.log(Sid);
        return transiciones;
    }
}
