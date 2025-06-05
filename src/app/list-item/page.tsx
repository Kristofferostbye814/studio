'use client';
import { ListItemForm } from '@/components/list-item/ListItemForm';
import { useSearchParams } from 'next/navigation';

export default function ListItemPage() {
  const searchParams = useSearchParams();
  const itemIdToEdit = searchParams.get('edit') || undefined;

  return (
    <div className="py-8">
      <ListItemForm itemIdToEdit={itemIdToEdit} />
    </div>
  );
}