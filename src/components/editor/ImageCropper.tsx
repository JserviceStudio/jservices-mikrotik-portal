import React, { useState, useCallback } from 'react';
import Cropper, { Area, Point } from 'react-easy-crop';
import { X, Check, ZoomIn, ZoomOut,  } from 'lucide-react';

interface ImageCropperProps {
  image: string;
  onCropComplete: (croppedImage: string) => void;
  onCancel: () => void;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({ image, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropChange = (crop: Point) => setCrop(crop);
  const onZoomChange = (zoom: number) => setZoom(zoom);

  const onCropCompleteInternal = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<string> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return '';

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return canvas.toDataURL('image/png');
  };

  const handleDone = async () => {
    try {
      if (croppedAreaPixels) {
        const croppedImage = await getCroppedImg(image, croppedAreaPixels);
        onCropComplete(croppedImage);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl border border-white/10 flex flex-col h-[650px]">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900 uppercase italic">Rogner le <span className="text-blue-600">Logo</span></h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ajustez le cadrage pour un rendu parfait</p>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-2xl transition-all text-slate-400">
            <X size={24} />
          </button>
        </div>

        {/* Cropper Container */}
        <div className="relative flex-1 bg-slate-950">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={undefined} // Aspect libre pour les logos
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteInternal}
            onZoomChange={onZoomChange}
          />
        </div>

        {/* Controls */}
        <div className="p-8 space-y-6">
          <div className="flex items-center gap-4">
             <ZoomOut size={18} className="text-slate-400" />
             <input
               type="range"
               value={zoom}
               min={1}
               max={3}
               step={0.1}
               aria-labelledby="Zoom"
               onChange={(e) => setZoom(Number(e.target.value))}
               className="flex-1 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
             />
             <ZoomIn size={18} className="text-slate-400" />
          </div>

          <div className="flex gap-4">
             <button 
               onClick={onCancel}
               className="flex-1 py-4 px-6 border border-slate-200 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all active:scale-95"
             >
               Annuler
             </button>
             <button 
               onClick={handleDone}
               className="flex-1 py-4 px-6 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2"
             >
               <Check size={18} /> Valider le Rognage
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
