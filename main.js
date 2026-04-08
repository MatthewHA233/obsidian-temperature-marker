var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// node_modules/sql.js/dist/sql-wasm-browser.js
var require_sql_wasm_browser = __commonJS({
  "node_modules/sql.js/dist/sql-wasm-browser.js"(exports, module2) {
    var initSqlJsPromise = void 0;
    var initSqlJs = function(moduleConfig) {
      if (initSqlJsPromise) {
        return initSqlJsPromise;
      }
      initSqlJsPromise = new Promise(function(resolveModule, reject) {
        var _a, _b;
        var Module = typeof moduleConfig !== "undefined" ? moduleConfig : {};
        var originalOnAbortFunction = Module["onAbort"];
        Module["onAbort"] = function(errorThatCausedAbort) {
          reject(new Error(errorThatCausedAbort));
          if (originalOnAbortFunction) {
            originalOnAbortFunction(errorThatCausedAbort);
          }
        };
        Module["postRun"] = Module["postRun"] || [];
        Module["postRun"].push(function() {
          resolveModule(Module);
        });
        module2 = void 0;
        var k;
        k || (k = typeof Module != "undefined" ? Module : {});
        var aa = !!globalThis.window, ba = !!globalThis.WorkerGlobalScope;
        k.onRuntimeInitialized = function() {
          function a(f, l) {
            switch (typeof l) {
              case "boolean":
                $b(f, l ? 1 : 0);
                break;
              case "number":
                ac(f, l);
                break;
              case "string":
                bc(f, l, -1, -1);
                break;
              case "object":
                if (null === l)
                  eb(f);
                else if (null != l.length) {
                  var n = ca(l.length);
                  m.set(l, n);
                  cc(f, n, l.length, -1);
                  da(n);
                } else
                  ra(f, "Wrong API use : tried to return a value of an unknown type (" + l + ").", -1);
                break;
              default:
                eb(f);
            }
          }
          function b(f, l) {
            for (var n = [], p = 0; p < f; p += 1) {
              var u = r(l + 4 * p, "i32"), v = dc(u);
              if (1 === v || 2 === v)
                u = ec(u);
              else if (3 === v)
                u = fc(u);
              else if (4 === v) {
                v = u;
                u = gc(v);
                v = hc(v);
                for (var K = new Uint8Array(u), I = 0; I < u; I += 1)
                  K[I] = m[v + I];
                u = K;
              } else
                u = null;
              n.push(u);
            }
            return n;
          }
          function c(f, l) {
            this.Qa = f;
            this.db = l;
            this.Oa = 1;
            this.yb = [];
          }
          function d(f, l) {
            this.db = l;
            this.ob = ea(f);
            if (null === this.ob)
              throw Error("Unable to allocate memory for the SQL string");
            this.ub = this.ob;
            this.gb = this.Fb = null;
          }
          function e(f) {
            this.filename = "dbfile_" + (4294967295 * Math.random() >>> 0);
            if (null != f) {
              var l = this.filename, n = "/", p = l;
              n && (n = "string" == typeof n ? n : fa(n), p = l ? ha(n + "/" + l) : n);
              l = ia(true, true);
              p = ja(
                p,
                l
              );
              if (f) {
                if ("string" == typeof f) {
                  n = Array(f.length);
                  for (var u = 0, v = f.length; u < v; ++u)
                    n[u] = f.charCodeAt(u);
                  f = n;
                }
                ka(p, l | 146);
                n = la(p, 577);
                ma(n, f, 0, f.length, 0);
                na(n);
                ka(p, l);
              }
            }
            this.handleError(q(this.filename, g));
            this.db = r(g, "i32");
            hb(this.db);
            this.pb = {};
            this.Sa = {};
          }
          var g = y(4), h = k.cwrap, q = h("sqlite3_open", "number", ["string", "number"]), w = h("sqlite3_close_v2", "number", ["number"]), t = h("sqlite3_exec", "number", ["number", "string", "number", "number", "number"]), x = h("sqlite3_changes", "number", ["number"]), D = h(
            "sqlite3_prepare_v2",
            "number",
            ["number", "string", "number", "number", "number"]
          ), ib = h("sqlite3_sql", "string", ["number"]), jc = h("sqlite3_normalized_sql", "string", ["number"]), jb = h("sqlite3_prepare_v2", "number", ["number", "number", "number", "number", "number"]), kc = h("sqlite3_bind_text", "number", ["number", "number", "number", "number", "number"]), kb = h("sqlite3_bind_blob", "number", ["number", "number", "number", "number", "number"]), lc = h("sqlite3_bind_double", "number", ["number", "number", "number"]), mc = h("sqlite3_bind_int", "number", [
            "number",
            "number",
            "number"
          ]), nc = h("sqlite3_bind_parameter_index", "number", ["number", "string"]), oc = h("sqlite3_step", "number", ["number"]), pc = h("sqlite3_errmsg", "string", ["number"]), qc = h("sqlite3_column_count", "number", ["number"]), rc = h("sqlite3_data_count", "number", ["number"]), sc = h("sqlite3_column_double", "number", ["number", "number"]), lb = h("sqlite3_column_text", "string", ["number", "number"]), tc = h("sqlite3_column_blob", "number", ["number", "number"]), uc = h("sqlite3_column_bytes", "number", ["number", "number"]), vc = h(
            "sqlite3_column_type",
            "number",
            ["number", "number"]
          ), wc = h("sqlite3_column_name", "string", ["number", "number"]), xc = h("sqlite3_reset", "number", ["number"]), yc = h("sqlite3_clear_bindings", "number", ["number"]), zc = h("sqlite3_finalize", "number", ["number"]), mb = h("sqlite3_create_function_v2", "number", "number string number number number number number number number".split(" ")), dc = h("sqlite3_value_type", "number", ["number"]), gc = h("sqlite3_value_bytes", "number", ["number"]), fc = h("sqlite3_value_text", "string", ["number"]), hc = h(
            "sqlite3_value_blob",
            "number",
            ["number"]
          ), ec = h("sqlite3_value_double", "number", ["number"]), ac = h("sqlite3_result_double", "", ["number", "number"]), eb = h("sqlite3_result_null", "", ["number"]), bc = h("sqlite3_result_text", "", ["number", "string", "number", "number"]), cc = h("sqlite3_result_blob", "", ["number", "number", "number", "number"]), $b = h("sqlite3_result_int", "", ["number", "number"]), ra = h("sqlite3_result_error", "", ["number", "string", "number"]), nb = h("sqlite3_aggregate_context", "number", ["number", "number"]), hb = h(
            "RegisterExtensionFunctions",
            "number",
            ["number"]
          ), ob = h("sqlite3_update_hook", "number", ["number", "number", "number"]);
          c.prototype.bind = function(f) {
            if (!this.Qa)
              throw "Statement closed";
            this.reset();
            return Array.isArray(f) ? this.Wb(f) : null != f && "object" === typeof f ? this.Xb(f) : true;
          };
          c.prototype.step = function() {
            if (!this.Qa)
              throw "Statement closed";
            this.Oa = 1;
            var f = oc(this.Qa);
            switch (f) {
              case 100:
                return true;
              case 101:
                return false;
              default:
                throw this.db.handleError(f);
            }
          };
          c.prototype.Pb = function(f) {
            null == f && (f = this.Oa, this.Oa += 1);
            return sc(this.Qa, f);
          };
          c.prototype.hc = function(f) {
            null == f && (f = this.Oa, this.Oa += 1);
            f = lb(this.Qa, f);
            if ("function" !== typeof BigInt)
              throw Error("BigInt is not supported");
            return BigInt(f);
          };
          c.prototype.mc = function(f) {
            null == f && (f = this.Oa, this.Oa += 1);
            return lb(this.Qa, f);
          };
          c.prototype.getBlob = function(f) {
            null == f && (f = this.Oa, this.Oa += 1);
            var l = uc(this.Qa, f);
            f = tc(this.Qa, f);
            for (var n = new Uint8Array(l), p = 0; p < l; p += 1)
              n[p] = m[f + p];
            return n;
          };
          c.prototype.get = function(f, l) {
            l = l || {};
            null != f && this.bind(f) && this.step();
            f = [];
            for (var n = rc(this.Qa), p = 0; p < n; p += 1)
              switch (vc(this.Qa, p)) {
                case 1:
                  var u = l.useBigInt ? this.hc(p) : this.Pb(p);
                  f.push(u);
                  break;
                case 2:
                  f.push(this.Pb(p));
                  break;
                case 3:
                  f.push(this.mc(p));
                  break;
                case 4:
                  f.push(this.getBlob(p));
                  break;
                default:
                  f.push(null);
              }
            return f;
          };
          c.prototype.Db = function() {
            for (var f = [], l = qc(this.Qa), n = 0; n < l; n += 1)
              f.push(wc(this.Qa, n));
            return f;
          };
          c.prototype.Ob = function(f, l) {
            f = this.get(f, l);
            l = this.Db();
            for (var n = {}, p = 0; p < l.length; p += 1)
              n[l[p]] = f[p];
            return n;
          };
          c.prototype.lc = function() {
            return ib(this.Qa);
          };
          c.prototype.ic = function() {
            return jc(this.Qa);
          };
          c.prototype.Jb = function(f) {
            null != f && this.bind(f);
            this.step();
            return this.reset();
          };
          c.prototype.Lb = function(f, l) {
            null == l && (l = this.Oa, this.Oa += 1);
            f = ea(f);
            this.yb.push(f);
            this.db.handleError(kc(this.Qa, l, f, -1, 0));
          };
          c.prototype.Vb = function(f, l) {
            null == l && (l = this.Oa, this.Oa += 1);
            var n = ca(f.length);
            m.set(f, n);
            this.yb.push(n);
            this.db.handleError(kb(this.Qa, l, n, f.length, 0));
          };
          c.prototype.Kb = function(f, l) {
            null == l && (l = this.Oa, this.Oa += 1);
            this.db.handleError((f === (f | 0) ? mc : lc)(
              this.Qa,
              l,
              f
            ));
          };
          c.prototype.Yb = function(f) {
            null == f && (f = this.Oa, this.Oa += 1);
            kb(this.Qa, f, 0, 0, 0);
          };
          c.prototype.Mb = function(f, l) {
            null == l && (l = this.Oa, this.Oa += 1);
            switch (typeof f) {
              case "string":
                this.Lb(f, l);
                return;
              case "number":
                this.Kb(f, l);
                return;
              case "bigint":
                this.Lb(f.toString(), l);
                return;
              case "boolean":
                this.Kb(f + 0, l);
                return;
              case "object":
                if (null === f) {
                  this.Yb(l);
                  return;
                }
                if (null != f.length) {
                  this.Vb(f, l);
                  return;
                }
            }
            throw "Wrong API use : tried to bind a value of an unknown type (" + f + ").";
          };
          c.prototype.Xb = function(f) {
            var l = this;
            Object.keys(f).forEach(function(n) {
              var p = nc(l.Qa, n);
              0 !== p && l.Mb(f[n], p);
            });
            return true;
          };
          c.prototype.Wb = function(f) {
            for (var l = 0; l < f.length; l += 1)
              this.Mb(f[l], l + 1);
            return true;
          };
          c.prototype.reset = function() {
            this.Cb();
            return 0 === yc(this.Qa) && 0 === xc(this.Qa);
          };
          c.prototype.Cb = function() {
            for (var f; void 0 !== (f = this.yb.pop()); )
              da(f);
          };
          c.prototype.cb = function() {
            this.Cb();
            var f = 0 === zc(this.Qa);
            delete this.db.pb[this.Qa];
            this.Qa = 0;
            return f;
          };
          d.prototype.next = function() {
            if (null === this.ob)
              return { done: true };
            null !== this.gb && (this.gb.cb(), this.gb = null);
            if (!this.db.db)
              throw this.Ab(), Error("Database closed");
            var f = oa(), l = y(4);
            pa(g);
            pa(l);
            try {
              this.db.handleError(jb(this.db.db, this.ub, -1, g, l));
              this.ub = r(l, "i32");
              var n = r(g, "i32");
              if (0 === n)
                return this.Ab(), { done: true };
              this.gb = new c(n, this.db);
              this.db.pb[n] = this.gb;
              return { value: this.gb, done: false };
            } catch (p) {
              throw this.Fb = z(this.ub), this.Ab(), p;
            } finally {
              qa(f);
            }
          };
          d.prototype.Ab = function() {
            da(this.ob);
            this.ob = null;
          };
          d.prototype.jc = function() {
            return null !== this.Fb ? this.Fb : z(this.ub);
          };
          "function" === typeof Symbol && "symbol" === typeof Symbol.iterator && (d.prototype[Symbol.iterator] = function() {
            return this;
          });
          e.prototype.Jb = function(f, l) {
            if (!this.db)
              throw "Database closed";
            if (l) {
              f = this.Gb(f, l);
              try {
                f.step();
              } finally {
                f.cb();
              }
            } else
              this.handleError(t(this.db, f, 0, 0, g));
            return this;
          };
          e.prototype.exec = function(f, l, n) {
            if (!this.db)
              throw "Database closed";
            var p = null, u = null, v = null;
            try {
              v = u = ea(f);
              var K = y(4);
              for (f = []; 0 !== r(v, "i8"); ) {
                pa(g);
                pa(K);
                this.handleError(jb(this.db, v, -1, g, K));
                var I = r(g, "i32");
                v = r(
                  K,
                  "i32"
                );
                if (0 !== I) {
                  var H = null;
                  p = new c(I, this);
                  for (null != l && p.bind(l); p.step(); )
                    null === H && (H = { columns: p.Db(), values: [] }, f.push(H)), H.values.push(p.get(null, n));
                  p.cb();
                }
              }
              return f;
            } catch (L) {
              throw p && p.cb(), L;
            } finally {
              u && da(u);
            }
          };
          e.prototype.ec = function(f, l, n, p, u) {
            "function" === typeof l && (p = n, n = l, l = void 0);
            f = this.Gb(f, l);
            try {
              for (; f.step(); )
                n(f.Ob(null, u));
            } finally {
              f.cb();
            }
            if ("function" === typeof p)
              return p();
          };
          e.prototype.Gb = function(f, l) {
            pa(g);
            this.handleError(D(this.db, f, -1, g, 0));
            f = r(g, "i32");
            if (0 === f)
              throw "Nothing to prepare";
            var n = new c(f, this);
            null != l && n.bind(l);
            return this.pb[f] = n;
          };
          e.prototype.pc = function(f) {
            return new d(f, this);
          };
          e.prototype.fc = function() {
            Object.values(this.pb).forEach(function(l) {
              l.cb();
            });
            Object.values(this.Sa).forEach(A);
            this.Sa = {};
            this.handleError(w(this.db));
            var f = sa(this.filename);
            this.handleError(q(this.filename, g));
            this.db = r(g, "i32");
            hb(this.db);
            return f;
          };
          e.prototype.close = function() {
            null !== this.db && (Object.values(this.pb).forEach(function(f) {
              f.cb();
            }), Object.values(this.Sa).forEach(A), this.Sa = {}, this.fb && (A(this.fb), this.fb = void 0), this.handleError(w(this.db)), ta("/" + this.filename), this.db = null);
          };
          e.prototype.handleError = function(f) {
            if (0 === f)
              return null;
            f = pc(this.db);
            throw Error(f);
          };
          e.prototype.kc = function() {
            return x(this.db);
          };
          e.prototype.bc = function(f, l) {
            Object.prototype.hasOwnProperty.call(this.Sa, f) && (A(this.Sa[f]), delete this.Sa[f]);
            var n = ua(function(p, u, v) {
              u = b(u, v);
              try {
                var K = l.apply(null, u);
              } catch (I) {
                ra(p, I, -1);
                return;
              }
              a(p, K);
            }, "viii");
            this.Sa[f] = n;
            this.handleError(mb(
              this.db,
              f,
              l.length,
              1,
              0,
              n,
              0,
              0,
              0
            ));
            return this;
          };
          e.prototype.ac = function(f, l) {
            var n = l.init || function() {
              return null;
            }, p = l.finalize || function(H) {
              return H;
            }, u = l.step;
            if (!u)
              throw "An aggregate function must have a step function in " + f;
            var v = {};
            Object.hasOwnProperty.call(this.Sa, f) && (A(this.Sa[f]), delete this.Sa[f]);
            l = f + "__finalize";
            Object.hasOwnProperty.call(this.Sa, l) && (A(this.Sa[l]), delete this.Sa[l]);
            var K = ua(function(H, L, Ka) {
              var V = nb(H, 1);
              Object.hasOwnProperty.call(v, V) || (v[V] = n());
              L = b(L, Ka);
              L = [v[V]].concat(L);
              try {
                v[V] = u.apply(
                  null,
                  L
                );
              } catch (Bc) {
                delete v[V], ra(H, Bc, -1);
              }
            }, "viii"), I = ua(function(H) {
              var L = nb(H, 1);
              try {
                var Ka = p(v[L]);
              } catch (V) {
                delete v[L];
                ra(H, V, -1);
                return;
              }
              a(H, Ka);
              delete v[L];
            }, "vi");
            this.Sa[f] = K;
            this.Sa[l] = I;
            this.handleError(mb(this.db, f, u.length - 1, 1, 0, 0, K, I, 0));
            return this;
          };
          e.prototype.vc = function(f) {
            this.fb && (ob(this.db, 0, 0), A(this.fb), this.fb = void 0);
            if (!f)
              return this;
            this.fb = ua(function(l, n, p, u, v) {
              switch (n) {
                case 18:
                  l = "insert";
                  break;
                case 23:
                  l = "update";
                  break;
                case 9:
                  l = "delete";
                  break;
                default:
                  throw "unknown operationCode in updateHook callback: " + n;
              }
              p = z(p);
              u = z(u);
              if (v > Number.MAX_SAFE_INTEGER)
                throw "rowId too big to fit inside a Number";
              f(l, p, u, Number(v));
            }, "viiiij");
            ob(this.db, this.fb, 0);
            return this;
          };
          c.prototype.bind = c.prototype.bind;
          c.prototype.step = c.prototype.step;
          c.prototype.get = c.prototype.get;
          c.prototype.getColumnNames = c.prototype.Db;
          c.prototype.getAsObject = c.prototype.Ob;
          c.prototype.getSQL = c.prototype.lc;
          c.prototype.getNormalizedSQL = c.prototype.ic;
          c.prototype.run = c.prototype.Jb;
          c.prototype.reset = c.prototype.reset;
          c.prototype.freemem = c.prototype.Cb;
          c.prototype.free = c.prototype.cb;
          d.prototype.next = d.prototype.next;
          d.prototype.getRemainingSQL = d.prototype.jc;
          e.prototype.run = e.prototype.Jb;
          e.prototype.exec = e.prototype.exec;
          e.prototype.each = e.prototype.ec;
          e.prototype.prepare = e.prototype.Gb;
          e.prototype.iterateStatements = e.prototype.pc;
          e.prototype["export"] = e.prototype.fc;
          e.prototype.close = e.prototype.close;
          e.prototype.handleError = e.prototype.handleError;
          e.prototype.getRowsModified = e.prototype.kc;
          e.prototype.create_function = e.prototype.bc;
          e.prototype.create_aggregate = e.prototype.ac;
          e.prototype.updateHook = e.prototype.vc;
          k.Database = e;
        };
        var va = "./this.program", wa = (_b = (_a = globalThis.document) == null ? void 0 : _a.currentScript) == null ? void 0 : _b.src;
        ba && (wa = self.location.href);
        var xa = "", ya, za;
        if (aa || ba) {
          try {
            xa = new URL(".", wa).href;
          } catch (e) {
          }
          ba && (za = (a) => {
            var b = new XMLHttpRequest();
            b.open("GET", a, false);
            b.responseType = "arraybuffer";
            b.send(null);
            return new Uint8Array(b.response);
          });
          ya = async (a) => {
            a = await fetch(a, { credentials: "same-origin" });
            if (a.ok)
              return a.arrayBuffer();
            throw Error(a.status + " : " + a.url);
          };
        }
        var Aa = console.log.bind(console), B = console.error.bind(console), Ba, Ca = false, Da, m, C, Ea, E, F, Fa, Ga, G;
        function Ha() {
          var a = Ia.buffer;
          m = new Int8Array(a);
          Ea = new Int16Array(a);
          C = new Uint8Array(a);
          new Uint16Array(a);
          E = new Int32Array(a);
          F = new Uint32Array(a);
          Fa = new Float32Array(a);
          Ga = new Float64Array(a);
          G = new BigInt64Array(a);
          new BigUint64Array(a);
        }
        function Ja(a) {
          var _a2;
          (_a2 = k.onAbort) == null ? void 0 : _a2.call(k, a);
          a = "Aborted(" + a + ")";
          B(a);
          Ca = true;
          throw new WebAssembly.RuntimeError(a + ". Build with -sASSERTIONS for more info.");
        }
        var La;
        async function Ma(a) {
          if (!Ba)
            try {
              var b = await ya(a);
              return new Uint8Array(b);
            } catch (e) {
            }
          if (a == La && Ba)
            a = new Uint8Array(Ba);
          else if (za)
            a = za(a);
          else
            throw "both async and sync fetching of the wasm failed";
          return a;
        }
        async function Na(a, b) {
          try {
            var c = await Ma(a);
            return await WebAssembly.instantiate(c, b);
          } catch (d) {
            B(`failed to asynchronously prepare wasm: ${d}`), Ja(d);
          }
        }
        async function Oa(a) {
          var b = La;
          if (!Ba)
            try {
              var c = fetch(b, { credentials: "same-origin" });
              return await WebAssembly.instantiateStreaming(c, a);
            } catch (d) {
              B(`wasm streaming compile failed: ${d}`), B("falling back to ArrayBuffer instantiation");
            }
          return Na(b, a);
        }
        class Pa {
          constructor(a) {
            __publicField(this, "name", "ExitStatus");
            this.message = `Program terminated with exit(${a})`;
            this.status = a;
          }
        }
        var Qa = (a) => {
          for (; 0 < a.length; )
            a.shift()(k);
        }, Ra = [], Sa = [], Ta = () => {
          var a = k.preRun.shift();
          Sa.push(a);
        }, J = 0, Ua = null;
        function r(a, b = "i8") {
          b.endsWith("*") && (b = "*");
          switch (b) {
            case "i1":
              return m[a];
            case "i8":
              return m[a];
            case "i16":
              return Ea[a >> 1];
            case "i32":
              return E[a >> 2];
            case "i64":
              return G[a >> 3];
            case "float":
              return Fa[a >> 2];
            case "double":
              return Ga[a >> 3];
            case "*":
              return F[a >> 2];
            default:
              Ja(`invalid type for getValue: ${b}`);
          }
        }
        var Va = true;
        function pa(a) {
          var b = "i32";
          b.endsWith("*") && (b = "*");
          switch (b) {
            case "i1":
              m[a] = 0;
              break;
            case "i8":
              m[a] = 0;
              break;
            case "i16":
              Ea[a >> 1] = 0;
              break;
            case "i32":
              E[a >> 2] = 0;
              break;
            case "i64":
              G[a >> 3] = BigInt(0);
              break;
            case "float":
              Fa[a >> 2] = 0;
              break;
            case "double":
              Ga[a >> 3] = 0;
              break;
            case "*":
              F[a >> 2] = 0;
              break;
            default:
              Ja(`invalid type for setValue: ${b}`);
          }
        }
        var Wa = new TextDecoder(), Xa = (a, b, c, d) => {
          c = b + c;
          if (d)
            return c;
          for (; a[b] && !(b >= c); )
            ++b;
          return b;
        }, z = (a, b, c) => a ? Wa.decode(C.subarray(a, Xa(C, a, b, c))) : "", Ya = (a, b) => {
          for (var c = 0, d = a.length - 1; 0 <= d; d--) {
            var e = a[d];
            "." === e ? a.splice(d, 1) : ".." === e ? (a.splice(d, 1), c++) : c && (a.splice(d, 1), c--);
          }
          if (b)
            for (; c; c--)
              a.unshift("..");
          return a;
        }, ha = (a) => {
          var b = "/" === a.charAt(0), c = "/" === a.slice(-1);
          (a = Ya(a.split("/").filter((d) => !!d), !b).join("/")) || b || (a = ".");
          a && c && (a += "/");
          return (b ? "/" : "") + a;
        }, Za = (a) => {
          var b = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(a).slice(1);
          a = b[0];
          b = b[1];
          if (!a && !b)
            return ".";
          b && (b = b.slice(0, -1));
          return a + b;
        }, $a = (a) => a && a.match(/([^\/]+|\/)\/*$/)[1], ab = () => (a) => crypto.getRandomValues(a), bb = (a) => {
          (bb = ab())(a);
        }, cb = (...a) => {
          for (var b = "", c = false, d = a.length - 1; -1 <= d && !c; d--) {
            c = 0 <= d ? a[d] : "/";
            if ("string" != typeof c)
              throw new TypeError("Arguments to path.resolve must be strings");
            if (!c)
              return "";
            b = c + "/" + b;
            c = "/" === c.charAt(0);
          }
          b = Ya(b.split("/").filter((e) => !!e), !c).join("/");
          return (c ? "/" : "") + b || ".";
        }, db = (a) => {
          var b = Xa(a, 0);
          return Wa.decode(a.buffer ? a.subarray(0, b) : new Uint8Array(a.slice(0, b)));
        }, fb = [], gb = (a) => {
          for (var b = 0, c = 0; c < a.length; ++c) {
            var d = a.charCodeAt(c);
            127 >= d ? b++ : 2047 >= d ? b += 2 : 55296 <= d && 57343 >= d ? (b += 4, ++c) : b += 3;
          }
          return b;
        }, M = (a, b, c, d) => {
          if (!(0 < d))
            return 0;
          var e = c;
          d = c + d - 1;
          for (var g = 0; g < a.length; ++g) {
            var h = a.codePointAt(g);
            if (127 >= h) {
              if (c >= d)
                break;
              b[c++] = h;
            } else if (2047 >= h) {
              if (c + 1 >= d)
                break;
              b[c++] = 192 | h >> 6;
              b[c++] = 128 | h & 63;
            } else if (65535 >= h) {
              if (c + 2 >= d)
                break;
              b[c++] = 224 | h >> 12;
              b[c++] = 128 | h >> 6 & 63;
              b[c++] = 128 | h & 63;
            } else {
              if (c + 3 >= d)
                break;
              b[c++] = 240 | h >> 18;
              b[c++] = 128 | h >> 12 & 63;
              b[c++] = 128 | h >> 6 & 63;
              b[c++] = 128 | h & 63;
              g++;
            }
          }
          b[c] = 0;
          return c - e;
        }, pb = [];
        function qb(a, b) {
          pb[a] = { input: [], output: [], kb: b };
          rb(a, sb);
        }
        var sb = { open(a) {
          var b = pb[a.node.nb];
          if (!b)
            throw new N(43);
          a.Va = b;
          a.seekable = false;
        }, close(a) {
          a.Va.kb.lb(a.Va);
        }, lb(a) {
          a.Va.kb.lb(a.Va);
        }, read(a, b, c, d) {
          if (!a.Va || !a.Va.kb.Qb)
            throw new N(60);
          for (var e = 0, g = 0; g < d; g++) {
            try {
              var h = a.Va.kb.Qb(a.Va);
            } catch (q) {
              throw new N(29);
            }
            if (void 0 === h && 0 === e)
              throw new N(6);
            if (null === h || void 0 === h)
              break;
            e++;
            b[c + g] = h;
          }
          e && (a.node.$a = Date.now());
          return e;
        }, write(a, b, c, d) {
          if (!a.Va || !a.Va.kb.Hb)
            throw new N(60);
          try {
            for (var e = 0; e < d; e++)
              a.Va.kb.Hb(a.Va, b[c + e]);
          } catch (g) {
            throw new N(29);
          }
          d && (a.node.Ua = a.node.Ta = Date.now());
          return e;
        } }, tb = { Qb() {
          var _a2;
          a: {
            if (!fb.length) {
              var a = null;
              ((_a2 = globalThis.window) == null ? void 0 : _a2.prompt) && (a = window.prompt("Input: "), null !== a && (a += "\n"));
              if (!a) {
                var b = null;
                break a;
              }
              b = Array(gb(a) + 1);
              a = M(a, b, 0, b.length);
              b.length = a;
              fb = b;
            }
            b = fb.shift();
          }
          return b;
        }, Hb(a, b) {
          null === b || 10 === b ? (Aa(db(a.output)), a.output = []) : 0 != b && a.output.push(b);
        }, lb(a) {
          var _a2;
          0 < ((_a2 = a.output) == null ? void 0 : _a2.length) && (Aa(db(a.output)), a.output = []);
        }, Dc() {
          return { yc: 25856, Ac: 5, xc: 191, zc: 35387, wc: [
            3,
            28,
            127,
            21,
            4,
            0,
            1,
            0,
            17,
            19,
            26,
            0,
            18,
            15,
            23,
            22,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
          ] };
        }, Ec() {
          return 0;
        }, Fc() {
          return [24, 80];
        } }, ub = { Hb(a, b) {
          null === b || 10 === b ? (B(db(a.output)), a.output = []) : 0 != b && a.output.push(b);
        }, lb(a) {
          var _a2;
          0 < ((_a2 = a.output) == null ? void 0 : _a2.length) && (B(db(a.output)), a.output = []);
        } }, O = { Za: null, ab() {
          return O.createNode(null, "/", 16895, 0);
        }, createNode(a, b, c, d) {
          if (24576 === (c & 61440) || 4096 === (c & 61440))
            throw new N(63);
          O.Za || (O.Za = { dir: { node: { Wa: O.La.Wa, Xa: O.La.Xa, mb: O.La.mb, rb: O.La.rb, Tb: O.La.Tb, xb: O.La.xb, vb: O.La.vb, Ib: O.La.Ib, wb: O.La.wb }, stream: { Ya: O.Ma.Ya } }, file: {
            node: { Wa: O.La.Wa, Xa: O.La.Xa },
            stream: { Ya: O.Ma.Ya, read: O.Ma.read, write: O.Ma.write, sb: O.Ma.sb, tb: O.Ma.tb }
          }, link: { node: { Wa: O.La.Wa, Xa: O.La.Xa, eb: O.La.eb }, stream: {} }, Nb: { node: { Wa: O.La.Wa, Xa: O.La.Xa }, stream: vb } });
          c = wb(a, b, c, d);
          P(c.mode) ? (c.La = O.Za.dir.node, c.Ma = O.Za.dir.stream, c.Na = {}) : 32768 === (c.mode & 61440) ? (c.La = O.Za.file.node, c.Ma = O.Za.file.stream, c.Ra = 0, c.Na = null) : 40960 === (c.mode & 61440) ? (c.La = O.Za.link.node, c.Ma = O.Za.link.stream) : 8192 === (c.mode & 61440) && (c.La = O.Za.Nb.node, c.Ma = O.Za.Nb.stream);
          c.$a = c.Ua = c.Ta = Date.now();
          a && (a.Na[b] = c, a.$a = a.Ua = a.Ta = c.$a);
          return c;
        }, Cc(a) {
          return a.Na ? a.Na.subarray ? a.Na.subarray(0, a.Ra) : new Uint8Array(a.Na) : new Uint8Array(0);
        }, La: { Wa(a) {
          var b = {};
          b.cc = 8192 === (a.mode & 61440) ? a.id : 1;
          b.oc = a.id;
          b.mode = a.mode;
          b.rc = 1;
          b.uid = 0;
          b.nc = 0;
          b.nb = a.nb;
          P(a.mode) ? b.size = 4096 : 32768 === (a.mode & 61440) ? b.size = a.Ra : 40960 === (a.mode & 61440) ? b.size = a.link.length : b.size = 0;
          b.$a = new Date(a.$a);
          b.Ua = new Date(a.Ua);
          b.Ta = new Date(a.Ta);
          b.Zb = 4096;
          b.$b = Math.ceil(b.size / b.Zb);
          return b;
        }, Xa(a, b) {
          for (var c of ["mode", "atime", "mtime", "ctime"])
            null != b[c] && (a[c] = b[c]);
          void 0 !== b.size && (b = b.size, a.Ra != b && (0 == b ? (a.Na = null, a.Ra = 0) : (c = a.Na, a.Na = new Uint8Array(b), c && a.Na.set(c.subarray(0, Math.min(b, a.Ra))), a.Ra = b)));
        }, mb() {
          O.zb || (O.zb = new N(44), O.zb.stack = "<generic error, no stack>");
          throw O.zb;
        }, rb(a, b, c, d) {
          return O.createNode(a, b, c, d);
        }, Tb(a, b, c) {
          try {
            var d = Q(b, c);
          } catch (g) {
          }
          if (d) {
            if (P(a.mode))
              for (var e in d.Na)
                throw new N(55);
            xb(d);
          }
          delete a.parent.Na[a.name];
          b.Na[c] = a;
          a.name = c;
          b.Ta = b.Ua = a.parent.Ta = a.parent.Ua = Date.now();
        }, xb(a, b) {
          delete a.Na[b];
          a.Ta = a.Ua = Date.now();
        }, vb(a, b) {
          var c = Q(a, b), d;
          for (d in c.Na)
            throw new N(55);
          delete a.Na[b];
          a.Ta = a.Ua = Date.now();
        }, Ib(a) {
          return [".", "..", ...Object.keys(a.Na)];
        }, wb(a, b, c) {
          a = O.createNode(a, b, 41471, 0);
          a.link = c;
          return a;
        }, eb(a) {
          if (40960 !== (a.mode & 61440))
            throw new N(28);
          return a.link;
        } }, Ma: { read(a, b, c, d, e) {
          var g = a.node.Na;
          if (e >= a.node.Ra)
            return 0;
          a = Math.min(a.node.Ra - e, d);
          if (8 < a && g.subarray)
            b.set(g.subarray(e, e + a), c);
          else
            for (d = 0; d < a; d++)
              b[c + d] = g[e + d];
          return a;
        }, write(a, b, c, d, e, g) {
          b.buffer === m.buffer && (g = false);
          if (!d)
            return 0;
          a = a.node;
          a.Ua = a.Ta = Date.now();
          if (b.subarray && (!a.Na || a.Na.subarray)) {
            if (g)
              return a.Na = b.subarray(c, c + d), a.Ra = d;
            if (0 === a.Ra && 0 === e)
              return a.Na = b.slice(c, c + d), a.Ra = d;
            if (e + d <= a.Ra)
              return a.Na.set(b.subarray(c, c + d), e), d;
          }
          g = e + d;
          var h = a.Na ? a.Na.length : 0;
          h >= g || (g = Math.max(g, h * (1048576 > h ? 2 : 1.125) >>> 0), 0 != h && (g = Math.max(g, 256)), h = a.Na, a.Na = new Uint8Array(g), 0 < a.Ra && a.Na.set(h.subarray(0, a.Ra), 0));
          if (a.Na.subarray && b.subarray)
            a.Na.set(b.subarray(c, c + d), e);
          else
            for (g = 0; g < d; g++)
              a.Na[e + g] = b[c + g];
          a.Ra = Math.max(
            a.Ra,
            e + d
          );
          return d;
        }, Ya(a, b, c) {
          1 === c ? b += a.position : 2 === c && 32768 === (a.node.mode & 61440) && (b += a.node.Ra);
          if (0 > b)
            throw new N(28);
          return b;
        }, sb(a, b, c, d, e) {
          if (32768 !== (a.node.mode & 61440))
            throw new N(43);
          a = a.node.Na;
          if (e & 2 || !a || a.buffer !== m.buffer) {
            e = true;
            d = 65536 * Math.ceil(b / 65536);
            var g = yb(65536, d);
            g && C.fill(0, g, g + d);
            d = g;
            if (!d)
              throw new N(48);
            if (a) {
              if (0 < c || c + b < a.length)
                a.subarray ? a = a.subarray(c, c + b) : a = Array.prototype.slice.call(a, c, c + b);
              m.set(a, d);
            }
          } else
            e = false, d = a.byteOffset;
          return { tc: d, Ub: e };
        }, tb(a, b, c, d) {
          O.Ma.write(
            a,
            b,
            0,
            d,
            c,
            false
          );
          return 0;
        } } }, ia = (a, b) => {
          var c = 0;
          a && (c |= 365);
          b && (c |= 146);
          return c;
        }, zb = null, Ab = {}, Bb = [], Cb = 1, R = null, Db = false, Eb = true, N = class {
          constructor(a) {
            __publicField(this, "name", "ErrnoError");
            this.Pa = a;
          }
        }, Fb = class {
          constructor() {
            __publicField(this, "qb", {});
            __publicField(this, "node", null);
          }
          get flags() {
            return this.qb.flags;
          }
          set flags(a) {
            this.qb.flags = a;
          }
          get position() {
            return this.qb.position;
          }
          set position(a) {
            this.qb.position = a;
          }
        }, Gb = class {
          constructor(a, b, c, d) {
            __publicField(this, "La", {});
            __publicField(this, "Ma", {});
            __publicField(this, "ib", null);
            a || (a = this);
            this.parent = a;
            this.ab = a.ab;
            this.id = Cb++;
            this.name = b;
            this.mode = c;
            this.nb = d;
            this.$a = this.Ua = this.Ta = Date.now();
          }
          get read() {
            return 365 === (this.mode & 365);
          }
          set read(a) {
            a ? this.mode |= 365 : this.mode &= -366;
          }
          get write() {
            return 146 === (this.mode & 146);
          }
          set write(a) {
            a ? this.mode |= 146 : this.mode &= -147;
          }
        };
        function S(a, b = {}) {
          var _a2;
          if (!a)
            throw new N(44);
          (_a2 = b.Bb) != null ? _a2 : b.Bb = true;
          "/" === a.charAt(0) || (a = "//" + a);
          var c = 0;
          a:
            for (; 40 > c; c++) {
              a = a.split("/").filter((q) => !!q);
              for (var d = zb, e = "/", g = 0; g < a.length; g++) {
                var h = g === a.length - 1;
                if (h && b.parent)
                  break;
                if ("." !== a[g])
                  if (".." === a[g])
                    if (e = Za(e), d === d.parent) {
                      a = e + "/" + a.slice(g + 1).join("/");
                      c--;
                      continue a;
                    } else
                      d = d.parent;
                  else {
                    e = ha(e + "/" + a[g]);
                    try {
                      d = Q(d, a[g]);
                    } catch (q) {
                      if (44 === (q == null ? void 0 : q.Pa) && h && b.sc)
                        return { path: e };
                      throw q;
                    }
                    !d.ib || h && !b.Bb || (d = d.ib.root);
                    if (40960 === (d.mode & 61440) && (!h || b.hb)) {
                      if (!d.La.eb)
                        throw new N(52);
                      d = d.La.eb(d);
                      "/" === d.charAt(0) || (d = Za(e) + "/" + d);
                      a = d + "/" + a.slice(g + 1).join("/");
                      continue a;
                    }
                  }
              }
              return { path: e, node: d };
            }
          throw new N(32);
        }
        function fa(a) {
          for (var b; ; ) {
            if (a === a.parent)
              return a = a.ab.Sb, b ? "/" !== a[a.length - 1] ? `${a}/${b}` : a + b : a;
            b = b ? `${a.name}/${b}` : a.name;
            a = a.parent;
          }
        }
        function Hb(a, b) {
          for (var c = 0, d = 0; d < b.length; d++)
            c = (c << 5) - c + b.charCodeAt(d) | 0;
          return (a + c >>> 0) % R.length;
        }
        function xb(a) {
          var b = Hb(a.parent.id, a.name);
          if (R[b] === a)
            R[b] = a.jb;
          else
            for (b = R[b]; b; ) {
              if (b.jb === a) {
                b.jb = a.jb;
                break;
              }
              b = b.jb;
            }
        }
        function Q(a, b) {
          var c = P(a.mode) ? (c = Ib(a, "x")) ? c : a.La.mb ? 0 : 2 : 54;
          if (c)
            throw new N(c);
          for (c = R[Hb(a.id, b)]; c; c = c.jb) {
            var d = c.name;
            if (c.parent.id === a.id && d === b)
              return c;
          }
          return a.La.mb(a, b);
        }
        function wb(a, b, c, d) {
          a = new Gb(a, b, c, d);
          b = Hb(a.parent.id, a.name);
          a.jb = R[b];
          return R[b] = a;
        }
        function P(a) {
          return 16384 === (a & 61440);
        }
        function Ib(a, b) {
          return Eb ? 0 : b.includes("r") && !(a.mode & 292) || b.includes("w") && !(a.mode & 146) || b.includes("x") && !(a.mode & 73) ? 2 : 0;
        }
        function Jb(a, b) {
          if (!P(a.mode))
            return 54;
          try {
            return Q(a, b), 20;
          } catch (c) {
          }
          return Ib(a, "wx");
        }
        function Kb(a, b, c) {
          try {
            var d = Q(a, b);
          } catch (e) {
            return e.Pa;
          }
          if (a = Ib(a, "wx"))
            return a;
          if (c) {
            if (!P(d.mode))
              return 54;
            if (d === d.parent || "/" === fa(d))
              return 10;
          } else if (P(d.mode))
            return 31;
          return 0;
        }
        function Lb(a) {
          if (!a)
            throw new N(63);
          return a;
        }
        function T(a) {
          a = Bb[a];
          if (!a)
            throw new N(8);
          return a;
        }
        function Mb(a, b = -1) {
          a = Object.assign(new Fb(), a);
          if (-1 == b)
            a: {
              for (b = 0; 4096 >= b; b++)
                if (!Bb[b])
                  break a;
              throw new N(33);
            }
          a.bb = b;
          return Bb[b] = a;
        }
        function Nb(a, b = -1) {
          var _a2, _b2;
          a = Mb(a, b);
          (_b2 = (_a2 = a.Ma) == null ? void 0 : _a2.Bc) == null ? void 0 : _b2.call(_a2, a);
          return a;
        }
        function Ob(a, b, c) {
          var d = a == null ? void 0 : a.Ma.Xa;
          a = d ? a : b;
          d != null ? d : d = b.La.Xa;
          Lb(d);
          d(a, c);
        }
        var vb = { open(a) {
          var _a2, _b2;
          a.Ma = Ab[a.node.nb].Ma;
          (_b2 = (_a2 = a.Ma).open) == null ? void 0 : _b2.call(_a2, a);
        }, Ya() {
          throw new N(70);
        } };
        function rb(a, b) {
          Ab[a] = { Ma: b };
        }
        function Pb(a, b) {
          var c = "/" === b;
          if (c && zb)
            throw new N(10);
          if (!c && b) {
            var d = S(b, { Bb: false });
            b = d.path;
            d = d.node;
            if (d.ib)
              throw new N(10);
            if (!P(d.mode))
              throw new N(54);
          }
          b = { type: a, Gc: {}, Sb: b, qc: [] };
          a = a.ab(b);
          a.ab = b;
          b.root = a;
          c ? zb = a : d && (d.ib = b, d.ab && d.ab.qc.push(b));
        }
        function Qb(a, b, c) {
          var d = S(a, { parent: true }).node;
          a = $a(a);
          if (!a)
            throw new N(28);
          if ("." === a || ".." === a)
            throw new N(20);
          var e = Jb(d, a);
          if (e)
            throw new N(e);
          if (!d.La.rb)
            throw new N(63);
          return d.La.rb(d, a, b, c);
        }
        function ja(a, b = 438) {
          return Qb(a, b & 4095 | 32768, 0);
        }
        function U(a, b = 511) {
          return Qb(a, b & 1023 | 16384, 0);
        }
        function Rb(a, b, c) {
          "undefined" == typeof c && (c = b, b = 438);
          Qb(a, b | 8192, c);
        }
        function Sb(a, b) {
          if (!cb(a))
            throw new N(44);
          var c = S(b, { parent: true }).node;
          if (!c)
            throw new N(44);
          b = $a(b);
          var d = Jb(c, b);
          if (d)
            throw new N(d);
          if (!c.La.wb)
            throw new N(63);
          c.La.wb(c, b, a);
        }
        function Tb(a) {
          var b = S(a, { parent: true }).node;
          a = $a(a);
          var c = Q(b, a), d = Kb(b, a, true);
          if (d)
            throw new N(d);
          if (!b.La.vb)
            throw new N(63);
          if (c.ib)
            throw new N(10);
          b.La.vb(b, a);
          xb(c);
        }
        function ta(a) {
          var b = S(a, { parent: true }).node;
          if (!b)
            throw new N(44);
          a = $a(a);
          var c = Q(b, a), d = Kb(b, a, false);
          if (d)
            throw new N(d);
          if (!b.La.xb)
            throw new N(63);
          if (c.ib)
            throw new N(10);
          b.La.xb(b, a);
          xb(c);
        }
        function Ub(a, b) {
          a = S(a, { hb: !b }).node;
          return Lb(a.La.Wa)(a);
        }
        function Vb(a, b, c, d) {
          Ob(a, b, { mode: c & 4095 | b.mode & -4096, Ta: Date.now(), dc: d });
        }
        function ka(a, b) {
          a = "string" == typeof a ? S(a, { hb: true }).node : a;
          Vb(null, a, b);
        }
        function Wb(a, b, c) {
          if (P(b.mode))
            throw new N(31);
          if (32768 !== (b.mode & 61440))
            throw new N(28);
          var d = Ib(b, "w");
          if (d)
            throw new N(d);
          Ob(a, b, { size: c, timestamp: Date.now() });
        }
        function la(a, b, c = 438) {
          if ("" === a)
            throw new N(44);
          if ("string" == typeof b) {
            var d = { r: 0, "r+": 2, w: 577, "w+": 578, a: 1089, "a+": 1090 }[b];
            if ("undefined" == typeof d)
              throw Error(`Unknown file open mode: ${b}`);
            b = d;
          }
          c = b & 64 ? c & 4095 | 32768 : 0;
          if ("object" == typeof a)
            d = a;
          else {
            var e = a.endsWith("/");
            var g = S(a, { hb: !(b & 131072), sc: true });
            d = g.node;
            a = g.path;
          }
          g = false;
          if (b & 64)
            if (d) {
              if (b & 128)
                throw new N(20);
            } else {
              if (e)
                throw new N(31);
              d = Qb(a, c | 511, 0);
              g = true;
            }
          if (!d)
            throw new N(44);
          8192 === (d.mode & 61440) && (b &= -513);
          if (b & 65536 && !P(d.mode))
            throw new N(54);
          if (!g && (d ? 40960 === (d.mode & 61440) ? e = 32 : (e = ["r", "w", "rw"][b & 3], b & 512 && (e += "w"), e = P(d.mode) && ("r" !== e || b & 576) ? 31 : Ib(d, e)) : e = 44, e))
            throw new N(e);
          b & 512 && !g && (e = d, e = "string" == typeof e ? S(e, { hb: true }).node : e, Wb(null, e, 0));
          b = Mb({ node: d, path: fa(d), flags: b & -131713, seekable: true, position: 0, Ma: d.Ma, uc: [], error: false });
          b.Ma.open && b.Ma.open(b);
          g && ka(d, c & 511);
          return b;
        }
        function na(a) {
          if (null === a.bb)
            throw new N(8);
          a.Eb && (a.Eb = null);
          try {
            a.Ma.close && a.Ma.close(a);
          } catch (b) {
            throw b;
          } finally {
            Bb[a.bb] = null;
          }
          a.bb = null;
        }
        function Xb(a, b, c) {
          if (null === a.bb)
            throw new N(8);
          if (!a.seekable || !a.Ma.Ya)
            throw new N(70);
          if (0 != c && 1 != c && 2 != c)
            throw new N(28);
          a.position = a.Ma.Ya(a, b, c);
          a.uc = [];
        }
        function Yb(a, b, c, d, e) {
          if (0 > d || 0 > e)
            throw new N(28);
          if (null === a.bb)
            throw new N(8);
          if (1 === (a.flags & 2097155))
            throw new N(8);
          if (P(a.node.mode))
            throw new N(31);
          if (!a.Ma.read)
            throw new N(28);
          var g = "undefined" != typeof e;
          if (!g)
            e = a.position;
          else if (!a.seekable)
            throw new N(70);
          b = a.Ma.read(a, b, c, d, e);
          g || (a.position += b);
          return b;
        }
        function ma(a, b, c, d, e) {
          if (0 > d || 0 > e)
            throw new N(28);
          if (null === a.bb)
            throw new N(8);
          if (0 === (a.flags & 2097155))
            throw new N(8);
          if (P(a.node.mode))
            throw new N(31);
          if (!a.Ma.write)
            throw new N(28);
          a.seekable && a.flags & 1024 && Xb(a, 0, 2);
          var g = "undefined" != typeof e;
          if (!g)
            e = a.position;
          else if (!a.seekable)
            throw new N(70);
          b = a.Ma.write(a, b, c, d, e, void 0);
          g || (a.position += b);
          return b;
        }
        function sa(a) {
          var b = b || 0;
          var c = "binary";
          "utf8" !== c && "binary" !== c && Ja(`Invalid encoding type "${c}"`);
          b = la(a, b);
          a = Ub(a).size;
          var d = new Uint8Array(a);
          Yb(b, d, 0, a, 0);
          "utf8" === c && (d = db(d));
          na(b);
          return d;
        }
        function W(a, b, c) {
          var _a2;
          a = ha("/dev/" + a);
          var d = ia(!!b, !!c);
          (_a2 = W.Rb) != null ? _a2 : W.Rb = 64;
          var e = W.Rb++ << 8 | 0;
          rb(e, { open(g) {
            g.seekable = false;
          }, close() {
            var _a3;
            ((_a3 = c == null ? void 0 : c.buffer) == null ? void 0 : _a3.length) && c(10);
          }, read(g, h, q, w) {
            for (var t = 0, x = 0; x < w; x++) {
              try {
                var D = b();
              } catch (ib) {
                throw new N(29);
              }
              if (void 0 === D && 0 === t)
                throw new N(6);
              if (null === D || void 0 === D)
                break;
              t++;
              h[q + x] = D;
            }
            t && (g.node.$a = Date.now());
            return t;
          }, write(g, h, q, w) {
            for (var t = 0; t < w; t++)
              try {
                c(h[q + t]);
              } catch (x) {
                throw new N(29);
              }
            w && (g.node.Ua = g.node.Ta = Date.now());
            return t;
          } });
          Rb(a, d, e);
        }
        var X = {};
        function Y(a, b, c) {
          if ("/" === b.charAt(0))
            return b;
          a = -100 === a ? "/" : T(a).path;
          if (0 == b.length) {
            if (!c)
              throw new N(44);
            return a;
          }
          return a + "/" + b;
        }
        function Zb(a, b) {
          F[a >> 2] = b.cc;
          F[a + 4 >> 2] = b.mode;
          F[a + 8 >> 2] = b.rc;
          F[a + 12 >> 2] = b.uid;
          F[a + 16 >> 2] = b.nc;
          F[a + 20 >> 2] = b.nb;
          G[a + 24 >> 3] = BigInt(b.size);
          E[a + 32 >> 2] = 4096;
          E[a + 36 >> 2] = b.$b;
          var c = b.$a.getTime(), d = b.Ua.getTime(), e = b.Ta.getTime();
          G[a + 40 >> 3] = BigInt(Math.floor(c / 1e3));
          F[a + 48 >> 2] = c % 1e3 * 1e6;
          G[a + 56 >> 3] = BigInt(Math.floor(d / 1e3));
          F[a + 64 >> 2] = d % 1e3 * 1e6;
          G[a + 72 >> 3] = BigInt(Math.floor(e / 1e3));
          F[a + 80 >> 2] = e % 1e3 * 1e6;
          G[a + 88 >> 3] = BigInt(b.oc);
          return 0;
        }
        var ic = void 0, Ac = () => {
          var a = E[+ic >> 2];
          ic += 4;
          return a;
        }, Cc = 0, Dc = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335], Ec = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334], Fc = {}, Gc = (a) => {
          if (!(a instanceof Pa || "unwind" == a))
            throw a;
        }, Hc = (a) => {
          var _a2;
          Da = a;
          Va || 0 < Cc || ((_a2 = k.onExit) == null ? void 0 : _a2.call(k, a), Ca = true);
          throw new Pa(a);
        }, Ic = (a) => {
          if (!Ca)
            try {
              a();
            } catch (b) {
              Gc(b);
            } finally {
              if (!(Va || 0 < Cc))
                try {
                  Da = a = Da, Hc(a);
                } catch (b) {
                  Gc(b);
                }
            }
        }, Jc = {}, Lc = () => {
          var _a2, _b2;
          if (!Kc) {
            var a = { USER: "web_user", LOGNAME: "web_user", PATH: "/", PWD: "/", HOME: "/home/web_user", LANG: ((_b2 = (_a2 = globalThis.navigator) == null ? void 0 : _a2.language) != null ? _b2 : "C").replace("-", "_") + ".UTF-8", _: va || "./this.program" }, b;
            for (b in Jc)
              void 0 === Jc[b] ? delete a[b] : a[b] = Jc[b];
            var c = [];
            for (b in a)
              c.push(`${b}=${a[b]}`);
            Kc = c;
          }
          return Kc;
        }, Kc, Mc = (a, b, c, d) => {
          var e = { string: (t) => {
            var x = 0;
            if (null !== t && void 0 !== t && 0 !== t) {
              x = gb(t) + 1;
              var D = y(x);
              M(t, C, D, x);
              x = D;
            }
            return x;
          }, array: (t) => {
            var x = y(t.length);
            m.set(t, x);
            return x;
          } };
          a = k["_" + a];
          var g = [], h = 0;
          if (d)
            for (var q = 0; q < d.length; q++) {
              var w = e[c[q]];
              w ? (0 === h && (h = oa()), g[q] = w(d[q])) : g[q] = d[q];
            }
          c = a(...g);
          return c = function(t) {
            0 !== h && qa(h);
            return "string" === b ? z(t) : "boolean" === b ? !!t : t;
          }(c);
        }, ea = (a) => {
          var b = gb(a) + 1, c = ca(b);
          c && M(a, C, c, b);
          return c;
        }, Nc, Oc = [], A = (a) => {
          Nc.delete(Z.get(a));
          Z.set(a, null);
          Oc.push(a);
        }, Pc = (a) => {
          const b = a.length;
          return [b % 128 | 128, b >> 7, ...a];
        }, Qc = { i: 127, p: 127, j: 126, f: 125, d: 124, e: 111 }, Rc = (a) => Pc(Array.from(a, (b) => Qc[b])), ua = (a, b) => {
          if (!Nc) {
            Nc = /* @__PURE__ */ new WeakMap();
            var c = Z.length;
            if (Nc)
              for (var d = 0; d < 0 + c; d++) {
                var e = Z.get(d);
                e && Nc.set(e, d);
              }
          }
          if (c = Nc.get(a) || 0)
            return c;
          c = Oc.length ? Oc.pop() : Z.grow(1);
          try {
            Z.set(c, a);
          } catch (g) {
            if (!(g instanceof TypeError))
              throw g;
            b = Uint8Array.of(0, 97, 115, 109, 1, 0, 0, 0, 1, ...Pc([1, 96, ...Rc(b.slice(1)), ...Rc("v" === b[0] ? "" : b[0])]), 2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0);
            b = new WebAssembly.Module(b);
            b = new WebAssembly.Instance(b, { e: { f: a } }).exports.f;
            Z.set(c, b);
          }
          Nc.set(a, c);
          return c;
        };
        R = Array(4096);
        Pb(O, "/");
        U("/tmp");
        U("/home");
        U("/home/web_user");
        (function() {
          U("/dev");
          rb(259, { read: () => 0, write: (d, e, g, h) => h, Ya: () => 0 });
          Rb("/dev/null", 259);
          qb(1280, tb);
          qb(1536, ub);
          Rb("/dev/tty", 1280);
          Rb("/dev/tty1", 1536);
          var a = new Uint8Array(1024), b = 0, c = () => {
            0 === b && (bb(a), b = a.byteLength);
            return a[--b];
          };
          W("random", c);
          W("urandom", c);
          U("/dev/shm");
          U("/dev/shm/tmp");
        })();
        (function() {
          U("/proc");
          var a = U("/proc/self");
          U("/proc/self/fd");
          Pb({ ab() {
            var b = wb(a, "fd", 16895, 73);
            b.Ma = { Ya: O.Ma.Ya };
            b.La = { mb(c, d) {
              c = +d;
              var e = T(c);
              c = { parent: null, ab: { Sb: "fake" }, La: { eb: () => e.path }, id: c + 1 };
              return c.parent = c;
            }, Ib() {
              return Array.from(Bb.entries()).filter(([, c]) => c).map(([c]) => c.toString());
            } };
            return b;
          } }, "/proc/self/fd");
        })();
        k.noExitRuntime && (Va = k.noExitRuntime);
        k.print && (Aa = k.print);
        k.printErr && (B = k.printErr);
        k.wasmBinary && (Ba = k.wasmBinary);
        k.thisProgram && (va = k.thisProgram);
        if (k.preInit)
          for ("function" == typeof k.preInit && (k.preInit = [k.preInit]); 0 < k.preInit.length; )
            k.preInit.shift()();
        k.stackSave = () => oa();
        k.stackRestore = (a) => qa(a);
        k.stackAlloc = (a) => y(a);
        k.cwrap = (a, b, c, d) => {
          var e = !c || c.every((g) => "number" === g || "boolean" === g);
          return "string" !== b && e && !d ? k["_" + a] : (...g) => Mc(a, b, c, g);
        };
        k.addFunction = ua;
        k.removeFunction = A;
        k.UTF8ToString = z;
        k.stringToNewUTF8 = ea;
        k.writeArrayToMemory = (a, b) => {
          m.set(a, b);
        };
        var ca, da, yb, Sc, qa, y, oa, Ia, Z, Tc = {
          a: (a, b, c, d) => Ja(`Assertion failed: ${z(a)}, at: ` + [b ? z(b) : "unknown filename", c, d ? z(d) : "unknown function"]),
          i: function(a, b) {
            try {
              return a = z(a), ka(a, b), 0;
            } catch (c) {
              if ("undefined" == typeof X || "ErrnoError" !== c.name)
                throw c;
              return -c.Pa;
            }
          },
          L: function(a, b, c) {
            try {
              b = z(b);
              b = Y(a, b);
              if (c & -8)
                return -28;
              var d = S(b, { hb: true }).node;
              if (!d)
                return -44;
              a = "";
              c & 4 && (a += "r");
              c & 2 && (a += "w");
              c & 1 && (a += "x");
              return a && Ib(d, a) ? -2 : 0;
            } catch (e) {
              if ("undefined" == typeof X || "ErrnoError" !== e.name)
                throw e;
              return -e.Pa;
            }
          },
          j: function(a, b) {
            try {
              var c = T(a);
              Vb(c, c.node, b, false);
              return 0;
            } catch (d) {
              if ("undefined" == typeof X || "ErrnoError" !== d.name)
                throw d;
              return -d.Pa;
            }
          },
          h: function(a) {
            try {
              var b = T(a);
              Ob(b, b.node, { timestamp: Date.now(), dc: false });
              return 0;
            } catch (c) {
              if ("undefined" == typeof X || "ErrnoError" !== c.name)
                throw c;
              return -c.Pa;
            }
          },
          b: function(a, b, c) {
            ic = c;
            try {
              var d = T(a);
              switch (b) {
                case 0:
                  var e = Ac();
                  if (0 > e)
                    break;
                  for (; Bb[e]; )
                    e++;
                  return Nb(d, e).bb;
                case 1:
                case 2:
                  return 0;
                case 3:
                  return d.flags;
                case 4:
                  return e = Ac(), d.flags |= e, 0;
                case 12:
                  return e = Ac(), Ea[e + 0 >> 1] = 2, 0;
                case 13:
                case 14:
                  return 0;
              }
              return -28;
            } catch (g) {
              if ("undefined" == typeof X || "ErrnoError" !== g.name)
                throw g;
              return -g.Pa;
            }
          },
          g: function(a, b) {
            try {
              var c = T(a), d = c.node, e = c.Ma.Wa;
              a = e ? c : d;
              e != null ? e : e = d.La.Wa;
              Lb(e);
              var g = e(a);
              return Zb(b, g);
            } catch (h) {
              if ("undefined" == typeof X || "ErrnoError" !== h.name)
                throw h;
              return -h.Pa;
            }
          },
          H: function(a, b) {
            b = -9007199254740992 > b || 9007199254740992 < b ? NaN : Number(b);
            try {
              if (isNaN(b))
                return -61;
              var c = T(a);
              if (0 > b || 0 === (c.flags & 2097155))
                throw new N(28);
              Wb(c, c.node, b);
              return 0;
            } catch (d) {
              if ("undefined" == typeof X || "ErrnoError" !== d.name)
                throw d;
              return -d.Pa;
            }
          },
          G: function(a, b) {
            try {
              if (0 === b)
                return -28;
              var c = gb("/") + 1;
              if (b < c)
                return -68;
              M("/", C, a, b);
              return c;
            } catch (d) {
              if ("undefined" == typeof X || "ErrnoError" !== d.name)
                throw d;
              return -d.Pa;
            }
          },
          K: function(a, b) {
            try {
              return a = z(a), Zb(b, Ub(a, true));
            } catch (c) {
              if ("undefined" == typeof X || "ErrnoError" !== c.name)
                throw c;
              return -c.Pa;
            }
          },
          C: function(a, b, c) {
            try {
              return b = z(b), b = Y(a, b), U(b, c), 0;
            } catch (d) {
              if ("undefined" == typeof X || "ErrnoError" !== d.name)
                throw d;
              return -d.Pa;
            }
          },
          J: function(a, b, c, d) {
            try {
              b = z(b);
              var e = d & 256;
              b = Y(a, b, d & 4096);
              return Zb(c, e ? Ub(b, true) : Ub(b));
            } catch (g) {
              if ("undefined" == typeof X || "ErrnoError" !== g.name)
                throw g;
              return -g.Pa;
            }
          },
          x: function(a, b, c, d) {
            ic = d;
            try {
              b = z(b);
              b = Y(a, b);
              var e = d ? Ac() : 0;
              return la(b, c, e).bb;
            } catch (g) {
              if ("undefined" == typeof X || "ErrnoError" !== g.name)
                throw g;
              return -g.Pa;
            }
          },
          v: function(a, b, c, d) {
            try {
              b = z(b);
              b = Y(a, b);
              if (0 >= d)
                return -28;
              var e = S(b).node;
              if (!e)
                throw new N(44);
              if (!e.La.eb)
                throw new N(28);
              var g = e.La.eb(e);
              var h = Math.min(d, gb(g)), q = m[c + h];
              M(g, C, c, d + 1);
              m[c + h] = q;
              return h;
            } catch (w) {
              if ("undefined" == typeof X || "ErrnoError" !== w.name)
                throw w;
              return -w.Pa;
            }
          },
          u: function(a) {
            try {
              return a = z(a), Tb(a), 0;
            } catch (b) {
              if ("undefined" == typeof X || "ErrnoError" !== b.name)
                throw b;
              return -b.Pa;
            }
          },
          f: function(a, b) {
            try {
              return a = z(a), Zb(b, Ub(a));
            } catch (c) {
              if ("undefined" == typeof X || "ErrnoError" !== c.name)
                throw c;
              return -c.Pa;
            }
          },
          r: function(a, b, c) {
            try {
              b = z(b);
              b = Y(a, b);
              if (c)
                if (512 === c)
                  Tb(b);
                else
                  return -28;
              else
                ta(b);
              return 0;
            } catch (d) {
              if ("undefined" == typeof X || "ErrnoError" !== d.name)
                throw d;
              return -d.Pa;
            }
          },
          q: function(a, b, c) {
            try {
              b = z(b);
              b = Y(a, b, true);
              var d = Date.now(), e, g;
              if (c) {
                var h = F[c >> 2] + 4294967296 * E[c + 4 >> 2], q = E[c + 8 >> 2];
                1073741823 == q ? e = d : 1073741822 == q ? e = null : e = 1e3 * h + q / 1e6;
                c += 16;
                h = F[c >> 2] + 4294967296 * E[c + 4 >> 2];
                q = E[c + 8 >> 2];
                1073741823 == q ? g = d : 1073741822 == q ? g = null : g = 1e3 * h + q / 1e6;
              } else
                g = e = d;
              if (null !== (g != null ? g : e)) {
                a = e;
                var w = S(b, { hb: true }).node;
                Lb(w.La.Xa)(w, { $a: a, Ua: g });
              }
              return 0;
            } catch (t) {
              if ("undefined" == typeof X || "ErrnoError" !== t.name)
                throw t;
              return -t.Pa;
            }
          },
          m: () => Ja(""),
          l: () => {
            Va = false;
            Cc = 0;
          },
          A: function(a, b) {
            a = -9007199254740992 > a || 9007199254740992 < a ? NaN : Number(a);
            a = new Date(1e3 * a);
            E[b >> 2] = a.getSeconds();
            E[b + 4 >> 2] = a.getMinutes();
            E[b + 8 >> 2] = a.getHours();
            E[b + 12 >> 2] = a.getDate();
            E[b + 16 >> 2] = a.getMonth();
            E[b + 20 >> 2] = a.getFullYear() - 1900;
            E[b + 24 >> 2] = a.getDay();
            var c = a.getFullYear();
            E[b + 28 >> 2] = (0 !== c % 4 || 0 === c % 100 && 0 !== c % 400 ? Ec : Dc)[a.getMonth()] + a.getDate() - 1 | 0;
            E[b + 36 >> 2] = -(60 * a.getTimezoneOffset());
            c = new Date(a.getFullYear(), 6, 1).getTimezoneOffset();
            var d = new Date(a.getFullYear(), 0, 1).getTimezoneOffset();
            E[b + 32 >> 2] = (c != d && a.getTimezoneOffset() == Math.min(d, c)) | 0;
          },
          y: function(a, b, c, d, e, g, h) {
            e = -9007199254740992 > e || 9007199254740992 < e ? NaN : Number(e);
            try {
              var q = T(d);
              if (0 !== (b & 2) && 0 === (c & 2) && 2 !== (q.flags & 2097155))
                throw new N(2);
              if (1 === (q.flags & 2097155))
                throw new N(2);
              if (!q.Ma.sb)
                throw new N(43);
              if (!a)
                throw new N(28);
              var w = q.Ma.sb(q, a, e, b, c);
              var t = w.tc;
              E[g >> 2] = w.Ub;
              F[h >> 2] = t;
              return 0;
            } catch (x) {
              if ("undefined" == typeof X || "ErrnoError" !== x.name)
                throw x;
              return -x.Pa;
            }
          },
          z: function(a, b, c, d, e, g) {
            g = -9007199254740992 > g || 9007199254740992 < g ? NaN : Number(g);
            try {
              var h = T(e);
              if (c & 2) {
                if (32768 !== (h.node.mode & 61440))
                  throw new N(43);
                d & 2 || h.Ma.tb && h.Ma.tb(h, C.slice(a, a + b), g, b, d);
              }
            } catch (q) {
              if ("undefined" == typeof X || "ErrnoError" !== q.name)
                throw q;
              return -q.Pa;
            }
          },
          n: (a, b) => {
            Fc[a] && (clearTimeout(Fc[a].id), delete Fc[a]);
            if (!b)
              return 0;
            var c = setTimeout(() => {
              delete Fc[a];
              Ic(() => Sc(a, performance.now()));
            }, b);
            Fc[a] = { id: c, Hc: b };
            return 0;
          },
          B: (a, b, c, d) => {
            var e = new Date().getFullYear(), g = new Date(e, 0, 1).getTimezoneOffset();
            e = new Date(e, 6, 1).getTimezoneOffset();
            F[a >> 2] = 60 * Math.max(g, e);
            E[b >> 2] = Number(g != e);
            b = (h) => {
              var q = Math.abs(h);
              return `UTC${0 <= h ? "-" : "+"}${String(Math.floor(q / 60)).padStart(2, "0")}${String(q % 60).padStart(2, "0")}`;
            };
            a = b(g);
            b = b(e);
            e < g ? (M(a, C, c, 17), M(b, C, d, 17)) : (M(a, C, d, 17), M(b, C, c, 17));
          },
          d: () => Date.now(),
          s: () => 2147483648,
          c: () => performance.now(),
          o: (a) => {
            var b = C.length;
            a >>>= 0;
            if (2147483648 < a)
              return false;
            for (var c = 1; 4 >= c; c *= 2) {
              var d = b * (1 + 0.2 / c);
              d = Math.min(d, a + 100663296);
              a: {
                d = (Math.min(2147483648, 65536 * Math.ceil(Math.max(a, d) / 65536)) - Ia.buffer.byteLength + 65535) / 65536 | 0;
                try {
                  Ia.grow(d);
                  Ha();
                  var e = 1;
                  break a;
                } catch (g) {
                }
                e = void 0;
              }
              if (e)
                return true;
            }
            return false;
          },
          E: (a, b) => {
            var c = 0, d = 0, e;
            for (e of Lc()) {
              var g = b + c;
              F[a + d >> 2] = g;
              c += M(e, C, g, Infinity) + 1;
              d += 4;
            }
            return 0;
          },
          F: (a, b) => {
            var c = Lc();
            F[a >> 2] = c.length;
            a = 0;
            for (var d of c)
              a += gb(d) + 1;
            F[b >> 2] = a;
            return 0;
          },
          e: function(a) {
            try {
              var b = T(a);
              na(b);
              return 0;
            } catch (c) {
              if ("undefined" == typeof X || "ErrnoError" !== c.name)
                throw c;
              return c.Pa;
            }
          },
          p: function(a, b) {
            try {
              var c = T(a);
              m[b] = c.Va ? 2 : P(c.mode) ? 3 : 40960 === (c.mode & 61440) ? 7 : 4;
              Ea[b + 2 >> 1] = 0;
              G[b + 8 >> 3] = BigInt(0);
              G[b + 16 >> 3] = BigInt(0);
              return 0;
            } catch (d) {
              if ("undefined" == typeof X || "ErrnoError" !== d.name)
                throw d;
              return d.Pa;
            }
          },
          w: function(a, b, c, d) {
            try {
              a: {
                var e = T(a);
                a = b;
                for (var g, h = b = 0; h < c; h++) {
                  var q = F[a >> 2], w = F[a + 4 >> 2];
                  a += 8;
                  var t = Yb(e, m, q, w, g);
                  if (0 > t) {
                    var x = -1;
                    break a;
                  }
                  b += t;
                  if (t < w)
                    break;
                  "undefined" != typeof g && (g += t);
                }
                x = b;
              }
              F[d >> 2] = x;
              return 0;
            } catch (D) {
              if ("undefined" == typeof X || "ErrnoError" !== D.name)
                throw D;
              return D.Pa;
            }
          },
          D: function(a, b, c, d) {
            b = -9007199254740992 > b || 9007199254740992 < b ? NaN : Number(b);
            try {
              if (isNaN(b))
                return 61;
              var e = T(a);
              Xb(e, b, c);
              G[d >> 3] = BigInt(e.position);
              e.Eb && 0 === b && 0 === c && (e.Eb = null);
              return 0;
            } catch (g) {
              if ("undefined" == typeof X || "ErrnoError" !== g.name)
                throw g;
              return g.Pa;
            }
          },
          I: function(a) {
            var _a2, _b2;
            try {
              var b = T(a);
              return (_b2 = (_a2 = b.Ma) == null ? void 0 : _a2.lb) == null ? void 0 : _b2.call(_a2, b);
            } catch (c) {
              if ("undefined" == typeof X || "ErrnoError" !== c.name)
                throw c;
              return c.Pa;
            }
          },
          t: function(a, b, c, d) {
            try {
              a: {
                var e = T(a);
                a = b;
                for (var g, h = b = 0; h < c; h++) {
                  var q = F[a >> 2], w = F[a + 4 >> 2];
                  a += 8;
                  var t = ma(e, m, q, w, g);
                  if (0 > t) {
                    var x = -1;
                    break a;
                  }
                  b += t;
                  if (t < w)
                    break;
                  "undefined" != typeof g && (g += t);
                }
                x = b;
              }
              F[d >> 2] = x;
              return 0;
            } catch (D) {
              if ("undefined" == typeof X || "ErrnoError" !== D.name)
                throw D;
              return D.Pa;
            }
          },
          k: Hc
        };
        function Uc() {
          function a() {
            var _a2;
            k.calledRun = true;
            if (!Ca) {
              if (!k.noFSInit && !Db) {
                var b, c;
                Db = true;
                b != null ? b : b = k.stdin;
                c != null ? c : c = k.stdout;
                d != null ? d : d = k.stderr;
                b ? W("stdin", b) : Sb("/dev/tty", "/dev/stdin");
                c ? W("stdout", null, c) : Sb("/dev/tty", "/dev/stdout");
                d ? W("stderr", null, d) : Sb("/dev/tty1", "/dev/stderr");
                la("/dev/stdin", 0);
                la("/dev/stdout", 1);
                la("/dev/stderr", 1);
              }
              Vc.N();
              Eb = false;
              (_a2 = k.onRuntimeInitialized) == null ? void 0 : _a2.call(k);
              if (k.postRun)
                for ("function" == typeof k.postRun && (k.postRun = [k.postRun]); k.postRun.length; ) {
                  var d = k.postRun.shift();
                  Ra.push(d);
                }
              Qa(Ra);
            }
          }
          if (0 < J)
            Ua = Uc;
          else {
            if (k.preRun)
              for ("function" == typeof k.preRun && (k.preRun = [k.preRun]); k.preRun.length; )
                Ta();
            Qa(Sa);
            0 < J ? Ua = Uc : k.setStatus ? (k.setStatus("Running..."), setTimeout(() => {
              setTimeout(() => k.setStatus(""), 1);
              a();
            }, 1)) : a();
          }
        }
        var Vc;
        (async function() {
          var _a2;
          function a(c) {
            var _a3;
            c = Vc = c.exports;
            k._sqlite3_free = c.P;
            k._sqlite3_value_text = c.Q;
            k._sqlite3_prepare_v2 = c.R;
            k._sqlite3_step = c.S;
            k._sqlite3_reset = c.T;
            k._sqlite3_exec = c.U;
            k._sqlite3_finalize = c.V;
            k._sqlite3_column_name = c.W;
            k._sqlite3_column_text = c.X;
            k._sqlite3_column_type = c.Y;
            k._sqlite3_errmsg = c.Z;
            k._sqlite3_clear_bindings = c._;
            k._sqlite3_value_blob = c.$;
            k._sqlite3_value_bytes = c.aa;
            k._sqlite3_value_double = c.ba;
            k._sqlite3_value_int = c.ca;
            k._sqlite3_value_type = c.da;
            k._sqlite3_result_blob = c.ea;
            k._sqlite3_result_double = c.fa;
            k._sqlite3_result_error = c.ga;
            k._sqlite3_result_int = c.ha;
            k._sqlite3_result_int64 = c.ia;
            k._sqlite3_result_null = c.ja;
            k._sqlite3_result_text = c.ka;
            k._sqlite3_aggregate_context = c.la;
            k._sqlite3_column_count = c.ma;
            k._sqlite3_data_count = c.na;
            k._sqlite3_column_blob = c.oa;
            k._sqlite3_column_bytes = c.pa;
            k._sqlite3_column_double = c.qa;
            k._sqlite3_bind_blob = c.ra;
            k._sqlite3_bind_double = c.sa;
            k._sqlite3_bind_int = c.ta;
            k._sqlite3_bind_text = c.ua;
            k._sqlite3_bind_parameter_index = c.va;
            k._sqlite3_sql = c.wa;
            k._sqlite3_normalized_sql = c.xa;
            k._sqlite3_changes = c.ya;
            k._sqlite3_close_v2 = c.za;
            k._sqlite3_create_function_v2 = c.Aa;
            k._sqlite3_update_hook = c.Ba;
            k._sqlite3_open = c.Ca;
            ca = k._malloc = c.Da;
            da = k._free = c.Ea;
            k._RegisterExtensionFunctions = c.Fa;
            yb = c.Ga;
            Sc = c.Ha;
            qa = c.Ia;
            y = c.Ja;
            oa = c.Ka;
            Ia = c.M;
            Z = c.O;
            Ha();
            J--;
            (_a3 = k.monitorRunDependencies) == null ? void 0 : _a3.call(k, J);
            0 == J && Ua && (c = Ua, Ua = null, c());
            return Vc;
          }
          J++;
          (_a2 = k.monitorRunDependencies) == null ? void 0 : _a2.call(k, J);
          var b = { a: Tc };
          if (k.instantiateWasm)
            return new Promise((c) => {
              k.instantiateWasm(b, (d, e) => {
                c(a(d, e));
              });
            });
          La != null ? La : La = k.locateFile ? k.locateFile("sql-wasm-browser.wasm", xa) : xa + "sql-wasm-browser.wasm";
          return a((await Oa(b)).instance);
        })();
        Uc();
        return Module;
      });
      return initSqlJsPromise;
    };
    if (typeof exports === "object" && typeof module2 === "object") {
      module2.exports = initSqlJs;
      module2.exports.default = initSqlJs;
    } else if (typeof define === "function" && define["amd"]) {
      define([], function() {
        return initSqlJs;
      });
    } else if (typeof exports === "object") {
      exports["Module"] = initSqlJs;
    }
  }
});

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => TemperatureMarkerPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");

