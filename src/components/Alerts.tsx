export default function Alerts({ spendableBalance, alertThreshold }: { spendableBalance: number, alertThreshold: number }) {
  if (spendableBalance > alertThreshold) return null;
  return (
    <div className="bg-card-bg border border-emerald/30 text-text-main p-4 rounded-xl mb-6 flex gap-4 items-center shadow-[0_0_10px_rgba(0,230,118,0.1)]">
      <div className="text-emerald text-2xl">⚠️</div>
      <div>
        <p className="font-bold">Low Balance Alert!</p>
        <p className="text-sm text-text-secondary">Your spendable balance (₹{spendableBalance.toFixed(0)}) is below your threshold of ₹{alertThreshold}.</p>
      </div>
    </div>
  );
}
