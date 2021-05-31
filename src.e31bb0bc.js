// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/regenerator-runtime/runtime.js":[function(require,module,exports) {
var define;
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}

},{}],"../node_modules/@rackai/domql/src/element/nodes.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  root: ['body', 'html'],
  head: ['title', 'base', 'meta', 'style'],
  body: ['string', 'fragment', 'a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio', 'b', 'basefont', 'bdi', 'bdo', 'big', 'blockquote', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'frame', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hr', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'meter', 'nav', 'noframes', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strike', 'strong', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr', // SVG
  'svg', 'path']
};
exports.default = _default;
},{}],"../node_modules/@rackai/domql/src/utils/object.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.flattenRecursive = exports.mergeAndCloneIfArray = exports.mergeArray = exports.mergeIfExisted = exports.overwriteDeep = exports.overwrite = exports.deepClone = exports.clone = exports.deepMerge = exports.merge = exports.map = exports.exec = exports.isObjectLike = exports.isArray = exports.isFunction = exports.isNumber = exports.isString = exports.isObject = void 0;

const isObject = arg => {
  if (arg === null) return false;
  return typeof arg === 'object' && arg.constructor === Object;
};

exports.isObject = isObject;

const isString = arg => typeof arg === 'string';

exports.isString = isString;

const isNumber = arg => typeof arg === 'number';

exports.isNumber = isNumber;

const isFunction = arg => typeof arg === 'function';

exports.isFunction = isFunction;

const isArray = arg => Array.isArray(arg);

exports.isArray = isArray;

const isObjectLike = arg => {
  if (arg === null) return false; // if (isArray(arg)) return false

  return typeof arg === 'object';
};

exports.isObjectLike = isObjectLike;

const exec = (param, element) => {
  if (!element) console.error('No element for', param);
  if (isFunction(param)) return param(element, element.state);
  return param;
};

exports.exec = exec;

const map = (obj, extention, element) => {
  for (const e in extention) {
    obj[e] = exec(extention[e], element);
  }
};

exports.map = map;

const merge = (element, obj) => {
  for (const e in obj) {
    const elementProp = element[e];
    const objProp = obj[e];

    if (elementProp === undefined) {
      element[e] = objProp;
    }
  }

  return element;
};

exports.merge = merge;

const deepMerge = (element, proto) => {
  for (const e in proto) {
    const elementProp = element[e];
    const protoProp = proto[e];
    if (e === 'parent') continue;

    if (elementProp === undefined) {
      element[e] = protoProp;
    } else if (isObject(elementProp) && isObject(protoProp)) {
      deepMerge(elementProp, protoProp);
    }
  }

  return element;
};

exports.deepMerge = deepMerge;

const clone = obj => {
  const o = {};

  for (const prop in obj) {
    if (prop === 'node') continue;
    o[prop] = obj[prop];
  }

  return o;
};
/**
 * Deep cloning of object
 */


exports.clone = clone;

const deepClone = (obj, excluding = ['parent', 'node']) => {
  const o = {};

  for (const prop in obj) {
    if (excluding.indexOf(prop) > -1) continue;
    let objProp = obj[prop];
    if (prop === 'proto' && isArray(objProp)) objProp = mergeArray(objProp);
    if (isObjectLike(objProp)) o[prop] = deepClone(objProp);else o[prop] = objProp;
  }

  return o;
};
/**
 * Overwrites object properties with another
 */


exports.deepClone = deepClone;

const overwrite = (element, params, options) => {
  const changes = {};

  for (const e in params) {
    const elementProp = element[e];
    const paramsProp = params[e];

    if (paramsProp) {
      element.__cached[e] = changes[e] = elementProp;
      element[e] = paramsProp;
    }

    if (options.cleanExec) delete element.__exec[e];
  }

  return changes;
};
/**
 * Overwrites DEEPly object properties with another
 */


exports.overwrite = overwrite;

const overwriteDeep = (obj, params, excluding = ['node']) => {
  for (const e in params) {
    if (excluding.indexOf(e) > -1) continue;
    const objProp = obj[e];
    const paramsProp = params[e];

    if (isObjectLike(objProp) && isObjectLike(paramsProp)) {
      overwriteDeep(objProp, paramsProp);
    } else if (paramsProp !== undefined) {
      obj[e] = paramsProp;
    }
  }

  return obj;
};
/**
 * Overwrites object properties with another
 */


exports.overwriteDeep = overwriteDeep;

const mergeIfExisted = (a, b) => {
  if (isObjectLike(a) && isObjectLike(b)) return deepMerge(a, b);
  return a || b;
};
/**
 * Merges array prototypes
 */


exports.mergeIfExisted = mergeIfExisted;

const mergeArray = arr => {
  return arr.reduce((a, c) => deepMerge(a, deepClone(c)), {});
};
/**
 * Merges array prototypes
 */


exports.mergeArray = mergeArray;

const mergeAndCloneIfArray = obj => {
  return isArray(obj) ? mergeArray(obj) : deepClone(obj);
};
/**
 * Overwrites object properties with another
 */


exports.mergeAndCloneIfArray = mergeAndCloneIfArray;

const flattenRecursive = (param, prop, stack = []) => {
  const objectized = mergeAndCloneIfArray(param);
  stack.push(objectized);
  const protoOfProto = objectized[prop];
  if (protoOfProto) flattenRecursive(protoOfProto, prop, stack);
  delete objectized[prop];
  return stack;
};

exports.flattenRecursive = flattenRecursive;
},{}],"../node_modules/@rackai/domql/src/utils/report.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.report = exports.errors = void 0;
const errors = {
  en: {
    DocumentNotDefined: {
      title: 'Document is undefined',
      description: 'To tweak with DOM, you should use browser.'
    },
    OverwriteToBuiltin: {
      title: 'Overwriting to builtin method',
      description: 'Overwriting a builtin method in the global define is not possible, please choose different name'
    },
    BrowserNotDefined: {
      title: 'Can\'t recognize environment',
      description: 'Environment should be browser application, that can run Javascript'
    },
    SetQuickPreferancesIsNotObject: {
      title: 'Quick preferances object is required',
      description: 'Please pass a plain object with "lang", "culture" and "area" properties'
    },
    InvalidParams: {
      title: 'Params are invalid',
      description: 'Please pass a plain object with "lang", "culture" and "area" properties'
    },
    CantCreateWithoutNode: {
      title: 'You must provide node',
      description: 'Can\'t create DOM element without setting node or text'
    },
    HTMLInvalidTag: {
      title: 'Element tag name (or DOM nodeName) is invalid',
      description: 'To create element, you must provide valid DOM node. See full list of them at here: http://www.w3schools.com/tags/'
    },
    HTMLInvalidAttr: {
      title: 'Attibutes object is invalid',
      description: 'Please pass a valid plain object to apply as an attributes for a DOM node'
    },
    HTMLInvalidData: {
      title: 'Data object is invalid',
      description: 'Please pass a valid plain object to apply as an dataset for a DOM node'
    },
    HTMLInvalidStyles: {
      title: 'Styles object is invalid',
      description: 'Please pass a valid plain object to apply as an style for a DOM node'
    },
    HTMLInvalidText: {
      title: 'Text string is invalid',
      description: 'Please pass a valid string to apply text to DOM node'
    }
  }
};
exports.errors = errors;

const report = (err, arg, element) => {
  const currentLang = 'en';
  let errObj;
  if (err && typeof err === 'string') errObj = errors[currentLang][err];
  return new Error(`"${err}", "${arg}"\n\n`, `${errObj.description}`, element ? `\n\n${element}` : '');
};

exports.report = report;
},{}],"../node_modules/@rackai/domql/src/utils/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "isObject", {
  enumerable: true,
  get: function () {
    return _object.isObject;
  }
});
Object.defineProperty(exports, "isObjectLike", {
  enumerable: true,
  get: function () {
    return _object.isObjectLike;
  }
});
Object.defineProperty(exports, "isFunction", {
  enumerable: true,
  get: function () {
    return _object.isFunction;
  }
});
Object.defineProperty(exports, "isNumber", {
  enumerable: true,
  get: function () {
    return _object.isNumber;
  }
});
Object.defineProperty(exports, "isString", {
  enumerable: true,
  get: function () {
    return _object.isString;
  }
});
Object.defineProperty(exports, "isArray", {
  enumerable: true,
  get: function () {
    return _object.isArray;
  }
});
Object.defineProperty(exports, "exec", {
  enumerable: true,
  get: function () {
    return _object.exec;
  }
});
Object.defineProperty(exports, "map", {
  enumerable: true,
  get: function () {
    return _object.map;
  }
});
Object.defineProperty(exports, "deepMerge", {
  enumerable: true,
  get: function () {
    return _object.deepMerge;
  }
});
Object.defineProperty(exports, "clone", {
  enumerable: true,
  get: function () {
    return _object.clone;
  }
});
Object.defineProperty(exports, "deepClone", {
  enumerable: true,
  get: function () {
    return _object.deepClone;
  }
});
Object.defineProperty(exports, "overwrite", {
  enumerable: true,
  get: function () {
    return _object.overwrite;
  }
});
Object.defineProperty(exports, "overwriteDeep", {
  enumerable: true,
  get: function () {
    return _object.overwriteDeep;
  }
});
Object.defineProperty(exports, "mergeArray", {
  enumerable: true,
  get: function () {
    return _object.mergeArray;
  }
});
Object.defineProperty(exports, "mergeAndCloneIfArray", {
  enumerable: true,
  get: function () {
    return _object.mergeAndCloneIfArray;
  }
});
Object.defineProperty(exports, "mergeIfExisted", {
  enumerable: true,
  get: function () {
    return _object.mergeIfExisted;
  }
});
Object.defineProperty(exports, "flattenRecursive", {
  enumerable: true,
  get: function () {
    return _object.flattenRecursive;
  }
});
Object.defineProperty(exports, "report", {
  enumerable: true,
  get: function () {
    return _report.report;
  }
});

var _object = require("./object");

var _report = require("./report");
},{"./object":"../node_modules/@rackai/domql/src/utils/object.js","./report":"../node_modules/@rackai/domql/src/utils/report.js"}],"../node_modules/@rackai/domql/src/element/root.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("../utils");

var _default = {
  node: document ? document.body : (0, _utils.report)('DocumentNotDefined', document)
};
exports.default = _default;
},{"../utils":"../node_modules/@rackai/domql/src/utils/index.js"}],"../node_modules/@rackai/domql/src/element/tree.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _root = _interopRequireDefault(require("./root"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = _root.default;
exports.default = _default;
},{"./root":"../node_modules/@rackai/domql/src/element/root.js"}],"../node_modules/@rackai/domql/src/event/on.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stateChange = exports.update = exports.attachNode = exports.initUpdate = exports.render = exports.init = void 0;

const init = (param, element, state) => {
  param(element, state);
};

exports.init = init;

const render = (param, element, state) => {
  param(element, state);
};

exports.render = render;

const initUpdate = (param, element, state) => {
  param(element, state);
};

exports.initUpdate = initUpdate;

const attachNode = (param, element, state) => {
  param(element, state);
};

exports.attachNode = attachNode;

const update = (param, element, state) => {
  param(element, state);
};

exports.update = update;

const stateChange = (param, element, state) => {
  param(element, state);
};

exports.stateChange = stateChange;
},{}],"../node_modules/@rackai/domql/src/event/can.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = void 0;

var _element = require("../element");

var _utils = require("../utils");

const render = element => {
  const tag = element.tag || 'div';
  const isValid = _element.nodes.body.indexOf(tag) > -1;
  return isValid || (0, _utils.report)('HTMLInvalidTag');
};

exports.render = render;
},{"../element":"../node_modules/@rackai/domql/src/element/index.js","../utils":"../node_modules/@rackai/domql/src/utils/index.js"}],"../node_modules/@rackai/domql/src/event/is.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.node = void 0;

const node = node => {
  const {
    Node
  } = window;
  return typeof Node === 'function' ? node instanceof Node : node && typeof node === 'object' && typeof node.nodeType === 'number' && typeof node.tag === 'string';
};

exports.node = node;
},{}],"../node_modules/@rackai/domql/src/event/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.is = exports.can = exports.on = void 0;

var on = _interopRequireWildcard(require("./on"));

exports.on = on;

var can = _interopRequireWildcard(require("./can"));

exports.can = can;

var is = _interopRequireWildcard(require("./is"));

exports.is = is;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
},{"./on":"../node_modules/@rackai/domql/src/event/on.js","./can":"../node_modules/@rackai/domql/src/event/can.js","./is":"../node_modules/@rackai/domql/src/event/is.js"}],"../node_modules/@rackai/domql/src/element/cache.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _event = require("../event");

var _utils = require("../utils");

var _nodes = _interopRequireDefault(require("./nodes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const cachedElements = {};

const createNode = element => {
  const {
    tag
  } = element;

  if (tag) {
    if (tag === 'string') return document.createTextNode(element.text);else if (tag === 'fragment') {
      return document.createDocumentFragment();
    } else if (tag === 'svg' || tag === 'path') {
      // change that
      return document.createElementNS('http://www.w3.org/2000/svg', tag);
    } else return document.createElement(tag);
  } else {
    return document.createElement('div');
  }
};

var _default = element => {
  let {
    tag,
    key
  } = element;
  const tagFromKey = _nodes.default.body.indexOf(key) > -1;

  if (typeof tag !== 'string') {
    if (tagFromKey && tag === true) tag = key;else tag = tagFromKey ? key : 'div';
  }

  element.tag = tag;

  if (!_event.can.render(element)) {
    return (0, _utils.report)('HTMLInvalidTag');
  }

  let cachedTag = cachedElements[tag];
  if (!cachedTag) cachedTag = cachedElements[tag] = createNode(element);
  const clonedNode = cachedTag.cloneNode(true);
  if (tag === 'string') clonedNode.nodeValue = element.text;
  return clonedNode;
};

exports.default = _default;
},{"../event":"../node_modules/@rackai/domql/src/event/index.js","../utils":"../node_modules/@rackai/domql/src/utils/index.js","./nodes":"../node_modules/@rackai/domql/src/element/nodes.js"}],"../node_modules/@rackai/domql/src/element/mixins/attr.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("../../utils");

/**
 * Recursively add attributes to a DOM node
 */
var _default = (params, element, node) => {
  if (params) {
    if (!(typeof params === 'object')) (0, _utils.report)('HTMLInvalidAttr', params);

    for (const attr in params) {
      // if (!node) node = element.node
      const val = (0, _utils.exec)(params[attr], element);
      if (val && node.setAttribute) node.setAttribute(attr, val);else if (node.removeAttribute) node.removeAttribute(attr);
    }
  }
};

exports.default = _default;
},{"../../utils":"../node_modules/@rackai/domql/src/utils/index.js"}],"../node_modules/@rackai/domql/src/element/mixins/classList.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.classify = exports.assignClass = void 0;

var _utils = require("../../utils");

const assignClass = element => {
  const {
    key
  } = element;
  if (element.class === true) element.class = key;else if (!element.class && typeof key === 'string' && key.charAt(0) === '_' && key.charAt(1) !== '_') {
    element.class = key.slice(1);
  }
}; // stringifies class object


exports.assignClass = assignClass;

const classify = (obj, element) => {
  let className = '';

  for (const item in obj) {
    const param = obj[item];
    if (typeof param === 'boolean' && param) className += ` ${item}`;else if (typeof param === 'string') className += ` ${param}`;else if (typeof param === 'function') {
      className += ` ${(0, _utils.exec)(param, element)}`;
    }
  }

  return className;
};

exports.classify = classify;

var _default = (params, element, node) => {
  if (!params) return;
  const {
    key
  } = element;
  if (params === true) params = element.class = {
    key
  };
  if ((0, _utils.isString)(params)) params = element.class = {
    default: params
  };
  if ((0, _utils.isObject)(params)) params = classify(params, element); // TODO: fails on string

  const className = params.replace(/\s+/g, ' ').trim();
  node.classList = className;
  return className;
};

exports.default = _default;
},{"../../utils":"../node_modules/@rackai/domql/src/utils/index.js"}],"../node_modules/@rackai/domql/src/element/set.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _create = _interopRequireDefault(require("./create"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const set = function (params, enter, leave) {
  const element = this;

  if (element.content && element.content.node) {
    // leave(element, () => {
    element.node.removeChild(element.content.node);
    delete element.content; // })
  }

  if (params) (0, _create.default)(params, element, 'content');
  return element;
};

var _default = set;
exports.default = _default;
},{"./create":"../node_modules/@rackai/domql/src/element/create.js"}],"../node_modules/@rackai/domql/src/element/mixins/content.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _set = _interopRequireDefault(require("../set"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Appends anything as content
 * an original one as a child
 */
var _default = (param, element, node) => {
  if (param && element) {
    _set.default.call(element, param);
  }
};

exports.default = _default;
},{"../set":"../node_modules/@rackai/domql/src/element/set.js"}],"../node_modules/@rackai/domql/src/element/mixins/data.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("../../utils");

var _report = _interopRequireDefault(require("../../utils/report"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Apply data parameters on the DOM nodes
 * this should only work if `showOnNode: true` is passed
 */
var _default = (params, element, node) => {
  if (params && params.showOnNode) {
    if (!(0, _utils.isObject)(params)) (0, _report.default)('HTMLInvalidData', params); // Apply data params on node

    for (const dataset in params) {
      if (dataset !== 'showOnNode') {
        node.dataset[dataset] = (0, _utils.exec)(params[dataset], element);
      }
    }
  }
};

exports.default = _default;
},{"../../utils":"../node_modules/@rackai/domql/src/utils/index.js","../../utils/report":"../node_modules/@rackai/domql/src/utils/report.js"}],"../node_modules/@rackai/domql/src/element/mixins/html.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("../../utils");

/**
 * Appends raw HTML as content
 * an original one as a child
 */
var _default = (param, element, node) => {
  const prop = (0, _utils.exec)(param, element);

  if (prop) {
    // const parser = new window.DOMParser()
    // param = parser.parseFromString(param, 'text/html')
    if (node.nodeName === 'SVG') node.textContent = prop;else node.innerHTML = prop;
  }
};

exports.default = _default;
},{"../../utils":"../node_modules/@rackai/domql/src/utils/index.js"}],"../node_modules/@rackai/domql/src/element/mixins/style.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("../../utils");

var _report = require("../../utils/report");

/**
 * Recursively add styles to a DOM node
 */
var _default = (params, element, node) => {
  if (params) {
    if ((0, _utils.isObject)(params)) (0, _utils.map)(node.style, params, element);else (0, _report.report)('HTMLInvalidStyles', params);
  }
};

exports.default = _default;
},{"../../utils":"../node_modules/@rackai/domql/src/utils/index.js","../../utils/report":"../node_modules/@rackai/domql/src/utils/report.js"}],"../node_modules/@rackai/domql/src/element/mixins/text.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ = require("..");

var _utils = require("../../utils");

/**
 * Creates a text node and appends into
 * an original one as a child
 */
var _default = (param, element, node) => {
  const prop = (0, _utils.exec)(param, element);
  if (element.tag === 'string') node.nodeValue = prop;else {
    if (element.__text) {
      element.__text.text = prop;
      element.__text.node.nodeValue = prop;
    } else (0, _.create)({
      tag: 'string',
      text: prop
    }, element, '__text');
  }
};

exports.default = _default;
},{"..":"../node_modules/@rackai/domql/src/element/index.js","../../utils":"../node_modules/@rackai/domql/src/utils/index.js"}],"../node_modules/@rackai/domql/src/element/mixins/state.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("../../utils");

var _default = (params, element, node) => {
  const state = (0, _utils.exec)(params, element);

  if ((0, _utils.isObject)(state)) {
    for (const param in state) {
      if (param === 'update' || param === '__element' || param === 'parse') continue;
      element.state[param] = (0, _utils.exec)(state[param], element);
    }
  }

  return element;
};

exports.default = _default;
},{"../../utils":"../node_modules/@rackai/domql/src/utils/index.js"}],"../node_modules/@rackai/domql/src/element/mixins/registry.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ = require("./");

var _default = {
  attr: _.attr,
  style: _.style,
  text: _.text,
  html: _.html,
  content: _.content,
  data: _.data,
  class: _.classList,
  state: _.state,
  proto: {},
  path: {},
  childProto: {},
  if: {},
  define: {},
  transform: {},
  __cached: {},
  __defined: {},
  __exec: {},
  __changes: {},
  __trash: {},
  key: {},
  tag: {},
  parent: {},
  node: {},
  set: {},
  update: {},
  remove: {},
  lookup: {},
  keys: {},
  log: {},
  parse: {},
  on: {}
};
exports.default = _default;
},{"./":"../node_modules/@rackai/domql/src/element/mixins/index.js"}],"../node_modules/@rackai/domql/src/element/mixins/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "attr", {
  enumerable: true,
  get: function () {
    return _attr.default;
  }
});
Object.defineProperty(exports, "classList", {
  enumerable: true,
  get: function () {
    return _classList.default;
  }
});
Object.defineProperty(exports, "content", {
  enumerable: true,
  get: function () {
    return _content.default;
  }
});
Object.defineProperty(exports, "data", {
  enumerable: true,
  get: function () {
    return _data.default;
  }
});
Object.defineProperty(exports, "html", {
  enumerable: true,
  get: function () {
    return _html.default;
  }
});
Object.defineProperty(exports, "style", {
  enumerable: true,
  get: function () {
    return _style.default;
  }
});
Object.defineProperty(exports, "text", {
  enumerable: true,
  get: function () {
    return _text.default;
  }
});
Object.defineProperty(exports, "state", {
  enumerable: true,
  get: function () {
    return _state.default;
  }
});
Object.defineProperty(exports, "registry", {
  enumerable: true,
  get: function () {
    return _registry.default;
  }
});

var _attr = _interopRequireDefault(require("./attr"));

var _classList = _interopRequireDefault(require("./classList"));

var _content = _interopRequireDefault(require("./content"));

var _data = _interopRequireDefault(require("./data"));

var _html = _interopRequireDefault(require("./html"));

var _style = _interopRequireDefault(require("./style"));

var _text = _interopRequireDefault(require("./text"));

var _state = _interopRequireDefault(require("./state"));

