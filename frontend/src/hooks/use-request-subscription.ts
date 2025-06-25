import cable from "@/lib/cable";
import { requestsApi } from "@/services/requests-api";
import { setRequest } from "@/slices/request-slice";
import { useAppDispatch } from "@/store";
import type { Request } from "@/types/request";
import { useEffect, useRef } from "react";

export default function useRequestSubscription(
  requestId: number | undefined,
) {
  const dispatch = useAppDispatch();
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    if (!requestId) return;

    subscriptionRef.current = cable.subscriptions.create(
      { channel: "RequestChannel", request_id: requestId },
      {
        connected(): void {
          console.log(`Connected to RequestChannel_${requestId}`);
        },
        disconnected(): void {
          console.log(`Disconnected from RequestChannel_${requestId}`);
        },
        received(data: Request): void {
          console.log(`RequestChannel_${requestId} received`, data);
          dispatch(setRequest(data));
          dispatch(
            requestsApi.util.invalidateTags([{ type: 'Request', id: Number(requestId) }])
          );
        },
        ensureActiveConnection(): void {
          console.log(`ensureActiveConnection_${requestId}`);
        },
      },
    );

    // Cleanup function
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        cable.disconnect();
      }
      console.log(`Disconnected from RequestChannel_${requestId}`);
    };
  }, [requestId]);
}
