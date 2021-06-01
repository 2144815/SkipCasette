import * as THREE from 'https://unpkg.com/three@0.125.2/build/three.module.js';
import {OrbitControls} from 'https://unpkg.com/three@0.125.2/examples/jsm/controls/OrbitControls.js'
import {PointerLockControls} from 'https://unpkg.com/three@0.125.2/examples/jsm/controls/PointerLockControls.js'

var scene, camera, renderer, mesh, ambientLight, pointLight, sky, controls;
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;

var prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

function init(){

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(90, (window.innerWidth/window.innerHeight), 0.1, 1000);

    camera.position.set(-5, 3, -60);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth,window.innerHeight);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;
    document.body.appendChild(renderer.domElement);


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
    
    



    var textureLoader = new THREE.TextureLoader()

    mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                color: 0xff9999,
                wireframe: false,
            }
        ),
    );
    mesh.position.y += 0.5;
    
   var grassTexture = textureLoader.load("./resources/256x grass block.png");
   grassTexture.wrapS = THREE.RepeatWrapping;
   grassTexture.wrapT = THREE.RepeatWrapping;
   grassTexture.repeat.set(50,50);
    
   var meshGrass = new THREE.Mesh(
        new THREE.CircleGeometry(100, 100),new THREE.MeshPhongMaterial(
            {
                wireframe: false,
                map: grassTexture,       

            }
        )
    )

    var floorTexture = textureLoader.load("./resources/01tizeta_floor_d.png");
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(25,25);

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
    var roofTexture = textureLoader.load("./resources/roof.jpg");
    roofTexture.wrapS = THREE.RepeatWrapping;
    roofTexture.wrapT = THREE.RepeatWrapping;
    roofTexture.repeat.set(25,25);

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

    

    var skyTexture = textureLoader.load("./resources/Skydome.png");
    skyTexture.wrapS = THREE.RepeatWrapping;
    skyTexture.wrapT = THREE.RepeatWrapping;
    skyTexture.repeat.set(1 ,1);
    sky = new THREE.Mesh(
        new THREE.SphereGeometry(100, 32, 32, 0, 2*Math.PI, 0, Math.PI/2),
        new THREE.MeshPhongMaterial(
            {
                wireframe: false,
                side: THREE.BackSide,
                map: skyTexture,

            }
        )

    );

    ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    pointLight = new THREE.PointLight(0xffffff, 1, 100,2);
    pointLight.position.set(-3,10,-6);
    pointLight.castShadow = true;
    pointLight.shadow.camera.near = 0.1;
    pointLight.shadow.camera.far = 25;
    scene.add(pointLight);
    
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    //scene.add(mesh);

    meshGrass.rotation.x -= Math.PI/2;
    meshGrass.receiveShadow = true;
    scene.add(meshGrass);
    
    meshFloor.rotation.x = Math.PI/2
    meshFloor.position.set(0, 0.1, 0)
    scene.add(meshFloor);

    meshRoof.rotation.x = Math.PI/2
    meshRoof.position.set(0, 7, 0)
    scene.add(meshRoof);


    
    scene.add(sky);

    var wallTexture =new THREE.TextureLoader().load('./resources/wall.jpg');
    wallTexture.wrapS=wallTexture.wrapT=THREE.ClampToEdgeMapping;
    wallTexture.repeat.set(2,1);
    var wallMaterial=new THREE.MeshStandardMaterial({map:wallTexture});

    var wallTextureOuter =new THREE.TextureLoader().load('./resources/wall.jpg');
    wallTextureOuter.wrapS=wallTextureOuter.wrapT=THREE.ClampToEdgeMapping;
    wallTextureOuter.repeat.set(4,1);
    var wallMaterialOuter=new THREE.MeshStandardMaterial({map:wallTextureOuter});

    // creating 2nd maze

    //Outer walls
    var wall0 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterialOuter);
    wall0.scale.set(100,10);
    wall0.rotation.y=Math.PI/2;
    wall0.position.set(50,2,0);
    wall0.castShadow=true;
    wall0.receiveShadow=true;
    scene.add(wall0);

    var wall1 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterialOuter);
    wall1.scale.set(100,10);
    wall1.rotation.y=Math.PI/2;
    wall1.position.set(-50,2,0);
    wall1.castShadow=true;
    wall1.receiveShadow=true;
    scene.add(wall1);

    var wall2 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterialOuter);
    wall2.scale.set(52,10);
    wall2.position.set(24.5,2,-50);
    wall2.castShadow=true;
    wall2.receiveShadow=true;
    scene.add(wall2);

    var wall3 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterialOuter);
    wall3.scale.set(40,10);
    wall3.position.set(-30.5,2,-50);
    wall3.castShadow=true;
    wall3.receiveShadow=true;
    scene.add(wall3);

    var wall4 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterialOuter);
    wall4.scale.set(41.6,10);
    wall4.position.set(29.68,2,50);
    wall4.castShadow=true;
    wall4.receiveShadow=true;
    scene.add(wall4);

    var wall5 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterialOuter);
    wall5.scale.set(52,10);
    wall5.position.set(-24.5,2,50);
    wall5.castShadow=true;
    wall5.receiveShadow=true;
    scene.add(wall5);

    //inner walls from bottom of maze(entrance), up.
    
    var wall6 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
    wall6.scale.set(18.2,10);
    wall6.rotation.y=Math.PI/2;
    wall6.position.set(-11,2,-41);
    wall6.castShadow=true;
    wall6.receiveShadow=true;
    scene.add(wall6);

    var wall7 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
    wall7.scale.set(18,10);
    wall7.position.set(-19.5,2,-32);
    wall7.castShadow=true;
    wall7.receiveShadow=true;
    scene.add(wall7);

    var wall8 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
    wall8.scale.set(9,10);
    wall8.rotation.y=Math.PI/2;
    wall8.position.set(-20,2,-45);
    wall8.castShadow=true;
    wall8.receiveShadow=true;
    scene.add(wall8);

    var wall9 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
    wall9.scale.set(19.5,10);
    wall9.rotation.y=Math.PI/2;
    wall9.position.set(-29,2,-33);
    wall9.castShadow=true;
    wall9.receiveShadow=true;
    scene.add(wall9);

    var wall10 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),wallMaterial);
    wall10.scale.set(10.4,10);
    wall10.position.set(-33.7,2,-23);
    wall10.castShadow=true;
    wall10.receiveShadow=true;
    scene.add(wall10);

    var wall11 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),wallMaterial);
    wall11.scale.set(19.5,10);
    wall11.rotation.y=Math.PI/2;
    wall11.position.set(-38.4,2,-33);
    wall11.castShadow=true;
    wall11.receiveShadow=true;
    scene.add(wall11);

    var wall12 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),wallMaterial);
    wall12.scale.set(26,10);
    wall12.rotation.y=Math.PI/2;
    wall12.position.set(-1,2,-37);
    wall12.castShadow=true;
    wall12.receiveShadow=true;
    scene.add(wall12);

    var wall13 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),wallMaterial);
    wall13.scale.set(30,10);
    wall13.position.set(-5,2,-23.5);
    wall13.castShadow=true;
    wall13.receiveShadow=true;
    scene.add(wall13);

    var wall14 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),wallMaterial);
    wall14.scale.set(19.5,10);
    wall14.rotation.y=Math.PI/2;
    wall14.position.set(10,2,-32.74);
    wall14.castShadow=true;
    wall14.receiveShadow=true;
    scene.add(wall14);

    var wall15 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
    wall15.scale.set(9,10);
    wall15.rotation.y=Math.PI/2;
    wall15.position.set(21,2,-45);
    wall15.castShadow=true;
    wall15.receiveShadow=true;
    scene.add(wall15);

    var wall16 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
    wall16.scale.set(9,10);
    wall16.rotation.y=Math.PI/2;
    wall16.position.set(-20,2,-19.5);
    wall16.castShadow=true;
    wall16.receiveShadow=true;
    scene.add(wall16);

    var wall17 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
    wall17.scale.set(9,10);
    wall17.position.set(-24,2,-15);
    wall17.castShadow=true;
    wall17.receiveShadow=true;
    scene.add(wall17);

    var wall18 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
    wall18.scale.set(9,10);
    wall18.rotation.y=Math.PI/2;
    wall18.position.set(-28,2,-10);
    wall18.castShadow=true;
    wall18.receiveShadow=true;
    scene.add(wall18);

    var wall19 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),wallMaterial);
    wall19.scale.set(30,10);
    wall19.position.set(-13.5,2,-5);
    wall19.castShadow=true;
    wall19.receiveShadow=true;
    scene.add(wall19);
    
    var wall20 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),wallMaterial);
    wall20.scale.set(20,10);
    wall20.rotation.y=Math.PI/2;
    wall20.position.set(-10,2,-5);
    wall20.castShadow=true;
    wall20.receiveShadow=true;
    scene.add(wall20);

    var wall21 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),wallMaterial);
    wall21.scale.set(9,10);
    wall21.rotation.y=Math.PI/2;
    wall21.position.set(1,2,0);
    wall21.castShadow=true;
    wall21.receiveShadow=true;
    scene.add(wall21);

    var wall22 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),wallMaterial);
    wall22.scale.set(19,10);
    wall22.position.set(10,2,4);
    wall22.castShadow=true;
    wall22.receiveShadow=true;
    scene.add(wall22);

    var wall23 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),wallMaterial);
    wall23.scale.set(9,10);
    wall23.position.set(-45,2,-15);
    wall23.castShadow=true;
    wall23.receiveShadow=true;
    scene.add(wall23);

    var wall24 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),wallMaterial);
    wall24.scale.set(20,10);
    wall24.rotation.y=Math.PI/2;
    wall24.position.set(-41,2,-5);
    wall24.castShadow=true;
    wall24.receiveShadow=true;
    scene.add(wall24);

    var wall25 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),wallMaterial);
    wall25.scale.set(20,10);
    wall25.position.set(-31.5,2,5);
    wall25.castShadow=true;
    wall25.receiveShadow=true;
    scene.add(wall25);

    var wall26 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),wallMaterial);
    wall26.scale.set(9,10);
    wall26.rotation.y=Math.PI/2;
    wall26.position.set(-22,2,9);
    wall26.castShadow=true;
    wall26.receiveShadow=true;
    scene.add(wall26);

    var wall27 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
    wall27.scale.set(31,10);
    wall27.position.set(-26,2,14);
    wall27.castShadow=true;
    wall27.receiveShadow=true;
    scene.add(wall27);

    var wall28 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
    wall28.scale.set(20.8,10);
    wall28.position.set(11,2,-14);
    wall28.castShadow=true;
    wall28.receiveShadow=true;
    scene.add(wall28);

    var wall29 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
    wall29.scale.set(20.8,10);
    wall29.rotation.y=Math.PI/2;
    wall29.position.set(21,2,-24);
    wall29.castShadow=true;
    wall29.receiveShadow=true;
    scene.add(wall29);

    var wall30 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
    wall30.scale.set(9,10);
    wall30.rotation.y=Math.PI/2;
    wall30.position.set(10,2,-10);
    wall30.castShadow=true;
    wall30.receiveShadow=true;
    scene.add(wall30);

    var wall31 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
    wall31.scale.set(20.8,10);
    wall31.position.set(19.9,2,-5);
    wall31.castShadow=true;
    wall31.receiveShadow=true;
    scene.add(wall31);

    var wall32 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
    wall32.scale.set(20.8,10);
    wall32.rotation.y=Math.PI/2;
    wall32.position.set(30,2,-5);
    wall32.castShadow=true;
    wall32.receiveShadow=true;
    scene.add(wall32);

    var wall33 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
    wall33.scale.set(20.8,10);
    wall33.position.set(40,2,-15);
    wall33.castShadow=true;
    wall33.receiveShadow=true;
    scene.add(wall33);

    var wall34 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
    wall34.scale.set(9,10);
    wall34.rotation.y=Math.PI/2;
    wall34.position.set(40,2,-20);
    wall34.castShadow=true;
    wall34.receiveShadow=true;
    scene.add(wall34);

    var wall35 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
    wall35.scale.set(20,10);
    wall35.position.set(30.5,2,-34);
    wall35.castShadow=true;
    wall35.receiveShadow=true;
    scene.add(wall35);

    var wall36 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
    wall36.scale.set(9,10);
    wall36.rotation.y=Math.PI/2;
    wall36.position.set(40,2,-39);
    wall36.castShadow=true;
    wall36.receiveShadow=true;
    scene.add(wall36);

    var wall37 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
    wall37.scale.set(20.8,10);
    wall37.rotation.y=Math.PI/2;
    wall37.position.set(30,2,-33);
    wall37.castShadow=true;
    wall37.receiveShadow=true;
    scene.add(wall37);

    var wall38 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
    wall38.scale.set(9,10);
    wall38.position.set(45,2,5);
    wall38.castShadow=true;
    wall38.receiveShadow=true;
    scene.add(wall38);

    var wall39 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
    wall39.scale.set(9,10);
    wall39.rotation.y=Math.PI/2;
    wall39.position.set(40,2,1);
    wall39.castShadow=true;
    wall39.receiveShadow=true;
    scene.add(wall39);

    var wall40 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
    wall40.scale.set(35,10);
    wall40.rotation.y=Math.PI/2;
    wall40.position.set(40,2,32);
    wall40.castShadow=true;
    wall40.receiveShadow=true;
    scene.add(wall40);

    var wall41 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
    wall41.scale.set(9,10);
    wall41.position.set(35,2,15);
    wall41.castShadow=true;
    wall41.receiveShadow=true;
    scene.add(wall41);

    var wall42 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),wallMaterial);
    wall42.scale.set(12,10);
    wall42.rotation.y=Math.PI/2;
    wall42.position.set(30,2,20.5);
    wall42.castShadow=true;
    wall42.receiveShadow=true;
    scene.add(wall42);

    var wall43 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),wallMaterial);
    wall43.scale.set(12,10);
    wall43.rotation.y=Math.PI/2;
    wall43.position.set(30,2,44);
    wall43.castShadow=true;
    wall43.receiveShadow=true;
    scene.add(wall43);

    var wall44 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),wallMaterial);
    wall44.scale.set(32.5,10);
    wall44.position.set(14,2,38.5);
    wall44.castShadow=true;
    wall44.receiveShadow=true;
    scene.add(wall44);

    var wall45 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),wallMaterial);
    wall45.scale.set(24,10);
    wall45.rotation.y=Math.PI/2;
    wall45.position.set(20,2,26);
    wall45.castShadow=true;
    wall45.receiveShadow=true;
    scene.add(wall45);

    var wall46 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),wallMaterial);
    wall46.scale.set(24,10);
    wall46.rotation.y=Math.PI/2;
    wall46.position.set(-1.8,2,26);
    wall46.castShadow=true;
    wall46.receiveShadow=true;
    scene.add(wall46);

    var wall47 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),wallMaterial);
    wall47.scale.set(10,10);
    wall47.position.set(2.7,2,14);
    wall47.castShadow=true;
    wall47.receiveShadow=true;
    scene.add(wall47);

    var wall48 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),wallMaterial);
    wall48.scale.set(15,10);
    wall48.rotation.y=Math.PI/2;
    wall48.position.set(7.2,2,21);
    wall48.castShadow=true;
    wall48.receiveShadow=true;
    scene.add(wall48);

    var wall49 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
    wall49.scale.set(40,10);
    wall49.position.set(-22,2,27);
    wall49.castShadow=true;
    wall49.receiveShadow=true;
    scene.add(wall49);

    var wall50 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
    wall50.scale.set(12,10);
    wall50.rotation.y=Math.PI/2;
    wall50.position.set(-30,2,33);
    wall50.castShadow=true;
    wall50.receiveShadow=true;
    scene.add(wall50);

    var wall51 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
    wall51.scale.set(12,10);
    wall51.position.set(-44,2,39);
    wall51.castShadow=true;
    wall51.receiveShadow=true;
    scene.add(wall51);

    var wall52 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
    wall52.scale.set(12,10);
    wall52.rotation.y=Math.PI/2;
    wall52.position.set(-20,2,44);
    wall52.castShadow=true;
    wall52.receiveShadow=true;
    scene.add(wall52);

    var wall53 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), wallMaterial);
    wall53.scale.set(12,10);
    wall53.position.set(-14,2,38.5);
    wall53.castShadow=true;
    wall53.receiveShadow=true;
    scene.add(wall53);


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
        const delta = ( time - prevTime ) / 1000;
        velocity.x -= velocity.x * 20.0 * delta;
		velocity.z -= velocity.z * 20.0 * delta;
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
window.onload = init;