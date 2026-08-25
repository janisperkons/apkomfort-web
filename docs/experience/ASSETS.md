# Māja — Higgsfield generation register

Rules (permanent):
1. Check this register BEFORE any generation. Never regenerate an existing asset.
2. A1 is the visual source of truth. Every later image is an EDIT of A1 (image_references), never a fresh generation.
3. Images before video. Video only when motion itself must be generated (currently: V1 only).
4. Preflight cost with `get_cost: true` before any video or batch.
5. Regenerate only for meaningful failures (wrong architecture, broken geometry, off-brief), never for taste-tweaks.
6. Budget ceiling for the whole project: 250 credits. Balance at project start: 609.5.

Cost reference (preflighted 2026-08-25): nano_banana_pro 4K image = 4 cr · seedance_2_0 8s 1080p std silent = 72 cr.

| ID | Asset | Model | Ref | Cr | Status | Job ID / file |
|----|-------|-------|-----|----|--------|---------------|
| A1 | Master property — dusk hero 16:9 4K (lit office corner window, discreet heat pump, driveway, garage, birch garden, pine forest) | nano_banana_pro | — | 4 | DONE — awaiting user sign-off | job 3c9904df-fb6b-46ec-ade1-3cc0167f3e89 · docs/experience/source/A1-master-dusk.png |
| A2 | Approach start frame — house glimpsed through forest from drive entrance | nano_banana_pro | A1 | 4 | planned | — |
| A3 | X-ray edit: plant room wall (boiler, manifolds, cylinder) | nano_banana_pro | A1 | 4 | planned | — |
| A4 | X-ray edit: bathroom facade | nano_banana_pro | A1 | 4 | planned | — |
| A5 | X-ray edit: underfloor heating loops (ground floor translucent) | nano_banana_pro | A1 | 4 | planned | — |
| A6 | X-ray edit: underground drainage soil cutaway | nano_banana_pro | A1 | 4 | planned | — |
| A7 | X-ray edit: roof/gutter rainwater highlight | nano_banana_pro | A1 | 4 | planned | — |
| A8 | X-ray edit: garden irrigation cutaway | nano_banana_pro | A1 | 4 | planned | — |
| A9 | X-ray edit: incoming water main cutaway | nano_banana_pro | A1 | 4 | planned | — |
| A10 | Whole-house X-ray cutaway (BIM grade) | nano_banana_pro | A1 | 4 | planned | — |
| A11 | Interior: katlu telpa | nano_banana_pro | A1 style | 4 | planned | — |
| A12 | Interior: vannas istaba | nano_banana_pro | A1 style | 4 | planned | — |
| A13 | Interior: virtuve | nano_banana_pro | A1 style | 4 | planned | — |
| A14 | Interior: birojs (contact room — timber desk, plans, window to woods) | nano_banana_pro | A1 style | 4 | planned | — |
| A15 | Office window night close-up (contact hover state) | nano_banana_pro | A1 | 4 | planned | — |
| V1 | The approach — forest → driveway → hero. 8s 1080p std silent, start_image=A2, end_image=A1. Ships as WebP frames only | seedance_2_0 | A2+A1 | 72 | planned | — |
| V2 | OPTIONAL signature room entry — only after V1 works and user opts in | seedance_2_0 | A1+A1x | 72 | deferred | — |

Spend log:
- 2026-08-25 · A1 master property · nano_banana_pro 4K · 4 cr · balance after ≈ 605.5
