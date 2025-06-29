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
    <>
      <Parklot />
      <div className="divide-y shadow-md">
        <PickupDateTime />
        <DeliveryDateTime />
        <TransitDateTime />
      </div>
      <div>
        <StatusService />
      </div>
      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-3">
        {/* ExtraServices - shown first on mobile, last on desktop */}
        <div className="lg:col-span-2">
          {/* Addresses */}
          <Card>
            <CardHeader>
              <CardTitle>Addresses</CardTitle>
            </CardHeader>
            <CardContent>
              <Addresses />
            </CardContent>
          </Card>
        </div>
        <div>
          <ExtraServices />
        </div>
        {/* Notes */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Notes />
            </CardContent>
          </Card>
        </div>
        {/* Overview */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <Details />
            </CardContent>
          </Card>
        </div>
      </div>
      <PageFooter />
    </>
  );
}
