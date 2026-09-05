# Slider–Crank Motion Playground

An interactive Three.js engineering simulator where the 3D assembly, orthographic SVG views, numerical metrics, and motion charts all use the same exact slider-crank kinematic model.

## Run locally

```bash
npm install
npm run dev
```

For a production check, run `npm run build`.

## Kinematic model

```text
x = r cos(θ) + √(L² − r² sin²(θ))
ω = RPM · 2π / 60
v = dx/dθ · ω
a = d²x/dθ² · ω²
stroke = 2r
```

The implementation uses analytic first and second derivatives in `mechanics/sliderCrank.ts`. The `L > r` constraint is enforced by the controls. Geometry changes immediately recompute the mechanism, metrics, and all 0–360° profiles.

The mechanism panel includes synchronized main, left-side, top, and right-side views. Every view consumes the same solved crank-pin and slider coordinates used by the metrics and charts.

The main view is a product-style WebGL assembly built with Three.js. Drag to orbit, scroll to zoom, or switch between perspective, left, right, and top camera presets.
