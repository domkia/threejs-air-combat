import Bullet from './bullet.js';
import './js/GLTFLoader.js';
import Input from './input.js';
import Player from './player.js';
import ChaseCamera from './chaseCamera.js';

const WIDTH = 1024;
const HEIGHT = 480;

var camera, chaseCamera, scene, renderer;
var player = null;
var reticle = null;
var dots = [];
var bullets = [];

init();

function loadGLTF(path, callback){
    const meshLoader = new THREE.GLTFLoader();
    meshLoader.load(path, (gltf) => {
        callback(gltf.scene);
    });
}

function createAircraft(model){
    var meshes = model.children;

    // Aircraft
    var f4u = meshes[0];
    f4u.material = new THREE.MeshToonMaterial({
        morphTargets: true
    });
    f4u.castShadow = true;

    //Propeller
    var prop = f4u.children[0];
    prop.material = new THREE.MeshBasicMaterial({
        color: '#FFFFFF', 
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
    }); 

    f4u.position.set(0, 20, 50);
    player = new Player(f4u, new Input(document));
    chaseCamera = new ChaseCamera(player.model);
    scene.add(f4u);
}

function createBullets(model){
    var bulletMesh = model.children[0];
    bulletMesh.material = new THREE.MeshBasicMaterial({color: '#FFAA22'});
    bulletMesh.castShadow = false;
    bulletMesh.receiveShadow = false;
    bulletMesh.position.set(0, -100, 0);
    bulletMesh.scale.set(2.0, 2.0, 2.0);

    for(var i = 0; i < 10; i++){
        var bullet = new Bullet(bulletMesh.clone());
        bullets.push(bullet);
        scene.add(bullet.bullet);
    }
}

function createGround(){
    var texture = new THREE.ImageUtils.loadTexture('./res/images/checkerboard.jpg');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(40, 40);
    var waterMaterial = new THREE.MeshToonMaterial({map: texture, color: '#88EEFF'});
    var water = new THREE.Mesh(new THREE.PlaneGeometry(500, 500, 20, 20), waterMaterial);
    water.receiveShadow = true;
    water.castShadow = false;
    water.rotateX(-3.1415 / 2);
    scene.add(water);
}

function loadSkybox(){
    const loader = new THREE.CubeTextureLoader();
    const cubemap = loader.load([
        './res/images/skybox/left.png',
        './res/images/skybox/right.png',
        './res/images/skybox/up.png',
        './res/images/skybox/down.png',
        './res/images/skybox/front.png',
        './res/images/skybox/back.png'
    ]);
    scene.background = cubemap;
}

function setupSceneLighting(){
    var light = new THREE.HemisphereLight('#1c83f3', '#a5d5fd', 0.5);
    scene.add(light);

    var dirLight = new THREE.DirectionalLight('#FFFFFF', 0.5);
    dirLight.castShadow = true;
    dirLight.translateX(20);
    dirLight.translateY(20);
    scene.add(dirLight);
}

function createReticle(){

    //create sprite
    var textureLoader = new THREE.TextureLoader();
    var reticleTexture = textureLoader.load('./res/images/reticle.png');
    reticle = new THREE.Sprite(
        new THREE.SpriteMaterial({
            map: reticleTexture,
            color: 0xff22ff,
            depthTest: false,
            sizeAttenuation: false
        })
    );
    reticle.scale.set(0.04, 0.04, 0.04);
    scene.add(reticle);

    var dotTexture = textureLoader.load('./res/images/reticle_dot.png');
    var dotMaterial = new THREE.SpriteMaterial({
        map: dotTexture,
        color: 0xff22ff,
        depthTest: false
    });

    dots.push(new THREE.Sprite(dotMaterial));
    dots[0].scale.set(0.5, 0.5, 0.5);
    scene.add(dots[0]);
    dots.push(new THREE.Sprite(dotMaterial));
    dots[1].scale.set(0.75, 0.75, 0.75);
    scene.add(dots[1]);
}

function createSceneCamera(){
    camera = new THREE.PerspectiveCamera(30, WIDTH / HEIGHT, 0.01, 1000);
    camera.position.set(-200, 300, -200);
    camera.lookAt(0, 0, 0);
}

function init(){

    scene = new THREE.Scene();
    createSceneCamera();
    loadSkybox();
    setupSceneLighting();
    createGround();
    loadGLTF('./res/3d/F4U.gltf', createAircraft);
    loadGLTF('./res/3d/Bullet.gltf', createBullets);
    createReticle();

    // setup renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;
    document.getElementById('canvas').appendChild(renderer.domElement);

    update();
}

const shootCooldown = 0.20;
var timer = shootCooldown;
var index = 0;
var leftRight = true;

function update(){
    requestAnimationFrame(update);
    
    for(var i = 0; i < bullets.length; i++){
        bullets[i].update();
    }

    if(player !== null)
    {
        player.update();

        // plane's forward vector in world space
        var planeForward = new THREE.Vector3();
        player.model.getWorldDirection(planeForward);

        // up vector in world space
        var planeUp = new THREE.Vector3(0, 1, 0);
        planeUp.applyQuaternion(player.model.quaternion);

        var planeRight = new THREE.Vector3(1, 0, 0);
        planeRight.applyQuaternion(player.model.quaternion);

        // shooting
        // TODO: move this into aircraft class?
        timer += 0.016;
        if(player.fire === true){
            if(timer > shootCooldown){
                if(bullets[index].isAlive === false){
                    bullets[index].shoot(
                        player.model.position.clone()
                        .add(planeRight.clone().multiplyScalar(leftRight === true? 1 : -1))
                        .add(planeForward.clone().multiplyScalar(2.0)), player.model.quaternion.clone());
                    timer = 0;
                    leftRight = !leftRight;
                }
                index = (index + 1) % bullets.length;
            }
        }
                
        // position reticle
        // TODO: move to separate class
        var reticlePos = player.model.position.clone().add(planeForward.clone().multiplyScalar(20));
        dots[0].position.set(reticlePos.x, reticlePos.y, reticlePos.z);
        reticlePos.add(planeForward.clone().multiplyScalar(20));
        dots[1].position.set(reticlePos.x, reticlePos.y, reticlePos.z);
        reticlePos.add(planeForward.clone().multiplyScalar(60));
        reticle.position.set(reticlePos.x, reticlePos.y, reticlePos.z);

        // position chase camera
        chaseCamera.update();
    }

    if(chaseCamera === undefined){
        renderer.render(scene, camera);
    }else{
        renderer.render(scene, chaseCamera.camera);
    }
}