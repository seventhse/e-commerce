/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as AuthenticatedRouteImport } from './routes/_authenticated/route'
import { Route as AuthenticatedIndexImport } from './routes/_authenticated/index'
import { Route as AuthenticatedProductsImport } from './routes/_authenticated/products'
import { Route as AuthenticatedOrdersImport } from './routes/_authenticated/orders'
import { Route as authSignInImport } from './routes/(auth)/sign-in'

// Create Virtual Routes

const errors503LazyImport = createFileRoute('/(errors)/503')()
const errors500LazyImport = createFileRoute('/(errors)/500')()
const errors404LazyImport = createFileRoute('/(errors)/404')()
const errors403LazyImport = createFileRoute('/(errors)/403')()
const errors401LazyImport = createFileRoute('/(errors)/401')()

// Create/Update Routes

const AuthenticatedRouteRoute = AuthenticatedRouteImport.update({
  id: '/_authenticated',
  getParentRoute: () => rootRoute,
} as any)

const AuthenticatedIndexRoute = AuthenticatedIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => AuthenticatedRouteRoute,
} as any)

const errors503LazyRoute = errors503LazyImport
  .update({
    id: '/(errors)/503',
    path: '/503',
    getParentRoute: () => rootRoute,
  } as any)
  .lazy(() => import('./routes/(errors)/503.lazy').then((d) => d.Route))

const errors500LazyRoute = errors500LazyImport
  .update({
    id: '/(errors)/500',
    path: '/500',
    getParentRoute: () => rootRoute,
  } as any)
  .lazy(() => import('./routes/(errors)/500.lazy').then((d) => d.Route))

const errors404LazyRoute = errors404LazyImport
  .update({
    id: '/(errors)/404',
    path: '/404',
    getParentRoute: () => rootRoute,
  } as any)
  .lazy(() => import('./routes/(errors)/404.lazy').then((d) => d.Route))

const errors403LazyRoute = errors403LazyImport
  .update({
    id: '/(errors)/403',
    path: '/403',
    getParentRoute: () => rootRoute,
  } as any)
  .lazy(() => import('./routes/(errors)/403.lazy').then((d) => d.Route))

const errors401LazyRoute = errors401LazyImport
  .update({
    id: '/(errors)/401',
    path: '/401',
    getParentRoute: () => rootRoute,
  } as any)
  .lazy(() => import('./routes/(errors)/401.lazy').then((d) => d.Route))

const AuthenticatedProductsRoute = AuthenticatedProductsImport.update({
  id: '/products',
  path: '/products',
  getParentRoute: () => AuthenticatedRouteRoute,
} as any)

const AuthenticatedOrdersRoute = AuthenticatedOrdersImport.update({
  id: '/orders',
  path: '/orders',
  getParentRoute: () => AuthenticatedRouteRoute,
} as any)

const authSignInRoute = authSignInImport.update({
  id: '/(auth)/sign-in',
  path: '/sign-in',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_authenticated': {
      id: '/_authenticated'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthenticatedRouteImport
      parentRoute: typeof rootRoute
    }
    '/(auth)/sign-in': {
      id: '/(auth)/sign-in'
      path: '/sign-in'
      fullPath: '/sign-in'
      preLoaderRoute: typeof authSignInImport
      parentRoute: typeof rootRoute
    }
    '/_authenticated/orders': {
      id: '/_authenticated/orders'
      path: '/orders'
      fullPath: '/orders'
      preLoaderRoute: typeof AuthenticatedOrdersImport
      parentRoute: typeof AuthenticatedRouteImport
    }
    '/_authenticated/products': {
      id: '/_authenticated/products'
      path: '/products'
      fullPath: '/products'
      preLoaderRoute: typeof AuthenticatedProductsImport
      parentRoute: typeof AuthenticatedRouteImport
    }
    '/(errors)/401': {
      id: '/(errors)/401'
      path: '/401'
      fullPath: '/401'
      preLoaderRoute: typeof errors401LazyImport
      parentRoute: typeof rootRoute
    }
    '/(errors)/403': {
      id: '/(errors)/403'
      path: '/403'
      fullPath: '/403'
      preLoaderRoute: typeof errors403LazyImport
      parentRoute: typeof rootRoute
    }
    '/(errors)/404': {
      id: '/(errors)/404'
      path: '/404'
      fullPath: '/404'
      preLoaderRoute: typeof errors404LazyImport
      parentRoute: typeof rootRoute
    }
    '/(errors)/500': {
      id: '/(errors)/500'
      path: '/500'
      fullPath: '/500'
      preLoaderRoute: typeof errors500LazyImport
      parentRoute: typeof rootRoute
    }
    '/(errors)/503': {
      id: '/(errors)/503'
      path: '/503'
      fullPath: '/503'
      preLoaderRoute: typeof errors503LazyImport
      parentRoute: typeof rootRoute
    }
    '/_authenticated/': {
      id: '/_authenticated/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof AuthenticatedIndexImport
      parentRoute: typeof AuthenticatedRouteImport
    }
  }
}

// Create and export the route tree

