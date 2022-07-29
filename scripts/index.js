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
    for (const currentRecipe of recipesToDisplay) {
        // Création du code HMTL de la recette via la classe Recipe
        listArticles += new Recipe(currentRecipe).recipeBlock;
    }

    // Si aucun résultat dans les recettes après la recherche, génération aléatoire de mots-clés parmis toutes les recettes existantes
    if (listArticles == "") {
        let recipeEx1 = Math.floor(Math.random() * recipes.length);
        let recipeEx2 = Math.floor(Math.random() * recipes.length);
        listArticles = `Aucune recette ne correspond à vos critères, vous pouvez chercher "${recipes[recipeEx1].name}" ou encore "${recipes[recipeEx2].name}"`;
    }
    document.getElementById("recipeSection").innerHTML = listArticles;    
}

/**
 * Fonction qui parcoure les tags qui ont été sélectionnés afin de les afficher
 */
function displayTags() {
    document.getElementById("divTags").innerHTML = "";

    // Création des tags des ingrédients sélectionnés
    let listTags = "";
    for (const tag of ingredientTags) {
        listTags += new Tag(currentTagId, "ingredient", tag).tagBlock;      
        // Incrémentation du conteur de tags créés pour chaque ID donné
        currentTagId++;
    }

    // Création des tags des appareils sélectionnés
    for (const tag of appareilTags) {
        listTags += new Tag(currentTagId, "appareil", tag).tagBlock;
        // Incrémentation du conteur de tags créés pour chaque ID donné
        currentTagId++;
    }

    // Création des tags des ustensiles sélectionnés
    for (const tag of ustensileTags) {
        listTags += new Tag(currentTagId, "ustensile", tag).tagBlock;
        // Incrémentation du conteur de tags créés pour chaque ID donné
        currentTagId++;
    }

    document.getElementById("divTags").innerHTML += listTags;

    // Ajout des listeners pour supprimer les tags des ingrédients filtrés
    let createdTags = document.getElementById("divTags").children;
    for (const tag of createdTags) {
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
 * @param {*} action Définit l'action qui doit être effectuée sur le filtre (afficher/masquer)
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
        recipes.forEach(recipe => {

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
                ingredientTags.forEach(tag => {
                    if(recipe.ingredients.findIndex(list => list.ingredient.includes(tag)) == -1 && canBeDisplayed){
                        canBeDisplayed = false;
                    }
                });
            }

            // Test de correspondance entre les tags Appareil et la recette
            if (appareilTags.length > 0) {
                appareilTags.forEach( tag => {
                    if(!recipe.appliance.includes(tag) && canBeDisplayed){
                    canBeDisplayed = false;
                    }
                });
            }

            // Test de correspondance entre les tags Ustensiles et la recette
            if (ustensileTags.length > 0) {
                ustensileTags.forEach(tag => {
                    if(recipe.ustensils.findIndex(list => list.includes(tag)) == -1 && canBeDisplayed){
                        canBeDisplayed = false;
                    }
                });
            }

            // Si validation de tous les filtres, ajour de la recette au tableau à afficher
            if (canBeDisplayed) {
                filteredRecipes.push(recipe);
            }
        });
    }

    // Parcours de toutes les recettes filtrées pour récupérer les ingrédients/appareils/ustensiles uniques
    ingredientItems = [];
    appareilItems = [];
    ustensileItems = [];

    filteredRecipes.forEach(currentRecipe => {

        // Boucle qui parcoure les ingrédients de la recette
        currentRecipe.ingredients.forEach(ingredient => {
            if (!ingredientItems.includes(ingredient.ingredient)) {
                ingredientItems.push(ingredient.ingredient);
            }
        });

        // Boucle qui parcoure les appareils de la recette
        if (!appareilItems.includes(currentRecipe.appliance)) {
            appareilItems.push(currentRecipe.appliance);
        }

        // Boucle qui parcoure les ustensiles de la recette
        currentRecipe.ustensils.forEach(ustensile => {
            if (!ustensileItems.includes(ustensile)) {
                ustensileItems.push(ustensile);
            }
        });
    });

    // Appels des fonctions d'affichage des tags et recettes après avoir trié les recettes
    displayRecipes(filteredRecipes);
    displayTags();
    addFiltersContent(ingredientItems, appareilItems, ustensileItems);
}


/**
 * Parcoure les tableaux de chaque filtre pour en afficher les ingrédients/appareils/ustensiles restants
 * @param {*} arrayIngredients Tableau contenant les ingrédients restants
 * @param {*} arrayAppareils Tableau contenant les appareils restants
 * @param {*} arrayUstensiles Tableau contenant les ustensiles restants
 */
