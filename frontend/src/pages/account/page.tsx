import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDays, Clock, Package, Truck } from 'lucide-react';
import UserCard from './user-card';

function AccountPage() {
  const currentMoves = [
    {
      id: 'MV-2024-001',
      fromAddress: '123 Main St, Anytown, ST 12345',
      toAddress: '456 Oak Ave, Newcity, ST 67890',
      scheduledDate: '2024-01-15',
      status: 'confirmed',
      estimatedCost: '$2,450',
      crew: 'Team Alpha',
      services: ['Packing', 'Loading', 'Transport', 'Unloading'],
    },
    {
      id: 'MV-2024-002',
      fromAddress: '789 Pine Rd, Oldtown, ST 11111',
      toAddress: '321 Elm St, Somewhere, ST 22222',
      scheduledDate: '2024-01-28',
      status: 'pending',
      estimatedCost: '$1,850',
      crew: 'TBD',
      services: ['Loading', 'Transport', 'Unloading'],
    },
  ];

  const pastMoves = [
    {
      id: 'MV-2023-045',
      fromAddress: '987 Cedar Ln, Hometown, ST 33333',
      toAddress: '123 Main St, Anytown, ST 12345',
      completedDate: '2023-08-15',
      status: 'completed',
      finalCost: '$2,100',
      crew: 'Team Beta',
      rating: 5,
      services: ['Packing', 'Loading', 'Transport', 'Unloading', 'Unpacking'],
    },
    {
      id: 'MV-2022-128',
      fromAddress: '555 Birch St, Lastplace, ST 44444',
      toAddress: '987 Cedar Ln, Hometown, ST 33333',
      completedDate: '2022-12-03',
      status: 'completed',
      finalCost: '$1,650',
      crew: 'Team Gamma',
      rating: 4,
      services: ['Loading', 'Transport', 'Unloading'],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-10rem)]">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">My Account</h2>
        <p className="text-muted-foreground">
          Manage your contact information and track your moves
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Information */}
        <div className="lg:col-span-1">
          <UserCard />
        </div>

        {/* Moves Section */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="current" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="current">Current Moves</TabsTrigger>
              <TabsTrigger value="past">Past Moves</TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="space-y-6 mt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold pl-1">
                  Upcoming & Active Moves
                </h3>
                <Badge variant="secondary">{currentMoves.length} active</Badge>
              </div>

              {currentMoves.map((move) => (
                <Card key={move.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Move #{move.id}</CardTitle>
                      <Badge className={getStatusColor(move.status)}>
                        {move.status.charAt(0).toUpperCase() +
                          move.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          From
                        </Label>
                        <p className="text-sm">{move.fromAddress}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          To
                        </Label>
                        <p className="text-sm">{move.toAddress}</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        <span>{move.scheduledDate}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span>{move.estimatedCost}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <span>{move.crew}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{move.services.length} services</span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Services
                      </Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {move.services.map((service) => (
                          <Badge
                            key={service}
                            variant="outline"
                            className="text-xs"
                          >
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="past" className="space-y-6 mt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold pl-1">Completed Moves</h3>
                <Badge variant="secondary">{pastMoves.length} completed</Badge>
              </div>

              {pastMoves.map((move) => (
                <Card key={move.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Move #{move.id}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(move.status)}>
                          {move.status.charAt(0).toUpperCase() +
                            move.status.slice(1)}
                        </Badge>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-sm ${
                                i < move.rating
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          From
                        </Label>
                        <p className="text-sm">{move.fromAddress}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          To
                        </Label>
                        <p className="text-sm">{move.toAddress}</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        <span>{move.completedDate}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span>{move.finalCost}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <span>{move.crew}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{move.services.length} services</span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Services
                      </Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {move.services.map((service) => (
                          <Badge
                            key={service}
                            variant="outline"
                            className="text-xs"
                          >
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export const Component = AccountPage;
