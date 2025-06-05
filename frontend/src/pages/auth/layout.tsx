import { Outlet } from 'react-router';
import { ModeToggle } from '@/components/mode-toggle';
// import { useGetSettingsQuery } from '@/services/settings-api';

export default function AuthLayout() {
  // const { data: settings } = useGetSettingsQuery();
  // const companyName = settings?.company_name;
  // const companyLogo = settings?.company_logo;
  return (
    <div className="relative">
      <div className="absolute right-4 top-4 z-50">
        <ModeToggle />
      </div>
      <div className="relative isolate flex min-h-svh flex-col items-center justify-center gap-6 overflow-hidden bg-muted p-6 dark:bg-background md:p-10">
        <svg
          aria-hidden="true"
          className="absolute inset-0 -z-10 size-full stroke-foreground/10 [mask-image:radial-gradient(56rem_56rem_at_center,white,transparent)]"
        >
          <defs>
            <pattern
              x="50%"
              y={-1}
              id="983e3e4c-de6d-4c3f-8d64-b9761d1534cc"
              width={200}
              height={200}
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 200V.5H200" fill="none" />
            </pattern>
          </defs>
          <rect
            fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)"
            width="100%"
            height="100%"
            strokeWidth={0}
          />
        </svg>
        <div className="flex w-full max-w-sm flex-col gap-6">
          {/* <div className="flex h-12 items-center gap-2 self-center font-medium">
            {settings && (
              <>
                <img src={companyLogo} alt="Company logo" className="size-12" />
                {companyName}
              </>
            )}
          </div> */}
          <Outlet />
          <div className="text-balance text-center text-xs text-muted-foreground">
            By clicking continue, you agree to our{' '}
            <a
              href="#"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href="#"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </a>
            .
          </div>
        </div>
      </div>
    </div>
  );
}
