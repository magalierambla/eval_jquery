$(function(){
	
	var bodyBloc; // Div qui s'attache à l'élément Body et qui contient une autre Div appelée listeBloc
	var listeBloc; // listeBloc qui contient toutes les listes
	var data = ""; // variable globale qui contient les données JSON, lut nativement par JS
	var idCount = 0; 

	$('#validation').on('click', function(){
		$('.cacher').hide();
		connexion();
	});

	$('#signup').on('click', function(e){
		e.preventDefault();

		inscription();
	})

	$('#signup').on('click', function(e){
		e.preventDefault();

		document.location.href="signup.html";
	});
	$('#form_login').on('click', function(e){
		e.preventDefault();

		document.location.href="login.html";
	});
	
	// f° qui enregistre les data données et les post en JSON sur le serveur POSTMAN
	function enregistrerDonnee() {
		$.ajax({
			type: "post",
			data: JSON.stringify(data),
			contentType: "application/json; charset=utf-8",
			url: "http://92.222.69.104/todo/listes"
		}).done(function(d) {
//				console.log(d);
		});
	}

	function inscription(){
		var n = $("#loginRegister").val();
		var p = $("#passwordRegister").val();
		var c = $("#passwordConfirmRegister").val();

		$("#errorConfirm").hide();
		$("#errorFieldEmpty").hide();
		$("#successMsg").hide();

		if (p != c) {
			$("#errorConfirm").show();
			return;
		}
		if (n == "" || p == "" || c == "") {
			$("#errorFieldEmpty").show();
			return;
		}

		$.ajax({
			url: "http://92.222.69.104/todo/create/" + n + "/" + p
		}).done(function(d) {
			console.log(d);
		});
		$("#successMsg").show();
	}

	function connexion(pseudo = '', password = '') {	
		var n =  $("#validationServerUsername").val();
		var p =  $("#validationServerPassword").val();

		//var n = "Magalie"; // variable en dur plus rapide pour tester
		//var p = "LOUMI";  // variable en dur plus rapide pour tester

		$.ajax({
		url: "http://92.222.69.104/todo/listes",
		headers: {"login" : n, "password" : p}
		}).done(function(d) {
			$("#inscription").hide();
			$("#register").hide();
			data = d;
			afficherTout();
		});
	}

	function afficherTout() {
			bodyBloc = $("<div/>");
			bodyBloc.appendTo('body');
			listeBloc = $("<div/>").addClass("row m-3");
			listeBloc.appendTo(bodyBloc);
		
			for (var i = 0; i < data.todoListes.length; i++){
				afficherListe(data.todoListes[i]);
			}
			ajouterListe();
	}
	function afficherListe(liste) {
			var bloc = $("<div class='liste col-md-4'/>").attr({
				id: idCount
			});
			listeBloc.append(bloc);

			var titre = $("<h3/>");
			titre.append(liste.name);
			bloc.append(titre);
			titre.click(function() {
				listeHTML.slideToggle(400);
			});

			var listeHTML = $("<ul/>");
			bloc.append(listeHTML);
			for (var i = 0; i < liste.elements.length; i++) {
				afficherElement(liste.elements[i], listeHTML, liste.name);
			}
			ajouterElement(bloc, listeHTML, idCount, liste.name);
			idCount++;
	}
		function ajouterListe() {
			boutonAjout = $("<button class='add_new_list' title='Ajouter une nouvelle list'>Ajouter une liste</button>");  // Pour la création de nouvelle fiche, carte de liste
			bodyBloc.append(boutonAjout);

			var texteAjout = $("<input class='add_new_list' type='text' value='' placeholder='Entrez votre nouvelle liste'>");
			bodyBloc.append(texteAjout);     // Pour ajouter du texte correspondant à une nouvelle liste 
			texteAjout.hide();
			
			var boutonValider = $("<input type='button' value='OK'>");
			boutonValider.addClass('valid');   // Ajout d'une classe pour modifier le bouton valider en CSS
			bodyBloc.append(boutonValider);   // Pour valider le texte de ma nouvelle liste
			boutonValider.hide();
			
			boutonAjout.click(function() {
				// action: cacher le Bouton à cliquer pour ajouter du texte dans un champs
				boutonAjout.hide();         
				texteAjout.show();
				boutonValider.show();
			});
			
			boutonValider.click(function() {
				// action : montrer le bouton d'ajout à cliquer pour cacher le texte et cacher le bouton valider
				boutonAjout.show();    
				texteAjout.hide();
				boutonValider.hide();
				
				// But : ajouter de nouvelles listes aux TODO listes existantes et enregistrer les data données 
				var texte = texteAjout.val();
				if (texte != "") {
					var liste = {
						"name":texte,
						"elements":[]
					};
					data.todoListes.push(liste);
					afficherListe(liste);
					enregistrerDonnee();
				}
				texteAjout.val("");
			});
	}
	function afficherElement(element, listeHTML, name) {
		var ligne = $("<li/>");
		listeHTML.append(ligne);
		var bloc = $("<div class='toDoElement'/>");
		ligne.append(bloc);
		
		bloc.append("<h4>" + element + "</h4>");
		
		var boutonSupprimer = $("<div/>");
		boutonSupprimer.append("<img src='img/croix.png'>")

		bloc.append(boutonSupprimer);
		
		boutonSupprimer.click(function() {
			ligne.remove();
			supprimerElement(element, name);
			enregistrerDonnee();
		});
	}

	function supprimerElement(element, name) {
		for (var i = 0; i < data.todoListes.length; i++) {
			if (data.todoListes[i].name == name) {
				for (var j = 0; j < data.todoListes[i].elements.length; j++) {
					if (data.todoListes[i].elements[j] == element) {
						data.todoListes[i].elements.splice(j, 1);
					}
				}
			}
		}
	}
			
	function ajouterElement(bloc, listeHTML, id, name) {
		var boutonAjout = $("<i class='fas fa-plus-square plus_square' title='Ajouter un élément à la liste'></i>");
		bloc.append(boutonAjout);

		var boutonSupprimer = $(`<i class="fas fa-trash-alt icon_trash" title='Supprimer la liste'></i>`);
		bloc.append(boutonSupprimer);

		var texteAjout = $("<input class='new_list' type='text' value='' placeholder='Entrez un élément'>");
		bloc.append(texteAjout);
		texteAjout.hide();
		
		var boutonValider = $("<input class='add_element' type='button' value='OK'>");
		bloc.append(boutonValider);
		boutonValider.hide();
		
		boutonAjout.click(function() {
			boutonAjout.hide();
			boutonSupprimer.hide();
			texteAjout.show();
			boutonValider.show();
		});

		boutonSupprimer.click(function() {
			bloc.remove();
			for (var i = 0; i < data.todoListes.length; i++) {
				if (data.todoListes[i].name == name) {
					data.todoListes.splice(i, 1);
				}
			}
			enregistrerDonnee();
		});
		
		boutonValider.click(function() {
			boutonAjout.show();
			boutonSupprimer.show();
			texteAjout.hide();
			boutonValider.hide();
			
			var texte = texteAjout.val();
			if (texte != "") {
				afficherElement(texte, listeHTML, name);
				data.todoListes[id].elements.push(texte);
				enregistrerDonnee();
			}
			texteAjout.val("");
		});
	}


	// animations associée au formulaire
	$('.form-control').on('keydown', function(){
		$(this).addClass('force_valid');
	});
	$('.form-control').on('keyup', function(){
		if ($(this).val() != '') {
			$(this).addClass('force_valid');
		} else {
			$(this).removeClass('force_valid');
		}
	});
	
	$('#inscription').on('submit', function(e){
		var error = true;
		if ($('#validationServerPassword').val() != '' && $('#validationServerPassword').val() != $('#validationServerConfirm').val()) {
			$('.has_improper').append(`
				<div class="alert alert-warning alert-dismissible fade show mx-5 mt-1" role="alert">
				  <strong>Le mot de passe saisi n'est pas conforme à sa confirmation !</strong>
				  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
				    <span aria-hidden="true">&times;</span>
				  </button>
				</div>
				`);
			error = false;
		}

		var fields = $(this).find('.check_validate');
		fields.each(function(index, element){
			if ($(element).val() == '') {
				$(element).addClass('wrong');
				error = false;
			}
		});

		if (!error) {
			return false;
		}

		var n = $('#validationServerLogin').val();
		var p = $('#validationServerPassword').val();

		$.ajax({
			url: "http://92.222.69.104/todo/create/" + n + "/" + p
		}).done(function(d) {
			console.log(d);
		});
		$(".js_alert").append(`
			<div class="alert alert-warning alert-dismissible fade show mx-5 mt-1" role="alert">
			  <strong> Votre compte à bien été crée !</strong>
			  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
			    <span aria-hidden="true">&times;</span>
			  </button>
			</div>
		`);
	});
});