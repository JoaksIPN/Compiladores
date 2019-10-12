var contenido;
var reglas = [];
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
			contenido = this.result;
			console.log(contenido);
			crearListas();
			console.log(reglas);
		}
		fr.readAsText(this.files[0]);
	});
});

function crearListas(){
	console.log(contenido.length);
	console.log(contenido[0]);
	var isAdding = false;
	var index = 0;
	for(let i=0;i<contenido.length;i++){
		if(!isAdding){ //modo agregar lados izquierdos
			console.log("Modo agregar lado izquierdo");
			index = i; //se guarda posicion del primer lado izquierdo
			/*checamos que lo siguiente que venga sea un ->*/
			if(contenido.substring(i+1,i+3)=="->"){
				console.log("agregando lados derechos");
				let aux = []
				aux.push(contenido[i]);//agregamos a la lista el simbolo izquierdo
				//agregamos una nueva lista
				reglas.push(aux);
				isAdding = true; //cambiamos a modo agregar lados derechos
				i+=2;//incrementamos i para que el siguiente que lea sea los lados derechos
			}else{
				alert("Error, archivo mal escrito");
				return;
			}
		}else{ //modo agregar a lados derechos
			if(contenido[i]!=";"){
				let aux = [];
				/*si encuentra el OR se crea otro nodo en el arreglo de listas con el mismo lado derecho*/
				if(contenido[i] == "|"){
					aux.push(reglas[reglas.length-1][0]);
					console.log("Se encontro OR en el lado izquierdo "+aux[0]);
					reglas.push(aux);
					i++;
				}
				reglas[reglas.length-1].push(contenido[i]);
			}
			else
				isAdding = false;//volvemos a modo agregar lados izquierdos cuando encuentra un salto de linea
		}
	}
}
