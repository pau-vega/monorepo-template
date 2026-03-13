"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@monorepo-template/ui/components/accordion"
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@monorepo-template/ui/components/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@monorepo-template/ui/components/alert-dialog"
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@monorepo-template/ui/components/avatar"
import { Badge } from "@monorepo-template/ui/components/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@monorepo-template/ui/components/breadcrumb"
import { Button } from "@monorepo-template/ui/components/button"
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "@monorepo-template/ui/components/button-group"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@monorepo-template/ui/components/card"
import { Checkbox } from "@monorepo-template/ui/components/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@monorepo-template/ui/components/collapsible"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@monorepo-template/ui/components/combobox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@monorepo-template/ui/components/dialog"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@monorepo-template/ui/components/dropdown-menu"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@monorepo-template/ui/components/empty"
import { Field, FieldGroup, FieldLabel } from "@monorepo-template/ui/components/field"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@monorepo-template/ui/components/hover-card"
import { Input } from "@monorepo-template/ui/components/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@monorepo-template/ui/components/input-group"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@monorepo-template/ui/components/input-otp"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@monorepo-template/ui/components/item"
import { Kbd, KbdGroup } from "@monorepo-template/ui/components/kbd"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@monorepo-template/ui/components/pagination"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@monorepo-template/ui/components/popover"
import { Progress, ProgressLabel, ProgressValue } from "@monorepo-template/ui/components/progress"
import { RadioGroup, RadioGroupItem } from "@monorepo-template/ui/components/radio-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@monorepo-template/ui/components/select"
import { Separator } from "@monorepo-template/ui/components/separator"
import { Skeleton } from "@monorepo-template/ui/components/skeleton"
import { Slider } from "@monorepo-template/ui/components/slider"
import { Spinner } from "@monorepo-template/ui/components/spinner"
import { Switch } from "@monorepo-template/ui/components/switch"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@monorepo-template/ui/components/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@monorepo-template/ui/components/tabs"
import { Textarea } from "@monorepo-template/ui/components/textarea"
import { Toggle } from "@monorepo-template/ui/components/toggle"
import { ToggleGroup, ToggleGroupItem } from "@monorepo-template/ui/components/toggle-group"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@monorepo-template/ui/components/tooltip"
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BluetoothIcon,
  BoldIcon,
  BellIcon,
  CalendarIcon,
  ChevronDownIcon,
  CreditCardIcon,
  DownloadIcon,
  EyeIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  FolderOpenIcon,
  FolderSearchIcon,
  HelpCircleIcon,
  ItalicIcon,
  KeyboardIcon,
  LanguagesIcon,
  LayoutIcon,
  LogOutIcon,
  MailIcon,
  MoreHorizontalIcon,
  MoreVerticalIcon,
  MonitorIcon,
  MoonIcon,
  Package2Icon,
  PaletteIcon,
  PlusIcon,
  SaveIcon,
  SearchIcon,
  SettingsIcon,
  ShieldIcon,
  SunIcon,
  TrashIcon,
  UnderlineIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react"
import * as React from "react"

import { Example, ExampleWrapper } from "@/components/example"

export function ComponentExample() {
  return (
    <ExampleWrapper>
      <CardExample />
      <FormExample />
      <ButtonExample />
      <BadgeExample />
      <AvatarExample />
      <AlertExample />
      <AccordionExample />
      <TabsExample />
      <TooltipExample />
      <DialogExample />
      <PopoverExample />
      <HoverCardExample />
      <ProgressExample />
      <SliderExample />
      <SwitchExample />
      <CheckboxExample />
      <RadioGroupExample />
      <ToggleExample />
      <ToggleGroupExample />
      <InputGroupExample />
      <InputOTPExample />
      <BreadcrumbExample />
      <ButtonGroupExample />
      <PaginationExample />
      <TableExample />
      <ItemExample />
      <CollapsibleExample />
      <EmptyExample />
      <SkeletonExample />
      <SpinnerExample />
      <KbdExample />
      <SeparatorExample />
    </ExampleWrapper>
  )
}

