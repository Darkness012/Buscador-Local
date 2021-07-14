
//Document ready
$(function() {

  //Inicializador del elemento Slider
  admin.iniciarSlider();

  //se cargan las opciones de busqueda personalizada desde el servidor 
  admin.cargarOpciones();

  //se signa click al iniciar busqueda mandando si es personalizada
  $("#buscar").click(function(){
    Busqueda.iniciarBusqueda($("#checkPersonalizada").is(":checked"));
  });
});


//Objeto administrador de las busquedas
const Busqueda = {
  iniciarBusqueda: function name(personalizada) {
    
    //se realiza peticion de la busqueda
    this.obtenerPropiedades(

      //se manda el callback para los resultados
      this.actualizarBusqueda,

      //se define si es busqueda personalizada
      //se mandan filtros si hay busqueda personalizada
      personalizada?
        this.obtenerDetallesBusqueda():false);
  }, 

  actualizarBusqueda: function(propiedades){
    //se limpia el contenedor de items
    $("#lista").empty();

    //se recorren los nuevos items
    propiedades.forEach(propiedad => {
      
      //se agrega nuevo item
      $("#lista").append(`
      <div class="card horizontal">
        <div class="card-image hide-on-small-only">
          <img src="img/home.jpg">
        </div>
        <div class="card-stacked propiedad-item">
          <div class="card-content">
            <div>
              <b>Direccion: </b>${propiedad.Direccion}<p></p>
            </div>
            <div>
              <b>Ciudad: </b><p>${propiedad.Ciudad}</p>
            </div>
            <div>
              <b>Telefono: </b>${propiedad.Telefono}<p></p>
            </div>
            <div>
              <b>Código postal: </b>${propiedad.Codigo_Postal}<p></p>
            </div>
            <div>
              <b>Precio: </b>${propiedad.Precio}<p></p>
            </div>
            <div>
              <b>Tipo: </b>${propiedad.Tipo}<p></p>
            </div>
          </div>
        </div>
      </div>`
      );
    });
  },

  obtenerDetallesBusqueda: function(){
    //se obtienen los detalles del filtro de busqueda
    let ciudad = $("#ciudad").val();
    let tipo = $("#tipo").val();
    let rangoPrecio = $("#rangoPrecio").val().split(";");
    
    let data = {
      personalizada: true,
      precioMin: rangoPrecio[0],
      precioMax: rangoPrecio[1]
    };
  
    if(ciudad) data.Ciudad = $("#ciudad option:selected").text();
    if(tipo) data.Tipo = $("#tipo option:selected").text();
    
    return data;
  },

  obtenerPropiedades: function(callback, personalizada){
    
    //peticion al servidor
    let data = (!personalizada)?{personalizada: false}: personalizada;
    $.ajax({
      url: "http://localhost:443/obtenerPropiedades",
      type: "GET",
      data: data,
      dataType: "json",
      success: function(respuesta){
        //se verifica que no haya ocurrido algun error
        
        console.log(respuesta)
        if(!respuesta.error){
          callback(respuesta.propiedades);
        }else{
          console.log(respuesta);
        }
        
      } 
    });

  }
  
}

//Objeto encargado de iniciar, actualizar, resetear elementos
const admin = {
  iniciarSlider: function() {
    $("#rangoPrecio").ionRangeSlider({
      type: "double",
      grid: false,
      min: 0,
      max: 100000,
      from: 1000,
      to: 50000,
      prefix: "$"
    })
    this.setSearch()
  },
  
  setSearch: function() {
    let busqueda = $('#checkPersonalizada')
    busqueda.on('change', (e) => {
      if (this.customSearch == false) {
        this.customSearch = true
      } else {
        admin.resetOptins();
        this.customSearch = false
      }
      $('#personalizada').toggleClass('invisible')
    })
  },
  
  cargarOpciones: function(){
    $.ajax({
      url: "http://localhost:443/getOptions",
      type: "GET",
      dataType: "json",
      success: function(respuesta){
        if(!respuesta.error){
          admin.setOptions(respuesta);
        }else console.log("Error "+respuesta.errorMessage);
      }
    });
  },
  
  setOptions: function(details){
  
    //agregando las ciudades
    details.ciudades.forEach((ciudad, i)=>{
      $("#ciudad").append(`<option value="${i+1}">${ciudad}</option>`);
    });
  
    //agregando los tipos
    details.tipos.forEach((tipo, i)=>{
      $("#tipo").append(`<option value="${i+1}">${tipo}</option>`);
    });
  
    $('select').formSelect();
  },

  resetOptins: function(){
    console.log("reset")
    $('select')
      .prop('selectedIndex', 0)
      .formSelect();
  }
}

