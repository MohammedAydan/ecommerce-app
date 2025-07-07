import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const PaymentDialog = ({ paymentUrl }: { paymentUrl?: string | null }) => {
  if (!paymentUrl) return null;

  return (
    <Dialog open>
      <DialogContent
        className="w-full max-w-[95vw] md:max-w-[700px] lg:max-w-[900px] p-4 sm:p-6"
        onPointerDownOutside={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Payment</DialogTitle>
          <DialogDescription>
            Complete your payment in the secure iframe below.
          </DialogDescription>
        </DialogHeader>

        <div className="w-full">
          <iframe
            src={paymentUrl}
            title="Payment"
            className="w-full h-[60vh] sm:h-[450px] border-none rounded-md"
            style={{ border: 'none' }}
            
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="destructive">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
