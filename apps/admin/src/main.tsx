import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { AxiosError } from 'axios'
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/authStore'
import { handleServerError } from '@/utils/handle-server-error'
import { toast } from '@/hooks/use-toast'
import { FontProvider } from './context/font-context'
import { ThemeProvider } from './context/theme-context'
import './index.css'
// Generated Routes
import { routeTree } from './routeTree.gen'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // eslint-disable-next-line no-console
        if (import.meta.env.DEV) console.log({ failureCount, error })

        if (failureCount >= 0 && import.meta.env.DEV) return false
        if (failureCount > 3 && import.meta.env.PROD) return false

        return !(
          error instanceof AxiosError &&
          [401, 403].includes(error.response?.status ?? 0)
        )
      },
      refetchOnWindowFocus: import.meta.env.PROD,
      staleTime: 10 * 1000, // 10s
    },
    mutations: {
      onError: (error) => {
        handleServerError(error)

        if (error instanceof AxiosError) {
          // TODO
        }
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      const status = error instanceof AxiosError ? error.response?.status : 'code' in error ? error.code : 500
      if (status === 401) {
        toast({
          variant: 'default',
          title: '登录过期请重新登录',
        })
        useAuthStore.getState().auth.reset()
        const redirect = `${router.history.location.href}`
        router.navigate({ to: '/sign-in', search: { redirect } })
      }
      if (status === 403) {
        toast({
          variant: 'destructive',
          title: '无权限访问，请联系管理员授权!',
        })
        router.navigate({ to: "/403" });
      }
      if (status === 500) {
        toast({
          variant: 'destructive',
          title: '服务错误，请联系管理员!',
        })
        router.navigate({ to: '/500' })
      }
    },
  }),
})

// Create a new router instance
const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
          <FontProvider>
            <RouterProvider router={router} />
          </FontProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>
  )
}
