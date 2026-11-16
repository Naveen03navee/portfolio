/**
 * @file clients/portfolio/src/data/splineRoute.ts
 * @description Authoritative mathematical continuous road route spline for the extended 1,050m urban journey.
 */

import * as THREE from 'three';

export const SPLINE_CONTROL_POINTS: readonly THREE.Vector3[] = [
  new THREE.Vector3(0.0, 0.0, 25.0),      // 0. Approach run-up
  new THREE.Vector3(0.0, 0.0, 0.0),       // 1. Location 1: Gateway start (0m)
  new THREE.Vector3(1.5, 0.3, -75.0),     // 2. Gateway portal arch (75m)
  new THREE.Vector3(5.0, 0.8, -150.0),    // 3. Location 1 exit / Innovation Blvd entry (150m)
  new THREE.Vector3(14.0, 1.8, -225.0),   // 4. Location 2: Innovation Blvd center - MCA Display (225m)
  new THREE.Vector3(22.0, 2.8, -300.0),   // 5. Innovation Blvd exit - BCA Display (300m)
  new THREE.Vector3(14.0, 4.0, -360.0),   // 6. Location 3: Tech District entry - AI & Backend Pylons (360m)
  new THREE.Vector3(-4.0, 5.2, -415.0),   // 7. Tech District center - 92m Tower, Frontend & DB (415m)
  new THREE.Vector3(-20.0, 6.4, -470.0),  // 8. Tech District exit - Cloud & Infra Pylons (470m)
  new THREE.Vector3(-24.0, 7.4, -530.0),  // 9. Location 4: Project Pavilion 1 - PDF-Chatter (530m)
  new THREE.Vector3(-16.0, 8.4, -590.0),  // 10. Project Pavilion 2 - Smart QR Attendance (590m)
  new THREE.Vector3(0.0, 9.4, -650.0),    // 11. Project Pavilion 3 - AI Recipe Engine (650m)
  new THREE.Vector3(16.0, 10.2, -700.0),  // 12. Project Pavilion 4 - J.A.R.V.I.S. (700m)
  new THREE.Vector3(20.0, 10.8, -775.0),  // 13. Location 5: Engineering Campus entry - Decembay Avenue (775m)
  new THREE.Vector3(10.0, 11.4, -850.0),  // 14. Decembay Headquarters Timeline (850m)
  new THREE.Vector3(0.0, 12.0, -920.0),   // 15. Location 6: Skyline Destination Ascent (920m)
  new THREE.Vector3(0.0, 12.0, -990.0),   // 16. Skyline Grand Arrival Plaza & Fountain (990m)
  new THREE.Vector3(0.0, 12.2, -1050.0),  // 17. Monumental Presentation Wall (1050m)
  new THREE.Vector3(0.0, 12.2, -1080.0),  // 18. Skyline Overlook boundary (1080m)
];

export function createAuthoritativeRouteCurve(): THREE.CatmullRomCurve3 {
  const curve = new THREE.CatmullRomCurve3(
    [...SPLINE_CONTROL_POINTS],
    false, // Closed = false (one continuous road route from Gateway to Skyline)
    'catmullrom',
    0.5 // Centripetal parameter for smooth curvature without loops
  );
  return curve;
}