var _registry = _interopRequireDefault(require("./registry"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./attr":"../node_modules/@rackai/domql/src/element/mixins/attr.js","./classList":"../node_modules/@rackai/domql/src/element/mixins/classList.js","./content":"../node_modules/@rackai/domql/src/element/mixins/content.js","./data":"../node_modules/@rackai/domql/src/element/mixins/data.js","./html":"../node_modules/@rackai/domql/src/element/mixins/html.js","./style":"../node_modules/@rackai/domql/src/element/mixins/style.js","./text":"../node_modules/@rackai/domql/src/element/mixins/text.js","./state":"../node_modules/@rackai/domql/src/element/mixins/state.js","./registry":"../node_modules/@rackai/domql/src/element/mixins/registry.js"}],"../node_modules/@rackai/domql/src/element/methods.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isMethod = exports.log = exports.parse = exports.keys = exports.defineSetter = exports.update = exports.set = exports.get = exports.remove = exports.lookup = void 0;

var _utils = require("../utils");

var _mixins = require("./mixins");

// TODO: update these files
const lookup = function (key) {
  const element = this;
  let {
    parent
  } = element;

  while (parent.key !== key) {
    parent = parent.parent;
    if (!parent) return;
  }

  return parent;
};

exports.lookup = lookup;

const remove = function (params) {
  const element = this;
  element.node.remove();
  delete element.parent[element.key];
};

exports.remove = remove;

const get = function (param) {
  const element = this;
  return element[param];
};

exports.get = get;

const set = function () {};

exports.set = set;

const update = function () {};

exports.update = update;

const defineSetter = (element, key, get, set) => Object.defineProperty(element, key, {
  get,
  set
});

exports.defineSetter = defineSetter;

const keys = function () {
  const element = this;
  const keys = [];

  for (const param in element) if (!(0, _utils.isObject)(_mixins.registry[param])) keys.push(param);

  return keys;
};

exports.keys = keys;

const parse = function () {
  const element = this;
  const obj = {};
  const keys = element.keys();
  keys.forEach(v => obj[v] = element[v]);
  return obj;
};

exports.parse = parse;

const log = function (...args) {
  const element = this;
  console.group(element.key);

  if (args.length) {
    args.forEach(v => console.log(`%c${v}:\n`, 'font-weight: bold', element[v]));
  } else {
    console.log(element.path);
    const keys = element.keys();
    keys.forEach(v => console.log(`%c${v}:\n`, 'font-weight: bold', element[v]));
  }

  console.groupEnd(element.key);
  return element;
};

exports.log = log;

const isMethod = function (param) {
  return param === 'set' || param === 'update' || param === 'remove' || param === 'lookup' || param === 'keys' || param === 'parse' || param === 'log';
};

exports.isMethod = isMethod;
},{"../utils":"../node_modules/@rackai/domql/src/utils/index.js","./mixins":"../node_modules/@rackai/domql/src/element/mixins/index.js"}],"../node_modules/@rackai/domql/src/element/iterate.js":[function(require,module,exports) {
var define;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.throughUpdatedDefine = exports.throughInitialDefine = exports.throughUpdatedExec = exports.throughInitialExec = exports.applyEvents = void 0;

var _utils = require("../utils");

var _methods = require("./methods");

const applyEvents = element => {
  const {
    node,
    on
  } = element;

  for (const param in on) {
    if (param === 'init' || param === 'render' || param === 'update') continue;
    const appliedFunction = element.on[param];

    if ((0, _utils.isFunction)(appliedFunction)) {
      node.addEventListener(param, event => appliedFunction(event, element, element.state), true);
    }
  }
};

exports.applyEvents = applyEvents;

const throughInitialExec = element => {
  for (const param in element) {
    const prop = element[param];

    if ((0, _utils.isFunction)(prop) && !(0, _methods.isMethod)(param)) {
      element.__exec[param] = prop;
      element[param] = prop(element, element.state);
    }
  }
};

exports.throughInitialExec = throughInitialExec;

const throughUpdatedExec = (element, options) => {
  const {
    __exec
  } = element;
  const changes = {};

  for (const param in __exec) {
    const prop = element[param];

    const newExec = __exec[param](element, element.state); // if element is string


    if (prop && prop.node && ((0, _utils.isString)(newExec) || (0, _utils.isNumber)(newExec))) {
      (0, _utils.overwrite)(prop, {
        text: newExec
      }, options);
    } else if (newExec !== prop) {
      element.__cached[param] = changes[param] = prop;
      element[param] = newExec;
    }
  }

  return changes;
};

exports.throughUpdatedExec = throughUpdatedExec;

const throughInitialDefine = element => {
  const {
    define
  } = element;

  for (const param in define) {
    let prop = element[param];

    if ((0, _utils.isFunction)(prop) && !(0, _methods.isMethod)(param)) {
      element.__exec[param] = prop;
      element[param] = prop = (0, _utils.exec)(prop, element);
    }

    element.__cached[param] = prop;
    element[param] = define[param](prop, element, element.state);
  }

  return element;
};

exports.throughInitialDefine = throughInitialDefine;

const throughUpdatedDefine = element => {
  const {
    define,
    __exec
  } = element;
  const changes = {};

  for (const param in define) {
    if (__exec[param]) element.__cached[param] = __exec[param](element, element.state);
    const cached = (0, _utils.exec)(element.__cached[param], element);
    element[param] = define[param](cached, element, element.state);
  }

  return changes;
};

exports.throughUpdatedDefine = throughUpdatedDefine;
},{"../utils":"../node_modules/@rackai/domql/src/utils/index.js","./methods":"../node_modules/@rackai/domql/src/element/methods.js"}],"../node_modules/@rackai/domql/src/element/createNode.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _create = _interopRequireDefault(require("./create"));

var _cache = _interopRequireDefault(require("./cache"));

var on = _interopRequireWildcard(require("../event/on"));

var _utils = require("../utils");

var _iterate = require("./iterate");

var _mixins = require("./mixins");

var _methods = require("./methods");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import { defineSetter } from './methods'
const ENV = "development"; // const defineSetter = (element, key) => Object.defineProperty(element, key, {
//   get: function () {
//     console.log('GET', key)
//     return element.__data[key]
//   },
//   set: function (new_value) {
//     console.log('SET', key, new_value)
//     element.__data[key] = new_value
//     element.__data['modified'] = (new Date()).getTime()
//   }
// })

const createNode = element => {
  // create and assign a node
  let {
    node,
    tag
  } = element;
  let isNewNode;

  if (!node) {
    isNewNode = true;

    if (tag === 'shadow') {
      node = element.node = element.parent.node.attachShadow({
        mode: 'open'
      });
    } else node = element.node = (0, _cache.default)(element); // run `on.attachNode`


    if (element.on && (0, _utils.isFunction)(element.on.attachNode)) {
      on.attachNode(element.on.attachNode, element, element.state);
    }
  } // node.dataset // .key = element.key


  if (ENV === 'test' || ENV === 'development') node.ref = element; // iterate through all given params

  if (element.tag !== 'string' || element.tag !== 'fragment') {
    // iterate through define
    if ((0, _utils.isObject)(element.define)) (0, _iterate.throughInitialDefine)(element); // iterate through exec

    (0, _iterate.throughInitialExec)(element); // apply events

    if (isNewNode && (0, _utils.isObject)(element.on)) (0, _iterate.applyEvents)(element);

    for (const param in element) {
      const prop = element[param];
      if ((0, _methods.isMethod)(param) || (0, _utils.isObject)(_mixins.registry[param]) || prop === undefined) continue;
      const hasDefined = element.define && element.define[param];
      const ourParam = _mixins.registry[param];

      if (ourParam) {
        // Check if param is in our method registry
        if ((0, _utils.isFunction)(ourParam)) ourParam(prop, element, node);
      } else if (element[param] && !hasDefined) {
        (0, _create.default)(prop, element, param); // Create element
      }
    }
  } // node.dataset.key = key


  return element;
};

var _default = createNode;
exports.default = _default;
},{"./create":"../node_modules/@rackai/domql/src/element/create.js","./cache":"../node_modules/@rackai/domql/src/element/cache.js","../event/on":"../node_modules/@rackai/domql/src/event/on.js","../utils":"../node_modules/@rackai/domql/src/utils/index.js","./iterate":"../node_modules/@rackai/domql/src/element/iterate.js","./mixins":"../node_modules/@rackai/domql/src/element/mixins/index.js","./methods":"../node_modules/@rackai/domql/src/element/methods.js"}],"../node_modules/@rackai/domql/src/element/assign.js":[function(require,module,exports) {
'use strict';
/**
 * Receives child and parent nodes as parametes
 * and assigns them into real DOM tree
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assignNode = exports.appendNode = void 0;

const appendNode = (node, parentNode) => {
  parentNode.appendChild(node);
  return node;
};
/**
 * Receives elements and assigns the first
 * parameter as a child of the second one
 */


exports.appendNode = appendNode;

const assignNode = (element, parent, key) => {
  parent[key || element.key] = element;

  if (element.tag !== 'shadow') {
    appendNode(element.node, parent.node);
  }

  return element;
};

exports.assignNode = assignNode;
},{}],"../node_modules/@rackai/domql/src/element/proto.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyPrototype = void 0;

var _utils = require("../utils");

const ENV = "development";
/**
 * Checks whether element has `proto` or is a part
 * of parent's `childProto` prototype
 */

const applyPrototype = (element, parent) => {
  // merge if proto is array
  const proto = (0, _utils.mergeAndCloneIfArray)(element.proto);
  if (ENV !== 'test' || ENV !== 'development') delete element.proto;
  let childProto;

  if (parent) {
    // Assign parent attr to the element
    element.parent = parent;
    childProto = parent && (0, _utils.mergeAndCloneIfArray)(parent.childProto);
  }

  if (!proto && !childProto) return element; // merge if both `proto` and `parent.childProto ` applied

  const mergedProto = (0, _utils.mergeIfExisted)(proto, childProto); // flatten inheritances into flat array

  const flattenedArray = (0, _utils.flattenRecursive)(mergedProto, 'proto'); // flatten prototypal inheritances

  const flattenedProto = (0, _utils.mergeArray)(flattenedArray); // final merging with prototype

  return (0, _utils.deepMerge)(element, flattenedProto);
};

exports.applyPrototype = applyPrototype;
},{"../utils":"../node_modules/@rackai/domql/src/utils/index.js"}],"../node_modules/@rackai/domql/src/element/id.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const createID = function* () {
  let index = 1;

  while (index < index + 1) {
    yield index++;
  }
};

var _default = createID();

exports.default = _default;
},{}],"../node_modules/@rackai/domql/src/element/state.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.updateState = exports.parseState = void 0;

var _event = require("../event");

var _utils = require("../utils");

const parseState = function () {
  const state = this;
  const parseState = {};

  for (const param in state) {
    if (param !== '__element' && param !== 'update' && param !== 'parse') {
      parseState[param] = state[param];
    }
  }

  return parseState;
};

exports.parseState = parseState;

const updateState = function (obj, options = {}) {
  const state = this;
  const element = state.__element;
  (0, _utils.overwriteDeep)(state, obj, ['update', 'parse', '__element']);
  if (!options.preventUpdate) element.update(); // run `on.init`

  if (element.on && (0, _utils.isFunction)(element.on.state)) {
    _event.on.init(element.on.state, element, state);
  }
};

exports.updateState = updateState;

function _default(element) {
  let {
    state
  } = element;
  if (!state) return element.parent.state || {};
  if ((0, _utils.isFunction)(state)) state = (0, _utils.exec)(state, element);
  state = (0, _utils.deepClone)(state);
  state.__element = element;
  state.update = updateState;
  state.parse = parseState;
  return state;
}
},{"../event":"../node_modules/@rackai/domql/src/event/index.js","../utils":"../node_modules/@rackai/domql/src/utils/index.js"}],"../node_modules/@rackai/domql/src/element/update.js":[function(require,module,exports) {
var define;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("../utils");

var _mixins = require("./mixins");

var on = _interopRequireWildcard(require("../event/on"));

var _methods = require("./methods");

var _iterate = require("./iterate");

var _object = require("../utils/object");

var _cache = _interopRequireDefault(require("./cache"));

var _assign = require("./assign");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const UPDATE_DEFAULT_OPTIONS = {
  stackChanges: false,
  cleanExec: true
};

const update = function (params = {}, options = UPDATE_DEFAULT_OPTIONS) {
  const element = this;
  const {
    define
  } = element;
  let {
    node
  } = element; // if params is string

  if ((0, _utils.isString)(params) || (0, _utils.isNumber)(params)) {
    params = {
      text: params
    };
  }

  if (element.on && (0, _utils.isFunction)(element.on.initUpdate)) {
    on.initUpdate(element.on.initUpdate, element, element.state);
  }

  const overwriteChanges = (0, _utils.overwrite)(element, params, options);
  const execChanges = (0, _iterate.throughUpdatedExec)(element, options);
  const definedChanges = (0, _iterate.throughUpdatedDefine)(element);

  if (Object.prototype.hasOwnProperty.call(element, 'if')) {
    // TODO: trash and insertbefore
    if (element.if === true && !element.node) {
      element.node = node = (0, _cache.default)(element);
      (0, _assign.appendNode)(node, element.parent.node);
    } else if (element.if === false && element.node) {
      delete element.node;
      node.remove();
      return;
    }
  }

  if (!node) return;

  if (options.stackChanges && element.__stackChanges) {
    const stackChanges = (0, _object.merge)(definedChanges, (0, _object.merge)(execChanges, overwriteChanges));

    element.__stackChanges.push(stackChanges);
  }

  for (const param in element) {
    const prop = element[param];
    if ((0, _methods.isMethod)(param) || (0, _utils.isObject)(_mixins.registry[param]) || prop === undefined) continue;
    const hasDefined = define && define[param];
    const ourParam = _mixins.registry[param];

    if (ourParam) {
      if ((0, _utils.isFunction)(ourParam)) ourParam(prop, element, node);
    } else if (prop && (0, _utils.isObject)(prop) && !hasDefined) {
      update.call(prop, params[prop], options);
    }
  }

  if (element.on && (0, _utils.isFunction)(element.on.update)) {
    on.update(element.on.update, element, element.state);
  }
};

var _default = update;
exports.default = _default;
},{"../utils":"../node_modules/@rackai/domql/src/utils/index.js","./mixins":"../node_modules/@rackai/domql/src/element/mixins/index.js","../event/on":"../node_modules/@rackai/domql/src/event/on.js","./methods":"../node_modules/@rackai/domql/src/element/methods.js","./iterate":"../node_modules/@rackai/domql/src/element/iterate.js","../utils/object":"../node_modules/@rackai/domql/src/utils/object.js","./cache":"../node_modules/@rackai/domql/src/element/cache.js","./assign":"../node_modules/@rackai/domql/src/element/assign.js"}],"../node_modules/@rackai/domql/src/element/create.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tree = _interopRequireDefault(require("./tree"));

var _createNode = _interopRequireDefault(require("./createNode"));

var _assign = require("./assign");

var _proto = require("./proto");

var _id = _interopRequireDefault(require("./id"));

var _nodes = _interopRequireDefault(require("./nodes"));

var _set = _interopRequireDefault(require("./set"));

var _state = _interopRequireDefault(require("./state"));

var _update = _interopRequireDefault(require("./update"));

var on = _interopRequireWildcard(require("../event/on"));

var _classList = require("./mixins/classList");

var _utils = require("../utils");

var _methods = require("./methods");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import { overwrite, clone, fillTheRest } from '../utils'
const ENV = "development";
/**
 * Creating a domQL element using passed parameters
 */

const create = (element, parent, key) => {
  // if PARENT is not given
  if (!parent) parent = _tree.default; // if ELEMENT is not given

  if (element === undefined) element = {};
  if (element === null) return; // define KEY

  const assignedKey = element.key || key || _id.default.next().value; // if element is STRING


  if ((0, _utils.isString)(element) || (0, _utils.isNumber)(element)) {
    element = {
      text: element,
      tag: !element.proto && parent.childProto && parent.childProto.tag || _nodes.default.body.indexOf(key) > -1 && key || 'string'
    };
  } // create PROTOtypal inheritance


  (0, _proto.applyPrototype)(element, parent); // set the PATH

  if (ENV === 'test' || ENV === 'development') {
    if (!parent.path) parent.path = [];
    element.path = parent.path.concat(assignedKey);
  } // if it already HAS A NODE


  if (element.node) {
    return (0, _assign.assignNode)(element, parent, assignedKey);
  } // create and assign a KEY


  element.key = assignedKey; // generate a CLASS name

  (0, _classList.assignClass)(element); // assign METHODS

  element.set = _set.default;
  element.update = _update.default;
  element.remove = _methods.remove;
  element.lookup = _methods.lookup;

  if (ENV === 'test' || ENV === 'development') {
    element.keys = _methods.keys;
    element.parse = _methods.parse;
    element.log = _methods.log;
  } // run `on.init`


  if (element.on && (0, _utils.isFunction)(element.on.init)) {
    on.init(element.on.init, element, element.state);
  } // enable TRANSFORM in data


  if (!element.transform) element.transform = {}; // enable CACHING

  if (!element.__cached) element.__cached = {}; // enable EXEC

  if (!element.__exec) element.__exec = {}; // enable CHANGES storing

  if (!element.__changes) element.__changes = []; // enable STATE

  element.state = (0, _state.default)(element); // don't render IF in condition

  if ((0, _utils.isFunction)(element.if) && !element.if(element, element.state)) return; // CREATE a real NODE

  (0, _createNode.default)(element); // assign NODE

  (0, _assign.assignNode)(element, parent, key); // run `on.render`

  if (element.on && (0, _utils.isFunction)(element.on.render)) {
    on.render(element.on.render, element, element.state);
  }

  return element;
};

var _default = create;
exports.default = _default;
},{"./tree":"../node_modules/@rackai/domql/src/element/tree.js","./createNode":"../node_modules/@rackai/domql/src/element/createNode.js","./assign":"../node_modules/@rackai/domql/src/element/assign.js","./proto":"../node_modules/@rackai/domql/src/element/proto.js","./id":"../node_modules/@rackai/domql/src/element/id.js","./nodes":"../node_modules/@rackai/domql/src/element/nodes.js","./set":"../node_modules/@rackai/domql/src/element/set.js","./state":"../node_modules/@rackai/domql/src/element/state.js","./update":"../node_modules/@rackai/domql/src/element/update.js","../event/on":"../node_modules/@rackai/domql/src/event/on.js","./mixins/classList":"../node_modules/@rackai/domql/src/element/mixins/classList.js","../utils":"../node_modules/@rackai/domql/src/utils/index.js","./methods":"../node_modules/@rackai/domql/src/element/methods.js"}],"../node_modules/@rackai/domql/src/element/define.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mixins = require("./mixins");

var _utils = require("../utils");

var _default = (params, options = {}) => {
  const {
    overwrite
  } = options;

  for (const param in params) {
    if (_mixins.registry[param] && !overwrite) {
      (0, _utils.report)('OverwriteToBuiltin', param);
    } else _mixins.registry[param] = params[param];
  }
};

exports.default = _default;
},{"./mixins":"../node_modules/@rackai/domql/src/element/mixins/index.js","../utils":"../node_modules/@rackai/domql/src/utils/index.js"}],"../node_modules/@rackai/domql/src/element/parse.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _create = _interopRequireDefault(require("./create"));

var _assign = require("./assign");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const parse = element => {
  const virtualTree = {
    node: document.createElement('div')
  };
  if (element && element.node) (0, _assign.assignNode)(element, virtualTree);else (0, _create.default)(element, virtualTree);
  return virtualTree.node.innerHTML;
};

var _default = parse;
exports.default = _default;
},{"./create":"../node_modules/@rackai/domql/src/element/create.js","./assign":"../node_modules/@rackai/domql/src/element/assign.js"}],"../node_modules/@rackai/domql/src/element/index.js":[function(require,module,exports) {

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "nodes", {
  enumerable: true,
  get: function () {
    return _nodes.default;
  }
});
Object.defineProperty(exports, "root", {
  enumerable: true,
  get: function () {
    return _root.default;
  }
});
Object.defineProperty(exports, "tree", {
  enumerable: true,
  get: function () {
    return _tree.default;
  }
});
Object.defineProperty(exports, "cache", {
  enumerable: true,
  get: function () {
    return _cache.default;
  }
});
Object.defineProperty(exports, "create", {
  enumerable: true,
  get: function () {
    return _create.default;
  }
});
Object.defineProperty(exports, "createNode", {
  enumerable: true,
  get: function () {
    return _createNode.default;
  }
});
Object.defineProperty(exports, "define", {
  enumerable: true,
  get: function () {
    return _define.default;
  }
});
Object.defineProperty(exports, "update", {
  enumerable: true,
  get: function () {
    return _update.default;
  }
});
Object.defineProperty(exports, "parse", {
  enumerable: true,
  get: function () {
    return _parse.default;
  }
});
Object.defineProperty(exports, "set", {
  enumerable: true,
  get: function () {
    return _set.default;
  }
});
Object.defineProperty(exports, "lookup", {
  enumerable: true,
  get: function () {
    return _methods.lookup;
  }
});
Object.defineProperty(exports, "remove", {
  enumerable: true,
  get: function () {
    return _methods.remove;
  }
});
Object.defineProperty(exports, "get", {
  enumerable: true,
  get: function () {
    return _methods.get;
  }
});
Object.defineProperty(exports, "log", {
  enumerable: true,
  get: function () {
    return _methods.log;
  }
});
Object.defineProperty(exports, "keys", {
  enumerable: true,
  get: function () {
    return _methods.keys;
  }
});
exports.assign = void 0;

var _nodes = _interopRequireDefault(require("./nodes"));

var _root = _interopRequireDefault(require("./root"));

var _tree = _interopRequireDefault(require("./tree"));

var _cache = _interopRequireDefault(require("./cache"));

var _create = _interopRequireDefault(require("./create"));

var _createNode = _interopRequireDefault(require("./createNode"));

var assign = _interopRequireWildcard(require("./assign"));

exports.assign = assign;

var _define = _interopRequireDefault(require("./define"));

var _update = _interopRequireDefault(require("./update"));

var _parse = _interopRequireDefault(require("./parse"));

var _set = _interopRequireDefault(require("./set"));

var _methods = require("./methods");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./nodes":"../node_modules/@rackai/domql/src/element/nodes.js","./root":"../node_modules/@rackai/domql/src/element/root.js","./tree":"../node_modules/@rackai/domql/src/element/tree.js","./cache":"../node_modules/@rackai/domql/src/element/cache.js","./create":"../node_modules/@rackai/domql/src/element/create.js","./createNode":"../node_modules/@rackai/domql/src/element/createNode.js","./assign":"../node_modules/@rackai/domql/src/element/assign.js","./define":"../node_modules/@rackai/domql/src/element/define.js","./update":"../node_modules/@rackai/domql/src/element/update.js","./parse":"../node_modules/@rackai/domql/src/element/parse.js","./set":"../node_modules/@rackai/domql/src/element/set.js","./methods":"../node_modules/@rackai/domql/src/element/methods.js"}],"../node_modules/@rackai/domql/src/index.js":[function(require,module,exports) {

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("regenerator-runtime/runtime");

var _element = require("./element");

const ENV = "development";
if (ENV === 'test' || ENV === 'development') window.tree = _element.tree;
var _default = {
  create: _element.create,
  parse: _element.parse,
  set: _element.set,
  define: _element.define,
  tree: _element.tree
};
exports.default = _default;
},{"regenerator-runtime/runtime":"../node_modules/regenerator-runtime/runtime.js","./element":"../node_modules/@rackai/domql/src/element/index.js"}],"../node_modules/@emotion/sheet/dist/emotion-sheet.browser.esm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StyleSheet = void 0;

