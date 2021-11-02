class DegRadHelper {
  constructor(obj, prop) {
    this.obj = obj;
    this.prop = prop;
  }
  get value() {
    return THREE.MathUtils.radToDeg(this.obj[this.prop]);
  }
  set value(v) {
    this.obj[this.prop] = THREE.MathUtils.degToRad(v);
  }
}

class StringToNumberHelper {
  constructor(obj, prop) {
    this.obj = obj;
    this.prop = prop;
  }
  get value() {
    return this.obj[this.prop];
  }
  set value(v) {
    this.obj[this.prop] = parseFloat(v);
  }
}

const wrapModes = {
  ClampToEdgeWrapping: THREE.ClampToEdgeWrapping,
  RepeatWrapping: THREE.RepeatWrapping,
  MirroredRepeatWrapping: THREE.MirroredRepeatWrapping,
};

export { DegRadHelper, StringToNumberHelper, wrapModes };
