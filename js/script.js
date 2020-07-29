// Milestone 1:                                                 Creare un layout base con una searchbar (una input e un button) in cui possiamo scrivere completamente o parzialmente il nome di un film. Possiamo, cliccando ilbottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente.https://api.themoviedb.org/3/movie?api_key=a8241a9208f83d8e2fe41ee42b017580. Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato: 1. Titolo 2. Titolo Originale 3. Lingua 4. Voto Milestone 2:                                                     Trasformiamo il voto da 1 a 10 decimale in un numero intero da 1 a 5, così da permetterci di stampare a schermo un numero di stelle piene che vanno da 1 a 5, lasciando le restanti vuote (troviamo le icone in FontAwesome). Arrotondiamo sempre per eccesso all’unità successiva, non gestiamo icone mezze piene (o mezze vuote :P). Trasformiamo poi la stringa statica della lingua in una vera e propria bandiera della nazione corrispondente, gestendo il caso in cui non abbiamo la bandiera della nazione ritornata dall’API (le flag non ci sono in FontAwesome). Allarghiamo poi la ricerca anche alle serie tv. Con la stessa azione di ricerca dovremo prendere sia i film che corrispondono alla query, sia le serie tv, stando attenti ad avere alla fine dei valori simili (le serie e i film hanno campi nel JSON di risposta diversi, simili ma non sempre identici) Qui un esempio di chiamata per le serie tv: https://api.themoviedb.org/3/search/tv?api_key=e99307154c6dfb0b4750f6603256716d&language=it_IT&query=scrubs                                                                     Milestone 3:                                                        In questa milestone come prima cosa aggiungiamo la copertina del film o della serie al nostro elenco. Ci viene passata dall’API solo la parte finale dell’URL, questo perché poi potremo generare da quella porzione di URL tante dimensioni diverse. Dovremo prendere quindi l’URL base delle immagini di TMDB: https://image.tmdb.org/t/p/ per poi aggiungere la dimensione che vogliamo generare (troviamo tutte le dimensioni possibili a questo link:https://www.themoviedb.org/talk/53c11d4ec3a3684cf4006400 ) per poi aggiungere la parte finale dell’URL passata dall’API. Esempio di URL che torna la copertina di BORIS: https://image.tmdb.org/t/p/w185/s2VDcsMh9ZhjFUxw77uCFDpTuXp.jpg                               Milestone 4:                                                   Trasformiamo quello che abbiamo fatto fino ad ora in una vera e propria webapp, creando un layout completo simil-Netflix:            ● Un header che contiene logo e search bar                           ● Dopo aver ricercato qualcosa nella searchbar, i risultati appaiono sotto forma di “card” in cui lo sfondo è rappresentato dall’immagine di copertina ( consiglio la poster_path con w342 )                   ● Andando con il mouse sopra una card (on hover), appaiono le informazioni aggiuntive già prese nei punti precedenti più la overview

$(document).ready(init);