function CardExample() {
  return (
    <Example title="Card" className="items-center justify-center">
      <Card className="relative w-full max-w-sm overflow-hidden pt-0">
        <div className="bg-primary absolute inset-0 z-30 aspect-video opacity-50 mix-blend-color" />
        <img
          src="https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Photo by mymind on Unsplash"
          title="Photo by mymind on Unsplash"
          className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale"
        />
        <CardHeader>
          <CardTitle>Observability Plus is replacing Monitoring</CardTitle>
          <CardDescription>
            Switch to the improved way to explore your data, with natural language. Monitoring will no longer be
            available on the Pro plan in November, 2025
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <AlertDialog>
            <AlertDialogTrigger render={<Button />}>
              <PlusIcon data-icon="inline-start" />
              Show Dialog
            </AlertDialogTrigger>
            <AlertDialogContent size="sm">
              <AlertDialogHeader>
                <AlertDialogMedia>
                  <BluetoothIcon />
                </AlertDialogMedia>
                <AlertDialogTitle>Allow accessory to connect?</AlertDialogTitle>
                <AlertDialogDescription>
                  Do you want to allow the USB accessory to connect to this device?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Don&apos;t allow</AlertDialogCancel>
                <AlertDialogAction>Allow</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Badge variant="secondary" className="ml-auto">
            Warning
          </Badge>
        </CardFooter>
      </Card>
    </Example>
  )
}

const frameworks = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"] as const

const roleItems = [
  { label: "Developer", value: "developer" },
  { label: "Designer", value: "designer" },
  { label: "Manager", value: "manager" },
  { label: "Other", value: "other" },
]

function FormExample() {
  const [notifications, setNotifications] = React.useState({
    email: true,
    sms: false,
    push: true,
  })
  const [theme, setTheme] = React.useState("light")

  return (
    <Example title="Form">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>Please fill in your details below</CardDescription>
          <CardAction>
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
                <MoreVerticalIcon />
                <span className="sr-only">More options</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>File</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <FileIcon />
                    New File
                    <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FolderIcon />
                    New Folder
                    <DropdownMenuShortcut>⇧⌘N</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <FolderOpenIcon />
                      Open Recent
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Recent Projects</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <FileCodeIcon />
                            Project Alpha
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileCodeIcon />
                            Project Beta
                          </DropdownMenuItem>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <MoreHorizontalIcon />
                              More Projects
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem>
                                  <FileCodeIcon />
                                  Project Gamma
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <FileCodeIcon />
                                  Project Delta
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem>
                            <FolderSearchIcon />
                            Browse...
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <SaveIcon />
                    Save
                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <DownloadIcon />
                    Export
                    <DropdownMenuShortcut>⇧⌘E</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel>View</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={notifications.email}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        email: checked === true,
                      })
                    }
                  >
                    <EyeIcon />
                    Show Sidebar
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={notifications.sms}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        sms: checked === true,
                      })
                    }
                  >
                    <LayoutIcon />
                    Show Status Bar
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <PaletteIcon />
                      Theme
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                          <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                            <DropdownMenuRadioItem value="light">
                              <SunIcon />
                              Light
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="dark">
                              <MoonIcon />
                              Dark
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="system">
                              <MonitorIcon />
                              System
                            </DropdownMenuRadioItem>
                          </DropdownMenuRadioGroup>
                        </DropdownMenuGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <UserIcon />
                    Profile
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCardIcon />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <SettingsIcon />
                      Settings
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Preferences</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <KeyboardIcon />
                            Keyboard Shortcuts
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <LanguagesIcon />
                            Language
                          </DropdownMenuItem>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <BellIcon />
                              Notifications
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuGroup>
                                  <DropdownMenuLabel>Notification Types</DropdownMenuLabel>
                                  <DropdownMenuCheckboxItem
                                    checked={notifications.push}
                                    onCheckedChange={(checked) =>
                                      setNotifications({
                                        ...notifications,
                                        push: checked === true,
                                      })
                                    }
                                  >
                                    <BellIcon />
                                    Push Notifications
                                  </DropdownMenuCheckboxItem>
                                  <DropdownMenuCheckboxItem
                                    checked={notifications.email}
                                    onCheckedChange={(checked) =>
                                      setNotifications({
                                        ...notifications,
                                        email: checked === true,
                                      })
                                    }
                                  >
                                    <MailIcon />
                                    Email Notifications
                                  </DropdownMenuCheckboxItem>
                                </DropdownMenuGroup>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem>
                            <ShieldIcon />
                            Privacy &amp; Security
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <HelpCircleIcon />
                    Help &amp; Support
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileTextIcon />
                    Documentation
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem variant="destructive">
                    <LogOutIcon />
                    Sign Out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="small-form-name">Name</FieldLabel>
                  <Input id="small-form-name" placeholder="Enter your name" required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="small-form-role">Role</FieldLabel>
                  <Select items={roleItems} defaultValue={null}>
                    <SelectTrigger id="small-form-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {roleItems.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="small-form-framework">Framework</FieldLabel>
                <Combobox items={frameworks}>
                  <ComboboxInput id="small-form-framework" placeholder="Select a framework" required />
                  <ComboboxContent>
                    <ComboboxEmpty>No frameworks found.</ComboboxEmpty>
                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem key={item} value={item}>
                          {item}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </Field>
              <Field>
                <FieldLabel htmlFor="small-form-comments">Comments</FieldLabel>
                <Textarea id="small-form-comments" placeholder="Add any additional comments" />
              </Field>
              <Field orientation="horizontal">
                <Button type="submit">Submit</Button>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </Example>
  )
}