// database.ts
var fs = __toESM(require("fs"));
var path = __toESM(require("path"));
var MAIN_SCHEMA = `
  CREATE TABLE IF NOT EXISTS marks (
    file    TEXT    NOT NULL,
    line    INTEGER NOT NULL,
    color   TEXT    NOT NULL,
    PRIMARY KEY (file, line)
  );
  CREATE TABLE IF NOT EXISTS note_vocab (
    file    TEXT NOT NULL,
    term    TEXT NOT NULL,
    PRIMARY KEY (file, term)
  );
  CREATE INDEX IF NOT EXISTS idx_nv_file ON note_vocab(file);
  CREATE INDEX IF NOT EXISTS idx_nv_term ON note_vocab(term);
`;
var HISTORY_SCHEMA = `
  CREATE TABLE IF NOT EXISTS history (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    file      TEXT    NOT NULL,
    line      INTEGER NOT NULL,
    color     TEXT    NOT NULL,
    timestamp INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_h_file ON history(file);
  CREATE INDEX IF NOT EXISTS idx_h_ts   ON history(timestamp);
`;
var DatabaseManager = class {
  constructor() {
    this.historyDbs = /* @__PURE__ */ new Map();
    this.mainDirty = false;
    this.historyDirty = /* @__PURE__ */ new Set();
    this.flushTimer = null;
  }
  // ── 初始化 ──────────────────────────────────────────────────
  async init(app, pluginId) {
    const adapter = app.vault.adapter;
    const vaultPath = adapter.getBasePath();
    this.pluginDir = path.join(vaultPath, ".obsidian", "plugins", pluginId);
    const wasmBinary = fs.readFileSync(path.join(this.pluginDir, "sql-wasm.wasm"));
    const initSqlJs = require_sql_wasm_browser();
    this.SQL = await initSqlJs({ wasmBinary });
    this.mainDb = this._loadOrCreate("temp-main.db", MAIN_SCHEMA);
    const year = new Date().getFullYear();
    this._ensureHistoryDb(year);
    this.flushTimer = setInterval(() => this._flush(), 3e3);
  }
  // ── 内部工具 ────────────────────────────────────────────────
  _loadOrCreate(filename, schema) {
    const filePath = path.join(this.pluginDir, filename);
    let db;
    if (fs.existsSync(filePath)) {
      db = new this.SQL.Database(fs.readFileSync(filePath));
    } else {
      db = new this.SQL.Database();
    }
    db.run(schema);
    return db;
  }
  _ensureHistoryDb(year) {
    if (!this.historyDbs.has(year)) {
      this.historyDbs.set(year, this._loadOrCreate(`temp-history-${year}.db`, HISTORY_SCHEMA));
    }
    return this.historyDbs.get(year);
  }
  _flush() {
    if (this.mainDirty) {
      fs.writeFileSync(
        path.join(this.pluginDir, "temp-main.db"),
        Buffer.from(this.mainDb.export())
      );
      this.mainDirty = false;
    }
    for (const year of this.historyDirty) {
      const db = this.historyDbs.get(year);
      if (db) {
        fs.writeFileSync(
          path.join(this.pluginDir, `temp-history-${year}.db`),
          Buffer.from(db.export())
        );
      }
    }
    this.historyDirty.clear();
  }
  // ── 温度标记 ────────────────────────────────────────────────
  getFileMarks(file) {
    const result = /* @__PURE__ */ new Map();
    const stmt = this.mainDb.prepare("SELECT line, color FROM marks WHERE file = ?");
    stmt.bind([file]);
    while (stmt.step()) {
      const row = stmt.getAsObject();
      result.set(row.line, row.color);
    }
    stmt.free();
    return result;
  }
  setMark(file, line, color) {
    if (color === null) {
      this.mainDb.run("DELETE FROM marks WHERE file = ? AND line = ?", [file, line]);
    } else {
      this.mainDb.run(
        "INSERT OR REPLACE INTO marks (file, line, color) VALUES (?, ?, ?)",
        [file, line, color]
      );
    }
    this.mainDirty = true;
  }
  // ── 历史记录 ────────────────────────────────────────────────
  addHistory(file, line, color, timestamp) {
    const year = new Date(timestamp).getFullYear();
    const db = this._ensureHistoryDb(year);
    const ONE_MINUTE = 6e4;
    const stmt = db.prepare(
      "SELECT id, timestamp FROM history WHERE file=? AND line=? ORDER BY timestamp DESC LIMIT 1"
    );
    stmt.bind([file, line]);
    let existing = null;
    if (stmt.step()) {
      const row = stmt.getAsObject();
      existing = { id: row.id, ts: row.timestamp };
    }
    stmt.free();
    if (existing && timestamp - existing.ts < ONE_MINUTE) {
      db.run("UPDATE history SET color=?, timestamp=? WHERE id=?", [color, timestamp, existing.id]);
    } else {
      db.run(
        "INSERT INTO history (file, line, color, timestamp) VALUES (?, ?, ?, ?)",
        [file, line, color, timestamp]
      );
    }
    this.historyDirty.add(year);
  }
  getHistory(opts = {}) {
    const year = new Date().getFullYear();
    const db = this._ensureHistoryDb(year);
    let sql = "SELECT file, line, color, timestamp FROM history WHERE 1=1";
    const params = [];
    if (opts.since) {
      sql += " AND timestamp >= ?";
      params.push(opts.since);
    }
    if (opts.until) {
      sql += " AND timestamp < ?";
      params.push(opts.until);
    }
    if (opts.file) {
      sql += " AND file = ?";
      params.push(opts.file);
    }
    sql += " ORDER BY timestamp DESC";
    if (opts.limit) {
      sql += " LIMIT ?";
      params.push(opts.limit);
    }
    const results = [];
    const stmt = db.prepare(sql);
    stmt.bind(params);
    while (stmt.step()) {
      const row = stmt.getAsObject();
      results.push({
        file: row.file,
        line: row.line,
        color: row.color,
        timestamp: row.timestamp
      });
    }
    stmt.free();
    return results;
  }
  // 遍历所有年份 DB，返回最早的 timestamp（毫秒），无记录返回 null
  getEarliestTimestamp() {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = 2020; y <= currentYear; y++) {
      if (fs.existsSync(path.join(this.pluginDir, `temp-history-${y}.db`))) {
        years.push(y);
      }
    }
    let earliest = null;
    for (const year of years) {
      const db = this._ensureHistoryDb(year);
      const stmt = db.prepare("SELECT MIN(timestamp) AS t FROM history");
      stmt.step();
      const row = stmt.getAsObject();
      stmt.free();
      if (row.t != null) {
        const t = row.t;
        if (earliest === null || t < earliest)
          earliest = t;
      }
    }
    return earliest;
  }
  deleteHistoryEntry(file, line, timestamp) {
    const year = new Date(timestamp).getFullYear();
    const db = this._ensureHistoryDb(year);
    db.run("DELETE FROM history WHERE file=? AND line=? AND timestamp=?", [file, line, timestamp]);
    this.historyDirty.add(year);
  }
  // 获取每日标记数量（全部数据，用于热力图）
  getDailyStats() {
    const currentYear = new Date().getFullYear();
    const map = /* @__PURE__ */ new Map();
    for (let y = 2020; y <= currentYear; y++) {
      if (!fs.existsSync(path.join(this.pluginDir, `temp-history-${y}.db`)))
        continue;
      const db = this._ensureHistoryDb(y);
      const stmt = db.prepare(`
        SELECT
          date(timestamp / 1000, 'unixepoch', 'localtime') AS date,
          color,
          COUNT(*) AS cnt
        FROM history
        GROUP BY date, color
        ORDER BY date
      `);
      while (stmt.step()) {
        const row = stmt.getAsObject();
        const d = row.date;
        const col = row.color;
        const cnt = row.cnt;
        if (!map.has(d))
          map.set(d, { green: 0, orange: 0, red: 0 });
        map.get(d)[col] += cnt;
      }
      stmt.free();
    }
    return [...map.entries()].map(([date, v]) => ({ date, ...v }));
  }
  // 每日"当前状态"分布（用于热力图状态模式）
  // 对每天历史里出现过的 distinct (file, line) 对，查其现在的标记颜色，统计分布
  getDailyCurrentStats() {
    const currentYear = new Date().getFullYear();
    const dayMap = /* @__PURE__ */ new Map();
    for (let y = 2020; y <= currentYear; y++) {
      if (!fs.existsSync(path.join(this.pluginDir, `temp-history-${y}.db`)))
        continue;
      const db = this._ensureHistoryDb(y);
      const stmt = db.prepare(`
        SELECT DISTINCT
          date(timestamp / 1000, 'unixepoch', 'localtime') AS date,
          file, line
        FROM history
      `);
      while (stmt.step()) {
        const row = stmt.getAsObject();
        const d = row.date;
        const key = `${row.file}\0${row.line}`;
        if (!dayMap.has(d))
          dayMap.set(d, /* @__PURE__ */ new Set());
        dayMap.get(d).add(key);
      }
      stmt.free();
    }
    const markMap = /* @__PURE__ */ new Map();
    const stmt2 = this.mainDb.prepare("SELECT file, line, color FROM marks");
    while (stmt2.step()) {
      const row = stmt2.getAsObject();
      markMap.set(`${row.file}\0${row.line}`, row.color);
    }
    stmt2.free();
    return [...dayMap.entries()].map(([date, keys]) => {
      const counts = { green: 0, orange: 0, red: 0 };
      for (const key of keys) {
        const cur = markMap.get(key);
        if (cur === "green" || cur === "orange" || cur === "red")
          counts[cur]++;
      }
      return { date, ...counts };
    }).sort((a, b) => a.date.localeCompare(b.date));
  }
  // 返回所有当前标记，供历史面板做"状态变化"比对
  getAllCurrentMarks() {
    const result = /* @__PURE__ */ new Map();
    const stmt = this.mainDb.prepare("SELECT file, line, color FROM marks");
    while (stmt.step()) {
      const row = stmt.getAsObject();
      result.set(`${row.file}\0${row.line}`, row.color);
    }
    stmt.free();
    return result;
  }
  // ── 词条关联 ────────────────────────────────────────────────
  getNoteVocab(file) {
    const stmt = this.mainDb.prepare("SELECT term FROM note_vocab WHERE file = ? ORDER BY term");
    stmt.bind([file]);
    const terms = [];
    while (stmt.step())
      terms.push(stmt.getAsObject().term);
    stmt.free();
    return terms;
  }
  addNoteVocab(file, term) {
    this.mainDb.run("INSERT OR IGNORE INTO note_vocab (file, term) VALUES (?, ?)", [file, term]);
    this.mainDirty = true;
  }
  removeNoteVocab(file, term) {
    this.mainDb.run("DELETE FROM note_vocab WHERE file=? AND term=?", [file, term]);
    this.mainDirty = true;
  }
  getAllFilesForTerm(term) {
    const stmt = this.mainDb.prepare("SELECT file FROM note_vocab WHERE term = ?");
    stmt.bind([term]);
    const files = [];
    while (stmt.step())
      files.push(stmt.getAsObject().file);
    stmt.free();
    return files;
  }
  // ── 生命周期 ────────────────────────────────────────────────
  flushAndClose() {
    if (this.flushTimer)
      clearInterval(this.flushTimer);
    this._flush();
    this.mainDb.close();
    for (const db of this.historyDbs.values())
      db.close();
  }
};

