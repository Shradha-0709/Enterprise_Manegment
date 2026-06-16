import { useSearchParams } from 'react-router-dom';
import AssetModal from './AssetModal';
import MaintenanceModal from './MaintenanceModal';
import VendorModal from './VendorModal';
import InventoryModal from './InventoryModal';

export default function ModalManager() {
  const [searchParams] = useSearchParams();
  const modal = searchParams.get('modal');

  return (
    <>
      {modal === 'asset' && <AssetModal />}
      {modal === 'maintenance' && <MaintenanceModal />}
      {modal === 'vendor' && <VendorModal />}
      {modal === 'inventory' && <InventoryModal />}
    </>
  );
}
