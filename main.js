import "./style.css"
import * as THREE from 'three'

// Setup

const canvas = document.querySelector("canvas.webgl")

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 0.1,100)
scene.add(camera)




// Render

const renderer = new THREE.WebGLRenderer({
  canvas:canvas
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const clock = new THREE.Clock()
const tick = () => {
  const elapsedTime = clock.getElapsedTime()
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