function addFiltersContent(arrayIngredients, arrayAppareils, arrayUstensiles) {
    // Tri des tableaux recus en entrée avant affichage
    arrayIngredients = sortByName(arrayIngredients);
    arrayAppareils = sortByName(arrayAppareils);
    arrayUstensiles = sortByName(arrayUstensiles);
    let listItems = "";
    let createdItems = null;

    // Variable contenant true ou false selon la comparaison de 2 tableaux
    let similarArrays = (a, b) => {
        if (a.length !== b.length) return false;
        const uniqueValues = new Set([...a, ...b]);
        for (const value of uniqueValues) {
            const aCount = a.filter(e => e === value).length;
            const bCount = b.filter(e => e === value).length;
            if (aCount !== bCount) return false;
        }
        return true;
        }

    // Ajout du contenu dans le filtre des ingrédients
    if (arrayIngredients.length == 0 || similarArrays(arrayIngredients, ingredientTags)) {
        listItems += "Aucun filtre disponible";
    } else {        
        for (const ingredient of arrayIngredients) {
            if (!ingredientTags.includes(ingredient)) {
                listItems += new FilterItem(ingredient).filterItemBlock;
            }
        }
    }        
    document.getElementById("ingredientsList").innerHTML = listItems;
    
    // Ajout des listeners pour créer les tags depuis la liste filtrée des ingrédients
    createdItems = document.getElementById("ingredientsList").children;
    for (const item of createdItems) {
        item.addEventListener("click", () =>{
            // @ts-ignore
            manageTag("add", "ingredient", item.innerText);            
        })
    }

    // Reset de la variable après avoir ajouté les items du filtre
    listItems = "";

    // Ajout du contenu dans le filtre des appareils

    if (arrayAppareils.length == 0 || similarArrays(arrayAppareils, appareilTags)) {
        listItems += "Aucun filtre disponible";
    } else {     
        for (const appareil of arrayAppareils) {
            if (!appareilTags.includes(appareil)) {
                listItems += new FilterItem(appareil).filterItemBlock;
            }
        }   
    } 
    document.getElementById("appareilsList").innerHTML = listItems;
    
    // Ajout des listeners pour créer les tags depuis la liste filtrée des appareils
    createdItems = document.getElementById("appareilsList").children;
    for (const item of createdItems) {
        item.addEventListener("click", () =>{
            // @ts-ignore
            manageTag("add", "appareil", item.innerText);            
        })
    }
    // Reset de la variable après avoir ajouté les items du filtre
    listItems = "";

    // Ajout du contenu dans le filtre des ustensiles
    if (arrayUstensiles.length == 0 || similarArrays(arrayUstensiles, ustensileTags)) {
        listItems += "Aucun filtre disponible";
    } else {        
        for (const ustensile of arrayUstensiles) {
            if (!ustensileTags.includes(ustensile)) {
                listItems += new FilterItem(ustensile).filterItemBlock;
            }
        }
    } 
    document.getElementById("ustensilesList").innerHTML = listItems;
    
    // Ajout des listeners pour créer les tags depuis la liste filtrée des appareils
    createdItems = document.getElementById("ustensilesList").children;
    for (const item of createdItems) {
        item.addEventListener("click", () =>{
            // @ts-ignore
            manageTag("add", "ustensile", item.innerText);            
        })
    }
    // Reset de la variable après avoir ajouté les items du filtre
    listItems = "";
}

/**
 * Filtre des items qui remontent dans la liste de chaque filtre en fonction de la recherche avancée
 * @param {*} category Filtre à partir d'où la recherche est effectuée
 * @param {*} content Valeur recherchée
 */
function advancedSearch(category, content) {
    let block = null;
    let searchedItems = [];

    switch (category) {
        case "ingredient":
            block = document.getElementById("ingredientsList");
            if (content != "") {
                for (const item of ingredientItems) {
                    if (item.toLowerCase().includes(content.toLowerCase())) {
                        searchedItems.push(item);
                    }
                }
                if (searchedItems == []) {
                    searchedItems = [];
                }
                searchedItems;
                addFiltersContent(searchedItems, appareilItems, ustensileItems);
            } else {
                applyFilters();
            }
            break;
        case "appareil":
            block = document.getElementById("appareilsList");
            if (content != "") {
                for (const item of appareilItems) {
                    if (item.toLowerCase().includes(content.toLowerCase())) {
                        searchedItems.push(item);
                    }
                }
                if (searchedItems == []) {
                    searchedItems = [];
                }
                searchedItems;
                addFiltersContent(ingredientItems, searchedItems, ustensileItems);
            } else {
                applyFilters();
            }
            break;
        case "ustensile":
            block = document.getElementById("ustensilesList");
            if (content != "") {
                for (const item of ustensileItems) {
                    if (item.toLowerCase().includes(content.toLowerCase())) {
                        searchedItems.push(item);
                    }
                }
                if (searchedItems == []) {
                    searchedItems = [];
                }
                searchedItems;
                addFiltersContent(ingredientItems, appareilItems, searchedItems);
            } else {
                applyFilters();
            }
            break;
    }
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
                    // @ts-ignore
                    document.getElementById("inputIngredient").value = "";
                    break;
                case "appareil":
                    appareilTags.push(content);
                    // @ts-ignore
                    document.getElementById("inputAppareil").value = "";
                    break;
                case "ustensile":
                    ustensileTags.push(content);
                    // @ts-ignore
                    document.getElementById("inputUstensile").value = "";
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
    document.querySelector("#inputIngredient").addEventListener("keyup", (e) => {
        // @ts-ignore
        advancedSearch("ingredient", e.target.value);
    });
    document.querySelector("#inputAppareil").addEventListener("keyup", (e) => {
        // @ts-ignore
        advancedSearch("appareil", e.target.value);
    });
    document.querySelector("#inputUstensile").addEventListener("keyup", (e) => {
        // @ts-ignore
        advancedSearch("ustensile", e.target.value);
    });
}

/**
 * Fonction d'initialisation de la page, affichage par défaut lors du premier chargement
 */
function init(){
    applyFilters();
    createListenersOnLoad();    
}

init();