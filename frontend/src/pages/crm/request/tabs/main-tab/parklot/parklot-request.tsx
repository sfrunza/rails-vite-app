// import { statusBgColors } from "@/constants/request";
// // import { timeWindowToString } from "@/lib/helpers";
// import { cn } from "@/lib/utils";
// import { TFullRequest } from "@/types/request";

// type ParklotRequestProps = {
//   request: TFullRequest;
//   selectedRequest: Partial<TFullRequest> | null;
//   handleRequestClick: (request: Partial<TFullRequest>) => void;
// };

// export default function ParklotRequest({
//   request,
//   selectedRequest,
//   handleRequestClick,
// }: ParklotRequestProps) {
//   return (
//     <div
//       className={cn(
//         "absolute top-1/2 flex h-3/4 -translate-y-1/2 transform flex-col justify-between rounded border-2 border-transparent px-2 py-1 text-xs font-semibold text-muted/85 hover:cursor-pointer",
//         statusBgColors[request.status],
//         {
//           "border-dashed border-background": selectedRequest?.id === request.id,
//         },
//       )}
//       style={{
//         left: `${calculateLeftOffset(request)}px`,
//         width: `${calculateWidth(request)}px`,
//       }}
//       onClick={() => handleRequestClick(request)}
//     >
//       <p className="text-white">{`${request.customer?.first_name} ${request.customer?.last_name}`}</p>
//       <div className="grid grid-cols-2">
//         <p>Request #{request.id}</p>
//         <p className="line-clamp-1">{request.size}</p>
//       </div>
//       {/* <p>
//         {timeWindowToString(request.start_time_window, request.end_time_window)}
//       </p> */}
//       {/* <div className="flex items-center gap-2">
//         <p>
//           {request.origin?.city}, {request.origin?.state}
//         </p>
//         <p>&#8594;</p>
//         <p>
//           {request.origin?.city}, {request.origin?.state}
//         </p>
//       </div> */}
//     </div>
//   );
// }

// function calculateLeftOffset(request: TFullRequest) {
//   const startTime = request.start_time_window;
//   if (!startTime) return 0;

//   const minutesFrom7AM = startTime - 7 * 60;

//   if (minutesFrom7AM < 0) return 0;

//   const pixelsPerMinute = 70 / 60;
//   const offset = minutesFrom7AM * pixelsPerMinute;

//   return offset;
// }

// function calculateWidth(request: TFullRequest) {
//   const totalTimeMinutes = request.total_time?.max ?? 0;
//   const pixelsPerMinute = 70 / 60;
//   const width = totalTimeMinutes * pixelsPerMinute;
//   return width;
// }
