import * as THREE from 'https://unpkg.com/three@0.125.2/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.125.2/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://unpkg.com/three@0.125.2/examples/jsm/controls/OrbitControls.js';
import { PointerLockControls } from 'https://unpkg.com/three@0.125.2/examples/jsm/controls/PointerLockControls.js';

var hasKey = 0;
//for controls 
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;

var prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();



//textures
var textureLoader = new THREE.TextureLoader();
var floorTexture = textureLoader.load("./resources/textures/01tizeta_floor_d.png");
floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(50, 50);
var wallTexture = textureLoader.load("./resources/textures/01tizeta_floor_d.png");
wallTexture.wrapS = THREE.RepeatWrapping;
wallTexture.wrapT = THREE.RepeatWrapping;
wallTexture.repeat.set(4, 4);
var earthTexture = textureLoader.load("./resources/textures/EarthTexture.jpg");
earthTexture.wrapS = THREE.RepeatWrapping;
earthTexture.wrapT = THREE.RepeatWrapping;
earthTexture.repeat.set(1, 1);
var CabinetTexture = textureLoader.load("./resources/textures/CabinetTexture.jpg");
CabinetTexture.wrapS = THREE.RepeatWrapping;
CabinetTexture.wrapT = THREE.RepeatWrapping;
CabinetTexture.repeat.set(1, 1);
var KeyTexture = textureLoader.load("./resources/textures/KeyTexture.jpg");
KeyTexture.wrapS = THREE.RepeatWrapping;
KeyTexture.wrapT = THREE.RepeatWrapping;
KeyTexture.repeat.set(1, 1)

//object interaction
function getKey() {
    //show acquisition
    hasKey = 1;
    scene.remove(cube1);
}

function openDoor() {
    if (hasKey == 1) {
        //show message
        //scene transition
    }
    else {
        //show message
    }
}

//planemeshs
var meshfloor = new THREE.Mesh(
	new THREE.PlaneGeometry(75, 75),
	new THREE.MeshPhongMaterial(
		{
			color: 0xffffff,
            wireframe: false,
            map: floorTexture,
		}
	),
);
meshfloor.position.y -= 0.5;
meshfloor.rotation.x -= Math.PI / 2;

//constants
const worldWidth = 256, worldDepth = 256;
const clock = new THREE.Clock();

//scene
var scene = new THREE.Scene();
scene.background = new THREE.Color(0xfbfbfb );
const camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0, 3, 12);
camera.lookAt(0, 0, 0);
scene.add(meshfloor);

//lighting
var ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);


//door model
var loader = new GLTFLoader();
loader.load('./resources/models/Door.gltf', function (gltf) {
    gltf.scene.color = ("LightGray");
    gltf.scene.scale.set(3, 2, 2);
    gltf.scene.position.y -= 0.5;
    gltf.scene.position.z += 15;
    gltf.scene.rotation.y -= Math.PI;
	scene.add(gltf.scene);

}, undefined, function (error) {

	console.error(error);

});

//closed desk model
loader = new GLTFLoader();
loader.load('./resources/models/DeskClosed.gltf', function (gltf) {
    gltf.scene.scale.set(2.5, 2.5, 2.5);
    gltf.scene.position.set(6.75,2,0);
    gltf.scene.rotation.y -= Math.PI;
    scene.add(gltf.scene);

}, undefined, function (error) {

    console.error(error);

});

//opened desk model
loader = new GLTFLoader();
loader.load('./resources/models/DeskOpen.gltf', function (gltf) {
    gltf.scene.scale.set(2.5, 2.5, 2.5);
    gltf.scene.position.set(-11, 2, 10);
    //gltf.scene.rotation.y -= Math.PI;
    scene.add(gltf.scene);

}, undefined, function (error) {

    console.error(error);

});

//tank model
loader = new GLTFLoader();
loader.load('./resources/models/Container.glb', function (gltf) {
    gltf.scene.scale.set(2.5, 4, 2.5);
    gltf.scene.position.set(0, 2, -4);
    gltf.scene.rotation.y -= Math.PI;
    scene.add(gltf.scene);

}, undefined, function (error) {

    console.error(error);

});

//renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//start button and camera movement
var controls = new PointerLockControls(camera,renderer.domElement);
const menuPanel = document.getElementById('menuPanel');
const startButton = document.getElementById('startButton');
startButton.addEventListener('click', function () {
   controls.lock();
    }, false);

    controls.addEventListener('lock', () => menuPanel.style.display = 'none');
    controls.addEventListener('unlock', () => menuPanel.style.display = 'block');

    scene.add( controls.getObject() );

    const onKeyDown = function ( event ) {
        switch ( event.code ) {
            case 'KeyW':
                moveForward = true;
                break;
            case 'KeyA':
                moveLeft = true;
                break;
            case 'KeyS':
                moveBackward = true;
                break;
            case 'KeyD':
                moveRight = true;
                break;
	    case 'KeyE':
	        if (camera.position.z > 12) {
                    if (camera.position.x < -10) {
                        getKey();
                    }
                    else if (camera.position < 5 && camera.position > -5) {
                        openDoor();
                    }
                }
		break;
            }
    };
    const onKeyUp = function ( event ) {
        switch ( event.code ) {
            case 'KeyW':
                moveForward = false;
                break;
            case 'KeyA':
                moveLeft = false;
                break;
            case 'KeyS':
                moveBackward = false;
                break;

            case 'KeyD':
                moveRight = false;
                break;
        }
    };

    document.addEventListener( 'keydown', onKeyDown );
    document.addEventListener( 'keyup', onKeyUp );

var geometry = new THREE.BoxGeometry();
var meshBasicMaterial = new THREE.MeshBasicMaterial({
    //blue color: 0x0095DD,
    color: 0xffffff,
   	wireframe: false,
    map: wallTexture
});

var cube0 = new THREE.Mesh(geometry, meshBasicMaterial);
cube0.position.z += 12;
cube0.position.x += 11;
cube0.scale.set(2, 1, 2);
scene.add(cube0);
var cube1 = new THREE.Mesh(geometry, meshKeyMaterial);
cube1.position.z += 11.4;
cube1.position.x -= 12;
cube1.position.y += 1.5;
cube1.scale.set(1, 0.001, 0.75);
scene.add(cube1);


var wallgeom = new THREE.BoxGeometry(0.5, 10, 7);
var wall0 = new THREE.Mesh(wallgeom, meshBasicMaterial);
wall0.position.x -= 6;
wall0.position.y += 3;
wall0.position.z += 10;
wall0.rotation.x += Math.PI / 2;
scene.add(wall0);
var wall1 = new THREE.Mesh(wallgeom, meshBasicMaterial);
wall1.position.x -= 6;
wall1.position.y += 3;
wall1.position.z -= 4;
wall1.rotation.x += Math.PI / 2;
scene.add(wall1);
var wall2 = new THREE.Mesh(wallgeom, meshBasicMaterial);
wall2.position.x += 6;
wall2.position.y += 3;
wall2.position.z += 10;
wall2.rotation.x += Math.PI / 2;
scene.add(wall2);
var wall3 = new THREE.Mesh(wallgeom, meshBasicMaterial);
wall3.position.x += 6;
wall3.position.y += 3;
wall3.position.z -= 4;
wall3.rotation.x += Math.PI / 2;
scene.add(wall3);
var wall4 = new THREE.Mesh(wallgeom, meshBasicMaterial);
wall4.position.x += 12;
wall4.position.y += 3;
wall4.position.z -= 8;
wall4.rotation.z += Math.PI / 2;
wall4.rotation.x += Math.PI / 2;
scene.add(wall4);
var wall5 = new THREE.Mesh(wallgeom, meshBasicMaterial);
wall5.position.x += 16;
wall5.position.y += 3;
wall5.position.z -= 4;
wall5.rotation.x += Math.PI / 2;
scene.add(wall5);
var wall6 = new THREE.Mesh(wallgeom, meshBasicMaterial);
wall6.position.x += 2;
wall6.position.y += 3;
wall6.position.z -= 8;
wall6.rotation.z += Math.PI / 2;
wall6.rotation.x += Math.PI / 2;
scene.add(wall6);
var wall7 = new THREE.Mesh(wallgeom, meshBasicMaterial);
wall7.position.x -= 16;
wall7.position.y += 3;
wall7.position.z += 6;
wall7.rotation.x += Math.PI / 2;
scene.add(wall7);
var wall8 = new THREE.Mesh(wallgeom, meshBasicMaterial);
wall8.position.x += 12;
wall8.position.y += 3;
wall8.position.z += 15;
wall8.rotation.z += Math.PI / 2;
wall8.rotation.x += Math.PI / 2;
scene.add(wall8);
var wall9 = new THREE.Mesh(wallgeom, meshBasicMaterial);
wall9.position.x -= 8;
wall9.position.y += 3;
wall9.position.z += 15;
wall9.rotation.z += Math.PI / 2;
wall9.rotation.x += Math.PI / 2;
scene.add(wall9);
var wall10 = new THREE.Mesh(wallgeom, meshBasicMaterial);
wall10.position.x -= 8;
wall10.position.y += 3;
wall10.position.z -= 8;
wall10.rotation.z += Math.PI / 2;
wall10.rotation.x += Math.PI / 2;
scene.add(wall10);
var wall11 = new THREE.Mesh(wallgeom, meshBasicMaterial);
wall11.position.x -= 18;
wall11.position.y += 3;
wall11.position.z -= 8;
wall11.rotation.z += Math.PI / 2;
wall11.rotation.x += Math.PI / 2;
scene.add(wall11);
var wall12 = new THREE.Mesh(wallgeom, meshBasicMaterial);
wall12.position.x -= 16;
wall12.position.y += 3;
wall12.position.z -= 4;
wall12.rotation.x += Math.PI / 2;
scene.add(wall12);
var wall13 = new THREE.Mesh(wallgeom, meshBasicMaterial);
wall13.position.x -= 16;
wall13.position.y += 3;
wall13.position.z += 16;
wall13.rotation.x += Math.PI / 2;
scene.add(wall13);
var wall14 = new THREE.Mesh(wallgeom, meshBasicMaterial);
wall14.position.x += 16;
wall14.position.y += 3;
wall14.position.z += 6;
wall14.rotation.x += Math.PI / 2;
scene.add(wall14);
var wall15 = new THREE.Mesh(wallgeom, meshBasicMaterial);
wall15.position.x += 16;
wall15.position.y += 3;
wall15.position.z += 16;
wall15.rotation.x += Math.PI / 2;
scene.add(wall15);
var wall16 = new THREE.Mesh(wallgeom, meshBasicMaterial);
wall16.position.x += 2;
wall16.position.y += 3;
wall16.position.z += 15;
wall16.rotation.z += Math.PI / 2;
wall16.rotation.x += Math.PI / 2;
scene.add(wall16);
var wall17 = new THREE.Mesh(wallgeom, meshBasicMaterial);
wall17.position.x -= 18;
wall17.position.y += 3;
wall17.position.z += 15;
wall17.rotation.z += Math.PI / 2;
wall17.rotation.x += Math.PI / 2;
scene.add(wall17);

