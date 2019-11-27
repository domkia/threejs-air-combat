const cooldown = 2.0;
const speed = 500.0;

class Bullet{

    constructor(bullet){
        this.bullet = bullet;
        this.isAlive = false;
    }

    shoot(position, quaternion){
        this.direction = new THREE.Vector3(0, 0, 1).applyQuaternion(quaternion)
        this.position = position;
        this.bullet.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
        this.bullet.position.set(position.x, position.y, position.z);
        this.timer = 0;
        this.isAlive = true;
    }

    disable(){
        this.isAlive = false;
        this.bullet.position.set(0, -100, 0);
    }

    getPosition(){
        return this.bullet.position;
    }

    update(){
        const dt = 0.016;

        if(this.isAlive === false){
            return;
        }

        this.timer += dt;
        if(this.timer > cooldown){
            this.disable();
        }

        this.bullet.translateZ(speed * dt);
    }
}

export default Bullet;