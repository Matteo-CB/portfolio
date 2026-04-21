(function () {
    "use strict";

    const elements = {
        heroNom: document.getElementById("heroNom"),
        heroIntitule: document.getElementById("heroIntitule"),
        heroPresentation: document.getElementById("heroPresentation"),
        parcoursListe: document.getElementById("parcoursListe"),
        projetsGrille: document.getElementById("projetsGrille"),
        modeleProjet: document.getElementById("modelePro"),
        veilleMethode: document.getElementById("veilleMethode"),
        veilleSources: document.getElementById("veilleSources"),
        veilleSujets: document.getElementById("veilleSujets"),
        veilleBillets: document.getElementById("veilleBillets"),
        contactEmail: document.getElementById("contactEmail"),
        contactEmailValeur: document.getElementById("contactEmailValeur"),
        contactGithub: document.getElementById("contactGithub"),
        contactGithubValeur: document.getElementById("contactGithubValeur"),
        contactLinkedin: document.getElementById("contactLinkedin"),
        contactLinkedinValeur: document.getElementById("contactLinkedinValeur"),
        navListe: document.getElementById("navListe"),
        navBurger: document.getElementById("navBurger"),
        siteHeader: document.getElementById("siteHeader"),
        modal: document.getElementById("detailModal"),
        modalOverlay: document.getElementById("detailOverlay"),
        modalFermer: document.getElementById("detailFermer"),
        detailType: document.getElementById("detailType"),
        detailPeriode: document.getElementById("detailPeriode"),
        detailTitre: document.getElementById("detailTitre"),
        detailContexte: document.getElementById("detailContexte"),
        detailGalerie: document.getElementById("detailGalerie"),
        detailDescription: document.getElementById("detailDescription"),
        detailEnvironnement: document.getElementById("detailEnvironnement"),
        detailCompetences: document.getElementById("detailCompetences"),
        detailSousCompetences: document.getElementById("detailSousCompetences"),
        detailDocuments: document.getElementById("detailDocuments"),
        detailDocumentsBloc: document.getElementById("detailDocumentsBloc"),
        detailActions: document.getElementById("detailActions")
    };

    const etat = {
        donnees: null,
        projetsParId: new Map(),
        dernierElementFocus: null
    };

    const iconeFleche = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 12 L19 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"></path><path d="M13 6 L19 12 L13 18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path></svg>';

    const iconeTelechargement = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 3 L12 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"></path><path d="M6 11 L12 17 L18 11" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4 20 L20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"></path></svg>';

    const iconeExterne = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 18 L18 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"></path><path d="M9 6 L18 6 L18 15" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path></svg>';

    const COMPETENCES = {
        C1: { court: "Gestion du parc", long: "Gérer le patrimoine informatique" },
        C2: { court: "Support et évolutions", long: "Répondre aux incidents et aux demandes d'assistance et d'évolution" },
        C3: { court: "Présence en ligne", long: "Développer la présence en ligne de l'organisation" },
        C4: { court: "Mode projet", long: "Travailler en mode projet" },
        C5: { court: "Mise à disposition d'un service", long: "Mettre à disposition des utilisateurs un service informatique" },
        C6: { court: "Développement professionnel", long: "Organiser son développement professionnel" }
    };

    function libelleCompetence(code) {
        const entree = COMPETENCES[code];
        if (!entree) return { court: code, long: code };
        return entree;
    }

    async function chargerDonnees() {
        const reponse = await fetch("data/projets.json");
        if (!reponse.ok) {
            throw new Error("Lecture du fichier projets.json impossible, statut " + reponse.status);
        }
        return reponse.json();
    }

    async function lireManifesteImages(dossier) {
        try {
            const reponse = await fetch(dossier + "/manifeste.json");
            if (!reponse.ok) return [];
            const manifeste = await reponse.json();
            if (!manifeste || !Array.isArray(manifeste.images)) return [];
            const images = manifeste.images.filter(function (nom) {
                return typeof nom === "string" && nom.length > 0;
            }).sort();
            return images.map(function (nom) {
                return dossier + "/" + nom;
            });
        } catch (erreur) {
            return [];
        }
    }

    function remplirAccueil(candidat) {
        if (candidat.nom) elements.heroNom.innerHTML = formaterNom(candidat.nom);
        if (candidat.intitule) elements.heroIntitule.textContent = candidat.intitule;
        if (candidat.phraseAccueil) elements.heroPresentation.textContent = candidat.phraseAccueil;
    }

    function formaterNom(nom) {
        const parties = nom.split(" ");
        if (parties.length < 2) return escaperHtml(nom);
        const prenom = parties[0];
        const reste = parties.slice(1).join(" ");
        return escaperHtml(prenom) + "<br>" + escaperHtml(reste);
    }

    function escaperHtml(chaine) {
        const div = document.createElement("div");
        div.textContent = chaine;
        return div.innerHTML;
    }

    function remplirParcours(parcours) {
        elements.parcoursListe.innerHTML = "";
        parcours.forEach(function (etape) {
            const item = document.createElement("li");
            item.className = "parcoursItem apparait";

            const annee = document.createElement("span");
            annee.className = "parcoursAnnee";
            annee.textContent = etape.annee || "";

            const corps = document.createElement("div");
            corps.className = "parcoursCorps";

            const intitule = document.createElement("p");
            intitule.className = "parcoursIntitule";
            intitule.textContent = etape.intitule || "";

            const contexte = document.createElement("p");
            contexte.className = "parcoursContexte";
            contexte.textContent = etape.contexte || "";

            corps.appendChild(intitule);
            corps.appendChild(contexte);

            item.appendChild(annee);
            item.appendChild(corps);
            elements.parcoursListe.appendChild(item);
        });
    }

    function remplirProjets(projets) {
        elements.projetsGrille.innerHTML = "";
        projets.forEach(function (projet) {
            etat.projetsParId.set(projet.id, projet);
            const carte = elements.modeleProjet.content.firstElementChild.cloneNode(true);
            carte.classList.add("apparait");

            const lien = carte.querySelector(".projetLien");
            lien.setAttribute("href", "#" + projet.id);
            lien.setAttribute("aria-label", "Voir le détail du projet " + (projet.titre || ""));
            lien.dataset.projetid = projet.id;

            const periode = carte.querySelector(".projetPeriode");
            periode.textContent = projet.periode || "";

            const titre = carte.querySelector(".projetTitre");
            titre.textContent = projet.titre || "";

            const resume = carte.querySelector(".projetResume");
            resume.textContent = projet.descriptionCourte || "";

            const ligneCompetences = carte.querySelector(".projetCompetences");
            const libellesCourts = (projet.competences || []).map(function (code) {
                return libelleCompetence(code).court;
            });
            if (libellesCourts.length > 0) {
                ligneCompetences.textContent = libellesCourts.join(" · ");
            } else {
                ligneCompetences.remove();
            }

            elements.projetsGrille.appendChild(carte);

            lien.addEventListener("click", function (evenement) {
                evenement.preventDefault();
                ouvrirDetail(projet.id);
            });

            chargerPremiereImage(projet, carte);
        });
    }

    async function chargerPremiereImage(projet, carte) {
        if (!projet.dossierImages) return;
        const images = await lireManifesteImages(projet.dossierImages);
        if (images.length === 0) return;
        const img = carte.querySelector(".projetImage");
        const placeholder = carte.querySelector(".projetImagePlaceholder");
        const nouveau = new Image();
        nouveau.onload = function () {
            img.src = nouveau.src;
            img.alt = "Aperçu du projet " + (projet.titre || "");
            img.classList.add("estChargee");
            if (placeholder) placeholder.style.display = "none";
        };
        nouveau.src = images[0];
    }

    function remplirVeille(veille) {
        if (veille.methode) elements.veilleMethode.textContent = veille.methode;

        elements.veilleSources.innerHTML = "";
        (veille.sources || []).forEach(function (source) {
            const li = document.createElement("li");
            li.className = "veilleSource";

            if (source.url) {
                const lien = document.createElement("a");
                lien.className = "veilleSourceLien";
                lien.href = source.url;
                lien.target = "_blank";
                lien.rel = "noopener";
                lien.textContent = source.nom || source.url;
                li.appendChild(lien);
            } else {
                const nom = document.createElement("span");
                nom.className = "veilleSourceLien";
                nom.textContent = source.nom || "";
                li.appendChild(nom);
            }

            if (source.type) {
                const type = document.createElement("span");
                type.className = "veilleSourceType";
                type.textContent = source.type;
                li.appendChild(type);
            }

            elements.veilleSources.appendChild(li);
        });

        elements.veilleSujets.innerHTML = "";
        (veille.sujets || []).forEach(function (sujet) {
            const li = document.createElement("li");
            li.className = "veilleSujet";
            li.textContent = sujet;
            elements.veilleSujets.appendChild(li);
        });

        elements.veilleBillets.innerHTML = "";
        (veille.billets || []).forEach(function (billet) {
            const li = document.createElement("li");
            li.className = "veilleBillet";

            if (billet.date) {
                const date = document.createElement("span");
                date.className = "veilleBilletDate";
                date.textContent = billet.date;
                li.appendChild(date);
            }

            const titre = document.createElement("p");
            titre.className = "veilleBilletTitre";
            titre.textContent = billet.titre || "";
            li.appendChild(titre);

            if (billet.resume) {
                const resume = document.createElement("p");
                resume.className = "veilleBilletResume";
                resume.textContent = billet.resume;
                li.appendChild(resume);
            }

            elements.veilleBillets.appendChild(li);
        });
    }

    function remplirContact(candidat) {
        const email = candidat.email || "";
        const github = (candidat.liens && candidat.liens.github) || "";
        const linkedin = (candidat.liens && candidat.liens.linkedin) || "";

        if (email) {
            elements.contactEmail.href = "mailto:" + email;
            elements.contactEmailValeur.textContent = email;
        } else {
            elements.contactEmail.classList.add("estVide");
        }

        if (github) {
            elements.contactGithub.href = github;
            elements.contactGithubValeur.textContent = lisibiliteUrl(github);
        } else {
            elements.contactGithub.classList.add("estVide");
        }

        if (linkedin) {
            elements.contactLinkedin.href = linkedin;
            elements.contactLinkedinValeur.textContent = lisibiliteUrl(linkedin);
        } else {
            elements.contactLinkedin.classList.add("estVide");
        }
    }

    function lisibiliteUrl(url) {
        try {
            const u = new URL(url);
            return (u.hostname + u.pathname).replace(/\/$/, "");
        } catch (erreur) {
            return url;
        }
    }

    async function ouvrirDetail(id) {
        const projet = etat.projetsParId.get(id);
        if (!projet) return;

        etat.dernierElementFocus = document.activeElement;

        elements.detailType.textContent = projet.typeProjet || "";
        elements.detailPeriode.textContent = projet.periode || "";
        elements.detailTitre.textContent = projet.titre || "";
        elements.detailContexte.textContent = projet.contexte ? "Contexte, " + projet.contexte : "";
        elements.detailDescription.textContent = projet.descriptionLongue || projet.descriptionCourte || "";

        elements.detailEnvironnement.innerHTML = "";
        (projet.environnement || []).forEach(function (techno) {
            const li = document.createElement("li");
            li.textContent = techno;
            elements.detailEnvironnement.appendChild(li);
        });

        elements.detailCompetences.innerHTML = "";
        (projet.competences || []).forEach(function (code) {
            const entree = libelleCompetence(code);
            const li = document.createElement("li");
            li.className = "detailCompetenceItem";

            const codeSpan = document.createElement("span");
            codeSpan.className = "detailCompetenceCode";
            codeSpan.textContent = code;

            const libelleSpan = document.createElement("span");
            libelleSpan.className = "detailCompetenceLibelle";
            libelleSpan.textContent = entree.long;

            li.appendChild(codeSpan);
            li.appendChild(libelleSpan);
            elements.detailCompetences.appendChild(li);
        });

        elements.detailSousCompetences.innerHTML = "";
        (projet.sousCompetences || []).forEach(function (sous) {
            const li = document.createElement("li");
            li.textContent = sous;
            elements.detailSousCompetences.appendChild(li);
        });

        elements.detailDocuments.innerHTML = "";
        const documents = (projet.documents || []).filter(function (doc) {
            return doc && (doc.nom || doc.url);
        });
        if (documents.length === 0) {
            elements.detailDocumentsBloc.classList.add("estVide");
        } else {
            elements.detailDocumentsBloc.classList.remove("estVide");
            documents.forEach(function (doc) {
                const li = document.createElement("li");
                li.className = "detailDocument";

                const nom = document.createElement("span");
                nom.className = "detailDocumentNom";
                nom.textContent = doc.nom || "Document";
                li.appendChild(nom);

                if (doc.url) {
                    const lien = document.createElement("a");
                    lien.className = "detailDocumentLien";
                    lien.href = doc.url;
                    lien.target = "_blank";
                    lien.rel = "noopener";
                    lien.innerHTML = "<span>Consulter</span>" + iconeExterne;
                    li.appendChild(lien);
                } else {
                    const statut = document.createElement("span");
                    statut.className = "detailDocumentStatut";
                    statut.textContent = "À fournir";
                    li.appendChild(statut);
                }

                elements.detailDocuments.appendChild(li);
            });
        }

        elements.detailActions.innerHTML = "";
        const github = projet.boutons && projet.boutons.github;
        const telechargement = projet.boutons && projet.boutons.telechargement;

        if (github) {
            const lien = document.createElement("a");
            lien.className = "bouton boutonPrincipal";
            lien.href = github;
            lien.target = "_blank";
            lien.rel = "noopener";
            lien.innerHTML = "<span>Voir sur GitHub</span>" + iconeFleche;
            elements.detailActions.appendChild(lien);
        }

        if (telechargement) {
            const lien = document.createElement("a");
            lien.className = "bouton boutonSecondaire";
            lien.href = telechargement;
            lien.setAttribute("download", "");
            lien.innerHTML = "<span>Télécharger le dossier</span>" + iconeTelechargement;
            elements.detailActions.appendChild(lien);
        }

        elements.detailGalerie.innerHTML = "";
        elements.detailGalerie.classList.add("estVide");
        const images = await lireManifesteImages(projet.dossierImages);
        if (images.length > 0) {
            elements.detailGalerie.classList.remove("estVide");
            images.forEach(function (chemin, index) {
                const figure = document.createElement("figure");
                const img = document.createElement("img");
                img.src = chemin;
                img.loading = "lazy";
                img.alt = (projet.titre || "Projet") + ", image " + (index + 1);
                figure.appendChild(img);
                elements.detailGalerie.appendChild(figure);
            });
        }

        elements.modal.classList.add("estOuvert");
        elements.modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        setTimeout(function () {
            const panneau = elements.modal.querySelector(".detailPanneau");
            if (panneau) panneau.focus();
        }, 30);

        if (history && history.replaceState) {
            history.replaceState(null, "", "#" + id);
        }
    }

    function fermerDetail() {
        elements.modal.classList.remove("estOuvert");
        elements.modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        if (etat.dernierElementFocus && typeof etat.dernierElementFocus.focus === "function") {
            etat.dernierElementFocus.focus();
        }
        if (history && history.replaceState) {
            history.replaceState(null, "", "#realisations");
        }
    }

    function brancherModal() {
        elements.modalOverlay.addEventListener("click", fermerDetail);
        elements.modalFermer.addEventListener("click", fermerDetail);
        document.addEventListener("keydown", function (evenement) {
            if (evenement.key === "Escape" && elements.modal.classList.contains("estOuvert")) {
                fermerDetail();
            }
        });
    }

    function brancherNav() {
        elements.navBurger.addEventListener("click", function () {
            const estOuvert = elements.navListe.classList.toggle("estOuvert");
            elements.navBurger.setAttribute("aria-expanded", estOuvert ? "true" : "false");
            elements.navBurger.setAttribute("aria-label", estOuvert ? "Fermer le menu" : "Ouvrir le menu");
        });

        elements.navListe.addEventListener("click", function (evenement) {
            const cible = evenement.target.closest(".navLien");
            if (!cible) return;
            elements.navListe.classList.remove("estOuvert");
            elements.navBurger.setAttribute("aria-expanded", "false");
            elements.navBurger.setAttribute("aria-label", "Ouvrir le menu");
        });

        const observateur = new IntersectionObserver(function (entrees) {
            entrees.forEach(function (entree) {
                if (entree.isIntersecting) {
                    const id = entree.target.id;
                    document.querySelectorAll(".navLien").forEach(function (lien) {
                        lien.classList.toggle("estActif", lien.dataset.ancre === id);
                    });
                }
            });
        }, { rootMargin: "40% 0px 45% 0px", threshold: 0 });

        ["accueil", "parcours", "realisations", "veille", "contact"].forEach(function (id) {
            const section = document.getElementById(id);
            if (section) observateur.observe(section);
        });

        window.addEventListener("scroll", function () {
            if (window.scrollY > 12) {
                elements.siteHeader.classList.add("estDefile");
            } else {
                elements.siteHeader.classList.remove("estDefile");
            }
        }, { passive: true });
    }

    function observerApparitions() {
        const cibles = document.querySelectorAll(".apparait");
        if (!("IntersectionObserver" in window)) {
            cibles.forEach(function (el) { el.classList.add("estVisible"); });
            return;
        }
        const observateur = new IntersectionObserver(function (entrees) {
            entrees.forEach(function (entree) {
                if (entree.isIntersecting) {
                    entree.target.classList.add("estVisible");
                    observateur.unobserve(entree.target);
                }
            });
        }, { threshold: 0.12 });
        cibles.forEach(function (el) { observateur.observe(el); });
    }

    function ouvrirSiAncre() {
        const ancre = window.location.hash.replace("#", "");
        if (ancre && etat.projetsParId.has(ancre)) {
            ouvrirDetail(ancre);
        }
    }

    async function demarrer() {
        try {
            etat.donnees = await chargerDonnees();
        } catch (erreur) {
            afficherErreur(erreur);
            return;
        }

        const d = etat.donnees;
        if (d.candidat) remplirAccueil(d.candidat);
        if (Array.isArray(d.parcours)) remplirParcours(d.parcours);
        if (Array.isArray(d.projets)) remplirProjets(d.projets);
        if (d.veille) remplirVeille(d.veille);
        if (d.candidat) remplirContact(d.candidat);

        document.querySelectorAll(".section > .conteneur > *, .hero > .conteneur > *").forEach(function (el) {
            el.classList.add("apparait");
        });

        observerApparitions();
        brancherNav();
        brancherModal();
        ouvrirSiAncre();
    }

    function afficherErreur(erreur) {
        const message = document.createElement("div");
        message.style.padding = "24px";
        message.style.background = "#FEECEC";
        message.style.color = "#8A1F1F";
        message.style.border = "1px solid #F0BFBF";
        message.style.borderRadius = "8px";
        message.style.margin = "24px";
        message.style.fontFamily = "system-ui, sans-serif";
        message.textContent = "Impossible de charger les données du portfolio. Vérifiez que le site est servi par un serveur local ou en ligne. Détail technique, " + (erreur && erreur.message ? erreur.message : "erreur inconnue") + ".";
        document.body.prepend(message);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", demarrer);
    } else {
        demarrer();
    }
})();
