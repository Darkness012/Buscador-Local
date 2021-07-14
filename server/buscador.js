const fs = require('fs');

var Buscador = {
    obtenerPropiedades: function(detalles){
        return new Promise((resolve, reject)=>{
            fs.readFile('./public/data.json', 'utf8' , (err, data) => {
                //se verifica si hay error
                if (!err) {
    
                    //si hay detalles se filtra la busqueda
                    resolve( detalles?Buscador.filtrar(data, detalles):JSON.parse(data))
    
                }else{
                    reject(err);
                }
            })
        });
        
    },
    
    filtrar: function(data, detalles){
        let propiedades = JSON.parse(data);
        let propiedadesFiltradas = [];
        let max = parseInt(detalles.precioMax);
        let min = parseInt(detalles.precioMin);
    
        propiedades.forEach(propiedad=>{
            let precio = parseInt((propiedad.Precio.split("$")[1]).replace(",", ""))
    
            let agregarCiudad = detalles.Ciudad?detalles.Ciudad==propiedad.Ciudad: true;
            let agregarTipo = detalles.Tipo?detalles.Tipo==propiedad.Tipo: true;
            let precioAceptable = precio<max && precio>min;
            
            if(agregarCiudad && agregarTipo && precioAceptable){
                propiedadesFiltradas.push(propiedad);
            }
            
        });
    
        return propiedadesFiltradas;
    },
    
    getOptions: function(){
    
        return new Promise((resolve, reject)=>{
            let ciudades = [];
            let tipos = [];
            let response = {};
    
            Buscador.obtenerPropiedades()
                .then(propiedades=>{
                    propiedades.forEach(item=>{
                        if(!ciudades[item.Ciudad]) ciudades[item.Ciudad] = 1;
                        //else ciudades[item.Ciudad] += 1;
            
                        if(!tipos[item.Tipo]) tipos[item.Tipo] = 1;
                        //else tipos[item.Tipo] += 1;
                    })
    
                    response.ciudades = Object.keys(ciudades);
                    response.tipos= Object.keys(tipos)
    
                    resolve(response);
                })
                //error
                .catch(err=>{
                    reject(err);
                });
        })
        
    }
}

module.exports = Buscador;