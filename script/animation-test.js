import * as THREE from 'three';
import {OrbitControls} from '../node_modules/three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import {RGBELoader} from '../node_modules/three/examples/jsm/loaders/RGBELoader.js';

const monkeyUrl = new URL('../assets/donut/textures/mercedes_amg_gt.glb', import.meta.url);

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.7; 

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 5

scene.add(camera)
// const orbit = new OrbitControls(camera, renderer.domElement);

// camera.position.set(10, 10, 10);
// orbit.update();


const assetLoader = new GLTFLoader();

let mixer;
const rgbeLoader = new RGBELoader();
rgbeLoader.load('../assets/donut/MR_INT-005_WhiteNeons_NAD.hdr', function(texture){
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment=texture
    assetLoader.load('../assets/donut/mercedes_amg_gt.glb', function(gltf) {


      

        const model = gltf.scene;
        scene.add(model);

        model.position.x = 0;
        model.position.y = -0.5;
  
        model.rotation.y = 5;
        model.rotation.x= 0.2;
     
  
        model.scale.set(0.8, 0.8, 0.8)

        mixer = new THREE.AnimationMixer(model);
        const clips = gltf.animations;
    
        // Play a certain animation
        const clip = THREE.AnimationClip.findByName(clips, 'HOOD_ANIM');
        const action = mixer.clipAction(clip);
        action.play();
        // action.loop =THREE.LoopOnce;
        // action.stop();
    
        // // Play all animations at the same time
        // clips.forEach(function(clip) {
        //     const action = mixer.clipAction(clip);
        //     action.play();
        // });
        createAnimation(mixer,action,clip)
    }, undefined, function(error) {
        console.error(error);
    });
})


// const clock = new THREE.Clock();
// function animate() {
//     if(mixer)
//         mixer.update(clock.getDelta());
//     renderer.render(scene, camera);
// }

// renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
var clock = new THREE.Clock();
function render() {
  requestAnimationFrame(render);
  var delta = clock.getDelta();
  if (mixer != null) mixer.update(delta);
  // if (model) model.rotation.y += 0.025

  renderer.render(scene, camera);
}

render();
gsap.registerPlugin(ScrollTrigger);

function createAnimation(mixer, action, clip) {
  let proxy = {
    get time() {
      return mixer.time;
    },
    set time(value) {
      action.paused = false;
      mixer.setTime(value);
      action.paused = true;
    }
  };
  let scrollingTL = gsap.timeline({
    scrollTrigger: {
      trigger: renderer.domElement,
      start: "top top",
      end: "100%",
      pin: true,
      scrub: true,
    //   markers: true,
      onUpdate: function () {
        camera.updateProjectionMatrix()
        console.log(proxy.time)
      }
    }
  });

  scrollingTL.to(proxy, {
    time: clip.duration,
    repeat: 0,
  });
}