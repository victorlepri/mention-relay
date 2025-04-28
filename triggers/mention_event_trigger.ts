import { Trigger } from "deno-slack-api/types.ts";
import { TriggerEventTypes, TriggerTypes } from "deno-slack-api/mod.ts";

/**
 * Trigger for message events to detect mentions
 */
const mentionEventTrigger: Trigger = {
  type: TriggerTypes.Event,
  name: "Detect mentions in messages",
  description: "Watches for user mentions in messages to relay notifications",
  workflow: "#/workflows/mention_workflow",
  event: {
    event_type: TriggerEventTypes.MessagePosted,
    all_resources: true, // Listen to all channels the app is in
    filter: {
      version: 1,
      root: {
        operator: "AND",
        inputs: [
          {
            statement: "true == true", // Simple statement that always evaluates to true
          },
        ],
      },
    },
  },
  inputs: {
    message_ts: {
      value: "{{data.message_ts}}",
    },
    channel_id: {
      value: "{{data.channel_id}}",
    },
    user_id: {
      value: "{{data.user_id}}",
    },
    text: {
      value: "{{data.text}}",
    },
  },
};

export default mentionEventTrigger;
