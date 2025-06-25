import { LoadingButton } from '@/components/loading-button';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useCloneRequestMutation } from '@/services/requests-api';
import { useAppSelector } from '@/store';
import {
  BookCopyIcon,
  ClipboardPenLine,
  MailsIcon,
  PrinterIcon,
  UserRoundIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router';

export default function ActionIcons() {
  const navigate = useNavigate();
  const { id: requestId, status } = useAppSelector(
    (state) => state.request.originalRequest!
  );

  const [cloneRequest, { isLoading: isCloning }] = useCloneRequestMutation();

  function handleClickContract(id: number) {
    openCenteredPopup(`${id}/contract`, '_blank', 600, 850);
  }

  function handleClickPdf(id: number) {
    openCenteredPopup(`${id}/pdf`, '_blank', 900, 900);
  }

  function handleClickClone(id: number) {
    cloneRequest({ id })
      .unwrap()
      .then((res) => {
        navigate(`/crm/requests/${res.id}`);
      });
  }

  return (
    <div className="flex w-full justify-around gap-x-4 md:w-auto">
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="size-11 rounded-full bg-background text-muted-foreground shadow-md [&_svg]:size-5"
            >
              <MailsIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Emails</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <Button
              asChild
              size="icon"
              variant="ghost"
              className="size-11 rounded-full bg-background text-muted-foreground shadow-md [&_svg]:size-5"
            >
              <a href={`/account/requests/${requestId}`} target="_blank">
                <UserRoundIcon />
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Client page</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <LoadingButton
              disabled={isCloning}
              loading={isCloning}
              size="icon"
              variant="ghost"
              className="size-11 rounded-full bg-background text-muted-foreground shadow-md [&_svg]:size-5"
              onClick={() => {
                if (requestId) {
                  handleClickClone(requestId);
                }
              }}
            >
              <BookCopyIcon />
            </LoadingButton>
          </TooltipTrigger>
          <TooltipContent>Clone request</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="size-11 rounded-full bg-background text-muted-foreground shadow-md [&_svg]:size-5"
              onClick={() => {
                if (requestId) {
                  handleClickPdf(requestId);
                }
              }}
            >
              <PrinterIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>View PDF</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {status === 'confirmed' && (
        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="size-11 rounded-full bg-background text-muted-foreground shadow-md [&_svg]:size-5"
                onClick={() => {
                  if (requestId) {
                    handleClickContract(requestId);
                  }
                }}
              >
                <ClipboardPenLine />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Contract</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}

function openCenteredPopup(
  url: string,
  title: string,
  width: number,
  height: number
): void {
  // Get the screen position and size
  const screenLeft = window.screenLeft ?? window.screenX;
  const screenTop = window.screenTop ?? window.screenY;

  const screenWidth =
    window.innerWidth || document.documentElement.clientWidth || screen.width;
  const screenHeight =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    screen.height;

  // Calculate the centered position
  const left = screenLeft + (screenWidth - width) / 2;
  const top = screenTop + (screenHeight - height) / 2;

  // Create the features string for the popup
  const features = `width=${width},height=${height},top=${top},left=${left},noopener,noreferrer`;

  // Open the popup window
  window.open(url, title, features);
}
