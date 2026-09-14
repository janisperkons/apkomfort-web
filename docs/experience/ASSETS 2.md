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
| A1 | Master property — dusk hero (scene: fasāde) | nano_banana_pro | — | 4 | DONE — USER APPROVED | job 3c9904df · source/A1-master-dusk.png |
| A16 | Scene: no dārza puses (right three-quarter, office + heat pump) | nano_banana_pro | A1 | 4 | DONE | job ba1d4c95 · source/A16-sani.png |
| A17 | Scene: no augšas (elevated, roof + site) | nano_banana_pro | A1 | 4 | DONE | job 89e6a478 · source/A17-gaiss.png |
| A18 | Scene: zem zemes (ground cutaway — foul tank, storm tank, chambers, water main) | nano_banana_pro | A1 | 4 | DONE | job f1367d46 · source/A18-pazeme.png |
| A19 | Interior: katlu telpa | nano_banana_pro | A1 | ~3 | DONE | job 2c0e6a43 · source/A19-katlu.png |
| A20 | Interior: vannas istaba | nano_banana_pro | A1 | ~3 | DONE | job a50ffddd · source/A20-vanna.png |
| A21 | Interior: virtuve | nano_banana_pro | A1 | ~3 | DONE | job b2e6171d · source/A21-virtuve.png |
| A22 | Interior: birojs (contact room) | nano_banana_pro | A1 | ~3 | DONE | job e8353784 · source/A22-birojs.png |
| A23 | Interior: dzīvojamā istaba (radiatori) | nano_banana_pro | A1 | ~3 | DONE | job 45c1d709 · source/A23-dzivojama.png |
| A24 | Interior: siltās grīdas ieklāšana | nano_banana_pro | A1 | ~3 | DONE | job c7c55729 · source/A24-gridas.png |
| V1 | (dropped — V1 scroll-film concept rejected by user 2026-08-25; V2 is still-scene angle transitions in code) | — | — | 0 | dropped | — |
| V2 | OPTIONAL signature room entry — only after V1 works and user opts in | seedance_2_0 | A1+A1x | 72 | deferred | — |

Spend log:
- 2026-08-25 · A1 master property · nano_banana_pro 4K · 4 cr
- 2026-08-25 · A16–A24 batch (3 scenes 4K + 6 interiors 2K) · 24 cr
- TOTAL PROJECT SPEND: 28 cr · balance 581.5 · ceiling 250
