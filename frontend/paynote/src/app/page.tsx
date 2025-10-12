import { WalletConnectButton } from "@/components/wallet/wallet-connect-button";
import { SocialLoginCTA } from "@/components/wallet/social-login";
import { CategoryFilter } from "@/components/filters/category-filter";

export default function Landing() {
  return (
    <main className="mx-auto max-w-5xl p-8 space-y-8">
      <section className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">PayNote</h1>
        <div className="flex gap-3">
          {/* <SocialLoginCTA /> */}
          <WalletConnectButton />
        </div>
      </section>

      <section className="rounded-2xl border p-6">
        <div className="flex items-center gap-4 mb-4">
          <CategoryFilter />
          {/* search input, date range, etc. */}
        </div>
        {/* Placeholder: list of public on-chain transactions */}
        <div className="text-sm text-muted-foreground">
          Public on-chain transactions will appear here. (Envio integration
          coming.)
        </div>
      </section>
    </main>
  );
}
