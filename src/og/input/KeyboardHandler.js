/**
 * @module og/input/KeyboardHandler
 */

"use strict";

import { input } from "./input.js";

/**
 * @class
 */
class KeyboardHandler {
    constructor() {
        this._currentlyPressedKeys = {};
        this._pressedKeysCallbacks = {};
        this._unpressedKeysCallbacks = {};
        this._charkeysCallbacks = {};
        this._that = this;
        this._anykeyCallback = null;
        this._event = null;
        this._active = true;

        if (KeyboardHandler.prototype._instance) {
            return KeyboardHandler.prototype._instance;
        } else {
            KeyboardHandler.prototype._instance = this;

            document.onkeydown((event) => {
                _event = event;
                _active && _that.handleKeyDown();
            });
            document.onkeyup((event) => {
                _event = event;
                _active && _that.handleKeyUp();
            });
        }
    }

    _sortByPriority(a, b) {
        return a.priority < b.priority;
    }

    /**
     * @todo todo
     */
    removeEvent(events, callback) {
        //
        // TODO:...
        //
    }

    setActivity(activity) {
        _active = activity;
    }

    releaseKeys() {
        _currentlyPressedKeys = {};
    }

    addEvent(event, sender, callback, keyCode, priority) {
        if (priority === undefined) {
            priority = 1600;
        }
        switch (event) {
            case "keyfree":
                if (!_unpressedKeysCallbacks[keyCode]) {
                    _unpressedKeysCallbacks[keyCode] = [];
                }
                _unpressedKeysCallbacks[keyCode].push({
                    callback: callback,
                    sender: sender,
                    priority: priority
                });
                _unpressedKeysCallbacks[keyCode].sort(_sortByPriority);
                break;

            case "keypress":
                if (keyCode == null) {
                    _anykeyCallback = { callback: callback, sender: sender || _that };
                } else {
                    if (!_pressedKeysCallbacks[keyCode]) {
                        _pressedKeysCallbacks[keyCode] = [];
                    }
                    _pressedKeysCallbacks[keyCode].push({
                        callback: callback,
                        sender: sender,
                        priority: priority
                    });
                    _pressedKeysCallbacks[keyCode].sort(_sortByPriority);
                }
                break;

            case "charkeypress":
                if (!_charkeysCallbacks[keyCode]) {
                    _charkeysCallbacks[keyCode] = [];
                }
                _charkeysCallbacks[keyCode].push({
                    callback: callback,
                    sender: sender,
                    priority: priority
                });
                _charkeysCallbacks[keyCode].sort(_sortByPriority);
                break;
        }
    }

    isKeyPressed(keyCode) {
        return _currentlyPressedKeys[keyCode];
    }

    handleKeyDown() {
        _anykeyCallback && _anykeyCallback.callback.call(_anykeyCallback.sender, _event);
        _currentlyPressedKeys[_event.keyCode] = true;
        for (var ch in _charkeysCallbacks) {
            if (String.fromCharCode(_event.keyCode) == String.fromCharCode(ch)) {
                var ccl = _charkeysCallbacks[ch];
                for (var i = 0; i < ccl.length; i++) {
                    ccl[i].callback.call(ccl[i].sender, _event);
                }
            }
        }

        if (_event.keyCode == input.KEY_ALT || _event.keyCode == input.KEY_SHIFT) {
            _event.preventDefault();
        }
    }

    handleKeyUp() {
        if (_currentlyPressedKeys[_event.keyCode] || _event.keyCode === input.KEY_PRINTSCREEN) {
            for (var pk in _unpressedKeysCallbacks) {
                if (
                    _currentlyPressedKeys[pk] ||
                    (_event.keyCode === input.KEY_PRINTSCREEN && pk == input.KEY_PRINTSCREEN)
                ) {
                    var cpk = _unpressedKeysCallbacks[pk];
                    for (var i = 0; i < cpk.length; i++) {
                        cpk[i].callback.call(cpk[i].sender, _event);
                    }
                }
            }
        }
        _currentlyPressedKeys[_event.keyCode] = false;
    }

    handleEvents() {
        for (var pk in _pressedKeysCallbacks) {
            if (_currentlyPressedKeys[pk]) {
                var cpk = _pressedKeysCallbacks[pk];
                for (var i = 0; i < cpk.length; i++) {
                    cpk[i].callback.call(cpk[i].sender, _event);
                }
            }
        }
    }
}

export { KeyboardHandler };
