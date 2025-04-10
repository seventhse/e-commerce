import Cookies from 'js-cookie'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { useEffect } from 'react'
import { cn } from '@/lib/utils'
import { SearchProvider } from '@/context/search-context'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import SkipToMain from '@/components/skip-to-main'
import { useAuthStore } from '@/stores/authStore'
import { AuthService } from '@/services/auth.service'
import { toast } from '@/hooks/use-toast'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    // Get the auth state from the store
    const { auth } = useAuthStore.getState()

    // If there's no access token, redirect to login
    if (!auth.accessToken) {
      throw redirect({
        to: '/sign-in',
        search: {
          redirect: window.location.pathname,
        },
      })
    }

    return {}
  },
  component: RouteComponent,
})

function RouteComponent() {
  const defaultOpen = Cookies.get('sidebar:state') !== 'false'
  const { auth } = useAuthStore()

  // If there's a token but no user info, try to fetch it
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (auth.accessToken && !auth.user) {
        try {
          const userInfo = await AuthService.getUserInfo()
          auth.setUser(userInfo)
        } catch (error) {
          // If fetching user info fails, the token might be invalid
          auth.reset()
          toast({
            variant: 'destructive',
            title: 'Session expired',
            description: 'Please sign in again.',
          })
          window.location.href = '/sign-in'
        }
      }
    }

    fetchUserInfo()
  }, [auth])

  return (
    <SearchProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <SkipToMain />
        <AppSidebar />
        <div
          id='content'
          className={cn(
            'ml-auto w-full max-w-full',
            'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
            'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
            'transition-[width] duration-200 ease-linear',
            'flex h-svh flex-col',
            'group-data-[scroll-locked=1]/body:h-full',
            'group-data-[scroll-locked=1]/body:has-[main.fixed-main]:h-svh'
          )}
        >
          <Outlet />
        </div>
      </SidebarProvider>
    </SearchProvider>
  )
}
