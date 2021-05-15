window.addEventListener("load", httpLoader);

function $(id) {
    return document.getElementById(id);
}

function httpLoader()
{
    var tabla=$("tabla");
    var peticion=new XMLHttpRequest();  
    peticion.open("GET","http://localhost:3000/materias",true);
    peticion.send();
    $("spinner").hidden = false;

    peticion.onreadystatechange = function()
    {
        if(peticion.status== 200 && peticion.readyState == 4)
        {
            $("spinner").hidden = true;
            var arrayJson=JSON.parse(peticion.responseText);
    
            for (let index = 0; index < arrayJson.length; index++) 
            {
                nuevaFila(arrayJson[index],tabla);
            }

        }
    }
}

function nuevaFila(materia,tabla)
{
    var id = materia.id;
    var nombre=materia.nombre;
    var cuatrimestre = materia.cuatrimestre;
    var fecha = materia.fechaFinal;
    var turno = materia.turno;

    var nuevaFila=document.createElement("tr");

    var tdid = document.createElement("td");
    var tdnombre = document.createElement("td");
    var tdcuatrimestre = document.createElement("td");
    var tdfecha = document.createElement("td");
    var tdturno = document.createElement("td");

    tdid.appendChild(document.createTextNode(id));
    tdnombre.appendChild(document.createTextNode(nombre));
    tdcuatrimestre.appendChild(document.createTextNode(cuatrimestre));
    tdfecha.appendChild(document.createTextNode(fecha));
    tdturno.appendChild(document.createTextNode(turno));
    //tdid.style = "display:none;";

    nuevaFila.appendChild(tdnombre);
    nuevaFila.appendChild(tdcuatrimestre);
    nuevaFila.appendChild(tdfecha);
    nuevaFila.appendChild(tdturno);
    nuevaFila.appendChild(tdid);
    
    nuevaFila.addEventListener("dblclick", editarFila);

    tabla.appendChild(nuevaFila);
}

function editarFila(e)
{
    $("error").hidden = true;
    var ventana = $("editMateria");

    ventana.hidden = false;

    var tabla = $("tabla");
    var fila = e.target.parentNode;
    var nombre = fila.childNodes[0].childNodes[0].nodeValue;
    var cuatrimestre = fila.childNodes[1].childNodes[0].nodeValue;
    var fecha = fila.childNodes[2].childNodes[0].nodeValue;
    var turno = fila.childNodes[3].childNodes[0].nodeValue;
    var id = fila.childNodes[4].childNodes[0].nodeValue;

    $("txtNombre").value = nombre;
    $("selectCuatrimestre").value = cuatrimestre;
    $("dateFecha").value = fecha;

    if (turno == "Mañana") {
        $("turnoManana").checked = true;
    }
    else{
        $("turnoNoche").checked = true;
    }

    //CANCELAR
    $("btnCancelar").onclick=function()
    {
        editMateria.hidden=true;
    }

    //MODIFICAR
    $("btnModificar").onclick=function()
    {
        let validoNombre =true;
        let validoFecha =true;
        let validoTurno =true;
        let errorMsg = "";

        if ($("txtNombre").value.length < 6) 
        {
            validoNombre = false;
            errorMsg = errorMsg.concat("Nombre debe ser superior a 6.<br>");
        }
        if (new Date($("dateFecha").value)<= new Date(Date.now())) {
            validoFecha = false;
            errorMsg = errorMsg.concat("Fecha debe ser posterior a hoy.<br>");
        }
        if (!($("turnoManana").checked || $("turnoNoche").checked))
        {
            validoTurno = false;
            errorMsg = errorMsg.concat("Turno debe ser seleccionado.<br>");
        }

        if(validoNombre && validoFecha && validoTurno)
        {
            var nombreInput = $("txtNombre").value;
            var cuatrimestreInput= $("selectCuatrimestre").value;
            var fechaInput = $("dateFecha").value;
            var turnoInput = "Noche";
            if($("turnoManana".checked))
            {
                turnoInput = "Mañana";
            }

            var jsonMateria={
                "nombre":nombreInput,
                "cuatrimestre":cuatrimestreInput,
                "fecha":fechaInput,
                "turno":turnoInput
            }

            var peticion=new XMLHttpRequest();
            peticion.open("POST","http://localhost:3000/editar");
            peticion.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            peticion.send(JSON.stringify(jsonMateria));
            $("spinner").hidden=false;

            peticion.onreadystatechange= function() 
            {
                
                if(peticion.status == 200 && peticion.readyState == 4)
                {
                    $("spinner").hidden=true;
                    
                    fila.childNodes[0].childNodes[0].nodeValue=nombreInput;
                    fila.childNodes[1].childNodes[0].nodeValue=cuatrimestreInput;
                    fila.childNodes[2].childNodes[0].nodeValue=fechaInput;
                    fila.childNodes[3].childNodes[0].nodeValue=turnoInput;
                }


            }



        }
        else
        {
            $("error").hidden = false;
            $("error").innerHTML = errorMsg;
        }



    }

} 