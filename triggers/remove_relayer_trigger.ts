import { Trigger } from "https://deno.land/x/deno_slack_api@2.8.0/types.ts";
import { TriggerContextData, TriggerTypes } from "https://deno.land/x/deno_slack_api@2.8.0/mod.ts";
import RemoveRelayerWorkflow from "../workflows/remove_relayer_workflow.ts";

/**
 * Trigger for the /remove-relayer slash command
 */
const removeRelayerTrigger: Trigger<typeof RemoveRelayerWorkflow.definition> = {
  type: TriggerTypes.Shortcut,
  name: "Remove your mention relayer",
  description: "Remove your currently assigned mention relayer",
  workflow: "#/workflows/remove_relayer_workflow",
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
    user_id: {
      value: TriggerContextData.Shortcut.user_id,
    },
  },
};

export default removeRelayerTrigger;
