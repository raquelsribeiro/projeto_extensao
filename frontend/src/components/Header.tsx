// frontend/src/components/Header.tsx

export default function Header() {
  return (
    <header className="bg-dark-blue text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">🎫 Sistema de Chamados</h1>
          <p className="text-gray-300 text-sm">VT Innovation</p>
        </div>
      </div>
    </header>
  );
}
