import Commitments from './Commitments';
import SavingsGoals from './SavingsGoals';
import Subscriptions from './Subscriptions';
import { Commitment, SavingsGoal, Subscription } from '../types';

export default function MoneyPlan({
  commitments,
  savingsGoals,
  subscriptions,
}: {
  commitments: Commitment[];
  savingsGoals: SavingsGoal[];
  subscriptions: Subscription[];
}) {
  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-2xl font-bold mb-6 text-white">Commitments</h2>
        <Commitments commitments={commitments} />
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-6 text-white">Savings Goals</h2>
        <SavingsGoals savingsGoals={savingsGoals} />
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-6 text-white">Subscriptions</h2>
        <Subscriptions subscriptions={subscriptions} />
      </section>
    </div>
  );
}