// main.ts
var import_view = require("@codemirror/view");
var import_state = require("@codemirror/state");
var VIEW_TYPE_HISTORY = "temperature-history";
var VIEW_TYPE_VOCAB = "vocab-queue";
var VIEW_TYPE_HISTORY_FULL = "temperature-history-full";
var VocabLinkIndex = class {
  constructor() {
    this.termToPath = /* @__PURE__ */ new Map();
    this._regex = null;
  }
  rebuild(app) {
    this.termToPath.clear();
    for (const file of app.vault.getFiles()) {
      if (file.path.match(/^_词汇表\/.+\/.+\.md$/)) {
        this.termToPath.set(file.basename, file.path);
      }
    }
    this._buildRegex();
  }
  addTerm(basename, path2) {
    if (!path2.match(/^_词汇表\/.+\/.+\.md$/))
      return;
    this.termToPath.set(basename, path2);
    this._buildRegex();
  }
  removeTerm(basename) {
    this.termToPath.delete(basename);
    this._buildRegex();
  }
  getRegex() {
    if (!this._regex)
      return null;
    this._regex.lastIndex = 0;
    return this._regex;
  }
  _buildRegex() {
    if (this.termToPath.size === 0) {
      this._regex = null;
      return;
    }
    const terms = [...this.termToPath.keys()].sort((a, b) => b.length - a.length);
    const patterns = terms.map((t) => {
      const esc = t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const left = /^\w/.test(t) ? "\\b" : "";
      const right = /\w$/.test(t) ? "\\b" : "";
      return `${left}${esc}${right}`;
    });
    this._regex = new RegExp(`(${patterns.join("|")})`, "g");
  }
};
var vocabLinkIndex = new VocabLinkIndex();
var setNoteVocabTerms = import_state.StateEffect.define();
var noteVocabField = import_state.StateField.define({
  create() {
    return /* @__PURE__ */ new Map();
  },
  update(prev, tr) {
    for (const e of tr.effects) {
      if (e.is(setNoteVocabTerms))
        return new Map(e.value);
    }
    return prev;
  }
});
var drag = {
  active: false,
  color: null
};
document.addEventListener("mouseup", () => {
  if (drag.active) {
    drag.active = false;
    drag.color = null;
    document.body.classList.remove("temp-dragging");
  }
});
var setLineTemp = import_state.StateEffect.define();
var restoreTemps = import_state.StateEffect.define();
var tempField = import_state.StateField.define({
  create() {
    return /* @__PURE__ */ new Map();
  },
  update(prev, tr) {
    const hasSet = tr.effects.some((e) => e.is(setLineTemp));
    const hasRestore = tr.effects.some((e) => e.is(restoreTemps));
    if (!hasSet && !hasRestore)
      return prev;
    if (hasRestore) {
      for (const e of tr.effects) {
        if (e.is(restoreTemps))
          return new Map(e.value);
      }
    }
    const next = new Map(prev);
    for (const e of tr.effects) {
      if (e.is(setLineTemp)) {
        const { line, temp } = e.value;
        temp === null ? next.delete(line) : next.set(line, temp);
      }
    }
    return next;
  }
});
var DotsWidget = class extends import_view.WidgetType {
  constructor(lineNumber, current, view) {
    super();
    this.lineNumber = lineNumber;
    this.current = current;
    this.view = view;
  }
  eq(other) {
    return other.lineNumber === this.lineNumber && other.current === this.current;
  }
  toDOM() {
    const wrap = document.createElement("span");
    wrap.className = "temp-dots-container";
    wrap.addEventListener("mouseenter", () => {
      if (!drag.active)
        return;
      if (drag.color === this.current)
        return;
      this.view.dispatch({
        effects: setLineTemp.of({ line: this.lineNumber, temp: drag.color })
      });
    });
    const colors = ["green", "orange", "red"];
    for (const color of colors) {
      const dot = document.createElement("span");
      dot.className = `temp-dot temp-dot-${color}`;
      if (this.current === color)
        dot.classList.add("temp-dot-active");
      dot.addEventListener("mousedown", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const next = this.current === color ? null : color;
        drag.active = true;
        drag.color = next;
        document.body.classList.add("temp-dragging");
        this.view.dispatch({
          effects: setLineTemp.of({ line: this.lineNumber, temp: next })
        });
      });
      wrap.appendChild(dot);
    }
    return wrap;
  }
  ignoreEvent() {
    return false;
  }
};
var tempLineBgField = import_state.StateField.define({
  create() {
    return import_view.Decoration.none;
  },
  update(decs, tr) {
    const hasTemps = tr.effects.some((e) => e.is(restoreTemps) || e.is(setLineTemp));
    if (!hasTemps)
      return decs.map(tr.changes);
    const temps = tr.state.field(tempField);
    const all = [];
    for (const [lineNum, color] of temps) {
      if (lineNum < 1 || lineNum > tr.state.doc.lines)
        continue;
      const line = tr.state.doc.line(lineNum);
      all.push(import_view.Decoration.line({ class: `temp-bg-${color}` }).range(line.from));
    }
    all.sort((a, b) => a.from - b.from);
    return all.length ? import_view.Decoration.set(all) : import_view.Decoration.none;
  },
  provide: (f) => import_view.EditorView.decorations.from(f)
});
function buildDecorations(view) {
  var _a;
  const temps = view.state.field(tempField);
  const all = [];
  for (const { from, to } of view.visibleRanges) {
    let pos = from;
    while (pos <= to) {
      const line = view.state.doc.lineAt(pos);
      const temp = (_a = temps.get(line.number)) != null ? _a : null;
      all.push(
        import_view.Decoration.widget({ widget: new DotsWidget(line.number, temp, view), side: 1 }).range(line.to)
      );
      pos = line.to + 1;
    }
  }
  return all.length ? import_view.Decoration.set(all) : import_view.Decoration.none;
}
function buildVocabDecorations(view) {
  const termMap = view.state.field(noteVocabField);
  if (termMap.size === 0)
    return import_view.Decoration.none;
  const terms = [...termMap.keys()].sort((a, b) => b.length - a.length);
  const patterns = terms.map((t) => {
    const esc = t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const left = /^\w/.test(t) ? "\\b" : "";
    const right = /\w$/.test(t) ? "\\b" : "";
    return `${left}${esc}${right}`;
  });
  const regex = new RegExp(`(${patterns.join("|")})`, "g");
  const marks = [];
  for (const { from, to } of view.visibleRanges) {
    const text = view.state.doc.sliceString(from, to);
    regex.lastIndex = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
      const term = match[1];
      const start = from + match.index;
      const end = start + term.length;
      marks.push(
        import_view.Decoration.mark({
          class: "vocab-link",
          attributes: { "data-vocab-term": term }
        }).range(start, end)
      );
    }
  }
  marks.sort((a, b) => a.from - b.from);
  const deduped = [];
  let lastEnd = -1;
  for (const m of marks) {
    if (m.from >= lastEnd) {
      deduped.push(m);
      lastEnd = m.to;
    }
  }
  return import_view.Decoration.set(deduped, true);
}
var TemperatureMarkerPlugin = class extends import_obsidian.Plugin {
  constructor() {
    super(...arguments);
    this.saveTimer = null;
    // 保留供 scheduleSave 兼容调用
    // 词条收集模式
    this.highlightMode = false;
    this.vocabQueue = [];
    this.statusBarEl = null;
    // Obsidian hover preview 需要 hoverParent 有此属性
    this.hoverPopover = null;
    // 词条悬浮预览 tooltip
    this._tooltipEl = null;
    this._tooltipHideTimer = null;
  }
  async onload() {
    this.sqlDb = new DatabaseManager();
    await this.sqlDb.init(this.app, this.manifest.id);
    vocabLinkIndex.rebuild(this.app);
    this.registerEvent(
      this.app.vault.on("create", (file) => {
        if (file instanceof import_obsidian.TFile && file.path.match(/^_词汇表\/.+\/.+\.md$/)) {
          vocabLinkIndex.addTerm(file.basename, file.path);
          const active = this.app.workspace.getActiveFile();
          if (active)
            this._dispatchNoteVocabTerms(active.path);
        }
      })
    );
    this.registerEvent(
      this.app.vault.on("delete", (file) => {
        if (file instanceof import_obsidian.TFile && file.path.match(/^_词汇表\/.+\/.+\.md$/)) {
          vocabLinkIndex.removeTerm(file.basename);
          const active = this.app.workspace.getActiveFile();
          if (active)
            this._dispatchNoteVocabTerms(active.path);
        }
      })
    );
    this.registerView(VIEW_TYPE_HISTORY_FULL, (leaf) => new FullHistoryView(leaf, this));
    this.registerView(VIEW_TYPE_HISTORY, (leaf) => new TempHistoryView(leaf, this));
    this.registerView(VIEW_TYPE_VOCAB, (leaf) => new VocabQueueView(leaf, this));
    this.addRibbonIcon("list-checks", "\u5B66\u4E60\u6E29\u5EA6\u8BB0\u5F55", () => this.activateFullHistoryView());
    this.addRibbonIcon("book-plus", "\u8BCD\u6761\u6536\u96C6\u6A21\u5F0F", () => this.toggleHighlightMode());
    this.registerDomEvent(document, "keydown", (e) => {
      if (!this.highlightMode)
        return;
      if (e.key !== "q" && e.key !== "Q")
        return;
      if (!e.ctrlKey || e.metaKey || e.altKey)
        return;
      const activeView = this.app.workspace.getActiveViewOfType(import_obsidian.MarkdownView);
      if (!activeView)
        return;
      const selection = activeView.editor.getSelection().trim();
      if (!selection)
        return;
      e.preventDefault();
      this.addToVocabQueue(selection, activeView.editor);
    });
    this.statusBarEl = this.addStatusBarItem();
    this.statusBarEl.style.display = "none";
    this.registerEditorExtension([tempField, tempLineBgField, noteVocabField, this.buildViewPlugin(), this.buildVocabViewPlugin()]);
    this.registerEvent(
      this.app.workspace.on("editor-menu", (menu, editor) => {
        if (!this.highlightMode)
          return;
        const selection = editor.getSelection().trim();
        if (!selection)
          return;
        menu.addItem((item) => {
          item.setTitle(`\u52A0\u5165\u8BCD\u6761\u6E05\u5355\uFF1A${selection}`).setIcon("book-plus").onClick(() => this.addToVocabQueue(selection, editor));
        });
      })
    );
    this.registerEvent(
      this.app.workspace.on("file-open", (file) => {
        if (!file)
          return;
        setTimeout(() => {
          this.restoreMarks(file.path);
          this._dispatchNoteVocabTerms(file.path);
          this.refreshVocabPanel();
        }, 100);
      })
    );
    this.app.workspace.onLayoutReady(() => {
      const file = this.app.workspace.getActiveFile();
      if (file)
        requestAnimationFrame(() => {
          this.restoreMarks(file.path);
          this._dispatchNoteVocabTerms(file.path);
        });
    });
    console.log("Temperature Marker: \u5DF2\u52A0\u8F7D");
  }
  async onunload() {
    var _a;
    (_a = this.sqlDb) == null ? void 0 : _a.flushAndClose();
    console.log("Temperature Marker: \u5DF2\u5378\u8F7D");
  }
  // ── 恢复某文件的标记到编辑器 ──
  restoreMarks(filePath, attempt = 0) {
    const view = this.getEditorView(filePath);
    if (!view) {
      if (attempt < 5)
        setTimeout(() => this.restoreMarks(filePath, attempt + 1), 200);
      else
        console.warn("[TempMarker] restoreMarks: \u627E\u4E0D\u5230 EditorView", filePath);
      return;
    }
    const map = this.sqlDb.getFileMarks(filePath);
    view.dispatch({ effects: restoreTemps.of(map) });
    if (attempt === 0)
      setTimeout(() => this.restoreMarks(filePath, 1), 300);
  }
  // ── 获取当前活跃的 CM6 EditorView ──
  getEditorView(filePath) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i;
    const leaves = this.app.workspace.getLeavesOfType("markdown");
    const target = filePath ? leaves.find((l) => {
      var _a2;
      return ((_a2 = l.view.file) == null ? void 0 : _a2.path) === filePath;
    }) : (_a = leaves.find((l) => {
      var _a2, _b2;
      return ((_a2 = l.view.file) == null ? void 0 : _a2.path) === ((_b2 = this.app.workspace.getActiveFile()) == null ? void 0 : _b2.path);
    })) != null ? _a : leaves[0];
    if (!target)
      return null;
    const v = target.view;
    return (_i = (_h = (_e = (_b = v == null ? void 0 : v.editor) == null ? void 0 : _b.cm) != null ? _e : (_d = (_c = v == null ? void 0 : v.editMode) == null ? void 0 : _c.editor) == null ? void 0 : _d.cm) != null ? _h : (_g = (_f = v == null ? void 0 : v.sourceMode) == null ? void 0 : _f.cmEditor) == null ? void 0 : _g.cm) != null ? _i : null;
  }
  // ── 保存一次标记变更 ──
  saveMark(filePath, line, temp) {
    this.sqlDb.setMark(filePath, line, temp);
    if (temp !== null)
      this.sqlDb.addHistory(filePath, line, temp, Date.now());
    this.refreshHistoryPanel();
  }
  // ── 删除历史条目并清除对应标记 ──
  deleteHistoryEntry(file, line, timestamp) {
    this.sqlDb.deleteHistoryEntry(file, line, timestamp);
    this.sqlDb.setMark(file, line, null);
    this.restoreMarks(file);
    this.refreshHistoryPanel();
  }
  // ── 切换词条收集模式 ──
  toggleHighlightMode() {
    if (this.highlightMode) {
      if (this.vocabQueue.length > 0) {
        this.copyVocabPrompt();
      } else {
        new import_obsidian.Notice("\u8BCD\u6761\u6E05\u5355\u4E3A\u7A7A\uFF0C\u5DF2\u9000\u51FA\u6536\u96C6\u6A21\u5F0F");
      }
      this.exitHighlightMode();
    } else {
      this.highlightMode = true;
      document.body.classList.add("vocab-highlight-mode");
      this.updateStatusBar();
      this.activateVocabView();
      new import_obsidian.Notice("\u5DF2\u8FDB\u5165\u8BCD\u6761\u6536\u96C6\u6A21\u5F0F\uFF0C\u9009\u4E2D\u6587\u5B57\u540E\u6309 Ctrl+Q \u6216\u53F3\u952E\u52A0\u5165\u6E05\u5355");
    }
  }
  exitHighlightMode() {
    this.highlightMode = false;
    this.vocabQueue = [];
    document.body.classList.remove("vocab-highlight-mode");
    if (this.statusBarEl)
      this.statusBarEl.style.display = "none";
    this.refreshVocabPanel();
  }
  // ── 将选中词语加入队列 ──
  addToVocabQueue(word, editor) {
    var _a;
    const cursor = editor.getCursor();
    const lineContent = editor.getLine(cursor.line);
    const file = this.app.workspace.getActiveFile();
    if (this.vocabQueue.some((v) => v.word === word)) {
      new import_obsidian.Notice(`\u300C${word}\u300D\u5DF2\u5728\u6E05\u5355\u4E2D`);
      return;
    }
    this.vocabQueue.push({
      word,
      file: (_a = file == null ? void 0 : file.path) != null ? _a : "\u672A\u77E5\u6587\u4EF6",
      line: cursor.line + 1,
      context: lineContent.trim()
    });
    this.updateStatusBar();
    this.refreshVocabPanel();
    new import_obsidian.Notice(`\u5DF2\u52A0\u5165\uFF1A${word}\uFF08\u5171 ${this.vocabQueue.length} \u4E2A\uFF09`);
  }
  // ── 更新状态栏显示 ──
  updateStatusBar() {
    if (!this.statusBarEl)
      return;
    this.statusBarEl.style.display = "";
    this.statusBarEl.empty();
    const text = this.statusBarEl.createEl("span", {
      text: `\u8BCD\u6761\u6536\u96C6\uFF1A${this.vocabQueue.length} \u4E2A`,
      cls: "vocab-status-text"
    });
    const btn = this.statusBarEl.createEl("span", {
      text: "  \u7ED3\u675F\u5E76\u590D\u5236",
      cls: "vocab-status-btn"
    });
    btn.addEventListener("click", () => this.toggleHighlightMode());
  }
  // ── 生成 prompt 并复制到剪贴板，同时把词条写入 SQLite ──
  copyVocabPrompt() {
    for (const item of this.vocabQueue) {
      this.sqlDb.addNoteVocab(item.file, item.word);
    }
    const items = this.vocabQueue.map(
      (v, i) => `\u3010${i + 1}\u3011${v.word}
\u6765\u6E90\uFF1A${v.file} \u7B2C ${v.line} \u884C
\u4E0A\u4E0B\u6587\uFF1A${v.context}`
    ).join("\n\n");
    const prompt = `\u8BF7\u6839\u636E\u4EE5\u4E0B\u751F\u8BCD\u6E05\u5355\uFF0C\u5728\u7B14\u8BB0\u4ED3\u5E93\u7684 \`_\u8BCD\u6C47\u8868/\` \u76EE\u5F55\u4E0B\u4E3A\u6BCF\u4E2A\u8BCD\u6761\u521B\u5EFA\u7B14\u8BB0\u3002

\u8981\u6C42\uFF1A
1. \u81EA\u884C\u5224\u65AD\u5408\u9002\u7684\u5206\u7C7B\uFF08TypeScript\u6982\u5FF5 / Node.js\u6982\u5FF5 / React\u4E0EInk\u6982\u5FF5 / \u67B6\u6784\u6A21\u5F0F / AI\u4E0ELLM\u6982\u5FF5 / Claude\u4E13\u6709\u6982\u5FF5 / \u6216\u4F60\u8BA4\u4E3A\u66F4\u5408\u9002\u7684\u65B0\u5206\u7C7B\uFF09
2. \u521B\u5EFA\u8DEF\u5F84\uFF1A\`_\u8BCD\u6C47\u8868/{\u5206\u7C7B}/{\u8BCD\u6761\u540D}.md\`
3. \u6BCF\u7BC7\u7B14\u8BB0\u586B\u5199\uFF1A\u4E00\u53E5\u8BDD\u5B9A\u4E49\u3001\u5728 Claude Code \u91CC\u7684\u4F53\u73B0\u3001\u5EF6\u4F38\u7406\u89E3\u3001\u76F8\u5173\u8BCD\u6761

\u751F\u8BCD\u6E05\u5355\uFF1A

${items}`;
    navigator.clipboard.writeText(prompt).then(() => {
      new import_obsidian.Notice(`\u5DF2\u590D\u5236 ${this.vocabQueue.length} \u4E2A\u8BCD\u6761\u7684 prompt\uFF0C\u7C98\u8D34\u7ED9 Claude Code \u5373\u53EF`);
    }).catch(() => {
      new import_obsidian.Notice("\u590D\u5236\u5931\u8D25\uFF0C\u8BF7\u624B\u52A8\u590D\u5236\u63A7\u5236\u53F0\u8F93\u51FA");
      console.log(prompt);
    });
  }
  // ── scheduleSave：SQLite 版本直接由 DatabaseManager 定时 flush，此方法仅供面板调用 ──
  scheduleSave() {
  }
  // ── 打开全页历史视图 ──
  async activateFullHistoryView() {
    const existing = this.app.workspace.getLeavesOfType(VIEW_TYPE_HISTORY_FULL);
    if (existing.length > 0) {
      this.app.workspace.revealLeaf(existing[0]);
      return;
    }
    const leaf = this.app.workspace.getLeaf("tab");
    await leaf.setViewState({ type: VIEW_TYPE_HISTORY_FULL, active: true });
    this.app.workspace.revealLeaf(leaf);
  }
  // ── 打开词条收集面板 ──
  async activateVocabView() {
    const existing = this.app.workspace.getLeavesOfType(VIEW_TYPE_VOCAB);
    if (existing.length > 0) {
      this.app.workspace.revealLeaf(existing[0]);
      return;
    }
    const leaf = this.app.workspace.getRightLeaf(false);
    if (leaf) {
      await leaf.setViewState({ type: VIEW_TYPE_VOCAB, active: true });
      this.app.workspace.revealLeaf(leaf);
    }
  }
  // ── 刷新词条面板 ──
  refreshVocabPanel() {
    this.app.workspace.getLeavesOfType(VIEW_TYPE_VOCAB).forEach((leaf) => {
      leaf.view.render();
    });
  }
  // ── 打开历史面板 ──
  async activateHistoryView() {
    const existing = this.app.workspace.getLeavesOfType(VIEW_TYPE_HISTORY);
    if (existing.length > 0) {
      this.app.workspace.revealLeaf(existing[0]);
      return;
    }
    const leaf = this.app.workspace.getRightLeaf(false);
    if (leaf) {
      await leaf.setViewState({ type: VIEW_TYPE_HISTORY, active: true });
      this.app.workspace.revealLeaf(leaf);
    }
  }
  // ── 刷新历史面板（如果已打开）──
  refreshHistoryPanel() {
    this.app.workspace.getLeavesOfType(VIEW_TYPE_HISTORY).forEach((leaf) => {
      leaf.view.render();
    });
    this.app.workspace.getLeavesOfType(VIEW_TYPE_HISTORY_FULL).forEach((leaf) => {
      leaf.view.render();
    });
  }
  // ── 创建 ViewPlugin（闭包捕获 this.saveMark）──
  buildViewPlugin() {
    const plugin = this;
    return import_view.ViewPlugin.fromClass(
      class {
        constructor(view) {
          this.decorations = buildDecorations(view);
        }
        update(update) {
          const tempChanged = update.state.field(tempField) !== update.startState.field(tempField);
          for (const tr of update.transactions) {
            const isRestore = tr.effects.some((e) => e.is(restoreTemps));
            if (isRestore)
              continue;
            const file = plugin.app.workspace.getActiveFile();
            if (!file)
              continue;
            for (const e of tr.effects) {
              if (e.is(setLineTemp)) {
                plugin.saveMark(file.path, e.value.line, e.value.temp);
              }
            }
          }
          if (update.docChanged || update.viewportChanged || tempChanged) {
            this.decorations = buildDecorations(update.view);
          }
        }
      },
      { decorations: (v) => v.decorations }
    );
  }
  // ── 词条链接 ViewPlugin（下划线 + hover 预览 + 点击跳转）──
  buildVocabViewPlugin() {
    const plugin = this;
    return import_view.ViewPlugin.fromClass(
      class {
        constructor(view) {
          this.decorations = buildVocabDecorations(view);
        }
        update(update) {
          const needsRebuild = update.docChanged || update.viewportChanged || update.transactions.some((t) => t.effects.some((e) => e.is(setNoteVocabTerms)));
          if (needsRebuild) {
            this.decorations = buildVocabDecorations(update.view);
          }
        }
      },
      {
        decorations: (v) => v.decorations,
        eventHandlers: {
          // 悬停：触发 Obsidian 原生 hover 预览
          // 悬停：显示自定义 Markdown 预览 tooltip
          mouseover(event) {
            const target = event.target;
            const el = target.classList.contains("vocab-link") ? target : target.closest(".vocab-link");
            if (!el)
              return;
            const term = el.getAttribute("data-vocab-term");
            if (!term)
              return;
            plugin.showVocabTooltip(el, term);
          },
          mouseout(event) {
            const target = event.target;
            if (target.classList.contains("vocab-link") || target.closest(".vocab-link")) {
              plugin["_scheduleHideTooltip"]();
            }
          },
          // 点击：跳转到词条笔记
          click(event) {
            const target = event.target;
            const el = target.classList.contains("vocab-link") ? target : target.closest(".vocab-link");
            if (!el)
              return;
            const term = el.getAttribute("data-vocab-term");
            if (!term)
              return;
            const filePath = vocabLinkIndex.termToPath.get(term);
            if (!filePath)
              return;
            const file = plugin.app.vault.getAbstractFileByPath(filePath);
            if (!(file instanceof import_obsidian.TFile))
              return;
            plugin.app.workspace.getLeaf(false).openFile(file);
          }
        }
      }
    );
  }
  // ── 显示词条悬浮预览 ──
  async showVocabTooltip(anchor, term) {
    if (this._tooltipHideTimer) {
      clearTimeout(this._tooltipHideTimer);
      this._tooltipHideTimer = null;
    }
    this.hideVocabTooltip();
    const filePath = vocabLinkIndex.termToPath.get(term);
    if (!filePath)
      return;
    const file = this.app.vault.getAbstractFileByPath(filePath);
    if (!(file instanceof import_obsidian.TFile))
      return;
    const content = await this.app.vault.read(file);
    const preview = content.split("\n").slice(0, 20).join("\n");
    const rect = anchor.getBoundingClientRect();
    const tooltip = document.createElement("div");
    tooltip.className = "vocab-tooltip";
    tooltip.style.left = `${Math.min(rect.left, window.innerWidth - 320)}px`;
    tooltip.style.top = `${rect.bottom + 6}px`;
    const comp = new import_obsidian.Component();
    comp.load();
    await import_obsidian.MarkdownRenderer.render(this.app, preview, tooltip, filePath, comp);
    document.body.appendChild(tooltip);
    this._tooltipEl = tooltip;
    tooltip.addEventListener("mouseenter", () => {
      if (this._tooltipHideTimer)
        clearTimeout(this._tooltipHideTimer);
    });
    tooltip.addEventListener("mouseleave", () => this._scheduleHideTooltip());
  }
  hideVocabTooltip() {
    if (this._tooltipEl) {
      this._tooltipEl.remove();
      this._tooltipEl = null;
    }
  }
  _scheduleHideTooltip() {
    this._tooltipHideTimer = setTimeout(() => this.hideVocabTooltip(), 150);
  }
  // ── 把某笔记的词条列表发到编辑器 state，触发重新装饰 ──
  _dispatchNoteVocabTerms(filePath) {
    const view = this.getEditorView(filePath);
    if (!view)
      return;
    const terms = this.sqlDb.getNoteVocab(filePath);
    const termMap = /* @__PURE__ */ new Map();
    for (const term of terms) {
      const p = vocabLinkIndex.termToPath.get(term);
      if (p)
        termMap.set(term, p);
    }
    view.dispatch({ effects: setNoteVocabTerms.of(termMap) });
  }
};
function localDateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dy = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dy}`;
}
function parseDateStr(s) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
var HoverPreview = class {
  constructor(app) {
    this.hideTimer = null;
    this.app = app;
    this.el = document.createElement("div");
    this.el.className = "temp-hover-preview";
    document.body.appendChild(this.el);
    this.el.addEventListener("mouseenter", () => this._cancelHide());
    this.el.addEventListener("mouseleave", () => this.hide());
  }
  async show(mouseX, mouseY, filePath, line) {
    var _a, _b;
    this._cancelHide();
    const tfile = this.app.vault.getAbstractFileByPath(filePath);
    if (!(tfile instanceof import_obsidian.TFile))
      return;
    let lines;
    try {
      lines = (await this.app.vault.cachedRead(tfile)).split("\n");
    } catch (e) {
      return;
    }
    const CONTEXT = 4;
    const startIdx = Math.max(0, line - 1 - CONTEXT);
    const endIdx = Math.min(lines.length - 1, line - 1 + CONTEXT);
    this.el.innerHTML = "";
    const title = document.createElement("div");
    title.className = "thp-title";
    title.textContent = `${(_a = filePath.split("/").pop()) == null ? void 0 : _a.replace(/\.md$/, "")}  \xB7  \u7B2C ${line} \u884C`;
    this.el.appendChild(title);
    const body = document.createElement("div");
    body.className = "thp-lines";
    for (let i = startIdx; i <= endIdx; i++) {
      const row = document.createElement("div");
      row.className = i === line - 1 ? "thp-line thp-line-target" : "thp-line";
      const num = document.createElement("span");
      num.className = "thp-linenum";
      num.textContent = String(i + 1);
      const txt = document.createElement("span");
      txt.className = "thp-linetext";
      txt.textContent = (_b = lines[i]) != null ? _b : "";
      row.appendChild(num);
      row.appendChild(txt);
      body.appendChild(row);
    }
    this.el.appendChild(body);
    this.el.style.display = "block";
    this.el.style.visibility = "hidden";
    const pw = this.el.offsetWidth || 520;
    const ph = this.el.offsetHeight || 160;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const GAP = 16;
    let left = mouseX + GAP;
    if (left + pw > vw - 8)
      left = mouseX - pw - GAP;
    if (left < 8)
      left = 8;
    let top = mouseY - Math.floor(ph / 2);
    if (top + ph > vh - 8)
      top = vh - ph - 8;
    if (top < 8)
      top = 8;
    this.el.style.left = `${left}px`;
    this.el.style.top = `${top}px`;
    this.el.style.visibility = "visible";
  }
  hide(delay = 180) {
    this._cancelHide();
    this.hideTimer = setTimeout(() => {
      this.el.style.display = "none";
    }, delay);
  }
  _cancelHide() {
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
  }
  destroy() {
    this.el.remove();
  }
};
var TempHistoryView = class extends import_obsidian.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
  }
  getViewType() {
    return VIEW_TYPE_HISTORY;
  }
  getDisplayText() {
    return "\u5B66\u4E60\u6E29\u5EA6\u8BB0\u5F55";
  }
  getIcon() {
    return "list-checks";
  }
  async onOpen() {
    this.preview = new HoverPreview(this.app);
    this.render();
  }
  async onClose() {
    var _a;
    (_a = this.preview) == null ? void 0 : _a.destroy();
  }
  render() {
    this._doRender();
  }
  async _doRender() {
    var _a, _b, _c, _d;
    const root = this.containerEl.children[1];
    root.empty();
    root.addClass("temp-panel");
    root.createEl("div", { text: "\u5B66\u4E60\u6E29\u5EA6\u8BB0\u5F55", cls: "temp-panel-title" });
    const history = this.plugin.sqlDb.getHistory({ limit: 200 });
    if (history.length === 0) {
      root.createEl("div", { text: "\u6682\u65E0\u8BB0\u5F55", cls: "temp-panel-empty" });
      return;
    }
    const allCurrentMarks = this.plugin.sqlDb.getAllCurrentMarks();
    const fileGroups = /* @__PURE__ */ new Map();
    for (const entry of history) {
      if (!fileGroups.has(entry.file)) {
        fileGroups.set(entry.file, { entries: [], maxTs: 0 });
      }
      const g = fileGroups.get(entry.file);
      g.entries.push(entry);
      if (entry.timestamp > g.maxTs)
        g.maxTs = entry.timestamp;
    }
    const sorted = [...fileGroups.entries()].sort((a, b) => b[1].maxTs - a[1].maxTs);
    for (const [filePath, { entries }] of sorted) {
      const tfile = this.app.vault.getAbstractFileByPath(filePath);
      let lines = [];
      if (tfile instanceof import_obsidian.TFile) {
        try {
          lines = (await this.app.vault.cachedRead(tfile)).split("\n");
        } catch (e) {
        }
      }
      const shortName = (_b = (_a = filePath.split("/").pop()) == null ? void 0 : _a.replace(/\.md$/, "")) != null ? _b : filePath;
      const details = root.createEl("details", { cls: "temp-file-section" });
      details.setAttribute("open", "");
      const summary = details.createEl("summary", { cls: "temp-file-summary" });
      summary.createEl("span", { text: shortName, cls: "temp-file-name" });
      const counts = { green: 0, orange: 0, red: 0 };
      entries.forEach((e) => counts[e.color]++);
      const statsEl = summary.createEl("span", { cls: "temp-panel-stats" });
      ["red", "orange", "green"].forEach((color) => {
        if (!counts[color])
          return;
        const chip = statsEl.createEl("span", { cls: "temp-stat-chip" });
        chip.createEl("span", { cls: `temp-panel-dot temp-dot-${color}` });
        chip.createEl("span", { text: String(counts[color]), cls: "temp-stat-count" });
      });
      for (const entry of entries) {
        const item = details.createEl("div", { cls: "temp-panel-item" });
        const curColor = (_c = allCurrentMarks.get(`${entry.file}\0${entry.line}`)) != null ? _c : null;
        const changed = curColor !== entry.color;
        const dotWrap = item.createEl("span", { cls: "fh-dot-wrap" });
        dotWrap.createEl("span", { cls: `temp-panel-dot temp-dot-${entry.color}` });
        if (changed) {
          dotWrap.createEl("span", { text: "\u2192", cls: "fh-dot-arrow" });
          if (curColor) {
            dotWrap.createEl("span", { cls: `temp-panel-dot temp-dot-${curColor}` });
          } else {
            dotWrap.createEl("span", { cls: "temp-panel-dot fh-dot-cleared" });
          }
        }
        const lineText = ((_d = lines[entry.line - 1]) != null ? _d : "").trim() || `\u7B2C ${entry.line} \u884C`;
        item.createEl("span", { text: lineText, cls: "temp-panel-loc" });
        const t = new Date(entry.timestamp).toLocaleTimeString("zh-CN", {
          hour: "2-digit",
          minute: "2-digit"
        });
        item.createEl("span", { text: t, cls: "temp-panel-time" });
        const del = item.createEl("span", { text: "\xD7", cls: "temp-entry-del" });
        del.addEventListener("click", (e) => {
          e.stopPropagation();
          if (confirm(`\u5220\u9664\u6B64\u8BB0\u5F55\u5E76\u6E05\u9664\u8BE5\u884C\u6807\u8BB0\uFF1F
