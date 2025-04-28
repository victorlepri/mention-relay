import { SlackAPI as _SlackAPI } from "deno-slack-api/mod.ts";
import assignRelayerTrigger from "./assign_relayer_trigger.ts";
import removeRelayerTrigger from "./remove_relayer_trigger.ts";
import mentionEventTrigger from "./mention_event_trigger.ts";

/**
 * Utility to help the CLI create triggers
 * Exports a specific trigger based on the command argument
 */
const triggerNameArg = Deno.args[0];

// Print trigger list if no name is provided
if (!triggerNameArg) {
  console.log("Available triggers:");
  console.log("assign_relayer - Create the /assign-relayer command");
  console.log("remove_relayer - Create the /remove-relayer command");
  console.log("mention_event - Create the message event trigger for mentions");
  Deno.exit(1);
}

// Return the requested trigger
switch (triggerNameArg) {
  case "assign_relayer":
    console.log("Returning assign_relayer trigger");
    console.log(JSON.stringify(assignRelayerTrigger, null, 2));
    break;
  case "remove_relayer":
    console.log("Returning remove_relayer trigger");
    console.log(JSON.stringify(removeRelayerTrigger, null, 2));
    break;
  case "mention_event":
    console.log("Returning mention_event trigger");
    console.log(JSON.stringify(mentionEventTrigger, null, 2));
    break;
  default:
    console.log(`Trigger "${triggerNameArg}" not found`);
    Deno.exit(1);
}