function ButtonExample() {
  return (
    <Example title="Button">
      <div className="flex flex-wrap gap-2">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="link">Link</Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="xs">Extra Small</Button>
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
        <Button size="icon">
          <PlusIcon />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button disabled>Disabled</Button>
        <Button>
          <DownloadIcon data-icon="inline-start" />
          With Icon
        </Button>
      </div>
    </Example>
  )
}

function BadgeExample() {
  return (
    <Example title="Badge">
      <div className="flex flex-wrap gap-2">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="ghost">Ghost</Badge>
      </div>
    </Example>
  )
}

function AvatarExample() {
  return (
    <Example title="Avatar">
      <div className="flex flex-wrap items-center gap-4">
        <Avatar size="sm">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>SC</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>SC</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>SC</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
          <AvatarBadge />
        </Avatar>
      </div>
      <AvatarGroup>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>SC</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+3</AvatarGroupCount>
      </AvatarGroup>
    </Example>
  )
}

function AlertExample() {
  return (
    <Example title="Alert">
      <Alert>
        <BellIcon />
        <AlertTitle>New update available</AlertTitle>
        <AlertDescription>Version 2.0 is ready to install. Restart to apply changes.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <ShieldIcon />
        <AlertTitle>Security warning</AlertTitle>
        <AlertDescription>Your session will expire in 5 minutes. Please save your work.</AlertDescription>
        <AlertAction>
          <Button size="sm" variant="destructive">
            Extend
          </Button>
        </AlertAction>
      </Alert>
    </Example>
  )
}

function AccordionExample() {
  return (
    <Example title="Accordion">
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Is it styled?</AccordionTrigger>
          <AccordionContent>
            Yes. It comes with default styles that matches the other components&apos; aesthetic.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Is it animated?</AccordionTrigger>
          <AccordionContent>Yes. It&apos;s animated by default, but you can disable it if you prefer.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </Example>
  )
}

function TabsExample() {
  return (
    <Example title="Tabs">
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Make changes to your account here.</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="tabs-name">Name</FieldLabel>
                  <Input id="tabs-name" defaultValue="Pedro Duarte" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="tabs-username">Username</FieldLabel>
                  <Input id="tabs-username" defaultValue="@peduarte" />
                </Field>
              </FieldGroup>
            </CardContent>
            <CardFooter>
              <Button>Save changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Change your password here.</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="tabs-current-pw">Current password</FieldLabel>
                  <Input id="tabs-current-pw" type="password" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="tabs-new-pw">New password</FieldLabel>
                  <Input id="tabs-new-pw" type="password" />
                </Field>
              </FieldGroup>
            </CardContent>
            <CardFooter>
              <Button>Save password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Manage your preferences.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">No settings to configure yet.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Example>
  )
}

function TooltipExample() {
  return (
    <Example title="Tooltip">
      <TooltipProvider>
        <div className="flex flex-wrap gap-4">
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" />}>Hover me</TooltipTrigger>
            <TooltipContent>This is a tooltip</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" size="icon" />}>
              <SearchIcon />
              <span className="sr-only">Search</span>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              Search
              <KbdGroup>
                <Kbd>⌘</Kbd>
                <Kbd>K</Kbd>
              </KbdGroup>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" size="icon" />}>
              <TrashIcon />
              <span className="sr-only">Delete</span>
            </TooltipTrigger>
            <TooltipContent side="right">Delete item</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </Example>
  )
}

function DialogExample() {
  return (
    <Example title="Dialog">
      <div className="flex flex-wrap gap-2">
        <Dialog>
          <DialogTrigger render={<Button variant="outline" />}>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="dialog-name">Name</FieldLabel>
                <Input id="dialog-name" defaultValue="Pedro Duarte" />
              </Field>
              <Field>
                <FieldLabel htmlFor="dialog-username">Username</FieldLabel>
                <Input id="dialog-username" defaultValue="@peduarte" />
              </Field>
            </FieldGroup>
            <DialogFooter showCloseButton>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Example>
  )
}

