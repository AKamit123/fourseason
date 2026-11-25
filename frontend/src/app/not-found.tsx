import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E1A16] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white border border-[#E8E0D2] rounded-3xl p-8 text-center space-y-4 shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-[#B38E36] text-white font-serif font-bold text-xl flex items-center justify-center mx-auto">
          4S
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#1E1A16]">Page Not Found</h2>
        <p className="text-xs text-[#474036]">
          The page you are looking for could not be found in the Four Seasons Atelier.
        </p>
        <Link
          href="/"
          className="inline-block gold-gradient-btn px-6 py-2.5 rounded-xl text-xs font-bold text-white"
        >
          Return to Four Seasons
        </Link>
      </div>
    </div>
  );
}

