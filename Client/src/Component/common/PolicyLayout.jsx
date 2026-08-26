// client/src/components/PolicyLayout.jsx
export default function PolicyLayout({ title, lastUpdated, children }) {
  return (
    <div className="min-h-screen bg-[#0d0e12] px-5 lg:px-16 py-10 pb-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl lg:text-2xl text-white font-light mb-2">{title}</h1>
        <p className="text-gray-500 text-xs mb-8">Last updated: {lastUpdated}</p>
        <div className="space-y-8 text-gray-300 text-sm leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}

export function PolicySection({ title, children }) {
  return (
    <section>
      <h2 className="text-[#D4A34E] text-base font-medium mb-3">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}