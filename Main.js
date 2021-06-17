import * as THREE from 'https://unpkg.com/three@0.125.2/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.125.2/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'https://unpkg.com/three@0.125.2/examples/jsm/loaders/FBXLoader.js';
import { OrbitControls } from 'https://unpkg.com/three@0.125.2/examples/jsm/controls/OrbitControls.js';
import { PointerLockControls } from 'https://unpkg.com/three@0.125.2/examples/jsm/controls/PointerLockControls.js';

var event = 0;
//for controls 
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;

//for the speed and orientation of the player
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

//for raycasting (used for object collision)
let raycaster;

//array of collidable objects
var objects = [];

//current time
var prevTime = performance.now();

var sceneIndex;

//objects that the player interacts with
var key,flaskCabinet,flask1,flask4;


//object interaction
function getKey() {
    if (event==0){
        help1.style.display='block'
        setTimeout(function(){help1.style.display='none'},7000);
		event = 1;
		scene.remove(key);
	}
}
function getFile(){
	if (event==1){
        help2.style.display='block'
        setTimeout(function(){help2.style.display='none'},7000);
		event = 2;
	}
}
function getFormula(){
	if (event==2){
        help3.style.display='block'
        setTimeout(function(){help3.style.display='none'},7000);
		event = 3;
	}
}
function getAcid(){
	if (event==3){
        help4.style.display='block'
        setTimeout(function(){help4.style.display='none'},7000);
		event = 4;
		flaskCabinet.remove(flask1);
		flaskCabinet.remove(flask4);
	}
}

function openDoor() {
    if (event == 4) {
        //show message
       
        fade.style.opacity=100;
        setTimeout(function(){
            deleteStartingRoom(); 
            createmaze1();
            controls.unlock();
            fade.style.opacity=0;
            setTimeout(function(){menuPanel.style.zIndex=11;},1500);
        },3000);
        
    }
    else {
        //show message
    }
}


//scene and positioning of camera
var scene = new THREE.Scene();
scene.background = new THREE.Color(0xfbfbfb );
const camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );



//renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.autoClear = false;
document.body.appendChild( renderer.domElement );

//sound
//background sound
const listener = new THREE.AudioListener();
const sound = new THREE.Audio(listener);
camera.add(listener)
const audioLoader = new THREE.AudioLoader();
audioLoader.load( '/Game/resources/Sounds/Sci-Fi Space Alarm Sound Effect for Games-[AudioTrimmer.com] (1).mp3', function( buffer ) {
    sound.setBuffer( buffer );
    sound.setLoop( true );
    sound.setVolume( 0.05 );
    sound.play();
});

//start button and camera movement
var controls = new PointerLockControls(camera,renderer.domElement);
const menuPanel = document.getElementById('menuPanel');
const startButton = document.getElementById('startButton');
const ControlsButton=document.getElementById('Controls');
const ControlsInfo=document.getElementById('ControlsInfo');
const RestartLevel=document.getElementById('restartLevelButton');
const RestartGame=document.getElementById('restartGameButton');
const fade=document.getElementById('fadeOut');

//help text regarding camera control
const help1=document.getElementById('HelpText1');
const help2=document.getElementById('HelpText2');
const help3=document.getElementById('HelpText3');
const help4=document.getElementById('HelpText4');

//Countdown timer and messages displayed on screen (hints / objectives) 
var timer=document.getElementById('Timer');
var message=document.getElementById('message');
var escape=document.getElementById('Escape');

var timebase=65,temptime=60;
var check=0;

fade.style.opacity=0;
setTimeout(function(){menuPanel.style.zIndex=11;},1500);

var numClicked=1;
var numClicked2=1;

startButton.addEventListener('click', function () {
    controls.lock();
    ControlsInfo.style.display='none';
    
    if(sceneIndex==1||sceneIndex==2){
       
        if(numClicked==1 ){
            setInterval(function(){if(timebase!=0){timebase--;}},1000);
            timebase=65;
            setTimeout(function(){message.style.display='none';},5000)
            }
        else if(check==1){
            timebase=65;
        }
        else{
            
            timebase=temptime+5;
        }
        timer.style.display='none';
        message.style.display='block';
        setTimeout(function(){message.style.display='none';timer.style.display='block'},5000)
        if(sceneIndex==1){
        
        numClicked++;
        }
        check=0;
    }
 
    }, false);

//button to display help text regarding controls
ControlsButton.addEventListener('click',function(){
        ControlsInfo.style.display='block';
    },false);

//button used to restart a level
RestartLevel.addEventListener('click',function(){
    menuPanel.style.zIndex=9;
    fade.style.opacity=100;
    if(sceneIndex==0){
    setTimeout(function(){deleteStartingRoom(); createStartingRoom(); fade.style.opacity=0;menuPanel.style.zIndex=11;},3000);
    }
    if(sceneIndex==1){
        setTimeout(function(){deleteStartingRoom(); openDoor();check=1;},3000);
    }
    if(sceneIndex==2){
        setTimeout(function(){
            deleteStartingRoom(); 
            createMaze2();
            controls.unlock();
            fade.style.opacity=0;
            setTimeout(function(){;menuPanel.style.zIndex=11;},1500); ;check=1;},3000);
    }
  
    },false);

//button used to restart game
RestartGame.addEventListener('click',function(){
    menuPanel.style.zIndex=9;
    fade.style.opacity=100;
    setTimeout(function(){deleteStartingRoom(); createStartingRoom(); fade.style.opacity=0;menuPanel.style.zIndex=11;check=1},3000);
    
    },false);
    controls.addEventListener('lock', () => menuPanel.style.opacity=0);
    controls.addEventListener('unlock', () => menuPanel.style.opacity=100 );
    controls.addEventListener('unlock', () => timer.style.display='none');
    controls.addEventListener('unlock', () => temptime=timebase);
    controls.addEventListener('unlock', () => timebase=100000);


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
            case 'Escape':
                if(sceneIndex==1){
                    temptime=timebase;
                    timebase=1000000;
                }
                    break;
            case 'KeyE':

                //used to determine if the player is within an acceptable distance from the object which the player wishes to interact with
                //at this stage, the player can only interact with some of the objects
                if(sceneIndex==0){
	                if (camera.position.z > 12) {
                            if (camera.position.x < -10) {
                                getKey();
                            }
                            else  if ((camera.position.x<2 && camera.position.x>-2)&&(camera.position.z>13)) {
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
			        		if (camera.position.z<3){
			        			getFormula();
			        		}
			        	}
			        }
			        if (camera.position.x > 7 &&(camera.position.z<5 &&camera.position.z>3) ){
			        	getAcid();
			        }
                }
                else if(sceneIndex==1){
                    if((camera.position.x>8 && camera.position.x<12)&&((camera.position.z>47)&&(camera.position.z<50))){
                        fade.style.opacity=100;
                        menuPanel.style.zIndex=9;
                        
                        setTimeout(function(){deleteStartingRoom();createMaze2();controls.unlock();menuPanel.style.zIndex=11;fade.style.opacity=0;},3000);
                       }
                }
                else if(sceneIndex==2){
                    if((camera.position.x>8 && camera.position.x<12)&&((camera.position.z>47)&&(camera.position.z<50))){
                        controls.unlock(); 
                        escape.style.zIndex=12;
                        escape.style.opacity=100;
                        setTimeout(function(){controls.unlock();},3000);
                        setTimeout(function(){escape.style.zIndex=10;},10000);
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
    raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );


var light,light1,light2,sphere;


//creates the first stage of the game. 
function createStartingRoom(){
    sceneIndex=0;
    event=0;
    camera.position.set(0, 3, 12);
    camera.lookAt(0, 0, 0);
    startButton.innerHTML='Start Level 1'

//Textures

var textureLoader = new THREE.TextureLoader();
var floorTexture = textureLoader.load("/Game/resources/textures/01tizeta_floor_d.png");
floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(50, 50);
var wallTexture = textureLoader.load("/Game/resources/textures/FloorTileAmbientOcclusion.png");
wallTexture.wrapS = THREE.RepeatWrapping;
wallTexture.wrapT = THREE.RepeatWrapping;
wallTexture.repeat.set(1, 1);
var earthTexture = textureLoader.load("/Game/resources/textures/EarthTexture.jpg");
earthTexture.wrapS = THREE.RepeatWrapping;
earthTexture.wrapT = THREE.RepeatWrapping;
earthTexture.repeat.set(1, 1);
var CabinetTexture = textureLoader.load("/Game/resources/textures/locker.jpg");
CabinetTexture.wrapS = THREE.RepeatWrapping;
CabinetTexture.wrapT = THREE.RepeatWrapping;
CabinetTexture.repeat.set(1, 1.5);
var KeyTexture = textureLoader.load("/Game/resources/textures/KeyTexture.jpg");
KeyTexture.wrapS = THREE.RepeatWrapping;
KeyTexture.wrapT = THREE.RepeatWrapping;
KeyTexture.repeat.set(1, 1); 
var GlassTexture = textureLoader.load("/Game/resources/textures/GlassTexture.png");
GlassTexture.mapping = THREE.CubeRefractionMapping;
GlassTexture.wrapS= THREE.RepeatWrapping;
GlassTexture.wrapT = THREE.RepeatWrapping;
GlassTexture.repeat.set(1,1);
var WoodTexture = textureLoader.load("/Game/resources/textures/WoodTexture.jpg");
WoodTexture.mapping = THREE.CubeRefractionMapping;
WoodTexture.wrapS= THREE.RepeatWrapping;
WoodTexture.wrapT = THREE.RepeatWrapping;
WoodTexture.repeat.set(1,1);

var metalFloorTexture = textureLoader.load('/Game/resources/textures/metalTexture.jpeg');
    metalFloorTexture.wrapS = THREE.RepeatWrapping;
    metalFloorTexture.wrapT = THREE.RepeatWrapping;
    metalFloorTexture.repeat.set(50, 50);

var roofTexture = textureLoader.load('/Game/resources/textures/roofTexture.jpeg');
    roofTexture.wrapS = THREE.RepeatWrapping;
    roofTexture.wrapT = THREE.RepeatWrapping;
    roofTexture.repeat.set(30, 30);

var metalTexture = textureLoader.load('/Game/resources/textures/metalTexture.jpg');
    metalTexture.wrapS = THREE.RepeatWrapping;
    metalTexture.wrapT = THREE.RepeatWrapping;
    metalTexture.repeat.set(1, 1);

var metalTexture1 = textureLoader.load('/Game/resources/textures/roofTexture.jpeg');
    metalTexture1.wrapS = THREE.RepeatWrapping;
    metalTexture1.wrapT = THREE.RepeatWrapping;
    metalTexture1.repeat.set(1, 1);

var metalWallTexture = textureLoader.load('/Game/resources/textures/metalWallTexture.jpg');
    metalWallTexture.wrapS = THREE.RepeatWrapping;
    metalWallTexture.wrapT = THREE.RepeatWrapping;
    metalWallTexture.repeat.set(1, 1);

var metalWallTexture1 = textureLoader.load('/Game/resources/textures/metalWallTexture1.jpg');
    metalWallTexture1.wrapS = THREE.RepeatWrapping;
    metalWallTexture1.wrapT = THREE.RepeatWrapping;
    metalWallTexture1.repeat.set(1, 1);

var metalWallTexture2 = textureLoader.load('/Game/resources/textures/metalWallTexture2.jpg');
    metalWallTexture2.wrapS = THREE.RepeatWrapping;
    metalWallTexture2.wrapT = THREE.RepeatWrapping;
    metalWallTexture2.repeat.set(1, 1);



//materials
var Glass = new THREE.MeshPhongMaterial({
	color: 0xffffff,
	wireframe: false,
	map: GlassTexture,
	refractionRatio: 0.98,
	opacity: 0.5,
	transparent: true
});
var whiteMaterial = new THREE.MeshBasicMaterial ({
	color: 0xffffff,
	wireframe: false
});
var meshBasicMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
   	wireframe: false,
    side: THREE.DoubleSide,
    map: wallTexture
});

