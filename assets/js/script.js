let heroes_agregados_arr = []

$(function () {
    $(document).keypress(e=>{
        if(e.wich ==13){ //code 13 == tecla enter
            buscarHeroe()
        }
    })

    $(`#buscar`).click(() => {
        buscarHeroe()

        limpiar();
    })
   
    
});

function buscarHeroe() {
    let id_heroe = $(`#input_busqueda`).val()
    //validación
    //guardia
    if (validacion(id_heroe) == false) {
        //error de validacion
        errorInput()
        return;
    }

    //get al personaje

    getHeroe(id_heroe)
    getAllpowers(id_heroe)

}

function validacion(id) {
    let expresion = /^\d{1,3}$/;

    if (expresion.test(id)) {
        return true
    }

    return false
}

function errorInput() {
    alert(`ID invalido`);
    $(`#input_busqueda`).focus();
}

function getHeroe(id) {
    $.ajax({
        type: "GET",
        url: `https://superheroapi.com/api.php/6283845958322307/${id}`,
        success: function (heroe) {
            $(`#card`).empty();
            $(`#card`).append(imprimirCard(heroe))
            addPowerheroe(heroe)
            imprimirGrafico(heroe)
            $(`#input_busqueda`).val("")
        },

        error: function (error) {
            console.log(error)
        }
    });
}

function imprimirCard(heroe) {
    let card = `
    <div class="col-sm-12">
        <div class="card mb-3" style="max-width: 80rem;">
        <div class="row no-gutters">
        <div class="col-md-4">
            <img src="${heroe.image.url}" class="img-fluid"  alt="...">
            </div>
            <div class="col-md-8">
            <div class="card-body">
                <h5 class="card-title">Nombre:${heroe.name}</h5>
                <p>Conexiones:${heroe[`connections`][`group-affiliation`]}</p>
                <p class="mx-3">Publicado por: ${heroe[`biography`][`publisher`]}
                <hr>
                <p class="mx-3">Ocupación: ${heroe[`work`][`occupation`]} </p>
                <hr>
                <p class="mx-3">Primera aparición: ${heroe[`biography`][`first-appearance`]}</p>
                <hr>
                <p class="mx-3">Altura: ${heroe[`appearance`][`height`]}</p>
                <hr>
                <p class="mx-3">Peso: ${heroe[`appearance`][`weight`]}</p>
                <hr>
                <p class="mx-3">Alianzas: ${heroe[`biography`][`aliases`]}</p>
            </div>
            </div>
        </div>
        </div>
    </div>`

    return card;

}

function limpiar(){
    $('#card').empty();
    $('#grafico').empty();
    heroes_agregados_arr = []
    $('#input_busqueda').focus();

}

function getAllpowers(id) {
    $.ajax({
        type: "GET",
        url: `https://superheroapi.com/api.php/6283845958322307/${id}/powerstats`,
        success: function (powers) {
            console.log(powers)
        },
        error: function (error) {
            console.log(error)
        }
    });
}

function powers() {
    getAllpowers()
}


function addPowerheroe(heroe) {
    //console.log(heroe.powerstats)

    for (let stats in heroe.powerstats) {
        console.log(stats)
        console.log(heroe.powerstats[stats])
        let statsObject = {
            label: stats,
            y: heroe.powerstats[stats]
        }

        heroes_agregados_arr.push(statsObject)
    }

}

function imprimirGrafico(heroe) {
    let info = {
        title: {
            text: `Estadísticas de Poder para ${heroe.name} `
        },
        data: [
            {
                type: "pie",
                startAngle: 40,
                toolTipContent: "<b>{label}</b>: {y}%",
                showInLegend: "true",
                legendText: "{label}",
                indexLabelFontSize: 16,
                indexLabel: "{label} ({y})",
                dataPoints: heroes_agregados_arr
            }
        ]
    }
    $(`#grafico`).CanvasJSChart(info)
}