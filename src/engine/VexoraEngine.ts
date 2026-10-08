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

  constructor(config: Partial<EngineConfig> = {}) {
    this.config = {
      worldSize: 200,
      maxRenderDistance: 150,
      shadowQuality: 1024,
      ...config,
    };

    // Initialize scene with sky color and fog
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb); // Sky blue
    this.scene.fog = new THREE.Fog(
      0x87ceeb,
      50,
      this.config.maxRenderDistance
    );

    // Setup camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 3, 10);

    // Setup renderer
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;

    // Attach to DOM
    const root = document.getElementById('canvas-root');
    root?.appendChild(this.renderer.domElement);

    // Setup world
    this.setupLighting();
    this.setupGround();
    this.spawnBlocksAroundOrigin();

    // Handle window resizing
    window.addEventListener('resize', () => this.handleResize());
  }

  private setupLighting() {
    // Ambient light for overall brightness
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    // Directional light (sun) for shadows and depth
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
    sunLight.position.set(50, 80, 30);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = this.config.shadowQuality;
    sunLight.shadow.mapSize.height = this.config.shadowQuality;
    sunLight.shadow.camera.far = 200;
    sunLight.shadow.camera.left = -100;
    sunLight.shadow.camera.right = 100;
    sunLight.shadow.camera.top = 100;
    sunLight.shadow.camera.bottom = -100;

    this.scene.add(sunLight);
  }

  private setupGround() {
    const groundSize = this.config.worldSize;
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(groundSize, groundSize),
      new THREE.MeshStandardMaterial({ 
        color: 0x2d5a3d,
        metalness: 0.1,
        roughness: 0.8,
      })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }

  private spawnBlocksAroundOrigin() {
    const blockColors = [
      0xff6b6b, // Red
      0x4ecdc4, // Teal
      0xffa500, // Orange
      0x6c5ce7, // Purple
      0xfdcb6e, // Yellow
    ];

    const blockCount = 12;
    const spawnRadius = 25;

    for (let i = 0; i < blockCount; i++) {
      const angle = (i / blockCount) * Math.PI * 2;
      const x = Math.cos(angle) * spawnRadius;
      const z = Math.sin(angle) * spawnRadius;

      const block = new THREE.Mesh(
        new THREE.BoxGeometry(2, 2, 2),
        new THREE.MeshStandardMaterial({
          color: blockColors[i % blockColors.length],
          metalness: 0.3,
          roughness: 0.5,
        })
      );

      block.position.set(x, 1, z);
      block.castShadow = true;
      block.receiveShadow = true;
      this.scene.add(block);
    }
  }

  public getScene(): THREE.Scene {
    return this.scene;
  }

  public getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  public update(_deltaTime: number): void {
    // Game logic updates go here
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