/*

Based off glamor's StyleSheet, thanks Sunil ❤️

high performance StyleSheet for css-in-js systems

- uses multiple style tags behind the scenes for millions of rules
- uses `insertRule` for appending in production for *much* faster performance

// usage

import { StyleSheet } from '@emotion/sheet'

let styleSheet = new StyleSheet({ key: '', container: document.head })

styleSheet.insert('#box { border: 1px solid red; }')
- appends a css rule into the stylesheet

styleSheet.flush()
- empties the stylesheet of all its contents

*/
// $FlowFixMe
function sheetForTag(tag) {
  if (tag.sheet) {
    // $FlowFixMe
    return tag.sheet;
  } // this weirdness brought to you by firefox

  /* istanbul ignore next */


  for (var i = 0; i < document.styleSheets.length; i++) {
    if (document.styleSheets[i].ownerNode === tag) {
      // $FlowFixMe
      return document.styleSheets[i];
    }
  }
}

function createStyleElement(options) {
  var tag = document.createElement('style');
  tag.setAttribute('data-emotion', options.key);

  if (options.nonce !== undefined) {
    tag.setAttribute('nonce', options.nonce);
  }

  tag.appendChild(document.createTextNode(''));
  tag.setAttribute('data-s', '');
  return tag;
}

var StyleSheet = /*#__PURE__*/function () {
  function StyleSheet(options) {
    var _this = this;

    this._insertTag = function (tag) {
      var before;

      if (_this.tags.length === 0) {
        before = _this.prepend ? _this.container.firstChild : _this.before;
      } else {
        before = _this.tags[_this.tags.length - 1].nextSibling;
      }

      _this.container.insertBefore(tag, before);

      _this.tags.push(tag);
    };

    this.isSpeedy = options.speedy === undefined ? "development" === 'production' : options.speedy;
    this.tags = [];
    this.ctr = 0;
    this.nonce = options.nonce; // key is the value of the data-emotion attribute, it's used to identify different sheets

    this.key = options.key;
    this.container = options.container;
    this.prepend = options.prepend;
    this.before = null;
  }

  var _proto = StyleSheet.prototype;

  _proto.hydrate = function hydrate(nodes) {
    nodes.forEach(this._insertTag);
  };

  _proto.insert = function insert(rule) {
    // the max length is how many rules we have per style tag, it's 65000 in speedy mode
    // it's 1 in dev because we insert source maps that map a single rule to a location
    // and you can only have one source map per style tag
    if (this.ctr % (this.isSpeedy ? 65000 : 1) === 0) {
      this._insertTag(createStyleElement(this));
    }

    var tag = this.tags[this.tags.length - 1];

    if ("development" !== 'production') {
      var isImportRule = rule.charCodeAt(0) === 64 && rule.charCodeAt(1) === 105;

      if (isImportRule && this._alreadyInsertedOrderInsensitiveRule) {
        // this would only cause problem in speedy mode
        // but we don't want enabling speedy to affect the observable behavior
        // so we report this error at all times
        console.error("You're attempting to insert the following rule:\n" + rule + '\n\n`@import` rules must be before all other types of rules in a stylesheet but other rules have already been inserted. Please ensure that `@import` rules are before all other rules.');
      }

      this._alreadyInsertedOrderInsensitiveRule = this._alreadyInsertedOrderInsensitiveRule || !isImportRule;
    }

    if (this.isSpeedy) {
      var sheet = sheetForTag(tag);

      try {
        // this is the ultrafast version, works across browsers
        // the big drawback is that the css won't be editable in devtools
        sheet.insertRule(rule, sheet.cssRules.length);
      } catch (e) {
        if ("development" !== 'production' && !/:(-moz-placeholder|-ms-input-placeholder|-moz-read-write|-moz-read-only){/.test(rule)) {
          console.error("There was a problem inserting the following rule: \"" + rule + "\"", e);
        }
      }
    } else {
      tag.appendChild(document.createTextNode(rule));
    }

    this.ctr++;
  };

  _proto.flush = function flush() {
    // $FlowFixMe
    this.tags.forEach(function (tag) {
      return tag.parentNode.removeChild(tag);
    });
    this.tags = [];
    this.ctr = 0;

    if ("development" !== 'production') {
      this._alreadyInsertedOrderInsensitiveRule = false;
    }
  };

  return StyleSheet;
}();

exports.StyleSheet = StyleSheet;
},{}],"../node_modules/stylis/dist/stylis.mjs":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.alloc = T;
exports.append = O;
exports.caret = P;
exports.char = J;
exports.charat = z;
exports.combine = S;
exports.comment = te;
exports.commenter = ee;
exports.compile = ae;
exports.copy = I;
exports.dealloc = U;
exports.declaration = se;
exports.delimit = V;
exports.delimiter = _;
exports.escaping = Z;
exports.hash = m;
exports.identifier = re;
exports.indexof = j;
exports.match = x;
exports.middleware = oe;
exports.namespace = he;
exports.next = L;
exports.node = H;
exports.parse = ce;
exports.peek = N;
exports.prefix = ue;
exports.prefixer = ve;
exports.prev = K;
exports.replace = y;
exports.ruleset = ne;
exports.rulesheet = le;
exports.serialize = ie;
exports.sizeof = M;
exports.slice = Q;
exports.stringify = fe;
exports.strlen = A;
exports.substr = C;
exports.token = R;
exports.tokenize = W;
exports.tokenizer = Y;
exports.trim = g;
exports.whitespace = X;
exports.position = exports.line = exports.length = exports.from = exports.column = exports.characters = exports.character = exports.abs = exports.WEBKIT = exports.VIEWPORT = exports.SUPPORTS = exports.RULESET = exports.PAGE = exports.NAMESPACE = exports.MS = exports.MOZ = exports.MEDIA = exports.KEYFRAMES = exports.IMPORT = exports.FONT_FEATURE_VALUES = exports.FONT_FACE = exports.DOCUMENT = exports.DECLARATION = exports.COUNTER_STYLE = exports.COMMENT = exports.CHARSET = void 0;
var e = "-ms-";
exports.MS = e;
var r = "-moz-";
exports.MOZ = r;
var a = "-webkit-";
exports.WEBKIT = a;
var c = "comm";
exports.COMMENT = c;
var n = "rule";
exports.RULESET = n;
var t = "decl";
exports.DECLARATION = t;
var s = "@page";
exports.PAGE = s;
var u = "@media";
exports.MEDIA = u;
var i = "@import";
exports.IMPORT = i;
var f = "@charset";
exports.CHARSET = f;
var o = "@viewport";
exports.VIEWPORT = o;
var l = "@supports";
exports.SUPPORTS = l;
var v = "@document";
exports.DOCUMENT = v;
var h = "@namespace";
exports.NAMESPACE = h;
var p = "@keyframes";
exports.KEYFRAMES = p;
var b = "@font-face";
exports.FONT_FACE = b;
var w = "@counter-style";
exports.COUNTER_STYLE = w;
var $ = "@font-feature-values";
exports.FONT_FEATURE_VALUES = $;
var k = Math.abs;
exports.abs = k;
var d = String.fromCharCode;
exports.from = d;

function m(e, r) {
  return (((r << 2 ^ z(e, 0)) << 2 ^ z(e, 1)) << 2 ^ z(e, 2)) << 2 ^ z(e, 3);
}

function g(e) {
  return e.trim();
}

function x(e, r) {
  return (e = r.exec(e)) ? e[0] : e;
}

function y(e, r, a) {
  return e.replace(r, a);
}

function j(e, r) {
  return e.indexOf(r);
}

function z(e, r) {
  return e.charCodeAt(r) | 0;
}

function C(e, r, a) {
  return e.slice(r, a);
}

function A(e) {
  return e.length;
}

function M(e) {
  return e.length;
}

function O(e, r) {
  return r.push(e), e;
}

function S(e, r) {
  return e.map(r).join("");
}

var q = 1;
exports.line = q;
var B = 1;
exports.column = B;
var D = 0;
exports.length = D;
var E = 0;
exports.position = E;
var F = 0;
exports.character = F;
var G = "";
exports.characters = G;

function H(e, r, a, c, n, t, s) {
  return {
    value: e,
    root: r,
    parent: a,
    type: c,
    props: n,
    children: t,
    line: q,
    column: B,
    length: s,
    return: ""
  };
}

function I(e, r, a) {
  return H(e, r.root, r.parent, a, r.props, r.children, 0);
}

function J() {
  return F;
}

function K() {
  var _B, _q;

  exports.character = F = E > 0 ? z(G, exports.position = E = +E - 1) : 0;
  if ((_B = +B, exports.column = B = _B - 1, _B), F === 10) exports.column = B = 1, (_q = +q, exports.line = q = _q - 1, _q);
  return F;
}

function L() {
  var _E, _B2, _q2;

  exports.character = F = E < D ? z(G, (_E = +E, exports.position = E = _E + 1, _E)) : 0;
  if ((_B2 = +B, exports.column = B = _B2 + 1, _B2), F === 10) exports.column = B = 1, (_q2 = +q, exports.line = q = _q2 + 1, _q2);
  return F;
}

function N() {
  return z(G, E);
}

function P() {
  return E;
}

function Q(e, r) {
  return C(G, e, r);
}

function R(e) {
  switch (e) {
    case 0:
    case 9:
    case 10:
    case 13:
    case 32:
      return 5;

    case 33:
    case 43:
    case 44:
    case 47:
    case 62:
    case 64:
    case 126:
    case 59:
    case 123:
    case 125:
      return 4;

    case 58:
      return 3;

    case 34:
    case 39:
    case 40:
    case 91:
      return 2;

    case 41:
    case 93:
      return 1;
  }

  return 0;
}

function T(e) {
  return exports.line = q = exports.column = B = 1, exports.length = D = A(exports.characters = G = e), exports.position = E = 0, [];
}

function U(e) {
  return exports.characters = G = "", e;
}

function V(e) {
  return g(Q(E - 1, _(e === 91 ? e + 2 : e === 40 ? e + 1 : e)));
}

function W(e) {
  return U(Y(T(e)));
}

function X(e) {
  while (exports.character = F = N()) if (F < 33) L();else break;

  return R(e) > 2 || R(F) > 3 ? "" : " ";
}

function Y(e) {
  while (L()) switch (R(F)) {
    case 0:
      O(re(E - 1), e);
      break;

    case 2:
      O(V(F), e);
      break;

    default:
      O(d(F), e);
  }

  return e;
}

function Z(e, r) {
  while (--r && L()) if (F < 48 || F > 102 || F > 57 && F < 65 || F > 70 && F < 97) break;

  return Q(e, P() + (r < 6 && N() == 32 && L() == 32));
}

function _(e) {
  while (L()) switch (F) {
    case e:
      return E;

    case 34:
    case 39:
      return _(e === 34 || e === 39 ? e : F);

    case 40:
      if (e === 41) _(e);
      break;

    case 92:
      L();
      break;
  }

  return E;
}

function ee(e, r) {
  while (L()) if (e + F === 47 + 10) break;else if (e + F === 42 + 42 && N() === 47) break;

  return "/*" + Q(r, E - 1) + "*" + d(e === 47 ? e : L());
}

function re(e) {
  while (!R(N())) L();

  return Q(e, E);
}

function ae(e) {
  return U(ce("", null, null, null, [""], e = T(e), 0, [0], e));
}

function ce(e, r, a, c, n, t, s, u, i) {
  var f = 0;
  var o = 0;
  var l = s;
  var v = 0;
  var h = 0;
  var p = 0;
  var b = 1;
  var w = 1;
  var $ = 1;
  var k = 0;
  var m = "";
  var g = n;
  var x = t;
  var j = c;
  var z = m;

  while (w) switch (p = k, k = L()) {
    case 34:
    case 39:
    case 91:
    case 40:
      z += V(k);
      break;

    case 9:
    case 10:
    case 13:
    case 32:
      z += X(p);
      break;

    case 92:
      z += Z(P() - 1, 7);
      continue;

    case 47:
      switch (N()) {
        case 42:
        case 47:
          O(te(ee(L(), P()), r, a), i);
          break;

        default:
          z += "/";
      }

      break;

    case 123 * b:
      u[f++] = A(z) * $;

    case 125 * b:
    case 59:
    case 0:
      switch (k) {
        case 0:
        case 125:
          w = 0;

        case 59 + o:
          if (h > 0 && A(z) - l) O(h > 32 ? se(z + ";", c, a, l - 1) : se(y(z, " ", "") + ";", c, a, l - 2), i);
          break;

        case 59:
          z += ";";

        default:
          O(j = ne(z, r, a, f, o, n, u, m, g = [], x = [], l), t);
          if (k === 123) if (o === 0) ce(z, r, j, j, g, t, l, u, x);else switch (v) {
            case 100:
            case 109:
            case 115:
              ce(e, j, j, c && O(ne(e, j, j, 0, 0, n, u, m, n, g = [], l), x), n, x, l, u, c ? g : x);
              break;

            default:
              ce(z, j, j, j, [""], x, l, u, x);
          }
      }

      f = o = h = 0, b = $ = 1, m = z = "", l = s;
      break;

    case 58:
      l = 1 + A(z), h = p;

    default:
      if (b < 1) if (k == 123) --b;else if (k == 125 && b++ == 0 && K() == 125) continue;

      switch (z += d(k), k * b) {
        case 38:
          $ = o > 0 ? 1 : (z += "\f", -1);
          break;

        case 44:
          u[f++] = (A(z) - 1) * $, $ = 1;
          break;

        case 64:
          if (N() === 45) z += V(L());
          v = N(), o = A(m = z += re(P())), k++;
          break;

        case 45:
          if (p === 45 && A(z) == 2) b = 0;
      }

  }

  return t;
}

function ne(e, r, a, c, t, s, u, i, f, o, l) {
  var v = t - 1;
  var h = t === 0 ? s : [""];
  var p = M(h);

  for (var b = 0, w = 0, $ = 0; b < c; ++b) for (var d = 0, m = C(e, v + 1, v = k(w = u[b])), x = e; d < p; ++d) if (x = g(w > 0 ? h[d] + " " + m : y(m, /&\f/g, h[d]))) f[$++] = x;

  return H(e, r, a, t === 0 ? n : i, f, o, l);
}

function te(e, r, a) {
  return H(e, r, a, c, d(J()), C(e, 2, -2), 0);
}

function se(e, r, a, c) {
  return H(e, r, a, t, C(e, 0, c), C(e, c + 1, -1), c);
}

function ue(c, n) {
  switch (m(c, n)) {
    case 5103:
      return a + "print-" + c + c;

    case 5737:
    case 4201:
    case 3177:
    case 3433:
    case 1641:
    case 4457:
    case 2921:
    case 5572:
    case 6356:
    case 5844:
    case 3191:
    case 6645:
    case 3005:
    case 6391:
    case 5879:
    case 5623:
    case 6135:
    case 4599:
    case 4855:
    case 4215:
    case 6389:
    case 5109:
    case 5365:
    case 5621:
    case 3829:
      return a + c + c;

    case 5349:
    case 4246:
    case 4810:
    case 6968:
    case 2756:
      return a + c + r + c + e + c + c;

    case 6828:
    case 4268:
      return a + c + e + c + c;

    case 6165:
      return a + c + e + "flex-" + c + c;

    case 5187:
      return a + c + y(c, /(\w+).+(:[^]+)/, a + "box-$1$2" + e + "flex-$1$2") + c;

    case 5443:
      return a + c + e + "flex-item-" + y(c, /flex-|-self/, "") + c;

    case 4675:
      return a + c + e + "flex-line-pack" + y(c, /align-content|flex-|-self/, "") + c;

    case 5548:
      return a + c + e + y(c, "shrink", "negative") + c;

    case 5292:
      return a + c + e + y(c, "basis", "preferred-size") + c;

    case 6060:
      return a + "box-" + y(c, "-grow", "") + a + c + e + y(c, "grow", "positive") + c;

    case 4554:
      return a + y(c, /([^-])(transform)/g, "$1" + a + "$2") + c;

    case 6187:
      return y(y(y(c, /(zoom-|grab)/, a + "$1"), /(image-set)/, a + "$1"), c, "") + c;

    case 5495:
    case 3959:
      return y(c, /(image-set\([^]*)/, a + "$1" + "$`$1");

    case 4968:
      return y(y(c, /(.+:)(flex-)?(.*)/, a + "box-pack:$3" + e + "flex-pack:$3"), /s.+-b[^;]+/, "justify") + a + c + c;

    case 4095:
    case 3583:
    case 4068:
    case 2532:
      return y(c, /(.+)-inline(.+)/, a + "$1$2") + c;

    case 8116:
    case 7059:
    case 5753:
    case 5535:
    case 5445:
    case 5701:
    case 4933:
    case 4677:
    case 5533:
    case 5789:
    case 5021:
    case 4765:
      if (A(c) - 1 - n > 6) switch (z(c, n + 1)) {
        case 109:
          if (z(c, n + 4) !== 45) break;

        case 102:
          return y(c, /(.+:)(.+)-([^]+)/, "$1" + a + "$2-$3" + "$1" + r + (z(c, n + 3) == 108 ? "$3" : "$2-$3")) + c;

        case 115:
          return ~j(c, "stretch") ? ue(y(c, "stretch", "fill-available"), n) + c : c;
      }
      break;

    case 4949:
      if (z(c, n + 1) !== 115) break;

    case 6444:
      switch (z(c, A(c) - 3 - (~j(c, "!important") && 10))) {
        case 107:
          return y(c, ":", ":" + a) + c;

        case 101:
          return y(c, /(.+:)([^;!]+)(;|!.+)?/, "$1" + a + (z(c, 14) === 45 ? "inline-" : "") + "box$3" + "$1" + a + "$2$3" + "$1" + e + "$2box$3") + c;
      }

      break;

    case 5936:
      switch (z(c, n + 11)) {
        case 114:
          return a + c + e + y(c, /[svh]\w+-[tblr]{2}/, "tb") + c;

        case 108:
          return a + c + e + y(c, /[svh]\w+-[tblr]{2}/, "tb-rl") + c;

        case 45:
          return a + c + e + y(c, /[svh]\w+-[tblr]{2}/, "lr") + c;
      }

      return a + c + e + c + c;
  }

  return c;
}

function ie(e, r) {
  var a = "";
  var c = M(e);

  for (var n = 0; n < c; n++) a += r(e[n], n, e, r) || "";

  return a;
}

function fe(e, r, a, s) {
  switch (e.type) {
    case i:
    case t:
      return e.return = e.return || e.value;

    case c:
      return "";

    case n:
      e.value = e.props.join(",");
  }

  return A(a = ie(e.children, s)) ? e.return = e.value + "{" + a + "}" : "";
}

function oe(e) {
  var r = M(e);
  return function (a, c, n, t) {
    var s = "";

    for (var u = 0; u < r; u++) s += e[u](a, c, n, t) || "";

    return s;
  };
}

function le(e) {
  return function (r) {
    if (!r.root) if (r = r.return) e(r);
  };
}

function ve(c, s, u, i) {
  if (!c.return) switch (c.type) {
    case t:
      c.return = ue(c.value, c.length);
      break;

    case p:
      return ie([I(y(c.value, "@", "@" + a), c, "")], i);

    case n:
      if (c.length) return S(c.props, function (n) {
        switch (x(n, /(::plac\w+|:read-\w+)/)) {
          case ":read-only":
          case ":read-write":
            return ie([I(y(n, /:(read-\w+)/, ":" + r + "$1"), c, "")], i);

          case "::placeholder":
            return ie([I(y(n, /:(plac\w+)/, ":" + a + "input-$1"), c, ""), I(y(n, /:(plac\w+)/, ":" + r + "$1"), c, ""), I(y(n, /:(plac\w+)/, e + "input-$1"), c, "")], i);
        }

        return "";
      });
  }
}

function he(e) {
  switch (e.type) {
    case n:
      e.props = e.props.map(function (r) {
        return S(W(r), function (r, a, c) {
          switch (z(r, 0)) {
            case 12:
              return C(r, 1, A(r));

            case 0:
            case 40:
            case 43:
            case 62:
            case 126:
              return r;

            case 58:
              if (c[++a] === "global") c[a] = "", c[++a] = "\f" + C(c[a], a = 1, -1);

            case 32:
              return a === 1 ? "" : r;

            default:
              switch (a) {
                case 0:
                  e = r;
                  return M(c) > 1 ? "" : r;

                case a = M(c) - 1:
                case 2:
                  return a === 2 ? r + e + e : r + e;

                default:
                  return r;
              }

          }
        });
      });
  }
}
},{}],"../node_modules/@emotion/weak-memoize/dist/weak-memoize.browser.esm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var weakMemoize = function weakMemoize(func) {
  // $FlowFixMe flow doesn't include all non-primitive types as allowed for weakmaps
  var cache = new WeakMap();
  return function (arg) {
    if (cache.has(arg)) {
      // $FlowFixMe
      return cache.get(arg);
    }

    var ret = func(arg);
    cache.set(arg, ret);
    return ret;
  };
};

var _default = weakMemoize;
exports.default = _default;
},{}],"../node_modules/@emotion/memoize/dist/emotion-memoize.browser.esm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function memoize(fn) {
  var cache = Object.create(null);
  return function (arg) {
    if (cache[arg] === undefined) cache[arg] = fn(arg);
    return cache[arg];
  };
}

var _default = memoize;
exports.default = _default;
},{}],"../node_modules/@emotion/cache/dist/emotion-cache.browser.esm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sheet = require("@emotion/sheet");

var _stylis = require("stylis");

require("@emotion/weak-memoize");

require("@emotion/memoize");

var last = function last(arr) {
  return arr.length ? arr[arr.length - 1] : null;
};

var toRules = function toRules(parsed, points) {
  // pretend we've started with a comma
  var index = -1;
  var character = 44;

  do {
    switch ((0, _stylis.token)(character)) {
      case 0:
        // &\f
        if (character === 38 && (0, _stylis.peek)() === 12) {
          // this is not 100% correct, we don't account for literal sequences here - like for example quoted strings
          // stylis inserts \f after & to know when & where it should replace this sequence with the context selector
          // and when it should just concatenate the outer and inner selectors
          // it's very unlikely for this sequence to actually appear in a different context, so we just leverage this fact here
          points[index] = 1;
        }

        parsed[index] += (0, _stylis.identifier)(_stylis.position - 1);
        break;

      case 2:
        parsed[index] += (0, _stylis.delimit)(character);
        break;

      case 4:
        // comma
        if (character === 44) {
          // colon
          parsed[++index] = (0, _stylis.peek)() === 58 ? '&\f' : '';
          points[index] = parsed[index].length;
          break;
        }

      // fallthrough

      default:
        parsed[index] += (0, _stylis.from)(character);
    }
  } while (character = (0, _stylis.next)());

  return parsed;
};

var getRules = function getRules(value, points) {
  return (0, _stylis.dealloc)(toRules((0, _stylis.alloc)(value), points));
}; // WeakSet would be more appropriate, but only WeakMap is supported in IE11


var fixedElements = /* #__PURE__ */new WeakMap();

var compat = function compat(element) {
  if (element.type !== 'rule' || !element.parent || // .length indicates if this rule contains pseudo or not
  !element.length) {
    return;
  }

  var value = element.value,
      parent = element.parent;
  var isImplicitRule = element.column === parent.column && element.line === parent.line;

  while (parent.type !== 'rule') {
    parent = parent.parent;
    if (!parent) return;
  } // short-circuit for the simplest case


  if (element.props.length === 1 && value.charCodeAt(0) !== 58
  /* colon */
  && !fixedElements.get(parent)) {
    return;
  } // if this is an implicitly inserted rule (the one eagerly inserted at the each new nested level)
  // then the props has already been manipulated beforehand as they that array is shared between it and its "rule parent"


  if (isImplicitRule) {
    return;
  }

  fixedElements.set(element, true);
  var points = [];
  var rules = getRules(value, points);
  var parentRules = parent.props;

  for (var i = 0, k = 0; i < rules.length; i++) {
    for (var j = 0; j < parentRules.length; j++, k++) {
      element.props[k] = points[i] ? rules[i].replace(/&\f/g, parentRules[j]) : parentRules[j] + " " + rules[i];
    }
  }
};

