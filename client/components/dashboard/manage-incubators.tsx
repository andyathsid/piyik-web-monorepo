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
        title: "Berhasil",
        description: "Inkubator berhasil ditambahkan",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menambahkan inkubator",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (deviceId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus inkubator ini?')) {
      const incubatorRef = ref(database, `users/${userId}/incubators/${deviceId}`);
      try {
        await remove(incubatorRef);
        fetchIncubators();
        toast({
          title: "Berhasil",
          description: "Inkubator berhasil dihapus",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Gagal menghapus inkubator",
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
        title: "Berhasil",
        description: "Jenis telur berhasil diperbarui",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memperbarui jenis telur",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tambah Inkubator Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deviceId">ID Perangkat</Label>
              <Input
                id="deviceId"
                value={newIncubator.deviceId}
                onChange={(e) => setNewIncubator({...newIncubator, deviceId: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nama</Label>
              <Input
                id="name"
                value={newIncubator.name}
                onChange={(e) => setNewIncubator({...newIncubator, name: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registeredBy">Didaftarkan Oleh</Label>
              <Input
                id="registeredBy"
                value={newIncubator.registeredBy}
                onChange={(e) => setNewIncubator({...newIncubator, registeredBy: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eggType">Jenis Telur</Label>
              <Select
                value={newIncubator.eggType}
                onValueChange={(value) => setNewIncubator({...newIncubator, eggType: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis telur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Chicken">Ayam</SelectItem>
                  <SelectItem value="Duck">Bebek</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">Tambah Inkubator</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inkubator Anda</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Perangkat</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Didaftarkan Oleh</TableHead>
                <TableHead>Tanggal Pendaftaran</TableHead>
                <TableHead>Jenis Telur</TableHead>
                <TableHead>Aksi</TableHead>
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
                        <SelectItem value="Chicken">Ayam</SelectItem>
                        <SelectItem value="Duck">Bebek</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(incubator.id)}
                    >
                      Hapus
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