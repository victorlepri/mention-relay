import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { AssignRelayerFunction } from "../functions/assign_relayer.ts";

/**
 * Workflow for assigning a relayer
 */
const AssignRelayerWorkflow = DefineWorkflow({
  callback_id: "assign_relayer_workflow",
  title: "Assign a Relayer",
  description: "Assigns a user to relay mentions to another user",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      user_id: {
        type: Schema.slack.types.user_id,
        description: "User to be monitored for mentions (optional)",
      },
    },
    required: ["interactivity"],
  },
});

// First, open a form to collect user inputs
const formStep = AssignRelayerWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Assign a Mention Relayer",
    interactivity: AssignRelayerWorkflow.inputs.interactivity,
    submit_label: "Assign",
    fields: {
      elements: [
        {
          name: "user_id",
          title: "User to monitor",
          type: Schema.slack.types.user_id,
          default: AssignRelayerWorkflow.inputs.user_id,
          description: "Select a user whose mentions you want to relay",
        },
        {
          name: "relayer_id",
          title: "Relay mentions to",
          type: Schema.slack.types.user_id,
          description: "Select a user who will receive notifications",
        },
      ],
      required: ["user_id", "relayer_id"],
    },
  },
);

// Then assign the relayer
const assignStep = AssignRelayerWorkflow.addStep(
  AssignRelayerFunction,
  {
    user_id: formStep.outputs.fields.user_id,
    relayer_id: formStep.outputs.fields.relayer_id,
  },
);

// Instead of SendMessage, send a DM to the user who triggered the workflow
AssignRelayerWorkflow.addStep(
  Schema.slack.functions.SendDm,
  {
    user_id: AssignRelayerWorkflow.inputs.interactivity.interactor.id,
    message: assignStep.outputs.message,
  },
);

export default AssignRelayerWorkflow;
