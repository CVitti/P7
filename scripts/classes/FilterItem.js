export default class FilterItem{
    constructor(ingredientName){
        this.ingredientName = ingredientName;
        this.create();
    }
    create(){
        this.filterItemBlock = `<div class="filterItem">${this.ingredientName}</div>`;
    }
}