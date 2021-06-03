import * as THREE from 'https://unpkg.com/three@0.125.2/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.125.2/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://unpkg.com/three@0.125.2/examples/jsm/controls/OrbitControls.js';
import { PointerLockControls } from 'https://unpkg.com/three@0.125.2/examples/jsm/controls/PointerLockControls.js';

var event = 0;
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
var wallTexture = textureLoader.load("./resources/textures/FloorTileAmbientOcclusion.png");
wallTexture.wrapS = THREE.RepeatWrapping;
wallTexture.wrapT = THREE.RepeatWrapping;
wallTexture.repeat.set(1, 1);
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
KeyTexture.repeat.set(1, 1); 
var GlassTexture = textureLoader.load("./resources/textures/GlassTexture.png");
GlassTexture.mapping = THREE.CubeRefractionMapping;
GlassTexture.wrapS= THREE.RepeatWrapping;
GlassTexture.wrapT = THREE.RepeatWrapping;
GlassTexture.repeat.set(1,1);
var WoodTexture = textureLoader.load("./resources/textures/WoodTexture.jpg");
WoodTexture.mapping = THREE.CubeRefractionMapping;
WoodTexture.wrapS= THREE.RepeatWrapping;
WoodTexture.wrapT = THREE.RepeatWrapping;
WoodTexture.repeat.set(1,1);
var ePrompt = textureLoader.load("./resources/textures/EPrompt.png");

//materials
var Glass = new THREE.MeshPhongMaterial({
	color: 0xffffff,
	wireframe: false,
	map: GlassTexture,
	refractionRatio: 0.98,
	//reflectivity: 0.9,
	opacity: 0.5,
	transparent: true
});
var whiteMaterial = new THREE.MeshBasicMaterial ({
	color: 0xffffff,
	wireframe: false
});

//object interaction
function getKey() {
    if (event==0){
		event = 1;
		scene.remove(key);
	}
}
function getFile(){
	if (event==1){
		event = 2;
	}
}
function getFormula(){
	if (event==2){
		event = 3;
	}
}
function getAcid(){
	if (event==3){
		event = 4;
		flaskCabinet.remove(flask1);
		flaskCabinet.remove(flask4);
	}
}