// FUNZIONI
  function init(){
    clicKSearch();
    keyupInput();
    appareScompareSuccessivo();
    clickMenuHamburger();
  }

  function clicKSearch() {
    var btnCerca = $("#cerca");
    btnCerca.click(avvioFilmSerieTv);
  }

  function keyupInput() {
    var inputCerca = $("#input-cerca");
    inputCerca.keyup(sendKeyupInput);
  }

  function sendKeyupInput(event) {
    var tasto = event.which;
    var input = $ (this).val();
    if (tasto == 13 && input.length > 0) {
      avvioFilmSerieTv();
    }
  }

  function avvioFilmSerieTv() {
    var apiKey = "a8241a9208f83d8e2fe41ee42b017580";
    var cercaTitolo = $("#input-cerca").val();
    var lingua = "it-IT";
    var targetListaFilms = $("#lista-films");
    targetListaFilms.html("");
    var targetListaSerieTv = $("#lista-serie");
    targetListaSerieTv.html("");
    stampaFilms(apiKey,cercaTitolo,lingua,targetListaFilms);
    stampaSerieTv(apiKey,cercaTitolo,lingua,targetListaSerieTv);
  }

  function stampaFilms(apiKey,cercaTitolo,lingua,targetListaFilms) {
    $.ajax({
      url: "https://api.themoviedb.org/3/search/movie",
      method: "GET",
      data:{
        "api_key": apiKey ,
        "query": cercaTitolo,
        "language": lingua
      },
      success: function(data, state) {
        var cinema = $("#cinema").removeClass("invisibile");
        addTemplete(data,targetListaFilms);
      },
      error: function(request, state, error) {
        console.log("request",request);
        console.log("state",state);
        console.log("error",error);
      }
    });
  }

  function stampaSerieTv(apiKey,cercaTitolo,lingua,targetListaSerieTv) {
    $.ajax({
      url: "https://api.themoviedb.org/3/search/tv",
      method: "GET",
      data:{
        "api_key": apiKey ,
        "query": cercaTitolo,
        "language": lingua
      },
      success: function(data, state) {
        var serieTV = $("#serie-tv").removeClass("invisibile");
        addTemplete(data,targetListaSerieTv);
      },
      error: function(request, state, error) {
        console.log("request",request);
        console.log("state",state);
        console.log("error",error);
      }
    });
  }

  function addTemplete(data,target) {
    var risultatoRicerca = data["results"];

    var templateFilmSerie = $("#template-film-serie").html();
    var compiled = Handlebars.compile(templateFilmSerie);

    for (var i = 0; i < risultatoRicerca.length; i++) {
      var risultato = risultatoRicerca[i];

      var voto = risultatoRicerca[i]["vote_average"];
      risultato["vote_average"] = trasformaVotoInStella(voto);

      var lingua = risultato["original_language"];
      risultato["original_language"] = trasformaLinguaInBandiera(lingua);

      var copertina = risultato["poster_path"];
      risultato["poster_path"] = inserisciCopertina(copertina);

      var filmSerieHtml = compiled (risultato);
      target.append(filmSerieHtml);
    }
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
    if (lingua === "en" || lingua === "it" || lingua === "fr" ||      lingua === "es" || lingua === "cn" || lingua === "ja") {
      bandiera = `<img src="img/${lingua}.png" alt="">`;
      return bandiera;
    }
    return bandiera;
  }

  function inserisciCopertina(copertina) {
    if (copertina != null) {
      var url = "https://image.tmdb.org/t/p/";
      var dimensioneImg = "w342";
      copertinaFilm = '<img src="'+ url + dimensioneImg + copertina + '" alt="">';
      return copertinaFilm;
    } else {
      copertinaFilm = '<img class="smile" src="img/smiley-sad.png" alt="">' + '<span class="colore-1 ">Nessuna immagine</span>';
      return copertinaFilm;
    }
  }

  function appareScompareSuccessivo() {
    appareSuccessivo();
    scompareSuccessivo();
  }

  function appareSuccessivo() {
    $(".contenitore-lista").mouseenter(function(){
      successivo = $(this).children(".successivo")
      successivo.removeClass("invisibile");
      successivo.click(apparePrecedente);
    });
  }

  function scompareSuccessivo() {
    $(".contenitore-lista").mouseleave(function(){
      $(this).children(".successivo").addClass("invisibile");
      $(this).children(".precedente").addClass("invisibile");
    });
  }

  function apparePrecedente() {
    $(this).siblings(".precedente").removeClass("invisibile");
  }

  function clickMenuHamburger() {
    clickApriHamburger();
    clicKChiudiHamburger();
  }

  function clickApriHamburger() {
    var btnApriHamburger = $(".hamburger .fa-bars");
    btnApriHamburger.click(function() {
      $(".hamburger-menu").addClass("visibile");
    });
  }

  function clicKChiudiHamburger() {
    var btnChiudiHamburger = $(".chiudi");
    btnChiudiHamburger.click(function() {
      $(".hamburger-menu").removeClass("visibile");
    });
  }
