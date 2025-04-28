import { Trigger } from "deno-slack-api/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";

/**
 * Trigger for /relay slash command
 */
const slashCommandTrigger: Trigger = {
  type: TriggerTypes.Shortcut,
  name: "Relay Command",
  description: "Slash command to set up mention relays",
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

export default slashCommandTrigger;
