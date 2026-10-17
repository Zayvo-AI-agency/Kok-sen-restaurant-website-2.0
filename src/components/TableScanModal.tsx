import { useState } from 'react';
import { QrCode, CheckCircle2, X, UtensilsCrossed, Sparkles } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';

interface TableScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTable: (tableNum: number) => void;
  currentTable: number | null;
}

export function TableScanModal({ isOpen, onClose, onSelectTable, currentTable }: TableScanModalProps) {
  const [selectedTable, setSelectedTable] = useState<number>(currentTable || 6);
  const [simulatedScanned, setSimulatedScanned] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onSelectTable(selectedTable);
    setSimulatedScanned(true);
    setTimeout(() => {
      setSimulatedScanned(false);
      onClose();
    }, 1200);
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm bg-white text-stone-900 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-stone-200 p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900">Tableside Order</h3>
              <p className="text-xs text-stone-500">4 Keong Saik Road, Singapore</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:text-stone-900 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* QR Scan Simulation Viewfinder */}
        <div className="relative aspect-video rounded-2xl bg-stone-950 flex flex-col items-center justify-center overflow-hidden border border-stone-800 text-center p-4">
          <div className="absolute inset-0 bg-[radial-gradient(#c82828_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />
          
          {/* Animated scanner frame */}
          <div className="relative w-32 h-32 rounded-xl border-2 border-red-500/80 flex items-center justify-center">
            <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-red-500" />
            <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-red-500" />
            <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-red-500" />
            <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-red-500" />
            <div className="w-full h-0.5 bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse" />
            <QrCode className="w-16 h-16 text-white/40 absolute" />
          </div>

          <p className="text-[11px] text-stone-400 mt-2 z-10">
            {simulatedScanned ? 'Table Verified!' : 'Point camera at Kok Sen table plaque'}
          </p>
        </div>

        {/* Manual Table Selector */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">
            Select Your Table Number:
          </label>
          <div className="grid grid-cols-6 gap-1.5 max-h-36 overflow-y-auto no-scrollbar p-1">
            {Array.from({ length: 18 }, (_, i) => i + 1).map((tableNum) => (
              <button
                key={tableNum}
                type="button"
                onClick={() => setSelectedTable(tableNum)}
                className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  selectedTable === tableNum
                    ? 'bg-red-600 text-white border-red-600 shadow-sm scale-105'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {tableNum}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleConfirm}
          className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          {simulatedScanned ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Seated at Table {selectedTable}!</span>
            </>
          ) : (
            <>
              <UtensilsCrossed className="w-4 h-4" />
              <span>Connect to Table {selectedTable}</span>
            </>
          )}
        </button>

        <p className="text-[11px] text-stone-500 text-center leading-tight">
          Food will be brought directly to Table {selectedTable}. Walk-ins & reservations supported.
        </p>
      </div>
    </div>
  );
}
