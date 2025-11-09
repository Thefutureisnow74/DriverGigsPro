import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Truck, 
  Plus, 
  Calendar, 
  MapPin, 
  Gauge, 
  Wrench,
  FileText,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Clock,
  Car,
  Fuel
} from "lucide-react";

const vehicleTypes = [
  "Car",
  "SUV/Minivan", 
  "Cargo Van",
  "Sprinter Van",
  "Pickup Truck",
  "Box Truck",
  "Box Truck - 10 ft",
  "Box Truck - 12 ft",
  "Box Truck - 14 ft",
  "Box Truck - 15 ft",
  "Box Truck - 16 ft",
  "Box Truck - 20 ft",
  "Box Truck - 22 ft",
  "Box Truck - 24 ft",
  "Box Truck - 26 ft",
  "Flatbed Truck",
  "Stakebed Truck",
  "Hotshot Trailer",
  "Flatbed Semi",
  "Dry Van Semi",
  "Electric Delivery Van",
  "Reefer Truck"
];

// Sample vehicle data
const initialVehicles = [
  {
    id: 1,
    nickname: "Primary Delivery",
    year: "2019",
    make: "Ford",
    model: "Transit Connect",
    vehicleType: "Cargo Van",
    color: "White",
    vin: "1FTBW2CM6KKA12345",
    licensePlate: "ABC123",
    state: "GA",
    mileage: 87500,
    fuelType: "Gasoline",
    mpg: 24,
    status: "active",
    registrationExpiry: "2024-06-30",
    inspectionExpiry: "2024-03-15",
    insuranceExpiry: "2024-12-15",
    lastMaintenance: "2023-11-20",
    nextMaintenanceDue: "2024-02-20",
    notes: "Primary vehicle for DoorDash and Amazon deliveries",
    purchaseDate: "2020-03-15",
    purchasePrice: 18500,
    currentValue: 14000,
    dateOfEntry: "2024-01-02",
    monthlyPayment: 0,
    activeApps: ["DoorDash", "Amazon Flex", "Instacart"],
    totalLength: 15.5,
    cubicFeet: 104.3,
    insideLength: 6.1,
    insideWidth: 5.4
  },
  {
    id: 2,
    nickname: "Rideshare Vehicle",
    year: "2020",
    make: "Toyota",
    model: "Camry",
    vehicleType: "Car",
    color: "Black",
    vin: "4T1G11AK8LU123456",
    licensePlate: "XYZ789",
    state: "GA",
    mileage: 62000,
    fuelType: "Gasoline",
    mpg: 32,
    status: "active",
    registrationExpiry: "2024-08-31",
    inspectionExpiry: "2024-05-10",
    insuranceExpiry: "2024-12-15",
    lastMaintenance: "2023-12-05",
    nextMaintenanceDue: "2024-03-05",
    notes: "Used for Uber and Lyft rides",
    purchaseDate: "2020-07-10",
    purchasePrice: 22000,
    currentValue: 18500,
    dateOfEntry: "2024-01-03",
    monthlyPayment: 385,
    activeApps: ["Uber", "Lyft"],
    totalLength: 16.1,
    cubicFeet: 15.1,
    insideLength: 5.2,
    insideWidth: 4.8
  },
  {
    id: 3,
    nickname: "Weekend Hauler",
    year: "2018",
    make: "Chevrolet",
    model: "Silverado",
    vehicleType: "Pickup Truck",
    color: "Red",
    vin: "1GCUKREC8JZ123789",
    licensePlate: "TRK456",
    state: "GA",
    mileage: 95000,
    fuelType: "Gasoline",
    mpg: 18,
    status: "maintenance",
    registrationExpiry: "2024-04-15",
    inspectionExpiry: "2024-01-30",
    insuranceExpiry: "2024-12-15",
    lastMaintenance: "2024-01-05",
    nextMaintenanceDue: "2024-04-05",
    notes: "Used for GoShare and Pickup moving jobs",
    purchaseDate: "2019-01-20",
    purchasePrice: 28000,
    currentValue: 22000,
    dateOfEntry: "2024-01-01",
    monthlyPayment: 425,
    activeApps: ["GoShare", "Pickup"],
    totalLength: 19.3,
    cubicFeet: 61.7,
    insideLength: 6.6,
    insideWidth: 5.8
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "maintenance":
      return "bg-yellow-100 text-yellow-800";
    case "inactive":
      return "bg-gray-100 text-gray-800";
    case "repair":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active":
      return <CheckCircle className="h-4 w-4" />;
    case "maintenance":
      return <Wrench className="h-4 w-4" />;
    case "inactive":
      return <Clock className="h-4 w-4" />;
    case "repair":
      return <AlertTriangle className="h-4 w-4" />;
    default:
      return <Car className="h-4 w-4" />;
  }
};

