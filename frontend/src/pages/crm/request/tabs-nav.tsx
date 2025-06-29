import { useState } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import CustomerTab from "./customer-tab/customer-tab";
// import DetailsTab from "./details-tab/details-tab";
import { useAppDispatch, useAppSelector } from '@/store';
import MainTab from './tabs/main-tab/main-tab';
import DetailsTab from './tabs/details-tab/details-tab';
import CustomerTab from './tabs/customer-tab/customer-tab';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { updateField } from '@/slices/request-slice';
import PhotosTab from './tabs/photos-tab/photos-tab';
// import MainTab from "./tabs/main-tab/main-tab";
// import MessagesTab from "./tabs/messages-tab/messages-tab";
// import PhotosTab from "./tabs/photos-tab/photos-tab";
// import CustomerTab from "./tabs/customer-tab/customer-tab";
// import DetailsTab from "./tabs/details-tab/details-tab";
// import MessagesTab from "./messages-tab/messages-tab";
// import RequestTab from "./request-tab/request-tab";

export default function TabsNav() {
  const dispatch = useAppDispatch();
  const request = useAppSelector((state) => state.request.request);
  const [activeTab, setActiveTab] = useState<string>('request');

  const hasDetails = request?.details?.is_touched ?? false;
  const hasPhotos = request?.image_urls
    ? request?.image_urls?.length > 0
    : false;

  return (
    <Tabs
      value={activeTab}
      onValueChange={(val) => {
        setActiveTab(val);
      }}
      className="gap-0 flex-1 bg-background"
    >
      <div className="flex flex-col-reverse border-b lg:flex-row items-center justify-between">
        <ScrollArea className=" p-4 w-full">
          <TabsList className="justify-start gap-1">
            <TabsTrigger value="request">Request #{request?.id}</TabsTrigger>
            <TabsTrigger value="customer">Customer</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="details">
              <div className="relative">
                Details{' '}
                {hasDetails && (
                  <span className="absolute -right-1.5 top-0 size-1.5 rounded-full bg-green-600" />
                )}
              </div>
            </TabsTrigger>
            <TabsTrigger value="photos">
              <div className="relative">
                Photos{' '}
                {hasPhotos && (
                  <span className="absolute -right-1.5 top-0 size-1.5 rounded-full bg-green-600" />
                )}
              </div>
            </TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>

          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <div className="flex flex-1 w-full px-4 justify-end items-center gap-3">
          <Label htmlFor="is_calculator_disabled">Calculator</Label>
          <Switch
            id="is_calculator_disabled"
            checked={request?.is_calculator_disabled}
            onCheckedChange={(checked) =>
              dispatch(updateField({ is_calculator_disabled: checked }))
            }
          />
        </div>
      </div>

      {/* Request */}
      <TabsContent value="request" className="bg-muted dark:bg-background">
        <MainTab />
      </TabsContent>

      {/* Customer */}
      <TabsContent value="customer" className="bg-muted dark:bg-background">
        <CustomerTab />
      </TabsContent>

      {/* messages */}
      <TabsContent
        value="messages"
        // className="mt-0 w-screen"
        className="bg-muted dark:bg-background"
      >
        <div className="w-full">{/* <MessagesTab /> */}</div>
      </TabsContent>

      {/* logs */}
      <TabsContent value="logs" className="bg-muted dark:bg-background">
        logs
      </TabsContent>

      {/* details */}
      <TabsContent value="details" className="bg-muted dark:bg-background">
        <DetailsTab />
      </TabsContent>

      {/* photos */}
      <TabsContent value="photos" className="bg-muted dark:bg-background">
        <PhotosTab />
      </TabsContent>

      {/* inventory */}
      <TabsContent value="inventory" className="bg-muted dark:bg-background">
        inventory
      </TabsContent>
    </Tabs>
  );
}