var removeLabel = function removeLabel(element) {
  if (element.type === 'decl') {
    var value = element.value;

    if ( // charcode for l
    value.charCodeAt(0) === 108 && // charcode for b
    value.charCodeAt(2) === 98) {
      // this ignores label
      element["return"] = '';
      element.value = '';
    }
  }
};

var ignoreFlag = 'emotion-disable-server-rendering-unsafe-selector-warning-please-do-not-use-this-the-warning-exists-for-a-reason';

var isIgnoringComment = function isIgnoringComment(element) {
  return !!element && element.type === 'comm' && element.children.indexOf(ignoreFlag) > -1;
};

var createUnsafeSelectorsAlarm = function createUnsafeSelectorsAlarm(cache) {
  return function (element, index, children) {
    if (element.type !== 'rule') return;
    var unsafePseudoClasses = element.value.match(/(:first|:nth|:nth-last)-child/g);

    if (unsafePseudoClasses && cache.compat !== true) {
      var prevElement = index > 0 ? children[index - 1] : null;

      if (prevElement && isIgnoringComment(last(prevElement.children))) {
        return;
      }

      unsafePseudoClasses.forEach(function (unsafePseudoClass) {
        console.error("The pseudo class \"" + unsafePseudoClass + "\" is potentially unsafe when doing server-side rendering. Try changing it to \"" + unsafePseudoClass.split('-child')[0] + "-of-type\".");
      });
    }
  };
};

var isImportRule = function isImportRule(element) {
  return element.type.charCodeAt(1) === 105 && element.type.charCodeAt(0) === 64;
};

var isPrependedWithRegularRules = function isPrependedWithRegularRules(index, children) {
  for (var i = index - 1; i >= 0; i--) {
    if (!isImportRule(children[i])) {
      return true;
    }
  }

  return false;
}; // use this to remove incorrect elements from further processing
// so they don't get handed to the `sheet` (or anything else)
// as that could potentially lead to additional logs which in turn could be overhelming to the user


var nullifyElement = function nullifyElement(element) {
  element.type = '';
  element.value = '';
  element["return"] = '';
  element.children = '';
  element.props = '';
};

var incorrectImportAlarm = function incorrectImportAlarm(element, index, children) {
  if (!isImportRule(element)) {
    return;
  }

  if (element.parent) {
    console.error("`@import` rules can't be nested inside other rules. Please move it to the top level and put it before regular rules. Keep in mind that they can only be used within global styles.");
    nullifyElement(element);
  } else if (isPrependedWithRegularRules(index, children)) {
    console.error("`@import` rules can't be after other rules. Please put your `@import` rules before your other rules.");
    nullifyElement(element);
  }
};

var defaultStylisPlugins = [_stylis.prefixer];

var createCache = function createCache(options) {
  var key = options.key;

  if ("development" !== 'production' && !key) {
    throw new Error("You have to configure `key` for your cache. Please make sure it's unique (and not equal to 'css') as it's used for linking styles to your cache.\n" + "If multiple caches share the same key they might \"fight\" for each other's style elements.");
  }

  if (key === 'css') {
    var ssrStyles = document.querySelectorAll("style[data-emotion]:not([data-s])"); // get SSRed styles out of the way of React's hydration
    // document.head is a safe place to move them to(though note document.head is not necessarily the last place they will be)
    // note this very very intentionally targets all style elements regardless of the key to ensure
    // that creating a cache works inside of render of a React component

    Array.prototype.forEach.call(ssrStyles, function (node) {
      // we want to only move elements which have a space in the data-emotion attribute value
      // because that indicates that it is an Emotion 11 server-side rendered style elements
      // while we will already ignore Emotion 11 client-side inserted styles because of the :not([data-s]) part in the selector
      // Emotion 10 client-side inserted styles did not have data-s (but importantly did not have a space in their data-emotion attributes)
      // so checking for the space ensures that loading Emotion 11 after Emotion 10 has inserted some styles
      // will not result in the Emotion 10 styles being destroyed
      var dataEmotionAttribute = node.getAttribute('data-emotion');

      if (dataEmotionAttribute.indexOf(' ') === -1) {
        return;
      }

      document.head.appendChild(node);
      node.setAttribute('data-s', '');
    });
  }

  var stylisPlugins = options.stylisPlugins || defaultStylisPlugins;

  if ("development" !== 'production') {
    // $FlowFixMe
    if (/[^a-z-]/.test(key)) {
      throw new Error("Emotion key must only contain lower case alphabetical characters and - but \"" + key + "\" was passed");
    }
  }

  var inserted = {}; // $FlowFixMe

  var container;
  var nodesToHydrate = [];
  {
    container = options.container || document.head;
    Array.prototype.forEach.call( // this means we will ignore elements which don't have a space in them which
    // means that the style elements we're looking at are only Emotion 11 server-rendered style elements
    document.querySelectorAll("style[data-emotion^=\"" + key + " \"]"), function (node) {
      var attrib = node.getAttribute("data-emotion").split(' '); // $FlowFixMe

      for (var i = 1; i < attrib.length; i++) {
        inserted[attrib[i]] = true;
      }

      nodesToHydrate.push(node);
    });
  }

  var _insert;

  var omnipresentPlugins = [compat, removeLabel];

  if ("development" !== 'production') {
    omnipresentPlugins.push(createUnsafeSelectorsAlarm({
      get compat() {
        return cache.compat;
      }

    }), incorrectImportAlarm);
  }

  {
    var currentSheet;
    var finalizingPlugins = [_stylis.stringify, "development" !== 'production' ? function (element) {
      if (!element.root) {
        if (element["return"]) {
          currentSheet.insert(element["return"]);
        } else if (element.value && element.type !== _stylis.COMMENT) {
          // insert empty rule in non-production environments
          // so @emotion/jest can grab `key` from the (JS)DOM for caches without any rules inserted yet
          currentSheet.insert(element.value + "{}");
        }
      }
    } : (0, _stylis.rulesheet)(function (rule) {
      currentSheet.insert(rule);
    })];
    var serializer = (0, _stylis.middleware)(omnipresentPlugins.concat(stylisPlugins, finalizingPlugins));

    var stylis = function stylis(styles) {
      return (0, _stylis.serialize)((0, _stylis.compile)(styles), serializer);
    };

    _insert = function insert(selector, serialized, sheet, shouldCache) {
      currentSheet = sheet;

      if ("development" !== 'production' && serialized.map !== undefined) {
        currentSheet = {
          insert: function insert(rule) {
            sheet.insert(rule + serialized.map);
          }
        };
      }

      stylis(selector ? selector + "{" + serialized.styles + "}" : serialized.styles);

      if (shouldCache) {
        cache.inserted[serialized.name] = true;
      }
    };
  }
  var cache = {
    key: key,
    sheet: new _sheet.StyleSheet({
      key: key,
      container: container,
      nonce: options.nonce,
      speedy: options.speedy,
      prepend: options.prepend
    }),
    nonce: options.nonce,
    inserted: inserted,
    registered: {},
    insert: _insert
  };
  cache.sheet.hydrate(nodesToHydrate);
  return cache;
};

var _default = createCache;
exports.default = _default;
},{"@emotion/sheet":"../node_modules/@emotion/sheet/dist/emotion-sheet.browser.esm.js","stylis":"../node_modules/stylis/dist/stylis.mjs","@emotion/weak-memoize":"../node_modules/@emotion/weak-memoize/dist/weak-memoize.browser.esm.js","@emotion/memoize":"../node_modules/@emotion/memoize/dist/emotion-memoize.browser.esm.js"}],"../node_modules/@emotion/hash/dist/hash.browser.esm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/* eslint-disable */
// Inspired by https://github.com/garycourt/murmurhash-js
// Ported from https://github.com/aappleby/smhasher/blob/61a0530f28277f2e850bfc39600ce61d02b518de/src/MurmurHash2.cpp#L37-L86
function murmur2(str) {
  // 'm' and 'r' are mixing constants generated offline.
  // They're not really 'magic', they just happen to work well.
  // const m = 0x5bd1e995;
  // const r = 24;
  // Initialize the hash
  var h = 0; // Mix 4 bytes at a time into the hash

  var k,
      i = 0,
      len = str.length;

  for (; len >= 4; ++i, len -= 4) {
    k = str.charCodeAt(i) & 0xff | (str.charCodeAt(++i) & 0xff) << 8 | (str.charCodeAt(++i) & 0xff) << 16 | (str.charCodeAt(++i) & 0xff) << 24;
    k =
    /* Math.imul(k, m): */
    (k & 0xffff) * 0x5bd1e995 + ((k >>> 16) * 0xe995 << 16);
    k ^=
    /* k >>> r: */
    k >>> 24;
    h =
    /* Math.imul(k, m): */
    (k & 0xffff) * 0x5bd1e995 + ((k >>> 16) * 0xe995 << 16) ^
    /* Math.imul(h, m): */
    (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
  } // Handle the last few bytes of the input array


  switch (len) {
    case 3:
      h ^= (str.charCodeAt(i + 2) & 0xff) << 16;

    case 2:
      h ^= (str.charCodeAt(i + 1) & 0xff) << 8;

    case 1:
      h ^= str.charCodeAt(i) & 0xff;
      h =
      /* Math.imul(h, m): */
      (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
  } // Do a few final mixes of the hash to ensure the last few
  // bytes are well-incorporated.


  h ^= h >>> 13;
  h =
  /* Math.imul(h, m): */
  (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
  return ((h ^ h >>> 15) >>> 0).toString(36);
}

var _default = murmur2;
exports.default = _default;
},{}],"../node_modules/@emotion/unitless/dist/unitless.browser.esm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var unitlessKeys = {
  animationIterationCount: 1,
  borderImageOutset: 1,
  borderImageSlice: 1,
  borderImageWidth: 1,
  boxFlex: 1,
  boxFlexGroup: 1,
  boxOrdinalGroup: 1,
  columnCount: 1,
  columns: 1,
  flex: 1,
  flexGrow: 1,
  flexPositive: 1,
  flexShrink: 1,
  flexNegative: 1,
  flexOrder: 1,
  gridRow: 1,
  gridRowEnd: 1,
  gridRowSpan: 1,
  gridRowStart: 1,
  gridColumn: 1,
  gridColumnEnd: 1,
  gridColumnSpan: 1,
  gridColumnStart: 1,
  msGridRow: 1,
  msGridRowSpan: 1,
  msGridColumn: 1,
  msGridColumnSpan: 1,
  fontWeight: 1,
  lineHeight: 1,
  opacity: 1,
  order: 1,
  orphans: 1,
  tabSize: 1,
  widows: 1,
  zIndex: 1,
  zoom: 1,
  WebkitLineClamp: 1,
  // SVG-related properties
  fillOpacity: 1,
  floodOpacity: 1,
  stopOpacity: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1,
  strokeMiterlimit: 1,
  strokeOpacity: 1,
  strokeWidth: 1
};
var _default = unitlessKeys;
exports.default = _default;
},{}],"../node_modules/@emotion/serialize/dist/emotion-serialize.browser.esm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serializeStyles = void 0;

var _hash = _interopRequireDefault(require("@emotion/hash"));

var _unitless = _interopRequireDefault(require("@emotion/unitless"));

var _memoize = _interopRequireDefault(require("@emotion/memoize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ILLEGAL_ESCAPE_SEQUENCE_ERROR = "You have illegal escape sequence in your template literal, most likely inside content's property value.\nBecause you write your CSS inside a JavaScript string you actually have to do double escaping, so for example \"content: '\\00d7';\" should become \"content: '\\\\00d7';\".\nYou can read more about this here:\nhttps://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#ES2018_revision_of_illegal_escape_sequences";
var UNDEFINED_AS_OBJECT_KEY_ERROR = "You have passed in falsy value as style object's key (can happen when in example you pass unexported component as computed key).";
var hyphenateRegex = /[A-Z]|^ms/g;
var animationRegex = /_EMO_([^_]+?)_([^]*?)_EMO_/g;

var isCustomProperty = function isCustomProperty(property) {
  return property.charCodeAt(1) === 45;
};

var isProcessableValue = function isProcessableValue(value) {
  return value != null && typeof value !== 'boolean';
};

var processStyleName = /* #__PURE__ */(0, _memoize.default)(function (styleName) {
  return isCustomProperty(styleName) ? styleName : styleName.replace(hyphenateRegex, '-$&').toLowerCase();
});

var processStyleValue = function processStyleValue(key, value) {
  switch (key) {
    case 'animation':
    case 'animationName':
      {
        if (typeof value === 'string') {
          return value.replace(animationRegex, function (match, p1, p2) {
            cursor = {
              name: p1,
              styles: p2,
              next: cursor
            };
            return p1;
          });
        }
      }
  }

  if (_unitless.default[key] !== 1 && !isCustomProperty(key) && typeof value === 'number' && value !== 0) {
    return value + 'px';
  }

  return value;
};

if ("development" !== 'production') {
  var contentValuePattern = /(attr|counters?|url|(((repeating-)?(linear|radial))|conic)-gradient)\(|(no-)?(open|close)-quote/;
  var contentValues = ['normal', 'none', 'initial', 'inherit', 'unset'];
  var oldProcessStyleValue = processStyleValue;
  var msPattern = /^-ms-/;
  var hyphenPattern = /-(.)/g;
  var hyphenatedCache = {};

  processStyleValue = function processStyleValue(key, value) {
    if (key === 'content') {
      if (typeof value !== 'string' || contentValues.indexOf(value) === -1 && !contentValuePattern.test(value) && (value.charAt(0) !== value.charAt(value.length - 1) || value.charAt(0) !== '"' && value.charAt(0) !== "'")) {
        throw new Error("You seem to be using a value for 'content' without quotes, try replacing it with `content: '\"" + value + "\"'`");
      }
    }

    var processed = oldProcessStyleValue(key, value);

    if (processed !== '' && !isCustomProperty(key) && key.indexOf('-') !== -1 && hyphenatedCache[key] === undefined) {
      hyphenatedCache[key] = true;
      console.error("Using kebab-case for css properties in objects is not supported. Did you mean " + key.replace(msPattern, 'ms-').replace(hyphenPattern, function (str, _char) {
        return _char.toUpperCase();
      }) + "?");
    }

    return processed;
  };
}

function handleInterpolation(mergedProps, registered, interpolation) {
  if (interpolation == null) {
    return '';
  }

  if (interpolation.__emotion_styles !== undefined) {
    if ("development" !== 'production' && interpolation.toString() === 'NO_COMPONENT_SELECTOR') {
      throw new Error('Component selectors can only be used in conjunction with @emotion/babel-plugin.');
    }

    return interpolation;
  }

  switch (typeof interpolation) {
    case 'boolean':
      {
        return '';
      }

    case 'object':
      {
        if (interpolation.anim === 1) {
          cursor = {
            name: interpolation.name,
            styles: interpolation.styles,
            next: cursor
          };
          return interpolation.name;
        }

        if (interpolation.styles !== undefined) {
          var next = interpolation.next;

          if (next !== undefined) {
            // not the most efficient thing ever but this is a pretty rare case
            // and there will be very few iterations of this generally
            while (next !== undefined) {
              cursor = {
                name: next.name,
                styles: next.styles,
                next: cursor
              };
              next = next.next;
            }
          }

          var styles = interpolation.styles + ";";

          if ("development" !== 'production' && interpolation.map !== undefined) {
            styles += interpolation.map;
          }

          return styles;
        }

        return createStringFromObject(mergedProps, registered, interpolation);
      }

    case 'function':
      {
        if (mergedProps !== undefined) {
          var previousCursor = cursor;
          var result = interpolation(mergedProps);
          cursor = previousCursor;
          return handleInterpolation(mergedProps, registered, result);
        } else if ("development" !== 'production') {
          console.error('Functions that are interpolated in css calls will be stringified.\n' + 'If you want to have a css call based on props, create a function that returns a css call like this\n' + 'let dynamicStyle = (props) => css`color: ${props.color}`\n' + 'It can be called directly with props or interpolated in a styled call like this\n' + "let SomeComponent = styled('div')`${dynamicStyle}`");
        }

        break;
      }

    case 'string':
      if ("development" !== 'production') {
        var matched = [];
        var replaced = interpolation.replace(animationRegex, function (match, p1, p2) {
          var fakeVarName = "animation" + matched.length;
          matched.push("const " + fakeVarName + " = keyframes`" + p2.replace(/^@keyframes animation-\w+/, '') + "`");
          return "${" + fakeVarName + "}";
        });

        if (matched.length) {
          console.error('`keyframes` output got interpolated into plain string, please wrap it with `css`.\n\n' + 'Instead of doing this:\n\n' + [].concat(matched, ["`" + replaced + "`"]).join('\n') + '\n\nYou should wrap it with `css` like this:\n\n' + ("css`" + replaced + "`"));
        }
      }

      break;
  } // finalize string values (regular strings and functions interpolated into css calls)


  if (registered == null) {
    return interpolation;
  }

  var cached = registered[interpolation];
  return cached !== undefined ? cached : interpolation;
}

function createStringFromObject(mergedProps, registered, obj) {
  var string = '';

  if (Array.isArray(obj)) {
    for (var i = 0; i < obj.length; i++) {
      string += handleInterpolation(mergedProps, registered, obj[i]) + ";";
    }
  } else {
    for (var _key in obj) {
      var value = obj[_key];

      if (typeof value !== 'object') {
        if (registered != null && registered[value] !== undefined) {
          string += _key + "{" + registered[value] + "}";
        } else if (isProcessableValue(value)) {
          string += processStyleName(_key) + ":" + processStyleValue(_key, value) + ";";
        }
      } else {
        if (_key === 'NO_COMPONENT_SELECTOR' && "development" !== 'production') {
          throw new Error('Component selectors can only be used in conjunction with @emotion/babel-plugin.');
        }

        if (Array.isArray(value) && typeof value[0] === 'string' && (registered == null || registered[value[0]] === undefined)) {
          for (var _i = 0; _i < value.length; _i++) {
            if (isProcessableValue(value[_i])) {
              string += processStyleName(_key) + ":" + processStyleValue(_key, value[_i]) + ";";
            }
          }
        } else {
          var interpolated = handleInterpolation(mergedProps, registered, value);

          switch (_key) {
            case 'animation':
            case 'animationName':
              {
                string += processStyleName(_key) + ":" + interpolated + ";";
                break;
              }

            default:
              {
                if ("development" !== 'production' && _key === 'undefined') {
                  console.error(UNDEFINED_AS_OBJECT_KEY_ERROR);
                }

                string += _key + "{" + interpolated + "}";
              }
          }
        }
      }
    }
  }

  return string;
}

var labelPattern = /label:\s*([^\s;\n{]+)\s*(;|$)/g;
var sourceMapPattern;

if ("development" !== 'production') {
  sourceMapPattern = /\/\*#\ssourceMappingURL=data:application\/json;\S+\s+\*\//g;
} // this is the cursor for keyframes
// keyframes are stored on the SerializedStyles object as a linked list


var cursor;

var serializeStyles = function serializeStyles(args, registered, mergedProps) {
  if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null && args[0].styles !== undefined) {
    return args[0];
  }

  var stringMode = true;
  var styles = '';
  cursor = undefined;
  var strings = args[0];

  if (strings == null || strings.raw === undefined) {
    stringMode = false;
    styles += handleInterpolation(mergedProps, registered, strings);
  } else {
    if ("development" !== 'production' && strings[0] === undefined) {
      console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR);
    }

    styles += strings[0];
  } // we start at 1 since we've already handled the first arg


  for (var i = 1; i < args.length; i++) {
    styles += handleInterpolation(mergedProps, registered, args[i]);

    if (stringMode) {
      if ("development" !== 'production' && strings[i] === undefined) {
        console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR);
      }

      styles += strings[i];
    }
  }

  var sourceMap;

  if ("development" !== 'production') {
    styles = styles.replace(sourceMapPattern, function (match) {
      sourceMap = match;
      return '';
    });
  } // using a global regex with .exec is stateful so lastIndex has to be reset each time


  labelPattern.lastIndex = 0;
  var identifierName = '';
  var match; // https://esbench.com/bench/5b809c2cf2949800a0f61fb5

  while ((match = labelPattern.exec(styles)) !== null) {
    identifierName += '-' + // $FlowFixMe we know it's not null
    match[1];
  }

  var name = (0, _hash.default)(styles) + identifierName;

  if ("development" !== 'production') {
    // $FlowFixMe SerializedStyles type doesn't have toString property (and we don't want to add it)
    return {
      name: name,
      styles: styles,
      map: sourceMap,
      next: cursor,
      toString: function toString() {
        return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop).";
      }
    };
  }

  return {
    name: name,
    styles: styles,
    next: cursor
  };
};

exports.serializeStyles = serializeStyles;
},{"@emotion/hash":"../node_modules/@emotion/hash/dist/hash.browser.esm.js","@emotion/unitless":"../node_modules/@emotion/unitless/dist/unitless.browser.esm.js","@emotion/memoize":"../node_modules/@emotion/memoize/dist/emotion-memoize.browser.esm.js"}],"../node_modules/@emotion/utils/dist/emotion-utils.browser.esm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRegisteredStyles = getRegisteredStyles;
exports.insertStyles = void 0;
var isBrowser = "object" !== 'undefined';

function getRegisteredStyles(registered, registeredStyles, classNames) {
  var rawClassName = '';
  classNames.split(' ').forEach(function (className) {
    if (registered[className] !== undefined) {
      registeredStyles.push(registered[className] + ";");
    } else {
      rawClassName += className + " ";
    }
  });
  return rawClassName;
}

var insertStyles = function insertStyles(cache, serialized, isStringTag) {
  var className = cache.key + "-" + serialized.name;

  if ( // we only need to add the styles to the registered cache if the
  // class name could be used further down
  // the tree but if it's a string tag, we know it won't
  // so we don't have to add it to registered cache.
  // this improves memory usage since we can avoid storing the whole style string
  (isStringTag === false || // we need to always store it if we're in compat mode and
  // in node since emotion-server relies on whether a style is in
  // the registered cache to know whether a style is global or not
  // also, note that this check will be dead code eliminated in the browser
  isBrowser === false) && cache.registered[className] === undefined) {
    cache.registered[className] = serialized.styles;
  }

  if (cache.inserted[serialized.name] === undefined) {
    var current = serialized;

    do {
      var maybeStyles = cache.insert(serialized === current ? "." + className : '', current, cache.sheet, true);
      current = current.next;
    } while (current !== undefined);
  }
};

exports.insertStyles = insertStyles;
},{}],"../node_modules/@emotion/css/create-instance/dist/emotion-css-create-instance.esm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _cache = _interopRequireDefault(require("@emotion/cache"));

