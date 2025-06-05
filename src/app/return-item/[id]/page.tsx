'use client';

import { ReturnProcessForm } from '@/components/return-item/ReturnProcessForm';
import { useParams } from 'next/navigation';

export default function ReturnItemPage() {
  const params = useParams();
  const itemId = params?.id as string; // Casting, consider more robust type checking if id can be array

  if (!itemId) {
    // Optional: Handle case where itemId is not present, e.g., show an error or redirect
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-destructive text-lg">Gjenstand-ID mangler i URL.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <ReturnProcessForm itemId={itemId} />
    </div>
  );
}
