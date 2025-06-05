import { ChevronDownIcon } from 'lucide-react';

import { LoadingButton } from '@/components/loading-button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useGetServicesQuery } from '@/services/services-api';
// import { useNavigate } from 'react-router';
// import { useGetServicesQuery } from '@/services/services-api';
// import { useCreateRequestMutation } from '@/services/requests-api';

export function CreateRequestButton() {
  // const navigate = useNavigate();
  // const [createRequest, { isLoading }] = useCreateRequestMutation();
  const { data: services } = useGetServicesQuery();

  const enabledServices = services?.filter((service) => service.enabled);

  // async function handleCreateRequest(serviceId: number) {
  //   const response = await createRequest({ service_id: serviceId }).unwrap();
  //   navigate(`/crm/requests/${response.id}`);
  // }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <LoadingButton
          loading={false}
          disabled={false}
          // loading={isLoading}
          // disabled={isLoading || enabledServices?.length === 0}
        >
          <span className="flex items-center justify-between gap-2">
            <span className="hidden md:inline-flex">Create request</span>
            <span className="inline-flex md:hidden">New</span>
            <ChevronDownIcon className="size-5" />
          </span>
        </LoadingButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          {enabledServices?.map((service, i) => (
            <DropdownMenuItem
              key={i}
              className="cursor-pointer"
              // onClick={() => handleCreateRequest(service.id)}
            >
              {service.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
