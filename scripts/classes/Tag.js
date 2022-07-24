export default class Tag{
    constructor(id, category, content){
        this.content = content
        this.id = id;
        this.category = category;
        this.create();
    }
    create(){
        this.tagBlock =`<div class="tag bold ${this.category}Tag" id="tag${this.id}">
                            <span>${this.content}</span>
                            <i class="fa-regular fa-circle-xmark fa-lg" id="deleteTag${this.id}"></i>
                        </div>`;
    }
}