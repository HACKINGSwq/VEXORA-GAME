import * as THREE from 'three';

interface EngineConfig {
  worldSize: number;
  maxRenderDistance: number;
  shadowQuality: number;
}

export class VexoraEngine {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private config: EngineConfig;
  private worldGroup: THREE.Group;

  constructor(config: Partial<EngineConfig> = {}) {
    this.config = {
      worldSize: 200,
      maxRenderDistance: 180,
      shadowQuality: 2048,
      ...config,
    };

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x8ec9ff);
    this.scene.fog = new THREE.Fog(0x8ec9ff, 30, this.config.maxRenderDistance);

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 3.5, 9);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    this.worldGroup = new THREE.Group();
    this.scene.add(this.worldGroup);

    const root = document.getElementById('canvas-root');
    root?.appendChild(this.renderer.domElement);

    this.setupAtmosphere();
    this.setupLights();
    this.setupGround();
    this.createDecorativeBlocks();
    this.createFloatingCrystals();

    window.addEventListener('resize', () => this.handleResize());
  }

  private setupAtmosphere() {
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(8, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0xfff1a8,
        transparent: true,
        opacity: 0.9,
      })
    );
    sun.position.set(-38, 30, -30);
    this.scene.add(sun);

    const cloudMaterial = new THREE.MeshStandardMaterial({
      color: 0xf4fbff,
      transparent: true,
      opacity: 0.8,
    });

    for (let i = 0; i < 7; i += 1) {
      const cloud = new THREE.Mesh(
        new THREE.SphereGeometry(3 + i * 0.35, 24, 24),
        cloudMaterial
      );
      cloud.position.set(
        -20 + i * 8,
        16 + (i % 3) * 2,
        -25 - (i % 2) * 6
      );
      cloud.scale.setScalar(1.5 + (i % 3) * 0.25);
      this.scene.add(cloud);
    }
  }

  private setupLights() {
    const ambient = new THREE.HemisphereLight(0xdaf7ff, 0x18392b, 1.2);
    this.scene.add(ambient);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.35);
    sunLight.position.set(40, 55, 18);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = this.config.shadowQuality;
    sunLight.shadow.mapSize.height = this.config.shadowQuality;
    sunLight.shadow.camera.left = -120;
    sunLight.shadow.camera.right = 120;
    sunLight.shadow.camera.top = 120;
    sunLight.shadow.camera.bottom = -120;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 220;
    this.scene.add(sunLight);
  }

  private setupGround() {
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(this.config.worldSize, this.config.worldSize),
      new THREE.MeshStandardMaterial({
        color: 0x1d5d39,
        roughness: 0.85,
        metalness: 0.1,
      })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.worldGroup.add(ground);

    const grid = new THREE.GridHelper(this.config.worldSize, 28, 0x7dd3fc, 0x1c3a32);
    grid.position.y = 0.04;
    grid.material.opacity = 0.35;
    grid.material.transparent = true;
    this.worldGroup.add(grid);
  }

  private createDecorativeBlocks() {
    const palette = [0xff6b6b, 0x4ecdc4, 0xf7b267, 0x8ecae6, 0xf4d35e, 0xa78bfa];

    for (let i = 0; i < 16; i += 1) {
      const angle = (i / 16) * Math.PI * 2;
      const radius = 20 + (i % 3) * 6;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const height = 1.5 + (i % 4) * 0.8;

      const block = new THREE.Mesh(
        new THREE.BoxGeometry(2.5, height, 2.5),
        new THREE.MeshStandardMaterial({
          color: palette[i % palette.length],
          roughness: 0.7,
          metalness: 0.2,
        })
      );

      block.position.set(x, height / 2, z);
      block.castShadow = true;
      block.receiveShadow = true;
      this.worldGroup.add(block);
    }
  }

  private createFloatingCrystals() {
    const crystalMaterial = new THREE.MeshStandardMaterial({
      color: 0x67e8f9,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.35,
      roughness: 0.25,
      metalness: 0.5,
    });

    for (let i = 0; i < 8; i += 1) {
      const crystal = new THREE.Mesh(
        new THREE.OctahedronGeometry(1.2 + (i % 3) * 0.3, 0),
        crystalMaterial
      );

      const angle = (i / 8) * Math.PI * 2;
      const radius = 10 + i * 1.6;
      crystal.position.set(
        Math.cos(angle) * radius,
        3.5 + (i % 4) * 1.3,
        Math.sin(angle) * radius
      );
      crystal.rotation.set(i, i * 0.6, i * 0.8);
      crystal.castShadow = true;
      this.worldGroup.add(crystal);
    }
  }

  public getScene(): THREE.Scene {
    return this.scene;
  }

  public getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  public update(_deltaTime: number): void {
    // Engine-level updates can be added here later
  }

  public render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  private handleResize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
}
