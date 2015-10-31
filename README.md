## Barista Slot Machine

The application uses reactjs for views updates, and no other javascript libraries. Animations are CSS.

For a basic overview, a "reel" is seeded with a few options and from there extended out to a configurable number of items per reel. The reel distribution is randomized from the initial seed. Spinning the reel adds additional reels to the end of the visible reel for the effect, then cleans up the excess after the animation completes.

Debug view can be toggled on/off.
### install
1.  `sudo npm install`
2.  `sudo npm run build` (skip this step if build is included)
3.  `npm run serve`


### Relevant Files
- app/app.jsx
- app/reel.jsx
- dist/app.css

### TODO
1. More browser support (modern browsers only)
2. CSS compiler (static files right now)
3. Make reel spin return a promise for better message timing
4. Show winning probablilities based on type distribution after randomly populating a reel of `n` size
5. Landing on either the first or last element in a reel leaves a blank