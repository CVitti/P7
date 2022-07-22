// Initialisation des tableaux contenant les filtres de la recherche globale et des tags
let mainFilter = "";
let ingredientFilter = [];
let appareilFilter = [];
let ustenstileFilter = [];

// Ajout d'un listener sur le champ de recherche pour activer la recherche dès que 3 caractères ou plus sont entrés
document.querySelector("#inputMainSearch").addEventListener("keyup", checkSearchLength);

function checkSearchLength(){
    // @ts-ignore
    const search = document.getElementById('inputMainSearch').value;
    if (search.length >= 3) {
        mainFilter = search;
        applyFilters();
    }else{
        mainFilter = "";
        applyFilters();
    }

}

function applyFilters(){
    let filteredRecipes = [];

    // Si aucun filtre appliqué, chargement de toutes les recettes
    if (mainFilter == "" && ingredientFilter.length == 0 && appareilFilter.length == 0 && ustenstileFilter.length == 0) {
        // @ts-ignore
        displayRecipes(recipes);
    } else {

        // Boucle sur toutes les recettes pour tester les correspondances
        // @ts-ignore
        for (let index = 0; index < recipes.length; index++) {
            // @ts-ignore
            const recipe = recipes[index];
    
            // Test de correspondance avec la recherche principale si non vide
            if (mainFilter != "") {
                const containsIngredients = recipe.ingredients.findIndex(list => list.ingredient.toLowerCase().includes(mainFilter.toLowerCase()));

                if (recipe.name.toLowerCase().includes(mainFilter.toLowerCase()) 
                || recipe.description.toLowerCase().includes(mainFilter.toLowerCase())
                || containsIngredients != -1) {
                    filteredRecipes.push(recipe);
                }
            }
    
        }   

        displayRecipes(filteredRecipes);
    } 
}

/**
 * Fonction d'affichage des recettes filtrées
 * @param {*} recipesToDisplay Array contenant toutes les recettes filtrées, prêtes à être affichées
 */
function displayRecipes(recipesToDisplay){
    let listArticles = "";
    let units = [];
    let appareils = [];
    let ustensiles = [];

    // Création d'un article pour chaque recette parcourue dans le tableau
    for (let i = 0; i < recipesToDisplay.length; i++) {
        listArticles +=`<article class="container">
                            <div class="recipePicture row"></div>
                            <div class="recipeInfos row">
                                <div class="divRecipeName">${recipesToDisplay[i].name}</div>
                                <div class="bold500 divTimer"><i class="fa-regular fa-clock fa-lg"></i>${recipesToDisplay[i].time} min</div>
                                <p class="recipeIngredients">`;

        // Boucle qui parcoure les ingrédients de la recette
        for (let j = 0; j < recipesToDisplay[i].ingredients.length; j++) {
            const currentIngredient = recipesToDisplay[i].ingredients[j];
            listArticles += `<span class="bold600">${currentIngredient.ingredient}</span>`;
            if (currentIngredient.quantity) {
                listArticles += `: ${currentIngredient.quantity}`;

                // Mise en forme textuelle selon l'unité de mesure
                if (currentIngredient.unit) {
                    switch (currentIngredient.unit) {
                        case "grammes":
                            listArticles += "g";
                            break;
                        case "ml": case "cl": case "kg":
                            listArticles += currentIngredient.unit;
                            break;

                        default:
                            listArticles += " " + currentIngredient.unit;
                            break;
                    }
                    // Ajout unique des unités qui n'ont pas encore été utilisées
                    if (!units.includes(currentIngredient.unit)) {
                        units.push(currentIngredient.unit);
                    }
                }
            }
            listArticles += "<br/>";
        }

        // Ajout de la description de la recette
        listArticles +=        `</p>
                                <p class="recipeDescription">${recipesToDisplay[i].description}</p>
                            </div>
                        </article>`;
        // Ajout unique des unités qui n'ont pas encore été utilisées
        if (!appareils.includes(recipesToDisplay[i].appliance)) {
            appareils.push(recipesToDisplay[i].appliance);
        }
        
        for (const ustensil of recipesToDisplay[i].ustensils) {
            if (!ustensiles.includes(ustensil)) {
                ustensiles.push(ustensil);
            }
        }
    }
    document.getElementById("recipeSection").innerHTML = listArticles;

    // Affiche la liste de toutes les unités de mesure utilisées
    let sortedUnits = sortByName(units);
    console.log("Unités triées", sortedUnits);

    // Affiche la liste de toutes les appareils utilisées
    let sortedAppareils = sortByName(appareils);
    console.log("Appareils triés", sortedAppareils);

    // Affiche la liste de toutes les appareils utilisées
    let sortedUstensiles = sortByName(ustensiles);
    console.log("Ustensiles triés", sortedUstensiles);
    
}


/**
 * 
 * @param {*} tab Tableau passé en entrée, à trier
 * @returns tableau trié par ordre alphabétique
 */
function sortByName(tab) {
    const sortedTab = tab.sort(function(a, b) {
        if (a > b) {
            return 1;
        } else if(a < b){
            return -1;
        }else{
            return 0;
        }
    });

    return sortedTab
}

/**
 * Fonction de gestion des tags
 * @param {*} eventType Valeur "add" ou "delete" pour gérer s'il faut créer le tag ou le supprimer s'il existe déjà
 * @param {*} tagType Gestion de la mise en forme selon le filtre d'origine du tag (ingrédient, appareil, ustensile)
 * @param {*} content Texte à afficher dans le tag (Ex : Coco)
 */
function manageTag(eventType, tagType, content) {
    
}

/**
 * Fonction d'initialisation de la page, affichage par défaut lors du premier chargement
 */
function init(){
    applyFilters();
}

init();