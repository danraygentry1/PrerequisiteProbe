/* show step by step what is happening to app state, and allow us to do things like
step back through the state, or even cancel a single state change in the middle of things.
It's really usefull to see how exactly your data is being mutated.
 */

import React from 'react';
// state monitoring functionality
import LogMonitor from 'redux-devtools-log-monitor';
// give us a handy place to display data
import DockMonitor from 'redux-devtools-dock-monitor';
import { createDevTools } from 'redux-devtools';

const DevTools = createDevTools(
  <DockMonitor
    toggleVisibilityKey="ctrl-h"
    changePositionKey="ctrl-q"
    defaultIsVisible={false}
  >
    <LogMonitor theme="tomorrow" />
  </DockMonitor>,
);

export default DevTools;
