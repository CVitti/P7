/**
 * Retourne un tableau donné sans la valeur que l'on souhaite supprimer
 * @param {*} array Tableau dans lequel une valeur est à supprimer
 * @param {*} value Valeur à supprimer
 * @returns Tableau sans la valeur supprimée
 */
 export function arrayRemove(array, value) { 
    return array.filter(function(element){ 
        return element != value; 
    });
}

/**
 * Tri d'un tableau apr ordre alphabétique croissant
 * @param {*} tab Tableau passé en entrée, à trier
 * @returns tableau trié par ordre alphabétique
 */
 export function sortByName(tab) {
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
