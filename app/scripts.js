/* Variable global */
var currentBalise; // sert a faire le lien entre les modifications dans les informations balise et la zone d'affichage
/*Cache les zones pour réinitialisation */
function hideZones() {
  /*document.getElementById("structureArborescente").innerHTML =
      "<h2>Structure arborescente : </h2>";*/
  /*document.getElementById("zoneAffichage").innerHTML =
      "<h2 class='titreZoneAfichage'>Zone d'affichage : </h2>";*/
  document.getElementById("infoElement").innerHTML =
    '<h2>Informations Balise :</h2><ul><li id="infoInnerHtml" class="list-group-item"></li><li id="infoTypeBalise" class="list-group-item"></li><li id="infoId" class="list-group-item"></li><li id="infoClass" class="list-group-item"></li><li id="infoTags" class="list-group-item"></li><li id="infoEnfants" class="list-group-item"></li></ul>';
}
/* Affiche les enfants pour une balise de la zone d'affichage sélectionnée
                parents : balise sélectionnée
            */
function DisplayChilds(parents) {
  document.getElementById("infoEnfants").innerHTML = "Enfants : "; // on vide les enfants existants

  var listOfChilds = document.createElement("ul");

  for (var i = 0; i < parents.children.length; ++i) {
    var child = document.createElement("li");
    child.innerHTML = parents.children[i].tagName;
    listOfChilds.appendChild(child);
  }
  document.getElementById("infoEnfants").appendChild(listOfChilds);
}

/* Affiche les tags pour une balise de la zone d'affichage sélectionnée
                    parents : balise sélectionnée
                */
function DisplayTags(parents) {
  document.getElementById("infoTags").innerHTML = "Tags : "; // on vide les enfants existants

  var listOfTags = document.createElement("ul");
  if (parents.getAttribute("tags")) {
    var tags = parents.getAttribute("tags").split(" ");
    for (var i = 0; i < tags.length; ++i) {
      var tag = document.createElement("li");
      tag.innerHTML = tags[i];
      listOfTags.appendChild(tag);
    }

    document.getElementById("infoTags").appendChild(listOfTags);
  }

  var divBootStrapp = document.createElement("div");
  divBootStrapp.className = "form-row";

  var divBootStrappInput = document.createElement("div");
  divBootStrappInput.className = "form-col-md-6";

  var divBootStrappButton = document.createElement("div");
  divBootStrappButton.className = "form-col-md-6";

  var inputAddTag = document.createElement("input");
  inputAddTag.id = "inputTag";
  inputAddTag.type = "text";
  inputAddTag.placeholder = "Entrez le tag";
  inputAddTag.className = "form-control";

  var inputSubmitAddTag = document.createElement("input");
  inputSubmitAddTag.type = "button";
  inputSubmitAddTag.value = "Ajouter un tag";
  inputSubmitAddTag.className = "btn btn-success";

  inputSubmitAddTag.addEventListener("click", function(e) {
    addTag();
  });

  divBootStrappInput.appendChild(inputAddTag);
  divBootStrappButton.appendChild(inputSubmitAddTag);

  divBootStrapp.appendChild(divBootStrappInput);
  divBootStrapp.appendChild(divBootStrappButton);

  document.getElementById("infoTags").appendChild(divBootStrapp);
}

/*
    Permet d'afficher les informations pour une balise données
    childrens : Les éléments de la zone d'affichage
*/
function getInfoElement(childrens) {
  for (var child of childrens) {
    if (child.classList.contains("titreZoneAfichage")) {
      //il ne faut pas ajouter d'evenement au titre
      continue; // on continue la boucle
    }
    if (child.children.length !== 0) {
      getInfoElement(child.children);
    }
    child.addEventListener("mousedown", function(e) {
      e.stopPropagation(); // stop la propagation de l'événement pour eviter d'appeler tout les conteneurs de l'element courant
      currentBalise = this;
      document.getElementById("infoInnerHtml").innerHTML =
        "InnerHtml de la balise : " + this.innerHTML;
      document.getElementById("infoTypeBalise").innerHTML =
        "Type de balise : " + this.tagName;
      document.getElementById("infoId").innerHTML = "Id : " + this.id;
      document.getElementById("infoClass").innerHTML =
        "Class : " + this.classList;
      DisplayChilds(this);
      DisplayTags(this);
    });
  }
}
/*
    Ajoute des balise <xmp> pour ne pas interpréter du XML ou HTML
    string : chaine de caractère à modifier
*/
function addXMP(string) {
  var stringWithXMP = "<xmp>" + string + "</xmp>";
  return stringWithXMP;
}

/*
    Ajoute des balise <div> pour le survol
    string : chaine de caractère à modifier
*/
function addDisplayTag(string) {
  var stringWithDiv = "<div>" + string + "</div>";
  return stringWithDiv;
}

/*
    Récupère l'extension d'un champ
    filename: fichier uploader
*/
function getExtension(filename) {
  var parts = filename.split(".");
  return parts[parts.length - 1];
}

/*
    Vérifie l'extension d'un fichier uploadé
    champ : id du champ type file
    listeExt : liste des extensions autorisées
*/
function verifFileExtension(champ, listeExt) {
  filename = document.getElementById(champ).value.toLowerCase();
  fileExt = getExtension(filename);
  for (i = 0; i < listeExt.length; i++) {
    if (fileExt == listeExt[i]) {
      return true;
    }
  }
  return false;
}

