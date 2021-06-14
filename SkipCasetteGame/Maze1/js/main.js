import * as THREE from 'https://unpkg.com/three@0.125.2/build/three.module.js';
import {PointerLockControls} from 'https://unpkg.com/three@0.125.2/examples/jsm/controls/PointerLockControls.js'
import { GLTFLoader } from 'https://unpkg.com/three@0.125.2/examples/jsm/loaders/GLTFLoader.js';

//control variables
{
    var controls;
    var moveForward = false;
    var moveBackward = false;
    var moveLeft = false;
    var moveRight = false;
}

//texture and model variables
{
    var skyTexture;
    var roofTexture;
    var floorTexture;
    var indoorFloorTexture;
    var wallTexture;
    var wallTextureMedium;
    var wallTextureLong;
    var textureLoader;
    var loader;

}

//light variables
{
    var light0;
    var light1;
    var ambientLight;
}

//world setup variables
{
    var renderer;
    var camera;
    var scene;
    var density;
    var raycaster;
    var prevTime //stores collidable objects
}

//fog density
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const objects = [];

function init(){
    prevTime = performance.now();

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.set(5, 5, -48);
    camera.lookAt(-5, 2, 0);

    scene = new THREE.Scene()

    //add black fog
    density = 0.1;
    scene.fog = new THREE.FogExp2(0x000000, density);

    textureLoader = new THREE.TextureLoader()

    //background sound
    game_sound( 'resources/Sci-Fi Space Alarm Sound Effect for Games-[AudioTrimmer.com] (1).mp3', 1, true );

    raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

    lights();

    load_models();
    
    load_textures();

    build_maze();

    game_controls();

    window.addEventListener( 'resize', onWindowResize );

    animate();

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
            
            //collision sound
            game_sound('resources/WoodCrashesDistant.mp3', 0.1, false);
        }

        controls.moveRight( - velocity.x * delta );
		controls.moveForward( - velocity.z * delta );
    
    }
    prevTime = time;

    renderer.render(scene, camera);
}

function game_controls(){
    controls = new PointerLockControls(camera,renderer.domElement);
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
}

function lights(){
    ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    light0 = new THREE.SpotLight( 0xff0000, 1, 20 );
    light0.position.set( -8, 1, -45 );
    light0.target.position.set(7, 1, -45);
    light0.power = 20;
    scene.add( light0 );
    scene.add(light0.target);

    light1 = new THREE.SpotLight( 0x00ff00, 1, 20 );
    light1.position.set( 19, 1, 45 );
    light1.target.position.set(-18, 1, 45);
    light1.power = 20;
    scene.add( light1 );
    scene.add(light1.target);
}

function load_models(){

    //start of maze door
    loader = new GLTFLoader();
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

    //end of maze door
    loader.load('./resources/Door.gltf', function (gltf) {
        gltf.scene.scale.set(5, 3, 4);
        gltf.scene.position.z = 50;
        gltf.scene.position.x = 10;
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
        loader = new GLTFLoader();
        loader.load('./model/scene.gltf', function (gltf) {
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
        loader = new GLTFLoader();
        loader.load('./model/scene.gltf', function (gltf) {
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
}

function load_textures(){

    //outdoor ground texture
    floorTexture = textureLoader.load("./resources/grass5.jpg");
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(20,20);

    //ground texture
    indoorFloorTexture = textureLoader.load("./resources/floor0.jpg");
    indoorFloorTexture.wrapS = THREE.RepeatWrapping;
    indoorFloorTexture.wrapT = THREE.RepeatWrapping;
    indoorFloorTexture.repeat.set(20,20);

    //dome like sky texture
    skyTexture = textureLoader.load("./resources/Skydome.png");
    skyTexture.wrapS = THREE.RepeatWrapping;
    skyTexture.wrapT = THREE.RepeatWrapping;
    skyTexture.repeat.set(1 ,1);

    //indoor roof texture
    roofTexture = textureLoader.load("./resources/roof_asbestos.png");
    roofTexture.wrapS = THREE.RepeatWrapping;
    roofTexture.wrapT = THREE.RepeatWrapping;
    roofTexture.repeat.set(25,25);

    //for small lenght walls
    wallTexture = textureLoader.load("./resources/wall3.jpg");
    wallTexture.wrapS = THREE.ClampToEdgeMapping;
    wallTexture.wrapT = THREE.ClampToEdgeMapping;
    wallTexture.repeat.set(2,1);
    
    //for medium length walls
    wallTextureMedium = textureLoader.load("./resources/wall3.jpg");
    wallTextureMedium.wrapS = THREE.ClampToEdgeMapping;
    wallTextureMedium.wrapT = THREE.ClampToEdgeMapping;
    wallTextureMedium.repeat.set(5,1);
    
    //for long length walls
    wallTextureLong = textureLoader.load("./resources/wall3.jpg");
    wallTextureLong.wrapS = THREE.ClampToEdgeMapping;
    wallTextureLong.wrapT = THREE.ClampToEdgeMapping;
    wallTextureLong.repeat.set(15,1);
}

//play sound in the game
//for collision sound, set repeat = false
//for background sound, set repeat = true
function game_sound(audio_file, volume, repeat_sound){
    const listener = new THREE.AudioListener();
    const sound = new THREE.Audio(listener);
    camera.add(listener)
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load( audio_file, function( buffer ) {
        sound.setBuffer( buffer );
        sound.setLoop( repeat_sound );
        sound.setVolume( volume );
        sound.play();
    });
}


//build maze
function build_maze(){

    //outdoor floor
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

    //indoor floor
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

    //indoor roof
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
    
    //world sky.
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

    //maze
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

window.onload = init;