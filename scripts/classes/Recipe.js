export default class Recipe{
    constructor(content){
        this.name = content.name;
        this.time = content.time;
        this.description = content.description;
        this.ingredients = content.ingredients;
        this.create();
    }
    create(){
        this.recipeBlock = `<article>
                                <div class="recipePicture"></div>
                                <div class="recipeInfos">
                                <div class="divRecipeName">${this.name}</div>
                                    <div class="bold500 divTimer">
                                        <i class="fa-regular fa-clock fa-lg"></i>
                                            ${this.time} min
                                    </div>
                                    <p class="recipeIngredients">`;

        // Parcours de chaque ingrédient de la recette
        for (let index = 0; index < this.ingredients.length; index++) {
            this.currentIngredient = this.ingredients[index];
            this.recipeBlock += `<span class="bold600">${this.currentIngredient.ingredient}</span>`;
            if (this.currentIngredient.quantity) {
                this.recipeBlock += `: ${this.currentIngredient.quantity}`;
            }
            if (this.currentIngredient.unit) {
                switch (this.currentIngredient.unit) {
                    case "grammes":
                        this.recipeBlock += "g";
                        break;
                    case "ml": case "cl": case "kg":
                        this.recipeBlock += this.currentIngredient.unit;
                        break;

                    default:
                        this.recipeBlock += " " + this.currentIngredient.unit;
                        break;
                }
            }
            this.recipeBlock += `<br/>`
        }
        this.recipeBlock +=`        </p>
                                    <p class="recipeDescription">${this.description}</p>
                                </div>
                            </article>`;
    }
}