function openDoor() {
    if (event == 4) {
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
var meshroof = new THREE.Mesh(
	new THREE.PlaneGeometry(75, 75),
	new THREE.MeshPhongMaterial(
		{
			color: 0xa9a9a9,
            wireframe: false,
			roughness: 1
		}
	),
);
var meshKeyMaterial = new THREE.Mesh(
	new THREE.PlaneGeometry(75, 75),
	new THREE.MeshPhongMaterial(
		{
			color: 0xffffff,
            wireframe: false,
            map: KeyTexture,
		}
	),
);
meshfloor.position.y -= 0.5;
meshfloor.rotation.x -= Math.PI / 2;
meshroof.position.y += 7;
meshroof.rotation.x += Math.PI/2;


//constants
const worldWidth = 256, worldDepth = 256;
const clock = new THREE.Clock();

//HUD
const cameraOrtho = new THREE.OrthographicCamera( -window.innerWidth / 2, window.innerWidth / 2, window.innerHeight / 2, -window.innerHeight / 2, 1, 10 );
cameraOrtho.position.y = 3;
cameraOrtho.position.z = 10;
var sceneOrtho = new THREE.Scene();
var spriteMaterial = new THREE.SpriteMaterial({
	map: ePrompt,
	color: 0xffffff
});
var width = 2;
var height = 2;
var temporary = new THREE.Sprite(spriteMaterial);
temporary.center.set(0,1);
temporary.scale.set(width,height,1);
function makeHUD(){
	sceneOrtho.add(temporary);
	updateHUD();
}
function updateHUD(){
	temporary.position.set(-window.innerWidth/2, window.innerHeight/2, 1);
}

//scene
var scene = new THREE.Scene();
scene.background = new THREE.Color(0xfbfbfb );
const camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0, 3, 12);
camera.lookAt(0, 0, 0);

scene.add(meshfloor);
scene.add(meshroof);

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

//key model
var key = new THREE.Group();
var keyMaterial= new THREE.MeshBasicMaterial({
	color: 0xcc9a00
})
var gripgeom=new THREE.CylinderGeometry(0.15,0.15,0.1,16);
var shaftgeom=new THREE.BoxGeometry(0.5,0.1,0.1);
var endgeom=new THREE.BoxGeometry(0.15,0.1,0.1);
var keygrip=new THREE.Mesh(gripgeom,keyMaterial);
var keyshaft=new THREE.Mesh(shaftgeom,keyMaterial);
var keyend=new THREE.Mesh(endgeom,keyMaterial);
keyend.position.x += 0.15;
keyend.position.z += 0.05;
keyshaft.position.z -= 0.05;
keygrip.position.x -=0.3;
key.add(keygrip);
key.add(keyshaft);
key.add(keyend);
key.position.x -= 12;
key.position.y += 1.5;
key.position.z += 11.5;
scene.add(key);

//flask cabinet model
	//geometries
var flaskGeomSphere = new THREE.SphereGeometry(0.5,32,32, Math.PI/2,  Math.PI*2, 0, Math.PI);
var flaskGeomLiquid = new THREE.SphereGeometry(0.4,32,32, Math.PI/2,  Math.PI*2, Math.PI, Math.PI/2);
var flaskGeomTop = new THREE.CylinderGeometry(0.2,0.2,0.3,32);
var cabinetWood = new THREE.BoxGeometry();
	//liquid materials
var liquid0 = new THREE.MeshBasicMaterial({
    color: 0x0095DD,
   	wireframe: false
});
liquid0.side = THREE.DoubleSide
var liquid1 = new THREE.MeshBasicMaterial({
    color: 0x000000,
   	wireframe: false
});
liquid1.side = THREE.DoubleSide
var liquid2 = new THREE.MeshBasicMaterial({
    color: 0xFF5733,
   	wireframe: false
});
liquid2.side = THREE.DoubleSide
var liquid3 = new THREE.MeshBasicMaterial({
    color: 0xE3FF33,
   	wireframe: false
});
liquid3.side = THREE.DoubleSide
var liquid4 = new THREE.MeshBasicMaterial({
    color: 0xE3FF33,
   	wireframe: false
});
liquid4.side = THREE.DoubleSide
var liquid5 = new THREE.MeshBasicMaterial({
    color: 0xff0ff0,
   	wireframe: false
});
liquid5.side = THREE.DoubleSide
	//wood material
	var WoodMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
   	wireframe: false,
    map: WoodTexture
});
	//liquid meshes
var flaskLiquid0 = new THREE.Mesh(flaskGeomLiquid, liquid0);
var flaskLiquid1 = new THREE.Mesh(flaskGeomLiquid, liquid1);
var flaskLiquid2 = new THREE.Mesh(flaskGeomLiquid, liquid2);
var flaskLiquid3 = new THREE.Mesh(flaskGeomLiquid, liquid3);
var flaskLiquid4 = new THREE.Mesh(flaskGeomLiquid, liquid4);
var flaskLiquid5 = new THREE.Mesh(flaskGeomLiquid, liquid5);
	//glass meshes and position placement
var flaskSphere0 = new THREE.Mesh(flaskGeomSphere, Glass);
var flaskTop0 = new THREE.Mesh(flaskGeomTop, Glass);
flaskTop0.position.y += 0.5;
var flaskSphere1 = new THREE.Mesh(flaskGeomSphere, Glass);
var flaskTop1 = new THREE.Mesh(flaskGeomTop, Glass);
flaskTop1.position.y += 0.5;
var flaskSphere2 = new THREE.Mesh(flaskGeomSphere, Glass);
var flaskTop2 = new THREE.Mesh(flaskGeomTop, Glass);
flaskTop2.position.y += 0.5;
var flaskSphere3 = new THREE.Mesh(flaskGeomSphere, Glass);
var flaskTop3 = new THREE.Mesh(flaskGeomTop, Glass);
flaskTop3.position.y += 0.5;
var flaskSphere4 = new THREE.Mesh(flaskGeomSphere, Glass);
var flaskTop4 = new THREE.Mesh(flaskGeomTop, Glass);
flaskTop4.position.y += 0.5;
var flaskSphere5 = new THREE.Mesh(flaskGeomSphere, Glass);
var flaskTop5 = new THREE.Mesh(flaskGeomTop, Glass);
flaskTop5.position.y += 0.5;
	//wood meshes and position placement
