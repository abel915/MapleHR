import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetClose,
    SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
    PanelLeft,
    CalendarIcon,
    ChevronRight,
    UploadCloud,
    ArrowLeft,
    LogOut,
    X,
} from "lucide-react";
import * as React from "react";
import { format } from "date-fns";
import { Sidebar, SidebarProvider, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarFooter, SidebarTrigger } from '@/components/ui/sidebar';

const employeeFormFields = {
    personalDetails: [
        { label: "First Name", name: "firstName", type: "text", placeholder: "Harry" },
        { label: "Last Name", name: "lastName", type: "text", placeholder: "Styles" },
        { label: "Employee ID", name: "employeeId", type: "text", placeholder: "12345678" },
        { label: "Gender", name: "gender", type: "select", options: ["Male", "Female", "Other"] },
        { label: "Personal Email", name: "personalEmail", type: "email", placeholder: "email@personal.com" },
        { label: "Phone number", name: "phoneNumber", type: "tel", placeholder: "+1 234 56789" },
    ],
    workInformation: [
        { label: "Position", name: "position", type: "text", placeholder: "Manager" },
        { label: "Department", name: "department", type: "text", placeholder: "Administration" },
        { label: "Manager", name: "manager", type: "select", options: ["None", "Manager A", "Manager B"] },
        { label: "Joining Date", name: "joiningDate", type: "date" },
        { label: "Current Contract", name: "currentContract", type: "select", options: ["Full-time", "Part-time", "Contract"] },
        { label: "Work Email", name: "workEmail", type: "email", placeholder: "email@company.com" },
        { label: "Work Phone", name: "workPhone", type: "tel", placeholder: "+1 234 56789" },
    ],
    extraDetails: [
        { label: "Passport Number", name: "passportNumber", type: "text", placeholder: "12345678" },
        { label: "Date of birth", name: "dateOfBirth", type: "date" },
        { label: "Material status", name: "materialStatus", type: "select", options: ["Single", "Married"] },
        { label: "Emergency contact", name: "emergencyContact", type: "tel", placeholder: "+1 234 56789" },
        { label: "Nationality (Country)", name: "nationality", type: "select", options: ["UK", "USA", "Canada"] },
    ],
};

const EmployeeInput = ({ field }) => {
    return (
        <div className="space-y-2">
            <Label htmlFor={field.name} className="flex">
                {field.label}
                <span className="text-destructive">*</span>
            </Label>
            <Input
                id={field.name}
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
            />
        </div>
    );
};