var _serialize = require("@emotion/serialize");

var _utils = require("@emotion/utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function insertWithoutScoping(cache, serialized) {
  if (cache.inserted[serialized.name] === undefined) {
    return cache.insert('', serialized, cache.sheet, true);
  }
}

function merge(registered, css, className) {
  var registeredStyles = [];
  var rawClassName = (0, _utils.getRegisteredStyles)(registered, registeredStyles, className);

  if (registeredStyles.length < 2) {
    return className;
  }

  return rawClassName + css(registeredStyles);
}

var createEmotion = function createEmotion(options) {
  var cache = (0, _cache.default)(options); // $FlowFixMe

  cache.sheet.speedy = function (value) {
    if ("development" !== 'production' && this.ctr !== 0) {
      throw new Error('speedy must be changed before any rules are inserted');
    }

    this.isSpeedy = value;
  };

  cache.compat = true;

  var css = function css() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var serialized = (0, _serialize.serializeStyles)(args, cache.registered, undefined);
    (0, _utils.insertStyles)(cache, serialized, false);
    return cache.key + "-" + serialized.name;
  };

  var keyframes = function keyframes() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    var serialized = (0, _serialize.serializeStyles)(args, cache.registered);
    var animation = "animation-" + serialized.name;
    insertWithoutScoping(cache, {
      name: serialized.name,
      styles: "@keyframes " + animation + "{" + serialized.styles + "}"
    });
    return animation;
  };

  var injectGlobal = function injectGlobal() {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    var serialized = (0, _serialize.serializeStyles)(args, cache.registered);
    insertWithoutScoping(cache, serialized);
  };

  var cx = function cx() {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    return merge(cache.registered, css, classnames(args));
  };

  return {
    css: css,
    cx: cx,
    injectGlobal: injectGlobal,
    keyframes: keyframes,
    hydrate: function hydrate(ids) {
      ids.forEach(function (key) {
        cache.inserted[key] = true;
      });
    },
    flush: function flush() {
      cache.registered = {};
      cache.inserted = {};
      cache.sheet.flush();
    },
    // $FlowFixMe
    sheet: cache.sheet,
    cache: cache,
    getRegisteredStyles: _utils.getRegisteredStyles.bind(null, cache.registered),
    merge: merge.bind(null, cache.registered, css)
  };
};

var classnames = function classnames(args) {
  var cls = '';

  for (var i = 0; i < args.length; i++) {
    var arg = args[i];
    if (arg == null) continue;
    var toAdd = void 0;

    switch (typeof arg) {
      case 'boolean':
        break;

      case 'object':
        {
          if (Array.isArray(arg)) {
            toAdd = classnames(arg);
          } else {
            toAdd = '';

            for (var k in arg) {
              if (arg[k] && k) {
                toAdd && (toAdd += ' ');
                toAdd += k;
              }
            }
          }

          break;
        }

      default:
        {
          toAdd = arg;
        }
    }

    if (toAdd) {
      cls && (cls += ' ');
      cls += toAdd;
    }
  }

  return cls;
};

var _default = createEmotion;
exports.default = _default;
},{"@emotion/cache":"../node_modules/@emotion/cache/dist/emotion-cache.browser.esm.js","@emotion/serialize":"../node_modules/@emotion/serialize/dist/emotion-serialize.browser.esm.js","@emotion/utils":"../node_modules/@emotion/utils/dist/emotion-utils.browser.esm.js"}],"../node_modules/@emotion/css/dist/emotion-css.esm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sheet = exports.merge = exports.keyframes = exports.injectGlobal = exports.hydrate = exports.getRegisteredStyles = exports.flush = exports.cx = exports.css = exports.cache = void 0;

require("@emotion/cache");

require("@emotion/serialize");

require("@emotion/utils");

var _emotionCssCreateInstanceEsm = _interopRequireDefault(require("../create-instance/dist/emotion-css-create-instance.esm.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _createEmotion = (0, _emotionCssCreateInstanceEsm.default)({
  key: 'css'
}),
    flush = _createEmotion.flush,
    hydrate = _createEmotion.hydrate,
    cx = _createEmotion.cx,
    merge = _createEmotion.merge,
    getRegisteredStyles = _createEmotion.getRegisteredStyles,
    injectGlobal = _createEmotion.injectGlobal,
    keyframes = _createEmotion.keyframes,
    css = _createEmotion.css,
    sheet = _createEmotion.sheet,
    cache = _createEmotion.cache;

exports.cache = cache;
exports.sheet = sheet;
exports.css = css;
exports.keyframes = keyframes;
exports.injectGlobal = injectGlobal;
exports.getRegisteredStyles = getRegisteredStyles;
exports.merge = merge;
exports.cx = cx;
exports.hydrate = hydrate;
exports.flush = flush;
},{"@emotion/cache":"../node_modules/@emotion/cache/dist/emotion-cache.browser.esm.js","@emotion/serialize":"../node_modules/@emotion/serialize/dist/emotion-serialize.browser.esm.js","@emotion/utils":"../node_modules/@emotion/utils/dist/emotion-utils.browser.esm.js","../create-instance/dist/emotion-css-create-instance.esm.js":"../node_modules/@emotion/css/create-instance/dist/emotion-css-create-instance.esm.js"}],"define.js":[function(require,module,exports) {
'use strict';

var _domql = _interopRequireDefault(require("@rackai/domql"));

var _utils = require("@rackai/domql/src/utils");

var _mixins = require("@rackai/domql/src/element/mixins");

var _css = require("@emotion/css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var style = function style(params, element, node) {
  if (params) {
    if ((0, _utils.isObjectLike)(element.class)) element.class.style = params;else element.class = {
      style: params
    };
  }

  classf(element.class, element, node);
};

var classf = function classf(params, element, node) {
  if ((0, _utils.isObjectLike)(params)) {
    var classObjHelper = {};

    for (var key in params) {
      var prop = (0, _utils.exec)(params[key], element);
      var CSSed = (0, _css.css)(prop);
      classObjHelper[key] = CSSed;
    }

    (0, _mixins.classList)(classObjHelper, element, node);
  }
};

_domql.default.define({
  style: style,
  class: classf
}, {
  overwrite: true
});
},{"@rackai/domql":"../node_modules/@rackai/domql/src/index.js","@rackai/domql/src/utils":"../node_modules/@rackai/domql/src/utils/index.js","@rackai/domql/src/element/mixins":"../node_modules/@rackai/domql/src/element/mixins/index.js","@emotion/css":"../node_modules/@emotion/css/dist/emotion-css.esm.js"}],"style.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  fontFamily: '"Helvetica", "Arial", --system-default',
  padding: '7.5vh 7.5vw',
  background: 'black',
  color: 'white',
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  overflow: 'auto'
};
exports.default = _default;
},{}],"../node_modules/@rackai/scratch/src/config/sequence.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  'minor-second': 1.067,
  'major-second': 1.125,
  'minor-third': 1.2,
  'major-third': 1.25,
  'perfect-fourth': 1.333,
  'augmented-fourth': 1.414,
  'perfect-fifth': 1.5,
  'phi': 1.618,
  // golden-ratio
  'square-root-3': 1.73205,
  // theodorus
  'square-root-5': 2.23,
  // pythagoras
  'pi': 3.14 // archimedes

};
exports.default = _default;
},{}],"../node_modules/@rackai/scratch/src/config/color.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var proto = {
  name: '',
  value: '',
  themes: {}
};
var _default = {};
exports.default = _default;
},{}],"../node_modules/@rackai/scratch/src/config/theme.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var themeA = {
  text: 'blue',
  background: 'white',
  border: 'black',
  // .opacity(0.2),
  helpers: [],
  themes: {},
  inverse: {} // schemeAInverse

};
var _default = {};
exports.default = _default;
},{}],"../node_modules/@rackai/scratch/src/config/box.js":[function(require,module,exports) {

},{}],"../node_modules/@rackai/scratch/src/config/size.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequence = _interopRequireDefault(require("./sequence"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  base: 16,
  ratio: _sequence.default['phi']
};
exports.default = _default;
},{"./sequence":"../node_modules/@rackai/scratch/src/config/sequence.js"}],"../node_modules/@rackai/scratch/src/config/typography.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {};
exports.default = _default;
},{}],"../node_modules/@rackai/scratch/src/config/unit.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = 'px';
exports.default = _default;
},{}],"../node_modules/@rackai/scratch/src/config/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Sequence", {
  enumerable: true,
  get: function () {
    return _sequence.default;
  }
});
Object.defineProperty(exports, "Color", {
  enumerable: true,
  get: function () {
    return _color.default;
  }
});
Object.defineProperty(exports, "Theme", {
  enumerable: true,
  get: function () {
    return _theme.default;
  }
});
Object.defineProperty(exports, "Box", {
  enumerable: true,
  get: function () {
    return _box.default;
  }
});
Object.defineProperty(exports, "Size", {
  enumerable: true,
  get: function () {
    return _size.default;
  }
});
Object.defineProperty(exports, "Typography", {
  enumerable: true,
  get: function () {
    return _typography.default;
  }
});
Object.defineProperty(exports, "Unit", {
  enumerable: true,
  get: function () {
    return _unit.default;
  }
});

var _sequence = _interopRequireDefault(require("./sequence"));

var _color = _interopRequireDefault(require("./color"));

var _theme = _interopRequireDefault(require("./theme"));

var _box = _interopRequireDefault(require("./box"));

var _size = _interopRequireDefault(require("./size"));

var _typography = _interopRequireDefault(require("./typography"));

var _unit = _interopRequireDefault(require("./unit"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./sequence":"../node_modules/@rackai/scratch/src/config/sequence.js","./color":"../node_modules/@rackai/scratch/src/config/color.js","./theme":"../node_modules/@rackai/scratch/src/config/theme.js","./box":"../node_modules/@rackai/scratch/src/config/box.js","./size":"../node_modules/@rackai/scratch/src/config/size.js","./typography":"../node_modules/@rackai/scratch/src/config/typography.js","./unit":"../node_modules/@rackai/scratch/src/config/unit.js"}],"../node_modules/@rackai/scratch/src/utils/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFontFace = exports.setCustomFont = exports.getFontFormat = exports.opacify = exports.mixTwoRGBA = exports.mixTwoRGB = exports.hexToRGBA = exports.hexToRGB = exports.mixTwoColors = exports.colorStringToRGBAArray = exports.merge = void 0;

const merge = (obj, original) => {
  for (const e in original) {
    const objProp = obj[e];
    const originalProp = original[e];

    if (objProp === undefined) {
      obj[e] = originalProp;
    }
  }

  return obj;
};

exports.merge = merge;

const colorStringToRGBAArray = color => {
  if (color === '') return;
  if (color.toLowerCase() === 'transparent') return [0, 0, 0, 0]; // convert #RGB and #RGBA to #RRGGBB and #RRGGBBAA

  if (color[0] === '#') {
    if (color.length < 7) {
      color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3] + (color.length > 4 ? color[4] + color[4] : '');
    }

    return [parseInt(color.substr(1, 2), 16), parseInt(color.substr(3, 2), 16), parseInt(color.substr(5, 2), 16), color.length > 7 ? parseInt(color.substr(7, 2), 16) / 255 : 1];
  } // convert named colors


  if (color.indexOf('rgb') === -1) {
    // intentionally use unknown tag to lower chances of css rule override with !important
    var elem = document.body.appendChild(document.createElement('fictum')); // this flag tested on chrome 59, ff 53, ie9, ie10, ie11, edge 14

    var flag = 'rgb(1, 2, 3)';
    elem.style.color = flag; // color set failed - some monstrous css rule is probably taking over the color of our object

    if (elem.style.color !== flag) return;
    elem.style.color = color;
    if (elem.style.color === flag || elem.style.color === '') return; // color parse failed

    color = window.getComputedStyle(elem).color;
    document.body.removeChild(elem);
  } // convert 'rgb(R,G,B)' to 'rgb(R,G,B)A' which looks awful but will pass the regxep below


  if (color.indexOf('rgb') === 0) {
    if (color.indexOf('rgba') === -1) color = `${color}, 1`;
    return color.match(/[\.\d]+/g).map(a => +a); // eslint-disable-line
  }
};

exports.colorStringToRGBAArray = colorStringToRGBAArray;

const mixTwoColors = (colorA, colorB, range = 0.5) => {
  colorA = colorStringToRGBAArray(colorA);
  colorB = colorStringToRGBAArray(colorB);
  return mixTwoRGBA(colorA, colorB, range);
};

exports.mixTwoColors = mixTwoColors;

const hexToRGB = (hex, alpha = 1) => {
  const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
  return `rgb(${r},${g},${b})`;
};

exports.hexToRGB = hexToRGB;

const hexToRGBA = (hex, alpha = 1) => {
  const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
  return `rgba(${r},${g},${b},${alpha})`;
};

exports.hexToRGBA = hexToRGBA;

const mixTwoRGB = (colorA, colorB, range = 0.5) => {
  let arr = [];

  for (let i = 0; i < 3; i++) {
    arr[i] = Math.round(colorA[i] + (colorB[i] - colorA[i]) * range);
  }

  return `rgb(${arr})`;
};

exports.mixTwoRGB = mixTwoRGB;

const mixTwoRGBA = (colorA, colorB, range = 0.5) => {
  let arr = [];

  for (let i = 0; i < 4; i++) {
    let round = i === 3 ? x => x : Math.round;
    arr[i] = round(colorA[i] + (colorB[i] - colorA[i]) * range);
  }

  return `rgba(${arr})`;
};

exports.mixTwoRGBA = mixTwoRGBA;

const opacify = (color, opacity) => {
  let arr = colorStringToRGBAArray(color);
  arr[3] = opacity;
  return `rgba(${arr})`;
};

exports.opacify = opacify;

const getFontFormat = url => url.split(/[#?]/)[0].split('.').pop().trim();

exports.getFontFormat = getFontFormat;

const setCustomFont = (name, weight, url) => `@font-face {
  font-family: '${name}';
  font-style: normal;
  font-weight: ${weight};
  src: url('${url}') format('${getFontFormat(url)}');
}`;

exports.setCustomFont = setCustomFont;

const getFontFace = Library => {
  var fonts = '';

  for (var name in Library) {
    var font = Library[name];

    for (var weight in font) {
      var url = font[weight];
      fonts += `\n${setCustomFont(name, weight, url)}`;
    }
  }

  return fonts;
};

exports.getFontFace = getFontFace;
},{}],"../node_modules/@rackai/scratch/src/methods/set.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _config = require("../config");

var _utils = require("../utils");

var set = (kind, ...props) => {
  if (kind === 'color') {
    props.map(value => {
      var {
        name,
        ...rest
      } = value;
      _config.Color[name] = rest;
    });
    return _config.Color;
  } else if (kind === 'theme') {
    props.map(value => {
      var {
        name,
        ...rest
      } = value;
      _config.Theme[name] = rest;
    });
    return _config.Theme;
  } else if (kind === 'typography') {
    props.map(value => {
      var {
        name
      } = value;
      delete value.name;
      _config.Typography[name] = value;
    });
    return (0, _utils.getFontFace)(_config.Typography);
  }
};

var _default = set;
exports.default = _default;
},{"../config":"../node_modules/@rackai/scratch/src/config/index.js","../utils":"../node_modules/@rackai/scratch/src/utils/index.js"}],"../node_modules/@rackai/scratch/src/methods/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "set", {
  enumerable: true,
  get: function () {
    return _set.default;
  }
});

var _set = _interopRequireDefault(require("./set"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./set":"../node_modules/@rackai/scratch/src/methods/set.js"}],"../node_modules/@rackai/scratch/src/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "set", {
  enumerable: true,
  get: function () {
    return _methods.set;
  }
});
Object.defineProperty(exports, "Sequence", {
  enumerable: true,
  get: function () {
    return _config.Sequence;
  }
});
Object.defineProperty(exports, "Color", {
  enumerable: true,
  get: function () {
    return _config.Color;
  }
});
Object.defineProperty(exports, "Theme", {
  enumerable: true,
  get: function () {
    return _config.Theme;
  }
});
Object.defineProperty(exports, "Box", {
  enumerable: true,
  get: function () {
    return _config.Box;
  }
});
Object.defineProperty(exports, "Size", {
  enumerable: true,
  get: function () {
    return _config.Size;
  }
});
Object.defineProperty(exports, "Typography", {
  enumerable: true,
  get: function () {
    return _config.Typography;
  }
});
Object.defineProperty(exports, "Unit", {
  enumerable: true,
  get: function () {
    return _config.Unit;
  }
});
Object.defineProperty(exports, "colorStringToRGBAArray", {
  enumerable: true,
  get: function () {
    return _utils.colorStringToRGBAArray;
  }
});
Object.defineProperty(exports, "opacify", {
  enumerable: true,
  get: function () {
    return _utils.opacify;
  }
});
Object.defineProperty(exports, "mixTwoColors", {
  enumerable: true,
  get: function () {
    return _utils.mixTwoColors;
  }
});
Object.defineProperty(exports, "hexToRGB", {
  enumerable: true,
  get: function () {
    return _utils.hexToRGB;
  }
});
Object.defineProperty(exports, "hexToRGBA", {
  enumerable: true,
  get: function () {
    return _utils.hexToRGBA;
  }
});
Object.defineProperty(exports, "mixTwoRGB", {
  enumerable: true,
  get: function () {
    return _utils.mixTwoRGB;
  }
});
Object.defineProperty(exports, "mixTwoRGBA", {
  enumerable: true,
  get: function () {
    return _utils.mixTwoRGBA;
  }
});
Object.defineProperty(exports, "getFontFormat", {
  enumerable: true,
  get: function () {
    return _utils.getFontFormat;
  }
});
Object.defineProperty(exports, "setCustomFont", {
  enumerable: true,
  get: function () {
    return _utils.setCustomFont;
  }
});
Object.defineProperty(exports, "getFontFace", {
  enumerable: true,
  get: function () {
    return _utils.getFontFace;
  }
});

var _methods = require("./methods");

var _config = require("./config");

var _utils = require("./utils");
},{"./methods":"../node_modules/@rackai/scratch/src/methods/index.js","./config":"../node_modules/@rackai/scratch/src/config/index.js","./utils":"../node_modules/@rackai/scratch/src/utils/index.js"}],"../node_modules/@rackai/symbols/src/Shape/style.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shape = exports.tagShape = exports.toolTipShape = exports.depth = exports.default = void 0;

var _scratch = require("@rackai/scratch");

var _default = {
  boxSizing: 'border-box'
};
exports.default = _default;
const depth = {
  4: {
    boxShadow: `rgba(0,0,0,.10) 0 2${_scratch.Unit} 4${_scratch.Unit}`
  },
  6: {
    boxShadow: `rgba(0,0,0,.10) 0 3${_scratch.Unit} 6${_scratch.Unit}`
  },
  10: {
    boxShadow: `rgba(0,0,0,.10) 0 4${_scratch.Unit} 10${_scratch.Unit}`
  },
  16: {
    boxShadow: `rgba(0,0,0,.10) 0 8${_scratch.Unit} 16${_scratch.Unit}`
  },
  26: {
    boxShadow: `rgba(0,0,0,.10) 0 14${_scratch.Unit} 26${_scratch.Unit}`
  },
  42: {
    boxShadow: `rgba(0,0,0,.10) 0 20${_scratch.Unit} 42${_scratch.Unit}`
  }
};
exports.depth = depth;
const toolTipShape = {
  top: {
    position: 'relative',
    '&:before': {
      content: '""',
      display: 'block',
      width: '0px',
      height: '0px',
      border: '6px solid white',
      borderRadius: '2px',
      position: 'absolute',
      top: '2px',
      left: '50%',
      transform: 'translate(-50%, -50%) rotate(45deg)'
    }
  },
  right: {
    position: 'relative',
    '&:before': {
      content: '""',
      display: 'block',
      width: '0px',
      height: '0px',
      border: '6px solid white',
      borderRadius: '2px',
      position: 'absolute',
      top: '50%',
      right: '-10px',
      transform: 'translate(-50%, -50%) rotate(45deg)'
    }
  },
  bottom: {
    position: 'relative',
    '&:before': {
      content: '""',
      display: 'block',
      width: '0px',
      height: '0px',
      border: '6px solid white',
      borderRadius: '2px',
      position: 'absolute',
      bottom: '-10px',
      left: '50%',
      transform: 'translate(-50%, -50%) rotate(45deg)'
    }
  },
  left: {
    position: 'relative',
    '&:before': {
      content: '""',
      display: 'block',
      width: '0px',
      height: '0px',
      border: '6px solid white',
      borderRadius: '2px',
      position: 'absolute',
      top: '50%',
      left: '2px',
      transform: 'translate(-50%, -50%) rotate(45deg)'
    }
  }
};
exports.toolTipShape = toolTipShape;
const tagShape = {
  top: {
    position: 'relative',
    '&:before': {
      content: '""',
      display: 'block',
      width: '0',
      height: '0',
      background: 'white',
      border: '16px solid white',
      borderRadius: '6px',
      position: 'absolute',
      top: '5px',
      left: '50%',
      transform: 'translate(-50%, -50%) rotate(45deg)'
    }
  },
  right: {
    position: 'relative',
    '&:before': {
      content: '""',
      display: 'block',
      width: '0',
      height: '0',
      background: 'white',
      border: '16px solid white',
      borderRadius: '6px',
      position: 'absolute',
      top: '50%',
      left: '37px',
      transform: 'translate(-50%, -50%) rotate(45deg)'
    }
  },
  bottom: {
    position: 'relative',
    '&:before': {
      content: '""',
      display: 'block',
      width: '0',
      height: '0',
      background: 'white',
      border: '16px solid white',
      borderRadius: '6px',
      position: 'absolute',
      bottom: '-27px',
      left: '50%',
      transform: 'translate(-50%, -50%) rotate(45deg)'
    }
  },
  left: {
    position: 'relative',
    '&:before': {
      content: '""',
      display: 'block',
      width: '0',
      height: '0',
      background: 'white',
      border: '16px solid white',
      borderRadius: '6px',
      position: 'absolute',
      top: '50%',
      left: '5px',
      transform: 'translate(-50%, -50%) rotate(45deg)'
    }
  }
};
exports.tagShape = tagShape;
const shape = {
  rectangle: {},
  circle: {
    borderRadius: '100%'
  },
  bubble: {},
  tooltip: {
    background: 'red'
  }
};
exports.shape = shape;
},{"@rackai/scratch":"../node_modules/@rackai/scratch/src/index.js"}],"../node_modules/@rackai/symbols/src/Shape/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _scratch = require("@rackai/scratch");

