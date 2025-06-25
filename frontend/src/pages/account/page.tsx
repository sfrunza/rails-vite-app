import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDays, Clock, Package, Truck, MapPinIcon } from 'lucide-react';
import UserCard from './user-card';
import { useGetCustomerRequestsQuery } from '@/services/requests-api';
import { statusBgColors, statusTextColors } from '@/constants/request';
import { cn, formatDate } from '@/lib/utils';
import { useGetServicesQuery } from '@/services/services-api';
// import { useAuth } from '@/hooks/use-auth';
import { Spinner } from '@/components/spinner';
import { timeWindowToString } from '@/lib/helpers';
import useRequestsSubscription from '@/hooks/use-requests-subscription';

function AccountPage() {
  // const currentUser = useAuth();
  const { data, isLoading } = useGetCustomerRequestsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  });

  useRequestsSubscription();

  // console.log('currentUser', currentUser);

  const { data: services } = useGetServicesQuery();

  const currentMoves = data?.requests.filter(
    (request) => request.status !== 'completed'
  );

  const pastMoves = data?.requests.filter(
    (request) => request.status === 'completed'
  );

  function getServiceName(serviceId: number) {
    return services?.find((s) => s.id === serviceId)?.name;
  }

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
                <Badge variant="secondary">
                  {currentMoves ? currentMoves?.length : 0} active
                </Badge>
              </div>
              {isLoading && (
                <div className="flex justify-center items-center h-full">
                  <Spinner />
                </div>
              )}

              {currentMoves?.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Move #{request.id}
                    </CardTitle>
                    <CardAction>
                      <Badge
                        className={cn(
                          'capitalize py-1 relative overflow-hidden bg-transparent',
                          statusTextColors[request.status]
                        )}
                      >
                        <span
                          className={`${
                            statusBgColors[request.status]
                          } absolute inset-0 opacity-15`}
                        />
                        {request.status.replace('_', ' ')}
                        <div
                          className={cn(
                            'size-2 rounded-full ml-1',
                            statusBgColors[request.status]
                          )}
                        />
                      </Badge>
                    </CardAction>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">
                          <MapPinIcon className="size-4 text-muted-foreground" />
                          From
                        </Label>
                        <p className="text-sm">{`${request.origin.street}, ${request.origin.city}, ${request.origin.state} ${request.origin.zip}`}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">
                          <MapPinIcon className="size-4 text-muted-foreground" />
                          To
                        </Label>
                        <p className="text-sm">{`${request.destination.street}, ${request.destination.city}, ${request.destination.state} ${request.destination.zip}`}</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <CalendarDays className="size-4 text-muted-foreground" />
                        <span>{formatDate(request.moving_date)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Package className="size-4 text-muted-foreground" />
                        <span>{getServiceName(request.service_id)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Truck className="size-4 text-muted-foreground" />
                        <span>{request.crew_size} movers</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="size-4 text-muted-foreground" />
                        <span>
                          {timeWindowToString(
                            request.start_time_window,
                            request.end_time_window
                          )}
                        </span>
                      </div>
                    </div>

                    {/* <div>
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
                    </div> */}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="past" className="space-y-6 mt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold pl-1">Completed Moves</h3>
                <Badge variant="secondary">
                  {pastMoves ? pastMoves?.length : 0} completed
                </Badge>
              </div>
              {pastMoves?.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Move #{request.id}
                    </CardTitle>
                    <CardAction>
                      <Badge
                        className={cn(
                          'capitalize py-1 relative overflow-hidden bg-transparent',
                          statusTextColors[request.status]
                        )}
                      >
                        <span
                          className={`${
                            statusBgColors[request.status]
                          } absolute inset-0 opacity-15`}
                        />
                        {request.status.replace('_', ' ')}
                        <div
                          className={cn(
                            'size-2 rounded-full ml-1',
                            statusBgColors[request.status]
                          )}
                        />
                      </Badge>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${
                              i < 2 ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </CardAction>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          From
                        </Label>
                        <p className="text-sm">{`${request.origin.city}, ${request.origin.state} ${request.origin.zip}`}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          To
                        </Label>
                        <p className="text-sm">{`${request.destination.city}, ${request.destination.state} ${request.destination.zip}`}</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <CalendarDays className="size-4 text-muted-foreground" />
                        <span>{formatDate(request.moving_date)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Package className="size-4 text-muted-foreground" />
                        {/* <span>{move.estimatedCost}</span> */}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Truck className="size-4 text-muted-foreground" />
                        <span>{request.crew_size} movers</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="size-4 text-muted-foreground" />
                        <span>
                          {timeWindowToString(
                            request.start_time_window,
                            request.end_time_window
                          )}
                        </span>
                      </div>
                    </div>

                    {/* <div>
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
                    </div> */}
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
