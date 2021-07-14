const express = require("express");
const app = express();
const port = process.env.PORT||443;
const path = require("path");
const buscador = require("./buscador.js")

//enviando archivos estaticos
app.use(express.static(path.join(__dirname, "../public")));

//iniciando server
app.listen(port, ()=>{
    console.log("Running on port: "+port);
});

//Router
app.get("/obtenerPropiedades", (req, res)=>{
    //se obtienen los filtros
    let filtros = (req.query.personalizada=='true')?req.query:false;
    console.log(filtros);

    //se indica que se devolvera un json 
    res.setHeader('Content-Type', 'application/json');

    //se leen los datos
    buscador.obtenerPropiedades(filtros)
        //success
        .then(propiedades=>{
            res.end(JSON.stringify({propiedades:propiedades}));
        })
        //error
        .catch(err=>{
            console.log(err);
            res.end(JSON.stringify({error:true, errorMessage: err}));
        });
    
});
app.get("/getOptions", (req, res)=>{
    //se indica que se devolvera un json
    res.setHeader('Content-Type', 'application/json');

    //se leen las opciones disponibles
    buscador.getOptions()
        //success
        .then(options=>{
            res.end(JSON.stringify(options));
        })
        //error
        .catch(err=>{
            res.end(JSON.stringify({error: true, errorMessage: err}));
        });
});

