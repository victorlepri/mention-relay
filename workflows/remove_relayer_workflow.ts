import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { RemoveRelayerFunction } from "../functions/remove_relayer.ts";

/**
 * Workflow for removing a relayer
 * Triggered by the /remove-relayer slash command
 */
const RemoveRelayerWorkflow = DefineWorkflow({
  callback_id: "remove_relayer_workflow",
  title: "Remove Mention Relayer",
  description: "Remove your currently assigned mention relayer",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      user_id: {
        type: Schema.slack.types.user_id,
      },
    },
    required: ["interactivity", "user_id"],
  },
});

// Step 1: Run the remove relayer function
const removeRelayerStep = RemoveRelayerWorkflow.addStep(
  RemoveRelayerFunction,
  {
    user_id: RemoveRelayerWorkflow.inputs.user_id,
  },
);

// Step 2: Send a message with the result
RemoveRelayerWorkflow.addStep(Schema.slack.functions.SendEphemeralMessage, {
  channel_id: RemoveRelayerWorkflow.inputs.interactivity.channel_id,
  user_id: RemoveRelayerWorkflow.inputs.user_id,
  message: removeRelayerStep.outputs.message,
});

export default RemoveRelayerWorkflow;
