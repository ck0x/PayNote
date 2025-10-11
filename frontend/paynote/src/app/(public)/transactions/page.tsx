// import TransactionsClient from "@/src/features/transactions/pages/TransactionsClient";
// import { envio } from "@/src/envio/client";
// import { gql } from "graphql-request";

// const Q = gql`
//   query PublicTxs($limit: Int = 100) {
//     transactions(first: $limit, orderBy: { ts: desc }) {
//       hash
//       from
//       to
//       value
//       ts
//     }
//   }
// `;

// export const revalidate = 30; // incremental static regen for public list

// export default async function Page() {
//   const data = await envio.request(Q, { limit: 100 }); // Server Component fetch
//   return <TransactionsClient initial={data.transactions} />;
// }
