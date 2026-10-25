import './globals.css';

export const metadata = {
  title: 'Agent Launch Suite | Fetch.ai & BNB Chain AI Hub',
  description: 'Autonomous AI agent launchpad, real-time analytics, micropayments and agent tooling on BNB Chain.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* ነቲ ዘመናዊ ናይ Crypto ዲዛይን ዘብርህ መሳርሒ */}
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-[#0b0f19] text-gray-100 min-h-screen antialiased selection:bg-emerald-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}