import { useState, useEffect } from 'react';
import { database } from '@/lib/firebase/client';
import { ref, set, remove, get } from 'firebase/database';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface ManageIncubatorsProps {
  userId: string;
}

interface Incubator {
  id: string;
  deviceId: string;
  name: string;
  registeredBy: string;
  registeredAt: string;
  settings?: {
    isIncubating: boolean;
    jenistelur: string;
    remainingDays: number;
    totalDays: number;
  };
}

export function ManageIncubators({ userId }: ManageIncubatorsProps) {
  const { toast } = useToast();
  const [incubators, setIncubators] = useState<Incubator[]>([]);
  const [newIncubator, setNewIncubator] = useState({
    deviceId: '',
    name: '',
    registeredBy: '',
    eggType: 'Chicken'
  });

  useEffect(() => {
    if (userId) {
      fetchIncubators();
    }
  }, [userId]);

  const fetchIncubators = async () => {
    const incubatorsRef = ref(database, `users/${userId}/incubators`);
    const snapshot = await get(incubatorsRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const incubatorList = Object.entries(data).map(([id, value]: [string, any]) => ({
        id,
        ...value
      }));
      setIncubators(incubatorList);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const incubatorRef = ref(database, `users/${userId}/incubators/${newIncubator.deviceId}`);

    const incubatorData = {
      deviceId: newIncubator.deviceId,
      name: newIncubator.name,
      registeredBy: newIncubator.registeredBy,
      registeredAt: new Date().toISOString(),
      datasensor: {
        humidity: 0,
        tempdht: 0,
        thermocouple: 0
      },
      settings: {
        isIncubating: false,
        jenistelur: newIncubator.eggType.toLowerCase() === 'chicken' ? 'ayam' : 'bebek',
        remainingDays: 0,
        totalDays: 0
      }
    };

    try {
      await set(incubatorRef, incubatorData);
      setNewIncubator({ deviceId: '', name: '', registeredBy: '', eggType: 'Chicken' });
      fetchIncubators();
      toast({
        title: "Success",
        description: "Incubator added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add incubator",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (deviceId: string) => {
    if (confirm('Are you sure you want to delete this incubator?')) {
      const incubatorRef = ref(database, `users/${userId}/incubators/${deviceId}`);
      try {
        await remove(incubatorRef);
        fetchIncubators();
        toast({
          title: "Success",
          description: "Incubator deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete incubator",
          variant: "destructive",
        });
      }
    }
  };

  const handleEggTypeUpdate = async (deviceId: string, newEggType: string) => {
    const incubatorRef = ref(database, `users/${userId}/incubators/${deviceId}/settings`);
    try {
      await set(incubatorRef, {
        isIncubating: false,
        jenistelur: newEggType.toLowerCase() === 'chicken' ? 'ayam' : 'bebek',
        remainingDays: 0,
        totalDays: 0
      });
      fetchIncubators();
      toast({
        title: "Success",
        description: "Egg type updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update egg type",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Incubator</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deviceId">Device ID</Label>
              <Input
                id="deviceId"
                value={newIncubator.deviceId}
                onChange={(e) => setNewIncubator({...newIncubator, deviceId: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newIncubator.name}
                onChange={(e) => setNewIncubator({...newIncubator, name: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registeredBy">Registered By</Label>
              <Input
                id="registeredBy"
                value={newIncubator.registeredBy}
                onChange={(e) => setNewIncubator({...newIncubator, registeredBy: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eggType">Egg Type</Label>
              <Select
                value={newIncubator.eggType}
                onValueChange={(value) => setNewIncubator({...newIncubator, eggType: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select egg type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Chicken">Chicken</SelectItem>
                  <SelectItem value="Duck">Duck</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">Add Incubator</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Incubators</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Registered By</TableHead>
                <TableHead>Registered At</TableHead>
                <TableHead>Egg Type</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incubators.map((incubator) => (
                <TableRow key={incubator.id}>
                  <TableCell>{incubator.deviceId}</TableCell>
                  <TableCell>{incubator.name}</TableCell>
                  <TableCell>{incubator.registeredBy}</TableCell>
                  <TableCell>{new Date(incubator.registeredAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Select
                      value={incubator.settings?.jenistelur === 'ayam' ? 'Chicken' : 'Duck'}
                      onValueChange={(value) => handleEggTypeUpdate(incubator.deviceId, value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Chicken">Chicken</SelectItem>
                        <SelectItem value="Duck">Duck</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(incubator.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 