const getVehicleIcon = (vehicleType: string) => {
  if (vehicleType.includes("Semi") || vehicleType.includes("Truck") || vehicleType.includes("Van")) {
    return <Truck className="h-5 w-5" />;
  }
  return <Car className="h-5 w-5" />;
};

export default function MyFleet() {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [isEditVehicleOpen, setIsEditVehicleOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const [newVehicle, setNewVehicle] = useState({
    nickname: '',
    year: '',
    make: '',
    model: '',
    vehicleType: '',
    color: '',
    vin: '',
    licensePlate: '',
    state: 'GA',
    mileage: '',
    fuelType: 'Gasoline',
    mpg: '',
    registrationExpiry: '',
    inspectionExpiry: '',
    insuranceExpiry: '',
    purchaseDate: '',
    purchasePrice: '',
    currentValue: '',
    dateOfEntry: '',
    monthlyPayment: '',
    notes: '',
    totalLength: '',
    cubicFeet: '',
    insideLength: '',
    insideWidth: ''
  });

  const handleAddVehicle = () => {
    if (newVehicle.nickname && newVehicle.make && newVehicle.model && newVehicle.vehicleType) {
      const vehicle = {
        id: Date.now(),
        nickname: newVehicle.nickname,
        year: newVehicle.year,
        make: newVehicle.make,
        model: newVehicle.model,
        vehicleType: newVehicle.vehicleType,
        color: newVehicle.color,
        vin: newVehicle.vin,
        licensePlate: newVehicle.licensePlate,
        state: newVehicle.state,
        mileage: parseInt(newVehicle.mileage) || 0,
        fuelType: newVehicle.fuelType,
        mpg: parseInt(newVehicle.mpg) || 0,
        status: "active",
        registrationExpiry: newVehicle.registrationExpiry,
        inspectionExpiry: newVehicle.inspectionExpiry,
        insuranceExpiry: newVehicle.insuranceExpiry,
        lastMaintenance: "",
        nextMaintenanceDue: "",
        notes: newVehicle.notes,
        purchaseDate: newVehicle.purchaseDate,
        purchasePrice: parseFloat(newVehicle.purchasePrice) || 0,
        currentValue: parseFloat(newVehicle.currentValue) || 0,
        dateOfEntry: newVehicle.dateOfEntry,
        monthlyPayment: parseFloat(newVehicle.monthlyPayment) || 0,
        activeApps: [],
        totalLength: parseFloat(newVehicle.totalLength) || 0,
        cubicFeet: parseFloat(newVehicle.cubicFeet) || 0,
        insideLength: parseFloat(newVehicle.insideLength) || 0,
        insideWidth: parseFloat(newVehicle.insideWidth) || 0
      };
      
      setVehicles(prev => [...prev, vehicle]);
      setNewVehicle({
        nickname: '',
        year: '',
        make: '',
        model: '',
        vehicleType: '',
        color: '',
        vin: '',
        licensePlate: '',
        state: 'GA',
        mileage: '',
        fuelType: 'Gasoline',
        mpg: '',
        registrationExpiry: '',
        inspectionExpiry: '',
        insuranceExpiry: '',
        purchaseDate: '',
        purchasePrice: '',
        currentValue: '',
        dateOfEntry: '',
        monthlyPayment: '',
        notes: '',
        totalLength: '',
        cubicFeet: '',
        insideLength: '',
        insideWidth: ''
      });
      setIsAddVehicleOpen(false);
    }
  };

  const handleDeleteVehicle = (vehicleId: number) => {
    setVehicles(prev => prev.filter(vehicle => vehicle.id !== vehicleId));
  };

  const handleEditVehicle = (vehicle: any) => {
    setEditingVehicle({
      ...vehicle,
      mileage: vehicle.mileage.toString(),
      mpg: vehicle.mpg.toString(),
      purchasePrice: vehicle.purchasePrice.toString(),
      currentValue: vehicle.currentValue.toString(),
      monthlyPayment: vehicle.monthlyPayment.toString(),
      totalLength: vehicle.totalLength.toString(),
      cubicFeet: vehicle.cubicFeet.toString(),
      insideLength: vehicle.insideLength.toString(),
      insideWidth: vehicle.insideWidth.toString()
    });
    setIsEditVehicleOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingVehicle && editingVehicle.nickname && editingVehicle.make && editingVehicle.model) {
      const updatedVehicle = {
        ...editingVehicle,
        mileage: parseInt(editingVehicle.mileage) || 0,
        mpg: parseInt(editingVehicle.mpg) || 0,
        purchasePrice: parseFloat(editingVehicle.purchasePrice) || 0,
        currentValue: parseFloat(editingVehicle.currentValue) || 0,
        monthlyPayment: parseFloat(editingVehicle.monthlyPayment) || 0,
        totalLength: parseFloat(editingVehicle.totalLength) || 0,
        cubicFeet: parseFloat(editingVehicle.cubicFeet) || 0,
        insideLength: parseFloat(editingVehicle.insideLength) || 0,
        insideWidth: parseFloat(editingVehicle.insideWidth) || 0
      };
      
      setVehicles(prev => prev.map(vehicle => 
        vehicle.id === editingVehicle.id ? updatedVehicle : vehicle
      ));
      
      setEditingVehicle(null);
      setIsEditVehicleOpen(false);
    }
  };

  const handleVehicleCardClick = (vehicle: any) => {
    handleEditVehicle(vehicle);
  };

  const isExpiringOrExpired = (dateStr: string) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
    return date <= thirtyDaysFromNow;
  };

  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.filter(v => v.status === "active").length;
  const totalMileage = vehicles.reduce((sum, v) => sum + v.mileage, 0);
  const averageMPG = vehicles.reduce((sum, v) => sum + v.mpg, 0) / vehicles.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
              <Truck className="text-blue-600" />
              <span>My Fleet</span>
            </h1>
            <p className="text-gray-600 mt-1">Manage and track your vehicles</p>
          </div>
          <div className="flex space-x-3">
            <Link href="/car-rentals">
              <Button 
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Car className="mr-2 h-4 w-4" />
                Where to Rent A Car
              </Button>
            </Link>
            <Dialog open={isAddVehicleOpen} onOpenChange={setIsAddVehicleOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Vehicle
                </Button>
              </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Vehicle</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Vehicle Nickname</label>
                  <Input
                    value={newVehicle.nickname}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, nickname: e.target.value }))}
                    placeholder="e.g. Primary Delivery"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Vehicle Type</label>
                  <Select value={newVehicle.vehicleType} onValueChange={(value) => setNewVehicle(prev => ({ ...prev, vehicleType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Year</label>
                  <Input
                    value={newVehicle.year}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, year: e.target.value }))}
                    placeholder="2020"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Make</label>
                  <Input
                    value={newVehicle.make}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, make: e.target.value }))}
                    placeholder="Ford"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Model</label>
                  <Input
                    value={newVehicle.model}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, model: e.target.value }))}
                    placeholder="Transit"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Color</label>
                  <Input
                    value={newVehicle.color}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, color: e.target.value }))}
                    placeholder="White"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">VIN</label>
                  <Input
                    value={newVehicle.vin}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, vin: e.target.value }))}
                    placeholder="1FTBW2CM6KKA12345"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">License Plate</label>
                  <Input
                    value={newVehicle.licensePlate}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, licensePlate: e.target.value }))}
                    placeholder="ABC123"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">State</label>
                  <Input
                    value={newVehicle.state}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, state: e.target.value }))}
                    placeholder="GA"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Current Mileage</label>
                  <Input
                    type="number"
                    value={newVehicle.mileage}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, mileage: e.target.value }))}
                    placeholder="50000"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Fuel Type</label>
                  <Select value={newVehicle.fuelType} onValueChange={(value) => setNewVehicle(prev => ({ ...prev, fuelType: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Gasoline">Gasoline</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">MPG</label>
                  <Input
                    type="number"
                    value={newVehicle.mpg}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, mpg: e.target.value }))}
                    placeholder="25"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Registration Expiry</label>
                  <Input
                    type="date"
                    value={newVehicle.registrationExpiry}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, registrationExpiry: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Inspection Expiry</label>
                  <Input
                    type="date"
                    value={newVehicle.inspectionExpiry}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, inspectionExpiry: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Insurance Expiry</label>
                  <Input
                    type="date"
                    value={newVehicle.insuranceExpiry}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, insuranceExpiry: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Purchase Date</label>
                  <Input
                    type="date"
                    value={newVehicle.purchaseDate}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, purchaseDate: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Purchase Price ($)</label>
                  <Input
                    type="number"
                    value={newVehicle.purchasePrice}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, purchasePrice: e.target.value }))}
                    placeholder="25000"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Current Value ($)</label>
                  <Input
                    type="number"
                    value={newVehicle.currentValue}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, currentValue: e.target.value }))}
                    placeholder="20000"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Date of Entry</label>
                  <Input
                    type="date"
                    value={newVehicle.dateOfEntry}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, dateOfEntry: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Monthly Payment ($)</label>
                  <Input
                    type="number"
                    value={newVehicle.monthlyPayment}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, monthlyPayment: e.target.value }))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Total Vehicle Length (ft)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={newVehicle.totalLength}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, totalLength: e.target.value }))}
                    placeholder="15.5"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Cubic Feet</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={newVehicle.cubicFeet}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, cubicFeet: e.target.value }))}
                    placeholder="104.3"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Inside Length (ft)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={newVehicle.insideLength}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, insideLength: e.target.value }))}
                    placeholder="6.1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Inside Width (ft)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={newVehicle.insideWidth}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, insideWidth: e.target.value }))}
                    placeholder="5.4"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium">Notes</label>
                  <Textarea
                    value={newVehicle.notes}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes about this vehicle"
                    rows={3}
                  />
                </div>
                <div className="col-span-2 flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddVehicleOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddVehicle}>
                    Add Vehicle
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          </div>
        </div>
      </header>

      {/* Edit Vehicle Dialog */}
      <Dialog open={isEditVehicleOpen} onOpenChange={setIsEditVehicleOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Vehicle: {editingVehicle?.nickname}</DialogTitle>
          </DialogHeader>
          {editingVehicle && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Vehicle Nickname</label>
                <Input
                  value={editingVehicle.nickname}
                  onChange={(e) => setEditingVehicle(prev => ({ ...prev, nickname: e.target.value }))}
                  placeholder="e.g. Primary Delivery"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Vehicle Type</label>
                <Select value={editingVehicle.vehicleType} onValueChange={(value) => setEditingVehicle(prev => ({ ...prev, vehicleType: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Year</label>
                <Input
                  value={editingVehicle.year}
                  onChange={(e) => setEditingVehicle(prev => ({ ...prev, year: e.target.value }))}
                  placeholder="2020"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Make</label>
                <Input
                  value={editingVehicle.make}
                  onChange={(e) => setEditingVehicle(prev => ({ ...prev, make: e.target.value }))}
                  placeholder="Ford"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Model</label>
                <Input
                  value={editingVehicle.model}
                  onChange={(e) => setEditingVehicle(prev => ({ ...prev, model: e.target.value }))}
                  placeholder="Transit"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Color</label>
                <Input
                  value={editingVehicle.color}
                  onChange={(e) => setEditingVehicle(prev => ({ ...prev, color: e.target.value }))}
                  placeholder="White"
                />
              </div>
              <div>
                <label className="text-sm font-medium">VIN</label>
                <Input
                  value={editingVehicle.vin}
                  onChange={(e) => setEditingVehicle(prev => ({ ...prev, vin: e.target.value }))}
                  placeholder="1FTBW2CM6KKA12345"
                />
              </div>
              <div>
                <label className="text-sm font-medium">License Plate</label>
                <Input
                  value={editingVehicle.licensePlate}
                  onChange={(e) => setEditingVehicle(prev => ({ ...prev, licensePlate: e.target.value }))}
                  placeholder="ABC123"
                />
              </div>
              <div>
                <label className="text-sm font-medium">State</label>
                <Input
                  value={editingVehicle.state}
                  onChange={(e) => setEditingVehicle(prev => ({ ...prev, state: e.target.value }))}
                  placeholder="GA"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Current Mileage</label>
                <Input
                  type="number"
                  value={editingVehicle.mileage}
                  onChange={(e) => setEditingVehicle(prev => ({ ...prev, mileage: e.target.value }))}
                  placeholder="50000"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Fuel Type</label>
                <Select value={editingVehicle.fuelType} onValueChange={(value) => setEditingVehicle(prev => ({ ...prev, fuelType: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Gasoline">Gasoline</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Electric">Electric</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">MPG</label>
                <Input
                  type="number"
                  value={editingVehicle.mpg}
                  onChange={(e) => setEditingVehicle(prev => ({ ...prev, mpg: e.target.value }))}
                  placeholder="25"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Vehicle Status</label>
                <Select value={editingVehicle.status} onValueChange={(value) => setEditingVehicle(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="repair">Repair</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Registration Expiry</label>
                <Input
                  type="date"
                  value={editingVehicle.registrationExpiry}
                  onChange={(e) => setEditingVehicle(prev => ({ ...prev, registrationExpiry: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Inspection Expiry</label>
                <Input
                  type="date"
                  value={editingVehicle.inspectionExpiry}
                  onChange={(e) => setEditingVehicle(prev => ({ ...prev, inspectionExpiry: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Insurance Expiry</label>
                <Input
                  type="date"
                  value={editingVehicle.insuranceExpiry}
                  onChange={(e) => setEditingVehicle(prev => ({ ...prev, insuranceExpiry: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Purchase Date</label>
                <Input
                  type="date"
                  value={editingVehicle.purchaseDate}
                  onChange={(e) => setEditingVehicle(prev => ({ ...prev, purchaseDate: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Purchase Price ($)</label>
                <Input
                  type="number"
                  value={editingVehicle.purchasePrice}
                  onChange={(e) => setEditingVehicle(prev => ({ ...prev, purchasePrice: e.target.value }))}
                  placeholder="25000"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Current Value ($)</label>
                <Input
                  type="number"
                  value={editingVehicle.currentValue}
                  onChange={(e) => setEditingVehicle(prev => ({ ...prev, currentValue: e.target.value }))}
                  placeholder="20000"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Date of Entry</label>
                <Input
                  type="date"
                  value={editingVehicle.dateOfEntry}
                  onChange={(e) => setEditingVehicle(prev => ({ ...prev, dateOfEntry: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Monthly Payment ($)</label>
                <Input
                  type="number"
                  value={editingVehicle.monthlyPayment}
                  onChange={(e) => setEditingVehicle(prev => ({ ...prev, monthlyPayment: e.target.value }))}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Last Maintenance</label>
                <Input
                  type="date"
                  value={editingVehicle.lastMaintenance}
                  onChange={(e) => setEditingVehicle(prev => ({ ...prev, lastMaintenance: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Next Maintenance Due</label>
                <Input
                  type="date"
                  value={editingVehicle.nextMaintenanceDue}
                  onChange={(e) => setEditingVehicle(prev => ({ ...prev, nextMaintenanceDue: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Total Vehicle Length (ft)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={editingVehicle.totalLength}
                  onChange={(e) => setEditingVehicle(prev => ({ ...prev, totalLength: e.target.value }))}
                  placeholder="15.5"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Cubic Feet</label>
                <Input
                  type="number"
                  step="0.1"
                  value={editingVehicle.cubicFeet}
                  onChange={(e) => setEditingVehicle(prev => ({ ...prev, cubicFeet: e.target.value }))}
                  placeholder="104.3"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Inside Length (ft)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={editingVehicle.insideLength}
                  onChange={(e) => setEditingVehicle(prev => ({ ...prev, insideLength: e.target.value }))}
                  placeholder="6.1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Inside Width (ft)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={editingVehicle.insideWidth}
                  onChange={(e) => setEditingVehicle(prev => ({ ...prev, insideWidth: e.target.value }))}
                  placeholder="5.4"
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium">Notes</label>
                <Textarea
                  value={editingVehicle.notes}
                  onChange={(e) => setEditingVehicle(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes about this vehicle"
                  rows={3}
                />
              </div>
              <div className="col-span-2 flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditVehicleOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
          </div>
        </div>
      </header>

      {/* Fleet Overview */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Vehicles</p>
                  <p className="text-2xl font-bold text-blue-600">{totalVehicles}</p>
                </div>
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Vehicles</p>
                  <p className="text-2xl font-bold text-green-600">{activeVehicles}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Mileage</p>
                  <p className="text-2xl font-bold text-purple-600">{totalMileage.toLocaleString()}</p>
                </div>
                <Gauge className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average MPG</p>
                  <p className="text-2xl font-bold text-orange-600">{averageMPG.toFixed(1)}</p>
                </div>
                <Fuel className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <Card 
              key={vehicle.id} 
              className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => handleVehicleCardClick(vehicle)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    {getVehicleIcon(vehicle.vehicleType)}
                    <span className="text-lg">{vehicle.nickname}</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditVehicle(vehicle);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Badge className={getStatusColor(vehicle.status)}>
                      {getStatusIcon(vehicle.status)}
                      <span className="ml-1">{vehicle.status}</span>
                    </Badge>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </div>
                <Badge variant="outline" className="w-fit">
                  {vehicle.vehicleType}
                </Badge>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Vehicle Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">License Plate</p>
                    <p className="font-semibold">{vehicle.licensePlate} ({vehicle.state})</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Color</p>
                    <p className="font-semibold">{vehicle.color}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Mileage</p>
                    <p className="font-semibold">{vehicle.mileage.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">MPG</p>
                    <p className="font-semibold">{vehicle.mpg}</p>
                  </div>
                </div>

                {/* Vehicle Dimensions */}
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h5 className="font-semibold text-gray-800 mb-2">Vehicle Dimensions</h5>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Total Length</p>
                      <p className="font-semibold">{vehicle.totalLength}' ft</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Cubic Feet</p>
                      <p className="font-semibold">{vehicle.cubicFeet} ft³</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Inside Length</p>
                      <p className="font-semibold">{vehicle.insideLength}' ft</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Inside Width</p>
                      <p className="font-semibold">{vehicle.insideWidth}' ft</p>
                    </div>
                  </div>
                </div>

                {/* Expiry Alerts */}
                <div className="space-y-2">
                  {[
                    { label: "Registration", date: vehicle.registrationExpiry },
                    { label: "Inspection", date: vehicle.inspectionExpiry },
                    { label: "Insurance", date: vehicle.insuranceExpiry }
                  ].map(({ label, date }) => {
                    if (!date) return null;
                    const isExpiring = isExpiringOrExpired(date);
                    return (
                      <div key={label} className={`flex items-center justify-between text-sm p-2 rounded ${
                        isExpiring ? 'bg-red-50 text-red-800' : 'bg-gray-50'
                      }`}>
                        <span>{label}:</span>
                        <span className="flex items-center space-x-1">
                          {isExpiring && <AlertTriangle className="h-3 w-3" />}
                          <span>{new Date(date).toLocaleDateString()}</span>
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Financial Info */}
                <div className="bg-green-50 p-3 rounded-lg">
                  <h5 className="font-semibold text-gray-800 mb-2">Financial Information</h5>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Purchase Price</p>
                      <p className="font-semibold">${vehicle.purchasePrice.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Current Value</p>
                      <p className="font-semibold">${vehicle.currentValue.toLocaleString()}</p>
                    </div>
                    {vehicle.monthlyPayment > 0 && (
                      <div>
                        <p className="text-gray-600">Monthly Payment</p>
                        <p className="font-semibold">${vehicle.monthlyPayment}/month</p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-600">Date of Entry</p>
                      <p className="font-semibold">{new Date(vehicle.dateOfEntry).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Active Apps */}
                {vehicle.activeApps && vehicle.activeApps.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Active Apps:</p>
                    <div className="flex flex-wrap gap-1">
                      {vehicle.activeApps.map((app, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {app}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {vehicle.notes && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Notes:</p>
                    <p className="text-sm text-gray-800">{vehicle.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-2 pt-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-red-600 hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteVehicle(vehicle.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}