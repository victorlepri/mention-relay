import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

/**
 * Define the function for handling mentions
 */
export const HandleMentionFunction = DefineFunction({
  callback_id: "handle_mention",
  title: "Handle User Mention",
  description: "Processes a mention and notifies the configured relayer",
  source_file: "functions/handle_mention.ts",
  input_parameters: {
    properties: {
      message_ts: {
        type: Schema.types.string,
        description: "Timestamp of the message",
      },
      channel_id: {
        type: Schema.slack.types.channel_id,
        description: "Channel where the message was posted",
      },
      mentioned_user_id: {
        type: Schema.types.string,
        description: "ID of the mentioned user",
      },
      message_text: {
        type: Schema.types.string,
        description: "Content of the message",
      },
      sender_id: {
        type: Schema.slack.types.user_id,
        description: "User who sent the message",
      },
    },
    required: [
      "message_ts",
      "channel_id",
      "mentioned_user_id",
      "message_text",
      "sender_id",
    ],
  },
  output_parameters: {
    properties: {
      relayed: {
        type: Schema.types.boolean,
        description: "Whether the mention was relayed",
      },
    },
    required: ["relayed"],
  },
});

/**
 * Implementation for handling user mentions
 */
export default SlackFunction(
  HandleMentionFunction,
  async ({ inputs, client }) => {
    const {
      message_ts,
      channel_id,
      mentioned_user_id,
      message_text,
      sender_id,
    } = inputs;
    console.log("Handling mention with inputs:", inputs);

    try {
      // Extract mentions from text to verify the mentioned user
      const mentionRegex = /<@([A-Z0-9]+)>/g;
      const mentions = [];
      let match;

      while ((match = mentionRegex.exec(message_text)) !== null) {
        mentions.push(match[1]);
      }

      // Get channel members
      const membersResponse = await client.conversations.members({
        channel: channel_id,
      });

      if (!membersResponse.ok) {
        console.log(`Error fetching channel members: ${membersResponse.error}`);
        return { outputs: { relayed: false } };
      }

      const channelMembers = membersResponse.members || [];

      // Query for relayers
      const relayersResult = await client.apps.datastore.query({
        datastore: "relayers",
        expression: "user_id = :user_id",
        expression_values: { ":user_id": mentioned_user_id },
      });

      if (
        !relayersResult.ok || !relayersResult.items ||
        relayersResult.items.length === 0
      ) {
        console.log(`No relayers found for user ${mentioned_user_id}`);
        return { outputs: { relayed: false } };
      }

      let relayed = false;

      // Send notifications to relayers
      for (const relayer of relayersResult.items) {
        // Verify relayer is in the channel
        if (!channelMembers.includes(relayer.relayer_id)) {
          continue;
        }

        // Skip if sender is the relayer
        if (sender_id === relayer.relayer_id) {
          continue;
        }

        // Send notification
        await client.chat.postMessage({
          channel: relayer.relayer_id,
          text:
            `<@${mentioned_user_id}> was mentioned in <#${channel_id}> by <@${sender_id}>.\nView the message: https://slack.com/archives/${channel_id}/p${
              message_ts.replace(".", "")
            }`,
          unfurl_links: false,
        });

        relayed = true;
      }

      return { outputs: { relayed } };
    } catch (error) {
      console.error(`Error handling mention: ${error}`);
      return { outputs: { relayed: false } };
    }
  },
);
