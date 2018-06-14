function connexion() {
  var login = document.getElementById("name").value;
  var psw = document.getElementById("paw").value;
  if (login && psw) {
    var req = new XMLHttpRequest();
    var url = "http://localhost:5000/user";
    req.open("POST", url, false);
    req.setRequestHeader("Content-Type", "application/json");
    var data = { name: login, psw: psw };
    var txt = JSON.stringify(data);
    req.send(txt);
    if (req.status === 200) {
      document.getElementById("reponseAjax").innerHTML =
        "Connexion réussi !";
      console.log(
        "Réponse reçue: \n-------------\n",
        req.response,
        "\n-------------"
      );
      document.location.href="./index.html"; 
    } else {
      console.log("Status de la réponse: %d (%s)", req.status, req.statusText);
      document.getElementById("reponseAjax").innerHTML =
        "<span class='warn'>Il y a eu un problème lors de la requête AJAX</span>";
    }
  } else {
    alert("le login ou psw n'existe pas !");
  }
}

/*
    Permet l'enregistrement d'un utilisateur sur le serveur 
*/
function register() {
  var login = document.getElementById("name").value;
  var psw = document.getElementById("paw").value;
  if (login && psw) {
    var req = new XMLHttpRequest();
    var url = "http://localhost:5000/register";
    req.open("POST", url, false);
    req.setRequestHeader("Content-Type", "application/json");
    var data = { name: login, psw: psw };
    var txt = JSON.stringify(data);
    req.send(txt);
    if (req.status === 200) {
      document.getElementById("reponseAjax").innerHTML =
        "Enregistrement réussi !";
      console.log(
        "Réponse reçue: \n-------------\n",
        req.response,
        "\n-------------"
      );
    } else {
      console.log("Status de la réponse: %d (%s)", req.status, req.statusText);
      document.getElementById("reponseAjax").innerHTML =
        "<span class='warn'>Il y a eu un problème lors de la requête AJAX</span>";
    }
  } else {
    alert("le login ou psw n'existe pas !");
  }
}
