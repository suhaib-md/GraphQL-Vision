import * as React from 'react';
import { Logo } from '@/components/icons/logo';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronsUpDown, Cloud, LifeBuoy, LogOut, Settings, User, PlusCircle } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export function AppHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b bg-card px-4 lg:h-16">
      <div className="flex items-center gap-2">
        <Logo className="h-6 w-6" />
        <h1 className="text-lg font-semibold tracking-tight">GraphQL Vision</h1>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <EnvironmentSwitcher />
        <SettingsSheet />
        <UserMenu />
      </div>
    </header>
  );
}

function EnvironmentSwitcher() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span>Production</span>
          </div>
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]">
        <DropdownMenuLabel>Environments</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
            <span>Production</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2" />
            <span>Staging</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div className="h-2 w-2 rounded-full bg-blue-500 mr-2" />
            <span>Development</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <PlusCircle className="mr-2 h-4 w-4" />
          <span>Manage Environments</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://picsum.photos/100/100" alt="@user" width={100} height={100} data-ai-hint="person" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">User</p>
            <p className="text-xs leading-none text-muted-foreground">
              user@example.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Cloud className="mr-2 h-4 w-4" />
            <span>Cloud Sync</span>
          </DropdownMenuItem>
          <SettingsSheet>
             <div className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </div>
          </SettingsSheet>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LifeBuoy className="mr-2 h-4 w-4" />
          <span>Support</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SettingsSheet({ children }: { children?: React.ReactNode }) {
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);
  
  React.useEffect(() => {
    // Ensure this runs only on the client
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkTheme(isDark);
  }, []);

  const toggleTheme = (checked: boolean) => {
    setIsDarkTheme(checked);
    document.documentElement.classList.toggle('dark', checked);
  };
  
  const trigger = children ? (
    <div className='w-full'>{children}</div>
  ) : (
    <Button variant="ghost" size="icon">
      <Settings className="h-5 w-5" />
      <span className="sr-only">Settings</span>
    </Button>
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>
        <div className="grid gap-6 py-4">
          <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <Label>Dark Mode</Label>
              <p className="text-xs text-muted-foreground">
                Enjoy a darker, more eye-friendly interface.
              </p>
            </div>
            <Switch
              checked={isDarkTheme}
              onCheckedChange={toggleTheme}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <Label>Disable Animations</Label>
               <p className="text-xs text-muted-foreground">
                Turn off UI animations for a faster experience.
              </p>
            </div>
            <Switch />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
