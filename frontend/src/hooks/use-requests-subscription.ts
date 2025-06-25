import cable from "@/lib/cable";
import { useAppDispatch } from "@/store";
import { useEffect, useRef } from "react";
import { requestsApi } from '@/services/requests-api';

export default function useRequestsSubscription() {
  const dispatch = useAppDispatch();
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    subscriptionRef.current = cable.subscriptions.create(
      { channel: "RequestsChannel" },
      {
        connected(): void {
          console.log("Connected to RequestsChannel");
        },
        disconnected(): void {
          console.log("Disconnected from RequestsChannel");
        },
        received(data: any): void {
          console.log("RequestsChannel received update", data);
          dispatch(
            requestsApi.util.invalidateTags([
              { type: 'Request', id: 'LIST' },
              { type: 'StatusCounts' },
              { type: 'CustomerRequest' }
            ])
          );
        }
      }
    );

    // Cleanup function
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [dispatch]);
} 