var _style = _interopRequireWildcard(require("./style"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const Shape = {
  style: _style.default,
  define: {
    shape: param => param || '',
    toolTipShape: param => param || '',
    tagShape: param => param || '',
    depth: param => param !== undefined ? param : 10,
    round: param => param !== undefined ? param : 6,
    theme: param => {
      const themes = Object.keys(_scratch.Theme);
      return themes.indexOf(param) >= 0 ? param : themes.transparent;
    }
  },
  class: {
    toolTipShape: element => _style.toolTipShape[element.toolTipShape],
    tagShape: element => _style.tagShape[element.tagShape],
    shape: element => _style.shape[element.shape],
    depth: element => _style.depth[element.depth],
    round: element => ({
      borderRadius: element.round
    }),
    theme: element => _scratch.Theme[element.theme]
  } // mode: {
  //   dark: {
  //     theme: 'white'
  //   }
  // }
  // theme: {
  //   default: 'primary',
  //   dark: 'whiteish'
  // }
  // size: {
  //   default: 'auto',
  //   mobile: 'fit'
  // }
  // spacing: {
  //   default: ratio.phi,
  //   mobile: ratio.perfect
  // }

};
var _default = Shape;
exports.default = _default;
},{"@rackai/scratch":"../node_modules/@rackai/scratch/src/index.js","./style":"../node_modules/@rackai/symbols/src/Shape/style.js"}],"../node_modules/@rackai/symbols/src/Direction/style.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  ltr: {
    direction: 'ltr'
  },
  rtl: {
    direction: 'rtl'
  }
};
exports.default = _default;
},{}],"../node_modules/@rackai/symbols/src/Direction/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _style = _interopRequireDefault(require("./style"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  define: {
    direction: param => param || 'ltr'
  },
  class: {
    direction: element => _style.default[element.direction]
  }
};
exports.default = _default;
},{"./style":"../node_modules/@rackai/symbols/src/Direction/style.js"}],"../node_modules/@rackai/symbols/src/SVG/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var useSVGSymbol = file => `<use xlink:href="${file}" />`; // create icon


var _default = {
  tag: 'svg',
  attr: {
    'xmlns': 'http://www.w3.org/2000/svg',
    'xmlns:xlink': 'http://www.w3.org/1999/xlink'
  },
  define: {
    src: param => param
  },
  html: element => useSVGSymbol(element.src || element.key)
};
exports.default = _default;
},{}],"../node_modules/@rackai/symbols/src/Icon/svg/arrow-regular/arrow-regular-down.svg":[function(require,module,exports) {
module.exports="/arrow-regular-down.8ebe3459.svg";
},{}],"../node_modules/@rackai/symbols/src/Icon/svg/arrow-regular/arrow-regular-right.svg":[function(require,module,exports) {
module.exports="/arrow-regular-right.6414f72d.svg";
},{}],"../node_modules/@rackai/symbols/src/Icon/svg/arrow-regular/arrow-regular-left.svg":[function(require,module,exports) {
module.exports="/arrow-regular-left.4256d358.svg";
},{}],"../node_modules/@rackai/symbols/src/Icon/svg/arrow-regular/arrow-regular-up.svg":[function(require,module,exports) {
module.exports="/arrow-regular-up.a7ca07fa.svg";
},{}],"../node_modules/@rackai/symbols/src/Icon/svg/arrow-regular/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "arrowRegularDown", {
  enumerable: true,
  get: function () {
    return _arrowRegularDown.default;
  }
});
Object.defineProperty(exports, "arrowRegularRight", {
  enumerable: true,
  get: function () {
    return _arrowRegularRight.default;
  }
});
Object.defineProperty(exports, "arrowRegularLeft", {
  enumerable: true,
  get: function () {
    return _arrowRegularLeft.default;
  }
});
Object.defineProperty(exports, "arrowRegularUp", {
  enumerable: true,
  get: function () {
    return _arrowRegularUp.default;
  }
});

var _arrowRegularDown = _interopRequireDefault(require("./arrow-regular-down.svg"));

var _arrowRegularRight = _interopRequireDefault(require("./arrow-regular-right.svg"));

var _arrowRegularLeft = _interopRequireDefault(require("./arrow-regular-left.svg"));

var _arrowRegularUp = _interopRequireDefault(require("./arrow-regular-up.svg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./arrow-regular-down.svg":"../node_modules/@rackai/symbols/src/Icon/svg/arrow-regular/arrow-regular-down.svg","./arrow-regular-right.svg":"../node_modules/@rackai/symbols/src/Icon/svg/arrow-regular/arrow-regular-right.svg","./arrow-regular-left.svg":"../node_modules/@rackai/symbols/src/Icon/svg/arrow-regular/arrow-regular-left.svg","./arrow-regular-up.svg":"../node_modules/@rackai/symbols/src/Icon/svg/arrow-regular/arrow-regular-up.svg"}],"../node_modules/@rackai/symbols/src/Icon/svg/arrow-medium/arrow-medium-down.svg":[function(require,module,exports) {
module.exports="/arrow-medium-down.47595db9.svg";
},{}],"../node_modules/@rackai/symbols/src/Icon/svg/arrow-medium/arrow-medium-right.svg":[function(require,module,exports) {
module.exports="/arrow-medium-right.ffc1b07a.svg";
},{}],"../node_modules/@rackai/symbols/src/Icon/svg/arrow-medium/arrow-medium-left.svg":[function(require,module,exports) {
module.exports="/arrow-medium-left.d9eea20d.svg";
},{}],"../node_modules/@rackai/symbols/src/Icon/svg/arrow-medium/arrow-medium-up.svg":[function(require,module,exports) {
module.exports="/arrow-medium-up.dd193981.svg";
},{}],"../node_modules/@rackai/symbols/src/Icon/svg/arrow-medium/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "arrowMediumDown", {
  enumerable: true,
  get: function () {
    return _arrowMediumDown.default;
  }
});
Object.defineProperty(exports, "arrowMediumRight", {
  enumerable: true,
  get: function () {
    return _arrowMediumRight.default;
  }
});
Object.defineProperty(exports, "arrowMediumLeft", {
  enumerable: true,
  get: function () {
    return _arrowMediumLeft.default;
  }
});
Object.defineProperty(exports, "arrowMediumUp", {
  enumerable: true,
  get: function () {
    return _arrowMediumUp.default;
  }
});

var _arrowMediumDown = _interopRequireDefault(require("./arrow-medium-down.svg"));

var _arrowMediumRight = _interopRequireDefault(require("./arrow-medium-right.svg"));

var _arrowMediumLeft = _interopRequireDefault(require("./arrow-medium-left.svg"));

var _arrowMediumUp = _interopRequireDefault(require("./arrow-medium-up.svg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./arrow-medium-down.svg":"../node_modules/@rackai/symbols/src/Icon/svg/arrow-medium/arrow-medium-down.svg","./arrow-medium-right.svg":"../node_modules/@rackai/symbols/src/Icon/svg/arrow-medium/arrow-medium-right.svg","./arrow-medium-left.svg":"../node_modules/@rackai/symbols/src/Icon/svg/arrow-medium/arrow-medium-left.svg","./arrow-medium-up.svg":"../node_modules/@rackai/symbols/src/Icon/svg/arrow-medium/arrow-medium-up.svg"}],"../node_modules/@rackai/symbols/src/Icon/svg/arrow-bold/arrow-bold-down.svg":[function(require,module,exports) {
module.exports="/arrow-bold-down.f165488a.svg";
},{}],"../node_modules/@rackai/symbols/src/Icon/svg/arrow-bold/arrow-bold-right.svg":[function(require,module,exports) {
module.exports="/arrow-bold-right.e557687c.svg";
},{}],"../node_modules/@rackai/symbols/src/Icon/svg/arrow-bold/arrow-bold-left.svg":[function(require,module,exports) {
module.exports="/arrow-bold-left.1b8d0015.svg";
},{}],"../node_modules/@rackai/symbols/src/Icon/svg/arrow-bold/arrow-bold-up.svg":[function(require,module,exports) {
module.exports="/arrow-bold-up.5356883d.svg";
},{}],"../node_modules/@rackai/symbols/src/Icon/svg/arrow-bold/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "arrowBoldDown", {
  enumerable: true,
  get: function () {
    return _arrowBoldDown.default;
  }
});
Object.defineProperty(exports, "arrowBoldRight", {
  enumerable: true,
  get: function () {
    return _arrowBoldRight.default;
  }
});
Object.defineProperty(exports, "arrowBoldLeft", {
  enumerable: true,
  get: function () {
    return _arrowBoldLeft.default;
  }
});
Object.defineProperty(exports, "arrowBoldUp", {
  enumerable: true,
  get: function () {
    return _arrowBoldUp.default;
  }
});

var _arrowBoldDown = _interopRequireDefault(require("./arrow-bold-down.svg"));

var _arrowBoldRight = _interopRequireDefault(require("./arrow-bold-right.svg"));

var _arrowBoldLeft = _interopRequireDefault(require("./arrow-bold-left.svg"));

var _arrowBoldUp = _interopRequireDefault(require("./arrow-bold-up.svg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./arrow-bold-down.svg":"../node_modules/@rackai/symbols/src/Icon/svg/arrow-bold/arrow-bold-down.svg","./arrow-bold-right.svg":"../node_modules/@rackai/symbols/src/Icon/svg/arrow-bold/arrow-bold-right.svg","./arrow-bold-left.svg":"../node_modules/@rackai/symbols/src/Icon/svg/arrow-bold/arrow-bold-left.svg","./arrow-bold-up.svg":"../node_modules/@rackai/symbols/src/Icon/svg/arrow-bold/arrow-bold-up.svg"}],"../node_modules/@rackai/symbols/src/Icon/svg/arrow-oval/arrow-oval-down.svg":[function(require,module,exports) {
module.exports="/arrow-oval-down.9a6ef352.svg";
},{}],"../node_modules/@rackai/symbols/src/Icon/svg/arrow-oval/arrow-oval-right.svg":[function(require,module,exports) {
module.exports="/arrow-oval-right.25bfa3dd.svg";
},{}],"../node_modules/@rackai/symbols/src/Icon/svg/arrow-oval/arrow-oval-left.svg":[function(require,module,exports) {
module.exports="/arrow-oval-left.e78500bd.svg";
},{}],"../node_modules/@rackai/symbols/src/Icon/svg/arrow-oval/arrow-oval-up.svg":[function(require,module,exports) {
module.exports="/arrow-oval-up.5513f43a.svg";
},{}],"../node_modules/@rackai/symbols/src/Icon/svg/arrow-oval/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "arrowOvalDown", {
  enumerable: true,
  get: function () {
    return _arrowOvalDown.default;
  }
});
Object.defineProperty(exports, "arrowOvalRight", {
  enumerable: true,
  get: function () {
    return _arrowOvalRight.default;
  }
});
Object.defineProperty(exports, "arrowOvalLeft", {
  enumerable: true,
  get: function () {
    return _arrowOvalLeft.default;
  }
});
Object.defineProperty(exports, "arrowOvalUp", {
  enumerable: true,
  get: function () {
    return _arrowOvalUp.default;
  }
});

var _arrowOvalDown = _interopRequireDefault(require("./arrow-oval-down.svg"));

var _arrowOvalRight = _interopRequireDefault(require("./arrow-oval-right.svg"));

var _arrowOvalLeft = _interopRequireDefault(require("./arrow-oval-left.svg"));

var _arrowOvalUp = _interopRequireDefault(require("./arrow-oval-up.svg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./arrow-oval-down.svg":"../node_modules/@rackai/symbols/src/Icon/svg/arrow-oval/arrow-oval-down.svg","./arrow-oval-right.svg":"../node_modules/@rackai/symbols/src/Icon/svg/arrow-oval/arrow-oval-right.svg","./arrow-oval-left.svg":"../node_modules/@rackai/symbols/src/Icon/svg/arrow-oval/arrow-oval-left.svg","./arrow-oval-up.svg":"../node_modules/@rackai/symbols/src/Icon/svg/arrow-oval/arrow-oval-up.svg"}],"../node_modules/@rackai/symbols/src/Icon/svg/arrow-mirroring-bold/arrow-mirroring-bold-shrink - horizontal.svg":[function(require,module,exports) {
module.exports="/arrow-mirroring-bold-shrink - horizontal.9472e077.svg";
},{}],"../node_modules/@rackai/symbols/src/Icon/svg/arrow-mirroring-bold/arrow-mirroring-bold-shrink - vertical.svg":[function(require,module,exports) {
module.exports="/arrow-mirroring-bold-shrink - vertical.c0a0d661.svg";
},{}],"../node_modules/@rackai/symbols/src/Icon/svg/arrow-mirroring-bold/arrow-mirroring-bold-spread - horizontal.svg":[function(require,module,exports) {
module.exports="/arrow-mirroring-bold-spread - horizontal.8f674780.svg";
},{}],"../node_modules/@rackai/symbols/src/Icon/svg/arrow-mirroring-bold/arrow-mirroring-bold-spread - vertical.svg":[function(require,module,exports) {
module.exports="/arrow-mirroring-bold-spread - vertical.84523e6e.svg";
},{}],"../node_modules/@rackai/symbols/src/Icon/svg/arrow-mirroring-bold/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "arrowMirroringShrinkHorizontal", {
  enumerable: true,
  get: function () {
    return _arrowMirroringBoldShrinkHorizontal.default;
  }
});
Object.defineProperty(exports, "arrowMirroringShrinkVertical", {
  enumerable: true,
  get: function () {
    return _arrowMirroringBoldShrinkVertical.default;
  }
});
Object.defineProperty(exports, "arrowMirroringSpreadHorizontal", {
  enumerable: true,
  get: function () {
    return _arrowMirroringBoldSpreadHorizontal.default;
  }
});
Object.defineProperty(exports, "arrowMirroringSpreadVertical", {
  enumerable: true,
  get: function () {
    return _arrowMirroringBoldSpreadVertical.default;
  }
});

var _arrowMirroringBoldShrinkHorizontal = _interopRequireDefault(require("./arrow-mirroring-bold-shrink - horizontal.svg"));

var _arrowMirroringBoldShrinkVertical = _interopRequireDefault(require("./arrow-mirroring-bold-shrink - vertical.svg"));

var _arrowMirroringBoldSpreadHorizontal = _interopRequireDefault(require("./arrow-mirroring-bold-spread - horizontal.svg"));

var _arrowMirroringBoldSpreadVertical = _interopRequireDefault(require("./arrow-mirroring-bold-spread - vertical.svg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./arrow-mirroring-bold-shrink - horizontal.svg":"../node_modules/@rackai/symbols/src/Icon/svg/arrow-mirroring-bold/arrow-mirroring-bold-shrink - horizontal.svg","./arrow-mirroring-bold-shrink - vertical.svg":"../node_modules/@rackai/symbols/src/Icon/svg/arrow-mirroring-bold/arrow-mirroring-bold-shrink - vertical.svg","./arrow-mirroring-bold-spread - horizontal.svg":"../node_modules/@rackai/symbols/src/Icon/svg/arrow-mirroring-bold/arrow-mirroring-bold-spread - horizontal.svg","./arrow-mirroring-bold-spread - vertical.svg":"../node_modules/@rackai/symbols/src/Icon/svg/arrow-mirroring-bold/arrow-mirroring-bold-spread - vertical.svg"}],"../node_modules/@rackai/symbols/src/Icon/svg/arrow-mirroring-medium/arrow-mirroring-medium-shrink - horizontal.svg":[function(require,module,exports) {
module.exports="/arrow-mirroring-medium-shrink - horizontal.1185f0d0.svg";
},{}],"../node_modules/@rackai/symbols/src/Icon/svg/arrow-mirroring-medium/arrow-mirroring-medium-shrink - vertical.svg":[function(require,module,exports) {
module.exports="/arrow-mirroring-medium-shrink - vertical.52eee823.svg";
},{}],"../node_modules/@rackai/symbols/src/Icon/svg/arrow-mirroring-medium/arrow-mirroring-medium-spread - horizontal.svg":[function(require,module,exports) {
module.exports="/arrow-mirroring-medium-spread - horizontal.aec7aeb6.svg";
},{}],"../node_modules/@rackai/symbols/src/Icon/svg/arrow-mirroring-medium/arrow-mirroring-medium-spread - vertical.svg":[function(require,module,exports) {
module.exports="/arrow-mirroring-medium-spread - vertical.3d8b22dc.svg";
},{}],"../node_modules/@rackai/symbols/src/Icon/svg/arrow-mirroring-medium/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "arrowMirroringMediumShrinkHorizontal", {
  enumerable: true,
  get: function () {
    return _arrowMirroringMediumShrinkHorizontal.default;
  }
});
Object.defineProperty(exports, "arrowMirroringMediumShrinkVertical", {
  enumerable: true,
  get: function () {
    return _arrowMirroringMediumShrinkVertical.default;
  }
});
Object.defineProperty(exports, "arrowMirroringMediumSpreadHorizontal", {
  enumerable: true,
  get: function () {
    return _arrowMirroringMediumSpreadHorizontal.default;
  }
});
Object.defineProperty(exports, "arrowMirroringMediumSpreadVertical", {
  enumerable: true,
  get: function () {
    return _arrowMirroringMediumSpreadVertical.default;
  }
});

var _arrowMirroringMediumShrinkHorizontal = _interopRequireDefault(require("./arrow-mirroring-medium-shrink - horizontal.svg"));

var _arrowMirroringMediumShrinkVertical = _interopRequireDefault(require("./arrow-mirroring-medium-shrink - vertical.svg"));

var _arrowMirroringMediumSpreadHorizontal = _interopRequireDefault(require("./arrow-mirroring-medium-spread - horizontal.svg"));

var _arrowMirroringMediumSpreadVertical = _interopRequireDefault(require("./arrow-mirroring-medium-spread - vertical.svg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./arrow-mirroring-medium-shrink - horizontal.svg":"../node_modules/@rackai/symbols/src/Icon/svg/arrow-mirroring-medium/arrow-mirroring-medium-shrink - horizontal.svg","./arrow-mirroring-medium-shrink - vertical.svg":"../node_modules/@rackai/symbols/src/Icon/svg/arrow-mirroring-medium/arrow-mirroring-medium-shrink - vertical.svg","./arrow-mirroring-medium-spread - horizontal.svg":"../node_modules/@rackai/symbols/src/Icon/svg/arrow-mirroring-medium/arrow-mirroring-medium-spread - horizontal.svg","./arrow-mirroring-medium-spread - vertical.svg":"../node_modules/@rackai/symbols/src/Icon/svg/arrow-mirroring-medium/arrow-mirroring-medium-spread - vertical.svg"}],"../node_modules/@rackai/symbols/src/Icon/svg/arrow-mirroring-extrabold/arrow-mirroring-extrabold-shrink - horizontal.svg":[function(require,module,exports) {
module.exports="/arrow-mirroring-extrabold-shrink - horizontal.a650ff71.svg";
},{}],"../node_modules/@rackai/symbols/src/Icon/svg/arrow-mirroring-extrabold/arrow-mirroring-extrabold-shrink - vertical.svg":[function(require,module,exports) {
module.exports="/arrow-mirroring-extrabold-shrink - vertical.b8c55759.svg";
},{}],"../node_modules/@rackai/symbols/src/Icon/svg/arrow-mirroring-extrabold/arrow-mirroring-extrabold-spread - horizontal.svg":[function(require,module,exports) {
module.exports="/arrow-mirroring-extrabold-spread - horizontal.f66da34c.svg";
},{}],"../node_modules/@rackai/symbols/src/Icon/svg/arrow-mirroring-extrabold/arrow-mirroring-extrabold-spread - vertical.svg":[function(require,module,exports) {
module.exports="/arrow-mirroring-extrabold-spread - vertical.799f8d35.svg";
},{}],"../node_modules/@rackai/symbols/src/Icon/svg/arrow-mirroring-extrabold/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "arrowMirroringExtraBoldShrinkHorizontal", {
  enumerable: true,
  get: function () {
    return _arrowMirroringExtraboldShrinkHorizontal.default;
  }
});
Object.defineProperty(exports, "arrowMirroringExtraBoldShrinkVertical", {
  enumerable: true,
  get: function () {
    return _arrowMirroringExtraboldShrinkVertical.default;
  }
});
Object.defineProperty(exports, "arrowMirroringExtraBoldSpreadHorizontal", {
  enumerable: true,
  get: function () {
    return _arrowMirroringExtraboldSpreadHorizontal.default;
  }
});
Object.defineProperty(exports, "arrowMirroringExtraBoldSpreadVertical", {
  enumerable: true,
  get: function () {
    return _arrowMirroringExtraboldSpreadVertical.default;
  }
});

var _arrowMirroringExtraboldShrinkHorizontal = _interopRequireDefault(require("./arrow-mirroring-extrabold-shrink - horizontal.svg"));

var _arrowMirroringExtraboldShrinkVertical = _interopRequireDefault(require("./arrow-mirroring-extrabold-shrink - vertical.svg"));

var _arrowMirroringExtraboldSpreadHorizontal = _interopRequireDefault(require("./arrow-mirroring-extrabold-spread - horizontal.svg"));

var _arrowMirroringExtraboldSpreadVertical = _interopRequireDefault(require("./arrow-mirroring-extrabold-spread - vertical.svg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./arrow-mirroring-extrabold-shrink - horizontal.svg":"../node_modules/@rackai/symbols/src/Icon/svg/arrow-mirroring-extrabold/arrow-mirroring-extrabold-shrink - horizontal.svg","./arrow-mirroring-extrabold-shrink - vertical.svg":"../node_modules/@rackai/symbols/src/Icon/svg/arrow-mirroring-extrabold/arrow-mirroring-extrabold-shrink - vertical.svg","./arrow-mirroring-extrabold-spread - horizontal.svg":"../node_modules/@rackai/symbols/src/Icon/svg/arrow-mirroring-extrabold/arrow-mirroring-extrabold-spread - horizontal.svg","./arrow-mirroring-extrabold-spread - vertical.svg":"../node_modules/@rackai/symbols/src/Icon/svg/arrow-mirroring-extrabold/arrow-mirroring-extrabold-spread - vertical.svg"}],"../node_modules/@rackai/symbols/src/Icon/svg/check-regular/default.svg":[function(require,module,exports) {
module.exports="/default.7f59341a.svg";
},{}],"../node_modules/@rackai/symbols/src/Icon/svg/check-regular/oval.svg":[function(require,module,exports) {
module.exports="/oval.5a21a04e.svg";
},{}],"../node_modules/@rackai/symbols/src/Icon/svg/check-regular/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "checkRegular", {
  enumerable: true,
  get: function () {
    return _default.default;
  }
});
Object.defineProperty(exports, "checkRegularOval", {
  enumerable: true,
  get: function () {
    return _oval.default;
  }
});

var _default = _interopRequireDefault(require("./default.svg"));

var _oval = _interopRequireDefault(require("./oval.svg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./default.svg":"../node_modules/@rackai/symbols/src/Icon/svg/check-regular/default.svg","./oval.svg":"../node_modules/@rackai/symbols/src/Icon/svg/check-regular/oval.svg"}],"../node_modules/@rackai/symbols/src/Icon/svg/check-medium/default.svg":[function(require,module,exports) {
module.exports="/default.7856faac.svg";
},{}],"../node_modules/@rackai/symbols/src/Icon/svg/check-medium/oval-outline.svg":[function(require,module,exports) {
module.exports="/oval-outline.cb7a7ce3.svg";
},{}],"../node_modules/@rackai/symbols/src/Icon/svg/check-medium/round-outline.svg":[function(require,module,exports) {
module.exports="/round-outline.02d2a0b9.svg";
},{}],"../node_modules/@rackai/symbols/src/Icon/svg/check-medium/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "checkMedium", {
  enumerable: true,
  get: function () {
    return _default.default;
  }
});
Object.defineProperty(exports, "checkMediumOvalOutline", {
  enumerable: true,
  get: function () {
    return _ovalOutline.default;
  }
});
Object.defineProperty(exports, "checkMediumRoundOutline", {
  enumerable: true,
  get: function () {
    return _roundOutline.default;
  }
});