var blackMaterial = new THREE.MeshBasicMaterial ({
	color: 0x434343,
	wireframe: false
});


//models
//door model
var loader = new GLTFLoader();
loader.load('/Game/resources/models/Door.gltf', function (gltf) {
    gltf.scene.color = ("LightGray");
    gltf.scene.scale.set(3, 2, 2);
    gltf.scene.position.y -= 0.5;
    gltf.scene.position.z += 15;
    gltf.scene.rotation.y -= Math.PI;
	
    gltf.scene.traverse(function (node) {
        if (node instanceof THREE.Mesh) {
            objects.push(node);
        }
    });
    scene.add(gltf.scene);

}, undefined, function (error) {

	console.error(error);

});

//closed desk model
loader = new GLTFLoader();
loader.load('/Game/resources/models/DeskClosed.gltf', function (gltf) {
    gltf.scene.scale.set(2.5, 2.5, 2.5);
    gltf.scene.position.set(6.75,2,0);
    gltf.scene.rotation.y -= Math.PI;
    gltf.scene.traverse(function (node) {
        if (node instanceof THREE.Mesh) {
            objects.push(node);
        }
    });
    scene.add(gltf.scene);

}, undefined, function (error) {

    console.error(error);

});

//zombie model 
var fbxloader=new FBXLoader();
fbxloader.load('/Game/resources/models/ZombieIdle.fbx',(object)=>{
   object.scale.set(0.02,0.02,0.02);
   object.position.z=-4;
    scene.add(object)
});

//opened desk model
loader = new GLTFLoader();
loader.load('/Game/resources/models/DeskOpen.gltf', function (gltf) {
    gltf.scene.scale.set(2.5, 2.5, 2.5);
    gltf.scene.position.set(-11, 2, 10);
    //gltf.scene.rotation.y -= Math.PI;
    gltf.scene.traverse(function (node) {
        if (node instanceof THREE.Mesh) {
            objects.push(node);
        }
    });
    scene.add(gltf.scene);

}, undefined, function (error) {

    console.error(error);

});


//key model
key = new THREE.Group();
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

//computer model
	//screen
    var monitorgeom=new THREE.CylinderGeometry(1,3,3,4);
    var monitormat=new THREE.MeshBasicMaterial({
        color: 0x4a4a4a,
        wireframe: false
    });
    var monitor=new THREE.Mesh(monitorgeom, monitormat);
    monitor.rotation.y += Math.PI/4;
    monitor.rotation.x += Math.PI/2;
    monitor.position.y += 3;
    monitor.scale.set(0.3,0.3,0.3);
    var screengeom=new THREE.BoxGeometry(1,1,0.01);
    var screenmat=new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: false
    });
    var screen=new THREE.Mesh(screengeom, screenmat);
    screen.position.y += 3;
    screen.position.z -= 0.5;
    var standgeom=new THREE.BoxGeometry(0.5,1,0.2);
    var stand=new THREE.Mesh(standgeom, monitormat);
    stand.position.y += 2.5;
    stand.position.z += 0.1;
    var standbase=new THREE.Mesh(standgeom, monitormat);
    standbase.position.y += 2;
    standbase.position.z += 0.1;
    standbase.rotation.z += Math.PI/2;
    standbase.rotation.x += Math.PI/2;
    var computer=new THREE.Group();
    computer.add(standbase);
    computer.add(stand);
    computer.add(screen);
    computer.add(monitor);
    computer.position.set(8,-0.3,-3);
    scene.add(computer);

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
flask1 = new THREE.Group();
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
flask4 = new THREE.Group();
flask4.add(flaskLiquid4);
flask4.add(flaskSphere4);
flask4.add(flaskTop4);
var flask5 = new THREE.Group();
flask5.add(flaskLiquid5);
flask5.add(flaskSphere5);
flask5.add(flaskTop5);
flask5.position.x += 1.1;
	//cabinet creation
flaskCabinet = new THREE.Group();
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


//adding other objects 
var geometry = new THREE.BoxGeometry();
var cylgeometry = new THREE.CylinderGeometry(2.5,2.5,12,32);



var cylinder = new THREE.Mesh(cylgeometry, Glass);
cylinder.position.z -= 4;
scene.add(cylinder);
objects.push( cylinder);

var rectprism = new THREE.BoxGeometry(8,6,1);
var bluemat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: false,
    side:THREE.DoubleSide,
    map: CabinetTexture
});
var rect = new THREE.Mesh( rectprism, bluemat);
rect.position.set(-11,0.5,-6);
scene.add(rect);
objects.push(rect);


const geom = new THREE.SphereGeometry( 2.5, 32, 32 );
const redmat = new THREE.MeshBasicMaterial({
    color: 0xFFFFFF,
    wireframe: false,
    side: THREE.DoubleSide,
    map: earthTexture
});
sphere = new THREE.Mesh( geom, redmat );
sphere.position.set(11, 3, 12);
scene.add( sphere );
objects.push(sphere);



