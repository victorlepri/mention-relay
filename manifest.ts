import { Manifest } from "deno-slack-sdk/mod.ts";
import RelayerDatastore from "./datastores/relayers.ts";
import MentionWorkflow from "./workflows/mention_workflow.ts";
import AssignRelayerWorkflow from "./workflows/assign_relayer_workflow.ts";
import { HandleMentionFunction } from "./functions/handle_mention.ts";
import { AssignRelayerFunction } from "./functions/assign_relayer.ts";

export default Manifest({
  name: "Mention Relay",
  description: "Relays mentions to designated users",
  icon: "assets/default_new_app_icon.png",
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public", // Added this required scope
    "datastore:read",
    "datastore:write",
    "channels:history",
    "groups:history",
    "im:history",
    "mpim:history",
    "channels:read",
    "groups:read",
  ],
  datastores: [RelayerDatastore],
  workflows: [MentionWorkflow, AssignRelayerWorkflow],
  functions: [HandleMentionFunction, AssignRelayerFunction],
  outgoingDomains: [],
});
