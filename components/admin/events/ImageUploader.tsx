'use client';

import { useState } from 'react';
import { UploadCloud, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type ImageUploaderProps = {
  value?: string;
  onChange: (url: string) => void;
};

export default function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const maxBytes = 2 * 1024 * 1024;
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  const handleUpload = async (file: File) => {
    if (file.size > maxBytes) {
      toast.error('File too large. Max 2MB.');
      return;
    }
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Use JPG, PNG, or WEBP.');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data?.error || 'Upload failed');
        return;
      }
      if (data.url) onChange(data.url);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    if (value?.startsWith('/uploads/events/')) {
      await fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: value }),
      });
    }
    onChange('');
  };

  return (
    <div className="space-y-3">
      <div
        className={cn(
          'obsidian-surface flex min-h-[220px] items-center justify-center rounded-[26px] p-6 text-center transition-colors',
          value ? 'bg-[linear-gradient(180deg,rgba(53,53,52,0.26),rgba(14,14,14,0.9))]' : '',
          isDragging ? 'ring-1 ring-[#F2CA50]/60' : ''
        )}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          const file = event.dataTransfer.files?.[0];
          if (file) handleUpload(file);
        }}
      >
        {value ? (
          <div className="relative w-full">
            <img src={value} alt="Featured" className="h-44 w-full rounded-[22px] object-cover shadow-[0_20px_40px_rgba(0,0,0,0.5)]" />
            <button
              type="button"
              onClick={handleRemove}
              className="obsidian-ghost-button absolute right-3 top-3 rounded-full p-2"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-3 text-white/60">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(242,202,80,0.1)] text-[#F2CA50]">
              <UploadCloud className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-[#f4edd9]">Drag and drop a featured image</p>
              <p className="text-xs uppercase tracking-[0.22em] text-white/35">JPG, PNG or WEBP up to 2MB</p>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={isUploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
          }}
          className="obsidian-input w-full px-3 py-2 text-sm text-white/70 file:mr-4 file:rounded-full file:border-0 file:bg-[linear-gradient(135deg,#F2CA50_0%,#D4AF37_100%)] file:px-4 file:py-2 file:text-xs file:font-bold file:text-[#1a1710]"
        />
        <span className="text-xs uppercase tracking-[0.18em] text-white/40">{isUploading ? 'Uploading...' : 'Ready for upload'}</span>
      </div>
    </div>
  );
}