//building room
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
objects.push( wall0 );
var wall1 = new THREE.Mesh(wallgeom, meshBasicMaterial);
wall1.position.x -= 6;
wall1.position.y += 3;
wall1.position.z -= 4;
wall1.rotation.x += Math.PI / 2;
scene.add(wall1);
objects.push( wall1 );
var wall2 = new THREE.Mesh(wallgeom, meshBasicMaterial);
wall2.position.x += 6;
wall2.position.y += 3;
wall2.position.z += 10;
wall2.rotation.x += Math.PI / 2;
scene.add(wall2);
objects.push( wall2 );
var wall3 = new THREE.Mesh(wallgeom, meshBasicMaterial);
wall3.position.x += 6;
wall3.position.y += 3;
wall3.position.z -= 4;
wall3.rotation.x += Math.PI / 2;
scene.add(wall3);
objects.push( wall3 );
var wall4 = new THREE.Mesh(wallgeom, meshBasicMaterial);
wall4.position.x += 12;
wall4.position.y += 3;
wall4.position.z -= 8;
wall4.rotation.z += Math.PI / 2;
wall4.rotation.x += Math.PI / 2;
scene.add(wall4);
objects.push( wall4 );
var wall5 = new THREE.Mesh(wallgeom, meshBasicMaterial);
wall5.position.x += 16;
wall5.position.y += 3;
wall5.position.z -= 4;
wall5.rotation.x += Math.PI / 2;
scene.add(wall5);
objects.push( wall5 );
var wall6 = new THREE.Mesh(wallgeom, meshBasicMaterial);
wall6.position.x += 2;
wall6.position.y += 3;
wall6.position.z -= 8;
wall6.rotation.z += Math.PI / 2;
wall6.rotation.x += Math.PI / 2;
scene.add(wall6);
objects.push( wall6 );
var wall7 = new THREE.Mesh(wallgeom, meshBasicMaterial);
wall7.position.x -= 16;
wall7.position.y += 3;
wall7.position.z += 6;
wall7.rotation.x += Math.PI / 2;
scene.add(wall7);
objects.push( wall7 );
var wall8 = new THREE.Mesh(wallgeom, meshBasicMaterial);
wall8.position.x += 12;
wall8.position.y += 3;
wall8.position.z += 15;
wall8.rotation.z += Math.PI / 2;
wall8.rotation.x += Math.PI / 2;
scene.add(wall8);
objects.push( wall8 );
var wall9 = new THREE.Mesh(wallgeom, meshBasicMaterial);
wall9.position.x -= 8;
wall9.position.y += 3;
wall9.position.z += 15;
wall9.rotation.z += Math.PI / 2;
wall9.rotation.x += Math.PI / 2;
scene.add(wall9);
objects.push( wall9 );
var wall10 = new THREE.Mesh(wallgeom, meshBasicMaterial);
wall10.position.x -= 8;
wall10.position.y += 3;
wall10.position.z -= 8;
wall10.rotation.z += Math.PI / 2;
wall10.rotation.x += Math.PI / 2;
scene.add(wall10);
objects.push( wall10 );
var wall11 = new THREE.Mesh(wallgeom, meshBasicMaterial);
wall11.position.x -= 18;
wall11.position.y += 3;
wall11.position.z -= 8;
wall11.rotation.z += Math.PI / 2;
wall11.rotation.x += Math.PI / 2;
scene.add(wall11);
objects.push( wall11 );
var wall12 = new THREE.Mesh(wallgeom, meshBasicMaterial);
wall12.position.x -= 16;
wall12.position.y += 3;
wall12.position.z -= 4;
wall12.rotation.x += Math.PI / 2;
scene.add(wall12);
objects.push( wall12 );
var wall13 = new THREE.Mesh(wallgeom, meshBasicMaterial);
wall13.position.x -= 16;
wall13.position.y += 3;
wall13.position.z += 16;
wall13.rotation.x += Math.PI / 2;
scene.add(wall13);
objects.push( wall13 );
var wall14 = new THREE.Mesh(wallgeom, meshBasicMaterial);
wall14.position.x += 16;
wall14.position.y += 3;
wall14.position.z += 6;
wall14.rotation.x += Math.PI / 2;
scene.add(wall14);
objects.push( wall14 );
var wall15 = new THREE.Mesh(wallgeom, meshBasicMaterial);
wall15.position.x += 16;
wall15.position.y += 3;
wall15.position.z += 16;
wall15.rotation.x += Math.PI / 2;
scene.add(wall15);
objects.push( wall15 );
var wall16 = new THREE.Mesh(wallgeom, meshBasicMaterial);
wall16.position.x += 2;
wall16.position.y += 3;
wall16.position.z += 15;
wall16.rotation.z += Math.PI / 2;
wall16.rotation.x += Math.PI / 2;
scene.add(wall16);
objects.push( wall16 );
var wall17 = new THREE.Mesh(wallgeom, meshBasicMaterial);
wall17.position.x -= 18;
wall17.position.y += 3;
wall17.position.z += 15;
wall17.rotation.z += Math.PI / 2;
wall17.rotation.x += Math.PI / 2;
scene.add(wall17);
objects.push( wall17 );

//stage 1 indoor floor texture
var meshfloor = new THREE.Mesh(
	new THREE.PlaneGeometry(75, 75),
	new THREE.MeshPhongMaterial(
		{
			color: 0xffffff,
            wireframe: false,
            map: metalFloorTexture,
		}
	),
);

