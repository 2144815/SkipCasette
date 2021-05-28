var scene, camera, renderer, mesh, ambientLight, pointLight, sky;
var crate, crateTexture, crateBumpMap, crateNormalMap, floorTexture, skyTexture;
var meshFloor, meshRoof;
var keyboard = {};

function init(){

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(90, (1260/600 ), 0.1, 1000);
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
    
    floorTexture = textureLoader.load("256x grass block.png");
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(50,50);
    
    meshFloor = new THREE.Mesh(
        new THREE.CircleGeometry(100, 100),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                wireframe: false,
                map: floorTexture,       

            }
        )
    )

    roofTexture = textureLoader.load("01tizeta_floor_d.png");
    roofTexture.wrapS = THREE.RepeatWrapping;
    roofTexture.wrapT = THREE.RepeatWrapping;
    roofTexture.repeat.set(25,25);

    meshRoof = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xff00ff,
                side: THREE.DoubleSide,
                polygonOffset: true,
                wireframe: false,
                map: roofTexture,

            }
        )
    )

    skyTexture = textureLoader.load("Skydome.png");
    skyTexture.wrapS = THREE.RepeatWrapping;
    skyTexture.wrapT = THREE.RepeatWrapping;
    skyTexture.repeat.set(1 ,1);
    sky = new THREE.Mesh(
        new THREE.SphereGeometry(100, 32, 32, 0, 2*Math.PI, 0, Math.PI/2),
        new THREE.MeshPhongMaterial(
            {
                //color: 0x87ceeb,
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

    meshFloor.rotation.x -= Math.PI/2;
    meshFloor.receiveShadow = true;
    scene.add(meshFloor);
    
    meshRoof.rotation.x = Math.PI/2
    meshRoof.position.set(0, 0.1, 0)
    scene.add(sky);
    
    scene.add(meshRoof);

    //crateTexture = textureLoader.load("3crates/crate0/crate0_diffuse.png");
    crateTexture = textureLoader.load("brks_6.png");
    crateBumpMap = textureLoader.load("3crates/crate0/crate0_bump.png");
    crateNormalMap = textureLoader.load("3crates/crate0/crate0_normal.png");

    
    
    
    
    
    
    
    
    
    
    
    
    crateTexture.wrapS = THREE.RepeatWrapping;
    crateTexture.wrapT = THREE.RepeatWrapping;
    crateTexture.repeat.set(1,1);
    
    //build the maze from top left to bottom right
    var crate0 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                wireframe: false,
                side: THREE.DoubleSide,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate0.castShadow = true;
    crate0.receiveShadow = true;

    crate0.scale.set(100, 10);
    crate0.position.set(50, 5, 0);
    crate0.rotation.y += Math.PI/2
    scene.add(crate0);
    
    var crate1 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                wireframe: false,
                side: THREE.DoubleSide,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate1.castShadow = true;
    crate1.receiveShadow = true;

    crate1.position.set(35, 5, 50);
    crate1.scale.set(30, 10);

    scene.add(crate1);

    var crate2 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                wireframe: false,
                side: THREE.DoubleSide,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate2.castShadow = true;
    crate2.receiveShadow = true;

    crate2.position.set(-20, 5, 50);
    crate2.scale.set(60, 10);

    scene.add(crate2);

    var crate3 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                wireframe: false,
                side: THREE.DoubleSide,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );

    crate3.castShadow = true;
    crate3.receiveShadow = true;

    crate3.scale.set(100, 10);
    crate3.position.set(-50, 5, 0);
    crate3.rotation.y += Math.PI/2

    scene.add(crate3);

    var crate4 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                wireframe: false,
                map:crateTexture,
                side: THREE.DoubleSide,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate4.castShadow = true;
    crate4.receiveShadow = true;

    crate4.position.set(20, 5, 45);
    crate4.rotation.y += Math.PI/2
    crate4.scale.set(10, 10);

    scene.add(crate4);

    var crate5 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                wireframe: false,
                side: THREE.DoubleSide,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate5.castShadow = true;
    crate5.receiveShadow = true;

    crate5.position.set(-30, 5, 45);
    crate5.rotation.y = Math.PI/2
    crate5.scale.set(10, 10);

    scene.add(crate5);

    var crate6 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                wireframe: false,
                side: THREE.DoubleSide,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate6.castShadow = true;
    crate6.receiveShadow = true;

    crate6.position.set(40, 5, 40);
    crate6.scale.set(20, 10);

    scene.add(crate6);

    var crate7 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate7.castShadow = true;
    crate7.receiveShadow = true;

    crate7.position.set(5, 5, 40);
    crate7.scale.set(10, 10);

    scene.add(crate7);

    var crate8 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate8.castShadow = true;
    crate8.receiveShadow = true;

    crate8.position.set(-25, 5, 40);
    crate8.scale.set(10, 10);

    scene.add(crate8);

    var crate9 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate9.castShadow = true;
    crate9.receiveShadow = true;

    crate9.position.set(30, 5, 35);
    crate9.rotation.y = Math.PI/2
    crate9.scale.set(10, 10);

    scene.add(crate9);

    var crate10 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate10.castShadow = true;
    crate10.receiveShadow = true;

    crate10.position.set(10, 5, 30);
    crate10.rotation.y = Math.PI/2
    crate10.scale.set(20, 10);

    scene.add(crate10);

    var crate11 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate11.castShadow = true;
    crate11.receiveShadow = true;

    crate11.position.set(-10, 5, 35);
    crate11.rotation.y = Math.PI/2
    crate11.scale.set(10, 10);

    scene.add(crate11);

    var crate12 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate12.castShadow = true;
    crate12.receiveShadow = true;

    crate12.position.set(-40, 5, 35);
    crate12.rotation.y = Math.PI/2
    crate12.scale.set(10, 10);

    scene.add(crate12);

    var crate13 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate13.castShadow = true;
    crate12.receiveShadow = true;

    crate13.position.set(20, 5, 30);
    crate13.scale.set(20, 10);

    scene.add(crate13);

    var crate14 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate14.castShadow = true;
    crate14.receiveShadow = true;

    crate14.position.set(-25, 5, 30);
    crate14.scale.set(30, 10);

    scene.add(crate14);

    var crate15 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate15.castShadow = true;
    crate15.receiveShadow = true;

    crate15.position.set(40, 5, 25);
    crate15.rotation.y = Math.PI/2;
    crate15.scale.set(10, 10);

    scene.add(crate15);

    var crate16 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate16.castShadow = true;
    crate12.receiveShadow = true;

    crate16.position.set(0, 5, 25);
    crate16.rotation.y = Math.PI/2;
    crate16.scale.set(10, 10);

    scene.add(crate16);

    var crate17 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate17.castShadow = true;
    crate17.receiveShadow = true;

    crate17.position.set(-30, 5, 20);
    crate17.rotation.y = Math.PI/2;
    crate17.scale.set(20, 10);

    scene.add(crate17);

    var crate18 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate18.castShadow = true;
    crate18.receiveShadow = true;

    crate18.position.set(30, 5, 20);
    crate18.scale.set(20, 10);

    scene.add(crate18);

    var crate19 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate19.castShadow = true;
    crate19.receiveShadow = true;

    crate19.position.set(-10, 5, 20);
    crate19.scale.set(40, 10);

    scene.add(crate19);

    var crate20 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate20.castShadow = true;
    crate20.receiveShadow = true;

    crate20.position.set(-45, 5, 20);
    crate20.scale.set(10, 10);

    scene.add(crate20);

    var crate21 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate21.castShadow = true;
    crate21.receiveShadow = true;

    crate21.position.set(30, 5, 10);
    crate21.rotation.y = Math.PI/2;
    crate21.scale.set(20, 10);

    scene.add(crate21);

    var crate22 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate22.castShadow = true;
    crate22.receiveShadow = true;

    crate22.position.set(-10, 5, 15);
    crate22.rotation.y = Math.PI/2;
    crate22.scale.set(10, 10);

    scene.add(crate22);

    var crate23 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate23.castShadow = true;
    crate23.receiveShadow = true;

    crate23.position.set(45, 5, 10);
    crate23.scale.set(10, 10);

    scene.add(crate23);

    var crate24 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate24.castShadow = true;
    crate24.receiveShadow = true;

    crate24.position.set(15, 5, 10);
    crate24.scale.set(30, 10);

    scene.add(crate24);

    var crate25 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate25.castShadow = true;
    crate25.receiveShadow = true;

    crate25.position.set(-35, 5, 10);
    crate25.scale.set(10, 10);

    scene.add(crate25);

    var crate26 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate26.castShadow = true;
    crate26.receiveShadow = true;

    crate26.position.set(10, 5, 5);
    crate26.rotation.y = Math.PI/2;
    crate26.scale.set(10, 10);

    scene.add(crate26);

    var crate27 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate27.castShadow = true;
    crate27.receiveShadow = true;

    crate27.position.set(-20, 5, 5);
    crate27.rotation.y = Math.PI/2;
    crate27.scale.set(10, 10);

    scene.add(crate27);

    var crate28 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate28.castShadow = true;
    crate28.receiveShadow = true;

    crate28.position.set(35, 5, 0);
    crate28.scale.set(10, 10);

    scene.add(crate28);

    var crate29 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate29.castShadow = true;
    crate29.receiveShadow = true;

    crate29.position.set(15, 5, 0);
    crate29.scale.set(10, 10);

    scene.add(crate29);

    var crate30 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate30.castShadow = true;
    crate30.receiveShadow = true;

    crate30.position.set(-25, 5, 0);
    crate30.scale.set(50, 10);

    scene.add(crate30);

    var crate31 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate31.castShadow = true;
    crate31.receiveShadow = true;

    crate31.position.set(40, 5, -5);
    crate31.rotation.y = Math.PI/2;
    crate31.scale.set(10, 10);

    scene.add(crate31);

    var crate32 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate32.castShadow = true;
    crate32.receiveShadow = true;

    crate32.position.set(0, 5, -5);
    crate32.rotation.y = Math.PI/2;
    crate32.scale.set(10, 10);

    scene.add(crate32);

    var crate33 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate33.castShadow = true;
    crate33.receiveShadow = true;

    crate33.position.set(-30, 5, -5);
    crate33.rotation.y = Math.PI/2;
    crate33.scale.set(10, 10);

    scene.add(crate33);

    var crate34 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate34.castShadow = true;
    crate34.receiveShadow = true;

    crate34.position.set(30, 5, -10);
    crate34.scale.set(20, 10);

    scene.add(crate34);

    var crate35 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate35.castShadow = true;
    crate35.receiveShadow = true;

    crate35.position.set(-5, 5, -10);
    crate35.scale.set(30, 10);

    scene.add(crate35);

    var crate36 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate36.castShadow = true;
    crate36.receiveShadow = true;

    crate36.position.set(20, 5, -25);
    crate36.rotation.y = Math.PI/2;
    crate36.scale.set(30, 10);

    scene.add(crate36);

    var crate37 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate37.castShadow = true;
    crate37.receiveShadow = true;

    crate37.position.set(-10, 5, -20);
    crate37.rotation.y = Math.PI/2;
    crate37.scale.set(20, 10);

    scene.add(crate37);

    var crate38 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate38.castShadow = true;
    crate38.receiveShadow = true;

    crate38.position.set(-40, 5, -25);
    crate38.rotation.y = Math.PI/2;
    crate38.scale.set(30, 10);

    scene.add(crate38);

    var crate39 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate39.castShadow = true;
    crate39.receiveShadow = true;

    crate39.position.set(45, 5, -20);
    crate39.scale.set(10, 10);

    scene.add(crate39);

    var crate40 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate40.castShadow = true;
    crate40.receiveShadow = true;

    crate40.position.set(10, 5, -20);
    crate40.scale.set(20, 10);

    scene.add(crate40);

    var crate41 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate41.castShadow = true;
    crate41.receiveShadow = true;

    crate41.position.set(-30, 5, -20);
    crate41.scale.set(20, 10);

    scene.add(crate41);

    var crate42 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate42.castShadow = true;
    crate42.receiveShadow = true;

    crate42.position.set(30, 5, -25);
    crate42.rotation.y = Math.PI/2
    crate42.scale.set(10, 10);

    scene.add(crate42);

    var crate43 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate43.castShadow = true;
    crate43.receiveShadow = true;

    crate43.position.set(0, 5, -30);
    crate43.rotation.y = Math.PI/2;
    crate43.scale.set(20, 10);

    scene.add(crate43);


    var crate44 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate44.castShadow = true;
    crate44.receiveShadow = true;

    crate44.position.set(35, 5, -30);
    crate44.scale.set(10, 10);

    scene.add(crate44);

    var crate45 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate45.castShadow = true;
    crate45.receiveShadow = true;

    crate45.position.set(-25, 5, -30);
    crate45.scale.set(30, 10);

    scene.add(crate45);

    var crate46 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate46.castShadow = true;
    crate46.receiveShadow = true;

    crate46.position.set(40, 5, -40);
    crate46.rotation.y = Math.PI/2;
    crate46.scale.set(20, 10);

    scene.add(crate46);

    var crate47 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate47.castShadow = true;
    crate47.receiveShadow = true;

    crate47.position.set(10, 5, -40);
    crate47.rotation.y = Math.PI/2;
    crate47.scale.set(20, 10);

    scene.add(crate47);

    var crate48 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate48.castShadow = true;
    crate48.receiveShadow = true;

    crate48.position.set(-20, 5, -35);
    crate48.rotation.y = Math.PI/2;
    crate48.scale.set(10, 10);

    scene.add(crate48);

    var crate49 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate49.castShadow = true;
    crate49.receiveShadow = true;

    crate49.position.set(25, 5, -40);
    crate49.scale.set(10, 10);

    scene.add(crate49);

    var crate50 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate50.castShadow = true;
    crate50.receiveShadow = true;

    crate50.position.set(-5, 5, -40);
    crate50.scale.set(10, 10);

    scene.add(crate50);

    var crate51 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate51.castShadow = true;
    crate40.receiveShadow = true;

    crate51.position.set(-5, 5, -40);
    crate51.scale.set(10, 10);

    scene.add(crate51);

    var crate52 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate52.castShadow = true;
    crate52.receiveShadow = true;

    crate52.position.set(-10, 5, -45);
    crate52.rotation.y = Math.PI/2;
    crate52.scale.set(10, 10);

    scene.add(crate52);

    var crate53 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate53.castShadow = true;
    crate53.receiveShadow = true;

    crate53.position.set(-30, 5, -45);
    crate53.rotation.y = Math.PI/2;
    crate53.scale.set(10, 10);

    scene.add(crate53);

    var crate54 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate54.castShadow = true;
    crate54.receiveShadow = true;

    crate54.position.set(25, 5, -50);
    crate54.scale.set(50, 10);

    scene.add(crate54);

    var crate55 = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhongMaterial(
            {
                //color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                map:crateTexture,
                bumpMap:crateBumpMap,
            }
        ),
    );
    crate55.castShadow = true;
    crate55.receiveShadow = true;

    crate55.position.set(-30, 5, -50);
    crate55.scale.set(40, 10);

    scene.add(crate55);





























    camera.position.set(0, 2, -60);
    camera.lookAt(0, 2, 0);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(1260, 600);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;

    document.body.appendChild(renderer.domElement);

    animate();
}

