export type SliderCrankState = {
  theta: number;
  omega: number;
  position: number;
  velocity: number;
  acceleration: number;
  rodAngle: number;
  crankPin: { x: number; y: number };
  slider: { x: number; y: number };
};

export type MotionSample = SliderCrankState & { angle: number };

export type EngineeringState = {
  displacement: number;
  inertiaForce: number;
  sideThrust: number;
  frictionForce: number;
  axialForce: number;
  crankTorque: number;
  clearanceRisk: number;
};

export const degToRad = (degrees: number) => (degrees * Math.PI) / 180;
export const radToDeg = (radians: number) => (radians * 180) / Math.PI;
export const rpmToOmega = (rpm: number) => (rpm * 2 * Math.PI) / 60;

export function solveSliderCrank(r: number, length: number, angleDegrees: number, rpm: number): SliderCrankState {
  if (length <= r) throw new Error('Connecting rod length must exceed crank radius.');
  const theta = degToRad(angleDegrees);
  const omega = rpmToOmega(rpm);
  const sin = Math.sin(theta);
  const cos = Math.cos(theta);
  const root = Math.sqrt(length ** 2 - r ** 2 * sin ** 2);
  const position = r * cos + root;
  const dxDTheta = -r * sin - (r ** 2 * sin * cos) / root;
  const d2xDTheta2 = -r * cos - r ** 2 * ((cos ** 2 - sin ** 2) / root + (r ** 2 * sin ** 2 * cos ** 2) / root ** 3);
  const crankPin = { x: r * cos, y: r * sin };
  const slider = { x: position, y: 0 };
  return { theta, omega, position, velocity: dxDTheta * omega, acceleration: d2xDTheta2 * omega ** 2, rodAngle: Math.atan2(-crankPin.y, slider.x - crankPin.x), crankPin, slider };
}

export function createMotionProfile(r: number, length: number, rpm: number) {
  return Array.from({ length: 181 }, (_, index): MotionSample => {
    const angle = index * 2;
    return { angle, ...solveSliderCrank(r, length, angle, rpm) };
  });
}

export function normalizedDisplacement(r: number, ratio: number, angle: number) {
  const length = r * ratio;
  const x = solveSliderCrank(r, length, angle, 1).position;
  return (x - (length - r)) / (2 * r);
}

export function solveEngineeringState(r: number, length: number, angle: number, rpm: number, load: number, movingMass: number, friction: number, clearance: number): EngineeringState {
  const state = solveSliderCrank(r, length, angle, rpm);
  const displacement = state.position - (length - r);
  const inertiaForce = movingMass * state.acceleration / 1000;
  const axialBeforeFriction = load + inertiaForce;
  const sideThrust = Math.abs(axialBeforeFriction * Math.tan(state.rodAngle));
  const frictionForce = friction * sideThrust;
  const direction = Math.sign(state.velocity) || 1;
  const axialForce = axialBeforeFriction + direction * frictionForce;
  const transmissionRate = state.omega === 0 ? 0 : state.velocity / state.omega;
  const crankTorque = Math.abs(axialForce * transmissionRate / 1000);
  const clearanceRisk = Math.min(100, clearance * rpm * (1 + Math.abs(state.acceleration) / 5000));
  return { displacement, inertiaForce, sideThrust, frictionForce, axialForce, crankTorque, clearanceRisk };
}
