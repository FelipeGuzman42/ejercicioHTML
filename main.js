const URL = "https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json";
fetch(URL).then(res=>res.json().then(res=>{
    let data = res;
    let table = document.getElementById("table1");
    let i = 1;
    data.forEach(element => {
        let tr = document.createElement('tr');
        tr.innerHTML = '<td>' + i + '</td>' +
        '<td>' + element.events + '</td>' +
        '<td>' + element.squirrel + '</td>';
        if (element.squirrel){
            tr.style.backgroundColor = "salmon";
        }
        table.appendChild(tr);
        i++;
    });
    determinarCorrelacion(data);
}))

function determinarCorrelacion(data){
    let arregloEventos = {};
    let contadorSquirrel = 0;
    let totalEventos = 0;
    let arregloEventosTP = {};
    let datosCorrelacion = {};

    data.forEach(element => element.events.forEach(e => {
        totalEventos++;
        if (element.squirrel){
            contadorSquirrel++;
            (e in arregloEventosTP) ? arregloEventosTP[e] = arregloEventosTP[e] + 1 : arregloEventosTP[e] = 1;
        }
        (e in arregloEventos) ? arregloEventos[e] = arregloEventos[e] + 1 : arregloEventos[e] = 1;
    }));
    Object.keys(arregloEventos).forEach(e => {
        if (arregloEventosTP[e])
            datosCorrelacion[e] = indiceCorrelacion(contadorSquirrel, arregloEventos[e], arregloEventosTP[e], totalEventos);
    });

    crearTablaCorrelacion(datosCorrelacion);
}

function indiceCorrelacion(totalSquirrel, totalEvento, TP, total){
    let FN = totalEvento - TP;
    let TN = (total - totalSquirrel) - FN;
    let FP = totalSquirrel - TP;
    let correlacion = (TP*TN - FP*FN)/(Math.sqrt((TP+FP)*(TP+FN)*(TN+FP)*(TN+FN)));
    return correlacion;
}

function crearTablaCorrelacion(data){
    let table = document.getElementById("table2");
    let i = 1;
    let datos = getSortedHash(data);
    Object.keys(datos).forEach(key => {
        let tr = document.createElement('tr');
        tr.innerHTML = '<td>' + i + '</td>' +
        '<td>' + key + '</td>' +
        '<td>' + datos[key] + '</td>';
        table.appendChild(tr);
        i++;
    });
}

function getSortedHash(inputHash){
    var resultHash = {};
  
    var keys = Object.keys(inputHash);
    keys.sort(function(a, b) {
      return inputHash[a] - inputHash[b]
    }).reverse().forEach(function(k) {
      resultHash[k] = inputHash[k];
    });
    return resultHash;
}