// src/components/layout/Footer.tsx
export default function Footer() {
  return (
    <footer className="mt-auto border-t bg-white py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Startup Blog. All rights reserved.</p>
          <div className="mt-2 flex justify-center gap-6">
            <a href="/privacy-policy" className="hover:text-gray-700 transition">
              Privacy Policy
            </a>
            <a href="/contact" className="hover:text-gray-700 transition">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}