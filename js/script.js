// Milestone 1:
// Creare un layout base con una searchbar (una input e un button) in cui possiamo
// scrivere completamente o parzialmente il nome di un film. Possiamo, cliccando il
// bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente.
// https://api.themoviedb.org/3/movie?api_key=a8241a9208f83d8e2fe41ee42b017580
// Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni
// film trovato:
// 1. Titolo
// 2. Titolo Originale
// 3. Lingua
// 4. Voto

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
        console.log(data);
        var risultatoRicerca = data["results"];

        var templateFilm = $("#template-film").html();
        var compiled = Handlebars.compile(templateFilm);
        var targetListaFilms = $("#lista-films");
        targetListaFilms.html("");
        for (var i = 0; i < risultatoRicerca.length; i++) {
          var filmHtml = compiled ({
            "title": risultatoRicerca[i]["title"],
            "original_title": risultatoRicerca[i]["original_title"],
            "original_language": risultatoRicerca[i]["original_language"],
            "vote_average": risultatoRicerca[i]["vote_average"]
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
