import * as React from 'react';
import { Logo } from '@/components/icons/logo';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronsUpDown, Cloud, LifeBuoy, LogOut, Settings, User, PlusCircle, Trash2 } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '../ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Environment {
  id: string;
  name: string;
  url: string;
  token?: string;
  color: string;
}

const INITIAL_ENVIRONMENTS: Environment[] = [
    { id: 'prod', name: 'Production', url: 'https://api.example.com/graphql', color: 'bg-green-500' },
    { id: 'staging', name: 'Staging', url: 'https://staging.api.example.com/graphql', color: 'bg-yellow-500' },
    { id: 'dev', name: 'Development', url: 'http://localhost:4000/graphql', color: 'bg-blue-500' },
];


export function AppHeader() {
  const [environments, setEnvironments] = React.useState<Environment[]>(INITIAL_ENVIRONMENTS);
  const [selectedEnvironment, setSelectedEnvironment] = React.useState<string>('prod');

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b bg-card px-4 lg:h-16">
      <div className="flex items-center gap-2">
        <Logo className="h-6 w-6" />
        <h1 className="text-lg font-semibold tracking-tight">GraphQL Vision</h1>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <EnvironmentSwitcher 
          environments={environments}
          setEnvironments={setEnvironments}
          selectedEnvironment={selectedEnvironment}
          setSelectedEnvironment={setSelectedEnvironment}
        />
        <SettingsSheet />
        <UserMenu />
      </div>
    </header>
  );
}

interface EnvironmentSwitcherProps {
  environments: Environment[];
  setEnvironments: React.Dispatch<React.SetStateAction<Environment[]>>;
  selectedEnvironment: string;
  setSelectedEnvironment: React.Dispatch<React.SetStateAction<string>>;
}

function EnvironmentSwitcher({ environments, setEnvironments, selectedEnvironment, setSelectedEnvironment }: EnvironmentSwitcherProps) {
  const activeEnv = environments.find(env => env.id === selectedEnvironment) || environments[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-between">
          <div className="flex items-center gap-2">
            <div className={cn("h-2 w-2 rounded-full", activeEnv.color)} />
            <span>{activeEnv.name}</span>
          </div>
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]">
        <DropdownMenuLabel>Environments</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={selectedEnvironment} onValueChange={setSelectedEnvironment}>
          {environments.map(env => (
            <DropdownMenuRadioItem key={env.id} value={env.id}>
              <div className={cn("h-2 w-2 rounded-full mr-2", env.color)} />
              <span>{env.name}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <ManageEnvironmentsSheet environments={environments} setEnvironments={setEnvironments}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>Manage Environments</span>
          </DropdownMenuItem>
        </ManageEnvironmentsSheet>
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

function ManageEnvironmentsSheet({ children, environments, setEnvironments }: { children: React.ReactNode } & Omit<EnvironmentSwitcherProps, 'selectedEnvironment' | 'setSelectedEnvironment'>) {
    const { toast } = useToast();
    const [name, setName] = React.useState('');
    const [url, setUrl] = React.useState('');
    const [token, setToken] = React.useState('');

    const handleAddEnvironment = () => {
        if (!name || !url) {
            toast({
                variant: 'destructive',
                title: 'Missing Fields',
                description: 'Please provide a name and a URL for the environment.',
            });
            return;
        }

        const newEnv: Environment = {
            id: Date.now().toString(),
            name,
            url,
            token,
            color: 'bg-gray-400', // Default color for new envs
        };

        setEnvironments(prev => [...prev, newEnv]);
        setName('');
        setUrl('');
        setToken('');
        toast({ title: 'Environment Added', description: `Successfully added ${name}.` });
    };

    const handleDeleteEnvironment = (id: string) => {
        setEnvironments(prev => prev.filter(env => env.id !== id));
        toast({ title: 'Environment Removed' });
    };

    return (
        <Sheet>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                    <SheetTitle>Manage Environments</SheetTitle>
                </SheetHeader>
                <div className="py-4 space-y-8">
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Current Environments</h3>
                        <div className="space-y-2">
                            {environments.map(env => (
                                <div key={env.id} className="flex items-center justify-between rounded-lg border p-3">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("h-3 w-3 rounded-full", env.color)} />
                                        <div>
                                            <p className="font-medium">{env.name}</p>
                                            <p className="text-xs text-muted-foreground">{env.url}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteEnvironment(env.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Add New Environment</h3>
                        <div className="space-y-3">
                            <div>
                                <Label htmlFor="env-name">Name</Label>
                                <Input id="env-name" placeholder="e.g., Local Dev" value={name} onChange={e => setName(e.target.value)} />
                            </div>
                            <div>
                                <Label htmlFor="env-url">Endpoint URL</Label>
                                <Input id="env-url" placeholder="https://api.myapp.com/graphql" value={url} onChange={e => setUrl(e.target.value)} />
                            </div>
                            <div>
                                <Label htmlFor="env-token">Bearer Token (Optional)</Label>
                                <Input id="env-token" placeholder="your-secret-token" value={token} onChange={e => setToken(e.target.value)} />
                            </div>
                            <Button onClick={handleAddEnvironment}>Add Environment</Button>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
