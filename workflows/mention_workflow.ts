import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { HandleMentionFunction } from "../functions/handle_mention.ts";

/**
 * Workflow for processing mentions
 * Triggered by message events
 */
const MentionWorkflow = DefineWorkflow({
  callback_id: "mention_workflow",
  title: "Process User Mentions",
  description: "Detects user mentions and notifies the configured relayer",
  input_parameters: {
    properties: {
      message_ts: {
        type: Schema.types.string,
      },
      channel_id: {
        type: Schema.slack.types.channel_id,
      },
      user_id: {
        type: Schema.slack.types.user_id,
      },
      text: {
        type: Schema.types.string,
      },
    },
    required: ["message_ts", "channel_id", "user_id", "text"],
  },
});

// Process the message with the HandleMention function
MentionWorkflow.addStep(HandleMentionFunction, {
  message_ts: MentionWorkflow.inputs.message_ts,
  channel_id: MentionWorkflow.inputs.channel_id,
  mentioned_user_id: MentionWorkflow.inputs.user_id, // Using user_id as the mentioned user for now
  message_text: MentionWorkflow.inputs.text,
  sender_id: MentionWorkflow.inputs.user_id,
});

export default MentionWorkflow;
