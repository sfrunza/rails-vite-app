import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Addresses from './_components/addresses';
import DeliveryDateTime from './_components/date-time/delivery-date-time';
import PickupDateTime from './_components/date-time/pickup-date-time';
import TransitDateTime from './_components/date-time/transit-date-time';
import Details from './details';
import ExtraServices from './extra-services';
import Notes from './notes';
import PageFooter from './page-footer';
import StatusService from './status-service';
import Parklot from './parklot/parklot';

export default function MainTab() {
  return (
    <div className="bg-muted">
      <Parklot />
      <div className="divide-y shadow-md bg-background">
        <PickupDateTime />
        <DeliveryDateTime />
        <TransitDateTime />
      </div>
      <div>
        <StatusService />
      </div>
      <div className="grid grid-cols-1 gap-4 px-4 xl:grid-cols-3">
        <div className="md:col-span-2">
          {/* Addresses */}
          <Card>
            <CardHeader>
              <CardTitle>Addresses</CardTitle>
            </CardHeader>
            <CardContent>
              <Addresses />
            </CardContent>
          </Card>
          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Notes />
            </CardContent>
          </Card>
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <Details />
            </CardContent>
          </Card>
        </div>
        <div>
          <ExtraServices />
        </div>
      </div>
      <PageFooter />
    </div>
  );
}