var _default = _interopRequireDefault(require("./default.svg"));

var _ovalOutline = _interopRequireDefault(require("./oval-outline.svg"));

var _roundOutline = _interopRequireDefault(require("./round-outline.svg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./default.svg":"../node_modules/@rackai/symbols/src/Icon/svg/check-medium/default.svg","./oval-outline.svg":"../node_modules/@rackai/symbols/src/Icon/svg/check-medium/oval-outline.svg","./round-outline.svg":"../node_modules/@rackai/symbols/src/Icon/svg/check-medium/round-outline.svg"}],"../node_modules/@rackai/symbols/src/Icon/svg/check-bold/default.svg":[function(require,module,exports) {
module.exports="/default.d4b89404.svg";
},{}],"../node_modules/@rackai/symbols/src/Icon/svg/check-bold/oval.svg":[function(require,module,exports) {
module.exports="/oval.1ac3ad63.svg";
},{}],"../node_modules/@rackai/symbols/src/Icon/svg/check-bold/oval-outline.svg":[function(require,module,exports) {
module.exports="/oval-outline.e6d7f323.svg";
},{}],"../node_modules/@rackai/symbols/src/Icon/svg/check-bold/round.svg":[function(require,module,exports) {
module.exports="/round.dba8b70a.svg";
},{}],"../node_modules/@rackai/symbols/src/Icon/svg/check-bold/round-outline.svg":[function(require,module,exports) {
module.exports="/round-outline.a525e796.svg";
},{}],"../node_modules/@rackai/symbols/src/Icon/svg/check-bold/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "checkBold", {
  enumerable: true,
  get: function () {
    return _default.default;
  }
});
Object.defineProperty(exports, "checkBoldOval", {
  enumerable: true,
  get: function () {
    return _oval.default;
  }
});
Object.defineProperty(exports, "checkBoldOvalOutline", {
  enumerable: true,
  get: function () {
    return _ovalOutline.default;
  }
});
Object.defineProperty(exports, "checkBoldRound", {
  enumerable: true,
  get: function () {
    return _round.default;
  }
});
Object.defineProperty(exports, "checkBoldRoundOutline", {
  enumerable: true,
  get: function () {
    return _roundOutline.default;
  }
});

var _default = _interopRequireDefault(require("./default.svg"));

var _oval = _interopRequireDefault(require("./oval.svg"));

var _ovalOutline = _interopRequireDefault(require("./oval-outline.svg"));

var _round = _interopRequireDefault(require("./round.svg"));

var _roundOutline = _interopRequireDefault(require("./round-outline.svg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./default.svg":"../node_modules/@rackai/symbols/src/Icon/svg/check-bold/default.svg","./oval.svg":"../node_modules/@rackai/symbols/src/Icon/svg/check-bold/oval.svg","./oval-outline.svg":"../node_modules/@rackai/symbols/src/Icon/svg/check-bold/oval-outline.svg","./round.svg":"../node_modules/@rackai/symbols/src/Icon/svg/check-bold/round.svg","./round-outline.svg":"../node_modules/@rackai/symbols/src/Icon/svg/check-bold/round-outline.svg"}],"../node_modules/@rackai/symbols/src/Icon/svg/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var arrowRegular = _interopRequireWildcard(require("./arrow-regular"));

var arrowMedium = _interopRequireWildcard(require("./arrow-medium"));

var arrowBold = _interopRequireWildcard(require("./arrow-bold"));

var arrowOval = _interopRequireWildcard(require("./arrow-oval"));

var arrowMirroringLight = _interopRequireWildcard(require("./arrow-mirroring-bold"));

var arrowMirroringBold = arrowMirroringLight;

var arrowMirroringMedium = _interopRequireWildcard(require("./arrow-mirroring-medium"));

var arrowMirroringExtraBold = _interopRequireWildcard(require("./arrow-mirroring-extrabold"));

var checkRegular = _interopRequireWildcard(require("./check-regular"));

var checkMedium = _interopRequireWildcard(require("./check-medium"));

var checkBold = _interopRequireWildcard(require("./check-bold"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var _default = { ...arrowBold,
  ...arrowMedium,
  ...arrowRegular,
  ...arrowOval,
  ...arrowMirroringLight,
  ...arrowMirroringMedium,
  ...arrowMirroringBold,
  ...arrowMirroringExtraBold,
  ...checkRegular,
  ...checkMedium,
  ...checkBold
};
exports.default = _default;
},{"./arrow-regular":"../node_modules/@rackai/symbols/src/Icon/svg/arrow-regular/index.js","./arrow-medium":"../node_modules/@rackai/symbols/src/Icon/svg/arrow-medium/index.js","./arrow-bold":"../node_modules/@rackai/symbols/src/Icon/svg/arrow-bold/index.js","./arrow-oval":"../node_modules/@rackai/symbols/src/Icon/svg/arrow-oval/index.js","./arrow-mirroring-bold":"../node_modules/@rackai/symbols/src/Icon/svg/arrow-mirroring-bold/index.js","./arrow-mirroring-medium":"../node_modules/@rackai/symbols/src/Icon/svg/arrow-mirroring-medium/index.js","./arrow-mirroring-extrabold":"../node_modules/@rackai/symbols/src/Icon/svg/arrow-mirroring-extrabold/index.js","./check-regular":"../node_modules/@rackai/symbols/src/Icon/svg/check-regular/index.js","./check-medium":"../node_modules/@rackai/symbols/src/Icon/svg/check-medium/index.js","./check-bold":"../node_modules/@rackai/symbols/src/Icon/svg/check-bold/index.js"}],"../node_modules/@rackai/symbols/src/Icon/style.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  width: '1em',
  height: '1em',
  fill: 'currentColor',
  display: 'inline-block'
};
exports.default = _default;
},{}],"../node_modules/@rackai/symbols/src/Icon/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _svg = _interopRequireDefault(require("./svg"));

var _style = _interopRequireDefault(require("./style"));

var _SVG = _interopRequireDefault(require("../SVG"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  proto: _SVG.default,
  style: _style.default,
  define: {
    sprite: param => param,
    name: param => param
  },
  sprite: _svg.default,
  src: element => element.sprite[element.name || element.key],
  attr: {
    viewBox: '0 0 16 16'
  }
};
exports.default = _default;
},{"./svg":"../node_modules/@rackai/symbols/src/Icon/svg/index.js","./style":"../node_modules/@rackai/symbols/src/Icon/style.js","../SVG":"../node_modules/@rackai/symbols/src/SVG/index.js"}],"../node_modules/@rackai/symbols/src/Img/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  tag: 'img',
  define: {
    src: param => param,
    alt: param => param || '',
    title: param => param || ''
  },
  attr: {
    src: element => element.src,
    alt: element => element.alt,
    title: element => element.title || element.alt
  }
};
exports.default = _default;
},{}],"../node_modules/@rackai/symbols/src/Link/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  tag: 'a',
  define: {
    href: param => param,
    target: param => param,
    aria: param => param || {}
  },
  attr: {
    href: element => element.href,
    target: element => element.target,
    'aria-label': element => element.aria.label || element.text
  }
};
exports.default = _default;
},{}],"../node_modules/@rackai/symbols/src/IconText/style.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.size = void 0;

var _scratch = require("@rackai/scratch");

const size = {
  default: {
    height: `${Math.pow(_scratch.Size.ratio, 2)}em`,
    padding: `0 ${_scratch.Size.ratio}em`,
    fontSize: `${_scratch.Size.base}${_scratch.Unit}`,
    lineHeight: `${_scratch.Size.base}${_scratch.Unit}`
  }
};
exports.size = size;
var _default = {
  display: 'flex',
  alignItems: 'center',
  alignContent: 'center',
  lineHeight: 1,
  '> svg': {// marginInlineEnd: `${0.35}em`
  }
};
exports.default = _default;
},{"@rackai/scratch":"../node_modules/@rackai/scratch/src/index.js"}],"../node_modules/@rackai/symbols/src/IconText/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ = require("../");

var _style = _interopRequireWildcard(require("./style"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var _default = {
  style: _style.default,
  define: {
    icon: param => param || 'arrowMediumDown',
    size: param => param || 'default'
  },
  class: {
    size: element => _style.size[element.size]
  },
  _icon: {
    proto: _.Icon,
    name: element => element.parent.icon
  },
  text: ''
};
exports.default = _default;
},{"../":"../node_modules/@rackai/symbols/src/index.js","./style":"../node_modules/@rackai/symbols/src/IconText/style.js"}],"../node_modules/@rackai/symbols/src/Input/style.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  fontSize: '1em'
};
exports.default = _default;
},{}],"../node_modules/@rackai/symbols/src/Input/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ = require("..");

var _style = _interopRequireDefault(require("./style"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  proto: _.Shape,
  tag: 'input',
  style: _style.default,
  define: {
    placeholder: param => param,
    value: param => param,
    type: param => param
  },
  attr: {
    placeholder: element => element.placeholder,
    value: element => element.value,
    type: element => element.type
  },
  round: 26
};
exports.default = _default;
},{"..":"../node_modules/@rackai/symbols/src/index.js","./style":"../node_modules/@rackai/symbols/src/Input/style.js"}],"../node_modules/@rackai/symbols/src/Field/style.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _scratch = require("@rackai/scratch");

const primaryFont = Object.keys(_scratch.Typography)[0];
const defaultFont = primaryFont || '--system-default';
var _default = {
  appearance: 'none',
  outline: 0,
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'inherit',
  height: '42px',
  boxSizing: 'border-box',
  position: 'relative',
  padding: 0,
  input: {
    width: '100%',
    height: '100%',
    paddingLeft: '22px',
    border: 'none',
    fontSize: '16px'
  },
  svg: {
    position: 'absolute',
    right: '16px',
    fontSize: '16px'
  }
};
exports.default = _default;
},{"@rackai/scratch":"../node_modules/@rackai/scratch/src/index.js"}],"../node_modules/@rackai/symbols/src/Field/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ = require("../");

var _style = _interopRequireDefault(require("./style"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  proto: [_.Shape, _.IconText],
  style: _style.default,
  round: 26,
  theme: 'white',
  input: {
    proto: _.Input,
    round: 26,
    attr: {
      value: el => el.parent.value
    }
  }
};
exports.default = _default;
},{"../":"../node_modules/@rackai/symbols/src/index.js","./style":"../node_modules/@rackai/symbols/src/Field/style.js"}],"../node_modules/@rackai/symbols/src/Button/style.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _scratch = require("@rackai/scratch");

const primaryFont = Object.keys(_scratch.Typography)[0];
const defaultFont = primaryFont || '--system-default';
var _default = {
  appearance: 'none',
  border: 'none',
  outline: 0,
  padding: 0,
  cursor: 'pointer',
  height: 'fit-content',
  fontFamily: 'inherit',
  fontSize: '1.6em',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center'
};
exports.default = _default;
},{"@rackai/scratch":"../node_modules/@rackai/scratch/src/index.js"}],"../node_modules/@rackai/symbols/src/Button/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.KangorooButton = exports.CircleButton = exports.SquareButton = void 0;

var _ = require("../");

var _style = _interopRequireDefault(require("./style"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Button = {
  tag: 'button',
  proto: [_.Shape, _.IconText, _.Direction],
  style: _style.default
};
const SquareButton = {
  proto: Button,
  style: {
    justifyContent: 'center',
    width: '1em',
    height: '1em',
    boxSizing: 'content-box'
  }
};
exports.SquareButton = SquareButton;
const CircleButton = {
  proto: SquareButton,
  style: {
    borderRadius: '100%'
  }
};
exports.CircleButton = CircleButton;
const KangorooButton = {
  proto: Button,
  span: {
    proto: [_.Shape, _.IconText, _.Direction]
  }
};
exports.KangorooButton = KangorooButton;
var _default = Button;
exports.default = _default;
},{"../":"../node_modules/@rackai/symbols/src/index.js","./style":"../node_modules/@rackai/symbols/src/Button/style.js"}],"../node_modules/@rackai/symbols/src/ToolBar/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Button = require("../Button");

var _Shape = _interopRequireDefault(require("../Shape"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  tag: 'nav',
  proto: [_Shape.default],
  style: {
    display: 'flex'
  },
  childProto: {
    proto: _Button.SquareButton,
    round: 12,
    theme: 'transparent'
  }
};
exports.default = _default;
},{"../Button":"../node_modules/@rackai/symbols/src/Button/index.js","../Shape":"../node_modules/@rackai/symbols/src/Shape/index.js"}],"../node_modules/@rackai/symbols/src/User/style.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.styleUserBundle = exports.styleUser = void 0;
const styleUser = {
  cursor: 'pointer',
  width: '26px',
  height: '26px',
  borderRadius: '100%'
};
exports.styleUser = styleUser;
const styleUserBundle = {
  display: 'flex',
  alignItems: 'center',
  fontSize: '1.4em',
  textTransform: 'capitalize',
  '> div': {
    display: 'flex',
    marginRight: '16px',
    '> img': {
      marginRight: '-8px'
    }
  }
};
exports.styleUserBundle = styleUserBundle;
},{}],"../node_modules/@rackai/symbols/src/User/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.UserBundle = void 0;

var _style = require("./style");

const User = {
  style: _style.styleUser,
  tag: 'img',
  attr: {
    src: 'https://p194.p3.n0.cdn.getcloudapp.com/items/yAubz2KN/IMG_2375.jpg?v=c59a92ea47a959e386e952c3d84c08e5'
  }
};
const UserBundle = {
  style: _style.styleUserBundle,
  users: {
    childProto: User,
    ...[{}]
  },
  span: 'join classroom'
};
exports.UserBundle = UserBundle;
var _default = User;
exports.default = _default;
},{"./style":"../node_modules/@rackai/symbols/src/User/style.js"}],"../node_modules/@rackai/symbols/src/Banner/style.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.styleParentMode = void 0;
const styleParentMode = {
  boxSizing: 'border-box',
  padding: '3.6em 1.6em 4em 3.6em',
  position: 'relative',
  display: 'block',
  width: '700px',
  '> svg': {
    position: 'absolute',
    top: '1.2em',
    right: '1.2em',
    color: 'rgba(215, 100, 185, .2)'
  },
  '> div': {
    alignItems: 'flex-start',
    '> div': {
      marginTop: '4px'
    }
  },
  h2: {
    fontSize: '2em',
    margin: 0,
    marginBottom: '10px'
  },
  span: {
    maxWidth: `${314 / 14}em`,
    lineHeight: '22px'
  }
};
exports.styleParentMode = styleParentMode;
},{}],"../node_modules/@rackai/symbols/src/Banner/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parentMode = void 0;

var _ = require("../");

var _User = require("../User");

var _style = require("./style");

const parentMode = {
  proto: _.Shape,
  round: 10,
  theme: 'purple',
  style: _style.styleParentMode,
  icon: {
    proto: _.Icon,
    name: 'checkMedium'
  },
  h2: 'Welcome to parent Mode',
  description: {
    proto: _User.UserBundle,
    users: { ...[{}, {}, {}]
    },
    span: 'You’ll now be able to chat with tutor privately. No other participants will see the messages.'
  }
};
exports.parentMode = parentMode;
},{"../":"../node_modules/@rackai/symbols/src/index.js","../User":"../node_modules/@rackai/symbols/src/User/index.js","./style":"../node_modules/@rackai/symbols/src/Banner/style.js"}],"../node_modules/@rackai/symbols/src/GridLayouts/style.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.styleGrid = void 0;
const styleGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(15, 1fr)',
  boxSizing: 'border-box',
  padding: '0 8em',
  marginBottom: '2em',
  rowGap: '10px',
  gridAutoColumns: 'auto',
  gridAutoRows: 'auto',
  gridAutoFlow: 'column',
  '> a': {
    padding: '70px 0',
    display: 'flex',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, .05)',
    borderRadius: '12px',
    alignItems: 'center'
  },
  '> a:first-child': {
    gridColumn: '1 / span 15'
  },
  '> a:nth-child(2)': {
    gridRow: '2',
    gridColumn: '1 / span 3',
    marginRight: '10px'
  },
  '> a:nth-child(3)': {
    gridRow: '2',
    gridColumn: '4 / span 6',
    marginRight: '10px'
  },
  '> a:nth-child(4)': {
    gridRow: '2',
    gridColumn: '10 / span 15'
  },
  '> a:nth-child(5)': {
    gridRow: '3',
    gridColumn: '1 / span 6',
    marginRight: '10px'
  },
  '> a:nth-child(6)': {
    gridRow: '3',
    gridColumn: '7 / span 15'
  }
};
exports.styleGrid = styleGrid;
},{}],"../node_modules/@rackai/symbols/src/GridLayouts/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.grid2 = exports.grid = void 0;

var _symbols = require("@rackai/symbols");

var _style = require("./style");

let componentLink = {
  proto: _symbols.Link,
  attr: {
    href: '#'
  }
};
const grid = {
  style: _style.styleGrid
};
exports.grid = grid;
const grid2 = {
  style: _style.styleGrid2
};
exports.grid2 = grid2;
},{"@rackai/symbols":"../node_modules/@rackai/symbols/src/index.js","./style":"../node_modules/@rackai/symbols/src/GridLayouts/style.js"}],"../node_modules/@rackai/symbols/src/Tool/style.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.styleTool = exports.styleRangeSlider = void 0;

var _scratch = require("@rackai/scratch");

const styleRangeSlider = {
  appearance: 'none',
  width: '70px',
  height: '2px',
  outline: 'none',
  marginRight: '8px',
  flex: 1,
  '&::-webkit-slider-thumb': {
    boxSizing: 'content-box',
    appearance: 'none',
    width: '8px',
    height: '8px',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderRadius: '100%',
    opacity: '.8'
  }
};
exports.styleRangeSlider = styleRangeSlider;
const styleTool = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingLeft: '.4em',
  paddingRight: '.4em',
  background: 'rgba(255, 255, 255, .06)',
  width: '18em',
  height: '2.8em',
  '> button': {
    width: `${20 / 16}em`,
    height: `${20 / 16}em`,
    background: 'rgba(255, 255, 255, .06)',
    color: 'rgba(255, 255, 255, .55)'
  },
  span: {
    fontSize: '1.3em',
    flex: 1
  }
};
exports.styleTool = styleTool;
},{"@rackai/scratch":"../node_modules/@rackai/scratch/src/index.js"}],"../node_modules/@rackai/symbols/src/Tool/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SelectTool = exports.RangeSliderTool = void 0;

var _ = require("..");

var Scratch = _interopRequireWildcard(require("@rackai/scratch"));

var _style = require("./style");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

Scratch.set('theme', {
  name: 'sliderThumb',
  backgroundColor: Scratch.opacify('#fff', 0.2),
  '&::-webkit-slider-thumb': {
    background: '#232526',
    borderColor: Scratch.opacify('#454646', 0.75)
  },
  '&:hover': {
    '&::-webkit-slider-thumb': {
      borderColor: Scratch.opacify('#fff', 0.35)
    }
  },
  '&:focus, &:active': {
    '&::-webkit-slider-thumb': {
      borderColor: '#3C6AC0'
    }
  }
});
const RangeSlider = {
  proto: _.Shape,
  tag: 'input',
  theme: 'sliderThumb',
  style: _style.styleRangeSlider,
  attr: {
    type: 'range'
  }
};
const RangeSliderTool = {
  class: {
    styleTool: _style.styleTool
  },
  proto: _.Shape,
  round: 6,
  less: {
    proto: _.SquareButton,
    icon: 'minus'
  },
  value: {
    tag: 'span',
    style: {
      margin: '0 8px'
    }
  },
  range: {
    proto: RangeSlider
  },
  more: {
    proto: _.SquareButton,
    icon: 'plus'
  }
};
exports.RangeSliderTool = RangeSliderTool;
const SelectTool = {
  class: {
    styleTool: _style.styleTool
  },
  proto: _.Shape,
  theme: 'greyWhite',
  span: 'Font Size',
  button: {
    proto: _.SquareButton
  }
};
exports.SelectTool = SelectTool;
},{"..":"../node_modules/@rackai/symbols/src/index.js","@rackai/scratch":"../node_modules/@rackai/scratch/src/index.js","./style":"../node_modules/@rackai/symbols/src/Tool/style.js"}],"../node_modules/@rackai/symbols/src/Notification/style.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  padding: `${12 / 16}em ${26 / 16}em ${12 / 16}em ${18 / 26}em`,
  borderBottomLeftRadius: '4px',
  alignItems: 'flex-start',
  height: 'fit-content',
  svg: {
    background: 'rgba(0, 0, 0, .6)',
    color: 'white',
    borderRadius: '100%',
    marginRight: '6px',
    padding: '2px'
  },
  caption: {
    fontSize: '1em',
    fontWeight: 'bold',
    whiteSpace: 'nowrap'
  },
  p: {
    margin: 0,
    fontSize: `${13 / 16}em`,
    marginTop: '4px'
  }
};
exports.default = _default;
},{}],"../node_modules/@rackai/symbols/src/Notification/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ = require("../");

var _style = _interopRequireDefault(require("./style"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  style: _style.default,
  proto: [_.Shape, _.IconText, _.Direction],
  _icon: {},
  icon: 'info',
  article: {
    caption: 'Notification',
    p: 'is not always a distraction'
  }
};
exports.default = _default;
},{"../":"../node_modules/@rackai/symbols/src/index.js","./style":"../node_modules/@rackai/symbols/src/Notification/style.js"}],"../node_modules/@rackai/symbols/src/Dropdown/style.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.styleSelectDropdown = exports.styleRowActive = exports.styleRow = exports.styleDropDown = void 0;
const styleDropDown = {
  listStyleType: 'none',
  background: 'white',
  padding: '4px',
  maxHeight: '17.6em'
};
exports.styleDropDown = styleDropDown;
const styleRow = {
  fontSize: '1.6em',
  height: `${42 / 16}em`,
  width: `${178 / 16}em`,
  position: 'relative',
  color: 'black',
  padding: 0,
  span: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 10px',
    margin: '0 6px',
    svg: {
      display: 'none'
    }
  },
  '&:not(:last-child) > span': {
    borderBottom: '.5px solid rgba(0, 0, 0, .12)'
  }
};
exports.styleRow = styleRow;
const styleRowActive = {
  background: 'rgba(200, 236, 250, 1)',
  borderRadius: '6px',
  '&:not(:last-child) > span': {
    borderBottom: 'none'
  },
  'span > svg': {
    display: 'inline'
  }
};
exports.styleRowActive = styleRowActive;
const styleSelectDropdown = {
  color: 'red'
};
exports.styleSelectDropdown = styleSelectDropdown;
},{}],"../node_modules/@rackai/symbols/src/Dropdown/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ = require("..");

var _style = require("./style");

