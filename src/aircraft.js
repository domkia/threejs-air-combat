
class Aircraft {

    constructor(model){
        this.vel = THREE.Vector3(0, 0, 0);
        this.model = model;
        
        this.yaw = 0;
        this.pitch = 0;
        this.roll = 0;
        this.fire = false;
    }

    update(){
        this.model.translateZ(0.4);
        this.model.rotateX(0.016 * this.pitch);
        this.model.rotateZ(0.025 * this.roll);
        this.model.rotateY(0.01 * this.yaw);
    }

    setYaw(yaw){
        this.yaw = yaw;
        this.model.morphTargetInfluences[0] = this.yaw;
    }

    setPitch(pitch){
        this.pitch = pitch;
        this.model.morphTargetInfluences[1] = this.pitch;
    }

    setRoll(roll){
        this.roll = roll;
        this.model.morphTargetInfluences[2] = this.roll;
    }
}

export default Aircraft;