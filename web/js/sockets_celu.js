var connection = null;
var jugador_id = null;

//Convierto el json de un array.	
function json_msj(array) {
  return JSON.stringify(array)
}

//Analizo los mensajes enviados por el servidor.
function analizar_json(json) {
  let obj = JSON.parse(json);

  if (obj.type == 'player_conect_ok') {
    $("#conex_status").html("CONNECTION OK");
    connection.send(json_msj({ type: 'request_question' }));
    jugador_id = obj.newid;
  }

  if (obj.type == 'game_questions') {
    dibujar_botonera(obj.lista);
  }

  if (obj.type == 'win') {
    // swal("¡Respuesta Correcta!","Continúa","success");
    alertify.success('Correct Answer!');
  }

  if (obj.type == 'nobody_win') {
    // swal("Respuesta Incorrecta");
    alertify.error('Incorrect');
  }
}

//Envio la respuesta al boton.
function enviar_respuesta(id) {
  connection.send(json_msj({ type: 'reply', resultado: id, id: jugador_id }));
}

$(function () {
  // if user is running mozilla then use it's built-in WebSocket
  window.WebSocket = window.WebSocket || window.MozWebSocket;
  connection = new WebSocket('ws://127.0.0.1:3000');

  //Cuando se abre la conexion.
  connection.onopen = function () {

    //Cuando la conexion se establece me pide el nicknake, para enviarlo al servidor.    
    swal("Enter your name", {
      content: "input",
    })
    .then((person) => {
      if (person != null) {
        alertify.success('Welcome '+person);
        connection.send(json_msj({ type: 'player_conect', name: person }));
        $("#txt_titulo").html("<b>" + person + "</b>" + " - Choose your answer");
      }
    });
  };

  //Cuando se produce un error en la conexion.
  connection.onerror = function (error) {
    $("#conex_status").html("ERROR CONNECTION");
  };

  //Cuando se recibe un mensaje.
  connection.onmessage = function (message) {
    try {
      analizar_json(message.data);
    }
    catch (e) {
      alert('JSON no valido: ', e.message);
      return;
    }
  };
});