var rectprism = new THREE.BoxGeometry(8,6,1);
var bluemat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: false,
    map: CabinetTexture
});
var rect = new THREE.Mesh( rectprism, bluemat);
rect.position.set(-11,0.5,-6);
scene.add(rect);


const geom = new THREE.SphereGeometry( 2.5, 32, 32 );
const redmat = new THREE.MeshBasicMaterial({
    color: 0xFFFFFF,
    wireframe: false,
    map: earthTexture
});
const sphere = new THREE.Mesh( geom, redmat );
sphere.position.set(11, 3, 12);
scene.add( sphere );

/*
const tetra = new THREE.TetrahedronGeometry(1.5, 0);
const yellowmat = new THREE.MeshBasicMaterial( { color: 0xFFD700} );
const tetrahedron = new THREE.Mesh(tetra, yellowmat);
tetrahedron.position.set(-5, 2, -1);
scene.add( tetrahedron);
*/

const light = new THREE.PointLight(0xD50000, 10, 50, 3 );
light.position.set(0, 3, 3);
light.intensity = 0.5;
scene.add(light);
const light1 = new THREE.PointLight(0xD50000, 10, 50, 3);
light1.position.set(10, 3, 3);
light1.intensity = 0.5;
scene.add(light1);
const light2 = new THREE.PointLight(0xD50000, 10, 50, 3);
light2.position.set(-10, 3, 3);
light2.intensity = 0.5;
scene.add(light2);

animate();
window.addEventListener('resize', onWindowResize);

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

var lightincrease = 0;
function animate() {
    requestAnimationFrame(animate);
    sphere.rotation.y += 0.003;
    if (lightincrease == 0) {
        light.intensity -= 0.01;
        light1.intensity -= 0.01;
        light2.intensity -= 0.01;
        if (light.intensity <= 0) {
            lightincrease = 1;
        }
    }
    else {
        light.intensity += 0.01;
        light1.intensity += 0.01;
        light2.intensity += 0.01;
        if (light.intensity >= 1) {
            lightincrease = 0;
        }
    }
    const time = performance.now();
    if ( controls.isLocked === true ) {
        const delta = ( time - prevTime ) / 1000;
        velocity.x -= velocity.x * 30.0 * delta;
		velocity.z -= velocity.z * 30.0 * delta;
        direction.z = Number( moveForward ) - Number( moveBackward );
		direction.x = Number( moveRight ) - Number( moveLeft );
        direction.normalize();
        if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
		if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;
        controls.moveRight( - velocity.x * delta );
		controls.moveForward( - velocity.z * delta );
    
    }
    prevTime = time;

    renderer.render(scene, camera);
}

renderer.render(scene, camera);
