import NavBar from '@/app/ui/NavBar';
import CatalogSkeleton from '@/app/ui/skeletons/CatalogSkeleton';

export default function Loading() {
  return (
    <main className="min-h-screen bg-background font-dm pb-20">
      <NavBar />
     
      <div className="h-12 w-full bg-gray-50 border-b border-[#3a3a3a]" />
      
      <CatalogSkeleton />
    </main>
  );
}