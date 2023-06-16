const canvas = document.querySelector('canvas.blue')

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
const loadingManager = new THREE.LoadingManager();
const progressBar = document.getElementById('progress-bar');

loadingManager.onProgress = function(url,loaded,total){
    progressBar.value=(loaded/total)*100;
}

const loadingContainer = document.querySelector('.loading');

loadingManager.onLoad = function(){
    loadingContainer.style.display = 'none';
}

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.4; 
const bodyElement = document.querySelector('body');
bodyElement.classList.add('loaded');

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 1000)
camera.position.z = 5

scene.add(camera)
// const orbit = new OrbitControls(camera, renderer.domElement);

// camera.position.set(10, 10, 10);
// orbit.update();


const assetLoader = new THREE.GLTFLoader(loadingManager);
let model = null;

let mixer;
const rgbeLoader = new THREE.RGBELoader();
rgbeLoader.load('../assets/donut/MR_INT-005_WhiteNeons_NAD.hdr', function(texture){
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment=texture
    assetLoader.load('../assets/donut/green.gltf', function(gltf) {

        const model = gltf.scene;
        
        model.position.x = 0;
        model.position.y = -0.3;
  
        model.rotation.y = 5;
        model.rotation.x= 0.3;
     
  
        model.scale.set(0.8, 0.8, 0.8)

        mixer = new THREE.AnimationMixer(model);
        const clips = gltf.animations;
    
        // Play a certain animation
        const clip = THREE.AnimationClip.findByName(clips, 'HOOD_ANIM');
        const action = mixer.clipAction(clip);
        const clip2 = THREE.AnimationClip.findByName(clips, 'DOOR_LEFT_ANIM');
        const action2 = mixer.clipAction(clip2);
        const clip3 = THREE.AnimationClip.findByName(clips, 'DOOR_RIGHT_ANIM');
        const action3 = mixer.clipAction(clip3);
        // action.loop =THREE.LoopOnce;
        // action.stop();
    
        // // Play all animations at the same time
        
        document.querySelector("#popHood").addEventListener('click',()=>{
            openHood(action);
        } )
        document.querySelector("#leftDoor").addEventListener('click',()=>{
            openHood(action2);
        } )
        document.querySelector("#rightDoor").addEventListener('click',()=>{
            openHood(action3);
        } )
        document.querySelector("#allAnimation").addEventListener('click',()=>{
            clips.forEach(function(clip) {
            const action = mixer.clipAction(clip);
            action.setLoop( THREE.LoopPingPong );
            action.clampWhenFinished = true;
            action.play();
        });
        } )
        document.querySelector("#stop").addEventListener('click',()=>{
            stop(action);
            stop(action2);
            stop(action3);
        } )
        const rotateLeft = ()=>{
            model.rotation.y -= 0.43
        }
        const rotateRight = ()=>{
            model.rotation.y += 0.43
        }
        document.querySelector("#left").addEventListener('click',()=>{
            rotateLeft();
        } )
        document.querySelector("#right").addEventListener('click',()=>{
            rotateRight();
        } )
        scene.add(model);
    }, undefined, function(error) {
        console.error(error);
    });
})

var clock = new THREE.Clock();
function render() {
  requestAnimationFrame(render);
  var delta = clock.getDelta();
  if (mixer != null) mixer.update(delta);
  // if (model) model.rotation.y += 0.025

  renderer.render(scene, camera);
}
render();

function openHood(action) {
    action.setLoop( THREE.LoopPingPong );
    action.clampWhenFinished = true;
    action.play();
}
function leftDoor(action2) {
    action2.setLoop( THREE.LoopPingPong );
    action2.clampWhenFinished = true;
    action2.play();
}
function RightDoor(action3) {
    action3.setLoop( THREE.LoopPingPong );
    action3.clampWhenFinished = true;
    action3.play();
}
function stop(action) {
    action.stop();
}





