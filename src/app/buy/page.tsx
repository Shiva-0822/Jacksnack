
import Header from '@/components/buy/Header';
import Footer from '@/components/buy/Footer';
import Products from '@/components/buy/Products';

export default function BuyNowPage() {
  return (
    <div className="bg-white">
      <Header />
      <main>
        <div className="bg-cyan-300 text-center py-3">
          <p className="font-semibold text-black">Use code BOOK10 for 10% Discount</p>
        </div>
        <Products />
      </main>
      <Footer />
    </div>
  );
}
