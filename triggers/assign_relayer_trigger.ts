import { Trigger } from "https://deno.land/x/deno_slack_api@2.8.0/types.ts";
import {
  TriggerContextData,
  TriggerTypes,
} from "https://deno.land/x/deno_slack_api@2.8.0/mod.ts";
import AssignRelayerWorkflow from "../workflows/assign_relayer_workflow.ts";

/**
 * Trigger for the /assign-relayer slash command
 */
const assignRelayerTrigger: Trigger<typeof AssignRelayerWorkflow.definition> = {
  type: TriggerTypes.Shortcut,
  name: "Assign a relayer for mentions",
  description: "Assign a user who will be notified when you are mentioned",
  workflow: "#/workflows/assign_relayer_workflow",
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
    user_id: {
      value: TriggerContextData.Shortcut.user_id,
    },
  },
};

export default assignRelayerTrigger;