interface AuthenticatedRouteRouteChildren {
  AuthenticatedOrdersRoute: typeof AuthenticatedOrdersRoute
  AuthenticatedProductsRoute: typeof AuthenticatedProductsRoute
  AuthenticatedIndexRoute: typeof AuthenticatedIndexRoute
}

const AuthenticatedRouteRouteChildren: AuthenticatedRouteRouteChildren = {
  AuthenticatedOrdersRoute: AuthenticatedOrdersRoute,
  AuthenticatedProductsRoute: AuthenticatedProductsRoute,
  AuthenticatedIndexRoute: AuthenticatedIndexRoute,
}

const AuthenticatedRouteRouteWithChildren =
  AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren)

export interface FileRoutesByFullPath {
  '': typeof AuthenticatedRouteRouteWithChildren
  '/sign-in': typeof authSignInRoute
  '/orders': typeof AuthenticatedOrdersRoute
  '/products': typeof AuthenticatedProductsRoute
  '/401': typeof errors401LazyRoute
  '/403': typeof errors403LazyRoute
  '/404': typeof errors404LazyRoute
  '/500': typeof errors500LazyRoute
  '/503': typeof errors503LazyRoute
  '/': typeof AuthenticatedIndexRoute
}

export interface FileRoutesByTo {
  '/sign-in': typeof authSignInRoute
  '/orders': typeof AuthenticatedOrdersRoute
  '/products': typeof AuthenticatedProductsRoute
  '/401': typeof errors401LazyRoute
  '/403': typeof errors403LazyRoute
  '/404': typeof errors404LazyRoute
  '/500': typeof errors500LazyRoute
  '/503': typeof errors503LazyRoute
  '/': typeof AuthenticatedIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_authenticated': typeof AuthenticatedRouteRouteWithChildren
  '/(auth)/sign-in': typeof authSignInRoute
  '/_authenticated/orders': typeof AuthenticatedOrdersRoute
  '/_authenticated/products': typeof AuthenticatedProductsRoute
  '/(errors)/401': typeof errors401LazyRoute
  '/(errors)/403': typeof errors403LazyRoute
  '/(errors)/404': typeof errors404LazyRoute
  '/(errors)/500': typeof errors500LazyRoute
  '/(errors)/503': typeof errors503LazyRoute
  '/_authenticated/': typeof AuthenticatedIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | ''
    | '/sign-in'
    | '/orders'
    | '/products'
    | '/401'
    | '/403'
    | '/404'
    | '/500'
    | '/503'
    | '/'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/sign-in'
    | '/orders'
    | '/products'
    | '/401'
    | '/403'
    | '/404'
    | '/500'
    | '/503'
    | '/'
  id:
    | '__root__'
    | '/_authenticated'
    | '/(auth)/sign-in'
    | '/_authenticated/orders'
    | '/_authenticated/products'
    | '/(errors)/401'
    | '/(errors)/403'
    | '/(errors)/404'
    | '/(errors)/500'
    | '/(errors)/503'
    | '/_authenticated/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  AuthenticatedRouteRoute: typeof AuthenticatedRouteRouteWithChildren
  authSignInRoute: typeof authSignInRoute
  errors401LazyRoute: typeof errors401LazyRoute
  errors403LazyRoute: typeof errors403LazyRoute
  errors404LazyRoute: typeof errors404LazyRoute
  errors500LazyRoute: typeof errors500LazyRoute
  errors503LazyRoute: typeof errors503LazyRoute
}

const rootRouteChildren: RootRouteChildren = {
  AuthenticatedRouteRoute: AuthenticatedRouteRouteWithChildren,
  authSignInRoute: authSignInRoute,
  errors401LazyRoute: errors401LazyRoute,
  errors403LazyRoute: errors403LazyRoute,
  errors404LazyRoute: errors404LazyRoute,
  errors500LazyRoute: errors500LazyRoute,
  errors503LazyRoute: errors503LazyRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_authenticated",
        "/(auth)/sign-in",
        "/(errors)/401",
        "/(errors)/403",
        "/(errors)/404",
        "/(errors)/500",
        "/(errors)/503"
      ]
    },
    "/_authenticated": {
      "filePath": "_authenticated/route.tsx",
      "children": [
        "/_authenticated/orders",
        "/_authenticated/products",
        "/_authenticated/"
      ]
    },
    "/(auth)/sign-in": {
      "filePath": "(auth)/sign-in.tsx"
    },
    "/_authenticated/orders": {
      "filePath": "_authenticated/orders.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/products": {
      "filePath": "_authenticated/products.tsx",
      "parent": "/_authenticated"
    },
    "/(errors)/401": {
      "filePath": "(errors)/401.lazy.tsx"
    },
    "/(errors)/403": {
      "filePath": "(errors)/403.lazy.tsx"
    },
    "/(errors)/404": {
      "filePath": "(errors)/404.lazy.tsx"
    },
    "/(errors)/500": {
      "filePath": "(errors)/500.lazy.tsx"
    },
    "/(errors)/503": {
      "filePath": "(errors)/503.lazy.tsx"
    },
    "/_authenticated/": {
      "filePath": "_authenticated/index.tsx",
      "parent": "/_authenticated"
    }
  }
}
ROUTE_MANIFEST_END */
