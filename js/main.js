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
            //console.log(arrayJson);
    
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
    tdid.style = "display:none;";

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
    var ventana = $("editMateria");

    ventana.hidden = false;

    var tabla = $("tabla");
    var fila = e.target.parentNode;
    var nombre=fila.childNodes[0].childNodes[0].nodeValue;
    var cuatrimestre=fila.childNodes[1].childNodes[0].nodeValue;
    var fecha=fila.childNodes[2].childNodes[0].nodeValue;
    var turno=fila.childNodes[3].childNodes[0].nodeValue;

    $("txtNombre").value = nombre;
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

} 