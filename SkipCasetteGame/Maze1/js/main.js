import * as THREE from 'https://unpkg.com/three@0.125.2/build/three.module.js';
import {OrbitControls} from 'https://unpkg.com/three@0.125.2/examples/jsm/controls/OrbitControls.js'
import {PointerLockControls} from 'https://unpkg.com/three@0.125.2/examples/jsm/controls/PointerLockControls.js'
import { GLTFLoader } from 'https://unpkg.com/three@0.125.2/examples/jsm/loaders/GLTFLoader.js';

var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;

const objects = [];

let raycaster;

var prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;
document.body.appendChild(renderer.domElement);

var camera = new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(5, 5, -45);
camera.lookAt(-5, 2, 0);

var scene = new THREE.Scene();

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


var textureLoader = new THREE.TextureLoader()

var ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight( 0xffff00, 0.3 );
directionalLight.castShadow = true;
directionalLight.position.set(10, 1, 10);
scene.add( directionalLight );

const light = new THREE.PointLight( 0xffff00, 1, 10 );
light.position.set( 10, 10, 10 );
scene.add( light );

function init(){
    //start door
    var loader = new GLTFLoader();
    loader.load('./resources/Door.gltf', function (gltf) {
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
    loader.load('./resources/Door.gltf', function (gltf) {
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
    
    var floorTexture = textureLoader.load("./resources/grass5.jpg");
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(20,20); 
    
    var meshFloor = new THREE.Mesh(
        new THREE.CircleGeometry(100, 100),
        new THREE.MeshBasicMaterial(
            {
                wireframe: false,
                map: floorTexture, 

            }
        )
    )
    meshFloor.rotation.x -= Math.PI/2;
    meshFloor.receiveShadow = true;
    scene.add(meshFloor);

    var indoorFloorTexture = textureLoader.load("./resources/floor0.jpg");
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

    var roofTexture = textureLoader.load("./resources/roof_asbestos.png");
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
    
    var skyTexture = textureLoader.load("./resources/Skydome.png");
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
    

    
    

    //MAZE 
    //Built side walls first then from top to bottom
    
    var crateTexture = textureLoader.load("./resources/wall3.jpg");
    crateTexture.wrapS = THREE.ClampToEdgeMapping;
    crateTexture.wrapT = THREE.ClampToEdgeMapping;
    crateTexture.repeat.set(1,1);

    var crate0 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                wireframe: false,
                side: THREE.DoubleSide,
                map:crateTexture,
            }
        ),
    );
    crate0.castShadow = true;
    crate0.receiveShadow = true;

    crate0.scale.set(100, 10);
    crate0.position.set(50, 5, 0);
    crate0.rotation.y += Math.PI/2
    scene.add(crate0);
    objects.push( crate0 );
    
    var crate1 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                wireframe: false,
                side: THREE.DoubleSide,
                map:crateTexture,
            }
        ),
    );
    crate1.castShadow = true;
    crate1.receiveShadow = true;

    crate1.position.set(30, 5, 50);
    crate1.scale.set(40, 10);

    scene.add(crate1);
    objects.push( crate1 );

    var crate2 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                wireframe: false,
                side: THREE.DoubleSide,
                map:crateTexture,
            }
        ),
    );
    crate2.castShadow = true;
    crate2.receiveShadow = true;

    crate2.position.set(-20, 5, 50);
    crate2.scale.set(60, 10);

    scene.add(crate2);
    objects.push( crate2 );

    var crate3 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                wireframe: false,
                side: THREE.DoubleSide,
                map:crateTexture,
            }
        ),
    );

    crate3.castShadow = true;
    crate3.receiveShadow = true;

    crate3.scale.set(100, 10);
    crate3.position.set(-50, 5, 0);
    crate3.rotation.y += Math.PI/2

    scene.add(crate3);
    objects.push( crate3 );

    var crate4 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                wireframe: false,
                map:crateTexture,
                side: THREE.DoubleSide,
            }
        ),
    );
    crate4.castShadow = true;
    crate4.receiveShadow = true;

    crate4.position.set(20, 5, 45);
    crate4.rotation.y += Math.PI/2
    crate4.scale.set(10, 10);

    scene.add(crate4);
    objects.push( crate4 );

    var crate5 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                wireframe: false,
                side: THREE.DoubleSide,
                map:crateTexture,
            }
        ),
    );
    crate5.castShadow = true;
    crate5.receiveShadow = true;

    crate5.position.set(-30, 5, 45);
    crate5.rotation.y = Math.PI/2
    crate5.scale.set(10, 10);

    scene.add(crate5);
    objects.push( crate5 );

    var crate6 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                wireframe: false,
                side: THREE.DoubleSide,
                map:crateTexture,
            }
        ),
    );
    crate6.castShadow = true;
    crate6.receiveShadow = true;

    crate6.position.set(40, 5, 40);
    crate6.scale.set(20, 10);

    scene.add(crate6);
    objects.push( crate6 );

    var crate7 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
            }
        ),
    );
    crate7.castShadow = true;
    crate7.receiveShadow = true;

    crate7.position.set(5, 5, 40);
    crate7.scale.set(10, 10);

    scene.add(crate7);
    objects.push( crate7 );

    var crate8 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
            }
        ),
    );
    crate8.castShadow = true;
    crate8.receiveShadow = true;

    crate8.position.set(-25, 5, 40);
    crate8.scale.set(10, 10);

    scene.add(crate8);
    objects.push( crate8 );

    var crate9 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
            }
        ),
    );
    crate9.castShadow = true;
    crate9.receiveShadow = true;

    crate9.position.set(30, 5, 35);
    crate9.rotation.y = Math.PI/2
    crate9.scale.set(10, 10);

    scene.add(crate9);
    objects.push( crate9 );

    var crate10 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
            }
        ),
    );
    crate10.castShadow = true;
    crate10.receiveShadow = true;

    crate10.position.set(10, 5, 30);
    crate10.rotation.y = Math.PI/2
    crate10.scale.set(20, 10);

    scene.add(crate10);
    objects.push( crate10 );

    var crate11 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
            }
        ),
    );
    crate11.castShadow = true;
    crate11.receiveShadow = true;

    crate11.position.set(-10, 5, 35);
    crate11.rotation.y = Math.PI/2
    crate11.scale.set(10, 10);

    scene.add(crate11);
    objects.push( crate11 );

    var crate12 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
            }
        ),
    );
    crate12.castShadow = true;
    crate12.receiveShadow = true;

    crate12.position.set(-40, 5, 35);
    crate12.rotation.y = Math.PI/2
    crate12.scale.set(10, 10);

    scene.add(crate12);
    objects.push( crate12 );

    var crate13 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
            }
        ),
    );
    crate13.castShadow = true;
    crate12.receiveShadow = true;

    crate13.position.set(20, 5, 30);
    crate13.scale.set(20, 10);

    scene.add(crate13);
    objects.push( crate13 );

    var crate14 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
            }
        ),
    );
    crate14.castShadow = true;
    crate14.receiveShadow = true;

    crate14.position.set(-25, 5, 30);
    crate14.scale.set(30, 10);

    scene.add(crate14);
    objects.push( crate14 );

    var crate15 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
            }
        ),
    );
    crate15.castShadow = true;
    crate15.receiveShadow = true;

    crate15.position.set(40, 5, 25);
    crate15.rotation.y = Math.PI/2;
    crate15.scale.set(10, 10);

    scene.add(crate15);
    objects.push( crate15 );

    var crate16 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
            }
        ),
    );
    crate16.castShadow = true;
    crate12.receiveShadow = true;

    crate16.position.set(0, 5, 25);
    crate16.rotation.y = Math.PI/2;
    crate16.scale.set(10, 10);

    scene.add(crate16);
    objects.push( crate16 );

    var crate17 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
            }
        ),
    );
    crate17.castShadow = true;
    crate17.receiveShadow = true;

    crate17.position.set(-30, 5, 20);
    crate17.rotation.y = Math.PI/2;
    crate17.scale.set(20, 10);

    scene.add(crate17);
    objects.push( crate17 );

    var crate18 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
            }
        ),
    );
    crate18.castShadow = true;
    crate18.receiveShadow = true;

    crate18.position.set(30, 5, 20);
    crate18.scale.set(20, 10);

    scene.add(crate18);
    objects.push( crate18 );

    var crate19 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
            }
        ),
    );
    crate19.castShadow = true;
    crate19.receiveShadow = true;

    crate19.position.set(-10, 5, 20);
    crate19.scale.set(40, 10);

    scene.add(crate19);
    objects.push( crate19 );

    var crate20 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
            }
        ),
    );
    crate20.castShadow = true;
    crate20.receiveShadow = true;

    crate20.position.set(-45, 5, 20);
    crate20.scale.set(10, 10);

    scene.add(crate20);
    objects.push( crate20 );

    var crate21 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
            }
        ),
    );
    crate21.castShadow = true;
    crate21.receiveShadow = true;

    crate21.position.set(30, 5, 10);
    crate21.rotation.y = Math.PI/2;
    crate21.scale.set(20, 10);

    scene.add(crate21);
    objects.push( crate21 );

    var crate22 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
            }
        ),
    );
    crate22.castShadow = true;
    crate22.receiveShadow = true;

    crate22.position.set(-10, 5, 15);
    crate22.rotation.y = Math.PI/2;
    crate22.scale.set(10, 10);

    scene.add(crate22);
    objects.push( crate22 );

    var crate23 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
            }
        ),
    );
    crate23.castShadow = true;
    crate23.receiveShadow = true;

    crate23.position.set(45, 5, 10);
    crate23.scale.set(10, 10);

    scene.add(crate23);
    objects.push( crate23 );

    var crate24 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
            }
        ),
    );
    crate24.castShadow = true;
    crate24.receiveShadow = true;

    crate24.position.set(15, 5, 10);
    crate24.scale.set(30, 10);

    scene.add(crate24);
    objects.push( crate24 );

    var crate25 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
            }
        ),
    );
    crate25.castShadow = true;
    crate25.receiveShadow = true;

    crate25.position.set(-35, 5, 10);
    crate25.scale.set(10, 10);

    scene.add(crate25);
    objects.push( crate25 );

    var crate26 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
            }
        ),
    );
    crate26.castShadow = true;
    crate26.receiveShadow = true;

    crate26.position.set(10, 5, 5);
    crate26.rotation.y = Math.PI/2;
    crate26.scale.set(10, 10);

    scene.add(crate26);
    objects.push( crate26 );

    var crate27 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
            }
        ),
    );
    crate27.castShadow = true;
    crate27.receiveShadow = true;

    crate27.position.set(-20, 5, 5);
    crate27.rotation.y = Math.PI/2;
    crate27.scale.set(10, 10);

    scene.add(crate27);
    objects.push( crate27 );

    var crate28 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
            }
        ),
    );
    crate28.castShadow = true;
    crate28.receiveShadow = true;

    crate28.position.set(35, 5, 0);
    crate28.scale.set(10, 10);

    scene.add(crate28);
    objects.push( crate28 );

    var crate29 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
            }
        ),
    );
    crate29.castShadow = true;
    crate29.receiveShadow = true;

    crate29.position.set(15, 5, 0);
    crate29.scale.set(10, 10);

    scene.add(crate29);
    objects.push( crate29 );

    var crate30 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
            }
        ),
    );
    crate30.castShadow = true;
    crate30.receiveShadow = true;

    crate30.position.set(-25, 5, 0);
    crate30.scale.set(50, 10);

    scene.add(crate30);
    objects.push( crate30 );

    var crate31 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
            }
        ),
    );
    crate31.castShadow = true;
    crate31.receiveShadow = true;

    crate31.position.set(40, 5, -5);
    crate31.rotation.y = Math.PI/2;
    crate31.scale.set(10, 10);

    scene.add(crate31);
    objects.push( crate31 );

    var crate32 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
            }
        ),
    );
    crate32.castShadow = true;
    crate32.receiveShadow = true;

    crate32.position.set(0, 5, -5);
    crate32.rotation.y = Math.PI/2;
    crate32.scale.set(10, 10);

    scene.add(crate32);
    objects.push( crate32 );

    var crate33 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
            }
        ),
    );
    crate33.castShadow = true;
    crate33.receiveShadow = true;

    crate33.position.set(-30, 5, -5);
    crate33.rotation.y = Math.PI/2;
    crate33.scale.set(10, 10);

    scene.add(crate33);
    objects.push( crate33 );

    var crate34 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
            }
        ),
    );
    crate34.castShadow = true;
    crate34.receiveShadow = true;

    crate34.position.set(30, 5, -10);
    crate34.scale.set(20, 10);

    scene.add(crate34);
    objects.push( crate34 );

    var crate35 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
            }
        ),
    );
    crate35.castShadow = true;
    crate35.receiveShadow = true;

    crate35.position.set(-5, 5, -10);
    crate35.scale.set(30, 10);

    scene.add(crate35);
    objects.push( crate35 );

    var crate36 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
            }
        ),
    );
    crate36.castShadow = true;
    crate36.receiveShadow = true;

    crate36.position.set(20, 5, -25);
    crate36.rotation.y = Math.PI/2;
    crate36.scale.set(30, 10);

    scene.add(crate36);
    objects.push( crate36 );

    var crate37 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
            }
        ),
    );
    crate37.castShadow = true;
    crate37.receiveShadow = true;

    crate37.position.set(-10, 5, -20);
    crate37.rotation.y = Math.PI/2;
    crate37.scale.set(20, 10);

    scene.add(crate37);
    objects.push( crate37 );

    var crate38 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
            }
        ),
    );
    crate38.castShadow = true;
    crate38.receiveShadow = true;

    crate38.position.set(-40, 5, -25);
    crate38.rotation.y = Math.PI/2;
    crate38.scale.set(30, 10);

    scene.add(crate38);
    objects.push( crate38 );

    var crate39 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
            }
        ),
    );
    crate39.castShadow = true;
    crate39.receiveShadow = true;

    crate39.position.set(45, 5, -20);
    crate39.scale.set(10, 10);

    scene.add(crate39);
    objects.push( crate39 );

    var crate40 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
            }
        ),
    );
    crate40.castShadow = true;
    crate40.receiveShadow = true;

    crate40.position.set(10, 5, -20);
    crate40.scale.set(20, 10);

    scene.add(crate40);
    objects.push( crate40 );

    var crate41 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
            }
        ),
    );
    crate41.castShadow = true;
    crate41.receiveShadow = true;

    crate41.position.set(-30, 5, -20);
    crate41.scale.set(20, 10);

    scene.add(crate41);
    objects.push( crate41 );

    var crate42 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
            }
        ),
    );
    crate42.castShadow = true;
    crate42.receiveShadow = true;

    crate42.position.set(30, 5, -25);
    crate42.rotation.y = Math.PI/2
    crate42.scale.set(10, 10);

    scene.add(crate42);
    objects.push( crate42 );

    var crate43 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
            }
        ),
    );
    crate43.castShadow = true;
    crate43.receiveShadow = true;

    crate43.position.set(0, 5, -30);
    crate43.rotation.y = Math.PI/2;
    crate43.scale.set(20, 10);

    scene.add(crate43);
    objects.push( crate43 );


    var crate44 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
            }
        ),
    );
    crate44.castShadow = true;
    crate44.receiveShadow = true;

    crate44.position.set(35, 5, -30);
    crate44.scale.set(10, 10);

    scene.add(crate44);
    objects.push( crate44 );

    var crate45 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
            }
        ),
    );
    crate45.castShadow = true;
    crate45.receiveShadow = true;

    crate45.position.set(-25, 5, -30);
    crate45.scale.set(30, 10);

    scene.add(crate45);
    objects.push( crate45 );

    var crate46 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
            }
        ),
    );
    crate46.castShadow = true;
    crate46.receiveShadow = true;

    crate46.position.set(40, 5, -40);
    crate46.rotation.y = Math.PI/2;
    crate46.scale.set(20, 10);

    scene.add(crate46);
    objects.push( crate46 );

    var crate47 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
            }
        ),
    );
    crate47.castShadow = true;
    crate47.receiveShadow = true;

    crate47.position.set(10, 5, -40);
    crate47.rotation.y = Math.PI/2;
    crate47.scale.set(20, 10);

    scene.add(crate47);
    objects.push( crate47 );

    var crate48 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
            }
        ),
    );
    crate48.castShadow = true;
    crate48.receiveShadow = true;

    crate48.position.set(-20, 5, -35);
    crate48.rotation.y = Math.PI/2;
    crate48.scale.set(10, 10);

    scene.add(crate48);
    objects.push( crate48 );

    var crate49 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
            }
        ),
    );
    crate49.castShadow = true;
    crate49.receiveShadow = true;

    crate49.position.set(25, 5, -40);
    crate49.scale.set(10, 10);

    scene.add(crate49);
    objects.push( crate49);

    var crate50 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
            }
        ),
    );
    crate50.castShadow = true;
    crate50.receiveShadow = true;

    crate50.position.set(-5, 5, -40);
    crate50.scale.set(10, 10);

    scene.add(crate50);
    objects.push( crate50 );

    var crate51 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
            }
        ),
    );
    crate51.castShadow = true;
    crate40.receiveShadow = true;

    crate51.position.set(-5, 5, -40);
    crate51.scale.set(10, 10);

    scene.add(crate51);
    objects.push( crate51 );

    var crate52 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
            }
        ),
    );
    crate52.castShadow = true;
    crate52.receiveShadow = true;

    crate52.position.set(-10, 5, -45);
    crate52.rotation.y = Math.PI/2;
    crate52.scale.set(10, 10);

    scene.add(crate52);
    objects.push( crate52 );

    var crate53 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
            }
        ),
    );
    crate53.castShadow = true;
    crate53.receiveShadow = true;

    crate53.position.set(-30, 5, -45);
    crate53.rotation.y = Math.PI/2;
    crate53.scale.set(10, 10);

    scene.add(crate53);
    objects.push( crate53 );

    var crate54 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
            }
        ),
    );
    crate54.castShadow = true;
    crate54.receiveShadow = true;

    crate54.position.set(20, 5, -50);
    crate54.scale.set(60, 10);

    scene.add(crate54);
    objects.push( crate54 );

    var crate55 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial(
            {
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
            }
        ),
    );
    crate55.castShadow = true;
    crate55.receiveShadow = true;

    crate55.position.set(-30, 5, -50);
    crate55.scale.set(40, 10);

    scene.add(crate55);
    objects.push( crate55 );



    animate();
    window.addEventListener( 'resize', onWindowResize );
}
function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate(){
    requestAnimationFrame(animate);
    const time = performance.now();
    if ( controls.isLocked === true ) {

        raycaster.ray.origin.copy( controls.getObject().position );

        const intersections = raycaster.intersectObjects( objects );

		const onObject = intersections.length > 0;

        const delta = ( time - prevTime ) / 1000;
        velocity.x -= velocity.x * 15.0 * delta;
		velocity.z -= velocity.z * 15.0 * delta;
        direction.z = Number( moveForward ) - Number( moveBackward );
		direction.x = Number( moveRight ) - Number( moveLeft );
        direction.normalize();
        if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
		if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;

        if ( onObject === true ) {

            velocity.x = -(velocity.x*2);
            velocity.z = -(velocity.z*2);
            velocity.y = 0;
        }

        controls.moveRight( - velocity.x * delta );
		controls.moveForward( - velocity.z * delta );
    
    }
    prevTime = time;


    renderer.render(scene, camera);
}

window.onload = init;