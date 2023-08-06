import "./style.css"
import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import * as dat from "dat.gui"
// Setup

const canvas = document.querySelector("canvas.webgl")

const gui = new dat.GUI()

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

const scene = new THREE.Scene()

const fog = new THREE.Fog(0x262837, 7, 28)
scene.fog = fog

const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 0.1,100)
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.autoRotate = true
controls.autoRotateSpeed = 4

// Textures

const textureLoader = new THREE.TextureLoader()

const bricksColorTexture = textureLoader.load('/bricks/color.jpg')
const bricksAmbientOcclusionTexture = textureLoader.load('/bricks/ambientOcclusion.jpg')
const bricksNormalTexture = textureLoader.load('/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('/bricks/roughness.jpg')

const roadsColorTexture = textureLoader.load('/roads/basecolor.jpg')
const roadsAmbientOcclusionTexture = textureLoader.load('/roads/ambientOcclusion.jpg')
const roadsNormalTexture = textureLoader.load('/roads/normal.jpg')
const roadsRoughnessTexture = textureLoader.load('/roads/roughness.jpg')
const roadsHeightTexture = textureLoader.load('/roads/height.png')

const floorColorTexture = textureLoader.load('/floor/basecolor.jpg')
const floorAmbientOcclusionTexture = textureLoader.load('/floor/ambientOcclusion.jpg')
const floorNormalTexture = textureLoader.load('/floor/normal.jpg')
const floorRoughnessTexture = textureLoader.load('/floor/roughness.jpg')
const floorHeightTexture = textureLoader.load('/floor/height.png')

const rockColorTexture = textureLoader.load('/rock/basecolor.jpg')
const rockAmbientOcclusionTexture = textureLoader.load('/rock/ambientOcclusion.jpg')
const rockNormalTexture = textureLoader.load('/rock/normal.jpg')
const rockRoughnessTexture = textureLoader.load('/rock/roughness.jpg')
const rockHeightTexture = textureLoader.load('/rock/height.png')

// Light

const ambientLight = new THREE.AmbientLight(0xffffff, 0.1)
scene.add(ambientLight)

const moonLight =new THREE.DirectionalLight(0xb9d5ff,0.2)
moonLight.position.set(0,4,-8)
moonLight.shadow.mapSize.width = 1024
moonLight.shadow.mapSize.height = 1024

moonLight.shadow.camera.near = 0
moonLight.shadow.camera.far = 26

moonLight.shadow.camera.top = 10
moonLight.shadow.camera.right = 10
moonLight.shadow.camera.bottom = - 10
moonLight.shadow.camera.left = - 10
moonLight.castShadow = true
scene.add(moonLight)


// Objects

// Floor

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20,20),
  new THREE.MeshStandardMaterial({
    map: floorColorTexture,
    aoMap: floorAmbientOcclusionTexture,
    displacementMap: floorHeightTexture,
    displacementScale: 0.1,
    normalMap: floorNormalTexture,
    roughnessMap: floorRoughnessTexture
  })
)
floor.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array,2)
)
floor.receiveShadow = true
floor.rotation.x = -Math.PI * 0.5
scene.add(floor)

// Seatings

const seating1 = new THREE.Group()
const seating2 = new THREE.Group()
seating1.position.z = 2
seating2.position.z = 2
scene.add(seating1,seating2)
seating1.position.y = 0.5
seating1.position.x = 1.5
seating2.position.y = 0.5
seating2.position.x = -1.5
for ( let i = 0 ; i < 2 ; i++){
  const standGeometry = new THREE.BoxGeometry(0.1,1,0.1)
  const steadMaterial = new THREE.MeshStandardMaterial({color:0xff00ff})
  const stand1 = new THREE.Mesh(
    standGeometry,
    steadMaterial
  )
  stand1.position.x = -1
  const stand2 = new THREE.Mesh(
    standGeometry,
    steadMaterial
  )
  stand2.position.x = 1
  const sittingPlate = new THREE.Mesh(
    new THREE.BoxGeometry(2.8,0.1,0.8),
    steadMaterial
  )
  sittingPlate.position.y = 0.5
  if (i == 0){
    seating1.add(stand1, stand2, sittingPlate)
  }else{
    seating2.add(stand1, stand2, sittingPlate)
  }
}

// Roof

const roof = new THREE.Group()
roof.position.z = 2
scene.add(roof)

const roofSideWallMaterial = new THREE.MeshStandardMaterial({color: 0xffaaff})
const roofSideWallGeometry = new THREE.BoxGeometry(0.2,4,2)
const leftWall = new THREE.Mesh(
  roofSideWallGeometry,
  roofSideWallMaterial
)
const rightWall = new THREE.Mesh(
  roofSideWallGeometry,
  roofSideWallMaterial
)
leftWall.position.y = 4/2
leftWall.position.x = -3.5
rightWall.position.y = 4/2
rightWall.position.x = 3.5
roof.add(leftWall)
roof.add(rightWall)

