import { Link, useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/authStore'
import { AuthService } from '@/services/auth.service'
import { toast } from '@/hooks/use-toast'
import { sidebarData } from './data/sidebar-data'
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

export function NavUser() {
  const { isMobile } = useSidebar()
  const navigate = useNavigate()
  const { user, reset } = useAuthStore().auth
  const sidebarUser = sidebarData.user

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <Avatar className='h-8 w-8 rounded-lg'>
                <AvatarImage src={user?.avatar || sidebarUser.avatar} alt={user?.username || sidebarUser.name} />
                <AvatarFallback className='rounded-lg'>{user?.username ? user.username.substring(0, 2).toUpperCase() : sidebarUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>{user?.username || sidebarUser.name}</span>
                <span className='truncate text-xs'>{user?.email || sidebarUser.email}</span>
              </div>
              <ChevronsUpDown className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <Avatar className='h-8 w-8 rounded-lg'>
                  <AvatarImage src={user?.avatar || sidebarUser.avatar} alt={user?.username || sidebarUser.name} />
                  <AvatarFallback className='rounded-lg'>{user?.username ? user.username.substring(0, 2).toUpperCase() : sidebarUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>{user?.username || sidebarUser.name}</span>
                  <span className='truncate text-xs'>{user?.email || sidebarUser.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                升级到专业版
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to='/settings/account'>
                  <BadgeCheck />
                  账户
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to='/settings'>
                  <CreditCard />
                  账单
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to='/settings/notifications'>
                  <Bell />
                  通知
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                try {
                  // Call the sign out API
                  await AuthService.signOut()

                  // Reset the auth state
                  reset()

                  // Navigate to the login page
                  navigate({ to: '/sign-in' })

                  toast({
                    title: '退出登录成功',
                    description: '您已成功退出登录。',
                  })
                } catch (error) {
                  console.error('Logout failed:', error)

                  // Even if the API call fails, we should still reset the local state
                  reset()
                  navigate({ to: '/sign-in' })

                  toast({
                    variant: 'destructive',
                    title: '退出登录失败',
                    description: '退出登录时发生错误，但您的会话已被清除。',
                  })
                }
              }}
            >
              <LogOut />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
