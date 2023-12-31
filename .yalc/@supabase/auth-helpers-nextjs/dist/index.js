"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  createBrowserSupabaseClient: () => createBrowserSupabaseClient,
  createClientComponentClient: () => createClientComponentClient,
  createMiddlewareClient: () => createMiddlewareClient,
  createMiddlewareSupabaseClient: () => createMiddlewareSupabaseClient,
  createPagesBrowserClient: () => createPagesBrowserClient,
  createPagesServerClient: () => createPagesServerClient,
  createRouteHandlerClient: () => createRouteHandlerClient,
  createServerActionClient: () => createServerActionClient,
  createServerComponentClient: () => createServerComponentClient,
  createServerSupabaseClient: () => createServerSupabaseClient
});
module.exports = __toCommonJS(src_exports);

// src/clientComponentClient.ts
var import_auth_helpers_shared = require("@supabase/auth-helpers-shared");
var supabase;
function createClientComponentClient({
  supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  options,
  cookieOptions,
  isSingleton = true
} = {}) {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "either NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY env variables or supabaseUrl and supabaseKey are required!"
    );
  }
  const createNewClient = () => {
    var _a;
    return (0, import_auth_helpers_shared.createSupabaseClient)(supabaseUrl, supabaseKey, {
      ...options,
      global: {
        ...options == null ? void 0 : options.global,
        headers: {
          ...(_a = options == null ? void 0 : options.global) == null ? void 0 : _a.headers,
          "X-Client-Info": `${"@supabase/auth-helpers-nextjs"}@${"0.8.1"}`
        }
      },
      auth: {
        storageKey: cookieOptions == null ? void 0 : cookieOptions.name,
        storage: new import_auth_helpers_shared.BrowserCookieAuthStorageAdapter(cookieOptions)
      }
    });
  };
  if (isSingleton) {
    const _supabase = supabase ?? createNewClient();
    if (typeof window === "undefined")
      return _supabase;
    if (!supabase)
      supabase = _supabase;
    return supabase;
  }
  return createNewClient();
}

// src/pagesBrowserClient.ts
var createPagesBrowserClient = createClientComponentClient;

// src/pagesServerClient.ts
var import_auth_helpers_shared2 = require("@supabase/auth-helpers-shared");
var import_set_cookie_parser = require("set-cookie-parser");
var NextServerAuthStorageAdapter = class extends import_auth_helpers_shared2.CookieAuthStorageAdapter {
  constructor(context, cookieOptions) {
    super(cookieOptions);
    this.context = context;
  }
  getCookie(name) {
    var _a;
    const setCookie = (0, import_set_cookie_parser.splitCookiesString)(((_a = this.context.res.getHeader("set-cookie")) == null ? void 0 : _a.toString()) ?? "").map((c) => (0, import_auth_helpers_shared2.parseCookies)(c)[name]).find((c) => !!c);
    const value = setCookie ?? this.context.req.cookies[name];
    return value;
  }
  setCookie(name, value) {
    this._setCookie(name, value);
  }
  deleteCookie(name) {
    this._setCookie(name, "", {
      maxAge: 0
    });
  }
  _setCookie(name, value, options) {
    var _a;
    const setCookies = (0, import_set_cookie_parser.splitCookiesString)(
      ((_a = this.context.res.getHeader("set-cookie")) == null ? void 0 : _a.toString()) ?? ""
    ).filter((c) => !(name in (0, import_auth_helpers_shared2.parseCookies)(c)));
    const cookieStr = (0, import_auth_helpers_shared2.serializeCookie)(name, value, {
      ...this.cookieOptions,
      ...options,
      // Allow supabase-js on the client to read the cookie as well
      httpOnly: false
    });
    this.context.res.setHeader("set-cookie", [...setCookies, cookieStr]);
  }
};
function createPagesServerClient(context, {
  supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  options,
  cookieOptions
} = {}) {
  var _a;
  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "either NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY env variables or supabaseUrl and supabaseKey are required!"
    );
  }
  return (0, import_auth_helpers_shared2.createSupabaseClient)(supabaseUrl, supabaseKey, {
    ...options,
    global: {
      ...options == null ? void 0 : options.global,
      headers: {
        ...(_a = options == null ? void 0 : options.global) == null ? void 0 : _a.headers,
        "X-Client-Info": `${"@supabase/auth-helpers-nextjs"}@${"0.8.1"}`
      }
    },
    auth: {
      storageKey: cookieOptions == null ? void 0 : cookieOptions.name,
      storage: new NextServerAuthStorageAdapter(context, cookieOptions)
    }
  });
}

