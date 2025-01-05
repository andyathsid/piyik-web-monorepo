"use client";
import { useEffect, useActionState, startTransition, useState } from "react";
import { getDashboardData } from "@/app/actions/dashboard";
import { database } from "@/lib/firebase/client";
import { ref, onValue } from "firebase/database";
import Image from "next/image"
import { IconDroplets, IconTemperature, IconEgg } from '@tabler/icons-react';

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { CalendarDateRangePicker } from "@/components/dashboard/date-range-picker"
import { MainNav } from "@/components/dashboard/main-nav"
import DeviceSwitcher from "@/components/dashboard/device-switcher"
import { UserNav } from "@/components/dashboard/user-nav"
import { Spinner } from "@/components/ui/spinner";
import { ManageIncubators } from "@/components/dashboard/manage-incubators";

interface SensorData {
  humidity: number;
  tempdht: number;
  thermocouple: number;
}

interface Device {
  id: string;
  deviceId: string;
  name: string;
  registeredBy: string;
}

export default function DashboardPage() {
  const [dashboardData, dashboardAction, pending] = useActionState(getDashboardData, {
    user: {
      id: '',
      name: '',
      email: '',
    },
    error: '',
    success: false,
  });

  const [sensorData, setSensorData] = useState<SensorData>({
    humidity: 0,
    tempdht: 0,
    thermocouple: 0
  });

  const [previousData, setPreviousData] = useState<SensorData>({
    humidity: 0,
    tempdht: 0,
    thermocouple: 0
  });

  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  const [hasUpdate, setHasUpdate] = useState<boolean>(false);
  const [isDevicesLoading, setIsDevicesLoading] = useState(true);
  const [isSensorDataLoading, setIsSensorDataLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      startTransition(() => {
        dashboardAction();
      });
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!dashboardData.user.id) return;
    setIsDevicesLoading(true);

    const devicesRef = ref(database, `users/${dashboardData.user.id}/incubators`);

    const unsubscribe = onValue(devicesRef, (snapshot) => {
      if (snapshot.exists()) {
        const devicesData = snapshot.val();
        const devicesList = Object.entries(devicesData).map(([id, data]: [string, any]) => ({
          id,
          deviceId: data.deviceId || id,
          name: data.name || `Device ${id}`,
          registeredBy: data.registeredBy || 'Unknown'
        }));
        setDevices(devicesList);

        if (!selectedDevice && devicesList.length > 0) {
          setSelectedDevice(devicesList[0].id);
        }
      }
      setIsDevicesLoading(false);
    });

    return () => unsubscribe();
  }, [dashboardData.user.id]);

  useEffect(() => {
    if (!dashboardData.user.id || !selectedDevice) return;
    setIsSensorDataLoading(true);

    setSensorData({
      humidity: 0,
      tempdht: 0,
      thermocouple: 0
    });

    setPreviousData({
      humidity: 0,
      tempdht: 0,
      thermocouple: 0
    });

    setHasUpdate(false);

    const sensorRef = ref(database, `users/${dashboardData.user.id}/incubators/${selectedDevice}/datasensor`);

    let lastValues = {
      humidity: 0,
      tempdht: 0,
      thermocouple: 0
    };

    const unsubscribe = onValue(sensorRef, (snapshot) => {
      if (snapshot.exists()) {
        if (lastValues.humidity !== 0) {
          setPreviousData(lastValues);
          setHasUpdate(true);
        }
        const data = snapshot.val();
        lastValues = {
          humidity: data.humidity ?? 0,
          tempdht: data.tempdht ?? 0,
          thermocouple: data.thermocouple ?? 0
        };
        setSensorData(lastValues);
      }
      setIsSensorDataLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [dashboardData.user.id, selectedDevice]);

  // const router = useRouter();

  // useEffect(() => {
  //   if (!pending && !dashboardData.success) {
  //     redirect("/login");
  //   }
  // }, [dashboardData.success, pending, router, dashboardData.error]);

  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/dashboard-light.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="block dark:hidden"
        />
        <Image
          src="/examples/dashboard-dark.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4 relative">
              <Spinner show={isDevicesLoading} size="small" />
              <UserNav 
                userName={dashboardData?.user?.name as string}
                userEmail={dashboardData?.user?.email as string}
                userId={dashboardData?.user?.id as string}
              />
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">
                Overview
              </TabsTrigger>
              <TabsTrigger value="manage-incubators">
                Manage Incubators
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="flex items-center justify-start space-x-2 relative">
                <Spinner show={isDevicesLoading} size="small" />
                <DeviceSwitcher
                  devices={devices}
                  selectedDevice={selectedDevice}
                  onDeviceSelect={setSelectedDevice}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3 relative">
                <Spinner show={isSensorDataLoading} size="medium">
                  Loading sensor data...
                </Spinner>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Humidity
                    </CardTitle>
                    <IconDroplets className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{sensorData.humidity.toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground">
                      {hasUpdate ? (sensorData.humidity - previousData.humidity).toFixed(1) : '0'}% from previous reading
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      DHT Temperature
                    </CardTitle>
                    <IconTemperature className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{sensorData.tempdht.toFixed(1)}°C</div>
                    <p className="text-xs text-muted-foreground">
                      {hasUpdate ? (sensorData.tempdht - previousData.tempdht).toFixed(1) : '0'}°C from previous reading
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Thermocouple Temperature
                    </CardTitle>
                    <IconEgg className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{sensorData.thermocouple.toFixed(1)}°C</div>
                    <p className="text-xs text-muted-foreground">
                      {hasUpdate ? (sensorData.thermocouple - previousData.thermocouple).toFixed(1) : '0'}°C from previous reading
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="manage-incubators" className="space-y-4">
              <ManageIncubators userId={dashboardData.user.id} />
            </TabsContent>
          </Tabs>

        </div>
      </div>
    </>
  )
}