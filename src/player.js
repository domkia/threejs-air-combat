import Aircraft from "./aircraft.js";

class Player extends Aircraft{

    constructor(model, input){
        super(model);
        this.input = input;
    }

    update(){
        super.setRoll(this.input.hor);
        super.setPitch(this.input.vert);
        super.setYaw(this.input.zx);
        this.fire = this.input.space;
        super.update();
    }
}

export default Player;