function PopoverExample() {
  return (
    <Example title="Popover">
      <div className="flex flex-wrap gap-2">
        <Popover>
          <PopoverTrigger render={<Button variant="outline" />}>
            <CalendarIcon data-icon="inline-start" />
            Open Popover
          </PopoverTrigger>
          <PopoverContent>
            <PopoverHeader>
              <PopoverTitle>Popover Title</PopoverTitle>
              <PopoverDescription>This is a popover description with more context.</PopoverDescription>
            </PopoverHeader>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="popover-width">Width</FieldLabel>
                <Input id="popover-width" defaultValue="100%" />
              </Field>
              <Field>
                <FieldLabel htmlFor="popover-height">Height</FieldLabel>
                <Input id="popover-height" defaultValue="25px" />
              </Field>
            </FieldGroup>
            <Button className="w-full">Apply changes</Button>
          </PopoverContent>
        </Popover>
      </div>
    </Example>
  )
}

function HoverCardExample() {
  return (
    <Example title="Hover Card">
      <div className="flex flex-wrap gap-2">
        <HoverCard>
          <HoverCardTrigger>
            <Button variant="link">@nextjs</Button>
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="flex gap-3">
              <Avatar>
                <AvatarImage src="https://github.com/vercel.png" alt="@vercel" />
                <AvatarFallback>VC</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium">@nextjs</p>
                <p className="text-muted-foreground text-xs">
                  The React Framework – created and maintained by @vercel.
                </p>
                <div className="text-muted-foreground flex items-center gap-1 pt-1 text-xs">
                  <CalendarIcon className="size-3" />
                  Joined December 2021
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </Example>
  )
}

function ProgressExample() {
  return (
    <Example title="Progress">
      <Progress value={33}>
        <ProgressLabel>Uploading…</ProgressLabel>
        <ProgressValue>{(formatted: string | null) => formatted ?? "0%"}</ProgressValue>
      </Progress>
      <Progress value={66}>
        <ProgressLabel>Processing</ProgressLabel>
        <ProgressValue>{(formatted: string | null) => formatted ?? "0%"}</ProgressValue>
      </Progress>
      <Progress value={100}>
        <ProgressLabel>Complete</ProgressLabel>
        <ProgressValue>{(formatted: string | null) => formatted ?? "0%"}</ProgressValue>
      </Progress>
    </Example>
  )
}

function SliderExample() {
  const [value, setValue] = React.useState([40])
  const [range, setRange] = React.useState([20, 80])

  return (
    <Example title="Slider">
      <FieldGroup>
        <Field>
          <FieldLabel>Single value: {value[0]}</FieldLabel>
          <Slider
            defaultValue={value}
            onValueChange={(v) => setValue(Array.isArray(v) ? [...v] : [v])}
            min={0}
            max={100}
          />
        </Field>
        <Field>
          <FieldLabel>
            Range: {range[0]} – {range[1]}
          </FieldLabel>
          <Slider
            defaultValue={range}
            onValueChange={(v) => setRange(Array.isArray(v) ? [...v] : [v])}
            min={0}
            max={100}
          />
        </Field>
        <Field>
          <FieldLabel>Disabled</FieldLabel>
          <Slider defaultValue={[60]} disabled />
        </Field>
      </FieldGroup>
    </Example>
  )
}

function SwitchExample() {
  const [checked, setChecked] = React.useState(true)

  return (
    <Example title="Switch">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Switch id="sw-sm" size="sm" />
          <FieldLabel htmlFor="sw-sm">Small</FieldLabel>
        </div>
        <div className="flex items-center gap-3">
          <Switch id="sw-default" checked={checked} onCheckedChange={setChecked} />
          <FieldLabel htmlFor="sw-default">Default — {checked ? "On" : "Off"}</FieldLabel>
        </div>
        <div className="flex items-center gap-3">
          <Switch id="sw-disabled" disabled />
          <FieldLabel htmlFor="sw-disabled">Disabled</FieldLabel>
        </div>
      </div>
    </Example>
  )
}

