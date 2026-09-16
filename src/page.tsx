import ExampleToDelete from "@/example-to-delete/new-proposal/my-page";
import { getTasks } from "@/example-to-delete/new-proposal/04-optimistic-tasks/server-functions/actions-demo";
import PureServerSlot from "@/example-to-delete/new-proposal/07-rsc-slots/components/pure-server-slot";

// Async Server Component: fetches initial tasks directly in Node.js
// and instantiates pure Server Component slots with zero client bundle overhead
export default async function Page() {
  const initialTasks = await getTasks();
  const serverSlot = <PureServerSlot />;
  return <ExampleToDelete initialTasks={initialTasks} serverSlot={serverSlot} />;
}