const roofBackWallMaterial = new THREE.MeshStandardMaterial({color: 0xffaaff})
const roofBackWallGeometry = new THREE.BoxGeometry(0.2,4,7.2)
const backWall = new THREE.Mesh(
  roofBackWallGeometry,
  roofBackWallMaterial
)
backWall.rotation.y = Math.PI * 0.5
backWall.position.z = -1
backWall.position.y = 4/2
backWall.castShadow = true
roof.add(backWall)

const roofTop = new THREE.Mesh(
  new THREE.BoxGeometry(8,0.2,2.7001),
  new THREE.MeshStandardMaterial({color:0xaa00bb})
)
roofTop.position.y = 4
roofTop.position.z = 0.25
roof.add(roofTop)

const lightBulb = new THREE.PointLight(0xff7d46,1,7)
lightBulb.intensity = 10
lightBulb.position.set(-0.15,2.9,2)
roof.add(lightBulb)


// Road

const road = new THREE.Mesh(
  new THREE.PlaneGeometry(6,20),
  new THREE.MeshStandardMaterial({
    map: roadsColorTexture,
    aoMap: roadsAmbientOcclusionTexture,
    displacementMap: roadsHeightTexture,
    displacementScale: 0.1,
    normalMap: roadsNormalTexture,
    roughnessMap: roadsRoughnessTexture
  })
)
road.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(road.geometry.attributes.uv.array,2)
)
road.rotation.x = -Math.PI * 0.5
road.rotation.z = Math.PI * 0.5
road.position.y = 0.01
road.position.z = 7
scene.add(road)

// BrickWall
const brickWall = new THREE.Group()
brickWall.position.z = -2
scene.add(brickWall)

const brickWallTexture = new THREE.MeshStandardMaterial({
  map: bricksColorTexture,
  aoMap: bricksAmbientOcclusionTexture,
  normalMap: bricksNormalTexture,
  roughnessMap: bricksRoughnessTexture
})


const rightBrickWall = new THREE.Mesh(
  new THREE.BoxGeometry(16,4,1),
  brickWallTexture
)
rightBrickWall.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(rightBrickWall.geometry.attributes.uv.array,2)
)

const leftBrickWall = new THREE.Mesh(
  new THREE.BoxGeometry(2,4,1),
  brickWallTexture
)
leftBrickWall.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(leftBrickWall.geometry.attributes.uv.array,2)
)
rightBrickWall.castShadow = true
leftBrickWall.castShadow = true
leftBrickWall.position.x = -9
leftBrickWall.position.y = 2
rightBrickWall.position.y = 2
rightBrickWall.position.x = 2
brickWall.add(leftBrickWall,rightBrickWall)

// Bush

const bush = new THREE.Group()
scene.add(bush)

const bushGeometry = new THREE.SphereGeometry(1,16,16)
const bushMaterial = new THREE.MeshStandardMaterial({color: 0x89c854})

const bush1 = new THREE.Mesh(bushGeometry,bushMaterial)
bush1.scale.set(0.8,0.8,0.8)

const bush2 = new THREE.Mesh(bushGeometry,bushMaterial)
bush2.scale.set(0.5,0.5,0.5)
bush2.position.x = 0.7

bush.position.set(-5.2,0.2,-1.4)
bush.add(bush1,bush2)

// Grave
const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxGeometry(1,1.5,0.2)
const graveMaterial = new THREE.MeshStandardMaterial({
  map: rockColorTexture,
  aoMap: rockAmbientOcclusionTexture,
  displacementMap: rockHeightTexture,
  displacementScale: 0.001,
  normalMap: rockNormalTexture,
  roughnessMap: rockRoughnessTexture
})


for (let i = 0 ; i < 20 ; i++){
  const grave = new THREE.Mesh(graveGeometry, graveMaterial)
  grave.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(grave.geometry.attributes.uv.array,2)
  )
  grave.castShadow = true
  grave.position.y = 0.6
  grave.position.z = (Math.random() * 6) - 9.6
  grave.position.x = (Math.random() - 0.5) * 18
  grave.rotation.y = (Math.random() - 0.5) * 0.4
  grave.rotation.z = (Math.random() - 0.5) * 0.4
  graves.add(grave)
}

// Render

const renderer = new THREE.WebGLRenderer({
  canvas:canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setClearColor(0x262837)
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const clock = new THREE.Clock()
let isLightOn = true;
let animate = true
const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  if (elapsedTime % 3 < 1.5) {
    if (!isLightOn) {
      lightBulb.intensity = 10; // Turn the light on
      isLightOn = true;
    }
  } else {
    if (isLightOn) {
      lightBulb.intensity = 0; // Turn the light off
      isLightOn = false;
    }
  }
  if (animate === true){
    camera.position.y = elapsedTime * 1.3
    camera.position.x = -elapsedTime * 1.3
    camera.position.z = 40 - (elapsedTime *  6)
    if (elapsedTime > 5){
        animate = false
    }
}

  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}

tick()

// Responsive

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  camera.aspect = sizes.width/sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
})