const EmployeeSelect = ({ field }) => {
    return (
        <div className="space-y-2">
            <Label htmlFor={field.name} className="flex">
                {field.label}
                <span className="text-destructive">*</span>
            </Label>
            <Select defaultValue={field.options[0]}>
                <SelectTrigger id={field.name} className="w-full">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {field.options.map((option) => (
                        <SelectItem key={option} value={option}>
                            {option}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

const EmployeeDate = ({ field }) => {
    const [date, setDate] = React.useState<Date>();
    return (
        <div className="space-y-2">
            <Label htmlFor={field.name} className="flex">
                {field.label}
                <span className="text-destructive">*</span>
            </Label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default function Employees() {
    return (
        <div className="flex min-h-svh w-full text-slate-900">
            <SidebarProvider defaultOpen>
                <Sidebar className="hidden border-r bg-slate-50 md:flex flex-col">
                    <SidebarHeader className="flex items-center justify-center p-4">
                        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <img src="/src/assets/logo.png" className="w-6" alt="MapleHR" />
                            MapleHR
                        </h1>
                        <SidebarTrigger />
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupLabel>Menu</SidebarGroupLabel>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <a href="/dashboard">
                                            <span>Dashboard</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton isActive>
                                        <span>Employees</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <a href="#">
                                            <span>Access</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroup>
                    </SidebarContent>
                    <SidebarFooter>
                        <Button variant="ghost" className="w-full justify-start">
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </Button>
                    </SidebarFooter>
                </Sidebar>
                <main className="flex-1 overflow-y-auto">
                    <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background px-4">
                        <div className="flex items-center gap-4">
                            <div className="md:hidden">
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7">
                                            <PanelLeft />
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="left" className="w-64 p-0">
                                        <div className="flex h-full flex-col">
                                            <SheetHeader className="flex items-center justify-between p-4">
                                                <h1 className="text-xl">MapleHR</h1>
                                                <SheetClose className="h-7 w-7 p-1">
                                                    <X className="h-5 w-5" />
                                                </SheetClose>
                                            </SheetHeader>
                                            <div className="flex flex-1 flex-col overflow-y-auto">
                                                <SidebarContent>
                                                    <SidebarGroup>
                                                        <SidebarGroupLabel>Menu</SidebarGroupLabel>
                                                        <SidebarMenu>
                                                            <SidebarMenuItem>
                                                                <SidebarMenuButton asChild>
                                                                    <a href="/dashboard">
                                                                        <span>Dashboard</span>
                                                                    </a>
                                                                </SidebarMenuButton>
                                                            </SidebarMenuItem>
                                                            <SidebarMenuItem>
                                                                <SidebarMenuButton isActive>
                                                                    <span>Employees</span>
                                                                </SidebarMenuButton>
                                                            </SidebarMenuItem>
                                                            <SidebarMenuItem>
                                                                <SidebarMenuButton asChild>
                                                                    <a href="#">
                                                                        <span>Access</span>
                                                                    </a>
                                                                </SidebarMenuButton>
                                                            </SidebarMenuItem>
                                                        </SidebarMenu>
                                                    </SidebarGroup>
                                                </SidebarContent>
                                            </div>
                                            <SidebarFooter className="p-4 border-t">
                                                <Button variant="ghost" className="w-full justify-start">
                                                    <LogOut className="h-4 w-4 mr-2" />
                                                    Logout
                                                </Button>
                                            </SidebarFooter>
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator>
                                        <ChevronRight />
                                    </BreadcrumbSeparator>
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>Employees</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col text-right text-sm">
                                <span className="font-semibold">Mary Williams</span>
                                <span className="text-muted-foreground">Welcome back!</span>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-slate-200" />
                        </div>
                    </header>
                    <div className="px-6 py-4 md:px-8">
                        <div className="flex items-center gap-4 mb-6">
                            <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <h1 className="text-xl font-semibold">Edit Employee</h1>
                        </div>
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Personal Details</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                                        {employeeFormFields.personalDetails.map((field) =>
                                            field.type === "select" ? (
                                                <EmployeeSelect key={field.name} field={field} />
                                            ) : (
                                                <EmployeeInput key={field.name} field={field} />
                                            )
                                        )}
                                        {employeeFormFields.extraDetails.slice(0, 3).map((field) =>
                                            field.type === "date" ? (
                                                <EmployeeDate key={field.name} field={field} />
                                            ) : field.type === "select" ? (
                                                <EmployeeSelect key={field.name} field={field} />
                                            ) : (
                                                <EmployeeInput key={field.name} field={field} />
                                            )
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Work Information</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                                        {employeeFormFields.workInformation.map((field) =>
                                            field.type === "select" ? (
                                                <EmployeeSelect key={field.name} field={field} />
                                            ) : field.type === "date" ? (
                                                <EmployeeDate key={field.name} field={field} />
                                            ) : (
                                                <EmployeeInput key={field.name} field={field} />
                                            )
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Upload Documents</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors">
                                        <div className="text-center">
                                            <UploadCloud className="h-10 w-10 mx-auto text-muted-foreground" />
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                Upload file(s)
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Drag and drop files here
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex justify-end p-4">
                                <Button className="bg-green-600 hover:bg-green-700 text-white">
                                    Save Employee
                                </Button>
                            </div>
                        </div>
                    </div>
                </main>
            </SidebarProvider>
        </div>
    );
}
