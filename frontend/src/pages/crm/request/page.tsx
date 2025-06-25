import { PageContainer } from '@/components/page-container';
import { Spinner } from '@/components/spinner';
import useRequestSubscription from '@/hooks/use-request-subscription';
import { useGetRequestByIdQuery } from '@/services/requests-api';
import { clearRequest, setRequest } from '@/slices/request-slice';
import { useAppDispatch, useAppSelector } from '@/store';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import TabsNav from './tabs-nav';
import TopNav from './top-nav';

function RequestPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { data, isLoading, isError, error } = useGetRequestByIdQuery(
    {
      id: Number(id),
    },
    {
      skip: !id,
      refetchOnMountOrArgChange: true,
    }
  );
  const localRequest = useAppSelector((state) => state.request.request);

  useRequestSubscription(id ? parseInt(id) : undefined);

  useEffect(() => {
    if (data) {
      dispatch(setRequest(data));
    }
    return () => {
      dispatch(clearRequest());
    };
  }, [data]);

  if (isLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center md:h-[calc(100vh-40px)]">
        <Spinner />
      </div>
    );

  if (isError)
    return (
      <div className="flex items-center justify-center py-80 md:py-96">
        <p>
          {'data' in error
            ? (error.data as { error: string }).error
            : 'something went wrong'}
        </p>
      </div>
    );

  if (!localRequest) return null;

  return (
    <PageContainer className="h-full">
      <div className="flex border-l border-r flex-col mx-auto max-w-7xl bg-muted dark:bg-background h-full">
        <TopNav />
        <TabsNav />
      </div>
    </PageContainer>
  );
}

export const Component = RequestPage;
