
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

/**
 * Loaders
 */
const bodyElement = document.querySelector('body')
// const videoElement = document.getElementById('autoplay')
const loadingManager = new THREE.LoadingManager(
    () => {
            gsap.to(overlayMaterial.uniforms.uAlpha, {
                duration: 1.5,
                value: 0,
                delay: 1
            })
            gsap.to(overlayMaterial.uniforms.uAlpha, {
                duration: 1.5,
                value: 0,
                delay: 1
            })
            bodyElement.classList.add('loaded')
            document.getElementById('autoplay').play()
        },
    (itemUrl, itemsLoaded, itemsTotal) => {
        console.log(itemUrl, itemsLoaded, itemsTotal)
        const progressRatio = itemsLoaded / itemsTotal
        console.log(progressRatio)
    },
    () => {

    }
)
const gltfLoader = new THREE.GLTFLoader(loadingManager)

/**
 *  Textures
 */
const textureLoader = new THREE.TextureLoader()
const alphaShadow = textureLoader.load('../assets/texture/simpleShadow.jpg');

// Scene
const scene = new THREE.Scene()


/**
 * Overlay
 */
const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)
const overlayMaterial = new THREE.ShaderMaterial({
    vertexShader: `
        void main() {
            gl_Position = vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float uAlpha;
        void main() {
            gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
            // gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        }
    `,
    uniforms: {
        uAlpha: {
            value: 1.0
        }
    },
    transparent: true
})
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
scene.add(overlay)


/**
 * GLTF Model
 */
let donut = null
const rgbeLoader = new THREE.RGBELoader();
rgbeLoader.load('../assets/donut/MR_INT-005_WhiteNeons_NAD.hdr', function(texture){
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment=texture
gltfLoader.load(
    '../assets/donut/orange.gltf',
    (gltf) => {
        console.log(gltf);

        donut = gltf.scene

        donut.position.x = 0;
        donut.position.y = 0;

        donut.rotation.y = 5;
        donut.rotation.x= 0.2;
     

        donut.scale.set(0.6, 0.6, 0.6)

        scene.add(donut)
    },
    (progress) => {
        console.log(progress);
    },
    (error) => {
        console.error(error);
    }
)
})


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Scroll
 */
let scrollY = window.scrollY
let currentSection = 0

const transformDonut = [
    // {
    //     rotationZ: 0.45,
    //     positionX: 1.5,
  
    // },
    {
        rotationZ: 0,
        positionX: 0,
        rotationY: 5,
        positionY: 0,
        positionZ: 1,
        rotationX: 0.2
    },
    {
        rotationZ: 0,
        positionX: 0.1,
        rotationY: 6.35,
        positionY: -0.2,
        positionZ: 0.7,

    },
    {
        rotationZ: 0,
        positionX: -0.2,
        rotationY: 2.8,
        positionY: -1.8,
        positionZ: -3
    },
    {
        rotationZ: 0,
        positionX: -1,
        rotationY: 7.2,
        positionY: -1.3,
        positionZ: -1.5,
    },
    {
        rotationZ: 0,
        positionX: 0,
        rotationY: 6.1,
        positionY: -0.5,
        positionZ: 0.3,
        rotationX: 0.2
    }
]

window.addEventListener('scroll', () => {
    
    scrollY = window.scrollY;
    const newSection = Math.round(scrollY / 100)

    console.log(newSection);

    if (newSection != currentSection) {
        currentSection = newSection

        if (!!donut) {
            gsap.to(
                donut.rotation, {
                    duration: 3,
                    ease: 'power4.inOut',
                    z: transformDonut[currentSection].rotationZ
                }
            )
            
            gsap.to(
                donut.position, {
                    duration: 2,
                    ease: 'power4.inOut',
                    x: transformDonut[currentSection].positionX
                }
            )
            gsap.to(
                donut.rotation, {
                    duration: 3,
                    ease: 'power4.inOut',
                    y: transformDonut[currentSection].rotationY
                }
            )
            gsap.to(
                donut.position, {
                    duration: 2,
                    ease: 'power4.inOut',
                    y: transformDonut[currentSection].positionY
                }
            )
            gsap.to(
                donut.position, {
                    duration: 2,
                    ease: 'power4.inOut',
                    z: transformDonut[currentSection].positionZ
                }
            )
        }
    }
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 1000)
camera.position.z = 5

scene.add(camera)

/**
 * Renderer
 */
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
renderer.toneMappingExposure = 0.7; 

/**
 * Animate
 */
const clock = new THREE.Clock()
let lastElapsedTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastElapsedTime
    lastElapsedTime = elapsedTime

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

/**
 * On Reload
 */
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}
