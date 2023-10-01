class Toy{
    constructor(id){
        this.x=-50
        this.id=id
    }
    draw(){
        image(imgs[this.id],this.x,300,64,64)
        if (this.x>650){
            toys.splice(toys.indexOf(this),1)
        }
    }
}