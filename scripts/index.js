// Import des scripts qui seront utilisés
import { recipes } from "../data/recipes.js";
import FilterItem from "./classes/FilterItem.js";
import Recipe from "./classes/Recipe.js";
import Tag from "./classes/Tag.js";
import { arrayRemove } from "./utils/utils.js";
import { sortByName } from "./utils/utils.js";

// Tableaux de stockage des tags et valeur de recherche actifs
let mainFilter = "";
let ingredientTags = [];
let appareilTags = [];
let ustensileTags = [];
let currentTagId = 0;

// Tableaux de stockage des filtres à afficher
let ingredientItems = [];
let appareilItems = [];
let ustensileItems = [];

/**
 * Affichage des recettes
 * @param {*} recipesToDisplay Tableau filtré des recettes à afficher
 */
 function displayRecipes(recipesToDisplay){
    let listArticles = "";

    // Création d'un article pour chaque recette parcourue dans le tableau
    for (let i = 0; i < recipesToDisplay.length; i++) {
        // Création du code HMTL de la recette via la classe Recipe
        listArticles += new Recipe(recipesToDisplay[i]).recipeBlock;   
    }
    document.getElementById("recipeSection").innerHTML = listArticles;    
}

/**0
 * Fonction qui parcoure les tags qui ont été sélectionnés afin de les afficher
 */
function displayTags() {
    document.getElementById("divTags").innerHTML = "";

    // Création des tags des ingrédients sélectionnés
    let listTags = "";
    for (let index = 0; index < ingredientTags.length; index++) {
        listTags += new Tag(currentTagId, "ingredient", ingredientTags[index]).tagBlock;      
        // Incrémentation du conteur de tags créés pour chaque ID donné
        currentTagId++;
    }

    // Création des tags des appareils sélectionnés
    for (let index = 0; index < appareilTags.length; index++) {
        listTags += new Tag(currentTagId, "appareil", appareilTags[index]).tagBlock;
        // Incrémentation du conteur de tags créés pour chaque ID donné
        currentTagId++;
    }

    // Création des tags des ustensiles sélectionnés
    for (let index = 0; index < ustensileTags.length; index++) {
        listTags += new Tag(currentTagId, "ustensile", ustensileTags[index]).tagBlock;
        currentTagId++;
    }

    document.getElementById("divTags").innerHTML += listTags;

    // Ajout des listeners pour supprimer les tags des ingrédients filtrés
    let createdTags = document.getElementById("divTags").children;
    for (let index = 0; index < createdTags.length; index++) {
        const tag = createdTags[index];
        let type = "";
        // @ts-ignore
        if (ingredientTags.includes(tag.innerText)) {
            type = "ingredient";
        // @ts-ignore
        } else if(appareilTags.includes(tag.innerText)){
            type = "appareil";
        // @ts-ignore
        } else if(ustensileTags.includes(tag.innerText)){
            type = "ustensile";
        }

        tag.lastElementChild.addEventListener("click", () =>{
            // @ts-ignore
            manageTag("delete", type, tag.innerText);            
        })        
    }
}

/**
 * Gestion de l'affichage des listes sous les filtres et de l'affichage du filtre en lui-même
 * @param {*} block Définit le block sur lequel le filtre doit être affiché/caché
 */
 function toggleFiltersList(block, action) {
    let childrenList = null;
    switch (block) {
        case "ingredients":
            childrenList = document.getElementById("filterIngredients").children;
            if (action == "display") {
                document.getElementById("filterIngredients").classList.add("active");
                document.getElementById("filterAppareils").classList.remove("active");
                document.getElementById("filterUstensiles").classList.remove("active");                
            }else if(action == "hide"){
                document.getElementById("filterIngredients").classList.remove("active");
            }
            break;
        case "appareils":
            childrenList = document.getElementById("filterAppareils").children;
            if (action == "display") {
                document.getElementById("filterAppareils").classList.add("active");
                document.getElementById("filterIngredients").classList.remove("active");
                document.getElementById("filterUstensiles").classList.remove("active");                
            }else if(action == "hide"){
                document.getElementById("filterAppareils").classList.remove("active");
            }
            break;
        case "ustensiles":
            childrenList = document.getElementById("filterUstensiles").children;
            if (action == "display") {
                document.getElementById("filterUstensiles").classList.add("active");
                document.getElementById("filterIngredients").classList.remove("active");
                document.getElementById("filterAppareils").classList.remove("active");                
            }else if(action == "hide"){
                document.getElementById("filterUstensiles").classList.remove("active");
            }
            break;
    }
}

/**
 * Application des filtres sélectionnés via la recherche et les tags pour filtrer la liste des recettes et des novueaux filtres possibles à ajouter
 * Appel des fonction d'affichage des recettes et des tags à la fin
 */
