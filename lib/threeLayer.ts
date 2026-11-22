import * as THREE from "three"

export interface Landmark3D {
  id: string
  name: string
  coords: [number, number]
  color: number
  height: number
}

export const KATRAJ_LANDMARKS: Landmark3D[] = [
  {
    id: "katraj-zoo",
    name: "Rajiv Gandhi Zoo & Snake Park",
    coords: [73.8566, 18.4552],
    color: 0x10b981, // Emerald Green
    height: 450,
  },
  {
    id: "katraj-dairy",
    name: "Katraj Dairy",
    coords: [73.843, 18.457],
    color: 0x3b82f6, // Royal Blue
    height: 420,
  },
  {
    id: "katraj-lake",
    name: "Katraj Lake & Garden",
    coords: [73.858, 18.459],
    color: 0x06b6d4, // Cyan
    height: 380,
  },
  {
    id: "bharati-vidyapeeth",
    name: "Bharati Vidyapeeth Campus",
    coords: [73.8512, 18.4519],
    color: 0xf59e0b, // Amber Gold
    height: 480,
  },
]

// Procedural 3D buildings around Katraj Chowk & Pune-Satara Road
const KATRAJ_BUILDINGS: { coords: [number, number]; w: number; l: number; h: number }[] = [
  { coords: [73.8520, 18.4545], w: 70, l: 50, h: 90 },
  { coords: [73.8535, 18.4560], w: 85, l: 60, h: 120 },
  { coords: [73.8505, 18.4530], w: 60, l: 70, h: 75 },
  { coords: [73.8540, 18.4520], w: 90, l: 65, h: 110 },
  { coords: [73.8480, 18.4565], w: 80, l: 55, h: 85 },
  { coords: [73.8465, 18.4580], w: 75, l: 60, h: 95 },
  { coords: [73.8550, 18.4575], w: 65, l: 75, h: 130 },
  { coords: [73.8495, 18.4510], w: 80, l: 80, h: 105 },
]

export function createThreeJsLandmarkLayer(maplibregl: any) {
  let camera: THREE.Camera
  let scene: THREE.Scene
  let renderer: THREE.WebGLRenderer
  const animatedMeshes: { pin: THREE.Mesh; ring: THREE.Mesh; col: THREE.Mesh }[] = []
  let active = false
  let parentMap: any = null

  return {
    id: "threejs-landmarks-3d",
    type: "custom" as const,
    renderingMode: "3d" as const,

    setActive(isEnabled: boolean) {
      active = isEnabled
      if (parentMap) {
        parentMap.triggerRepaint()
      }
    },

    onAdd(map: any, gl: WebGLRenderingContext) {
      parentMap = map
      try {
        camera = new THREE.Camera()
        scene = new THREE.Scene()

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.2)
        scene.add(ambientLight)

        const dirLight = new THREE.DirectionalLight(0xffffff, 1.5)
        dirLight.position.set(0, -100, 200).normalize()
        scene.add(dirLight)

        const MercatorClass =
          maplibregl?.MercatorCoordinate ||
          (window as any)?.maplibregl?.MercatorCoordinate

        if (MercatorClass) {
          // 1. Add 3D Landmarks with Soaring Beacons
          KATRAJ_LANDMARKS.forEach((landmark) => {
            const mercator = MercatorClass.fromLngLat(landmark.coords, 0)
            const scale = mercator.meterInMercatorCoordinateUnits()
            const h = landmark.height * scale

            // A. Soaring Light Pillar (Ground to sky)
            const colGeo = new THREE.CylinderGeometry(15 * scale, 25 * scale, h, 16)
            const colMat = new THREE.MeshBasicMaterial({
              color: landmark.color,
              transparent: true,
              opacity: 0.55,
            })
            const col = new THREE.Mesh(colGeo, colMat)
            col.rotation.x = Math.PI / 2
            col.position.set(mercator.x, mercator.y, mercator.z + h / 2)
            scene.add(col)

            // B. Giant Rotating Crystal Diamond
            const pinGeo = new THREE.OctahedronGeometry(50 * scale, 0)
            const pinMat = new THREE.MeshStandardMaterial({
              color: landmark.color,
              roughness: 0.1,
              metalness: 0.9,
              emissive: landmark.color,
              emissiveIntensity: 0.6,
            })
            const pin = new THREE.Mesh(pinGeo, pinMat)
            pin.position.set(mercator.x, mercator.y, mercator.z + h + 25 * scale)
            scene.add(pin)

            // C. Pulsing Ground Shockwave Ring
            const ringGeo = new THREE.RingGeometry(40 * scale, 120 * scale, 32)
            const ringMat = new THREE.MeshBasicMaterial({
              color: landmark.color,
              side: THREE.DoubleSide,
              transparent: true,
              opacity: 0.7,
            })
            const ring = new THREE.Mesh(ringGeo, ringMat)
            ring.position.set(mercator.x, mercator.y, mercator.z + 2 * scale)
            scene.add(ring)

            animatedMeshes.push({ pin, ring, col })
          })

          // 2. Add 3D Extruded Buildings in Katraj
          KATRAJ_BUILDINGS.forEach((b) => {
            const mercator = MercatorClass.fromLngLat(b.coords, 0)
            const scale = mercator.meterInMercatorCoordinateUnits()
            const bGeo = new THREE.BoxGeometry(b.w * scale, b.l * scale, b.h * scale)
            const bMat = new THREE.MeshStandardMaterial({
              color: 0x334155,
              roughness: 0.3,
              metalness: 0.7,
            })
            const building = new THREE.Mesh(bGeo, bMat)
            building.position.set(mercator.x, mercator.y, mercator.z + (b.h * scale) / 2)
            scene.add(building)

            // Glowing rooftop edge
            const roofGeo = new THREE.BoxGeometry((b.w + 4) * scale, (b.l + 4) * scale, 6 * scale)
            const roofMat = new THREE.MeshBasicMaterial({ color: 0xf97316 })
            const roof = new THREE.Mesh(roofGeo, roofMat)
            roof.position.set(mercator.x, mercator.y, mercator.z + b.h * scale)
            scene.add(roof)
          })
        }

        renderer = new THREE.WebGLRenderer({
          canvas: map.getCanvas(),
          context: gl,
          antialias: true,
        })
        renderer.autoClear = false
      } catch (err) {
        console.error("Three.js onAdd init error:", err)
      }
    },

    render(gl: WebGLRenderingContext, matrix: number[]) {
      if (!active) return

      try {
        const time = performance.now() * 0.002
        animatedMeshes.forEach(({ pin, ring }, i) => {
          pin.rotation.z += 0.03
          pin.rotation.y += 0.02

          const pulse = 1 + Math.sin(time + i * 1.5) * 0.35
          ring.scale.set(pulse, pulse, 1)
          ;(ring.material as THREE.MeshBasicMaterial).opacity = Math.max(
            0.15,
            0.8 - pulse * 0.35
          )
        })

        camera.projectionMatrix = new THREE.Matrix4().fromArray(matrix)

        if (renderer?.state?.reset) {
          renderer.state.reset()
        }

        renderer.render(scene, camera)

        if (parentMap && active) {
          parentMap.triggerRepaint()
        }
      } catch (err) {
        console.error("Three.js render error:", err)
      }
    },
  }
}