function CheckboxExample() {
  const [checked, setChecked] = React.useState<boolean>(true)

  return (
    <Example title="Checkbox">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Checkbox id="cb-1" checked={checked} onCheckedChange={(v) => setChecked(v === true)} />
          <FieldLabel htmlFor="cb-1">Accept terms and conditions</FieldLabel>
        </div>
        <div className="flex items-center gap-3">
          <Checkbox id="cb-2" defaultChecked={false} />
          <FieldLabel htmlFor="cb-2">Subscribe to newsletter</FieldLabel>
        </div>
        <div className="flex items-center gap-3">
          <Checkbox id="cb-3" disabled />
          <FieldLabel htmlFor="cb-3">Disabled option</FieldLabel>
        </div>
      </div>
    </Example>
  )
}

function RadioGroupExample() {
  return (
    <Example title="Radio Group">
      <RadioGroup defaultValue="comfortable">
        <div className="flex items-center gap-3">
          <RadioGroupItem value="default" id="rg-1" />
          <FieldLabel htmlFor="rg-1">Default</FieldLabel>
        </div>
        <div className="flex items-center gap-3">
          <RadioGroupItem value="comfortable" id="rg-2" />
          <FieldLabel htmlFor="rg-2">Comfortable</FieldLabel>
        </div>
        <div className="flex items-center gap-3">
          <RadioGroupItem value="compact" id="rg-3" />
          <FieldLabel htmlFor="rg-3">Compact</FieldLabel>
        </div>
      </RadioGroup>
    </Example>
  )
}

function ToggleExample() {
  return (
    <Example title="Toggle">
      <div className="flex flex-wrap gap-2">
        <Toggle aria-label="Bold">
          <BoldIcon />
        </Toggle>
        <Toggle aria-label="Italic" variant="outline">
          <ItalicIcon />
        </Toggle>
        <Toggle aria-label="Underline" defaultPressed>
          <UnderlineIcon />
        </Toggle>
        <Toggle aria-label="Disabled" disabled>
          <EyeIcon />
        </Toggle>
      </div>
    </Example>
  )
}

function ToggleGroupExample() {
  return (
    <Example title="Toggle Group">
      <div className="flex flex-col gap-4">
        <ToggleGroup defaultValue={["center"]}>
          <ToggleGroupItem value="left" aria-label="Align left">
            <AlignLeftIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" aria-label="Align center">
            <AlignCenterIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Align right">
            <AlignRightIcon />
          </ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup variant="outline">
          <ToggleGroupItem value="bold" aria-label="Bold">
            <BoldIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Italic">
            <ItalicIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Underline">
            <UnderlineIcon />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </Example>
  )
}

function InputGroupExample() {
  return (
    <Example title="Input Group">
      <div className="flex flex-col gap-3">
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <InputGroupText>
              <SearchIcon />
            </InputGroupText>
          </InputGroupAddon>
          <InputGroupInput placeholder="Search…" />
        </InputGroup>
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <InputGroupText>https://</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput placeholder="example.com" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="xs">Go</InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <InputGroupText>$</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput placeholder="0.00" type="number" />
          <InputGroupAddon align="inline-end">
            <InputGroupText>USD</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </Example>
  )
}

function InputOTPExample() {
  return (
    <Example title="Input OTP">
      <div className="flex flex-col gap-4">
        <InputOTP maxLength={6}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
    </Example>
  )
}

function BreadcrumbExample() {
  return (
    <Example title="Breadcrumb">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Components</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </Example>
  )
}

function ButtonGroupExample() {
  return (
    <Example title="Button Group">
      <div className="flex flex-col gap-4">
        <ButtonGroup>
          <Button variant="outline">Previous</Button>
          <Button variant="outline">Current</Button>
          <Button variant="outline">Next</Button>
        </ButtonGroup>
        <ButtonGroup>
          <ButtonGroupText>
            <SearchIcon />
          </ButtonGroupText>
          <Input placeholder="Search…" className="rounded-none border-x-0 shadow-none focus-visible:ring-0" />
          <Button>Search</Button>
        </ButtonGroup>
        <ButtonGroup orientation="vertical">
          <Button variant="outline">
            <AlignLeftIcon />
            Left
          </Button>
          <ButtonGroupSeparator />
          <Button variant="outline">
            <AlignCenterIcon />
            Center
          </Button>
          <ButtonGroupSeparator />
          <Button variant="outline">
            <AlignRightIcon />
            Right
          </Button>
        </ButtonGroup>
      </div>
    </Example>
  )
}

function PaginationExample() {
  return (
    <Example title="Pagination">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">10</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </Example>
  )
}

const invoices = [
  { invoice: "INV001", status: "Paid", method: "Credit Card", amount: "$250.00" },
  { invoice: "INV002", status: "Pending", method: "PayPal", amount: "$150.00" },
  { invoice: "INV003", status: "Unpaid", method: "Bank Transfer", amount: "$350.00" },
  { invoice: "INV004", status: "Paid", method: "Credit Card", amount: "$450.00" },
]

