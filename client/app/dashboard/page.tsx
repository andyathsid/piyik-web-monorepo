"use client";
import { useEffect, useActionState, startTransition, useState } from "react";
import { getAuthUser } from "@/actions/getAuthUser";
import { database } from "@/lib/firebase/client";
import { ref, onValue } from "firebase/database";
import Image from "next/image"
import { IconDroplets, IconTemperature, IconEgg } from '@tabler/icons-react';
import { motion } from "framer-motion";

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
import { UserNav } from "@/components/user-nav"
import { Spinner } from "@/components/ui/spinner";
import { ManageIncubators } from "@/components/dashboard/manage-incubators";
import { Navbar } from "@/components/Navbar";
import { SensorChart } from "@/components/dashboard/sensor-charts";

const MotionCard = motion(Card);

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

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

interface SensorHistoryData {
  timestamp: string;
  value: number;
}

export default function DashboardPage() {
  const [dashboardData, dashboardAction, pending] = useActionState(getAuthUser, {
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
  const [humidityHistory, setHumidityHistory] = useState<SensorHistoryData[]>([]);
  const [tempDHTHistory, setTempDHTHistory] = useState<SensorHistoryData[]>([]);
  const [thermocoupleHistory, setThermocoupleHistory] = useState<SensorHistoryData[]>([]);

  useEffect(() => {
    const fetchData = () => {
      startTransition(() => {
        dashboardAction();
      });
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!dashboardData?.user.id) return;
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
  }, [dashboardData?.user.id]);

  useEffect(() => {
    if (!dashboardData?.user.id || !selectedDevice) return;
    setIsSensorDataLoading(true);

    const sensorRef = ref(database, `users/${dashboardData.user.id}/incubators/${selectedDevice}/datasensor`);

    const unsubscribe = onValue(sensorRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const timestamp = new Date().toISOString();
        
        setSensorData({
          humidity: data.humidity ?? 0,
          tempdht: data.tempdht ?? 0,
          thermocouple: data.thermocouple ?? 0
        });

        setHumidityHistory(prev => [
          ...prev.slice(-29),
          { timestamp, value: data.humidity ?? 0 }
        ]);
        setTempDHTHistory(prev => [
          ...prev.slice(-29),
          { timestamp, value: data.tempdht ?? 0 }
        ]);
        setThermocoupleHistory(prev => [
          ...prev.slice(-29),
          { timestamp, value: data.thermocouple ?? 0 }
        ]);
      }
      setIsSensorDataLoading(false);
    });

    return () => unsubscribe();
  }, [dashboardData?.user.id, selectedDevice]);

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
      <motion.div
        className="hidden flex-col md:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {pending ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center h-screen"
          >
            <Spinner size="large">Memuat dashboard...</Spinner>
          </motion.div>
        ) : (
          <div className="hidden flex-col md:flex">
            <div className="border-b">
              <div className="flex h-16 items-center px-4">
                <Navbar />
                <div className="ml-auto flex items-center space-x-4 relative">
                  <Spinner show={isDevicesLoading} size="small" />
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
                    Ikhtisar
                  </TabsTrigger>
                  <TabsTrigger value="manage-incubators">
                    Kelola Inkubator
                  </TabsTrigger>
                </TabsList>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabsContent value="overview" className="space-y-4">
                    <div className="flex items-center justify-start relative ">
                      <Spinner show={isDevicesLoading} size="small" />
                      <DeviceSwitcher
                        devices={devices}
                        selectedDevice={selectedDevice}
                        onDeviceSelect={setSelectedDevice}
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3 relative">
                      <Spinner show={isSensorDataLoading} size="medium">
                        Memuat data sensor...
                      </Spinner>
                      
                      <MotionCard
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.5, delay: 0.1 }}
                      >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                            Kelembaban
                          </CardTitle>
                          <IconDroplets className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-2xl font-bold"
                          >
                            {sensorData.humidity.toFixed(1)}%
                          </motion.div>
                          <motion.p 
                            className="text-xs text-muted-foreground"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            {hasUpdate ? (sensorData.humidity - previousData.humidity).toFixed(1) : '0'}% dari pembacaan sebelumnya
                          </motion.p>
                        </CardContent>
                      </MotionCard>

                      <MotionCard
                        initial="hidden"
                        animate="visible"
                        variants={cardVariants}
                      >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                            Suhu DHT
                          </CardTitle>
                          <IconTemperature className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{sensorData.tempdht.toFixed(1)}°C</div>
                          <p className="text-xs text-muted-foreground">
                            {hasUpdate ? (sensorData.tempdht - previousData.tempdht).toFixed(1) : '0'}°C dari pembacaan sebelumnya
                          </p>
                        </CardContent>
                      </MotionCard>

                      <MotionCard
                        initial="hidden"
                        animate="visible"
                        variants={cardVariants}
                      >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                            Suhu Thermocouple
                          </CardTitle>
                          <IconEgg className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{sensorData.thermocouple.toFixed(1)}°C</div>
                          <p className="text-xs text-muted-foreground">
                            {hasUpdate ? (sensorData.thermocouple - previousData.thermocouple).toFixed(1) : '0'}°C dari pembacaan sebelumnya
                          </p>
                        </CardContent>
                      </MotionCard>
                    </div>
                    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3 relative mt-4">
                      <SensorChart
                        data={humidityHistory}
                        title="Kelembaban"
                        unit="%"
                        color="hsl(var(--primary))"
                      />
                      <SensorChart
                        data={tempDHTHistory}
                        title="Suhu DHT"
                        unit="°C"
                        color="hsl(var(--destructive))"
                      />
                      <SensorChart
                        data={thermocoupleHistory}
                        title="Suhu Thermocouple"
                        unit="°C"
                        color="hsl(var(--warning))"
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="manage-incubators" className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <ManageIncubators userId={dashboardData?.user.id ?? ''} />
                    </motion.div>
                  </TabsContent>
                </motion.div>
              </Tabs>
            </div>
          </div>
        )}
      </motion.div>
    </>
  )
}