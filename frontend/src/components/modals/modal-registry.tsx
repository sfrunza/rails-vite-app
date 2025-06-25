import type { ReactNode } from 'react';
import { EditDepositModal } from './edit-deposit-modal';
import { EditMoveSizeModal } from './edit-move-size';
import { EditPackingModal } from './edit-packing-modal';
import { EditExtraServicesModal } from './edit-extra-services-modal';

type ModalKey =
  | 'editDeposit'
  | 'editPacking'
  | 'editMoveSize'
  | 'editExtraServices';

// Define your modal map with all available modals and their props
export type AppModalMap = {
  [key in ModalKey]: ReactNode;
};

// Create the modal registry
export const modalRegistry: AppModalMap = {
  editDeposit: <EditDepositModal />,
  editMoveSize: <EditMoveSizeModal />,
  editPacking: <EditPackingModal />,
  editExtraServices: <EditExtraServicesModal />,
};