var _default = {
  style: _style.styleDropDown,
  tag: 'ul',
  proto: _.Shape,
  state: {
    active: 0
  },
  childProto: {
    tag: 'li',
    proto: [_.Shape],
    depth: 0,
    round: 0,
    span: {
      proto: [_.IconText],
      text: '',
      icon: 'checkMedium'
    },
    style: _style.styleRow,
    class: {
      active: (element, state) => state.active === element.key ? _style.styleRowActive : 'round: 6'
    },
    on: {
      click: (event, element, state) => {
        state.update({
          active: element.key
        });
      }
    }
  },
  ...[{
    span: {
      text: 'Today'
    }
  }, {
    span: {
      text: 'Yesterday'
    }
  }, {
    span: {
      text: 'A week age'
    }
  }, {
    span: {
      text: 'A month ago'
    }
  }]
};
exports.default = _default;
},{"..":"../node_modules/@rackai/symbols/src/index.js","./style":"../node_modules/@rackai/symbols/src/Dropdown/style.js"}],"../node_modules/@rackai/symbols/src/DatePicker/style.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  maxWidth: '33.6em',
  maxHeight: '26em',
  display: 'flex',
  overflow: 'hidden',
  background: 'white',
  paddingLeft: '1.6em',
  padding: '0 1.6em',
  boxSizing: 'border-box',
  borderRadius: '10px',
  button: {
    border: 'none',
    outline: 'none',
    background: 'transparent',
    cursor: 'pointer'
  },
  aside: {
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'auto',
    paddingRight: '1em',
    button: {
      fontSize: '1.2em',
      color: 'rgba(0, 0, 0, .5)',
      marginBottom: `${22 / 12}em`
    }
  },
  main: {
    flex: 1,
    paddingTop: '1.4em',
    paddingBottom: '1em',
    overflow: 'hidden',
    '> header': {
      display: 'flex',
      alignItems: 'center',
      height: 'auto',
      overflow: 'hidden',
      width: '100%',
      padding: '0 .8em 1.4em .8em',
      boxSizing: 'border-box'
    },
    '> header > svg': {
      fontSize: '1.2em',
      color: '#11B9DC',
      cursor: 'pointer'
    },
    '> header > div': {
      display: 'flex',
      overflow: 'hidden',
      flex: 1
    },
    '> header span': {
      fontSize: '1.4em',
      minWidth: '100%',
      textTransform: 'capitalize',
      textAlign: 'center',
      color: 'black',
      fontWeight: 'bold'
    },
    section: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column'
    },
    'section > header': {
      height: 'auto',
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '6px',
      paddingBottom: '.2em'
    },
    'section > header span': {
      fontSize: '10px',
      textAlign: 'center',
      color: 'black',
      fontWeight: 'bold'
    },
    'section > header span:nth-child(6)': {
      color: 'rgba(0, 0, 0, .5)'
    },
    'section > header span:nth-child(7)': {
      color: 'rgba(0, 0, 0, .5)'
    },
    'section > div': {
      flex: 1,
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '6px'
    },
    'section > div button': {
      fontSize: '1.3em'
    },
    'section > div button:nth-child(7n)': {
      color: 'rgba(0, 0, 0, .5)'
    },
    'section > div button:nth-child(7n - 1)': {
      color: 'rgba(0, 0, 0, .5)'
    }
  }
};
exports.default = _default;
},{}],"../node_modules/@rackai/symbols/src/DatePicker/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Icon = _interopRequireDefault(require("../Icon"));

var _style = _interopRequireDefault(require("./style"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  style: _style.default,
  aside: {
    childProto: {
      tag: 'button'
    },
    ...[{
      text: '2020'
    }, {
      text: '2021'
    }, {
      text: '2022'
    }, {
      text: '2023'
    }, {
      text: '2024'
    }, {
      text: '2025'
    }, {
      text: '2026'
    }, {
      text: '2026'
    }, {
      text: '2026'
    }]
  },
  main: {
    header: {
      icon: {
        proto: _Icon.default,
        name: 'arrowMediumLeft'
      },
      month: {
        childProto: {
          tag: 'span'
        },
        ...[{
          text: 'january'
        }, {
          text: 'february'
        }, {
          text: 'march'
        }, {
          text: 'april'
        }, {
          text: 'may'
        }, {
          text: 'june'
        }, {
          text: 'july'
        }, {
          text: 'august'
        }, {
          text: 'september'
        }, {
          text: 'october'
        }, {
          text: 'november'
        }, {
          text: 'december'
        }]
      },
      icon2: {
        proto: _Icon.default,
        name: 'arrowMediumRight'
      }
    },
    days: {
      tag: 'section',
      header: {
        childProto: {
          tag: 'span'
        },
        ...[{
          text: 'Mo'
        }, {
          text: 'Tu'
        }, {
          text: 'We'
        }, {
          text: 'Th'
        }, {
          text: 'Fr'
        }, {
          text: 'Sa'
        }, {
          text: 'Su'
        }]
      },
      content: {
        childProto: {
          tag: 'button'
        },
        ...[{
          text: '1'
        }, {
          text: '2'
        }, {
          text: '3'
        }, {
          text: '4'
        }, {
          text: '5'
        }, {
          text: '6'
        }, {
          text: '7'
        }, {
          text: '8'
        }, {
          text: '9'
        }, {
          text: '10'
        }, {
          text: '11'
        }, {
          text: '12'
        }, {
          text: '13'
        }, {
          text: '14'
        }, {
          text: '15'
        }, {
          text: '16'
        }, {
          text: '17'
        }, {
          text: '18'
        }, {
          text: '19'
        }, {
          text: '20'
        }, {
          text: '21'
        }, {
          text: '22'
        }, {
          text: '23'
        }, {
          text: '24'
        }, {
          text: '25'
        }, {
          text: '26'
        }, {
          text: '27'
        }, {
          text: '28'
        }, {
          text: '29'
        }, {
          text: '30'
        }, {
          text: '31'
        }]
      }
    }
  }
};
exports.default = _default;
},{"../Icon":"../node_modules/@rackai/symbols/src/Icon/index.js","./style":"../node_modules/@rackai/symbols/src/DatePicker/style.js"}],"../node_modules/@rackai/symbols/src/Tooltip/style.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  textAlign: 'center',
  padding: '1.2em',
  caption: {
    whiteSpace: 'nowrap',
    fontSize: '1.5em'
  },
  span: {
    fontSize: '1.3em',
    opacity: '.5'
  }
};
exports.default = _default;
},{}],"../node_modules/@rackai/symbols/src/Tooltip/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Shape = _interopRequireDefault(require("../Shape"));

var _style = _interopRequireDefault(require("./style"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  style: _style.default,
  proto: _Shape.default,
  theme: 'purple2',
  caption: 'And tooltip is coming',
  span: 'and winter too'
};
exports.default = _default;
},{"../Shape":"../node_modules/@rackai/symbols/src/Shape/index.js","./style":"../node_modules/@rackai/symbols/src/Tooltip/style.js"}],"../node_modules/@rackai/symbols/src/Label/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Shape = _interopRequireDefault(require("../Shape"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  proto: _Shape.default,
  style: {
    fontSize: '1.5em',
    padding: '0 6px'
  },
  theme: 'White',
  text: '😂3'
};
exports.default = _default;
},{"../Shape":"../node_modules/@rackai/symbols/src/Shape/index.js"}],"../node_modules/@rackai/symbols/src/Pills/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Shape = _interopRequireDefault(require("../Shape"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  style: {
    display: 'flex',
    div: {
      width: '6px',
      height: '6px',
      background: 'white'
    },
    'div:not(:last-child)': {
      marginRight: '10px'
    },
    'div:first-child': {
      opacity: '.5'
    },
    'div:nth-child(2)': {
      opacity: '.3'
    },
    'div:nth-child(3)': {
      opacity: '.3'
    }
  },
  childProto: {
    tag: 'div',
    proto: _Shape.default,
    theme: 'White'
  },
  ...[{}, {}, {}]
};
exports.default = _default;
},{"../Shape":"../node_modules/@rackai/symbols/src/Shape/index.js"}],"../node_modules/@rackai/symbols/src/Select/style.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  border: 'none',
  boxSizing: 'border-box',
  cursor: 'pointer',
  fontSize: '1em'
};
exports.default = _default;
},{}],"../node_modules/@rackai/symbols/src/Select/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Shape = _interopRequireDefault(require("../Shape"));

var _style = _interopRequireDefault(require("./style"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  proto: _Shape.default,
  tag: 'select',
  style: _style.default,
  childProto: {
    tag: 'option',
    define: {
      value: param => param
    },
    attr: {
      value: element => element.value
    }
  }
};
exports.default = _default;
},{"../Shape":"../node_modules/@rackai/symbols/src/Shape/index.js","./style":"../node_modules/@rackai/symbols/src/Select/style.js"}],"../node_modules/@rackai/symbols/src/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Sequence", {
  enumerable: true,
  get: function () {
    return _scratch.Sequence;
  }
});
Object.defineProperty(exports, "Color", {
  enumerable: true,
  get: function () {
    return _scratch.Color;
  }
});
Object.defineProperty(exports, "Theme", {
  enumerable: true,
  get: function () {
    return _scratch.Theme;
  }
});
Object.defineProperty(exports, "Box", {
  enumerable: true,
  get: function () {
    return _scratch.Box;
  }
});
Object.defineProperty(exports, "Size", {
  enumerable: true,
  get: function () {
    return _scratch.Size;
  }
});
Object.defineProperty(exports, "Typography", {
  enumerable: true,
  get: function () {
    return _scratch.Typography;
  }
});
Object.defineProperty(exports, "Unit", {
  enumerable: true,
  get: function () {
    return _scratch.Unit;
  }
});
Object.defineProperty(exports, "set", {
  enumerable: true,
  get: function () {
    return _scratch.set;
  }
});
Object.defineProperty(exports, "colorStringToRGBAArray", {
  enumerable: true,
  get: function () {
    return _scratch.colorStringToRGBAArray;
  }
});
Object.defineProperty(exports, "opacify", {
  enumerable: true,
  get: function () {
    return _scratch.opacify;
  }
});
Object.defineProperty(exports, "mixTwoColors", {
  enumerable: true,
  get: function () {
    return _scratch.mixTwoColors;
  }
});
Object.defineProperty(exports, "hexToRGB", {
  enumerable: true,
  get: function () {
    return _scratch.hexToRGB;
  }
});
Object.defineProperty(exports, "hexToRGBA", {
  enumerable: true,
  get: function () {
    return _scratch.hexToRGBA;
  }
});
Object.defineProperty(exports, "mixTwoRGB", {
  enumerable: true,
  get: function () {
    return _scratch.mixTwoRGB;
  }
});
Object.defineProperty(exports, "mixTwoRGBA", {
  enumerable: true,
  get: function () {
    return _scratch.mixTwoRGBA;
  }
});
Object.defineProperty(exports, "getFontFormat", {
  enumerable: true,
  get: function () {
    return _scratch.getFontFormat;
  }
});
Object.defineProperty(exports, "setCustomFont", {
  enumerable: true,
  get: function () {
    return _scratch.setCustomFont;
  }
});
Object.defineProperty(exports, "getFontFace", {
  enumerable: true,
  get: function () {
    return _scratch.getFontFace;
  }
});
Object.defineProperty(exports, "Shape", {
  enumerable: true,
  get: function () {
    return _Shape.default;
  }
});
Object.defineProperty(exports, "Direction", {
  enumerable: true,
  get: function () {
    return _Direction.default;
  }
});
Object.defineProperty(exports, "SVG", {
  enumerable: true,
  get: function () {
    return _SVG.default;
  }
});
Object.defineProperty(exports, "Icon", {
  enumerable: true,
  get: function () {
    return _Icon.default;
  }
});
Object.defineProperty(exports, "Img", {
  enumerable: true,
  get: function () {
    return _Img.default;
  }
});
Object.defineProperty(exports, "Link", {
  enumerable: true,
  get: function () {
    return _Link.default;
  }
});
Object.defineProperty(exports, "IconText", {
  enumerable: true,
  get: function () {
    return _IconText.default;
  }
});
Object.defineProperty(exports, "Input", {
  enumerable: true,
  get: function () {
    return _Input.default;
  }
});
Object.defineProperty(exports, "Field", {
  enumerable: true,
  get: function () {
    return _Field.default;
  }
});
Object.defineProperty(exports, "Button", {
  enumerable: true,
  get: function () {
    return _Button.default;
  }
});
Object.defineProperty(exports, "SquareButton", {
  enumerable: true,
  get: function () {
    return _Button.SquareButton;
  }
});
Object.defineProperty(exports, "RectangleButton", {
  enumerable: true,
  get: function () {
    return _Button.RectangleButton;
  }
});
Object.defineProperty(exports, "CircleButton", {
  enumerable: true,
  get: function () {
    return _Button.CircleButton;
  }
});
Object.defineProperty(exports, "KangorooButton", {
  enumerable: true,
  get: function () {
    return _Button.KangorooButton;
  }
});
Object.defineProperty(exports, "ToolBar", {
  enumerable: true,
  get: function () {
    return _ToolBar.default;
  }
});
Object.defineProperty(exports, "User", {
  enumerable: true,
  get: function () {
    return _User.default;
  }
});
Object.defineProperty(exports, "UserBundle", {
  enumerable: true,
  get: function () {
    return _User.UserBundle;
  }
});
Object.defineProperty(exports, "parentMode", {
  enumerable: true,
  get: function () {
    return _Banner.parentMode;
  }
});
Object.defineProperty(exports, "grid", {
  enumerable: true,
  get: function () {
    return _GridLayouts.grid;
  }
});
Object.defineProperty(exports, "grid2", {
  enumerable: true,
  get: function () {
    return _GridLayouts.grid2;
  }
});
Object.defineProperty(exports, "RangeSliderTool", {
  enumerable: true,
  get: function () {
    return _Tool.RangeSliderTool;
  }
});
Object.defineProperty(exports, "SelectTool", {
  enumerable: true,
  get: function () {
    return _Tool.SelectTool;
  }
});
Object.defineProperty(exports, "Notification", {
  enumerable: true,
  get: function () {
    return _Notification.default;
  }
});
Object.defineProperty(exports, "Dropdown", {
  enumerable: true,
  get: function () {
    return _Dropdown.default;
  }
});
Object.defineProperty(exports, "DatePicker", {
  enumerable: true,
  get: function () {
    return _DatePicker.default;
  }
});
Object.defineProperty(exports, "Tooltip", {
  enumerable: true,
  get: function () {
    return _Tooltip.default;
  }
});
Object.defineProperty(exports, "Label", {
  enumerable: true,
  get: function () {
    return _Label.default;
  }
});
Object.defineProperty(exports, "Pills", {
  enumerable: true,
  get: function () {
    return _Pills.default;
  }
});
Object.defineProperty(exports, "Select", {
  enumerable: true,
  get: function () {
    return _Select.default;
  }
});

var _scratch = require("@rackai/scratch");

var _Shape = _interopRequireDefault(require("./Shape"));

var _Direction = _interopRequireDefault(require("./Direction"));

var _SVG = _interopRequireDefault(require("./SVG"));

var _Icon = _interopRequireDefault(require("./Icon"));

var _Img = _interopRequireDefault(require("./Img"));

var _Link = _interopRequireDefault(require("./Link"));

var _IconText = _interopRequireDefault(require("./IconText"));

var _Input = _interopRequireDefault(require("./Input"));

var _Field = _interopRequireDefault(require("./Field"));

var _Button = _interopRequireWildcard(require("./Button"));

var _ToolBar = _interopRequireDefault(require("./ToolBar"));

var _User = _interopRequireWildcard(require("./User"));

var _Banner = require("./Banner");

var _GridLayouts = require("./GridLayouts");

var _Tool = require("./Tool");

var _Notification = _interopRequireDefault(require("./Notification"));

var _Dropdown = _interopRequireDefault(require("./Dropdown"));

var _DatePicker = _interopRequireDefault(require("./DatePicker"));

var _Tooltip = _interopRequireDefault(require("./Tooltip"));

var _Label = _interopRequireDefault(require("./Label"));

var _Pills = _interopRequireDefault(require("./Pills"));

var _Select = _interopRequireDefault(require("./Select"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"@rackai/scratch":"../node_modules/@rackai/scratch/src/index.js","./Shape":"../node_modules/@rackai/symbols/src/Shape/index.js","./Direction":"../node_modules/@rackai/symbols/src/Direction/index.js","./SVG":"../node_modules/@rackai/symbols/src/SVG/index.js","./Icon":"../node_modules/@rackai/symbols/src/Icon/index.js","./Img":"../node_modules/@rackai/symbols/src/Img/index.js","./Link":"../node_modules/@rackai/symbols/src/Link/index.js","./IconText":"../node_modules/@rackai/symbols/src/IconText/index.js","./Input":"../node_modules/@rackai/symbols/src/Input/index.js","./Field":"../node_modules/@rackai/symbols/src/Field/index.js","./Button":"../node_modules/@rackai/symbols/src/Button/index.js","./ToolBar":"../node_modules/@rackai/symbols/src/ToolBar/index.js","./User":"../node_modules/@rackai/symbols/src/User/index.js","./Banner":"../node_modules/@rackai/symbols/src/Banner/index.js","./GridLayouts":"../node_modules/@rackai/symbols/src/GridLayouts/index.js","./Tool":"../node_modules/@rackai/symbols/src/Tool/index.js","./Notification":"../node_modules/@rackai/symbols/src/Notification/index.js","./Dropdown":"../node_modules/@rackai/symbols/src/Dropdown/index.js","./DatePicker":"../node_modules/@rackai/symbols/src/DatePicker/index.js","./Tooltip":"../node_modules/@rackai/symbols/src/Tooltip/index.js","./Label":"../node_modules/@rackai/symbols/src/Label/index.js","./Pills":"../node_modules/@rackai/symbols/src/Pills/index.js","./Select":"../node_modules/@rackai/symbols/src/Select/index.js"}],"table.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var Cell = {
  tag: 'td'
};
var MainCell = {
  style: {
    fontWeight: 'bold'
  },
  graph: {
    div: {
      style: {
        height: 5
      }
    }
  }
};
var Row = {
  tag: 'tr',
  childProto: Cell,
  i: {
    style: {
      opacity: 0.35
    }
  },
  decimal: {
    style: {
      fontWeight: '300',
      opacity: 0.35
    }
  },
  graph: {
    div: {
      style: {
        height: 2,
        background: '#087CFA',
        width: 0,
        borderRadius: 2
      }
    }
  }
};
var _default = {
  style: {
    color: 'white',
    margin: '6.5vh -1.35em',
    thead: {
      opacity: '.35'
    },
    tr: {},
    td: {
      padding: '.65em 1.35em'
    }
  },
  thead: {
    tr: {
      proto: Row,
      i: '#',
      px: 'px',
      em: 'em',
      decimal: 'decimal'
    }
  },
  on: {
    update: function update(el, state) {
      return el.set(generateSequence(state.base, state.ratio));
    }
  }
};
exports.default = _default;

function generateSequence(base, ratio) {
  var obj = {
    tag: 'tbody',
    childProto: Row
  };

  for (var i = 6; i >= 0; i--) {
    var value = base / Math.pow(ratio, i);
    var em = Math.round(value / base * 1000) / 1000;
    var maincell = i === 0;
    obj['row' + value] = {
      proto: maincell ? MainCell : {},
      i: {
        text: !maincell ? -i : null
      },
      value: Math.round(value),
      em: em,
      decimal: {
        text: !maincell ? Math.round(value * 100) / 100 : null
      },
      graph: {
        div: {
          style: {
            width: Math.round(value)
          }
        }
      }
    };
    generateSubSequence(-i, value, obj, base, ratio);
  }

  for (var _i = 1; _i < 7; _i++) {
    var _value = base * Math.pow(ratio, _i);

    var _em = Math.round(_value / base * 1000) / 1000;

    obj['row' + _value] = {
      i: {
        text: _i
      },
      value: Math.round(_value),
      em: _em,
      decimal: {
        text: Math.round(_value * 100) / 100
      },
      graph: {
        div: {
          style: {
            width: Math.round(_value)
          }
        }
      }
    };
    generateSubSequence(_i, _value, obj, base, ratio);
  }

  return obj;
}

function generateSubSequence(id, val, obj, base, r) {
  var next = val * r;
  var smallRatio = (next - val) / r;
  var arr = [];
  if (Math.round(next) - Math.round(val) > 1) arr = [val + smallRatio];
  if (Math.round(next) - Math.round(val) > 4) arr = [next - smallRatio, val + smallRatio];

  for (var i = 0; i < arr.length; i++) {
    var value = arr[i];
    var em = Math.round(value / base * 1000) / 1000;
    obj['row' + value] = {
      style: {
        opacity: 0.35
      },
      i: {
        text: "".concat(id < 0 ? '-' : '').concat(id < 0 ? -(id + 1) : id, ".").concat(id < 0 ? -i + 2 : i + 1)
      },
      value: Math.round(value),
      em: em,
      decimal: {
        text: Math.round(value * 100) / 100
      },
      graph: {
        div: {
          style: {
            width: Math.round(value),
            height: 1
          }
        }
      }
    };
  }
}
},{}],"index.js":[function(require,module,exports) {
'use strict';

require("./define");

var _style = _interopRequireDefault(require("./style"));

var _domql = _interopRequireDefault(require("@rackai/domql"));

var _symbols = require("@rackai/symbols");

var _table = _interopRequireDefault(require("./table"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

(0, _symbols.set)('theme', {
  name: 'document',
  color: '#999'
}, {
  name: 'field',
  color: 'white',
  background: '#fff3'
});
var sequence = Object.keys(_symbols.Sequence).map(function (key) {
  var value = _symbols.Sequence[key];
  return {
    value: value,
    text: value,
    key: key
  };
});

var dom = _domql.default.create({
  style: _style.default,
  proto: _symbols.Shape,
  theme: 'document',
  round: 0,
  state: {
    base: 17,
    ratio: 1.618,
    sequence: []
  },
  h2: '(em) Sizing scale',
  fields: {
    style: {
      display: 'flex',
      gap: '1em'
    },
    childProto: {
      theme: 'field',
      style: {
        border: '0',
        padding: '.35em .65em'
      }
    },
    base: {
      proto: _symbols.Input,
      placeholder: 'Base',
      type: 'number',
      attr: {
        value: function value(el, state) {
          return state.base;
        },
        autofocus: true
      },
      on: {
        input: function input(ev, el, state) {
          return state.update({
            base: el.node.value
          });
        }
      }
    },
    ratio: _objectSpread(_objectSpread({
      proto: _symbols.Select,
      attr: {
        value: function value(el, state) {
          return state.ratio;
        }
      },
      childProto: {
        attr: {
          value: function value(element) {
            return element.value;
          },
          selected: function selected(element, state) {
            return element.value === state.ratio;
          }
        }
      }
    }, sequence), {}, {
      on: {
        change: function change(ev, el, state) {
          return state.update({
            ratio: el.node.value
          });
        }
      }
    })
  },
  on: {
    render: function render(el, state) {
      return el.update({});
    }
  },
  table: _table.default
});
},{"./define":"define.js","./style":"style.js","@rackai/domql":"../node_modules/@rackai/domql/src/index.js","@rackai/symbols":"../node_modules/@rackai/symbols/src/index.js","./table":"table.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "52440" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/src.e31bb0bc.js.map