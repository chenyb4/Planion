
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = append_empty_stylesheet(node).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.43.2' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var page = createCommonjsModule(function (module, exports) {
    (function (global, factory) {
    	module.exports = factory() ;
    }(commonjsGlobal, (function () {
    var isarray = Array.isArray || function (arr) {
      return Object.prototype.toString.call(arr) == '[object Array]';
    };

    /**
     * Expose `pathToRegexp`.
     */
    var pathToRegexp_1 = pathToRegexp;
    var parse_1 = parse;
    var compile_1 = compile;
    var tokensToFunction_1 = tokensToFunction;
    var tokensToRegExp_1 = tokensToRegExp;

    /**
     * The main path matching regexp utility.
     *
     * @type {RegExp}
     */
    var PATH_REGEXP = new RegExp([
      // Match escaped characters that would otherwise appear in future matches.
      // This allows the user to escape special characters that won't transform.
      '(\\\\.)',
      // Match Express-style parameters and un-named parameters with a prefix
      // and optional suffixes. Matches appear as:
      //
      // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
      // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
      // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
      '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))'
    ].join('|'), 'g');

    /**
     * Parse a string for the raw tokens.
     *
     * @param  {String} str
     * @return {Array}
     */
    function parse (str) {
      var tokens = [];
      var key = 0;
      var index = 0;
      var path = '';
      var res;

      while ((res = PATH_REGEXP.exec(str)) != null) {
        var m = res[0];
        var escaped = res[1];
        var offset = res.index;
        path += str.slice(index, offset);
        index = offset + m.length;

        // Ignore already escaped sequences.
        if (escaped) {
          path += escaped[1];
          continue
        }

        // Push the current path onto the tokens.
        if (path) {
          tokens.push(path);
          path = '';
        }

        var prefix = res[2];
        var name = res[3];
        var capture = res[4];
        var group = res[5];
        var suffix = res[6];
        var asterisk = res[7];

        var repeat = suffix === '+' || suffix === '*';
        var optional = suffix === '?' || suffix === '*';
        var delimiter = prefix || '/';
        var pattern = capture || group || (asterisk ? '.*' : '[^' + delimiter + ']+?');

        tokens.push({
          name: name || key++,
          prefix: prefix || '',
          delimiter: delimiter,
          optional: optional,
          repeat: repeat,
          pattern: escapeGroup(pattern)
        });
      }

      // Match any characters still remaining.
      if (index < str.length) {
        path += str.substr(index);
      }

      // If the path exists, push it onto the end.
      if (path) {
        tokens.push(path);
      }

      return tokens
    }

    /**
     * Compile a string to a template function for the path.
     *
     * @param  {String}   str
     * @return {Function}
     */
    function compile (str) {
      return tokensToFunction(parse(str))
    }

    /**
     * Expose a method for transforming tokens into the path function.
     */
    function tokensToFunction (tokens) {
      // Compile all the tokens into regexps.
      var matches = new Array(tokens.length);

      // Compile all the patterns before compilation.
      for (var i = 0; i < tokens.length; i++) {
        if (typeof tokens[i] === 'object') {
          matches[i] = new RegExp('^' + tokens[i].pattern + '$');
        }
      }

      return function (obj) {
        var path = '';
        var data = obj || {};

        for (var i = 0; i < tokens.length; i++) {
          var token = tokens[i];

          if (typeof token === 'string') {
            path += token;

            continue
          }

          var value = data[token.name];
          var segment;

          if (value == null) {
            if (token.optional) {
              continue
            } else {
              throw new TypeError('Expected "' + token.name + '" to be defined')
            }
          }

          if (isarray(value)) {
            if (!token.repeat) {
              throw new TypeError('Expected "' + token.name + '" to not repeat, but received "' + value + '"')
            }

            if (value.length === 0) {
              if (token.optional) {
                continue
              } else {
                throw new TypeError('Expected "' + token.name + '" to not be empty')
              }
            }

            for (var j = 0; j < value.length; j++) {
              segment = encodeURIComponent(value[j]);

              if (!matches[i].test(segment)) {
                throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
              }

              path += (j === 0 ? token.prefix : token.delimiter) + segment;
            }

            continue
          }

          segment = encodeURIComponent(value);

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
          }

          path += token.prefix + segment;
        }

        return path
      }
    }

    /**
     * Escape a regular expression string.
     *
     * @param  {String} str
     * @return {String}
     */
    function escapeString (str) {
      return str.replace(/([.+*?=^!:${}()[\]|\/])/g, '\\$1')
    }

    /**
     * Escape the capturing group by escaping special characters and meaning.
     *
     * @param  {String} group
     * @return {String}
     */
    function escapeGroup (group) {
      return group.replace(/([=!:$\/()])/g, '\\$1')
    }

    /**
     * Attach the keys as a property of the regexp.
     *
     * @param  {RegExp} re
     * @param  {Array}  keys
     * @return {RegExp}
     */
    function attachKeys (re, keys) {
      re.keys = keys;
      return re
    }

    /**
     * Get the flags for a regexp from the options.
     *
     * @param  {Object} options
     * @return {String}
     */
    function flags (options) {
      return options.sensitive ? '' : 'i'
    }

    /**
     * Pull out keys from a regexp.
     *
     * @param  {RegExp} path
     * @param  {Array}  keys
     * @return {RegExp}
     */
    function regexpToRegexp (path, keys) {
      // Use a negative lookahead to match only capturing groups.
      var groups = path.source.match(/\((?!\?)/g);

      if (groups) {
        for (var i = 0; i < groups.length; i++) {
          keys.push({
            name: i,
            prefix: null,
            delimiter: null,
            optional: false,
            repeat: false,
            pattern: null
          });
        }
      }

      return attachKeys(path, keys)
    }

    /**
     * Transform an array into a regexp.
     *
     * @param  {Array}  path
     * @param  {Array}  keys
     * @param  {Object} options
     * @return {RegExp}
     */
    function arrayToRegexp (path, keys, options) {
      var parts = [];

      for (var i = 0; i < path.length; i++) {
        parts.push(pathToRegexp(path[i], keys, options).source);
      }

      var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

      return attachKeys(regexp, keys)
    }

    /**
     * Create a path regexp from string input.
     *
     * @param  {String} path
     * @param  {Array}  keys
     * @param  {Object} options
     * @return {RegExp}
     */
    function stringToRegexp (path, keys, options) {
      var tokens = parse(path);
      var re = tokensToRegExp(tokens, options);

      // Attach keys back to the regexp.
      for (var i = 0; i < tokens.length; i++) {
        if (typeof tokens[i] !== 'string') {
          keys.push(tokens[i]);
        }
      }

      return attachKeys(re, keys)
    }

    /**
     * Expose a function for taking tokens and returning a RegExp.
     *
     * @param  {Array}  tokens
     * @param  {Array}  keys
     * @param  {Object} options
     * @return {RegExp}
     */
    function tokensToRegExp (tokens, options) {
      options = options || {};

      var strict = options.strict;
      var end = options.end !== false;
      var route = '';
      var lastToken = tokens[tokens.length - 1];
      var endsWithSlash = typeof lastToken === 'string' && /\/$/.test(lastToken);

      // Iterate over the tokens and create our regexp string.
      for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];

        if (typeof token === 'string') {
          route += escapeString(token);
        } else {
          var prefix = escapeString(token.prefix);
          var capture = token.pattern;

          if (token.repeat) {
            capture += '(?:' + prefix + capture + ')*';
          }

          if (token.optional) {
            if (prefix) {
              capture = '(?:' + prefix + '(' + capture + '))?';
            } else {
              capture = '(' + capture + ')?';
            }
          } else {
            capture = prefix + '(' + capture + ')';
          }

          route += capture;
        }
      }

      // In non-strict mode we allow a slash at the end of match. If the path to
      // match already ends with a slash, we remove it for consistency. The slash
      // is valid at the end of a path match, not in the middle. This is important
      // in non-ending mode, where "/test/" shouldn't match "/test//route".
      if (!strict) {
        route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?';
      }

      if (end) {
        route += '$';
      } else {
        // In non-ending mode, we need the capturing groups to match as much as
        // possible by using a positive lookahead to the end or next path segment.
        route += strict && endsWithSlash ? '' : '(?=\\/|$)';
      }

      return new RegExp('^' + route, flags(options))
    }

    /**
     * Normalize the given path string, returning a regular expression.
     *
     * An empty array can be passed in for the keys, which will hold the
     * placeholder key descriptions. For example, using `/user/:id`, `keys` will
     * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
     *
     * @param  {(String|RegExp|Array)} path
     * @param  {Array}                 [keys]
     * @param  {Object}                [options]
     * @return {RegExp}
     */
    function pathToRegexp (path, keys, options) {
      keys = keys || [];

      if (!isarray(keys)) {
        options = keys;
        keys = [];
      } else if (!options) {
        options = {};
      }

      if (path instanceof RegExp) {
        return regexpToRegexp(path, keys)
      }

      if (isarray(path)) {
        return arrayToRegexp(path, keys, options)
      }

      return stringToRegexp(path, keys, options)
    }

    pathToRegexp_1.parse = parse_1;
    pathToRegexp_1.compile = compile_1;
    pathToRegexp_1.tokensToFunction = tokensToFunction_1;
    pathToRegexp_1.tokensToRegExp = tokensToRegExp_1;

    /**
       * Module dependencies.
       */

      

      /**
       * Short-cuts for global-object checks
       */

      var hasDocument = ('undefined' !== typeof document);
      var hasWindow = ('undefined' !== typeof window);
      var hasHistory = ('undefined' !== typeof history);
      var hasProcess = typeof process !== 'undefined';

      /**
       * Detect click event
       */
      var clickEvent = hasDocument && document.ontouchstart ? 'touchstart' : 'click';

      /**
       * To work properly with the URL
       * history.location generated polyfill in https://github.com/devote/HTML5-History-API
       */

      var isLocation = hasWindow && !!(window.history.location || window.location);

      /**
       * The page instance
       * @api private
       */
      function Page() {
        // public things
        this.callbacks = [];
        this.exits = [];
        this.current = '';
        this.len = 0;

        // private things
        this._decodeURLComponents = true;
        this._base = '';
        this._strict = false;
        this._running = false;
        this._hashbang = false;

        // bound functions
        this.clickHandler = this.clickHandler.bind(this);
        this._onpopstate = this._onpopstate.bind(this);
      }

      /**
       * Configure the instance of page. This can be called multiple times.
       *
       * @param {Object} options
       * @api public
       */

      Page.prototype.configure = function(options) {
        var opts = options || {};

        this._window = opts.window || (hasWindow && window);
        this._decodeURLComponents = opts.decodeURLComponents !== false;
        this._popstate = opts.popstate !== false && hasWindow;
        this._click = opts.click !== false && hasDocument;
        this._hashbang = !!opts.hashbang;

        var _window = this._window;
        if(this._popstate) {
          _window.addEventListener('popstate', this._onpopstate, false);
        } else if(hasWindow) {
          _window.removeEventListener('popstate', this._onpopstate, false);
        }

        if (this._click) {
          _window.document.addEventListener(clickEvent, this.clickHandler, false);
        } else if(hasDocument) {
          _window.document.removeEventListener(clickEvent, this.clickHandler, false);
        }

        if(this._hashbang && hasWindow && !hasHistory) {
          _window.addEventListener('hashchange', this._onpopstate, false);
        } else if(hasWindow) {
          _window.removeEventListener('hashchange', this._onpopstate, false);
        }
      };

      /**
       * Get or set basepath to `path`.
       *
       * @param {string} path
       * @api public
       */

      Page.prototype.base = function(path) {
        if (0 === arguments.length) return this._base;
        this._base = path;
      };

      /**
       * Gets the `base`, which depends on whether we are using History or
       * hashbang routing.

       * @api private
       */
      Page.prototype._getBase = function() {
        var base = this._base;
        if(!!base) return base;
        var loc = hasWindow && this._window && this._window.location;

        if(hasWindow && this._hashbang && loc && loc.protocol === 'file:') {
          base = loc.pathname;
        }

        return base;
      };

      /**
       * Get or set strict path matching to `enable`
       *
       * @param {boolean} enable
       * @api public
       */

      Page.prototype.strict = function(enable) {
        if (0 === arguments.length) return this._strict;
        this._strict = enable;
      };


      /**
       * Bind with the given `options`.
       *
       * Options:
       *
       *    - `click` bind to click events [true]
       *    - `popstate` bind to popstate [true]
       *    - `dispatch` perform initial dispatch [true]
       *
       * @param {Object} options
       * @api public
       */

      Page.prototype.start = function(options) {
        var opts = options || {};
        this.configure(opts);

        if (false === opts.dispatch) return;
        this._running = true;

        var url;
        if(isLocation) {
          var window = this._window;
          var loc = window.location;

          if(this._hashbang && ~loc.hash.indexOf('#!')) {
            url = loc.hash.substr(2) + loc.search;
          } else if (this._hashbang) {
            url = loc.search + loc.hash;
          } else {
            url = loc.pathname + loc.search + loc.hash;
          }
        }

        this.replace(url, null, true, opts.dispatch);
      };

      /**
       * Unbind click and popstate event handlers.
       *
       * @api public
       */

      Page.prototype.stop = function() {
        if (!this._running) return;
        this.current = '';
        this.len = 0;
        this._running = false;

        var window = this._window;
        this._click && window.document.removeEventListener(clickEvent, this.clickHandler, false);
        hasWindow && window.removeEventListener('popstate', this._onpopstate, false);
        hasWindow && window.removeEventListener('hashchange', this._onpopstate, false);
      };

      /**
       * Show `path` with optional `state` object.
       *
       * @param {string} path
       * @param {Object=} state
       * @param {boolean=} dispatch
       * @param {boolean=} push
       * @return {!Context}
       * @api public
       */

      Page.prototype.show = function(path, state, dispatch, push) {
        var ctx = new Context(path, state, this),
          prev = this.prevContext;
        this.prevContext = ctx;
        this.current = ctx.path;
        if (false !== dispatch) this.dispatch(ctx, prev);
        if (false !== ctx.handled && false !== push) ctx.pushState();
        return ctx;
      };

      /**
       * Goes back in the history
       * Back should always let the current route push state and then go back.
       *
       * @param {string} path - fallback path to go back if no more history exists, if undefined defaults to page.base
       * @param {Object=} state
       * @api public
       */

      Page.prototype.back = function(path, state) {
        var page = this;
        if (this.len > 0) {
          var window = this._window;
          // this may need more testing to see if all browsers
          // wait for the next tick to go back in history
          hasHistory && window.history.back();
          this.len--;
        } else if (path) {
          setTimeout(function() {
            page.show(path, state);
          });
        } else {
          setTimeout(function() {
            page.show(page._getBase(), state);
          });
        }
      };

      /**
       * Register route to redirect from one path to other
       * or just redirect to another route
       *
       * @param {string} from - if param 'to' is undefined redirects to 'from'
       * @param {string=} to
       * @api public
       */
      Page.prototype.redirect = function(from, to) {
        var inst = this;

        // Define route from a path to another
        if ('string' === typeof from && 'string' === typeof to) {
          page.call(this, from, function(e) {
            setTimeout(function() {
              inst.replace(/** @type {!string} */ (to));
            }, 0);
          });
        }

        // Wait for the push state and replace it with another
        if ('string' === typeof from && 'undefined' === typeof to) {
          setTimeout(function() {
            inst.replace(from);
          }, 0);
        }
      };

      /**
       * Replace `path` with optional `state` object.
       *
       * @param {string} path
       * @param {Object=} state
       * @param {boolean=} init
       * @param {boolean=} dispatch
       * @return {!Context}
       * @api public
       */


      Page.prototype.replace = function(path, state, init, dispatch) {
        var ctx = new Context(path, state, this),
          prev = this.prevContext;
        this.prevContext = ctx;
        this.current = ctx.path;
        ctx.init = init;
        ctx.save(); // save before dispatching, which may redirect
        if (false !== dispatch) this.dispatch(ctx, prev);
        return ctx;
      };

      /**
       * Dispatch the given `ctx`.
       *
       * @param {Context} ctx
       * @api private
       */

      Page.prototype.dispatch = function(ctx, prev) {
        var i = 0, j = 0, page = this;

        function nextExit() {
          var fn = page.exits[j++];
          if (!fn) return nextEnter();
          fn(prev, nextExit);
        }

        function nextEnter() {
          var fn = page.callbacks[i++];

          if (ctx.path !== page.current) {
            ctx.handled = false;
            return;
          }
          if (!fn) return unhandled.call(page, ctx);
          fn(ctx, nextEnter);
        }

        if (prev) {
          nextExit();
        } else {
          nextEnter();
        }
      };

      /**
       * Register an exit route on `path` with
       * callback `fn()`, which will be called
       * on the previous context when a new
       * page is visited.
       */
      Page.prototype.exit = function(path, fn) {
        if (typeof path === 'function') {
          return this.exit('*', path);
        }

        var route = new Route(path, null, this);
        for (var i = 1; i < arguments.length; ++i) {
          this.exits.push(route.middleware(arguments[i]));
        }
      };

      /**
       * Handle "click" events.
       */

      /* jshint +W054 */
      Page.prototype.clickHandler = function(e) {
        if (1 !== this._which(e)) return;

        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        if (e.defaultPrevented) return;

        // ensure link
        // use shadow dom when available if not, fall back to composedPath()
        // for browsers that only have shady
        var el = e.target;
        var eventPath = e.path || (e.composedPath ? e.composedPath() : null);

        if(eventPath) {
          for (var i = 0; i < eventPath.length; i++) {
            if (!eventPath[i].nodeName) continue;
            if (eventPath[i].nodeName.toUpperCase() !== 'A') continue;
            if (!eventPath[i].href) continue;

            el = eventPath[i];
            break;
          }
        }

        // continue ensure link
        // el.nodeName for svg links are 'a' instead of 'A'
        while (el && 'A' !== el.nodeName.toUpperCase()) el = el.parentNode;
        if (!el || 'A' !== el.nodeName.toUpperCase()) return;

        // check if link is inside an svg
        // in this case, both href and target are always inside an object
        var svg = (typeof el.href === 'object') && el.href.constructor.name === 'SVGAnimatedString';

        // Ignore if tag has
        // 1. "download" attribute
        // 2. rel="external" attribute
        if (el.hasAttribute('download') || el.getAttribute('rel') === 'external') return;

        // ensure non-hash for the same path
        var link = el.getAttribute('href');
        if(!this._hashbang && this._samePath(el) && (el.hash || '#' === link)) return;

        // Check for mailto: in the href
        if (link && link.indexOf('mailto:') > -1) return;

        // check target
        // svg target is an object and its desired value is in .baseVal property
        if (svg ? el.target.baseVal : el.target) return;

        // x-origin
        // note: svg links that are not relative don't call click events (and skip page.js)
        // consequently, all svg links tested inside page.js are relative and in the same origin
        if (!svg && !this.sameOrigin(el.href)) return;

        // rebuild path
        // There aren't .pathname and .search properties in svg links, so we use href
        // Also, svg href is an object and its desired value is in .baseVal property
        var path = svg ? el.href.baseVal : (el.pathname + el.search + (el.hash || ''));

        path = path[0] !== '/' ? '/' + path : path;

        // strip leading "/[drive letter]:" on NW.js on Windows
        if (hasProcess && path.match(/^\/[a-zA-Z]:\//)) {
          path = path.replace(/^\/[a-zA-Z]:\//, '/');
        }

        // same page
        var orig = path;
        var pageBase = this._getBase();

        if (path.indexOf(pageBase) === 0) {
          path = path.substr(pageBase.length);
        }

        if (this._hashbang) path = path.replace('#!', '');

        if (pageBase && orig === path && (!isLocation || this._window.location.protocol !== 'file:')) {
          return;
        }

        e.preventDefault();
        this.show(orig);
      };

      /**
       * Handle "populate" events.
       * @api private
       */

      Page.prototype._onpopstate = (function () {
        var loaded = false;
        if ( ! hasWindow ) {
          return function () {};
        }
        if (hasDocument && document.readyState === 'complete') {
          loaded = true;
        } else {
          window.addEventListener('load', function() {
            setTimeout(function() {
              loaded = true;
            }, 0);
          });
        }
        return function onpopstate(e) {
          if (!loaded) return;
          var page = this;
          if (e.state) {
            var path = e.state.path;
            page.replace(path, e.state);
          } else if (isLocation) {
            var loc = page._window.location;
            page.show(loc.pathname + loc.search + loc.hash, undefined, undefined, false);
          }
        };
      })();

      /**
       * Event button.
       */
      Page.prototype._which = function(e) {
        e = e || (hasWindow && this._window.event);
        return null == e.which ? e.button : e.which;
      };

      /**
       * Convert to a URL object
       * @api private
       */
      Page.prototype._toURL = function(href) {
        var window = this._window;
        if(typeof URL === 'function' && isLocation) {
          return new URL(href, window.location.toString());
        } else if (hasDocument) {
          var anc = window.document.createElement('a');
          anc.href = href;
          return anc;
        }
      };

      /**
       * Check if `href` is the same origin.
       * @param {string} href
       * @api public
       */
      Page.prototype.sameOrigin = function(href) {
        if(!href || !isLocation) return false;

        var url = this._toURL(href);
        var window = this._window;

        var loc = window.location;

        /*
           When the port is the default http port 80 for http, or 443 for
           https, internet explorer 11 returns an empty string for loc.port,
           so we need to compare loc.port with an empty string if url.port
           is the default port 80 or 443.
           Also the comparition with `port` is changed from `===` to `==` because
           `port` can be a string sometimes. This only applies to ie11.
        */
        return loc.protocol === url.protocol &&
          loc.hostname === url.hostname &&
          (loc.port === url.port || loc.port === '' && (url.port == 80 || url.port == 443)); // jshint ignore:line
      };

      /**
       * @api private
       */
      Page.prototype._samePath = function(url) {
        if(!isLocation) return false;
        var window = this._window;
        var loc = window.location;
        return url.pathname === loc.pathname &&
          url.search === loc.search;
      };

      /**
       * Remove URL encoding from the given `str`.
       * Accommodates whitespace in both x-www-form-urlencoded
       * and regular percent-encoded form.
       *
       * @param {string} val - URL component to decode
       * @api private
       */
      Page.prototype._decodeURLEncodedURIComponent = function(val) {
        if (typeof val !== 'string') { return val; }
        return this._decodeURLComponents ? decodeURIComponent(val.replace(/\+/g, ' ')) : val;
      };

      /**
       * Create a new `page` instance and function
       */
      function createPage() {
        var pageInstance = new Page();

        function pageFn(/* args */) {
          return page.apply(pageInstance, arguments);
        }

        // Copy all of the things over. In 2.0 maybe we use setPrototypeOf
        pageFn.callbacks = pageInstance.callbacks;
        pageFn.exits = pageInstance.exits;
        pageFn.base = pageInstance.base.bind(pageInstance);
        pageFn.strict = pageInstance.strict.bind(pageInstance);
        pageFn.start = pageInstance.start.bind(pageInstance);
        pageFn.stop = pageInstance.stop.bind(pageInstance);
        pageFn.show = pageInstance.show.bind(pageInstance);
        pageFn.back = pageInstance.back.bind(pageInstance);
        pageFn.redirect = pageInstance.redirect.bind(pageInstance);
        pageFn.replace = pageInstance.replace.bind(pageInstance);
        pageFn.dispatch = pageInstance.dispatch.bind(pageInstance);
        pageFn.exit = pageInstance.exit.bind(pageInstance);
        pageFn.configure = pageInstance.configure.bind(pageInstance);
        pageFn.sameOrigin = pageInstance.sameOrigin.bind(pageInstance);
        pageFn.clickHandler = pageInstance.clickHandler.bind(pageInstance);

        pageFn.create = createPage;

        Object.defineProperty(pageFn, 'len', {
          get: function(){
            return pageInstance.len;
          },
          set: function(val) {
            pageInstance.len = val;
          }
        });

        Object.defineProperty(pageFn, 'current', {
          get: function(){
            return pageInstance.current;
          },
          set: function(val) {
            pageInstance.current = val;
          }
        });

        // In 2.0 these can be named exports
        pageFn.Context = Context;
        pageFn.Route = Route;

        return pageFn;
      }

      /**
       * Register `path` with callback `fn()`,
       * or route `path`, or redirection,
       * or `page.start()`.
       *
       *   page(fn);
       *   page('*', fn);
       *   page('/user/:id', load, user);
       *   page('/user/' + user.id, { some: 'thing' });
       *   page('/user/' + user.id);
       *   page('/from', '/to')
       *   page();
       *
       * @param {string|!Function|!Object} path
       * @param {Function=} fn
       * @api public
       */

      function page(path, fn) {
        // <callback>
        if ('function' === typeof path) {
          return page.call(this, '*', path);
        }

        // route <path> to <callback ...>
        if ('function' === typeof fn) {
          var route = new Route(/** @type {string} */ (path), null, this);
          for (var i = 1; i < arguments.length; ++i) {
            this.callbacks.push(route.middleware(arguments[i]));
          }
          // show <path> with [state]
        } else if ('string' === typeof path) {
          this['string' === typeof fn ? 'redirect' : 'show'](path, fn);
          // start [options]
        } else {
          this.start(path);
        }
      }

      /**
       * Unhandled `ctx`. When it's not the initial
       * popstate then redirect. If you wish to handle
       * 404s on your own use `page('*', callback)`.
       *
       * @param {Context} ctx
       * @api private
       */
      function unhandled(ctx) {
        if (ctx.handled) return;
        var current;
        var page = this;
        var window = page._window;

        if (page._hashbang) {
          current = isLocation && this._getBase() + window.location.hash.replace('#!', '');
        } else {
          current = isLocation && window.location.pathname + window.location.search;
        }

        if (current === ctx.canonicalPath) return;
        page.stop();
        ctx.handled = false;
        isLocation && (window.location.href = ctx.canonicalPath);
      }

      /**
       * Escapes RegExp characters in the given string.
       *
       * @param {string} s
       * @api private
       */
      function escapeRegExp(s) {
        return s.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1');
      }

      /**
       * Initialize a new "request" `Context`
       * with the given `path` and optional initial `state`.
       *
       * @constructor
       * @param {string} path
       * @param {Object=} state
       * @api public
       */

      function Context(path, state, pageInstance) {
        var _page = this.page = pageInstance || page;
        var window = _page._window;
        var hashbang = _page._hashbang;

        var pageBase = _page._getBase();
        if ('/' === path[0] && 0 !== path.indexOf(pageBase)) path = pageBase + (hashbang ? '#!' : '') + path;
        var i = path.indexOf('?');

        this.canonicalPath = path;
        var re = new RegExp('^' + escapeRegExp(pageBase));
        this.path = path.replace(re, '') || '/';
        if (hashbang) this.path = this.path.replace('#!', '') || '/';

        this.title = (hasDocument && window.document.title);
        this.state = state || {};
        this.state.path = path;
        this.querystring = ~i ? _page._decodeURLEncodedURIComponent(path.slice(i + 1)) : '';
        this.pathname = _page._decodeURLEncodedURIComponent(~i ? path.slice(0, i) : path);
        this.params = {};

        // fragment
        this.hash = '';
        if (!hashbang) {
          if (!~this.path.indexOf('#')) return;
          var parts = this.path.split('#');
          this.path = this.pathname = parts[0];
          this.hash = _page._decodeURLEncodedURIComponent(parts[1]) || '';
          this.querystring = this.querystring.split('#')[0];
        }
      }

      /**
       * Push state.
       *
       * @api private
       */

      Context.prototype.pushState = function() {
        var page = this.page;
        var window = page._window;
        var hashbang = page._hashbang;

        page.len++;
        if (hasHistory) {
            window.history.pushState(this.state, this.title,
              hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
        }
      };

      /**
       * Save the context state.
       *
       * @api public
       */

      Context.prototype.save = function() {
        var page = this.page;
        if (hasHistory) {
            page._window.history.replaceState(this.state, this.title,
              page._hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
        }
      };

      /**
       * Initialize `Route` with the given HTTP `path`,
       * and an array of `callbacks` and `options`.
       *
       * Options:
       *
       *   - `sensitive`    enable case-sensitive routes
       *   - `strict`       enable strict matching for trailing slashes
       *
       * @constructor
       * @param {string} path
       * @param {Object=} options
       * @api private
       */

      function Route(path, options, page) {
        var _page = this.page = page || globalPage;
        var opts = options || {};
        opts.strict = opts.strict || _page._strict;
        this.path = (path === '*') ? '(.*)' : path;
        this.method = 'GET';
        this.regexp = pathToRegexp_1(this.path, this.keys = [], opts);
      }

      /**
       * Return route middleware with
       * the given callback `fn()`.
       *
       * @param {Function} fn
       * @return {Function}
       * @api public
       */

      Route.prototype.middleware = function(fn) {
        var self = this;
        return function(ctx, next) {
          if (self.match(ctx.path, ctx.params)) {
            ctx.routePath = self.path;
            return fn(ctx, next);
          }
          next();
        };
      };

      /**
       * Check if this route matches `path`, if so
       * populate `params`.
       *
       * @param {string} path
       * @param {Object} params
       * @return {boolean}
       * @api private
       */

      Route.prototype.match = function(path, params) {
        var keys = this.keys,
          qsIndex = path.indexOf('?'),
          pathname = ~qsIndex ? path.slice(0, qsIndex) : path,
          m = this.regexp.exec(decodeURIComponent(pathname));

        if (!m) return false;

        delete params[0];

        for (var i = 1, len = m.length; i < len; ++i) {
          var key = keys[i - 1];
          var val = this.page._decodeURLEncodedURIComponent(m[i]);
          if (val !== undefined || !(hasOwnProperty.call(params, key.name))) {
            params[key.name] = val;
          }
        }

        return true;
      };


      /**
       * Module exports.
       */

      var globalPage = createPage();
      var page_js = globalPage;
      var default_1 = globalPage;

    page_js.default = default_1;

    return page_js;

    })));
    });

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    var store = writable({
        token: ''
    });

    /* src\routes\Home.svelte generated by Svelte v3.43.2 */

    const { console: console_1$4 } = globals;
    const file$7 = "src\\routes\\Home.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[24] = list[i];
    	return child_ctx;
    }

    // (195:16) {#if ($tokenStore.token != '')}
    function create_if_block_3$3(ctx) {
    	let show_if_1 = parseJwt$3(/*$tokenStore*/ ctx[6].token).role.includes('employee');
    	let t;
    	let show_if = parseJwt$3(/*$tokenStore*/ ctx[6].token).role.includes('admin');
    	let if_block1_anchor;
    	let if_block0 = show_if_1 && create_if_block_5$2(ctx);
    	let if_block1 = show_if && create_if_block_4$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$tokenStore*/ 64) show_if_1 = parseJwt$3(/*$tokenStore*/ ctx[6].token).role.includes('employee');

    			if (show_if_1) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_5$2(ctx);
    					if_block0.c();
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty & /*$tokenStore*/ 64) show_if = parseJwt$3(/*$tokenStore*/ ctx[6].token).role.includes('admin');

    			if (show_if) {
    				if (if_block1) ; else {
    					if_block1 = create_if_block_4$2(ctx);
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$3.name,
    		type: "if",
    		source: "(195:16) {#if ($tokenStore.token != '')}",
    		ctx
    	});

    	return block;
    }

    // (196:20) {#if (parseJwt($tokenStore.token).role.includes('employee'))}
    function create_if_block_5$2(ctx) {
    	let li;
    	let a;
    	let i;
    	let t0;
    	let span;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			i = element("i");
    			t0 = space();
    			span = element("span");
    			span.textContent = "My Reservations";
    			attr_dev(i, "class", "fas fa-calendar-check");
    			add_location(i, file$7, 198, 32, 6965);
    			add_location(span, file$7, 199, 32, 7036);
    			attr_dev(a, "class", "nav-link");
    			attr_dev(a, "href", "/home");
    			add_location(a, file$7, 197, 28, 6898);
    			attr_dev(li, "class", "nav-item");
    			add_location(li, file$7, 196, 24, 6847);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, i);
    			append_dev(a, t0);
    			append_dev(a, span);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$2.name,
    		type: "if",
    		source: "(196:20) {#if (parseJwt($tokenStore.token).role.includes('employee'))}",
    		ctx
    	});

    	return block;
    }

    // (205:20) {#if (parseJwt($tokenStore.token).role.includes('admin'))}
    function create_if_block_4$2(ctx) {
    	let li;
    	let a;
    	let i;
    	let t0;
    	let span;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			i = element("i");
    			t0 = space();
    			span = element("span");
    			span.textContent = "All Employees";
    			attr_dev(i, "class", "fa fa-bicycle");
    			add_location(i, file$7, 207, 32, 7387);
    			add_location(span, file$7, 208, 32, 7450);
    			attr_dev(a, "class", "nav-link");
    			attr_dev(a, "href", "/all-users");
    			add_location(a, file$7, 206, 28, 7315);
    			attr_dev(li, "class", "nav-item");
    			add_location(li, file$7, 205, 24, 7264);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, i);
    			append_dev(a, t0);
    			append_dev(a, span);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$2.name,
    		type: "if",
    		source: "(205:20) {#if (parseJwt($tokenStore.token).role.includes('admin'))}",
    		ctx
    	});

    	return block;
    }

    // (237:32) {#if $tokenStore.token != ''}
    function create_if_block_2$3(ctx) {
    	let t_value = parseJwt$3(/*$tokenStore*/ ctx[6].token).email + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$tokenStore*/ 64 && t_value !== (t_value = parseJwt$3(/*$tokenStore*/ ctx[6].token).email + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(237:32) {#if $tokenStore.token != ''}",
    		ctx
    	});

    	return block;
    }

    // (249:28) {#if ($tokenStore.token != '')}
    function create_if_block_1$3(ctx) {
    	let t_value = parseJwt$3(/*$tokenStore*/ ctx[6].token).name + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$tokenStore*/ 64 && t_value !== (t_value = parseJwt$3(/*$tokenStore*/ ctx[6].token).name + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(249:28) {#if ($tokenStore.token != '')}",
    		ctx
    	});

    	return block;
    }

    // (297:36) {:else }
    function create_else_block$2(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*item*/ ctx[24].shiftDate + "";
    	let t0;
    	let t1;
    	let t2;
    	let td1;
    	let t3_value = /*item*/ ctx[24].isMorningShift + "";
    	let t3;
    	let t4;
    	let td2;
    	let button0;
    	let t6;
    	let td3;
    	let button1;
    	let t8;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = text(" (in the past)");
    			t2 = space();
    			td1 = element("td");
    			t3 = text(t3_value);
    			t4 = space();
    			td2 = element("td");
    			button0 = element("button");
    			button0.textContent = "Edit";
    			t6 = space();
    			td3 = element("td");
    			button1 = element("button");
    			button1.textContent = "Delete";
    			t8 = space();
    			set_style(td0, "color", "red");
    			add_location(td0, file$7, 298, 44, 12185);
    			add_location(td1, file$7, 299, 44, 12289);
    			attr_dev(button0, "class", "btn btn-primary shadow-sm disabled");
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "data-bs-target", "#modal-1");
    			attr_dev(button0, "data-bs-toggle", "modal");
    			add_location(button0, file$7, 301, 48, 12419);
    			add_location(td2, file$7, 300, 44, 12365);
    			attr_dev(button1, "class", "btn btn-primary shadow-sm disabled btn-danger");
    			attr_dev(button1, "type", "button");
    			add_location(button1, file$7, 306, 48, 12806);
    			add_location(td3, file$7, 305, 44, 12752);
    			attr_dev(tr, "class", "notAvailable svelte-t7xm2n");
    			add_location(tr, file$7, 297, 40, 12114);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(td0, t1);
    			append_dev(tr, t2);
    			append_dev(tr, td1);
    			append_dev(td1, t3);
    			append_dev(tr, t4);
    			append_dev(tr, td2);
    			append_dev(td2, button0);
    			append_dev(tr, t6);
    			append_dev(tr, td3);
    			append_dev(td3, button1);
    			append_dev(tr, t8);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*itemsToDisplay*/ 1 && t0_value !== (t0_value = /*item*/ ctx[24].shiftDate + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*itemsToDisplay*/ 1 && t3_value !== (t3_value = /*item*/ ctx[24].isMorningShift + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(297:36) {:else }",
    		ctx
    	});

    	return block;
    }

    // (282:36) {#if item.shiftDate > today}
    function create_if_block$3(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*item*/ ctx[24].shiftDate + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*item*/ ctx[24].isMorningShift + "";
    	let t2;
    	let t3;
    	let td2;
    	let button0;
    	let t5;
    	let td3;
    	let button1;
    	let t7;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			button0 = element("button");
    			button0.textContent = "Edit";
    			t5 = space();
    			td3 = element("td");
    			button1 = element("button");
    			button1.textContent = "Delete";
    			t7 = space();
    			add_location(td0, file$7, 283, 44, 11135);
    			add_location(td1, file$7, 284, 44, 11206);
    			attr_dev(button0, "class", "btn btn-primary shadow-sm");
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "data-bs-target", "#modal-1");
    			attr_dev(button0, "data-bs-toggle", "modal");
    			add_location(button0, file$7, 286, 48, 11336);
    			add_location(td2, file$7, 285, 44, 11282);
    			attr_dev(button1, "class", "btn btn-primary btn-danger");
    			attr_dev(button1, "type", "button");
    			add_location(button1, file$7, 291, 48, 11713);
    			add_location(td3, file$7, 290, 44, 11659);
    			add_location(tr, file$7, 282, 40, 11085);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, button0);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, button1);
    			append_dev(tr, t7);

    			if (!mounted) {
    				dispose = listen_dev(
    					button1,
    					"click",
    					function () {
    						if (is_function(/*deleteBooking*/ ctx[10](/*item*/ ctx[24]._id))) /*deleteBooking*/ ctx[10](/*item*/ ctx[24]._id).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*itemsToDisplay*/ 1 && t0_value !== (t0_value = /*item*/ ctx[24].shiftDate + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*itemsToDisplay*/ 1 && t2_value !== (t2_value = /*item*/ ctx[24].isMorningShift + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(282:36) {#if item.shiftDate > today}",
    		ctx
    	});

    	return block;
    }

    // (281:32) {#each itemsToDisplay as item}
    function create_each_block$3(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*item*/ ctx[24].shiftDate > /*today*/ ctx[7]) return create_if_block$3;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(281:32) {#each itemsToDisplay as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let body;
    	let div16;
    	let nav0;
    	let div3;
    	let a0;
    	let div0;
    	let i0;
    	let t0;
    	let div1;
    	let span0;
    	let t1;
    	let br0;
    	let t2;
    	let span1;
    	let t3;
    	let br1;
    	let t4;
    	let t5;
    	let ul0;
    	let t6;
    	let li0;
    	let a1;
    	let i1;
    	let t7;
    	let span2;
    	let t9;
    	let div2;
    	let button0;
    	let t10;
    	let div15;
    	let div12;
    	let nav1;
    	let div4;
    	let button1;
    	let i2;
    	let t11;
    	let ul1;
    	let li1;
    	let a2;
    	let t12;
    	let div11;
    	let div7;
    	let div5;
    	let h30;
    	let t13;
    	let t14;
    	let div6;
    	let h40;
    	let t16;
    	let h41;
    	let t17;
    	let button2;
    	let i3;
    	let t18;
    	let div10;
    	let div9;
    	let div8;
    	let table0;
    	let thead0;
    	let tr0;
    	let th0;
    	let t20;
    	let th1;
    	let t22;
    	let th2;
    	let t23;
    	let th3;
    	let t24;
    	let tbody0;
    	let t25;
    	let footer;
    	let div14;
    	let div13;
    	let span3;
    	let t27;
    	let a3;
    	let i4;
    	let t28;
    	let div23;
    	let div22;
    	let div21;
    	let div17;
    	let h42;
    	let t30;
    	let button3;
    	let t31;
    	let div19;
    	let div18;
    	let table1;
    	let thead1;
    	let tr1;
    	let th4;
    	let t33;
    	let th5;
    	let t35;
    	let tbody1;
    	let t36;
    	let div20;
    	let button4;
    	let t38;
    	let div29;
    	let div28;
    	let div27;
    	let div24;
    	let h43;
    	let t40;
    	let button5;
    	let t41;
    	let div25;
    	let form0;
    	let input0;
    	let t42;
    	let div26;
    	let button6;
    	let t44;
    	let div35;
    	let div34;
    	let div33;
    	let div30;
    	let h44;
    	let t46;
    	let button7;
    	let t47;
    	let div31;
    	let form1;
    	let input1;
    	let t48;
    	let div32;
    	let button8;
    	let t50;
    	let div41;
    	let div40;
    	let div39;
    	let div36;
    	let h45;
    	let t52;
    	let button9;
    	let t53;
    	let div37;
    	let form2;
    	let input2;
    	let t54;
    	let br2;
    	let t55;
    	let input3;
    	let t56;
    	let div38;
    	let button10;
    	let t58;
    	let button11;
    	let t60;
    	let div47;
    	let div46;
    	let div45;
    	let div42;
    	let h46;
    	let t62;
    	let button12;
    	let t63;
    	let div43;
    	let form3;
    	let h31;
    	let t64;
    	let t65;
    	let t66;
    	let h32;
    	let t67;
    	let t68;
    	let t69;
    	let h33;
    	let t70;
    	let t71;
    	let t72;
    	let div44;
    	let button13;
    	let t74;
    	let script0;
    	let script0_src_value;
    	let t75;
    	let script1;
    	let script1_src_value;
    	let mounted;
    	let dispose;
    	let if_block0 = /*$tokenStore*/ ctx[6].token != '' && create_if_block_3$3(ctx);
    	let if_block1 = /*$tokenStore*/ ctx[6].token != '' && create_if_block_2$3(ctx);
    	let if_block2 = /*$tokenStore*/ ctx[6].token != '' && create_if_block_1$3(ctx);
    	let each_value = /*itemsToDisplay*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			body = element("body");
    			div16 = element("div");
    			nav0 = element("nav");
    			div3 = element("div");
    			a0 = element("a");
    			div0 = element("div");
    			i0 = element("i");
    			t0 = space();
    			div1 = element("div");
    			span0 = element("span");
    			t1 = text("Planion\r\n                        ");
    			br0 = element("br");
    			t2 = space();
    			span1 = element("span");
    			t3 = text("Start planning today!\r\n                            ");
    			br1 = element("br");
    			t4 = text(" ");
    			t5 = space();
    			ul0 = element("ul");
    			if (if_block0) if_block0.c();
    			t6 = space();
    			li0 = element("li");
    			a1 = element("a");
    			i1 = element("i");
    			t7 = space();
    			span2 = element("span");
    			span2.textContent = "Log out";
    			t9 = space();
    			div2 = element("div");
    			button0 = element("button");
    			t10 = space();
    			div15 = element("div");
    			div12 = element("div");
    			nav1 = element("nav");
    			div4 = element("div");
    			button1 = element("button");
    			i2 = element("i");
    			t11 = space();
    			ul1 = element("ul");
    			li1 = element("li");
    			a2 = element("a");
    			if (if_block1) if_block1.c();
    			t12 = space();
    			div11 = element("div");
    			div7 = element("div");
    			div5 = element("div");
    			h30 = element("h3");
    			t13 = text("Welcome\r\n                            ");
    			if (if_block2) if_block2.c();
    			t14 = space();
    			div6 = element("div");
    			h40 = element("h4");
    			h40.textContent = "Here are your reservations!";
    			t16 = space();
    			h41 = element("h4");
    			t17 = text("Add a reservation here \r\n                            ");
    			button2 = element("button");
    			i3 = element("i");
    			t18 = space();
    			div10 = element("div");
    			div9 = element("div");
    			div8 = element("div");
    			table0 = element("table");
    			thead0 = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "shift date";
    			t20 = space();
    			th1 = element("th");
    			th1.textContent = "is morning shift";
    			t22 = space();
    			th2 = element("th");
    			t23 = space();
    			th3 = element("th");
    			t24 = space();
    			tbody0 = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t25 = space();
    			footer = element("footer");
    			div14 = element("div");
    			div13 = element("div");
    			span3 = element("span");
    			span3.textContent = "Copyright © Planion 2021";
    			t27 = space();
    			a3 = element("a");
    			i4 = element("i");
    			t28 = space();
    			div23 = element("div");
    			div22 = element("div");
    			div21 = element("div");
    			div17 = element("div");
    			h42 = element("h4");
    			h42.textContent = "All the bids placed";
    			t30 = space();
    			button3 = element("button");
    			t31 = space();
    			div19 = element("div");
    			div18 = element("div");
    			table1 = element("table");
    			thead1 = element("thead");
    			tr1 = element("tr");
    			th4 = element("th");
    			th4.textContent = "Placed By User ID";
    			t33 = space();
    			th5 = element("th");
    			th5.textContent = "Bid Price";
    			t35 = space();
    			tbody1 = element("tbody");
    			t36 = space();
    			div20 = element("div");
    			button4 = element("button");
    			button4.textContent = "Close";
    			t38 = space();
    			div29 = element("div");
    			div28 = element("div");
    			div27 = element("div");
    			div24 = element("div");
    			h43 = element("h4");
    			h43.textContent = "Place a bid";
    			t40 = space();
    			button5 = element("button");
    			t41 = space();
    			div25 = element("div");
    			form0 = element("form");
    			input0 = element("input");
    			t42 = space();
    			div26 = element("div");
    			button6 = element("button");
    			button6.textContent = "Save";
    			t44 = space();
    			div35 = element("div");
    			div34 = element("div");
    			div33 = element("div");
    			div30 = element("div");
    			h44 = element("h4");
    			h44.textContent = "Your account info";
    			t46 = space();
    			button7 = element("button");
    			t47 = space();
    			div31 = element("div");
    			form1 = element("form");
    			input1 = element("input");
    			t48 = space();
    			div32 = element("div");
    			button8 = element("button");
    			button8.textContent = "Close";
    			t50 = space();
    			div41 = element("div");
    			div40 = element("div");
    			div39 = element("div");
    			div36 = element("div");
    			h45 = element("h4");
    			h45.textContent = "Add a reservation";
    			t52 = space();
    			button9 = element("button");
    			t53 = space();
    			div37 = element("div");
    			form2 = element("form");
    			input2 = element("input");
    			t54 = space();
    			br2 = element("br");
    			t55 = text("\r\n                    Is morning shift:\r\n                    ");
    			input3 = element("input");
    			t56 = space();
    			div38 = element("div");
    			button10 = element("button");
    			button10.textContent = "Close";
    			t58 = space();
    			button11 = element("button");
    			button11.textContent = "Add Reservation";
    			t60 = space();
    			div47 = element("div");
    			div46 = element("div");
    			div45 = element("div");
    			div42 = element("div");
    			h46 = element("h4");
    			h46.textContent = "Your info";
    			t62 = space();
    			button12 = element("button");
    			t63 = space();
    			div43 = element("div");
    			form3 = element("form");
    			h31 = element("h3");
    			t64 = text("Name: ");
    			t65 = text(/*myName*/ ctx[2]);
    			t66 = space();
    			h32 = element("h3");
    			t67 = text("Department: ");
    			t68 = text(/*myDepartment*/ ctx[3]);
    			t69 = space();
    			h33 = element("h3");
    			t70 = text("Email: ");
    			t71 = text(/*myEmail*/ ctx[1]);
    			t72 = space();
    			div44 = element("div");
    			button13 = element("button");
    			button13.textContent = "Close";
    			t74 = space();
    			script0 = element("script");
    			t75 = space();
    			script1 = element("script");
    			attr_dev(i0, "class", "far fa-calendar-alt");
    			add_location(i0, file$7, 181, 20, 6093);
    			attr_dev(div0, "class", "sidebar-brand-icon rotate-n-15");
    			add_location(div0, file$7, 180, 16, 6027);
    			add_location(br0, file$7, 185, 24, 6293);
    			set_style(span0, "font-size", "25px");
    			add_location(span0, file$7, 184, 20, 6229);
    			add_location(br1, file$7, 189, 28, 6512);
    			attr_dev(span1, "class", "text-capitalize");
    			set_style(span1, "font-size", "12px");
    			set_style(span1, "font-family", "'Bad Script', serif");
    			add_location(span1, file$7, 187, 20, 6348);
    			attr_dev(div1, "class", "sidebar-brand-text mx-3");
    			add_location(div1, file$7, 183, 16, 6170);
    			attr_dev(a0, "class", "navbar-brand d-flex justify-content-center align-items-center sidebar-brand m-0");
    			attr_dev(a0, "href", "");
    			set_style(a0, "padding-top", "36px");
    			add_location(a0, file$7, 178, 12, 5866);
    			attr_dev(i1, "class", "far fa-user-circle");
    			add_location(i1, file$7, 215, 24, 7746);
    			add_location(span2, file$7, 216, 24, 7806);
    			attr_dev(a1, "class", "nav-link");
    			attr_dev(a1, "href", "/login");
    			add_location(a1, file$7, 214, 20, 7652);
    			attr_dev(li0, "class", "nav-item");
    			add_location(li0, file$7, 213, 16, 7609);
    			attr_dev(ul0, "class", "navbar-nav text-light");
    			attr_dev(ul0, "id", "accordionSidebar");
    			set_style(ul0, "margin-top", "16px");
    			add_location(ul0, file$7, 193, 12, 6607);
    			attr_dev(button0, "class", "btn rounded-circle border-0");
    			attr_dev(button0, "id", "sidebarToggle");
    			attr_dev(button0, "type", "button");
    			add_location(button0, file$7, 221, 16, 7970);
    			attr_dev(div2, "class", "text-center d-none d-md-inline");
    			add_location(div2, file$7, 220, 12, 7908);
    			attr_dev(div3, "class", "container-fluid d-flex flex-column p-0");
    			add_location(div3, file$7, 177, 8, 5800);
    			attr_dev(nav0, "class", "navbar navbar-dark align-items-start sidebar sidebar-dark accordion bg p-0 svelte-t7xm2n");
    			add_location(nav0, file$7, 176, 4, 5702);
    			attr_dev(i2, "class", "fas fa-bars");
    			add_location(i2, file$7, 230, 24, 8481);
    			attr_dev(button1, "class", "btn btn-link d-md-none rounded-circle me-3");
    			attr_dev(button1, "id", "sidebarToggleTop");
    			attr_dev(button1, "type", "button");
    			add_location(button1, file$7, 229, 20, 8360);
    			attr_dev(a2, "class", "nav-link oneLine");
    			attr_dev(a2, "data-bs-target", "#modal-5");
    			attr_dev(a2, "data-bs-toggle", "modal");
    			add_location(a2, file$7, 235, 28, 8683);
    			attr_dev(li1, "class", "nav-item");
    			add_location(li1, file$7, 234, 24, 8632);
    			attr_dev(ul1, "class", "navbar-nav flex-nowrap ms-auto");
    			add_location(ul1, file$7, 233, 20, 8563);
    			attr_dev(div4, "class", "container-fluid");
    			add_location(div4, file$7, 228, 16, 8309);
    			attr_dev(nav1, "class", "navbar navbar-light navbar-expand bg-white shadow mb-4 topbar static-top");
    			add_location(nav1, file$7, 227, 12, 8205);
    			attr_dev(h30, "class", "text-dark d-table mb-0");
    			add_location(h30, file$7, 247, 24, 9240);
    			attr_dev(div5, "class", "col-12");
    			add_location(div5, file$7, 246, 20, 9194);
    			add_location(h40, file$7, 254, 24, 9601);
    			attr_dev(i3, "class", "fas fa-plus");
    			add_location(i3, file$7, 260, 32, 10124);
    			attr_dev(button2, "class", "btn btn-primary border rounded-circle justify-content-xl-center align-items-xl-center");
    			attr_dev(button2, "id", "add-button");
    			attr_dev(button2, "type", "button");
    			set_style(button2, "border-radius", "0");
    			attr_dev(button2, "data-bs-target", "#modal-4");
    			attr_dev(button2, "data-bs-toggle", "modal");
    			add_location(button2, file$7, 256, 28, 9772);
    			attr_dev(h41, "class", "text-dark");
    			set_style(h41, "margin-bottom", "13px");
    			add_location(h41, file$7, 255, 24, 9663);
    			attr_dev(div6, "class", "col-12");
    			set_style(div6, "margin-bottom", "5px");
    			add_location(div6, file$7, 253, 20, 9527);
    			attr_dev(div7, "class", "row");
    			add_location(div7, file$7, 245, 16, 9155);
    			add_location(th0, file$7, 272, 36, 10593);
    			add_location(th1, file$7, 273, 36, 10650);
    			add_location(th2, file$7, 274, 36, 10713);
    			add_location(th3, file$7, 275, 36, 10760);
    			attr_dev(tr0, "class", "text-center");
    			add_location(tr0, file$7, 271, 32, 10531);
    			add_location(thead0, file$7, 270, 32, 10490);
    			attr_dev(tbody0, "class", "text-center");
    			add_location(tbody0, file$7, 278, 32, 10884);
    			attr_dev(table0, "class", "table");
    			add_location(table0, file$7, 269, 28, 10435);
    			attr_dev(div8, "class", "table-responsive");
    			add_location(div8, file$7, 268, 24, 10375);
    			attr_dev(div9, "class", "col");
    			add_location(div9, file$7, 267, 20, 10332);
    			attr_dev(div10, "class", "row");
    			add_location(div10, file$7, 266, 16, 10293);
    			attr_dev(div11, "class", "container-fluid");
    			add_location(div11, file$7, 244, 12, 9108);
    			attr_dev(div12, "id", "content");
    			add_location(div12, file$7, 226, 8, 8173);
    			add_location(span3, file$7, 323, 59, 13601);
    			attr_dev(div13, "class", "text-center my-auto copyright");
    			add_location(div13, file$7, 323, 16, 13558);
    			attr_dev(div14, "class", "container my-auto");
    			add_location(div14, file$7, 322, 12, 13509);
    			attr_dev(footer, "class", "bg-white d-xl-flex justify-content-xl-center align-items-xl-end sticky-footer");
    			add_location(footer, file$7, 321, 8, 13401);
    			attr_dev(div15, "class", "d-flex flex-column");
    			attr_dev(div15, "id", "content-wrapper");
    			add_location(div15, file$7, 225, 4, 8110);
    			attr_dev(i4, "class", "fas fa-angle-up");
    			add_location(i4, file$7, 327, 70, 13767);
    			attr_dev(a3, "class", "border rounded d-inline scroll-to-top");
    			attr_dev(a3, "href", "#page-top");
    			add_location(a3, file$7, 327, 4, 13701);
    			attr_dev(div16, "id", "wrapper");
    			add_location(div16, file$7, 175, 0, 5678);
    			attr_dev(h42, "class", "modal-title");
    			add_location(h42, file$7, 331, 38, 14046);
    			attr_dev(button3, "type", "button");
    			attr_dev(button3, "class", "btn-close");
    			attr_dev(button3, "data-bs-dismiss", "modal");
    			attr_dev(button3, "aria-label", "Close");
    			add_location(button3, file$7, 332, 16, 14112);
    			attr_dev(div17, "class", "modal-header");
    			add_location(div17, file$7, 331, 12, 14020);
    			add_location(th4, file$7, 339, 28, 14460);
    			add_location(th5, file$7, 340, 28, 14516);
    			add_location(tr1, file$7, 338, 24, 14426);
    			add_location(thead1, file$7, 337, 24, 14393);
    			add_location(tbody1, file$7, 343, 24, 14625);
    			attr_dev(table1, "class", "table table-striped");
    			add_location(table1, file$7, 336, 20, 14332);
    			attr_dev(div18, "class", "table-responsive");
    			add_location(div18, file$7, 335, 16, 14280);
    			attr_dev(div19, "class", "modal-body");
    			add_location(div19, file$7, 334, 12, 14238);
    			attr_dev(button4, "class", "btn btn-danger");
    			attr_dev(button4, "type", "button");
    			attr_dev(button4, "data-bs-dismiss", "modal");
    			add_location(button4, file$7, 351, 16, 14802);
    			attr_dev(div20, "class", "modal-footer");
    			add_location(div20, file$7, 350, 12, 14758);
    			attr_dev(div21, "class", "modal-content");
    			add_location(div21, file$7, 330, 8, 13979);
    			attr_dev(div22, "class", "modal-dialog modal-dialog-centered modal-dialog-scrollable");
    			attr_dev(div22, "role", "document");
    			add_location(div22, file$7, 329, 4, 13881);
    			attr_dev(div23, "class", "modal fade");
    			attr_dev(div23, "role", "dialog");
    			attr_dev(div23, "tabindex", "-1");
    			attr_dev(div23, "id", "modal-1");
    			add_location(div23, file$7, 328, 0, 13810);
    			attr_dev(h43, "class", "modal-title");
    			add_location(h43, file$7, 359, 38, 15155);
    			attr_dev(button5, "type", "button");
    			attr_dev(button5, "class", "btn-close");
    			attr_dev(button5, "data-bs-dismiss", "modal");
    			attr_dev(button5, "aria-label", "Close");
    			add_location(button5, file$7, 360, 16, 15213);
    			attr_dev(div24, "class", "modal-header");
    			add_location(div24, file$7, 359, 12, 15129);
    			attr_dev(input0, "class", "form-control");
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "name", "price");
    			attr_dev(input0, "placeholder", "Enter the price ");
    			input0.required = "true";
    			add_location(input0, file$7, 363, 22, 15387);
    			add_location(form0, file$7, 363, 16, 15381);
    			attr_dev(div25, "class", "modal-body");
    			add_location(div25, file$7, 362, 12, 15339);
    			attr_dev(button6, "class", "btn btn-primary");
    			attr_dev(button6, "type", "submit");
    			attr_dev(button6, "data-bs-dismiss", "modal");
    			add_location(button6, file$7, 367, 16, 15593);
    			attr_dev(div26, "class", "modal-footer");
    			add_location(div26, file$7, 366, 12, 15549);
    			attr_dev(div27, "class", "modal-content");
    			add_location(div27, file$7, 358, 8, 15088);
    			attr_dev(div28, "class", "modal-dialog modal-dialog-centered");
    			attr_dev(div28, "role", "document");
    			add_location(div28, file$7, 357, 4, 15014);
    			attr_dev(div29, "class", "modal fade");
    			attr_dev(div29, "role", "dialog");
    			attr_dev(div29, "tabindex", "-1");
    			attr_dev(div29, "id", "modal-2");
    			add_location(div29, file$7, 356, 0, 14943);
    			attr_dev(h44, "class", "modal-title");
    			add_location(h44, file$7, 375, 38, 15946);
    			attr_dev(button7, "type", "button");
    			attr_dev(button7, "class", "btn-close");
    			attr_dev(button7, "data-bs-dismiss", "modal");
    			attr_dev(button7, "aria-label", "Close");
    			add_location(button7, file$7, 376, 16, 16010);
    			attr_dev(div30, "class", "modal-header");
    			add_location(div30, file$7, 375, 12, 15920);
    			attr_dev(input1, "class", "form-control");
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "name", "price");
    			attr_dev(input1, "placeholder", "Enter the price ");
    			input1.required = "true";
    			add_location(input1, file$7, 380, 20, 16206);
    			add_location(form1, file$7, 379, 16, 16178);
    			attr_dev(div31, "class", "modal-body");
    			add_location(div31, file$7, 378, 12, 16136);
    			attr_dev(button8, "class", "btn btn-primary");
    			attr_dev(button8, "type", "submit");
    			attr_dev(button8, "data-bs-dismiss", "modal");
    			add_location(button8, file$7, 384, 16, 16412);
    			attr_dev(div32, "class", "modal-footer");
    			add_location(div32, file$7, 383, 12, 16368);
    			attr_dev(div33, "class", "modal-content");
    			add_location(div33, file$7, 374, 8, 15879);
    			attr_dev(div34, "class", "modal-dialog modal-dialog-centered");
    			attr_dev(div34, "role", "document");
    			add_location(div34, file$7, 373, 4, 15805);
    			attr_dev(div35, "class", "modal fade");
    			attr_dev(div35, "role", "dialog");
    			attr_dev(div35, "tabindex", "-1");
    			attr_dev(div35, "id", "modal-3");
    			add_location(div35, file$7, 372, 0, 15734);
    			attr_dev(h45, "class", "modal-title");
    			add_location(h45, file$7, 392, 38, 16840);
    			attr_dev(button9, "type", "button");
    			attr_dev(button9, "class", "btn-close");
    			attr_dev(button9, "data-bs-dismiss", "modal");
    			attr_dev(button9, "aria-label", "Close");
    			add_location(button9, file$7, 393, 16, 16904);
    			attr_dev(div36, "class", "modal-header");
    			add_location(div36, file$7, 392, 12, 16814);
    			attr_dev(input2, "min", /*today*/ ctx[7]);
    			attr_dev(input2, "type", "date");
    			input2.required = true;
    			add_location(input2, file$7, 397, 20, 17100);
    			add_location(br2, file$7, 398, 20, 17205);
    			attr_dev(input3, "type", "checkbox");
    			attr_dev(input3, "name", "scales");
    			add_location(input3, file$7, 400, 20, 17270);
    			add_location(form2, file$7, 396, 16, 17072);
    			attr_dev(div37, "class", "modal-body");
    			add_location(div37, file$7, 395, 12, 17030);
    			attr_dev(button10, "class", "btn btn-danger");
    			attr_dev(button10, "type", "button");
    			attr_dev(button10, "data-bs-dismiss", "modal");
    			add_location(button10, file$7, 405, 16, 17491);
    			attr_dev(button11, "class", "btn btn-primary");
    			attr_dev(button11, "data-bs-dismiss", "modal");
    			attr_dev(button11, "type", "submit");
    			add_location(button11, file$7, 406, 16, 17592);
    			attr_dev(div38, "class", "modal-footer");
    			add_location(div38, file$7, 404, 12, 17447);
    			attr_dev(div39, "class", "modal-content");
    			add_location(div39, file$7, 391, 8, 16773);
    			attr_dev(div40, "class", "modal-dialog modal-dialog-centered modal-dialog-scrollable");
    			attr_dev(div40, "role", "document");
    			add_location(div40, file$7, 390, 4, 16675);
    			attr_dev(div41, "class", "modal fade");
    			attr_dev(div41, "role", "dialog");
    			attr_dev(div41, "tabindex", "-1");
    			attr_dev(div41, "id", "modal-4");
    			attr_dev(div41, "aria-hidden", "true");
    			attr_dev(div41, "aria-labelledby", "modal-4label");
    			add_location(div41, file$7, 389, 0, 16554);
    			attr_dev(h46, "class", "modal-title");
    			add_location(h46, file$7, 416, 38, 18060);
    			attr_dev(button12, "type", "button");
    			attr_dev(button12, "class", "btn-close");
    			attr_dev(button12, "data-bs-dismiss", "modal");
    			attr_dev(button12, "aria-label", "Close");
    			add_location(button12, file$7, 417, 16, 18116);
    			attr_dev(div42, "class", "modal-header");
    			add_location(div42, file$7, 416, 12, 18034);
    			add_location(h31, file$7, 422, 20, 18314);
    			add_location(h32, file$7, 423, 20, 18359);
    			add_location(h33, file$7, 424, 20, 18416);
    			add_location(form3, file$7, 420, 16, 18284);
    			attr_dev(div43, "class", "modal-body");
    			add_location(div43, file$7, 419, 12, 18242);
    			attr_dev(button13, "class", "btn btn-danger");
    			attr_dev(button13, "type", "button");
    			attr_dev(button13, "data-bs-dismiss", "modal");
    			add_location(button13, file$7, 429, 16, 18546);
    			attr_dev(div44, "class", "modal-footer");
    			add_location(div44, file$7, 428, 12, 18502);
    			attr_dev(div45, "class", "modal-content");
    			add_location(div45, file$7, 415, 8, 17993);
    			attr_dev(div46, "class", "modal-dialog modal-dialog-centered modal-dialog-scrollable");
    			attr_dev(div46, "role", "document");
    			add_location(div46, file$7, 414, 4, 17895);
    			attr_dev(div47, "class", "modal fade");
    			attr_dev(div47, "role", "dialog");
    			attr_dev(div47, "tabindex", "-1");
    			attr_dev(div47, "id", "modal-5");
    			attr_dev(div47, "aria-hidden", "true");
    			attr_dev(div47, "aria-labelledby", "modal-5label");
    			add_location(div47, file$7, 413, 0, 17774);
    			script0.defer = true;
    			if (!src_url_equal(script0.src, script0_src_value = "https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js")) attr_dev(script0, "src", script0_src_value);
    			add_location(script0, file$7, 436, 0, 18691);
    			script1.defer = true;
    			if (!src_url_equal(script1.src, script1_src_value = "assets/js/script.min.js")) attr_dev(script1, "src", script1_src_value);
    			add_location(script1, file$7, 437, 0, 18799);
    			attr_dev(body, "id", "page-top");
    			add_location(body, file$7, 174, 0, 5656);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, body, anchor);
    			append_dev(body, div16);
    			append_dev(div16, nav0);
    			append_dev(nav0, div3);
    			append_dev(div3, a0);
    			append_dev(a0, div0);
    			append_dev(div0, i0);
    			append_dev(a0, t0);
    			append_dev(a0, div1);
    			append_dev(div1, span0);
    			append_dev(span0, t1);
    			append_dev(span0, br0);
    			append_dev(div1, t2);
    			append_dev(div1, span1);
    			append_dev(span1, t3);
    			append_dev(span1, br1);
    			append_dev(span1, t4);
    			append_dev(div3, t5);
    			append_dev(div3, ul0);
    			if (if_block0) if_block0.m(ul0, null);
    			append_dev(ul0, t6);
    			append_dev(ul0, li0);
    			append_dev(li0, a1);
    			append_dev(a1, i1);
    			append_dev(a1, t7);
    			append_dev(a1, span2);
    			append_dev(div3, t9);
    			append_dev(div3, div2);
    			append_dev(div2, button0);
    			append_dev(div16, t10);
    			append_dev(div16, div15);
    			append_dev(div15, div12);
    			append_dev(div12, nav1);
    			append_dev(nav1, div4);
    			append_dev(div4, button1);
    			append_dev(button1, i2);
    			append_dev(div4, t11);
    			append_dev(div4, ul1);
    			append_dev(ul1, li1);
    			append_dev(li1, a2);
    			if (if_block1) if_block1.m(a2, null);
    			append_dev(div12, t12);
    			append_dev(div12, div11);
    			append_dev(div11, div7);
    			append_dev(div7, div5);
    			append_dev(div5, h30);
    			append_dev(h30, t13);
    			if (if_block2) if_block2.m(h30, null);
    			append_dev(div7, t14);
    			append_dev(div7, div6);
    			append_dev(div6, h40);
    			append_dev(div6, t16);
    			append_dev(div6, h41);
    			append_dev(h41, t17);
    			append_dev(h41, button2);
    			append_dev(button2, i3);
    			append_dev(div11, t18);
    			append_dev(div11, div10);
    			append_dev(div10, div9);
    			append_dev(div9, div8);
    			append_dev(div8, table0);
    			append_dev(table0, thead0);
    			append_dev(thead0, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t20);
    			append_dev(tr0, th1);
    			append_dev(tr0, t22);
    			append_dev(tr0, th2);
    			append_dev(tr0, t23);
    			append_dev(tr0, th3);
    			append_dev(table0, t24);
    			append_dev(table0, tbody0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody0, null);
    			}

    			append_dev(div15, t25);
    			append_dev(div15, footer);
    			append_dev(footer, div14);
    			append_dev(div14, div13);
    			append_dev(div13, span3);
    			append_dev(div16, t27);
    			append_dev(div16, a3);
    			append_dev(a3, i4);
    			append_dev(body, t28);
    			append_dev(body, div23);
    			append_dev(div23, div22);
    			append_dev(div22, div21);
    			append_dev(div21, div17);
    			append_dev(div17, h42);
    			append_dev(div17, t30);
    			append_dev(div17, button3);
    			append_dev(div21, t31);
    			append_dev(div21, div19);
    			append_dev(div19, div18);
    			append_dev(div18, table1);
    			append_dev(table1, thead1);
    			append_dev(thead1, tr1);
    			append_dev(tr1, th4);
    			append_dev(tr1, t33);
    			append_dev(tr1, th5);
    			append_dev(table1, t35);
    			append_dev(table1, tbody1);
    			append_dev(div21, t36);
    			append_dev(div21, div20);
    			append_dev(div20, button4);
    			append_dev(body, t38);
    			append_dev(body, div29);
    			append_dev(div29, div28);
    			append_dev(div28, div27);
    			append_dev(div27, div24);
    			append_dev(div24, h43);
    			append_dev(div24, t40);
    			append_dev(div24, button5);
    			append_dev(div27, t41);
    			append_dev(div27, div25);
    			append_dev(div25, form0);
    			append_dev(form0, input0);
    			append_dev(div27, t42);
    			append_dev(div27, div26);
    			append_dev(div26, button6);
    			append_dev(body, t44);
    			append_dev(body, div35);
    			append_dev(div35, div34);
    			append_dev(div34, div33);
    			append_dev(div33, div30);
    			append_dev(div30, h44);
    			append_dev(div30, t46);
    			append_dev(div30, button7);
    			append_dev(div33, t47);
    			append_dev(div33, div31);
    			append_dev(div31, form1);
    			append_dev(form1, input1);
    			append_dev(div33, t48);
    			append_dev(div33, div32);
    			append_dev(div32, button8);
    			append_dev(body, t50);
    			append_dev(body, div41);
    			append_dev(div41, div40);
    			append_dev(div40, div39);
    			append_dev(div39, div36);
    			append_dev(div36, h45);
    			append_dev(div36, t52);
    			append_dev(div36, button9);
    			append_dev(div39, t53);
    			append_dev(div39, div37);
    			append_dev(div37, form2);
    			append_dev(form2, input2);
    			set_input_value(input2, /*shiftDateForAddingReservation*/ ctx[4]);
    			append_dev(form2, t54);
    			append_dev(form2, br2);
    			append_dev(form2, t55);
    			append_dev(form2, input3);
    			input3.checked = /*isMorningShiftForAddingReservation*/ ctx[5];
    			append_dev(div39, t56);
    			append_dev(div39, div38);
    			append_dev(div38, button10);
    			append_dev(div38, t58);
    			append_dev(div38, button11);
    			append_dev(body, t60);
    			append_dev(body, div47);
    			append_dev(div47, div46);
    			append_dev(div46, div45);
    			append_dev(div45, div42);
    			append_dev(div42, h46);
    			append_dev(div42, t62);
    			append_dev(div42, button12);
    			append_dev(div45, t63);
    			append_dev(div45, div43);
    			append_dev(div43, form3);
    			append_dev(form3, h31);
    			append_dev(h31, t64);
    			append_dev(h31, t65);
    			append_dev(form3, t66);
    			append_dev(form3, h32);
    			append_dev(h32, t67);
    			append_dev(h32, t68);
    			append_dev(form3, t69);
    			append_dev(form3, h33);
    			append_dev(h33, t70);
    			append_dev(h33, t71);
    			append_dev(div45, t72);
    			append_dev(div45, div44);
    			append_dev(div44, button13);
    			append_dev(body, t74);
    			append_dev(body, script0);
    			append_dev(body, t75);
    			append_dev(body, script1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						a1,
    						"click",
    						function () {
    							if (is_function(/*$tokenStore*/ ctx[6].token = '')) (/*$tokenStore*/ ctx[6].token = '').apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(a2, "click", /*getMyInfo*/ ctx[8], false, false, false),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[11]),
    					listen_dev(input3, "change", /*input3_change_handler*/ ctx[12]),
    					listen_dev(button11, "click", /*addReservation*/ ctx[9], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (/*$tokenStore*/ ctx[6].token != '') {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_3$3(ctx);
    					if_block0.c();
    					if_block0.m(ul0, t6);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*$tokenStore*/ ctx[6].token != '') {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_2$3(ctx);
    					if_block1.c();
    					if_block1.m(a2, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*$tokenStore*/ ctx[6].token != '') {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_1$3(ctx);
    					if_block2.c();
    					if_block2.m(h30, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (dirty & /*deleteBooking, itemsToDisplay, today*/ 1153) {
    				each_value = /*itemsToDisplay*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*shiftDateForAddingReservation*/ 16) {
    				set_input_value(input2, /*shiftDateForAddingReservation*/ ctx[4]);
    			}

    			if (dirty & /*isMorningShiftForAddingReservation*/ 32) {
    				input3.checked = /*isMorningShiftForAddingReservation*/ ctx[5];
    			}

    			if (dirty & /*myName*/ 4) set_data_dev(t65, /*myName*/ ctx[2]);
    			if (dirty & /*myDepartment*/ 8) set_data_dev(t68, /*myDepartment*/ ctx[3]);
    			if (dirty & /*myEmail*/ 2) set_data_dev(t71, /*myEmail*/ ctx[1]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(body);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function parseJwt$3(token) {
    	if (token != '') {
    		var base64Url = token.split('.')[1];
    		var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    		var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    			return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    		}).join(''));

    		return JSON.parse(jsonPayload);
    	}
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let $tokenStore;
    	validate_store(store, 'tokenStore');
    	component_subscribe($$self, store, $$value => $$invalidate(6, $tokenStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	let targetURL = 'http://localhost:3000/bookings';
    	let targetURLUsers = 'http://localhost:3000/users';
    	let items = [];
    	let itemsToDisplay = [];
    	let today = new Date().toISOString().split("T")[0];

    	async function getBookings() {
    		try {
    			const resp = await fetch(targetURL, {
    				method: 'GET',
    				headers: {
    					'Content-type': 'application/json',
    					'authorization': 'Bearer ' + $tokenStore.token
    				}
    			});

    			items = await resp.json();
    			console.log("items:");
    			console.log(items);

    			for (const item of items) {
    				if (item.userEmail == parseJwt$3($tokenStore.token).email) {
    					itemsToDisplay.push(item);
    					$$invalidate(0, itemsToDisplay);
    				}
    			}
    		} catch(e) {
    			alert(e);
    		}
    	}

    	getBookings();

    	//now each item in the items has 6 keys. the one extra key is highestBid
    	let employees = [];

    	let nameForDisplaying;
    	let phoneForDisplaying;
    	let emailForDisplaying;
    	let departmentForDisplaying;

    	async function getEmployee() {
    		console.log('getEmployee called');

    		try {
    			const resp = await fetch(targetURLUsers + '/' + parseJwt$3($tokenStore.token)._id, {
    				method: 'GET',
    				headers: {
    					'Content-type': 'application/json',
    					'authorization': 'Bearer ' + $tokenStore.token
    				}
    			});

    			let tempItems = await resp.json();

    			for (const tempItem of tempItems) {
    				employees.push(tempItem);
    				employees = employees;
    			}

    			nameForDisplaying = employees[0].name;
    			phoneForDisplaying = employees[0].phone;
    			emailForDisplaying = employees[0].email;
    			departmentForDisplaying = employees[0].department;
    		} catch(e) {
    			console.error(e);
    		}
    	}

    	let myEmail = '';
    	let myName = '';
    	let myDepartment = '';
    	let targetURLGetMyself = 'http://localhost:3000/users/' + parseJwt$3($tokenStore.token).email;

    	async function getMyInfo() {
    		console.log("getMyInfo called");

    		try {
    			const resp = await fetch(targetURLGetMyself, {
    				method: 'GET',
    				headers: {
    					'Content-type': 'application/json',
    					'authorization': 'Bearer ' + $tokenStore.token
    				}
    			});

    			let tempItems = await resp.json();
    			$$invalidate(1, myEmail = tempItems[0].email);
    			$$invalidate(2, myName = tempItems[0].name);
    			$$invalidate(3, myDepartment = tempItems[0].department);
    		} catch(e) {
    			console.error(e);
    		}
    	}

    	let shiftDateForAddingReservation;
    	let isMorningShiftForAddingReservation = false;

    	async function addReservation() {
    		await fetch(targetURL, {
    			method: "POST",
    			headers: {
    				"Content-Type": "application/json",
    				'authorization': 'Bearer ' + $tokenStore.token
    			},
    			body: JSON.stringify({
    				userEmail: parseJwt$3($tokenStore.token).email,
    				shiftDate: shiftDateForAddingReservation,
    				isMorningShift: isMorningShiftForAddingReservation
    			})
    		}).then(async res => {
    			if (res.ok) {
    				//location.reload();
    				page.redirect('/admin-page');

    				page.redirect('/home');
    				console.log("Success!");
    			} else {
    				res.json().then(body => {
    					alert(body.message || "Internal error");
    				});
    			}
    		}).catch(async err => {
    			alert(err);
    		});
    	}

    	async function deleteBooking(id) {
    		await fetch(targetURL + '/' + id, {
    			method: 'DELETE',
    			headers: {
    				'Content-type': 'application/json',
    				'authorization': 'Bearer ' + $tokenStore.token
    			}
    		}).then(async res => {
    			if (res.ok) {
    				page.redirect('/admin-page');
    				page.redirect('/home');
    				console.log("Success!");
    			} else {
    				res.json().then(body => {
    					alert(body.message || "Internal error");
    				});
    			}
    		}).catch(async err => {
    			alert(err);
    		});
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$4.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	function input2_input_handler() {
    		shiftDateForAddingReservation = this.value;
    		$$invalidate(4, shiftDateForAddingReservation);
    	}

    	function input3_change_handler() {
    		isMorningShiftForAddingReservation = this.checked;
    		$$invalidate(5, isMorningShiftForAddingReservation);
    	}

    	$$self.$capture_state = () => ({
    		tokenStore: store,
    		router: page,
    		targetURL,
    		targetURLUsers,
    		items,
    		itemsToDisplay,
    		today,
    		parseJwt: parseJwt$3,
    		getBookings,
    		employees,
    		nameForDisplaying,
    		phoneForDisplaying,
    		emailForDisplaying,
    		departmentForDisplaying,
    		getEmployee,
    		myEmail,
    		myName,
    		myDepartment,
    		targetURLGetMyself,
    		getMyInfo,
    		shiftDateForAddingReservation,
    		isMorningShiftForAddingReservation,
    		addReservation,
    		deleteBooking,
    		$tokenStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('targetURL' in $$props) targetURL = $$props.targetURL;
    		if ('targetURLUsers' in $$props) targetURLUsers = $$props.targetURLUsers;
    		if ('items' in $$props) items = $$props.items;
    		if ('itemsToDisplay' in $$props) $$invalidate(0, itemsToDisplay = $$props.itemsToDisplay);
    		if ('today' in $$props) $$invalidate(7, today = $$props.today);
    		if ('employees' in $$props) employees = $$props.employees;
    		if ('nameForDisplaying' in $$props) nameForDisplaying = $$props.nameForDisplaying;
    		if ('phoneForDisplaying' in $$props) phoneForDisplaying = $$props.phoneForDisplaying;
    		if ('emailForDisplaying' in $$props) emailForDisplaying = $$props.emailForDisplaying;
    		if ('departmentForDisplaying' in $$props) departmentForDisplaying = $$props.departmentForDisplaying;
    		if ('myEmail' in $$props) $$invalidate(1, myEmail = $$props.myEmail);
    		if ('myName' in $$props) $$invalidate(2, myName = $$props.myName);
    		if ('myDepartment' in $$props) $$invalidate(3, myDepartment = $$props.myDepartment);
    		if ('targetURLGetMyself' in $$props) targetURLGetMyself = $$props.targetURLGetMyself;
    		if ('shiftDateForAddingReservation' in $$props) $$invalidate(4, shiftDateForAddingReservation = $$props.shiftDateForAddingReservation);
    		if ('isMorningShiftForAddingReservation' in $$props) $$invalidate(5, isMorningShiftForAddingReservation = $$props.isMorningShiftForAddingReservation);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		itemsToDisplay,
    		myEmail,
    		myName,
    		myDepartment,
    		shiftDateForAddingReservation,
    		isMorningShiftForAddingReservation,
    		$tokenStore,
    		today,
    		getMyInfo,
    		addReservation,
    		deleteBooking,
    		input2_input_handler,
    		input3_change_handler
    	];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\routes\Login.svelte generated by Svelte v3.43.2 */

    const { Error: Error_1$1, console: console_1$3 } = globals;
    const file$6 = "src\\routes\\Login.svelte";

    function create_fragment$6(ctx) {
    	let body;
    	let div13;
    	let div12;
    	let div11;
    	let div10;
    	let div9;
    	let div8;
    	let div1;
    	let div0;
    	let t0;
    	let div7;
    	let div6;
    	let div2;
    	let h4;
    	let t1;
    	let svg;
    	let path0;
    	let path1;
    	let t2;
    	let form;
    	let div3;
    	let input0;
    	let t3;
    	let div4;
    	let input1;
    	let t4;
    	let button;
    	let t6;
    	let div5;
    	let t7;
    	let script0;
    	let script0_src_value;
    	let t8;
    	let script1;
    	let script1_src_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			body = element("body");
    			div13 = element("div");
    			div12 = element("div");
    			div11 = element("div");
    			div10 = element("div");
    			div9 = element("div");
    			div8 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div7 = element("div");
    			div6 = element("div");
    			div2 = element("div");
    			h4 = element("h4");
    			t1 = text("Welcome Back! ");
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			t2 = space();
    			form = element("form");
    			div3 = element("div");
    			input0 = element("input");
    			t3 = space();
    			div4 = element("div");
    			input1 = element("input");
    			t4 = space();
    			button = element("button");
    			button.textContent = "Login";
    			t6 = space();
    			div5 = element("div");
    			t7 = space();
    			script0 = element("script");
    			t8 = space();
    			script1 = element("script");
    			attr_dev(div0, "class", "flex-grow-1 bg-login-image");
    			set_style(div0, "background", "url('images/login.jpg') center / cover no-repeat");
    			add_location(div0, file$6, 61, 28, 2230);
    			attr_dev(div1, "class", "col-lg-6 d-none d-lg-flex");
    			add_location(div1, file$6, 60, 24, 2100);
    			attr_dev(path0, "d", "M15.4857 20H19.4857C20.5903 20 21.4857 19.1046 21.4857 18V6C21.4857 4.89543 20.5903 4 19.4857 4H15.4857V6H19.4857V18H15.4857V20Z");
    			attr_dev(path0, "fill", "currentColor");
    			add_location(path0, file$6, 69, 40, 2845);
    			attr_dev(path1, "d", "M10.1582 17.385L8.73801 15.9768L12.6572 12.0242L3.51428 12.0242C2.96199 12.0242 2.51428 11.5765 2.51428 11.0242C2.51429 10.4719 2.962 10.0242 3.51429 10.0242L12.6765 10.0242L8.69599 6.0774L10.1042 4.6572L16.4951 10.9941L10.1582 17.385Z");
    			attr_dev(path1, "fill", "currentColor");
    			add_location(path1, file$6, 71, 40, 3100);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "1em");
    			attr_dev(svg, "height", "1em");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "fill", "none");
    			add_location(svg, file$6, 66, 82, 2616);
    			attr_dev(h4, "class", "text-dark mb-4");
    			add_location(h4, file$6, 66, 36, 2570);
    			attr_dev(div2, "class", "text-center");
    			add_location(div2, file$6, 65, 32, 2507);
    			attr_dev(input0, "class", "form-control form-control-user");
    			attr_dev(input0, "type", "email");
    			attr_dev(input0, "id", "exampleInputEmail");
    			attr_dev(input0, "aria-describedby", "emailHelp");
    			attr_dev(input0, "placeholder", "Enter Email Address");
    			attr_dev(input0, "name", "email");
    			attr_dev(input0, "autocomplete", "on");
    			attr_dev(input0, "inputmode", "email");
    			input0.required = true;
    			add_location(input0, file$6, 78, 40, 3698);
    			attr_dev(div3, "class", "mb-3");
    			add_location(div3, file$6, 77, 36, 3638);
    			attr_dev(input1, "class", "form-control form-control-user");
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "id", "exampleInputPassword");
    			attr_dev(input1, "placeholder", "Password");
    			attr_dev(input1, "name", "password");
    			input1.required = true;
    			add_location(input1, file$6, 84, 40, 4207);
    			attr_dev(div4, "class", "mb-3");
    			add_location(div4, file$6, 83, 36, 4147);
    			attr_dev(button, "class", "btn btn-primary d-block btn-user w-100");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$6, 88, 36, 4543);
    			attr_dev(form, "class", "user");
    			add_location(form, file$6, 76, 32, 3581);
    			attr_dev(div5, "class", "text-center");
    			set_style(div5, "margin-top", "5px");
    			add_location(div5, file$6, 90, 32, 4733);
    			attr_dev(div6, "class", "p-5");
    			add_location(div6, file$6, 64, 28, 2456);
    			attr_dev(div7, "class", "col-lg-6");
    			add_location(div7, file$6, 63, 24, 2404);
    			attr_dev(div8, "class", "row");
    			add_location(div8, file$6, 59, 20, 2057);
    			attr_dev(div9, "class", "card-body p-0");
    			add_location(div9, file$6, 58, 16, 2008);
    			attr_dev(div10, "class", "card shadow-lg o-hidden border-0 my-5");
    			add_location(div10, file$6, 57, 12, 1939);
    			attr_dev(div11, "class", "col-md-9 col-lg-12 col-xl-10");
    			add_location(div11, file$6, 56, 8, 1883);
    			attr_dev(div12, "class", "row justify-content-center");
    			add_location(div12, file$6, 55, 4, 1833);
    			attr_dev(div13, "class", "container");
    			add_location(div13, file$6, 54, 0, 1804);
    			script0.defer = true;
    			if (!src_url_equal(script0.src, script0_src_value = "https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js")) attr_dev(script0, "src", script0_src_value);
    			add_location(script0, file$6, 101, 0, 5003);
    			script1.defer = true;
    			if (!src_url_equal(script1.src, script1_src_value = "assets/js/script.min.js")) attr_dev(script1, "src", script1_src_value);
    			add_location(script1, file$6, 102, 0, 5111);
    			attr_dev(body, "class", "bg-gradient-primary login svelte-afqa6n");
    			add_location(body, file$6, 53, 0, 1762);
    		},
    		l: function claim(nodes) {
    			throw new Error_1$1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, body, anchor);
    			append_dev(body, div13);
    			append_dev(div13, div12);
    			append_dev(div12, div11);
    			append_dev(div11, div10);
    			append_dev(div10, div9);
    			append_dev(div9, div8);
    			append_dev(div8, div1);
    			append_dev(div1, div0);
    			append_dev(div8, t0);
    			append_dev(div8, div7);
    			append_dev(div7, div6);
    			append_dev(div6, div2);
    			append_dev(div2, h4);
    			append_dev(h4, t1);
    			append_dev(h4, svg);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    			append_dev(div6, t2);
    			append_dev(div6, form);
    			append_dev(form, div3);
    			append_dev(div3, input0);
    			set_input_value(input0, /*email*/ ctx[0]);
    			append_dev(form, t3);
    			append_dev(form, div4);
    			append_dev(div4, input1);
    			set_input_value(input1, /*password*/ ctx[1]);
    			append_dev(form, t4);
    			append_dev(form, button);
    			append_dev(div6, t6);
    			append_dev(div6, div5);
    			append_dev(body, t7);
    			append_dev(body, script0);
    			append_dev(body, t8);
    			append_dev(body, script1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[3]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[4]),
    					listen_dev(button, "click", prevent_default(/*login*/ ctx[2]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*email*/ 1 && input0.value !== /*email*/ ctx[0]) {
    				set_input_value(input0, /*email*/ ctx[0]);
    			}

    			if (dirty & /*password*/ 2 && input1.value !== /*password*/ ctx[1]) {
    				set_input_value(input1, /*password*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(body);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function parseJwt$2(token) {
    	if (token != '') {
    		var base64Url = token.split('.')[1];
    		var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    		var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    			return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    		}).join(''));

    		return JSON.parse(jsonPayload);
    	}
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let $tokenStore;
    	validate_store(store, 'tokenStore');
    	component_subscribe($$self, store, $$value => $$invalidate(5, $tokenStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Login', slots, []);
    	let email, password = '';
    	let targetURL = 'http://localhost:3000/credentials';
    	let user = [];

    	/**
     * To login into the web app using POST request,
     * if successfully it will redirect to either home or add-bicycle page
     * @returns {Promise<void>} token
     */
    	async function login() {
    		await fetch(targetURL, {
    			method: 'POST',
    			headers: { 'Content-type': 'application/json' },
    			body: JSON.stringify({ email, password })
    		}).then(async res => {
    			if (res.ok) {
    				set_store_value(store, $tokenStore = await res.json(), $tokenStore);
    				console.log('Login successfully');

    				if (parseJwt$2($tokenStore.token).role.includes('admin')) {
    					page.redirect('/admin-page');
    				} else {
    					page.redirect('/home');
    				}
    			} else {
    				throw new Error(await res.text()); // document.cookie='token='+$tokenStore.token;
    			}
    		}).catch(err => {
    			alert(err);
    		});
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<Login> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		email = this.value;
    		$$invalidate(0, email);
    	}

    	function input1_input_handler() {
    		password = this.value;
    		$$invalidate(1, password);
    	}

    	$$self.$capture_state = () => ({
    		tokenStore: store,
    		email,
    		password,
    		targetURL,
    		router: page,
    		user,
    		parseJwt: parseJwt$2,
    		login,
    		$tokenStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('email' in $$props) $$invalidate(0, email = $$props.email);
    		if ('password' in $$props) $$invalidate(1, password = $$props.password);
    		if ('targetURL' in $$props) targetURL = $$props.targetURL;
    		if ('user' in $$props) user = $$props.user;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [email, password, login, input0_input_handler, input1_input_handler];
    }

    class Login extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Login",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\routes\Register.svelte generated by Svelte v3.43.2 */

    const { Error: Error_1, console: console_1$2 } = globals;
    const file$5 = "src\\routes\\Register.svelte";

    function create_fragment$5(ctx) {
    	let body;
    	let div15;
    	let div14;
    	let div13;
    	let div12;
    	let div1;
    	let div0;
    	let t0;
    	let div11;
    	let div10;
    	let div2;
    	let h4;
    	let t2;
    	let form;
    	let div4;
    	let div3;
    	let input0;
    	let t3;
    	let div5;
    	let input1;
    	let t4;
    	let div8;
    	let div6;
    	let input2;
    	let t5;
    	let div7;
    	let input3;
    	let t6;
    	let button;
    	let t8;
    	let div9;
    	let a;
    	let t10;
    	let script0;
    	let script0_src_value;
    	let t11;
    	let script1;
    	let script1_src_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			body = element("body");
    			div15 = element("div");
    			div14 = element("div");
    			div13 = element("div");
    			div12 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div11 = element("div");
    			div10 = element("div");
    			div2 = element("div");
    			h4 = element("h4");
    			h4.textContent = "Create an Account!";
    			t2 = space();
    			form = element("form");
    			div4 = element("div");
    			div3 = element("div");
    			input0 = element("input");
    			t3 = space();
    			div5 = element("div");
    			input1 = element("input");
    			t4 = space();
    			div8 = element("div");
    			div6 = element("div");
    			input2 = element("input");
    			t5 = space();
    			div7 = element("div");
    			input3 = element("input");
    			t6 = space();
    			button = element("button");
    			button.textContent = "Register Account";
    			t8 = space();
    			div9 = element("div");
    			a = element("a");
    			a.textContent = "Already have an account? Login!";
    			t10 = space();
    			script0 = element("script");
    			t11 = space();
    			script1 = element("script");
    			attr_dev(div0, "class", "flex-grow-1 bg-register-image");
    			set_style(div0, "background", "url('images/register.jpg') center / cover no-repeat");
    			add_location(div0, file$5, 47, 20, 1567);
    			attr_dev(div1, "class", "col-lg-5 d-none d-lg-flex");
    			add_location(div1, file$5, 46, 16, 1450);
    			attr_dev(h4, "class", "text-dark mb-4");
    			add_location(h4, file$5, 52, 28, 1873);
    			attr_dev(div2, "class", "text-center");
    			add_location(div2, file$5, 51, 24, 1818);
    			attr_dev(input0, "class", "form-control form-control-user");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "id", "exampleFirstName");
    			attr_dev(input0, "placeholder", "Enter your name");
    			attr_dev(input0, "name", "name");
    			input0.required = true;
    			attr_dev(input0, "minlength", "3");
    			add_location(input0, file$5, 57, 36, 2154);
    			attr_dev(div3, "class", "col mb-3 mb-sm-0");
    			add_location(div3, file$5, 56, 32, 2086);
    			attr_dev(div4, "class", "row mb-3");
    			add_location(div4, file$5, 55, 28, 2030);
    			attr_dev(input1, "class", "form-control form-control-user");
    			attr_dev(input1, "type", "email");
    			attr_dev(input1, "id", "exampleInputEmail");
    			attr_dev(input1, "aria-describedby", "emailHelp");
    			attr_dev(input1, "placeholder", "Enter your Email Address");
    			attr_dev(input1, "name", "email");
    			input1.required = true;
    			attr_dev(input1, "inputmode", "email");
    			add_location(input1, file$5, 63, 32, 2563);
    			attr_dev(div5, "class", "mb-3");
    			add_location(div5, file$5, 62, 28, 2511);
    			attr_dev(input2, "class", "form-control form-control-user");
    			attr_dev(input2, "type", "password");
    			attr_dev(input2, "id", "examplePasswordInput");
    			attr_dev(input2, "placeholder", "Enter your Password");
    			attr_dev(input2, "name", "password");
    			input2.required = true;
    			add_location(input2, file$5, 70, 36, 3087);
    			attr_dev(div6, "class", "col-sm-6 mb-3 mb-sm-0");
    			add_location(div6, file$5, 69, 32, 3014);
    			attr_dev(input3, "class", "form-control form-control-user");
    			attr_dev(input3, "type", "password");
    			attr_dev(input3, "id", "exampleRepeatPasswordInput");
    			attr_dev(input3, "placeholder", "Repeat your Password");
    			attr_dev(input3, "name", "password_repeat");
    			input3.required = true;
    			add_location(input3, file$5, 76, 36, 3522);
    			attr_dev(div7, "class", "col-sm-6");
    			add_location(div7, file$5, 75, 32, 3462);
    			attr_dev(div8, "class", "row mb-3");
    			add_location(div8, file$5, 68, 28, 2958);
    			attr_dev(button, "class", "btn btn-primary d-block btn-user w-100");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$5, 81, 28, 3905);
    			attr_dev(form, "class", "user");
    			add_location(form, file$5, 54, 24, 1981);
    			attr_dev(a, "class", "small");
    			attr_dev(a, "href", "/login");
    			add_location(a, file$5, 85, 28, 4203);
    			attr_dev(div9, "class", "text-center");
    			set_style(div9, "margin-top", "5px");
    			add_location(div9, file$5, 84, 24, 4123);
    			attr_dev(div10, "class", "p-5");
    			add_location(div10, file$5, 50, 20, 1775);
    			attr_dev(div11, "class", "col-lg-7");
    			add_location(div11, file$5, 49, 16, 1731);
    			attr_dev(div12, "class", "row");
    			add_location(div12, file$5, 45, 12, 1415);
    			attr_dev(div13, "class", "card-body p-0");
    			add_location(div13, file$5, 44, 8, 1374);
    			attr_dev(div14, "class", "card shadow-lg o-hidden border-0 my-5");
    			add_location(div14, file$5, 43, 4, 1313);
    			attr_dev(div15, "class", "container");
    			add_location(div15, file$5, 42, 0, 1284);
    			script0.defer = true;
    			if (!src_url_equal(script0.src, script0_src_value = "https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js")) attr_dev(script0, "src", script0_src_value);
    			add_location(script0, file$5, 93, 0, 4411);
    			script1.defer = true;
    			if (!src_url_equal(script1.src, script1_src_value = "assets/js/script.min.js")) attr_dev(script1, "src", script1_src_value);
    			add_location(script1, file$5, 94, 0, 4519);
    			attr_dev(body, "class", "bg-gradient-primary register svelte-1q4wm1l");
    			add_location(body, file$5, 41, 0, 1239);
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, body, anchor);
    			append_dev(body, div15);
    			append_dev(div15, div14);
    			append_dev(div14, div13);
    			append_dev(div13, div12);
    			append_dev(div12, div1);
    			append_dev(div1, div0);
    			append_dev(div12, t0);
    			append_dev(div12, div11);
    			append_dev(div11, div10);
    			append_dev(div10, div2);
    			append_dev(div2, h4);
    			append_dev(div10, t2);
    			append_dev(div10, form);
    			append_dev(form, div4);
    			append_dev(div4, div3);
    			append_dev(div3, input0);
    			set_input_value(input0, /*name*/ ctx[0]);
    			append_dev(form, t3);
    			append_dev(form, div5);
    			append_dev(div5, input1);
    			set_input_value(input1, /*email*/ ctx[1]);
    			append_dev(form, t4);
    			append_dev(form, div8);
    			append_dev(div8, div6);
    			append_dev(div6, input2);
    			set_input_value(input2, /*password*/ ctx[2]);
    			append_dev(div8, t5);
    			append_dev(div8, div7);
    			append_dev(div7, input3);
    			set_input_value(input3, /*passwordRepeat*/ ctx[3]);
    			append_dev(form, t6);
    			append_dev(form, button);
    			append_dev(div10, t8);
    			append_dev(div10, div9);
    			append_dev(div9, a);
    			append_dev(body, t10);
    			append_dev(body, script0);
    			append_dev(body, t11);
    			append_dev(body, script1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[5]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[6]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[7]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[8]),
    					listen_dev(button, "click", prevent_default(/*register*/ ctx[4]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*name*/ 1 && input0.value !== /*name*/ ctx[0]) {
    				set_input_value(input0, /*name*/ ctx[0]);
    			}

    			if (dirty & /*email*/ 2 && input1.value !== /*email*/ ctx[1]) {
    				set_input_value(input1, /*email*/ ctx[1]);
    			}

    			if (dirty & /*password*/ 4 && input2.value !== /*password*/ ctx[2]) {
    				set_input_value(input2, /*password*/ ctx[2]);
    			}

    			if (dirty & /*passwordRepeat*/ 8 && input3.value !== /*passwordRepeat*/ ctx[3]) {
    				set_input_value(input3, /*passwordRepeat*/ ctx[3]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(body);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Register', slots, []);
    	let targetURL = 'http://localhost:3000/users';
    	let name, email, password, passwordRepeat = '';

    	async function register() {
    		if (password == passwordRepeat) {

    			const response = await fetch(targetURL, {
    				method: 'POST',
    				headers: { 'Content-type': 'application/json' },
    				body: JSON.stringify({ name, email, password })
    			}).then(async res => {
    				if (res.ok) {
    					console.log('Register successfully.');
    					page.redirect('/login');
    					return response.json();
    				} else {
    					throw new Error(await res.text());
    				}
    			}).catch(err => {
    				alert(err);
    			});
    		} else {
    			alert('The passwords you entered are not the same. Please check...');
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<Register> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		name = this.value;
    		$$invalidate(0, name);
    	}

    	function input1_input_handler() {
    		email = this.value;
    		$$invalidate(1, email);
    	}

    	function input2_input_handler() {
    		password = this.value;
    		$$invalidate(2, password);
    	}

    	function input3_input_handler() {
    		passwordRepeat = this.value;
    		$$invalidate(3, passwordRepeat);
    	}

    	$$self.$capture_state = () => ({
    		router: page,
    		targetURL,
    		name,
    		email,
    		password,
    		passwordRepeat,
    		register
    	});

    	$$self.$inject_state = $$props => {
    		if ('targetURL' in $$props) targetURL = $$props.targetURL;
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('email' in $$props) $$invalidate(1, email = $$props.email);
    		if ('password' in $$props) $$invalidate(2, password = $$props.password);
    		if ('passwordRepeat' in $$props) $$invalidate(3, passwordRepeat = $$props.passwordRepeat);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		name,
    		email,
    		password,
    		passwordRepeat,
    		register,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler
    	];
    }

    class Register extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Register",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    function paginate ({ items, pageSize, currentPage }) {
      return items
        .slice(
          (currentPage - 1) * pageSize,
          (currentPage - 1) * pageSize + pageSize
        )
    }

    const PREVIOUS_PAGE = 'PREVIOUS_PAGE';
    const NEXT_PAGE = 'NEXT_PAGE';
    const ELLIPSIS = 'ELLIPSIS';

    function generateNavigationOptions ({ totalItems, pageSize, currentPage, limit = null, showStepOptions = false })  {
      const totalPages = Math.ceil(totalItems / pageSize);
      const limitThreshold = getLimitThreshold({ limit });
      const limited = limit && totalPages > limitThreshold;
      let options = limited
        ? generateLimitedOptions({ totalPages, limit, currentPage })
        : generateUnlimitedOptions({ totalPages });
      return showStepOptions
        ? addStepOptions({ options, currentPage, totalPages })
        : options
    }

    function generateUnlimitedOptions ({ totalPages }) {
      return new Array(totalPages)
        .fill(null)
        .map((value, index) => ({
          type: 'number',
          value: index + 1
        }))
    }

    function generateLimitedOptions ({ totalPages, limit, currentPage }) {
      const boundarySize = limit * 2 + 2;
      const firstBoundary = 1 + boundarySize;
      const lastBoundary = totalPages - boundarySize;
      const totalShownPages = firstBoundary + 2;

      if (currentPage <= firstBoundary - limit) {
        return Array(totalShownPages)
          .fill(null)
          .map((value, index) => {
            if (index === totalShownPages - 1) {
              return {
                type: 'number',
                value: totalPages
              }
            } else if (index === totalShownPages - 2) {
              return {
                type: 'symbol',
                symbol: ELLIPSIS,
                value: firstBoundary + 1
              }
            }
            return {
              type: 'number',
              value: index + 1
            }
          })
      } else if (currentPage >= lastBoundary + limit) {
        return Array(totalShownPages)
          .fill(null)
          .map((value, index) => {
            if (index === 0) {
              return {
                type: 'number',
                value: 1
              }
            } else if (index === 1) {
              return {
                type: 'symbol',
                symbol: ELLIPSIS,
                value: lastBoundary - 1
              }
            }
            return {
              type: 'number',
              value: lastBoundary + index - 2
            }
          })
      } else if (currentPage >= (firstBoundary - limit) && currentPage <= (lastBoundary + limit)) {
        return Array(totalShownPages)
          .fill(null)
          .map((value, index) => {
            if (index === 0) {
              return {
                type: 'number',
                value: 1
              }
            } else if (index === 1) {
              return {
                type: 'symbol',
                symbol: ELLIPSIS,
                value: currentPage - limit + (index - 2)
              }
            } else if (index === totalShownPages - 1) {
              return {
                type: 'number',
                value: totalPages
              }
            } else if (index === totalShownPages - 2) {
              return {
                type: 'symbol',
                symbol: ELLIPSIS,
                value: currentPage + limit + 1
              }
            }
            return {
              type: 'number',
              value: currentPage - limit + (index - 2)
            }
          })
      }
    }

    function addStepOptions ({ options, currentPage, totalPages }) {
      return [
        {
          type: 'symbol',
          symbol: PREVIOUS_PAGE,
          value: currentPage <= 1 ? 1 : currentPage - 1
        },
        ...options,
        {
          type: 'symbol',
          symbol: NEXT_PAGE,
          value: currentPage >= totalPages ? totalPages : currentPage + 1
        }
      ]
    }

    function getLimitThreshold ({ limit }) {
      const maximumUnlimitedPages = 3; // This means we cannot limit 3 pages or less
      const numberOfBoundaryPages = 2; // The first and last pages are always shown
      return limit * 2 + maximumUnlimitedPages + numberOfBoundaryPages
    }

    /* node_modules\svelte-paginate\src\PaginationNav.svelte generated by Svelte v3.43.2 */
    const file$4 = "node_modules\\svelte-paginate\\src\\PaginationNav.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    const get_next_slot_changes = dirty => ({});
    const get_next_slot_context = ctx => ({});
    const get_prev_slot_changes = dirty => ({});
    const get_prev_slot_context = ctx => ({});
    const get_ellipsis_slot_changes = dirty => ({});
    const get_ellipsis_slot_context = ctx => ({});
    const get_number_slot_changes = dirty => ({ value: dirty & /*options*/ 4 });
    const get_number_slot_context = ctx => ({ value: /*option*/ ctx[12].value });

    // (68:72) 
    function create_if_block_3$2(ctx) {
    	let current;
    	const next_slot_template = /*#slots*/ ctx[9].next;
    	const next_slot = create_slot(next_slot_template, ctx, /*$$scope*/ ctx[8], get_next_slot_context);
    	const next_slot_or_fallback = next_slot || fallback_block_3(ctx);

    	const block = {
    		c: function create() {
    			if (next_slot_or_fallback) next_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (next_slot_or_fallback) {
    				next_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (next_slot) {
    				if (next_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						next_slot,
    						next_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(next_slot_template, /*$$scope*/ ctx[8], dirty, get_next_slot_changes),
    						get_next_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(next_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(next_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (next_slot_or_fallback) next_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(68:72) ",
    		ctx
    	});

    	return block;
    }

    // (56:76) 
    function create_if_block_2$2(ctx) {
    	let current;
    	const prev_slot_template = /*#slots*/ ctx[9].prev;
    	const prev_slot = create_slot(prev_slot_template, ctx, /*$$scope*/ ctx[8], get_prev_slot_context);
    	const prev_slot_or_fallback = prev_slot || fallback_block_2(ctx);

    	const block = {
    		c: function create() {
    			if (prev_slot_or_fallback) prev_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (prev_slot_or_fallback) {
    				prev_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (prev_slot) {
    				if (prev_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						prev_slot,
    						prev_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(prev_slot_template, /*$$scope*/ ctx[8], dirty, get_prev_slot_changes),
    						get_prev_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(prev_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(prev_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (prev_slot_or_fallback) prev_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(56:76) ",
    		ctx
    	});

    	return block;
    }

    // (52:71) 
    function create_if_block_1$2(ctx) {
    	let current;
    	const ellipsis_slot_template = /*#slots*/ ctx[9].ellipsis;
    	const ellipsis_slot = create_slot(ellipsis_slot_template, ctx, /*$$scope*/ ctx[8], get_ellipsis_slot_context);
    	const ellipsis_slot_or_fallback = ellipsis_slot || fallback_block_1(ctx);

    	const block = {
    		c: function create() {
    			if (ellipsis_slot_or_fallback) ellipsis_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (ellipsis_slot_or_fallback) {
    				ellipsis_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (ellipsis_slot) {
    				if (ellipsis_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						ellipsis_slot,
    						ellipsis_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(ellipsis_slot_template, /*$$scope*/ ctx[8], dirty, get_ellipsis_slot_changes),
    						get_ellipsis_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(ellipsis_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(ellipsis_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (ellipsis_slot_or_fallback) ellipsis_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(52:71) ",
    		ctx
    	});

    	return block;
    }

    // (48:6) {#if option.type === 'number'}
    function create_if_block$2(ctx) {
    	let current;
    	const number_slot_template = /*#slots*/ ctx[9].number;
    	const number_slot = create_slot(number_slot_template, ctx, /*$$scope*/ ctx[8], get_number_slot_context);
    	const number_slot_or_fallback = number_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			if (number_slot_or_fallback) number_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (number_slot_or_fallback) {
    				number_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (number_slot) {
    				if (number_slot.p && (!current || dirty & /*$$scope, options*/ 260)) {
    					update_slot_base(
    						number_slot,
    						number_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(number_slot_template, /*$$scope*/ ctx[8], dirty, get_number_slot_changes),
    						get_number_slot_context
    					);
    				}
    			} else {
    				if (number_slot_or_fallback && number_slot_or_fallback.p && (!current || dirty & /*options*/ 4)) {
    					number_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(number_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(number_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (number_slot_or_fallback) number_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(48:6) {#if option.type === 'number'}",
    		ctx
    	});

    	return block;
    }

    // (69:26)            
    function fallback_block_3(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", "#000000");
    			attr_dev(path, "d", "M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z");
    			add_location(path, file$4, 73, 12, 2306);
    			set_style(svg, "width", "24px");
    			set_style(svg, "height", "24px");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			add_location(svg, file$4, 69, 10, 2202);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_3.name,
    		type: "fallback",
    		source: "(69:26)            ",
    		ctx
    	});

    	return block;
    }

    // (57:26)            
    function fallback_block_2(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", "#000000");
    			attr_dev(path, "d", "M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z");
    			add_location(path, file$4, 61, 12, 1929);
    			set_style(svg, "width", "24px");
    			set_style(svg, "height", "24px");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			add_location(svg, file$4, 57, 10, 1825);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_2.name,
    		type: "fallback",
    		source: "(57:26)            ",
    		ctx
    	});

    	return block;
    }

    // (53:30)            
    function fallback_block_1(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "...";
    			add_location(span, file$4, 53, 10, 1678);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_1.name,
    		type: "fallback",
    		source: "(53:30)            ",
    		ctx
    	});

    	return block;
    }

    // (49:51)            
    function fallback_block(ctx) {
    	let span;
    	let t_value = /*option*/ ctx[12].value + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			add_location(span, file$4, 49, 10, 1521);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*options*/ 4 && t_value !== (t_value = /*option*/ ctx[12].value + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(49:51)            ",
    		ctx
    	});

    	return block;
    }

    // (34:2) {#each options as option}
    function create_each_block$2(ctx) {
    	let span;
    	let current_block_type_index;
    	let if_block;
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block$2, create_if_block_1$2, create_if_block_2$2, create_if_block_3$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*option*/ ctx[12].type === 'number') return 0;
    		if (/*option*/ ctx[12].type === 'symbol' && /*option*/ ctx[12].symbol === ELLIPSIS) return 1;
    		if (/*option*/ ctx[12].type === 'symbol' && /*option*/ ctx[12].symbol === PREVIOUS_PAGE) return 2;
    		if (/*option*/ ctx[12].type === 'symbol' && /*option*/ ctx[12].symbol === NEXT_PAGE) return 3;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	function click_handler() {
    		return /*click_handler*/ ctx[10](/*option*/ ctx[12]);
    	}

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (if_block) if_block.c();
    			t = space();
    			attr_dev(span, "class", "option");
    			toggle_class(span, "number", /*option*/ ctx[12].type === 'number');
    			toggle_class(span, "prev", /*option*/ ctx[12].type === 'symbol' && /*option*/ ctx[12].symbol === PREVIOUS_PAGE);
    			toggle_class(span, "next", /*option*/ ctx[12].type === 'symbol' && /*option*/ ctx[12].symbol === NEXT_PAGE);
    			toggle_class(span, "disabled", /*option*/ ctx[12].type === 'symbol' && /*option*/ ctx[12].symbol === NEXT_PAGE && /*currentPage*/ ctx[0] >= /*totalPages*/ ctx[1] || /*option*/ ctx[12].type === 'symbol' && /*option*/ ctx[12].symbol === PREVIOUS_PAGE && /*currentPage*/ ctx[0] <= 1);
    			toggle_class(span, "ellipsis", /*option*/ ctx[12].type === 'symbol' && /*option*/ ctx[12].symbol === ELLIPSIS);
    			toggle_class(span, "active", /*option*/ ctx[12].type === 'number' && /*option*/ ctx[12].value === /*currentPage*/ ctx[0]);
    			add_location(span, file$4, 34, 4, 751);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(span, null);
    			}

    			append_dev(span, t);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(span, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(span, t);
    				} else {
    					if_block = null;
    				}
    			}

    			if (dirty & /*options*/ 4) {
    				toggle_class(span, "number", /*option*/ ctx[12].type === 'number');
    			}

    			if (dirty & /*options, PREVIOUS_PAGE*/ 4) {
    				toggle_class(span, "prev", /*option*/ ctx[12].type === 'symbol' && /*option*/ ctx[12].symbol === PREVIOUS_PAGE);
    			}

    			if (dirty & /*options, NEXT_PAGE*/ 4) {
    				toggle_class(span, "next", /*option*/ ctx[12].type === 'symbol' && /*option*/ ctx[12].symbol === NEXT_PAGE);
    			}

    			if (dirty & /*options, NEXT_PAGE, currentPage, totalPages, PREVIOUS_PAGE*/ 7) {
    				toggle_class(span, "disabled", /*option*/ ctx[12].type === 'symbol' && /*option*/ ctx[12].symbol === NEXT_PAGE && /*currentPage*/ ctx[0] >= /*totalPages*/ ctx[1] || /*option*/ ctx[12].type === 'symbol' && /*option*/ ctx[12].symbol === PREVIOUS_PAGE && /*currentPage*/ ctx[0] <= 1);
    			}

    			if (dirty & /*options, ELLIPSIS*/ 4) {
    				toggle_class(span, "ellipsis", /*option*/ ctx[12].type === 'symbol' && /*option*/ ctx[12].symbol === ELLIPSIS);
    			}

    			if (dirty & /*options, currentPage*/ 5) {
    				toggle_class(span, "active", /*option*/ ctx[12].type === 'number' && /*option*/ ctx[12].value === /*currentPage*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(34:2) {#each options as option}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div;
    	let current;
    	let each_value = /*options*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "pagination-nav");
    			add_location(div, file$4, 32, 0, 690);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*options, PREVIOUS_PAGE, NEXT_PAGE, currentPage, totalPages, ELLIPSIS, handleOptionClick, $$scope*/ 271) {
    				each_value = /*options*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let options;
    	let totalPages;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PaginationNav', slots, ['number','ellipsis','prev','next']);
    	const dispatch = createEventDispatcher();
    	let { totalItems = 0 } = $$props;
    	let { pageSize = 1 } = $$props;
    	let { currentPage = 1 } = $$props;
    	let { limit = null } = $$props;
    	let { showStepOptions = false } = $$props;

    	function handleOptionClick(option) {
    		dispatch('setPage', { page: option.value });
    	}

    	const writable_props = ['totalItems', 'pageSize', 'currentPage', 'limit', 'showStepOptions'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PaginationNav> was created with unknown prop '${key}'`);
    	});

    	const click_handler = option => handleOptionClick(option);

    	$$self.$$set = $$props => {
    		if ('totalItems' in $$props) $$invalidate(4, totalItems = $$props.totalItems);
    		if ('pageSize' in $$props) $$invalidate(5, pageSize = $$props.pageSize);
    		if ('currentPage' in $$props) $$invalidate(0, currentPage = $$props.currentPage);
    		if ('limit' in $$props) $$invalidate(6, limit = $$props.limit);
    		if ('showStepOptions' in $$props) $$invalidate(7, showStepOptions = $$props.showStepOptions);
    		if ('$$scope' in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		generateNavigationOptions,
    		PREVIOUS_PAGE,
    		NEXT_PAGE,
    		ELLIPSIS,
    		dispatch,
    		totalItems,
    		pageSize,
    		currentPage,
    		limit,
    		showStepOptions,
    		handleOptionClick,
    		totalPages,
    		options
    	});

    	$$self.$inject_state = $$props => {
    		if ('totalItems' in $$props) $$invalidate(4, totalItems = $$props.totalItems);
    		if ('pageSize' in $$props) $$invalidate(5, pageSize = $$props.pageSize);
    		if ('currentPage' in $$props) $$invalidate(0, currentPage = $$props.currentPage);
    		if ('limit' in $$props) $$invalidate(6, limit = $$props.limit);
    		if ('showStepOptions' in $$props) $$invalidate(7, showStepOptions = $$props.showStepOptions);
    		if ('totalPages' in $$props) $$invalidate(1, totalPages = $$props.totalPages);
    		if ('options' in $$props) $$invalidate(2, options = $$props.options);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*totalItems, pageSize, currentPage, limit, showStepOptions*/ 241) {
    			$$invalidate(2, options = generateNavigationOptions({
    				totalItems,
    				pageSize,
    				currentPage,
    				limit,
    				showStepOptions
    			}));
    		}

    		if ($$self.$$.dirty & /*totalItems, pageSize*/ 48) {
    			$$invalidate(1, totalPages = Math.ceil(totalItems / pageSize));
    		}
    	};

    	return [
    		currentPage,
    		totalPages,
    		options,
    		handleOptionClick,
    		totalItems,
    		pageSize,
    		limit,
    		showStepOptions,
    		$$scope,
    		slots,
    		click_handler
    	];
    }

    class PaginationNav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			totalItems: 4,
    			pageSize: 5,
    			currentPage: 0,
    			limit: 6,
    			showStepOptions: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PaginationNav",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get totalItems() {
    		throw new Error("<PaginationNav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set totalItems(value) {
    		throw new Error("<PaginationNav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pageSize() {
    		throw new Error("<PaginationNav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pageSize(value) {
    		throw new Error("<PaginationNav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get currentPage() {
    		throw new Error("<PaginationNav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentPage(value) {
    		throw new Error("<PaginationNav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get limit() {
    		throw new Error("<PaginationNav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set limit(value) {
    		throw new Error("<PaginationNav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showStepOptions() {
    		throw new Error("<PaginationNav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showStepOptions(value) {
    		throw new Error("<PaginationNav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-paginate\src\LightPaginationNav.svelte generated by Svelte v3.43.2 */
    const file$3 = "node_modules\\svelte-paginate\\src\\LightPaginationNav.svelte";

    function create_fragment$3(ctx) {
    	let div;
    	let paginationnav;
    	let current;
    	const paginationnav_spread_levels = [/*$$props*/ ctx[0]];
    	let paginationnav_props = {};

    	for (let i = 0; i < paginationnav_spread_levels.length; i += 1) {
    		paginationnav_props = assign(paginationnav_props, paginationnav_spread_levels[i]);
    	}

    	paginationnav = new PaginationNav({
    			props: paginationnav_props,
    			$$inline: true
    		});

    	paginationnav.$on("setPage", /*setPage_handler*/ ctx[1]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(paginationnav.$$.fragment);
    			attr_dev(div, "class", "light-pagination-nav svelte-s5ru8s");
    			add_location(div, file$3, 4, 0, 73);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(paginationnav, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const paginationnav_changes = (dirty & /*$$props*/ 1)
    			? get_spread_update(paginationnav_spread_levels, [get_spread_object(/*$$props*/ ctx[0])])
    			: {};

    			paginationnav.$set(paginationnav_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationnav.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationnav.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(paginationnav);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LightPaginationNav', slots, []);

    	function setPage_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({ PaginationNav });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props, setPage_handler];
    }

    class LightPaginationNav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LightPaginationNav",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }

    /* src\routes\AdminPage.svelte generated by Svelte v3.43.2 */

    const { console: console_1$1 } = globals;
    const file$2 = "src\\routes\\AdminPage.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[28] = list[i];
    	return child_ctx;
    }

    // (333:16) {#if ($tokenStore.token != '')}
    function create_if_block_6$1(ctx) {
    	let show_if_1 = parseJwt$1(/*$tokenStore*/ ctx[10].token).role.includes('client');
    	let t;
    	let show_if = parseJwt$1(/*$tokenStore*/ ctx[10].token).role.includes('admin');
    	let if_block1_anchor;
    	let if_block0 = show_if_1 && create_if_block_8(ctx);
    	let if_block1 = show_if && create_if_block_7(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$tokenStore*/ 1024) show_if_1 = parseJwt$1(/*$tokenStore*/ ctx[10].token).role.includes('client');

    			if (show_if_1) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_8(ctx);
    					if_block0.c();
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty & /*$tokenStore*/ 1024) show_if = parseJwt$1(/*$tokenStore*/ ctx[10].token).role.includes('admin');

    			if (show_if) {
    				if (if_block1) ; else {
    					if_block1 = create_if_block_7(ctx);
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$1.name,
    		type: "if",
    		source: "(333:16) {#if ($tokenStore.token != '')}",
    		ctx
    	});

    	return block;
    }

    // (334:20) {#if (parseJwt($tokenStore.token).role.includes('client'))}
    function create_if_block_8(ctx) {
    	let li0;
    	let a0;
    	let i0;
    	let t0;
    	let span0;
    	let t2;
    	let li1;
    	let a1;
    	let i1;
    	let t3;
    	let span1;

    	const block = {
    		c: function create() {
    			li0 = element("li");
    			a0 = element("a");
    			i0 = element("i");
    			t0 = space();
    			span0 = element("span");
    			span0.textContent = "Auctions";
    			t2 = space();
    			li1 = element("li");
    			a1 = element("a");
    			i1 = element("i");
    			t3 = space();
    			span1 = element("span");
    			span1.textContent = "My bids";
    			attr_dev(i0, "class", "fas fa-tachometer-alt");
    			add_location(i0, file$2, 336, 32, 11237);
    			add_location(span0, file$2, 337, 32, 11308);
    			attr_dev(a0, "class", "nav-link");
    			attr_dev(a0, "href", "/home");
    			add_location(a0, file$2, 335, 28, 11170);
    			attr_dev(li0, "class", "nav-item");
    			add_location(li0, file$2, 334, 24, 11119);
    			attr_dev(i1, "class", "fa fa-money");
    			add_location(i1, file$2, 342, 32, 11541);
    			add_location(span1, file$2, 343, 32, 11602);
    			attr_dev(a1, "class", "nav-link");
    			attr_dev(a1, "href", "/my-bids");
    			add_location(a1, file$2, 341, 28, 11471);
    			attr_dev(li1, "class", "nav-item");
    			add_location(li1, file$2, 340, 24, 11420);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li0, anchor);
    			append_dev(li0, a0);
    			append_dev(a0, i0);
    			append_dev(a0, t0);
    			append_dev(a0, span0);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, li1, anchor);
    			append_dev(li1, a1);
    			append_dev(a1, i1);
    			append_dev(a1, t3);
    			append_dev(a1, span1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(li1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(334:20) {#if (parseJwt($tokenStore.token).role.includes('client'))}",
    		ctx
    	});

    	return block;
    }

    // (348:20) {#if (parseJwt($tokenStore.token).role.includes('admin'))}
    function create_if_block_7(ctx) {
    	let li0;
    	let a0;
    	let i0;
    	let t0;
    	let span0;
    	let t2;
    	let li1;
    	let a1;
    	let i1;
    	let t3;
    	let span1;

    	const block = {
    		c: function create() {
    			li0 = element("li");
    			a0 = element("a");
    			i0 = element("i");
    			t0 = space();
    			span0 = element("span");
    			span0.textContent = "All reservations";
    			t2 = space();
    			li1 = element("li");
    			a1 = element("a");
    			i1 = element("i");
    			t3 = space();
    			span1 = element("span");
    			span1.textContent = "All employees";
    			attr_dev(i0, "class", "fas fa-calendar-check");
    			add_location(i0, file$2, 350, 32, 11944);
    			add_location(span0, file$2, 351, 32, 12015);
    			attr_dev(a0, "class", "nav-link");
    			attr_dev(a0, "href", "/admin-page");
    			add_location(a0, file$2, 349, 28, 11871);
    			attr_dev(li0, "class", "nav-item");
    			add_location(li0, file$2, 348, 24, 11820);
    			attr_dev(i1, "class", "fas fa-id-card-alt");
    			add_location(i1, file$2, 356, 32, 12258);
    			add_location(span1, file$2, 358, 32, 12328);
    			attr_dev(a1, "class", "nav-link");
    			attr_dev(a1, "href", "/all-users");
    			add_location(a1, file$2, 355, 28, 12186);
    			attr_dev(li1, "class", "nav-item");
    			add_location(li1, file$2, 354, 24, 12135);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li0, anchor);
    			append_dev(li0, a0);
    			append_dev(a0, i0);
    			append_dev(a0, t0);
    			append_dev(a0, span0);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, li1, anchor);
    			append_dev(li1, a1);
    			append_dev(a1, i1);
    			append_dev(a1, t3);
    			append_dev(a1, span1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(li1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(348:20) {#if (parseJwt($tokenStore.token).role.includes('admin'))}",
    		ctx
    	});

    	return block;
    }

    // (386:32) {#if $tokenStore.token != ''}
    function create_if_block_5$1(ctx) {
    	let t_value = parseJwt$1(/*$tokenStore*/ ctx[10].token).email + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$tokenStore*/ 1024 && t_value !== (t_value = parseJwt$1(/*$tokenStore*/ ctx[10].token).email + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(386:32) {#if $tokenStore.token != ''}",
    		ctx
    	});

    	return block;
    }

    // (397:24) {#if $tokenStore.token != ''}
    function create_if_block_4$1(ctx) {
    	let t_value = parseJwt$1(/*$tokenStore*/ ctx[10].token).name + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$tokenStore*/ 1024 && t_value !== (t_value = parseJwt$1(/*$tokenStore*/ ctx[10].token).name + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(397:24) {#if $tokenStore.token != ''}",
    		ctx
    	});

    	return block;
    }

    // (454:32) {:else}
    function create_else_block_2(ctx) {
    	let if_block_anchor;

    	function select_block_type_2(ctx, dirty) {
    		if (/*items*/ ctx[0].length > 0) return create_if_block_3$1;
    		return create_else_block_3;
    	}

    	let current_block_type = select_block_type_2(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type !== (current_block_type = select_block_type_2(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: function intro(local) {
    			transition_in(if_block);
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(454:32) {:else}",
    		ctx
    	});

    	return block;
    }

    // (457:36) {:else }
    function create_else_block_3(ctx) {
    	let p;
    	let p_intro;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "No reservation to show!";
    			add_location(p, file$2, 457, 40, 17495);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		i: function intro(local) {
    			if (!p_intro) {
    				add_render_callback(() => {
    					p_intro = create_in_transition(p, fade, { delay: 600 });
    					p_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_3.name,
    		type: "else",
    		source: "(457:36) {:else }",
    		ctx
    	});

    	return block;
    }

    // (455:36) {#if items.length > 0}
    function create_if_block_3$1(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "class", "spinner-border mt-2");
    			attr_dev(span, "role", "status");
    			add_location(span, file$2, 455, 40, 17352);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(455:36) {#if items.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (428:40) {:else}
    function create_else_block_1$1(ctx) {
    	let td;
    	let t0_value = /*item*/ ctx[28].shiftDate + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			td = element("td");
    			t0 = text(t0_value);
    			t1 = text(" (in the past)");
    			set_style(td, "color", "red");
    			add_location(td, file$2, 428, 44, 15579);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, t0);
    			append_dev(td, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*paginatedItems*/ 512 && t0_value !== (t0_value = /*item*/ ctx[28].shiftDate + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(428:40) {:else}",
    		ctx
    	});

    	return block;
    }

    // (426:40) {#if item.shiftDate>today}
    function create_if_block_2$1(ctx) {
    	let td;
    	let t_value = /*item*/ ctx[28].shiftDate + "";
    	let t;

    	const block = {
    		c: function create() {
    			td = element("td");
    			t = text(t_value);
    			add_location(td, file$2, 426, 44, 15459);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*paginatedItems*/ 512 && t_value !== (t_value = /*item*/ ctx[28].shiftDate + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(426:40) {#if item.shiftDate>today}",
    		ctx
    	});

    	return block;
    }

    // (442:40) {:else}
    function create_else_block$1(ctx) {
    	let td0;
    	let button0;
    	let t1;
    	let td1;
    	let button1;

    	const block = {
    		c: function create() {
    			td0 = element("td");
    			button0 = element("button");
    			button0.textContent = "Delete";
    			t1 = space();
    			td1 = element("td");
    			button1 = element("button");
    			button1.textContent = "Modify";
    			attr_dev(button0, "class", "btn btn-danger disabled");
    			attr_dev(button0, "type", "button");
    			add_location(button0, file$2, 443, 48, 16617);
    			add_location(td0, file$2, 442, 44, 16563);
    			attr_dev(button1, "class", "btn btn-primary disabled");
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "data-bs-toggle", "collapse");
    			attr_dev(button1, "data-bs-target", "#form");
    			add_location(button1, file$2, 446, 48, 16838);
    			add_location(td1, file$2, 445, 44, 16784);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td0, anchor);
    			append_dev(td0, button0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, td1, anchor);
    			append_dev(td1, button1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(td1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(442:40) {:else}",
    		ctx
    	});

    	return block;
    }

    // (433:40) {#if item.shiftDate>today}
    function create_if_block_1$1(ctx) {
    	let td0;
    	let button0;
    	let t1;
    	let td1;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			td0 = element("td");
    			button0 = element("button");
    			button0.textContent = "Delete";
    			t1 = space();
    			td1 = element("td");
    			button1 = element("button");
    			button1.textContent = "Modify";
    			attr_dev(button0, "class", "btn btn-danger");
    			attr_dev(button0, "type", "button");
    			add_location(button0, file$2, 434, 48, 15926);
    			add_location(td0, file$2, 433, 44, 15872);
    			attr_dev(button1, "class", "btn btn-primary");
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "data-bs-toggle", "collapse");
    			attr_dev(button1, "data-bs-target", "#form");
    			add_location(button1, file$2, 437, 48, 16172);
    			add_location(td1, file$2, 436, 44, 16118);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td0, anchor);
    			append_dev(td0, button0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, td1, anchor);
    			append_dev(td1, button1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						button0,
    						"click",
    						function () {
    							if (is_function(/*deleteBooking*/ ctx[14](/*item*/ ctx[28]._id))) /*deleteBooking*/ ctx[14](/*item*/ ctx[28]._id).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button1,
    						"click",
    						function () {
    							if (is_function(/*getId*/ ctx[15](/*item*/ ctx[28]._id))) /*getId*/ ctx[15](/*item*/ ctx[28]._id).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(td1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(433:40) {#if item.shiftDate>today}",
    		ctx
    	});

    	return block;
    }

    // (422:32) {#each paginatedItems as item}
    function create_each_block$1(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*item*/ ctx[28].userEmail + "";
    	let t0;
    	let t1;
    	let t2;
    	let td1;
    	let t3_value = /*item*/ ctx[28].isMorningShift + "";
    	let t3;
    	let t4;
    	let t5;

    	function select_block_type(ctx, dirty) {
    		if (/*item*/ ctx[28].shiftDate > /*today*/ ctx[11]) return create_if_block_2$1;
    		return create_else_block_1$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);

    	function select_block_type_1(ctx, dirty) {
    		if (/*item*/ ctx[28].shiftDate > /*today*/ ctx[11]) return create_if_block_1$1;
    		return create_else_block$1;
    	}

    	let current_block_type_1 = select_block_type_1(ctx);
    	let if_block1 = current_block_type_1(ctx);

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			if_block0.c();
    			t2 = space();
    			td1 = element("td");
    			t3 = text(t3_value);
    			t4 = space();
    			if_block1.c();
    			t5 = space();
    			add_location(td0, file$2, 424, 40, 15320);
    			add_location(td1, file$2, 431, 40, 15728);
    			add_location(tr, file$2, 423, 36, 15273);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			if_block0.m(tr, null);
    			append_dev(tr, t2);
    			append_dev(tr, td1);
    			append_dev(td1, t3);
    			append_dev(tr, t4);
    			if_block1.m(tr, null);
    			append_dev(tr, t5);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*paginatedItems*/ 512 && t0_value !== (t0_value = /*item*/ ctx[28].userEmail + "")) set_data_dev(t0, t0_value);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(tr, t2);
    				}
    			}

    			if (dirty & /*paginatedItems*/ 512 && t3_value !== (t3_value = /*item*/ ctx[28].isMorningShift + "")) set_data_dev(t3, t3_value);

    			if (current_block_type_1 === (current_block_type_1 = select_block_type_1(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type_1(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(tr, t5);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			if_block0.d();
    			if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(422:32) {#each paginatedItems as item}",
    		ctx
    	});

    	return block;
    }

    // (490:16) {#if items.length > 0}
    function create_if_block$1(ctx) {
    	let lightpaginationnav;
    	let current;

    	lightpaginationnav = new LightPaginationNav({
    			props: {
    				totalItems: /*items*/ ctx[0].length,
    				pageSize: /*pageSize*/ ctx[12],
    				currentPage: /*currentPage*/ ctx[1],
    				limit: 1,
    				showStepOptions: true
    			},
    			$$inline: true
    		});

    	lightpaginationnav.$on("setPage", /*setPage_handler*/ ctx[20]);

    	const block = {
    		c: function create() {
    			create_component(lightpaginationnav.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(lightpaginationnav, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const lightpaginationnav_changes = {};
    			if (dirty & /*items*/ 1) lightpaginationnav_changes.totalItems = /*items*/ ctx[0].length;
    			if (dirty & /*currentPage*/ 2) lightpaginationnav_changes.currentPage = /*currentPage*/ ctx[1];
    			lightpaginationnav.$set(lightpaginationnav_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(lightpaginationnav.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(lightpaginationnav.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(lightpaginationnav, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(490:16) {#if items.length > 0}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let body;
    	let div17;
    	let nav0;
    	let div3;
    	let a0;
    	let div0;
    	let i0;
    	let t0;
    	let div1;
    	let span0;
    	let t1;
    	let br0;
    	let span1;
    	let t2;
    	let br1;
    	let t3;
    	let t4;
    	let ul0;
    	let t5;
    	let li0;
    	let a1;
    	let i1;
    	let t6;
    	let span2;
    	let t8;
    	let div2;
    	let button0;
    	let t9;
    	let div16;
    	let div13;
    	let nav1;
    	let div4;
    	let button1;
    	let i2;
    	let t10;
    	let ul1;
    	let li1;
    	let a2;
    	let t11;
    	let div12;
    	let div5;
    	let h30;
    	let t12;
    	let t13;
    	let h40;
    	let t15;
    	let div8;
    	let div7;
    	let div6;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t17;
    	let th1;
    	let t19;
    	let th2;
    	let t21;
    	let th3;
    	let t22;
    	let th4;
    	let t23;
    	let tbody;
    	let t24;
    	let div11;
    	let div10;
    	let form0;
    	let input0;
    	let t25;
    	let input1;
    	let t26;
    	let input2;
    	let t27;
    	let div9;
    	let button2;
    	let t29;
    	let button3;
    	let strong;
    	let t31;
    	let t32;
    	let footer;
    	let div15;
    	let div14;
    	let span3;
    	let t34;
    	let a3;
    	let i3;
    	let t35;
    	let div23;
    	let div22;
    	let div21;
    	let div18;
    	let h41;
    	let t37;
    	let button4;
    	let t38;
    	let div19;
    	let form1;
    	let h31;
    	let t39;
    	let t40;
    	let t41;
    	let h32;
    	let t42;
    	let t43;
    	let t44;
    	let h33;
    	let t45;
    	let t46;
    	let t47;
    	let div20;
    	let button5;
    	let t49;
    	let script0;
    	let script0_src_value;
    	let t50;
    	let script1;
    	let script1_src_value;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*$tokenStore*/ ctx[10].token != '' && create_if_block_6$1(ctx);
    	let if_block1 = /*$tokenStore*/ ctx[10].token != '' && create_if_block_5$1(ctx);
    	let if_block2 = /*$tokenStore*/ ctx[10].token != '' && create_if_block_4$1(ctx);
    	let each_value = /*paginatedItems*/ ctx[9];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	let each_1_else = null;

    	if (!each_value.length) {
    		each_1_else = create_else_block_2(ctx);
    	}

    	let if_block3 = /*items*/ ctx[0].length > 0 && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			body = element("body");
    			div17 = element("div");
    			nav0 = element("nav");
    			div3 = element("div");
    			a0 = element("a");
    			div0 = element("div");
    			i0 = element("i");
    			t0 = space();
    			div1 = element("div");
    			span0 = element("span");
    			t1 = text("Planion");
    			br0 = element("br");
    			span1 = element("span");
    			t2 = text("Start planning today!");
    			br1 = element("br");
    			t3 = text(" ");
    			t4 = space();
    			ul0 = element("ul");
    			if (if_block0) if_block0.c();
    			t5 = space();
    			li0 = element("li");
    			a1 = element("a");
    			i1 = element("i");
    			t6 = space();
    			span2 = element("span");
    			span2.textContent = "Log out";
    			t8 = space();
    			div2 = element("div");
    			button0 = element("button");
    			t9 = space();
    			div16 = element("div");
    			div13 = element("div");
    			nav1 = element("nav");
    			div4 = element("div");
    			button1 = element("button");
    			i2 = element("i");
    			t10 = space();
    			ul1 = element("ul");
    			li1 = element("li");
    			a2 = element("a");
    			if (if_block1) if_block1.c();
    			t11 = space();
    			div12 = element("div");
    			div5 = element("div");
    			h30 = element("h3");
    			t12 = text("Welcome\r\n                        ");
    			if (if_block2) if_block2.c();
    			t13 = space();
    			h40 = element("h4");
    			h40.textContent = "Here you can\r\n                        add, remove or modify reservations";
    			t15 = space();
    			div8 = element("div");
    			div7 = element("div");
    			div6 = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "employee email";
    			t17 = space();
    			th1 = element("th");
    			th1.textContent = "shift date";
    			t19 = space();
    			th2 = element("th");
    			th2.textContent = "morning shift";
    			t21 = space();
    			th3 = element("th");
    			t22 = space();
    			th4 = element("th");
    			t23 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			if (each_1_else) {
    				each_1_else.c();
    			}

    			t24 = space();
    			div11 = element("div");
    			div10 = element("div");
    			form0 = element("form");
    			input0 = element("input");
    			t25 = space();
    			input1 = element("input");
    			t26 = text("\r\n\r\n                                Is morning shift:\r\n                                ");
    			input2 = element("input");
    			t27 = space();
    			div9 = element("div");
    			button2 = element("button");
    			button2.textContent = "Submit";
    			t29 = space();
    			button3 = element("button");
    			strong = element("strong");
    			strong.textContent = "Close";
    			t31 = space();
    			if (if_block3) if_block3.c();
    			t32 = space();
    			footer = element("footer");
    			div15 = element("div");
    			div14 = element("div");
    			span3 = element("span");
    			span3.textContent = "Copyright © Planion 2021";
    			t34 = space();
    			a3 = element("a");
    			i3 = element("i");
    			t35 = space();
    			div23 = element("div");
    			div22 = element("div");
    			div21 = element("div");
    			div18 = element("div");
    			h41 = element("h4");
    			h41.textContent = "Your info";
    			t37 = space();
    			button4 = element("button");
    			t38 = space();
    			div19 = element("div");
    			form1 = element("form");
    			h31 = element("h3");
    			t39 = text("Name: ");
    			t40 = text(/*myName*/ ctx[7]);
    			t41 = space();
    			h32 = element("h3");
    			t42 = text("Department: ");
    			t43 = text(/*myDepartment*/ ctx[8]);
    			t44 = space();
    			h33 = element("h3");
    			t45 = text("Email: ");
    			t46 = text(/*myEmail*/ ctx[6]);
    			t47 = space();
    			div20 = element("div");
    			button5 = element("button");
    			button5.textContent = "Close";
    			t49 = space();
    			script0 = element("script");
    			t50 = space();
    			script1 = element("script");
    			attr_dev(i0, "class", "far fa-calendar-alt");
    			add_location(i0, file$2, 326, 56, 10545);
    			attr_dev(div0, "class", "sidebar-brand-icon rotate-n-15");
    			add_location(div0, file$2, 326, 12, 10501);
    			add_location(br0, file$2, 327, 87, 10675);
    			set_style(span0, "font-size", "25px");
    			add_location(span0, file$2, 327, 49, 10637);
    			add_location(br1, file$2, 328, 123, 10816);
    			attr_dev(span1, "class", "text-capitalize");
    			set_style(span1, "font-size", "12px");
    			set_style(span1, "font-family", "'Bad Script', serif");
    			add_location(span1, file$2, 327, 98, 10686);
    			attr_dev(div1, "class", "sidebar-brand-text mx-3");
    			add_location(div1, file$2, 327, 12, 10600);
    			attr_dev(a0, "class", "navbar-brand d-flex justify-content-center align-items-center sidebar-brand m-0");
    			attr_dev(a0, "href", "");
    			set_style(a0, "padding-top", "36px");
    			add_location(a0, file$2, 323, 60, 10327);
    			attr_dev(i1, "class", "far fa-user-circle");
    			add_location(i1, file$2, 365, 24, 12624);
    			add_location(span2, file$2, 366, 24, 12684);
    			attr_dev(a1, "class", "nav-link");
    			attr_dev(a1, "href", "/login");
    			add_location(a1, file$2, 364, 20, 12530);
    			attr_dev(li0, "class", "nav-item");
    			add_location(li0, file$2, 363, 16, 12487);
    			attr_dev(ul0, "class", "navbar-nav text-light");
    			attr_dev(ul0, "id", "accordionSidebar");
    			set_style(ul0, "margin-top", "16px");
    			add_location(ul0, file$2, 331, 12, 10881);
    			attr_dev(button0, "class", "btn rounded-circle border-0");
    			attr_dev(button0, "id", "sidebarToggle");
    			attr_dev(button0, "type", "button");
    			add_location(button0, file$2, 371, 16, 12848);
    			attr_dev(div2, "class", "text-center d-none d-md-inline");
    			add_location(div2, file$2, 370, 12, 12786);
    			attr_dev(div3, "class", "container-fluid d-flex flex-column p-0");
    			add_location(div3, file$2, 323, 8, 10275);
    			attr_dev(nav0, "class", "navbar navbar-dark align-items-start sidebar sidebar-dark accordion bg-gradient-primary p-0");
    			add_location(nav0, file$2, 322, 4, 10160);
    			attr_dev(i2, "class", "fas fa-bars");
    			add_location(i2, file$2, 379, 115, 13333);
    			attr_dev(button1, "class", "btn btn-link d-md-none rounded-circle me-3");
    			attr_dev(button1, "id", "sidebarToggleTop");
    			attr_dev(button1, "type", "button");
    			add_location(button1, file$2, 379, 20, 13238);
    			attr_dev(a2, "class", "nav-link oneLine");
    			attr_dev(a2, "data-bs-target", "#modal-4");
    			attr_dev(a2, "data-bs-toggle", "modal");
    			add_location(a2, file$2, 384, 28, 13542);
    			attr_dev(li1, "class", "nav-item");
    			add_location(li1, file$2, 383, 24, 13491);
    			attr_dev(ul1, "class", "navbar-nav flex-nowrap ms-auto");
    			add_location(ul1, file$2, 382, 20, 13422);
    			attr_dev(div4, "class", "container-fluid");
    			add_location(div4, file$2, 378, 16, 13187);
    			attr_dev(nav1, "class", "navbar navbar-light navbar-expand bg-white shadow mb-4 topbar static-top");
    			add_location(nav1, file$2, 377, 12, 13083);
    			attr_dev(h30, "class", "text-dark");
    			add_location(h30, file$2, 395, 20, 14041);
    			attr_dev(h40, "class", "text-dark");
    			set_style(h40, "margin", "-1px -1px 5px");
    			add_location(h40, file$2, 400, 20, 14269);
    			add_location(div5, file$2, 394, 16, 14014);
    			add_location(th0, file$2, 412, 36, 14791);
    			add_location(th1, file$2, 413, 36, 14852);
    			add_location(th2, file$2, 414, 36, 14909);
    			add_location(th3, file$2, 416, 36, 14971);
    			add_location(th4, file$2, 417, 36, 15018);
    			attr_dev(tr, "class", "text-center");
    			add_location(tr, file$2, 411, 32, 14729);
    			add_location(thead, file$2, 410, 32, 14688);
    			attr_dev(tbody, "class", "text-center");
    			add_location(tbody, file$2, 420, 32, 15142);
    			attr_dev(table, "class", "table");
    			add_location(table, file$2, 409, 28, 14633);
    			attr_dev(div6, "class", "table-responsive");
    			add_location(div6, file$2, 408, 24, 14573);
    			attr_dev(div7, "class", "col");
    			add_location(div7, file$2, 407, 20, 14530);
    			attr_dev(div8, "class", "row");
    			add_location(div8, file$2, 406, 16, 14491);
    			attr_dev(input0, "class", "form-control oneLine disabled");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "name", "brand");
    			set_style(input0, "width", "60%");
    			set_style(input0, "margin-bottom", "10px");
    			input0.required = true;
    			add_location(input0, file$2, 469, 28, 17953);
    			attr_dev(input1, "min", /*today*/ ctx[11]);
    			attr_dev(input1, "class", "form-control oneLine");
    			attr_dev(input1, "type", "date");
    			attr_dev(input1, "name", "date");
    			input1.required = true;
    			add_location(input1, file$2, 474, 28, 18206);
    			attr_dev(input2, "type", "checkbox");
    			attr_dev(input2, "name", "scales");
    			add_location(input2, file$2, 477, 32, 18397);
    			attr_dev(button2, "class", "btn btn-primary");
    			attr_dev(button2, "type", "button");
    			add_location(button2, file$2, 482, 32, 18597);
    			add_location(strong, file$2, 483, 114, 18818);
    			attr_dev(button3, "class", "btn btn-warning text-light");
    			attr_dev(button3, "type", "button");
    			add_location(button3, file$2, 483, 32, 18736);
    			attr_dev(div9, "class", "mb-4");
    			add_location(div9, file$2, 481, 28, 18545);
    			add_location(form0, file$2, 468, 24, 17917);
    			attr_dev(div10, "class", "col");
    			add_location(div10, file$2, 467, 20, 17874);
    			attr_dev(div11, "class", "row collapse");
    			attr_dev(div11, "id", "form");
    			add_location(div11, file$2, 466, 16, 17815);
    			attr_dev(div12, "class", "container-fluid");
    			add_location(div12, file$2, 393, 12, 13967);
    			attr_dev(div13, "id", "content");
    			add_location(div13, file$2, 376, 8, 13051);
    			add_location(span3, file$2, 505, 59, 19694);
    			attr_dev(div14, "class", "text-center my-auto copyright");
    			add_location(div14, file$2, 505, 16, 19651);
    			attr_dev(div15, "class", "container my-auto");
    			add_location(div15, file$2, 504, 12, 19602);
    			attr_dev(footer, "class", "bg-white d-xl-flex justify-content-xl-center align-items-xl-end sticky-footer mt-3");
    			add_location(footer, file$2, 503, 8, 19489);
    			attr_dev(div16, "class", "d-flex flex-column");
    			attr_dev(div16, "id", "content-wrapper");
    			add_location(div16, file$2, 375, 4, 12988);
    			attr_dev(i3, "class", "fas fa-angle-up");
    			add_location(i3, file$2, 510, 70, 19862);
    			attr_dev(a3, "class", "border rounded d-inline scroll-to-top");
    			attr_dev(a3, "href", "#page-top");
    			add_location(a3, file$2, 510, 4, 19796);
    			attr_dev(div17, "id", "wrapper");
    			add_location(div17, file$2, 321, 0, 10136);
    			attr_dev(h41, "class", "modal-title");
    			add_location(h41, file$2, 516, 38, 20195);
    			attr_dev(button4, "type", "button");
    			attr_dev(button4, "class", "btn-close");
    			attr_dev(button4, "data-bs-dismiss", "modal");
    			attr_dev(button4, "aria-label", "Close");
    			add_location(button4, file$2, 517, 16, 20251);
    			attr_dev(div18, "class", "modal-header");
    			add_location(div18, file$2, 516, 12, 20169);
    			add_location(h31, file$2, 522, 20, 20449);
    			add_location(h32, file$2, 523, 20, 20494);
    			add_location(h33, file$2, 524, 20, 20551);
    			add_location(form1, file$2, 520, 16, 20419);
    			attr_dev(div19, "class", "modal-body");
    			add_location(div19, file$2, 519, 12, 20377);
    			attr_dev(button5, "class", "btn btn-danger");
    			attr_dev(button5, "type", "button");
    			attr_dev(button5, "data-bs-dismiss", "modal");
    			add_location(button5, file$2, 529, 16, 20681);
    			attr_dev(div20, "class", "modal-footer");
    			add_location(div20, file$2, 528, 12, 20637);
    			attr_dev(div21, "class", "modal-content");
    			add_location(div21, file$2, 515, 8, 20128);
    			attr_dev(div22, "class", "modal-dialog modal-dialog-centered modal-dialog-scrollable");
    			attr_dev(div22, "role", "document");
    			add_location(div22, file$2, 514, 4, 20030);
    			attr_dev(div23, "class", "modal fade");
    			attr_dev(div23, "role", "dialog");
    			attr_dev(div23, "tabindex", "-1");
    			attr_dev(div23, "id", "modal-4");
    			attr_dev(div23, "aria-hidden", "true");
    			attr_dev(div23, "aria-labelledby", "modal-4label");
    			add_location(div23, file$2, 513, 0, 19909);
    			script0.defer = true;
    			if (!src_url_equal(script0.src, script0_src_value = "https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js")) attr_dev(script0, "src", script0_src_value);
    			add_location(script0, file$2, 536, 0, 20826);
    			script1.defer = true;
    			if (!src_url_equal(script1.src, script1_src_value = "assets/js/script.min.js")) attr_dev(script1, "src", script1_src_value);
    			add_location(script1, file$2, 537, 0, 20934);
    			attr_dev(body, "id", "page-top");
    			add_location(body, file$2, 320, 0, 10114);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, body, anchor);
    			append_dev(body, div17);
    			append_dev(div17, nav0);
    			append_dev(nav0, div3);
    			append_dev(div3, a0);
    			append_dev(a0, div0);
    			append_dev(div0, i0);
    			append_dev(a0, t0);
    			append_dev(a0, div1);
    			append_dev(div1, span0);
    			append_dev(span0, t1);
    			append_dev(span0, br0);
    			append_dev(div1, span1);
    			append_dev(span1, t2);
    			append_dev(span1, br1);
    			append_dev(span1, t3);
    			append_dev(div3, t4);
    			append_dev(div3, ul0);
    			if (if_block0) if_block0.m(ul0, null);
    			append_dev(ul0, t5);
    			append_dev(ul0, li0);
    			append_dev(li0, a1);
    			append_dev(a1, i1);
    			append_dev(a1, t6);
    			append_dev(a1, span2);
    			append_dev(div3, t8);
    			append_dev(div3, div2);
    			append_dev(div2, button0);
    			append_dev(div17, t9);
    			append_dev(div17, div16);
    			append_dev(div16, div13);
    			append_dev(div13, nav1);
    			append_dev(nav1, div4);
    			append_dev(div4, button1);
    			append_dev(button1, i2);
    			append_dev(div4, t10);
    			append_dev(div4, ul1);
    			append_dev(ul1, li1);
    			append_dev(li1, a2);
    			if (if_block1) if_block1.m(a2, null);
    			append_dev(div13, t11);
    			append_dev(div13, div12);
    			append_dev(div12, div5);
    			append_dev(div5, h30);
    			append_dev(h30, t12);
    			if (if_block2) if_block2.m(h30, null);
    			append_dev(div5, t13);
    			append_dev(div5, h40);
    			append_dev(div12, t15);
    			append_dev(div12, div8);
    			append_dev(div8, div7);
    			append_dev(div7, div6);
    			append_dev(div6, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t17);
    			append_dev(tr, th1);
    			append_dev(tr, t19);
    			append_dev(tr, th2);
    			append_dev(tr, t21);
    			append_dev(tr, th3);
    			append_dev(tr, t22);
    			append_dev(tr, th4);
    			append_dev(table, t23);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			if (each_1_else) {
    				each_1_else.m(tbody, null);
    			}

    			append_dev(div12, t24);
    			append_dev(div12, div11);
    			append_dev(div11, div10);
    			append_dev(div10, form0);
    			append_dev(form0, input0);
    			set_input_value(input0, /*editEmail*/ ctx[2]);
    			append_dev(form0, t25);
    			append_dev(form0, input1);
    			set_input_value(input1, /*editDate*/ ctx[3]);
    			append_dev(form0, t26);
    			append_dev(form0, input2);
    			input2.checked = /*editIsMorningShift*/ ctx[4];
    			append_dev(form0, t27);
    			append_dev(form0, div9);
    			append_dev(div9, button2);
    			append_dev(div9, t29);
    			append_dev(div9, button3);
    			append_dev(button3, strong);
    			append_dev(div12, t31);
    			if (if_block3) if_block3.m(div12, null);
    			append_dev(div16, t32);
    			append_dev(div16, footer);
    			append_dev(footer, div15);
    			append_dev(div15, div14);
    			append_dev(div14, span3);
    			append_dev(div17, t34);
    			append_dev(div17, a3);
    			append_dev(a3, i3);
    			append_dev(body, t35);
    			append_dev(body, div23);
    			append_dev(div23, div22);
    			append_dev(div22, div21);
    			append_dev(div21, div18);
    			append_dev(div18, h41);
    			append_dev(div18, t37);
    			append_dev(div18, button4);
    			append_dev(div21, t38);
    			append_dev(div21, div19);
    			append_dev(div19, form1);
    			append_dev(form1, h31);
    			append_dev(h31, t39);
    			append_dev(h31, t40);
    			append_dev(form1, t41);
    			append_dev(form1, h32);
    			append_dev(h32, t42);
    			append_dev(h32, t43);
    			append_dev(form1, t44);
    			append_dev(form1, h33);
    			append_dev(h33, t45);
    			append_dev(h33, t46);
    			append_dev(div21, t47);
    			append_dev(div21, div20);
    			append_dev(div20, button5);
    			append_dev(body, t49);
    			append_dev(body, script0);
    			append_dev(body, t50);
    			append_dev(body, script1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						a1,
    						"click",
    						function () {
    							if (is_function(/*$tokenStore*/ ctx[10].token = '')) (/*$tokenStore*/ ctx[10].token = '').apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(a2, "click", /*getMyInfo*/ ctx[16], false, false, false),
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[17]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[18]),
    					listen_dev(input2, "change", /*input2_change_handler*/ ctx[19]),
    					listen_dev(
    						button2,
    						"click",
    						function () {
    							if (is_function(/*editBooking*/ ctx[13](/*bookingIdForEditing*/ ctx[5]))) /*editBooking*/ ctx[13](/*bookingIdForEditing*/ ctx[5]).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(button3, "click", closeCollapse, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (/*$tokenStore*/ ctx[10].token != '') {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_6$1(ctx);
    					if_block0.c();
    					if_block0.m(ul0, t5);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*$tokenStore*/ ctx[10].token != '') {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_5$1(ctx);
    					if_block1.c();
    					if_block1.m(a2, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*$tokenStore*/ ctx[10].token != '') {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_4$1(ctx);
    					if_block2.c();
    					if_block2.m(h30, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (dirty & /*getId, paginatedItems, deleteBooking, today, items*/ 51713) {
    				each_value = /*paginatedItems*/ ctx[9];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;

    				if (!each_value.length && each_1_else) {
    					each_1_else.p(ctx, dirty);
    				} else if (!each_value.length) {
    					each_1_else = create_else_block_2(ctx);
    					each_1_else.c();
    					transition_in(each_1_else, 1);
    					each_1_else.m(tbody, null);
    				} else if (each_1_else) {
    					each_1_else.d(1);
    					each_1_else = null;
    				}
    			}

    			if (dirty & /*editEmail*/ 4 && input0.value !== /*editEmail*/ ctx[2]) {
    				set_input_value(input0, /*editEmail*/ ctx[2]);
    			}

    			if (dirty & /*editDate*/ 8) {
    				set_input_value(input1, /*editDate*/ ctx[3]);
    			}

    			if (dirty & /*editIsMorningShift*/ 16) {
    				input2.checked = /*editIsMorningShift*/ ctx[4];
    			}

    			if (/*items*/ ctx[0].length > 0) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);

    					if (dirty & /*items*/ 1) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block$1(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(div12, null);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*myName*/ 128) set_data_dev(t40, /*myName*/ ctx[7]);
    			if (!current || dirty & /*myDepartment*/ 256) set_data_dev(t43, /*myDepartment*/ ctx[8]);
    			if (!current || dirty & /*myEmail*/ 64) set_data_dev(t46, /*myEmail*/ ctx[6]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block3);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block3);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(body);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			destroy_each(each_blocks, detaching);
    			if (each_1_else) each_1_else.d();
    			if (if_block3) if_block3.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function parseJwt$1(token) {
    	if (token != '') {
    		var base64Url = token.split('.')[1];
    		var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    		var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    			return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    		}).join(''));

    		return JSON.parse(jsonPayload);
    	}
    }

    /* //check if the user is admin
     function checkUser() {
         if ($tokenStore.token != ''){
             if (!(parseJwt($tokenStore.token).role.includes('admin'))){
                 alert(`${parseJwt($tokenStore.token).name} is not an admin!`);
                 router.redirect('/home');
             }
         }
     }
     checkUser();*/
    /**
     * This will collapse the from
     */
    function closeCollapse() {
    	this.parentElement.parentElement.parentElement.parentElement.classList.remove('show');
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let paginatedItems;
    	let $tokenStore;
    	validate_store(store, 'tokenStore');
    	component_subscribe($$self, store, $$value => $$invalidate(10, $tokenStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AdminPage', slots, []);
    	let targetURL = 'http://localhost:3000/bookings';
    	let items = [];
    	let postNewEmail, postNewDate = '', postNewIsMorningShift = false;
    	let editEmail, editDate = '', editIsMorningShift = false;

    	//To convert the date to dd-mm-yyyy form
    	let today = new Date().toISOString().split("T")[0];

    	//For pagination
    	let currentPage = 1;

    	let pageSize = 7;

    	async function getBookings() {
    		try {
    			const resp = await fetch(targetURL, {
    				method: 'GET',
    				headers: {
    					'Content-type': 'application/json',
    					'authorization': 'Bearer ' + $tokenStore.token
    				}
    			});

    			$$invalidate(0, items = await resp.json());
    			console.log("items:");
    			console.log(items);
    		} catch(e) {
    			alert(e);
    		}
    	}

    	/*    function getDistinctForDropDownItems(){
            for (let item of items) {
                if(!distinctBrands.includes(item.brand)){
                    distinctBrands.push(item.brand);
                    distinctBrands=distinctBrands;
                }
            }
            for (let item of items) {
                if(!distinctFrameTypes.includes(item.frameType)){
                    distinctFrameTypes.push(item.frameType);
                    distinctFrameTypes=distinctFrameTypes;
                }
            }
            for (let item of items) {
                if(!distinctFrameHeights.includes(item.frameHeightInCm)){
                    distinctFrameHeights.push(item.frameHeightInCm);
                    distinctFrameHeights=distinctFrameHeights;
                }
            }
        }*/
    	/* //now each item in the items has 6 keys. the one extra key is highestBid
     async function getBikes (brand,frameType,frameHeightInCm) {
         items=[];
         let targetURLBikesUseQuery=targetURLBikes;
         if(brand!=''){
             targetURLBikesUseQuery+=('?brand='+brand);
         }
         if(frameType!=''){
             if(brand!=''){
                 targetURLBikesUseQuery+=('&frameType='+frameType);
             }else{
                 targetURLBikesUseQuery+=('?frameType='+frameType);
             }

         }
         if(frameHeightInCm!=''){
             if((brand!='')||(frameType!='')){
                 targetURLBikesUseQuery+=('&frameHeightInCm='+frameHeightInCm);
             }else{
                 targetURLBikesUseQuery+=('?frameHeightInCm='+frameHeightInCm);
             }

         }
         try {
             const resp = await fetch(targetURLBikesUseQuery, {
                 method: 'GET',
                 headers: {
                     'Content-type': 'application/json',
                     'authorization': 'Bearer '+$tokenStore.token
                 }
             });
             let tempItems = await resp.json();

             //here find out the highest bid of a bike and add the key value pair to the object.
             //then push this object into array items
             for (let tempItem of tempItems) {
                 let highestBid=0;
                 highestBid=await getHighestBid(tempItem.id);
                 tempItem.highestBid=highestBid;
                 items.push(tempItem);
                 items=items;
                 itemsToDisplay.push(tempItem);
                 itemsToDisplay=itemsToDisplay;
             }
         }catch (e){
             console.error(e.message);
         }
         getDistinctForDropDownItems();
     }
    */
    	/**
     * POST request
     * @returns {Promise<void>} that add a new bicycle to the back-end
     */
    	/*async function addBike() {
        await fetch(targetURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'authorization': 'Bearer '+$tokenStore.token
            },
            body: JSON.stringify({
                brand:postNewBrand,
                frameType:postNewFrameType,
                frameHeightInCm:postNewFrameHeight,
                endingDate:postNewDate
            }),
        })
            .then(async (res) => {
                if (res.ok) {
                    //location.reload();
                    router.redirect('/home');
                    router.redirect('/add-bicycle');
                    console.log("Success!");
                } else {
                    res.json().then((body) => {
                        alert(body.message || "Internal error");
                    });
                }
            })
            .catch(async (err) => {
                alert(err)
            });
    }
    */
    	async function editBooking(id) {
    		console.log('edit booking, date:', editDate);

    		await fetch(targetURL + '/' + id, {
    			method: 'PATCH',
    			headers: {
    				'Content-type': 'application/json',
    				'authorization': 'Bearer ' + $tokenStore.token
    			},
    			body: JSON.stringify({
    				userEmail: editEmail,
    				shiftDate: editDate,
    				isMorningShift: editIsMorningShift
    			})
    		}).then(async res => {
    			if (res.ok) {
    				// location.reload();
    				page.redirect('/home');

    				page.redirect('/admin-page');
    				console.log("Success!");
    			} else {
    				res.json().then(body => {
    					alert(body.message || "Internal error");
    				});
    			}
    		}).catch(async err => {
    			alert(err);
    		});
    	}

    	/**
     * DELETE request
     * @param bikeId to be deleted
     * @returns {Promise<void>} that deletes the bike from the back-end with a given id
     */
    	async function deleteBooking(id) {
    		await fetch(targetURL + '/' + id, {
    			method: 'DELETE',
    			headers: {
    				'Content-type': 'application/json',
    				'authorization': 'Bearer ' + $tokenStore.token
    			}
    		}).then(async res => {
    			if (res.ok) {
    				page.redirect('/home');
    				page.redirect('/admin-page');
    				console.log("Success!");
    			} else {
    				res.json().then(body => {
    					alert(body.message || "Internal error");
    				});
    			}
    		}).catch(async err => {
    			alert(err);
    		});
    	}

    	/**
     * @param id of the bike
     * @returns {id}
     */
    	let bookingIdForEditing;

    	async function getId(id) {
    		$$invalidate(5, bookingIdForEditing = id);
    		console.log('booking id for editing' + bookingIdForEditing);
    		await fillBookingInfoIntoForm();
    	} //return id;

    	/**
     * This will fill the from in the front-end to easily modify the bike
     */
    	async function fillBookingInfoIntoForm() {
    		//first get bikeinfo to place in the form
    		const Resp = await fetch(targetURL + '/' + bookingIdForEditing, {
    			headers: {
    				'Content-type': 'application/json',
    				'authorization': 'Bearer ' + $tokenStore.token
    			}
    		});

    		let resJson = await Resp.json();
    		console.log(resJson);
    		$$invalidate(2, editEmail = resJson[0].userEmail);
    		console.log("editEmail: " + editEmail);
    		$$invalidate(3, editDate = resJson[0].shiftDate);
    		console.log("edit date" + editDate);
    		$$invalidate(4, editIsMorningShift = resJson[0].isMorningShift);
    	} //editDate = resJson.date;
    	// editIsMorningShift = resJson.isMorningShift;

    	getBookings();
    	let myEmail = '';
    	let myName = '';
    	let myDepartment = '';
    	let targetURLGetMyself = 'http://localhost:3000/users/' + parseJwt$1($tokenStore.token).email;

    	async function getMyInfo() {
    		console.log("getMyInfo called");

    		try {
    			const resp = await fetch(targetURLGetMyself, {
    				method: 'GET',
    				headers: {
    					'Content-type': 'application/json',
    					'authorization': 'Bearer ' + $tokenStore.token
    				}
    			});

    			let tempItems = await resp.json();
    			$$invalidate(6, myEmail = tempItems[0].email);
    			$$invalidate(7, myName = tempItems[0].name);
    			$$invalidate(8, myDepartment = tempItems[0].department);
    		} catch(e) {
    			console.error(e);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<AdminPage> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		editEmail = this.value;
    		$$invalidate(2, editEmail);
    	}

    	function input1_input_handler() {
    		editDate = this.value;
    		$$invalidate(3, editDate);
    	}

    	function input2_change_handler() {
    		editIsMorningShift = this.checked;
    		$$invalidate(4, editIsMorningShift);
    	}

    	const setPage_handler = e => $$invalidate(1, currentPage = e.detail.page);

    	$$self.$capture_state = () => ({
    		tokenStore: store,
    		LightPaginationNav,
    		paginate,
    		router: page,
    		fade,
    		fly,
    		targetURL,
    		items,
    		postNewEmail,
    		postNewDate,
    		postNewIsMorningShift,
    		editEmail,
    		editDate,
    		editIsMorningShift,
    		today,
    		currentPage,
    		pageSize,
    		getBookings,
    		editBooking,
    		deleteBooking,
    		bookingIdForEditing,
    		getId,
    		fillBookingInfoIntoForm,
    		parseJwt: parseJwt$1,
    		closeCollapse,
    		myEmail,
    		myName,
    		myDepartment,
    		targetURLGetMyself,
    		getMyInfo,
    		paginatedItems,
    		$tokenStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('targetURL' in $$props) targetURL = $$props.targetURL;
    		if ('items' in $$props) $$invalidate(0, items = $$props.items);
    		if ('postNewEmail' in $$props) postNewEmail = $$props.postNewEmail;
    		if ('postNewDate' in $$props) postNewDate = $$props.postNewDate;
    		if ('postNewIsMorningShift' in $$props) postNewIsMorningShift = $$props.postNewIsMorningShift;
    		if ('editEmail' in $$props) $$invalidate(2, editEmail = $$props.editEmail);
    		if ('editDate' in $$props) $$invalidate(3, editDate = $$props.editDate);
    		if ('editIsMorningShift' in $$props) $$invalidate(4, editIsMorningShift = $$props.editIsMorningShift);
    		if ('today' in $$props) $$invalidate(11, today = $$props.today);
    		if ('currentPage' in $$props) $$invalidate(1, currentPage = $$props.currentPage);
    		if ('pageSize' in $$props) $$invalidate(12, pageSize = $$props.pageSize);
    		if ('bookingIdForEditing' in $$props) $$invalidate(5, bookingIdForEditing = $$props.bookingIdForEditing);
    		if ('myEmail' in $$props) $$invalidate(6, myEmail = $$props.myEmail);
    		if ('myName' in $$props) $$invalidate(7, myName = $$props.myName);
    		if ('myDepartment' in $$props) $$invalidate(8, myDepartment = $$props.myDepartment);
    		if ('targetURLGetMyself' in $$props) targetURLGetMyself = $$props.targetURLGetMyself;
    		if ('paginatedItems' in $$props) $$invalidate(9, paginatedItems = $$props.paginatedItems);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*items, currentPage*/ 3) {
    			$$invalidate(9, paginatedItems = paginate({ items, pageSize, currentPage }));
    		}
    	};

    	return [
    		items,
    		currentPage,
    		editEmail,
    		editDate,
    		editIsMorningShift,
    		bookingIdForEditing,
    		myEmail,
    		myName,
    		myDepartment,
    		paginatedItems,
    		$tokenStore,
    		today,
    		pageSize,
    		editBooking,
    		deleteBooking,
    		getId,
    		getMyInfo,
    		input0_input_handler,
    		input1_input_handler,
    		input2_change_handler,
    		setPage_handler
    	];
    }

    class AdminPage extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AdminPage",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    function flip(node, { from, to }, params = {}) {
        const style = getComputedStyle(node);
        const transform = style.transform === 'none' ? '' : style.transform;
        const [ox, oy] = style.transformOrigin.split(' ').map(parseFloat);
        const dx = (from.left + from.width * ox / to.width) - (to.left + ox);
        const dy = (from.top + from.height * oy / to.height) - (to.top + oy);
        const { delay = 0, duration = (d) => Math.sqrt(d) * 120, easing = cubicOut } = params;
        return {
            delay,
            duration: is_function(duration) ? duration(Math.sqrt(dx * dx + dy * dy)) : duration,
            easing,
            css: (t, u) => {
                const x = u * dx;
                const y = u * dy;
                const sx = t + u * from.width / to.width;
                const sy = t + u * from.height / to.height;
                return `transform: ${transform} translate(${x}px, ${y}px) scale(${sx}, ${sy});`;
            }
        };
    }

    /* src\routes\AllUsers.svelte generated by Svelte v3.43.2 */

    const { console: console_1 } = globals;
    const file$1 = "src\\routes\\AllUsers.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[45] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[45] = list[i];
    	return child_ctx;
    }

    // (465:16) {#if ($tokenStore.token != '')}
    function create_if_block_4(ctx) {
    	let show_if_1 = parseJwt(/*$tokenStore*/ ctx[17].token).role.includes('client');
    	let t;
    	let show_if = parseJwt(/*$tokenStore*/ ctx[17].token).role.includes('admin');
    	let if_block1_anchor;
    	let if_block0 = show_if_1 && create_if_block_6(ctx);
    	let if_block1 = show_if && create_if_block_5(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$tokenStore*/ 131072) show_if_1 = parseJwt(/*$tokenStore*/ ctx[17].token).role.includes('client');

    			if (show_if_1) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_6(ctx);
    					if_block0.c();
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty[0] & /*$tokenStore*/ 131072) show_if = parseJwt(/*$tokenStore*/ ctx[17].token).role.includes('admin');

    			if (show_if) {
    				if (if_block1) ; else {
    					if_block1 = create_if_block_5(ctx);
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(465:16) {#if ($tokenStore.token != '')}",
    		ctx
    	});

    	return block;
    }

    // (466:20) {#if (parseJwt($tokenStore.token).role.includes('client'))}
    function create_if_block_6(ctx) {
    	let li0;
    	let a0;
    	let i0;
    	let t0;
    	let span0;
    	let t2;
    	let li1;
    	let a1;
    	let i1;
    	let t3;
    	let span1;

    	const block = {
    		c: function create() {
    			li0 = element("li");
    			a0 = element("a");
    			i0 = element("i");
    			t0 = space();
    			span0 = element("span");
    			span0.textContent = "Auctions";
    			t2 = space();
    			li1 = element("li");
    			a1 = element("a");
    			i1 = element("i");
    			t3 = space();
    			span1 = element("span");
    			span1.textContent = "My bids";
    			attr_dev(i0, "class", "fas fa-tachometer-alt");
    			add_location(i0, file$1, 468, 32, 15036);
    			add_location(span0, file$1, 469, 32, 15107);
    			attr_dev(a0, "class", "nav-link");
    			attr_dev(a0, "href", "/home");
    			add_location(a0, file$1, 467, 28, 14969);
    			attr_dev(li0, "class", "nav-item");
    			add_location(li0, file$1, 466, 24, 14918);
    			attr_dev(i1, "class", "fa fa-money");
    			add_location(i1, file$1, 474, 32, 15340);
    			add_location(span1, file$1, 475, 32, 15401);
    			attr_dev(a1, "class", "nav-link");
    			attr_dev(a1, "href", "/my-bids");
    			add_location(a1, file$1, 473, 28, 15270);
    			attr_dev(li1, "class", "nav-item");
    			add_location(li1, file$1, 472, 24, 15219);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li0, anchor);
    			append_dev(li0, a0);
    			append_dev(a0, i0);
    			append_dev(a0, t0);
    			append_dev(a0, span0);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, li1, anchor);
    			append_dev(li1, a1);
    			append_dev(a1, i1);
    			append_dev(a1, t3);
    			append_dev(a1, span1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(li1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(466:20) {#if (parseJwt($tokenStore.token).role.includes('client'))}",
    		ctx
    	});

    	return block;
    }

    // (480:20) {#if (parseJwt($tokenStore.token).role.includes('admin'))}
    function create_if_block_5(ctx) {
    	let li0;
    	let a0;
    	let i0;
    	let t0;
    	let span0;
    	let t2;
    	let li1;
    	let a1;
    	let i1;
    	let t3;
    	let span1;

    	const block = {
    		c: function create() {
    			li0 = element("li");
    			a0 = element("a");
    			i0 = element("i");
    			t0 = space();
    			span0 = element("span");
    			span0.textContent = "All reservations";
    			t2 = space();
    			li1 = element("li");
    			a1 = element("a");
    			i1 = element("i");
    			t3 = space();
    			span1 = element("span");
    			span1.textContent = "All employees";
    			attr_dev(i0, "class", "fas fa-calendar-check");
    			add_location(i0, file$1, 482, 32, 15743);
    			add_location(span0, file$1, 483, 32, 15814);
    			attr_dev(a0, "class", "nav-link");
    			attr_dev(a0, "href", "/admin-page");
    			add_location(a0, file$1, 481, 28, 15670);
    			attr_dev(li0, "class", "nav-item");
    			add_location(li0, file$1, 480, 24, 15619);
    			attr_dev(i1, "class", "fas fa-id-card-alt");
    			add_location(i1, file$1, 488, 32, 16057);
    			add_location(span1, file$1, 490, 32, 16127);
    			attr_dev(a1, "class", "nav-link");
    			attr_dev(a1, "href", "/all-users");
    			add_location(a1, file$1, 487, 28, 15985);
    			attr_dev(li1, "class", "nav-item");
    			add_location(li1, file$1, 486, 24, 15934);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li0, anchor);
    			append_dev(li0, a0);
    			append_dev(a0, i0);
    			append_dev(a0, t0);
    			append_dev(a0, span0);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, li1, anchor);
    			append_dev(li1, a1);
    			append_dev(a1, i1);
    			append_dev(a1, t3);
    			append_dev(a1, span1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(li1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(480:20) {#if (parseJwt($tokenStore.token).role.includes('admin'))}",
    		ctx
    	});

    	return block;
    }

    // (519:32) {#if $tokenStore.token != ''}
    function create_if_block_3(ctx) {
    	let t_value = parseJwt(/*$tokenStore*/ ctx[17].token).email + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$tokenStore*/ 131072 && t_value !== (t_value = parseJwt(/*$tokenStore*/ ctx[17].token).email + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(519:32) {#if $tokenStore.token != ''}",
    		ctx
    	});

    	return block;
    }

    // (531:28) {#if ($tokenStore.token != '')}
    function create_if_block_2(ctx) {
    	let t_value = parseJwt(/*$tokenStore*/ ctx[17].token).name + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$tokenStore*/ 131072 && t_value !== (t_value = parseJwt(/*$tokenStore*/ ctx[17].token).name + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(531:28) {#if ($tokenStore.token != '')}",
    		ctx
    	});

    	return block;
    }

    // (556:28) {#each distinctDepartments as item}
    function create_each_block_1(ctx) {
    	let option;
    	let t0_value = /*item*/ ctx[45] + "";
    	let t0;
    	let t1;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = space();
    			option.__value = option_value_value = /*item*/ ctx[45];
    			option.value = option.__value;
    			add_location(option, file$1, 556, 32, 19545);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*distinctDepartments*/ 4 && t0_value !== (t0_value = /*item*/ ctx[45] + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*distinctDepartments*/ 4 && option_value_value !== (option_value_value = /*item*/ ctx[45])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(556:28) {#each distinctDepartments as item}",
    		ctx
    	});

    	return block;
    }

    // (598:44) {:else}
    function create_else_block_1(ctx) {
    	let td;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			td = element("td");
    			button = element("button");
    			button.textContent = "Assign a Reservation";
    			attr_dev(button, "class", "btn btn-primary shadow-sm");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "data-bs-target", "#modal-1");
    			attr_dev(button, "data-bs-toggle", "modal");
    			add_location(button, file$1, 599, 52, 21700);
    			add_location(td, file$1, 598, 48, 21642);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, button);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*setEmailForReservation*/ ctx[20](/*item*/ ctx[45].email))) /*setEmailForReservation*/ ctx[20](/*item*/ ctx[45].email).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(598:44) {:else}",
    		ctx
    	});

    	return block;
    }

    // (592:44) {#if item.role.includes('admin')}
    function create_if_block_1(ctx) {
    	let td;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			td = element("td");
    			button = element("button");
    			button.textContent = "Assign a Reservation";
    			attr_dev(button, "class", "btn btn-primary shadow-sm disabled");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "data-bs-target", "#modal-1");
    			attr_dev(button, "data-bs-toggle", "modal");
    			add_location(button, file$1, 593, 52, 21180);
    			add_location(td, file$1, 592, 48, 21122);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, button);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*setEmailForReservation*/ ctx[20](/*item*/ ctx[45].email))) /*setEmailForReservation*/ ctx[20](/*item*/ ctx[45].email).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(592:44) {#if item.role.includes('admin')}",
    		ctx
    	});

    	return block;
    }

    // (621:44) {:else}
    function create_else_block(ctx) {
    	let td;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			td = element("td");
    			button = element("button");
    			button.textContent = "Delete Employee";
    			attr_dev(button, "class", "btn btn-primary shadow-sm btn-danger");
    			attr_dev(button, "type", "button ");
    			attr_dev(button, "data-bs-toggle", "modal");
    			add_location(button, file$1, 622, 52, 23204);
    			add_location(td, file$1, 621, 48, 23146);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, button);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*deleteEmployee*/ ctx[22](/*item*/ ctx[45].email))) /*deleteEmployee*/ ctx[22](/*item*/ ctx[45].email).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(621:44) {:else}",
    		ctx
    	});

    	return block;
    }

    // (615:44) {#if item.role.includes('admin')}
    function create_if_block(ctx) {
    	let td;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			td = element("td");
    			button = element("button");
    			button.textContent = "Delete Employee";
    			attr_dev(button, "class", "btn btn-primary shadow-sm btn-danger disabled");
    			attr_dev(button, "type", "button ");
    			attr_dev(button, "data-bs-toggle", "modal");
    			add_location(button, file$1, 616, 52, 22711);
    			add_location(td, file$1, 615, 48, 22653);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, button);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*deleteEmployee*/ ctx[22](/*item*/ ctx[45].email))) /*deleteEmployee*/ ctx[22](/*item*/ ctx[45].email).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(615:44) {#if item.role.includes('admin')}",
    		ctx
    	});

    	return block;
    }

    // (584:32) {#each items as item}
    function create_each_block(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*item*/ ctx[45].name + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*item*/ ctx[45].department + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*item*/ ctx[45].phone + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*item*/ ctx[45].email + "";
    	let t6;
    	let t7;
    	let show_if_1;
    	let t8;
    	let td4;
    	let button;
    	let t10;
    	let show_if;
    	let t11;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (show_if_1 == null || dirty[0] & /*items*/ 2) show_if_1 = !!/*item*/ ctx[45].role.includes('admin');
    		if (show_if_1) return create_if_block_1;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type(ctx, [-1, -1]);
    	let if_block0 = current_block_type(ctx);

    	function select_block_type_1(ctx, dirty) {
    		if (show_if == null || dirty[0] & /*items*/ 2) show_if = !!/*item*/ ctx[45].role.includes('admin');
    		if (show_if) return create_if_block;
    		return create_else_block;
    	}

    	let current_block_type_1 = select_block_type_1(ctx, [-1, -1]);
    	let if_block1 = current_block_type_1(ctx);

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			if_block0.c();
    			t8 = space();
    			td4 = element("td");
    			button = element("button");
    			button.textContent = "Edit Info";
    			t10 = space();
    			if_block1.c();
    			t11 = space();
    			add_location(td0, file$1, 586, 44, 20709);
    			add_location(td1, file$1, 587, 44, 20775);
    			add_location(td2, file$1, 588, 44, 20847);
    			attr_dev(td3, "class", "justify-content-xl-center align-items-xl-center");
    			add_location(td3, file$1, 589, 44, 20914);
    			attr_dev(button, "class", "btn btn-primary shadow-sm");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "data-bs-target", "#modal-2");
    			attr_dev(button, "data-bs-toggle", "modal");
    			add_location(button, file$1, 608, 48, 22207);
    			add_location(td4, file$1, 607, 44, 22153);
    			add_location(tr, file$1, 585, 40, 20659);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			if_block0.m(tr, null);
    			append_dev(tr, t8);
    			append_dev(tr, td4);
    			append_dev(td4, button);
    			append_dev(tr, t10);
    			if_block1.m(tr, null);
    			append_dev(tr, t11);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*setInfoForEdit*/ ctx[23](/*item*/ ctx[45]))) /*setInfoForEdit*/ ctx[23](/*item*/ ctx[45]).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*items*/ 2 && t0_value !== (t0_value = /*item*/ ctx[45].name + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*items*/ 2 && t2_value !== (t2_value = /*item*/ ctx[45].department + "")) set_data_dev(t2, t2_value);
    			if (dirty[0] & /*items*/ 2 && t4_value !== (t4_value = /*item*/ ctx[45].phone + "")) set_data_dev(t4, t4_value);
    			if (dirty[0] & /*items*/ 2 && t6_value !== (t6_value = /*item*/ ctx[45].email + "")) set_data_dev(t6, t6_value);

    			if (current_block_type === (current_block_type = select_block_type(ctx, dirty)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(tr, t8);
    				}
    			}

    			if (current_block_type_1 === (current_block_type_1 = select_block_type_1(ctx, dirty)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type_1(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(tr, t11);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			if_block0.d();
    			if_block1.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(584:32) {#each items as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let body;
    	let div18;
    	let nav0;
    	let div3;
    	let a0;
    	let div0;
    	let i0;
    	let t0;
    	let div1;
    	let span0;
    	let t1;
    	let br0;
    	let t2;
    	let span1;
    	let t3;
    	let br1;
    	let t4;
    	let t5;
    	let ul0;
    	let t6;
    	let li0;
    	let a1;
    	let i1;
    	let t7;
    	let span2;
    	let t9;
    	let div2;
    	let button0;
    	let t10;
    	let div17;
    	let div14;
    	let nav1;
    	let div4;
    	let button1;
    	let i2;
    	let t11;
    	let ul1;
    	let li1;
    	let a2;
    	let t12;
    	let div13;
    	let div7;
    	let div5;
    	let h30;
    	let t13;
    	let t14;
    	let div6;
    	let h40;
    	let t16;
    	let h41;
    	let t17;
    	let button2;
    	let i3;
    	let t18;
    	let div9;
    	let div8;
    	let t19;
    	let select;
    	let option;
    	let t21;
    	let div12;
    	let div11;
    	let div10;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t23;
    	let th1;
    	let t25;
    	let th2;
    	let t27;
    	let th3;
    	let t29;
    	let th4;
    	let t30;
    	let th5;
    	let t31;
    	let th6;
    	let t32;
    	let tbody;
    	let t33;
    	let footer;
    	let div16;
    	let div15;
    	let span3;
    	let t35;
    	let a3;
    	let i4;
    	let t36;
    	let div24;
    	let div23;
    	let div22;
    	let div19;
    	let h42;
    	let t37;
    	let button3;
    	let t38;
    	let div20;
    	let form0;
    	let input0;
    	let t39;
    	let input1;
    	let t40;
    	let div21;
    	let button4;
    	let t42;
    	let div30;
    	let div29;
    	let div28;
    	let div25;
    	let h43;
    	let t44;
    	let div26;
    	let form1;
    	let t45;
    	let input2;
    	let t46;
    	let input3;
    	let t47;
    	let input4;
    	let t48;
    	let div27;
    	let button5;
    	let t50;
    	let div36;
    	let div35;
    	let div34;
    	let div31;
    	let h44;
    	let t52;
    	let div32;
    	let form2;
    	let h45;
    	let t54;
    	let input5;
    	let t55;
    	let input6;
    	let t56;
    	let input7;
    	let t57;
    	let input8;
    	let t58;
    	let input9;
    	let t59;
    	let div33;
    	let button6;
    	let t61;
    	let div42;
    	let div41;
    	let div40;
    	let div37;
    	let h46;
    	let t63;
    	let button7;
    	let t64;
    	let div38;
    	let form3;
    	let h31;
    	let t65;
    	let t66;
    	let t67;
    	let h32;
    	let t68;
    	let t69;
    	let t70;
    	let h33;
    	let t71;
    	let t72;
    	let t73;
    	let div39;
    	let button8;
    	let t75;
    	let script0;
    	let script0_src_value;
    	let t76;
    	let script1;
    	let script1_src_value;
    	let mounted;
    	let dispose;
    	let if_block0 = /*$tokenStore*/ ctx[17].token != '' && create_if_block_4(ctx);
    	let if_block1 = /*$tokenStore*/ ctx[17].token != '' && create_if_block_3(ctx);
    	let if_block2 = /*$tokenStore*/ ctx[17].token != '' && create_if_block_2(ctx);
    	let each_value_1 = /*distinctDepartments*/ ctx[2];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = /*items*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			body = element("body");
    			div18 = element("div");
    			nav0 = element("nav");
    			div3 = element("div");
    			a0 = element("a");
    			div0 = element("div");
    			i0 = element("i");
    			t0 = space();
    			div1 = element("div");
    			span0 = element("span");
    			t1 = text("Planion\r\n                        ");
    			br0 = element("br");
    			t2 = space();
    			span1 = element("span");
    			t3 = text("Start planning today!\r\n                        ");
    			br1 = element("br");
    			t4 = text(" ");
    			t5 = space();
    			ul0 = element("ul");
    			if (if_block0) if_block0.c();
    			t6 = space();
    			li0 = element("li");
    			a1 = element("a");
    			i1 = element("i");
    			t7 = space();
    			span2 = element("span");
    			span2.textContent = "Log out";
    			t9 = space();
    			div2 = element("div");
    			button0 = element("button");
    			t10 = space();
    			div17 = element("div");
    			div14 = element("div");
    			nav1 = element("nav");
    			div4 = element("div");
    			button1 = element("button");
    			i2 = element("i");
    			t11 = space();
    			ul1 = element("ul");
    			li1 = element("li");
    			a2 = element("a");
    			if (if_block1) if_block1.c();
    			t12 = space();
    			div13 = element("div");
    			div7 = element("div");
    			div5 = element("div");
    			h30 = element("h3");
    			t13 = text("Welcome\r\n                            ");
    			if (if_block2) if_block2.c();
    			t14 = space();
    			div6 = element("div");
    			h40 = element("h4");
    			h40.textContent = "Here is a list of employees.";
    			t16 = space();
    			h41 = element("h4");
    			t17 = text("Add a employee here \r\n                            ");
    			button2 = element("button");
    			i3 = element("i");
    			t18 = space();
    			div9 = element("div");
    			div8 = element("div");
    			t19 = text("Department:\r\n                        ");
    			select = element("select");
    			option = element("option");
    			option.textContent = "(no preference)\r\n                            ";

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t21 = space();
    			div12 = element("div");
    			div11 = element("div");
    			div10 = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Name";
    			t23 = space();
    			th1 = element("th");
    			th1.textContent = "Department";
    			t25 = space();
    			th2 = element("th");
    			th2.textContent = "Phone";
    			t27 = space();
    			th3 = element("th");
    			th3.textContent = "Email";
    			t29 = space();
    			th4 = element("th");
    			t30 = space();
    			th5 = element("th");
    			t31 = space();
    			th6 = element("th");
    			t32 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t33 = space();
    			footer = element("footer");
    			div16 = element("div");
    			div15 = element("div");
    			span3 = element("span");
    			span3.textContent = "Copyright © Planion 2021";
    			t35 = space();
    			a3 = element("a");
    			i4 = element("i");
    			t36 = space();
    			div24 = element("div");
    			div23 = element("div");
    			div22 = element("div");
    			div19 = element("div");
    			h42 = element("h4");
    			t37 = space();
    			button3 = element("button");
    			t38 = space();
    			div20 = element("div");
    			form0 = element("form");
    			input0 = element("input");
    			t39 = text("\r\n                    Is morning shift:\r\n                    ");
    			input1 = element("input");
    			t40 = space();
    			div21 = element("div");
    			button4 = element("button");
    			button4.textContent = "Save";
    			t42 = space();
    			div30 = element("div");
    			div29 = element("div");
    			div28 = element("div");
    			div25 = element("div");
    			h43 = element("h4");
    			h43.textContent = "Please Edit the info";
    			t44 = space();
    			div26 = element("div");
    			form1 = element("form");
    			t45 = text("name: ");
    			input2 = element("input");
    			t46 = text("\r\n                    department: ");
    			input3 = element("input");
    			t47 = text("\r\n                    phone: ");
    			input4 = element("input");
    			t48 = space();
    			div27 = element("div");
    			button5 = element("button");
    			button5.textContent = "Save";
    			t50 = space();
    			div36 = element("div");
    			div35 = element("div");
    			div34 = element("div");
    			div31 = element("div");
    			h44 = element("h4");
    			h44.textContent = "Add employee";
    			t52 = space();
    			div32 = element("div");
    			form2 = element("form");
    			h45 = element("h4");
    			h45.textContent = "Please enter employee info";
    			t54 = text("\r\n                    name: ");
    			input5 = element("input");
    			t55 = text("\r\n                    department: ");
    			input6 = element("input");
    			t56 = text("\r\n                    phone: ");
    			input7 = element("input");
    			t57 = text("\r\n                    email: ");
    			input8 = element("input");
    			t58 = text("\r\n                    password: ");
    			input9 = element("input");
    			t59 = space();
    			div33 = element("div");
    			button6 = element("button");
    			button6.textContent = "Add Employee";
    			t61 = space();
    			div42 = element("div");
    			div41 = element("div");
    			div40 = element("div");
    			div37 = element("div");
    			h46 = element("h4");
    			h46.textContent = "Your info";
    			t63 = space();
    			button7 = element("button");
    			t64 = space();
    			div38 = element("div");
    			form3 = element("form");
    			h31 = element("h3");
    			t65 = text("Name: ");
    			t66 = text(/*myName*/ ctx[15]);
    			t67 = space();
    			h32 = element("h3");
    			t68 = text("Department: ");
    			t69 = text(/*myDepartment*/ ctx[16]);
    			t70 = space();
    			h33 = element("h3");
    			t71 = text("Email: ");
    			t72 = text(/*myEmail*/ ctx[14]);
    			t73 = space();
    			div39 = element("div");
    			button8 = element("button");
    			button8.textContent = "Close";
    			t75 = space();
    			script0 = element("script");
    			t76 = space();
    			script1 = element("script");
    			attr_dev(i0, "class", "far fa-calendar-alt");
    			add_location(i0, file$1, 451, 20, 14166);
    			attr_dev(div0, "class", "sidebar-brand-icon rotate-n-15");
    			add_location(div0, file$1, 450, 16, 14100);
    			add_location(br0, file$1, 455, 24, 14366);
    			set_style(span0, "font-size", "25px");
    			add_location(span0, file$1, 454, 20, 14302);
    			add_location(br1, file$1, 459, 24, 14585);
    			attr_dev(span1, "class", "text-capitalize");
    			set_style(span1, "font-size", "12px");
    			set_style(span1, "font-family", "'Bad Script', serif");
    			add_location(span1, file$1, 457, 20, 14421);
    			attr_dev(div1, "class", "sidebar-brand-text mx-3");
    			add_location(div1, file$1, 453, 16, 14243);
    			attr_dev(a0, "class", "navbar-brand d-flex justify-content-center align-items-center sidebar-brand m-0");
    			attr_dev(a0, "href", "");
    			set_style(a0, "padding-top", "36px");
    			add_location(a0, file$1, 448, 12, 13940);
    			attr_dev(i1, "class", "far fa-user-circle");
    			add_location(i1, file$1, 497, 24, 16423);
    			add_location(span2, file$1, 498, 24, 16483);
    			attr_dev(a1, "class", "nav-link");
    			attr_dev(a1, "href", "/login");
    			add_location(a1, file$1, 496, 20, 16329);
    			attr_dev(li0, "class", "nav-item");
    			add_location(li0, file$1, 495, 16, 16286);
    			attr_dev(ul0, "class", "navbar-nav text-light");
    			attr_dev(ul0, "id", "accordionSidebar");
    			set_style(ul0, "margin-top", "16px");
    			add_location(ul0, file$1, 463, 12, 14680);
    			attr_dev(button0, "class", "btn rounded-circle border-0");
    			attr_dev(button0, "id", "sidebarToggle");
    			attr_dev(button0, "type", "button");
    			add_location(button0, file$1, 503, 16, 16647);
    			attr_dev(div2, "class", "text-center d-none d-md-inline");
    			add_location(div2, file$1, 502, 12, 16585);
    			attr_dev(div3, "class", "container-fluid d-flex flex-column p-0");
    			add_location(div3, file$1, 447, 8, 13874);
    			attr_dev(nav0, "class", "navbar navbar-dark align-items-start sidebar sidebar-dark accordion bg-gradient-primary p-0");
    			add_location(nav0, file$1, 446, 4, 13759);
    			attr_dev(i2, "class", "fas fa-bars");
    			add_location(i2, file$1, 512, 24, 17158);
    			attr_dev(button1, "class", "btn btn-link d-md-none rounded-circle me-3");
    			attr_dev(button1, "id", "sidebarToggleTop");
    			attr_dev(button1, "type", "button");
    			add_location(button1, file$1, 511, 20, 17037);
    			attr_dev(a2, "class", "nav-link oneLine");
    			attr_dev(a2, "data-bs-target", "#modal-4");
    			attr_dev(a2, "data-bs-toggle", "modal");
    			add_location(a2, file$1, 517, 28, 17360);
    			attr_dev(li1, "class", "nav-item");
    			add_location(li1, file$1, 516, 24, 17309);
    			attr_dev(ul1, "class", "navbar-nav flex-nowrap ms-auto");
    			add_location(ul1, file$1, 515, 20, 17240);
    			attr_dev(div4, "class", "container-fluid");
    			add_location(div4, file$1, 510, 16, 16986);
    			attr_dev(nav1, "class", "navbar navbar-light navbar-expand bg-white shadow mb-4 topbar static-top");
    			add_location(nav1, file$1, 509, 12, 16882);
    			attr_dev(h30, "class", "text-dark d-table mb-0");
    			add_location(h30, file$1, 529, 24, 17917);
    			attr_dev(div5, "class", "col-12");
    			add_location(div5, file$1, 528, 20, 17871);
    			add_location(h40, file$1, 536, 24, 18278);
    			attr_dev(i3, "class", "fas fa-plus");
    			add_location(i3, file$1, 542, 32, 18810);
    			attr_dev(button2, "class", "btn btn-primary border rounded-circle justify-content-xl-center align-items-xl-center");
    			attr_dev(button2, "id", "add-button");
    			attr_dev(button2, "type", "button");
    			set_style(button2, "border-radius", "0");
    			attr_dev(button2, "data-bs-target", "#modal-add-employee");
    			attr_dev(button2, "data-bs-toggle", "modal");
    			add_location(button2, file$1, 538, 28, 18447);
    			attr_dev(h41, "class", "text-dark");
    			set_style(h41, "margin-bottom", "13px");
    			add_location(h41, file$1, 537, 24, 18341);
    			attr_dev(div6, "class", "col-12");
    			set_style(div6, "margin-bottom", "5px");
    			add_location(div6, file$1, 535, 20, 18204);
    			attr_dev(div7, "class", "row");
    			add_location(div7, file$1, 527, 16, 17832);
    			option.__value = "";
    			option.value = option.__value;
    			add_location(option, file$1, 552, 28, 19341);
    			attr_dev(select, "class", "btn btn-primary text-capitalize shadow-sm ");
    			if (/*selectedDepartment*/ ctx[0] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[27].call(select));
    			add_location(select, file$1, 551, 24, 19128);
    			attr_dev(div8, "class", "col mt-2");
    			set_style(div8, "margin-left", "1%");
    			add_location(div8, file$1, 549, 20, 19018);
    			attr_dev(div9, "class", "row");
    			add_location(div9, file$1, 548, 16, 18979);
    			add_location(th0, file$1, 571, 36, 20099);
    			add_location(th1, file$1, 572, 36, 20150);
    			add_location(th2, file$1, 573, 36, 20207);
    			add_location(th3, file$1, 574, 36, 20259);
    			add_location(th4, file$1, 576, 36, 20313);
    			add_location(th5, file$1, 577, 36, 20360);
    			add_location(th6, file$1, 578, 36, 20407);
    			attr_dev(tr, "class", "text-center");
    			add_location(tr, file$1, 570, 32, 20037);
    			add_location(thead, file$1, 569, 32, 19996);
    			attr_dev(tbody, "class", "text-center");
    			add_location(tbody, file$1, 581, 32, 20531);
    			attr_dev(table, "class", "table");
    			add_location(table, file$1, 568, 28, 19941);
    			attr_dev(div10, "class", "table-responsive");
    			add_location(div10, file$1, 567, 24, 19881);
    			attr_dev(div11, "class", "col");
    			add_location(div11, file$1, 566, 20, 19838);
    			attr_dev(div12, "class", "row");
    			add_location(div12, file$1, 565, 16, 19799);
    			attr_dev(div13, "class", "container-fluid");
    			add_location(div13, file$1, 526, 12, 17785);
    			attr_dev(div14, "id", "content");
    			add_location(div14, file$1, 508, 8, 16850);
    			add_location(span3, file$1, 641, 59, 24082);
    			attr_dev(div15, "class", "text-center my-auto copyright");
    			add_location(div15, file$1, 641, 16, 24039);
    			attr_dev(div16, "class", "container my-auto");
    			add_location(div16, file$1, 640, 12, 23990);
    			attr_dev(footer, "class", "bg-white d-xl-flex justify-content-xl-center align-items-xl-end sticky-footer");
    			add_location(footer, file$1, 639, 8, 23882);
    			attr_dev(div17, "class", "d-flex flex-column");
    			attr_dev(div17, "id", "content-wrapper");
    			add_location(div17, file$1, 507, 4, 16787);
    			attr_dev(i4, "class", "fas fa-angle-up");
    			add_location(i4, file$1, 645, 70, 24248);
    			attr_dev(a3, "class", "border rounded d-inline scroll-to-top");
    			attr_dev(a3, "href", "#page-top");
    			add_location(a3, file$1, 645, 4, 24182);
    			attr_dev(div18, "id", "wrapper");
    			add_location(div18, file$1, 445, 0, 13735);
    			attr_dev(h42, "class", "modal-title");
    			add_location(h42, file$1, 649, 38, 24527);
    			attr_dev(button3, "type", "button");
    			attr_dev(button3, "class", "btn-close");
    			attr_dev(button3, "data-bs-dismiss", "modal");
    			attr_dev(button3, "aria-label", "Close");
    			add_location(button3, file$1, 650, 16, 24574);
    			attr_dev(div19, "class", "modal-header");
    			add_location(div19, file$1, 649, 12, 24501);
    			attr_dev(input0, "min", /*today*/ ctx[18]);
    			attr_dev(input0, "class", "form-control oneLine");
    			attr_dev(input0, "id", "date");
    			attr_dev(input0, "type", "date");
    			attr_dev(input0, "name", "date");
    			input0.required = true;
    			add_location(input0, file$1, 655, 20, 24772);
    			attr_dev(input1, "type", "checkbox");
    			attr_dev(input1, "name", "scales");
    			add_location(input1, file$1, 657, 20, 24956);
    			add_location(form0, file$1, 654, 16, 24744);
    			attr_dev(div20, "class", "modal-body");
    			add_location(div20, file$1, 653, 12, 24702);
    			attr_dev(button4, "class", "btn btn-primary");
    			attr_dev(button4, "data-bs-dismiss", "modal");
    			add_location(button4, file$1, 662, 16, 25171);
    			attr_dev(div21, "class", "modal-footer");
    			add_location(div21, file$1, 661, 12, 25127);
    			attr_dev(div22, "class", "modal-content");
    			add_location(div22, file$1, 648, 8, 24460);
    			attr_dev(div23, "class", "modal-dialog modal-dialog-centered modal-dialog-scrollable");
    			attr_dev(div23, "role", "document");
    			add_location(div23, file$1, 647, 4, 24362);
    			attr_dev(div24, "class", "modal fade");
    			attr_dev(div24, "role", "dialog");
    			attr_dev(div24, "tabindex", "-1");
    			attr_dev(div24, "id", "modal-1");
    			add_location(div24, file$1, 646, 0, 24291);
    			attr_dev(h43, "class", "modal-title");
    			add_location(h43, file$1, 670, 38, 25536);
    			attr_dev(div25, "class", "modal-header");
    			add_location(div25, file$1, 670, 12, 25510);
    			attr_dev(input2, "class", "form-control");
    			input2.required = "true";
    			add_location(input2, file$1, 677, 25, 25847);
    			attr_dev(input3, "class", "form-control");
    			input3.required = "true";
    			add_location(input3, file$1, 678, 32, 25953);
    			attr_dev(input4, "class", "form-control");
    			input4.required = "true";
    			add_location(input4, file$1, 679, 27, 26059);
    			add_location(form1, file$1, 676, 16, 25814);
    			attr_dev(div26, "class", "modal-body");
    			add_location(div26, file$1, 675, 12, 25772);
    			attr_dev(button5, "class", "btn btn-primary");
    			attr_dev(button5, "data-bs-dismiss", "modal");
    			add_location(button5, file$1, 684, 16, 26236);
    			attr_dev(div27, "class", "modal-footer");
    			add_location(div27, file$1, 683, 12, 26192);
    			attr_dev(div28, "class", "modal-content");
    			add_location(div28, file$1, 669, 8, 25469);
    			attr_dev(div29, "class", "modal-dialog modal-dialog-centered");
    			attr_dev(div29, "role", "document");
    			add_location(div29, file$1, 668, 4, 25395);
    			attr_dev(div30, "class", "modal fade");
    			attr_dev(div30, "role", "dialog");
    			attr_dev(div30, "tabindex", "-1");
    			attr_dev(div30, "id", "modal-2");
    			add_location(div30, file$1, 667, 0, 25324);
    			attr_dev(h44, "class", "modal-title");
    			add_location(h44, file$1, 694, 38, 26615);
    			attr_dev(div31, "class", "modal-header");
    			add_location(div31, file$1, 694, 12, 26589);
    			add_location(h45, file$1, 701, 20, 26913);
    			attr_dev(input5, "class", "form-control");
    			input5.required = "true";
    			add_location(input5, file$1, 702, 26, 26976);
    			attr_dev(input6, "class", "form-control");
    			input6.required = "true";
    			add_location(input6, file$1, 703, 32, 27084);
    			attr_dev(input7, "class", "form-control");
    			input7.required = "true";
    			add_location(input7, file$1, 704, 27, 27192);
    			attr_dev(input8, "class", "form-control");
    			attr_dev(input8, "autocomplete", "autocomplete_off_hack_xfr4!k");
    			input8.required = "true";
    			add_location(input8, file$1, 705, 27, 27295);
    			attr_dev(input9, "class", "form-control");
    			attr_dev(input9, "type", "password");
    			input9.required = "true";
    			add_location(input9, file$1, 706, 30, 27444);
    			add_location(form2, file$1, 700, 16, 26885);
    			attr_dev(div32, "class", "modal-body");
    			add_location(div32, file$1, 699, 12, 26843);
    			attr_dev(button6, "class", "btn btn-primary");
    			attr_dev(button6, "data-bs-dismiss", "modal");
    			add_location(button6, file$1, 710, 16, 27639);
    			attr_dev(div33, "class", "modal-footer");
    			add_location(div33, file$1, 709, 12, 27595);
    			attr_dev(div34, "class", "modal-content");
    			add_location(div34, file$1, 693, 8, 26548);
    			attr_dev(div35, "class", "modal-dialog modal-dialog-centered");
    			attr_dev(div35, "role", "document");
    			add_location(div35, file$1, 692, 4, 26474);
    			attr_dev(div36, "class", "modal fade");
    			attr_dev(div36, "role", "dialog");
    			attr_dev(div36, "tabindex", "-1");
    			attr_dev(div36, "id", "modal-add-employee");
    			add_location(div36, file$1, 691, 0, 26392);
    			attr_dev(h46, "class", "modal-title");
    			add_location(h46, file$1, 719, 38, 28086);
    			attr_dev(button7, "type", "button");
    			attr_dev(button7, "class", "btn-close");
    			attr_dev(button7, "data-bs-dismiss", "modal");
    			attr_dev(button7, "aria-label", "Close");
    			add_location(button7, file$1, 720, 16, 28142);
    			attr_dev(div37, "class", "modal-header");
    			add_location(div37, file$1, 719, 12, 28060);
    			add_location(h31, file$1, 725, 20, 28340);
    			add_location(h32, file$1, 726, 20, 28385);
    			add_location(h33, file$1, 727, 20, 28442);
    			add_location(form3, file$1, 723, 16, 28310);
    			attr_dev(div38, "class", "modal-body");
    			add_location(div38, file$1, 722, 12, 28268);
    			attr_dev(button8, "class", "btn btn-danger");
    			attr_dev(button8, "type", "button");
    			attr_dev(button8, "data-bs-dismiss", "modal");
    			add_location(button8, file$1, 732, 16, 28572);
    			attr_dev(div39, "class", "modal-footer");
    			add_location(div39, file$1, 731, 12, 28528);
    			attr_dev(div40, "class", "modal-content");
    			add_location(div40, file$1, 718, 8, 28019);
    			attr_dev(div41, "class", "modal-dialog modal-dialog-centered modal-dialog-scrollable");
    			attr_dev(div41, "role", "document");
    			add_location(div41, file$1, 717, 4, 27921);
    			attr_dev(div42, "class", "modal fade");
    			attr_dev(div42, "role", "dialog");
    			attr_dev(div42, "tabindex", "-1");
    			attr_dev(div42, "id", "modal-4");
    			attr_dev(div42, "aria-hidden", "true");
    			attr_dev(div42, "aria-labelledby", "modal-4label");
    			add_location(div42, file$1, 716, 0, 27800);
    			script0.defer = true;
    			if (!src_url_equal(script0.src, script0_src_value = "https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js")) attr_dev(script0, "src", script0_src_value);
    			add_location(script0, file$1, 739, 0, 28717);
    			script1.defer = true;
    			if (!src_url_equal(script1.src, script1_src_value = "assets/js/script.min.js")) attr_dev(script1, "src", script1_src_value);
    			add_location(script1, file$1, 740, 0, 28825);
    			attr_dev(body, "id", "page-top");
    			add_location(body, file$1, 444, 0, 13713);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, body, anchor);
    			append_dev(body, div18);
    			append_dev(div18, nav0);
    			append_dev(nav0, div3);
    			append_dev(div3, a0);
    			append_dev(a0, div0);
    			append_dev(div0, i0);
    			append_dev(a0, t0);
    			append_dev(a0, div1);
    			append_dev(div1, span0);
    			append_dev(span0, t1);
    			append_dev(span0, br0);
    			append_dev(div1, t2);
    			append_dev(div1, span1);
    			append_dev(span1, t3);
    			append_dev(span1, br1);
    			append_dev(span1, t4);
    			append_dev(div3, t5);
    			append_dev(div3, ul0);
    			if (if_block0) if_block0.m(ul0, null);
    			append_dev(ul0, t6);
    			append_dev(ul0, li0);
    			append_dev(li0, a1);
    			append_dev(a1, i1);
    			append_dev(a1, t7);
    			append_dev(a1, span2);
    			append_dev(div3, t9);
    			append_dev(div3, div2);
    			append_dev(div2, button0);
    			append_dev(div18, t10);
    			append_dev(div18, div17);
    			append_dev(div17, div14);
    			append_dev(div14, nav1);
    			append_dev(nav1, div4);
    			append_dev(div4, button1);
    			append_dev(button1, i2);
    			append_dev(div4, t11);
    			append_dev(div4, ul1);
    			append_dev(ul1, li1);
    			append_dev(li1, a2);
    			if (if_block1) if_block1.m(a2, null);
    			append_dev(div14, t12);
    			append_dev(div14, div13);
    			append_dev(div13, div7);
    			append_dev(div7, div5);
    			append_dev(div5, h30);
    			append_dev(h30, t13);
    			if (if_block2) if_block2.m(h30, null);
    			append_dev(div7, t14);
    			append_dev(div7, div6);
    			append_dev(div6, h40);
    			append_dev(div6, t16);
    			append_dev(div6, h41);
    			append_dev(h41, t17);
    			append_dev(h41, button2);
    			append_dev(button2, i3);
    			append_dev(div13, t18);
    			append_dev(div13, div9);
    			append_dev(div9, div8);
    			append_dev(div8, t19);
    			append_dev(div8, select);
    			append_dev(select, option);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(select, null);
    			}

    			select_option(select, /*selectedDepartment*/ ctx[0]);
    			append_dev(div13, t21);
    			append_dev(div13, div12);
    			append_dev(div12, div11);
    			append_dev(div11, div10);
    			append_dev(div10, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t23);
    			append_dev(tr, th1);
    			append_dev(tr, t25);
    			append_dev(tr, th2);
    			append_dev(tr, t27);
    			append_dev(tr, th3);
    			append_dev(tr, t29);
    			append_dev(tr, th4);
    			append_dev(tr, t30);
    			append_dev(tr, th5);
    			append_dev(tr, t31);
    			append_dev(tr, th6);
    			append_dev(table, t32);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			append_dev(div17, t33);
    			append_dev(div17, footer);
    			append_dev(footer, div16);
    			append_dev(div16, div15);
    			append_dev(div15, span3);
    			append_dev(div18, t35);
    			append_dev(div18, a3);
    			append_dev(a3, i4);
    			append_dev(body, t36);
    			append_dev(body, div24);
    			append_dev(div24, div23);
    			append_dev(div23, div22);
    			append_dev(div22, div19);
    			append_dev(div19, h42);
    			append_dev(div19, t37);
    			append_dev(div19, button3);
    			append_dev(div22, t38);
    			append_dev(div22, div20);
    			append_dev(div20, form0);
    			append_dev(form0, input0);
    			set_input_value(input0, /*dateForReservation*/ ctx[4]);
    			append_dev(form0, t39);
    			append_dev(form0, input1);
    			input1.checked = /*isMorningShiftForReservation*/ ctx[5];
    			append_dev(div22, t40);
    			append_dev(div22, div21);
    			append_dev(div21, button4);
    			append_dev(body, t42);
    			append_dev(body, div30);
    			append_dev(div30, div29);
    			append_dev(div29, div28);
    			append_dev(div28, div25);
    			append_dev(div25, h43);
    			append_dev(div28, t44);
    			append_dev(div28, div26);
    			append_dev(div26, form1);
    			append_dev(form1, t45);
    			append_dev(form1, input2);
    			set_input_value(input2, /*nameForEdit*/ ctx[8]);
    			append_dev(form1, t46);
    			append_dev(form1, input3);
    			set_input_value(input3, /*departmentForEdit*/ ctx[6]);
    			append_dev(form1, t47);
    			append_dev(form1, input4);
    			set_input_value(input4, /*phoneForEdit*/ ctx[7]);
    			append_dev(div28, t48);
    			append_dev(div28, div27);
    			append_dev(div27, button5);
    			append_dev(body, t50);
    			append_dev(body, div36);
    			append_dev(div36, div35);
    			append_dev(div35, div34);
    			append_dev(div34, div31);
    			append_dev(div31, h44);
    			append_dev(div34, t52);
    			append_dev(div34, div32);
    			append_dev(div32, form2);
    			append_dev(form2, h45);
    			append_dev(form2, t54);
    			append_dev(form2, input5);
    			set_input_value(input5, /*nameForAdding*/ ctx[9]);
    			append_dev(form2, t55);
    			append_dev(form2, input6);
    			set_input_value(input6, /*departmentForAdding*/ ctx[10]);
    			append_dev(form2, t56);
    			append_dev(form2, input7);
    			set_input_value(input7, /*phoneForAdding*/ ctx[11]);
    			append_dev(form2, t57);
    			append_dev(form2, input8);
    			set_input_value(input8, /*emailForAdding*/ ctx[13]);
    			append_dev(form2, t58);
    			append_dev(form2, input9);
    			set_input_value(input9, /*passwordForAdding*/ ctx[12]);
    			append_dev(div34, t59);
    			append_dev(div34, div33);
    			append_dev(div33, button6);
    			append_dev(body, t61);
    			append_dev(body, div42);
    			append_dev(div42, div41);
    			append_dev(div41, div40);
    			append_dev(div40, div37);
    			append_dev(div37, h46);
    			append_dev(div37, t63);
    			append_dev(div37, button7);
    			append_dev(div40, t64);
    			append_dev(div40, div38);
    			append_dev(div38, form3);
    			append_dev(form3, h31);
    			append_dev(h31, t65);
    			append_dev(h31, t66);
    			append_dev(form3, t67);
    			append_dev(form3, h32);
    			append_dev(h32, t68);
    			append_dev(h32, t69);
    			append_dev(form3, t70);
    			append_dev(form3, h33);
    			append_dev(h33, t71);
    			append_dev(h33, t72);
    			append_dev(div40, t73);
    			append_dev(div40, div39);
    			append_dev(div39, button8);
    			append_dev(body, t75);
    			append_dev(body, script0);
    			append_dev(body, t76);
    			append_dev(body, script1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						a1,
    						"click",
    						function () {
    							if (is_function(/*$tokenStore*/ ctx[17].token = '')) (/*$tokenStore*/ ctx[17].token = '').apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(a2, "click", /*getMyInfo*/ ctx[26], false, false, false),
    					listen_dev(select, "change", /*select_change_handler*/ ctx[27]),
    					listen_dev(select, "change", /*change_handler*/ ctx[28], false, false, false),
    					listen_dev(
    						select,
    						"change",
    						function () {
    							if (is_function(/*getEmployees*/ ctx[19](/*department*/ ctx[3]))) /*getEmployees*/ ctx[19](/*department*/ ctx[3]).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[29]),
    					listen_dev(input1, "change", /*input1_change_handler*/ ctx[30]),
    					listen_dev(button4, "click", /*addReservation*/ ctx[21], false, false, false),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[31]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[32]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[33]),
    					listen_dev(button5, "click", /*editEmployee*/ ctx[24], false, false, false),
    					listen_dev(input5, "input", /*input5_input_handler*/ ctx[34]),
    					listen_dev(input6, "input", /*input6_input_handler*/ ctx[35]),
    					listen_dev(input7, "input", /*input7_input_handler*/ ctx[36]),
    					listen_dev(input8, "input", /*input8_input_handler*/ ctx[37]),
    					listen_dev(input9, "input", /*input9_input_handler*/ ctx[38]),
    					listen_dev(button6, "click", /*addEmployee*/ ctx[25], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*$tokenStore*/ ctx[17].token != '') {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_4(ctx);
    					if_block0.c();
    					if_block0.m(ul0, t6);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*$tokenStore*/ ctx[17].token != '') {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_3(ctx);
    					if_block1.c();
    					if_block1.m(a2, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*$tokenStore*/ ctx[17].token != '') {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_2(ctx);
    					if_block2.c();
    					if_block2.m(h30, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (dirty[0] & /*distinctDepartments*/ 4) {
    				each_value_1 = /*distinctDepartments*/ ctx[2];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty[0] & /*selectedDepartment, distinctDepartments*/ 5) {
    				select_option(select, /*selectedDepartment*/ ctx[0]);
    			}

    			if (dirty[0] & /*deleteEmployee, items, setInfoForEdit, setEmailForReservation*/ 13631490) {
    				each_value = /*items*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty[0] & /*dateForReservation*/ 16) {
    				set_input_value(input0, /*dateForReservation*/ ctx[4]);
    			}

    			if (dirty[0] & /*isMorningShiftForReservation*/ 32) {
    				input1.checked = /*isMorningShiftForReservation*/ ctx[5];
    			}

    			if (dirty[0] & /*nameForEdit*/ 256 && input2.value !== /*nameForEdit*/ ctx[8]) {
    				set_input_value(input2, /*nameForEdit*/ ctx[8]);
    			}

    			if (dirty[0] & /*departmentForEdit*/ 64 && input3.value !== /*departmentForEdit*/ ctx[6]) {
    				set_input_value(input3, /*departmentForEdit*/ ctx[6]);
    			}

    			if (dirty[0] & /*phoneForEdit*/ 128 && input4.value !== /*phoneForEdit*/ ctx[7]) {
    				set_input_value(input4, /*phoneForEdit*/ ctx[7]);
    			}

    			if (dirty[0] & /*nameForAdding*/ 512 && input5.value !== /*nameForAdding*/ ctx[9]) {
    				set_input_value(input5, /*nameForAdding*/ ctx[9]);
    			}

    			if (dirty[0] & /*departmentForAdding*/ 1024 && input6.value !== /*departmentForAdding*/ ctx[10]) {
    				set_input_value(input6, /*departmentForAdding*/ ctx[10]);
    			}

    			if (dirty[0] & /*phoneForAdding*/ 2048 && input7.value !== /*phoneForAdding*/ ctx[11]) {
    				set_input_value(input7, /*phoneForAdding*/ ctx[11]);
    			}

    			if (dirty[0] & /*emailForAdding*/ 8192 && input8.value !== /*emailForAdding*/ ctx[13]) {
    				set_input_value(input8, /*emailForAdding*/ ctx[13]);
    			}

    			if (dirty[0] & /*passwordForAdding*/ 4096 && input9.value !== /*passwordForAdding*/ ctx[12]) {
    				set_input_value(input9, /*passwordForAdding*/ ctx[12]);
    			}

    			if (dirty[0] & /*myName*/ 32768) set_data_dev(t66, /*myName*/ ctx[15]);
    			if (dirty[0] & /*myDepartment*/ 65536) set_data_dev(t69, /*myDepartment*/ ctx[16]);
    			if (dirty[0] & /*myEmail*/ 16384) set_data_dev(t72, /*myEmail*/ ctx[14]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(body);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function parseJwt(token) {
    	if (token != '') {
    		var base64Url = token.split('.')[1];
    		var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    		var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    			return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    		}).join(''));

    		return JSON.parse(jsonPayload);
    	}
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $tokenStore;
    	validate_store(store, 'tokenStore');
    	component_subscribe($$self, store, $$value => $$invalidate(17, $tokenStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AllUsers', slots, []);
    	let selectedDepartment = "";
    	let items = [];
    	let targetURLUsers = 'http://localhost:3000/users';
    	let targetURLBookings = 'http://localhost:3000/bookings';
    	let distinctDepartments = [];
    	let department = '';
    	let today = new Date().toISOString().split("T")[0];

    	/*
     let frameType='';
     let frameHeight='';


     let distinctFrameTypes=[];
     let distinctFrameHeights=[];



     let targetURLBids='http://localhost:3000/bids';
     let targetURLUsers='http://localhost:3000/users';


     let itemsToDisplay=[];
     let today = new Date().toISOString().split("T")[0];


    */
    	function getDistinctForDropDownItems() {
    		for (let item of items) {
    			if (!distinctDepartments.includes(item.department)) {
    				distinctDepartments.push(item.department);
    				$$invalidate(2, distinctDepartments);
    			}
    		}
    	}

    	//now each item in the items has 6 keys. the one extra key is highestBid
    	async function getEmployees(department) {
    		$$invalidate(1, items = []);
    		let targetURLUsersUseQuery = targetURLUsers;

    		if (department != '') {
    			targetURLUsersUseQuery += '?department=' + department;
    		}

    		console.log("query is " + targetURLUsersUseQuery);

    		try {
    			const resp = await fetch(targetURLUsersUseQuery, {
    				method: 'GET',
    				headers: {
    					'Content-type': 'application/json',
    					'authorization': 'Bearer ' + $tokenStore.token
    				}
    			});

    			let tempItems = await resp.json();

    			for (const tempItem of tempItems) {
    				items.push(tempItem);
    				$$invalidate(1, items);
    			}
    		} catch(e) {
    			console.error(e);
    		}

    		getDistinctForDropDownItems();
    	}

    	getEmployees('');
    	let emailForReservation = '';
    	let dateForReservation = '';
    	let isMorningShiftForReservation = false;

    	function setEmailForReservation(email) {
    		emailForReservation = email;
    		console.log("email set for reservation" + emailForReservation);
    	}

    	async function addReservation() {
    		console.log('email for reservation  ' + emailForReservation);
    		console.log('dateForReservation ' + dateForReservation);
    		console.log('ismorning shift for reservation ' + isMorningShiftForReservation);
    		console.log('token' + $tokenStore.token);

    		await fetch(targetURLBookings, {
    			method: "POST",
    			headers: {
    				"Content-Type": "application/json",
    				"authorization": "Bearer " + $tokenStore.token
    			},
    			body: JSON.stringify({
    				userEmail: emailForReservation,
    				shiftDate: dateForReservation,
    				isMorningShift: isMorningShiftForReservation
    			})
    		}).then(async res => {
    			if (res.ok) {
    				//location.reload();
    				page.redirect('/admin-page');

    				page.redirect('/all-user');
    				console.log("Success!");
    			} else {
    				res.json().then(body => {
    					alert(body.message || "Internal error");
    				});
    			}
    		}).catch(async err => {
    			alert(err);
    		});
    	}

    	// let employeeEmailForDeletion;
    	async function deleteEmployee(email) {
    		await fetch(targetURLUsers + '/' + email, {
    			method: 'DELETE',
    			headers: {
    				'Content-type': 'application/json',
    				'authorization': 'Bearer ' + $tokenStore.token
    			}
    		}).then(async res => {
    			if (res.ok) {
    				page.redirect('/admin-page');
    				page.redirect('/all-users');
    				console.log("Success!");
    			} else {
    				res.json().then(body => {
    					alert(body.message || "Internal error");
    				});
    			}
    		}).catch(async err => {
    			alert(err);
    		});
    	}

    	let departmentForEdit;
    	let phoneForEdit;
    	let nameForEdit;
    	let emailForEidt;

    	function setInfoForEdit(item) {
    		$$invalidate(6, departmentForEdit = item.department);
    		$$invalidate(7, phoneForEdit = item.phone);
    		$$invalidate(8, nameForEdit = item.name);
    		emailForEidt = item.email;
    	}

    	async function editEmployee() {
    		console.log('name for editing' + nameForEdit);
    		console.log('department for editing' + departmentForEdit);
    		console.log('phone for editing' + phoneForEdit);
    		console.log('email for editing' + emailForEidt);

    		await fetch(targetURLUsers + '/' + emailForEidt, {
    			method: "PATCH",
    			headers: {
    				"Content-Type": "application/json",
    				"authorization": "Bearer " + $tokenStore.token
    			},
    			body: JSON.stringify({
    				department: departmentForEdit,
    				name: nameForEdit,
    				phone: phoneForEdit
    			})
    		}).then(async res => {
    			if (res.ok) {
    				page.redirect('/admin-page');
    				page.redirect('/all-users');
    				console.log("Success!");
    			} else {
    				res.json().then(body => {
    					alert(body.message || "Internal error");
    				});
    			}
    		}).catch(async err => {
    			alert(err);
    		});
    	}

    	//add employee
    	let nameForAdding, departmentForAdding, phoneForAdding, passwordForAdding;

    	let emailForAdding = "";

    	async function addEmployee() {
    		console.log("ohone for addiing" + phoneForAdding);

    		await fetch(targetURLUsers, {
    			method: "POST",
    			headers: {
    				"Content-Type": "application/json",
    				"authorization": "Bearer " + $tokenStore.token
    			},
    			body: JSON.stringify({
    				name: nameForAdding,
    				department: departmentForAdding,
    				phone: phoneForAdding,
    				email: emailForAdding,
    				password: passwordForAdding
    			})
    		}).then(async res => {
    			if (res.ok) {
    				page.redirect('/admin-page');
    				page.redirect('/all-users');
    				console.log("Success!");
    			} else {
    				res.json().then(body => {
    					alert(body.message || "Internal error");
    				});
    			}
    		}).catch(async err => {
    			alert(err);
    		});
    	}

    	let myEmail = '';
    	let myName = '';
    	let myDepartment = '';
    	let targetURLGetMyself = 'http://localhost:3000/users/' + parseJwt($tokenStore.token).email;

    	async function getMyInfo() {
    		console.log("getMyInfo called");

    		try {
    			const resp = await fetch(targetURLGetMyself, {
    				method: 'GET',
    				headers: {
    					'Content-type': 'application/json',
    					'authorization': 'Bearer ' + $tokenStore.token
    				}
    			});

    			let tempItems = await resp.json();
    			$$invalidate(14, myEmail = tempItems[0].email);
    			$$invalidate(15, myName = tempItems[0].name);
    			$$invalidate(16, myDepartment = tempItems[0].department);
    		} catch(e) {
    			console.error(e);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<AllUsers> was created with unknown prop '${key}'`);
    	});

    	function select_change_handler() {
    		selectedDepartment = select_value(this);
    		$$invalidate(0, selectedDepartment);
    		$$invalidate(2, distinctDepartments);
    	}

    	const change_handler = () => {
    		$$invalidate(3, department = selectedDepartment);
    	};

    	function input0_input_handler() {
    		dateForReservation = this.value;
    		$$invalidate(4, dateForReservation);
    	}

    	function input1_change_handler() {
    		isMorningShiftForReservation = this.checked;
    		$$invalidate(5, isMorningShiftForReservation);
    	}

    	function input2_input_handler() {
    		nameForEdit = this.value;
    		$$invalidate(8, nameForEdit);
    	}

    	function input3_input_handler() {
    		departmentForEdit = this.value;
    		$$invalidate(6, departmentForEdit);
    	}

    	function input4_input_handler() {
    		phoneForEdit = this.value;
    		$$invalidate(7, phoneForEdit);
    	}

    	function input5_input_handler() {
    		nameForAdding = this.value;
    		$$invalidate(9, nameForAdding);
    	}

    	function input6_input_handler() {
    		departmentForAdding = this.value;
    		$$invalidate(10, departmentForAdding);
    	}

    	function input7_input_handler() {
    		phoneForAdding = this.value;
    		$$invalidate(11, phoneForAdding);
    	}

    	function input8_input_handler() {
    		emailForAdding = this.value;
    		$$invalidate(13, emailForAdding);
    	}

    	function input9_input_handler() {
    		passwordForAdding = this.value;
    		$$invalidate(12, passwordForAdding);
    	}

    	$$self.$capture_state = () => ({
    		tokenStore: store,
    		router: page,
    		fade,
    		fly,
    		flip,
    		selectedDepartment,
    		items,
    		targetURLUsers,
    		targetURLBookings,
    		distinctDepartments,
    		department,
    		today,
    		parseJwt,
    		getDistinctForDropDownItems,
    		getEmployees,
    		emailForReservation,
    		dateForReservation,
    		isMorningShiftForReservation,
    		setEmailForReservation,
    		addReservation,
    		deleteEmployee,
    		departmentForEdit,
    		phoneForEdit,
    		nameForEdit,
    		emailForEidt,
    		setInfoForEdit,
    		editEmployee,
    		nameForAdding,
    		departmentForAdding,
    		phoneForAdding,
    		passwordForAdding,
    		emailForAdding,
    		addEmployee,
    		myEmail,
    		myName,
    		myDepartment,
    		targetURLGetMyself,
    		getMyInfo,
    		$tokenStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('selectedDepartment' in $$props) $$invalidate(0, selectedDepartment = $$props.selectedDepartment);
    		if ('items' in $$props) $$invalidate(1, items = $$props.items);
    		if ('targetURLUsers' in $$props) targetURLUsers = $$props.targetURLUsers;
    		if ('targetURLBookings' in $$props) targetURLBookings = $$props.targetURLBookings;
    		if ('distinctDepartments' in $$props) $$invalidate(2, distinctDepartments = $$props.distinctDepartments);
    		if ('department' in $$props) $$invalidate(3, department = $$props.department);
    		if ('today' in $$props) $$invalidate(18, today = $$props.today);
    		if ('emailForReservation' in $$props) emailForReservation = $$props.emailForReservation;
    		if ('dateForReservation' in $$props) $$invalidate(4, dateForReservation = $$props.dateForReservation);
    		if ('isMorningShiftForReservation' in $$props) $$invalidate(5, isMorningShiftForReservation = $$props.isMorningShiftForReservation);
    		if ('departmentForEdit' in $$props) $$invalidate(6, departmentForEdit = $$props.departmentForEdit);
    		if ('phoneForEdit' in $$props) $$invalidate(7, phoneForEdit = $$props.phoneForEdit);
    		if ('nameForEdit' in $$props) $$invalidate(8, nameForEdit = $$props.nameForEdit);
    		if ('emailForEidt' in $$props) emailForEidt = $$props.emailForEidt;
    		if ('nameForAdding' in $$props) $$invalidate(9, nameForAdding = $$props.nameForAdding);
    		if ('departmentForAdding' in $$props) $$invalidate(10, departmentForAdding = $$props.departmentForAdding);
    		if ('phoneForAdding' in $$props) $$invalidate(11, phoneForAdding = $$props.phoneForAdding);
    		if ('passwordForAdding' in $$props) $$invalidate(12, passwordForAdding = $$props.passwordForAdding);
    		if ('emailForAdding' in $$props) $$invalidate(13, emailForAdding = $$props.emailForAdding);
    		if ('myEmail' in $$props) $$invalidate(14, myEmail = $$props.myEmail);
    		if ('myName' in $$props) $$invalidate(15, myName = $$props.myName);
    		if ('myDepartment' in $$props) $$invalidate(16, myDepartment = $$props.myDepartment);
    		if ('targetURLGetMyself' in $$props) targetURLGetMyself = $$props.targetURLGetMyself;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		selectedDepartment,
    		items,
    		distinctDepartments,
    		department,
    		dateForReservation,
    		isMorningShiftForReservation,
    		departmentForEdit,
    		phoneForEdit,
    		nameForEdit,
    		nameForAdding,
    		departmentForAdding,
    		phoneForAdding,
    		passwordForAdding,
    		emailForAdding,
    		myEmail,
    		myName,
    		myDepartment,
    		$tokenStore,
    		today,
    		getEmployees,
    		setEmailForReservation,
    		addReservation,
    		deleteEmployee,
    		setInfoForEdit,
    		editEmployee,
    		addEmployee,
    		getMyInfo,
    		select_change_handler,
    		change_handler,
    		input0_input_handler,
    		input1_change_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		input5_input_handler,
    		input6_input_handler,
    		input7_input_handler,
    		input8_input_handler,
    		input9_input_handler
    	];
    }

    class AllUsers extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AllUsers",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.43.2 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let switch_instance;
    	let t;
    	let main;
    	let current;
    	var switch_value = /*page*/ ctx[0];

    	function switch_props(ctx) {
    		return {
    			props: { params: /*params*/ ctx[1] },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			t = space();
    			main = element("main");
    			add_location(main, file, 40, 0, 1206);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, t, anchor);
    			insert_dev(target, main, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (switch_value !== (switch_value = /*page*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, t.parentNode, t);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (switch_instance) destroy_component(switch_instance, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $store;
    	validate_store(store, 'store');
    	component_subscribe($$self, store, $$value => $$invalidate(2, $store = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let page$1;
    	let params;
    	document.title = "Planion";

    	/**
     * Setting different routes for different pages, as the landing page will be the login page
     */
    	page('/', ctx => $$invalidate(0, page$1 = Login));

    	page('/home', ctx => $$invalidate(0, page$1 = Home));
    	page('/login', ctx => $$invalidate(0, page$1 = Login));
    	page('/all-users', ctx => $$invalidate(0, page$1 = AllUsers));
    	page('/admin-page', ctx => $$invalidate(0, page$1 = AdminPage));

    	//  routes('/my-bids', (ctx) => page = (MyBids))
    	page.start();

    	function checkLogin() {
    		if ($store.token == '') {
    			page.redirect('/login');
    		}
    	}

    	//This will check if the user is logged in
    	checkLogin();

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		routes: page,
    		Home,
    		Login,
    		Register,
    		AddBicycle: AdminPage,
    		store,
    		router: page,
    		MyBids: AllUsers,
    		AdminPage,
    		AllUsers,
    		page: page$1,
    		params,
    		checkLogin,
    		$store
    	});

    	$$self.$inject_state = $$props => {
    		if ('page' in $$props) $$invalidate(0, page$1 = $$props.page);
    		if ('params' in $$props) $$invalidate(1, params = $$props.params);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [page$1, params];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
