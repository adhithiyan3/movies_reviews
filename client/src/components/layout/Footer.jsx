export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-500 text-sm py-6 mt-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto text-center px-4">
        © {new Date().getFullYear()} <span className="font-semibold">CineNote</span> • Built with <span className="text-red-500">❤</span>
      </div>
    </footer>
  );
}