function animate(){
    requestAnimationFrame(animate);
    if(keyboard[87]){ //W KEY
        camera.position.x -= Math.sin(camera.rotation.y)*0.2;
        camera.position.z -= -Math.cos(camera.rotation.y)*0.2;
    }
    if(keyboard[83]){ //S KEY
        camera.position.x += Math.sin(camera.rotation.y)*0.2; 
        camera.position.z += -Math.cos(camera.rotation.y)*0.2;
    }
    if(keyboard[65]){ //A KEY
        camera.position.x += Math.sin(camera.rotation.y + Math.PI/2)*0.2;
        camera.position.z += -Math.cos(camera.rotation.y + Math.PI/2)*0.2;
    }
    if(keyboard[68]){ //D KEY
        camera.position.x += Math.sin(camera.rotation.y - Math.PI/2)*0.2;
        camera.position.z += -Math.cos(camera.rotation.y - Math.PI/2)*0.2;
    }


    if(keyboard[37]){ //LEFT ARROW KEY
        camera.rotation.y -= Math.PI*0.02;
    }
    if(keyboard[39]){ //RIGHT ARROW KEY
        camera.rotation.y += Math.PI*0.01;
    }

    renderer.render(scene, camera);
}
function keyDown(event){
    keyboard[event.keyCode] = true;

}

function keyUp(event){
    keyboard[event.keyCode] = false;

}

window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp);

window.onload = init;