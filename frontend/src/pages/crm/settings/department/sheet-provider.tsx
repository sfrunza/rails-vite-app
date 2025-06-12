import { Sheet, SheetContent } from '@/components/ui/sheet';
import { createContext, type ReactNode, useContext, useState } from 'react';
import UserFormSheet from './user-form-sheet';

type SheetProps = {
  userId?: number;
};

// Type for the sheet state
interface SheetState {
  props: SheetProps | null;
  open: boolean;
}

type SheetContextType = {
  openSheet: (props?: SheetProps) => void;
  closeSheet: () => void;
} & SheetState;

const SheetContext = createContext<SheetContextType | undefined>(undefined);

export const SheetProvider = ({ children }: { children: ReactNode }) => {
  const [sheet, setSheet] = useState<SheetState>({
    props: null,
    open: false,
  });

  const openSheet = (props?: SheetProps) => {
    setSheet({ props: props ?? null, open: true });
  };

  const closeSheet = () => {
    setSheet((prev) => ({ ...prev, open: false }));
  };

  return (
    <SheetContext.Provider value={{ ...sheet, openSheet, closeSheet }}>
      {children}
      <SheetContainer />
    </SheetContext.Provider>
  );
};

export const useSheet = () => {
  const context = useContext(SheetContext);
  if (!context) throw new Error('useSheet must be used within a SheetProvider');
  return context;
};

const SheetContainer = () => {
  const { open, props, closeSheet } = useSheet();

  return (
    <Sheet open={open} onOpenChange={(v) => !v && closeSheet()}>
      <SheetContent className="w-full sm:min-w-xl">
        <UserFormSheet {...props} closeSheet={closeSheet} />
      </SheetContent>
    </Sheet>
  );
};