${shortName} \xB7 \u7B2C ${entry.line} \u884C`)) {
            this.plugin.deleteHistoryEntry(entry.file, entry.line, entry.timestamp);
            this.render();
          }
        });
        item.addEventListener("click", () => this.navigateTo(entry.file, entry.line));
        item.addEventListener("mouseenter", (e) => this.preview.show(e.clientX, e.clientY, entry.file, entry.line));
        item.addEventListener("mouseleave", () => this.preview.hide());
      }
    }
  }
  async navigateTo(filePath, line) {
    const file = this.app.vault.getAbstractFileByPath(filePath);
    if (!(file instanceof import_obsidian.TFile))
      return;
    const existing = this.app.workspace.getLeavesOfType("markdown").find((l) => {
      var _a;
      return ((_a = l.view.file) == null ? void 0 : _a.path) === filePath;
    });
    const leaf = existing != null ? existing : this.app.workspace.getLeaf("tab");
    if (!existing)
      await leaf.openFile(file);
    this.app.workspace.revealLeaf(leaf);
    requestAnimationFrame(() => {
      this.plugin.restoreMarks(filePath);
      this.plugin._dispatchNoteVocabTerms(filePath);
      const view = leaf.view;
      if (!(view == null ? void 0 : view.editor))
        return;
      const pos = { line: line - 1, ch: 0 };
      view.editor.setCursor(pos);
      view.editor.scrollIntoView({ from: pos, to: pos }, true);
    });
  }
};
var VocabQueueView = class extends import_obsidian.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
  }
  getViewType() {
    return VIEW_TYPE_VOCAB;
  }
  getDisplayText() {
    return "\u8BCD\u6761\u6536\u96C6\u6E05\u5355";
  }
  getIcon() {
    return "book-plus";
  }
  async onOpen() {
    this.render();
  }
  async onClose() {
  }
  render() {
    var _a;
    const root = this.containerEl.children[1];
    root.empty();
    root.addClass("vocab-panel");
    const activeFile = this.plugin.app.workspace.getActiveFile();
    root.createEl("div", { text: "\u5F53\u524D\u7B14\u8BB0\u8BCD\u6761", cls: "vocab-section-title" });
    if (!activeFile) {
      root.createEl("div", { text: "\u8BF7\u5148\u6253\u5F00\u4E00\u7BC7\u7B14\u8BB0", cls: "vocab-panel-hint" });
    } else {
      const linked = this.plugin.sqlDb.getNoteVocab(activeFile.path);
      const addRow = root.createEl("div", { cls: "vocab-add-row" });
      const input = addRow.createEl("input", {
        type: "text",
        placeholder: "\u641C\u7D22\u5DF2\u6709\u8BCD\u6761\u2026",
        cls: "vocab-add-input"
      });
      const addBtn = addRow.createEl("button", { text: "\u5173\u8054", cls: "vocab-add-btn" });
      const suggestions = root.createEl("div", { cls: "vocab-suggestions" });
      suggestions.style.display = "none";
      const refreshSuggestions = (query) => {
        suggestions.empty();
        if (!query) {
          suggestions.style.display = "none";
          return;
        }
        const allTerms = [...vocabLinkIndex.termToPath.keys()];
        const matched = allTerms.filter(
          (t) => t.toLowerCase().includes(query.toLowerCase()) && !linked.includes(t)
        ).slice(0, 8);
        if (matched.length === 0) {
          suggestions.style.display = "none";
          return;
        }
        suggestions.style.display = "";
        for (const term of matched) {
          const item = suggestions.createEl("div", { text: term, cls: "vocab-suggestion-item" });
          item.addEventListener("click", () => {
            input.value = term;
            suggestions.style.display = "none";
          });
        }
      };
      input.addEventListener("input", () => refreshSuggestions(input.value));
      const doAdd = () => {
        const term = input.value.trim();
        if (!term)
          return;
        this.plugin.sqlDb.addNoteVocab(activeFile.path, term);
        this.plugin._dispatchNoteVocabTerms(activeFile.path);
        input.value = "";
        suggestions.style.display = "none";
        this.render();
      };
      addBtn.addEventListener("click", doAdd);
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter")
          doAdd();
      });
      if (linked.length === 0) {
        root.createEl("div", { text: "\u5C1A\u65E0\u5173\u8054\u8BCD\u6761", cls: "vocab-panel-hint" });
      } else {
        const list = root.createEl("div", { cls: "vocab-linked-list" });
        for (const term of linked) {
          const chip = list.createEl("div", { cls: "vocab-linked-chip" });
          const hasNote = vocabLinkIndex.termToPath.has(term);
          chip.createEl("span", {
            text: term,
            cls: hasNote ? "vocab-chip-term" : "vocab-chip-term vocab-chip-missing"
          });
          if (!hasNote) {
            chip.createEl("span", { text: " (\u65E0\u7B14\u8BB0)", cls: "vocab-chip-warn" });
          }
          const del = chip.createEl("span", { text: "\xD7", cls: "vocab-card-del" });
          del.addEventListener("click", () => {
            this.plugin.sqlDb.removeNoteVocab(activeFile.path, term);
            this.plugin._dispatchNoteVocabTerms(activeFile.path);
            this.render();
          });
        }
      }
    }
    root.createEl("div", { text: "\u6536\u96C6\u961F\u5217", cls: "vocab-section-title vocab-section-gap" });
    const titleRow = root.createEl("div", { cls: "vocab-panel-title-row" });
    titleRow.createEl("span", {
      text: this.plugin.highlightMode ? "\u6536\u96C6\u4E2D" : "\u672A\u6FC0\u6D3B",
      cls: `vocab-mode-tag ${this.plugin.highlightMode ? "vocab-mode-active" : "vocab-mode-inactive"}`
    });
    const queue = this.plugin.vocabQueue;
    if (queue.length > 0) {
      const btnRow = root.createEl("div", { cls: "vocab-panel-btn-row" });
      const copyBtn = btnRow.createEl("button", { text: "\u590D\u5236 prompt \u5E76\u7ED3\u675F", cls: "mod-cta vocab-copy-btn" });
      copyBtn.addEventListener("click", () => this.plugin.toggleHighlightMode());
      const clearBtn = btnRow.createEl("button", { text: "\u6E05\u7A7A", cls: "vocab-clear-btn" });
      clearBtn.addEventListener("click", () => {
        this.plugin.vocabQueue = [];
        this.plugin.updateStatusBar();
        this.render();
      });
    } else {
      root.createEl("div", {
        text: this.plugin.highlightMode ? "\u9009\u4E2D\u6587\u5B57\u540E\u6309 Ctrl+Q \u6216\u53F3\u952E\u52A0\u5165\u6E05\u5355" : "\u70B9\u51FB\u5DE6\u4FA7\u4E66\u672C\u56FE\u6807\u8FDB\u5165\u6536\u96C6\u6A21\u5F0F",
        cls: "vocab-panel-hint"
      });
    }
    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];
      const card = root.createEl("div", { cls: "vocab-card" });
      const wordRow = card.createEl("div", { cls: "vocab-card-word-row" });
      wordRow.createEl("span", { text: `${i + 1}`, cls: "vocab-card-index" });
      wordRow.createEl("span", { text: item.word, cls: "vocab-card-word" });
      const delBtn = wordRow.createEl("span", { text: "\xD7", cls: "vocab-card-del" });
      delBtn.addEventListener("click", () => {
        this.plugin.vocabQueue.splice(i, 1);
        this.plugin.updateStatusBar();
        this.render();
      });
      card.createEl("div", { text: item.context, cls: "vocab-card-context" });
      const shortFile = (_a = item.file.split("/").pop()) != null ? _a : item.file;
      card.createEl("div", { text: `${shortFile}  \u7B2C ${item.line} \u884C`, cls: "vocab-card-source" });
    }
  }
};
var FullHistoryView = class extends import_obsidian.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.filterDays = 30;
    this.selectedDate = localDateStr(new Date());
    // 默认今天
    this.heatmapMode = "count";
    this.plugin = plugin;
  }
  getViewType() {
    return VIEW_TYPE_HISTORY_FULL;
  }
  getDisplayText() {
    return "\u5B66\u4E60\u5386\u53F2";
  }
  getIcon() {
    return "list-checks";
  }
  async onOpen() {
    this.preview = new HoverPreview(this.app);
    this.render();
  }
  async onClose() {
    var _a;
    (_a = this.preview) == null ? void 0 : _a.destroy();
  }
  render() {
    this._doRender();
  }
  async _doRender() {
    var _a, _b, _c, _d;
    const root = this.containerEl.children[1];
    root.empty();
    root.addClass("full-history");
    root.createEl("h2", { text: "\u5B66\u4E60\u5386\u53F2", cls: "fh-title" });
    const stats = this.plugin.sqlDb.getDailyStats();
    const currentStats = this.plugin.sqlDb.getDailyCurrentStats();
    this._renderHeatmap(root, stats, currentStats);
    const total = stats.reduce((s, d) => s + d.green + d.orange + d.red, 0);
    const greens = stats.reduce((s, d) => s + d.green, 0);
    const oranges = stats.reduce((s, d) => s + d.orange, 0);
    const reds = stats.reduce((s, d) => s + d.red, 0);
    const summaryEl = root.createEl("div", { cls: "fh-summary" });
    const chips = [
      ["\u5171\u6807\u8BB0", total, "fh-chip-total"],
      ["\u8212\u9002\u533A", greens, "fh-chip-green"],
      ["\u5B66\u4E60\u533A", oranges, "fh-chip-orange"],
      ["\u6050\u614C\u533A", reds, "fh-chip-red"]
    ];
    for (const [label, count, cls] of chips) {
      const chip = summaryEl.createEl("div", { cls: `fh-chip ${cls}` });
      chip.createEl("div", { text: String(count), cls: "fh-chip-num" });
      chip.createEl("div", { text: label, cls: "fh-chip-label" });
    }
    const dayStart = parseDateStr(this.selectedDate).getTime();
    const dayEnd = dayStart + 864e5;
    const history = this.plugin.sqlDb.getHistory({ since: dayStart, until: dayEnd, limit: 1e3 });
    const today = localDateStr(new Date());
    const dateLabel = this.selectedDate === today ? "\u4ECA\u5929" : this.selectedDate;
    root.createEl("div", {
      text: `${dateLabel}  \xB7  \u5171 ${history.length} \u6761`,
      cls: "fh-list-title"
    });
    const allCurrentMarks = this.plugin.sqlDb.getAllCurrentMarks();
    const fileGroups = /* @__PURE__ */ new Map();
    for (const entry of history) {
      if (!fileGroups.has(entry.file)) {
        fileGroups.set(entry.file, { entries: [], maxTs: 0 });
      }
      const g = fileGroups.get(entry.file);
      g.entries.push(entry);
      if (entry.timestamp > g.maxTs)
        g.maxTs = entry.timestamp;
    }
    const sorted = [...fileGroups.entries()].sort((a, b) => b[1].maxTs - a[1].maxTs);
    const list = root.createEl("div", { cls: "fh-list" });
    for (const [filePath, { entries }] of sorted) {
      const tfile = this.app.vault.getAbstractFileByPath(filePath);
      let lines = [];
      if (tfile instanceof import_obsidian.TFile) {
        try {
          lines = (await this.app.vault.cachedRead(tfile)).split("\n");
        } catch (e) {
        }
      }
      const shortName = (_b = (_a = filePath.split("/").pop()) == null ? void 0 : _a.replace(/\.md$/, "")) != null ? _b : filePath;
      const details = list.createEl("details", { cls: "fh-file-section" });
      details.setAttribute("open", "");
      const summary = details.createEl("summary", { cls: "fh-file-summary" });
      summary.createEl("span", { text: shortName, cls: "fh-file-name" });
      const counts = { green: 0, orange: 0, red: 0 };
      entries.forEach((e) => counts[e.color]++);
      const statsEl = summary.createEl("span", { cls: "temp-panel-stats" });
      ["red", "orange", "green"].forEach((color) => {
        if (!counts[color])
          return;
        const chip = statsEl.createEl("span", { cls: "temp-stat-chip" });
        chip.createEl("span", { cls: `temp-panel-dot temp-dot-${color}` });
        chip.createEl("span", { text: String(counts[color]), cls: "temp-stat-count" });
      });
      for (const entry of entries) {
        const row = details.createEl("div", { cls: "fh-row" });
        const curColor = (_c = allCurrentMarks.get(`${entry.file}\0${entry.line}`)) != null ? _c : null;
        const changed = curColor !== entry.color;
        const dotWrap = row.createEl("span", { cls: "fh-dot-wrap" });
        dotWrap.createEl("span", { cls: `fh-dot temp-dot-${entry.color}` });
        if (changed) {
          dotWrap.createEl("span", { text: "\u2192", cls: "fh-dot-arrow" });
          if (curColor) {
            dotWrap.createEl("span", { cls: `fh-dot temp-dot-${curColor}` });
          } else {
            dotWrap.createEl("span", { cls: "fh-dot fh-dot-cleared" });
          }
        }
        const lineText = ((_d = lines[entry.line - 1]) != null ? _d : "").trim() || `\u7B2C ${entry.line} \u884C`;
        row.createEl("span", { text: lineText, cls: "fh-row-loc" });
        const d = new Date(entry.timestamp);
        row.createEl("span", {
          text: d.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
          cls: "fh-row-time"
        });
        const del = row.createEl("span", { text: "\xD7", cls: "temp-entry-del" });
        del.addEventListener("click", (e) => {
          e.stopPropagation();
          if (confirm(`\u5220\u9664\u6B64\u8BB0\u5F55\u5E76\u6E05\u9664\u8BE5\u884C\u6807\u8BB0\uFF1F
