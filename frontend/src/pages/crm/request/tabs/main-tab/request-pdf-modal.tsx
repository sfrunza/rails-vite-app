import { useRef, forwardRef } from 'react';
import { PrinterIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

// Component to print
const RequestPrintContent = forwardRef<HTMLDivElement, { request: any }>(
  ({ request }, ref) => {
    return (
      <div
        ref={ref}
        className="bg-white p-8 rounded-md shadow-sm print:shadow-none"
        style={{ width: '210mm', minHeight: '297mm' }} // A4 size
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Request #{request.id}</h1>
        </div>

        <div className="space-y-6">
          {/* Request Details */}
          <section className="border-b pb-4">
            <h2 className="text-xl font-bold mb-3">Request Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">
                  {request.status.replace('_', ' ').capitalize()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created Date</p>
                <p className="font-medium">
                  {new Date(request.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p className="font-medium">{request.customer?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Contact</p>
                <p className="font-medium">{request.contact?.name || 'N/A'}</p>
              </div>
            </div>
          </section>

          {/* Additional sections as needed */}
          <section className="border-b pb-4">
            <h2 className="text-xl font-bold mb-3">Items</h2>
            {request.items?.length > 0 ? (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-2 border">Description</th>
                    <th className="text-left p-2 border">Quantity</th>
                    <th className="text-left p-2 border">Price</th>
                    <th className="text-left p-2 border">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {request.items.map((item: any, index: number) => (
                    <tr key={index} className="border-b">
                      <td className="p-2 border">{item.description}</td>
                      <td className="p-2 border">{item.quantity}</td>
                      <td className="p-2 border">${item.price}</td>
                      <td className="p-2 border">
                        ${item.quantity * item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No items found</p>
            )}
          </section>

          {/* Add more sections as needed for your request data */}

          <section>
            <h2 className="text-xl font-bold mb-3">Notes</h2>
            <p>{request.notes || 'No notes available'}</p>
          </section>
        </div>
      </div>
    );
  }
);

RequestPrintContent.displayName = 'RequestPrintContent';

type RequestPdfModalProps = {
  request: any; // Replace with your actual request type
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function RequestPdfModal({
  request,
  open,
  onOpenChange,
}: RequestPdfModalProps) {
  const componentRef = useRef<HTMLDivElement>(null);

  if (!request) return null;

  const handlePrint = () => {
    if (componentRef.current) {
      const printContents = componentRef.current.innerHTML;
      const originalContents = document.body.innerHTML;

      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;

      // Reload the page to restore React
      window.location.reload();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Request Preview</span>
            <Button onClick={handlePrint} className="flex items-center gap-2">
              <PrinterIcon className="h-4 w-4" /> Print
            </Button>
          </DialogTitle>
        </DialogHeader>

        <RequestPrintContent ref={componentRef} request={request} />
      </DialogContent>
    </Dialog>
  );
}
