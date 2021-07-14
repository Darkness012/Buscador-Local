const express = require("express");
const app = express();
const port = process.env.PORT||443;
const path = require("path");
const fs = require('fs');

//enviando archivos estaticos
app.use(express.static(path.join(__dirname, "../public")));

//iniciando server
app.listen(port, ()=>{
    console.log("Running on port: "+port);
});

//Router
app.get("/obtenerPropiedades", (req, res)=>{
    let filtros = (req.query.personalizada=='true')?req.query:false;
    console.log(filtros);
    obtenerPropiedades((data)=>{
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
    }, filtros);
});

app.get("/getOptions", (req, res)=>{
    //res.setHeader('Content-Type', 'application/json');
    //res.end(JSON.stringify({mensage: 5, caca:4}));
    getOptions((respuesta)=>{
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(respuesta));
        
    });
});



//funciones 
function obtenerPropiedades(callback, detalles){
    //se lee data.json
    var respuesta = {error: false};
    fs.readFile('./public/data.json', 'utf8' , (err, data) => {
        //se verifica si hay error
        if (!err) {

            //si hay detalles se filtra la busqueda
            respuesta.propiedades = detalles?filtrar(data, detalles):JSON.parse(data);

        }else{
            respuesta.error = true;
            respuesta.errorMessage = err;
        }
        

        callback(respuesta);
    })

    
}

function filtrar(data, detalles){
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
}

function getOptions(callback){
    let ciudades = [];
    let tipos = [];
    let response = {};


    obtenerPropiedades((respuesta)=>{
        if(!respuesta.error){
            respuesta.propiedades.forEach(item=>{
                if(!ciudades[item.Ciudad]) ciudades[item.Ciudad] = 1;
                //else ciudades[item.Ciudad] += 1;
    
                if(!tipos[item.Tipo]) tipos[item.Tipo] = 1;
                //else tipos[item.Tipo] += 1;
            })

            response.ciudades = Object.keys(ciudades);
            response.tipos= Object.keys(tipos)
        }else{
            response.error = true;
            response.errorMessage = respuesta.errorMessage;
        }

        callback(response);
    });
}