function TableExample() {
  return (
    <Example title="Table" containerClassName="md:col-span-2">
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((inv) => (
            <TableRow key={inv.invoice}>
              <TableCell className="font-medium">{inv.invoice}</TableCell>
              <TableCell>
                <Badge
                  variant={inv.status === "Paid" ? "default" : inv.status === "Pending" ? "secondary" : "destructive"}
                >
                  {inv.status}
                </Badge>
              </TableCell>
              <TableCell>{inv.method}</TableCell>
              <TableCell className="text-right">{inv.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Example>
  )
}

function ItemExample() {
  return (
    <Example title="Item">
      <ItemGroup>
        <Item variant="outline">
          <ItemMedia variant="icon">
            <Package2Icon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Product Update</ItemTitle>
            <ItemDescription>New features added to the dashboard module.</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Badge variant="secondary">New</Badge>
          </ItemActions>
        </Item>
        <Item variant="outline">
          <ItemMedia variant="icon">
            <UsersIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Team Members</ItemTitle>
            <ItemDescription>3 new members joined your workspace.</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="ghost" size="icon-sm">
              <MoreHorizontalIcon />
            </Button>
          </ItemActions>
        </Item>
        <Item variant="muted">
          <ItemMedia variant="icon">
            <MailIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Inbox</ItemTitle>
            <ItemDescription>You have 5 unread messages.</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Badge>5</Badge>
          </ItemActions>
        </Item>
      </ItemGroup>
    </Example>
  )
}

function CollapsibleExample() {
  const [open, setOpen] = React.useState(false)

  return (
    <Example title="Collapsible">
      <Collapsible open={open} onOpenChange={setOpen} className="w-full space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">@peduarte starred 3 repositories</p>
          <CollapsibleTrigger render={<Button variant="ghost" size="icon-sm" />}>
            <ChevronDownIcon className={open ? "rotate-180 transition-transform" : "transition-transform"} />
            <span className="sr-only">Toggle</span>
          </CollapsibleTrigger>
        </div>
        <div className="rounded-md border px-4 py-3 text-sm font-mono">@radix-ui/primitives</div>
        <CollapsibleContent className="space-y-2">
          <div className="rounded-md border px-4 py-3 text-sm font-mono">@radix-ui/colors</div>
          <div className="rounded-md border px-4 py-3 text-sm font-mono">@stitches/react</div>
        </CollapsibleContent>
      </Collapsible>
    </Example>
  )
}

function EmptyExample() {
  return (
    <Example title="Empty">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderIcon />
          </EmptyMedia>
          <EmptyTitle>No files found</EmptyTitle>
          <EmptyDescription>Upload your first file to get started.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button>
            <PlusIcon data-icon="inline-start" />
            Upload file
          </Button>
        </EmptyContent>
      </Empty>
    </Example>
  )
}

function SkeletonExample() {
  return (
    <Example title="Skeleton">
      <div className="flex items-center gap-4">
        <Skeleton className="size-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <Skeleton className="aspect-video w-full rounded-lg" />
    </Example>
  )
}

function SpinnerExample() {
  return (
    <Example title="Spinner">
      <div className="flex flex-wrap items-center gap-6">
        <Spinner className="size-4" />
        <Spinner className="size-6" />
        <Spinner className="size-8" />
        <Button disabled>
          <Spinner />
          Loading…
        </Button>
      </div>
    </Example>
  )
}

function KbdExample() {
  return (
    <Example title="Kbd">
      <div className="flex flex-wrap items-center gap-4">
        <Kbd>⌘</Kbd>
        <Kbd>Enter</Kbd>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
        <KbdGroup>
          <Kbd>⇧</Kbd>
          <Kbd>⌘</Kbd>
          <Kbd>P</Kbd>
        </KbdGroup>
      </div>
    </Example>
  )
}

function SeparatorExample() {
  return (
    <Example title="Separator">
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium">Horizontal</p>
          <Separator className="my-3" />
          <p className="text-muted-foreground text-sm">Content below the separator</p>
        </div>
        <div className="flex h-8 items-center gap-4">
          <span className="text-sm">Left</span>
          <Separator orientation="vertical" />
          <span className="text-sm">Middle</span>
          <Separator orientation="vertical" />
          <span className="text-sm">Right</span>
        </div>
      </div>
    </Example>
  )
}