/*
    Demande la fonction de visualisation
    onclick => button 'visualiser'
*/
function visualize() {
  hideZones();

  /* Permet d'afficher les barre horizontale*/
  function hrDisplay() {
    for (
      var i = 0;
      i < document.getElementsByClassName("separationV").length;
      ++i
    ) {
      document.getElementsByClassName("separationV")[i].style.display = "block";
    }
    for (
      var i = 0;
      i < document.getElementsByClassName("separationH").length;
      ++i
    ) {
      document.getElementsByClassName("separationH")[i].style.display = "block";
    }
  }

  allowsTypes = new Array("html", "xml");
  if (document.getElementById("urlInput").value) {
    var xhr = new XMLHttpRequest();
    var parser = new DOMParser();
    var pathFile = document.getElementById("urlInput").value;
    xhr.open("GET", pathFile, false);
    xhr.send(null);
    if (xhr.status === 200) {
      document.getElementById("errorAjax").innerHTML = "";
      console.log(
        "Réponse reçue: \n-------------\n",
        xhr.response,
        "\n-------------"
      );
      document.getElementById("structureArborescente").innerHTML = addXMP(
        xhr.response
      );
      document.getElementById("zoneAffichage").innerHTML = xhr.response;
      hrDisplay();
      document.getElementById("urlInput").value = "";
    } else {
      console.log("Status de la réponse: %d (%s)", xhr.status, xhr.statusText);
      document.getElementById("errorAjax").innerHTML =
        "<span class='warn'>Il y a eu un problème lors de la requête AJAX</span>";
      document.getElementById("uploadInput").value = "";
      document.getElementById("urlInput").value = "";
    }
  } else if (verifFileExtension("uploadInput", allowsTypes)) {
    document.getElementById("errorAjax").innerHTML = "";
    var reader = new FileReader();
    reader.addEventListener("load", function() {
      // document.querySelector('#uploadInput').files[0].name + '" :\n\n' +
      document.getElementById("structureArborescente").innerHTML = addXMP(
        reader.result
      );
      document.getElementById("zoneAffichage").innerHTML = reader.result;
      hrDisplay();
      document.getElementById("uploadInput").value = "";

      getInfoElement(document.getElementById("zoneAffichage").children);
    });
    reader.readAsText(document.querySelector("#uploadInput").files[0]);
  } else {
    alert(
      "Vous devez uploadez ou renseignez un fichier au format HTML ou XML !"
    );
    document.getElementById("uploadInput").value = "";
    document.getElementById("urlInput").value = "";
  }
}

/* Liaison AJAX avec le Back */

/*
    Requete AJAX pour enregistrer le document visualiser
*/
function enregistrerDocument() {
  /* Fonction qui transform la zone d'affichage en document JSON */
  function getDocOnJSON() {
    var element = Object.assign(document.querySelector("#zoneAffichage *"));
    var html = element.outerHTML;
    var data = { html: html };
    var json = JSON.stringify(data);
    //var jsonReformate = json.substr(43, json.length - 51); // enleve le debut et la fin de chaine qui sont rajoute par l'application
    var debut = '{"html":"';
    var fin = '"}';
    var jsonReformate = debut + json + fin;
    console.log(json);

    return json;
  }
  getDocOnJSON();

  var req = new XMLHttpRequest();
  var url = "http://127.0.0.1:5000/document/register";
  req.open("POST", url, false);
  req.setRequestHeader("Content-Type", "application/json");
  var txt = getDocOnJSON();
  req.send(txt);

  if (req.status === 200) {
    var reponse = JSON.parse(req.response);
    document.getElementById("errorAjax").innerHTML =
      "Enregistrement réussi ! ID : " + reponse.result.id;
    console.log(
      "Réponse reçue: \n-------------\n",
      req.response,
      "\n-------------"
    );
  } else {
    console.log("Status de la réponse: %d (%s)", req.status, req.statusText);
    document.getElementById("errorAjax").innerHTML =
      "<span class='warn'>Il y a eu un problème lors de la requête AJAX</span>";
  }
}

/*
    Requete AJAX pour récupérer un document enregistrer
*/
function recupererDocument() {
  hideZones();
  var id = document.getElementById("urlInputGetDocument").value;
  if (id) {
    var req = new XMLHttpRequest();
    var url = "http://127.0.0.1:5000/document";
    req.open("POST", url, false);
    req.setRequestHeader("Content-Type", "application/json");
    var data = { id_doc: id };
    var txt = JSON.stringify(data);
    req.send(txt);
    if (req.status === 200) {
      var reponse = JSON.parse(req.response);
      console.log(reponse);
      document.getElementById("errorAjax").innerHTML = "Récupération réussi !";
      console.log(
        "Réponse reçue: \n-------------\n",
        req.response,
        "\n-------------"
      );
      document.getElementById("structureArborescente").innerHTML = addXMP(
        reponse.result.html
      );
      document.getElementById("zoneAffichage").innerHTML = reponse.result.html;
      getInfoElement(document.getElementById("zoneAffichage").children);
    } else {
      console.log("Status de la réponse: %d (%s)", req.status, req.statusText);
      document.getElementById("errorAjax").innerHTML =
        "<span class='warn'>Il y a eu un problème lors de la requête AJAX</span>";
    }
  } else {
    document.getElementById("errorAjax").innerHTML =
      "<span class='warn'>Vous n'avez pas indiqué d'identifiant à récupéré</span>";
  }
}

/* Gestion de tags */

/*
    Ajouter un tag à un élément
*/
function addTag() {
  var tagToAdd = document.getElementById("inputTag").value;
  var tag = document.createElement("li");
  tag.innerHTML = tagToAdd;
  document.getElementById("infoTags").appendChild(tag);
  var newTags;
  var currentTags = currentBalise.getAttribute("tags");
  if (currentTags) {
    newTags = currentTags + " " + tagToAdd;
  } else {
    newTags = tagToAdd;
  }
  currentBalise.setAttribute("tags", newTags);
}
