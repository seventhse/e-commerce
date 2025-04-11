import { useNavigate } from '@tanstack/react-router'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/stores/authStore'
import { AuthService } from '@/services/auth.service'
import { toast } from '@/hooks/use-toast'

export function ProfileDropdown() {
  const navigate = useNavigate()
  const { user, reset } = useAuthStore().auth
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src='/avatars/01.png' alt={user?.username || 'User'} />
            <AvatarFallback>{user?.username ? user.username.substring(0, 2).toUpperCase() : 'UN'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>{user?.username || 'User'}</p>
            <p className='text-xs leading-none text-muted-foreground'>
              {user?.email || 'No email'}
            </p>
          </div>
        </DropdownMenuLabel>
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
                title: 'Logged out successfully',
                description: 'You have been logged out of your account.',
              })
            } catch (error) {
              // eslint-disable-next-line no-console
              console.error('Logout failed:', error)

              // Even if the API call fails, we should still reset the local state
              reset()
              navigate({ to: '/sign-in' })

              toast({
                variant: 'destructive',
                title: 'Logout failed',
                description: 'There was an error logging out, but your session has been cleared.',
              })
            }
          }}
        >
          退出登录
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
