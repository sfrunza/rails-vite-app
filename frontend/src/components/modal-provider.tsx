import type { AppModalMap } from '@/components/modals/modal-registry';
import { Dialog } from '@/components/ui/dialog';
import type React from 'react';
import { createContext, useContext, useState } from 'react';

// Define the context type
type ModalContextType = {
  open: (id: keyof AppModalMap) => void;
  close: (id: keyof AppModalMap) => void;
  isOpen: (id: keyof AppModalMap) => boolean;
};

// Create the context
const ModalContext = createContext<ModalContextType | undefined>(undefined);

// Create the provider component
export function ModalProvider({
  children,
  modals,
}: {
  children: React.ReactNode;
  modals: AppModalMap;
}) {
  const [openModals, setOpenModals] = useState<Record<string, boolean>>({});

  const open = (id: keyof AppModalMap) => {
    setOpenModals((prev) => ({
      ...prev,
      [id as string]: true,
    }));
  };

  const close = (id: keyof AppModalMap) => {
    setOpenModals((prev) => ({
      ...prev,
      [id as string]: false,
    }));
  };

  const isOpen = (id: keyof AppModalMap) => {
    return !!openModals[id as string];
  };

  return (
    <ModalContext.Provider value={{ open, close, isOpen }}>
      {children}
      {Object.entries(modals).map(([id, content]) => {
        const isModalOpen = !!openModals[id];

        return (
          <Dialog
            key={id}
            open={isModalOpen}
            onOpenChange={(open) => !open && close(id as keyof AppModalMap)}
          >
            {/* Only render the content when the modal is open */}
            {isModalOpen && content}
          </Dialog>
        );
      })}
    </ModalContext.Provider>
  );
}

// Create the hook to use the modal context
export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
