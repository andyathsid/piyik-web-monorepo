"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface Device {
  id: string;
  deviceId: string;
  name: string;
  registeredBy: string;
}

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface DeviceSwitcherProps extends PopoverTriggerProps {
  devices: Device[];
  selectedDevice: string | null;
  onDeviceSelect: (deviceId: string) => void;
}

export default function DeviceSwitcher({ 
  className,
  devices,
  selectedDevice,
  onDeviceSelect
}: DeviceSwitcherProps) {
  const [open, setOpen] = React.useState(false)

  const currentDevice = devices.find(d => d.id === selectedDevice) || devices[0]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a device"
          className={cn("w-[300px] justify-between", className)}
        >
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">Monitored Device:</span>
            <span>{currentDevice ? `ID: ${currentDevice.deviceId}` : 'Select Device'}</span>
          </div>
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search device..." />
          <CommandList>
            <CommandEmpty>No device found.</CommandEmpty>
            <CommandGroup>
              {devices.map((device) => (
                <CommandItem
                  key={device.id}
                  onSelect={() => {
                    onDeviceSelect(device.id)
                    setOpen(false)
                  }}
                  className="text-sm"
                >
                  {`ID: ${device.deviceId} - Added by ${device.registeredBy}`}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedDevice === device.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
        </Command>
      </PopoverContent>
    </Popover>
  )
}