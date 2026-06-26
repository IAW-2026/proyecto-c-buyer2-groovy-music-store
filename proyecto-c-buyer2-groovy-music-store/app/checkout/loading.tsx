import SimpleNavBar from '../ui/SimpleNavBar';
import CheckoutSkeleton from '../ui/skeletons/CheckoutSkeleton';

export default function Loading() {
  return (
    <main className="min-h-screen bg-background font-dm pb-20">
      <SimpleNavBar />
      <CheckoutSkeleton />
    </main>
  );
}