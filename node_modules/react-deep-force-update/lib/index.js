'use strict';

exports.__esModule = true;
exports['default'] = getForceUpdate;
function traverseRenderedChildren(internalInstance, callback, argument) {
  callback(internalInstance, argument);

  if (internalInstance._renderedComponent) {
    traverseRenderedChildren(internalInstance._renderedComponent, callback, argument);
  } else {
    for (var key in internalInstance._renderedChildren) {
      if (internalInstance._renderedChildren.hasOwnProperty(key)) {
        traverseRenderedChildren(internalInstance._renderedChildren[key], callback, argument);
      }
    }
  }
}

function setPendingForceUpdate(internalInstance) {
  if (internalInstance._pendingForceUpdate === false) {
    internalInstance._pendingForceUpdate = true;
  }
}

function forceUpdateIfPending(internalInstance, React) {
  if (internalInstance._pendingForceUpdate === true) {
    var publicInstance = internalInstance._instance;
    React.Component.prototype.forceUpdate.call(publicInstance);
  }
}

function deepForceUpdateStack(instance, React) {
  var internalInstance = instance._reactInternalInstance;
  traverseRenderedChildren(internalInstance, setPendingForceUpdate);
  traverseRenderedChildren(internalInstance, forceUpdateIfPending, React);
}

function deepForceUpdate(instance, React) {
  var root = instance._reactInternalFiber || instance._reactInternalInstance;
  if (typeof root.tag !== 'number') {
    // Traverse stack-based React tree.
    return deepForceUpdateStack(instance, React);
  }

  var node = root;
  while (true) {
    if (node.stateNode !== null && typeof node.type === 'function') {
      var publicInstance = node.stateNode;
      var updater = publicInstance.updater;

      if (typeof publicInstance.forceUpdate === 'function') {
        publicInstance.forceUpdate();
      } else if (updater && typeof updater.enqueueForceUpdate === 'function') {
        updater.enqueueForceUpdate(publicInstance);
      }
    }
    if (node.child) {
      node.child['return'] = node;
      node = node.child;
      continue;
    }
    if (node === root) {
      return undefined;
    }
    while (!node.sibling) {
      if (!node['return'] || node['return'] === root) {
        return undefined;
      }
      node = node['return'];
    }
    node.sibling['return'] = node['return'];
    node = node.sibling;
  }
}

function getForceUpdate(React) {
  return function (instance) {
    deepForceUpdate(instance, React);
  };
}

module.exports = exports['default'];