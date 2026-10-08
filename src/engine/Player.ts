import * as THREE from 'three';

export class PlayerController {
  private body: THREE.Mesh;
  private camera: THREE.PerspectiveCamera;
  private velocity = new THREE.Vector3();
  private yaw = 0;
  private pitch = 0;
  private grounded = true;

  constructor(scene: THREE.Scene) {
    const bodyGeo = new THREE.BoxGeometry(1, 2, 1);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x00e5ff });
    this.body = new THREE.Mesh(bodyGeo, bodyMat);
    this.body.position.set(0, 2, 0);
    this.body.castShadow = true;
    this.body.receiveShadow = true;
    scene.add(this.body);

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 1.6, 0);
    this.camera.rotation.order = 'YXZ';
    this.body.add(this.camera);
  }

  public update(input: Record<string, boolean>, delta: number) {
    const move = new THREE.Vector3();
    const forward = new THREE.Vector3(Math.sin(this.yaw), 0, Math.cos(this.yaw));
    const right = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));

    if (input.w) move.add(forward);
    if (input.s) move.sub(forward);
    if (input.a) move.sub(right);
    if (input.d) move.add(right);

    if (move.lengthSq() > 0) {
      move.normalize().multiplyScalar(10);
      this.body.position.x += move.x * delta;
      this.body.position.z += move.z * delta;
    }

    this.velocity.y -= 18 * delta;

    if (input.space && this.grounded) {
      this.velocity.y = 8;
      this.grounded = false;
    }

    this.body.position.y += this.velocity.y * delta;

    if (this.body.position.y <= 2) {
      this.body.position.y = 2;
      this.velocity.y = 0;
      this.grounded = true;
    }

    const maxDist = 40;
    const dist = Math.hypot(this.body.position.x, this.body.position.z);
    if (dist > maxDist) {
      const angle = Math.atan2(this.body.position.z, this.body.position.x);
      this.body.position.x = Math.cos(angle) * maxDist;
      this.body.position.z = Math.sin(angle) * maxDist;
    }
  }

  public onMouseMove(movementX: number, movementY: number) {
    const sensitivity = 0.002;
    this.yaw -= movementX * sensitivity;
    this.pitch -= movementY * sensitivity;
    this.pitch = THREE.MathUtils.clamp(this.pitch, -1.4, 1.4);

    this.camera.rotation.y = this.yaw;
    this.camera.rotation.x = this.pitch;
  }

  public getPosition() {
    return this.body.position.clone();
  }
}
