// @domkia

// input class
class Input{

    hor = 0;
    vert = 0;
    zx = 0;
    space = false;

    constructor(doc){
        this.document = doc;

        this.onKeyDown = this.onKeyDown.bind(this);
        this.document.onkeydown = this.onKeyDown;
        this.onKeyUp = this.onKeyUp.bind(this);
        this.document.onkeyup = this.onKeyUp;
    }

    // on key down callback
    onKeyDown(event){
        event.view.event.preventDefault();

        // fire
        if(event.keyCode === 32){
            this.space = true;
        }

        // horizontal input
        if(event.keyCode === 37){
            this.hor = -1;
        }
        if(event.keyCode === 39){
            this.hor = 1;
        }

        // vertical input
        if(event.keyCode === 38){
            this.vert = 1;
        }
        if(event.keyCode === 40){
            this.vert = -1;
        }

        // z and x
        if(event.keyCode === 88){
            this.zx = -1;
        }
        if(event.keyCode === 90){
            this.zx = 1;
        }
    }

    // on key up callback
    onKeyUp(event){

        if(event.keyCode === 32){
            this.space = false;
        }

        if(event.keyCode === 37){
            if(this.hor < 0)
                this.hor = 0;
        }
        if(event.keyCode === 39){
            if(this.hor > 0)
                this.hor = 0;
        }
        if(event.keyCode === 38){
            if(this.vert > 0)
                this.vert = 0;
        }
        if(event.keyCode === 40){
            if(this.vert < 0)
                this.vert = 0;
        }
        if(event.keyCode === 88){
            if(this.zx < 0){
                this.zx = 0;
            }
        }
        if(event.keyCode === 90){
            if(this.zx > 0){
                this.zx = 0;
            }
        }
    }
}

export default Input;