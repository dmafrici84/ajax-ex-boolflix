// Milestone 1:
// Creare un layout base con una searchbar (una input e un button) in cui possiamo scrivere completamente o parzialmente il nome di un film. Possiamo, cliccando ilbottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente.https://api.themoviedb.org/3/movie?api_key=a8241a9208f83d8e2fe41ee42b017580. Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato: 1. Titolo 2. Titolo Originale 3. Lingua 4. Voto
// Milestone 2:
// Trasformiamo il voto da 1 a 10 decimale in un numero intero da 1 a 5, così da permetterci di stampare a schermo un numero di stelle piene che vanno da 1 a 5, lasciando le restanti vuote (troviamo le icone in FontAwesome). Arrotondiamo sempre per eccesso all’unità successiva, non gestiamo icone mezze piene (o mezze vuote :P). Trasformiamo poi la stringa statica della lingua in una vera e propria bandiera della nazione corrispondente, gestendo il caso in cui non abbiamo la bandiera della nazione ritornata dall’API (le flag non ci sono in FontAwesome). Allarghiamo poi la ricerca anche alle serie tv. Con la stessa azione di ricerca dovremo prendere sia i film che corrispondono alla query, sia le serie tv, stando attenti ad avere alla fine dei valori simili (le serie e i film hanno campi nel JSON di risposta diversi, simili ma non sempre identici) Qui un esempio di chiamata per le serie tv: https://api.themoviedb.org/3/search/tv?api_key=e99307154c6dfb0b4750f6603256716d&language=it_IT&query=scrubs

$(document).ready(init);

// FUNZIONI
  function init(){
    clicKBtn();
  }

  function clicKBtn() {
    var btnCerca = $("#btn-cerca");
    btnCerca.click(stampaFilms);
  }

  function stampaFilms() {
    var apiKey = "a8241a9208f83d8e2fe41ee42b017580";
    var cercaTitoloFilm = $("#input-cerca").val();
    var lingua = "it-IT";

    $.ajax({
      url: "https://api.themoviedb.org/3/search/movie",
      method: "GET",
      data:{
        "api_key": apiKey ,
        "query": cercaTitoloFilm,
        "language": lingua
      },
      success: function(data, state) {

        var risultatoRicerca = data["results"];

        var templateFilm = $("#template-film").html();
        var compiled = Handlebars.compile(templateFilm);
        var targetListaFilms = $("#lista-films");
        targetListaFilms.html("");

        for (var i = 0; i < risultatoRicerca.length; i++) {
          var voto = risultatoRicerca[i]["vote_average"];
          var votoTrasformato = trasformaNumInStella(voto);
          var filmHtml = compiled ({
            "title": risultatoRicerca[i]["title"],
            "original_title": risultatoRicerca[i]["original_title"],
            "original_language": risultatoRicerca[i]["original_language"],
            "vote_average": votoTrasformato
          });
          targetListaFilms.append(filmHtml)
        }
      },
      error: function(request, state, error) {
        console.log("request",request);
        console.log("state",state);
        console.log("error",error);
      }
    });
  }

  function trasformaNumInStella(voto) {
    var votoInteroStella = Math.round(voto / 2);
    var targetVoto = $("#voto");
    targetVoto.html("");
    for (var i = 1; i <= 5; i++) {
      if(i <= votoInteroStella) {
        var votoStella = targetVoto.append('<i class="fas fa-star"></i>');
      } else {
        var votoStella = targetVoto.append('<i class="far fa-star"></i>');
      }
    }
  }