//stage 1 indoor roof
var meshroof = new THREE.Mesh(
	new THREE.PlaneGeometry(75, 75),
	new THREE.MeshPhongMaterial(
		{
			color: 0xa9a9a9,
            wireframe: false,
			roughness: 1,
            map: roofTexture
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

scene.add(meshfloor);
scene.add(meshroof);




//Lighting
var ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);
light = new THREE.PointLight(0xD50000, 10, 50, 3 );
light.position.set(0, 3, 3);
light.intensity = 0.5;
scene.add(light);
light1 = new THREE.PointLight(0xD50000, 10, 50, 3);
light1.position.set(10, 3, 3);
light1.intensity = 0.5;
scene.add(light1);
light2 = new THREE.PointLight(0xD50000, 10, 50, 3);
light2.position.set(-10, 3, 3);
light2.intensity = 0.5;
scene.add(light2);

//black fog
var density = 0.08;
scene.fog = new THREE.FogExp2(0x000000, density);




}

//for removing all the objects in current scene/stage before creating the next stage/scene
function deleteStartingRoom(){
   for(var i=scene.children.length-1;i>=0;i--){
      var obj=scene.children[i];
       scene.remove(obj);
       objects=[];
   }
}

//creates first maze

function createmaze1(){
    //setting camera position
    sceneIndex=1;
    startButton.innerHTML='Start Level 2';
    camera.position.set(4, 5, -45);
    camera.lookAt(-5, 2, 0);

    //variables
    var textureLoader = new THREE.TextureLoader()

    //lighting
    var ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    var light0 = new THREE.SpotLight( 0xff0000, 1, 20 );
    light0.position.set( -8, 1, -45 );
    light0.target.position.set(7, 1, -45);
    light0.power = 20;
    scene.add( light0 );
    scene.add(light0.target);

    var light1 = new THREE.SpotLight( 0x00ff00, 1, 20 );
    light1.position.set( 19, 1, 45 );
    light1.target.position.set(-18, 1, 45);
    light1.power = 20;
    scene.add( light1 );
    scene.add(light1.target);

    //models
        //doors 
        //start door
        var loader = new GLTFLoader();
        loader.load('/Game/resources/models/Door.gltf', function (gltf) {
        gltf.scene.scale.set(5, 3, 4);
        gltf.scene.position.z = -50;
        gltf.scene.position.x += 5;
        scene.add(gltf.scene);
        
        gltf.scene.traverse(function (node) {
            if (node instanceof THREE.Mesh) {
                objects.push(node);
            }
        });
     
        }, undefined, function (error) {
        
            console.error(error);
        
        });
        //end door
        loader.load('/Game/resources/models/Door.gltf', function (gltf) {
            gltf.scene.scale.set(5, 3, 4);
            gltf.scene.position.z = 50;
            gltf.scene.position.x += 10;
            gltf.scene.rotation.y -= Math.PI;
            scene.add(gltf.scene);
        
            gltf.scene.traverse(function (node) {
                if (node instanceof THREE.Mesh) {
                    objects.push(node);
                }
            });
     
         }, undefined, function (error) {
     
             console.error(error);
     
         });

          //start of maze lantern
        loader.load('/Game/resources/models/scene.gltf', function (gltf) {
        gltf.scene.position.z = -45;
        gltf.scene.rotation.y += Math.PI/2;
        gltf.scene.position.x = -8;

        scene.add(gltf.scene);

        gltf.scene.traverse(function (node) {
            if (node instanceof THREE.Mesh) {
                objects.push(node);
            }
        });

        }, undefined, function (error) {

            console.error(error);

        });

        //end of maze lantern
        loader.load('/Game/resources/models/scene.gltf', function (gltf) {
        gltf.scene.position.z = 45;
        gltf.scene.rotation.y += -Math.PI/2;
        gltf.scene.position.x = 19;

        scene.add(gltf.scene);

        gltf.scene.traverse(function (node) {
            if (node instanceof THREE.Mesh) {
                objects.push(node);
            }
        });
        }, undefined, function (error) {

        console.error(error);

    });

         

         //textures
         var floorTexture = textureLoader.load("/Game/resources/textures/grass5.jpg");
         var indoorFloorTexture = textureLoader.load("/Game/resources/textures/floor0.jpg");
         var roofTexture = textureLoader.load("/Game/resources/textures/roof1.jpg");
         var skyTexture = textureLoader.load("/Game/resources/textures/Skydome.png");

         //maze one outdoor floor texture
         floorTexture.wrapS = THREE.RepeatWrapping;
         floorTexture.wrapT = THREE.RepeatWrapping;
         floorTexture.repeat.set(20,20); 
         var meshFloor = new THREE.Mesh(
            new THREE.CircleGeometry(100, 100),
            new THREE.MeshPhongMaterial(
                {
                    wireframe: false,
                    map: floorTexture, 

                }
            )
        )
        meshFloor.rotation.x -= Math.PI/2;
        meshFloor.receiveShadow = true;
        scene.add(meshFloor);

        //maze 1 indoor floor
        indoorFloorTexture.wrapS = THREE.RepeatWrapping;
        indoorFloorTexture.wrapT = THREE.RepeatWrapping;
        indoorFloorTexture.repeat.set(20,20);
        
        var meshIndoorFloor = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 100),
                new THREE.MeshPhongMaterial(
                    {
                        side: THREE.DoubleSide,
                        wireframe: false,
                        map: indoorFloorTexture,

                    }
            )
        )
        meshIndoorFloor.rotation.x = Math.PI/2
        meshIndoorFloor.position.set(0, 0.1, 0)
        meshIndoorFloor.receiveShadow = true;
        scene.add(meshIndoorFloor);
        

        //maze 1 indoor roof
        roofTexture.wrapS = THREE.RepeatWrapping;
        roofTexture.wrapT = THREE.RepeatWrapping;
        roofTexture.repeat.set(25,25);
        
        var meshRoof = new THREE.Mesh(
            new THREE.PlaneGeometry(101, 101),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map: roofTexture,

                }
            )
        )
        meshRoof.rotation.x = Math.PI/2;
        meshRoof.position.set(0, 10.01, 0);
        scene.add(meshRoof);
        
        skyTexture.wrapS = THREE.RepeatWrapping;
        skyTexture.wrapT = THREE.RepeatWrapping;
        skyTexture.repeat.set(1 ,1);

        var sky = new THREE.Mesh(
            new THREE.SphereGeometry(100, 32, 32, 0, 2*Math.PI, 0, Math.PI/2),
            new THREE.MeshPhongMaterial(
                {
                    wireframe: false,
                    side: THREE.BackSide,
                    map: skyTexture,

                }
            )

        );
        scene.add(sky);

        //building maze
        //for small length walls
        var wallTexture = textureLoader.load("/Game/Resources/Textures/wall3.jpg");
        wallTexture.wrapS = THREE.ClampToEdgeMapping;
        wallTexture.wrapT = THREE.ClampToEdgeMapping;
        wallTexture.repeat.set(2,1);
        
        //for medium length walls
        var wallTextureMedium = textureLoader.load("/Game/Resources/Textures/wall3.jpg");
        wallTextureMedium.wrapS = THREE.ClampToEdgeMapping;
        wallTextureMedium.wrapT = THREE.ClampToEdgeMapping;
        wallTextureMedium.repeat.set(5,1);
        
        //for long length walls
        var wallTextureLong = textureLoader.load("/Game/Resources/Textures/wall3.jpg");
        wallTextureLong.wrapS = THREE.ClampToEdgeMapping;
        wallTextureLong.wrapT = THREE.ClampToEdgeMapping;
        wallTextureLong.repeat.set(15,1);
        
        //when creating the layout of the maze
        //start with leftmost wall
        //then build it from top to bottom (row by row)
        //build each row from left to right
        var wall0 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    wireframe: false,
                    side: THREE.DoubleSide,
                    map:wallTextureLong,
                }
            ),
        );
        wall0.castShadow = true;
        wall0.receiveShadow = true;
    
        wall0.scale.set(100, 10);
        wall0.position.set(50, 5, 0);
        wall0.rotation.y += Math.PI/2
        scene.add(wall0);
        objects.push( wall0 );
        
        var wall1 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    wireframe: false,
                    side: THREE.DoubleSide,
                    map:wallTextureMedium,
                }
            ),
        );
        wall1.castShadow = true;
        wall1.receiveShadow = true;
    
        wall1.position.set(30, 5, 50);
        wall1.scale.set(40, 10);
    
        scene.add(wall1);
        objects.push( wall1 );
    
        var wall2 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    wireframe: false,
                    side: THREE.DoubleSide,
                    map:wallTextureMedium,
                }
            ),
        );
        wall2.castShadow = true;
        wall2.receiveShadow = true;
    
        wall2.position.set(-20, 5, 50);
        wall2.scale.set(60, 10);
    
        scene.add(wall2);
        objects.push( wall2 );
    
        var wall3 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    wireframe: false,
                    side: THREE.DoubleSide,
                    map:wallTextureLong,
                }
            ),
        );
    
        wall3.castShadow = true;
        wall3.receiveShadow = true;
    
        wall3.scale.set(100, 10);
        wall3.position.set(-50, 5, 0);
        wall3.rotation.y += Math.PI/2
    
        scene.add(wall3);
        objects.push( wall3 );
    
        var wall4 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    wireframe: false,
                    map:wallTexture,
                    side: THREE.DoubleSide,
                }
            ),
        );
        wall4.castShadow = true;
        wall4.receiveShadow = true;
    
        wall4.position.set(20, 5, 45);
        wall4.rotation.y += Math.PI/2
        wall4.scale.set(10, 10);
    
        scene.add(wall4);
        objects.push( wall4 );
    
        var wall5 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    wireframe: false,
                    side: THREE.DoubleSide,
                    map:wallTexture,
                }
            ),
        );
        wall5.castShadow = true;
        wall5.receiveShadow = true;
    
        wall5.position.set(-30, 5, 45);
        wall5.rotation.y = Math.PI/2
        wall5.scale.set(10, 10);
    
        scene.add(wall5);
        objects.push( wall5 );
    
        var wall6 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    wireframe: false,
                    side: THREE.DoubleSide,
                    map:wallTexture,
                }
            ),
        );
        wall6.castShadow = true;
        wall6.receiveShadow = true;
    
        wall6.position.set(40, 5, 40);
        wall6.scale.set(20, 10);
    
        scene.add(wall6);
        objects.push( wall6 );
    
        var wall7 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map:wallTexture,
                }
            ),
        );
        wall7.castShadow = true;
        wall7.receiveShadow = true;
    
        wall7.position.set(5, 5, 40);
        wall7.scale.set(10, 10);
    
        scene.add(wall7);
        objects.push( wall7 );
    
        var wall8 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map:wallTexture,
                }
            ),
        );
        wall8.castShadow = true;
        wall8.receiveShadow = true;
    
        wall8.position.set(-25, 5, 40);
        wall8.scale.set(10, 10);
    
        scene.add(wall8);
        objects.push( wall8 );
    
        var wall9 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map:wallTexture,
                }
            ),
        );
        wall9.castShadow = true;
        wall9.receiveShadow = true;
    
        wall9.position.set(30, 5, 35);
        wall9.rotation.y = Math.PI/2
        wall9.scale.set(10, 10);
    
        scene.add(wall9);
        objects.push( wall9 );
    
        var wall10 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map:wallTexture,
                }
            ),
        );
        wall10.castShadow = true;
        wall10.receiveShadow = true;
    
        wall10.position.set(10, 5, 30);
        wall10.rotation.y = Math.PI/2
        wall10.scale.set(20, 10);
    
        scene.add(wall10);
        objects.push( wall10 );
    
        var wall11 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map:wallTexture,
                }
            ),
        );
        wall11.castShadow = true;
        wall11.receiveShadow = true;
    
        wall11.position.set(-10, 5, 35);
        wall11.rotation.y = Math.PI/2
        wall11.scale.set(10, 10);
    
        scene.add(wall11);
        objects.push( wall11 );
    
        var wall12 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map:wallTexture,
                }
            ),
        );
        wall12.castShadow = true;
        wall12.receiveShadow = true;
    
        wall12.position.set(-40, 5, 35);
        wall12.rotation.y = Math.PI/2
        wall12.scale.set(10, 10);
    
        scene.add(wall12);
        objects.push( wall12 );
    
        var wall13 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map:wallTexture,
                }
            ),
        );
        wall13.castShadow = true;
        wall12.receiveShadow = true;
    
        wall13.position.set(20, 5, 30);
        wall13.scale.set(20, 10);
    
        scene.add(wall13);
        objects.push( wall13 );
    
        var wall14 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map:wallTextureMedium,
                }
            ),
        );
        wall14.castShadow = true;
        wall14.receiveShadow = true;
    
        wall14.position.set(-25, 5, 30);
        wall14.scale.set(30, 10);
    
        scene.add(wall14);
        objects.push( wall14 );
    
        var wall15 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map:wallTexture,
                }
            ),
        );
        wall15.castShadow = true;
        wall15.receiveShadow = true;
    
        wall15.position.set(40, 5, 25);
        wall15.rotation.y = Math.PI/2;
        wall15.scale.set(10, 10);
    
        scene.add(wall15);
        objects.push( wall15 );
    
        var wall16 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map:wallTexture,
                }
            ),
        );
        wall16.castShadow = true;
        wall12.receiveShadow = true;
    
        wall16.position.set(0, 5, 25);
        wall16.rotation.y = Math.PI/2;
        wall16.scale.set(10, 10);
    
        scene.add(wall16);
        objects.push( wall16 );
    
        var wall17 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map:wallTexture,
                }
            ),
        );
        wall17.castShadow = true;
        wall17.receiveShadow = true;
    
        wall17.position.set(-30, 5, 20);
        wall17.rotation.y = Math.PI/2;
        wall17.scale.set(20, 10);
    
        scene.add(wall17);
        objects.push( wall17 );
    
        var wall18 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map:wallTexture,
                }
            ),
        );
        wall18.castShadow = true;
        wall18.receiveShadow = true;
    
        wall18.position.set(30, 5, 20);
        wall18.scale.set(20, 10);
    
        scene.add(wall18);
        objects.push( wall18 );
    
        var wall19 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map:wallTextureMedium,
                }
            ),
        );
        wall19.castShadow = true;
        wall19.receiveShadow = true;
    
        wall19.position.set(-10, 5, 20);
        wall19.scale.set(40, 10);
    
        scene.add(wall19);
        objects.push( wall19 );
    
        var wall20 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map:wallTexture,
                }
            ),
        );
        wall20.castShadow = true;
        wall20.receiveShadow = true;
    
        wall20.position.set(-45, 5, 20);
        wall20.scale.set(10, 10);
    
        scene.add(wall20);
        objects.push( wall20 );
    
        var wall21 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map:wallTexture,
                }
            ),
        );
        wall21.castShadow = true;
        wall21.receiveShadow = true;
    
        wall21.position.set(30, 5, 10);
        wall21.rotation.y = Math.PI/2;
        wall21.scale.set(20, 10);
    
        scene.add(wall21);
        objects.push( wall21 );
    
        var wall22 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map:wallTexture,
                }
            ),
        );
        wall22.castShadow = true;
        wall22.receiveShadow = true;
    
        wall22.position.set(-10, 5, 15);
        wall22.rotation.y = Math.PI/2;
        wall22.scale.set(10, 10);
    
        scene.add(wall22);
        objects.push( wall22 );
    
        var wall23 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map:wallTexture,
                }
            ),
        );
        wall23.castShadow = true;
        wall23.receiveShadow = true;
    
        wall23.position.set(45, 5, 10);
        wall23.scale.set(10, 10);
    
        scene.add(wall23);
        objects.push( wall23 );
    
        var wall24 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map:wallTextureMedium,
                }
            ),
        );
        wall24.castShadow = true;
        wall24.receiveShadow = true;
    
        wall24.position.set(15, 5, 10);
        wall24.scale.set(30, 10);
    
        scene.add(wall24);
        objects.push( wall24 );
    
        var wall25 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map:wallTexture,
                }
            ),
        );
        wall25.castShadow = true;
        wall25.receiveShadow = true;
    
        wall25.position.set(-35, 5, 10);
        wall25.scale.set(10, 10);
    
        scene.add(wall25);
        objects.push( wall25 );
    
        var wall26 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map:wallTexture,
                }
            ),
        );
        wall26.castShadow = true;
        wall26.receiveShadow = true;
    
        wall26.position.set(10, 5, 5);
        wall26.rotation.y = Math.PI/2;
        wall26.scale.set(10, 10);
    
        scene.add(wall26);
        objects.push( wall26 );
    
        var wall27 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map:wallTexture,
                }
            ),
        );
        wall27.castShadow = true;
        wall27.receiveShadow = true;
    
        wall27.position.set(-20, 5, 5);
        wall27.rotation.y = Math.PI/2;
        wall27.scale.set(10, 10);
    
        scene.add(wall27);
        objects.push( wall27 );
    
        var wall28 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map:wallTexture,
                }
            ),
        );
        wall28.castShadow = true;
        wall28.receiveShadow = true;
    
        wall28.position.set(35, 5, 0);
        wall28.scale.set(10, 10);
    
        scene.add(wall28);
        objects.push( wall28 );
    
        var wall29 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map:wallTexture,
                }
            ),
        );
        wall29.castShadow = true;
        wall29.receiveShadow = true;
    
        wall29.position.set(15, 5, 0);
        wall29.scale.set(10, 10);
    
        scene.add(wall29);
        objects.push( wall29 );
    
        var wall30 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map:wallTextureMedium,
                }
            ),
        );
        wall30.castShadow = true;
        wall30.receiveShadow = true;
    
        wall30.position.set(-25, 5, 0);
        wall30.scale.set(50, 10);
    
        scene.add(wall30);
        objects.push( wall30 );
    
        var wall31 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map:wallTexture,
                }
            ),
        );
        wall31.castShadow = true;
        wall31.receiveShadow = true;
    
        wall31.position.set(40, 5, -5);
        wall31.rotation.y = Math.PI/2;
        wall31.scale.set(10, 10);
    
        scene.add(wall31);
        objects.push( wall31 );
    
        var wall32 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map:wallTexture,
                }
            ),
        );
        wall32.castShadow = true;
        wall32.receiveShadow = true;
    
        wall32.position.set(0, 5, -5);
        wall32.rotation.y = Math.PI/2;
        wall32.scale.set(10, 10);
    
        scene.add(wall32);
        objects.push( wall32 );
    
        var wall33 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map:wallTexture,
                }
            ),
        );
        wall33.castShadow = true;
        wall33.receiveShadow = true;
    
        wall33.position.set(-30, 5, -5);
        wall33.rotation.y = Math.PI/2;
        wall33.scale.set(10, 10);
    
        scene.add(wall33);
        objects.push( wall33 );
    
        var wall34 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map:wallTexture,
                }
            ),
        );
        wall34.castShadow = true;
        wall34.receiveShadow = true;
    
        wall34.position.set(30, 5, -10);
        wall34.scale.set(20, 10);
    
        scene.add(wall34);
        objects.push( wall34 );
    
        var wall35 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map:wallTextureMedium,
                }
            ),
        );
        wall35.castShadow = true;
        wall35.receiveShadow = true;
    
        wall35.position.set(-5, 5, -10);
        wall35.scale.set(30, 10);
    
        scene.add(wall35);
        objects.push( wall35 );
    
        var wall36 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map:wallTextureMedium,
                }
            ),
        );
        wall36.castShadow = true;
        wall36.receiveShadow = true;
    
        wall36.position.set(20, 5, -25);
        wall36.rotation.y = Math.PI/2;
        wall36.scale.set(30, 10);
    
        scene.add(wall36);
        objects.push( wall36 );
    
        var wall37 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map:wallTexture,
                }
            ),
        );
        wall37.castShadow = true;
        wall37.receiveShadow = true;
    
        wall37.position.set(-10, 5, -20);
        wall37.rotation.y = Math.PI/2;
        wall37.scale.set(20, 10);
    
        scene.add(wall37);
        objects.push( wall37 );
    
        var wall38 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map:wallTextureMedium,
                }
            ),
        );
        wall38.castShadow = true;
        wall38.receiveShadow = true;
    
        wall38.position.set(-40, 5, -25);
        wall38.rotation.y = Math.PI/2;
        wall38.scale.set(30, 10);
    
        scene.add(wall38);
        objects.push( wall38 );
    
        var wall39 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map:wallTexture,
                }
            ),
        );
        wall39.castShadow = true;
        wall39.receiveShadow = true;
    
        wall39.position.set(45, 5, -20);
        wall39.scale.set(10, 10);
    
        scene.add(wall39);
        objects.push( wall39 );
    
        var wall40 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map:wallTexture,
                }
            ),
        );
        wall40.castShadow = true;
        wall40.receiveShadow = true;
    
        wall40.position.set(10, 5, -20);
        wall40.scale.set(20, 10);
    
        scene.add(wall40);
        objects.push( wall40 );
    
        var wall41 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map:wallTexture,
                }
            ),
        );
        wall41.castShadow = true;
        wall41.receiveShadow = true;
    
        wall41.position.set(-30, 5, -20);
        wall41.scale.set(20, 10);
    
        scene.add(wall41);
        objects.push( wall41 );
    
        var wall42 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map:wallTexture,
                }
            ),
        );
        wall42.castShadow = true;
        wall42.receiveShadow = true;
    
        wall42.position.set(30, 5, -25);
        wall42.rotation.y = Math.PI/2
        wall42.scale.set(10, 10);
    
        scene.add(wall42);
        objects.push( wall42 );
    
        var wall43 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map:wallTexture,
                }
            ),
        );
        wall43.castShadow = true;
        wall43.receiveShadow = true;
    
        wall43.position.set(0, 5, -30);
        wall43.rotation.y = Math.PI/2;
        wall43.scale.set(20, 10);
    
        scene.add(wall43);
        objects.push( wall43 );
    
    
        var wall44 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map:wallTexture,
                }
            ),
        );
        wall44.castShadow = true;
        wall44.receiveShadow = true;
    
        wall44.position.set(35, 5, -30);
        wall44.scale.set(10, 10);
    
        scene.add(wall44);
        objects.push( wall44 );
    
        var wall45 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map:wallTextureMedium,
                }
            ),
        );
        wall45.castShadow = true;
        wall45.receiveShadow = true;
    
        wall45.position.set(-25, 5, -30);
        wall45.scale.set(30, 10);
    
        scene.add(wall45);
        objects.push( wall45 );
    
        var wall46 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map:wallTexture,
                }
            ),
        );
        wall46.castShadow = true;
        wall46.receiveShadow = true;
    
        wall46.position.set(40, 5, -40);
        wall46.rotation.y = Math.PI/2;
        wall46.scale.set(20, 10);
    
        scene.add(wall46);
        objects.push( wall46 );
    
        var wall47 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map:wallTexture,
                }
            ),
        );
        wall47.castShadow = true;
        wall47.receiveShadow = true;
    
        wall47.position.set(10, 5, -40);
        wall47.rotation.y = Math.PI/2;
        wall47.scale.set(20, 10);
    
        scene.add(wall47);
        objects.push( wall47 );
    
        var wall48 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map:wallTexture,
                }
            ),
        );
        wall48.castShadow = true;
        wall48.receiveShadow = true;
    
        wall48.position.set(-20, 5, -35);
        wall48.rotation.y = Math.PI/2;
        wall48.scale.set(10, 10);
    
        scene.add(wall48);
        objects.push( wall48 );
    
        var wall49 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map:wallTexture,
                }
            ),
        );
        wall49.castShadow = true;
        wall49.receiveShadow = true;
    
        wall49.position.set(25, 5, -40);
        wall49.scale.set(10, 10);
    
        scene.add(wall49);
        objects.push( wall49);
    
        var wall50 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map:wallTexture,
                }
            ),
        );
        wall50.castShadow = true;
        wall50.receiveShadow = true;
    
        wall50.position.set(-5, 5, -40);
        wall50.scale.set(10, 10);
    
        scene.add(wall50);
        objects.push( wall50 );
    
        var wall51 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map:wallTexture,
                }
            ),
        );
        wall51.castShadow = true;
        wall40.receiveShadow = true;
    
        wall51.position.set(-5, 5, -40);
        wall51.scale.set(10, 10);
    
        scene.add(wall51);
        objects.push( wall51 );
    
        var wall52 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map:wallTexture,
                }
            ),
        );
        wall52.castShadow = true;
        wall52.receiveShadow = true;
    
        wall52.position.set(-10, 5, -45);
        wall52.rotation.y = Math.PI/2;
        wall52.scale.set(10, 10);
    
        scene.add(wall52);
        objects.push( wall52 );
    
        var wall53 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map:wallTexture,
                }
            ),
        );
        wall53.castShadow = true;
        wall53.receiveShadow = true;
    
        wall53.position.set(-30, 5, -45);
        wall53.rotation.y = Math.PI/2;
        wall53.scale.set(10, 10);
    
        scene.add(wall53);
        objects.push( wall53 );
    
        var wall54 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map:wallTextureMedium,
                }
            ),
        );
        wall54.castShadow = true;
        wall54.receiveShadow = true;
    
        wall54.position.set(20, 5, -50);
        wall54.scale.set(60, 10);
    
        scene.add(wall54);
        objects.push( wall54 );
    
        var wall55 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    wireframe: false,
                    map:wallTextureMedium,
                }
            ),
        );
        wall55.castShadow = true;
        wall55.receiveShadow = true;
    
        wall55.position.set(-30, 5, -50);
        wall55.scale.set(40, 10);
    
        scene.add(wall55);
        objects.push( wall55 );


}