var cabinetWood0 = new THREE.Mesh(cabinetWood, WoodMaterial);
cabinetWood0.scale.set(3.5,0.2,1.2);
cabinetWood0.position.y -= 0.5;
var cabinetWood1 = new THREE.Mesh(cabinetWood, WoodMaterial);
cabinetWood1.scale.set(3.5,0.2,1.2);
cabinetWood1.position.y += 1;
	//flask object creation
var flask0 = new THREE.Group();
flask0.add(flaskLiquid0);
flask0.add(flaskSphere0);
flask0.add(flaskTop0);
flask0.position.y +=1.5;
var flask1 = new THREE.Group();
flask1.add(flaskLiquid1);
flask1.add(flaskSphere1);
flask1.add(flaskTop1);
flask1.position.y +=1.5;
flask1.position.x +=1.1;
var flask2 = new THREE.Group();
flask2.add(flaskLiquid2);
flask2.add(flaskSphere2);
flask2.add(flaskTop2);
flask2.position.y +=1.5;
flask2.position.x -=1.1;
var flask3 = new THREE.Group();
flask3.add(flaskLiquid3);
flask3.add(flaskSphere3);
flask3.add(flaskTop3);
flask3.position.x -=1.1;
var flask4 = new THREE.Group();
flask4.add(flaskLiquid4);
flask4.add(flaskSphere4);
flask4.add(flaskTop4);
var flask5 = new THREE.Group();
flask5.add(flaskLiquid5);
flask5.add(flaskSphere5);
flask5.add(flaskTop5);
flask5.position.x += 1.1;
	//cabinet creation
var flaskCabinet = new THREE.Group();
flaskCabinet.add(flask0);
flaskCabinet.add(flask1);
flaskCabinet.add(flask2);
flaskCabinet.add(flask3);
flaskCabinet.add(flask4);
flaskCabinet.add(flask5);
flaskCabinet.add(cabinetWood0);
flaskCabinet.add(cabinetWood1);
flaskCabinet.position.x += 15.2;
flaskCabinet.position.y += 3;
flaskCabinet.position.z += 4;
flaskCabinet.rotation.y += Math.PI/2;
scene.add(flaskCabinet);

//renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.autoClear = false;
document.body.appendChild( renderer.domElement );

//start button and camera movement
var controls = new PointerLockControls(camera,renderer.domElement);
const menuPanel = document.getElementById('menuPanel');
const startButton = document.getElementById('startButton');
//var textPage = document.getElementById('paper');
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
                    else if (camera.position.x < 5 && camera.position.x > -5) {
                        openDoor();
                    }
                }
			else if (camera.position.z<12){
				if (camera.position.x <-5){
					if (camera.position.z<3){
						getFile();
					}
				}
				else if (camera.position.x > 5){
					if (camera.position.z>3){
						getFormula();
					}
				}
			}
			if (camera.position.x > 5){
				getAcid();
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
var cylgeometry = new THREE.CylinderGeometry(2.5,2.5,12,32);

var meshBasicMaterial = new THREE.MeshBasicMaterial({
    //blue color: 0x0095DD,
    color: 0xffffff,
   	wireframe: false,
    map: wallTexture
});

var blackMaterial = new THREE.MeshBasicMaterial ({
	color: 0x434343,
	wireframe: false
});

var cylinder = new THREE.Mesh(cylgeometry, Glass);
cylinder.position.z -= 4;
scene.add(cylinder);

var cube0 = new THREE.Mesh(geometry, blackMaterial);
cube0.position.z += 12;
cube0.position.x += 11;
cube0.scale.set(2, 1, 2);
scene.add(cube0);
var cube1 = new THREE.Mesh(geometry, meshKeyMaterial);
cube1.position.z += 11.4;
cube1.position.x -= 12;
cube1.position.y += 1.5;
cube1.scale.set(1, 0.001, 0.75);
//scene.add(cube1);


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
	renderer.clear();
    renderer.render(scene, camera);
	renderer.clearDepth();
	renderer.render(sceneOrtho, cameraOrtho);
}
renderer.clear();
renderer.render(scene, camera);
renderer.clearDepth();
renderer.render(sceneOrtho, cameraOrtho);