// src/middlewareClient.ts
var import_auth_helpers_shared3 = require("@supabase/auth-helpers-shared");
var import_set_cookie_parser2 = require("set-cookie-parser");
var NextMiddlewareAuthStorageAdapter = class extends import_auth_helpers_shared3.CookieAuthStorageAdapter {
  constructor(context, cookieOptions) {
    super(cookieOptions);
    this.context = context;
  }
  getCookie(name) {
    var _a;
    const setCookie = (0, import_set_cookie_parser2.splitCookiesString)(
      ((_a = this.context.res.headers.get("set-cookie")) == null ? void 0 : _a.toString()) ?? ""
    ).map((c) => (0, import_auth_helpers_shared3.parseCookies)(c)[name]).find((c) => !!c);
    if (setCookie) {
      return setCookie;
    }
    const cookies = (0, import_auth_helpers_shared3.parseCookies)(this.context.req.headers.get("cookie") ?? "");
    return cookies[name];
  }
  setCookie(name, value) {
    this._setCookie(name, value);
  }
  deleteCookie(name) {
    this._setCookie(name, "", {
      maxAge: 0
    });
  }
  _setCookie(name, value, options) {
    const newSessionStr = (0, import_auth_helpers_shared3.serializeCookie)(name, value, {
      ...this.cookieOptions,
      ...options,
      // Allow supabase-js on the client to read the cookie as well
      httpOnly: false
    });
    if (this.context.res.headers) {
      this.context.res.headers.append("set-cookie", newSessionStr);
    }
  }
};
function createMiddlewareClient(context, {
  supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  options,
  cookieOptions
} = {}) {
  var _a;
  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "either NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY env variables or supabaseUrl and supabaseKey are required!"
    );
  }
  return (0, import_auth_helpers_shared3.createSupabaseClient)(supabaseUrl, supabaseKey, {
    ...options,
    global: {
      ...options == null ? void 0 : options.global,
      headers: {
        ...(_a = options == null ? void 0 : options.global) == null ? void 0 : _a.headers,
        "X-Client-Info": `${"@supabase/auth-helpers-nextjs"}@${"0.8.1"}`
      }
    },
    auth: {
      storageKey: cookieOptions == null ? void 0 : cookieOptions.name,
      storage: new NextMiddlewareAuthStorageAdapter(context, cookieOptions)
    }
  });
}

// src/serverComponentClient.ts
var import_auth_helpers_shared4 = require("@supabase/auth-helpers-shared");
var NextServerComponentAuthStorageAdapter = class extends import_auth_helpers_shared4.CookieAuthStorageAdapter {
  constructor(context, cookieOptions) {
    super(cookieOptions);
    this.context = context;
  }
  getCookie(name) {
    var _a;
    const nextCookies = this.context.cookies();
    return (_a = nextCookies.get(name)) == null ? void 0 : _a.value;
  }
  setCookie(name, value) {
  }
  deleteCookie(name) {
  }
};
function createServerComponentClient(context, {
  supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  options,
  cookieOptions
} = {}) {
  var _a;
  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "either NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY env variables or supabaseUrl and supabaseKey are required!"
    );
  }
  return (0, import_auth_helpers_shared4.createSupabaseClient)(supabaseUrl, supabaseKey, {
    ...options,
    global: {
      ...options == null ? void 0 : options.global,
      headers: {
        ...(_a = options == null ? void 0 : options.global) == null ? void 0 : _a.headers,
        "X-Client-Info": `${"@supabase/auth-helpers-nextjs"}@${"0.8.1"}`
      }
    },
    auth: {
      storageKey: cookieOptions == null ? void 0 : cookieOptions.name,
      storage: new NextServerComponentAuthStorageAdapter(context, cookieOptions)
    }
  });
}