function createMaze2(){
    
    //scene setup
    camera.position.set(-7, 3, -45);
    camera.lookAt(-6, 0, 0);
    sceneIndex=2;
    check=1;
    startButton.innerHTML='Start Level 3';
    message.innerHTML='You are almost out, Keep going!';
    

    //textures
        var textureLoader = new THREE.TextureLoader()
        var grassTexture = textureLoader.load("/Game/resources/textures/256x grass block.png");
        grassTexture.wrapS = THREE.RepeatWrapping;
        grassTexture.wrapT = THREE.RepeatWrapping;
        grassTexture.repeat.set(50,50);

        var floorTexture = textureLoader.load("/Game/resources/textures/01tizeta_floor_d.png");
        floorTexture.wrapS = THREE.RepeatWrapping;
        floorTexture.wrapT = THREE.RepeatWrapping;
        floorTexture.repeat.set(25,25);

        var roofTexture = textureLoader.load("/Game/Resources/Textures/roof.jpg");
        roofTexture.wrapS = THREE.RepeatWrapping;
        roofTexture.wrapT = THREE.RepeatWrapping;
        roofTexture.repeat.set(25,25);

        var skyTexture = textureLoader.load("/Game/Resources/Textures/Skydome.png");
        skyTexture.wrapS = THREE.RepeatWrapping;
        skyTexture.wrapT = THREE.RepeatWrapping;
        skyTexture.repeat.set(1 ,1);

        var wallTexture =new THREE.TextureLoader().load('/Game/resources/textures/wall.jpg');
        wallTexture.wrapS=wallTexture.wrapT=THREE.ClampToEdgeMapping;
        wallTexture.repeat.set(2,1);
        var wallMaterial=new THREE.MeshStandardMaterial({
        side: THREE.DoubleSide,
        map:wallTexture});

        var wallTextureOuter =new THREE.TextureLoader().load('/Game/resources/textures/wall.jpg');
        wallTextureOuter.wrapS=wallTextureOuter.wrapT=THREE.ClampToEdgeMapping;
        wallTextureOuter.repeat.set(4,1);
        var wallMaterialOuter=new THREE.MeshStandardMaterial({
        side: THREE.DoubleSide,
        map:wallTextureOuter});

    //Meshes
        var mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(1,1),
            new THREE.MeshPhongMaterial(
                {
                    color: 0xff9999,
                    wireframe: false,
                }
            ),
        );
        mesh.position.y += 0.5;
        //maze two outdoor floor
        var meshGrass = new THREE.Mesh(
            new THREE.CircleGeometry(100, 100),new THREE.MeshPhongMaterial(
                {
                    wireframe: false,
                    map: grassTexture,       
    
                }
            )
        )
        
        var meshFloor = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 100),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    polygonOffset: true,
                    wireframe: false,
                    map: floorTexture,
    
                }
            )
        )
        
        //maze two indoor roof
        var meshRoof = new THREE.Mesh(
            new THREE.PlaneGeometry(101, 101),
            new THREE.MeshPhongMaterial(
                {
                    side: THREE.DoubleSide,
                    polygonOffset: true,
                    wireframe: false,
                    map: roofTexture,
    
                }
            )
        )

        var sky = new THREE.Mesh(
            new THREE.SphereGeometry(100, 32, 32, 0, 2*Math.PI, 0, Math.PI/2),
            new THREE.MeshPhongMaterial(
                {
                    wireframe: false,
                    side: THREE.BackSide,
                    map: skyTexture,
    
                }
            )
    
        );

        meshGrass.rotation.x -= Math.PI/2;
        meshGrass.receiveShadow = true;
        scene.add(meshGrass);
                
        meshFloor.rotation.x = Math.PI/2
        meshFloor.position.set(0, 0.1, 0)
        scene.add(meshFloor);

        meshRoof.rotation.x = Math.PI/2
        meshRoof.position.set(0, 7, 0)
        scene.add(meshRoof);


        mesh.receiveShadow = true;
        mesh.castShadow = true;
        scene.add(sky);

        //models
            var loader = new GLTFLoader();
            loader.load('/Game/resources/models/Door.gltf', function (gltf) {
            gltf.scene.scale.set(5, 2.2, 4);
            gltf.scene.position.z = -50;
            gltf.scene.position.x -= 5;
	            scene.add(gltf.scene);

            gltf.scene.traverse(function (node) {
                if (node instanceof THREE.Mesh) {
                    objects.push(node);
                }
            });

            }, undefined, function (error) {

	                console.error(error);

            });
            //end door
            loader.load('/Game/resources/models/Door.gltf', function (gltf) {
                gltf.scene.scale.set(5, 2.2, 4);
                gltf.scene.position.z = 50;
                gltf.scene.position.x += 10;
                gltf.scene.rotation.y -= Math.PI;
                scene.add(gltf.scene);
            
                gltf.scene.traverse(function (node) {
                    if (node instanceof THREE.Mesh) {
                        objects.push(node);
                    }
                });
            
                }, undefined, function (error) {
                
                    console.error(error);
                
                });

                //start of maze door lantern
                loader = new GLTFLoader();
                loader.load('/Game/resources/models/scene.gltf', function (gltf) {
                gltf.scene.position.z = -35;
                gltf.scene.rotation.y += Math.PI/2;
                gltf.scene.position.x = -10;
                
                scene.add(gltf.scene);
                
                gltf.scene.traverse(function (node) {
                    if (node instanceof THREE.Mesh) {
                        objects.push(node);
                    }
                });
            
                }, undefined, function (error) {
                
                    console.error(error);
                
                });
            
                //end of maze door lantern
                loader = new GLTFLoader();
                loader.load('/Game/resources/models/scene.gltf', function (gltf) {
                gltf.scene.position.z = 45;
                gltf.scene.rotation.y += -Math.PI/2;
                gltf.scene.position.x = 29;
                
                scene.add(gltf.scene);
                
                gltf.scene.traverse(function (node) {
                    if (node instanceof THREE.Mesh) {
                        objects.push(node);
                    }
                });
            
                }, undefined, function (error) {
                
                    console.error(error);
                
                });



        //Lighting
            var ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
            scene.add(ambientLight);

            var pointLight = new THREE.PointLight(0xffffff, 1, 100,2);
            pointLight.position.set(-3,10,-6);
            pointLight.castShadow = true;
            pointLight.shadow.camera.near = 0.1;
            pointLight.shadow.camera.far = 25;
            scene.add(pointLight);

            var light0 = new THREE.SpotLight( 0xff0000, 1, 20    );
            light0.position.set( -10, 1, -35 );
            light0.target.position.set(9, 1, -35);
            light0.power = 15;
            scene.add( light0 );
            scene.add(light0.target);

            var light1 = new THREE.SpotLight( 0x00ff00, 1, 20 );
            light1.position.set( 29, 1, 45 );
            light1.target.position.set(-28, 1, 45);
            light1.power = 20;
            scene.add( light1 );
            scene.add(light1.target);

        //building maze
            //Outer walls
            var wall0 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterialOuter);
            wall0.scale.set(100,10);
            wall0.rotation.y=Math.PI/2;
            wall0.position.set(50,2,0);
            wall0.castShadow=true;
            wall0.receiveShadow=true;
            scene.add(wall0);
            objects.push( wall0 );

            var wall1 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterialOuter);
            wall1.scale.set(100,10);
            wall1.rotation.y=Math.PI/2;
            wall1.position.set(-50,2,0);
            wall1.castShadow=true;
            wall1.receiveShadow=true;
            scene.add(wall1);
            objects.push( wall1 );

            var wall2 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterialOuter);
            wall2.scale.set(52,10);
            wall2.position.set(24.5,2,-50);
            wall2.castShadow=true;
            wall2.receiveShadow=true;
            scene.add(wall2);
            objects.push( wall2 );

            var wall3 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterialOuter);
            wall3.scale.set(49,10);
            wall3.position.set(-26.1,2,-50);
            wall3.castShadow=true;
            wall3.receiveShadow=true;
            scene.add(wall3);
            objects.push( wall3 );

            var wall4 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterialOuter);
            wall4.scale.set(49,10);
            wall4.position.set(26,2,50);
            wall4.castShadow=true;
            wall4.receiveShadow=true;
            scene.add(wall4);
            objects.push( wall4 );

            var wall5 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterialOuter);
            wall5.scale.set(52,10);
            wall5.position.set(-24.5,2,50);
            wall5.castShadow=true;
            wall5.receiveShadow=true;
            scene.add(wall5);
            objects.push( wall5 );

            //inner walls from bottom of maze(entrance), up.

            var wall6 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
            wall6.scale.set(18.2,10);
            wall6.rotation.y=Math.PI/2;
            wall6.position.set(-11,2,-41);
            wall6.castShadow=true;
            wall6.receiveShadow=true;
            scene.add(wall6);
            objects.push( wall6 );

            var wall7 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
            wall7.scale.set(18,10);
            wall7.position.set(-19.5,2,-32);
            wall7.castShadow=true;
            wall7.receiveShadow=true;
            scene.add(wall7);
            objects.push( wall7 );

            var wall8 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
            wall8.scale.set(9,10);
            wall8.rotation.y=Math.PI/2;
            wall8.position.set(-20,2,-45);
            wall8.castShadow=true;
            wall8.receiveShadow=true;
            scene.add(wall8);
            objects.push( wall8 );

            var wall9 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
            wall9.scale.set(19.5,10);
            wall9.rotation.y=Math.PI/2;
            wall9.position.set(-29,2,-33);
            wall9.castShadow=true;
            wall9.receiveShadow=true;
            scene.add(wall9);
            objects.push( wall9 );

            var wall10 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),wallMaterial);
            wall10.scale.set(10.4,10);
            wall10.position.set(-33.7,2,-23);
            wall10.castShadow=true;
            wall10.receiveShadow=true;
            scene.add(wall10);
            objects.push( wall10 );

            var wall11 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),wallMaterial);
            wall11.scale.set(19.5,10);
            wall11.rotation.y=Math.PI/2;
            wall11.position.set(-38.4,2,-33);
            wall11.castShadow=true;
            wall11.receiveShadow=true;
            scene.add(wall11);
            objects.push( wall11 );

            var wall12 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),wallMaterial);
            wall12.scale.set(26,10);
            wall12.rotation.y=Math.PI/2;
            wall12.position.set(-1,2,-37);
            wall12.castShadow=true;
            wall12.receiveShadow=true;
            scene.add(wall12);
            objects.push( wall12 );

            var wall13 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),wallMaterial);
            wall13.scale.set(30,10);
            wall13.position.set(-5,2,-23.5);
            wall13.castShadow=true;
            wall13.receiveShadow=true;
            scene.add(wall13);
            objects.push( wall13 );

            var wall14 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),wallMaterial);
            wall14.scale.set(19.5,10);
            wall14.rotation.y=Math.PI/2;
            wall14.position.set(10,2,-32.74);
            wall14.castShadow=true;
            wall14.receiveShadow=true;
            scene.add(wall14);
            objects.push( wall14 );

            var wall15 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
            wall15.scale.set(9,10);
            wall15.rotation.y=Math.PI/2;
            wall15.position.set(21,2,-45);
            wall15.castShadow=true;
            wall15.receiveShadow=true;
            scene.add(wall15);
            objects.push( wall15 );

            var wall16 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
            wall16.scale.set(9,10);
            wall16.rotation.y=Math.PI/2;
            wall16.position.set(-20,2,-19.5);
            wall16.castShadow=true;
            wall16.receiveShadow=true;
            scene.add(wall16);
            objects.push( wall16 );

            var wall17 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
            wall17.scale.set(9,10);
            wall17.position.set(-24,2,-15);
            wall17.castShadow=true;
            wall17.receiveShadow=true;
            scene.add(wall17);
            objects.push( wall17 );

            var wall18 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
            wall18.scale.set(9,10);
            wall18.rotation.y=Math.PI/2;
            wall18.position.set(-28,2,-10);
            wall18.castShadow=true;
            wall18.receiveShadow=true;
            scene.add(wall18);
            objects.push( wall8 );

            var wall19 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),wallMaterial);
            wall19.scale.set(30,10);
            wall19.position.set(-13.5,2,-5);
            wall19.castShadow=true;
            wall19.receiveShadow=true;
            scene.add(wall19);
            objects.push( wall19 );

            var wall20 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),wallMaterial);
            wall20.scale.set(20,10);
            wall20.rotation.y=Math.PI/2;
            wall20.position.set(-10,2,-5);
            wall20.castShadow=true;
            wall20.receiveShadow=true;
            scene.add(wall20);
            objects.push( wall20 );

            var wall21 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),wallMaterial);
            wall21.scale.set(9,10);
            wall21.rotation.y=Math.PI/2;
            wall21.position.set(1,2,0);
            wall21.castShadow=true;
            wall21.receiveShadow=true;
            scene.add(wall21);
            objects.push( wall21 );

            var wall22 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),wallMaterial);
            wall22.scale.set(19,10);
            wall22.position.set(10,2,4);
            wall22.castShadow=true;
            wall22.receiveShadow=true;
            scene.add(wall22);
            objects.push( wall22 );

            var wall23 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),wallMaterial);
            wall23.scale.set(9,10);
            wall23.position.set(-45,2,-15);
            wall23.castShadow=true;
            wall23.receiveShadow=true;
            scene.add(wall23);
            objects.push( wall23 );

            var wall24 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),wallMaterial);
            wall24.scale.set(20,10);
            wall24.rotation.y=Math.PI/2;
            wall24.position.set(-41,2,-5);
            wall24.castShadow=true;
            wall24.receiveShadow=true;
            scene.add(wall24);
            objects.push( wall24 );

            var wall25 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),wallMaterial);
            wall25.scale.set(20,10);
            wall25.position.set(-31.5,2,5);
            wall25.castShadow=true;
            wall25.receiveShadow=true;
            scene.add(wall25);
            objects.push( wall25 );

            var wall26 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),wallMaterial);
            wall26.scale.set(9,10);
            wall26.rotation.y=Math.PI/2;
            wall26.position.set(-22,2,9);
            wall26.castShadow=true;
            wall26.receiveShadow=true;
            scene.add(wall26);
            objects.push( wall26 );

            var wall27 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
            wall27.scale.set(31,10);
            wall27.position.set(-26,2,14);
            wall27.castShadow=true;
            wall27.receiveShadow=true;
            scene.add(wall27);
            objects.push( wall27 );

            var wall28 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
            wall28.scale.set(20.8,10);
            wall28.position.set(11,2,-14);
            wall28.castShadow=true;
            wall28.receiveShadow=true;
            scene.add(wall28);
            objects.push( wall28 );

            var wall29 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
            wall29.scale.set(20.8,10);
            wall29.rotation.y=Math.PI/2;
            wall29.position.set(21,2,-24);
            wall29.castShadow=true;
            wall29.receiveShadow=true;
            scene.add(wall29);
            objects.push( wall29 );

            var wall30 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
            wall30.scale.set(9,10);
            wall30.rotation.y=Math.PI/2;
            wall30.position.set(10,2,-10);
            wall30.castShadow=true;
            wall30.receiveShadow=true;
            scene.add(wall30);
            objects.push( wall30 );

            var wall31 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
            wall31.scale.set(20.8,10);
            wall31.position.set(19.9,2,-5);
            wall31.castShadow=true;
            wall31.receiveShadow=true;
            scene.add(wall31);
            objects.push( wall31 );

            var wall32 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
            wall32.scale.set(20.8,10);
            wall32.rotation.y=Math.PI/2;
            wall32.position.set(30,2,-5);
            wall32.castShadow=true;
            wall32.receiveShadow=true;
            scene.add(wall32);
            objects.push( wall32 );

            var wall33 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
            wall33.scale.set(20.8,10);
            wall33.position.set(40,2,-15);
            wall33.castShadow=true;
            wall33.receiveShadow=true;
            scene.add(wall33);
            objects.push( wall33 );

            var wall34 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
            wall34.scale.set(9,10);
            wall34.rotation.y=Math.PI/2;
            wall34.position.set(40,2,-20);
            wall34.castShadow=true;
            wall34.receiveShadow=true;
            scene.add(wall34);
            objects.push( wall34 );

            var wall35 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
            wall35.scale.set(20,10);
            wall35.position.set(30.5,2,-34);
            wall35.castShadow=true;
            wall35.receiveShadow=true;
            scene.add(wall35);
            objects.push( wall35 );

            var wall36 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
            wall36.scale.set(9,10);
            wall36.rotation.y=Math.PI/2;
            wall36.position.set(40,2,-39);
            wall36.castShadow=true;
            wall36.receiveShadow=true;
            scene.add(wall36);
            objects.push( wall36 );

            var wall37 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
            wall37.scale.set(20.8,10);
            wall37.rotation.y=Math.PI/2;
            wall37.position.set(30,2,-33);
            wall37.castShadow=true;
            wall37.receiveShadow=true;
            scene.add(wall37);
            objects.push( wall37 );

            var wall38 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
            wall38.scale.set(9,10);
            wall38.position.set(45,2,5);
            wall38.castShadow=true;
            wall38.receiveShadow=true;
            scene.add(wall38);
            objects.push( wall38 );

            var wall39 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
            wall39.scale.set(9,10);
            wall39.rotation.y=Math.PI/2;
            wall39.position.set(40,2,1);
            wall39.castShadow=true;
            wall39.receiveShadow=true;
            scene.add(wall39);
            objects.push( wall39 );

            var wall40 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
            wall40.scale.set(35,10);
            wall40.rotation.y=Math.PI/2;
            wall40.position.set(40,2,32);
            wall40.castShadow=true;
            wall40.receiveShadow=true;
            scene.add(wall40);
            objects.push( wall40 );

            var wall41 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
            wall41.scale.set(9,10);
            wall41.position.set(35,2,15);
            wall41.castShadow=true;
            wall41.receiveShadow=true;
            scene.add(wall41);
            objects.push( wall41 );

            var wall42 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),wallMaterial);
            wall42.scale.set(12,10);
            wall42.rotation.y=Math.PI/2;
            wall42.position.set(30,2,20.5);
            wall42.castShadow=true;
            wall42.receiveShadow=true;
            scene.add(wall42);
            objects.push( wall42 );

            var wall43 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),wallMaterial);
            wall43.scale.set(12,10);
            wall43.rotation.y=Math.PI/2;
            wall43.position.set(30,2,44);
            wall43.castShadow=true;
            wall43.receiveShadow=true;
            scene.add(wall43);
            objects.push( wall43 );

            var wall44 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),wallMaterial);
            wall44.scale.set(32.5,10);
            wall44.position.set(14,2,38.5);
            wall44.castShadow=true;
            wall44.receiveShadow=true;
            scene.add(wall44);
            objects.push( wall44 );

            var wall45 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),wallMaterial);
            wall45.scale.set(24,10);
            wall45.rotation.y=Math.PI/2;
            wall45.position.set(20,2,26);
            wall45.castShadow=true;
            wall45.receiveShadow=true;
            scene.add(wall45);
            objects.push( wall45 );

            var wall46 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),wallMaterial);
            wall46.scale.set(24,10);
            wall46.rotation.y=Math.PI/2;
            wall46.position.set(-1.8,2,26);
            wall46.castShadow=true;
            wall46.receiveShadow=true;
            scene.add(wall46);
            objects.push( wall46 );

            var wall47 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),wallMaterial);
            wall47.scale.set(10,10);
            wall47.position.set(2.7,2,14);
            wall47.castShadow=true;
            wall47.receiveShadow=true;
            scene.add(wall47);
            objects.push( wall47 );

            var wall48 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),wallMaterial);
            wall48.scale.set(15,10);
            wall48.rotation.y=Math.PI/2;
            wall48.position.set(7.2,2,21);
            wall48.castShadow=true;
            wall48.receiveShadow=true;
            scene.add(wall48);
            objects.push( wall48 );

            var wall49 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
            wall49.scale.set(40,10);
            wall49.position.set(-22,2,27);
            wall49.castShadow=true;
            wall49.receiveShadow=true;
            scene.add(wall49);
            objects.push( wall49 );

            var wall50 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
            wall50.scale.set(12,10);
            wall50.rotation.y=Math.PI/2;
            wall50.position.set(-30,2,33);
            wall50.castShadow=true;
            wall50.receiveShadow=true;
            scene.add(wall50);
            objects.push( wall50 );

            var wall51 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
            wall51.scale.set(12,10);
            wall51.position.set(-44,2,39);
            wall51.castShadow=true;
            wall51.receiveShadow=true;
            scene.add(wall51);
            objects.push( wall51 );

            var wall52 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
            wall52.scale.set(12,10);
            wall52.rotation.y=Math.PI/2;
            wall52.position.set(-20,2,44);
            wall52.castShadow=true;
            wall52.receiveShadow=true;
            scene.add(wall52);
            objects.push( wall52 );

            var wall53 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
            wall53.scale.set(12,10);
            wall53.position.set(-14,2,38.5);
            wall53.castShadow=true;
            wall53.receiveShadow=true;
            scene.add(wall53);
            objects.push( wall53 );
                
    
            
    

}