function applyFilters(){
    let filteredRecipes = [];
    // @ts-ignore
    mainFilter = document.getElementById("inputMainSearch").value;
    if (mainFilter.length < 3) {
        mainFilter = "";
    }

    // Si aucun filtre appliqué, chargement de toutes les recettes
    if (mainFilter == "" && ingredientTags.length == 0 && appareilTags.length == 0 && ustensileTags.length == 0) {
        filteredRecipes = recipes;
    } else {
        // Boucle sur toutes les recettes pour tester les correspondances
        for (let index = 0; index < recipes.length; index++) {
            
            const recipe = recipes[index];
            let canBeDisplayed = true;
            
            // Test de correspondance avec la recherche principale si non vide
            if (mainFilter != "") {
                const containsIngredients = recipe.ingredients.findIndex(list => list.ingredient.toLowerCase().includes(mainFilter.toLowerCase()));

                if (recipe.name.toLowerCase().includes(mainFilter.toLowerCase()) 
                || recipe.description.toLowerCase().includes(mainFilter.toLowerCase())
                || containsIngredients != -1) {
                    canBeDisplayed = true;
                }else{
                    canBeDisplayed = false;
                }
            }

            // Test de correspondance entre les tags Ingrédient et la recette
            if (ingredientTags.length > 0) {
                for (let index = 0; index < ingredientTags.length; index++) {
                    const currentIngredient = ingredientTags[index];
                    const foundIngredient = recipe.ingredients.findIndex(list => list.ingredient.includes(currentIngredient));
                    if(foundIngredient == -1 && canBeDisplayed){
                        canBeDisplayed = false;
                    }
                }
            }

            // Test de correspondance entre les tags Appareil et la recette
            if (appareilTags.length > 0) {
                for (let index = 0; index < appareilTags.length; index++) {
                    const currentAppareil = appareilTags[index];
                    if(!recipe.appliance.includes(currentAppareil) && canBeDisplayed){
                        canBeDisplayed = false;
                    }
                }
            }

            // Test de correspondance entre les tags Ustensiles et la recette
            if (ustensileTags.length > 0) {
                for (let index = 0; index < ustensileTags.length; index++) {
                    const currentUstensile = ustensileTags[index];
                    const foundUstensile = recipe.ustensils.findIndex(list => list.includes(currentUstensile));
                    if(foundUstensile == -1 && canBeDisplayed){
                        canBeDisplayed = false;
                    }
                }
            }

            // Si validation de tous les filtres, ajour de la recette au tableau à afficher
            if (canBeDisplayed) {
                filteredRecipes.push(recipe);
            }
        }          
    }

    // Parcours de toutes les recettes filtrées pour récupérer les ingrédients/appareils/ustensiles uniques
    ingredientItems = [];
    appareilItems = [];
    ustensileItems = [];
    for (let i = 0; i < filteredRecipes.length; i++) {
        let currentRecipe = filteredRecipes[i];

        // Boucle qui parcoure les ingrédients de la recette
        for (let j = 0; j < currentRecipe.ingredients.length; j++) {
            if (!ingredientItems.includes(currentRecipe.ingredients[j].ingredient)) {
                ingredientItems.push(currentRecipe.ingredients[j].ingredient);
            }
        }

        // Boucle qui parcoure les appareils de la recette
        if (!appareilItems.includes(currentRecipe.appliance)) {
            appareilItems.push(currentRecipe.appliance);
        }

        // Boucle qui parcoure les ustensiles de la recette
        for (const ustensil of currentRecipe.ustensils) {
            if (!ustensileItems.includes(ustensil)) {
                ustensileItems.push(ustensil);
            }
        }
    }

    // Appels des fonctions d'affichage des tags et recettes après avoir trié les recettes
    displayRecipes(filteredRecipes);
    displayTags();
    addFiltersContent();
}


/**
 * Parcoure les tableaux de chaque filtre pour en afficher les ingrédients/appareils/ustensiles restants
 */