// src/routeHandlerClient.ts
var import_auth_helpers_shared5 = require("@supabase/auth-helpers-shared");
var NextRouteHandlerAuthStorageAdapter = class extends import_auth_helpers_shared5.CookieAuthStorageAdapter {
  constructor(context, cookieOptions) {
    super(cookieOptions);
    this.context = context;
  }
  getCookie(name) {
    var _a;
    const nextCookies = this.context.cookies();
    return (_a = nextCookies.get(name)) == null ? void 0 : _a.value;
  }
  setCookie(name, value) {
    const nextCookies = this.context.cookies();
    nextCookies.set(name, value, this.cookieOptions);
  }
  deleteCookie(name) {
    const nextCookies = this.context.cookies();
    nextCookies.set(name, "", {
      maxAge: 0
    });
  }
};
function createRouteHandlerClient(context, {
  supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  options,
  cookieOptions
} = {}) {
  var _a;
  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "either NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY env variables or supabaseUrl and supabaseKey are required!"
    );
  }
  return (0, import_auth_helpers_shared5.createSupabaseClient)(supabaseUrl, supabaseKey, {
    ...options,
    global: {
      ...options == null ? void 0 : options.global,
      headers: {
        ...(_a = options == null ? void 0 : options.global) == null ? void 0 : _a.headers,
        "X-Client-Info": `${"@supabase/auth-helpers-nextjs"}@${"0.8.1"}`
      }
    },
    auth: {
      storageKey: cookieOptions == null ? void 0 : cookieOptions.name,
      storage: new NextRouteHandlerAuthStorageAdapter(context, cookieOptions)
    }
  });
}

// src/serverActionClient.ts
var createServerActionClient = createRouteHandlerClient;

// src/deprecated.ts
function createBrowserSupabaseClient({
  supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  options,
  cookieOptions
} = {}) {
  console.warn(
    "Please utilize the `createPagesBrowserClient` function instead of the deprecated `createBrowserSupabaseClient` function. Learn more: https://supabase.com/docs/guides/auth/auth-helpers/nextjs-pages"
  );
  return createPagesBrowserClient({
    supabaseUrl,
    supabaseKey,
    options,
    cookieOptions
  });
}
function createServerSupabaseClient(context, {
  supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  options,
  cookieOptions
} = {}) {
  console.warn(
    "Please utilize the `createPagesServerClient` function instead of the deprecated `createServerSupabaseClient` function. Learn more: https://supabase.com/docs/guides/auth/auth-helpers/nextjs-pages"
  );
  return createPagesServerClient(context, {
    supabaseUrl,
    supabaseKey,
    options,
    cookieOptions
  });
}
function createMiddlewareSupabaseClient(context, {
  supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  options,
  cookieOptions
} = {}) {
  console.warn(
    "Please utilize the `createMiddlewareClient` function instead of the deprecated `createMiddlewareSupabaseClient` function. Learn more: https://supabase.com/docs/guides/auth/auth-helpers/nextjs#middleware"
  );
  return createMiddlewareClient(context, {
    supabaseUrl,
    supabaseKey,
    options,
    cookieOptions
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createBrowserSupabaseClient,
  createClientComponentClient,
  createMiddlewareClient,
  createMiddlewareSupabaseClient,
  createPagesBrowserClient,
  createPagesServerClient,
  createRouteHandlerClient,
  createServerActionClient,
  createServerComponentClient,
  createServerSupabaseClient
});
//# sourceMappingURL=index.js.map