createStartingRoom();
animate();
window.addEventListener('resize', onWindowResize);

function onWindowResize() {
    //adjust the camera's aspect ratio to match the window's (in which the game is open) aspect ratio
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

var lightincrease = 0;
function animate() {
    requestAnimationFrame(animate);
    //vary the color of specified lights at each frame
        if(sceneIndex==0){
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
        }
    
    const time = performance.now();
    if ( controls.isLocked === true ) {
        raycaster.ray.origin.copy( controls.getObject().position );

        const intersections = raycaster.intersectObjects( objects );
        const onObject = intersections.length > 0;

        const delta = ( time - prevTime ) / 1000;
        velocity.x -= velocity.x * 30.0 * delta;
		velocity.z -= velocity.z * 30.0 * delta;
        direction.z = Number( moveForward ) - Number( moveBackward );
		direction.x = Number( moveRight ) - Number( moveLeft );
        direction.normalize();
        if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
		if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;
        if ( onObject === true ) { // check if the camera is colliding with an object which is in the array of all collidable objects

            //upon colliding with an object, adjust the velocity of the player to be as twice the current velocity but in the opposite direction
            velocity.x = -(velocity.x*2);
            velocity.z = -(velocity.z*2);
            velocity.y = 0;
             //collision sound
             const listener = new THREE.AudioListener();
             const sound = new THREE.Audio(listener);
             camera.add(listener)
             const audioLoader = new THREE.AudioLoader();
             audioLoader.load( '/Game/resources/Sounds/WoodCrashesDistant.mp3', function( buffer ) {
                 sound.setBuffer( buffer );
                 sound.setLoop( false );
                 sound.setVolume( 0.1 );
                 sound.play();
             });
        }

        controls.moveRight( - velocity.x * delta );
		controls.moveForward( - velocity.z * delta );
    
    }
    prevTime = time;
    if(sceneIndex==1||sceneIndex==2){
    timer.innerHTML='Time Left: '+timebase;
    if(timebase==0){
        
        timer.style.display='none';
        timebase=100000;
        check=1;
        if(sceneIndex==1){
            openDoor();
        }
        else if(sceneIndex==2){
            fade.style.opacity=100;
        setTimeout(function(){
            deleteStartingRoom(); 
            createMaze2();
            controls.unlock();
            fade.style.opacity=0;
            setTimeout(function(){;menuPanel.style.zIndex=11;},1500);
        },3000);
        }
        
        
    }
   
    }
   

	renderer.clear();
    renderer.render(scene, camera);
	renderer.clearDepth();


}
renderer.clear();
renderer.render(scene, camera);
renderer.clearDepth();