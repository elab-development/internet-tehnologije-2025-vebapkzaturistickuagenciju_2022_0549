export default function Footer() {
  return (
    <footer className="bg-purple-700 text-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* O nama */}
          <div>
            <h3 className="text-xl font-bold mb-3">TellyTravel</h3>
            <p className="text-purple-200 text-sm leading-relaxed">
              Vaš pouzdani partner za nezaboravna putovanja. Nudimo pažljivo odabrane aranžmane širom sveta po najboljim cenama.
            </p>
          </div>

          {/* Brzi linkovi */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Brzi linkovi</h3>
            <ul className="space-y-2 text-purple-200 text-sm">
              <li><a href="/" className="hover:text-white transition">Početna</a></li>
              <li><a href="/arrangements" className="hover:text-white transition">Aranžmani</a></li>
              <li><a href="/login" className="hover:text-white transition">Prijava</a></li>
              <li><a href="/register" className="hover:text-white transition">Registracija</a></li>
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Kontakt</h3>
            <ul className="space-y-2 text-purple-200 text-sm">
              <li>📧 info@tellytravel.rs</li>
              <li>📞 +381 11 123 4567</li>
              <li>📍 Bulevar Kralja Aleksandra 73, Beograd</li>
              <li>🕐 Pon - Pet: 09:00 - 17:00</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-purple-500 mt-8 pt-6 text-center text-purple-300 text-sm">
          © {new Date().getFullYear()} TellyTravel. Sva prava zadržana.
        </div>
      </div>
    </footer>
  )
}