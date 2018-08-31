# Detect Passive Events

Detect if the browser supports passive event listeners.

[Live detection test][liveDetectionTest]

Exports a reference to a singleton object (a micro state machine with an update function) with its state set to if the browser supports passive event listeners, as well as an `update()` function which re-runs the tests and updates the object's state.

*Note that the code used in the detection is adapted from this [Passive Events Explainer][passiveExplainer].*


### `detectPassiveEvents` micro state machine
```javascript
const detectPassiveEvents = {
  hasSupport: boolean,

  // re-run the detection tests and update state
  update() {...},
}
```

### Installing `detect-passive-events`
```terminal
$ npm install detect-passive-events
```

### Using `detect-passive-events`
```javascript
import detectPassiveEvents from 'detect-passive-events';
```
```javascript
// passive events are supported by the browser
if (detectPassiveEvents.hasSupport === true) {
  // set listeners like this
  document.addEventListener('scroll', handleScroll, { capture: false, passive: true });
}

// passive events are not supported by the browser
if (detectPassiveEvents.hasSupport === false) {
  // set listeners like this
  document.addEventListener('scroll', handleScroll, false);
}

// updating the state - most apps won't need to use this at all
detectPassiveEvents.update();
```

Note that the `update()` function is run once at the time of import to set the object's initial state, and generally doesn't need to be run again. If it doesn't have access to the `window`, then the state will be `undefined` (`detect-passive-events` will not throw an error), and you will need to call the `update()` function manually at a later time to update its state.


### Part of the [`detect-it`][detectItRepo] family
- [`detect-it`][detectItRepo]
  - [`detect-hover`][detectHoverRepo]
  - [`detect-pointer`][detectPointerRepo]
  - [`detect-touch-events`][detectTouchEventsRepo]
  - **`detect-passive-events`**


<!-- links -->
[liveDetectionTest]: http://detect-it.rafrex.com/#detect-passive-events
[passiveExplainer]: https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
[detectItRepo]: https://github.com/rafrex/detect-it
[detectHoverRepo]: https://github.com/rafrex/detect-hover
[detectPointerRepo]: https://github.com/rafrex/detect-pointer
[detectTouchEventsRepo]: https://github.com/rafrex/detect-touch-events