${shortName} \xB7 \u7B2C ${entry.line} \u884C`)) {
            this.plugin.deleteHistoryEntry(entry.file, entry.line, entry.timestamp);
            this.render();
          }
        });
        row.addEventListener("click", () => this._navigateTo(entry.file, entry.line));
        row.addEventListener("mouseenter", (e) => this.preview.show(e.clientX, e.clientY, entry.file, entry.line));
        row.addEventListener("mouseleave", () => this.preview.hide());
      }
    }
  }
  _renderHeatmap(root, stats, currentStats) {
    var _a, _b, _c;
    const wrap = root.createEl("div", { cls: "fh-heatmap-wrap" });
    const modeBar = wrap.createEl("div", { cls: "fh-heatmap-mode-bar" });
    const btnCount = modeBar.createEl("button", { text: "\u8BB0\u5F55\u6570\u91CF", cls: "fh-mode-btn" });
    const btnStatus = modeBar.createEl("button", { text: "\u5F53\u524D\u72B6\u6001", cls: "fh-mode-btn" });
    const setActive = () => {
      btnCount.classList.toggle("fh-mode-btn-active", this.heatmapMode === "count");
      btnStatus.classList.toggle("fh-mode-btn-active", this.heatmapMode === "status");
    };
    setActive();
    btnCount.addEventListener("click", () => {
      this.heatmapMode = "count";
      this.render();
    });
    btnStatus.addEventListener("click", () => {
      this.heatmapMode = "status";
      this.render();
    });
    const dateMap = new Map(stats.map((d) => [d.date, d]));
    const currentDateMap = new Map(currentStats.map((d) => [d.date, d]));
    const todayStr = localDateStr(new Date());
    const endDate = parseDateStr(todayStr);
    const earliestTs = this.plugin.sqlDb.getEarliestTimestamp();
    const startDate = earliestTs ? parseDateStr(localDateStr(new Date(earliestTs))) : endDate;
    const weekStart = new Date(startDate);
    const dowMon = (weekStart.getDay() + 6) % 7;
    weekStart.setDate(weekStart.getDate() - dowMon);
    const totalDays = Math.floor((endDate.getTime() - weekStart.getTime()) / 864e5) + 1;
    const weeks = [];
    let week = [];
    for (let i = 0; i < totalDays; i++) {
      const date = new Date(weekStart.getTime() + i * 864e5);
      const key = localDateStr(date);
      const inRange = key >= localDateStr(startDate) && key <= todayStr;
      if (inRange) {
        const d = dateMap.get(key);
        const total = d ? d.green + d.orange + d.red : 0;
        week.push({ key, total });
      } else {
        week.push(null);
      }
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }
    if (week.length > 0) {
      while (week.length < 7)
        week.push(null);
      weeks.push(week);
    }
    const monthGroups = [];
    for (const w of weeks) {
      const firstCell = w.find((c) => c !== null);
      if (!firstCell)
        continue;
      const mo = parseInt(firstCell.key.slice(5, 7)) - 1;
      const label = new Date(parseInt(firstCell.key.slice(0, 4)), mo, 1).toLocaleDateString("zh-CN", { month: "short" });
      const last = monthGroups[monthGroups.length - 1];
      if (last && last.label === label)
        last.weeks.push(w);
      else
        monthGroups.push({ label, weeks: [w] });
    }
    const container = wrap.createEl("div", { cls: "fh-heatmap-container" });
    const dayCol = container.createEl("div", { cls: "fh-heatmap-days" });
    const DOW_LABELS = ["\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D", "\u65E5"];
    for (let dow = 0; dow < 7; dow++) {
      dayCol.createEl("div", {
        text: [0, 2, 4].includes(dow) ? DOW_LABELS[dow] : "",
        cls: "fh-day-label"
      });
    }
    const monthsRow = container.createEl("div", { cls: "fh-heatmap-months-row" });
    requestAnimationFrame(() => {
      monthsRow.scrollLeft = monthsRow.scrollWidth;
    });
    for (const group of monthGroups) {
      const monthEl = monthsRow.createEl("div", { cls: "fh-heatmap-month" });
      monthEl.createEl("div", { text: group.label, cls: "fh-month-header" });
      const weeksEl = monthEl.createEl("div", { cls: "fh-heatmap-weeks" });
      for (const w of group.weeks) {
        const weekEl = weeksEl.createEl("div", { cls: "fh-heatmap-week" });
        for (const cell of w) {
          if (!cell) {
            weekEl.createEl("div", { cls: "fh-cell fh-cell-empty" });
            continue;
          }
          const isSelected = cell.key === this.selectedDate;
          const el = weekEl.createEl("div", {
            cls: `fh-cell${isSelected ? " fh-cell-selected" : ""}`
          });
          if (this.heatmapMode === "count") {
            if (cell.total === 0) {
              el.style.background = "transparent";
              el.style.border = "1px solid var(--background-modifier-border)";
            } else {
              const alpha = 0.15 + 0.85 * Math.min(cell.total / 100, 1);
              el.style.background = `rgba(76, 175, 80, ${alpha.toFixed(3)})`;
            }
            el.title = `${cell.key}\uFF1A${cell.total} \u6761`;
          } else {
            const cur = currentDateMap.get(cell.key);
            const cg = (_a = cur == null ? void 0 : cur.green) != null ? _a : 0;
            const co = (_b = cur == null ? void 0 : cur.orange) != null ? _b : 0;
            const cr = (_c = cur == null ? void 0 : cur.red) != null ? _c : 0;
            const ctot = cg + co + cr;
            if (ctot === 0) {
              el.style.background = "transparent";
              el.style.border = "1px solid var(--background-modifier-border)";
              el.title = `${cell.key}\uFF1A\u65E0\u5F53\u524D\u6807\u8BB0`;
            } else {
              const gPct = cg / ctot * 100;
              const oPct = co / ctot * 100;
              el.style.background = `linear-gradient(to top,
                rgba(76,175,80,0.85)  0%   ${gPct.toFixed(1)}%,
                rgba(255,152,0,0.85)  ${gPct.toFixed(1)}%  ${(gPct + oPct).toFixed(1)}%,
                rgba(244,67,54,0.85)  ${(gPct + oPct).toFixed(1)}%  100%
              )`;
              el.title = `${cell.key}  \u5F53\u524D\uFF1A\u7EFF${cg} \u6A59${co} \u7EA2${cr}`;
            }
          }
          el.addEventListener("click", () => {
            this.selectedDate = cell.key;
            this.render();
          });
        }
      }
    }
  }
  async _navigateTo(filePath, line) {
    const file = this.app.vault.getAbstractFileByPath(filePath);
    if (!(file instanceof import_obsidian.TFile))
      return;
    const existing = this.app.workspace.getLeavesOfType("markdown").find((l) => {
      var _a;
      return ((_a = l.view.file) == null ? void 0 : _a.path) === filePath;
    });
    const leaf = existing != null ? existing : this.app.workspace.getLeaf("tab");
    if (!existing)
      await leaf.openFile(file);
    this.app.workspace.revealLeaf(leaf);
    requestAnimationFrame(() => {
      this.plugin.restoreMarks(filePath);
      this.plugin._dispatchNoteVocabTerms(filePath);
      const view = leaf.view;
      if (!(view == null ? void 0 : view.editor))
        return;
      const pos = { line: line - 1, ch: 0 };
      view.editor.setCursor(pos);
      view.editor.scrollIntoView({ from: pos, to: pos }, true);
    });
  }
};