function addFiltersContent() {
    // Tri des tableaux recus en entrée avant affichage
    ingredientItems = sortByName(ingredientItems);
    appareilItems = sortByName(appareilItems);
    ustensileItems = sortByName(ustensileItems);
    let listItems = "";
    let createdItems = null;

    // Ajout du contenu dans le filtre des ingrédients
    if (ingredientItems.length == ingredientTags.length) {
        listItems += "Aucun filtre disponible";
    } else {        
        for (let i = 0; i < ingredientItems.length; i++) {
            if (!ingredientTags.includes(ingredientItems[i])) {
                listItems += new FilterItem(ingredientItems[i]).filterItemBlock;
            }             
        }
    }        
    document.getElementById("ingredientsList").innerHTML = listItems;
    
    // Ajout des listeners pour créer les tags depuis la liste filtrée des ingrédients
    createdItems = document.getElementById("ingredientsList").children;
    for (let index = 0; index < createdItems.length; index++) {
        const item = createdItems[index];
        item.addEventListener("click", () =>{
            // @ts-ignore
            manageTag("add", "ingredient", item.innerText);            
        })        
    }
    // Reset de la variable après avoir ajouté les items du filtre
    listItems = "";

    // Ajout du contenu dans le filtre des appareils
    if (appareilItems.length == appareilTags.length) {
        listItems += "Aucun filtre disponible";
    } else {        
        for (let i = 0; i < appareilItems.length; i++) {
            if (!appareilTags.includes(appareilItems[i])) {
                listItems += new FilterItem(appareilItems[i]).filterItemBlock;
            }             
        }
    } 
    document.getElementById("appareilsList").innerHTML = listItems;
    
    // Ajout des listeners pour créer les tags depuis la liste filtrée des appareils
    createdItems = document.getElementById("appareilsList").children;
    for (let index = 0; index < createdItems.length; index++) {
        const item = createdItems[index];
        item.addEventListener("click", () =>{
            // @ts-ignore 
            manageTag("add", "appareil", item.innerText);            
        })        
    }
    // Reset de la variable après avoir ajouté les items du filtre
    listItems = "";

    // Ajout du contenu dans le filtre des ustensiles
    if (ustensileItems.length == ustensileTags.length) {
        listItems += "Aucun filtre disponible";
    } else {        
        for (let i = 0; i < ustensileItems.length; i++) {
            if (!ustensileTags.includes(ustensileItems[i])) {
                listItems += new FilterItem(ustensileItems[i]).filterItemBlock;
            }             
        }
    } 
    document.getElementById("ustensilesList").innerHTML = listItems;
    
    // Ajout des listeners pour créer les tags depuis la liste filtrée des appareils
    createdItems = document.getElementById("ustensilesList").children;
    for (let index = 0; index < createdItems.length; index++) {
        const item = createdItems[index];
        item.addEventListener("click", () =>{
            // @ts-ignore 
            manageTag("add", "ustensile", item.innerText);            
        })        
    }
    // Reset de la variable après avoir ajouté les items du filtre
    listItems = "";
}


/**
 * Fonction de gestion des tags
 * @param {*} eventType Valeur "add" ou "delete" pour gérer s'il faut créer le tag ou le supprimer s'il existe déjà
 * @param {*} tagType Gestion de la mise en forme selon le filtre d'origine du tag (ingredient, appareil, ustensile)
 * @param {*} content Texte à afficher dans le tag (Ex : Coco)
 */
 function manageTag(eventType, tagType, content) {
    switch (eventType) {
        case "add":
            switch (tagType) {
                case "ingredient":
                    ingredientTags.push(content);
                    break;
                case "appareil":
                    appareilTags.push(content);
                    break;
                case "ustensile":
                    ustensileTags.push(content);
                    break;
            }
            applyFilters();
            break;
        case "delete":
            switch (tagType) {
                case "ingredient":
                    ingredientTags = arrayRemove(ingredientTags, content);
                    break;
                case "appareil":
                    appareilTags = arrayRemove(appareilTags, content);
                    break;
                case "ustensile":
                    ustensileTags = arrayRemove(ustensileTags, content);
                    break;
            }
            applyFilters();
            break;
    }
}

/**
 * Recherche faite via les input positionnés sur les filtres avancés
 */
function advancedSearch() {
    
}

/**
 * Création de listeners au chargement de la page
 */
 function createListenersOnLoad(){
    // Ajout d'un listener sur le champ de recherche et la loupe pour activer la recherche dès que 3 caractères ou plus sont entrés
    document.querySelector("#inputMainSearch").addEventListener("keyup", applyFilters);
    document.querySelector("#mainSearchButton").addEventListener("keyup", applyFilters);

    // Ajout des listeners sur les boutons des filtres pour afficher/réduire les listes
    document.querySelector("#displayIngredientsList").addEventListener("click", () =>{
        toggleFiltersList("ingredients", "display")
    });
    document.querySelector("#hideIngredientsList").addEventListener("click", () =>{
        toggleFiltersList("ingredients", "hide")
    });
    document.querySelector("#displayAppareilsList").addEventListener("click", () =>{
        toggleFiltersList("appareils", "display")
    });
    document.querySelector("#hideAppareilsList").addEventListener("click", () =>{
        toggleFiltersList("appareils", "hide")
    });
    document.querySelector("#displayUstensilesList").addEventListener("click", () =>{
        toggleFiltersList("ustensiles", "display")
    });
    document.querySelector("#hideUstensilesList").addEventListener("click", () =>{
        toggleFiltersList("ustensiles", "hide")
    });

    // Ajout d'un listener sur les champs de recherche dans les filtres avancés
    document.querySelector("#inputIngredient").addEventListener("keyup", advancedSearch);
    document.querySelector("#inputAppareil").addEventListener("keyup", advancedSearch);
    document.querySelector("#inputUstensile").addEventListener("keyup", advancedSearch);
}

/**
 * Fonction d'initialisation de la page, affichage par défaut lors du premier chargement
 */
function init(){
    applyFilters();
    createListenersOnLoad();    
}

init();