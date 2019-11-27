
class ChaseCamera{

    constructor(target){
        this.target = target;
        this.camera = new THREE.PerspectiveCamera(40, 1024 / 480, 0.01, 1000);
        this.camera.position.set(0, 50, 0);
    }

    update(){

        var up = new THREE.Vector3(0, 1, 0);
        up.applyQuaternion(this.target.quaternion);
        var dir = new THREE.Vector3(this.target.position.x, this.target.position.y, this.target.position.z);
        dir.sub(new THREE.Vector3(this.camera.position.x, this.camera.position.y, this.camera.position.z));
        dir.add(up.clone().multiplyScalar(3));
        dir.normalize();
        
        const minDist = 8;
        const maxDist = 20;
        const dist = this.camera.position.distanceTo(this.target.position);
        var speed = (dist - minDist) / (maxDist - minDist);
        dir.multiplyScalar(1.25 * speed);

        var forward = new THREE.Vector3(0, 0, 1);
        forward.applyQuaternion(this.target.quaternion);
        var lookAtPoint = this.target.position.clone().add(forward.clone().multiplyScalar(8));

        this.camera.position.add(dir);
        this.camera.lookAt(lookAtPoint);
    }
}

export default ChaseCamera;