import { prismadb } from "@/lib/prismadb";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarDateRangePicker } from "./components/date-range-picker";
import { Overview } from "./components/overview";
import { RecentSales } from "./components/recent-sales";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

interface DashboardPageProps {
  params: Promise<{ storeId: string }>;
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
  const { storeId } = await params;

  const store = await prismadb.store.findFirst({
    where: {
      id: storeId,
    },
  });

  return (
    <>
      <div className="flex-1 w-full overflow-x-hidden">
        <div className="flex-1 space-y-4 p-8 pt-6 max-w-full">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-3xl font-bold tracking-tight">
              <span className="text-muted-foreground">Welcome to </span>
              {store?.name}, <br />
              Dashboard
            </h2>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <CalendarDateRangePicker />
              <Button>Download</Button>
            </div>
          </div>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹1,47,800</div>
                <p className="text-xs text-green-500 font-medium flex items-center gap-1">
                  +10% from last month{" "}
                  <ArrowUpIcon className="h-4 w-4 text-green-500" />
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Low Stock Items: <strong>Tshirts</strong>
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">&lt; 50</div>
                <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                  -5% units <ArrowDownIcon className="h-4 w-4 text-red-500" />
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sales</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+18,480</div>
                <p className="text-xs text-green-500 font-medium flex items-center gap-1">
                  +5% from last month{" "}
                  <ArrowUpIcon className="h-4 w-4 text-green-500" />
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Orders
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-green-500 font-medium flex items-center gap-1">
                  +201 since last hour{" "}
                  <ArrowUpIcon className="h-4 w-4 text-green-500" />
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-7 w-full">
            <Card className="lg:col-span-4 w-full">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2 overflow-x-auto">
                <Overview />
              </CardContent>
            </Card>
            <Card className="lg:col-span-3 w-full">
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>
                  You made 265 sales this month.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentSales />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
