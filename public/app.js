const admin = {
  iniciarBusqueda: function name(personalizada) {
    
    //se realiza peticion de la busqueda
    //se manda un callback para actualizar
    //se define si es busqueda personalizada
    this.obtenerPropiedades(this.actualizarBusqueda, personalizada?obtenerDetallesBusqueda():false);
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

    console.log("sd")
  },

  actualizarBusqueda: function(propiedades){
    $("#lista").empty();
    propiedades.forEach(propiedad => {

      let template = `
        <div class="card horizontal">
          <div class="card-image">
            <img src="img/home.jpg">
          </div>
          <div class="card-stacked">
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
        </div>`;
      
      $("#lista").append(template);
    });
  }
}

$(function() {
  //Inicializador del elemento Slider
  iniciarSlider();

  loadOptions();

  //click buscar
  $("#buscar").click(function(){
    admin.iniciarBusqueda($("#checkPersonalizada").is(":checked"));
  });

})

function obtenerDetallesBusqueda(){
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
}

function iniciarSlider() {
  $("#rangoPrecio").ionRangeSlider({
    type: "double",
    grid: false,
    min: 0,
    max: 100000,
    from: 1000,
    to: 20000,
    prefix: "$"
  })
  setSearch()
}

function setSearch() {
  let busqueda = $('#checkPersonalizada')
  busqueda.on('change', (e) => {
    if (this.customSearch == false) {
      this.customSearch = true
    } else {
      this.customSearch = false
    }
    $('#personalizada').toggleClass('invisible')
  })
}

function loadOptions(){
  $.ajax({
    url: "http://localhost:443/getOptions",
    type: "GET",
    dataType: "json",
    success: function(respuesta){
      if(!respuesta.error){
        setOptions(respuesta);
      }else console.log("Error "+respuesta.errorMessage);
    }
  });
}

function setOptions(details){

  //asignando las opciones

  //agregando las ciudades
  details.ciudades.forEach((ciudad, i)=>{
    $("#ciudad").append(`<option value="${i+1}">${ciudad}</option>`);
  });

  //agregando los tipos
  details.tipos.forEach((tipo, i)=>{
    $("#tipo").append(`<option value="${i+1}">${tipo}</option>`);
  });

  $('select').formSelect();
}

