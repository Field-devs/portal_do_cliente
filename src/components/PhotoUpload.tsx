import React, { useState, useRef } from 'react';
import { Upload, X, Camera } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PhotoUploadProps {
  currentPhotoUrl: string | null;
  onPhotoChange: (url: string | null) => void;
  userId: string;
}

export default function PhotoUpload({ currentPhotoUrl, onPhotoChange, userId }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      return 'Arquivo inválido. Use apenas JPG, PNG ou GIF.';
    }

    if (file.size > maxSize) {
      return 'Arquivo muito grande. Máximo de 5MB permitido.';
    }

    return null;
  };

  const validateDimensions = (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        if (img.width < 200 || img.height < 200) {
          resolve('Imagem muito pequena. Mínimo de 200x200px requerido.');
        }
        resolve(null);
      };
      img.onerror = () => resolve('Erro ao carregar imagem.');
    });
  };

  const optimizeImage = async (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;

        // Max dimensions
        const maxWidth = 800;
        const maxHeight = 800;

        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => resolve(blob!),
          'image/jpeg',
          0.8
        );
      };
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setError(null);
      setUploading(true);
      setUploadProgress(0);

      // Validate file
      const fileError = validateFile(file);
      if (fileError) {
        setError(fileError);
        return;
      }

      // Validate dimensions
      const dimensionError = await validateDimensions(file);
      if (dimensionError) {
        setError(dimensionError);
        return;
      }

      // Optimize image
      const optimizedImage = await optimizeImage(file);

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      // Delete old photo if exists
      if (currentPhotoUrl) {
        const oldPath = currentPhotoUrl.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('profiles')
            .remove([`${userId}/${oldPath}`]);
        }
      }

      // Upload new photo
      const { data, error } = await supabase.storage
        .from('profiles')
        .upload(fileName, optimizedImage, {
          upsert: true,
          onUploadProgress: (progress) => {
            setUploadProgress(Math.round((progress.loaded / progress.total) * 100));
          }
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(fileName);

      onPhotoChange(publicUrl);
    } catch (err) {
      console.error('Error uploading photo:', err);
      setError('Erro ao fazer upload da foto. Tente novamente.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemovePhoto = async () => {
    if (!currentPhotoUrl) return;

    try {
      setError(null);
      setUploading(true);

      const fileName = currentPhotoUrl.split('/').pop();
      if (!fileName) return;

      const { error } = await supabase.storage
        .from('profiles')
        .remove([`${userId}/${fileName}`]);

      if (error) throw error;

      onPhotoChange(null);
    } catch (err) {
      console.error('Error removing photo:', err);
      setError('Erro ao remover foto. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        {currentPhotoUrl ? (
          <>
            <img
              src={currentPhotoUrl}
              alt="Profile"
              className="h-32 w-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
            />
            <button
              onClick={handleRemovePhoto}
              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              title="Remover foto"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <div className="h-32 w-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <Camera className="h-12 w-12 text-gray-400 dark:text-gray-500" />
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
            <div className="text-white text-sm font-medium">
              {uploadProgress}%
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="flex items-center px-4 py-2 bg-brand hover:bg-brand/90 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Upload className="h-5 w-5 mr-2" />
        {currentPhotoUrl ? 'Alterar Foto' : 'Upload Foto'}
      </button>

      {error && (
        <p className="text-sm text-red-500 dark:text-red-400 text-center">
          {error}
        </p>
      )}

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        JPG, PNG ou GIF até 5MB. Mínimo 200x200px.
      </p>
    </div>
  );
}