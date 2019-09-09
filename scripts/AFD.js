
class AFD {
	
    search(Sid,Siid){
        var flag;
        for (let i = 0; i < Sid.length; i++) {
            if (Sid[i].lenght==Siid.lenght) {
                for (let j = 0; j < Sid[i].length; j++) {
                    if (!Sid[i][j]==(Siid[j])) {
                        flag=false;
                    }
                }   
                if(flag)
                return i;
                else 
                    return -1;
            }
            else if(i==(Sid.length-1))
                return -1;
                
        }       
    }
  
    convertir_AFD(AFN){
        var i=1;
        var estado;
        var j=0;
        var id;
        var index;
        var S=[];
        var auxS=[];
        var auxSi=[];
        var transicion =[];
        var ftransicion =[];
        var queue = new Queue();
        var S0=[];
        var Sid=[];
        var S0id=[];
        var Siid=[];
        
        id=AFN.findStartIndex();
        estado=AFN.estados[id];
        S0=AFN.cerradura_e(estado);
        S0.forEach(element => {
            S0id.push(element.id);
        });
        Sid.push(S0id)
        S.push(S0);
        queue.enqueue(S0);
        while (!queue.isEmpty()) {
            auxS.length=0;
            auxS=queue.dequeue();
            // Para cada simbolo del alfabeto calculamos la operación IR_A
            AFN.alfabeto.forEach(element => {
                j=0;
                auxSi.length=0;
                Siid.length=0;
                transicion.length=0;// Limpiando el arreglo
                auxSi=AFN.ir_a(auxS,element);
                auxSi.forEach(element => {
                    Siid.push(element.id);
                });
                //console.log(auxSi);
                //Si el resultado de IR_A no es vacios
                if(auxSi.lenght!=0){
                index=this.search(Sid,Siid);
                //console.log(index);
                    //Si no se ha calculado IR_A para el conjunto Si
                    if(index==-1 ){
                        // Se agrega un nuevo estado
                        S.push(auxSi);
                        Sid.push(Siid);
                        // Se encola para buscar más estados
                        queue.enqueue(auxSi);
                        transicion[j]=i;
                        i++;
                    }   
                    else
                        transicion[j]=index;
                }
                else
                  transicion[j]=-1;
                j++;
            });
            console.log(S);
            ftransicion.push(transicion);
        }
        console.log(Sid);
        var matriz=[S.length];
        for (let index = 0; index < ftransicion.length; index++) {
            matriz[index]=new Array(ftransicion[index]);
        }
        return matriz;
    }
}
