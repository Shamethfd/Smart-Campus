const Footer = () => {
  return (
    <footer className="border-t border-slate-300 bg-slate-200/95 text-slate-700">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <p className="truncate text-[11px] font-semibold">
          © 2024 Smart Campus Operations System
        </p>
        <div className="flex items-center gap-3 text-[11px] font-semibold">
          <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
