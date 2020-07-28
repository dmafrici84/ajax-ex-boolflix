// Milestone 1:                                                 Creare un layout base con una searchbar (una input e un button) in cui possiamo scrivere completamente o parzialmente il nome di un film. Possiamo, cliccando ilbottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente.https://api.themoviedb.org/3/movie?api_key=a8241a9208f83d8e2fe41ee42b017580. Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato: 1. Titolo 2. Titolo Originale 3. Lingua 4. Voto Milestone 2:                                                     Trasformiamo il voto da 1 a 10 decimale in un numero intero da 1 a 5, così da permetterci di stampare a schermo un numero di stelle piene che vanno da 1 a 5, lasciando le restanti vuote (troviamo le icone in FontAwesome). Arrotondiamo sempre per eccesso all’unità successiva, non gestiamo icone mezze piene (o mezze vuote :P). Trasformiamo poi la stringa statica della lingua in una vera e propria bandiera della nazione corrispondente, gestendo il caso in cui non abbiamo la bandiera della nazione ritornata dall’API (le flag non ci sono in FontAwesome). Allarghiamo poi la ricerca anche alle serie tv. Con la stessa azione di ricerca dovremo prendere sia i film che corrispondono alla query, sia le serie tv, stando attenti ad avere alla fine dei valori simili (le serie e i film hanno campi nel JSON di risposta diversi, simili ma non sempre identici) Qui un esempio di chiamata per le serie tv: https://api.themoviedb.org/3/search/tv?api_key=e99307154c6dfb0b4750f6603256716d&language=it_IT&query=scrubs                                                                     Milestone 3:                                                        In questa milestone come prima cosa aggiungiamo la copertina del film o della serie al nostro elenco. Ci viene passata dall’API solo la parte finale dell’URL, questo perché poi potremo generare da quella porzione di URL tante dimensioni diverse. Dovremo prendere quindi l’URL base delle immagini di TMDB: https://image.tmdb.org/t/p/ per poi aggiungere la dimensione che vogliamo generare (troviamo tutte le dimensioni possibili a questo link:https://www.themoviedb.org/talk/53c11d4ec3a3684cf4006400 ) per poi aggiungere la parte finale dell’URL passata dall’API. Esempio di URL che torna la copertina di BORIS: https://image.tmdb.org/t/p/w185/s2VDcsMh9ZhjFUxw77uCFDpTuXp.jpg

$(document).ready(init);

// FUNZIONI
  function init(){
    clicKBtn();
  }

  function clicKBtn() {
    var btnCerca = $("#btn-cerca");
    btnCerca.click(function(){
      var apiKey = "a8241a9208f83d8e2fe41ee42b017580";
      var cercaTitoloFilm = $("#input-cerca").val();
      var lingua = "it-IT";
      stampaFilms(apiKey,cercaTitoloFilm,lingua);
      stampaSeieTv(apiKey,cercaTitoloFilm,lingua);
    });
  }

  function stampaFilms(apiKey,cercaTitoloFilm,lingua) {
    $.ajax({
      url: "https://api.themoviedb.org/3/search/movie",
      method: "GET",
      data:{
        "api_key": apiKey ,
        "query": cercaTitoloFilm,
        "language": lingua
      },
      success: function(data, state) {
        console.log("film",data);
        var risultatoRicerca = data["results"];

        var templateFilm = $("#template-film").html();
        var compiled = Handlebars.compile(templateFilm);
        var targetListaFilms = $("#lista-films");
        targetListaFilms.html("");

        for (var i = 0; i < risultatoRicerca.length; i++) {
          var risultato = risultatoRicerca[i];

          var voto = risultatoRicerca[i]["vote_average"];
          risultato["vote_average"] = trasformaVotoInStella(voto);

          var lingua = risultato["original_language"];
          risultato["original_language"] = trasformaLinguaInBandiera(lingua);

          var copertina = risultato["poster_path"];
          risultato["poster_path"] = inserisciCopertina(copertina);

          var filmHtml = compiled (risultato);
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

  function stampaSeieTv(apiKey,cercaTitoloFilm,lingua) {
    $.ajax({
      url: "https://api.themoviedb.org/3/search/tv",
      method: "GET",
      data:{
        "api_key": apiKey ,
        "query": cercaTitoloFilm,
        "language": lingua
      },
      success: function(data, state) {
        console.log("serie tv",data);
        var risultatoRicerca = data["results"];

        var templateSerieTv = $("#template-film").html();
        var compiled = Handlebars.compile(templateSerieTv);
        var targetListaSerieTV = $("#lista-films");

        for (var i = 0; i < risultatoRicerca.length; i++) {
          var risultato = risultatoRicerca[i];

          var voto = risultatoRicerca[i]["vote_average"];
          risultato["vote_average"] = trasformaVotoInStella(voto);

          var lingua = risultato["original_language"];
          risultato["original_language"] = trasformaLinguaInBandiera(lingua);

          var copertina = risultato["poster_path"];
          risultato["poster_path"] = inserisciCopertina(copertina);

          var serieTvHtml = compiled (risultato);
          targetListaSerieTV.append(serieTvHtml)
        }
      },
      error: function(request, state, error) {
        console.log("request",request);
        console.log("state",state);
        console.log("error",error);
      }
    });
  }

  function trasformaVotoInStella(voto) {
    var votoInteroStella = Math.round(voto / 2);
    var votoStella = "";
    for (var i = 1; i <= 5; i++) {
      if(i <= votoInteroStella) {
        votoStella += '<i class="fas fa-star giallo"></i>';
      } else {
        votoStella += '<i class="far fa-star"></i>';
      }
    }
    return votoStella;
  }

  function trasformaLinguaInBandiera(lingua) {
    var bandiera = lingua;
    if (lingua === "en") {
      bandiera = '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Flag_of_the_United_Kingdom.svg/1200px-Flag_of_the_United_Kingdom.svg.png" alt="">';
      return bandiera;
    } else if (lingua === "it") {
      bandiera = '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Flag_of_Italy.svg/640px-Flag_of_Italy.svg.png" alt="">';
      return bandiera;
    } else if (lingua === "fr") {
      bandiera = '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Flag_of_France.svg/280px-Flag_of_France.svg.png" alt="">';
      return bandiera;
    } else if (lingua === "es") {
      bandiera = '<img src="https://images-na.ssl-images-amazon.com/images/I/41vY%2BlH0M2L._AC_SX450_.jpg" alt="">';
      return bandiera;
    } else if (lingua === "cn") {
      bandiera = '<img src="https://www.corriereasia.com/wp-content/uploads/bandiera-della-cina.png" alt="">';
      return bandiera;
    } else if (lingua === "ja") {
      bandiera = '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Flag_of_Japan.svg/280px-Flag_of_Japan.svg.png" alt="">';
      return bandiera;
    } else {
      return bandiera;
    }
  }

  function inserisciCopertina(copertina) {
    if (copertina != null) {
      var url = "https://image.tmdb.org/t/p/";
      var dimensioneImg = "w342";
      copertinaFilm = '<img src="'+ url + dimensioneImg + copertina + '" alt="">';
      return copertinaFilm;
    } else {
      copertinaFilm = '<img class="smile" src="img/smiley-sad.png" alt="">' + '<span class="nero">Nessuna immagine</span>';
      return copertinaFilm;
    }
  }
